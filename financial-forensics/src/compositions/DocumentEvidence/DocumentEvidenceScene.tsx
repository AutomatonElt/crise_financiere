import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface DocumentEvidenceProps {
  header?: string;
  classification?: string;
  date?: string;
  sender?: string;
  recipient?: string;
  subject?: string;
  bodyText?: string;
  targetPhrase?: string;
  mode?: "highlight" | "redaction"; // Surlignage feutre ou levée de censure
  highlightColor?: string;
  styleMode?: "dark_legal" | "light_legal" | "transparent";
}

export const DocumentEvidenceScene: React.FC<DocumentEvidenceProps> = ({
  header = "EXHIBIT B — INTERNAL MEMO",
  classification = "CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE",
  date = "OCTOBER 20, 2014 — 14:32 UTC",
  sender = "ruja.ignatova@onecoin.eu",
  recipient = "sebastian.greenwood@onecoin.eu",
  subject = "Strategy update regarding token emission",
  bodyText = "We are not mining coins. The members believe there is a blockchain, but everything is entered into a SQL database. If things go bad, we take the money and run and blame someone else.",
  targetPhrase = "take the money and run and blame someone else",
  mode = "highlight",
  highlightColor = "#EAB308", // Or / Jaune feutre chaud
  styleMode = "dark_legal",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Entrée du document avec physique Spring nerveuse (snap & slow drift)
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 110,
      mass: 0.9,
    },
  });

  // Micro-dérive cinématique continue (lent zoom 1.0 -> 1.03)
  const driftScale = interpolate(frame, [0, durationInFrames], [1, 1.025], {
    extrapolateRight: "clamp",
  });

  // Fondu de sortie propre
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Décalage temporel des métadonnées
  const metaReveal = spring({
    frame: frame - 6,
    fps,
    config: { damping: 16, stiffness: 120 },
  });

  // 3. Animation du surlignage / déclassification (démarre à frame 22, dure 18 frames)
  const highlightProgress = interpolate(frame, [22, 40], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Thème graphique selon le style
  const isLight = styleMode === "light_legal";
  const isTransparent = styleMode === "transparent";

  const bgColor = isTransparent
    ? "transparent"
    : isLight
    ? "#F4EFEA"
    : "#0B0F19";

  const cardBg = isLight
    ? "rgba(255, 255, 255, 0.94)"
    : "rgba(15, 23, 42, 0.92)";

  const textColor = isLight ? "#1E293B" : "#F8FAFC";
  const subTextColor = isLight ? "#64748B" : "#94A3B8";
  const borderColor = isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.1)";

  // Découpage du texte pour injecter le surlignage sur la phrase cible
  const parts = bodyText.split(targetPhrase);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Courier Prime', monospace, 'JetBrains Mono'",
        opacity: fadeOut,
      }}
    >
      {/* Conteneur flottant du document */}
      <div
        style={{
          width: 1320,
          backgroundColor: cardBg,
          borderRadius: 8,
          border: `1px solid ${borderColor}`,
          boxShadow: isLight
            ? "0 25px 60px -15px rgba(0, 0, 0, 0.25)"
            : "0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.05)",
          padding: "45px 55px",
          transform: `scale(${entrance * driftScale}) translateY(${interpolate(
            entrance,
            [0, 1],
            [30, 0]
          )}px)`,
          opacity: entrance,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Filigrane d'enquête en coin supérieur droit */}
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 40,
            fontSize: 13,
            letterSpacing: 3,
            color: "#EF4444",
            fontWeight: "bold",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            padding: "4px 12px",
            borderRadius: 3,
            textTransform: "uppercase",
            opacity: 0.85,
          }}
        >
          {classification}
        </div>

        {/* En-tête officiel du document */}
        <div
          style={{
            borderBottom: `2px solid ${borderColor}`,
            paddingBottom: 25,
            marginBottom: 30,
            opacity: metaReveal,
            transform: `translateY(${interpolate(metaReveal, [0, 1], [15, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              letterSpacing: 2,
              color: isLight ? "#0F172A" : "#38BDF8",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            {header}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 24px",
              fontSize: 14,
              color: subTextColor,
              lineHeight: 1.6,
            }}
          >
            <div>
              <span style={{ fontWeight: "bold", color: textColor }}>DATE :</span> {date}
            </div>
            <div>
              <span style={{ fontWeight: "bold", color: textColor }}>DE :</span> {sender}
            </div>
            <div>
              <span style={{ fontWeight: "bold", color: textColor }}>OBJET :</span> {subject}
            </div>
            <div>
              <span style={{ fontWeight: "bold", color: textColor }}>À :</span> {recipient}
            </div>
          </div>
        </div>

        {/* Corps du document avec effet Surlignage ou Censure */}
        <div
          style={{
            fontSize: 26,
            lineHeight: 1.7,
            color: textColor,
            letterSpacing: 0.5,
            position: "relative",
          }}
        >
          {parts.length === 2 ? (
            <>
              <span>{parts[0]}</span>

              {/* Bloc cible avec effet Surlignage animé (support multi-lignes fluide) */}
              <span
                style={{
                  position: "relative",
                  fontWeight: "bold",
                  color: mode === "highlight" && highlightProgress > 10 ? (isLight ? "#000" : "#FFFFFF") : textColor,
                  background:
                    mode === "highlight"
                      ? `linear-gradient(to right, ${highlightColor}66, ${highlightColor}66)`
                      : undefined,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "left center",
                  backgroundSize: `${highlightProgress}% 100%`,
                  boxDecorationBreak: "clone",
                  WebkitBoxDecorationBreak: "clone",
                  padding: "2px 4px",
                  borderRadius: 3,
                  boxShadow:
                    mode === "highlight" && highlightProgress > 5
                      ? `0 0 14px ${highlightColor}44`
                      : undefined,
                }}
              >
                {mode === "redaction" ? (
                  <>
                    <span style={{ position: "relative", zIndex: 1 }}>{targetPhrase}</span>
                    <span
                      style={{
                        position: "absolute",
                        left: -4,
                        right: -4,
                        top: -2,
                        bottom: -2,
                        backgroundColor: "#000000",
                        transformOrigin: "right center",
                        transform: `scaleX(${interpolate(highlightProgress, [0, 100], [1, 0])})`,
                        borderRadius: 2,
                        zIndex: 2,
                      }}
                    />
                  </>
                ) : (
                  targetPhrase
                )}
              </span>

              <span>{parts[1]}</span>
            </>
          ) : (
            <span>{bodyText}</span>
          )}
        </div>

        {/* Ligne de pied de page judiciaire */}
        <div
          style={{
            marginTop: 40,
            paddingTop: 16,
            borderTop: `1px dashed ${borderColor}`,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: subTextColor,
            letterSpacing: 1.5,
          }}
        >
          <span>CASE FILE // EVIDENCE DIVISION</span>
          <span>PAGE 01 / 01</span>
          <span>DOC ID : 9402-SDNY</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
