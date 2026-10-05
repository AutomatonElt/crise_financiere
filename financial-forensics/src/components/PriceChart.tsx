import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type PricePoint = { date: string; price: number; label?: string };

type PriceChartProps = {
  series1: PricePoint[];   // OneCoin — smooth
  series2: PricePoint[];   // Bitcoin — chaotic
  series1Name: string;
  series2Name: string;
  series1Color: string;
  series2Color: string;
  title: string;
  subtitle?: string;
  startFrame?: number;
  drawDurationFrames?: number;
};

// Smooth cubic bezier path
const buildPath = (pts: { x: number; y: number }[], progress: number): string => {
  if (!pts.length) return "";
  const n = Math.max(1, Math.ceil(pts.length * progress));
  const vis = pts.slice(0, n);
  let d = `M ${vis[0].x} ${vis[0].y}`;
  for (let i = 1; i < vis.length; i++) {
    const midX = (vis[i - 1].x + vis[i].x) / 2;
    d += ` C ${midX} ${vis[i - 1].y}, ${midX} ${vis[i].y}, ${vis[i].x} ${vis[i].y}`;
  }
  return d;
};

const buildArea = (pts: { x: number; y: number }[], progress: number, base: number): string => {
  if (!pts.length) return "";
  const n = Math.max(1, Math.ceil(pts.length * progress));
  const vis = pts.slice(0, n);
  let d = `M ${vis[0].x} ${base} L ${vis[0].x} ${vis[0].y}`;
  for (let i = 1; i < vis.length; i++) {
    const midX = (vis[i - 1].x + vis[i].x) / 2;
    d += ` C ${midX} ${vis[i - 1].y}, ${midX} ${vis[i].y}, ${vis[i].x} ${vis[i].y}`;
  }
  d += ` L ${vis[vis.length - 1].x} ${base} Z`;
  return d;
};

// Format price for Y-axis: abbreviated
const fmtPrice = (v: number) => {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  if (v >= 1) return `$${v.toFixed(0)}`;
  return `$${v.toFixed(2)}`;
};

