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

// Synthesized data for maximum dramatic effect during the news events
// Represents a ~6 month intense period
const dataPoints = 120;
const btcData: number[] = [];
const ocData: number[] = [];

let btcPrice = 400;
let ocPrice = 2;

for (let i = 0; i < dataPoints; i++) {
    // OneCoin simply goes up by a fixed amount + tiny smoothing curve
    ocPrice += 0.08 + Math.sin(i / 10) * 0.02;

    // Bitcoin organic movement
    let btcVolatility = (Math.random() - 0.4) * 15;

    // EVENT 1: frame 40 (index 30) - China ban
    if (i > 25 && i < 35) btcVolatility -= 35;
    if (i >= 35 && i < 45) btcVolatility += 15; // bounce

    // EVENT 2: frame 110 (index 80) - Exchange Hack
    if (i > 75 && i < 85) btcVolatility -= 45;

    // Organic recovery
    if (i >= 85) btcVolatility += 10;

    btcPrice += btcVolatility;
    if (btcPrice < 150) btcPrice = 150; // floor

    btcData.push(btcPrice);
    ocData.push(ocPrice);
}

const NewsHeadline: React.FC<{ text: string, sub: string, startFrame: number, yPos: number }> = ({ text, sub, startFrame, yPos }) => {
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();

    const pop = spring({ frame: frame - startFrame, fps, config: { damping: 12, mass: 0.8 } });
    const opacity = interpolate(frame, [startFrame, startFrame + 10, startFrame + 90, startFrame + 100], [0, 1, 1, 0], { extrapolateRight: "clamp" });

    return (
        <div style={{
            position: "absolute",
            left: width / 2 - 250,
            top: yPos,
            width: 500,
            transform: `scale(${pop})`,
            opacity: opacity,
            backgroundColor: theme.colors.surface,
            borderLeft: `6px solid ${theme.colors.red}`,
            padding: "16px 24px",
            borderRadius: "0 8px 8px 0",
            boxShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 20px rgba(230,57,70,0.2)",
            zIndex: 10,
        }}>
            <div style={{ color: theme.colors.gray, fontSize: 16, fontFamily: theme.fonts.mono, marginBottom: 4 }}>BREAKING NEWS</div>
            <div style={{ color: theme.colors.white, fontSize: 24, fontWeight: 'bold', fontFamily: theme.fonts.heading, lineHeight: 1.2 }}>{text}</div>
            <div style={{ color: theme.colors.grayDim, fontSize: 16, marginTop: 8 }}>{sub}</div>
        </div>
    );
};

