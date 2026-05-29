type TunnelBackdropProps = {
  className?: string;
  intensity?: "normal" | "dim";
  layer?: "behind" | "page";
  rings?: boolean;
  variant?: "legacy" | "diffused";
};

export default function TunnelBackdrop({
  className = "",
  intensity = "dim",
  layer = "behind",
  rings = false,
  variant = "legacy",
}: TunnelBackdropProps) {
  const legacyGlow =
    intensity === "dim"
      ? "bg-[radial-gradient(circle_at_50%_28%,rgba(212,244,255,0.26)_0%,rgba(80,190,255,0.09)_8%,rgba(117,72,255,0.05)_18%,rgba(0,0,0,0)_42%)]"
      : "bg-[radial-gradient(circle_at_50%_28%,rgba(212,244,255,0.72)_0%,rgba(80,190,255,0.22)_7%,rgba(117,72,255,0.12)_17%,rgba(0,0,0,0)_42%)]";
  const diffusedGlow =
    intensity === "dim"
      ? "bg-[radial-gradient(ellipse_28%_62%_at_50%_44%,rgba(212,244,255,0.18)_0%,rgba(80,190,255,0.08)_18%,rgba(117,72,255,0.04)_36%,rgba(0,0,0,0)_74%)]"
      : "bg-[radial-gradient(ellipse_30%_64%_at_50%_44%,rgba(212,244,255,0.34)_0%,rgba(80,190,255,0.16)_18%,rgba(117,72,255,0.08)_38%,rgba(0,0,0,0)_76%)]";
  const glow = variant === "diffused" ? diffusedGlow : legacyGlow;
  const layerClass = layer === "page" ? "z-0" : "-z-10";

  return (
    <div
      aria-hidden="true"
      data-backdrop="tunnel"
      className={`pointer-events-none fixed inset-0 overflow-hidden bg-[#020305] ${layerClass} ${className}`}
    >
      <div className={`absolute inset-0 ${glow}`} />
      {variant === "diffused" ? (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_18%_52%_at_50%_47%,rgba(255,255,255,0.11)_0%,rgba(126,228,255,0.055)_24%,rgba(0,0,0,0)_72%)] blur-2xl" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,228,255,0.055)_0%,rgba(0,0,0,0)_38%,rgba(255,200,86,0.035)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.38)_46%,rgba(0,0,0,0.95)_82%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,228,255,0.08)_0%,rgba(0,0,0,0)_34%,rgba(255,200,86,0.05)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.45)_45%,rgba(0,0,0,0.94)_78%)]" />
        </>
      )}
      {rings && (
        <>
          <div className="absolute left-1/2 top-[28%] h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10" />
          <div className="absolute left-1/2 top-[28%] h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10" />
          <div className="absolute left-1/2 top-[28%] h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
        </>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] opacity-20" />
    </div>
  );
}
