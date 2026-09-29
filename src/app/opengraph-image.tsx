import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Site-wide share image, generated at build time from the official logo (public/alliet-logo.png),
// the site's tagline and palette (DESIGN.md). Case studies override it with their project visual.
export const alt = "ALLIET Software Labs — Ideas to Intelligent Products.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Official transparent logo (1429×372); navy/blue artwork reads clearly on the off-white background.
  const logo = await readFile(join(process.cwd(), "public", "alliet-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#F9FAFB",
          color: "#0F1115",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og renders plain <img> */}
        <img src={logoSrc} alt="" width={277} height={72} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>Ideas to</div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", color: "#4B5563" }}>Intelligent</div>
          <div style={{ fontSize: 88, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>Products.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E5E7EB", paddingTop: 28 }}>
          <div style={{ fontSize: 26, color: "#4B5563", letterSpacing: "0.12em" }}>AI • SOFTWARE • AUTOMATION</div>
          <div style={{ fontSize: 26, color: "#1D4ED8" }}>alliet.company</div>
        </div>
      </div>
    ),
    size
  );
}
