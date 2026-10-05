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
} from "remotion";
import { theme } from "../../theme";

// --- CONFIG ---
// 7 nodes arranged in a ring, plus center node
const NODE_POSITIONS = [
    { id: "center", x: 960, y: 540, label: "BITCOIN NETWORK" },
    { id: "n0", x: 960, y: 200, label: "Tokyo" },
    { id: "n1", x: 1300, y: 310, label: "London" },
    { id: "n2", x: 1420, y: 680, label: "New York" },
    { id: "n3", x: 1200, y: 960, label: "São Paulo" },
    { id: "n4", x: 720, y: 960, label: "Lagos" },
    { id: "n5", x: 500, y: 680, label: "Mumbai" },
    { id: "n6", x: 620, y: 310, label: "Berlin" },
];

const EDGES = [
    ["center", "n0"], ["center", "n1"], ["center", "n2"], ["center", "n3"],
    ["center", "n4"], ["center", "n5"], ["center", "n6"],
    ["n0", "n1"], ["n1", "n2"], ["n2", "n3"], ["n3", "n4"],
    ["n4", "n5"], ["n5", "n6"], ["n6", "n0"],
    ["n0", "n3"], ["n1", "n4"], // Cross links
];

const getNode = (id: string) => NODE_POSITIONS.find(n => n.id === id)!;

// --- ANIMATED PACKET ---
const DataPacket: React.FC<{ from: string; to: string; startFrame: number; color?: string }> = ({ from, to, startFrame, color = theme.colors.gold }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const p = interpolate(frame, [startFrame, startFrame + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const a = getNode(from);
    const b = getNode(to);
    const cx = a.x + (b.x - a.x) * p;
    const cy = a.y + (b.y - a.y) * p;
    const opacity = interpolate(frame, [startFrame, startFrame + 3, startFrame + 22, startFrame + 25], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (<circle cx={cx} cy={cy} r={10} fill={color} opacity={opacity} filter="url(#neon)" />);
};

// --- MAIN SCENE ---
export const DecentralizedNetworkScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    const overallOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

    // Node appearance - staggered by id order
    const nodeAppear = (index: number) =>
        spring({ frame: frame - (15 + index * 12), fps, config: { damping: 12 } });

    // Edge appearance
    const edgeOpacity = (index: number) =>
        interpolate(frame, [30 + index * 5, 50 + index * 5], [0, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity: overallOpacity, fontFamily: theme.fonts.body, overflow: "hidden" }}>

            {/* NETWORK SVG */}
            <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
                <defs>
                    <filter id="neon" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="nodeglow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="10" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* EDGES */}
                {EDGES.map(([from, to], i) => {
                    const a = getNode(from);
                    const b = getNode(to);
                    const isCenter = from === "center" || to === "center";
                    return (
                        <line key={`edge-${i}`}
                            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                            stroke={isCenter ? theme.colors.blue : theme.colors.gridLine}
                            strokeWidth={isCenter ? 2 : 1.5}
                            strokeDasharray={isCenter ? "none" : "6 4"}
                            opacity={edgeOpacity(i)}
                        />
                    );
                })}

                {/* DATA PACKETS travelling the network — loop from frame 60 onwards */}
                {frame > 60 && (<>
                    <DataPacket from="n0" to="center" startFrame={60} />
                    <DataPacket from="center" to="n3" startFrame={75} />
                    <DataPacket from="n2" to="n1" startFrame={85} />
                    <DataPacket from="n5" to="center" startFrame={95} />
                    <DataPacket from="center" to="n6" startFrame={105} color={theme.colors.blue} />
                    <DataPacket from="n4" to="n3" startFrame={115} />
                    <DataPacket from="n6" to="n0" startFrame={125} color={theme.colors.blue} />
                    <DataPacket from="center" to="n1" startFrame={135} />
                    <DataPacket from="n3" to="n4" startFrame={145} />
                    <DataPacket from="n2" to="center" startFrame={155} color={theme.colors.blue} />
                    <DataPacket from="n0" to="n6" startFrame={165} />
                    <DataPacket from="center" to="n5" startFrame={175} color={theme.colors.blue} />
                    <DataPacket from="n1" to="n2" startFrame={185} />
                    <DataPacket from="n5" to="n4" startFrame={195} />
                    <DataPacket from="center" to="n0" startFrame={205} color={theme.colors.blue} />
                </>)}

                {/* NODES */}
                {NODE_POSITIONS.map((node, i) => {
                    const pop = nodeAppear(i);
                    const isCenter = node.id === "center";
                    return (
                        <g key={node.id} transform={`translate(${node.x},${node.y}) scale(${pop})`} opacity={pop} style={{ transformOrigin: `${node.x}px ${node.y}px` }}>
                            {isCenter
                                ? <circle cx={0} cy={0} r={35} fill={theme.colors.goldDim} stroke={theme.colors.gold} strokeWidth={3} filter="url(#nodeglow)" />
                                : <circle cx={0} cy={0} r={20} fill={theme.colors.surface} stroke={theme.colors.blue} strokeWidth={2.5} filter="url(#neon)" />
                            }
                            {!isCenter && <circle cx={0} cy={0} r={7} fill={theme.colors.blue} opacity={0.9} />}
                        </g>
                    );
                })}
            </svg>

            {/* SERVER IMAGES — placed at node positions with transparent bg */}
            {NODE_POSITIONS.filter(n => n.id !== "center").map((node, i) => {
                const pop = nodeAppear(i + 1);
                const size = 90;
                return (
                    <div key={`server-${node.id}`} style={{
                        position: "absolute",
                        left: node.x - size / 2,
                        top: node.y - size - 12,
                        width: size, height: size * 1.4,
                        transform: `scale(${pop})`,
                        opacity: pop,
                        filter: `drop-shadow(0 5px 10px rgba(74,158,255,0.3))`,
                    }}>
                        <Img src={staticFile("server_node_transparent.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                );
            })}

            {/* BITCOIN COIN at center — transparent bg */}
            {(() => {
                const pop = nodeAppear(0);
                const spin = interpolate(frame, [15, 80], [0, 360], { extrapolateRight: "clamp" });
                return (
                    <div style={{
                        position: "absolute",
                        left: 960 - 70,
                        top: 540 - 70,
                        width: 140, height: 140,
                        transform: `scale(${pop}) rotate(${spin}deg)`,
                        opacity: pop,
                        filter: `drop-shadow(0 0 20px rgba(212,175,55,0.8))`,
                    }}>
                        <Img src={staticFile("bitcoin_coin_transparent.png")} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                );
            })()}

            {/* NODE CITY LABELS — small, minimal */}
            {NODE_POSITIONS.filter(n => n.id !== "center").map((node, i) => {
                const pop = nodeAppear(i + 1);
                const labelOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
                return (
                    <div key={`label-${node.id}`} style={{
                        position: "absolute",
                        left: node.x - 55, top: node.y + 22,
                        width: 110, textAlign: "center",
                        transform: `scale(${pop})`, opacity: pop * labelOpacity,
                        color: theme.colors.gray, fontSize: theme.sizes.caption,
                        fontFamily: theme.fonts.mono, fontWeight: "bold",
                        letterSpacing: 1.5, textTransform: "uppercase",
                    }}>{node.label}</div>
                );
            })}
        </AbsoluteFill>
    );
};
