import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type EvidenceCardPosition = "right" | "left" | "center" | "bottom-right" | "bottom-left";
export type EvidenceCardStyle = "clean" | "print" | "soft";

export interface EvidenceCardProps {
  imageSrc: string;
  position?: EvidenceCardPosition;
  frameStyle?: EvidenceCardStyle; // "clean" (pur net) | "print" (tirage papier ivoire) | "soft" (bords doux fondus flottants)
  cardWidth?: number;
  offsetY?: number; // Décalage vertical en pixels (positif = vers le bas, défaut: 85)
}

export const EvidenceCardScene: React.FC<EvidenceCardProps> = ({
  imageSrc,
  position = "right",
  frameStyle = "clean",
  cardWidth = 520,
  offsetY = 85,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Entrée dynamique douce (Scale 0.94 -> 1.0)
  const enterProgress = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 110,
      mass: 0.8,
    },
  });

  // 2. Mouvement continu vivant ("le cadre va un peu bouger")
  const timeSec = frame / fps;
  // Flottaison sinusoïdale très douce (±6px)
  const floatY = Math.sin(timeSec * 1.1) * 6;
  // Légère micro-rotation organique (±0.5 degré)
  const floatRotate = Math.sin(timeSec * 0.8) * 0.5;
  // Lent zoom documentaire (1.0 -> 1.025)
  const continuousScale = interpolate(frame, [0, durationInFrames], [1.0, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Fondu de sortie (12 dernières frames)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const currentScale = enterProgress * continuousScale;

  // Positionnement à l'écran (abaissé vers le bas via offsetY, par défaut +85px)
  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case "left":
      case "bottom-left":
        return {
          left: 140,
          top: "50%",
          transform: `translateY(calc(-50% + ${offsetY}px + ${floatY}px)) rotate(${floatRotate}deg) scale(${currentScale})`,
        };
      case "center":
        return {
          left: "50%",
          top: "50%",
          transform: `translate(-50%, calc(-50% + ${offsetY}px + ${floatY}px)) rotate(${floatRotate}deg) scale(${currentScale})`,
        };
      case "bottom-right":
      case "right":
      default:
        return {
          right: 140,
          top: "50%",
          transform: `translateY(calc(-50% + ${offsetY}px + ${floatY}px)) rotate(${floatRotate}deg) scale(${currentScale})`,
        };
    }
  };

  const posStyle = getPositionStyles();

  const isPrintStyle = frameStyle === "print";
  const isSoftStyle = frameStyle === "soft";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: cardWidth,
          opacity: fadeOut,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
          ...posStyle,
        }}
      >
        {/* STYLE 1 : PRINT / TIRAGE D'ARCHIVE (Passe-partout ivoire chic façon tirage papier) */}
        {isPrintStyle ? (
          <div
            style={{
              padding: "16px 16px 22px 16px",
              backgroundColor: "#F4F1EA", // Papier photo d'archive ivoire
              borderRadius: 8,
              boxShadow: `
                0 25px 60px rgba(0, 0, 0, 0.85),
                0 6px 18px rgba(0, 0, 0, 0.6),
                inset 0 0 1px rgba(0, 0, 0, 0.2)
              `,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              <img
                src={imageSrc}
                alt="Archive"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 560,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        ) : isSoftStyle ? (
          /* STYLE 3 : SOFT / BORDS DOUX & FONDUS (Contours adoucis, fondu progressif et flottaison organique pure) */
          <div
            style={{
              position: "relative",
              display: "block",
              filter: "drop-shadow(0 30px 60px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 40px rgba(6, 10, 18, 0.90))",
            }}
          >
            <div
              style={{
                borderRadius: 26,
                overflow: "hidden",
                position: "relative",
                WebkitMaskImage: "radial-gradient(ellipse 92% 92% at 50% 50%, black 65%, rgba(0, 0, 0, 0.6) 82%, transparent 100%)",
                maskImage: "radial-gradient(ellipse 92% 92% at 50% 50%, black 65%, rgba(0, 0, 0, 0.6) 82%, transparent 100%)",
              }}
            >
              <img
                src={imageSrc}
                alt="Archive"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: 580,
                  objectFit: "cover",
                  display: "block",
                  filter: "contrast(1.04) brightness(0.98)",
                }}
              />
              {/* Vignettage cinématique interne très doux */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  boxShadow: "inset 0 0 50px 20px rgba(6, 10, 18, 0.75)",
                  borderRadius: 26,
                }}
              />
            </div>
          </div>
        ) : (
          /* STYLE 2 : CLEAN / MINIMAL (La photo pure nette avec ombre cinéma profonde) */
          <div
            style={{
              borderRadius: 6,
              overflow: "hidden",
              boxShadow: `
                0 30px 70px rgba(0, 0, 0, 0.90),
                0 8px 24px rgba(0, 0, 0, 0.70),
                0 1px 3px rgba(0, 0, 0, 0.80)
              `,
              display: "block",
            }}
          >
            <img
              src={imageSrc}
              alt="Archive"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: 580,
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
