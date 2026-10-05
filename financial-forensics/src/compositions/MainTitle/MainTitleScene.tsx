import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type MainTitleStyle = "clean" | "shimmer" | "ambient";

export interface MainTitleProps {
  title: string;          // Ex: "THE CRYPTOQUEEN"
  style?: MainTitleStyle; // "clean" (net sans lueur), "shimmer" (reflet lumineux cinéma), "ambient"
  accentColor?: string;   // Ex: Or Bloomberg #D4AF37
  bgType?: "dark" | "transparent"; // "dark" (défaut) ou "transparent"
}

export const MainTitleScene: React.FC<MainTitleProps> = ({
  title = "THE CRYPTOQUEEN",
  style = "shimmer",       // Défaut: Shimmer cinéma
  accentColor = "#D4AF37", // Or noble
  bgType = "dark",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Reveal cinématique doux
  const springTitle = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 85 },
  });

  const springLines = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: { damping: 16, mass: 0.8, stiffness: 90 },
  });

  // 2. Lent travelling avant continu (Slow Push-in 1.0 -> 1.035)
  const pushScale = interpolate(frame, [0, durationInFrames], [1.0, 1.035], {
    extrapolateRight: "clamp",
  });

  // 3. Shimmer / Balayage de lumière cinéma de gauche à droite (de frame 18 à frame 60)
  const shimmerProgress = interpolate(frame, [18, 62], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Position du faisceau de gauche (-60%) à droite (+160%)
  const shimmerPos = interpolate(shimmerProgress, [0, 100], [-60, 160]);

  // 4. Fondu de sortie (15 frames = 0.6s)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgType === "dark" ? "#04070D" : "transparent",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cinzel', 'Oswald', serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800;900&family=Oswald:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Fond sombre sans tache jaune parasite */}
      {bgType === "dark" && (
        <AbsoluteFill
          style={{
            background: `
              radial-gradient(circle at center, #0B1322 0%, #060A13 60%, #020408 100%)
            `,
            opacity: fadeOut,
          }}
        >
          {/* Grille forensic subtile et nette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(to right, rgba(212, 175, 55, 0.025) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(212, 175, 55, 0.025) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
              opacity: 0.9,
            }}
          />

          {/* Lueur d'ambiance uniquement si style === 'ambient' */}
          {style === "ambient" && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 700,
                height: 350,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(ellipse at center, ${accentColor}18 0%, transparent 70%)`,
                filter: "blur(60px)",
                pointerEvents: "none",
              }}
            />
          )}
        </AbsoluteFill>
      )}

      {/* Contenu Titre Principal Épuré */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transform: `scale(${pushScale})`,
          opacity: fadeOut,
          zIndex: 10,
          padding: "0 60px",
        }}
      >
        {/* Grand Titre en Rendu Vectoriel SVG Pur (Zéro artefact de boîte, typographie parfaite) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1600,
            opacity: springTitle,
            transform: `scale(${interpolate(springTitle, [0, 1], [0.93, 1.0])}) translateY(${interpolate(springTitle, [0, 1], [15, 0])}px)`,
            marginBottom: 28,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <svg
            width="100%"
            height={title.length > 20 ? 120 : 150}
            viewBox="0 0 1600 150"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="goldBase" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FFFDF5" />
                <stop offset="70%" stopColor={accentColor} />
                <stop offset="100%" stopColor="#8C6A0D" />
              </linearGradient>

              <linearGradient
                id="shimmerSweep"
                x1={`${shimmerPos - 35}%`}
                y1="0%"
                x2={`${shimmerPos + 35}%`}
                y2="100%"
              >
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.98" />
                <stop offset="60%" stopColor="#FFF5CC" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              <filter id="cinematicShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.95" />
              </filter>
            </defs>

            {/* 1. Couche de Base : Titre Or Métallique Gravé */}
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="url(#goldBase)"
              filter="url(#cinematicShadow)"
              style={{
                fontFamily: "'Cinzel', 'Oswald', serif",
                fontSize: title.length > 20 ? 84 : 112,
                fontWeight: 900,
                letterSpacing: "12px",
                textTransform: "uppercase",
              }}
            >
              {title}
            </text>

            {/* 2. Couche Éclair Shimmer : Balayage de lumière cinéma qui traverse les lettres */}
            {style === "shimmer" && frame >= 12 && (
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="url(#shimmerSweep)"
                style={{
                  fontFamily: "'Cinzel', 'Oswald', serif",
                  fontSize: title.length > 20 ? 84 : 112,
                  fontWeight: 900,
                  letterSpacing: "12px",
                  textTransform: "uppercase",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              >
                {title}
              </text>
            )}
          </svg>
        </div>

        {/* Filet Central d'Or Stylisé avec Node Diamant Blanc */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            maxWidth: 480,
            opacity: springLines,
            transform: `scaleX(${springLines})`,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1.5,
              background: `linear-gradient(90deg, transparent 0%, ${accentColor} 100%)`,
            }}
          />
          <div
            style={{
              width: 7,
              height: 7,
              backgroundColor: "#FFFFFF",
              transform: "rotate(45deg)",
              boxShadow: `0 0 10px ${accentColor}`,
              margin: "0 14px",
            }}
          />
          <div
            style={{
              flex: 1,
              height: 1.5,
              background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
