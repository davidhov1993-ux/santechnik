type InternetLowVoltageIconProps = {
  className?: string;
  title?: string;
};

export function InternetLowVoltageIcon({
  className,
  title,
}: InternetLowVoltageIconProps) {
  const titleId = title ? "electro-icon-internet-title" : undefined;

  return (
    <svg
      className={`electro-icon-internet-svg ${className ?? ""}`.trim()}
      width="100%"
      height="100%"
      viewBox="0 0 200 200"
      role={title ? "img" : "presentation"}
      aria-labelledby={titleId}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title id={titleId}>{title}</title> : null}

      <style>{`
        .electro-icon-internet { --electro-bg:#05070A; --electro-fg:#FFD21A; }
        .electro-icon-internet-body { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 3.2; stroke-linejoin: round; }
        .electro-icon-internet-line { stroke: var(--electro-fg); stroke-width: 3.2; stroke-linecap: round; stroke-linejoin: round; fill: none; }
        .electro-icon-internet-thin { stroke: var(--electro-fg); stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; fill: none; }
        .electro-icon-internet-port { fill: var(--electro-bg); stroke: var(--electro-fg); stroke-width: 1.6; }
        .electro-icon-internet-glow { filter: drop-shadow(0 0 4px rgba(255, 210, 26, 0.55)); }

        .electro-icon-internet-wifi {
          stroke: var(--electro-fg);
          fill: none;
          stroke-linecap: round;
          opacity: 0;
          transform-origin: 100px 78px;
          animation: electro-icon-internet-wifi-pulse 2.4s ease-in-out infinite;
          animation-play-state: paused;
        }
        .electro-icon-trigger:hover .electro-icon-internet-wifi,
        .electro-icon-internet-svg:hover .electro-icon-internet-wifi {
          animation-play-state: running;
        }
        .electro-icon-internet-wifi--1 { stroke-width: 3.4; animation-delay: 0s; }
        .electro-icon-internet-wifi--2 { stroke-width: 3.0; animation-delay: 0.35s; }
        .electro-icon-internet-wifi--3 { stroke-width: 2.6; animation-delay: 0.7s; }

        @keyframes electro-icon-internet-wifi-pulse {
          0%   { opacity: 0; transform: scale(0.6); }
          25%  { opacity: 1; transform: scale(1); }
          70%  { opacity: 0; transform: scale(1.05); }
          100% { opacity: 0; transform: scale(1.05); }
        }

        .electro-icon-internet-led {
          fill: var(--electro-fg);
          opacity: 0.18;
          animation: electro-icon-internet-led-blink 1.4s steps(2, end) infinite;
          animation-play-state: paused;
          transform-origin: center;
        }
        .electro-icon-trigger:hover .electro-icon-internet-led,
        .electro-icon-internet-svg:hover .electro-icon-internet-led {
          animation-play-state: running;
        }
        .electro-icon-internet-led--1 { animation-delay: 0s; }
        .electro-icon-internet-led--2 { animation-delay: 0.4s; }
        .electro-icon-internet-led--3 { animation-delay: 0.8s; }

        @keyframes electro-icon-internet-led-blink {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0.18; }
        }

        .electro-icon-internet-cable {
          stroke: var(--electro-fg);
          stroke-width: 3.2;
          stroke-linecap: round;
          fill: none;
          stroke-dasharray: 6 8;
          animation: electro-icon-internet-cable-flow 1.6s linear infinite;
          animation-play-state: paused;
        }
        .electro-icon-trigger:hover .electro-icon-internet-cable,
        .electro-icon-internet-svg:hover .electro-icon-internet-cable {
          animation-play-state: running;
        }
        .electro-icon-internet-cable--right { animation-direction: reverse; }

        @keyframes electro-icon-internet-cable-flow {
          to { stroke-dashoffset: -28; }
        }
      `}</style>

      <g className="electro-icon-internet">
        {/* Wi-Fi arcs */}
        <g className="electro-icon-internet-glow">
          <path
            className="electro-icon-internet-wifi electro-icon-internet-wifi--3"
            d="M58 78 Q100 40 142 78"
          />
          <path
            className="electro-icon-internet-wifi electro-icon-internet-wifi--2"
            d="M70 84 Q100 56 130 84"
          />
          <path
            className="electro-icon-internet-wifi electro-icon-internet-wifi--1"
            d="M82 90 Q100 74 118 90"
          />
        </g>

        {/* Antennas */}
        <line className="electro-icon-internet-line" x1="74" y1="108" x2="64" y2="84" />
        <circle cx="64" cy="82" r="3.2" fill="#FFD21A" />
        <line className="electro-icon-internet-line" x1="126" y1="108" x2="136" y2="84" />
        <circle cx="136" cy="82" r="3.2" fill="#FFD21A" />

        {/* Router body */}
        <rect
          className="electro-icon-internet-body"
          x="46"
          y="108"
          width="108"
          height="40"
          rx="6"
        />

        {/* LED indicators */}
        <circle className="electro-icon-internet-led electro-icon-internet-led--1" cx="62" cy="120" r="3.2" />
        <circle className="electro-icon-internet-led electro-icon-internet-led--2" cx="74" cy="120" r="3.2" />
        <circle className="electro-icon-internet-led electro-icon-internet-led--3" cx="86" cy="120" r="3.2" />

        {/* Ethernet ports */}
        <rect className="electro-icon-internet-port" x="106" y="128" width="12" height="10" rx="1.4" />
        <rect className="electro-icon-internet-port" x="122" y="128" width="12" height="10" rx="1.4" />
        <rect className="electro-icon-internet-port" x="138" y="128" width="12" height="10" rx="1.4" />

        {/* Port pins */}
        <line className="electro-icon-internet-thin" x1="108.5" y1="134" x2="115.5" y2="134" />
        <line className="electro-icon-internet-thin" x1="124.5" y1="134" x2="131.5" y2="134" />
        <line className="electro-icon-internet-thin" x1="140.5" y1="134" x2="147.5" y2="134" />

        {/* Cables with running dashes */}
        <path
          className="electro-icon-internet-cable"
          d="M60 148 C 56 168, 40 170, 36 184"
        />
        <path
          className="electro-icon-internet-cable electro-icon-internet-cable--right"
          d="M140 148 C 144 168, 160 170, 164 184"
        />

        {/* Cable plugs */}
        <rect className="electro-icon-internet-port" x="30" y="180" width="12" height="8" rx="1.2" />
        <rect className="electro-icon-internet-port" x="158" y="180" width="12" height="8" rx="1.2" />
      </g>
    </svg>
  );
}
