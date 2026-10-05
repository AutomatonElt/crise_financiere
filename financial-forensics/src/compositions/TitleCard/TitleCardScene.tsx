import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

export type TitleCardPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
  | "center";

export interface TitleCardProps {
  line1: string;
  line2?: string;
  startFrameLine1?: number;
  startFrameLine2?: number;
  charsPerSecond?: number;
  colorLine1?: string;
  colorLine2?: string;
  position?: TitleCardPosition;
}

export const TitleCardScene: React.FC<TitleCardProps> = ({
  line1 = "OCTOBRE 2017",
  line2 = "SOFIA — ATHÈNES",
  startFrameLine1 = 8,
  startFrameLine2 = 44,
  charsPerSecond = 14,
  // Valeurs par défaut validées (Identité Financial Forensics)
  colorLine1 = "#38BDF8",     // Bleu ciel / Cyan lumineux
  colorLine2 = "#E0F2FE",     // Blanc glacier
  position = "bottom-left",   // Position par défaut
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Fondu de sortie cinéma sur les 12 dernières frames (0.5s)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Vitesse de frappe par ligne
  const framesPerChar = Math.max(1, Math.round(fps / charsPerSecond));
  const count1 = Math.max(
    0,
    Math.floor((frame - startFrameLine1) / framesPerChar)
  );
  const text1 = line1.slice(0, count1);

  const count2 = line2
    ? Math.max(0, Math.floor((frame - startFrameLine2) / framesPerChar))
    : 0;
  const text2 = line2 ? line2.slice(0, count2) : "";

  // Curseur actif uniquement pendant la frappe
  const isTyping1 = frame >= startFrameLine1 && count1 < line1.length;
  const isTyping2 = line2 ? frame >= startFrameLine2 && count2 < line2.length : false;
  const blink = Math.floor(frame / 5) % 2 === 0;

  // Ombrage cinéma ultra profond pour garantir la lisibilité sur tout type de plan
  const heavyTextShadow = `
    0px 4px 16px rgba(0, 0, 0, 0.95),
    0px 2px 4px rgba(0, 0, 0, 0.9),
    2px 2px 2px rgba(0, 0, 0, 0.9),
    -1px -1px 2px rgba(0, 0, 0, 0.8),
    0px 0px 24px rgba(0, 0, 0, 0.8)
  `;

  // Configuration du positionnement à l'écran
  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case "top-left":
        return {
          left: 100,
          top: 100,
          alignItems: "flex-start",
          textAlign: "left",
        };
      case "top-right":
        return {
          right: 100,
          top: 100,
          alignItems: "flex-end",
          textAlign: "right",
        };
      case "bottom-right":
        return {
          right: 100,
          bottom: 110,
          alignItems: "flex-end",
          textAlign: "right",
        };
      case "center":
        return {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          alignItems: "center",
          textAlign: "center",
        };
      case "bottom-left":
      default:
        return {
          left: 100,
          bottom: 110,
          alignItems: "flex-start",
          textAlign: "left",
        };
    }
  };

  const posStyle = getPositionStyles();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        pointerEvents: "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@700;800;900&display=swap');
      `}</style>

      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          opacity: fadeOut,
          userSelect: "none",
          ...posStyle,
        }}
      >
        {/* LIGNE 1 : Date ou Chiffre clé (52px) */}
        <div
          style={{
            fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: colorLine1,
            lineHeight: 1.05,
            textShadow: heavyTextShadow,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>{text1}</span>
          {isTyping1 && blink && (
            <span
              style={{
                display: "inline-block",
                width: 4,
                height: 42,
                backgroundColor: colorLine1,
                marginLeft: 6,
                boxShadow: `0 0 10px ${colorLine1}`,
              }}
            />
          )}
        </div>

        {/* LIGNE 2 : Lieu ou Sujet fort (80px) */}
        {line2 && (
          <div
            style={{
              fontFamily: "'Oswald', 'Bebas Neue', sans-serif",
              fontSize: 80,
              fontWeight: 900,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: colorLine2,
              lineHeight: 1.05,
              marginTop: 4,
              textShadow: heavyTextShadow,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>{text2}</span>
            {isTyping2 && blink && (
              <span
                style={{
                  display: "inline-block",
                  width: 5,
                  height: 64,
                  backgroundColor: colorLine2,
                  marginLeft: 6,
                  boxShadow: `0 0 10px ${colorLine2}`,
                }}
              />
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
