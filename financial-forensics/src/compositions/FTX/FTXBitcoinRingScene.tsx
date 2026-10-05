import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, Video } from "remotion";
import { theme } from "../../theme";

const accountNodes = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  x: 16 + ((index * 11) % 64),
  y: 18 + ((index * 17) % 52),
  scale: 0.75 + ((index * 9) % 11) / 10,
  delay: index * 2.5,
  drift: (index % 3) * 10,
  tint: index % 2 === 0 ? "rgba(74,158,255,0.9)" : "rgba(245,245,245,0.82)",
}));

export const FTXBitcoinRingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animationProgress = Math.min(frame / 180, 1);
  const overlayOpacity = frame < 150 ? 1 : 0;
  const overlayFade = frame < 150 ? 1 : Math.max(0, 1 - (frame - 150) / 30);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile("main_anonyme_smartphone.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(0.8) contrast(1.12) brightness(0.52)",
        }}
        muted
        loop
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(3,8,14,0.20) 0%, rgba(3,8,14,0.42) 35%, rgba(3,8,14,0.75) 100%)",
          opacity: overlayFade,
        }}
      />

      {frame < 180 && (
        <>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: overlayFade,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 640,
                height: 640,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${1 + Math.sin(frame / 22) * 0.02})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 620,
                  height: 620,
                  border: `3px solid rgba(212,175,55,0.9)`,
                  borderRadius: "50%",
                  boxShadow: "0 0 32px rgba(212,175,55,0.52)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: 480,
                  height: 480,
                  border: "2px solid rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  width: 560,
                  height: 560,
                  borderRadius: "50%",
                  border: "1px dashed rgba(255,255,255,0.12)",
                  transform: `rotate(${frame * 0.18}deg)`,
                }}
              />

              <Img
                src={staticFile("bitcoin_coin_transparent.png")}
                style={{
                  width: 260,
                  height: 260,
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 36px rgba(212,175,55,0.9))",
                  transform: `scale(${1 + Math.sin(frame / 18) * 0.05})`,
                }}
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              right: 170,
              top: 150,
              fontSize: 72,
              fontWeight: 900,
              color: "rgba(255,255,255,0.88)",
              fontFamily: theme.fonts.heading,
              letterSpacing: 2,
              opacity: overlayOpacity * overlayFade,
            }}
          >
            1 BTC
          </div>

          {accountNodes.map((node) => {
            const travel = ((frame / fps) * (32 + node.scale * 24) + node.delay) % 130;
            const y = 18 + travel;
            const x = 18 + node.x;
            const opacity = 0.2 + ((Math.sin(frame / 8 + node.id) + 1) / 2) * 0.8;

            return (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: 16 + node.scale * 11,
                  height: 16 + node.scale * 11,
                  borderRadius: 8,
                  background: node.tint,
                  boxShadow: `0 0 12px ${node.tint}`,
                  opacity: opacity * overlayFade,
                  transform: `translateY(${node.drift * Math.sin(frame / 16 + node.id)}px) rotate(${frame * 0.3 + node.id * 8}deg)`,
                }}
              />
            );
          })}

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 80,
              textAlign: "center",
              color: theme.colors.red,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 5,
              textTransform: "uppercase",
              opacity: overlayFade,
            }}
          >
            Client balances collapse
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
