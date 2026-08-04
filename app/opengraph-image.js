import { ImageResponse } from "next/og";

export const alt =
  "Psicóloga Mayumi Kitahara, psicoterapia psicoanalítica en CDMX y en línea";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f1e8",
        color: "#27322e",
        padding: "72px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "3px solid #789184",
          borderRadius: "36px",
          padding: "64px",
          background: "#fffaf2",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#6e7e75" }}>
          Psicoterapia psicoanalítica
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", fontSize: 68, lineHeight: 1.08 }}>
            Psicóloga Mayumi Kitahara
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#475b52" }}>
            Atención en CDMX y en línea
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 25, color: "#8b5e52" }}>
          psicologamayumikitahara.com
        </div>
      </div>
    </div>,
    size,
  );
}
