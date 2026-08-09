import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type ThreeTheoriesProps = {
  startFrame?: number;
};

const THEORIES = [
  {
    icon: "skull",
    title: "Dead",
    subtitle: "Nov 2018 — yacht, Ionian Sea",
    color: theme.colors.red,
  },
  {
    icon: "shadow",
    title: "Alive",
    subtitle: "Under mob protection",
    color: theme.colors.gold,
  },
  {
    icon: "coffee",
    title: "New life",
    subtitle: "Cape Town, new identity",
    color: theme.colors.blue,
  },
];

// Simple SVG icons drawn inline
const SkullIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <g>
    <circle cx={0} cy={-5} r={size * 0.4} fill="none" stroke={color} strokeWidth={3} />
    <circle cx={-size * 0.15} cy={-8} r={size * 0.08} fill={color} />
    <circle cx={size * 0.15} cy={-8} r={size * 0.08} fill={color} />
    <path
      d={`M ${-size * 0.12} ${size * 0.1} L ${-size * 0.12} ${size * 0.25} M 0 ${size * 0.1} L 0 ${size * 0.25} M ${size * 0.12} ${size * 0.1} L ${size * 0.12} ${size * 0.25}`}
      stroke={color}
      strokeWidth={2}
    />
  </g>
);

const ShadowIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <g>
    <circle cx={0} cy={-size * 0.15} r={size * 0.18} fill="none" stroke={color} strokeWidth={3} />
    <path
      d={`M ${-size * 0.25} ${size * 0.3}
          C ${-size * 0.25} ${0}, ${size * 0.25} ${0}, ${size * 0.25} ${size * 0.3}
          L ${size * 0.25} ${size * 0.35}
          L ${-size * 0.25} ${size * 0.35} Z`}
      fill={color}
      opacity={0.6}
    />
  </g>
);

const CoffeeIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <g>
    <path
      d={`M ${-size * 0.25} ${-size * 0.1}
          L ${-size * 0.2} ${size * 0.3}
          L ${size * 0.2} ${size * 0.3}
          L ${size * 0.25} ${-size * 0.1} Z`}
      fill="none"
      stroke={color}
      strokeWidth={3}
    />
    <path
      d={`M ${size * 0.25} ${0} C ${size * 0.4} ${0}, ${size * 0.4} ${size * 0.2}, ${size * 0.25} ${size * 0.2}`}
      fill="none"
      stroke={color}
      strokeWidth={3}
    />
    <path d={`M ${-size * 0.1} ${-size * 0.2} Q ${-size * 0.05} ${-size * 0.35} 0 ${-size * 0.2}`} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
    <path d={`M ${0} ${-size * 0.2} Q ${size * 0.05} ${-size * 0.35} ${size * 0.1} ${-size * 0.2}`} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
  </g>
);

const ICONS: Record<string, React.FC<{ color: string; size: number }>> = {
  skull: SkullIcon,
  shadow: ShadowIcon,
  coffee: CoffeeIcon,
};

export const ThreeTheories: React.FC<ThreeTheoriesProps> = ({
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const cardWidth = 460;
  const cardHeight = 340;
  const cardGap = 60;
  const totalWidth = cardWidth * 3 + cardGap * 2;

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Branch lines from center top to each card
  const branchStartY = 200;
  const cardY = height / 2 - cardHeight / 2 + 40;

  const cardPositions = THEORIES.map((_, i) => {
    const x = centerX - totalWidth / 2 + i * (cardWidth + cardGap) + cardWidth / 2;
    return { x, y: cardY };
  });

  // Card appear animation
  const cardAppear = (i: number) => {
    const appearFrame = startFrame + i * 25;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const scale = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 12 },
      from: 0.6,
      to: 1,
    });
    return { opacity, scale };
  };

  // Branch lines
  const branchProgress = (i: number) => {
    const appearFrame = startFrame + i * 25 - 10;
    return interpolate(frame, [appearFrame, appearFrame + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
  };

  // "?" at the top center
  const questionOpacity = interpolate(frame, [startFrame - 5, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Callout
  const calloutFrame = startFrame + 100;
  const calloutOpacity = interpolate(
    frame,
    [calloutFrame, calloutFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

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
          Three Theories
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="cardGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* "?" at top */}
        <text
          x={centerX}
          y={branchStartY - 20}
          textAnchor="middle"
          fill={theme.colors.white}
          fontSize={60}
          fontFamily={theme.fonts.heading}
          fontWeight="bold"
          opacity={questionOpacity}
        >
          Oct 2017
        </text>

        {/* Branch lines from top center to each card */}
        {cardPositions.map((pos, i) => {
          const progress = branchProgress(i);
          const endX = centerX + (pos.x - centerX) * progress;
          const endY = branchStartY + (pos.y - branchStartY) * progress;
          return (
            <line
              key={`branch-${i}`}
              x1={centerX}
              y1={branchStartY}
              x2={endX}
              y2={endY}
              stroke={THEORIES[i].color}
              strokeWidth={3}
              opacity={0.5}
            />
          );
        })}

        {/* Cards */}
        {THEORIES.map((theory, i) => {
          const { opacity, scale } = cardAppear(i);
          const pos = cardPositions[i];
          const Icon = ICONS[theory.icon];

          return (
            <g
              key={`theory-${i}`}
              opacity={opacity}
              transform={`translate(${pos.x}, ${pos.y + cardHeight / 2}) scale(${scale})`}
            >
              {/* Card background */}
              <rect
                x={-cardWidth / 2}
                y={-cardHeight / 2}
                width={cardWidth}
                height={cardHeight}
                rx={16}
                fill={theme.colors.bgAlt}
                stroke={theory.color}
                strokeWidth={3}
                filter="url(#cardGlow)"
              />

              {/* Icon */}
              <g transform={`translate(0, ${-cardHeight / 2 + 80})`}>
                <Icon color={theory.color} size={80} />
              </g>

              {/* Title */}
              <text
                x={0}
                y={10}
                textAnchor="middle"
                fill={theory.color}
                fontSize={theme.sizes.titleSmall}
                fontFamily={theme.fonts.heading}
                fontWeight="bold"
              >
                {theory.title}
              </text>

              {/* Subtitle */}
              <text
                x={0}
                y={55}
                textAnchor="middle"
                fill={theme.colors.gray}
                fontSize={theme.sizes.label}
                fontFamily={theme.fonts.body}
              >
                {theory.subtitle}
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
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.grayDim}`,
              borderRadius: 12,
              padding: "14px 32px",
              color: theme.colors.gray,
              fontSize: theme.sizes.bodySmall,
              fontFamily: theme.fonts.body,
            }}
          >
            Nobody knows which one is true.
          </div>
        </div>
      )}
    </div>
  );
};
