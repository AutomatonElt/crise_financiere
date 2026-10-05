import React from "react";
import { AbsoluteFill, Video, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";

export const FTXNineDaysScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overlayOpacity = frame < 150 ? 1 : Math.max(0, 1 - (frame - 150) / 30);
  const pulse = 0.96 + Math.sin(frame / 14) * 0.06;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      <Video
        src={staticFile("horloge.mp4")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "saturate(0.7) contrast(1.15) brightness(0.5)",
        }}
        muted
        loop
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(3,8,14,0.12) 0%, rgba(3,8,14,0.32) 30%, rgba(3,8,14,0.72) 100%)",
          opacity: overlayOpacity,
        }}
      />

      {frame < 180 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: overlayOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              padding: "32px 40px 28px 34px",
              borderRadius: 28,
              background: "rgba(5, 9, 18, 0.56)",
              border: "1px solid rgba(212,175,55,0.32)",
              boxShadow:
                "0 0 30px rgba(212,175,55,0.16), inset 0 0 18px rgba(212,175,55,0.08)",
              transform: `scale(${pulse})`,
            }}
          >
            <div
              style={{
                fontSize: 270,
                lineHeight: 0.9,
                fontWeight: 900,
                color: theme.colors.white,
                fontFamily: theme.fonts.heading,
                letterSpacing: -12,
                textShadow: "0 0 28px rgba(255,255,255,0.22)",
              }}
            >
              9
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  fontSize: 72,
                  letterSpacing: 14,
                  color: theme.colors.gold,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  lineHeight: 1,
                }}
              >
                DAYS
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 20,
                  letterSpacing: 8,
                  color: theme.colors.gray,
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                TO ZERO
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 90,
          textAlign: "center",
          color: theme.colors.red,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: overlayOpacity,
          textShadow: "0 0 18px rgba(230,57,70,0.5)",
        }}
      >
        Nine days to zero
      </div>
    </AbsoluteFill>
  );
};
