import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type PricePoint = {
  date: string;
  price: number;
  label?: string;
};

type PriceChartProps = {
  series1: PricePoint[];
  series2: PricePoint[];
  series1Name: string;
  series2Name: string;
  series1Color: string;
  series2Color: string;
  title: string;
  subtitle?: string;
  yLabel?: string;
  xLabel?: string;
  startFrame?: number;
  drawDurationFrames?: number;
};

const PADDING = { top: 120, right: 120, bottom: 120, left: 140 };

const buildPath = (
  points: { x: number; y: number }[],
  progress: number
): string => {
  if (points.length === 0) return "";
  const visibleCount = Math.max(1, Math.ceil(points.length * progress));
  const visible = points.slice(0, visibleCount);

  let path = `M ${visible[0].x} ${visible[0].y}`;
  for (let i = 1; i < visible.length; i++) {
    const prev = visible[i - 1];
    const curr = visible[i];
    const midX = (prev.x + curr.x) / 2;
    path += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return path;
};

const buildAreaPath = (
  points: { x: number; y: number }[],
  progress: number,
  baseline: number
): string => {
  if (points.length === 0) return "";
  const visibleCount = Math.max(1, Math.ceil(points.length * progress));
  const visible = points.slice(0, visibleCount);

  let path = `M ${visible[0].x} ${baseline}`;
  path += ` L ${visible[0].x} ${visible[0].y}`;
  for (let i = 1; i < visible.length; i++) {
    const prev = visible[i - 1];
    const curr = visible[i];
    const midX = (prev.x + curr.x) / 2;
    path += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  path += ` L ${visible[visible.length - 1].x} ${baseline} Z`;
  return path;
};

export const PriceChart: React.FC<PriceChartProps> = ({
  series1,
  series2,
  series1Name,
  series2Name,
  series1Color,
  series2Color,
  title,
  subtitle,
  startFrame = 15,
  drawDurationFrames = 90,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const chartWidth = width - PADDING.left - PADDING.right;
  const chartHeight = height - PADDING.top - PADDING.bottom;

  // Normalize both series to same x-axis (by index count)
  const maxLen = Math.max(series1.length, series2.length);

  // Y-axis: normalize each series independently to fill the chart
  // series1 (OneCoin) maps to left half of chart height, series2 (Bitcoin) to full height
  // But we want them overlaid, so we normalize each to its own range
  const s1Max = Math.max(...series1.map((p) => p.price));
  const s1Min = Math.min(...series1.map((p) => p.price));
  const s2Max = Math.max(...series2.map((p) => p.price));
  const s2Min = Math.min(...series2.map((p) => p.price));

  const normalizeY = (price: number, min: number, max: number) => {
    const ratio = (price - min) / (max - min || 1);
    return PADDING.top + chartHeight - ratio * chartHeight * 0.85 - chartHeight * 0.075;
  };

  const normalizeX = (index: number, total: number) => {
    return PADDING.left + (index / (total - 1)) * chartWidth;
  };

  const s1Points = series1.map((p, i) => ({
    x: normalizeX(i, series1.length),
    y: normalizeY(p.price, s1Min, s1Max),
  }));

  const s2Points = series2.map((p, i) => ({
    x: normalizeX(i, series2.length),
    y: normalizeY(p.price, s2Min, s2Max),
  }));

  // Draw progress
  const drawProgress = interpolate(
    frame,
    [startFrame, startFrame + drawDurationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  const s1Path = buildPath(s1Points, drawProgress);
  const s1Area = buildAreaPath(s1Points, drawProgress, PADDING.top + chartHeight);
  const s2Path = buildPath(s2Points, drawProgress);

  // Title animation
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Legend animation
  const legendOpacity = interpolate(
    frame,
    [startFrame + drawDurationFrames - 20, startFrame + drawDurationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Annotation at the end
  const annotationOpacity = interpolate(
    frame,
    [startFrame + drawDurationFrames, startFrame + drawDurationFrames + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((ratio) => {
    const y = PADDING.top + chartHeight - ratio * chartHeight;
    return y;
  });

  // X-axis labels (dates)
  const xLabels = series1.map((p, i) => ({
    x: normalizeX(i, series1.length),
    y: PADDING.top + chartHeight + 30,
    label: p.date,
  }));

  // Filter to show ~6 labels
  const labelStep = Math.ceil(xLabels.length / 6);
  const visibleXLabels = xLabels.filter((_, i) => i % labelStep === 0);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.bg,
        position: "relative",
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: PADDING.left,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: theme.sizes.titleMedium,
            fontWeight: "bold",
            color: theme.colors.white,
            fontFamily: theme.fonts.heading,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: theme.sizes.body,
              color: theme.colors.gray,
              marginTop: 8,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Chart SVG */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="s1Gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series1Color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={series1Color} stopOpacity={0} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map((y, i) => (
          <line
            key={`grid-${i}`}
            x1={PADDING.left}
            y1={y}
            x2={width - PADDING.right}
            y2={y}
            stroke={theme.colors.gridLine}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        {/* X-axis line */}
        <line
          x1={PADDING.left}
          y1={PADDING.top + chartHeight}
          x2={width - PADDING.right}
          y2={PADDING.top + chartHeight}
          stroke={theme.colors.grayDim}
          strokeWidth={2}
        />

        {/* X-axis labels */}
        {visibleXLabels.map((l, i) => (
          <text
            key={`xlabel-${i}`}
            x={l.x}
            y={l.y}
            fill={theme.colors.gray}
            fontSize={theme.sizes.label}
            textAnchor="middle"
            fontFamily={theme.fonts.mono}
          >
            {l.label}
          </text>
        ))}

        {/* Series 2 (Bitcoin - chaotic, no fill) */}
        <path
          d={s2Path}
          fill="none"
          stroke={series2Color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.8}
        />

        {/* Series 1 (OneCoin - smooth, with fill) */}
        <path d={s1Area} fill="url(#s1Gradient)" />
        <path
          d={s1Path}
          fill="none"
          stroke={series1Color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

        {/* End point dot for series 1 */}
        {drawProgress >= 0.99 && (
          <circle
            cx={s1Points[s1Points.length - 1].x}
            cy={s1Points[s1Points.length - 1].y}
            r={8}
            fill={series1Color}
            opacity={annotationOpacity}
          />
        )}

        {/* "Ruja disappears" annotation */}
        {drawProgress >= 0.99 && series1[series1.length - 1].label && (
          <g opacity={annotationOpacity}>
            <line
              x1={s1Points[s1Points.length - 1].x}
              y1={s1Points[s1Points.length - 1].y}
              x2={s1Points[s1Points.length - 1].x}
              y2={s1Points[s1Points.length - 1].y - 60}
              stroke={theme.colors.red}
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <text
              x={s1Points[s1Points.length - 1].x}
              y={s1Points[s1Points.length - 1].y - 70}
              fill={theme.colors.red}
              fontSize={theme.sizes.label}
              textAnchor="middle"
              fontFamily={theme.fonts.body}
              fontWeight="bold"
            >
              {series1[series1.length - 1].label}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      <div
        style={{
          position: "absolute",
          top: 40,
          right: PADDING.right,
          opacity: legendOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 24,
              height: 4,
              backgroundColor: series1Color,
              borderRadius: 2,
            }}
          />
          <span style={{ color: theme.colors.white, fontSize: theme.sizes.body }}>
            {series1Name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 24,
              height: 4,
              backgroundColor: series2Color,
              borderRadius: 2,
            }}
          />
          <span style={{ color: theme.colors.white, fontSize: theme.sizes.body }}>
            {series2Name}
          </span>
        </div>
      </div>

      {/* "Red flag" callout */}
      {drawProgress >= 0.99 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: PADDING.right,
            opacity: annotationOpacity,
            backgroundColor: theme.colors.redDim,
            border: `1px solid ${theme.colors.red}`,
            borderRadius: 8,
            padding: "12px 20px",
            color: theme.colors.white,
            fontSize: theme.sizes.bodySmall,
            fontFamily: theme.fonts.body,
          }}
        >
          ⚠ Perfectly smooth line = no real market
        </div>
      )}
    </div>
  );
};
