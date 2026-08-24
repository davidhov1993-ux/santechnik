type ServiceVanIconProps = {
  className?: string;
  title?: string;
};

export function ServiceVanIcon({ className, title }: ServiceVanIconProps) {
  const titleId = title ? "electro-icon-van-title" : undefined;

  return (
    <svg
      className={`electro-icon-van-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 220 200"
      role={title ? "img" : "presentation"}
      aria-labelledby={titleId}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title id={titleId}>{title}</title> : null}

      <style>{`
        .electro-icon-van {
          --electro-bg: #05070A;
          --electro-fg: #FFD21A;
          --electro-fg-dim: #8E6E0E;
        }

        /* ── Body sway + suspension bob (on hover) ─────────────────────── */
        .electro-icon-van-rig {
          transform-box: fill-box;
          transform-origin: center;
          animation: electro-icon-van-bob 1.6s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-trigger:hover .electro-icon-van-rig,
        .electro-icon-van-svg:hover .electro-icon-van-rig,
        .electro-icon-trigger:focus-visible .electro-icon-van-rig {
          animation-play-state: running;
        }
        @keyframes electro-icon-van-bob {
          0%, 100% { transform: translate(-1px, 0); }
          25%      { transform: translate(0,  -1.4px); }
          50%      { transform: translate(1.5px, 0); }
          75%      { transform: translate(0, 1px); }
        }

        /* ── Body & static elements ─────────────────────────────────────── */
        .electro-icon-van-body {
          fill: none;
          stroke: var(--electro-fg);
          stroke-width: 6;
          stroke-linejoin: round;
          stroke-linecap: round;
        }
        .electro-icon-van-window { fill: var(--electro-fg); }
        .electro-icon-van-headlight { fill: var(--electro-fg); }

        /* ── Lightning bolt ────────────────────────────────────────────── */
        .electro-icon-van-bolt {
          fill: var(--electro-fg);
          stroke: var(--electro-bg);
          stroke-width: 1.5;
          stroke-linejoin: round;
          animation: electro-icon-van-bolt-flicker 1.4s steps(8, end) infinite;
          animation-play-state: paused;
        }
        .electro-icon-trigger:hover .electro-icon-van-bolt,
        .electro-icon-van-svg:hover .electro-icon-van-bolt,
        .electro-icon-trigger:focus-visible .electro-icon-van-bolt {
          animation-play-state: running;
        }
        @keyframes electro-icon-van-bolt-flicker {
          0%, 18%, 22%, 100% {
            opacity: 1;
            filter: drop-shadow(0 0 5px rgba(255, 210, 26, 0.7));
          }
          20%, 60% {
            opacity: 0.78;
            filter: none;
          }
        }

        /* ── Wheels (no spokes) ────────────────────────────────────────── */
        .electro-icon-van-tire {
          fill: var(--electro-bg);
          stroke: var(--electro-fg);
          stroke-width: 5;
        }
        .electro-icon-van-hub {
          fill: var(--electro-fg);
        }

        /* ── Headlight beam (projects forward) ─────────────────────────── */
        .electro-icon-van-headlight-beam {
          fill: url(#electro-icon-van-headlight-grad);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: 0% 50%;
          animation: electro-icon-van-headlight-beam 1.2s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-trigger:hover .electro-icon-van-headlight-beam,
        .electro-icon-van-svg:hover .electro-icon-van-headlight-beam,
        .electro-icon-trigger:focus-visible .electro-icon-van-headlight-beam {
          animation-play-state: running;
          opacity: 1;
        }
        @keyframes electro-icon-van-headlight-beam {
          0%, 100% { opacity: 0.55; transform: scaleX(0.92); }
          50%      { opacity: 1;    transform: scaleX(1.06); }
        }

        /* ── Tail light blink ──────────────────────────────────────────── */
        .electro-icon-van-taillight {
          fill: var(--electro-fg);
          opacity: 0.35;
          animation: electro-icon-van-taillight 1.2s steps(2, end) infinite;
          animation-play-state: paused;
        }
        .electro-icon-trigger:hover .electro-icon-van-taillight,
        .electro-icon-van-svg:hover .electro-icon-van-taillight,
        .electro-icon-trigger:focus-visible .electro-icon-van-taillight {
          animation-play-state: running;
        }
        @keyframes electro-icon-van-taillight {
          0%, 49%   { opacity: 1; filter: drop-shadow(0 0 4px rgba(255, 210, 26, 0.85)); }
          50%, 100% { opacity: 0.35; filter: none; }
        }

        /* ── Beacon (always on) ────────────────────────────────────────── */
        .electro-icon-van-beacon { fill: var(--electro-fg); }
        .electro-icon-van-flash {
          stroke-width: 5;
          stroke-linecap: round;
          fill: none;
          will-change: opacity;
        }
        .electro-icon-van-flash--center {
          stroke: var(--electro-fg);
          animation: electro-icon-van-flash-center 0.95s ease-in-out infinite;
        }
        .electro-icon-van-flash--left {
          stroke: var(--electro-fg-dim);
          animation: electro-icon-van-flash-side 0.95s ease-in-out infinite;
          animation-delay: -0.32s;
        }
        .electro-icon-van-flash--right {
          stroke: var(--electro-fg-dim);
          animation: electro-icon-van-flash-side 0.95s ease-in-out infinite;
          animation-delay: 0.32s;
        }
        @keyframes electro-icon-van-flash-center {
          0%, 100% {
            opacity: 1;
            stroke: var(--electro-fg);
            filter: drop-shadow(0 0 5px rgba(255, 210, 26, 0.85));
          }
          55% {
            opacity: 0.4;
            stroke: var(--electro-fg-dim);
            filter: none;
          }
        }
        @keyframes electro-icon-van-flash-side {
          0%, 100% { opacity: 0.4; }
          50% {
            opacity: 1;
            stroke: var(--electro-fg);
            filter: drop-shadow(0 0 4px rgba(255, 210, 26, 0.75));
          }
        }
        .electro-icon-van-beacon-glow {
          fill: url(#electro-icon-van-halo-grad);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: electro-icon-van-beacon-glow 0.95s ease-in-out infinite;
        }
        @keyframes electro-icon-van-beacon-glow {
          0%, 100% { opacity: 0.15; transform: scale(0.85); }
          55%      { opacity: 0.7;  transform: scale(1.18); }
        }

        /* ── Road dashes ───────────────────────────────────────────────── */
        .electro-icon-van-road {
          stroke: var(--electro-fg);
          stroke-width: 4;
          stroke-linecap: round;
          opacity: 0;
          transition: opacity 200ms ease;
        }
        .electro-icon-trigger:hover .electro-icon-van-road,
        .electro-icon-van-svg:hover .electro-icon-van-road,
        .electro-icon-trigger:focus-visible .electro-icon-van-road {
          opacity: 1;
        }
        .electro-icon-van-dash {
          animation: electro-icon-van-road-flow 0.8s linear infinite;
          animation-play-state: paused;
        }
        .electro-icon-trigger:hover .electro-icon-van-dash,
        .electro-icon-van-svg:hover .electro-icon-van-dash,
        .electro-icon-trigger:focus-visible .electro-icon-van-dash {
          animation-play-state: running;
        }
        .electro-icon-van-dash--2 { animation-delay: -0.16s; }
        .electro-icon-van-dash--3 { animation-delay: -0.32s; }
        .electro-icon-van-dash--4 { animation-delay: -0.48s; }
        .electro-icon-van-dash--5 { animation-delay: -0.64s; }
        @keyframes electro-icon-van-road-flow {
          0%   { transform: translateX(40px); opacity: 0; }
          15%  { opacity: 0.8; }
          85%  { opacity: 0.8; }
          100% { transform: translateX(-8px); opacity: 0; }
        }

        /* ── Exhaust puffs ─────────────────────────────────────────────── */
        .electro-icon-van-puff {
          fill: rgba(255, 210, 26, 0.5);
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
          animation: electro-icon-van-puff 1.6s ease-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-van-puff--2 { animation-delay: -0.5s; }
        .electro-icon-van-puff--3 { animation-delay: -1s;   }
        .electro-icon-trigger:hover .electro-icon-van-puff,
        .electro-icon-van-svg:hover .electro-icon-van-puff,
        .electro-icon-trigger:focus-visible .electro-icon-van-puff {
          animation-play-state: running;
        }
        @keyframes electro-icon-van-puff {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.3); }
          25%  { opacity: 0.7; }
          100% { opacity: 0; transform: translate(-22px, -16px) scale(1.5); }
        }

        /* ── Reduced motion ────────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .electro-icon-van-rig,
          .electro-icon-van-bolt,
          .electro-icon-van-headlight-beam,
          .electro-icon-van-taillight,
          .electro-icon-van-flash--center,
          .electro-icon-van-flash--left,
          .electro-icon-van-flash--right,
          .electro-icon-van-beacon-glow,
          .electro-icon-van-dash,
          .electro-icon-van-puff {
            animation: none !important;
          }
          .electro-icon-van-flash--center,
          .electro-icon-van-flash--left,
          .electro-icon-van-flash--right { opacity: 1; }
          .electro-icon-van-beacon-glow,
          .electro-icon-van-headlight-beam,
          .electro-icon-van-puff { opacity: 0; }
        }
      `}</style>

      <defs>
        <radialGradient
          id="electro-icon-van-halo-grad"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" stopColor="#FFD21A" stopOpacity="0.8" />
          <stop offset="55%" stopColor="#FFD21A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFD21A" stopOpacity="0" />
        </radialGradient>

        <linearGradient
          id="electro-icon-van-headlight-grad"
          x1="200"
          y1="148"
          x2="220"
          y2="148"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFD21A" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#FFD21A" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g className="electro-icon-van">
        {/* Headlight beam — sits behind the body, projects forward */}
        <path
          className="electro-icon-van-headlight-beam"
          d="M200 148 L220 138 L220 158 Z"
        />

        <g className="electro-icon-van-rig">
          {/* Beacon halo — radial gradient ellipse behind the rays */}
          <ellipse
            className="electro-icon-van-beacon-glow"
            cx="148"
            cy="51"
            rx="28"
            ry="14"
          />

          {/* Beacon flash rays — center bright, sides dim, alternating strobe */}
          <line
            className="electro-icon-van-flash electro-icon-van-flash--left"
            x1="132"
            y1="44"
            x2="118"
            y2="20"
          />
          <line
            className="electro-icon-van-flash electro-icon-van-flash--center"
            x1="148"
            y1="42"
            x2="148"
            y2="10"
          />
          <line
            className="electro-icon-van-flash electro-icon-van-flash--right"
            x1="164"
            y1="44"
            x2="178"
            y2="20"
          />

          {/* Beacon body — pill-shape (rx=7 on h=14 = full pill) */}
          <rect className="electro-icon-van-beacon" x="134" y="44" width="28" height="14" rx="7" />
          {/* Stem — short mount connecting beacon to cab roof. Right edge
              aligns with the start of the cab front lip (x=152). */}
          <rect className="electro-icon-van-beacon" x="144" y="58" width="8"  height="6"  rx="2" />

          {/* Body silhouette — cargo box (left) + proper truck cab (right):
              cab front lip → diagonal windshield → hood top → rounded corner →
              vertical front. All four outer corners rounded. */}
          <path
            className="electro-icon-van-body"
            d="M44 64
               L152 64
               L152 86
               L188 118
               L198 118
               Q204 118 204 124
               L204 156
               Q204 164 196 164
               L44 164
               Q36 164 36 156
               L36 72
               Q36 64 44 64 Z"
          />

          {/* Cargo side window — wide rounded panel */}
          <rect className="electro-icon-van-window" x="46" y="82" width="72" height="26" rx="4" />

          {/* Headlight (front-bottom of cab) + tail light (rear-bottom) */}
          <circle className="electro-icon-van-headlight" cx="200" cy="148" r="3" />
          <circle className="electro-icon-van-taillight" cx="42" cy="148" r="2.4" />

          {/* Lightning bolt — top tip aligned with beacon center (x=148),
              spans full body height + dips between the wheels at the bottom */}
          <path
            className="electro-icon-van-bolt"
            d="M148 70
               L122 118
               L138 118
               L128 168
               L156 122
               L140 122
               L150 72 Z"
          />

          {/* Wheels — outer ring + solid hub */}
          <circle className="electro-icon-van-tire" cx="70" cy="176" r="12" />
          <circle className="electro-icon-van-hub" cx="70" cy="176" r="4.5" />

          <circle className="electro-icon-van-tire" cx="176" cy="176" r="12" />
          <circle className="electro-icon-van-hub" cx="176" cy="176" r="4.5" />
        </g>

        {/* Exhaust puffs — emerge from rear-bottom and drift up-and-left */}
        <g>
          <circle className="electro-icon-van-puff electro-icon-van-puff--1" cx="22" cy="168" r="3.5" />
          <circle className="electro-icon-van-puff electro-icon-van-puff--2" cx="22" cy="168" r="4"   />
          <circle className="electro-icon-van-puff electro-icon-van-puff--3" cx="22" cy="168" r="4.5" />
        </g>

        {/* Road dashes — slide leftward beneath the wheels */}
        <g className="electro-icon-van-road">
          <line className="electro-icon-van-dash electro-icon-van-dash--1" x1="14"  y1="194" x2="34"  y2="194" />
          <line className="electro-icon-van-dash electro-icon-van-dash--2" x1="54"  y1="194" x2="74"  y2="194" />
          <line className="electro-icon-van-dash electro-icon-van-dash--3" x1="94"  y1="194" x2="114" y2="194" />
          <line className="electro-icon-van-dash electro-icon-van-dash--4" x1="134" y1="194" x2="154" y2="194" />
          <line className="electro-icon-van-dash electro-icon-van-dash--5" x1="174" y1="194" x2="194" y2="194" />
        </g>
      </g>
    </svg>
  );
}
