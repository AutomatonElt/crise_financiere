import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
} from "remotion";
import { theme } from "../../theme";

export const FTXBitcoinScaleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const amountScale = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 95 },
    from: 1.36,
    to: 0.95,
  });

  const amountOpacity = interpolate(frame, [0, 10, 116, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const btcOpacity = interpolate(frame, [22, 42, 118, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const valueShift = spring({
    frame: frame - 12,
    fps,
    config: { damping: 12, stiffness: 100 },
    from: 0,
    to: 42,
  });

  const btcScale = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, stiffness: 110 },
    from: 0.65,
    to: 1.08,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#040b12",
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile("ethereum_coin.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(0.9) contrast(1.15) brightness(0.58)",
        }}
        muted
        loop
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(3,8,14,0.18) 0%, rgba(3,8,14,0.46) 30%, rgba(3,8,14,0.86) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          opacity: 0.2,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 150,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: amountOpacity,
          transform: `translateY(${valueShift}px) scale(${amountScale})`,
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
            textAlign: "center",
            textShadow: "0 0 30px rgba(255,255,255,0.14)",
            maxWidth: "70%",
          }}
        >
          $32,000,000,000
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 470,
          transform: "translateX(-50%)",
          width: 560,
          height: 6,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(255,255,255,0.1), rgba(212,175,55,0.9), rgba(255,70,87,0.9), rgba(255,255,255,0.1))",
          boxShadow: "0 0 18px rgba(212,175,55,0.7)",
          opacity: amountOpacity,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 560,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: btcOpacity,
          transform: `scale(${btcScale}) translateY(${Math.sin(frame / 14) * 4}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "10px 24px 10px 22px",
            borderRadius: 999,
            background: "rgba(7, 11, 18, 0.38)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(6px)",
          }}
        >
          <Img
            src={staticFile("bitcoin_coin_transparent.png")}
            style={{
              width: 96,
              height: 96,
              objectFit: "contain",
              filter: "drop-shadow(0 0 24px rgba(212,175,55,0.8))",
            }}
          />
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: 5,
              color: theme.colors.white,
              fontFamily: theme.fonts.heading,
              textTransform: "uppercase",
            }}
          >
            1 BTC
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          color: theme.colors.red,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 6,
          opacity: interpolate(frame, [100, 125], [0, 1], {
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
