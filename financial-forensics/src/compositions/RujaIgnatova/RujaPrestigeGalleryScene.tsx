import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
  Audio,
  Sequence,
} from "remotion";
import { theme } from "../../theme";

interface PhotoCardData {
  id: string;
  src: string;
  tag: string;
  title: string;
  sub: string;
  enterFrame: number;
  exitFrame: number | null; // null for the last card
  whooshFrame: number;
  baseRot: number;
}

const CARDS: PhotoCardData[] = [
  {
    id: "forbes",
    src: "gallery_ruja_forbes_clean.jpeg",
    tag: "FORBES BULGARIA",
    title: "BUSINESS WOMAN OF THE YEAR",
    sub: "COVER STORY & PRESTIGE PROFILE",
    enterFrame: 0,
    exitFrame: 48,
    whooshFrame: 0,
    baseRot: -1.5,
  },
  {
    id: "elegant",
    src: "gallery_ruja_elegant.jpg",
    tag: "MCKINSEY & COMPANY",
    title: "PHD IN LAW · OXFORD & KONSTANZ",
    sub: "ASSOCIATE PARTNER & PRIVATE EQUITY",
    enterFrame: 48,
    exitFrame: 98,
    whooshFrame: 48,
    baseRot: 1.8,
  },
  {
    id: "podium",
    src: "gallery_ruja_podium.jpg",
    tag: "GLOBAL FINANCIAL FORUM",
    title: "INTERNATIONAL KEYNOTE SPEAKER",
    sub: "CONFERENCE GUEST OF HONOR",
    enterFrame: 98,
    exitFrame: null, // stays until end (150)
    whooshFrame: 98,
    baseRot: -0.8,
  },
];

export const RujaPrestigeGalleryScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Floating ambient gold dust / bokeh particles
  const particles = [
    { x: 260, yBase: 900, speed: 1.1, size: 5, opacity: 0.2 },
    { x: 580, yBase: 980, speed: 1.5, size: 7, opacity: 0.3 },
    { x: 960, yBase: 880, speed: 0.9, size: 4, opacity: 0.25 },
    { x: 1380, yBase: 940, speed: 1.7, size: 8, opacity: 0.35 },
    { x: 1700, yBase: 910, speed: 1.3, size: 6, opacity: 0.25 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050811",
        overflow: "hidden",
        fontFamily: theme.fonts.body,
      }}
    >
      {/* 1. Audio whoosh triggers on card arrivals */}
      {CARDS.map((card) => (
        <Sequence
          key={`audio-${card.id}`}
          from={card.whooshFrame}
          durationInFrames={20}
        >
          <Audio src={staticFile("whoosh_medium.wav")} volume={0.20} />
        </Sequence>
      ))}

      {/* 2. Deep Cinematic Obsidian/Navy Radial Background */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, #0F1B33 0%, #070D1A 55%, #020408 100%)",
        }}
      />

      {/* 3. Micro Forensic Grid Texture */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.035) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          opacity: 0.75,
        }}
      />

      {/* 4. Ambient Dynamic Spotlight Glow behind cards */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 900,
            height: 900,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(30, 58, 110, 0.18) 45%, transparent 70%)",
            transform: `scale(${1.0 + Math.sin(frame * 0.08) * 0.05})`,
            filter: "blur(40px)",
          }}
        />
      </AbsoluteFill>

      {/* 5. Floating Gold Dust Particles */}
      {particles.map((p, idx) => {
        const yOffset = (frame * p.speed * 1.8) % 1100;
        const currentY = p.yBase - yOffset;
        const sway = Math.sin((frame + idx * 30) * 0.05) * 20;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: p.x + sway,
              top: currentY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: "#D4AF37",
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px rgba(212, 175, 55, 0.8)`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* 6. Subtle Vignette Border Overlay */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 160px 50px rgba(0, 0, 0, 0.85)",
          pointerEvents: "none",
        }}
      />

      {/* 7. 3D Card Stage with Sequential Dancing Swaps */}
      <AbsoluteFill
        style={{
          perspective: 1500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {CARDS.map((card) => {
          // Card lifecycle:
          // 1. Before enterFrame: not visible
          if (frame < card.enterFrame) {
            return null;
          }

          // 2. Entrance animation using lively spring
          const enterProgress = spring({
            frame: frame - card.enterFrame,
            fps,
            config: {
              damping: 12,
              stiffness: 115,
              mass: 0.85,
            },
          });

          // Enter translation: swings from +1250px to 0 with spring overshoot bounce
          const enterX = interpolate(enterProgress, [0, 1], [1250, 0]);
          const enterRotZ = interpolate(enterProgress, [0, 1], [11, card.baseRot]);
          const enterRotY = interpolate(enterProgress, [0, 1], [-22, 0]);
          const enterScale = interpolate(enterProgress, [0, 1], [0.86, 1.0]);

          // Alive dancing floating motion once in center
          const activeTime = frame - card.enterFrame;
          const danceY = Math.sin(activeTime * 0.22) * 7;
          const danceRotZ = Math.cos(activeTime * 0.17) * 0.9;
          const danceRotY = Math.sin(activeTime * 0.19) * 2.2;
          const danceScale = 1.0 + Math.sin(activeTime * 0.13) * 0.015;

          // 3. Exit animation if this card exits
          let exitX = 0;
          let exitRotZ = 0;
          let exitRotY = 0;
          let exitOpacity = 1;

          if (card.exitFrame !== null && frame >= card.exitFrame) {
            const exitDuration = 13; // frames for exit transition
            const rawExit = (frame - card.exitFrame) / exitDuration;
            const clampedExit = Math.min(Math.max(rawExit, 0), 1);

            // Power curve ease-out for energetic swoosh away
            const easeOutCurve = Math.pow(clampedExit, 2.2);

            exitX = -easeOutCurve * 1350;
            exitRotZ = -easeOutCurve * 14;
            exitRotY = easeOutCurve * 20;
            exitOpacity = interpolate(clampedExit, [0.55, 1], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // If fully exited, don't render
            if (frame >= card.exitFrame + exitDuration + 1) {
              return null;
            }
          }

          // Composite transforms
          const totalX = enterX + exitX;
          const totalY = danceY;
          const totalRotZ = enterRotZ + danceRotZ + exitRotZ;
          const totalRotY = enterRotY + danceRotY + exitRotY;
          const totalScale = enterScale * danceScale;

          // Dimensions: Hero large size!
          const cardWidth = 740;
          const cardHeight = 850;

          return (
            <div
              key={card.id}
              style={{
                position: "absolute",
                width: cardWidth,
                height: cardHeight,
                transform: `
                  translate3d(${totalX}px, ${totalY}px, 0px)
                  rotateZ(${totalRotZ}deg)
                  rotateY(${totalRotY}deg)
                  scale(${totalScale})
                `,
                opacity: exitOpacity,
                transformStyle: "preserve-3d",
                borderRadius: 20,
                overflow: "hidden",
                border: "1.5px solid rgba(212, 175, 55, 0.4)",
                boxShadow: `
                  0 30px 80px -15px rgba(0, 0, 0, 0.9),
                  0 0 45px rgba(212, 175, 55, 0.18),
                  inset 0 0 20px rgba(212, 175, 55, 0.08)
                `,
                backgroundColor: "#0A0E18",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Photo Hero Container */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: 710,
                  overflow: "hidden",
                  backgroundColor: "#070B14",
                }}
              >
                <Img
                  src={staticFile(card.src)}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: card.id === "podium" ? "center 15%" : "center 20%",
                  }}
                />

                {/* Subtle luxury photo sheen & inner edge vignette */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.6)",
                    background:
                      "linear-gradient(180deg, rgba(212, 175, 55, 0.08) 0%, transparent 25%, transparent 70%, rgba(6, 10, 18, 0.85) 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Top Corner Technical / Evidence Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "5px 12px",
                    borderRadius: 6,
                    backgroundColor: "rgba(6, 10, 18, 0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(212, 175, 55, 0.35)",
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: "#D4AF37",
                      boxShadow: "0 0 8px #D4AF37",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: "#E2E8F0",
                      textTransform: "uppercase",
                    }}
                  >
                    {card.tag}
                  </span>
                </div>

                {/* Top Right Archive Reference */}
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 20,
                    padding: "5px 10px",
                    borderRadius: 6,
                    backgroundColor: "rgba(6, 10, 18, 0.75)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    color: "rgba(212, 175, 55, 0.8)",
                  }}
                >
                  ARCHIVE // 0{CARDS.indexOf(card) + 1}
                </div>
              </div>

              {/* Bottom Caption Information Panel */}
              <div
                style={{
                  height: 140,
                  backgroundColor: "rgba(8, 12, 22, 0.96)",
                  padding: "16px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  borderTop: "1px solid rgba(212, 175, 55, 0.25)",
                }}
              >
                <div
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: 5,
                    fontFamily: theme.fonts.display || "sans-serif",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#94A3B8",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  {card.sub}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
