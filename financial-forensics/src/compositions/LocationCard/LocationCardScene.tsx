import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";

export type LocationCardStyle = "postcard" | "feathered" | "clean";
export type LocationCardPosition =
  | "right"
  | "left"
  | "center"
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left";

export interface LocationCardProps {
  imageSrc: string; // URL web ou staticFile ou chemin absolu
  title?: string; // Ex: "THE PIERRE" ou "FTX ARENA"
  subtitle?: string; // Ex: "ANGLE 5E AVE ET 61E" ou "MIAMI, FLORIDE"
  dateOrBadge?: string; // Ex: "JANVIER 1972" ou "32 MILLIARDS $"
  cardStyle?: LocationCardStyle; // "postcard" (défaut, style Furtif) | "feathered" | "clean"
  position?: LocationCardPosition; // "right" | "left" | "center" etc.
  cardWidth?: number; // Largeur totale de la carte en pixels (défaut: 440)
  photoAspectRatio?: number; // Ratio de la photo (défaut: 0.8 pour un format vertical élégant)
  tiltDeg?: number; // Inclinaison statique naturelle (ex: 1.5 ou -1.2)
  offsetX?: number; // Décalage horizontal additionnel
  offsetY?: number; // Décalage vertical additionnel (positif = vers le bas)
  cardBgColor?: string; // Fond du papier (défaut: "#F5F2EA" ivoire d'archive)
  titleColor?: string; // Couleur du titre
  subtitleColor?: string; // Couleur du sous-titre
  showCaption?: boolean; // Afficher ou non la légende sous la photo (défaut: true pour postcard, false pour feathered)
}

