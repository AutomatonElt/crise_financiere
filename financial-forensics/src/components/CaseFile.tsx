import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type CaseFileProps = {
  name: string;
  role: string;
  charges: string[];
  sentence: string;
  status: string;
  details?: string;
  startFrame?: number;
};

export const CaseFile: React.FC<CaseFileProps> = ({
  name,
  role,
  charges,
  sentence,
  status,
  details,
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const cardWidth = 900;
  const cardHeight = 620;
  const cardX = centerX - cardWidth / 2;
  const cardY = (height - cardHeight) / 2;

  // Card slide in
  const cardSlide = interpolate(frame, [startFrame, startFrame + 25], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const cardOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Header bar
  const headerOpacity = interpolate(frame, [startFrame + 20, startFrame + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Name
  const nameY = spring({ frame: frame - startFrame - 25, fps, config: { damping: 12 }, from: 20, to: 0 });
  const nameOpacity = interpolate(frame, [startFrame + 25, startFrame + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Role
  const roleOpacity = interpolate(frame, [startFrame + 35, startFrame + 48], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Charges appear staggered
  const chargeAppear = (i: number) => {
    const appearFrame = startFrame + 50 + i * 12;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const x = interpolate(frame, [appearFrame, appearFrame + 10], [-20, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
    return { opacity, x };
  };

  // Sentence stamp
  const stampFrame = startFrame + 50 + charges.length * 12 + 15;
  const stampScale = spring({ frame: frame - stampFrame, fps, config: { damping: 8, stiffness: 120 }, from: 0, to: 1 });
  const stampOpacity = interpolate(frame, [stampFrame, stampFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampRotate = interpolate(frame, [stampFrame, stampFrame + 8], [-15, -8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Status badge
  const statusFrame = stampFrame + 20;
  const statusOpacity = interpolate(frame, [statusFrame, statusFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Details
  const detailsOpacity = interpolate(frame, [statusFrame + 15, statusFrame + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isConvicted = status.toLowerCase().includes("convicted") || status.toLowerCase().includes("guilty") || status.toLowerCase().includes("sentenced");
  const stampColor = isConvicted ? theme.colors.red : theme.colors.gold;
  const stampBg = isConvicted ? theme.colors.redDim : theme.colors.goldDim;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.bg,
        position: "relative",
        fontFamily: theme.fonts.body,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Subtle grid background */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0, opacity: 0.15 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={(i * width) / 20} y1={0} x2={(i * width) / 20} y2={height} stroke={theme.colors.gridLine} strokeWidth={1} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(i * height) / 12} x2={width} y2={(i * height) / 12} stroke={theme.colors.gridLine} strokeWidth={1} />
        ))}
      </svg>

      {/* Card */}
      <div
        style={{
          position: "absolute",
          left: cardX,
          top: cardY + cardSlide,
          width: cardWidth,
          height: cardHeight,
          backgroundColor: theme.colors.bgAlt,
          borderRadius: 16,
          border: `2px solid ${theme.colors.grayDim}`,
          opacity: cardOpacity,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header bar */}
        <div
          style={{
            height: 60,
            backgroundColor: theme.colors.surface,
            display: "flex",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 30,
            opacity: headerOpacity,
            borderBottom: `1px solid ${theme.colors.grayDim}`,
          }}
        >
          <span style={{ fontSize: 18, color: theme.colors.gray, fontFamily: theme.fonts.mono, letterSpacing: 2 }}>
            CASE FILE — DEPT. OF JUSTICE
          </span>
          <span style={{ marginLeft: "auto", fontSize: 18, color: theme.colors.grayDim, fontFamily: theme.fonts.mono }}>
            SDNY
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: "40px 50px" }}>
          {/* Name */}
          <div
            style={{
              fontSize: theme.sizes.titleSmall,
              fontWeight: "bold",
              color: theme.colors.white,
              fontFamily: theme.fonts.heading,
              opacity: nameOpacity,
              transform: `translateY(${nameY}px)`,
            }}
          >
            {name}
          </div>

          {/* Role */}
          <div
            style={{
              fontSize: theme.sizes.bodySmall,
              color: theme.colors.gray,
              marginTop: 8,
              opacity: roleOpacity,
            }}
          >
            {role}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "100%",
              height: 1,
              backgroundColor: theme.colors.grayDim,
              marginTop: 30,
              marginBottom: 30,
              opacity: roleOpacity,
            }}
          />

          {/* Charges */}
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: theme.sizes.label, color: theme.colors.gold, fontWeight: "bold", marginBottom: 16, opacity: roleOpacity }}>
              CHARGES
            </div>
            {charges.map((charge, i) => {
              const { opacity, x } = chargeAppear(i);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                    opacity,
                    transform: `translateX(${x}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: stampColor,
                      marginRight: 14,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: theme.sizes.bodySmall, color: theme.colors.white }}>
                    {charge}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Sentence stamp */}
          <div
            style={{
              display: "inline-block",
              padding: "12px 28px",
              border: `3px solid ${stampColor}`,
              borderRadius: 8,
              backgroundColor: stampBg,
              color: stampColor,
              fontSize: theme.sizes.bodySmall,
              fontWeight: "bold",
              fontFamily: theme.fonts.heading,
              letterSpacing: 1,
              opacity: stampOpacity,
              transform: `scale(${stampScale}) rotate(${stampRotate}deg)`,
              marginBottom: 20,
            }}
          >
            {sentence}
          </div>

          {/* Status badge */}
          <div
            style={{
              display: "inline-block",
              marginLeft: 16,
              padding: "8px 20px",
              borderRadius: 20,
              backgroundColor: theme.colors.surface,
              border: `1px solid ${stampColor}`,
              color: stampColor,
              fontSize: theme.sizes.caption,
              fontWeight: "bold",
              opacity: statusOpacity,
            }}
          >
            {status}
          </div>

          {/* Details */}
          {details && (
            <div
              style={{
                marginTop: 24,
                fontSize: theme.sizes.caption,
                color: theme.colors.gray,
                lineHeight: 1.6,
                opacity: detailsOpacity,
              }}
            >
              {details}
            </div>
          )}
        </div>

        {/* Corner accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 120,
            height: 120,
            borderTop: `2px solid ${theme.colors.grayDim}`,
            borderLeft: `2px solid ${theme.colors.grayDim}`,
            borderBottomRightRadius: 16,
          }}
        />
      </div>
    </div>
  );
};
