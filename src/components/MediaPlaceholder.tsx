import type { AccentTone } from "@/src/types";

interface MediaPlaceholderProps {
  accent: AccentTone;
  badge: string;
  title: string;
  caption?: string;
  signals?: string[];
  variant?: "hero" | "card" | "panel";
  image?: string;
}

export function MediaPlaceholder({
  accent,
  badge,
  title,
  caption,
  signals = [],
  variant = "card",
  image,
}: MediaPlaceholderProps) {
  return (
    <div className={`media-placeholder media-placeholder--${variant} media-placeholder--${accent}`}>
      <div className="media-placeholder__topline">
        <span className="media-placeholder__badge">{badge}</span>
        <span className="media-placeholder__code">{accent.toUpperCase()}</span>
      </div>

      <div className="media-placeholder__screen" aria-hidden="true">
        <span className="media-placeholder__wash" />
        <span className="media-placeholder__grid" />
        <span className="media-placeholder__glow" />
        {image ? (
          <img className="media-placeholder__asset" src={image} alt="" loading="lazy" />
        ) : null}
        <span className="media-placeholder__module media-placeholder__module--primary" />
        <span className="media-placeholder__module media-placeholder__module--secondary" />
        <span className="media-placeholder__module media-placeholder__module--accent" />
      </div>

      <div className="media-placeholder__copy">
        <strong>{title}</strong>
        {caption ? <span>{caption}</span> : null}
      </div>

      {signals.length > 0 ? (
        <div className="media-placeholder__signals">
          {signals.slice(0, 3).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
