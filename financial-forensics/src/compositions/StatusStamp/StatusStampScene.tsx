import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface StatusStampProps {
  text?: string;
  subText?: string;
  color?: "red" | "gold" | "green" | "cyan";
  rotation?: number;
  impactFrame?: number;
  size?: "small" | "medium" | "large";
  isOverlay?: boolean;
}

export const StatusStampScene: React.FC<StatusStampProps> = ({
  text = "ARRESTED",
  subText = "25 OCT 2017 // SDNY",
  color = "red",
  rotation = -12,
  impactFrame = 10,
  size = "medium",
  isOverlay = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Palette de couleurs de tampons d'enquête
  const colorMap = {
    red: { primary: "#DC2626", border: "#EF4444", glow: "rgba(239, 68, 68, 0.4)" },
    gold: { primary: "#D97706", border: "#F59E0B", glow: "rgba(245, 158, 11, 0.4)" },
    green: { primary: "#059669", border: "#10B981", glow: "rgba(16, 185, 129, 0.4)" },
    cyan: { primary: "#0284C7", border: "#38BDF8", glow: "rgba(56, 189, 248, 0.4)" },
  };

  const selectedColor = colorMap[color] || colorMap.red;

  // 1. Physique de l'impact : le tampon arrive de très grand (2.6x) et s'écrase violemment
  const stampSpring = spring({
    frame: frame - impactFrame,
    fps,
    config: {
      damping: 10,     // Léger rebond élastique d'encrage franc
      stiffness: 220,  // Slam ultra-nerveux
      mass: 0.8,
    },
  });

  const scale = interpolate(stampSpring, [0, 1], [2.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(stampSpring, [0, 0.3, 1], [0, 0.9, 1]);

  // 2. Onde de choc circulaire au moment exact de l'impact
  const shockwaveProgress = interpolate(
    frame - impactFrame,
    [0, 14],
    [0.7, 2.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const shockwaveOpacity = interpolate(
    frame - impactFrame,
    [0, 2, 14],
    [0, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 3. Micro-vibration de la caméra lors de la frappe du tampon
  const isImpact = frame >= impactFrame && frame <= impactFrame + 4;
  const shakeX = isImpact ? (frame % 2 === 0 ? 3 : -3) : 0;
  const shakeY = isImpact ? (frame % 2 === 0 ? -2 : 2) : 0;

  // Fondu de sortie cinéma en fin de clip
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const sizeMultiplier = size === "small" ? 0.75 : size === "large" ? 1.3 : 1.0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isOverlay ? "transparent" : "#0A0E17",
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* Onde de choc percutante */}
      {frame >= impactFrame && (
        <div
          style={{
            position: "absolute",
            width: 450 * sizeMultiplier,
            height: 180 * sizeMultiplier,
            borderRadius: 16,
            border: `3px solid ${selectedColor.border}`,
            opacity: shockwaveOpacity,
            transform: `scale(${shockwaveProgress}) rotate(${rotation}deg)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Le Tampon d'investigation */}
      <div
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          opacity: opacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `5px double ${selectedColor.border}`,
          borderRadius: 10,
          padding: `${20 * sizeMultiplier}px ${42 * sizeMultiplier}px`,
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          boxShadow: `0 0 25px ${selectedColor.glow}, inset 0 0 15px ${selectedColor.glow}`,
          userSelect: "none",
        }}
      >
        {/* Ligne principale du tampon */}
        <div
          style={{
            fontFamily: "'Impact', 'Arial Black', sans-serif",
            fontSize: 68 * sizeMultiplier,
            fontWeight: 900,
            letterSpacing: 8 * sizeMultiplier,
            color: selectedColor.border,
            textTransform: "uppercase",
            lineHeight: 1,
            textShadow: `0 0 10px ${selectedColor.glow}`,
          }}
        >
          {text}
        </div>

        {/* Sous-titre officiel / Date d'enquête */}
        {subText && (
          <div
            style={{
              fontFamily: "'Courier Prime', monospace, sans-serif",
              fontSize: 18 * sizeMultiplier,
              fontWeight: 800,
              letterSpacing: 4 * sizeMultiplier,
              color: selectedColor.primary,
              textTransform: "uppercase",
              marginTop: 10 * sizeMultiplier,
              borderTop: `2px solid ${selectedColor.border}`,
              paddingTop: 6 * sizeMultiplier,
              width: "100%",
              textAlign: "center",
            }}
          >
            {subText}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
