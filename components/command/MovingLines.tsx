const vectorLines = [
  "M4 18 C22 8 38 9 52 22 S82 37 96 18",
  "M2 56 C24 44 37 64 51 52 S78 31 98 48",
  "M12 88 C31 74 44 91 62 78 S84 64 96 74",
  "M18 4 L36 22 L58 14 L82 32",
  "M8 72 L24 58 L44 68 L66 42 L92 52",
] as const;

export function MovingLines() {
  return (
    <svg
      aria-hidden="true"
      className="command-moving-lines"
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {vectorLines.map((line) => (
        <path className="command-moving-lines__path" d={line} key={line} />
      ))}
    </svg>
  );
}
