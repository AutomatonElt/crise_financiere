import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type StatCounterProps = {
  targetValue: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  sublabel?: string;
  decimals?: number;
  startFrame?: number;
};

export const StatCounter: React.FC<StatCounterProps> = ({
  targetValue,
  prefix = "",
  suffix = "",
  label,
  sublabel,
  decimals = 0,
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Counter animation
  const counterProgress = interpolate(
    frame,
    [startFrame + 10, startFrame + 80],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  const currentValue = targetValue * counterProgress;
  const displayValue = decimals > 0
    ? currentValue.toFixed(decimals)
    : Math.floor(currentValue).toLocaleString();

  // Label appear
  const labelOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = spring({ frame, fps, config: { damping: 15 }, from: -20, to: 0 });

  // Number scale pop when reaching target
  const popFrame = startFrame + 80;
  const popScale = spring({ frame: frame - popFrame, fps, config: { damping: 8, stiffness: 100 }, from: 1, to: 1.08 });
  const popBack = spring({ frame: frame - popFrame - 10, fps, config: { damping: 12 }, from: 1.08, to: 1 });
  const numberScale = Math.min(popScale, popBack);

  // Glow intensity increases as counter approaches target
  const glowIntensity = interpolate(frame, [startFrame + 60, popFrame], [0.3, 0.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Sublabel
  const sublabelOpacity = interpolate(frame, [popFrame + 10, popFrame + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Underline
  const underlineWidth = interpolate(frame, [popFrame, popFrame + 20], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.bg,
        position: "relative",
        fontFamily: theme.fonts.body,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle radial glow behind number */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.colors.gold}15 0%, transparent 60%)`,
          opacity: glowIntensity,
        }}
      />

      {/* Label */}
      {label && (
        <div
          style={{
            fontSize: theme.sizes.bodySmall,
            color: theme.colors.gray,
            textTransform: "uppercase",
            letterSpacing: 4,
            marginBottom: 30,
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
          }}
        >
          {label}
        </div>
      )}

      {/* Counter number */}
      <div
        style={{
          fontSize: 160,
          fontWeight: "bold",
          color: theme.colors.gold,
          fontFamily: theme.fonts.heading,
          transform: `scale(${numberScale})`,
          textShadow: `0 0 ${30 * glowIntensity}px ${theme.colors.gold}80`,
          position: "relative",
          zIndex: 1,
        }}
      >
        {prefix}{displayValue}{suffix}
      </div>

      {/* Underline */}
      <div
        style={{
          width: underlineWidth,
          height: 3,
          backgroundColor: theme.colors.gold,
          marginTop: 20,
          opacity: glowIntensity,
        }}
      />

      {/* Sublabel */}
      {sublabel && (
        <div
          style={{
            fontSize: theme.sizes.bodySmall,
            color: theme.colors.white,
            marginTop: 30,
            opacity: sublabelOpacity,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
};
