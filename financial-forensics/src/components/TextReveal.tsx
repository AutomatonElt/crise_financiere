import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type TextRevealProps = {
  // Sequence of text items to reveal one after another
  items: {
    text: string;
    // "appear" = fades in, "vanish" = fades out, "hold" = stays visible
    action: "appear" | "vanish" | "hold";
    // Duration in frames for this step
    duration: number;
    // Optional font size override
    fontSize?: number;
    // Optional color override
    color?: string;
    // Optional: show as subtitle/smaller text
    subtitle?: boolean;
  }[];
  startFrame?: number;
  // Optional background image URL (for realism)
  backgroundImage?: string;
  // Optional: darken background
  bgOpacity?: number;
  // Optional: final text that stays (like "FRAUD" or "$4B")
  finalText?: {
    text: string;
    color?: string;
    fontSize?: number;
  };
};

export const TextReveal: React.FC<TextRevealProps> = ({
  items,
  startFrame = 15,
  backgroundImage,
  bgOpacity = 0.85,
  finalText,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Compute cumulative frame offsets for each item
  let cumulative = startFrame;
  const itemTimings = items.map((item) => {
    const start = cumulative;
    const end = start + item.duration;
    cumulative = end;
    return { start, end };
  });

  // Determine which items are currently visible and their opacity
  const visibleItems = items.map((item, i) => {
    const { start, end } = itemTimings[i];
    if (frame < start) return { text: item.text, opacity: 0, y: 20, item };

    if (item.action === "appear") {
      const opacity = interpolate(frame, [start, start + 10], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const y = interpolate(frame, [start, start + 10], [20, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      return { text: item.text, opacity, y, item };
    }

    if (item.action === "vanish") {
      const opacity = interpolate(frame, [start, start + 10], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      const y = interpolate(frame, [start, start + 10], [0, -20], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });
      return { text: item.text, opacity, y, item };
    }

    // hold
    return { text: item.text, opacity: 1, y: 0, item };
  });

  // Final text appears after all items
  const finalStart = itemTimings.length > 0 ? itemTimings[itemTimings.length - 1].end : startFrame;
  const finalOpacity = finalText
    ? spring({
        frame: frame - finalStart,
        fps,
        config: { damping: 12 },
        from: 0,
        to: 1,
      })
    : 0;
  const finalScale = finalText
    ? spring({
        frame: frame - finalStart,
        fps,
        config: { damping: 10, stiffness: 120 },
        from: 0.5,
        to: 1,
      })
    : 1;

  // Glow pulse for final text
  const glowPulse = finalText && frame > finalStart + 15
    ? interpolate(
        Math.sin((frame - finalStart) * 0.1),
        [-1, 1],
        [0.3, 0.7]
      )
    : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.bg,
        position: "relative",
        fontFamily: theme.fonts.body,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: bgOpacity,
          }}
        />
      )}
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: theme.colors.bg,
          opacity: backgroundImage ? 1 - bgOpacity : 0.6,
        }}
      />

      {/* Text items */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        {visibleItems.map((vi, i) => {
          if (vi.opacity <= 0) return null;
          const fs = vi.item.fontSize ?? (vi.item.subtitle ? theme.sizes.bodySmall : theme.sizes.titleMedium);
          const col = vi.item.color ?? theme.colors.white;
          return (
            <div
              key={`item-${i}`}
              style={{
                fontSize: fs,
                fontWeight: vi.item.subtitle ? "normal" : "bold",
                color: col,
                fontFamily: vi.item.subtitle ? theme.fonts.body : theme.fonts.heading,
                opacity: vi.opacity,
                transform: `translateY(${vi.y}px)`,
                letterSpacing: vi.item.subtitle ? 0 : 3,
                textShadow: `0 0 30px ${col}40`,
              }}
            >
              {vi.text}
            </div>
          );
        })}

        {/* Final text */}
        {finalText && finalOpacity > 0 && (
          <div
            style={{
              fontSize: finalText.fontSize ?? theme.sizes.titleLarge,
              fontWeight: "bold",
              color: finalText.color ?? theme.colors.red,
              fontFamily: theme.fonts.heading,
              opacity: finalOpacity,
              transform: `scale(${finalScale})`,
              letterSpacing: 4,
              textShadow: `0 0 ${20 + glowPulse * 40}px ${finalText.color ?? theme.colors.red}${Math.floor(glowPulse * 100).toString(16).padStart(2, "0")}`,
              marginTop: 30,
            }}
          >
            {finalText.text}
          </div>
        )}
      </div>
    </div>
  );
};