export const PriceChart: React.FC<PriceChartProps> = ({
  series1, series2,
  series1Name, series2Name,
  series1Color, series2Color,
  title,
  startFrame = 15,
  drawDurationFrames = 120,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── LAYOUT: single full-width panel ──
  const PAD = { top: 110, bottom: 100, left: 120, right: 120 };
  const chartW = width - PAD.left - PAD.right;
  const chartH = height - PAD.top - PAD.bottom;

  // ── ANIMATION ──
  const titleY = spring({ frame, fps, config: { damping: 14 }, from: -50, to: 0 });
  const titleOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

  const drawProgress = interpolate(frame,
    [startFrame, startFrame + drawDurationFrames], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) });

  const afterDraw = interpolate(frame,
    [startFrame + drawDurationFrames, startFrame + drawDurationFrames + 20], [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── NORMALIZE helpers ──
  const mkPoints = (series: PricePoint[]): { x: number; y: number }[] => {
    const prices = series.map(p => p.price);
    const mn = Math.min(...prices), mx = Math.max(...prices);
    return series.map((p, i) => ({
      x: PAD.left + (i / (series.length - 1)) * chartW,
      y: PAD.top + chartH - ((p.price - mn) / (mx - mn || 1)) * chartH * 0.88 - chartH * 0.06,
    }));
  };

  // Y-axis ticks for left (OneCoin) and right (Bitcoin)
  const mkYTicks = (series: PricePoint[], align: "left" | "right") => {
    const prices = series.map(p => p.price);
    const mn = Math.min(...prices), mx = Math.max(...prices);
    const xPos = align === "left" ? PAD.left - 15 : width - PAD.right + 15;
    return [0, 0.25, 0.5, 0.75, 1].map(r => ({
      y: PAD.top + chartH - r * chartH * 0.88 - chartH * 0.06,
      label: fmtPrice(mn + r * (mx - mn)),
      x: xPos,
    }));
  };

  // X-axis date labels
  const mkXLabels = (series: PricePoint[]) => {
    const step = Math.floor((series.length - 1) / 5);
    return [0, step, step * 2, step * 3, step * 4, series.length - 1].map(i => ({
      x: PAD.left + (i / (series.length - 1)) * chartW,
      label: series[i]?.date ?? "",
    }));
  };

  const s1pts = mkPoints(series1);
  const s2pts = mkPoints(series2);

  const s1yticks = mkYTicks(series1, "left");
  const s2yticks = mkYTicks(series2, "right");
  const xlabels = mkXLabels(series1); // Assuming same time span

  const baseline = PAD.top + chartH;

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body, position: "relative" }}>

      {/* ── MAIN TITLE (Color coded to act as legend) ── */}
      <div style={{
        position: "absolute", top: 25, left: 0, width: "100%", textAlign: "center",
        opacity: titleOp, transform: `translateY(${titleY}px)`,
      }}>
        <div style={{ fontSize: theme.sizes.titleSmall, fontWeight: 900, fontFamily: theme.fonts.heading, letterSpacing: 2 }}>
          <span style={{ color: series1Color }}>ONECOIN</span>
          <span style={{ color: theme.colors.white }}> VS </span>
          <span style={{ color: series2Color }}>BITCOIN</span>
        </div>
      </div>

      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="oc-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={series1Color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={series1Color} stopOpacity={0} />
          </linearGradient>
          <filter id="lineglow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── GRID + AXES ── */}
        {/* Left Y axis line (OneCoin) */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseline}
          stroke={theme.colors.grayDim} strokeWidth={1.5} />
        {/* Right Y axis line (Bitcoin) */}
        <line x1={width - PAD.right} y1={PAD.top} x2={width - PAD.right} y2={baseline}
          stroke={theme.colors.grayDim} strokeWidth={1.5} />
        {/* X axis line */}
        <line x1={PAD.left} y1={baseline} x2={width - PAD.right} y2={baseline}
          stroke={theme.colors.grayDim} strokeWidth={1.5} />

        {/* Horizontal grid (using left ticks for alignment) */}
        {s1yticks.map((t, i) => (
          <line key={`grid-${i}`} x1={PAD.left} y1={t.y} x2={width - PAD.right} y2={t.y}
            stroke={theme.colors.gridLine} strokeWidth={1} strokeDasharray="5 4" />
        ))}

        {/* Left Y ticks (OneCoin) */}
        {s1yticks.map((t, i) => (
          <text key={`l-tick-${i}`} x={t.x} y={t.y + 5} fill={series1Color}
            fontSize={17} textAnchor="end" fontFamily={theme.fonts.mono}>
            {t.label}
          </text>
        ))}

        {/* Right Y ticks (Bitcoin) */}
        {s2yticks.map((t, i) => (
          <text key={`r-tick-${i}`} x={t.x} y={t.y + 5} fill={series2Color}
            fontSize={17} textAnchor="start" fontFamily={theme.fonts.mono}>
            {t.label}
          </text>
        ))}

        {/* X-axis date labels */}
        {xlabels.map((l, i) => (
          <text key={`x-tick-${i}`} x={l.x} y={baseline + 30}
            fill={theme.colors.gray} fontSize={17}
            textAnchor="middle" fontFamily={theme.fonts.mono}>
            {l.label}
          </text>
        ))}

        {/* ── ONECOIN LINE ── */}
        <path d={buildArea(s1pts, drawProgress, baseline)} fill="url(#oc-grad)" />
        <path d={buildPath(s1pts, drawProgress)}
          fill="none" stroke={series1Color} strokeWidth={5}
          strokeLinecap="round" strokeLinejoin="round"
          filter="url(#lineglow)" />

        {/* ── BITCOIN LINE ── */}
        <path d={buildPath(s2pts, drawProgress)}
          fill="none" stroke={series2Color} strokeWidth={3.5}
          strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />

        {/* ── END DOT + annotation pour OneCoin ── */}
        {drawProgress >= 0.99 && (
          <>
            <circle cx={s1pts[s1pts.length - 1].x} cy={s1pts[s1pts.length - 1].y}
              r={10} fill={series1Color} opacity={afterDraw} filter="url(#lineglow)" />
            {series1[series1.length - 1]?.label && (
              <g opacity={afterDraw}>
                <line
                  x1={s1pts[s1pts.length - 1].x} y1={s1pts[s1pts.length - 1].y - 10}
                  x2={s1pts[s1pts.length - 1].x} y2={s1pts[s1pts.length - 1].y - 65}
                  stroke={theme.colors.red} strokeWidth={2} strokeDasharray="4 3" />
                <text
                  x={s1pts[s1pts.length - 1].x} y={s1pts[s1pts.length - 1].y - 76}
                  fill={theme.colors.red} fontSize={22}
                  textAnchor="middle" fontFamily={theme.fonts.body} fontWeight="bold">
                  {series1[series1.length - 1].label}
                </text>
              </g>
            )}
          </>
        )}

        {/* ── END DOT pour Bitcoin ── */}
        {drawProgress >= 0.99 && (
          <circle cx={s2pts[s2pts.length - 1].x} cy={s2pts[s2pts.length - 1].y}
            r={7} fill={series2Color} opacity={afterDraw} />
        )}


      </svg>
    </div>
  );
};
