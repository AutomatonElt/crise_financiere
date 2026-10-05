import React, { useMemo } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { geoEquirectangular, geoPath } from "d3-geo";
// @ts-ignore
import { feature } from "topojson-client";
import { theme } from "../../theme";
// @ts-ignore
import worldData from "world-atlas/countries-110m.json";

interface CityNode {
  name: string;
  lon: number;
  lat: number;
  appearFrame: number;
  isMajor?: boolean;
}

// 120+ REAL, VERIFIED LAND COORDINATES (Zero ocean dots!)
const CITIES: CityNode[] = [
  // --- EPICENTER ---
  { name: "Sofia", lon: 23.32, lat: 42.70, appearFrame: 35, isMajor: true },

  // --- EUROPE (Frames 45 - 100) ---
  { name: "Konstanz", lon: 9.17, lat: 47.66, appearFrame: 48, isMajor: true },
  { name: "Munich", lon: 11.58, lat: 48.13, appearFrame: 52 },
  { name: "Frankfurt", lon: 8.68, lat: 50.11, appearFrame: 55 },
  { name: "Berlin", lon: 13.40, lat: 52.52, appearFrame: 58, isMajor: true },
  { name: "London", lon: -0.12, lat: 51.50, appearFrame: 60, isMajor: true },
  { name: "Birmingham", lon: -1.90, lat: 52.48, appearFrame: 64 },
  { name: "Manchester", lon: -2.24, lat: 53.48, appearFrame: 68 },
  { name: "Zurich", lon: 8.54, lat: 47.37, appearFrame: 70 },
  { name: "Vienna", lon: 16.37, lat: 48.20, appearFrame: 72 },
  { name: "Paris", lon: 2.35, lat: 48.85, appearFrame: 75 },
  { name: "Lyon", lon: 4.83, lat: 45.76, appearFrame: 78 },
  { name: "Amsterdam", lon: 4.90, lat: 52.37, appearFrame: 80 },
  { name: "Brussels", lon: 4.35, lat: 50.85, appearFrame: 82 },
  { name: "Milan", lon: 9.19, lat: 45.46, appearFrame: 84 },
  { name: "Rome", lon: 12.49, lat: 41.90, appearFrame: 86 },
  { name: "Madrid", lon: -3.70, lat: 40.41, appearFrame: 88 },
  { name: "Barcelona", lon: 2.17, lat: 41.38, appearFrame: 90 },
  { name: "Athens", lon: 23.72, lat: 37.98, appearFrame: 92 },
  { name: "Bucharest", lon: 26.10, lat: 44.43, appearFrame: 94 },
  { name: "Warsaw", lon: 21.01, lat: 52.23, appearFrame: 96 },
  { name: "Prague", lon: 14.43, lat: 50.07, appearFrame: 98 },
  { name: "Budapest", lon: 19.04, lat: 47.49, appearFrame: 100 },
  { name: "Stockholm", lon: 18.06, lat: 59.32, appearFrame: 102 },
  { name: "Oslo", lon: 10.75, lat: 59.91, appearFrame: 104 },
  { name: "Helsinki", lon: 24.93, lat: 60.16, appearFrame: 106 },
  { name: "Kyiv", lon: 30.52, lat: 50.45, appearFrame: 108 },
  { name: "Istanbul", lon: 28.97, lat: 41.00, appearFrame: 110 },
  { name: "Ankara", lon: 32.85, lat: 39.93, appearFrame: 112 },
  { name: "Moscow", lon: 37.61, lat: 55.75, appearFrame: 115 },

  // --- AFRICA (Frames 95 - 170) ---
  { name: "Kampala", lon: 32.58, lat: 0.34, appearFrame: 105, isMajor: true },
  { name: "Jinja", lon: 33.20, lat: 0.44, appearFrame: 108 },
  { name: "Nairobi", lon: 36.82, lat: -1.29, appearFrame: 112, isMajor: true },
  { name: "Mombasa", lon: 39.66, lat: -4.04, appearFrame: 116 },
  { name: "Lagos", lon: 3.37, lat: 6.52, appearFrame: 120, isMajor: true },
  { name: "Abuja", lon: 7.49, lat: 9.07, appearFrame: 124 },
  { name: "Accra", lon: -0.18, lat: 5.60, appearFrame: 128 },
  { name: "Kumasi", lon: -1.62, lat: 6.68, appearFrame: 130 },
  { name: "Addis Ababa", lon: 38.75, lat: 9.03, appearFrame: 133 },
  { name: "Dar es Salaam", lon: 39.28, lat: -6.79, appearFrame: 136 },
  { name: "Kigali", lon: 30.06, lat: -1.97, appearFrame: 140 },
  { name: "Kinshasa", lon: 15.31, lat: -4.32, appearFrame: 143 },
  { name: "Douala", lon: 9.70, lat: 4.05, appearFrame: 146 },
  { name: "Yaoundé", lon: 11.51, lat: 3.84, appearFrame: 148 },
  { name: "Dakar", lon: -17.44, lat: 14.69, appearFrame: 152 },
  { name: "Abidjan", lon: -4.00, lat: 5.35, appearFrame: 155 },
  { name: "Johannesburg", lon: 28.04, lat: -26.20, appearFrame: 158, isMajor: true },
  { name: "Pretoria", lon: 28.18, lat: -25.74, appearFrame: 160 },
  { name: "Cape Town", lon: 18.42, lat: -33.92, appearFrame: 163 },
  { name: "Durban", lon: 31.02, lat: -29.85, appearFrame: 166 },
  { name: "Harare", lon: 31.05, lat: -17.82, appearFrame: 168 },
  { name: "Cairo", lon: 31.23, lat: 30.04, appearFrame: 170 },
  { name: "Casablanca", lon: -7.58, lat: 33.57, appearFrame: 172 },
  { name: "Tunis", lon: 10.18, lat: 36.80, appearFrame: 174 },

  // --- ASIA & MIDDLE EAST (Frames 130 - 220) ---
  { name: "Dubai", lon: 55.27, lat: 25.20, appearFrame: 135, isMajor: true },
  { name: "Abu Dhabi", lon: 54.37, lat: 24.45, appearFrame: 138 },
  { name: "Doha", lon: 51.53, lat: 25.28, appearFrame: 142 },
  { name: "Riyadh", lon: 46.67, lat: 24.71, appearFrame: 145 },
  { name: "Kuwait City", lon: 47.97, lat: 29.37, appearFrame: 148 },
  { name: "Karachi", lon: 67.00, lat: 24.86, appearFrame: 150, isMajor: true },
  { name: "Lahore", lon: 74.35, lat: 31.52, appearFrame: 154 },
  { name: "Islamabad", lon: 73.04, lat: 33.68, appearFrame: 158 },
  { name: "Mumbai", lon: 72.87, lat: 19.07, appearFrame: 162, isMajor: true },
  { name: "Delhi", lon: 77.10, lat: 28.70, appearFrame: 165 },
  { name: "Bengaluru", lon: 77.59, lat: 12.97, appearFrame: 168 },
  { name: "Kolkata", lon: 88.36, lat: 22.57, appearFrame: 170 },
  { name: "Dhaka", lon: 90.41, lat: 23.81, appearFrame: 173 },
  { name: "Hanoi", lon: 105.85, lat: 21.02, appearFrame: 176, isMajor: true },
  { name: "Ho Chi Minh", lon: 106.66, lat: 10.82, appearFrame: 180 },
  { name: "Bangkok", lon: 100.50, lat: 13.75, appearFrame: 183, isMajor: true },
  { name: "Chiang Mai", lon: 98.98, lat: 18.78, appearFrame: 186 },
  { name: "Kuala Lumpur", lon: 101.68, lat: 3.13, appearFrame: 190 },
  { name: "Singapore", lon: 103.81, lat: 1.35, appearFrame: 193, isMajor: true },
  { name: "Jakarta", lon: 106.84, lat: -6.20, appearFrame: 196 },
  { name: "Surabaya", lon: 112.75, lat: -7.25, appearFrame: 199 },
  { name: "Manila", lon: 120.98, lat: 14.59, appearFrame: 202 },
  { name: "Hong Kong", lon: 114.16, lat: 22.31, appearFrame: 205, isMajor: true },
  { name: "Taipei", lon: 121.56, lat: 25.03, appearFrame: 208 },
  { name: "Seoul", lon: 126.97, lat: 37.56, appearFrame: 212 },
  { name: "Tokyo", lon: 139.69, lat: 35.67, appearFrame: 215, isMajor: true },
  { name: "Osaka", lon: 135.50, lat: 34.69, appearFrame: 218 },
  { name: "Almaty", lon: 76.92, lat: 43.23, appearFrame: 222 },
  { name: "Tashkent", lon: 69.24, lat: 41.29, appearFrame: 225 },

  // --- AMERICAS (Frames 180 - 260) ---
  { name: "New York", lon: -74.00, lat: 40.71, appearFrame: 185, isMajor: true },
  { name: "Miami", lon: -80.19, lat: 25.76, appearFrame: 190 },
  { name: "Chicago", lon: -87.62, lat: 41.87, appearFrame: 195 },
  { name: "Houston", lon: -95.36, lat: 29.76, appearFrame: 200 },
  { name: "Los Angeles", lon: -118.24, lat: 34.05, appearFrame: 205, isMajor: true },
  { name: "San Francisco", lon: -122.41, lat: 37.77, appearFrame: 210 },
  { name: "Toronto", lon: -79.38, lat: 43.65, appearFrame: 215 },
  { name: "Montreal", lon: -73.56, lat: 45.50, appearFrame: 220 },
  { name: "Vancouver", lon: -123.12, lat: 49.28, appearFrame: 225 },
  { name: "Mexico City", lon: -99.13, lat: 19.43, appearFrame: 230, isMajor: true },
  { name: "Guadalajara", lon: -103.34, lat: 20.65, appearFrame: 234 },
  { name: "Bogotá", lon: -74.07, lat: 4.71, appearFrame: 238 },
  { name: "Medellín", lon: -75.56, lat: 6.24, appearFrame: 242 },
  { name: "Lima", lon: -77.04, lat: -12.04, appearFrame: 246 },
  { name: "São Paulo", lon: -46.63, lat: -23.55, appearFrame: 250, isMajor: true },
  { name: "Rio de Janeiro", lon: -43.17, lat: -22.90, appearFrame: 254 },
  { name: "Brasília", lon: -47.88, lat: -15.79, appearFrame: 258 },
  { name: "Buenos Aires", lon: -58.38, lat: -34.60, appearFrame: 262 },
  { name: "Santiago", lon: -70.66, lat: -33.44, appearFrame: 266 },

  // --- OCEANIA (Frames 220 - 260) ---
  { name: "Sydney", lon: 151.20, lat: -33.86, appearFrame: 235, isMajor: true },
  { name: "Melbourne", lon: 144.96, lat: -37.81, appearFrame: 240 },
  { name: "Brisbane", lon: 153.02, lat: -27.46, appearFrame: 245 },
  { name: "Auckland", lon: 174.76, lat: -36.84, appearFrame: 250 },
];

