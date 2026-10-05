import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type MlmPyramidProps = {
  startFrame?: number;
};

const LEVELS = 5;
const NODES_PER_LEVEL = [1, 2, 4, 8, 16];

export const MlmPyramid: React.FC<MlmPyramidProps> = ({
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const topY = 180;
  const bottomY = height - 160;
  const levelHeight = (bottomY - topY) / (LEVELS - 1);

  // Phase 1: Draw MLM tree (startFrame → startFrame + 60)
  // Phase 2: Transform into pyramid (startFrame + 60 → startFrame + 120)
  // Phase 3: Reveal + label (startFrame + 120 → startFrame + 150)

  const phase1End = startFrame + 100;
  const phase2End = startFrame + 200;
  const phase3End = startFrame + 250;

  const transformProgress = interpolate(
    frame,
    [phase1End, phase2End],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
  );

  const revealOpacity = interpolate(
    frame,
    [phase2End, phase3End],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Title animation
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Calculate node positions
  // Phase 1: tree layout (centered, spreading out)
  // Phase 2: pyramid layout (triangular, filling space)
  const getNodePosition = (level: number, indexInLevel: number) => {
    const y = topY + level * levelHeight;
    const nodesInLevel = NODES_PER_LEVEL[level];

    // Tree layout: spread nodes evenly across width with more spread at bottom
    const treeSpread = 80 + level * 120;
    const treeSpacing = treeSpread * 2 / Math.max(1, nodesInLevel - 1);
    const treeX = nodesInLevel === 1
      ? centerX
      : centerX - treeSpread + (indexInLevel * treeSpacing);

    // Pyramid layout: nodes fill triangular space
    const pyramidWidth = 120 + level * 200;
    const pyramidSpacing = pyramidWidth * 2 / Math.max(1, nodesInLevel - 1);
    const pyramidX = nodesInLevel === 1
      ? centerX
      : centerX - pyramidWidth + (indexInLevel * pyramidSpacing);

    // Interpolate between tree and pyramid
    const x = treeX + (pyramidX - treeX) * transformProgress;

    return { x, y };
  };

  // Build connections (parent → child)
  const connections: { x1: number; y1: number; x2: number; y2: number; level: number }[] = [];
  for (let level = 0; level < LEVELS - 1; level++) {
    const parentCount = NODES_PER_LEVEL[level];
    const childCount = NODES_PER_LEVEL[level + 1];
    for (let p = 0; p < parentCount; p++) {
      const parent = getNodePosition(level, p);
      // Each parent has 2 children
      for (let c = 0; c < 2; c++) {
        const childIndex = p * 2 + c;
        if (childIndex < childCount) {
          const child = getNodePosition(level + 1, childIndex);
          connections.push({
            x1: parent.x,
            y1: parent.y,
            x2: child.x,
            y2: child.y,
            level,
          });
        }
      }
    }
  }

  // Node appearance animation (staggered by level)
  const nodeOpacity = (level: number) => {
    const appearFrame = startFrame + level * 20;
    return interpolate(frame, [appearFrame, appearFrame + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  const nodeRadius = 28;

  // Node colors transition: tree (gold) → pyramid (red)
  const nodeColor = transformProgress < 0.5
    ? theme.colors.gold
    : theme.colors.red;
  const nodeColorInterp = transformProgress;

  // Commission labels (appear in phase 1)
  const commissionLabels = ["You", "Level 1", "Level 2", "Level 3", "Level 4"];
  const commissionOpacity = interpolate(
    frame,
    [startFrame + 20, startFrame + 40],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "Educational packages" label fades out during transform
  const packageLabelOpacity = interpolate(
    frame,
    [phase1End - 10, phase1End + 20],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pyramid label fades in
  const pyramidLabelOpacity = interpolate(
    frame,
    [phase2End - 20, phase2End],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "This is a pyramid scheme" callout
  const calloutOpacity = interpolate(
    frame,
    [phase2End, phase2End + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const blendColor = (c1: string, c2: string, t: number) => {
    const hex2rgb = (h: string) => {
      const n = parseInt(h.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const [r1, g1, b1] = hex2rgb(c1);
    const [r2, g2, b2] = hex2rgb(c2);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r}, ${g}, ${b})`;
  };

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
          top: 40,
          left: 0,
          width: "100%",
          textAlign: "center",
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
          The Referral Structure
        </div>
        <div
          style={{
            fontSize: theme.sizes.body,
            color: theme.colors.gray,
            marginTop: 8,
          }}
        >
          Every buyer gets a commission for recruiting the next buyer
        </div>
      </div>

      {/* SVG */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="pyramidFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.colors.red} stopOpacity={0.15} />
            <stop offset="100%" stopColor={theme.colors.red} stopOpacity={0.4} />
          </linearGradient>
        </defs>

        {/* Pyramid fill (appears during transform) */}
        {transformProgress > 0.1 && (
          <polygon
            points={`${centerX},${topY - nodeRadius} ${centerX - 320},${bottomY + nodeRadius} ${centerX + 320},${bottomY + nodeRadius}`}
            fill="url(#pyramidFill)"
            opacity={transformProgress * 0.8}
          />
        )}

        {/* Connection lines */}
        {connections.map((conn, i) => {
          const lineOpacity = interpolate(
            frame,
            [startFrame + conn.level * 20 + 10, startFrame + conn.level * 20 + 30],
            [0, 0.6],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const lineColor = blendColor(theme.colors.gold, theme.colors.red, transformProgress);
          return (
            <line
              key={`conn-${i}`}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              stroke={lineColor}
              strokeWidth={2}
              opacity={lineOpacity}
            />
          );
        })}

        {/* Nodes */}
        {NODES_PER_LEVEL.map((count, level) =>
          Array.from({ length: count }).map((_, idx) => {
            const pos = getNodePosition(level, idx);
            const op = nodeOpacity(level);
            const color = blendColor(theme.colors.gold, theme.colors.red, transformProgress);
            return (
              <g key={`node-${level}-${idx}`} opacity={op}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={theme.colors.bgAlt}
                  stroke={color}
                  strokeWidth={3}
                  filter="url(#nodeGlow)"
                />
                {/* Person icon inside node */}
                <circle cx={pos.x} cy={pos.y - 6} r={6} fill={color} />
                <path
                  d={`M ${pos.x - 10} ${pos.y + 10} Q ${pos.x} ${pos.y - 2} ${pos.x + 10} ${pos.y + 10}`}
                  fill={color}
                />
              </g>
            );
          })
        )}

        {/* Level labels (left side) */}
        {NODES_PER_LEVEL.map((_, level) => {
          const y = topY + level * levelHeight;
          const op = interpolate(
            frame,
            [startFrame + level * 20, startFrame + level * 20 + 20],
            [0, commissionOpacity],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <text
              key={`label-${level}`}
              x={80}
              y={y + 5}
              fill={theme.colors.gray}
              fontSize={theme.sizes.label}
              fontFamily={theme.fonts.mono}
              opacity={op * packageLabelOpacity}
            >
              {commissionLabels[level]}
            </text>
          );
        })}

        {/* Commission arrow labels (right side, phase 1) */}
        {NODES_PER_LEVEL.slice(0, -1).map((_, level) => {
          const y = topY + level * levelHeight + levelHeight / 2;
          const op = interpolate(
            frame,
            [startFrame + 50 + level * 10, startFrame + 70 + level * 10],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          return (
            <text
              key={`commission-${level}`}
              x={width - 100}
              y={y + 5}
              fill={theme.colors.gold}
              fontSize={theme.sizes.label}
              fontFamily={theme.fonts.body}
              opacity={op * packageLabelOpacity}
              textAnchor="end"
            >
              {level === 0 ? "10% commission" : `${10 - level * 2}% commission`}
            </text>
          );
        })}
      </svg>

      {/* "Educational packages" label (phase 1) */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: packageLabelOpacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.goldDim}`,
            borderRadius: 8,
            padding: "10px 24px",
            color: theme.colors.gold,
            fontSize: theme.sizes.bodySmall,
          }}
        >
          "Educational Packages" — the product being "sold"
        </div>
      </div>

      {/* Pyramid label (phase 2/3) */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: pyramidLabelOpacity,
        }}
      >
        <div
          style={{
            display: "inline-block",
            backgroundColor: theme.colors.redDim,
            border: `1px solid ${theme.colors.red}`,
            borderRadius: 8,
            padding: "10px 24px",
            color: theme.colors.red,
            fontSize: theme.sizes.bodySmall,
          }}
        >
          The "product" was never the point. The recruitment was.
        </div>
      </div>

      {/* Callout: "This is a pyramid scheme" */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 80,
          opacity: calloutOpacity,
          backgroundColor: theme.colors.redDim,
          border: `2px solid ${theme.colors.red}`,
          borderRadius: 12,
          padding: "16px 28px",
          color: theme.colors.white,
          fontSize: theme.sizes.body,
          fontFamily: theme.fonts.heading,
          fontWeight: "bold",
          boxShadow: `0 0 30px ${theme.colors.red}40`,
        }}
      >
        This is a pyramid scheme.
      </div>
    </div>
  );
};
