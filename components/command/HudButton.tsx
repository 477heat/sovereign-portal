import type { ButtonHTMLAttributes, ReactNode } from "react";

type HudButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
  hideLamp?: boolean;
  tone?: "cyan" | "gold" | "red";
};

export function HudButton({
  active = false,
  children,
  className = "",
  hideLamp = false,
  tone = "cyan",
  type = "button",
  ...props
}: HudButtonProps) {
  return (
    <button
      className={`command-hud-button command-hud-button--${tone} ${active ? "command-hud-button--active" : ""} ${className}`}
      type={type}
      {...props}
    >
      {hideLamp ? null : <span className="command-hud-button__lamp" aria-hidden="true" />}
      <span className="command-hud-button__label">{children}</span>
    </button>
  );
}
