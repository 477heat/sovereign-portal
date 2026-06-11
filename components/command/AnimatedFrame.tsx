import type { ReactNode } from "react";

type AnimatedFrameProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  tone?: "cyan" | "gold";
};

export function AnimatedFrame({
  children,
  className = "",
  label = "Frame",
  tone = "cyan",
}: AnimatedFrameProps) {
  return (
    <section className={`command-animated-frame command-animated-frame--${tone} ${className}`}>
      <svg
        aria-hidden="true"
        className="command-animated-frame__rails"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path className="command-animated-frame__rail command-animated-frame__rail--outer" d="M8 1 H92 L99 8 V92 L92 99 H8 L1 92 V8 Z" />
        <path className="command-animated-frame__rail command-animated-frame__rail--inner" d="M14 7 H86 L93 14 V86 L86 93 H14 L7 86 V14 Z" />
        <path className="command-animated-frame__corner" d="M8 1 H28 M1 8 V28 M72 1 H92 L99 8 V28 M99 72 V92 L92 99 H72 M28 99 H8 L1 92 V72" />
      </svg>
      <div className="command-animated-frame__tag">{label}</div>
      <div className="command-animated-frame__content">{children}</div>
    </section>
  );
}
