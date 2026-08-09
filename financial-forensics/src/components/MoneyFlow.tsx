import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  staticFile,
} from "remotion";
import { theme } from "../theme";

type MoneyFlowProps = {
  startFrame?: number;
};

export const MoneyFlow: React.FC<MoneyFlowProps> = ({ startFrame = 15 }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Input box animation
  const inputBoxOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const inputBoxScale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 12 },
    from: 0.7,
    to: 1,
  });

  // Counter animation ($4B)
  const counterProgress = interpolate(
    frame,
    [startFrame + 10, startFrame + 50],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );
  const displayAmount = Math.round(4.0 * counterProgress * 100) / 100;
  const counterText = counterProgress < 1
    ? `$${displayAmount.toFixed(1)}B`
    : "$4.0B";

  // Flow lines appear
  const flowLineProgress = interpolate(
    frame,
    [startFrame + 40, startFrame + 80],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.ease) }
  );

  // Output boxes
  const outputs = [
    { label: "Recovered", amount: "$300M", color: theme.colors.green, width: 300 },
    { label: "Frozen", amount: "$100M", color: theme.colors.blue, width: 300 },
    { label: "Missing", amount: "$3.4B", color: theme.colors.red, width: 500 },
  ];

  const outputStartFrame = startFrame + 70;

  // "?" giant
  const questionOpacity = interpolate(
    frame,
    [startFrame + 110, startFrame + 140],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const questionScale = spring({
    frame: frame - (startFrame + 110),
    fps,
    config: { damping: 8, stiffness: 80 },
    from: 0,
    to: 1,
  });

  // Input box position
  const inputBoxY = 200;
  const inputBoxWidth = 400;
  const inputBoxHeight = 100;

  // Output boxes positions
  const outputY = height - 280;
  const totalOutputWidth = outputs.reduce((sum, o) => sum + o.width + 60, 0) - 60;
  let outputStartX = centerX - totalOutputWidth / 2;

  const outputPositions = outputs.map((o) => {
    const x = outputStartX + o.width / 2;
    outputStartX += o.width + 60;
    return { ...o, x };
  });

  // Flow path from input to each output
  const buildFlowPath = (fromX: number, fromY: number, toX: number, toY: number, progress: number) => {
    const midY = (fromY + toY) / 2;
    const visibleProgress = Math.min(progress * 3, 1); // speed up path drawing
    const endX = fromX + (toX - fromX) * visibleProgress;
    const endY = fromY + (toY - fromY) * visibleProgress;
    return `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${endX} ${endY}`;
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
          Where did the money go?
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="flowGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Flow lines */}
        {outputPositions.map((out, i) => {
          const path = buildFlowPath(
            centerX,
            inputBoxY + inputBoxHeight,
            out.x,
            outputY,
            flowLineProgress
          );
          return (
            <path
              key={`flow-${i}`}
              d={path}
              fill="none"
              stroke={out.color}
              strokeWidth={4}
              strokeLinecap="round"
              opacity={0.7}
              filter="url(#flowGlow)"
            />
          );
        })}

        {/* Input box */}
        <g opacity={inputBoxOpacity} transform={`translate(${centerX}, ${inputBoxY + inputBoxHeight / 2}) scale(${inputBoxScale})`}>
          <rect
            x={-inputBoxWidth / 2}
            y={-inputBoxHeight / 2}
            width={inputBoxWidth}
            height={inputBoxHeight}
            rx={12}
            fill={theme.colors.surface}
            stroke={theme.colors.gold}
            strokeWidth={3}
          />
          {/* Dollar bill icon */}
          <image
            href={staticFile("icons/dollar-bill-gold.svg")}
            x={-inputBoxWidth / 2 + 20}
            y={-22}
            width={80}
            height={44}
          />
          <text
            x={30}
            y={-8}
            textAnchor="middle"
            fill={theme.colors.gold}
            fontSize={theme.sizes.bodySmall}
            fontFamily={theme.fonts.body}
          >
            Total stolen
          </text>
          <text
            x={30}
            y={28}
            textAnchor="middle"
            fill={theme.colors.white}
            fontSize={theme.sizes.titleSmall}
            fontFamily={theme.fonts.heading}
            fontWeight="bold"
          >
            {counterText}
          </text>
        </g>

        {/* Output boxes */}
        {outputPositions.map((out, i) => {
          const op = interpolate(
            frame,
            [outputStartFrame + i * 15, outputStartFrame + i * 15 + 20],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const boxScale = spring({
            frame: frame - (outputStartFrame + i * 15),
            fps,
            config: { damping: 12 },
            from: 0.6,
            to: 1,
          });

          return (
            <g key={`out-${i}`} opacity={op} transform={`translate(${out.x}, ${outputY}) scale(${boxScale})`}>
              <rect
                x={-out.width / 2}
                y={-60}
                width={out.width}
                height={120}
                rx={10}
                fill={theme.colors.bgAlt}
                stroke={out.color}
                strokeWidth={3}
              />
              {/* Dollar bill icon */}
              <image
                href={staticFile("icons/dollar-bill.svg")}
                x={-out.width / 2 + 15}
                y={-22}
                width={70}
                height={38}
                opacity={0.8}
              />
              <text
                x={30}
                y={-12}
                textAnchor="middle"
                fill={out.color}
                fontSize={theme.sizes.bodySmall}
                fontFamily={theme.fonts.body}
                fontWeight="bold"
              >
                {out.label}
              </text>
              <text
                x={30}
                y={32}
                textAnchor="middle"
                fill={theme.colors.white}
                fontSize={theme.sizes.body}
                fontFamily={theme.fonts.heading}
                fontWeight="bold"
              >
                {out.amount}
              </text>
            </g>
          );
        })}

        {/* Giant "?" over the Missing box */}
        {questionOpacity > 0 && (
          <text
            x={outputPositions[2].x}
            y={outputY - 90}
            textAnchor="middle"
            fill={theme.colors.red}
            fontSize={120 * questionScale}
            fontFamily={theme.fonts.heading}
            fontWeight="bold"
            opacity={questionOpacity}
            filter="url(#flowGlow)"
          >
            ?
          </text>
        )}
      </svg>

      {/* Bottom callout */}
      {questionOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: questionOpacity,
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
            Over 90% — never found.
          </div>
        </div>
      )}
    </div>
  );
};
