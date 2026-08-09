import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type BlockchainComparisonProps = {
  startFrame?: number;
};

export const BlockchainComparison: React.FC<BlockchainComparisonProps> = ({
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const panelWidth = 700;
  const panelHeight = 520;
  const gap = 60;
  const leftX = centerX - panelWidth - gap / 2;
  const rightX = centerX + gap / 2;
  const panelY = 200;

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Panels slide in
  const leftPanelX = interpolate(frame, [startFrame, startFrame + 30], [-100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const rightPanelX = interpolate(frame, [startFrame, startFrame + 30], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const panelOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Node positions for left panel (Bitcoin: decentralized network)
  const leftNodes = [
    { x: 150, y: 80 },
    { x: 300, y: 50 },
    { x: 450, y: 90 },
    { x: 550, y: 180 },
    { x: 500, y: 300 },
    { x: 350, y: 350 },
    { x: 180, y: 320 },
    { x: 100, y: 200 },
  ];

  // Node positions for right panel (OneCoin: central server)
  const rightNodes = [
    { x: 350, y: 200 }, // central
    { x: 150, y: 100 },
    { x: 550, y: 100 },
    { x: 150, y: 350 },
    { x: 550, y: 350 },
  ];

  // Nodes appear staggered
  const nodeAppear = (i: number, isLeft: boolean) => {
    const baseDelay = isLeft ? 30 : 60;
    const appearFrame = startFrame + baseDelay + i * 8;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const scale = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 10 },
      from: 0,
      to: 1,
    });
    return { opacity, scale };
  };

  // Connection lines appear
  const lineProgress = (i: number, isLeft: boolean) => {
    const baseDelay = isLeft ? 38 : 68;
    const appearFrame = startFrame + baseDelay + i * 6;
    return interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
  };

  // Labels
  const labelOpacity = interpolate(frame, [startFrame + 20, startFrame + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Callout
  const calloutFrame = startFrame + 120;
  const calloutOpacity = interpolate(
    frame,
    [calloutFrame, calloutFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Build connections for left panel (each node connects to 2-3 neighbors)
  const leftConnections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    [0, 2], [1, 5], [3, 5], [7, 2],
  ];

  // Right panel: all connect to center (index 0)
  const rightConnections = [
    [0, 1], [0, 2], [0, 3], [0, 4],
  ];

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
          Real Blockchain vs OneCoin
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="nodeGlow2">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left panel: Bitcoin */}
        <g opacity={panelOpacity} transform={`translate(${leftX + leftPanelX}, ${panelY})`}>
          <rect
            x={0}
            y={0}
            width={panelWidth}
            height={panelHeight}
            rx={16}
            fill={theme.colors.bgAlt}
            stroke={theme.colors.blue}
            strokeWidth={2}
          />
          {/* Label */}
          <text
            x={panelWidth / 2}
            y={45}
            textAnchor="middle"
            fill={theme.colors.blue}
            fontSize={theme.sizes.bodySmall}
            fontFamily={theme.fonts.body}
            fontWeight="bold"
            opacity={labelOpacity}
          >
            BITCOIN
          </text>

          {/* Connections */}
          {leftConnections.map(([a, b], i) => {
            const p = lineProgress(i, true);
            const n1 = leftNodes[a];
            const n2 = leftNodes[b];
            const endX = n1.x + (n2.x - n1.x) * p;
            const endY = n1.y + (n2.y - n1.y) * p;
            return (
              <line
                key={`lconn-${i}`}
                x1={n1.x}
                y1={n1.y}
                x2={endX}
                y2={endY}
                stroke={theme.colors.blue}
                strokeWidth={2}
                opacity={0.4}
              />
            );
          })}

          {/* Nodes */}
          {leftNodes.map((node, i) => {
            const { opacity, scale } = nodeAppear(i, true);
            return (
              <g key={`lnode-${i}`} opacity={opacity} transform={`translate(${node.x}, ${node.y}) scale(${scale})`}>
                <circle r={16} fill={theme.colors.blueDim} stroke={theme.colors.blue} strokeWidth={2} filter="url(#nodeGlow2)" />
                <circle r={6} fill={theme.colors.blue} />
              </g>
            );
          })}

          {/* Bottom label */}
          <text
            x={panelWidth / 2}
            y={panelHeight - 25}
            textAnchor="middle"
            fill={theme.colors.gray}
            fontSize={theme.sizes.label}
            fontFamily={theme.fonts.body}
            opacity={labelOpacity}
          >
            Thousands of nodes. No boss.
          </text>
        </g>

        {/* Right panel: OneCoin */}
        <g opacity={panelOpacity} transform={`translate(${rightX + rightPanelX}, ${panelY})`}>
          <rect
            x={0}
            y={0}
            width={panelWidth}
            height={panelHeight}
            rx={16}
            fill={theme.colors.bgAlt}
            stroke={theme.colors.red}
            strokeWidth={2}
          />
          {/* Label */}
          <text
            x={panelWidth / 2}
            y={45}
            textAnchor="middle"
            fill={theme.colors.red}
            fontSize={theme.sizes.bodySmall}
            fontFamily={theme.fonts.body}
            fontWeight="bold"
            opacity={labelOpacity}
          >
            ONECOIN
          </text>

          {/* Connections (star from center) */}
          {rightConnections.map(([a, b], i) => {
            const p = lineProgress(i, false);
            const n1 = rightNodes[a];
            const n2 = rightNodes[b];
            const endX = n1.x + (n2.x - n1.x) * p;
            const endY = n1.y + (n2.y - n1.y) * p;
            return (
              <line
                key={`rconn-${i}`}
                x1={n1.x}
                y1={n1.y}
                x2={endX}
                y2={endY}
                stroke={theme.colors.red}
                strokeWidth={2}
                opacity={0.4}
              />
            );
          })}

          {/* Central node (server) */}
          {(() => {
            const { opacity, scale } = nodeAppear(0, false);
            const node = rightNodes[0];
            return (
              <g opacity={opacity} transform={`translate(${node.x}, ${node.y}) scale(${scale})`}>
                <rect x={-30} y={-30} width={60} height={60} rx={8} fill={theme.colors.redDim} stroke={theme.colors.red} strokeWidth={3} filter="url(#nodeGlow2)" />
                <text x={0} y={8} textAnchor="middle" fill={theme.colors.red} fontSize={theme.sizes.label} fontFamily={theme.fonts.mono} fontWeight="bold">
                  SQL
                </text>
              </g>
            );
          })()}

          {/* Outer nodes */}
          {rightNodes.slice(1).map((node, i) => {
            const { opacity, scale } = nodeAppear(i + 1, false);
            return (
              <g key={`rnode-${i}`} opacity={opacity} transform={`translate(${node.x}, ${node.y}) scale(${scale})`}>
                <circle r={14} fill={theme.colors.bgAlt} stroke={theme.colors.red} strokeWidth={2} opacity={0.6} />
                <circle r={5} fill={theme.colors.red} opacity={0.5} />
              </g>
            );
          })}

          {/* Bottom label */}
          <text
            x={panelWidth / 2}
            y={panelHeight - 25}
            textAnchor="middle"
            fill={theme.colors.gray}
            fontSize={theme.sizes.label}
            fontFamily={theme.fonts.body}
            opacity={labelOpacity}
          >
            One server. One boss.
          </text>
        </g>
      </svg>

      {/* Callout */}
      {calloutOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
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
            A database with a login.
          </div>
        </div>
      )}
    </div>
  );
};
