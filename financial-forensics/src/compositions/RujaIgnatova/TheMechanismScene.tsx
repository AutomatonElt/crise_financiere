import React from "react";
import {
    AbsoluteFill,
    Img,
    staticFile,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
    Sequence,
    Video,
} from "remotion";
import { theme } from "../../theme";

// Helper components for the 4 pillars
const Quadrant: React.FC<{
    title: string;
    frameTitleStart: number;
    isActive: boolean;
    left: number | string;
    top: number | string;
    width: number | string;
    height: number | string;
    children: React.ReactNode;
}> = ({ title, frameTitleStart, isActive, left, top, width, height, children }) => {
    const frame = useCurrentFrame();
    const opacity = isActive ? 1 : 0.2;
    const overlayOpacity = isActive ? 0 : 0.8;
    const scale = spring({ frame: frame - frameTitleStart, fps: 30, config: { damping: 14 } });

    return (
        <div style={{
            position: "absolute", left, top, width, height,
            border: `1px solid ${theme.colors.gridLine}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            overflow: "hidden", transition: "opacity 0.5s ease"
        }}>
            {/* Content */}
            <div style={{ opacity, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {children}
            </div>

            {/* Dim overlay when not active */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: theme.colors.bg, opacity: overlayOpacity, transition: "opacity 0.5s" }} />

            {/* Title pops in */}
            {frame > frameTitleStart && (
                <div style={{
                    position: "absolute", bottom: 40, transform: `scale(${scale})`,
                    backgroundColor: theme.colors.surface, border: `2px solid ${theme.colors.red}`,
                    padding: "10px 30px", borderRadius: 8, color: theme.colors.red,
                    fontWeight: 900, fontFamily: theme.fonts.heading, fontSize: 24, letterSpacing: 2, zIndex: 10
                }}>
                    {title}
                </div>
            )}
        </div>
    );
};

export const TheMechanismScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const hw = width / 2;
    const hh = height / 2;

    // Timings summary
    // 0-60 Intro
    // 60-200 Component 1 (Ledger)
    // 200-340 Component 2 (Price)
    // 340-480 Component 3 (MLM)
    // 480-600 Component 4 (DealShaker), expanding at 520
    // 600-750 Conclusion Glitch

    const activePhase = frame < 60 ? 0 :
        frame < 200 ? 1 :
            frame < 340 ? 2 :
                frame < 480 ? 3 :
                    frame < 600 ? 4 : 5;

    // Expanding DealShaker quadrant logic
    const expandProgress = spring({ frame: frame - 500, fps, config: { damping: 14 } });
    const dsLeft = interpolate(expandProgress, [0, 1], [hw, 0]);
    const dsTop = interpolate(expandProgress, [0, 1], [hh, 0]);
    const dsW = interpolate(expandProgress, [0, 1], [hw, width]);
    const dsH = interpolate(expandProgress, [0, 1], [hh, height]);

    // Phase 2 Chart Line
    const lineProgress = interpolate(frame, [220, 300], [0, 1], { extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body }}>

            {/* ── THE 4 QUADRANTS (Hidden after frame 600) ── */}
            {frame < 600 && (
                <>
                    {/* Q1: FAKE LEDGER (Top Left) */}
                    <Quadrant title="FAKE LEDGER" frameTitleStart={100} isActive={activePhase >= 1} left={0} top={0} width={hw} height={hh}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Img src={staticFile("onecoin_generate_bouton.png")} style={{ width: "80%", objectFit: "contain", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.8)", opacity: interpolate(frame, [80, 100], [0, 1]) }} />
                        </div>
                    </Quadrant>

                    {/* Q2: HAND-CODED PRICE (Top Right) */}
                    <Quadrant title="COMPANY CONTROLLED PRICE" frameTitleStart={240} isActive={activePhase >= 2} left={hw} top={0} width={hw} height={hh}>
                        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0 }}>
                            <path d={`M 100 ${hh - 50} L ${100 + (hw - 200) * lineProgress} ${hh - 50 - (hh - 150) * lineProgress}`} fill="none" stroke={theme.colors.red} strokeWidth={8} />
                        </svg>
                    </Quadrant>

                    {/* Q3: COMMISSION STRUCTURE (Bottom Left) */}
                    <Quadrant title="COMMISSION STRUCTURE" frameTitleStart={380} isActive={activePhase >= 3} left={0} top={hh} width={hw} height={hh}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                            <Video src={staticFile("trust_chain.mp4")} style={{ height: "85%", borderRadius: 12, border: `2px solid rgba(212,175,55,0.3)`, opacity: interpolate(frame, [360, 380], [0, 1]) }} />
                        </div>
                    </Quadrant>

                    {/* Q4: FAKE MARKETPLACE (Bottom Right) -> Expands to full screen */}
                    <Quadrant title="ILLUSION OF REAL-WORLD UTILITY" frameTitleStart={520} isActive={activePhase >= 4} left={dsLeft} top={dsTop} width={dsW} height={dsH}>
                        {frame > 400 && (
                            <Img
                                src={staticFile("dealshaker_mockup.png")}
                                style={{
                                    width: "100%", height: "100%", objectFit: "cover",
                                    opacity: interpolate(frame, [480, 500], [0, 1], { extrapolateRight: "clamp" }),
                                    filter: frame > 550 ? `grayscale(${interpolate(frame, [550, 580], [0, 100])}%) blur(${interpolate(frame, [580, 600], [0, 10])}px)` : "none"
                                }}
                            />
                        )}
                    </Quadrant>

                    {/* Crosshairs & Center target */}
                    <div style={{ position: "absolute", left: hw, top: 0, width: 2, height: height, backgroundColor: theme.colors.gridLine }} />
                    <div style={{ position: "absolute", left: 0, top: hh, width: width, height: 2, backgroundColor: theme.colors.gridLine }} />
                    <div style={{ position: "absolute", left: hw - 30, top: hh - 30, width: 60, height: 60, border: `2px solid ${theme.colors.gold}`, borderRadius: "50%", zIndex: 5, backgroundColor: theme.colors.bg }} />
                </>
            )}

            {/* ── CONCLUSION PHASE ── */}
            {frame >= 600 && (
                <AbsoluteFill style={{ backgroundColor: theme.colors.bg, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>

                    {frame > 620 && (
                        <div style={{ color: theme.colors.gray, fontSize: 32, fontFamily: theme.fonts.mono, letterSpacing: 2, textAlign: "center", opacity: interpolate(frame, [620, 630], [0, 1]) }}>
                            The genius wasn't the technology.
                        </div>
                    )}

                    {frame > 660 && (
                        <div style={{ color: theme.colors.gray, fontSize: 32, fontFamily: theme.fonts.mono, letterSpacing: 2, textAlign: "center", marginTop: 20, opacity: interpolate(frame, [660, 670], [0, 1]) }}>
                            There wasn't any.
                        </div>
                    )}

                    {frame > 700 && (
                        <div style={{
                            color: theme.colors.red, fontSize: 80, fontWeight: 900, fontFamily: theme.fonts.heading, letterSpacing: 4,
                            textAlign: "center", marginTop: 50, transform: `scale(${spring({ frame: frame - 700, fps, config: { damping: 10 } })})`,
                            textShadow: "0 10px 40px rgba(230,57,70,0.6)"
                        }}>
                            3,500,000<br />BELIEVERS.
                        </div>
                    )}
                </AbsoluteFill>
            )}

        </AbsoluteFill>
    );
};
