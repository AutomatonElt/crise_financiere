import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type PackagesTableProps = {
  startFrame?: number;
};

const PACKAGES = [
  { name: "Starter", price: "€110", tokens: "1,000" },
  { name: "Trader", price: "€550", tokens: "5,000" },
  { name: "Pro Trader", price: "€1,100", tokens: "10,000" },
  { name: "Executive", price: "€3,300", tokens: "30,000" },
  { name: "Tycoon", price: "€5,500", tokens: "50,000" },
  { name: "Diamond", price: "€27,500", tokens: "250,000" },
];

export const PackagesTable: React.FC<PackagesTableProps> = ({
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;
  const tableWidth = 900;
  const rowHeight = 80;
  const headerHeight = 70;
  const tableX = centerX - tableWidth / 2;
  const tableY = 200;

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Row appear animation
  const rowAppear = (i: number) => {
    const appearFrame = startFrame + i * 12;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const xOffset = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 12 },
      from: -60,
      to: 0,
    });
    return { opacity, xOffset };
  };

  // Header animation
  const headerOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Diamond highlight (last row glows)
  const diamondGlow = interpolate(
    frame,
    [startFrame + 72, startFrame + 90],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Callout
  const calloutFrame = startFrame + 95;
  const calloutOpacity = interpolate(
    frame,
    [calloutFrame, calloutFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const colWidths = [300, 300, 300];
  const colX = [
    tableX + 40,
    tableX + 40 + colWidths[0],
    tableX + 40 + colWidths[0] + colWidths[1],
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
          "Educational Packages"
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="rowGlow">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Header */}
        <g opacity={headerOpacity}>
          <rect
            x={tableX}
            y={tableY}
            width={tableWidth}
            height={headerHeight}
            rx={10}
            fill={theme.colors.surface}
          />
          <text
            x={colX[0]}
            y={tableY + headerHeight / 2 + 8}
            fill={theme.colors.gray}
            fontSize={theme.sizes.label}
            fontFamily={theme.fonts.body}
            fontWeight="bold"
          >
            PACKAGE
          </text>
          <text
            x={colX[1]}
            y={tableY + headerHeight / 2 + 8}
            fill={theme.colors.gray}
            fontSize={theme.sizes.label}
            fontFamily={theme.fonts.body}
            fontWeight="bold"
          >
            PRICE
          </text>
          <text
            x={colX[2]}
            y={tableY + headerHeight / 2 + 8}
            fill={theme.colors.gray}
            fontSize={theme.sizes.label}
            fontFamily={theme.fonts.body}
            fontWeight="bold"
          >
            TOKENS
          </text>
        </g>

        {/* Rows */}
        {PACKAGES.map((pkg, i) => {
          const { opacity, xOffset } = rowAppear(i);
          const y = tableY + headerHeight + 10 + i * (rowHeight + 5);
          const isDiamond = i === PACKAGES.length - 1;
          const rowColor = isDiamond ? theme.colors.surface : theme.colors.bgAlt;
          const strokeColor = isDiamond ? theme.colors.gold : theme.colors.grayDim;
          const textColor = isDiamond ? theme.colors.gold : theme.colors.white;

          return (
            <g key={`row-${i}`} opacity={opacity} transform={`translate(${xOffset}, 0)`}>
              {/* Row background */}
              <rect
                x={tableX}
                y={y}
                width={tableWidth}
                height={rowHeight}
                rx={8}
                fill={rowColor}
                stroke={strokeColor}
                strokeWidth={isDiamond ? 3 : 1}
                filter={isDiamond && diamondGlow > 0 ? "url(#rowGlow)" : undefined}
                opacity={isDiamond ? 0.3 + diamondGlow * 0.7 : 1}
              />

              {/* Package name */}
              <text
                x={colX[0]}
                y={y + rowHeight / 2 + 8}
                fill={textColor}
                fontSize={theme.sizes.bodySmall}
                fontFamily={theme.fonts.body}
                fontWeight="bold"
              >
                {pkg.name}
              </text>

              {/* Price */}
              <text
                x={colX[1]}
                y={y + rowHeight / 2 + 8}
                fill={textColor}
                fontSize={theme.sizes.bodySmall}
                fontFamily={theme.fonts.heading}
                fontWeight="bold"
              >
                {pkg.price}
              </text>

              {/* Tokens */}
              <text
                x={colX[2]}
                y={y + rowHeight / 2 + 8}
                fill={isDiamond ? theme.colors.gold : theme.colors.gray}
                fontSize={theme.sizes.bodySmall}
                fontFamily={theme.fonts.mono}
              >
                {pkg.tokens}
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
              backgroundColor: theme.colors.goldDim,
              border: `1px solid ${theme.colors.gold}`,
              borderRadius: 12,
              padding: "14px 32px",
              color: theme.colors.gold,
              fontSize: theme.sizes.bodySmall,
              fontFamily: theme.fonts.body,
              fontWeight: "bold",
            }}
          >
            Courses nobody read. Coins that didn't exist.
          </div>
        </div>
      )}
    </div>
  );
};
