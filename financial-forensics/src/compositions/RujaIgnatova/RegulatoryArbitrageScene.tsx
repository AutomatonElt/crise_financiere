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

export const RegulatoryArbitrageScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const halfWidth = width / 2;

    // ── Left Side Anim: Selling an Investment ──
    const leftOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const tokenScale = spring({ frame: frame - 20, fps, config: { damping: 12 } });

    // Regulation slam
    const slam = spring({ frame: frame - 75, fps, config: { mass: 2, damping: 10 } });
    const redOverlay = interpolate(frame, [75, 80], [0, 0.15], { extrapolateRight: "clamp" });

    // ── Right Side Anim: Educational Package Wrapper ──
    const rightOpacity = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" });
    const boxScale = spring({ frame: frame - 140, fps, config: { damping: 14 } });

    // Wrapper logic (bonus tokens)
    const tokenBonusScale = spring({ frame: frame - 200, fps, config: { damping: 12 } });
    const grayOverlay = interpolate(frame, [260, 280], [0, 1], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body, display: "flex", flexDirection: "row" }}>

            {/* ── LEFT PANEL: SELLING AN INVESTMENT ── */}
            <div style={{
                width: halfWidth, height: "100%", position: "relative",
                borderRight: `2px solid ${theme.colors.gridLine}`,
                opacity: leftOpacity, display: "flex", flexDirection: "column",
                alignItems: "center", paddingTop: 80,
            }}>
                {/* Red tint on slam */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: theme.colors.red, opacity: redOverlay, zIndex: 0 }} />

                <div style={{ fontSize: theme.sizes.body, color: theme.colors.gray, letterSpacing: 4, textTransform: "uppercase", zIndex: 1 }}>
                    Direct Approach
                </div>
                <div style={{ fontSize: theme.sizes.titleSmall, fontWeight: "bold", color: theme.colors.white, marginTop: 15, fontFamily: theme.fonts.heading, zIndex: 1 }}>
                    "Selling an Investment"
                </div>

                {/* The Naked Token */}
                <div style={{ position: "absolute", top: 250, transform: `scale(${tokenScale})`, zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Img src={staticFile("bitcoin_coin_transparent.png")} style={{ width: 250, filter: `drop-shadow(0 15px 30px rgba(212,175,55,0.4))` }} />
                    <div style={{ marginTop: 30, color: theme.colors.gold, fontSize: 24, fontWeight: "bold", letterSpacing: 2 }}>NAKED CRYPTO TOKEN</div>
                </div>

                {/* Regulator Slam */}
                {frame > 75 && (
                    <div style={{ position: "absolute", top: 280, transform: `scale(${slam}) rotate(-12deg)`, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Img src={staticFile("sec_red_tape_transparent.png")} style={{ width: 600, filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.8))` }} />
                        <div style={{
                            marginTop: 20, backgroundColor: theme.colors.red, padding: "12px 30px", borderRadius: 8,
                            color: theme.colors.white, fontSize: 28, fontWeight: 900, letterSpacing: 3,
                            boxShadow: "0 10px 20px rgba(230,57,70,0.4)"
                        }}>SEC JURISDICTION — IMMEDIATE ACTION</div>
                    </div>
                )}
            </div>

            {/* ── RIGHT PANEL: SELLING AN EDUCATIONAL PACKAGE ── */}
            <div style={{
                width: halfWidth, height: "100%", position: "relative",
                opacity: rightOpacity, display: "flex", flexDirection: "column",
                alignItems: "center", paddingTop: 80,
            }}>
                <div style={{ fontSize: theme.sizes.body, color: theme.colors.gray, letterSpacing: 4, textTransform: "uppercase" }}>
                    The Loophole
                </div>
                <div style={{ fontSize: theme.sizes.titleSmall, fontWeight: "bold", color: theme.colors.white, marginTop: 15, fontFamily: theme.fonts.heading }}>
                    "Selling an Educational Package"
                </div>

                {/* The Wrapper / Box */}
                <div style={{ position: "absolute", top: 220, transform: `scale(${boxScale})`, display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2 }}>
                    <Img src={staticFile("educational_course_box_transparent.png")} style={{ width: 450, filter: `drop-shadow(0 15px 40px rgba(0,0,0,0.6))` }} />
                    <div style={{ marginTop: -20, backgroundColor: theme.colors.surface, border: `2px solid ${theme.colors.blue}`, padding: "10px 40px", borderRadius: 30, color: theme.colors.blue, fontSize: 22, fontWeight: "bold", letterSpacing: 2 }}>THE WRAPPER</div>
                </div>

                {/* The "Bonus" Token attached */}
                {frame > 200 && (
                    <div style={{ position: "absolute", top: 400, left: halfWidth / 2 + 120, transform: `scale(${tokenBonusScale}) rotate(15deg)`, zIndex: 3, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                        <div style={{ display: "flex", alignItems: "center", backgroundColor: theme.colors.goldDim, padding: "8px 16px", borderRadius: 20, marginBottom: -20, zIndex: 4, boxShadow: "0 5px 15px rgba(0,0,0,0.5)" }}>
                            <span style={{ color: theme.colors.white, fontWeight: "bold", fontSize: 18 }}>"FREE BONUS"</span>
                        </div>
                        <Img src={staticFile("bitcoin_coin_transparent.png")} style={{ width: 140, filter: `drop-shadow(0 10px 20px rgba(212,175,55,0.4))` }} />
                    </div>
                )}

                {/* Regulatory Gray Area Stamp */}
                {frame > 260 && (
                    <div style={{
                        position: "absolute", top: 120, left: 100, width: 760,
                        opacity: grayOverlay, zIndex: 1, border: `4px dashed ${theme.colors.gray}`,
                        height: 700, borderRadius: 20, backgroundColor: "rgba(139,146,168,0.05)",
                        display: "flex", justifyContent: "center", alignItems: "flex-end", paddingBottom: 40
                    }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ color: theme.colors.white, fontSize: 26, fontWeight: 900, letterSpacing: 3, textTransform: "uppercase" }}>Murky Legal Category</div>
                            <div style={{ color: theme.colors.gray, fontSize: 20, marginTop: 10, letterSpacing: 1 }}>Slower/Harder for Regulators to act</div>
                        </div>
                    </div>
                )}
            </div>

        </AbsoluteFill>
    );
};
