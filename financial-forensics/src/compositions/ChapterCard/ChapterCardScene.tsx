import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type ChapterCardPosition = "left" | "center" | "right";

export interface ChapterCardProps {
  number?: string;
  title: string;
  subtitle?: string;
  position?: ChapterCardPosition;
  accentColor?: string;     // Couleur or signature (défaut: #D4AF37)
  titleColor?: string;      // Couleur titre (défaut: Blanc glacier #F8FAFC)
  subtitleColor?: string;   // Couleur sous-titre (défaut: Gris acier #94A3B8)
}

export const ChapterCardScene: React.FC<ChapterCardProps> = ({
  number = "01",
  title = "THE WOMAN WHO VANISHED WITH $4 BILLION",
  subtitle = "SOFIA, BULGARIE • OCTOBRE 2017",
  position = "left",
  accentColor = "#D4AF37",  // Or raffiné / Gold Bloomberg
  titleColor = "#F8FAFC",   // Blanc glacier
  subtitleColor = "#94A3B8",// Gris acier
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Reveal cinématique doux
  const springNumber = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.7, stiffness: 95 },
  });

  const springDivider = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: { damping: 18, mass: 0.8, stiffness: 90 },
  });

  const springTitle = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 18, mass: 0.85, stiffness: 85 },
  });

  // 2. Micro-mouvement vivant continu (Organic Slow Drift)
  const driftScale = interpolate(frame, [0, durationInFrames], [1.0, 1.018], {
    extrapolateRight: "clamp",
  });
  const driftY = Math.sin((frame / fps) * 0.8) * 1.5;

  // 3. Fondu de sortie cinéma (12 frames = 0.5s)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Ombrage cinéma ultra profond et soigné
  const textShadowStyle = `
    0px 4px 24px rgba(0, 0, 0, 0.95),
    0px 2px 8px rgba(0, 0, 0, 0.9),
    1px 1px 3px rgba(0, 0, 0, 0.95)
  `;

  // Positionnement
  const getAlignment = () => {
    switch (position) {
      case "center":
        return {
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${driftScale}) translateY(${driftY}px)`,
          alignItems: "center",
          textAlign: "center" as const,
          origin: "center center",
        };
      case "right":
        return {
          right: 120,
          top: "50%",
          transform: `translateY(calc(-50% + ${driftY}px)) scale(${driftScale})`,
          alignItems: "flex-end",
          textAlign: "right" as const,
          origin: "right center",
        };
      case "left":
      default:
        return {
          left: 120,
          top: "50%",
          transform: `translateY(calc(-50% + ${driftY}px)) scale(${driftScale})`,
          alignItems: "flex-start",
          textAlign: "left" as const,
          origin: "left center",
        };
    }
  };

  const align = getAlignment();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        pointerEvents: "none",
        fontFamily: "'Oswald', 'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@600;700;800&family=Cinzel:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "row",
          gap: 28,
          opacity: fadeOut,
          transformOrigin: align.origin,
          ...align,
        }}
      >
        {/* Numéro 01 en Or Pur Typographique */}
        {number && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: springNumber,
              transform: `scale(${interpolate(springNumber, [0, 1], [0.85, 1.0])}) translateY(${interpolate(springNumber, [0, 1], [10, 0])}px)`,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: 88,
                fontWeight: 800,
                color: accentColor,
                lineHeight: 0.9,
                letterSpacing: "1px",
                textShadow: `0 0 25px ${accentColor}66, 0 4px 20px rgba(0,0,0,0.95)`,
              }}
            >
              {number}
            </div>
          </div>
        )}

        {/* Séparateur Vertical Fin en Or (Vertical Divider) */}
        {number && (
          <div
            style={{
              width: 2.5,
              height: 90,
              background: `linear-gradient(180deg, transparent 0%, ${accentColor} 20%, ${accentColor} 80%, transparent 100%)`,
              boxShadow: `0 0 12px ${accentColor}88`,
              opacity: springDivider,
              transform: `scaleY(${springDivider})`,
              transformOrigin: "center center",
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
        )}

        {/* Bloc Titre en Blanc + Sous-Titre */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: position === "center" ? "center" : position === "right" ? "flex-end" : "flex-start",
            opacity: springTitle,
            transform: `translateX(${interpolate(springTitle, [0, 1], [15, 0])}px)`,
          }}
        >
          {/* Titre Principal en Blanc Glacier */}
          <div
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: title.length > 35 ? 54 : 66,
              fontWeight: 800,
              color: titleColor,
              textTransform: "uppercase",
              lineHeight: 1.05,
              letterSpacing: "2px",
              textShadow: textShadowStyle,
              maxWidth: 780,
              marginBottom: subtitle ? 10 : 0,
            }}
          >
            {title}
          </div>

          {/* Sous-titre / Métadonnées en Gris Acier aéré */}
          {subtitle && (
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 600,
                color: subtitleColor,
                textTransform: "uppercase",
                letterSpacing: "4px",
                lineHeight: 1.3,
                textShadow: textShadowStyle,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
