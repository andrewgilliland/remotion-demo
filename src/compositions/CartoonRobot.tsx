import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const CartoonRobot = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2 + 30;

  // ── Animations ─────────────────────────────────────────────────────────────

  // Bounce in from below
  const entryY = spring({
    fps,
    frame,
    config: { damping: 14, stiffness: 70, mass: 1.2 },
    from: 500,
    to: 0,
  });

  // Idle bob
  const bob = Math.sin(frame * 0.07) * 7;

  // Arm swing (left/right out of phase)
  const swingAngle = Math.sin(frame * 0.09) * 17;
  const leftArmAngle = -swingAngle;

  // Right arm: swing normally, then raise & wave after frame 210
  const rightArmAngle =
    frame < 210
      ? swingAngle
      : frame < 235
        ? interpolate(frame, [210, 235], [swingAngle, -65], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : -65 + Math.sin((frame - 235) * 0.28) * 16;

  // Antenna wobble
  const antennaAngle = Math.sin(frame * 0.13) * 10;

  // Eye blink every 100 frames
  const blinkCycle = frame % 100;
  const eyeH =
    blinkCycle < 84
      ? 44
      : blinkCycle < 89
        ? interpolate(blinkCycle, [84, 89], [44, 2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        : interpolate(blinkCycle, [89, 95], [2, 44], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

  // LED blinking
  const led1 = Math.floor(frame / 18) % 2 === 0;
  const led2 = Math.floor(frame / 23) % 2 === 0;
  const led3 = Math.floor((frame + 11) / 17) % 2 === 0;

  // Antenna glow pulse
  const antennaGlow = 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.11));

  // Mouth open/close
  const mouthH = 10 + Math.abs(Math.sin(frame * 0.19)) * 16;

  const totalY = entryY + bob;

  // Eye center Y (relative to robot origin)
  const eyeCenterY = -63;

  return (
    <div
      style={{
        width,
        height,
        background:
          "linear-gradient(180deg, #050510 0%, #120824 50%, #050510 100%)",
        overflow: "hidden",
      }}
    >
      <svg width={width} height={height}>
        <defs>
          <radialGradient id="rbt-body" cx="30%" cy="20%" r="90%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#2d3f52" />
          </radialGradient>
          <radialGradient id="rbt-eye" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>
          <filter id="rbt-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rbt-glow-sm" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background stars */}
        {Array.from({ length: 45 }).map((_, i) => {
          const sx = (Math.sin(i * 1.437) * 0.5 + 0.5) * width;
          const sy = (Math.sin(i * 0.973) * 0.5 + 0.5) * height * 0.88;
          const twinkle =
            0.2 + 0.7 * Math.abs(Math.sin(frame * 0.04 + i * 0.8));
          return (
            <circle
              key={i}
              cx={sx}
              cy={sy}
              r={1.5}
              fill="white"
              opacity={twinkle * 0.55}
            />
          );
        })}

        {/* Floor glow */}
        <ellipse
          cx={cx}
          cy={cy + 222}
          rx={140}
          ry={22}
          fill="rgba(99,102,241,0.18)"
        />

        <g transform={`translate(${cx}, ${cy + totalY})`}>
          {/* Shadow on floor */}
          <ellipse cx={0} cy={220} rx={82} ry={11} fill="rgba(0,0,0,0.45)" />

          {/* ── LEGS ──────────────────────────────────────────────────── */}
          <rect
            x={-78}
            y={140}
            width={52}
            height={78}
            rx={14}
            fill="url(#rbt-body)"
          />
          <rect
            x={26}
            y={140}
            width={52}
            height={78}
            rx={14}
            fill="url(#rbt-body)"
          />

          {/* Knee joint rings */}
          <circle cx={-52} cy={160} r={8} fill="#1e293b" />
          <circle cx={-52} cy={160} r={4} fill="#475569" />
          <circle cx={52} cy={160} r={8} fill="#1e293b" />
          <circle cx={52} cy={160} r={4} fill="#475569" />

          {/* Feet */}
          <rect x={-86} y={205} width={68} height={22} rx={11} fill="#1e293b" />
          <rect x={18} y={205} width={68} height={22} rx={11} fill="#1e293b" />

          {/* ── BODY ─────────────────────────────────────────────────── */}
          <rect
            x={-92}
            y={26}
            width={184}
            height={126}
            rx={20}
            fill="url(#rbt-body)"
          />

          {/* Chest panel recess */}
          <rect x={-70} y={42} width={140} height={96} rx={12} fill="#1a2535" />

          {/* 3 LED buttons */}
          <circle
            cx={-36}
            cy={72}
            r={9}
            fill={led1 ? "#f87171" : "#7f1d1d"}
            filter={led1 ? "url(#rbt-glow-sm)" : "none"}
          />
          <circle
            cx={0}
            cy={72}
            r={9}
            fill={led2 ? "#4ade80" : "#14532d"}
            filter={led2 ? "url(#rbt-glow-sm)" : "none"}
          />
          <circle
            cx={36}
            cy={72}
            r={9}
            fill={led3 ? "#60a5fa" : "#1e3a8a"}
            filter={led3 ? "url(#rbt-glow-sm)" : "none"}
          />

          {/* Speaker grille */}
          {[-32, -16, 0, 16, 32].map((x) => (
            <rect
              key={x}
              x={x - 3.5}
              y={96}
              width={7}
              height={30}
              rx={3.5}
              fill="#2d3f52"
            />
          ))}

          {/* ── LEFT ARM ─────────────────────────────────────────────── */}
          <g transform={`rotate(${leftArmAngle}, -92, 52)`}>
            <rect
              x={-134}
              y={36}
              width={46}
              height={104}
              rx={15}
              fill="url(#rbt-body)"
            />
            {/* Cuff */}
            <rect
              x={-134}
              y={120}
              width={46}
              height={20}
              rx={10}
              fill="#1a2535"
            />
            {/* Hand */}
            <circle cx={-111} cy={160} r={23} fill="#475569" />
            {/* Knuckles */}
            {[-119, -111, -103].map((x) => (
              <line
                key={x}
                x1={x}
                y1={152}
                x2={x}
                y2={166}
                stroke="#334155"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* ── RIGHT ARM ────────────────────────────────────────────── */}
          <g transform={`rotate(${rightArmAngle}, 92, 52)`}>
            <rect
              x={88}
              y={36}
              width={46}
              height={104}
              rx={15}
              fill="url(#rbt-body)"
            />
            {/* Cuff */}
            <rect
              x={88}
              y={120}
              width={46}
              height={20}
              rx={10}
              fill="#1a2535"
            />
            {/* Hand */}
            <circle cx={111} cy={160} r={23} fill="#475569" />
            {[103, 111, 119].map((x) => (
              <line
                key={x}
                x1={x}
                y1={152}
                x2={x}
                y2={166}
                stroke="#334155"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* ── NECK ──────────────────────────────────────────────────── */}
          <rect x={-24} y={10} width={48} height={26} rx={9} fill="#1a2535" />
          {/* Neck bolts */}
          {[-12, 0, 12].map((x) => (
            <circle key={x} cx={x} cy={23} r={3.5} fill="#2d3f52" />
          ))}

          {/* ── HEAD ──────────────────────────────────────────────────── */}
          <rect
            x={-94}
            y={-108}
            width={188}
            height={128}
            rx={24}
            fill="url(#rbt-body)"
          />
          {/* Head top sheen */}
          <rect
            x={-82}
            y={-102}
            width={164}
            height={40}
            rx={18}
            fill="rgba(255,255,255,0.06)"
          />

          {/* Ear bolts */}
          <circle cx={-94} cy={-50} r={13} fill="#1a2535" />
          <circle cx={-94} cy={-50} r={7} fill="#475569" />
          <circle cx={94} cy={-50} r={13} fill="#1a2535" />
          <circle cx={94} cy={-50} r={7} fill="#475569" />

          {/* ── EYES ──────────────────────────────────────────────────── */}
          {/* Sockets */}
          <rect x={-82} y={-90} width={64} height={54} rx={13} fill="#0a0f1a" />
          <rect x={18} y={-90} width={64} height={54} rx={13} fill="#0a0f1a" />

          {/* Left eye (blink via height) */}
          <rect
            x={-76}
            y={eyeCenterY - eyeH / 2}
            width={52}
            height={eyeH}
            rx={9}
            fill="url(#rbt-eye)"
            filter="url(#rbt-glow-sm)"
          />
          {/* Right eye */}
          <rect
            x={24}
            y={eyeCenterY - eyeH / 2}
            width={52}
            height={eyeH}
            rx={9}
            fill="url(#rbt-eye)"
            filter="url(#rbt-glow-sm)"
          />

          {/* Shine dots (only when eyes open) */}
          {eyeH > 12 && (
            <>
              <circle
                cx={-58}
                cy={eyeCenterY - eyeH / 2 + 9}
                r={5}
                fill="rgba(255,255,255,0.75)"
              />
              <circle
                cx={42}
                cy={eyeCenterY - eyeH / 2 + 9}
                r={5}
                fill="rgba(255,255,255,0.75)"
              />
            </>
          )}

          {/* ── MOUTH ─────────────────────────────────────────────────── */}
          <rect
            x={-50}
            y={-28}
            width={100}
            height={mouthH}
            rx={10}
            fill="#0a0f1a"
          />
          {/* Teeth */}
          {[-34, -14, 6, 26].map((x) => (
            <rect
              key={x}
              x={x}
              y={-26}
              width={14}
              height={10}
              rx={3}
              fill="#e2e8f0"
            />
          ))}

          {/* ── ANTENNA ───────────────────────────────────────────────── */}
          <g transform={`rotate(${antennaAngle}, 0, -108)`}>
            {/* Pole */}
            <rect x={-4} y={-158} width={8} height={54} rx={4} fill="#475569" />
            {/* Ring */}
            <circle
              cx={0}
              cy={-146}
              r={9}
              fill="none"
              stroke="#334155"
              strokeWidth={4}
            />
            {/* Ball */}
            <circle
              cx={0}
              cy={-162}
              r={14}
              fill={`rgba(250,204,21,${antennaGlow})`}
              filter="url(#rbt-glow)"
            />
            {/* Ball shine */}
            <circle cx={-4} cy={-167} r={4} fill="rgba(255,255,255,0.6)" />
          </g>
        </g>
      </svg>
    </div>
  );
};
