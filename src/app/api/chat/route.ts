import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { ALLIET_KNOWLEDGE } from '@/lib/knowledge';

// Nothing here is cacheable; every request is a fresh model call.
export const dynamic = 'force-dynamic';

const MODEL = 'openai/gpt-oss-120b';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_TIMEOUT_MS = 20_000;

// --- Limits ----------------------------------------------------------------
// The Groq org currently runs on the on-demand tier (8,000 tokens/minute shared by the whole
// site, ~1.2k tokens per request), so limits are sized to keep one visitor from exhausting it.
// In-memory state is per function instance and resets on cold starts; a Vercel Firewall
// rate-limit rule on /api/chat is the real flood protection.
const PER_IP_LIMIT = 6;                 // requests per IP per window
const PER_IP_WINDOW_MS = 60_000;
const GLOBAL_LIMIT = 5;                 // requests per instance per window (~ Groq TPM budget)
const GLOBAL_WINDOW_MS = 60_000;
const MAX_TRACKED_IPS = 5000;

const MAX_BODY_BYTES = 16_000;
const MAX_MESSAGES = 8;                 // conversation turns forwarded to the model
const MAX_USER_CHARS = 1000;
const MAX_ASSISTANT_CHARS = 2500;

const ipHits = new Map<string, { count: number; timestamp: number }>();
let globalWindow = { count: 0, timestamp: 0 };

// C0/C1 controls (except tab/newline) and bidi overrides/isolates.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/g;

const FALLBACK_ERROR = 'Sorry, the ALLIET assistant is temporarily unavailable. Please email contact@alliet.company.';
const BUSY_ERROR = 'The assistant is busy right now. Please try again in a minute, or email contact@alliet.company.';
const REFUSAL = "I'm the ALLIET assistant, so I can help with questions about ALLIET Software Labs, our work, services and products.";

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

function getClientIp(req: Request) {
  // On Vercel, x-forwarded-for is overwritten by the platform with the client IP.
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip')?.trim() || 'anonymous';
}

function isSameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin) return true; // non-browser clients; still subject to every other limit
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

function takeRateLimit(ip: string, now: number) {
  if (Math.random() < 0.1 || ipHits.size > MAX_TRACKED_IPS) {
    for (const [key, value] of Array.from(ipHits.entries())) {
      if (value.timestamp < now - PER_IP_WINDOW_MS) ipHits.delete(key);
    }
  }
  const current = ipHits.get(ip);
  if (current && current.timestamp > now - PER_IP_WINDOW_MS) {
    if (current.count >= PER_IP_LIMIT) return false;
    current.count++;
  } else {
    if (ipHits.size >= MAX_TRACKED_IPS) return false;
    ipHits.set(ip, { count: 1, timestamp: now });
  }
  return true;
}

function takeGlobalBudget(now: number) {
  if (now - globalWindow.timestamp > GLOBAL_WINDOW_MS) globalWindow = { count: 0, timestamp: now };
  if (globalWindow.count >= GLOBAL_LIMIT) return false;
  globalWindow.count++;
  return true;
}

// Assistant turns are signed when we produce them. The client sends history back with each
// request; unsigned or altered "assistant" turns are dropped, so a caller can't put words in
// the assistant's mouth (a common jailbreak). The key is derived from the server-only API key.
function signingKey(apiKey: string) {
  return createHmac('sha256', apiKey).update('alliet-chat-history-v1').digest();
}
function sign(key: Buffer, content: string) {
  return createHmac('sha256', key).update(content).digest('base64url');
}
function verify(key: Buffer, content: string, sig: unknown) {
  if (typeof sig !== 'string') return false;
  const expected = Buffer.from(sign(key, content));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

// Last line of defence: never return text that looks like our instructions or a credential.
const LEAK_MARKERS = ['GUARDRAILS', 'IDENTITY AND PURPOSE', 'SECURITY RULES', 'gsk_'];
function looksLikeLeak(text: string) {
  return LEAK_MARKERS.some((m) => text.includes(m));
}

function parseMessages(raw: unknown, key: Buffer): ChatMessage[] | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const list = (raw as { messages?: unknown }).messages;
  if (!Array.isArray(list) || list.length === 0 || list.length > 50) return null;

  const out: ChatMessage[] = [];
  for (const item of list.slice(-MAX_MESSAGES)) {
    if (!item || typeof item !== 'object') return null;
    const { role, content, sig } = item as { role?: unknown; content?: unknown; sig?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;

    const clean = content.replace(CONTROL_CHARS, '').trim();
    if (!clean) continue;
    if (role === 'user') {
      if (clean.length > MAX_USER_CHARS) return null;
      out.push({ role, content: clean });
    } else if (content.length <= MAX_ASSISTANT_CHARS && verify(key, content, sig)) {
      out.push({ role, content });
    }
    // Unsigned assistant turns (including the UI's static greeting) are silently dropped.
  }
  if (out.length === 0 || out[out.length - 1].role !== 'user') return null;
  return out;
}

export async function POST(req: Request) {
  try {
    if (!isSameOrigin(req)) return json({ error: 'Forbidden' }, 403);
    if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return json({ error: 'Unsupported content type' }, 415);
    }
    if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
      return json({ error: 'Request too large' }, 413);
    }

    const now = Date.now();
    if (!takeRateLimit(getClientIp(req), now)) {
      return json({ error: 'Too many messages. Please wait a moment and try again.' }, 429, { 'Retry-After': '60' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('Chat API: GROQ_API_KEY is not set');
      return json({ error: FALLBACK_ERROR }, 503);
    }
    const key = signingKey(apiKey);

    const rawBody = await req.text();
    if (rawBody.length > MAX_BODY_BYTES) return json({ error: 'Request too large' }, 413);
    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return json({ error: 'Invalid request format.' }, 400);
    }
    const messages = parseMessages(parsed, key);
    if (!messages) return json({ error: 'Invalid request format.' }, 400);

    // Only valid requests spend the shared model budget.
    if (!takeGlobalBudget(now)) return json({ error: BUSY_ERROR }, 429, { 'Retry-After': '30' });

    const response = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: ALLIET_KNOWLEDGE }, ...messages],
        temperature: 0.3,
        max_completion_tokens: 700, // includes the model's (hidden) reasoning
        reasoning_effort: 'low',
        include_reasoning: false,
      }),
      signal: AbortSignal.timeout(GROQ_TIMEOUT_MS),
    });

    if (!response.ok) {
      // Log status only; provider error bodies can include account identifiers.
      console.error('Chat API: Groq returned', response.status);
      return response.status === 429
        ? json({ error: BUSY_ERROR }, 429, { 'Retry-After': '30' })
        : json({ error: FALLBACK_ERROR }, 502);
    }

    const data = await response.json();
    let reply: string = typeof data?.choices?.[0]?.message?.content === 'string' ? data.choices[0].message.content.trim() : '';
    if (!reply) {
      reply = "Sorry, I couldn't put an answer together for that. Could you rephrase it, or email contact@alliet.company?";
    } else if (looksLikeLeak(reply)) {
      reply = REFUSAL;
    }
    reply = reply.slice(0, MAX_ASSISTANT_CHARS);

    return json({ message: reply, sig: sign(key, reply) });
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
    console.error('Chat API error:', timedOut ? 'Groq request timed out' : error instanceof Error ? error.message : 'unknown');
    return json({ error: FALLBACK_ERROR }, timedOut ? 504 : 500);
  }
}
