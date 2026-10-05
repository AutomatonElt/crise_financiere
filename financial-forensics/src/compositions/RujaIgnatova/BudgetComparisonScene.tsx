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

// All values in billions USD
const REFERENCE_VALUE = 4.0; // OneCoin

const BARS = [
    {
        label: "OneCoin Theft",
        value: 4.0,
        color: theme.colors.red,
        sublabel: "DoJ estimate",
        isOneCoin: true,
        startFrame: 30,
    },
    {
        label: "FBI Investigative\nDivision (annual)",
        value: 3.4,
        color: "#4A90D9",
        sublabel: "DoJ Budget 2023",
        isOneCoin: false,
        startFrame: 90,
    },
    {
        label: "GDP of Belize",
        value: 2.8,
        color: theme.colors.gold,
        sublabel: "World Bank 2023",
        isOneCoin: false,
        startFrame: 150,
    },
    {
        label: "GDP of Guyana\n(pre-oil)",
        value: 3.6,
        color: theme.colors.gold,
        sublabel: "World Bank 2019",
        isOneCoin: false,
        startFrame: 210,
    },
    {
        label: "GDP of Barbados",
        value: 5.7,
        color: theme.colors.gold,
        sublabel: "World Bank 2023",
        isOneCoin: false,
        startFrame: 270,
    },
];

const MAX_VALUE = Math.max(...BARS.map((b) => b.value));

const Bar: React.FC<{
    label: string;
    value: number;
    maxValue: number;
    color: string;
    sublabel: string;
    isOneCoin: boolean;
    startFrame: number;
    maxBarHeight: number;
    x: number;
    barWidth: number;
    chartBottom: number;
}> = ({
    label,
    value,
    maxValue,
    color,
    sublabel,
    isOneCoin,
    startFrame,
    maxBarHeight,
    x,
    barWidth,
    chartBottom,
}) => {
        const frame = useCurrentFrame();
        const targetHeight = (value / maxValue) * maxBarHeight;

        const progress = spring({
            frame: frame - startFrame,
            fps: 30,
            config: { damping: 14, mass: 0.8 },
        });

        const barH = progress * targetHeight;
        const barTop = chartBottom - barH;

        const labelOpacity = interpolate(frame, [startFrame + 15, startFrame + 30], [0, 1], {
            extrapolateRight: "clamp",
        });

        // OneCoin bar has a glow + pulse
        const pulse = isOneCoin ? Math.sin(frame / 8) * 0.15 + 0.85 : 1;

        return (
            <g>
                {/* Filled bar */}
                <rect
                    x={x}
                    y={barTop}
                    width={barWidth}
                    height={barH}
                    fill={color}
                    opacity={isOneCoin ? pulse : 0.85}
                    rx={6}
                />

                {/* Glow for OneCoin */}
                {isOneCoin && (
                    <rect
                        x={x - 4}
                        y={barTop - 4}
                        width={barWidth + 8}
                        height={barH + 8}
                        fill="none"
                        stroke={color}
                        strokeWidth={3}
                        rx={8}
                        opacity={0.4 * pulse}
                    />
                )}

                {/* Value label on top of bar */}
                {progress > 0.5 && (
                    <text
                        x={x + barWidth / 2}
                        y={barTop - 14}
                        fill={color}
                        textAnchor="middle"
                        fontSize={20}
                        fontWeight="bold"
                        fontFamily="monospace"
                        opacity={labelOpacity}
                    >
                        ${value.toFixed(1)}B
                    </text>
                )}

                {/* Bar label below x axis */}
                {label.split("\n").map((line, i) => (
                    <text
                        key={i}
                        x={x + barWidth / 2}
                        y={chartBottom + 30 + i * 22}
                        fill={isOneCoin ? color : theme.colors.gray}
                        textAnchor="middle"
                        fontSize={16}
                        fontWeight={isOneCoin ? "bold" : "normal"}
                        fontFamily="sans-serif"
                        opacity={labelOpacity}
                    >
                        {line}
                    </text>
                ))}

                {/* Sublabel */}
                <text
                    x={x + barWidth / 2}
                    y={chartBottom + (label.includes("\n") ? 92 : 70)}
                    fill={theme.colors.grayDim}
                    textAnchor="middle"
                    fontSize={13}
                    fontFamily="monospace"
                    opacity={labelOpacity * 0.7}
                >
                    {sublabel}
                </text>
            </g>
        );
    };

