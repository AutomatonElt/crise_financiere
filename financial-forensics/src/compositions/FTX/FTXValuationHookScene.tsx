import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { theme } from "../../theme";

export const FTXValuationHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = spring({
    frame: frame - 2,
    fps,
    config: { damping: 12, stiffness: 180 },
    from: 0.8,
    to: 1.12,
  });

  const globalDrift = Math.sin(frame / 24) * 6;
  const panGlow = 0.75 + 0.25 * Math.sin(frame / 18);

  const valuedAtOpacity = interpolate(frame, [18, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const valueOpacity = interpolate(frame, [34, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btcOpacity = interpolate(frame, [52, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const valueScale = spring({
    frame: frame - 38,
    fps,
    config: { damping: 14, stiffness: 140 },
    from: 0.88,
    to: 1.05,
  });

  const btcRise = spring({
    frame: frame - 58,
    fps,
    config: { damping: 10, stiffness: 120 },
    from: 0.7,
    to: 1.1,
  });

  const underline = interpolate(frame, [54, 86], [0, 560], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 38%, rgba(74,158,255,0.14), transparent 32%), radial-gradient(circle at 70% 28%, rgba(212,175,55,0.10), transparent 25%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage: "radial-gradient(circle at center, black 48%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 88 + globalDrift,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 42,
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 ${24 + panGlow * 18}px rgba(74,158,255,0.55))`,
        }}
      >
        <Img
          src={staticFile("ftx/ftt-logo.png")}
          style={{
            width: 220,
            height: 220,
            objectFit: "contain",
            filter: "drop-shadow(0 0 26px rgba(72,169,255,0.55))",
          }}
        />
        <div
          style={{
            fontSize: 220,
            fontWeight: 900,
            letterSpacing: 2,
            color: theme.colors.white,
            fontFamily: theme.fonts.heading,
            lineHeight: 1,
            textShadow: "0 0 40px rgba(255,255,255,0.22)",
          }}
        >
          FTX
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 350 + globalDrift * 0.4,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: valuedAtOpacity,
          transform: `translateY(${globalDrift * 0.2}px)`,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 30,
            letterSpacing: 8,
            color: theme.colors.gray,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Valued at
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 420 + globalDrift * 0.5,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: valueOpacity,
          transform: `scale(${valueScale}) translateY(${globalDrift * 0.3}px)`,
          zIndex: 3,
        }}
      >
        <div
          style={{
            fontSize: 118,
            lineHeight: 1,
            fontWeight: 900,
            color: theme.colors.white,
            fontFamily: theme.fonts.heading,
            letterSpacing: -4,
            textShadow: "0 0 24px rgba(255,255,255,0.08)",
            transform: `scale(${1 + Math.sin(frame / 20) * 0.012})`,
          }}
        >
          $32,000,000,000
        </div>

        <div
          style={{
            marginTop: 26,
            width: underline,
            height: 4,
            background: `linear-gradient(90deg, ${theme.colors.gold}, ${theme.colors.red})`,
            borderRadius: 99,
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: `0 0 18px rgba(212,175,55,0.7)`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: 140,
          top: 590 + globalDrift * 0.5,
          display: "flex",
          alignItems: "center",
          gap: 22,
          opacity: btcOpacity,
          transform: `scale(${btcRise}) translateY(${Math.sin(frame / 16) * 5}px)`,
          zIndex: 2,
        }}
      >
        <Img
          src={staticFile("bitcoin_coin_transparent.png")}
          style={{
            width: 260,
            height: 260,
            objectFit: "contain",
            filter: "drop-shadow(0 0 34px rgba(212,175,55,0.9))",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 5,
              color: theme.colors.gray,
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Backing
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: theme.colors.gold,
              fontFamily: theme.fonts.heading,
            }}
          >
            1 BTC
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          color: theme.colors.red,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 6,
          opacity: interpolate(frame, [70, 105], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          textTransform: "uppercase",
        }}
      >
        Then the collapse began
      </div>
    </AbsoluteFill>
  );
};
