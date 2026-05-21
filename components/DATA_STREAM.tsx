//import React, { useMemo } from 'react';

interface BackgroundHashStreamProps {
  className?: string;
}

/**
 * A performant, CSS-driven background layer that scrolls random hex strings.
 * Designed to feel like a "Deep Layer" of a digital ledger.
 */
export const BackgroundHashStream: React.FC<BackgroundHashStreamProps> = ({ className }) => {
  // Generate a fixed set of "fake" hashes so the component is predictable
  const hashes = useMemo(() => {
    return Array.from({ length: 30 }).map(() =>
      `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`
    );
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-[0.05] select-none ${className}`}
      aria-hidden="true"
    >
      <div className="animate-scroll-slow flex flex-col gap-4 py-4">
        {/* We repeat the array to ensure a seamless loop */}
        {[...hashes, ...hashes].map((hash, i) => (
          <div
            key={`${hash}-${i}`}
            className="text-[10px] font-mono text-white whitespace-nowrap"
          >
            {hash}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-slow {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-scroll-slow {
          animation: scroll-slow 60s linear infinite;
        }
      `}</style>
    </div>
  );
};
//  DATA_STREAM.tsx
//  
//
//  Created by Tony Brewer on 5/21/26.
//

