type MotionIconProps = {
  className?: string;
  title?: string;
};

function titleProps(title: string | undefined, id: string) {
  return {
    role: title ? "img" : "presentation",
    "aria-labelledby": title ? id : undefined,
    "aria-hidden": title ? undefined : true,
  } as const;
}

const reducedMotionGuard = `
  @media (prefers-reduced-motion: reduce) {
    [class*="electro-icon-"] { animation: none !important; transition: none !important; }
  }
`;

/* ──────────────────────────────────────────────────────────────────────────
   WATER — Plumbing routes
   Existing abstract line icon kept for backward compatibility.
   ────────────────────────────────────────────────────────────────────────── */
export function WiringMotionIcon({ className, title }: MotionIconProps) {
  const titleId = title ? "electro-icon-wiring-title" : undefined;

  return (
    <svg
      className={`electro-icon-wiring-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 220 200"
      xmlns="http://www.w3.org/2000/svg"
      {...titleProps(title, titleId ?? "")}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <style>{`
        .electro-icon-wiring { --electro-bg:#05070A; --electro-fg:#FFD21A; --electro-fg-soft:rgba(255,210,26,0.42); }
        .electro-icon-wiring-box { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 4; stroke-linejoin: round; }
        .electro-icon-wiring-screw { fill: var(--electro-fg); }
        .electro-icon-wiring-cable {
          fill: none;
          stroke: var(--electro-fg-soft);
          stroke-width: 5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .electro-icon-wiring-flow {
          fill: none;
          stroke: var(--electro-fg);
          stroke-width: 5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 14 120;
          stroke-dashoffset: 0;
          opacity: 0;
          filter: drop-shadow(0 0 6px rgba(255, 210, 26, 0.7));
          animation: electro-icon-wiring-flow 1.4s linear infinite;
          animation-play-state: paused;
        }
        .electro-icon-wiring-flow--2 { animation-delay: -0.35s; }
        .electro-icon-wiring-flow--3 { animation-delay: -0.7s; }
        .electro-icon-wiring-flow--4 { animation-delay: -1.05s; }

        .electro-icon-wiring-spark {
          fill: var(--electro-fg);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: electro-icon-wiring-spark 1.05s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-wiring-spark--2 { animation-delay: 0.25s; }
        .electro-icon-wiring-spark--3 { animation-delay: 0.5s; }
        .electro-icon-wiring-spark--4 { animation-delay: 0.75s; }

        .electro-icon-trigger:hover .electro-icon-wiring-flow,
        .electro-icon-trigger:focus-visible .electro-icon-wiring-flow,
        .electro-icon-wiring-svg:hover .electro-icon-wiring-flow {
          opacity: 1;
          animation-play-state: running;
        }
        .electro-icon-trigger:hover .electro-icon-wiring-spark,
        .electro-icon-trigger:focus-visible .electro-icon-wiring-spark,
        .electro-icon-wiring-svg:hover .electro-icon-wiring-spark {
          animation-play-state: running;
        }

        @keyframes electro-icon-wiring-flow {
          to { stroke-dashoffset: -134; }
        }
        @keyframes electro-icon-wiring-spark {
          0%, 70%, 100% { opacity: 0; transform: scale(0.55); }
          30%, 50%      { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 6px rgba(255, 210, 26, 0.85)); }
        }

        ${reducedMotionGuard}
      `}</style>

      <g className="electro-icon-wiring">
        {/* Cable bases (dim wires routing in) */}
        <path className="electro-icon-wiring-cable" d="M14 60 L70 60 L96 80" />
        <path className="electro-icon-wiring-cable" d="M206 60 L150 60 L124 80" />
        <path className="electro-icon-wiring-cable" d="M14 156 L70 156 L96 132" />
        <path className="electro-icon-wiring-cable" d="M206 156 L150 156 L124 132" />

        {/* Live current pulses (running on hover) */}
        <path className="electro-icon-wiring-flow electro-icon-wiring-flow--1" d="M14 60 L70 60 L96 80" />
        <path className="electro-icon-wiring-flow electro-icon-wiring-flow--2" d="M206 60 L150 60 L124 80" />
        <path className="electro-icon-wiring-flow electro-icon-wiring-flow--3" d="M14 156 L70 156 L96 132" />
        <path className="electro-icon-wiring-flow electro-icon-wiring-flow--4" d="M206 156 L150 156 L124 132" />

        {/* Junction box (centerpiece) */}
        <rect className="electro-icon-wiring-box" x="84" y="74" width="52" height="64" rx="4" />
        {/* Terminal screws */}
        <circle className="electro-icon-wiring-screw" cx="98" cy="90"  r="3.4" />
        <circle className="electro-icon-wiring-screw" cx="122" cy="90" r="3.4" />
        <circle className="electro-icon-wiring-screw" cx="98" cy="122"  r="3.4" />
        <circle className="electro-icon-wiring-screw" cx="122" cy="122" r="3.4" />
        {/* Internal divider */}
        <line x1="92" y1="106" x2="128" y2="106" stroke="rgba(255,210,26,0.5)" strokeWidth="2.4" strokeLinecap="round" />

        {/* Sparks at outer cable bends */}
        <path className="electro-icon-wiring-spark electro-icon-wiring-spark--1"
              d="M68 50 L72 60 L82 58 L74 64 L76 74 L68 68 L60 74 L62 64 L54 58 L64 60 Z" />
        <path className="electro-icon-wiring-spark electro-icon-wiring-spark--2"
              d="M152 50 L156 60 L166 58 L158 64 L160 74 L152 68 L144 74 L146 64 L138 58 L148 60 Z" />
        <path className="electro-icon-wiring-spark electro-icon-wiring-spark--3"
              d="M68 144 L72 154 L82 152 L74 158 L76 168 L68 162 L60 168 L62 158 L54 152 L64 154 Z" />
        <path className="electro-icon-wiring-spark electro-icon-wiring-spark--4"
              d="M152 144 L156 154 L166 152 L158 158 L160 168 L152 162 L144 168 L146 158 L138 152 L148 154 Z" />
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SYSTEM — Plumbing control panel
   Existing abstract panel icon kept for backward compatibility.
   ────────────────────────────────────────────────────────────────────────── */
export function PanelMotionIcon({ className, title }: MotionIconProps) {
  const titleId = title ? "electro-icon-panel-title" : undefined;

  return (
    <svg
      className={`electro-icon-panel-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 220 200"
      xmlns="http://www.w3.org/2000/svg"
      {...titleProps(title, titleId ?? "")}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <style>{`
        .electro-icon-panel { --electro-bg:#05070A; --electro-fg:#FFD21A; --electro-fg-soft:rgba(255,210,26,0.42); }
        .electro-icon-panel-case { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 4; stroke-linejoin: round; }
        .electro-icon-panel-rail { stroke: var(--electro-fg-soft); stroke-width: 2.6; stroke-linecap: round; fill: none; }
        .electro-icon-panel-bus {
          stroke: var(--electro-fg);
          stroke-width: 3.4;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 9 11;
          animation: electro-icon-panel-bus 1.1s linear infinite;
          animation-play-state: paused;
          filter: drop-shadow(0 0 4px rgba(255, 210, 26, 0.55));
        }
        .electro-icon-panel-led {
          fill: var(--electro-fg);
          opacity: 0.18;
          animation: electro-icon-panel-led 1.4s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-panel-led--2 { animation-delay: 0.16s; }
        .electro-icon-panel-led--3 { animation-delay: 0.32s; }

        .electro-icon-panel-toggle { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 2.8; stroke-linejoin: round; }
        .electro-icon-panel-handle {
          fill: var(--electro-fg);
          transform-box: fill-box;
          transform-origin: 50% 0;
          animation: electro-icon-panel-handle 1.4s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-panel-handle--2 { animation-delay: 0.16s; }
        .electro-icon-panel-handle--3 { animation-delay: 0.32s; }

        .electro-icon-trigger:hover .electro-icon-panel-bus,
        .electro-icon-trigger:hover .electro-icon-panel-led,
        .electro-icon-trigger:hover .electro-icon-panel-handle,
        .electro-icon-trigger:focus-visible .electro-icon-panel-bus,
        .electro-icon-trigger:focus-visible .electro-icon-panel-led,
        .electro-icon-trigger:focus-visible .electro-icon-panel-handle,
        .electro-icon-panel-svg:hover .electro-icon-panel-bus,
        .electro-icon-panel-svg:hover .electro-icon-panel-led,
        .electro-icon-panel-svg:hover .electro-icon-panel-handle {
          animation-play-state: running;
        }

        @keyframes electro-icon-panel-bus { to { stroke-dashoffset: -40; } }
        @keyframes electro-icon-panel-led {
          0%, 45%   { opacity: 0.2; filter: none; }
          55%, 100% { opacity: 1; filter: drop-shadow(0 0 7px rgba(255, 210, 26, 0.85)); }
        }
        @keyframes electro-icon-panel-handle {
          0%, 45%   { transform: translateY(20px); }
          55%, 100% { transform: translateY(0); }
        }

        ${reducedMotionGuard}
      `}</style>

      <g className="electro-icon-panel">
        {/* Cabinet */}
        <rect className="electro-icon-panel-case" x="42" y="28" width="136" height="144" rx="8" />
        {/* Door seam */}
        <rect className="electro-icon-panel-case" x="50" y="36" width="120" height="128" rx="4" />
        {/* Bus bar (top) — flowing dashes */}
        <line className="electro-icon-panel-bus" x1="60" y1="54" x2="160" y2="54" />
        {/* DIN-rail guides */}
        <line className="electro-icon-panel-rail" x1="60" y1="76"  x2="160" y2="76" />
        <line className="electro-icon-panel-rail" x1="60" y1="146" x2="160" y2="146" />

        {/* Breaker 1 */}
        <g>
          <rect className="electro-icon-panel-toggle" x="68" y="80" width="24" height="60" rx="3" />
          <rect className="electro-icon-panel-handle" x="74" y="92" width="12" height="16" rx="2" />
          <circle className="electro-icon-panel-led" cx="80" cy="158" r="4" />
        </g>
        {/* Breaker 2 */}
        <g>
          <rect className="electro-icon-panel-toggle" x="98" y="80" width="24" height="60" rx="3" />
          <rect className="electro-icon-panel-handle electro-icon-panel-handle--2" x="104" y="92" width="12" height="16" rx="2" />
          <circle className="electro-icon-panel-led electro-icon-panel-led--2" cx="110" cy="158" r="4" />
        </g>
        {/* Breaker 3 */}
        <g>
          <rect className="electro-icon-panel-toggle" x="128" y="80" width="24" height="60" rx="3" />
          <rect className="electro-icon-panel-handle electro-icon-panel-handle--3" x="134" y="92" width="12" height="16" rx="2" />
          <circle className="electro-icon-panel-led electro-icon-panel-led--3" cx="140" cy="158" r="4" />
        </g>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   CAMERA — Видеонаблюдение
   CCTV bullet camera on a bracket. Pans left↔right while the lens pulses
   (recording REC dot) and a translucent vision cone sweeps across.
   ────────────────────────────────────────────────────────────────────────── */
export function CameraMotionIcon({ className, title }: MotionIconProps) {
  const titleId = title ? "electro-icon-camera-title" : undefined;

  return (
    <svg
      className={`electro-icon-camera-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 220 200"
      xmlns="http://www.w3.org/2000/svg"
      {...titleProps(title, titleId ?? "")}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <style>{`
        .electro-icon-camera { --electro-bg:#05070A; --electro-fg:#FFD21A; }
        .electro-icon-camera-bracket { fill: none; stroke: var(--electro-fg); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
        .electro-icon-camera-body { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 4; stroke-linejoin: round; }
        .electro-icon-camera-lens-ring { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 3; }
        .electro-icon-camera-lens {
          fill: var(--electro-fg);
          animation: electro-icon-camera-lens 1.2s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-camera-rec {
          fill: var(--electro-fg);
          opacity: 0.2;
          animation: electro-icon-camera-rec 1.4s steps(2, end) infinite;
          animation-play-state: paused;
        }
        .electro-icon-camera-rig {
          transform-box: fill-box;
          transform-origin: 70px 80px;
          animation: electro-icon-camera-pan 3.2s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-camera-cone {
          fill: url(#electro-icon-camera-cone-grad);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 132px 102px;
          animation: electro-icon-camera-cone 3.2s ease-in-out infinite;
          animation-play-state: paused;
        }

        .electro-icon-trigger:hover .electro-icon-camera-rig,
        .electro-icon-trigger:hover .electro-icon-camera-cone,
        .electro-icon-trigger:hover .electro-icon-camera-lens,
        .electro-icon-trigger:hover .electro-icon-camera-rec,
        .electro-icon-trigger:focus-visible .electro-icon-camera-rig,
        .electro-icon-trigger:focus-visible .electro-icon-camera-cone,
        .electro-icon-trigger:focus-visible .electro-icon-camera-lens,
        .electro-icon-trigger:focus-visible .electro-icon-camera-rec,
        .electro-icon-camera-svg:hover .electro-icon-camera-rig,
        .electro-icon-camera-svg:hover .electro-icon-camera-cone,
        .electro-icon-camera-svg:hover .electro-icon-camera-lens,
        .electro-icon-camera-svg:hover .electro-icon-camera-rec {
          animation-play-state: running;
        }

        @keyframes electro-icon-camera-pan {
          0%, 100% { transform: rotate(-9deg); }
          50%      { transform: rotate(9deg); }
        }
        @keyframes electro-icon-camera-cone {
          0%, 100% { opacity: 0.18; transform: rotate(-9deg) scaleX(0.92); }
          50%      { opacity: 0.55; transform: rotate(9deg)  scaleX(1.06); }
        }
        @keyframes electro-icon-camera-lens {
          0%, 100% { opacity: 0.78; filter: none; }
          50%      { opacity: 1; filter: drop-shadow(0 0 8px rgba(255, 210, 26, 0.9)); }
        }
        @keyframes electro-icon-camera-rec {
          0%, 49%   { opacity: 1; filter: drop-shadow(0 0 6px rgba(255, 210, 26, 0.8)); }
          50%, 100% { opacity: 0.18; filter: none; }
        }

        ${reducedMotionGuard}
      `}</style>

      <defs>
        <linearGradient id="electro-icon-camera-cone-grad" x1="132" y1="102" x2="208" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFD21A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFD21A" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="electro-icon-camera">
        {/* Vision cone (behind camera, from lens outward) */}
        <path className="electro-icon-camera-cone" d="M132 102 L208 60 L208 144 Z" />

        {/* Wall mount + bracket arm */}
        <line className="electro-icon-camera-bracket" x1="50" y1="46" x2="92" y2="46" />
        <line className="electro-icon-camera-bracket" x1="70" y1="46" x2="70" y2="80" />

        <g className="electro-icon-camera-rig">
          {/* Bracket join to body */}
          <line className="electro-icon-camera-bracket" x1="70" y1="82" x2="70" y2="94" />
          {/* Body — bullet camera profile */}
          <path className="electro-icon-camera-body"
                d="M62 96
                   L120 90
                   Q140 90 140 102
                   Q140 114 120 114
                   L62 108 Z" />
          {/* Sun-shade lip on top */}
          <path className="electro-icon-camera-bracket" d="M64 92 L116 86" />
          {/* Lens ring */}
          <circle className="electro-icon-camera-lens-ring" cx="132" cy="102" r="11" />
          <circle className="electro-icon-camera-lens" cx="132" cy="102" r="6" />
          {/* REC indicator on body */}
          <circle className="electro-icon-camera-rec" cx="80" cy="102" r="3.4" />
        </g>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ACCESS — Utility access
   Existing access icon kept for backward compatibility.
   ────────────────────────────────────────────────────────────────────────── */
export function AccessMotionIcon({ className, title }: MotionIconProps) {
  const titleId = title ? "electro-icon-access-title" : undefined;

  return (
    <svg
      className={`electro-icon-access-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 220 200"
      xmlns="http://www.w3.org/2000/svg"
      {...titleProps(title, titleId ?? "")}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <style>{`
        .electro-icon-access { --electro-bg:#05070A; --electro-fg:#FFD21A; --electro-fg-soft:rgba(255,210,26,0.45); }
        .electro-icon-access-body { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 4; stroke-linejoin: round; }
        .electro-icon-access-line { fill: none; stroke: var(--electro-fg); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
        .electro-icon-access-screen { fill: var(--electro-fg); opacity: 0.18; }

        .electro-icon-access-shackle {
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: electro-icon-access-shackle 2s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-access-keyhole { fill: var(--electro-fg); }
        .electro-icon-access-led {
          fill: var(--electro-fg);
          opacity: 0.18;
          animation: electro-icon-access-led 0.9s ease-in-out infinite;
          animation-play-state: paused;
          animation-delay: 0.5s;
        }
        .electro-icon-access-signal {
          stroke: var(--electro-fg);
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 50% 50%;
          animation: electro-icon-access-signal 2s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-access-signal--2 { animation-delay: 0.18s; }
        .electro-icon-access-signal--3 { animation-delay: 0.36s; }

        .electro-icon-trigger:hover .electro-icon-access-shackle,
        .electro-icon-trigger:hover .electro-icon-access-led,
        .electro-icon-trigger:hover .electro-icon-access-signal,
        .electro-icon-trigger:focus-visible .electro-icon-access-shackle,
        .electro-icon-trigger:focus-visible .electro-icon-access-led,
        .electro-icon-trigger:focus-visible .electro-icon-access-signal,
        .electro-icon-access-svg:hover .electro-icon-access-shackle,
        .electro-icon-access-svg:hover .electro-icon-access-led,
        .electro-icon-access-svg:hover .electro-icon-access-signal {
          animation-play-state: running;
        }

        @keyframes electro-icon-access-shackle {
          0%, 30%, 100% { transform: translateY(0); }
          50%, 80%      { transform: translateY(-8px); }
        }
        @keyframes electro-icon-access-led {
          0%, 49%   { opacity: 1; filter: drop-shadow(0 0 6px rgba(255, 210, 26, 0.85)); }
          50%, 100% { opacity: 0.18; filter: none; }
        }
        @keyframes electro-icon-access-signal {
          0%       { opacity: 0; transform: scale(0.7); }
          25%, 55% { opacity: 1; }
          100%     { opacity: 0; transform: scale(1.18); }
        }

        ${reducedMotionGuard}
      `}</style>

      <g className="electro-icon-access">
        {/* Reader (right) */}
        <rect className="electro-icon-access-body" x="128" y="48" width="60" height="104" rx="6" />
        <rect className="electro-icon-access-screen" x="138" y="62" width="40" height="22" rx="2" />
        <line className="electro-icon-access-line" x1="146" y1="72" x2="170" y2="72" />
        <circle className="electro-icon-access-led" cx="158" cy="100" r="5" />
        {/* Reader keypad dots */}
        <circle cx="144" cy="120" r="3" fill="#FFD21A" opacity="0.55" />
        <circle cx="158" cy="120" r="3" fill="#FFD21A" opacity="0.55" />
        <circle cx="172" cy="120" r="3" fill="#FFD21A" opacity="0.55" />
        <circle cx="144" cy="136" r="3" fill="#FFD21A" opacity="0.55" />
        <circle cx="158" cy="136" r="3" fill="#FFD21A" opacity="0.55" />
        <circle cx="172" cy="136" r="3" fill="#FFD21A" opacity="0.55" />

        {/* RFID arcs traveling from padlock toward reader */}
        <path className="electro-icon-access-signal electro-icon-access-signal--1" d="M104 86 Q116 100 104 114" />
        <path className="electro-icon-access-signal electro-icon-access-signal--2" d="M114 80 Q130 100 114 120" />
        <path className="electro-icon-access-signal electro-icon-access-signal--3" d="M124 74 Q144 100 124 126" />

        {/* Padlock (left) */}
        <g>
          <path className="electro-icon-access-line electro-icon-access-shackle"
                d="M48 96 V76 Q48 50 70 50 Q92 50 92 76 V96" />
          <rect className="electro-icon-access-body" x="38" y="96" width="64" height="56" rx="6" />
          <circle className="electro-icon-access-keyhole" cx="70" cy="120" r="5" />
          <rect className="electro-icon-access-keyhole" x="68" y="120" width="4" height="14" rx="1.4" />
        </g>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SMART HOME — Умный дом
   House silhouette + phone. Wi-Fi arcs ripple from phone to house, devices
   light up in sequence, the phone bobs slightly.
   ────────────────────────────────────────────────────────────────────────── */
export function SmartHomeMotionIcon({ className, title }: MotionIconProps) {
  const titleId = title ? "electro-icon-smart-title" : undefined;

  return (
    <svg
      className={`electro-icon-smart-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 220 200"
      xmlns="http://www.w3.org/2000/svg"
      {...titleProps(title, titleId ?? "")}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <style>{`
        .electro-icon-smart { --electro-bg:#05070A; --electro-fg:#FFD21A; --electro-fg-soft:rgba(255,210,26,0.4); }
        .electro-icon-smart-body { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 4; stroke-linejoin: round; }
        .electro-icon-smart-line { fill: none; stroke: var(--electro-fg-soft); stroke-width: 2.6; stroke-linecap: round; }
        .electro-icon-smart-screen { fill: var(--electro-fg); opacity: 0.16; }

        .electro-icon-smart-wifi {
          fill: none;
          stroke: var(--electro-fg);
          stroke-width: 3;
          stroke-linecap: round;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 100% 50%;
          animation: electro-icon-smart-wifi 1.8s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-smart-wifi--2 { animation-delay: 0.2s; }
        .electro-icon-smart-wifi--3 { animation-delay: 0.4s; }

        .electro-icon-smart-node {
          fill: var(--electro-fg);
          opacity: 0.32;
          transform-box: fill-box;
          transform-origin: center;
          animation: electro-icon-smart-node 1.4s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-smart-node--2 { animation-delay: 0.25s; }
        .electro-icon-smart-node--3 { animation-delay: 0.5s; }

        .electro-icon-smart-phone {
          transform-box: fill-box;
          transform-origin: center;
          animation: electro-icon-smart-phone 2s ease-in-out infinite;
          animation-play-state: paused;
        }

        .electro-icon-trigger:hover .electro-icon-smart-wifi,
        .electro-icon-trigger:hover .electro-icon-smart-node,
        .electro-icon-trigger:hover .electro-icon-smart-phone,
        .electro-icon-trigger:focus-visible .electro-icon-smart-wifi,
        .electro-icon-trigger:focus-visible .electro-icon-smart-node,
        .electro-icon-trigger:focus-visible .electro-icon-smart-phone,
        .electro-icon-smart-svg:hover .electro-icon-smart-wifi,
        .electro-icon-smart-svg:hover .electro-icon-smart-node,
        .electro-icon-smart-svg:hover .electro-icon-smart-phone {
          animation-play-state: running;
        }

        @keyframes electro-icon-smart-wifi {
          0%       { opacity: 0; transform: scaleX(0.6); }
          30%, 60% { opacity: 1; }
          100%     { opacity: 0; transform: scaleX(1.05); }
        }
        @keyframes electro-icon-smart-node {
          0%, 100% { opacity: 0.32; transform: scale(0.85); filter: none; }
          50%      { opacity: 1; transform: scale(1.18); filter: drop-shadow(0 0 7px rgba(255, 210, 26, 0.85)); }
        }
        @keyframes electro-icon-smart-phone {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }

        ${reducedMotionGuard}
      `}</style>

      <g className="electro-icon-smart">
        {/* House: roof + walls */}
        <path className="electro-icon-smart-body" d="M30 110 L84 60 L138 110 L138 162 L30 162 Z" />
        {/* Door */}
        <rect className="electro-icon-smart-body" x="70" y="124" width="28" height="38" rx="2" />
        <circle cx="92" cy="146" r="2" fill="#FFD21A" />
        {/* Window grid (2x1) */}
        <rect className="electro-icon-smart-line" x="40" y="118" width="20" height="20" />
        <rect className="electro-icon-smart-line" x="108" y="118" width="22" height="20" />

        {/* Smart device nodes inside house — light up in sequence */}
        <circle className="electro-icon-smart-node electro-icon-smart-node--1" cx="50" cy="128" r="4" />
        <circle className="electro-icon-smart-node electro-icon-smart-node--2" cx="118" cy="128" r="4" />
        <circle className="electro-icon-smart-node electro-icon-smart-node--3" cx="84" cy="92" r="4" />

        {/* Wi-Fi arcs from phone to house */}
        <g>
          <path className="electro-icon-smart-wifi electro-icon-smart-wifi--3" d="M186 70 Q176 100 186 134" />
          <path className="electro-icon-smart-wifi electro-icon-smart-wifi--2" d="M180 82 Q172 100 180 122" />
          <path className="electro-icon-smart-wifi electro-icon-smart-wifi--1" d="M174 92 Q168 100 174 112" />
        </g>

        {/* Phone */}
        <g className="electro-icon-smart-phone">
          <rect className="electro-icon-smart-body" x="156" y="58" width="44" height="86" rx="7" />
          <rect className="electro-icon-smart-screen" x="162" y="68" width="32" height="60" rx="2" />
          <line x1="172" y1="138" x2="184" y2="138" stroke="#FFD21A" strokeWidth="2.6" strokeLinecap="round" />
          {/* App tiles on screen */}
          <rect x="166" y="74" width="10" height="10" rx="1.4" fill="#FFD21A" opacity="0.55" />
          <rect x="180" y="74" width="10" height="10" rx="1.4" fill="#FFD21A" opacity="0.85" />
          <rect x="166" y="88" width="10" height="10" rx="1.4" fill="#FFD21A" opacity="0.85" />
          <rect x="180" y="88" width="10" height="10" rx="1.4" fill="#FFD21A" opacity="0.55" />
          <rect x="166" y="102" width="24" height="6" rx="1.4" fill="#FFD21A" opacity="0.7" />
          <rect x="166" y="112" width="24" height="6" rx="1.4" fill="#FFD21A" opacity="0.4" />
        </g>
      </g>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   FLOOR HEAT — Тёплый пол
   3×2 tile grid with a heating cable snaking underneath. Heat waves rise
   in staggered sequence between tiles.
   ────────────────────────────────────────────────────────────────────────── */
export function FloorHeatMotionIcon({ className, title }: MotionIconProps) {
  const titleId = title ? "electro-icon-floor-title" : undefined;

  return (
    <svg
      className={`electro-icon-floor-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 220 200"
      xmlns="http://www.w3.org/2000/svg"
      {...titleProps(title, titleId ?? "")}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <style>{`
        .electro-icon-floor { --electro-bg:#05070A; --electro-fg:#FFD21A; --electro-fg-soft:rgba(255,210,26,0.6); }
        .electro-icon-floor-tile { fill: none; stroke: var(--electro-fg-soft); stroke-width: 2.6; stroke-linejoin: round; }
        .electro-icon-floor-cable {
          fill: none;
          stroke: var(--electro-fg);
          stroke-width: 4.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 16 14;
          animation: electro-icon-floor-cable 1.6s linear infinite;
          animation-play-state: paused;
          filter: drop-shadow(0 0 4px rgba(255, 210, 26, 0.5));
        }
        .electro-icon-floor-heat {
          fill: none;
          stroke: var(--electro-fg);
          stroke-width: 3.4;
          stroke-linecap: round;
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 50% 100%;
          animation: electro-icon-floor-heat 1.7s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-floor-heat--2 { animation-delay: 0.28s; }
        .electro-icon-floor-heat--3 { animation-delay: 0.56s; }

        .electro-icon-trigger:hover .electro-icon-floor-cable,
        .electro-icon-trigger:hover .electro-icon-floor-heat,
        .electro-icon-trigger:focus-visible .electro-icon-floor-cable,
        .electro-icon-trigger:focus-visible .electro-icon-floor-heat,
        .electro-icon-floor-svg:hover .electro-icon-floor-cable,
        .electro-icon-floor-svg:hover .electro-icon-floor-heat {
          animation-play-state: running;
        }

        @keyframes electro-icon-floor-cable {
          to { stroke-dashoffset: -60; }
        }
        @keyframes electro-icon-floor-heat {
          0%       { opacity: 0; transform: translateY(8px) scaleY(0.7); }
          25%, 60% { opacity: 1; }
          100%     { opacity: 0; transform: translateY(-22px) scaleY(1.1); }
        }

        ${reducedMotionGuard}
      `}</style>

      <g className="electro-icon-floor">
        {/* Heat waves rising above the tile surface */}
        <path className="electro-icon-floor-heat electro-icon-floor-heat--1" d="M62 86 Q54 70 62 54 Q70 38 62 22" />
        <path className="electro-icon-floor-heat electro-icon-floor-heat--2" d="M110 86 Q102 70 110 54 Q118 38 110 22" />
        <path className="electro-icon-floor-heat electro-icon-floor-heat--3" d="M158 86 Q150 70 158 54 Q166 38 158 22" />

        {/* Heating cable — snakes beneath the floor */}
        <path
          className="electro-icon-floor-cable"
          d="M30 110
             L188 110
             Q204 110 204 126
             Q204 142 188 142
             L34 142
             Q18 142 18 158
             Q18 174 34 174
             L188 174"
        />

        {/* Tile grid (3 cols × 2 rows) — transparent so cable shows through */}
        <rect className="electro-icon-floor-tile" x="34" y="100" width="50" height="34" rx="2" />
        <rect className="electro-icon-floor-tile" x="86" y="100" width="50" height="34" rx="2" />
        <rect className="electro-icon-floor-tile" x="138" y="100" width="50" height="34" rx="2" />
        <rect className="electro-icon-floor-tile" x="34" y="136" width="50" height="34" rx="2" />
        <rect className="electro-icon-floor-tile" x="86" y="136" width="50" height="34" rx="2" />
        <rect className="electro-icon-floor-tile" x="138" y="136" width="50" height="34" rx="2" />
      </g>
    </svg>
  );
}
