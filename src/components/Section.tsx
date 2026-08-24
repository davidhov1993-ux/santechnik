import type { PropsWithChildren } from "react";

interface SectionProps extends PropsWithChildren {
  eyebrow?: string;
  title: string;
  intro?: string;
  className?: string;
  id?: string;
  layout?: "default" | "wide" | "narrow";
}

export function Section({
  eyebrow,
  title,
  intro,
  className,
  id,
  layout = "default",
  children,
}: SectionProps) {
  return (
    <section id={id} className={`section ${className ?? ""}`.trim()}>
      <div className={`section__inner section__inner--${layout}`.trim()}>
        <div className="section-heading">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {intro ? <p className="section-intro">{intro}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}
