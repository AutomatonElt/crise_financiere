import React from "react";
import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    spring,
} from "remotion";
import { theme } from "../../theme";

export const RecoveredAssetsScene: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();

    // Animation values
    const stolenBarProgress = spring({ frame: frame - 30, fps, config: { damping: 14 } });
    const recoveredBarProgress = spring({ frame: frame - 90, fps, config: { damping: 14 } });
    const textOpacity = interpolate(frame, [150, 180], [0, 1], { extrapolateRight: "clamp" });

    const totalFunds = 4000; // in millions
    const recoveredFunds = 150; // low hundreds of millions

    const stolenWidth = (800 * stolenBarProgress); // Max width 800px
    const recoveredWidth = (800 * (recoveredFunds / totalFunds)) * recoveredBarProgress;

    return (
        <AbsoluteFill style={{ backgroundColor: theme.colors.bg, fontFamily: theme.fonts.body, justifyContent: 'center', alignItems: 'center' }}>

            {/* Title */}
            <h1 style={{ color: theme.colors.gray, fontWeight: 300, fontSize: 40, marginBottom: 80, letterSpacing: 4 }}>
                THE MISSING BILLIONS
            </h1>

            <div style={{ width: 1000, display: 'flex', flexDirection: 'column', gap: 60 }}>

                {/* Stolen Bar Container */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                        <span style={{ color: theme.colors.white, fontSize: 28, fontWeight: 'bold' }}>STOLEN</span>
                        <span style={{ color: theme.colors.red, fontSize: 32, fontFamily: theme.fonts.mono, fontWeight: 900 }}>
                            $4,000,000,000+
                        </span>
                    </div>
                    <div style={{ width: 1000, height: 60, backgroundColor: theme.colors.surface, borderRadius: 10, overflow: 'hidden', border: `1px solid ${theme.colors.gridLine}` }}>
                        <div style={{
                            width: stolenWidth,
                            height: '100%',
                            backgroundColor: theme.colors.red,
                            boxShadow: `0 0 30px ${theme.colors.red}`,
                        }} />
                    </div>
                </div>

                {/* Recovered Bar Container */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
                        <span style={{ color: theme.colors.gray, fontSize: 28 }}>FROZEN / RECOVERED</span>
                        <span style={{ color: theme.colors.blue, fontSize: 28, fontFamily: theme.fonts.mono }}>
                            ~${recoveredFunds} MILLION
                        </span>
                    </div>
                    <div style={{ width: 1000, height: 60, backgroundColor: theme.colors.surface, borderRadius: 10, overflow: 'hidden', border: `1px solid ${theme.colors.gridLine}` }}>
                        <div style={{
                            width: recoveredWidth,
                            height: '100%',
                            backgroundColor: theme.colors.blue,
                            boxShadow: recoveredWidth > 0 ? `0 0 20px ${theme.colors.blue}` : 'none',
                        }} />
                    </div>
                </div>

            </div>

            {/* Dramatic Text Fade In */}
            <div style={{
                opacity: textOpacity,
                marginTop: 100,
                color: theme.colors.grayDim,
                fontSize: 32,
                textAlign: 'center',
                fontStyle: 'italic',
                maxWidth: 800,
                lineHeight: 1.5,
            }}>
                "Well over <span style={{ color: theme.colors.red, fontWeight: 'bold' }}>90%</span> of the money victims put in has simply never been found."
            </div>

        </AbsoluteFill>
    );
};
