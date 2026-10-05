import React from "react";
import {
    AbsoluteFill,
    Img,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Easing,
} from "remotion";
import { theme } from "../../theme";

// ── Data ──────────────────────────────────────────
const MADOFF = {
    name: "BERNIE MADOFF",
    title: "Wall Street Legend",
    scheme: "Ponzi Scheme",
    amount: "$65 BILLION",
    investors: "37,000",
    duration: "20+ YEARS",
    method: "Curated wealthy clients",
    country: "USA",
    verdict: "150 years in prison (2009)",
    color: "#4A90D9",   // steel blue
    portrait: "madoff_portrait.png",
};

const RUJA = {
    name: "RUJA IGNATOVA",
    title: '"Crypto Queen"',
    scheme: "OneCoin Fraud",
    amount: "$4–5 BILLION",
    investors: "3,500,000",
    duration: "3 YEARS",
    method: "MLM & ordinary people worldwide",
    country: "GLOBAL (175 countries)",
    verdict: "FBI Most Wanted — still at large",
    color: theme.colors.red,
    portrait: "ruja_portrait.png",
};

// ── Sub-component: profile card ───────────────────
const ProfileCard: React.FC<{
    data: typeof MADOFF;
    side: "left" | "right";
    startFrame: number;
}> = ({ data, side, startFrame }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const pop = spring({ frame: frame - startFrame, fps, config: { damping: 14 } });
    const imgOp = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateRight: "clamp" });

    const statRows = [
        { label: "TOTAL STOLEN", value: data.amount },
        { label: "VICTIMS", value: data.investors },
        { label: "DURATION", value: data.duration },
        { label: "METHOD", value: data.method },
        { label: "REACH", value: data.country },
    ];

    return (
        <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: side === "left" ? 0 : "50%",
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 120,
            transform: `scale(${pop})`,
            transformOrigin: side === "left" ? "right center" : "left center",
        }}>
            {/* Portrait */}
            <div style={{
                width: 260, height: 300,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: `0 0 40px ${data.color}55, 0 20px 60px rgba(0,0,0,0.8)`,
                border: `3px solid ${data.color}`,
                opacity: imgOp,
                flexShrink: 0,
            }}>
                <Img
                    src={staticFile(data.portrait)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                />
            </div>

            {/* Name tag */}
            <div style={{ marginTop: 20, textAlign: "center" }}>
                <div style={{ color: data.color, fontSize: 30, fontWeight: 900, fontFamily: theme.fonts.heading, letterSpacing: 3 }}>
                    {data.name}
                </div>
                <div style={{ color: theme.colors.gray, fontSize: 18, letterSpacing: 2, marginTop: 4 }}>
                    {data.title}
                </div>
                <div style={{
                    marginTop: 10,
                    display: "inline-block",
                    backgroundColor: `${data.color}22`,
                    border: `1px solid ${data.color}`,
                    borderRadius: 6,
                    padding: "4px 18px",
                    color: data.color,
                    fontSize: 16,
                    fontFamily: theme.fonts.mono,
                    letterSpacing: 2,
                }}>
                    {data.scheme}
                </div>
            </div>

            {/* Stats table */}
            <div style={{ marginTop: 28, width: "80%", display: "flex", flexDirection: "column", gap: 10 }}>
                {statRows.map((row, i) => {
                    const rowOp = interpolate(frame, [startFrame + 20 + i * 15, startFrame + 40 + i * 15], [0, 1], { extrapolateRight: "clamp" });
                    return (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: rowOp, borderBottom: `1px solid ${theme.colors.gridLine}`, paddingBottom: 8 }}>
                            <div style={{ color: theme.colors.grayDim, fontSize: 14, fontFamily: theme.fonts.mono, letterSpacing: 1, flexShrink: 0, marginRight: 12 }}>{row.label}</div>
                            <div style={{ color: theme.colors.white, fontSize: 16, fontWeight: "bold", textAlign: "right" }}>{row.value}</div>
                        </div>
                    );
                })}
            </div>

            {/* Verdict badge */}
            {frame > startFrame + 100 && (
                <div style={{
                    marginTop: 20,
                    padding: "10px 20px",
                    borderRadius: 8,
                    backgroundColor: data === RUJA ? `${theme.colors.red}22` : "rgba(70,70,80,0.4)",
                    border: `2px solid ${data.color}`,
                    color: data === RUJA ? theme.colors.red : theme.colors.gray,
                    fontSize: 15,
                    fontFamily: theme.fonts.mono,
                    textAlign: "center",
                    letterSpacing: 1,
                    opacity: interpolate(frame, [startFrame + 100, startFrame + 120], [0, 1], { extrapolateRight: "clamp" }),
                }}>
                    {data.verdict}
                </div>
            )}
        </div>
    );
};

