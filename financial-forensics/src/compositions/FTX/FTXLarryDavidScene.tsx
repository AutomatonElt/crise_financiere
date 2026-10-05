import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { theme } from "../../theme";

export const FTXLarryDavidScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bar = interpolate(frame, [12, 42], [0, 520], {
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
          background:
            "radial-gradient(circle at 50% 35%, rgba(212,175,55,0.12), transparent 26%), radial-gradient(circle at 50% 62%, rgba(74,158,255,0.08), transparent 30%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          opacity: 0.32,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 30,
          letterSpacing: 8,
          color: theme.colors.gray,
          textTransform: "uppercase",
          fontWeight: 700,
          opacity: headlineOpacity,
        }}
      >
        Super Bowl 2022
      </div>

      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: headlineOpacity,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: theme.colors.white,
            fontFamily: theme.fonts.heading,
            letterSpacing: -2,
            lineHeight: 1,
          }}
        >
          Larry David
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 430,
          transform: "translateX(-50%)",
          width: bar,
          height: 5,
          borderRadius: 999,
          background: `linear-gradient(90deg, ${theme.colors.gold}, ${theme.colors.red})`,
          boxShadow: "0 0 24px rgba(212,175,55,0.65)",
          opacity: headlineOpacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 200,
          textAlign: "center",
          fontSize: 52,
          fontWeight: 800,
          color: theme.colors.white,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: headlineOpacity,
        }}
      >
        Don&apos;t miss out on FTX
      </div>
    </AbsoluteFill>
  );
};
