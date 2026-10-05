import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Easing,
} from "remotion";
import { theme } from "../../theme";

// Rolling number counter with eased progress
const RollingCounter: React.FC<{
    targetValue: number;
    startFrame: number;
    durationFrames: number;
    prefix?: string;
    suffix?: string;
    fontSize?: number;
    color?: string;
    decimals?: number;
}> = ({
    targetValue,
    startFrame,
    durationFrames,
    prefix = "",
    suffix = "",
    fontSize = 120,
    color = "#ffffff",
    decimals = 0,
}) => {
        const frame = useCurrentFrame();
        const progress = interpolate(
            frame,
            [startFrame, startFrame + durationFrames],
            [0, 1],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
            }
        );

        const value = progress * targetValue;
        const formatted =
            decimals > 0
                ? value.toFixed(decimals)
                : Math.floor(value).toLocaleString("en-US");

        return (
            <span
                style={{
                    fontFamily: theme.fonts.mono,
                    fontSize,
                    fontWeight: 900,
                    color,
                    letterSpacing: 2,
                    fontVariantNumeric: "tabular-nums",
                }}
            >
                {prefix}
                {formatted}
                {suffix}
            </span>
        );
    };

// Horizontal red line separator
const Separator: React.FC<{ startFrame: number; width: number }> = ({
    startFrame,
    width,
}) => {
    const frame = useCurrentFrame();
    const progress = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
        extrapolateRight: "clamp",
    });
    return (
        <div
            style={{
                height: 3,
                width: progress * width,
                backgroundColor: theme.colors.red,
                borderRadius: 2,
                margin: "24px 0",
                boxShadow: "0 0 20px rgba(230,57,70,0.6)",
            }}
        />
    );
};

