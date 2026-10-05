import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { theme } from "../theme";

type SqlTableProps = {
  startFrame?: number;
  // Optional background image (e.g. screenshot of a real terminal/server)
  backgroundImage?: string;
};

type Row = {
  userId: string;
  coins: string;
  status: string;
  // Whether this row gets "modified" by the cursor (status changes)
  modified?: boolean;
};

const rows: Row[] = [
  { userId: "10482", coins: "45,000", status: "ACTIVE", modified: true },
  { userId: "10483", coins: "92,000", status: "ACTIVE" },
  { userId: "10484", coins: "12,500", status: "ACTIVE", modified: true },
  { userId: "10485", coins: "150,000", status: "ACTIVE" },
  { userId: "10486", coins: "8,750", status: "ACTIVE", modified: true },
  { userId: "10487", coins: "67,000", status: "ACTIVE" },
  { userId: "10488", coins: "210,000", status: "ACTIVE" },
  { userId: "10489", coins: "33,000", status: "ACTIVE", modified: true },
];

export const SqlTable: React.FC<SqlTableProps> = ({
  startFrame = 15,
  backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Terminal window fade in
  const terminalOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const terminalY = spring({ frame: frame - startFrame, fps, config: { damping: 15 }, from: 30, to: 0 });

  // Title bar
  const titleOpacity = interpolate(frame, [startFrame + 5, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SQL query appears
  const queryOpacity = interpolate(frame, [startFrame + 15, startFrame + 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Table header appears
  const headerOpacity = interpolate(frame, [startFrame + 25, startFrame + 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Rows appear progressively
  const rowProgress = interpolate(frame, [startFrame + 35, startFrame + 75], [0, rows.length], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const visibleRows = Math.floor(rowProgress);

  // Cursor moves down through rows
  const cursorRow = Math.min(
    Math.floor(interpolate(frame, [startFrame + 40, startFrame + 90], [0, rows.length - 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })),
    rows.length - 1
  );

  // Cursor blink
  const cursorBlink = Math.floor((frame - startFrame) / 15) % 2 === 0;

  // Modification happens: when cursor is on a modified row, the status changes to "MANUAL"
  const modifiedRows = rows.map((row, i) => {
    if (!row.modified) return row;
    const modFrame = startFrame + 40 + i * (50 / rows.length);
    const isModified = frame > modFrame + 5;
    return {
      ...row,
      status: isModified ? "MANUAL" : row.status,
      modFlash: isModified
        ? interpolate(frame, [modFrame + 5, modFrame + 15], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : 0,
    };
  });

  // Warning text at the bottom
  const warningOpacity = interpolate(frame, [startFrame + 90, startFrame + 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tableStartX = 80;
  const tableStartY = 280;
  const rowHeight = 42;
  const colWidths = [200, 180, 160];
  const colLabels = ["USER_ID", "COINS", "STATUS"];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.bg,
        position: "relative",
        fontFamily: theme.fonts.mono,
        overflow: "hidden",
      }}
    >
      {/* Background image */}
      {backgroundImage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15,
            filter: "blur(8px)",
          }}
        />
      )}

      {/* Terminal window */}
      <div
        style={{
          position: "absolute",
          top: 80 + terminalY,
          left: 120,
          width: width - 240,
          height: height - 160,
          backgroundColor: "#0D1117",
          borderRadius: 12,
          border: `1px solid ${theme.colors.grayDim}`,
          opacity: terminalOpacity,
          overflow: "hidden",
          boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 20px",
            backgroundColor: "#161B22",
            borderBottom: `1px solid ${theme.colors.grayDim}`,
            opacity: titleOpacity,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FF5F56" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#FFBD2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#27C93F" }} />
          </div>
          <div
            style={{
              marginLeft: 20,
              fontSize: 14,
              color: theme.colors.gray,
              fontFamily: theme.fonts.mono,
            }}
          >
            onecoin_db — mysql terminal
          </div>
        </div>

        {/* Terminal content */}
        <div style={{ padding: "24px 30px", color: "#C9D1D9", fontSize: 18 }}>
          {/* SQL query */}
          <div style={{ opacity: queryOpacity, marginBottom: 20 }}>
            <div style={{ color: theme.colors.gray }}>
              mysql&gt; <span style={{ color: theme.colors.white }}>SELECT user_id, coins, status FROM accounts;</span>
            </div>
            <div style={{ color: theme.colors.green, marginTop: 8 }}>
              {rows.length} rows in set (0.01 sec)
            </div>
          </div>

          {/* Table header */}
          <div
            style={{
              display: "flex",
              opacity: headerOpacity,
              borderBottom: `2px solid ${theme.colors.grayDim}`,
              paddingBottom: 8,
              marginBottom: 4,
            }}
          >
            {colLabels.map((label, i) => (
              <div
                key={label}
                style={{
                  width: colWidths[i],
                  fontSize: 14,
                  color: theme.colors.gold,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Table rows */}
          {modifiedRows.slice(0, visibleRows).map((row, i) => {
            const isCursorRow = i === cursorRow && cursorBlink;
            const isModifiedRow = (row as any).modFlash > 0;
            return (
              <div
                key={`row-${i}`}
                style={{
                  display: "flex",
                  height: rowHeight,
                  alignItems: "center",
                  backgroundColor: isCursorRow ? "rgba(74, 158, 255, 0.15)" : "transparent",
                  borderLeft: isCursorRow ? `3px solid ${theme.colors.blue}` : "3px solid transparent",
                }}
              >
                <div style={{ width: colWidths[0], fontSize: 16, color: "#C9D1D9" }}>
                  {row.userId}
                </div>
                <div style={{ width: colWidths[1], fontSize: 16, color: "#C9D1D9" }}>
                  {row.coins}
                </div>
                <div
                  style={{
                    width: colWidths[2],
                    fontSize: 16,
                    color: row.status === "MANUAL" ? theme.colors.red : theme.colors.green,
                    fontWeight: row.status === "MANUAL" ? "bold" : "normal",
                    textShadow: isModifiedRow ? `0 0 ${(row as any).modFlash * 20}px ${theme.colors.red}` : "none",
                  }}
                >
                  {row.status}
                  {isModifiedRow && (row as any).modFlash > 0.5 ? " ⚠" : ""}
                </div>
              </div>
            );
          })}

          {/* Cursor line */}
          {visibleRows >= rows.length && (
            <div style={{ marginTop: 16, color: theme.colors.gray, fontSize: 16, opacity: warningOpacity }}>
              mysql&gt; <span style={{ color: theme.colors.red }}>-- WARNING: 4 rows modified outside transaction log</span>
              {cursorBlink && <span style={{ color: theme.colors.white }}>█</span>}
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 0,
          width: "100%",
          textAlign: "center",
          opacity: warningOpacity,
          color: theme.colors.gray,
          fontSize: 20,
          fontFamily: theme.fonts.body,
          letterSpacing: 1,
        }}
      >
        No blockchain. Just a database anyone could edit.
      </div>
    </div>
  );
};
