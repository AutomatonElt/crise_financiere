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

// The 4 spectrum stages
const STAGES = [
    {
        key: "fraud",
        label: "WHITE-COLLAR FRAUD",
        sublabel: "Fake crypto education.\nSelling hope.",
        color: "#d4af37", // gold
        icon: "📋",
        img: null,
    },
    {
        key: "laundering",
        label: "MONEY LAUNDERING",
        sublabel: "Shell companies.\n$300M+ washed.",
        color: "#3b82f6", // blue
        icon: "💸",
        img: "spectrum_laundering.png",
    },
    {
        key: "crime",
        label: "ORGANIZED CRIME",
        sublabel: "\"Protection\" networks.\nBulgarian syndicates.",
        color: "#f97316", // orange
        icon: "🔫",
        img: "spectrum_crime.png",
    },
    {
        key: "violence",
        label: "VIOLENCE",
        sublabel: "Two executions.\nBodies disposed.",
        color: "#e63946", // red
        icon: "☠️",
        img: "spectrum_violence.png",
    },
];

const StageCard: React.FC<{
    stage: (typeof STAGES)[number];
    index: number;
    startFrame: number;
    isActive: boolean;
}> = ({ stage, index, startFrame, isActive }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const pop = spring({ frame: frame - startFrame, fps, config: { damping: 14 } });
    const imgOp = interpolate(frame, [startFrame, startFrame + 20], [0, 1], { extrapolateRight: "clamp" });

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "0 16px",
                transform: `scale(${pop})`,
                transformOrigin: "bottom center",
            }}
        >
            {/* Image thumbnail */}
            <div
                style={{
                    width: "100%",
                    height: 220,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: `3px solid ${isActive ? stage.color : stage.color + "55"}`,
                    boxShadow: isActive ? `0 0 30px ${stage.color}66` : "none",
                    opacity: imgOp,
                    backgroundColor: "#111",
                    position: "relative",
                    flexShrink: 0,
                }}
            >
                {stage.img ? (
                    <Img
                        src={staticFile(stage.img)}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            filter: isActive ? "none" : "grayscale(80%) brightness(0.5)",
                        }}
                    />
                ) : (
                    // Fraud tile — stylized graphic (no photo)
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `linear-gradient(135deg, #0f172a, #1e293b)`,
                            fontSize: 80,
                        }}
                    >
                        📊
                    </div>
                )}

                {/* Color overlay tint for active */}
                {isActive && (
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(to top, ${stage.color}44, transparent)`,
                        }}
                    />
                )}
            </div>

            {/* Stage label */}
            <div
                style={{
                    marginTop: 18,
                    color: isActive ? stage.color : stage.color + "88",
                    fontSize: 20,
                    fontWeight: 900,
                    letterSpacing: 3,
                    textAlign: "center",
                    fontFamily: theme.fonts.mono,
                }}
            >
                {stage.label}
            </div>
            <div
                style={{
                    marginTop: 10,
                    color: isActive ? theme.colors.gray : theme.colors.grayDim,
                    fontSize: 16,
                    textAlign: "center",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                }}
            >
                {stage.sublabel}
            </div>
        </div>
    );
};

export const GravitySpectrumScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width } = useVideoConfig();

    const STAGE_START_FRAMES = [30, 80, 140, 200];

    // Which stage is "active" (Ruja marker position)
    // She starts at fraud and traverses to violence over time
    const rujaStageFloat = interpolate(
        frame,
        [60, 120, 180, 250, 310, 400, 430],
        [0, 0, 1, 1, 2, 2.8, 4],
        { extrapolateRight: "clamp" }
    );
    const rujaStageIndex = Math.floor(rujaStageFloat);

    // Title
    const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
    const titleY = spring({ frame, fps, config: { damping: 14 }, from: -30, to: 0 });

    // Arrow / connector progress between stages
    const arrowProgress = (stageIdx: number) =>
        interpolate(
            frame,
            [STAGE_START_FRAMES[stageIdx] + 30, STAGE_START_FRAMES[stageIdx + 1] || 350],
            [0, 1],
            { extrapolateRight: "clamp" }
        );

    // Ruja marker X position — spans across the 4 panels
    const CARD_WIDTH = (width - 120) / 4;
    const rujaX = interpolate(
        frame,
        [60, 120, 180, 250, 310, 430],
        [
            60 + CARD_WIDTH * 0.5,
            60 + CARD_WIDTH * 0.5,
            60 + CARD_WIDTH * 1.5,
            60 + CARD_WIDTH * 1.5,
            60 + CARD_WIDTH * 2.5,
            60 + CARD_WIDTH * 3.5,
        ],
        { extrapolateRight: "clamp" }
    );
    // Ruja Y position (sits above the cards)
    const RUJA_Y = 280;
    const rujaPortOp = interpolate(frame, [50, 80], [0, 1], { extrapolateRight: "clamp" });

    // Bottom quote fade
    const quoteOp = interpolate(frame, [450, 480], [0, 1], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#000000",
                fontFamily: theme.fonts.body,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Subtle noise grain overlay */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "radial-gradient(ellipse at center, #0f172a 0%, #000000 100%)",
                    opacity: 0.8,
                }}
            />

            {/* Title */}
            <div
                style={{
                    position: "absolute",
                    top: 40,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    opacity: titleOp,
                    transform: `translateY(${titleY}px)`,
                    zIndex: 10,
                }}
            >
                <div
                    style={{
                        color: theme.colors.white,
                        fontSize: 44,
                        fontWeight: 900,
                        fontFamily: theme.fonts.heading,
                        letterSpacing: 4,
                    }}
                >
                    THE SPECTRUM OF CRIMINALITY
                </div>
                <div style={{ color: theme.colors.grayDim, fontSize: 20, letterSpacing: 3, marginTop: 8 }}>
                    How far Ruja Ignatova traveled
                </div>
            </div>

            {/* Connector arrows between stage labels */}
            <div
                style={{
                    position: "absolute",
                    top: 175,
                    left: 60,
                    right: 60,
                    height: 4,
                    zIndex: 5,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                {[0, 1, 2].map((i) => {
                    const prog = arrowProgress(i);
                    return (
                        <React.Fragment key={i}>
                            <div style={{ flex: 1 }} />
                            <div
                                style={{
                                    width: 80 * prog,
                                    height: 2,
                                    backgroundColor: STAGES[i].color,
                                    overflow: "hidden",
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: -4,
                                        borderLeft: `8px solid ${STAGES[i].color}`,
                                        borderTop: "5px solid transparent",
                                        borderBottom: "5px solid transparent",
                                        opacity: prog,
                                    }}
                                />
                            </div>
                        </React.Fragment>
                    );
                })}
                <div style={{ flex: 1 }} />
            </div>

            {/* Ruja portrait marker — floats above the spectrum */}
            <div
                style={{
                    position: "absolute",
                    top: RUJA_Y - 120,
                    left: rujaX - 50,
                    width: 100,
                    height: 100,
                    zIndex: 20,
                    opacity: rujaPortOp,
                    transition: "left 0.5s ease",
                }}
            >
                <div
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `3px solid ${STAGES[Math.min(rujaStageIndex, 3)].color}`,
                        boxShadow: `0 0 24px ${STAGES[Math.min(rujaStageIndex, 3)].color}`,
                    }}
                >
                    <Img
                        src={staticFile("spectrum_ruja.png")}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                </div>
                {/* Arrow pointing down */}
                <div
                    style={{
                        width: 0,
                        height: 0,
                        borderLeft: "8px solid transparent",
                        borderRight: "8px solid transparent",
                        borderTop: `14px solid ${STAGES[Math.min(rujaStageIndex, 3)].color}`,
                        margin: "6px auto 0",
                    }}
                />
                <div style={{ color: theme.colors.white, fontSize: 13, textAlign: "center", marginTop: 4, fontWeight: "bold", letterSpacing: 1 }}>
                    RUJA
                </div>
            </div>

            {/* Stage Cards */}
            <div
                style={{
                    position: "absolute",
                    top: RUJA_Y,
                    left: 60,
                    right: 60,
                    display: "flex",
                    gap: 0,
                    alignItems: "flex-start",
                }}
            >
                {STAGES.map((stage, i) => (
                    <StageCard
                        key={stage.key}
                        stage={stage}
                        index={i}
                        startFrame={STAGE_START_FRAMES[i]}
                        isActive={rujaStageIndex >= i}
                    />
                ))}
            </div>

            {/* Bottom quote */}
            {frame >= 450 && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 30,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        opacity: quoteOp,
                        color: theme.colors.grayDim,
                        fontSize: 22,
                        fontStyle: "italic",
                        padding: "0 200px",
                    }}
                >
                    "A woman who started out selling fake financial education, and ended up entangled with actual organized crime."
                </div>
            )}
        </AbsoluteFill>
    );
};