export const BudgetComparisonScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const PAD = { top: 160, bottom: 160, left: 80, right: 80 };
    const chartW = width - PAD.left - PAD.right;
    const chartH = height - PAD.top - PAD.bottom;
    const chartBottom = PAD.top + chartH;

    const barCount = BARS.length;
    const barGap = 40;
    const barWidth = (chartW - barGap * (barCount + 1)) / barCount;

    // Title animation
    const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const titleY = spring({ frame, fps, config: { damping: 14 }, from: -40, to: 0 });

    // Subtitle line appears after all bars
    const subtitleOp = interpolate(frame, [310, 340], [0, 1], { extrapolateRight: "clamp" });

    // Horizontal grid lines
    const gridLines = [0.25, 0.5, 0.75, 1].map((r) => ({
        y: chartBottom - r * chartH,
        label: `$${(r * MAX_VALUE).toFixed(1)}B`,
    }));

    return (
        <AbsoluteFill
            style={{
                backgroundColor: theme.colors.bg,
                fontFamily: theme.fonts.body,
            }}
        >
            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 40,
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    opacity: titleOp,
                    transform: `translateY(${titleY}px)`,
                }}
            >
                <div
                    style={{
                        fontSize: theme.sizes.titleSmall,
                        fontWeight: 900,
                        color: theme.colors.white,
                        fontFamily: theme.fonts.heading,
                        letterSpacing: 3,
                    }}
                >
                    What{" "}
                    <span style={{ color: theme.colors.red }}>$4 Billion</span> means
                </div>
                <div
                    style={{
                        fontSize: 22,
                        color: theme.colors.gray,
                        marginTop: 10,
                        letterSpacing: 2,
                    }}
                >
                    Compared to real-world budgets &amp; economies
                </div>
            </div>

            {/* SVG chart area */}
            <svg
                width={width}
                height={height}
                style={{ position: "absolute", top: 0, left: 0 }}
            >
                <defs>
                    <filter id="redglow">
                        <feGaussianBlur stdDeviation="8" result="b" />
                        <feMerge>
                            <feMergeNode in="b" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Horizontal grid */}
                {gridLines.map((g, i) => (
                    <g key={i}>
                        <line
                            x1={PAD.left}
                            y1={g.y}
                            x2={width - PAD.right}
                            y2={g.y}
                            stroke={theme.colors.gridLine}
                            strokeWidth={1}
                            strokeDasharray="5 4"
                        />
                        <text
                            x={PAD.left - 12}
                            y={g.y + 5}
                            fill={theme.colors.grayDim}
                            fontSize={16}
                            textAnchor="end"
                            fontFamily="monospace"
                        >
                            {g.label}
                        </text>
                    </g>
                ))}

                {/* X axis */}
                <line
                    x1={PAD.left}
                    y1={chartBottom}
                    x2={width - PAD.right}
                    y2={chartBottom}
                    stroke={theme.colors.grayDim}
                    strokeWidth={2}
                />

                {/* Y axis */}
                <line
                    x1={PAD.left}
                    y1={PAD.top}
                    x2={PAD.left}
                    y2={chartBottom}
                    stroke={theme.colors.grayDim}
                    strokeWidth={2}
                />

                {/* Bars */}
                {BARS.map((bar, i) => {
                    const x = PAD.left + barGap + i * (barWidth + barGap);
                    return (
                        <Bar
                            key={i}
                            label={bar.label}
                            value={bar.value}
                            maxValue={MAX_VALUE}
                            color={bar.color}
                            sublabel={bar.sublabel}
                            isOneCoin={bar.isOneCoin}
                            startFrame={bar.startFrame}
                            maxBarHeight={chartH * 0.88}
                            x={x}
                            barWidth={barWidth}
                            chartBottom={chartBottom}
                        />
                    );
                })}
            </svg>

            {/* Bottom context pull-quote */}
            <div
                style={{
                    position: "absolute",
                    bottom: 35,
                    left: 0,
                    width: "100%",
                    textAlign: "center",
                    opacity: subtitleOp,
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        borderLeft: `4px solid ${theme.colors.red}`,
                        paddingLeft: 20,
                        textAlign: "left",
                    }}
                >
                    <div style={{ color: theme.colors.white, fontSize: 22, fontStyle: "italic" }}>
                        "Collected not from billionaires — but largely from ordinary people,
                    </div>
                    <div style={{ color: theme.colors.white, fontSize: 22, fontStyle: "italic" }}>
                        many of them in developing economies, investing a few hundred dollars at a time."
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