export const NewsImpactScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // ── Layout ──
    const PAD = { top: 120, bottom: 80, left: 100, right: 100 };
    const chartW = width - PAD.left - PAD.right;
    const chartH = height - PAD.top - PAD.bottom;
    const baseline = PAD.top + chartH;

    // ── Animation Progress ──
    // The chart draws fully over 240 frames
    const drawFrames = 200;
    const progress = interpolate(frame, [20, 20 + drawFrames], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

    const currentIdx = Math.floor(progress * (dataPoints - 1));

    // ── Normalize Data ──
    // To show them in the same visual space, we normalize them by their own min/max
    const btcMin = Math.min(...btcData), btcMax = Math.max(...btcData);
    const ocMin = Math.min(...ocData), ocMax = Math.max(...ocData);

    const getPt = (idx: number) => {
        const x = PAD.left + (idx / (dataPoints - 1)) * chartW;
        const btcY = PAD.top + chartH - ((btcData[idx] - btcMin) / (btcMax - btcMin)) * chartH * 0.8;
        const ocY = PAD.top + chartH - ((ocData[idx] - ocMin) / (ocMax - ocMin)) * chartH * 0.9;
        return { x, btcY, ocY };
    };

    // Build the path up to current progress
    let btcPath = "";
    let ocPath = "";

    if (currentIdx >= 0) {
        const start = getPt(0);
        btcPath = `M ${start.x} ${start.btcY}`;
        ocPath = `M ${start.x} ${start.ocY}`;

        for (let i = 1; i <= currentIdx; i++) {
            const p = getPt(i);
            const prev = getPt(i - 1);
            const midX = (prev.x + p.x) / 2;
            btcPath += ` C ${midX} ${prev.btcY}, ${midX} ${p.btcY}, ${p.x} ${p.btcY}`;
            ocPath += ` C ${midX} ${prev.ocY}, ${midX} ${p.ocY}, ${p.x} ${p.ocY}`;
        }
    }

    // ── Dynamic text colors based on event ──
    const isCrash1 = frame > 65 && frame < 95;
    const isCrash2 = frame > 165 && frame < 195;
    const btcColor = (isCrash1 || isCrash2) ? theme.colors.red : theme.colors.gold;

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body }}>

            {/* Title */}
            <div style={{ position: "absolute", top: 40, left: 0, width: "100%", textAlign: "center" }}>
                <div style={{ fontSize: theme.sizes.titleSmall, fontWeight: 'bold', color: theme.colors.white, letterSpacing: 2 }}>
                    MARKET REALITY VS <span style={{ color: theme.colors.red }}>THE ILLUSION</span>
                </div>
            </div>

            {/* Labels attached to current point line */}
            {currentIdx > 0 && (
                <div style={{ position: "absolute", left: getPt(currentIdx).x + 20, top: getPt(currentIdx).ocY - 15, opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateRight: "clamp" }) }}>
                    <div style={{ color: theme.colors.red, fontWeight: 'bold', fontSize: 24, letterSpacing: 1 }}>ONECOIN</div>
                    <div style={{ color: theme.colors.gray, fontSize: 16 }}>Unaffected</div>
                </div>
            )}
            {currentIdx > 0 && (
                <div style={{ position: "absolute", left: getPt(currentIdx).x + 20, top: getPt(currentIdx).btcY - 15, opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateRight: "clamp" }) }}>
                    <div style={{ color: btcColor, fontWeight: 'bold', fontSize: 24, letterSpacing: 1, transition: "color 0.2s" }}>BITCOIN</div>
                    <div style={{ color: theme.colors.gray, fontSize: 16 }}>Reacts to market</div>
                </div>
            )}

            <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
                <defs>
                    <filter id="glowBtc">
                        <feGaussianBlur stdDeviation="6" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="glowOc">
                        <feGaussianBlur stdDeviation="4" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map(r => (
                    <line key={`g-${r}`} x1={PAD.left} y1={PAD.top + chartH * r} x2={width - PAD.right} y2={PAD.top + chartH * r} stroke={theme.colors.gridLine} strokeWidth={1} strokeDasharray="4 4" />
                ))}

                {/* Connecting line to leading edge */}
                {currentIdx > 0 && (
                    <line x1={getPt(currentIdx).x} y1={PAD.top} x2={getPt(currentIdx).x} y2={baseline} stroke={theme.colors.grayDim} strokeWidth={2} strokeDasharray="6 4" opacity={0.5} />
                )}

                {/* Bitcoin Line */}
                <path d={btcPath} fill="none" stroke={btcColor} strokeWidth={5} strokeLinecap="round" style={{ transition: "stroke 0.2s" }} filter="url(#glowBtc)" opacity={0.9} />
                {/* OneCoin Line */}
                <path d={ocPath} fill="none" stroke={theme.colors.red} strokeWidth={6} strokeLinecap="round" filter="url(#glowOc)" />

                {/* Leading dots */}
                {currentIdx > 0 && (
                    <>
                        <circle cx={getPt(currentIdx).x} cy={getPt(currentIdx).btcY} r={8} fill={btcColor} style={{ transition: "fill 0.2s" }} />
                        <circle cx={getPt(currentIdx).x} cy={getPt(currentIdx).ocY} r={8} fill={theme.colors.red} />
                    </>
                )}
            </svg>

            {/* News Overlays - timed with the drawn line's crashes */}
            {/* Event 1 matches index 30 roughly at frame 70 */}
            {frame > 65 && <NewsHeadline text="CHINA BANS CRYPTO EXCHANGES" sub="Market panics as regulations tighten globally." startFrame={65} yPos={200} />}

            {/* Event 2 matches index 80 roughly at frame 155 */}
            {frame > 155 && <NewsHeadline text="MAJOR EXCHANGE HACKED" sub="$400M stolen in massive security breach." startFrame={155} yPos={500} />}

        </AbsoluteFill>
    );
};
