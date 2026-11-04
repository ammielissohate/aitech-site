import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

/** Image de partage (Open Graph) générée au build : 1200 × 630. */
export const alt = `${siteConfig.name} — ${siteConfig.category}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "radial-gradient(circle at 85% 20%, rgba(124,58,237,0.55), transparent 55%), #09090F",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 44, fontWeight: 700, letterSpacing: -2 }}>
          <span style={{ color: "#A78BFA" }}>Ai</span>
          <span>Tech</span>
          <span style={{ width: 14, height: 14, borderRadius: 14, background: "#7C3AED", marginLeft: 6, marginTop: 14 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>Votre image mérite mieux.</div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3, color: "#A78BFA" }}>
            Votre croissance aussi.
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#A1A1AA", letterSpacing: 6, textTransform: "uppercase" }}>
          {siteConfig.category} · Brand · Visibility · Growth
        </div>
      </div>
    ),
    { ...size },
  );
}