// ── Main Scene ────────────────────────────────────
export const MadoffComparisonScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const titleY = spring({ frame, fps, config: { damping: 14 }, from: -40, to: 0 });

    // Divider line draws in
    const dividerH = interpolate(frame, [10, 50], [0, height], { extrapolateRight: "clamp" });

    // Key contrast callout
    const calloutOp = interpolate(frame, [310, 340], [0, 1], { extrapolateRight: "clamp" });
    const calloutPop = spring({ frame: frame - 310, fps, config: { damping: 12 } });

    // Background subtle gradient
    const bgPulse = Math.sin(frame / 20) * 0.02 + 0.06;

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body, overflow: "hidden" }}>

            {/* Subtle pulsing vignette */}
            <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${bgPulse}) 100%)`,
                pointerEvents: "none",
            }} />

            {/* ── TITLE BAR ── */}
            <div style={{
                position: "absolute", top: 30, left: 0, width: "100%", textAlign: "center",
                opacity: titleOp, transform: `translateY(${titleY}px)`, zIndex: 10,
            }}>
                <div style={{ fontSize: 28, fontFamily: theme.fonts.mono, color: theme.colors.gray, letterSpacing: 6, textTransform: "uppercase" }}>
                    The Fraud Hall of Infamy
                </div>
                <div style={{ fontSize: theme.sizes.titleSmall, fontWeight: 900, fontFamily: theme.fonts.heading, color: theme.colors.white, letterSpacing: 2, marginTop: 6 }}>
                    <span style={{ color: MADOFF.color }}>Madoff</span>
                    <span style={{ color: theme.colors.grayDim }}> vs </span>
                    <span style={{ color: RUJA.color }}>OneCoin</span>
                </div>
            </div>

            {/* ── VERTICAL DIVIDER ── */}
            <div style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: 2,
                height: dividerH,
                background: `linear-gradient(to bottom, transparent, ${theme.colors.gridLine} 20%, ${theme.colors.gridLine} 80%, transparent)`,
                zIndex: 5,
            }} />
            {/* Center badge */}
            <div style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 6,
                backgroundColor: theme.colors.bg,
                border: `2px solid ${theme.colors.gridLine}`,
                borderRadius: "50%",
                width: 60, height: 60,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: theme.colors.gray, fontSize: 22, fontWeight: "bold",
            }}>
                VS
            </div>

            {/* ── PROFILE CARDS ── */}
            <ProfileCard data={MADOFF} side="left" startFrame={40} />
            <ProfileCard data={RUJA} side="right" startFrame={120} />

            {/* ── CONTRAST CALLOUT at the bottom ── */}
            {frame >= 310 && (
                <div style={{
                    position: "absolute", bottom: 30, left: "50%",
                    transform: `translateX(-50%) scale(${calloutPop})`,
                    opacity: calloutOp,
                    width: 900,
                    backgroundColor: theme.colors.surface,
                    border: `2px solid ${theme.colors.gridLine}`,
                    borderRadius: 12,
                    padding: "16px 30px",
                    display: "flex",
                    gap: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 8,
                }}>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ color: MADOFF.color, fontSize: 32, fontWeight: 900, fontFamily: theme.fonts.mono }}>37,000</div>
                        <div style={{ color: theme.colors.gray, fontSize: 14, letterSpacing: 2, marginTop: 4 }}>MADOFF VICTIMS</div>
                    </div>
                    <div style={{ color: theme.colors.grayDim, fontSize: 28, fontWeight: "bold" }}>←</div>
                    <div style={{ textAlign: "center", color: theme.colors.white, fontSize: 16, fontStyle: "italic", maxWidth: 380 }}>
                        Madoff needed <span style={{ color: MADOFF.color, fontWeight: "bold" }}>decades</span> &amp; wealthy clients.<br />
                        OneCoin took <span style={{ color: RUJA.color, fontWeight: "bold" }}>3 years</span> &amp; millions of ordinary people.
                    </div>
                    <div style={{ color: theme.colors.grayDim, fontSize: 28, fontWeight: "bold" }}>→</div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ color: RUJA.color, fontSize: 32, fontWeight: 900, fontFamily: theme.fonts.mono }}>3,500,000</div>
                        <div style={{ color: theme.colors.gray, fontSize: 14, letterSpacing: 2, marginTop: 4 }}>ONECOIN VICTIMS</div>
                    </div>
                </div>
            )}

        </AbsoluteFill>
    );
};
