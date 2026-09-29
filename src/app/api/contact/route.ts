import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Basic in-memory rate limiting. On Vercel this state is per function instance and is lost on
// cold starts, so it only slows down simple scripts. Real flood protection belongs in a
// Vercel Firewall rate-limit rule in front of /api/contact.
const rateLimit = new Map<string, { count: number, timestamp: number }>();
const LIMIT = 5; // max 5 requests per IP
const WINDOW_MS = 60 * 1000; // per minute
const MAX_TRACKED_IPS = 5000; // bound memory if many distinct IPs hit one instance

// Upper bound on sends per instance, whatever the IP, to cap Resend quota burn from
// distributed abuse. Generous for a contact form.
const GLOBAL_LIMIT = 30;
const GLOBAL_WINDOW_MS = 60 * 60 * 1000;
let globalWindow = { count: 0, timestamp: 0 };

const MAX_BODY_BYTES = 10_000; // 3000-char message plus fields fits comfortably
const MAX_MESSAGE_LENGTH = 3000;
const MAX_CATEGORY_LENGTH = 100;

// Pragmatic address check: one @, no whitespace, a dot in the domain.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// C0/C1 control characters, plus Unicode bidi overrides/isolates that can visually spoof text.
const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/;
const CONTROL_CHARS_GLOBAL = new RegExp(CONTROL_CHARS.source, 'g');
// Same, but keeping tab and newlines for the message body.
const CONTROL_CHARS_EXCEPT_WHITESPACE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u202A-\u202E\u2066-\u2069]/g;

const tooManyRequests = () =>
  NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });

function getClientIp(req: Request) {
  // On Vercel, x-forwarded-for is set by the platform (client-supplied values are not trusted),
  // and x-real-ip carries the same address. Take the first entry only.
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip')?.trim() || 'anonymous';
}

function isSameOrigin(req: Request) {
  const origin = req.headers.get('origin');
  // Non-browser clients may omit Origin; they are still subject to the limits below.
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // 0. Only accept same-origin JSON. This forces cross-site browser requests through a CORS
    // preflight (which fails), so other sites can't use their visitors to post to this form.
    if (!isSameOrigin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!req.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }
    const declaredLength = Number(req.headers.get('content-length') ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }

    // 1. Rate Limiting
    const ip = getClientIp(req);
    const now = Date.now();
    const windowStart = now - WINDOW_MS;

    // Periodic cleanup of old entries
    if (Math.random() < 0.1 || rateLimit.size > MAX_TRACKED_IPS) {
       for (const [key, value] of Array.from(rateLimit.entries())) {
           if (value.timestamp < windowStart) rateLimit.delete(key);
       }
    }

    const currentRate = rateLimit.get(ip);
    if (currentRate && currentRate.timestamp > windowStart) {
       if (currentRate.count >= LIMIT) {
           return tooManyRequests();
       }
       rateLimit.set(ip, { count: currentRate.count + 1, timestamp: currentRate.timestamp });
    } else {
       if (rateLimit.size >= MAX_TRACKED_IPS) return tooManyRequests();
       rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // Read the body ourselves so the size cap also applies when Content-Length is absent.
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'Request too large' }, { status: 413 });
    }
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }
    const { category, email, message, _honeypot } = body as Record<string, unknown>;

    // 2. Spam Protection (Honeypot)
    if (_honeypot) {
       // Silently drop it with the same response a real submission gets, so bots can't tell
       return NextResponse.json({ success: true });
    }

    // 3. Strict Input Validation
    const safeEmail = typeof email === 'string' ? email.trim() : '';
    if (!safeEmail || safeEmail.length > 254 || CONTROL_CHARS.test(safeEmail) || !EMAIL_PATTERN.test(safeEmail)) {
      return NextResponse.json({ error: 'Invalid email address provided.' }, { status: 400 });
    }

    const safeMessage = typeof message === 'string'
      ? message.replace(CONTROL_CHARS_EXCEPT_WHITESPACE, '').trim()
      : '';
    if (!safeMessage || safeMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message is required and must be under 3000 characters.' }, { status: 400 });
    }

    // Category ends up in the subject line, so strip anything that could break or spoof a header.
    const safeCategory = (typeof category === 'string' ? category.replace(CONTROL_CHARS_GLOBAL, ' ').trim() : '')
      .substring(0, MAX_CATEGORY_LENGTH) || 'General';

    // 4. Per-instance ceiling on actual sends (only valid submissions count)
    if (now - globalWindow.timestamp > GLOBAL_WINDOW_MS) {
      globalWindow = { count: 0, timestamp: now };
    }
    if (globalWindow.count >= GLOBAL_LIMIT) {
      return tooManyRequests();
    }
    globalWindow.count++;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Contact Form Error: RESEND_API_KEY is not configured");
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: 'ALLIET Website <softwarelabs@alliet.company>', // Cannot be the client's email due to anti-spam laws
      to: ['contact@alliet.company'],
      replyTo: safeEmail, // This makes it so hitting "Reply" emails the client
      subject: `New Project Inquiry: ${safeCategory}`,
      text: `You have received a new inquiry from the ALLIET website.\n\nSender Email: ${safeEmail}\nProject Category: ${safeCategory}\n\nMessage:\n${safeMessage}`,
    });

    if (error) {
      // Log provider details server-side only; never return them to the client.
      console.error("Resend API Error:", error.name, error.message);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact Form Error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
