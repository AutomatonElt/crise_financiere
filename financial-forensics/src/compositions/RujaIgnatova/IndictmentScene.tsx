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

export const IndictmentScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Camera drift & zoom over the document
    const docScale = interpolate(frame, [0, 180], [1.05, 1.3], { extrapolateRight: "clamp" });
    const docY = interpolate(frame, [0, 180], [0, -100], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bgAlt, overflow: "hidden" }}>

            <AbsoluteFill style={{ transform: `scale(${docScale}) translateY(${docY}px)`, justifyContent: "center", alignItems: "center" }}>
                {/* Wrapper for the document and highlights so they scale together */}
                <div style={{ position: "relative", width: "100%", height: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", backgroundColor: "black" }}>

                    <Img
                        src={staticFile("Faux_document.png")}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain", // Keep it fully visible within the frame
                            filter: "contrast(1.1) sepia(0.2) saturate(0.8)" // Slightly aged/official look
                        }}
                    />

                    {/* Highlight Lines - Placed near center. Editors can tweak top/left percentages to match text perfectly */}
                    <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ position: "relative", width: "600px", height: "800px" }}>

                            {/* Highlight 1: WIRE FRAUD */}
                            <HighlightLine startFrame={40} top="35%" left="15%" width={450} color={theme.colors.red} />

                            {/* Highlight 2: SECURITIES FRAUD */}
                            <HighlightLine startFrame={80} top="48%" left="18%" width={550} color={theme.colors.red} />

                            {/* Highlight 3: MONEY LAUNDERING */}
                            <HighlightLine startFrame={120} top="61%" left="12%" width={500} color={theme.colors.red} />

                            {/* Fake overlays for realism (SEALED stamp) */}
                            <Stamp startFrame={15} top="15%" right="5%" />

                        </div>
                    </div>
                </div>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};

// Sub-component: A fast-drawing marker line
const HighlightLine: React.FC<{ startFrame: number; top: string; left: string; width: number; color: string }> = ({ startFrame, top, left, width, color }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Snap marker effect (fast draw)
    const drawInfo = spring({ frame: frame - startFrame, fps, config: { damping: 11, stiffness: 180 } });
    const drawProgress = interpolate(Math.min(1, drawInfo), [0, 1], [0, width]);

    if (frame < startFrame) return null;

    return (
        <div style={{ position: "absolute", top, left, width, height: 60, mixBlendMode: "multiply", zIndex: 10 }}>
            {/* 
        We use an SVG path slightly curved to make it look like a human wrote it with a marker 
      */}
            <svg width={width + 20} height="60" style={{ overflow: "visible" }}>
                <path
                    d={`M 0 30 Q ${width / 2} 25 ${width} 35`}
                    stroke={color}
                    strokeWidth="45"
                    strokeLinecap="square"
                    strokeDasharray={width + 100}
                    strokeDashoffset={width + 100 - drawProgress}
                    fill="none"
                    opacity="0.8"
                />
            </svg>
        </div>
    );
};

// Sub-component: A heavy legal stamp
const Stamp: React.FC<{ startFrame: number; top: string; right: string }> = ({ startFrame, top, right }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - startFrame, fps, config: { damping: 10, mass: 1.2 } });

    if (frame < startFrame) return null;

    return (
        <div style={{
            position: "absolute",
            top, right,
            transform: `scale(${pop}) rotate(-12deg)`,
            opacity: Math.min(1, pop),
            color: "#8B0000",
            border: "10px solid #8B0000",
            padding: "20px 40px",
            borderRadius: 20,
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 80,
            fontWeight: 900,
            mixBlendMode: "multiply",
            pointerEvents: "none",
            boxShadow: "inset 0 0 10px rgba(139,0,0,0.5)"
        }}>
            SEALED
        </div>
    );
};
