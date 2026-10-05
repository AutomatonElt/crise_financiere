import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export const MlmPyramidV2Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ── Timing Phases ──
  // Phase 1 (0 to 160 frames): The MLM pitch (Gold/Teal, "Educational packages", commission tiers)
  // Phase 2 (160 to 360 frames): The Pyramid Scam reveal (Glitch, Crimson/Red, mathematical impossibility)

  const titleOp = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = spring({ frame, fps, config: { damping: 14 }, from: -30, to: 0 });

  // Phase 2 transition trigger
  const revealProgress = interpolate(frame, [150, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Pulse effect
  const pulse = Math.sin(frame / 10) * 0.05 + 1;
  const redGlow = Math.sin(frame / 8) * 8 + 16;

  // Particle flow along pyramid
  const flowT = (frame % 30) / 30;

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

      {/* ── BACKGROUND MATRIX & AMBIENT GLOW ── */}
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

      {/* Ambient background light: shifts from gold to red during reveal */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 650,
          borderRadius: "50%",
          background: revealProgress < 0.5
            ? "radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
          transition: "all 0.8s ease",
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
            color: revealProgress > 0.5 ? "#EF4444" : "#D4AF37",
            textTransform: "uppercase",
            fontWeight: 800,
            marginBottom: 4,
          }}
        >
          {revealProgress > 0.5
            ? "// THE MECHANISM UNVEILED : STRUCTURAL FRAUD"
            : "// SALES ARCHITECTURE : THE OFFICIAL PITCH"}
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
          <span
            style={{
              color: revealProgress > 0.5 ? "#EF4444" : "#D4AF37",
              textShadow: revealProgress > 0.5
                ? "0 0 25px rgba(239,68,68,0.6)"
                : "0 0 25px rgba(212,175,55,0.5)",
            }}
          >
            {revealProgress > 0.5 ? "PYRAMID SCHEME" : "REFERRAL STRUCTURE"}
          </span>
          <span
            style={{
              fontSize: 18,
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: revealProgress > 0.5 ? "rgba(239,68,68,0.2)" : "rgba(212,175,55,0.15)",
              color: revealProgress > 0.5 ? "#F87171" : "#FACC15",
              border: revealProgress > 0.5 ? "1.5px solid #EF4444" : "1.5px solid #D4AF37",
              borderRadius: 6,
              padding: "2px 14px",
              marginLeft: 8,
              letterSpacing: 1.5,
              fontWeight: 800,
            }}
          >
            {revealProgress > 0.5 ? "THE REALITY" : "TEXTBOOK MLM"}
          </span>
        </div>
      </div>

      {/* ── THE PYRAMID CANVAS (TIER STACK) ── */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 100,
          right: 100,
          bottom: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        {/* SVG Upward Money Arrows on the sides */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id="goldUpGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(212,175,55,0.1)" />
              <stop offset="100%" stopColor="rgba(212,175,55,0.8)" />
            </linearGradient>
            <linearGradient id="redUpGrad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="rgba(239,68,68,0.1)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0.9)" />
            </linearGradient>
          </defs>

          {/* Left slope */}
          <line
            x1="170"
            y1="780"
            x2="640"
            y2="45"
            stroke={revealProgress > 0.5 ? "url(#redUpGrad)" : "url(#goldUpGrad)"}
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
          {/* Right slope */}
          <line
            x1="1550"
            y1="780"
            x2="1080"
            y2="45"
            stroke={revealProgress > 0.5 ? "url(#redUpGrad)" : "url(#goldUpGrad)"}
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />

          {/* Floating $$$ particles moving upward along slopes */}
          {[0.15, 0.45, 0.75].map((pct, i) => {
            const curP = (flowT + pct) % 1;
            // Left slope: from (170, 780) to (640, 45)
            const lx = 170 + (640 - 170) * (1 - curP);
            const ly = 780 + (45 - 780) * (1 - curP);
            // Right slope: from (1550, 780) to (1080, 45)
            const rx = 1550 + (1080 - 1550) * (1 - curP);
            const ry = 780 + (45 - 780) * (1 - curP);

            return (
              <g key={i}>
                <circle cx={lx} cy={ly} r="4.5" fill={revealProgress > 0.5 ? "#EF4444" : "#FACC15"} />
                <circle cx={rx} cy={ry} r="4.5" fill={revealProgress > 0.5 ? "#EF4444" : "#FACC15"} />
              </g>
            );
          })}
        </svg>

        {/* ── TIER 1: APEX (YOU / TOP SPONSOR) ── */}
        <div
          style={{
            width: 440,
            height: 90,
            borderRadius: 14,
            backgroundColor: revealProgress > 0.5 ? "#200910" : "#1A170B",
            border: revealProgress > 0.5 ? "2.5px solid #EF4444" : "2px solid #D4AF37",
            boxShadow: revealProgress > 0.5
              ? `0 0 ${redGlow}px rgba(239,68,68,0.5)`
              : "0 0 25px rgba(212,175,55,0.3)",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 16,
            zIndex: 5,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: revealProgress > 0.5 ? "rgba(239,68,68,0.25)" : "rgba(212,175,55,0.2)",
              border: revealProgress > 0.5 ? "2px solid #EF4444" : "1.5px solid #D4AF37",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {revealProgress > 0.5 ? "👑" : "👤"}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: revealProgress > 0.5 ? "#F87171" : "#D4AF37",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                LEVEL 0 // APEX
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 900,
                  color: revealProgress > 0.5 ? "#EF4444" : "#4ADE80",
                }}
              >
                {revealProgress > 0.5 ? "TOP 1% SUCKS 90%+" : "+10% DIRECT CUT"}
              </div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#FFFFFF" }}>
              {revealProgress > 0.5 ? "THE FOUNDERS / TOP ORGANIZERS" : "YOU (THE SPONSOR)"}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>
              {revealProgress > 0.5
                ? "Takes the vast majority of incoming fiat funds"
                : "Receives cash commission on every recruit"}
            </div>
          </div>
        </div>

        {/* ── TIER 2: LEVEL 1 (DIRECT RECRUITS) ── */}
        <div
          style={{
            width: 720,
            height: 84,
            borderRadius: 12,
            backgroundColor: "#0F172A",
            border: revealProgress > 0.5 ? "1.5px solid rgba(239,68,68,0.5)" : "1.5px solid rgba(56,189,248,0.4)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            justifyContent: "space-between",
            zIndex: 5,
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>👥</span>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#38BDF8", fontWeight: 700 }}>
                LEVEL 1 // 2 MEMBERS PER RECRUITER
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>
                DIRECT NETWORK RECRUITS
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                color: revealProgress > 0.5 ? "#F87171" : "#38BDF8",
              }}
            >
              {revealProgress > 0.5 ? "MUST RECRUIT TO SURVIVE" : "+8% NETWORK BONUS"}
            </div>
            <div style={{ fontSize: 11, color: "#64748B" }}>
              Passes 90% of money upward
            </div>
          </div>
        </div>

        {/* ── TIER 3: LEVEL 2 (INDIRECT RECRUITS) ── */}
        <div
          style={{
            width: 1040,
            height: 84,
            borderRadius: 12,
            backgroundColor: "#0D1322",
            border: revealProgress > 0.5 ? "1.5px solid rgba(239,68,68,0.4)" : "1.5px solid rgba(148,163,184,0.3)",
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            justifyContent: "space-between",
            zIndex: 5,
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>👥👥</span>
            <div>
              <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#94A3B8", fontWeight: 700 }}>
                LEVEL 2 // 4 TO 8 MEMBERS
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>
                SECONDARY SUB-COMMISSIONS
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 800,
                color: revealProgress > 0.5 ? "#EF4444" : "#94A3B8",
              }}
            >
              {revealProgress > 0.5 ? "NEGATIVE ROI FOR 85%+" : "+6% OVERRIDE BONUS"}
            </div>
            <div style={{ fontSize: 11, color: "#64748B" }}>
              Recruits friends & relatives
            </div>
          </div>
        </div>

        {/* ── TIER 4: THE BASE (THE BOTTOM 99%) ── */}
        <div
          style={{
            width: 1380,
            height: 94,
            borderRadius: 14,
            backgroundColor: revealProgress > 0.5 ? "#1F080D" : "#0A0F1D",
            border: revealProgress > 0.5 ? "2px solid #DC2626" : "1.5px solid #334155",
            boxShadow: revealProgress > 0.5 ? "0 0 25px rgba(220,38,38,0.35)" : "none",
            display: "flex",
            alignItems: "center",
            padding: "0 32px",
            justifyContent: "space-between",
            zIndex: 5,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 30 }}>🌍</span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: revealProgress > 0.5 ? "#EF4444" : "#64748B",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                THE BASE // MILLIONS OF ORDINARY BUYERS
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#FFFFFF" }}>
                {revealProgress > 0.5
                  ? "99% OF PARTICIPANTS : COMPLETE CAPITAL LOSS"
                  : '"EDUCATIONAL PACKAGES" BUYERS (€140 TO €27,500)'}
              </div>
              <div style={{ fontSize: 12, color: revealProgress > 0.5 ? "#FCA5A5" : "#94A3B8" }}>
                {revealProgress > 0.5
                  ? "The product was a legal disguise. New buyer funds simply paid old recruiters."
                  : "Purchasers believed they were buying educational cryptocurrency courses."}
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              backgroundColor: revealProgress > 0.5 ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)",
              border: revealProgress > 0.5 ? "1.5px solid #EF4444" : "1px solid rgba(255,255,255,0.15)",
              color: revealProgress > 0.5 ? "#FCA5A5" : "#E2E8F0",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 800,
              textAlign: "center",
            }}
          >
            {revealProgress > 0.5 ? "TOTAL COLLAPSE AT BOTTOM" : "100% OF NEW CASH"}
          </div>
        </div>
      </div>

      {/* ── BOTTOM DEDUCTION BAR ── */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 100,
          right: 100,
          height: 64,
          backgroundColor: "rgba(10, 15, 29, 0.95)",
          border: revealProgress > 0.5
            ? "1px solid rgba(239,68,68,0.4)"
            : "1px solid rgba(212,175,55,0.35)",
          borderRadius: 12,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
          zIndex: 15,
          boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ fontSize: 24, flexShrink: 0 }}>
          {revealProgress > 0.5 ? "⚠️" : "💡"}
        </div>
        <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.4 }}>
          {revealProgress > 0.5 ? (
            <>
              <strong style={{ color: "#EF4444" }}>THE DECEPTION REVEALED :</strong> The "educational packages" were never the business.
              The only real product was <strong>recruitment itself</strong> — a mathematical pyramid bound to collapse once new recruits dried up.
            </>
          ) : (
            <>
              <strong style={{ color: "#D4AF37" }}>THE RECRUITMENT BONUS :</strong> Every buyer was incentivized by commissions to bring in their friends and relatives.
              The product was sold as an educational course, but the payout came exclusively from new entrants.
            </>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
