import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  Video,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

export const Design1HiggsfieldScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // SEGMENT 1 : "IN / OUT" Flow (Frames 0 to 28)
  // -------------------------------------------------------------
  const showSegment1 = frame < 30;
  const seg1Progress = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const seg1Scale = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const seg1Exit = interpolate(frame, [25, 29], [1, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seg1Opacity = interpolate(frame, [26, 29], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // -------------------------------------------------------------
  // SEGMENT 2 : Macro Scan & Surface HUD (Frames 28 to 72)
  // -------------------------------------------------------------
  const showSegment2 = frame >= 28 && frame < 72;
  const seg2Frame = Math.max(0, frame - 28);
  const seg2Zoom = interpolate(seg2Frame, [0, 44], [1.0, 1.15], { extrapolateRight: "clamp" });

  // -------------------------------------------------------------
  // SEGMENT 3 : Dot Matrix Silhouette (Frames 70 to 96) - Cavalry Native
  // -------------------------------------------------------------
  const showSegment3 = frame >= 70 && frame < 96;
  const seg3Frame = Math.max(0, frame - 70);

  // -------------------------------------------------------------
  // SEGMENT 4 : Interlocking "STAGES" (Frames 94 to 126)
  // -------------------------------------------------------------
  const showSegment4 = frame >= 94 && frame < 126;
  const seg4Frame = Math.max(0, frame - 94);
  const splitOffset = interpolate(seg4Frame, [0, 12], [0, 140], { extrapolateRight: "clamp" });
  const stageFruitScale = spring({ frame: seg4Frame - 2, fps, config: { damping: 12, stiffness: 150 } });

  // -------------------------------------------------------------
  // SEGMENT 5 : Forensic Specimen Blueprint (Frames 124 to 166) - Cavalry Native
  // -------------------------------------------------------------
  const showSegment5 = frame >= 124 && frame < 166;
  const seg5Frame = Math.max(0, frame - 124);

  // -------------------------------------------------------------
  // SEGMENT 6 : Step Evolution Staircase (Frames 164 to 196) - Cavalry Native
  // -------------------------------------------------------------
  const showSegment6 = frame >= 164 && frame < 196;
  const seg6Frame = Math.max(0, frame - 164);

  // -------------------------------------------------------------
  // SEGMENT 7 : Data Plexus / Mesh Triangulation (Frames 194 to 228) - Cavalry Native
  // -------------------------------------------------------------
  const showSegment7 = frame >= 194;
  const seg7Frame = Math.max(0, frame - 194);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
      {/* Sound Design Cinématique Propre : Zéro Wooshes artificiels (rythme visuel pur) */}
      <Sequence from={28} durationInFrames={20}>
        <Audio src={staticFile("sfx/shutter.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={124} durationInFrames={20}>
        <Audio src={staticFile("sfx/shutter.wav")} volume={0.35} />
      </Sequence>

      {/* ========================================================= */}
      {/* SEGMENT 1 : IN / OUT FLOW                                 */}
      {/* ========================================================= */}
      {showSegment1 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#9AE727",
            opacity: seg1Opacity,
            transform: `scale(${seg1Exit})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Animated Connecting Spline */}
          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
            viewBox="0 0 1920 1080"
          >
            <path
              d="M 520 620 C 720 700, 1100 200, 1380 400"
              fill="none"
              stroke="#5D9914"
              strokeWidth="3"
            />
            {/* Animated Pulses */}
            <circle
              cx={interpolate(frame, [4, 24], [520, 1380], { extrapolateRight: "clamp" })}
              cy={interpolate(frame, [4, 24], [620, 400], { extrapolateRight: "clamp" })}
              r="7"
              fill="#000000"
            />
          </svg>

          {/* Left Card: IN */}
          <div
            style={{
              position: "absolute",
              left: 360,
              top: 380,
              width: 280,
              height: 280,
              backgroundColor: "#0B0F10",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${seg1Scale})`,
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            }}
          >
            {/* Small corner markers */}
            {[-1, 1].map((cx) =>
              [-1, 1].map((cy) => (
                <div
                  key={`${cx}-${cy}`}
                  style={{
                    position: "absolute",
                    left: cx === 1 ? -4 : "auto",
                    right: cx === -1 ? -4 : "auto",
                    top: cy === 1 ? -4 : "auto",
                    bottom: cy === -1 ? -4 : "auto",
                    width: 8,
                    height: 8,
                    backgroundColor: "#000000",
                  }}
                />
              ))
            )}
            <Img
              src={staticFile("design1_assets/stage1_bud.png")}
              style={{ maxHeight: 200, objectFit: "contain" }}
            />
          </div>

          {/* Central Bold Type: IN */}
          <div
            style={{
              position: "absolute",
              left: 700,
              top: 360,
              fontSize: 260,
              fontWeight: 900,
              letterSpacing: "-0.08em",
              color: "#0B0F10",
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              transform: `scaleY(1.3)`,
            }}
          >
            IN
          </div>

          {/* Central Bold Type: OUT */}
          <div
            style={{
              position: "absolute",
              left: 1040,
              top: 360,
              fontSize: 260,
              fontWeight: 900,
              letterSpacing: "-0.08em",
              color: "#0B0F10",
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              transform: `scaleY(1.3)`,
            }}
          >
            OUT
          </div>

          {/* Right Card: OUT */}
          <div
            style={{
              position: "absolute",
              left: 1280,
              top: 260,
              width: 280,
              height: 280,
              backgroundColor: "#0B0F10",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${seg1Scale})`,
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            }}
          >
            {[-1, 1].map((cx) =>
              [-1, 1].map((cy) => (
                <div
                  key={`r-${cx}-${cy}`}
                  style={{
                    position: "absolute",
                    left: cx === 1 ? -4 : "auto",
                    right: cx === -1 ? -4 : "auto",
                    top: cy === 1 ? -4 : "auto",
                    bottom: cy === -1 ? -4 : "auto",
                    width: 8,
                    height: 8,
                    backgroundColor: "#000000",
                  }}
                />
              ))
            )}
            <Img
              src={staticFile("design1_assets/pitaya_slice.png")}
              style={{ maxHeight: 220, objectFit: "contain" }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================= */}
      {/* SEGMENT 2 : MACRO SCAN & SURFACE HUD                      */}
      {/* ========================================================= */}
      {showSegment2 && (
        <AbsoluteFill style={{ backgroundColor: "#060809", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transform: `scale(${seg2Zoom})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Img
              src={staticFile("design1_assets/macro_cross_section_base.png")}
              style={{ width: 1920, height: 1080, objectFit: "cover" }}
            />

            {/* Scanning Laser Vertical Lines & Tick Marks */}
            <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 60, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={`tl-${i}`}
                  style={{
                    width: i % 4 === 0 ? 44 : 22,
                    height: 4,
                    backgroundColor: "#FFFFFF",
                    opacity: 0.9,
                    transform: `translateY(${Math.sin((seg2Frame + i * 4) * 0.2) * 5}px)`,
                  }}
                />
              ))}
            </div>

            <div style={{ position: "absolute", right: 80, top: 0, bottom: 0, width: 60, display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "flex-end" }}>
              {Array.from({ length: 22 }).map((_, i) => (
                <div
                  key={`tr-${i}`}
                  style={{
                    width: i % 4 === 0 ? 44 : 22,
                    height: 4,
                    backgroundColor: "#FFFFFF",
                    opacity: 0.9,
                    transform: `translateY(${Math.cos((seg2Frame + i * 4) * 0.2) * 5}px)`,
                  }}
                />
              ))}
            </div>

            {/* HUD Target 1 : Surface_01 */}
            <div
              style={{
                position: "absolute",
                left: 450,
                top: 360,
                width: 240,
                height: 320,
                border: "2px solid #FFFFFF",
                boxShadow: "0 0 15px rgba(255,255,255,0.3)",
              }}
            >
              <div style={{ position: "absolute", top: -26, left: 0, color: "#FFFFFF", fontSize: 16, fontWeight: 700, letterSpacing: "0.08em" }}>
                Surface_01
              </div>
              <Img
                src={staticFile("design1_assets/pitaya_slice.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(180%) grayscale(100%)" }}
              />
            </div>

            {/* HUD Target 2 : Surface_02 */}
            <div
              style={{
                position: "absolute",
                left: 860,
                top: 220,
                width: 380,
                height: 240,
                border: "2px solid #FFFFFF",
              }}
            >
              <div style={{ position: "absolute", top: -26, left: 0, color: "#FFFFFF", fontSize: 16, fontWeight: 700, letterSpacing: "0.08em" }}>
                Surface_02
              </div>
            </div>

            {/* HUD Target 3 : Surface_03 */}
            <div
              style={{
                position: "absolute",
                left: 950,
                top: 640,
                width: 240,
                height: 220,
                border: "2px solid #FFFFFF",
              }}
            >
              <div style={{ position: "absolute", top: -26, left: 0, color: "#FFFFFF", fontSize: 16, fontWeight: 700, letterSpacing: "0.08em" }}>
                Surface_03
              </div>
              <Img
                src={staticFile("design1_assets/pitaya_slice.png")}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(200%) grayscale(100%)" }}
              />
            </div>

            {/* HUD Target 4 : Surface_04 */}
            <div
              style={{
                position: "absolute",
                right: 200,
                top: 320,
                width: 320,
                height: 200,
                border: "2px solid #FFFFFF",
              }}
            >
              <div style={{ position: "absolute", top: -26, left: 0, color: "#FFFFFF", fontSize: 16, fontWeight: 700, letterSpacing: "0.08em" }}>
                Surface_04
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================= */}
      {/* SEGMENT 3 : DOT MATRIX PROCEDURAL CAVALRY RENDER          */}
      {/* ========================================================= */}
      {showSegment3 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#9AE727",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={staticFile("cavalry_renders/cavalry_dot_matrix.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* ========================================================= */}
      {/* SEGMENT 4 : KINETIC "STAGES" REVEAL                       */}
      {/* ========================================================= */}
      {showSegment4 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#0B0F10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Left Text : STA */}
          <div
            style={{
              position: "absolute",
              left: 450 - splitOffset,
              fontSize: 260,
              fontWeight: 900,
              letterSpacing: "-0.08em",
              color: "#F3EDE1",
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              transform: `scaleY(1.3)`,
            }}
          >
            STA
          </div>

          {/* Fruit Burst In Center */}
          <div
            style={{
              position: "absolute",
              width: 440,
              height: 440,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${stageFruitScale})`,
            }}
          >
            {/* 4 Green Corner Markers */}
            {[-1, 1].map((cx) =>
              [-1, 1].map((cy) => (
                <div
                  key={`st-${cx}-${cy}`}
                  style={{
                    position: "absolute",
                    left: cx === -1 ? 20 : "auto",
                    right: cx === 1 ? 20 : "auto",
                    top: cy === -1 ? 20 : "auto",
                    bottom: cy === 1 ? 20 : "auto",
                    width: 22,
                    height: 22,
                    backgroundColor: "#9AE727",
                  }}
                />
              ))
            )}
            <Img
              src={staticFile("design1_assets/pitaya_whole.png")}
              style={{ maxHeight: 380, objectFit: "contain" }}
            />
          </div>

          {/* Right Text : GES */}
          <div
            style={{
              position: "absolute",
              left: 1100 + splitOffset,
              fontSize: 260,
              fontWeight: 900,
              letterSpacing: "-0.08em",
              color: "#F3EDE1",
              fontFamily: "'Impact', 'Arial Black', sans-serif",
              transform: `scaleY(1.3)`,
            }}
          >
            GES
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================= */}
      {/* SEGMENT 5 : FORENSIC SPECIMEN BLUEPRINT (CAVALRY NATIVE)  */}
      {/* ========================================================= */}
      {showSegment5 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#F0EDE6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={staticFile("cavalry_renders/cavalry_blueprint.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      )}

      {/* ========================================================= */}
      {/* SEGMENT 6 : STEP EVOLUTION PROCEDURAL CAVALRY RENDER       */}
      {/* ========================================================= */}
      {showSegment6 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#DA008B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={staticFile("cavalry_renders/cavalry_staircase.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Incrustation haute fidélité du spécimen évolutif centré */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${spring({
                frame: seg6Frame,
                fps,
                config: { damping: 13, stiffness: 130 },
              })})`,
              filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.4))",
              pointerEvents: "none",
            }}
          >
            <Img
              src={staticFile("design1_assets/staircase_cluster_alpha.png")}
              style={{ width: 1220, objectFit: "contain", mixBlendMode: "screen" }}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ========================================================= */}
      {/* SEGMENT 7 : PLEXUS TRIANGULATION PROCEDURAL CAVALRY RENDER */}
      {/* ========================================================= */}
      {showSegment7 && (
        <AbsoluteFill
          style={{
            backgroundColor: "#0E0B12",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Video
            src={staticFile("cavalry_renders/cavalry_plexus.mp4")}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          {/* Macro specimen en fondu d'arrière-plan */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.35,
              mixBlendMode: "screen",
              pointerEvents: "none",
            }}
          >
            <Img
              src={staticFile("design1_assets/macro_cross_section_base.png")}
              style={{ width: 1920, height: 1080, objectFit: "cover" }}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
