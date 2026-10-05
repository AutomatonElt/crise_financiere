import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type FlowchartProps = {
  startFrame?: number;
  // Optional background image
  backgroundImage?: string;
};

type Node = {
  id: string;
  label: string;
  sublabel?: string;
  // Position in the flow (0 = top, 1 = bottom)
  level: number;
  // Color
  color: string;
  // Whether this is the final "result" node
  isResult?: boolean;
};

type Connector = {
  from: string;
  to: string;
  label?: string;
};

const nodes: Node[] = [
  {
    id: "scott",
    label: "MARK SCOTT",
    sublabel: "Lawyer & Ruja's associate",
    level: 0,
    color: theme.colors.gold,
  },
  {
    id: "400m",
    label: "$400M",
    sublabel: "OneCoin proceeds laundered",
    level: 1,
    color: theme.colors.white,
  },
  {
    id: "funds",
    label: "FAKE INVESTMENT FUNDS",
    sublabel: "FEP · Real Estate · Private Equity",
    level: 2,
    color: theme.colors.blue,
  },
  {
    id: "shell",
    label: "SHELL COMPANIES",
    sublabel: "Offshore jurisdictions",
    level: 3,
    color: theme.colors.gray,
  },
  {
    id: "laundering",
    label: "MONEY LAUNDERING",
    sublabel: "Conspiracy · 20 years",
    level: 4,
    color: theme.colors.red,
    isResult: true,
  },
];

const connectors: Connector[] = [
  { from: "scott", to: "400m", label: "received" },
  { from: "400m", to: "funds", label: "wired through" },
  { from: "funds", to: "shell", label: "hidden in" },
  { from: "shell", to: "laundering", label: "resulted in" },
];

export const Flowchart: React.FC<FlowchartProps> = ({
  startFrame = 15,
  backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Layout
  const nodeWidth = 520;
  const nodeHeight = 90;
  const centerX = width / 2;
  const startY = 180;
  const gapY = 130;

  // Each node appears sequentially
  const nodeAppear = (i: number) => {
    const appearFrame = startFrame + i * 25;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 12 },
      from: 40,
      to: 0,
    });
    const scale = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 10, stiffness: 100 },
      from: 0.8,
      to: 1,
    });
    return { opacity, y, scale, appearFrame };
  };

  // Connectors draw after their source node
  const connectorProgress = (i: number) => {
    const sourceNode = nodes.findIndex((n) => n.id === connectors[i].from);
    const appearFrame = startFrame + sourceNode * 25 + 20;
    return interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  };

  // Connector label opacity
  const connectorLabelOpacity = (i: number) => {
    const sourceNode = nodes.findIndex((n) => n.id === connectors[i].from);
    const appearFrame = startFrame + sourceNode * 25 + 30;
    return interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Glow pulse on result node
  const resultGlow = nodes.findIndex((n) => n.isResult);
  const resultAppear = startFrame + resultGlow * 25;
  const glowPulse = frame > resultAppear + 20
    ? interpolate(Math.sin((frame - resultAppear) * 0.08), [-1, 1], [0.2, 0.6])
    : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.bg,
        position: "relative",
        fontFamily: theme.fonts.body,
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
            filter: "blur(6px) grayscale(0.5)",
          }}
        />
      )}

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: theme.sizes.titleSmall,
            fontWeight: "bold",
            color: theme.colors.white,
            fontFamily: theme.fonts.heading,
            letterSpacing: 2,
          }}
        >
          The Laundering Trail
        </div>
        <div
          style={{
            fontSize: theme.sizes.caption,
            color: theme.colors.gray,
            marginTop: 8,
          }}
        >
          How $400M moved through the system
        </div>
      </div>

      {/* SVG for connectors */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L8,3 z" fill={theme.colors.gold} />
          </marker>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {connectors.map((conn, i) => {
          const fromIdx = nodes.findIndex((n) => n.id === conn.from);
          const toIdx = nodes.findIndex((n) => n.id === conn.to);
          const fromY = startY + fromIdx * gapY + nodeHeight;
          const toY = startY + toIdx * gapY;
          const midY = (fromY + toY) / 2;
          const p = connectorProgress(i);

          // Animated line: grows from source to target
          const endY = fromY + (toY - fromY) * p;

          return (
            <g key={`conn-${i}`}>
              <line
                x1={centerX}
                y1={fromY}
                x2={centerX}
                y2={endY}
                stroke={theme.colors.gold}
                strokeWidth={2}
                strokeDasharray="6 3"
                markerEnd={p > 0.9 ? "url(#arrow)" : undefined}
                filter="url(#lineGlow)"
              />
              {conn.label && p > 0.5 && (
                <text
                  x={centerX + 15}
                  y={midY}
                  fill={theme.colors.gray}
                  fontSize={16}
                  fontFamily={theme.fonts.mono}
                  opacity={connectorLabelOpacity(i)}
                >
                  {conn.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => {
    const { opacity, y, scale } = nodeAppear(i);
    const nodeY = startY + i * gapY;
    const isResult = node.isResult;

    return (
      <div
        key={node.id}
        style={{
          position: "absolute",
          left: centerX - nodeWidth / 2,
          top: nodeY + y,
          width: nodeWidth,
          height: nodeHeight,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: isResult ? `${node.color}15` : `${theme.colors.surface}`,
            border: `2px solid ${node.color}`,
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isResult
              ? `0 0 ${20 + glowPulse * 40}px ${node.color}${Math.floor(glowPulse * 100).toString(16).padStart(2, "0")}`
              : `0 4px 20px rgba(0,0,0,0.3)`,
          }}
        >
          <div
            style={{
              fontSize: isResult ? 28 : 24,
              fontWeight: "bold",
              color: node.color,
              fontFamily: theme.fonts.heading,
              letterSpacing: 1,
            }}
          >
            {node.label}
          </div>
          {node.sublabel && (
            <div
              style={{
                fontSize: 16,
                color: theme.colors.gray,
                marginTop: 6,
                fontFamily: theme.fonts.body,
              }}
            >
              {node.sublabel}
            </div>
          )}
        </div>
      </div>
    );
  })}
    </div>
  );
};
