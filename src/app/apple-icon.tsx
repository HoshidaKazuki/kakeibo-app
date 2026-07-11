import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(165deg, #f8efe2 0%, #f2e6d5 100%)",
          color: "#c5522f",
          fontSize: 92,
          fontWeight: 700,
        }}
      >
        🐷
      </div>
    ),
    {
      ...size,
    },
  );
}
