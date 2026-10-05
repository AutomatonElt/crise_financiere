import React, { useMemo } from "react";
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

// Deterministic pseudo-random based on seed
const seededRandom = (seed: number) => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
};

// A single animated crypto coin
const CryptoCoin: React.FC<{
    index: number;
    totalCoins: number;
    startFrame: number;
}> = ({ index, totalCoins, startFrame }) => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Each coin spawns at a slightly different frame
    const spawnDelay = index * 4;
    const localFrame = frame - startFrame - spawnDelay;

    if (localFrame < 0) return null;

    // Deterministic position per coin
    const rx = seededRandom(index * 3 + 0);
    const ry = seededRandom(index * 3 + 1);
    const rsize = seededRandom(index * 3 + 2);
    const rdrift = seededRandom(index * 5 + 7) * 2 - 1; // horizontal drift -1 to 1

    const size = 28 + rsize * 40; // 28-68px
    const startX = rx * width;
    const startY = -size - ry * 200; // starts above screen

    // Fall physics — gravity feel
    const fallY = localFrame * (2 + rsize * 2) + 0.02 * localFrame * localFrame;
    const driftX = rdrift * localFrame * 0.5;

    const opacity = spring({ frame: localFrame, fps, config: { damping: 15 } });

    if (startY + fallY > height + size) return null; // off screen

    return (
        <div
            style={{
                position: "absolute",
                left: startX + driftX,
                top: startY + fallY,
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: theme.colors.gold,
                border: `3px solid #f5c842`,
                boxShadow: `0 0 ${size * 0.3}px rgba(212,175,55,0.7), inset 0 0 ${size * 0.2}px rgba(255,200,50,0.4)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: Math.min(opacity, 0.9),
                transform: `rotate(${localFrame * (rdrift * 3)}deg)`,
                zIndex: 8,
            }}
        >
            <div
                style={{
                    color: "#8a6000",
                    fontSize: size * 0.38,
                    fontWeight: 900,
                    fontFamily: "serif",
                    userSelect: "none",
                }}
            >
                ₿
            </div>
        </div>
    );
};

export const FinalClosingScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const TOTAL_COINS = 120;
    // Coins start spawning at frame 30, staggered  
    const COIN_SPAWN_START = 30;

    // Ruja portrait
    const portraitOp = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
    const portraitScale = interpolate(frame, [0, 50], [1.08, 1], { extrapolateRight: "clamp" });

    // Quote lines fade in sequentially
    const line1Op = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
    const line2Op = interpolate(frame, [120, 150], [0, 1], { extrapolateRight: "clamp" });
    const line3Op = interpolate(frame, [180, 210], [0, 1], { extrapolateRight: "clamp" });

    // Title ("RUJA IGNATOVA") revealed early
    const nameOp = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp" });
    const namePop = spring({ frame: frame - 20, fps, config: { damping: 12 } });

    // Dark vignette intensifies as coins pile up
    const vignetteIntensity = interpolate(frame, [100, 550], [0.3, 0.75], { extrapolateRight: "clamp" });

    // Every coin is rendered from the very start of spawn phase
    const coins = useMemo(
        () => Array.from({ length: TOTAL_COINS }, (_, i) => i),
        []
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000000",
                fontFamily: theme.fonts.body,
                overflow: "hidden",
            }}
        >
            {/* ── RUJA PORTRAIT (full height center) ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: portraitOp,
                    transform: `scale(${portraitScale})`,
                }}
            >
                <Img
                    src={staticFile("ruja_dramatic.png")}
                    style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        filter: "brightness(0.65) contrast(1.1)",
                    }}
                />
            </div>

            {/* ── DARK GRADIENT VIGNETTE (edges & bottom) ── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(0,0,0,${vignetteIntensity}) 85%)`,
                    pointerEvents: "none",
                    zIndex: 3,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: "50%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 4,
                }}
            />

            {/* ── CRYPTO COINS RAIN ── */}
            {frame >= COIN_SPAWN_START &&
                coins.map((i) => (
                    <CryptoCoin
                        key={i}
                        index={i}
                        totalCoins={TOTAL_COINS}
                        startFrame={COIN_SPAWN_START}
                    />
                ))}

            {/* ── "RUJA IGNATOVA" name title ── */}
            <div
                style={{
                    position: "absolute",
                    top: 50,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 12,
                    opacity: nameOp,
                    transform: `scale(${namePop})`,
                }}
            >
                <div
                    style={{
                        color: theme.colors.white,
                        fontSize: 56,
                        fontWeight: 900,
                        letterSpacing: 10,
                        fontFamily: theme.fonts.heading,
                        textShadow: "0 4px 30px rgba(0,0,0,0.9)",
                    }}
                >
                    RUJA IGNATOVA
                </div>
                <div
                    style={{
                        color: theme.colors.gold,
                        fontSize: 22,
                        letterSpacing: 6,
                        marginTop: 8,
                        fontFamily: theme.fonts.mono,
                        opacity: 0.8,
                    }}
                >
                    2014 – 2017 – PRESENT?
                </div>
            </div>

            {/* ── QUOTE LINES at bottom ── */}
            <div
                style={{
                    position: "absolute",
                    bottom: 60,
                    left: 120,
                    right: 120,
                    zIndex: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 18,
                    textAlign: "center",
                }}
            >
                {/* Decorative gold line */}
                <div
                    style={{
                        width: interpolate(frame, [55, 100], [0, 300], { extrapolateRight: "clamp" }),
                        height: 2,
                        backgroundColor: theme.colors.gold,
                        marginBottom: 10,
                    }}
                />
                <div
                    style={{
                        color: theme.colors.white,
                        fontSize: 32,
                        fontWeight: 700,
                        lineHeight: 1.5,
                        opacity: line1Op,
                        textShadow: "0 2px 20px rgba(0,0,0,1)",
                    }}
                >
                    That's the whole story of Ruja Ignatova,
                </div>
                <div
                    style={{
                        color: theme.colors.gray,
                        fontSize: 28,
                        fontStyle: "italic",
                        opacity: line2Op,
                        textShadow: "0 2px 20px rgba(0,0,0,1)",
                    }}
                >
                    as much of it as anyone's been able to piece together.
                </div>
                <div
                    style={{
                        color: theme.colors.grayDim,
                        fontSize: 24,
                        fontStyle: "italic",
                        opacity: line3Op,
                        textShadow: "0 2px 20px rgba(0,0,0,1)",
                    }}
                >
                    What's true, what's still missing, and what nobody's willing to say out loud yet.
                </div>
            </div>
        </AbsoluteFill>
    );
};
