import React, { useMemo } from "react";
import {
  Audio,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadCourierPrime } from "@remotion/google-fonts/CourierPrime";

const { fontFamily: caveatFont } = loadCaveat();
const { fontFamily: cinzelFont } = loadCinzel();
const { fontFamily: courierFont } = loadCourierPrime();

export interface LedgerTitleSequenceProps {
  // Master Set Plates
  frame1Image?: string;
  frame2Image?: string;
  frame3Image?: string;

  // Phase 1 : Le Dossier (Paramètres Éditables)
  phase1Title?: string;
  phase1Subtitle?: string;
  phase1MainImage?: string;
  phase1NoteTop?: string;
  phase1NoteBottom?: string;

  // Phase 2 : Le Suspect (Paramètres Éditables)
  phase2SuspectName?: string;
  phase2SuspectRole?: string;
  phase2SuspectImage?: string;
  phase2NoteLeft?: string;
  phase2NoteRight?: string;

  // Phase 3 : La Marque (Paramètres Éditables)
  channelName?: string;
  channelTagline?: string;
  logoImage?: string;

  durationInFrames?: number;
}

export const LedgerTitleSequenceScene: React.FC<LedgerTitleSequenceProps> = ({
  frame1Image = "brand/frame1_ninedays.jpg",
  frame2Image = "brand/frame2_sbf.jpg",
  frame3Image = "brand/frame3_billboard.jpg",

  phase1Title = "NINE DAYS TO ZERO",
  phase1Subtitle = "THE COLLAPSE OF FTX • NOVEMBER 2022",
  phase1MainImage,
  phase1NoteTop,
  phase1NoteBottom,

  phase2SuspectName = "SAM BANKMAN-FRIED",
  phase2SuspectRole = "CEO & FOUNDER // FTX & ALAMEDA RESEARCH",
  phase2SuspectImage,
  phase2NoteLeft,
  phase2NoteRight,

  channelName = "THE LEDGER",
  channelTagline = "FINANCIAL FORENSICS",
  logoImage = "brand/the_ledger_logo.png",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Détection si des props personnalisées sont passées
  const isCustomP1Title = phase1Title !== "NINE DAYS TO ZERO" || phase1Subtitle !== "THE COLLAPSE OF FTX • NOVEMBER 2022";
  const isCustomP1Photo = Boolean(phase1MainImage);
  const isCustomP1NoteTop = Boolean(phase1NoteTop);
  const isCustomP1NoteBottom = Boolean(phase1NoteBottom);

  const isCustomP2Suspect = Boolean(phase2SuspectImage);
  const isCustomP2Plaque = phase2SuspectName !== "SAM BANKMAN-FRIED" || phase2SuspectRole !== "CEO & FOUNDER // FTX & ALAMEDA RESEARCH";
  const isCustomP2NoteLeft = Boolean(phase2NoteLeft);
  const isCustomP2NoteRight = Boolean(phase2NoteRight);

  // Choix automatique du fond : si personnalisation demandée, on utilise la plaque nettoyée
  const activeFrame1 = (isCustomP1Title || isCustomP1NoteTop || isCustomP1NoteBottom)
    ? "brand/frame1_clean_plate.jpg"
    : frame1Image;

  const activeFrame2 = (isCustomP2Plaque || isCustomP2NoteLeft || isCustomP2NoteRight)
    ? "brand/frame2_clean_plate.jpg"
    : frame2Image;

  // ==========================================
  // TIMELINE & KEYFRAMES (Total: 160 frames @ 25fps = 6.4s)
  // Stage 1 (Dossier / Nine Days): frames 0 -> 52
  // Transition 1 -> 2 (Whip-pan): frames 46 -> 56
  // Stage 2 (Suspect / SBF): frames 52 -> 106
  // Transition 2 -> 3 (Cinematic dark push): frames 98 -> 110
  // Stage 3 (The Ledger Billboard): frames 106 -> 160
  // ==========================================

  // --- STAGE 1: NINE DAYS TO ZERO ---
  const stage1Scale = interpolate(frame, [0, 55], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stage1PanY = interpolate(frame, [0, 55], [0, -10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Whip-transition out of Stage 1
  const stage1WhipProgress = interpolate(frame, [46, 56], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const stage1X = -stage1WhipProgress * width;
  const stage1Blur = interpolate(frame, [47, 51, 55], [0, 12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Specular golden light sheen sweep across title in Stage 1
  const stage1SheenProgress = interpolate(frame, [14, 34], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- STAGE 2: SAM BANKMAN-FRIED ---
  const stage2WhipIn = interpolate(frame, [46, 56], [width, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0, 0.2, 1),
  });
  
  const stage2Scale = interpolate(frame, [52, 105], [1.03, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Metallic glint on SBF brass plaque
  const stage2GlintProgress = interpolate(frame, [65, 88], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Transition out of Stage 2 into Stage 3 (Dark focus dissolve + deep push)
  const stage2DissolveProgress = interpolate(frame, [98, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const stage2Opacity = 1 - stage2DissolveProgress;
  const stage2BlurOut = stage2DissolveProgress * 18;
  const stage2PushOut = 1 + stage2DissolveProgress * 0.12;

  // --- STAGE 3: THE LEDGER BILLBOARD ---
  const stage3Visible = frame >= 98;
  const stage3Opacity = interpolate(frame, [100, 112], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  
  const stage3Scale = interpolate(frame, [102, 160], [1.06, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Cyan laser slit energy travelling across the 'L'
  const cyanLaserPulse = interpolate(frame, [112, 128], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cyanGlowIntensity = Math.sin(cyanLaserPulse * Math.PI) * 1.5;

  // Subtle breathing of the gold text
  const goldBreathing = interpolate(frame, [120, 160], [1.0, 1.015], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient floating gold dust particles
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: (i * 73 + 17) % 1920,
      baseY: (i * 97 + 31) % 1080,
      size: 2 + (i % 4) * 1.5,
      speed: 0.3 + (i % 5) * 0.2,
      opacity: 0.25 + (i % 4) * 0.18,
    }));
  }, []);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#05070B",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Audio SFX : Whoosh at transition 1->2 (frame 46) and transition 2->3 (frame 98) */}
      {frame >= 46 && frame < 90 && (
        <Audio
          src={staticFile("whoosh_medium.wav")}
          volume={0.65}
          startFrom={0}
        />
      )}
      {frame >= 98 && (
        <Audio
          src={staticFile("whoosh_medium.wav")}
          volume={0.5}
          startFrom={0}
        />
      )}

      {/* ============================================================ */}
      {/* STAGE 1: NINE DAYS TO ZERO (Le Dossier) */}
      {/* ============================================================ */}
      {frame < 58 && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: `translateX(${stage1X}px) scale(${stage1Scale}) translateY(${stage1PanY}px)`,
            filter: `blur(${stage1Blur}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Master Photorealistic Plate */}
          <Img
            src={staticFile(activeFrame1)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Slot Éditable : Photo Centrale (si personnalisée) */}
          {isCustomP1Photo && phase1MainImage && (
            <div
              style={{
                position: "absolute",
                left: "28.85%",
                top: "21.74%",
                width: "42.22%",
                height: "42.05%",
                overflow: "hidden",
                border: "2px solid #E2E8F0",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.8)",
              }}
            >
              <Img
                src={staticFile(phase1MainImage)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "contrast(1.1) brightness(0.95)",
                }}
              />
            </div>
          )}

          {/* Slot Éditable : Plaque de Titre & Sous-Titre (si personnalisée) */}
          {isCustomP1Title && (
            <div
              style={{
                position: "absolute",
                left: "26.3%",
                top: "67.7%",
                width: "47.4%",
                height: "16.3%",
                backgroundColor: "#0D1117",
                backgroundImage: "linear-gradient(180deg, #161B22 0%, #0D1117 100%)",
                border: "1px solid rgba(212, 175, 55, 0.35)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 25px rgba(0,0,0,0.7)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: cinzelFont,
                  fontSize: 38,
                  fontWeight: "bold",
                  letterSpacing: 4,
                  background: "linear-gradient(135deg, #FFF3D4 20%, #D4AF37 50%, #AA771C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                  lineHeight: 1.1,
                  textAlign: "center",
                }}
              >
                {phase1Title}
              </div>
              <div
                style={{
                  width: "90%",
                  height: 1,
                  backgroundColor: "rgba(212, 175, 55, 0.4)",
                  margin: "6px 0",
                }}
              />
              <div
                style={{
                  fontFamily: courierFont,
                  fontSize: 14,
                  letterSpacing: 3,
                  color: "#D4AF37",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {phase1Subtitle}
              </div>
            </div>
          )}

          {/* Slot Éditable : Annotation Manuscrite Haut Gauche */}
          {isCustomP1NoteTop && phase1NoteTop && (
            <div
              style={{
                position: "absolute",
                top: "52%",
                left: "14%",
                fontFamily: caveatFont,
                fontSize: 34,
                color: "#1E1E24",
                transform: "rotate(-3deg)",
                textShadow: "0 1px 2px rgba(255,255,255,0.4)",
              }}
            >
              {phase1NoteTop}
            </div>
          )}

          {/* Slot Éditable : Annotation Manuscrite Bas Droite */}
          {isCustomP1NoteBottom && phase1NoteBottom && (
            <div
              style={{
                position: "absolute",
                bottom: "7%",
                right: "26%",
                fontFamily: caveatFont,
                fontSize: 36,
                color: "#1E1E24",
                transform: "rotate(-1deg)",
                textShadow: "0 1px 2px rgba(255,255,255,0.4)",
              }}
            >
              {phase1NoteBottom}
            </div>
          )}

          {/* Golden Sheen Beam sweep over central plaque */}
          {frame >= 14 && frame <= 34 && (
            <div
              style={{
                position: "absolute",
                top: "60%",
                left: "26%",
                width: "48%",
                height: "18%",
                pointerEvents: "none",
                background: `linear-gradient(115deg, transparent ${stage1SheenProgress - 30}%, rgba(212, 175, 55, 0.45) ${stage1SheenProgress}%, transparent ${stage1SheenProgress + 30}%)`,
                mixBlendMode: "screen",
              }}
            />
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 2: SAM BANKMAN-FRIED (Le Suspect) */}
      {/* ============================================================ */}
      {frame >= 46 && frame < 112 && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: stage2Opacity,
            transform: `translateX(${stage2WhipIn}px) scale(${stage2Scale * stage2PushOut})`,
            filter: `blur(${stage2BlurOut}px)`,
            transformOrigin: "center center",
          }}
        >
          {/* Master Photorealistic Plate */}
          <Img
            src={staticFile(activeFrame2)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Slot Éditable : Portrait Suspect dans le cadre sculpté */}
          {isCustomP2Suspect && phase2SuspectImage && (
            <div
              style={{
                position: "absolute",
                left: "35.97%",
                top: "15.62%",
                width: "28.05%",
                height: "52.08%",
                overflow: "hidden",
                boxShadow: "inset 0 0 25px rgba(0,0,0,0.85)",
              }}
            >
              <Img
                src={staticFile(phase2SuspectImage)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(20%) contrast(1.15) brightness(0.95)",
                }}
              />
            </div>
          )}

          {/* Slot Éditable : Plaque de Laiton Gravé du Suspect */}
          {isCustomP2Plaque && (
            <div
              style={{
                position: "absolute",
                left: "31.98%",
                top: "81.38%",
                width: "36.05%",
                height: "12.37%",
                background: "linear-gradient(180deg, #E6C575 0%, #D4AF37 40%, #AA771C 100%)",
                border: "1px solid #785310",
                boxShadow: "0 6px 15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.6)",
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px 16px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontFamily: cinzelFont,
                  fontSize: 26,
                  fontWeight: "bold",
                  color: "#18140E",
                  letterSpacing: 3,
                  textShadow: "0 1px 1px rgba(255,255,255,0.3)",
                  textAlign: "center",
                  lineHeight: 1.1,
                }}
              >
                {phase2SuspectName}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontFamily: courierFont,
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#2C200C",
                  letterSpacing: 2,
                  textAlign: "center",
                }}
              >
                {phase2SuspectRole}
              </div>
            </div>
          )}

          {/* Slot Éditable : Annotation Manuscrite Gauche Suspect */}
          {isCustomP2NoteLeft && phase2NoteLeft && (
            <div
              style={{
                position: "absolute",
                top: "22%",
                left: "13%",
                fontFamily: caveatFont,
                fontSize: 32,
                color: "#1E1E24",
                transform: "rotate(-3deg)",
                textShadow: "0 1px 2px rgba(255,255,255,0.4)",
              }}
            >
              {phase2NoteLeft}
            </div>
          )}

          {/* Slot Éditable : Annotation Manuscrite Droite Suspect */}
          {isCustomP2NoteRight && phase2NoteRight && (
            <div
              style={{
                position: "absolute",
                bottom: "22%",
                right: "12%",
                fontFamily: caveatFont,
                fontSize: 32,
                color: "#1E1E24",
                transform: "rotate(2deg)",
                textShadow: "0 1px 2px rgba(255,255,255,0.4)",
              }}
            >
              {phase2NoteRight}
            </div>
          )}

          {/* Brass plate reflection glint on SBF plaque */}
          {frame >= 65 && frame <= 88 && (
            <div
              style={{
                position: "absolute",
                top: "76%",
                left: "30%",
                width: "40%",
                height: "16%",
                pointerEvents: "none",
                background: `linear-gradient(105deg, transparent ${stage2GlintProgress - 25}%, rgba(255, 230, 160, 0.5) ${stage2GlintProgress}%, transparent ${stage2GlintProgress + 25}%)`,
                mixBlendMode: "screen",
              }}
            />
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* STAGE 3: THE LEDGER OFFICIAL BILLBOARD (La Marque) */}
      {/* ============================================================ */}
      {stage3Visible && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: stage3Opacity,
            transform: `scale(${stage3Scale * goldBreathing})`,
            transformOrigin: "center center",
          }}
        >
          {/* Master Photorealistic Plate */}
          <Img
            src={staticFile(frame3Image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Cyan razor light slit traveling across the cut of the 'L' */}
          {cyanLaserPulse > 0 && cyanLaserPulse < 1 && (
            <div
              style={{
                position: "absolute",
                top: "33%",
                left: "41.5%",
                width: "17%",
                height: "17%",
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 3,
                  backgroundColor: "#38BDF8",
                  boxShadow: `0 0 15px #00F0FF, 0 0 35px #00F0FF, 0 0 60px rgba(56, 189, 248, ${cyanGlowIntensity})`,
                  transform: "rotate(-38deg)",
                  opacity: cyanGlowIntensity,
                }}
              />
            </div>
          )}

          {/* Floating subtle gold particle bokeh */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {particles.map((p) => {
              const currentY = (p.baseY - (frame - 100) * p.speed * 2) % 1080;
              const yPos = currentY < 0 ? currentY + 1080 : currentY;
              const fade = Math.sin(((frame + p.id * 10) / 20) % Math.PI);
              return (
                <div
                  key={p.id}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: yPos,
                    width: p.size,
                    height: p.size,
                    borderRadius: "50%",
                    backgroundColor: "#F59E0B",
                    opacity: p.opacity * Math.max(0.2, fade),
                    boxShadow: `0 0 ${p.size * 3}px #D4AF37`,
                  }}
                />
              );
            })}
          </div>

          {/* Vignette border for cinematic richness */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
            }}
          />
        </div>
      )}

      {/* Global subtle film grain */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0.045,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
};
