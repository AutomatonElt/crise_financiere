import React from "react";
import {
    AbsoluteFill,
    Img,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { theme } from "../../theme";

const BlinkingCursor: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) => {
    const frame = useCurrentFrame();
    const blink = Math.floor(frame / 18) % 2 === 0 ? 1 : 0;
    return <rect x={x} y={y - 14} width={3} height={18} fill={theme.colors.red} opacity={opacity * blink} />;
};

const TypedNumber: React.FC<{ startFrame: number; targetValue: number; resetFrame?: number; x: number; y: number }> = ({
    startFrame, targetValue, resetFrame, x, y,
}) => {
    const frame = useCurrentFrame();
    let progress = interpolate(frame, [startFrame, startFrame + 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    // After reset, jump back to 0 and ramp up to a different arbitrary value
    let displayed = Math.round(targetValue * progress);
    if (resetFrame && frame >= resetFrame) {
        const p2 = interpolate(frame, [resetFrame, resetFrame + 35], [0, 1], { extrapolateRight: "clamp" });
        displayed = Math.round(9_999_999 * p2); // arbitrary new "mined" number
    }
    return (
        <text x={x} y={y} fill={theme.colors.red} fontSize={22} fontFamily="'Courier New', monospace" fontWeight="bold">
            {displayed.toLocaleString()}
        </text>
    );
};

export const OneCoinDatabaseScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // ── PHASES (360 frames = 12s at 30fps) ──
    // 0–35   : Title card
    // 20–60  : Server + lock appear
    // 60–80  : Ghost nodes cross out
    // 80–130 : SQL panel slides in + first counter
    // 140–175: Hands type
    // 175–230: Counter RESETS → climbs again (arbitrary)
    // 210–260: "ACCESS DENIED" badge
    // 270–330: JUST A DATABASE stamp + pulsing red glow
    // 330–360: Hold

    const fadeIn = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });

    // ── TITLE CARD ──
    const titleOpacity = interpolate(frame, [0, 10, 28, 42], [0, 1, 1, 0], { extrapolateRight: "clamp" });
    const titleScale = interpolate(frame, [0, 10], [0.85, 1], { extrapolateRight: "clamp" });

    // ── SERVER ──
    const serverScale = spring({ frame: frame - 20, fps, config: { damping: 12 } });
    const serverOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
    // Pulsing red glow at end
    const pulse = Math.sin((frame - 265) / 8) * 0.5 + 0.5;
    const glowOpacity = frame > 265 ? interpolate(frame, [265, 290], [0, 1], { extrapolateRight: "clamp" }) * pulse : 0;

    // ── LOCK ──
    const lockPop = spring({ frame: frame - 45, fps, config: { damping: 10 } });

    // ── GHOST NODES ──
    const crossOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });

    // ── SQL PANEL ──
    const sqlX = interpolate(frame, [80, 115], [width, width * 0.5 - 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const sqlOpacity = interpolate(frame, [80, 115], [0, 1], { extrapolateRight: "clamp" });
    const sqlScale = spring({ frame: frame - 82, fps, config: { damping: 14 } });

    // ── HANDS ──
    const handsOpacity = interpolate(frame, [140, 160], [0, 1], { extrapolateRight: "clamp" });
    const handsY = interpolate(frame, [140, 162], [80, 0], { extrapolateRight: "clamp" });

    // ── ACCESS DENIED ──
    const deniedPop = spring({ frame: frame - 210, fps, config: { damping: 8, mass: 1.2 } });
    const deniedOpacity = interpolate(frame, [210, 220, 310, 330], [0, 1, 1, 0], { extrapolateRight: "clamp" });

    // ── RED STAMP ──
    const stampPop = spring({ frame: frame - 270, fps, config: { damping: 8, mass: 1.3 } });

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity: fadeIn, fontFamily: theme.fonts.body, overflow: "hidden" }}>

            {/* ── TITLE CARD ── */}
            <div style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                opacity: titleOpacity, transform: `scale(${titleScale})`,
                pointerEvents: "none", zIndex: 20,
            }}>
                <div style={{ fontSize: theme.sizes.titleMedium, fontWeight: 900, color: theme.colors.red, fontFamily: theme.fonts.heading, letterSpacing: 6, textTransform: "uppercase" }}>
                    OneCoin
                </div>
                <div style={{ fontSize: theme.sizes.body, color: theme.colors.gray, marginTop: 12, letterSpacing: 3 }}>
                    had none of that.
                </div>
            </div>

            <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
                <defs>
                    <filter id="redglow2">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="pulseglow">
                        <feGaussianBlur stdDeviation="22" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* Pulsing red aura on server */}
                {frame > 265 && (
                    <circle cx={width * 0.28} cy={height / 2} r={110}
                        fill={theme.colors.red} opacity={glowOpacity * 0.18} filter="url(#pulseglow)" />
                )}

                {/* ── SINGLE SERVER ── */}
                <g transform={`translate(${width * 0.28}, ${height / 2}) scale(${serverScale})`}
                    style={{ transformOrigin: `${width * 0.28}px ${height / 2}px` }} opacity={serverOpacity}>
                    <circle cx={0} cy={0} r={70} fill="none" stroke={theme.colors.red} strokeWidth={3} filter="url(#redglow2)" opacity={0.6} />
                    <circle cx={0} cy={0} r={50} fill={theme.colors.surface} stroke={theme.colors.red} strokeWidth={2.5} />
                    {[-14, -2, 10].map((dy, i) => (
                        <rect key={i} x={-22} y={dy} width={44} height={9} rx={2}
                            fill={theme.colors.bgAlt} stroke={theme.colors.red} strokeWidth={1.5} />
                    ))}
                    {[-14, -2, 10].map((dy, i) => (
                        <circle key={`led-${i}`} cx={16} cy={dy + 4.5} r={3} fill={theme.colors.red} opacity={0.9} />
                    ))}
                </g>

                {/* SOFIA label */}
                {frame > 40 && (
                    <g opacity={interpolate(frame, [40, 58], [0, 1], { extrapolateRight: "clamp" })}>
                        <text x={width * 0.28} y={height / 2 + 100} textAnchor="middle"
                            fill={theme.colors.white} fontSize={26} fontFamily={theme.fonts.mono} fontWeight="bold" letterSpacing={3}>
                            SOFIA, BULGARIA
                        </text>
                        <text x={width * 0.28} y={height / 2 + 132} textAnchor="middle"
                            fill={theme.colors.red} fontSize={20} fontFamily={theme.fonts.mono}>
                            OneCoin HQ Server
                        </text>
                    </g>
                )}

                {/* LOCK */}
                {frame > 45 && (
                    <g transform={`translate(${width * 0.28}, ${height / 2 - 80}) scale(${lockPop})`}
                        style={{ transformOrigin: `${width * 0.28}px ${height / 2 - 80}px` }}>
                        <rect x={-18} y={-10} width={36} height={26} rx={4} fill={theme.colors.red} opacity={0.85} />
                        <path d="M -10 -10 Q -10 -28 0 -28 Q 10 -28 10 -10" stroke={theme.colors.red} strokeWidth={5} fill="none" />
                        <circle cx={0} cy={7} r={5} fill={theme.colors.bgAlt} />
                    </g>
                )}

                {/* Ghost nodes — crossed out */}
                {[60, 160, 240, 320].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const len = 280;
                    const cx = width * 0.28, cy = height / 2;
                    const ex = cx + Math.cos(rad) * len;
                    const ey = cy + Math.sin(rad) * len;
                    return (
                        <g key={i} opacity={crossOpacity * 0.35}>
                            <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={theme.colors.grayDim} strokeWidth={1.5} strokeDasharray="8 6" />
                            <circle cx={ex} cy={ey} r={22} fill="none" stroke={theme.colors.grayDim} strokeWidth={1.5} strokeDasharray="4 4" />
                            <line x1={ex - 12} y1={ey - 12} x2={ex + 12} y2={ey + 12} stroke={theme.colors.red} strokeWidth={2} opacity={0.7} />
                            <line x1={ex + 12} y1={ey - 12} x2={ex - 12} y2={ey + 12} stroke={theme.colors.red} strokeWidth={2} opacity={0.7} />
                        </g>
                    );
                })}

                {/* Blinking cursor in spreadsheet */}
                {frame > 115 && frame < 180 && (
                    <BlinkingCursor x={sqlX + 320} y={height / 2 + 10} opacity={sqlOpacity} />
                )}

                {/* Typed counter — resets at frame 175 */}
                {frame > 115 && (
                    <TypedNumber startFrame={118} targetValue={4_817_263} resetFrame={175} x={sqlX + 258} y={height / 2 + 10} />
                )}

                {/* ── ACCESS DENIED ── */}
                {frame > 210 && (
                    <g transform={`translate(${width * 0.28}, ${height / 2 - 165}) scale(${deniedPop})`}
                        style={{ transformOrigin: `${width * 0.28}px ${height / 2 - 165}px` }}
                        opacity={deniedOpacity}>
                        <rect x={-110} y={-24} width={220} height={44} rx={8} fill={theme.colors.red} opacity={0.12}
                            stroke={theme.colors.red} strokeWidth={2.5} />
                        <text textAnchor="middle" y={10} fill={theme.colors.red} fontSize={28}
                            fontFamily={theme.fonts.mono} fontWeight={900} letterSpacing={4}>
                            ACCESS DENIED
                        </text>
                    </g>
                )}

                {/* ── JUST A DATABASE stamp ── */}
                {frame > 270 && (
                    <g transform={`translate(${width * 0.6}, ${height * 0.72}) scale(${stampPop}) rotate(-8)`}
                        style={{ transformOrigin: `${width * 0.6}px ${height * 0.72}px` }}>
                        <rect x={-175} y={-38} width={350} height={68} rx={10}
                            fill="none" stroke={theme.colors.red} strokeWidth={6} />
                        <text textAnchor="middle" y={10} fill={theme.colors.red}
                            fontSize={36} fontFamily={theme.fonts.heading} fontWeight={900} letterSpacing={4}>
                            JUST A DATABASE
                        </text>
                    </g>
                )}
            </svg>

            {/* SQL Spreadsheet IMAGE */}
            <div style={{
                position: "absolute", left: sqlX, top: height / 2 - 200,
                width: 600, opacity: sqlOpacity, transform: `scale(${sqlScale})`,
                filter: `drop-shadow(0 10px 30px rgba(230,57,70,0.3))`,
                borderRadius: 12, overflow: "hidden",
            }}>
                <Img src={staticFile("sql_spreadsheet_transparent.png")} style={{ width: "100%", objectFit: "contain" }} />
            </div>

            {/* HANDS typing */}
            <div style={{
                position: "absolute", left: width * 0.28 - 150, top: height / 2 + 130 + handsY,
                width: 300, opacity: handsOpacity,
                filter: `drop-shadow(0 8px 20px rgba(0,0,0,0.6))`,
            }}>
                <Img src={staticFile("employee_typing_transparent.png")} style={{ width: "100%", objectFit: "contain" }} />
            </div>

        </AbsoluteFill>
    );
};
