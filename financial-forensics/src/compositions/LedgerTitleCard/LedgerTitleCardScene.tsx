import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadCourierPrime } from "@remotion/google-fonts/CourierPrime";

const { fontFamily: caveatFont } = loadCaveat();
const { fontFamily: antonFont } = loadAnton();
const { fontFamily: cinzelFont } = loadCinzel();
const { fontFamily: courierFont } = loadCourierPrime();

export interface LedgerTitleCardProps {
  channelName?: string;
  caseNumber?: string;
  title?: string;
  subtitle?: string;
  handwrittenNote1?: string;
  handwrittenNote2?: string;
  handwrittenNote3?: string;
  mainImageSrc?: string;
  sideImageSrc?: string;
  suspectImageSrc?: string;
  themeMode?: "archival_paper" | "dark_forensic";
  stampText?: string;
}

export const LedgerTitleCardScene: React.FC<LedgerTitleCardProps> = ({
  channelName = "THE LEDGER",
  caseNumber = "DOSSIER #1976-NC",
  title = "LE CASSE DU SIÈCLE",
  subtitle = "NICE • JUILLET 1976",
  handwrittenNote1 = "Sans armes, sans haine, sans violence...",
  handwrittenNote2 = "le coffre de la Société Générale",
  handwrittenNote3 = "weekend du 14 juillet — 80m de tunnel",
  mainImageSrc,
  sideImageSrc,
  suspectImageSrc,
  themeMode = "archival_paper",
  stampText = "LEDGER VERIFIED",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Zoom avant cinématique très lent sur toute la scène (1.0 -> 1.035)
  const masterZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.035], {
    extrapolateRight: "clamp",
  });

  // Fondu de sortie propre en fin de plan
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 2. Animations en cascade (Staggering pro)
  // Entrée de la photo principale au centre (Frame 2)
  const mainPhotoEntrance = spring({
    frame: frame - 2,
    fps,
    config: { damping: 16, stiffness: 90, mass: 1.1 },
  });

  // Entrée de la photo secondaire à droite (Frame 6)
  const sidePhotoEntrance = spring({
    frame: frame - 6,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.9 },
  });

  // Entrée du portrait suspect en bas à gauche (Frame 9)
  const suspectPhotoEntrance = spring({
    frame: frame - 9,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.85 },
  });

  // Entrée du grand cartouche de titre (Frame 14)
  const titleBoxEntrance = spring({
    frame: frame - 14,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.9 },
  });

  // Expansion élégante de l'espacement des lettres du titre (Tracking reveal)
  const letterSpacing = interpolate(
    frame,
    [15, 45],
    [2, 10],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Révélation de l'écriture manuscrite (Frame 20)
  const handwritingReveal = interpolate(frame, [20, 38], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Révélation du tampon rouge officiel (Frame 28)
  const stampEntrance = spring({
    frame: frame - 28,
    fps,
    config: { damping: 9, stiffness: 200, mass: 0.8 },
  });

  // Thème de couleur : Papier Archival clair vs Dark Forensic
  const isDark = themeMode === "dark_forensic";
  const bgColor = isDark ? "#0A0E17" : "#EBE6DF";
  const gridLineColor = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.055)";
  const inkColor = isDark ? "#94A3B8" : "#2C3545";
  const cursiveColor = isDark ? "#38BDF8" : "#1E293B";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        overflow: "hidden",
        opacity: fadeOut,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Importation des Google Fonts authentiques (Handwriting, Serif, Condensed) */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Anton&family=Cinzel:wght@800;900&family=Courier+Prime:wght@700&display=swap');
        `}
      </style>
      {/* ------------------------------------------------------------- */}
      {/* 1. FOND DE TABLE D'ENQUÊTE & QUADRILLAGE GRAND LIVRE          */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, ${gridLineColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLineColor} 1px, transparent 1px)
          `,
          backgroundSize: "75px 75px",
          transform: `scale(${masterZoom})`,
          transformOrigin: "center center",
        }}
      />

      {/* Vignettage radial doux sur les bords */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "radial-gradient(circle at center, transparent 35%, rgba(5, 8, 15, 0.85) 100%)"
            : "radial-gradient(circle at center, transparent 45%, rgba(0, 0, 0, 0.18) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Signature Discrète de la Chaîne en Filigrane (The Ledger) */}
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 50,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: 0.75,
        }}
      >
        <div
          style={{
            fontFamily: cinzelFont,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: 6,
            color: isDark ? "#F8FAFC" : "#1E293B",
            textTransform: "uppercase",
          }}
        >
          {channelName}
        </div>
        <div
          style={{
            fontSize: 12,
            fontFamily: courierFont,
            letterSpacing: 2,
            color: isDark ? "#38BDF8" : "#64748B",
            padding: "2px 8px",
            border: `1px solid ${isDark ? "rgba(56, 189, 248, 0.3)" : "rgba(0, 0, 0, 0.15)"}`,
            borderRadius: 2,
          }}
        >
          {caseNumber}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. ANNOTATIONS MANUSCRITES D'ÉPOQUE (CURSIVE NOTES)          */}
      {/* ------------------------------------------------------------- */}
      {/* Note 1 (Haut gauche) */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 90,
          fontFamily: caveatFont,
          fontSize: 34,
          fontWeight: 700,
          color: cursiveColor,
          opacity: handwritingReveal * 0.85,
          transform: "rotate(-1.5deg)",
          userSelect: "none",
        }}
      >
        {handwrittenNote3}
      </div>

      {/* Note 2 (Bas droite sous la grande photo) */}
      <div
        style={{
          position: "absolute",
          bottom: 45,
          right: 320,
          fontFamily: caveatFont,
          fontSize: 36,
          fontWeight: 700,
          color: cursiveColor,
          opacity: handwritingReveal * 0.9,
          transform: "rotate(-0.8deg)",
          userSelect: "none",
        }}
      >
        {handwrittenNote2}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. COLLAGE D'ARCHIVES PHOTOGRAPHIQUES                         */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${masterZoom})`,
        }}
      >
        {/* PHOTO CENTRALE (Bâtiment / Banque / Lieu clé) */}
        <div
          style={{
            position: "relative",
            width: 1040,
            height: 640,
            backgroundColor: "#FFFFFF",
            padding: "16px 16px 20px 16px",
            borderRadius: 4,
            boxShadow: "0 28px 65px -15px rgba(0, 0, 0, 0.45), 0 10px 25px rgba(0, 0, 0, 0.2)",
            transform: `scale(${mainPhotoEntrance}) translateY(${interpolate(
              mainPhotoEntrance,
              [0, 1],
              [45, 0]
            )}px)`,
            opacity: mainPhotoEntrance,
          }}
        >
          {/* Cadre intérieur photo noir et blanc */}
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#2B303A",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {mainImageSrc ? (
              <Img
                src={mainImageSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%) contrast(125%) brightness(95%)",
                }}
              />
            ) : (
              // Visuel stylisé architectural par défaut
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(135deg, #1E232D 0%, #353B47 50%, #1A1E26 100%)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#94A3B8",
                  letterSpacing: 4,
                  fontSize: 18,
                  textTransform: "uppercase",
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 12, opacity: 0.6 }}>🏛️</div>
                <div style={{ fontWeight: 800, color: "#E2E8F0" }}>SOCIÉTÉ GÉNÉRALE • NICE</div>
                <div style={{ fontSize: 13, marginTop: 6, opacity: 0.7 }}>ARCHIVE PHOTOGRAPHIQUE 1976</div>
              </div>
            )}

            {/* Grain et reflet papier photo */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, rgba(255,255,255,0.06) 0%, transparent 60%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* PHOTO SECONDAIRE À DROITE (Le Tunnel / La Preuve) */}
        <div
          style={{
            position: "absolute",
            right: 110,
            top: 130,
            width: 290,
            height: 380,
            backgroundColor: "#FFFFFF",
            padding: "12px 12px 16px 12px",
            borderRadius: 3,
            boxShadow: "0 22px 50px -10px rgba(0, 0, 0, 0.4)",
            transform: `scale(${sidePhotoEntrance}) rotate(${interpolate(
              sidePhotoEntrance,
              [0, 1],
              [0, 2.5]
            )}deg)`,
            opacity: sidePhotoEntrance,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#1F242E",
              overflow: "hidden",
            }}
          >
            {sideImageSrc ? (
              <Img
                src={sideImageSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%) contrast(130%)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to bottom, #242933, #15181E)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#64748B",
                  fontSize: 12,
                  textAlign: "center",
                  padding: 15,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>🕳️</div>
                <div style={{ color: "#CBD5E1", fontWeight: "bold" }}>EXHIBIT #A</div>
                <div>ACCÈS ÉGOUT & TUNNEL</div>
              </div>
            )}
          </div>
        </div>

        {/* PHOTO TERTIAIRE EN BAS À GAUCHE (Le Suspect / Portrait) */}
        <div
          style={{
            position: "absolute",
            left: 110,
            bottom: 120,
            width: 320,
            height: 250,
            backgroundColor: "#FFFFFF",
            padding: "12px 12px 16px 12px",
            borderRadius: 3,
            boxShadow: "0 22px 50px -10px rgba(0, 0, 0, 0.4)",
            transform: `scale(${suspectPhotoEntrance}) rotate(${interpolate(
              suspectPhotoEntrance,
              [0, 1],
              [0, -2.8]
            )}deg)`,
            opacity: suspectPhotoEntrance,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#1F242E",
              overflow: "hidden",
            }}
          >
            {suspectImageSrc ? (
              <Img
                src={suspectImageSrc}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "grayscale(100%) contrast(125%)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to bottom, #2D333F, #191C22)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#64748B",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 6 }}>👤</div>
                <div style={{ color: "#E2E8F0", fontWeight: "bold" }}>ALBERT SPAGGIARI</div>
                <div style={{ fontSize: 11 }}>CERVEAU DU CASSE</div>
              </div>
            )}
          </div>
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 4. LE CARTOUCHE DE TITRE MONUMENTAL ("THE LEDGER BILLBOARD") */}
        {/* ----------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            bottom: 260,
            left: "50%",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateX(-50%) scale(${titleBoxEntrance}) translateY(${interpolate(
              titleBoxEntrance,
              [0, 1],
              [35, 0]
            )}px)`,
            opacity: titleBoxEntrance,
          }}
        >
          {/* Boîte de titre sombre rectangulaire */}
          <div
            style={{
              backgroundColor: "#161922",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: 3,
              boxShadow: "0 30px 70px rgba(0, 0, 0, 0.75), 0 0 30px rgba(0, 0, 0, 0.35)",
              padding: "24px 75px 22px 75px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Ligne de Titre d'Épisode Principal */}
            <div
              style={{
                fontFamily: antonFont,
                fontSize: 88,
                color: "#FFFFFF",
                letterSpacing: `${letterSpacing}px`,
                textTransform: "uppercase",
                lineHeight: 1,
                whiteSpace: "nowrap",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
              }}
            >
              {title}
            </div>

            {/* Petite ligne de séparation or */}
            <div
              style={{
                width: 110,
                height: 2,
                backgroundColor: "#D4AF37",
                margin: "14px 0 10px 0",
                opacity: 0.9,
              }}
            />

            {/* Sous-titre Spatio-Temporel (Typewriter) */}
            <div
              style={{
                fontFamily: courierFont,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 4,
                color: "#E2E8F0",
                textTransform: "uppercase",
                opacity: 0.95,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Citation culte manuscrite sous le cartouche */}
          {handwrittenNote1 && (
            <div
              style={{
                fontFamily: caveatFont,
                fontSize: 44,
                fontWeight: 700,
                color: isDark ? "#E2E8F0" : "#1E293B",
                marginTop: 22,
                opacity: handwritingReveal,
                textShadow: isDark
                  ? "0 2px 12px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)"
                  : "0 2px 8px rgba(255,255,255,0.95), 0 0 4px rgba(255,255,255,0.9)",
                transform: "rotate(-1.2deg)",
                whiteSpace: "nowrap",
              }}
            >
              {handwrittenNote1}
            </div>
          )}
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 5. TAMPON OFFICIEL "THE LEDGER"                             */}
        {/* ----------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            bottom: 65,
            right: 80,
            transform: `scale(${stampEntrance}) rotate(14deg)`,
            opacity: stampEntrance,
            border: "3px double #DC2626",
            borderRadius: 4,
            padding: "8px 18px",
            color: "#DC2626",
            fontFamily: "'Courier Prime', monospace",
            fontWeight: 900,
            fontSize: 16,
            letterSpacing: 3,
            textTransform: "uppercase",
            boxShadow: "0 0 15px rgba(220, 38, 38, 0.2)",
            backgroundColor: isDark ? "rgba(10, 14, 23, 0.8)" : "rgba(235, 230, 223, 0.8)",
          }}
        >
          {stampText}
        </div>
      </div>
    </AbsoluteFill>
  );
};
