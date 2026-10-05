import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { theme } from "../../theme";

const TimelineNode: React.FC<{
    year: string;
    events: { title: string; subtitle: string; color: string }[];
    startFrame: number;
    yPosition: number;
}> = ({ year, events, startFrame, yPosition }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Animations
    const nodePop = spring({ frame: frame - startFrame, fps, config: { damping: 14 } });
    const lineProgress = interpolate(frame, [startFrame + 10, startFrame + 30], [0, 1], { extrapolateRight: "clamp" });

    return (
        <div style={{ position: "absolute", top: yPosition, left: 150, width: "100%", display: "flex", alignItems: "flex-start", opacity: nodePop > 0 ? 1 : 0 }}>
            {/* Year & Marker */}
            <div style={{ position: "relative", width: 140, display: "flex", justifyContent: "flex-end", alignItems: "center", transform: `scale(${nodePop})` }}>
                <div style={{ color: theme.colors.gold, fontSize: 32, fontWeight: 900, fontFamily: theme.fonts.mono, marginRight: 30 }}>
                    {year}
                </div>
                {/* Glow Dot */}
                <div style={{ position: "absolute", right: -40, width: 20, height: 20, backgroundColor: theme.colors.gold, borderRadius: "50%", zIndex: 10, boxShadow: `0 0 20px ${theme.colors.gold}` }} />
            </div>

            {/* Horizontal connector line */}
            <div style={{ position: "absolute", left: 140, top: 16, width: 60 * lineProgress, height: 2, backgroundColor: theme.colors.gridLine }} />

            {/* Events */}
            <div style={{ marginLeft: 60, display: "flex", flexDirection: "column", gap: 20 }}>
                {events.map((event, i) => {
                    const eventStart = startFrame + 20 + i * 15;
                    const eventOp = interpolate(frame, [eventStart, eventStart + 15], [0, 1], { extrapolateRight: "clamp" });
                    const eventPop = spring({ frame: frame - eventStart, fps, config: { damping: 12 } });

                    return (
                        <div key={i} style={{ opacity: eventOp, transform: `translateX(${(1 - eventPop) * -20}px)` }}>
                            <div style={{ color: theme.colors.white, fontSize: 28, fontWeight: "bold", letterSpacing: 1 }}>{event.title}</div>
                            <div style={{ color: event.color, fontSize: 20, fontFamily: theme.fonts.mono, marginTop: 4 }}>{event.subtitle}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const EpilogueTimelineScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, height } = useVideoConfig();

    // Intro animations
    const headerY = spring({ frame, fps, config: { damping: 14 }, from: -50, to: 0 });
    const headerOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

    // The central vertical timeline stem draws downwards
    const stemDraw = interpolate(frame, [20, 300], [0, height - 200], { extrapolateRight: "clamp" });

    const timelineData = [
        {
            year: "2018",
            startFrame: 40,
            yPosition: 180,
            events: [
                { title: "Sebastian Greenwood", subtitle: "ARRESTED (Co-founder)", color: theme.colors.red },
            ]
        },
        {
            year: "2019",
            startFrame: 120,
            yPosition: 320,
            events: [
                { title: "Konstantin Ignatov", subtitle: "ARRESTED (Brother)", color: theme.colors.red },
            ]
        },
        {
            year: "2023",
            startFrame: 200,
            yPosition: 460,
            events: [
                { title: "Gilbert Armenta", subtitle: "SENTENCED: 5 Years (Laundering $300m)", color: theme.colors.blue },
                { title: "Sebastian Greenwood", subtitle: "SENTENCED: 20 Years", color: theme.colors.blue },
            ]
        },
        {
            year: "2024",
            startFrame: 320,
            yPosition: 680,
            events: [
                { title: "Konstantin Ignatov", subtitle: "SENTENCED: 34 Months (Time Served)", color: theme.colors.gray },
            ]
        }
    ];

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body, overflow: "hidden" }}>

            {/* Dynamic dark gradient background */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, #07090f 0%, ${theme.colors.bg} 100%)` }} />

            {/* HEADER */}
            <div style={{ position: "absolute", top: 40, left: 100, opacity: headerOp, transform: `translateY(${headerY}px)` }}>
                <h1 style={{ color: theme.colors.white, fontWeight: 900, fontSize: 42, letterSpacing: 4, fontFamily: theme.fonts.heading, margin: 0 }}>
                    THE FALLOUT
                </h1>
                <p style={{ color: theme.colors.grayDim, fontSize: 20, letterSpacing: 2, margin: "10px 0 0 0" }}>
                    JUSTICE FOR RUJA'S ASSOCIATES
                </p>
            </div>

            {/* TIMELINE CONTINER */}
            <div style={{ position: "absolute", left: 100, top: 0, width: "100%", height: "100%", paddingTop: 50 }}>

                {/* Vertical Stem Line */}
                <div style={{
                    position: "absolute",
                    left: 178, // Aligns with the 20px dots at -40 relative to 140 width
                    top: 150,
                    width: 4,
                    height: stemDraw,
                    backgroundColor: theme.colors.gridLine
                }} />

                {/* Nodes */}
                {timelineData.map((node, i) => (
                    <TimelineNode
                        key={i}
                        year={node.year}
                        startFrame={node.startFrame}
                        yPosition={node.yPosition}
                        events={node.events}
                    />
                ))}

                {/* Bottom indicator that it's ongoing */}
                {frame > 420 && (
                    <div style={{
                        position: "absolute", left: 174, top: 150 + height - 200 + 40,
                        display: "flex", flexDirection: "column", alignItems: "center",
                        opacity: interpolate(frame, [420, 440], [0, 1]),
                    }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: theme.colors.red, marginBottom: 8 }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: theme.colors.red, marginBottom: 8 }} />
                        <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: theme.colors.red }} />
                        <div style={{ color: theme.colors.red, fontSize: 18, marginTop: 15, fontFamily: theme.fonts.mono, whiteSpace: "nowrap", marginLeft: 40 }}>RUJA: STILL MISSING</div>
                    </div>
                )}
            </div>

        </AbsoluteFill>
    );
};
