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

export interface MagazinePosterProps {
  imageSrc: string;
  title?: string;
  coverPosition?: string;
  cardWidth?: number;
  scale?: number;
  durationInFrames?: number;
  showTitle?: boolean;
}

export const MagazinePosterScene: React.FC<MagazinePosterProps> = ({
  imageSrc,
  title = "",
  coverPosition = "center center",
  cardWidth = 1500,
  scale = 1.0,
  showTitle = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const timeSec = frame / fps;

  // Resolve image source (Data URI, absolute/external URL, or Remotion staticFile)
  const resolvedSrc =
    imageSrc.startsWith("data:") ||
    imageSrc.startsWith("http://") ||
    imageSrc.startsWith("https://") ||
    imageSrc.startsWith("/")
      ? imageSrc
      : staticFile(imageSrc);

  // 1. Smooth, elegant spring entrance
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 95,
      mass: 0.9,
    },
  });

  const enterScale = interpolate(enterSpring, [0, 1], [0.88, 1.0]);
  const enterY = interpolate(enterSpring, [0, 1], [50, 0]);
  const enterRotY = interpolate(enterSpring, [0, 1], [-6, 0]);
  const enterOpacity = interpolate(enterSpring, [0, 0.25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 3. Alive 3D floating levitation & drift for the card container
  const floatY = Math.sin(timeSec * 1.3) * 16;
  const floatX = Math.cos(timeSec * 0.95) * 12;
  const floatRotZ = Math.sin(timeSec * 0.85) * 1.1;
  const floatRotY = Math.cos(timeSec * 0.75) * 2.5;
  const floatRotX = Math.sin(timeSec * 1.1) * 1.5;
  const breathingScale = 1.0 + Math.sin(timeSec * 0.8) * 0.016;

  // Slow, cinematic push-in (camera zoom throughout the shot)
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.045], {
    extrapolateRight: "clamp",
  });

  // Micro parallax drift for the image inside the mount
  const imageFloatY = Math.sin(timeSec * 1.6) * 4;
  const imageFloatX = Math.cos(timeSec * 1.3) * 3;

  // 4. Smooth, clean animated Royal Blue Gradient
  const lightSwayX = Math.sin(timeSec * 0.6) * 25;
  const lightSwayY = Math.cos(timeSec * 0.45) * 15;
  const lightPulse = 1.0 + Math.sin(timeSec * 1.1) * 0.07;

  // 5. Subtle tactile paper sheen sweeps across the document
  const sheen1 = interpolate(frame, [15, 65], [-130, 230], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sheen2 = interpolate(frame, [110, 160], [-130, 230], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const totalScale = enterScale * scale * breathingScale * cameraZoom;

  // Dynamic realistic drop shadow responding to elevation
  const shadowBlur = 85 - floatY * 1.5;
  const shadowSpread = -12 - floatY * 0.4;
  const shadowY = 38 - floatY * 0.8;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#082868",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* LAYER 1: Uniform, Vibrant Royal Blue Gradient */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, #1656c7 0%, #0d3889 45%, #07225c 85%, #051842 100%)",
        }}
      />

      {/* LAYER 2: Gentle Animated Royal Light Beam (Smooth, No Harsh Contrast) */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% + ${lightSwayX}px)`,
          top: `calc(40% + ${lightSwayY}px)`,
          width: 1450,
          height: 1200,
          transform: `translate(-50%, -50%) scale(${lightPulse})`,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(45, 120, 245, 0.32) 0%, rgba(20, 80, 200, 0.18) 45%, transparent 70%)",
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 3: Clean, Crisp Coordinate Grid (No Dots, Perfectly Uniform) */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 4: Soft Cinematic Edge Vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 160px 40px rgba(4, 16, 48, 0.55)",
          pointerEvents: "none",
        }}
      />

      {/* LAYER 5: Central Document / Article Card (Enlarged & Alive) */}
      <AbsoluteFill
        style={{
          perspective: 1600,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            maxWidth: cardWidth,
            transform: `
              translate3d(${floatX}px, ${enterY + floatY}px, 0)
              rotateX(${floatRotX}deg)
              rotateY(${enterRotY + floatRotY}deg)
              rotateZ(${floatRotZ}deg)
              scale(${totalScale})
            `,
            opacity: enterOpacity,
            transformStyle: "preserve-3d",

            // Clean, White/Paper Card Mounting (NO gold, clean crisp styling)
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
            padding: "12px",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            boxShadow: `
              0 ${shadowY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, 0.62),
              0 14px 30px -4px rgba(0, 0, 0, 0.38),
              0 0 1px rgba(0, 0, 0, 0.25)
            `,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Document Content Image Container with active movement */}
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 8,
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              padding: "4px",
            }}
          >
            <Img
              src={resolvedSrc}
              style={{
                height: 840,
                width: "auto",
                maxWidth: "100%",
                objectFit: "contain",
                objectPosition: coverPosition,
                display: "block",
                imageRendering: "auto",
                transform: `translate3d(${imageFloatX}px, ${imageFloatY}px, 0)`,
                transformOrigin: "center center",
              }}
            />

            {/* Subtle Diagonal Glossy Paper Sheen Sweep */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.22) 50%, transparent 60%)",
                transform: `translateX(${sheen1}%)`,
                pointerEvents: "none",
              }}
            />
            {frame >= 100 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, 0.18) 50%, transparent 60%)",
                  transform: `translateX(${sheen2}%)`,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>
        </div>

        {/* Optional Clean Title (Only if explicitly enabled, with clean modern type) */}
        {showTitle && title && (
          <div
            style={{
              marginTop: 18,
              transform: `
                translate3d(${floatX * 0.5}px, ${enterY + floatY * 0.5}px, 0)
                scale(${totalScale})
              `,
              opacity: enterOpacity,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.08em",
              color: "#FFFFFF",
              textTransform: "uppercase",
              textAlign: "center",
              textShadow: "0 2px 14px rgba(0, 0, 0, 0.7)",
              pointerEvents: "none",
            }}
          >
            {title}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
