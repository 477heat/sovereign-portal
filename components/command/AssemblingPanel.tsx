import type { ReactNode } from "react";

type AssemblingPanelProps = {
  children: ReactNode;
  className?: string;
  delay?: "none" | "short" | "medium" | "long";
  title?: string;
};

export function AssemblingPanel({
  children,
  className = "",
  delay = "none",
  title,
}: AssemblingPanelProps) {
  return (
    <section className={`command-assembling-panel command-assembling-panel--${delay} ${className}`}>
      {title ? <div className="command-assembling-panel__title">{title}</div> : null}
      {children}
    </section>
  );
}
