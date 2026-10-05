import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
} from "remotion";
import { theme } from "../../theme";

export const EpilogueTitleScene: React.FC = () => {
    const frame = useCurrentFrame();

    const text = "So what happened to everyone else in this story?";

    // Clean, slower typing speed: 1 character every 2 frames
    const charsToShow = Math.max(0, Math.floor((frame - 20) / 2));
    const displayedText = text.slice(0, charsToShow);

    // Subtle pulsing glow on the text after typing
    const isTypingComplete = charsToShow >= text.length;
    const glow = isTypingComplete ? Math.sin(frame / 15) * 10 + 20 : 0;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000000", // Pure black
                fontFamily: theme.fonts.heading, // More elegant cinematic font
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{
                maxWidth: 1400,
                textAlign: "center",
            }}>
                <div style={{
                    color: theme.colors.gold, // Gold text
                    fontSize: 72,
                    fontWeight: 900,
                    lineHeight: 1.4,
                    letterSpacing: 4,
                    textShadow: isTypingComplete ? `0 0 ${glow}px rgba(212,175,55,0.4)` : 'none',
                }}>
                    {displayedText}
                </div>
            </div>
        </AbsoluteFill>
    );
};