export const VictimsCounterScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // --- Phase timings (all at 30fps, 20 seconds = 600 frames) ---
    // Phase 1: 0-220 — Intro + $4B counter
    // Phase 2: 220-440 — 3.5M victims
    // Phase 3: 440-600 — 175 countries + outro text

    // Global dark pulsing background vignette
    const pulse = Math.sin(frame / 15) * 0.04 + 0.08;

    // Phase fades
    const phase1Op = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const phase2Op = interpolate(frame, [220, 250], [0, 1], { extrapolateRight: "clamp" });
    const phase3Op = interpolate(frame, [440, 470], [0, 1], { extrapolateRight: "clamp" });

    const phase1Out = interpolate(frame, [200, 220], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const phase2Out = interpolate(frame, [420, 440], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    // Spring pops
    const dollarPop = spring({ frame: frame - 30, fps, config: { damping: 12 } });
    const victimsPop = spring({ frame: frame - 260, fps, config: { damping: 12 } });
    const countriesPop = spring({ frame: frame - 470, fps, config: { damping: 12 } });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: theme.colors.bg,
                fontFamily: theme.fonts.body,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Pulsing vignette */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${pulse}) 100%)`,
                    pointerEvents: "none",
                }}
            />

            {/* ─── PHASE 1: DOLLAR COUNTER ─── */}
            {frame < 220 && (
                <div
                    style={{
                        opacity: phase1Op * phase1Out,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transform: `scale(${dollarPop})`,
                    }}
                >
                    <div
                        style={{
                            color: theme.colors.gray,
                            fontSize: 28,
                            letterSpacing: 8,
                            textTransform: "uppercase",
                            fontFamily: theme.fonts.mono,
                            marginBottom: 16,
                        }}
                    >
                        Prosecutors say
                    </div>

                    {/* Big counter */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            lineHeight: 1,
                        }}
                    >
                        <RollingCounter
                            targetValue={4000000000}
                            startFrame={40}
                            durationFrames={140}
                            prefix="$"
                            fontSize={150}
                            color={theme.colors.red}
                        />
                    </div>

                    <Separator startFrame={50} width={900} />

                    <div
                        style={{
                            color: theme.colors.white,
                            fontSize: 36,
                            fontWeight: 400,
                            letterSpacing: 3,
                            opacity: interpolate(frame, [80, 110], [0, 1], {
                                extrapolateRight: "clamp",
                            }),
                        }}
                    >
                        taken from investors.
                    </div>

                    {/* Independent estimates */}
                    <div
                        style={{
                            marginTop: 48,
                            color: theme.colors.gray,
                            fontSize: 26,
                            letterSpacing: 2,
                            opacity: interpolate(frame, [130, 160], [0, 1], {
                                extrapolateRight: "clamp",
                            }),
                        }}
                    >
                        Independent estimates:{" "}
                        <span style={{ color: theme.colors.gold, fontWeight: "bold" }}>
                            $4.5 – $5 BILLION+
                        </span>
                    </div>
                </div>
            )}

            {/* ─── PHASE 2: VICTIMS COUNTER ─── */}
            {frame >= 220 && frame < 440 && (
                <div
                    style={{
                        opacity: phase2Op * phase2Out,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transform: `scale(${victimsPop})`,
                    }}
                >
                    <div
                        style={{
                            color: theme.colors.gray,
                            fontSize: 28,
                            letterSpacing: 8,
                            textTransform: "uppercase",
                            fontFamily: theme.fonts.mono,
                            marginBottom: 16,
                        }}
                    >
                        Victims
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", lineHeight: 1 }}>
                        <RollingCounter
                            targetValue={3500000}
                            startFrame={240}
                            durationFrames={140}
                            fontSize={170}
                            color={theme.colors.red}
                        />
                    </div>

                    <Separator startFrame={250} width={700} />

                    <div
                        style={{
                            color: theme.colors.white,
                            fontSize: 40,
                            fontWeight: 400,
                            letterSpacing: 4,
                            opacity: interpolate(frame, [290, 320], [0, 1], {
                                extrapolateRight: "clamp",
                            }),
                        }}
                    >
                        Real lives. Real losses.
                    </div>
                </div>
            )}

            {/* ─── PHASE 3: COUNTRIES ─── */}
            {frame >= 440 && (
                <div
                    style={{
                        opacity: phase3Op,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        transform: `scale(${countriesPop})`,
                    }}
                >
                    <div
                        style={{
                            color: theme.colors.gray,
                            fontSize: 28,
                            letterSpacing: 8,
                            textTransform: "uppercase",
                            fontFamily: theme.fonts.mono,
                            marginBottom: 16,
                        }}
                    >
                        Countries Affected
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-end", lineHeight: 1, gap: 20 }}>
                        <span style={{ fontFamily: theme.fonts.mono, fontSize: 220, fontWeight: 900, color: theme.colors.gold, letterSpacing: 2 }}>
                            <RollingCounter
                                targetValue={175}
                                startFrame={460}
                                durationFrames={100}
                                fontSize={220}
                                color={theme.colors.gold}
                            />
                        </span>
                    </div>

                    <Separator startFrame={470} width={600} />

                    <div
                        style={{
                            color: theme.colors.white,
                            fontSize: 36,
                            fontWeight: 400,
                            letterSpacing: 3,
                            opacity: interpolate(frame, [510, 540], [0, 1], {
                                extrapolateRight: "clamp",
                            }),
                        }}
                    >
                        Every continent. Every corner.
                    </div>

                    {/* Final consolidation line */}
                    <div
                        style={{
                            marginTop: 60,
                            display: "flex",
                            gap: 60,
                            opacity: interpolate(frame, [550, 580], [0, 1], {
                                extrapolateRight: "clamp",
                            }),
                        }}
                    >
                        {[
                            { label: "STOLEN", value: "$4B+" },
                            { label: "VICTIMS", value: "3.5M" },
                            { label: "COUNTRIES", value: "175" },
                        ].map((s) => (
                            <div key={s.label} style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        color: theme.colors.red,
                                        fontWeight: 900,
                                        fontSize: 40,
                                        fontFamily: theme.fonts.mono,
                                    }}
                                >
                                    {s.value}
                                </div>
                                <div
                                    style={{
                                        color: theme.colors.gray,
                                        fontSize: 18,
                                        letterSpacing: 4,
                                        marginTop: 8,
                                    }}
                                >
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Small grey watermark source */}
            <div
                style={{
                    position: "absolute",
                    bottom: 30,
                    right: 40,
                    color: theme.colors.grayDim,
                    fontSize: 16,
                    fontFamily: theme.fonts.mono,
                    opacity: 0.5,
                }}
            >
                Source: DOJ / Europol / BBC
            </div>
        </AbsoluteFill>
    );
};
