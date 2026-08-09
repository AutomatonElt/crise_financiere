import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type MiningComparisonProps = {
  startFrame?: number;
};

export const MiningComparison: React.FC<MiningComparisonProps> = ({
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

  // Panels fade in
  const panelOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Labels
  const labelOpacity = interpolate(frame, [startFrame + 15, startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bitcoin mining: animated hash symbols cycling
  const hashCycle = Math.floor(frame / 3) % 4;
  const hashSymbols = ["0x4F2A", "0x9B1E", "0x3C7D", "0xA8F5"];
  const hashOpacity = (i: number) => {
    const appearFrame = startFrame + 30 + i * 10;
    return interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  // Bitcoin mining rig icon (server racks with energy)
  const rigPulse = interpolate(
    frame,
    [startFrame + 40, startFrame + 60, startFrame + 80],
    [0.5, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // OneCoin button press animation
  const buttonPressFrame = startFrame + 70;
  const buttonPress = spring({
    frame: frame - buttonPressFrame,
    fps,
    config: { damping: 8 },
    from: 0,
    to: 1,
  });
  const buttonY = buttonPress < 0.5 ? 0 : interpolate(buttonPress, [0.5, 1], [0, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Coins appear after button press
  const coinAppearFrame = startFrame + 85;
  const coinAppear = interpolate(
    frame,
    [coinAppearFrame, coinAppearFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Callout
  const calloutFrame = startFrame + 110;
  const calloutOpacity = interpolate(
    frame,
    [calloutFrame, calloutFrame + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Stats for Bitcoin side
  const btcStats = [
    { label: "Energy", value: "~150 TWh/yr" },
    { label: "Hash rate", value: "500 EH/s" },
    { label: "Difficulty", value: "Auto" },
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
          Mining: Real vs Fake
        </div>
      </div>

      {/* SVG */}
      <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
        <defs>
          <filter id="miningGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Left panel: Bitcoin mining */}
        <g opacity={panelOpacity} transform={`translate(${leftX}, ${panelY})`}>
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
            BITCOIN MINING
          </text>

          {/* Server racks */}
          <g transform={`translate(${panelWidth / 2}, 180)`} opacity={rigPulse}>
            {[0, 1, 2].map((i) => (
              <g key={`rack-${i}`} transform={`translate(${(i - 1) * 80}, 0)`}>
                <rect x={-30} y={-40} width={60} height={80} rx={6} fill={theme.colors.surface} stroke={theme.colors.blue} strokeWidth={2} filter="url(#miningGlow)" />
                {/* LED lights */}
                <circle cx={-15} cy={-20} r={4} fill={theme.colors.blue} opacity={rigPulse} />
                <circle cx={0} cy={-20} r={4} fill={theme.colors.blue} opacity={rigPulse * 0.7} />
                <circle cx={15} cy={-20} r={4} fill={theme.colors.blue} opacity={rigPulse * 0.5} />
                {/* Vents */}
                <line x1={-20} y1={0} x2={20} y2={0} stroke={theme.colors.blueDim} strokeWidth={2} />
                <line x1={-20} y1={15} x2={20} y2={15} stroke={theme.colors.blueDim} strokeWidth={2} />
              </g>
            ))}
          </g>

          {/* Energy bolts */}
          <g transform={`translate(${panelWidth / 2}, 180)`} opacity={rigPulse * 0.6}>
            <path d="M -130 -60 L -110 -30 L -120 -30 L -100 0" fill="none" stroke={theme.colors.blue} strokeWidth={3} strokeLinecap="round" />
            <path d="M 130 -60 L 110 -30 L 120 -30 L 100 0" fill="none" stroke={theme.colors.blue} strokeWidth={3} strokeLinecap="round" />
          </g>

          {/* Hash display */}
          <g transform={`translate(${panelWidth / 2}, 310)`}>
            {hashSymbols.map((hash, i) => {
              const op = hashOpacity(i);
              const isActive = i === hashCycle;
              return (
                <text
                  key={`hash-${i}`}
                  x={0}
                  y={i * 30}
                  textAnchor="middle"
                  fill={isActive ? theme.colors.blue : theme.colors.grayDim}
                  fontSize={theme.sizes.label}
                  fontFamily={theme.fonts.mono}
                  opacity={op * (isActive ? 1 : 0.4)}
                >
                  {hash}
                </text>
              );
            })}
          </g>

          {/* Stats */}
          <g transform={`translate(${panelWidth / 2}, 430)`}>
            {btcStats.map((stat, i) => (
              <g key={`stat-${i}`} opacity={labelOpacity}>
                <text
                  x={-200 + i * 200}
                  y={0}
                  textAnchor="middle"
                  fill={theme.colors.gray}
                  fontSize={theme.sizes.caption}
                  fontFamily={theme.fonts.body}
                >
                  {stat.label}
                </text>
                <text
                  x={-200 + i * 200}
                  y={28}
                  textAnchor="middle"
                  fill={theme.colors.blue}
                  fontSize={theme.sizes.caption}
                  fontFamily={theme.fonts.mono}
                  fontWeight="bold"
                >
                  {stat.value}
                </text>
              </g>
            ))}
          </g>
        </g>

        {/* Right panel: OneCoin "mining" */}
        <g opacity={panelOpacity} transform={`translate(${rightX}, ${panelY})`}>
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
            ONECOIN "MINING"
          </text>

          {/* Web interface mockup */}
          <g transform={`translate(${panelWidth / 2}, 180)`}>
            {/* Browser frame */}
            <rect x={-180} y={-70} width={360} height={140} rx={8} fill={theme.colors.surface} stroke={theme.colors.grayDim} strokeWidth={1} opacity={labelOpacity} />
            {/* URL bar */}
            <rect x={-170} y={-60} width={340} height={20} rx={4} fill={theme.colors.bg} opacity={labelOpacity} />
            <text x={-160} y={-46} fill={theme.colors.grayDim} fontSize={14} fontFamily={theme.fonts.mono} opacity={labelOpacity}>
              onecoin.eu/mine
            </text>

            {/* Button */}
            <g transform={`translate(0, ${10 + buttonY})`}>
              <rect
                x={-80}
                y={-25}
                width={160}
                height={50}
                rx={25}
                fill={buttonPress > 0.3 ? theme.colors.red : theme.colors.redDim}
                stroke={theme.colors.red}
                strokeWidth={2}
                filter="url(#miningGlow)"
              />
              <text
                x={0}
                y={8}
                textAnchor="middle"
                fill={theme.colors.white}
                fontSize={theme.sizes.label}
                fontFamily={theme.fonts.body}
                fontWeight="bold"
              >
                GENERATE
              </text>
            </g>
          </g>

          {/* Coins appearing after button press */}
          {coinAppear > 0 && (
            <g transform={`translate(${panelWidth / 2}, 300)`} opacity={coinAppear}>
              {[0, 1, 2].map((i) => (
                <g key={`coin-${i}`} transform={`translate(${(i - 1) * 60}, 0)`}>
                  <circle r={20} fill={theme.colors.goldDim} stroke={theme.colors.gold} strokeWidth={2} />
                  <text x={0} y={7} textAnchor="middle" fill={theme.colors.gold} fontSize={20} fontFamily={theme.fonts.heading} fontWeight="bold">
                    $
                  </text>
                </g>
              ))}
              <text
                x={0}
                y={50}
                textAnchor="middle"
                fill={theme.colors.red}
                fontSize={theme.sizes.label}
                fontFamily={theme.fonts.body}
              >
                No computation. No puzzles. No scarcity.
              </text>
            </g>
          )}

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
            A button. That's it.
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
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.grayDim}`,
              borderRadius: 12,
              padding: "14px 32px",
              color: theme.colors.gray,
              fontSize: theme.sizes.bodySmall,
              fontFamily: theme.fonts.body,
            }}
          >
            Scarcity must be proven, not promised.
          </div>
        </div>
      )}
    </div>
  );
};
