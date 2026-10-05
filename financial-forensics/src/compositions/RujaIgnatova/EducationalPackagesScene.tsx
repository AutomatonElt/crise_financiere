import React from "react";
import {
    AbsoluteFill,
    Sequence,
    spring,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    Img,
    staticFile,
} from "remotion";
import { theme } from "../../theme";

export const EducationalPackagesScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // STAGE 1: 0 - 120 (Exchange + X)
    const drawX = spring({ frame: frame - 45, fps, config: { damping: 12 } });
    const scaleX = interpolate(drawX, [0, 1], [3, 1], { extrapolateRight: "clamp" });
    const opacityX = interpolate(drawX, [0, 1], [0, 1]);

    // STAGE 2 & 3: 120 - 450 (Packages & Tokens)
    const introDoc = spring({ frame: frame - 120, fps, config: { damping: 14 } });

    // STAGE 4: 430 - 600 (Graph going up)
    const graphProgress = spring({ frame: frame - 430, fps, config: { damping: 200 } }); // very slow draw
    const textSoon = spring({ frame: frame - 480, fps, config: { damping: 12 } });

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, color: theme.colors.white, fontFamily: theme.fonts.body }}>

            {/* 1. Exchange Screen */}
            <Sequence from={0} durationInFrames={120}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                    <div style={{
                        padding: "60px 100px",
                        backgroundColor: theme.colors.surface,
                        borderRadius: 20,
                        border: `2px solid ${theme.colors.gridLine}`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
                    }}>
                        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: theme.sizes.titleMedium, color: theme.colors.white, marginBottom: 80 }}>Crypto Exchange</h1>
                        <div style={{
                            backgroundColor: theme.colors.green,
                            color: theme.colors.bg,
                            padding: "40px 120px",
                            borderRadius: 15,
                            fontSize: theme.sizes.titleSmall,
                            fontWeight: "bold",
                            position: "relative"
                        }}>
                            BUY COINS
                            {/* The big red X */}
                            <div style={{
                                position: "absolute",
                                top: "50%", left: "50%",
                                transform: `translate(-50%, -50%) scale(${scaleX})`,
                                opacity: opacityX,
                                fontSize: 240,
                                color: theme.colors.red,
                                fontWeight: 900,
                                textShadow: "0 10px 30px rgba(0,0,0,0.8)"
                            }}>
                                ✗
                            </div>
                        </div>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* 2. Educational Packages */}
            <Sequence from={120} durationInFrames={330}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 100 }}>
                    <div style={{
                        transform: `translateY(${(1 - introDoc) * 100}px)`,
                        opacity: introDoc,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%"
                    }}>
                        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: theme.sizes.titleLarge, color: theme.colors.gold, marginBottom: 120 }}>EDUCATIONAL PACKAGES</h1>

                        <div style={{ display: "flex", justifyContent: "space-between", width: "90%", gap: 60 }}>
                            <PackageTier frame={frame} startFrame={160} name="STARTER" price="€110" coins={2} />
                            <PackageTier frame={frame} startFrame={210} name="TYCOON" price="€5,000" coins={5} />
                            <PackageTier frame={frame} startFrame={260} name="DIAMOND" price="€27,500" coins={8} />
                        </div>
                    </div>
                </AbsoluteFill>
            </Sequence>

            {/* 3. The Graph and "Coming Soon" */}
            <Sequence from={450} durationInFrames={150}>
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                    <svg width="1400" height="800" viewBox="0 0 1400 800" style={{ overflow: 'visible' }}>
                        <defs>
                            <linearGradient id="lineGrad" x1="0" y1="1" x2="1" y2="0">
                                <stop offset="0%" stopColor={theme.colors.goldDim} />
                                <stop offset="100%" stopColor={theme.colors.gold} />
                            </linearGradient>
                        </defs>
                        {/* Fake grid */}
                        <line x1="0" y1="800" x2="1400" y2="800" stroke={theme.colors.gridLine} strokeWidth="6" />
                        <line x1="0" y1="0" x2="0" y2="800" stroke={theme.colors.gridLine} strokeWidth="6" />
                        <line x1="0" y1="400" x2="1400" y2="400" stroke={theme.colors.gridLine} strokeWidth="3" strokeDasharray="10 10" />

                        {/* Exponential looking curve */}
                        <path
                            d="M 0 800 C 600 800, 900 300, 1400 0"
                            fill="none"
                            stroke="url(#lineGrad)"
                            strokeWidth="16"
                            strokeDasharray="2200"
                            strokeDashoffset={2200 - (graphProgress * 2200)}
                            strokeLinecap="round"
                        />
                    </svg>

                    <div style={{
                        position: "absolute",
                        top: 200,
                        left: 300,
                        transform: `scale(${textSoon})`,
                        opacity: textSoon,
                        display: "flex",
                        flexDirection: "column",
                        textShadow: "0 10px 30px rgba(0,0,0,0.8)",
                    }}>
                        <span style={{ fontSize: theme.sizes.titleLarge * 1.5, fontFamily: theme.fonts.heading, color: theme.colors.gold, fontWeight: "bold", lineHeight: 1 }}>ONECOIN</span>
                        <span style={{ fontSize: theme.sizes.titleSmall, color: theme.colors.white, marginTop: 10 }}>COMING TO A REAL EXCHANGE</span>
                        <span style={{ fontSize: theme.sizes.titleLarge, color: theme.colors.red, marginTop: 20, fontWeight: 900 }}>SOON...</span>
                    </div>
                </AbsoluteFill>
            </Sequence>

        </AbsoluteFill>
    );
};

// Helper component for Package tiers
const PackageTier: React.FC<{ frame: number; startFrame: number; name: string; price: string; coins: number }> = ({ frame, startFrame, name, price, coins }) => {
    const { fps } = useVideoConfig();
    const pop = spring({ frame: frame - startFrame, fps, config: { damping: 12 } });

    return (
        <div style={{
            transform: `scale(${pop})`,
            opacity: pop,
            backgroundColor: theme.colors.surface,
            border: `2px solid ${theme.colors.gridLine}`,
            borderRadius: 20,
            padding: "60px 40px",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            position: "relative"
        }}>
            <h2 style={{ fontSize: theme.sizes.body, color: theme.colors.gray, marginBottom: 20 }}>{name}</h2>
            <div style={{ fontSize: theme.sizes.titleMedium, fontWeight: "bold", color: theme.colors.white }}>{price}</div>

            {/* Coins Container */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 15, marginTop: 60 }}>
                {Array.from({ length: coins }).map((_, i) => {
                    const coinPop = spring({ frame: frame - (startFrame + 40 + i * 8), fps, config: { damping: 10 } });
                    return (
                        <div key={i} style={{
                            transform: `scale(${coinPop})`,
                            opacity: coinPop,
                            width: 80, height: 80,
                            borderRadius: "50%",
                            overflow: "hidden",
                            boxShadow: "0 5px 15px rgba(212, 175, 55, 0.4)",
                            backgroundColor: theme.colors.goldDim,
                        }}>
                            <Img src={staticFile("onecoin.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