export const LocationCardScene: React.FC<LocationCardProps> = ({
  imageSrc,
  title = "THE PIERRE",
  subtitle = "",
  dateOrBadge = "",
  cardStyle = "postcard",
  position = "right",
  cardWidth: cardWidthProp,
  photoAspectRatio: photoAspectRatioProp,
  tiltDeg: tiltDegProp,
  offsetX = 0,
  offsetY = 40,
  cardBgColor = "#F5F2EA", // Papier ivoire chaud vintage
  titleColor = "#1C1C1C",
  subtitleColor = "#666053",
  showCaption = false,
}) => {
  const isFeathered = cardStyle === "feathered";
  const cardWidth = cardWidthProp ?? (isFeathered ? 540 : 440);
  const photoAspectRatio = photoAspectRatioProp ?? (isFeathered ? 1.33 : 0.78);
  const tiltDeg = tiltDegProp ?? (isFeathered ? 0 : 1.2);

  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Entrée dynamique douce (Spring scale 0.92 -> 1.0 + fade in)
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 16,
      stiffness: 100,
      mass: 0.9,
    },
  });

  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2. Mouvement vivant continu (flottaison organique et zoom d'ambiance imperceptible)
  const timeSec = frame / fps;
  const floatY = Math.sin(timeSec * 1.0) * 5; // Flottaison ±5px
  const floatRotate = Math.sin(timeSec * 0.7) * 0.35; // Oscillation d'angle ±0.35°
  const continuousZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.025], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 3. Fondu de sortie fluide (12 dernières frames)
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const finalScale = enterSpring * continuousZoom;
  const finalOpacity = fadeIn * fadeOut;
  const totalTilt = tiltDeg + floatRotate;

  // Calcul du positionnement sur l'écran 1920x1080
  const getPositionStyles = (): React.CSSProperties => {
    const marginSide = 130 + offsetX;
    switch (position) {
      case "left":
      case "bottom-left":
        return {
          left: marginSide,
          top: "50%",
          transform: `translateY(calc(-50% + ${offsetY}px + ${floatY}px)) rotate(${totalTilt}deg) scale(${finalScale})`,
        };
      case "top-left":
        return {
          left: marginSide,
          top: 100 + offsetY,
          transform: `translateY(${floatY}px) rotate(${totalTilt}deg) scale(${finalScale})`,
        };
      case "top-right":
        return {
          right: marginSide,
          top: 100 + offsetY,
          transform: `translateY(${floatY}px) rotate(${totalTilt}deg) scale(${finalScale})`,
        };
      case "center":
        return {
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px + ${floatY}px)) rotate(${totalTilt}deg) scale(${finalScale})`,
        };
      case "bottom-right":
      case "right":
      default:
        return {
          right: marginSide,
          top: "50%",
          transform: `translateY(calc(-50% + ${offsetY}px + ${floatY}px)) rotate(${totalTilt}deg) scale(${finalScale})`,
        };
    }
  };

  const posStyle = getPositionStyles();

  // Résolution de la source d'image (support staticFile ou URL absolue)
  const resolvedSrc = imageSrc.startsWith("http") || imageSrc.startsWith("/") || imageSrc.startsWith("data:")
    ? imageSrc
    : staticFile(imageSrc);

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
          opacity: finalOpacity,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
          ...posStyle,
        }}
      >
        {/* ========================================================= */}
        {/* STYLE 1 : CARTE POSTALE D'ÉPOQUE (Style Furtif - Capture 1) */}
        {/* ========================================================= */}
        {cardStyle === "postcard" && (
          <div
            style={{
              backgroundColor: cardBgColor,
              borderRadius: 6,
              padding: "16px 16px 20px 16px",
              display: "flex",
              flexDirection: "column",
              boxShadow: `
                0 30px 70px rgba(0, 0, 0, 0.85),
                0 10px 25px rgba(0, 0, 0, 0.60),
                0 2px 6px rgba(0, 0, 0, 0.40),
                inset 0 0 1px rgba(0, 0, 0, 0.25)
              `,
              border: "1px solid rgba(215, 208, 195, 0.7)",
              position: "relative",
            }}
          >
            {/* Cadre photo intérieur avec filet noir ultra-fin */}
            <div
              style={{
                width: "100%",
                aspectRatio: `${photoAspectRatio}`,
                maxHeight: 560,
                overflow: "hidden",
                border: "1px solid #1A1A1A", // Le filet noir caractéristique autour de la photo
                borderRadius: 2,
                backgroundColor: "#111",
                position: "relative",
              }}
            >
              <Img
                src={resolvedSrc}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "contrast(1.03) brightness(0.99)",
                }}
              />
              {/* Très léger grain papier sur la photo */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.25)",
                }}
              />
            </div>

            {/* Zone de texte sous la photo (Légende gravée vintage) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                paddingTop: 14,
                paddingBottom: 2,
              }}
            >
              {title && (
                <div
                  style={{
                    fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
                    fontWeight: 700,
                    fontSize: 22,
                    lineHeight: 1.2,
                    letterSpacing: "3.5px",
                    color: titleColor,
                    textTransform: "uppercase",
                  }}
                >
                  {title}
                </div>
              )}

              {subtitle && (
                <div
                  style={{
                    fontFamily: "'Courier New', Courier, monospace",
                    fontWeight: 600,
                    fontSize: 11,
                    letterSpacing: "2px",
                    color: subtitleColor,
                    textTransform: "uppercase",
                    marginTop: 6,
                  }}
                >
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STYLE 2 : BORDS ADOUCIS FONDUS (Style Furtif - Capture 2) */}
        {/* ========================================================= */}
        {cardStyle === "feathered" && (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              filter: `
                drop-shadow(0 20px 45px rgba(0, 0, 0, 0.75))
                drop-shadow(0 4px 12px rgba(0, 0, 0, 0.50))
              `,
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: `${photoAspectRatio}`,
                borderRadius: 18,
                overflow: "hidden",
                position: "relative",
                WebkitMaskImage:
                  "radial-gradient(ellipse 92% 90% at 50% 50%, black 65%, rgba(0, 0, 0, 0.6) 84%, transparent 100%)",
                maskImage:
                  "radial-gradient(ellipse 92% 90% at 50% 50%, black 65%, rgba(0, 0, 0, 0.6) 84%, transparent 100%)",
              }}
            >
              <Img
                src={resolvedSrc}
                alt={title || "archive"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "contrast(1.04) brightness(0.98)",
                }}
              />
            </div>

            {/* Légende discrète sous l'archive fondue (désactivée par défaut pour pureté documentaire) */}
            {showCaption && (title || subtitle) && (
              <div
                style={{
                  marginTop: 14,
                  padding: "8px 16px",
                  backgroundColor: "rgba(10, 12, 16, 0.75)",
                  backdropFilter: "blur(8px)",
                  borderRadius: 6,
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  alignSelf: "center",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.6)",
                }}
              >
                {title && (
                  <div
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontWeight: 700,
                      fontSize: 18,
                      letterSpacing: "3px",
                      color: "#F8FAFC",
                      textTransform: "uppercase",
                    }}
                  >
                    {title}
                  </div>
                )}
                {subtitle && (
                  <div
                    style={{
                      fontFamily: "'Courier New', Courier, monospace",
                      fontWeight: 600,
                      fontSize: 10,
                      letterSpacing: "2px",
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      marginTop: 3,
                    }}
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* STYLE 3 : PLAQUE MODERNE ÉPURÉE (Minimaliste Net)          */}
        {/* ========================================================= */}
        {cardStyle === "clean" && (
          <div
            style={{
              backgroundColor: "#11141A",
              borderRadius: 8,
              padding: 10,
              display: "flex",
              flexDirection: "column",
              boxShadow: `
                0 30px 70px rgba(0, 0, 0, 0.90),
                0 8px 24px rgba(0, 0, 0, 0.70)
              `,
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: `${photoAspectRatio}`,
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Img
                src={resolvedSrc}
                alt={title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            {(title || subtitle) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "12px 6px 6px 6px",
                  textAlign: "center",
                }}
              >
                {title && (
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 800,
                      fontSize: 16,
                      letterSpacing: "2.5px",
                      color: "#F8FAFC",
                      textTransform: "uppercase",
                    }}
                  >
                    {title}
                  </div>
                )}
                {subtitle && (
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: 11,
                      letterSpacing: "1.5px",
                      color: "#94A3B8",
                      textTransform: "uppercase",
                      marginTop: 4,
                    }}
                  >
                    {subtitle}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
