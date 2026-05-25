// app/opengraph-image.tsx

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "AM Calorie Calculator by Alexandru Mihai";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          color: "#f5f5f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div
              style={{
                color: "#34d399",
                fontSize: "28px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              AM Calorie Calculator
            </div>

            <div
              style={{
                maxWidth: "760px",
                fontSize: "72px",
                lineHeight: "1.02",
                fontWeight: 700,
                letterSpacing: "-0.05em",
              }}
            >
              BMR, TDEE, calorii si macro-uri
            </div>
          </div>

          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "32px",
              border: "1px solid rgba(52, 211, 153, 0.35)",
              background: "rgba(16, 185, 129, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#34d399",
              fontSize: "42px",
              fontWeight: 700,
            }}
          >
            AM
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "32px",
          }}
        >
          <div
            style={{
              maxWidth: "720px",
              fontSize: "30px",
              lineHeight: "1.35",
              color: "#d4d4d4",
            }}
          >
            Estimari realiste pentru BMR, TDEE, activitate, antrenamente,
            hidratare si obiectiv.
          </div>

          <div
            style={{
              fontSize: "26px",
              color: "#a3a3a3",
            }}
          >
            by Alexandru Mihai
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}