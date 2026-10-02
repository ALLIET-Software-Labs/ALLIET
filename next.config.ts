import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Built from what the site actually loads:
// - Next.js scripts/styles from 'self'; the App Router also emits inline bootstrap scripts, and
//   components use inline style attributes, hence 'unsafe-inline' (nonces would force every
//   page to render dynamically — see node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
// - next/font self-hosts Inter under /_next/static, so fonts come from 'self'.
// - Cal.com: embed.js is loaded from app.cal.com, the booking UI is an app.cal.com iframe,
//   and the embed's injected CSS references the Cal Sans font on cal.com.
// - The contact form posts to /api/contact (same origin).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://app.cal.com${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' https://cal.com",
  "connect-src 'self' https://app.cal.com",
  "frame-src https://app.cal.com https://cal.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF is typically noticeably smaller than WebP for these photographic visuals;
    // browsers without AVIF support get WebP.
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      {
        // Legacy alias that served a duplicate of the Software Engineering page.
        source: "/services/enterprise-engineering",
        destination: "/services/software-engineering",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // Next.js/Vercel serves .ico files as image/vnd.microsoft.icon by default.
        // Explicitly setting image/x-icon improves compatibility with search-engine
        // favicon crawlers (Google, Brave) that validate the Content-Type header.
        source: "/favicon.ico",
        headers: [
          {
            key: "Content-Type",
            value: "image/x-icon",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // The legacy XSS auditor is removed from modern browsers and could be abused in old
            // ones; "0" explicitly disables it. CSP is the real protection.
            key: "X-XSS-Protection",
            value: "0",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            // The site uses none of these features, and the Cal.com iframe isn't granted any.
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
