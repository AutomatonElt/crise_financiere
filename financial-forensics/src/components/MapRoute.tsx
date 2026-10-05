import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { geoEquirectangular, geoPath, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import { theme } from "../theme";
import worldData from "world-atlas/countries-110m.json";

type MapRouteProps = {
  mode?: "route" | "points";
  title?: string;
  subtitle?: string;
  // Route mode: list of waypoints with label + lat/lon
  waypoints?: { label: string; lat: number; lon: number }[];
  // Points mode: list of points with lat/lon
  points?: { lat: number; lon: number }[];
  // Points mode: generate random points within given regions
  pointCount?: number;
  pointRegions?: { latMin: number; latMax: number; lonMin: number; lonMax: number; weight: number }[];
  startFrame?: number;
  // Zoom level for close-up phases (higher = more zoomed in)
  zoomScale?: number;
  // Restrict initial view to a geographic region instead of full world
  focusBounds?: { latMin: number; latMax: number; lonMin: number; lonMax: number };
};

// Full world viewBox
const FULL_VIEWBOX = { x: 0, y: 0, w: 1200, h: 500 };

// Convert TopoJSON to GeoJSON features
const countries = feature(worldData as any, (worldData as any).objects.countries);

// Create projection (equirectangular, fitted to viewBox 0 0 1200 500)
const projection = geoEquirectangular()
  .scale(190)
  .translate([600, 250]);

const pathGen = geoPath(projection);

// Precompute country path strings
const countryPaths: string[] = [];
(countries as any).features.forEach((f: any) => {
  const d = pathGen(f);
  if (d) countryPaths.push(d);
});

// Graticule (lat/lon grid lines)
function geoGraticule10() {
  const lines: any[] = [];
  for (let lon = -180; lon <= 180; lon += 30) {
    const coords: [number, number][] = [];
    for (let lat = -80; lat <= 80; lat += 2) {
      coords.push([lon, lat]);
    }
    lines.push({ type: "LineString", coordinates: coords });
  }
  for (let lat = -80; lat <= 80; lat += 20) {
    const coords: [number, number][] = [];
    for (let lon = -180; lon <= 180; lon += 2) {
      coords.push([lon, lat]);
    }
    lines.push({ type: "LineString", coordinates: coords });
  }
  return { type: "GeometryCollection", geometries: lines };
}

const graticule = geoGraticule10();
const graticulePath = pathGen(graticule as any) ?? "";

// Project lat/lon to SVG x/y
const project = (lat: number, lon: number): { x: number; y: number } => {
  const p = projection([lon, lat]);
  if (!p) return { x: 0, y: 0 };
  return { x: p[0], y: p[1] };
};

// Check if a lat/lon point falls on any country (land)
const isOnLand = (lat: number, lon: number): boolean => {
  return (countries as any).features.some((f: any) =>
    geoContains(f, [lon, lat])
  );
};

// Generate pseudo-random points within regions, filtered to land only
const generateGeoPoints = (
  count: number,
  regions: { latMin: number; latMax: number; lonMin: number; lonMax: number; weight: number }[]
) => {
  const points: { lat: number; lon: number }[] = [];
  let seed = 42;
  let attempts = 0;
  const maxAttempts = count * 20;
  while (points.length < count && attempts < maxAttempts) {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280;
    let cumulative = 0;
    for (const region of regions) {
      cumulative += region.weight;
      if (r <= cumulative) {
        seed = (seed * 9301 + 49297) % 233280;
        const r2 = seed / 233280;
        seed = (seed * 9301 + 49297) % 233280;
        const r3 = seed / 233280;
        const lat = region.latMin + r2 * (region.latMax - region.latMin);
        const lon = region.lonMin + r3 * (region.lonMax - region.lonMin);
        if (isOnLand(lat, lon)) {
          points.push({ lat, lon });
        }
        break;
      }
    }
    attempts++;
  }
  return points;
};

// Default regions covering populated areas worldwide
const defaultRegions = [
  { latMin: 25, latMax: 70, lonMin: -10, lonMax: 40, weight: 0.20 },
  { latMin: -35, latMax: 35, lonMin: -20, lonMax: 55, weight: 0.25 },
  { latMin: 5, latMax: 70, lonMin: 40, lonMax: 145, weight: 0.25 },
  { latMin: -45, latMax: -10, lonMin: 110, lonMax: 155, weight: 0.05 },
  { latMin: 15, latMax: 70, lonMin: -170, lonMax: -50, weight: 0.15 },
  { latMin: -55, latMax: 12, lonMin: -85, lonMax: -35, weight: 0.10 },
];

export const MapRoute: React.FC<MapRouteProps> = ({
  mode = "route",
  title,
  subtitle,
  waypoints = [],
  points: customPoints,
  pointCount = 175,
  pointRegions = defaultRegions,
  startFrame = 15,
  zoomScale = 3.5,
  focusBounds,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = spring({ frame, fps, config: { damping: 15 }, from: -30, to: 0 });

  // Map fade in
  const mapOpacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SVG viewBox: 0 0 1200 500
  const mapSvgWidth = 1200;
  const mapSvgHeight = 500;
  const mapRenderWidth = width * 0.88;
  const mapRenderHeight = (mapRenderWidth * mapSvgHeight) / mapSvgWidth;
  const mapX = (width - mapRenderWidth) / 2;
  const mapY = title ? 210 : 140;

  // === ZOOM PHASES ===
  // After route/points are drawn, zoom into each waypoint region sequentially
  const routeDrawEnd = startFrame + 30 + Math.max(waypoints.length - 1, 0) * 20 + 18;
  const pointsEnd = startFrame + 120;
  const contentEnd = mode === "route" ? routeDrawEnd : pointsEnd;

  // Zoom targets: each waypoint for route mode, or dense point regions for points mode
  const zoomTargets: { lat: number; lon: number; label: string }[] =
    mode === "route"
      ? waypoints.map((wp) => ({ lat: wp.lat, lon: wp.lon, label: wp.label }))
      : [
          { lat: 50, lon: 10, label: "Europe" },
          { lat: 0, lon: 20, label: "Africa" },
          { lat: 30, lon: 100, label: "Asia" },
        ];

  // Zoom timeline: each target gets ~25 frames, with 10-frame transitions
  const zoomStart = contentEnd + 10;
  const zoomPerTarget = 25;
  const zoomTransition = 10;
  const zoomTotalDuration = zoomTargets.length * (zoomPerTarget + zoomTransition);
  const zoomEnd = zoomStart + zoomTotalDuration;

  // Compute base viewBox from focusBounds or default to full world
  const baseViewBox = focusBounds
    ? (() => {
        const tl = project(focusBounds.latMax, focusBounds.lonMin);
        const br = project(focusBounds.latMin, focusBounds.lonMax);
        const w = br.x - tl.x;
        const h = br.y - tl.y;
        const pad = 40;
        return {
          x: tl.x - pad,
          y: tl.y - pad,
          w: w + pad * 2,
          h: h + pad * 2,
        };
      })()
    : { ...FULL_VIEWBOX };

  // Compute current zoom viewBox
  let currentViewBox = { ...baseViewBox };

  if (frame >= zoomStart && frame <= zoomEnd) {
    const zoomElapsed = frame - zoomStart;
    const targetIndex = Math.min(
      Math.floor(zoomElapsed / (zoomPerTarget + zoomTransition)),
      zoomTargets.length - 1
    );
    const targetElapsed = zoomElapsed - targetIndex * (zoomPerTarget + zoomTransition);

    const target = zoomTargets[targetIndex];
    const targetScreen = project(target.lat, target.lon);

    // Zoomed viewBox centered on target
    const zoomedW = mapSvgWidth / zoomScale;
    const zoomedH = mapSvgHeight / zoomScale;
    const zoomedVB = {
      x: targetScreen.x - zoomedW / 2,
      y: targetScreen.y - zoomedH / 2,
      w: zoomedW,
      h: zoomedH,
    };

    if (targetElapsed < zoomTransition) {
      // Zooming in
      const t = interpolate(targetElapsed, [0, zoomTransition], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      const prevVB = targetIndex === 0 ? baseViewBox : (() => {
        const prevTarget = zoomTargets[targetIndex - 1];
        const prevScreen = project(prevTarget.lat, prevTarget.lon);
        return {
          x: prevScreen.x - zoomedW / 2,
          y: prevScreen.y - zoomedH / 2,
          w: zoomedW,
          h: zoomedH,
        };
      })();
      currentViewBox = {
        x: interpolate(t, [0, 1], [prevVB.x, zoomedVB.x]),
        y: interpolate(t, [0, 1], [prevVB.y, zoomedVB.y]),
        w: interpolate(t, [0, 1], [prevVB.w, zoomedVB.w]),
        h: interpolate(t, [0, 1], [prevVB.h, zoomedVB.h]),
      };
    } else if (targetElapsed < zoomTransition + zoomPerTarget) {
      // Holding on target
      currentViewBox = zoomedVB;
    } else {
      // Zooming out (only after last target)
      if (targetIndex === zoomTargets.length - 1) {
        const t = interpolate(
          targetElapsed - zoomTransition - zoomPerTarget,
          [0, zoomTransition],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) }
        );
        currentViewBox = {
          x: interpolate(t, [0, 1], [zoomedVB.x, baseViewBox.x]),
          y: interpolate(t, [0, 1], [zoomedVB.y, baseViewBox.y]),
          w: interpolate(t, [0, 1], [zoomedVB.w, baseViewBox.w]),
          h: interpolate(t, [0, 1], [zoomedVB.h, baseViewBox.h]),
        };
      } else {
        currentViewBox = zoomedVB;
      }
    }
  } else if (frame > zoomEnd) {
    currentViewBox = { ...baseViewBox };
  }

  // Zoom label badge (shows during zoom phases)
  const zoomLabelOpacity =
    frame >= zoomStart + zoomTransition && frame <= zoomEnd
      ? interpolate(
          frame,
          [zoomStart + zoomTransition, zoomStart + zoomTransition + 5, zoomEnd - 5, zoomEnd],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        )
      : 0;

  const currentZoomTarget =
    frame >= zoomStart && frame <= zoomEnd
      ? zoomTargets[Math.min(
          Math.floor((frame - zoomStart) / (zoomPerTarget + zoomTransition)),
          zoomTargets.length - 1
        )]
      : null;

  // Route mode: draw lines between waypoints
  const routeProgress = (segment: number) => {
    const segStart = startFrame + 30 + segment * 20;
    return interpolate(frame, [segStart, segStart + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
  };

  // Waypoint markers appear
  const waypointAppear = (i: number) => {
    const appearFrame = startFrame + 30 + i * 20;
    const opacity = interpolate(frame, [appearFrame, appearFrame + 10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const scale = spring({
      frame: frame - appearFrame,
      fps,
      config: { damping: 10 },
      from: 0,
      to: 1,
    });
    return { opacity, scale };
  };

  // Points mode: dots appear progressively
  const allPoints = customPoints ?? generateGeoPoints(pointCount, pointRegions);
  const pointsProgress = interpolate(frame, [startFrame + 20, startFrame + 120], [0, allPoints.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visiblePoints = Math.floor(pointsProgress);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.bg,
        position: "relative",
        fontFamily: theme.fonts.body,
      }}
    >
      {/* Title */}
      {title && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <div
            style={{
              fontSize: theme.sizes.titleMedium,
              fontWeight: "bold",
              color: theme.colors.white,
              fontFamily: theme.fonts.heading,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: theme.sizes.bodySmall,
                color: theme.colors.gray,
                marginTop: 12,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Map */}
      <svg
        width={mapRenderWidth}
        height={mapRenderHeight}
        viewBox={`${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`}
        style={{
          position: "absolute",
          left: mapX,
          top: mapY,
          opacity: mapOpacity,
        }}
      >
        <defs>
          <filter id="mapGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="wpGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ocean background */}
        <rect x={0} y={0} width={mapSvgWidth} height={mapSvgHeight} fill={theme.colors.bgAlt} rx={12} />

        {/* Graticule (lat/lon grid) */}
        <path d={graticulePath} fill="none" stroke={theme.colors.gridLine} strokeWidth={0.5} opacity={0.4} />

        {/* Real country shapes */}
        {countryPaths.map((d, i) => (
          <path
            key={`country-${i}`}
            d={d}
            fill={theme.colors.surface}
            stroke={theme.colors.grayDim}
            strokeWidth={0.5}
            opacity={0.85}
          />
        ))}

        {/* Points mode: dots */}
        {mode === "points" &&
          allPoints.slice(0, visiblePoints).map((pt, i) => {
            const { x, y } = project(pt.lat, pt.lon);
            return (
              <circle
                key={`pt-${i}`}
                cx={x}
                cy={y}
                r={2}
                fill={theme.colors.gold}
                opacity={0.7}
              />
            );
          })}

        {/* Points mode: counter */}
        {mode === "points" && visiblePoints > 0 && (
          <text
            x={mapSvgWidth / 2}
            y={mapSvgHeight + 50}
            textAnchor="middle"
            fill={theme.colors.gold}
            fontSize={32}
            fontFamily={theme.fonts.heading}
            fontWeight="bold"
          >
            {visiblePoints} countries
          </text>
        )}

        {/* Route mode: dashed lines between waypoints */}
        {mode === "route" &&
          waypoints.length > 1 &&
          waypoints.slice(0, -1).map((wp, i) => {
            const next = waypoints[i + 1];
            const p1 = project(wp.lat, wp.lon);
            const p2 = project(next.lat, next.lon);
            const p = routeProgress(i);
            const endX = p1.x + (p2.x - p1.x) * p;
            const endY = p1.y + (p2.y - p1.y) * p;
            return (
              <line
                key={`route-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={endX}
                y2={endY}
                stroke={theme.colors.gold}
                strokeWidth={3}
                strokeDasharray="8 4"
                filter="url(#mapGlow)"
              />
            );
          })}

        {/* Route mode: waypoint markers */}
        {mode === "route" &&
          waypoints.map((wp, i) => {
            const { opacity, scale } = waypointAppear(i);
            const { x, y } = project(wp.lat, wp.lon);
            return (
              <g key={`wp-${i}`} opacity={opacity} transform={`translate(${x}, ${y}) scale(${scale})`}>
                {/* Pulse ring */}
                <circle r={8} fill="none" stroke={theme.colors.gold} strokeWidth={1} opacity={0.3}>
                  <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
                {/* Marker */}
                <circle r={4} fill={theme.colors.goldDim} stroke={theme.colors.gold} strokeWidth={1.5} filter="url(#wpGlow)" />
                <circle r={2} fill={theme.colors.gold} />
                {/* Label */}
                <text
                  x={0}
                  y={-12}
                  textAnchor="middle"
                  fill={theme.colors.white}
                  fontSize={11}
                  fontFamily={theme.fonts.body}
                  fontWeight="bold"
                >
                  {wp.label}
                </text>
              </g>
            );
          })}
      </svg>

      {/* Zoom label badge */}
      {currentZoomTarget && zoomLabelOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            width: "100%",
            textAlign: "center",
            opacity: zoomLabelOpacity,
          }}
        >
          <div
            style={{
              display: "inline-block",
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.gold}`,
              borderRadius: 8,
              padding: "10px 24px",
              color: theme.colors.gold,
              fontSize: theme.sizes.label,
              fontFamily: theme.fonts.mono,
              fontWeight: "bold",
              letterSpacing: 2,
            }}
          >
            {currentZoomTarget.label}
          </div>
        </div>
      )}
    </div>
  );
};
