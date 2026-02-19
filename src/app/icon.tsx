import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// This runs on the server/edge. Do NOT import client components here.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "64px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "18px",
          background: "linear-gradient(135deg, #2563EB 0%, #A855F7 100%)",
          position: "relative",
        }}
      >
        {/* White bookmark glyph */}
        <div
          style={{
            width: "26px",
            height: "30px",
            borderRadius: "6px",
            border: "3px solid rgba(255,255,255,0.95)",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          {/* notch */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "-1px",
              transform: "translateX(-50%)",
              width: "12px",
              height: "10px",
              background: "linear-gradient(135deg, #2563EB 0%, #A855F7 100%)",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 64,
      height: 64,
    }
  );
}
