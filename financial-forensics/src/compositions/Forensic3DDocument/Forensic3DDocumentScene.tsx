import React, { useMemo, useRef } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

export interface Forensic3DDocumentProps {
  imageSrc: string;
  documentTitle?: string;
  aspectRatio?: number; // e.g. 16/9 or 1/1.414 (A4)
  cardWidth?: number;
  durationInFrames?: number;
  transparent?: boolean;
  cameraTravelling?: "push_arc" | "slow_float" | "dramatic_tilt";
}

// Inner 3D Scene Component rendered inside ThreeCanvas
const SceneContent: React.FC<{
  textureUrl: string;
  frame: number;
  fps: number;
  durationInFrames: number;
  aspectRatio: number;
  cameraTravelling: string;
}> = ({ textureUrl, frame, fps, durationInFrames, aspectRatio, cameraTravelling }) => {
  const time = frame / fps;

  // 1. Texture Loading with High Anisotropy for 4K Sharpness
  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const loader = new THREE.TextureLoader();
    const tex = loader.load(textureUrl);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [textureUrl]);

  // 2. Camera Travelling & Parallax Arc
  // Slow cinematic sweep: dolly-in + sweeping angle
  const camProgress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  const camZ = interpolate(camProgress, [0, 1], [4.6, 3.8]);
  const camX = interpolate(camProgress, [0, 1], [-0.5, 0.4]);
  const camY = interpolate(camProgress, [0, 1], [0.25, -0.15]);

  // Document dimensions in 3D units
  const docHeight = 2.4;
  const docWidth = docHeight * aspectRatio;
  const docThickness = 0.025; // Subtle paper card bevel

  // 3. Document 3D Floating Motion (Physics-based organic drift)
  const enterSpring = spring({
    frame,
    fps,
    config: {
      damping: 18,
      stiffness: 80,
      mass: 1.1,
    },
  });

  const enterScale = interpolate(enterSpring, [0, 1], [0.85, 1.0]);
  const enterRotY = interpolate(enterSpring, [0, 1], [-0.35, 0]);
  const enterPosY = interpolate(enterSpring, [0, 1], [-0.4, 0]);

  // Harmonic organic levitation
  const floatX = Math.sin(time * 0.9) * 0.08;
  const floatY = Math.cos(time * 1.2) * 0.09;
  const floatRotX = Math.sin(time * 0.75) * 0.05 + 0.08; // Slight natural backward tilt
  const floatRotY = Math.cos(time * 0.65) * 0.08 + (camProgress - 0.5) * 0.22; // Parallax rotation
  const floatRotZ = Math.sin(time * 0.85) * 0.03;

  // 4. Moving Specular Light Sweep (The key highlight gliding across the document)
  const lightSweepProgress = interpolate(
    frame,
    [10, durationInFrames - 15],
    [-4.5, 4.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // 5. Materials Array for BoxGeometry:
  // [0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z (Front), 5: -Z (Back)]
  const materials = useMemo(() => {
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2f2f2,
      roughness: 0.7,
      metalness: 0.05,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      color: 0x141824, // Dark forensic archival card backing
      roughness: 0.5,
      metalness: 0.1,
    });

    const frontMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.22, // Semi-gloss premium paper finish
      metalness: 0.08,
      clearcoat: 0.45, // Specular clearcoat reflection
      clearcoatRoughness: 0.25,
      reflectivity: 0.6,
    });

    return [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ];
  }, [texture]);

  // 6. Floating 3D Dust / Atmospheric Particulates
  const particles = useMemo(() => {
    const count = 75;
    const pts = [];
    for (let i = 0; i < count; i++) {
      const px = (Math.sin(i * 19.3) - 0.5) * 7.5;
      const py = (Math.cos(i * 29.7) - 0.5) * 5.0;
      const pz = (Math.sin(i * 47.1) - 0.5) * 4.0;
      const speed = 0.15 + (i % 5) * 0.04;
      pts.push({ px, py, pz, speed, size: 0.02 + (i % 3) * 0.012 });
    }
    return pts;
  }, []);

  return (
    <>
      {/* 3D Cinematic Lighting Rig */}
      <ambientLight color={0x1b2838} intensity={1.2} />

      {/* Main Forensic Key Light (Cold white/cyan) */}
      <directionalLight
        position={[3.0, 4.0, 5.0]}
        intensity={2.2}
        color={0xffffff}
      />

      {/* Dynamic Specular Sheen Light sweeping horizontally across the surface */}
      <pointLight
        position={[lightSweepProgress, 1.8, 2.2]}
        intensity={3.8}
        distance={7.0}
        color={0xd4e9ff}
      />

      {/* Soft Rim / Edge Light (Warm gold accent for contrast) */}
      <directionalLight
        position={[-4.0, -2.5, -1.0]}
        intensity={1.1}
        color={0xd4af37}
      />

      {/* Main 3D Floating Document */}
      <group
        position={[
          floatX + camX * 0.3,
          enterPosY + floatY + camY * 0.3,
          0
        ]}
        rotation={[
          floatRotX,
          enterRotY + floatRotY,
          floatRotZ
        ]}
        scale={[enterScale, enterScale, enterScale]}
      >
        {/* The Card Box Geometry */}
        <mesh material={materials} castShadow receiveShadow>
          <boxGeometry args={[docWidth, docHeight, docThickness]} />
        </mesh>

        {/* Soft 3D Drop Shadow Plane behind the card */}
        <mesh position={[0.08, -0.12, -0.45]} rotation={[0, 0, 0]}>
          <planeGeometry args={[docWidth * 1.15, docHeight * 1.15]} />
          <meshBasicMaterial
            color={0x000000}
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 3D Atmospheric Floating Dust Particles */}
      {particles.map((p, idx) => {
        const driftY = p.py + ((time * p.speed) % 4.0) - 2.0;
        const driftX = p.px + Math.sin(time * 0.5 + idx) * 0.12;
        return (
          <mesh key={idx} position={[driftX, driftY, p.pz]}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial
              color={0x8ec5fc}
              transparent
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const Forensic3DDocumentScene: React.FC<Forensic3DDocumentProps> = ({
  imageSrc,
  documentTitle = "",
  aspectRatio = 16 / 9,
  durationInFrames = 150,
  transparent = false,
  cameraTravelling = "push_arc",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Resolve image source
  const resolvedSrc =
    imageSrc.startsWith("data:") ||
    imageSrc.startsWith("http://") ||
    imageSrc.startsWith("https://") ||
    imageSrc.startsWith("/")
      ? imageSrc
      : staticFile(imageSrc);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: transparent ? "transparent" : "#060b14",
        overflow: "hidden",
      }}
    >
      {/* Background Ambience (if not transparent) */}
      {!transparent && (
        <>
          {/* Deep Navy/Slate Forensic Radial Gradient */}
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, #0d1e38 0%, #081224 55%, #040812 100%)",
            }}
          />

          {/* Forensic Technical Coordinate Grid */}
          <AbsoluteFill
            style={{
              backgroundImage: `
                linear-gradient(rgba(56, 189, 248, 0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56, 189, 248, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
              pointerEvents: "none",
            }}
          />

          {/* Cinematic Vignette */}
          <AbsoluteFill
            style={{
              boxShadow: "inset 0 0 180px 60px rgba(2, 6, 14, 0.75)",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Three.js 3D WebGL Canvas */}
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{
          fov: 40,
          position: [0, 0, 4.5],
          near: 0.1,
          far: 1000,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <SceneContent
          textureUrl={resolvedSrc}
          frame={frame}
          fps={fps}
          durationInFrames={durationInFrames}
          aspectRatio={aspectRatio}
          cameraTravelling={cameraTravelling}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
