import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type TrustChainProps = {
  startFrame?: number;
};

export const TrustChain: React.FC<TrustChainProps> = ({
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const centerY = height / 2 + 20;

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Chain nodes: A → B → C → D
  const nodes = [
    { label: "Cousin", sub: "trusts", x: centerX - 540 },
    { label: "Coworker", sub: "trusts", x: centerX - 180 },
    { label: "Pastor", sub: "trusts", x: centerX + 180 },
    { label: "You", sub: "invests", x: centerX + 540 },
  ];

  const nodeRadius = 70;
  const nodeY = centerY;

  // Nodes appear
  const nodeAppear = (i: number) => {
    const appearFrame = startFrame + i * 25;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const scale = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 12 },
      from: 0,
      to: 1,
    });
    return { opacity, scale };
  };

  // Arrows between nodes
  const arrowProgress = (i: number) => {
    const appearFrame = startFrame + i * 25 + 15;
    return interpolate(frame, [appearFrame, appearFrame + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
  };

  // Final node highlight (You)
  const youHighlight = interpolate(
    frame,
    [startFrame + 100, startFrame + 120],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Callout
  const calloutFrame = startFrame + 125;
  const calloutOpacity = interpolate(
    frame,
    [calloutFrame, calloutFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Arrow positions
  const arrowStart = (i: number) => nodes[i].x + nodeRadius + 10;
  const arrowEnd = (i: number) => nodes[i + 1].x - nodeRadius - 10;

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
          top: 50,
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
          The Trust Chain
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="trustGlow">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Arrows between nodes */}
        {nodes.slice(0, -1).map((_, i) => {
          const progress = arrowProgress(i);
          const startX = arrowStart(i);
          const endX = arrowEnd(i);
          const currentEnd = startX + (endX - startX) * progress;

          return (
            <g key={`arrow-${i}`}>
              <line
                x1={startX}
                y1={nodeY}
                x2={currentEnd}
                y2={nodeY}
                stroke={theme.colors.gray}
                strokeWidth={3}
                opacity={0.5}
              />
              {/* Arrow head */}
              {progress > 0.9 && (
                <polygon
                  points={`${endX},${nodeY} ${endX - 12},${nodeY - 8} ${endX - 12},${nodeY + 8}`}
                  fill={theme.colors.gray}
                  opacity={0.6}
                />
              )}
              {/* "trusts" label */}
              {progress > 0.5 && (
                <text
                  x={(startX + endX) / 2}
                  y={nodeY - 20}
                  textAnchor="middle"
                  fill={theme.colors.gray}
                  fontSize={theme.sizes.caption}
                  fontFamily={theme.fonts.body}
                  opacity={interpolate(frame, [startFrame + i * 25 + 25, startFrame + i * 25 + 35], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })}
                >
                  {nodes[i].sub}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const { opacity, scale } = nodeAppear(i);
          const isLast = i === nodes.length - 1;
          const color = isLast ? theme.colors.red : theme.colors.gold;
          const glowSize = isLast ? 1 + youHighlight * 0.15 : 1;

          return (
            <g
              key={`node-${i}`}
              opacity={opacity}
              transform={`translate(${node.x}, ${nodeY}) scale(${scale * glowSize})`}
            >
              {/* Glow ring for "You" */}
              {isLast && youHighlight > 0 && (
                <circle
                  r={nodeRadius + 12}
                  fill="none"
                  stroke={theme.colors.red}
                  strokeWidth={2}
                  opacity={youHighlight * 0.4}
                  filter="url(#trustGlow)"
                />
              )}

              <circle
                r={nodeRadius}
                fill={theme.colors.bgAlt}
                stroke={color}
                strokeWidth={3}
                filter={isLast && youHighlight > 0 ? "url(#trustGlow)" : undefined}
              />

              {/* Person icon */}
              <circle cx={0} cy={-15} r={12} fill={color} />
              <path
                d={`M -20 20 Q 0 -5 20 20 Z`}
                fill={color}
                opacity={0.7}
              />

              {/* Label */}
              <text
                x={0}
                y={nodeRadius + 35}
                textAnchor="middle"
                fill={color}
                fontSize={theme.sizes.bodySmall}
                fontFamily={theme.fonts.body}
                fontWeight="bold"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Callout */}
      {calloutOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: calloutOpacity,
          }}
        >
          <div
            style={{
              display: "inline-block",
              backgroundColor: theme.colors.redDim,
              border: `1px solid ${theme.colors.red}`,
              borderRadius: 12,
              padding: "14px 32px",
              color: theme.colors.white,
              fontSize: theme.sizes.bodySmall,
              fontFamily: theme.fonts.body,
              fontWeight: "bold",
            }}
          >
            Nobody checked. Everyone trusted.
          </div>
        </div>
      )}
    </div>
  );
};
