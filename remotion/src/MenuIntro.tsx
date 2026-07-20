import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const colors = {
  bg: "#02060a",
  panel: "#07131f",
  cyan: "#14d9f4",
  green: "#65f05b",
  magenta: "#ff4aa2",
  amber: "#ffc429",
  text: "#f5fbff",
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

const Tile = ({
  x,
  y,
  color,
  delay,
  size = 48,
}: {
  x: number;
  y: number;
  color: string;
  delay: number;
  size?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = interpolate(frame, [delay * fps, delay * fps + 0.42 * fps], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: 4,
        background: color,
        boxShadow: `0 0 ${24 * appear}px ${color}`,
        opacity: appear,
        transform: `translateY(${(1 - appear) * -90}px) scale(${0.7 + appear * 0.3})`,
      }}
    />
  );
};

const RailLine = ({ top, color, delay }: { top: number; color: string; delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(frame, [delay * fps, delay * fps + 1.1 * fps], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top,
        height: 2,
        width: `${draw * 100}%`,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.7,
      }}
    />
  );
};

export const MenuIntro = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isPortrait = height > width;
  const menuTop = isPortrait ? 88 : 72;
  const menuLeft = isPortrait ? 44 : 72;
  const iconSize = isPortrait ? 56 : 58;
  const titleLeft = isPortrait ? 76 : 118;
  const titleTop = isPortrait ? 320 : 218;
  const titleSize = isPortrait ? 132 : 138;
  const handsSize = isPortrait ? 82 : 86;
  const buttonWidth = isPortrait ? 500 : 520;
  const buttonHeight = isPortrait ? 82 : 74;
  const buttonGap = isPortrait ? 24 : 20;
  const boardWidth = isPortrait ? 610 : 520;
  const boardHeight = isPortrait ? 880 : 820;
  const boardRight = isPortrait ? 74 : 232;
  const boardTop = isPortrait ? 780 : 164;
  const tileSize = isPortrait ? 58 : 48;
  const tileGap = isPortrait ? 74 : 64;
  const tileLeft = isPortrait ? 72 : 52;
  const tileTop = isPortrait ? 172 : 84;
  const sideRailRight = isPortrait ? 34 : 94;
  const sideRailTop = isPortrait ? 820 : 218;
  const sideRailWidth = isPortrait ? 52 : 48;
  const sideRailHeight = isPortrait ? 760 : 640;
  const bottomInset = isPortrait ? 70 : 72;

  const open = interpolate(frame, [0, 1.05 * fps], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(frame, [1.1 * fps, 2.4 * fps, 3.6 * fps], [0.25, 1, 0.42], {
    easing: easeInOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boardSlide = interpolate(frame, [0.45 * fps, 1.45 * fps], [180, 0], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleReveal = interpolate(frame, [0.2 * fps, 1.25 * fps], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tiles = [
    [0, 5, colors.amber, 0.52],
    [1, 5, colors.amber, 0.58],
    [2, 5, colors.magenta, 0.64],
    [3, 5, colors.green, 0.7],
    [4, 5, colors.green, 0.76],
    [1, 4, colors.amber, 0.86],
    [2, 4, colors.magenta, 0.94],
    [3, 4, colors.magenta, 1.02],
    [4, 4, colors.green, 1.1],
    [2, 3, colors.cyan, 1.18],
    [2, 2, colors.cyan, 1.26],
    [2, 1, colors.cyan, 1.34],
    [5, 5, colors.cyan, 1.42],
  ];

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 18% 18%, rgba(20,217,244,0.25), transparent 28%), radial-gradient(circle at 78% 42%, rgba(255,74,162,0.18), transparent 30%), #02060a",
        color: colors.text,
        fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.26,
          backgroundImage:
            "linear-gradient(rgba(117,247,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(117,247,255,0.12) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          transform: `translateY(${frame * 0.45}px)`,
        }}
      />

      <RailLine top={isPortrait ? 150 : 92} color={colors.cyan} delay={0.1} />
      <RailLine top={isPortrait ? 1750 : 984} color={colors.magenta} delay={0.32} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `2px solid rgba(117,247,255,${0.22 + glow * 0.36})`,
          borderRadius: 0,
          background: "linear-gradient(145deg, rgba(8,18,29,0.72), rgba(4,10,16,0.58))",
          boxShadow: `0 0 ${70 * glow}px rgba(20,217,244,0.22), inset 0 0 90px rgba(0,0,0,0.72)`,
          opacity: open,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: menuLeft,
          top: menuTop,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: 2,
          opacity: titleReveal,
          fontFamily: "Cascadia Mono, Consolas, monospace",
        }}
      >
        <span style={{ color: colors.cyan }}>01</span>
        <span>MENU</span>
      </div>

      <div
        style={{
          position: "absolute",
          right: isPortrait ? 42 : 72,
          top: isPortrait ? 72 : 58,
          display: "flex",
          gap: isPortrait ? 12 : 18,
          opacity: titleReveal,
        }}
      >
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            style={{
              width: iconSize,
              height: iconSize,
              border: "2px solid rgba(245,251,255,0.34)",
              borderRadius: 8,
              background: "rgba(2,6,10,0.65)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          background:
            "linear-gradient(rgba(117,247,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(117,247,255,0.16) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: titleLeft,
          top: titleTop,
          opacity: titleReveal,
          transform: `translateX(${(1 - titleReveal) * -90}px)`,
        }}
      >
        <div
          style={{
            fontSize: titleSize,
            lineHeight: 0.92,
            fontWeight: 950,
            letterSpacing: 10,
            textShadow: `0 0 ${30 * glow}px rgba(20,217,244,0.4)`,
          }}
        >
          TETRIS
        </div>
        <div
          style={{
            fontSize: handsSize,
            lineHeight: 1,
            fontWeight: 950,
            letterSpacing: 13,
            color: colors.green,
            textShadow: `0 0 ${26 * glow}px rgba(101,240,91,0.5)`,
          }}
        >
          HANDS
        </div>
        <div
          style={{
            marginTop: 42,
            display: "grid",
            gap: buttonGap,
            width: buttonWidth,
          }}
        >
          {["SINGLE PLAYER", "MULTIPLAYER", "HOW TO PLAY"].map((label, index) => (
            <div
              key={label}
              style={{
                height: buttonHeight,
                display: "flex",
                alignItems: "center",
                paddingLeft: 34,
                border: `2px solid ${index === 0 ? colors.cyan : index === 1 ? colors.magenta : colors.amber}`,
                borderRadius: 8,
                background: "rgba(2,7,11,0.74)",
                color: colors.text,
                fontSize: 25,
                fontWeight: 850,
                letterSpacing: 4,
                opacity: interpolate(frame, [(0.8 + index * 0.15) * fps, (1.2 + index * 0.15) * fps], [0, 1], {
                  easing: easeOut,
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: boardRight,
          top: boardTop,
          width: boardWidth,
          height: boardHeight,
          border: `2px solid rgba(117,247,255,${0.32 + glow * 0.32})`,
          background:
            "linear-gradient(rgba(117,247,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(117,247,255,0.12) 1px, transparent 1px), rgba(0,0,0,0.24)",
          backgroundSize: "43px 36px",
          transform: `translateX(${boardSlide}px)`,
          opacity: open,
        }}
      >
        {tiles.map(([x, y, color, delay]) => (
          <Tile
            key={`${x}-${y}`}
            x={tileLeft + Number(x) * tileGap}
            y={tileTop + Number(y) * tileGap}
            color={String(color)}
            delay={Number(delay)}
            size={tileSize}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          right: sideRailRight,
          top: sideRailTop,
          width: sideRailWidth,
          height: sideRailHeight,
          display: "grid",
          gridTemplateRows: "repeat(5, 1fr)",
          gap: 18,
          opacity: interpolate(frame, [1.1 * fps, 2 * fps], [0, 1], {
            easing: easeOut,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {[colors.amber, colors.green, colors.magenta, colors.amber, colors.cyan].map((color) => (
          <div
            key={color}
            style={{
              border: `2px solid ${color}`,
              boxShadow: `0 0 18px ${color}`,
              borderRadius: 4,
              background: color,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: isPortrait ? 44 : 72,
          bottom: bottomInset,
          padding: "15px 22px",
          border: `2px solid rgba(101,240,91,${0.48 + glow * 0.3})`,
          borderRadius: 8,
          color: colors.green,
          fontSize: 18,
          fontWeight: 850,
          letterSpacing: 3,
          background: "rgba(2,7,11,0.72)",
          opacity: interpolate(frame, [1.35 * fps, 2.15 * fps], [0, 1], {
            easing: easeOut,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        CAMERA READY
      </div>

      <div
        style={{
          position: "absolute",
          right: isPortrait ? 34 : 72,
          bottom: bottomInset,
          padding: "15px 22px",
          border: "2px solid rgba(147,163,173,0.35)",
          borderRadius: 8,
          color: "rgba(245,251,255,0.78)",
          fontSize: 18,
          fontWeight: 850,
          letterSpacing: 3,
          background: "rgba(2,7,11,0.72)",
          opacity: interpolate(frame, [1.35 * fps, 2.15 * fps], [0, 1], {
            easing: easeOut,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        KEYBOARD MODE
      </div>
    </AbsoluteFill>
  );
};
