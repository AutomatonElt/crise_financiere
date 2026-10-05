import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../../theme";

export const FTXFounderIntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 50], [1, 1.12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(frame, [35, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 28%, rgba(84,138,255,0.18), transparent 26%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 700,
            height: 700,
            transform: `scale(${zoom})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 32,
              background:
                "linear-gradient(180deg, rgba(11,16,25,0.25) 0%, rgba(11,16,25,0.7) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 0,
              width: 300,
              height: 440,
              transform: "translateX(-50%)",
              borderRadius: "44% 44% 18% 18%",
              background: "linear-gradient(180deg, rgba(12,16,22,0.7), rgba(2,4,8,0.9))",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: 280,
              width: 170,
              height: 170,
              transform: "translateX(-50%)",
              borderRadius: "50%",
              background: "rgba(12,16,22,0.9)",
              boxShadow: "0 0 18px rgba(74,158,255,0.2)",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 50% 18%, rgba(255,255,255,0.15), transparent 18%)",
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          textAlign: "center",
          color: theme.colors.white,
          fontSize: 100,
          fontWeight: 900,
          fontFamily: theme.fonts.heading,
          letterSpacing: 2,
          opacity: textOpacity,
        }}
      >
        FTX
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 120,
          textAlign: "center",
          color: theme.colors.gray,
          fontSize: 42,
          letterSpacing: 8,
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: textOpacity,
        }}
      >
        Nine Days To Zero
      </div>
    </AbsoluteFill>
  );
};
