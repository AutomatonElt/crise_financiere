import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export type SubscribeTheme = "classic-red" | "dark-gold" | "glass-cyan";
export type SubscribePosition =
  | "bottom-center"
  | "bottom-right"
  | "bottom-left"
  | "center";

export interface SubscribeCTAProps {
  theme?: SubscribeTheme;
  subscribeText?: string;
  subscribedText?: string;
  position?: SubscribePosition;
  scale?: number;
  durationInFrames?: number;
}

export const SubscribeCTAScene: React.FC<SubscribeCTAProps> = ({
  theme = "classic-red",
  subscribeText = "SUBSCRIBE",
  subscribedText = "SUBSCRIBED",
  position = "bottom-center",
  scale = 1.2,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // ==========================================
  // 1. TIMELINE DES ÉVÉNEMENTS (125 frames @ 25fps = 5s)
  // ==========================================
  const FRAME_LIKE_CLICK = 33;
  const FRAME_SUB_CLICK = 63;
  const FRAME_BELL_CLICK = 93;

  // 1. Entrée du conteneur pill (Spring rebond doux)
  const springPill = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 100 },
  });

  const pillY = interpolate(springPill, [0, 1], [80, 0]);
  const pillOpacity = interpolate(springPill, [0, 1], [0, 1]);

  // 2. Sortie du conteneur (12 dernières frames)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 3. États réactifs
  const isLiked = frame >= FRAME_LIKE_CLICK;
  const isSubscribed = frame >= FRAME_SUB_CLICK;
  const isBellActive = frame >= FRAME_BELL_CLICK;

  // 4. Animation du bouton Like lors du clic
  const likeSpring = spring({
    frame: Math.max(0, frame - FRAME_LIKE_CLICK),
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 220 },
  });
  const likeScale = isLiked
    ? interpolate(likeSpring, [0, 0.4, 1], [1.0, 1.35, 1.0])
    : 1.0;

  // 5. Animation du bouton Subscribe lors du clic
  const subSpring = spring({
    frame: Math.max(0, frame - FRAME_SUB_CLICK),
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });
  const subScale = isSubscribed
    ? interpolate(subSpring, [0, 0.4, 1], [1.0, 0.92, 1.0])
    : 1.0;

  // 6. Animation de la cloche (vibration de sonnerie)
  const bellTime = frame - FRAME_BELL_CLICK;
  let bellRotation = 0;
  if (isBellActive && bellTime < 24) {
    bellRotation =
      Math.sin(bellTime * 1.5) * 18 * Math.exp(-bellTime * 0.12);
  }

  // 7. Trajectoire réaliste du curseur de souris
  // Like button center = 78, Y = 38
  // Subscribe button center = 244, Y = 38
  // Bell button center = 384, Y = 38
  const cursorX = interpolate(
    frame,
    [0, 12, 33, 44, 63, 74, 93, 108, 120],
    [450, 260, 78, 78, 244, 244, 384, 384, 480],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cursorY = interpolate(
    frame,
    [0, 12, 33, 44, 63, 74, 93, 108, 120],
    [140, 80, 38, 38, 38, 38, 38, 38, 120],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const cursorOpacity = interpolate(
    frame,
    [0, 8, 110, 122],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isClicking =
    (frame >= FRAME_LIKE_CLICK - 1 && frame <= FRAME_LIKE_CLICK + 3) ||
    (frame >= FRAME_SUB_CLICK - 1 && frame <= FRAME_SUB_CLICK + 3) ||
    (frame >= FRAME_BELL_CLICK - 1 && frame <= FRAME_BELL_CLICK + 3);

  const cursorScale = isClicking ? 0.85 : 1.0;

  // 8. Ondes de choc (Ripples) sur les clics
  const renderRipple = (clickFrame: number, cx: number, cy: number, color: string) => {
    const elapsed = frame - clickFrame;
    if (elapsed < 0 || elapsed > 18) return null;
    const progress = elapsed / 18;
    const rScale = interpolate(progress, [0, 1], [0.2, 2.2]);
    const rOpacity = interpolate(progress, [0, 0.2, 1], [0.9, 0.7, 0]);
    return (
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: 44,
          height: 44,
          marginLeft: -22,
          marginTop: -22,
          borderRadius: "50%",
          border: `2.5px solid ${color}`,
          backgroundColor: `${color}22`,
          transform: `scale(${rScale})`,
          opacity: rOpacity,
          pointerEvents: "none",
          zIndex: 4,
        }}
      />
    );
  };

  // 9. Thème de couleur
  const isRed = theme === "classic-red";
  const isGold = theme === "dark-gold";

  const btnBg = isSubscribed
    ? "rgba(51, 65, 85, 0.85)"
    : isRed
    ? "#FF0000"
    : isGold
    ? "#D4AF37"
    : "#0284C7";

  const btnTextColor = isSubscribed
    ? "#94A3B8"
    : isGold
    ? "#020408"
    : "#FFFFFF";

  const likeActiveColor = isGold ? "#D4AF37" : "#38BDF8";
  const bellActiveColor = isGold ? "#D4AF37" : "#38BDF8";

  // Positionnement sur le canvas 1920x1080
  const getPosStyle = (): React.CSSProperties => {
    switch (position) {
      case "bottom-right":
        return { right: 80, bottom: 80, transform: `scale(${scale})` };
      case "bottom-left":
        return { left: 80, bottom: 80, transform: `scale(${scale})` };
      case "center":
        return { left: "50%", top: "50%", transform: `translate(-50%, -50%) scale(${scale})` };
      case "bottom-center":
      default:
        return { left: "50%", bottom: 90, transform: `translateX(-50%) scale(${scale})` };
    }
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "transparent",
        pointerEvents: "none",
        overflow: "hidden",
        fontFamily: "'Inter', 'Roboto', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@600;700;800;900&family=Oswald:wght@700&display=swap');
      `}</style>

      {/* Conteneur Global Positionné */}
      <div
        style={{
          position: "absolute",
          ...getPosStyle(),
          opacity: fadeOut,
        }}
      >
        {/* Pilule Principale Flottante */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 16,
            backgroundColor: "rgba(10, 15, 26, 0.88)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 60,
            padding: "14px 28px",
            boxShadow: `
              0 20px 50px rgba(0, 0, 0, 0.75),
              0 0 20px rgba(0, 0, 0, 0.5),
              inset 0 1px 1px rgba(255, 255, 255, 0.15)
            `,
            transform: `translateY(${pillY}px) scale(${pillOpacity})`,
            opacity: pillOpacity,
          }}
        >
          {/* Ondes de choc des clics */}
          {renderRipple(FRAME_LIKE_CLICK, 78, 38, likeActiveColor)}
          {renderRipple(FRAME_SUB_CLICK, 244, 38, isSubscribed ? "#94A3B8" : "#FF0000")}
          {renderRipple(FRAME_BELL_CLICK, 384, 38, bellActiveColor)}

          {/* ========================================== */}
          {/* BOUTON 1 : LIKE (THUMBS UP) */}
          {/* ========================================== */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 40,
              backgroundColor: isLiked ? `${likeActiveColor}22` : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${isLiked ? `${likeActiveColor}66` : "rgba(255, 255, 255, 0.08)"}`,
              transform: `scale(${likeScale})`,
              transition: "background-color 0.2s, border-color 0.2s",
              cursor: "pointer",
            }}
          >
            {/* SVG Vectoriel Pouce Like */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill={isLiked ? likeActiveColor : "none"}
              stroke={isLiked ? likeActiveColor : "#94A3B8"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: isLiked ? `drop-shadow(0 0 8px ${likeActiveColor}99)` : "none",
              }}
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: isLiked ? likeActiveColor : "#CBD5E1",
                letterSpacing: 1,
              }}
            >
              LIKE
            </span>
          </div>

          {/* ========================================== */}
          {/* BOUTON 2 : S'ABONNER / SUBSCRIBE */}
          {/* ========================================== */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              minWidth: 170,
              padding: "12px 26px",
              borderRadius: 40,
              backgroundColor: btnBg,
              boxShadow: isSubscribed
                ? "none"
                : `0 4px 20px ${isRed ? "rgba(255, 0, 0, 0.5)" : "rgba(212, 175, 55, 0.4)"}`,
              transform: `scale(${subScale})`,
              transition: "background-color 0.3s, transform 0.15s",
              cursor: "pointer",
            }}
          >
            {/* Icône de validation quand abonné */}
            {isSubscribed && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={btnTextColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                fontWeight: 800,
                color: btnTextColor,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              {isSubscribed ? subscribedText : subscribeText}
            </span>
          </div>

          {/* ========================================== */}
          {/* BOUTON 3 : CLOCHE DE NOTIFICATION */}
          {/* ========================================== */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: isBellActive ? `${bellActiveColor}22` : "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${isBellActive ? `${bellActiveColor}66` : "rgba(255, 255, 255, 0.08)"}`,
              transform: `rotate(${bellRotation}deg)`,
              transformOrigin: "top center",
              transition: "background-color 0.2s, border-color 0.2s",
              cursor: "pointer",
            }}
          >
            {/* SVG Vectoriel Cloche */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isBellActive ? bellActiveColor : "none"}
              stroke={isBellActive ? bellActiveColor : "#94A3B8"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: isBellActive ? `drop-shadow(0 0 10px ${bellActiveColor})` : "none",
              }}
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {/* Ondes sonores de sonnerie autour de la cloche */}
            {isBellActive && bellTime < 24 && (
              <>
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: -4,
                    width: 6,
                    height: 12,
                    borderRight: `2px solid ${bellActiveColor}`,
                    borderRadius: "0 8px 8px 0",
                    opacity: interpolate(bellTime % 6, [0, 3, 6], [0.3, 1, 0.3]),
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: -4,
                    width: 6,
                    height: 12,
                    borderLeft: `2px solid ${bellActiveColor}`,
                    borderRadius: "8px 0 0 8px",
                    opacity: interpolate(bellTime % 6, [0, 3, 6], [0.3, 1, 0.3]),
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* CURSEUR DE SOURIS ANIMÉ (OS POINTER) */}
        {/* ========================================== */}
        <div
          style={{
            position: "absolute",
            left: cursorX,
            top: cursorY,
            transform: `scale(${cursorScale})`,
            opacity: cursorOpacity,
            zIndex: 10,
            pointerEvents: "none",
            filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.75))",
            transition: "transform 0.08s ease-out",
          }}
        >
          {/* SVG Vectoriel Curseur de Souris */}
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
            <path
              d="M6 3L22 17.5L14.5 19L20 29L16 31L10.5 21L6 26V3Z"
              fill="#FFFFFF"
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
