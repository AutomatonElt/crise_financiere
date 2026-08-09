import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type RewardStaircaseProps = {
  startFrame?: number;
};

const STEPS = [
  { amount: "$100K", date: "Jun 2022", label: "Top Ten standard", color: theme.colors.gray },
  { amount: "$250K", date: "May 2023", label: "Increased", color: theme.colors.blue },
  { amount: "$5M", date: "Jun 2024", label: "State Dept.", color: theme.colors.red },
];

export const RewardStaircase: React.FC<RewardStaircaseProps> = ({
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const baseY = height - 140;
  const stepWidth = 380;
  const stepHeight = 90;
  const stepGap = 40;

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Steps appear staggered
  const stepAppear = (i: number) => {
    const appearFrame = startFrame + i * 30;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const yOffset = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 12 },
      from: 60,
      to: 0,
    });
    return { opacity, yOffset };
  };

  // Comparison callout (appears after all steps)
  const calloutFrame = startFrame + 100;
  const calloutOpacity = interpolate(
    frame,
    [calloutFrame, calloutFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "50x" multiplier
  const multiplierFrame = startFrame + 120;
  const multiplierOpacity = interpolate(
    frame,
    [multiplierFrame, multiplierFrame + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const multiplierScale = spring({
    frame: frame - multiplierFrame,
    fps,
    config: { damping: 8, stiffness: 80 },
    from: 0,
    to: 1,
  });

  // Arrow from $100K to $5M
  const arrowProgress = interpolate(
    frame,
    [startFrame + 90, startFrame + 115],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  // Calculate step positions (staircase going up to the right)
  const getStepPosition = (i: number) => {
    const x = centerX - stepWidth - stepGap / 2 + i * (stepWidth + stepGap);
    const y = baseY - i * (stepHeight + stepGap);
    return { x, y };
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
          The Price on Her Head
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="stepGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Arrow from step 0 to step 2 */}
        {arrowProgress > 0 && (
          <g opacity={calloutOpacity}>
            <path
              d={`M ${getStepPosition(0).x + stepWidth / 2} ${getStepPosition(0).y - 20}
                  Q ${centerX} ${baseY - 250},
                    ${getStepPosition(2).x + stepWidth / 2} ${getStepPosition(2).y - 20}`}
              fill="none"
              stroke={theme.colors.red}
              strokeWidth={3}
              strokeDasharray="8 6"
              opacity={arrowProgress * 0.6}
            />
          </g>
        )}

        {/* Steps */}
        {STEPS.map((step, i) => {
          const { opacity, yOffset } = stepAppear(i);
          const pos = getStepPosition(i);

          return (
            <g key={`step-${i}`} opacity={opacity} transform={`translate(0, ${yOffset})`}>
              {/* Step box */}
              <rect
                x={pos.x}
                y={pos.y - stepHeight}
                width={stepWidth}
                height={stepHeight}
                rx={10}
                fill={theme.colors.bgAlt}
                stroke={step.color}
                strokeWidth={3}
                filter="url(#stepGlow)"
              />
              {/* Amount */}
              <text
                x={pos.x + stepWidth / 2}
                y={pos.y - stepHeight / 2 - 5}
                textAnchor="middle"
                fill={step.color}
                fontSize={theme.sizes.titleSmall}
                fontFamily={theme.fonts.heading}
                fontWeight="bold"
              >
                {step.amount}
              </text>
              {/* Date */}
              <text
                x={pos.x + stepWidth / 2}
                y={pos.y - 18}
                textAnchor="middle"
                fill={theme.colors.gray}
                fontSize={theme.sizes.label}
                fontFamily={theme.fonts.mono}
              >
                {step.date}
              </text>
              {/* Label */}
              <text
                x={pos.x + stepWidth / 2}
                y={pos.y - stepHeight - 15}
                textAnchor="middle"
                fill={step.color}
                fontSize={theme.sizes.label}
                fontFamily={theme.fonts.body}
                opacity={0.7}
              >
                {step.label}
              </text>
            </g>
          );
        })}

        {/* "50x" multiplier */}
        {multiplierOpacity > 0 && (
          <g
            transform={`translate(${centerX}, ${baseY - 200}) scale(${multiplierScale})`}
            opacity={multiplierOpacity}
          >
            <text
              x={0}
              y={0}
              textAnchor="middle"
              fill={theme.colors.red}
              fontSize={80}
              fontFamily={theme.fonts.heading}
              fontWeight="bold"
              filter="url(#stepGlow)"
            >
              50×
            </text>
          </g>
        )}
      </svg>

      {/* Bottom callout */}
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
              border: `2px solid ${theme.colors.red}`,
              borderRadius: 12,
              padding: "14px 32px",
              color: theme.colors.white,
              fontSize: theme.sizes.bodySmall,
              fontFamily: theme.fonts.body,
              fontWeight: "bold",
            }}
          >
            Same tier as cartel leaders.
          </div>
        </div>
      )}
    </div>
  );
};