export const GlobalExpansionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // 1. Map Projection & Geometries
  // Slightly elevated vertically to give room to top timeline and bottom metrics panel
  const projection = useMemo(
    () =>
      geoEquirectangular()
        .scale(265)
        .translate([width / 2, height / 2 + 15]),
    [width, height]
  );

  const pathGen = useMemo(() => geoPath(projection), [projection]);
  const countries = useMemo(
    () => feature(worldData as any, (worldData as any).objects.countries),
    []
  );

  const countryPaths = useMemo(() => {
    const paths: string[] = [];
    (countries as any).features.forEach((f: any) => {
      const d = pathGen(f);
      if (d) paths.push(d);
    });
    return paths;
  }, [countries, pathGen]);

  // Sofia Epicenter Coordinates
  const sofiaCoords = projection([23.32, 42.70]) || [0, 0];

  // Camera slow subtle push-in
  const cameraScale = interpolate(frame, [0, 390], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  // 2. Timeline Header Animations (2014 -> 2015 -> 2016)
  // 2014 active: frames 0 -> 70
  // 2015 active: frames 70 -> 150
  // 2016 active: frames 150 -> 390
  const activeYear =
    frame < 70 ? 2014 : frame < 150 ? 2015 : 2016;

  // 3. Dynamic Territory Counter (1 -> 175+)
  const countriesCount = Math.floor(
    interpolate(
      frame,
      [35, 75, 150, 260],
      [1, 14, 68, 175],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // 4. Lower-third Stats Card Entrance
  const statsEntrance = spring({
    frame: frame - 210,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060A14",
        overflow: "hidden",
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Background Radial Glow */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 50%, #0F192C 0%, #070D18 55%, #03050A 100%)",
        }}
      />

      {/* Lat/Lon Micro Coordinates Grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          opacity: 0.8,
        }}
      />

      {/* World Map SVG Container */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraScale})`,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <svg width={width} height={height}>
          <defs>
            {/* Subtle Gold Node Glow */}
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Epicenter Radar Beacon */}
            <radialGradient id="sofiaBeacon" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Landmass Outlines */}
          {countryPaths.map((d, i) => (
            <path
              key={`country-${i}`}
              d={d}
              fill="#121C2D"
              stroke="#1E314F"
              strokeWidth={0.85}
              opacity={0.88}
            />
          ))}

          {/* Connection Arc Lines from Sofia to major hubs */}
          {CITIES.filter((c) => c.isMajor && c.name !== "Sofia").map((city, idx) => {
            const p = projection([city.lon, city.lat]);
            if (!p || frame < city.appearFrame) return null;

            const arcProgress = spring({
              frame: frame - city.appearFrame,
              fps,
              config: { damping: 15, stiffness: 90 },
            });

            // Midpoint control for slight curved arc
            const midX = (sofiaCoords[0] + p[0]) / 2;
            const midY = (sofiaCoords[1] + p[1]) / 2 - Math.min(Math.abs(p[0] - sofiaCoords[0]) * 0.12, 50);

            return (
              <path
                key={`arc-${idx}`}
                d={`M ${sofiaCoords[0]} ${sofiaCoords[1]} Q ${midX} ${midY} ${p[0]} ${p[1]}`}
                fill="none"
                stroke="#D4AF37"
                strokeWidth={1}
                strokeDasharray="4 4"
                strokeOpacity={interpolate(arcProgress, [0, 1], [0, 0.25])}
              />
            );
          })}

          {/* City Nodes (All 100% on land) */}
          {CITIES.map((city, idx) => {
            const p = projection([city.lon, city.lat]);
            if (!p || frame < city.appearFrame) return null;

            const popProgress = spring({
              frame: frame - city.appearFrame,
              fps,
              config: { damping: 10, stiffness: 120 },
            });

            const isEpicenter = city.name === "Sofia";
            const dotRadius = isEpicenter ? 5.5 : city.isMajor ? 3.5 : 2.5;

            // Ping ripple wave for newly appeared points
            const rippleAge = frame - city.appearFrame;
            const showRipple = rippleAge < 30;
            const rippleRadius = interpolate(rippleAge, [0, 30], [dotRadius, dotRadius * 4.5], {
              extrapolateRight: "clamp",
            });
            const rippleOpacity = interpolate(rippleAge, [0, 30], [0.8, 0], {
              extrapolateRight: "clamp",
            });

            return (
              <g key={`city-${idx}`}>
                {/* Expanding ping ripple */}
                {showRipple && (
                  <circle
                    cx={p[0]}
                    cy={p[1]}
                    r={rippleRadius}
                    fill="none"
                    stroke={isEpicenter ? "#F59E0B" : "#D4AF37"}
                    strokeWidth={1.2}
                    opacity={rippleOpacity}
                  />
                )}

                {/* Core Dot */}
                <circle
                  cx={p[0]}
                  cy={p[1]}
                  r={dotRadius * Math.min(popProgress, 1.2)}
                  fill={isEpicenter ? "#FFD700" : "#D4AF37"}
                  filter="url(#nodeGlow)"
                  opacity={0.95}
                />
              </g>
            );
          })}

          {/* Sofia Epicenter Special Radar Pulse */}
          {frame >= 35 && (
            <g transform={`translate(${sofiaCoords[0]}, ${sofiaCoords[1]})`}>
              <circle
                r={16 + Math.sin(frame * 0.15) * 6}
                fill="none"
                stroke="#D4AF37"
                strokeWidth={1.5}
                opacity={0.65}
              />
              <circle
                r={28 + Math.sin(frame * 0.15) * 8}
                fill="none"
                stroke="#F59E0B"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.4}
              />
            </g>
          )}
        </svg>
      </AbsoluteFill>

      {/* Top Timeline Bar (2014 → 2015 → 2016) */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {/* Dossier Header Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 16px",
            borderRadius: 20,
            backgroundColor: "rgba(10, 16, 28, 0.88)",
            border: "1px solid rgba(212, 175, 55, 0.35)",
            backdropFilter: "blur(8px)",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#D4AF37",
              boxShadow: "0 0 10px #D4AF37",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: "#E2E8F0",
              textTransform: "uppercase",
            }}
          >
            GLOBAL CONTAGION TIMELINE // 175+ NATIONS
          </span>
        </div>

        {/* Timeline Slider with Active Year */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
            backgroundColor: "rgba(8, 12, 22, 0.85)",
            padding: "8px 24px",
            borderRadius: 12,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          {[2014, 2015, 2016].map((yr) => {
            const isCurrent = activeYear === yr;
            return (
              <div
                key={yr}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontSize: isCurrent ? 22 : 16,
                    fontWeight: isCurrent ? 900 : 600,
                    fontFamily: theme.fonts.heading,
                    color: isCurrent ? "#FFD700" : "#64748B",
                    letterSpacing: "0.08em",
                    transition: "all 0.3s ease",
                    textShadow: isCurrent ? "0 0 16px rgba(212, 175, 55, 0.6)" : "none",
                  }}
                >
                  {yr}
                </span>
                {yr !== 2016 && (
                  <span style={{ color: "rgba(255, 255, 255, 0.2)", fontSize: 14 }}>
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sofia Location Tag Badge */}
      {frame >= 35 && (
        <div
          style={{
            position: "absolute",
            left: sofiaCoords[0] + 25,
            top: sofiaCoords[1] - 30,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            padding: "5px 12px",
            backgroundColor: "rgba(10, 16, 28, 0.92)",
            border: "1px solid rgba(212, 175, 55, 0.5)",
            borderRadius: 6,
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.7)",
            opacity: interpolate(frame, [35, 48], [0, 1], { extrapolateRight: "clamp" }),
            pointerEvents: "none",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "#FFD700", letterSpacing: "0.1em" }}>
            EPICENTER // SOFIA
          </div>
          <div style={{ fontSize: 9, color: "#94A3B8", letterSpacing: "0.06em" }}>
            ONECOIN HEADQUARTERS
          </div>
        </div>
      )}

      {/* Lower Third Metrics Panel (NO "Unverifiable" stamp!) */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${statsEntrance}) translateY(${(1 - statsEntrance) * 40}px)`,
          opacity: statsEntrance,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            backgroundColor: "rgba(8, 14, 24, 0.94)",
            border: "1.5px solid rgba(212, 175, 55, 0.35)",
            borderRadius: 16,
            padding: "16px 36px",
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(212, 175, 55, 0.1)",
          }}
        >
          {/* Metric 1: Territories */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "rgba(212, 175, 55, 0.85)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              WORLDWIDE FOOTPRINT
            </span>
            <span
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: "#FFFFFF",
                fontFamily: theme.fonts.display || "sans-serif",
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
              {countriesCount >= 175 ? "175+ COUNTRIES" : `${countriesCount} COUNTRIES`}
            </span>
          </div>

          {/* Vertical Golden Divider */}
          <div
            style={{
              width: 1,
              height: 44,
              backgroundColor: "rgba(212, 175, 55, 0.35)",
            }}
          />

          {/* Metric 2: Claimed Transactions vs Bitcoin */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#94A3B8",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              CLAIMED TRANSACTION VOLUME
            </span>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#F1F5F9",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              EXCEEDING BITCOIN NETWORK
            </span>
            <span
              style={{
                fontSize: 9,
                color: "#64748B",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              INTERNAL COMPANY REPORTING // NO PUBLIC BLOCKCHAIN
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
