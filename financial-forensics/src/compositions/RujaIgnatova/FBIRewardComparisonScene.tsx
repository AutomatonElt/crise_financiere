import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const FBIRewardComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Global Intro Timing ──
  const headerOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const headerY = spring({ frame, fps, config: { damping: 14 }, from: -30, to: 0 });

  // ── Left Panel (Escalation) Timing ──
  const leftPop = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const leftOp = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });

  // ── Right Panel (Threat Tiers) Timing ──
  const rightPop = spring({ frame: frame - 30, fps, config: { damping: 14 } });
  const rightOp = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" });

  // ── Bottom Callout Timing ──
  const bottomOp = interpolate(frame, [110, 130], [0, 1], { extrapolateRight: "clamp" });
  const bottomY = spring({ frame: frame - 110, fps, config: { damping: 14 }, from: 20, to: 0 });

  // ── Step Escalation Progressive Reveals ──
  const step1Op = interpolate(frame, [25, 40], [0, 1], { extrapolateRight: "clamp" });
  const step2Op = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" });
  const step3Op = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });
  const step3Pop = spring({ frame: frame - 70, fps, config: { damping: 12 } });

  // ── Bar Progresses for Right Panel ──
  const barTerror = spring({ frame: frame - 40, fps, config: { damping: 14 } });
  const barCartel = spring({ frame: frame - 55, fps, config: { damping: 14 } });
  const barRuja = spring({ frame: frame - 70, fps, config: { damping: 12 } });
  const barAvg = spring({ frame: frame - 90, fps, config: { damping: 15 } });

  // Pulse effect on Ruja
  const rujaPulse = Math.sin(frame / 8) * 6 + 18;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050811",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#F8FAFC",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Oswald:wght@600;700&family=JetBrains+Mono:wght@500;700;800&display=swap');
      `}</style>

      {/* ── BACKGROUND GRID & AMBIENT GLOW ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      {/* Top ambient gold light */}
      <div
        style={{
          position: "absolute",
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 400,
          background: "radial-gradient(ellipse, rgba(212, 175, 55, 0.15) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      {/* Left blue glow */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 300,
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      {/* Right red glow */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 300,
          width: 500,
          height: 500,
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.16) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* ── TOP HEADER ── */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: headerOp,
          transform: `translateY(${headerY}px)`,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            letterSpacing: 6,
            color: "#64748B",
            textTransform: "uppercase",
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          // U.S. DEPARTMENT OF STATE // FBI TEN MOST WANTED
        </div>
        <div
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <span>THE</span>
          <span style={{ color: "#D4AF37", textShadow: "0 0 25px rgba(212,175,55,0.5)" }}>
            $5,000,000
          </span>
          <span>REWARD ANOMALY</span>
          <span
            style={{
              fontSize: 18,
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: "rgba(239,68,68,0.18)",
              color: "#EF4444",
              border: "1.5px solid rgba(239,68,68,0.5)",
              borderRadius: 6,
              padding: "2px 14px",
              marginLeft: 8,
              letterSpacing: 1.5,
              fontWeight: 800,
            }}
          >
            50X STANDARD
          </span>
        </div>
      </div>

      {/* ── MAIN CONTENT: TWO FORENSIC PANELS ── */}
      <div
        style={{
          position: "absolute",
          top: 118,
          left: 80,
          right: 80,
          bottom: 110,
          display: "grid",
          gridTemplateColumns: "1fr 1.25fr",
          gap: 36,
        }}
      >
        {/* ════════════════════════════════════════════════════════════════
            LEFT PANEL: ESCALATION STAIRCASE (2022 -> 2024)
        ════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            borderTop: "3px solid #38BDF8",
            borderRadius: 14,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            opacity: leftOp,
            transform: `scale(${leftPop})`,
            transformOrigin: "center left",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#38BDF8", letterSpacing: 2, fontWeight: 700 }}>
                TIMELINE ANALYSIS
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
                BOUNTY ESCALATION
              </div>
            </div>
            <div
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                backgroundColor: "rgba(56, 189, 248, 0.14)",
                border: "1px solid rgba(56, 189, 248, 0.4)",
                color: "#38BDF8",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700,
              }}
            >
              +4,900% SURGE
            </div>
          </div>

          {/* Staircase Steps */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {/* Step 1: June 2022 */}
            <div
              style={{
                opacity: step1Op,
                backgroundColor: "#0B1120",
                border: "1px solid #1E293B",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8", fontWeight: 700 }}>
                  📅 JUNE 2022 // TOP 10 LISTING
                </div>
                <div style={{ fontSize: 14, color: "#CBD5E1", marginTop: 2, fontWeight: 600 }}>
                  Standard FBI Most Wanted Bounty
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8" }}>
                  $100,000
                </div>
                <div style={{ fontSize: 11, color: "#64748B" }}>Base Tier</div>
              </div>
            </div>

            {/* Staircase Connector 1 -> 2 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "2px 0" }}>
              <div style={{ width: 30, height: 1, backgroundColor: "rgba(56, 189, 248, 0.4)" }} />
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundColor: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  borderRadius: 12,
                  padding: "2px 10px",
                  color: "#38BDF8",
                  fontWeight: 700,
                }}
              >
                ▲ +150% HIKE (+$150,000)
              </div>
              <div style={{ width: 30, height: 1, backgroundColor: "rgba(56, 189, 248, 0.4)" }} />
            </div>

            {/* Step 2: May 2023 */}
            <div
              style={{
                opacity: step2Op,
                backgroundColor: "#0F172A",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                borderRadius: 10,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#38BDF8", fontWeight: 700 }}>
                  📅 MAY 2023 // FIRST HIKE
                </div>
                <div style={{ fontSize: 14, color: "#E2E8F0", marginTop: 2, fontWeight: 600 }}>
                  Modest increase after 1 year of leads
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: "#38BDF8" }}>
                  $250,000
                </div>
                <div style={{ fontSize: 11, color: "#38BDF8" }}>2.5x Increase</div>
              </div>
            </div>

            {/* Staircase Connector 2 -> 3 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, margin: "2px 0" }}>
              <div style={{ width: 30, height: 1, backgroundColor: "rgba(239, 68, 68, 0.5)" }} />
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  backgroundColor: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid #EF4444",
                  borderRadius: 12,
                  padding: "3px 12px",
                  color: "#FCA5A5",
                  fontWeight: 800,
                  boxShadow: "0 0 14px rgba(239,68,68,0.4)",
                }}
              >
                ▲ +1,900% 1-YEAR SURGE (+$4,750,000)
              </div>
              <div style={{ width: 30, height: 1, backgroundColor: "rgba(239, 68, 68, 0.5)" }} />
            </div>

            {/* Step 3: June 2024 (Explosion) */}
            <div
              style={{
                opacity: step3Op,
                transform: `scale(${step3Pop})`,
                backgroundColor: "#1C0B12",
                border: "2px solid #EF4444",
                boxShadow: `0 0 ${rujaPulse}px rgba(239, 68, 68, 0.45)`,
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#F87171", fontWeight: 800 }}>
                  📅 JUNE 2024 // STATE DEPT INITIATIVE
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#FFFFFF", marginTop: 2 }}>
                  Transnational Organized Crime Rewards
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "'JetBrains Mono', monospace", color: "#FACC15", textShadow: "0 0 16px rgba(250,204,21,0.6)" }}>
                  $5,000,000
                </div>
                <div style={{ fontSize: 12, color: "#EF4444", fontWeight: 800 }}>
                  50X MULTIPLIER (MAX TIER)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT PANEL: THE CRIMINAL DANGER BRACKET
        ════════════════════════════════════════════════════════════════ */}
        <div
          style={{
            backgroundColor: "rgba(24, 12, 16, 0.9)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderTop: "3px solid #EF4444",
            borderRadius: 14,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            opacity: rightOp,
            transform: `scale(${rightPop})`,
            transformOrigin: "center right",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#EF4444", letterSpacing: 2, fontWeight: 700 }}>
                CRIMINAL CLASSIFICATION TIER
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
                WHO SHARES THE $5M BRACKET?
              </div>
            </div>
            <div
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                border: "1px solid rgba(239, 68, 68, 0.6)",
                color: "#F87171",
                fontSize: 12,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
              }}
            >
              ACTIVE THREAT TIER
            </div>
          </div>

          {/* Comparison Rows */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
            {/* Row 1: International Terrorism */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: "#F8FAFC" }}>💣 International Terrorism Suspects (Al-Qaeda, ISIS)</span>
                <span style={{ color: "#D4AF37", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>$5,000,000+</span>
              </div>
              <div style={{ height: 28, backgroundColor: "#0F172A", borderRadius: 6, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${barTerror * 100}%`,
                    backgroundColor: "#D4AF37",
                    borderRadius: 6,
                    boxShadow: "0 0 16px rgba(212,175,55,0.45)",
                  }}
                />
              </div>
            </div>

            {/* Row 2: Major Drug Cartel Leaders */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: "#F8FAFC" }}>☠️ Major Cartel Leaders (Sinaloa, CJNG Kingpins)</span>
                <span style={{ color: "#FB923C", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>$5,000,000+</span>
              </div>
              <div style={{ height: 28, backgroundColor: "#0F172A", borderRadius: 6, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${barCartel * 100}%`,
                    backgroundColor: "#FB923C",
                    borderRadius: 6,
                    boxShadow: "0 0 16px rgba(251,146,60,0.45)",
                  }}
                />
              </div>
            </div>

            {/* Row 3: RUJA IGNATOVA (The Anomaly) */}
            <div
              style={{
                backgroundColor: "#200910",
                border: "1.5px solid #EF4444",
                borderRadius: 10,
                padding: "10px 14px",
                boxShadow: `0 0 ${rujaPulse}px rgba(239, 68, 68, 0.4)`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, marginBottom: 6 }}>
                <span style={{ color: "#FFFFFF" }}>👑 Ruja Ignatova (Financial Fraudster)</span>
                <span style={{ color: "#F87171", fontFamily: "'JetBrains Mono', monospace", fontWeight: 900 }}>$5,000,000</span>
              </div>
              <div style={{ height: 32, backgroundColor: "#0F172A", borderRadius: 6, overflow: "hidden", marginBottom: 6 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${barRuja * 100}%`,
                    backgroundColor: "#EF4444",
                    borderRadius: 6,
                    boxShadow: "0 0 22px rgba(239,68,68,0.7)",
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: "#FCA5A5", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                🚨 UNPRECEDENTED: The only white-collar financial fugitive in this tier
              </div>
            </div>

            {/* Row 4: Average Top 10 Fugitive (Tiny Bar) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: "#94A3B8" }}>👤 Standard FBI Top 10 Fugitive (Bank robbers, murder suspects)</span>
                <span style={{ color: "#64748B", fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>$100,000</span>
              </div>
              <div style={{ height: 22, backgroundColor: "#0F172A", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${barAvg * 2}%`, // 100k / 5000k = 2% of the bar width!
                    minWidth: 8,
                    backgroundColor: "#475569",
                    borderRadius: 6,
                  }}
                />
                <span style={{ fontSize: 11, color: "#64748B", marginLeft: 10, fontFamily: "'JetBrains Mono', monospace" }}>
                  1/50th of Ruja's Bounty (2%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM FORENSIC DEDUCTION BANNER ── */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 80,
          right: 80,
          height: 70,
          backgroundColor: "rgba(10, 15, 29, 0.95)",
          border: "1px solid rgba(212, 175, 55, 0.4)",
          borderRadius: 12,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: bottomOp,
          transform: `translateY(${bottomY}px)`,
          zIndex: 15,
          boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ fontSize: 26, flexShrink: 0 }}>🔍</div>
        <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.4 }}>
          <strong style={{ color: "#D4AF37" }}>WHAT THIS SIGNALS :</strong> Rewards don't jump 50-fold for cold cases.
          A <span style={{ color: "#F87171", fontWeight: 800 }}>$5,000,000 bounty</span> confirms the U.S. government considers Ignatova an
          <strong> active, ongoing danger</strong> — shielded by powerful organized crime networks with significant resources.
        </div>
      </div>
    </AbsoluteFill>
  );
};
