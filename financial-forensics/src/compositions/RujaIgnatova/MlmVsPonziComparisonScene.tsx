import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const MlmVsPonziComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  // ── Global animations ──
  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  const dividerHeight = interpolate(frame, [15, 45], [0, height - 150], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // ── Left (Ponzi) timing ──
  const ponziCardPop = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const ponziCardOp = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: "clamp" });

  // ── Right (MLM) timing ──
  const mlmCardPop = spring({ frame: frame - 35, fps, config: { damping: 14 } });
  const mlmCardOp = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: "clamp" });

  // ── Phase 2: Collapse & Cruelty trigger (around frame 130) ──
  const collapseProgress = interpolate(frame, [130, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Flow animation for dots along vectors
  const flowT = (frame % 35) / 35;

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
      {/* Left Blue Ambient Glow (Ponzi) */}
      <div
        style={{
          position: "absolute",
          left: 150,
          top: 250,
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      {/* Right Red Ambient Glow (MLM) */}
      <div
        style={{
          position: "absolute",
          right: 150,
          top: 250,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239, 68, 68, 0.16) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* ── TOP HEADER BAR ── */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: titleOp,
          transform: `translateY(${titleY}px)`,
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
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          // FRAUD MECHANICS // CRUELTY ANALYSIS
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
            gap: 18,
          }}
        >
          <span style={{ color: "#38BDF8" }}>PONZI SCHEME</span>
          <span style={{ color: "#475569", fontSize: 32 }}>VS</span>
          <span style={{ color: "#EF4444" }}>MLM FRAUD</span>
          <span
            style={{
              fontSize: 18,
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: "rgba(239,68,68,0.16)",
              color: "#F87171",
              border: "1px solid rgba(239,68,68,0.45)",
              borderRadius: 6,
              padding: "3px 14px",
              marginLeft: 10,
              letterSpacing: 1.5,
              fontWeight: 800,
            }}
          >
            THE CRUELTY
          </span>
        </div>
      </div>

      {/* ── VERTICAL DIVIDER & VS BADGE ── */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 110,
          width: 2,
          height: dividerHeight,
          background: "linear-gradient(to bottom, transparent, rgba(148, 163, 184, 0.45) 15%, rgba(148, 163, 184, 0.45) 85%, transparent)",
          transform: "translateX(-50%)",
          zIndex: 10,
        }}
      />
      {frame > 30 && (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: 540,
            transform: "translate(-50%, -50%)",
            zIndex: 15,
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#0A0F1D",
            border: "2px solid #334155",
            boxShadow: "0 0 24px rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 800,
            fontSize: 17,
            color: "#94A3B8",
            opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          VS
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          LEFT PANEL: PONZI SCHEME
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 115,
          width: 820,
          bottom: 28,
          opacity: ponziCardOp,
          transform: `scale(${ponziCardPop})`,
          transformOrigin: "center left",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            borderTop: "3px solid #38BDF8",
            borderRadius: "14px 14px 0 0",
            padding: "16px 26px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#38BDF8", letterSpacing: 2, fontWeight: 700 }}>
              STRUCTURE : DIRECT THEFT
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
              THE CLASSIC PONZI
            </div>
          </div>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              backgroundColor: "rgba(56, 189, 248, 0.14)",
              border: "1px solid rgba(56, 189, 248, 0.45)",
              color: "#38BDF8",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
            }}
          >
            CENTRALIZED FRAUD
          </div>
        </div>

        {/* Diagram Area */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            borderLeft: "1px solid rgba(56, 189, 248, 0.22)",
            borderRight: "1px solid rgba(56, 189, 248, 0.22)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Top Node: The Fraudster */}
          <div
            style={{
              position: "absolute",
              top: 36,
              width: 320,
              height: 84,
              borderRadius: 12,
              backgroundColor: "#0D1527",
              border: "2px solid #38BDF8",
              boxShadow: "0 0 30px rgba(56, 189, 248, 0.28)",
              display: "flex",
              alignItems: "center",
              padding: "0 20px",
              gap: 16,
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                backgroundColor: "rgba(56, 189, 248, 0.18)",
                border: "1.5px solid #38BDF8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              👤
            </div>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#38BDF8", letterSpacing: 1.5, fontWeight: 700 }}>
                CENTRAL MASTERMIND
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#F8FAFC" }}>
                THE FRAUDSTER
              </div>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>
                (e.g. Madoff, Single Scammer)
              </div>
            </div>
          </div>

          {/* SVG Connection Lines & Animated Flow */}
          <svg
            style={{
              position: "absolute",
              top: 120,
              left: 0,
              width: "100%",
              height: 320,
              zIndex: 2,
            }}
          >
            <defs>
              <linearGradient id="ponziLineGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(56, 189, 248, 0.2)" />
                <stop offset="100%" stopColor="rgba(56, 189, 248, 0.85)" />
              </linearGradient>
              <linearGradient id="blameLineGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.4)" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>

            {/* 4 Vector Lines from Investors to Fraudster */}
            {[
              { x: 120 },
              { x: 310 },
              { x: 500 },
              { x: 690 },
            ].map((inv, idx) => {
              const targetX = 410; // center of diagram
              const targetY = 0;
              const sourceX = inv.x;
              const sourceY = 320;

              // Animated dot position
              const dotProgress = (flowT + idx * 0.25) % 1;
              const dotX = sourceX + (targetX - sourceX) * dotProgress;
              const dotY = sourceY + (targetY - sourceY) * dotProgress;

              const isAngerActive = collapseProgress > 0.3;

              return (
                <g key={idx}>
                  <line
                    x1={sourceX}
                    y1={sourceY}
                    x2={targetX}
                    y2={targetY}
                    stroke={isAngerActive ? "url(#blameLineGrad)" : "url(#ponziLineGrad)"}
                    strokeWidth={isAngerActive ? 3.5 : 2}
                    strokeDasharray={isAngerActive ? "none" : "5 5"}
                  />
                  {/* Moving Money Particle (before collapse) */}
                  {collapseProgress < 0.8 && (
                    <circle
                      cx={dotX}
                      cy={dotY}
                      r={4.5}
                      fill="#38BDF8"
                      style={{ filter: "drop-shadow(0 0 8px #38BDF8)" }}
                    />
                  )}
                  {/* Anger Arrowhead pointing UP to fraudster */}
                  {isAngerActive && (
                    <circle
                      cx={targetX - (targetX - sourceX) * 0.18}
                      cy={targetY + (sourceY - targetY) * 0.18}
                      r={4}
                      fill="#EF4444"
                      style={{ filter: "drop-shadow(0 0 6px #EF4444)" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Center Callout: Capital Flow */}
          <div
            style={{
              position: "absolute",
              top: 240,
              backgroundColor: collapseProgress > 0.5 ? "#1A090D" : "#0A101D",
              border: `1.5px solid ${collapseProgress > 0.5 ? "#EF4444" : "#38BDF8"}`,
              borderRadius: 24,
              padding: "7px 22px",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              color: collapseProgress > 0.5 ? "#FCA5A5" : "#38BDF8",
              fontWeight: 800,
              zIndex: 6,
              boxShadow: "0 8px 24px rgba(0,0,0,0.85)",
            }}
          >
            {collapseProgress > 0.5 ? "🎯 ANGER DIRECTED AT THE FRAUDSTER" : "↑ DIRECT CAPITAL INVESTED"}
          </div>

          {/* Bottom Row: 4 Independent Victims */}
          <div
            style={{
              position: "absolute",
              top: 440,
              left: 24,
              right: 24,
              display: "flex",
              justifyContent: "space-between",
              zIndex: 5,
            }}
          >
            {[
              { role: "Investor A", sub: "Individual", icon: "💼" },
              { role: "Investor B", sub: "Institution", icon: "🏛️" },
              { role: "Investor C", sub: "Retiree", icon: "📈" },
              { role: "Investor D", sub: "Client", icon: "👤" },
            ].map((inv, idx) => (
              <div
                key={idx}
                style={{
                  width: 178,
                  backgroundColor: "#0B1120",
                  border: "1px solid #1E293B",
                  borderRadius: 10,
                  padding: "12px 10px",
                  textAlign: "center",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ fontSize: 26 }}>{inv.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#F8FAFC", marginTop: 4 }}>
                  {inv.role}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                  {inv.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Note between victims */}
          <div
            style={{
              position: "absolute",
              top: 575,
              fontSize: 13,
              color: "#94A3B8",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 500,
            }}
          >
            <span style={{ color: "#22C55E", fontSize: 16, fontWeight: "bold" }}>✓</span>
            No recruitment links between victims — personal relationships remain intact
          </div>
        </div>

        {/* Bottom Verdict Pill Grid */}
        <div
          style={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            border: "1px solid rgba(56, 189, 248, 0.3)",
            borderBottom: "3px solid #38BDF8",
            borderRadius: "0 0 14px 14px",
            padding: "18px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 16,
          }}
        >
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 12 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#EF4444", fontWeight: 800 }}>
              LOSS
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
              Money Lost
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
              Stolen by mastermind
            </div>
          </div>

          <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 12 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#38BDF8", fontWeight: 800 }}>
              CULPRIT
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
              Scammer Only
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
              Clear shared enemy
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#22C55E", fontWeight: 800 }}>
              RELATIONSHIPS
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#4ADE80", marginTop: 2 }}>
              Intact & Safe
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
              No mutual betrayal
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          RIGHT PANEL: MLM FRAUD (THE CRUELTY)
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 115,
          width: 820,
          bottom: 28,
          opacity: mlmCardOp,
          transform: `scale(${mlmCardPop})`,
          transformOrigin: "center right",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Card Header */}
        <div
          style={{
            backgroundColor: "rgba(24, 12, 16, 0.9)",
            border: "1px solid rgba(239, 68, 68, 0.45)",
            borderTop: "3px solid #EF4444",
            borderRadius: "14px 14px 0 0",
            padding: "16px 26px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#EF4444", letterSpacing: 2, fontWeight: 700 }}>
              STRUCTURE : WEAPONIZED TRUST
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
              THE MLM FRAUD
            </div>
          </div>
          <div
            style={{
              padding: "6px 16px",
              borderRadius: 6,
              backgroundColor: "rgba(239, 68, 68, 0.22)",
              border: "1px solid rgba(239, 68, 68, 0.65)",
              color: "#F87171",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 800,
            }}
          >
            RELATIONAL RUIN
          </div>
        </div>

        {/* Diagram Area */}
        <div
          style={{
            flex: 1,
            backgroundColor: "rgba(24, 12, 16, 0.6)",
            borderLeft: "1px solid rgba(239, 68, 68, 0.28)",
            borderRight: "1px solid rgba(239, 68, 68, 0.28)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Top Node: The Distant Apex / Company */}
          <div
            style={{
              position: "absolute",
              top: 36,
              width: 290,
              height: 58,
              borderRadius: 10,
              backgroundColor: "#16070B",
              border: "1.5px solid rgba(239, 68, 68, 0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              zIndex: 5,
            }}
          >
            <span style={{ fontSize: 20 }}>👑</span>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#F8FAFC" }}>
                ONECOIN / THE APEX
              </div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>
                Distant, disappeared organizers
              </div>
            </div>
          </div>

          {/* Connecting line Apex -> YOU */}
          <svg
            style={{
              position: "absolute",
              top: 94,
              left: 0,
              width: "100%",
              height: 80,
              zIndex: 2,
            }}
          >
            <line
              x1="410"
              y1="0"
              x2="410"
              y2="80"
              stroke="rgba(239, 68, 68, 0.65)"
              strokeWidth="2.5"
              strokeDasharray="5 5"
            />
          </svg>

          {/* THE CENTRAL NODE: YOU */}
          <div
            style={{
              position: "absolute",
              top: 174,
              width: 380,
              height: 96,
              borderRadius: 14,
              backgroundColor: "#22080E",
              border: "2.5px solid #EF4444",
              boxShadow: `0 0 ${24 + Math.sin(frame / 10) * 12}px rgba(239, 68, 68, 0.55)`,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              gap: 18,
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: "50%",
                backgroundColor: "rgba(239, 68, 68, 0.28)",
                border: "2px solid #EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                flexShrink: 0,
              }}
            >
              🎯
            </div>
            <div>
              <div style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: "#F87171", fontWeight: 800, letterSpacing: 1.5 }}>
                TRAPPED IN THE MIDDLE
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#FFFFFF" }}>
                YOU
              </div>
              <div style={{ fontSize: 13, color: "#FCA5A5", fontWeight: 600 }}>
                Both Victim AND Recruiter
              </div>
            </div>
          </div>

          {/* SVG Connection Lines & Broken Relations from YOU -> Loved Ones */}
          <svg
            style={{
              position: "absolute",
              top: 270,
              left: 0,
              width: "100%",
              height: 170,
              zIndex: 2,
            }}
          >
            <defs>
              <linearGradient id="brokenLineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#991B1B" />
              </linearGradient>
            </defs>

            {[
              { x: 120 },
              { x: 310 },
              { x: 500 },
              { x: 690 },
            ].map((dest, idx) => {
              const startX = 410;
              const startY = 0;
              const endX = dest.x;
              const endY = 170;

              const isBroken = collapseProgress > 0.4;

              return (
                <g key={idx}>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={isBroken ? "#EF4444" : "rgba(239, 68, 68, 0.45)"}
                    strokeWidth={isBroken ? 3.5 : 2}
                    strokeDasharray={isBroken ? "7 4" : "none"}
                  />
                  {/* Anger Vector pointing back AT YOU */}
                  {isBroken && (
                    <circle
                      cx={startX - (startX - endX) * 0.45}
                      cy={startY + (endY - startY) * 0.45}
                      r={4}
                      fill="#FCA5A5"
                      style={{ filter: "drop-shadow(0 0 6px #EF4444)" }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Center Callout: The recruitment & guilt */}
          <div
            style={{
              position: "absolute",
              top: 345,
              backgroundColor: "#22080E",
              border: "1.5px solid #EF4444",
              borderRadius: 24,
              padding: "7px 24px",
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              color: "#FECACA",
              fontWeight: 800,
              zIndex: 6,
              boxShadow: "0 8px 24px rgba(0,0,0,0.85)",
            }}
          >
            💔 YOU CONVINCED THEM TO INVEST
          </div>

          {/* Bottom Row: 4 Emotional Targets */}
          <div
            style={{
              position: "absolute",
              top: 440,
              left: 24,
              right: 24,
              display: "flex",
              justifyContent: "space-between",
              zIndex: 5,
            }}
          >
            {[
              { role: "FAMILY", sub: "Parents & Siblings", icon: "👨‍👩‍👧" },
              { role: "FRIENDS", sub: "Lifelong Bonds", icon: "👥" },
              { role: "COLLEAGUES", sub: "Workplace Trust", icon: "💼" },
              { role: "COMMUNITY", sub: "Church & Parish", icon: "⛪" },
            ].map((tgt, idx) => (
              <div
                key={idx}
                style={{
                  width: 178,
                  backgroundColor: "#16070B",
                  border: collapseProgress > 0.4 ? "1.5px solid #DC2626" : "1px solid #37141B",
                  borderRadius: 10,
                  padding: "12px 10px",
                  textAlign: "center",
                  boxShadow: collapseProgress > 0.4 ? "0 0 18px rgba(220, 38, 38, 0.3)" : "0 4px 14px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ fontSize: 26 }}>{tgt.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#F8FAFC", marginTop: 4 }}>
                  {tgt.role}
                </div>
                <div style={{ fontSize: 11, color: "#FCA5A5", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>
                  {tgt.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Note on Broken Relationships */}
          <div
            style={{
              position: "absolute",
              top: 575,
              fontSize: 13,
              color: "#FCA5A5",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ color: "#EF4444", fontSize: 16 }}>✖</span>
            Their anger is not just aimed at the company — it is aimed directly at YOU
          </div>
        </div>

        {/* Bottom Verdict Pill Grid */}
        <div
          style={{
            backgroundColor: "rgba(24, 12, 16, 0.95)",
            border: "1px solid rgba(239, 68, 68, 0.45)",
            borderBottom: "3px solid #EF4444",
            borderRadius: "0 0 14px 14px",
            padding: "18px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1.2fr",
            gap: 16,
          }}
        >
          <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 12 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#EF4444", fontWeight: 800 }}>
              FINANCIAL LOSS
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC", marginTop: 2 }}>
              Money Lost
            </div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
              Savings wiped out
            </div>
          </div>

          <div style={{ borderRight: "1px solid rgba(255,255,255,0.08)", paddingRight: 12 }}>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#F87171", fontWeight: 800 }}>
              TARGET OF ANGER
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#EF4444", marginTop: 2 }}>
              Directed at YOU
            </div>
            <div style={{ fontSize: 12, color: "#FCA5A5", marginTop: 2 }}>
              You recruited them
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#EF4444", fontWeight: 800 }}>
              HUMAN TOLL
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#EF4444", marginTop: 2 }}>
              Destroyed Bonds
            </div>
            <div style={{ fontSize: 12, color: "#FCA5A5", marginTop: 2 }}>
              Lifelong guilt & isolation
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
