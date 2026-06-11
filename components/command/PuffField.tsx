const puffs = [
  { left: "12%", top: "18%", size: "0.42rem", delay: "0s" },
  { left: "74%", top: "14%", size: "0.3rem", delay: "0.8s" },
  { left: "86%", top: "58%", size: "0.48rem", delay: "1.7s" },
  { left: "22%", top: "74%", size: "0.34rem", delay: "2.4s" },
  { left: "52%", top: "38%", size: "0.28rem", delay: "3.2s" },
] as const;

export function PuffField() {
  return (
    <div aria-hidden="true" className="command-puff-field">
      {puffs.map((puff) => (
        <span
          className="command-puff-field__puff"
          key={`${puff.left}-${puff.top}`}
          style={{
            animationDelay: puff.delay,
            height: puff.size,
            left: puff.left,
            top: puff.top,
            width: puff.size,
          }}
        />
      ))}
    </div>
  );
}
