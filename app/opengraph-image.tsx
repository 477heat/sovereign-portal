import { ImageResponse } from "next/og";

export const alt = "Sovereign Engine Genesis Access preview";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "linear-gradient(135deg, #02070b 0%, #061720 44%, #02070b 100%)",
          color: "#ecfeff",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          padding: 56,
          width: "100%",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(103, 232, 249, 0.58)",
            boxShadow: "0 0 70px rgba(34, 211, 238, 0.18)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: 42,
            position: "relative",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "#fef08a",
              display: "flex",
              fontSize: 22,
              fontWeight: 800,
              justifyContent: "space-between",
              letterSpacing: 8,
              textTransform: "uppercase",
            }}
          >
            <span>Sovereign Engine</span>
            <span>Base Native</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                color: "#ecfeff",
                fontSize: 78,
                fontWeight: 900,
                letterSpacing: 10,
                lineHeight: 0.98,
                textTransform: "uppercase",
              }}
            >
              Genesis Access
            </div>
            <div
              style={{
                color: "rgba(236, 254, 255, 0.76)",
                fontSize: 31,
                lineHeight: 1.28,
                maxWidth: 850,
              }}
            >
              A Soul Deed for real participants, built for future Engine-driven
              Progeny creations.
            </div>
          </div>
          <div
            style={{
              color: "rgba(103, 232, 249, 0.86)",
              display: "flex",
              fontSize: 22,
              fontWeight: 700,
              gap: 24,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            <span>One Genesis Mint</span>
            <span>|</span>
            <span>Collectible</span>
            <span>|</span>
            <span>Game Native</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
