import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type ComparisonBarsProps = {
  startFrame?: number;
};

export const ComparisonBars: React.FC<ComparisonBarsProps> = ({
  startFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const centerX = width / 2;

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  const data = [
    {
      name: "Madoff",
      money: "$65B",
      victims: "37,000",
      moneyBarScale: 65,
      victimsBarScale: 1.1,
      color: theme.colors.blue,
      moneyLabel: "$65B stolen",
      victimsLabel: "37K victims",
    },
    {
      name: "OneCoin",
      money: "$4B",
      victims: "3,500,000",
      moneyBarScale: 4,
      victimsBarScale: 100,
      color: theme.colors.gold,
      moneyLabel: "$4B stolen",
      victimsLabel: "3.5M victims",
    },
  ];

  // Bar dimensions
  const barAreaTop = 220;
  const barAreaBottom = height - 180;
  const barAreaHeight = barAreaBottom - barAreaTop;
  const barWidth = 200;
  const barGap = 160;
  const sectionGap = 240;

  // Two sections: money (left) and victims (right)
  const moneySectionX = centerX - sectionGap / 2 - barWidth - barGap / 2;
  const victimsSectionX = centerX + sectionGap / 2 + barGap / 2;

  // Bar grow animation
  const barGrow = (i: number, section: "money" | "victims") => {
    const delay = section === "money" ? 0 : 40;
    const appearFrame = startFrame + i * 25 + delay;
    return interpolate(
      frame,
      [appearFrame, appearFrame + 40],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
    );
  };

  // Labels
  const labelOpacity = (i: number, section: "money" | "victims") => {
    const delay = section === "money" ? 0 : 40;
    const appearFrame = startFrame + i * 25 + delay + 35;
    return interpolate(frame, [appearFrame, appearFrame + 15], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Section headers
  const headerOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Max scales for normalization
  const maxMoneyScale = 65; // Madoff $65B
  const maxVictimsScale = 100; // OneCoin 3.5M

  // Callout
  const calloutFrame = startFrame + 140;
  const calloutOpacity = interpolate(
    frame,
    [calloutFrame, calloutFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const getBarHeight = (scale: number, maxScale: number) => {
    return (scale / maxScale) * barAreaHeight * 0.85;
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
          Madoff vs OneCoin
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <linearGradient id="madoffGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={theme.colors.blueDim} />
            <stop offset="100%" stopColor={theme.colors.blue} />
          </linearGradient>
          <linearGradient id="onecoinGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={theme.colors.goldDim} />
            <stop offset="100%" stopColor={theme.colors.gold} />
          </linearGradient>
        </defs>

        {/* Section headers */}
        <text
          x={moneySectionX + barWidth + barGap / 2}
          y={barAreaTop - 30}
          textAnchor="middle"
          fill={theme.colors.gray}
          fontSize={theme.sizes.bodySmall}
          fontFamily={theme.fonts.body}
          fontWeight="bold"
          opacity={headerOpacity}
        >
          MONEY
        </text>
        <text
          x={victimsSectionX + barWidth + barGap / 2}
          y={barAreaTop - 30}
          textAnchor="middle"
          fill={theme.colors.gray}
          fontSize={theme.sizes.bodySmall}
          fontFamily={theme.fonts.body}
          fontWeight="bold"
          opacity={headerOpacity}
        >
          VICTIMS
        </text>

        {/* Baseline */}
        <line
          x1={moneySectionX - 20}
          y1={barAreaBottom}
          x2={victimsSectionX + barWidth * 2 + barGap + 20}
          y2={barAreaBottom}
          stroke={theme.colors.grayDim}
          strokeWidth={2}
        />

        {/* Money bars */}
        {data.map((d, i) => {
          const grow = barGrow(i, "money");
          const barH = getBarHeight(d.moneyBarScale, maxMoneyScale) * grow;
          const x = moneySectionX + i * (barWidth + barGap);
          const gradId = i === 0 ? "madoffGrad" : "onecoinGrad";
          const op = labelOpacity(i, "money");

          return (
            <g key={`money-${i}`}>
              <rect
                x={x}
                y={barAreaBottom - barH}
                width={barWidth}
                height={barH}
                rx={6}
                fill={`url(#${gradId})`}
              />
              {/* Name */}
              <text
                x={x + barWidth / 2}
                y={barAreaBottom + 35}
                textAnchor="middle"
                fill={d.color}
                fontSize={theme.sizes.bodySmall}
                fontFamily={theme.fonts.body}
                fontWeight="bold"
                opacity={op}
              >
                {d.name}
              </text>
              {/* Amount */}
              <text
                x={x + barWidth / 2}
                y={barAreaBottom - barH - 15}
                textAnchor="middle"
                fill={theme.colors.white}
                fontSize={theme.sizes.body}
                fontFamily={theme.fonts.heading}
                fontWeight="bold"
                opacity={op}
              >
                {d.money}
              </text>
            </g>
          );
        })}

        {/* Victims bars */}
        {data.map((d, i) => {
          const grow = barGrow(i, "victims");
          const barH = getBarHeight(d.victimsBarScale, maxVictimsScale) * grow;
          const x = victimsSectionX + i * (barWidth + barGap);
          const gradId = i === 0 ? "madoffGrad" : "onecoinGrad";
          const op = labelOpacity(i, "victims");

          return (
            <g key={`victims-${i}`}>
              <rect
                x={x}
                y={barAreaBottom - barH}
                width={barWidth}
                height={barH}
                rx={6}
                fill={`url(#${gradId})`}
              />
              {/* Name */}
              <text
                x={x + barWidth / 2}
                y={barAreaBottom + 35}
                textAnchor="middle"
                fill={d.color}
                fontSize={theme.sizes.bodySmall}
                fontFamily={theme.fonts.body}
                fontWeight="bold"
                opacity={op}
              >
                {d.name}
              </text>
              {/* Count */}
              <text
                x={x + barWidth / 2}
                y={barAreaBottom - barH - 15}
                textAnchor="middle"
                fill={theme.colors.white}
                fontSize={theme.sizes.body}
                fontFamily={theme.fonts.heading}
                fontWeight="bold"
                opacity={op}
              >
                {d.victims}
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
              border: `1px solid ${theme.colors.gold}`,
              borderRadius: 12,
              padding: "14px 32px",
              color: theme.colors.gold,
              fontSize: theme.sizes.bodySmall,
              fontFamily: theme.fonts.body,
              fontWeight: "bold",
            }}
          >
            100× more victims. 16× less money.
          </div>
        </div>
      )}
    </div>
  );
};
