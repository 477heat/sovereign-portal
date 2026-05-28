interface BackgroundHashStreamProps {
  className?: string;
  variant?: "grid" | "right";
}

const hashes = [
  "0xa7193d5c...5ea65",
  "0x1b7e993a...8453",
  "0xfac7d8b2...7c91",
  "0x7005e8ef...0dde",
  "0x5380a1d4...7210",
  "0x920d6b3e...2981",
  "0x11d059ac...c0de",
  "0xd2f86241...ba5e",
  "0x468bc01a...e777",
  "0xb6139d28...b17c",
  "0x9e04f25d...0b01",
  "0x41ac7eb9...700b",
];

const columns = [hashes, hashes.slice(3), hashes.slice(6), hashes.slice(1)];

function StreamColumn({
  column,
  index,
}: {
  column: string[];
  index: number;
}) {
  return (
    <div
      className={`hash-stream-column flex flex-col gap-5 ${
        index % 2 === 0 ? "text-cyan-100/70" : "text-white/70"
      }`}
    >
      {[...column, ...column].map((hash, hashIndex) => (
        <div
          className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em]"
          key={`${hash}-${hashIndex}`}
        >
          {hash}
        </div>
      ))}
    </div>
  );
}

export function BackgroundHashStream({
  className = "",
  variant = "grid",
}: BackgroundHashStreamProps) {
  if (variant === "right") {
    return (
      <div
        className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
        aria-hidden="true"
      >
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/78 via-black/28 to-transparent md:w-44" />
        <div className="absolute bottom-0 right-4 top-0 flex w-28 items-stretch justify-center overflow-hidden opacity-[0.18] md:right-8 md:w-36 md:opacity-[0.24]">
          <StreamColumn column={hashes} index={0} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,10,14,0.8)_0%,rgba(0,0,0,0)_34%,rgba(0,0,0,0)_66%,rgba(4,10,14,0.8)_100%)]" />
      <div className="relative grid h-full grid-cols-2 gap-x-8 px-4 py-8 opacity-[0.16] md:grid-cols-4 md:gap-x-14 md:px-10 md:opacity-[0.22]">
        {columns.map((column, index) => (
          <StreamColumn column={column} index={index} key={column[0]} />
        ))}
      </div>
    </div>
  );
}
