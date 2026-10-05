import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
  Img,
} from "remotion";
import { theme } from "../../theme";

export interface MagazinePosterProps {
  imageSrc: string;
  categoryBadge: string;
  title: string;
  subtitle: string;
  archiveRef: string;
  headlineQuote?: string;
  coverPosition?: string;
}

export const MagazinePosterScene: React.FC<MagazinePosterProps> = ({
  imageSrc,
  categoryBadge,
  title,
  subtitle,
  archiveRef,
  headlineQuote = "FULL-PAGE PROMOTIONAL FEATURE",
  coverPosition = "center center",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const timeSec = frame / fps;

  // 1. Entrance animation with elegant spring
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 14,
      stiffness: 90,
      mass: 0.95,
    },
  });

  const enterScale = interpolate(enterSpring, [0, 1], [0.88, 1.0]);
  const enterY = interpolate(enterSpring, [0, 1], [60, 0]);
  const enterRotY = interpolate(enterSpring, [0, 1], [-8, 0]);
  const enterRotX = interpolate(enterSpring, [0, 1], [5, 0]);
  const enterOpacity = interpolate(enterSpring, [0, 0.35], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 2. Continuous 3D floating & breathing levitation
  const floatY = Math.sin(timeSec * 1.05) * 8;
  const floatRotZ = Math.cos(timeSec * 0.8) * 0.4;
  const floatRotY = Math.sin(timeSec * 0.9) * 1.6;
  const breathingScale = 1.0 + Math.sin(timeSec * 0.7) * 0.012;

  // Slow, cinematic push-in
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.035], {
    extrapolateRight: "clamp",
  });

  // 3. Rich Animated Blue Gradient System
  // Orbiting main sapphire light beam
  const orbAngle = timeSec * 0.5;
  const orbX = 50 + Math.cos(orbAngle) * 18;
  const orbY = 44 + Math.sin(orbAngle * 1.2) * 14;

  // Secondary cobalt/cyan light beam
  const orb2Angle = timeSec * -0.4 + Math.PI;
  const orb2X = 50 + Math.cos(orb2Angle) * 22;
  const orb2Y = 52 + Math.sin(orb2Angle * 0.9) * 16;

  // Glowing pulse
  const pulseScale = 1.0 + Math.sin(timeSec * 1.4) * 0.09;
  const pulseScale2 = 1.0 + Math.cos(timeSec * 1.1) * 0.08;

  // 4. Diagonal Glossy Paper Sheen Sweep across the magazine
  const sheenProgress = interpolate(frame, [15, 60], [-130, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient dust / light particles
  const particles = [
    { x: 220, yBase: 900, speed: 0.8, size: 4, color: "#38BDF8", opacity: 0.35 },
    { x: 480, yBase: 960, speed: 1.2, size: 6, color: "#D4AF37", opacity: 0.28 },
    { x: 880, yBase: 880, speed: 0.7, size: 4, color: "#60A5FA", opacity: 0.4 },
    { x: 1380, yBase: 940, speed: 1.3, size: 7, color: "#D4AF37", opacity: 0.3 },
    { x: 1640, yBase: 910, speed: 1.0, size: 5, color: "#38BDF8", opacity: 0.35 },
    { x: 1050, yBase: 850, speed: 1.1, size: 5, color: "#93C5FD", opacity: 0.3 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#020714",
        overflow: "hidden",
        fontFamily: theme.fonts.body,
      }}
    >
      {/* LAYER 1: Deep Sapphire & Midnight Base Gradient */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, #0d2757 0%, #071536 45%, #020716 85%, #01040d 100%)",
        }}
      />

      {/* LAYER 2: Primary Dynamic Animated Royal Sapphire Beam */}
      <div
        style={{
          position: "absolute",
          left: `${orbX}%`,
          top: `${orbY}%`,
          width: 1100,
          height: 1100,
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37, 99, 235, 0.45) 0%, rgba(29, 78, 216, 0.26) 35%, rgba(14, 165, 233, 0.10) 60%, transparent 75%)",
          filter: "blur(75px)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 3: Secondary Shifting Cobalt / Electric Cyan Glow */}
      <div
        style={{
          position: "absolute",
          left: `${orb2X}%`,
          top: `${orb2Y}%`,
          width: 900,
          height: 900,
          transform: `translate(-50%, -50%) scale(${pulseScale2})`,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(14, 165, 233, 0.30) 0%, rgba(30, 58, 138, 0.20) 45%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 4: Warm Gold Contrast Accent (Luxury Documentary Feel) */}
      <div
        style={{
          position: "absolute",
          right: "18%",
          bottom: "12%",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.16) 0%, rgba(245, 158, 11, 0.05) 45%, transparent 70%)",
          filter: "blur(85px)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 5: Fine Forensic Coordinate Grid & Micro-markings */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          opacity: 0.85,
          pointerEvents: "none",
        }}
      />

      {/* Top Left Forensic Corner HUD */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 50,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          opacity: 0.65,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            fontWeight: 800,
            color: "#38BDF8",
          }}
        >
          FINANCIAL FORENSICS // ARCHIVE RECONSTRUCTION
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.15em",
            fontWeight: 600,
            color: "#94A3B8",
          }}
        >
          SOURCE_EVIDENCE // MEDIA_LEGITIMACY_CAMPAIGN
        </div>
      </div>

      {/* Top Right Coordinate HUD */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: 50,
          textAlign: "right",
          opacity: 0.65,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.22em",
            fontWeight: 800,
            color: "#D4AF37",
          }}
        >
          {archiveRef}
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.15em",
            fontWeight: 600,
            color: "#64748B",
          }}
        >
          STATUS // VERIFIED_EXHIBIT
        </div>
      </div>

      {/* Floating Bokeh Dust Particles */}
      {particles.map((p, idx) => {
        const yOffset = (frame * p.speed * 1.5) % 1100;
        const currentY = p.yBase - yOffset;
        const sway = Math.sin((frame + idx * 35) * 0.045) * 16;

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
              backgroundColor: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.color}`,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Edge Vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 160px 50px rgba(1, 4, 12, 0.85)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 6: Central Stage with 3D Luxury Poster Card */}
      <AbsoluteFill
        style={{
          perspective: 1600,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 610,
            transform: `
              translate3d(0, ${enterY + floatY}px, 0)
              rotateX(${enterRotX}deg)
              rotateY(${enterRotY + floatRotY}deg)
              rotateZ(${floatRotZ}deg)
              scale(${enterScale * breathingScale * cameraZoom})
            `,
            opacity: enterOpacity,
            transformStyle: "preserve-3d",

            // Prestigious Multi-contour Contours & Glass Border
            borderRadius: 24,
            background:
              "linear-gradient(165deg, rgba(14, 28, 60, 0.95) 0%, rgba(6, 14, 34, 0.98) 100%)",
            border: "1.5px solid rgba(212, 175, 55, 0.55)",
            boxShadow: `
              0 40px 110px -20px rgba(0, 0, 0, 0.96),
              0 0 70px rgba(37, 99, 235, 0.38),
              0 0 25px rgba(212, 175, 55, 0.22),
              inset 0 1px 0 rgba(255, 255, 255, 0.35),
              inset 0 0 30px rgba(37, 99, 235, 0.12)
            `,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Outer Contour Accent Ring (Internal 1px border) */}
          <div
            style={{
              position: "absolute",
              inset: 3,
              borderRadius: 20,
              border: "1px solid rgba(56, 189, 248, 0.22)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* Dossier Technical Header */}
          <div
            style={{
              padding: "16px 24px",
              backgroundColor: "rgba(5, 12, 28, 0.96)",
              borderBottom: "1.5px solid rgba(212, 175, 55, 0.3)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#D4AF37",
                  boxShadow: "0 0 10px #D4AF37",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  color: "#F1F5F9",
                  textTransform: "uppercase",
                }}
              >
                {categoryBadge}
              </span>
            </div>

            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#FBBF24",
                letterSpacing: "0.15em",
                backgroundColor: "rgba(212, 175, 55, 0.12)",
                padding: "3px 10px",
                borderRadius: 4,
                border: "1px solid rgba(212, 175, 55, 0.35)",
              }}
            >
              {archiveRef}
            </div>
          </div>

          {/* Magazine Cover Window with Passe-Partout Framing */}
          <div
            style={{
              position: "relative",
              width: "100%",
              backgroundColor: "#030816",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "16px 20px",
            }}
          >
            {/* The Magazine Cover Box */}
            <div
              style={{
                position: "relative",
                borderRadius: 10,
                overflow: "hidden",
                border: "1.5px solid rgba(255, 255, 255, 0.2)",
                boxShadow: `
                  0 20px 50px rgba(0, 0, 0, 0.85),
                  0 0 25px rgba(37, 99, 235, 0.25)
                `,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#02040A",
                maxHeight: 630,
              }}
            >
              <Img
                src={staticFile(imageSrc)}
                style={{
                  maxHeight: 630,
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  objectPosition: coverPosition,
                  display: "block",
                }}
              />

              {/* Diagonal Glossy Paper Sheen Sweep */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(115deg, transparent 38%, rgba(255, 255, 255, 0.26) 50%, transparent 62%)",
                  transform: `translateX(${sheenProgress}%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Inner Subtle Depth Vignette */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  boxShadow: "inset 0 0 25px rgba(0, 0, 0, 0.5)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Bottom Information & Typography Panel */}
          <div
            style={{
              padding: "20px 26px 22px 26px",
              backgroundColor: "rgba(5, 12, 28, 0.97)",
              borderTop: "1.5px solid rgba(212, 175, 55, 0.3)",
              display: "flex",
              flexDirection: "column",
              gap: 5,
              zIndex: 2,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: theme.fonts.display || "sans-serif",
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.7)",
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#38BDF8",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {subtitle}
            </div>

            <div
              style={{
                marginTop: 3,
                fontSize: 10,
                fontWeight: 600,
                color: "#94A3B8",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: "rgba(212, 175, 55, 0.9)" }}>▶</span>
              <span>{headlineQuote}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
