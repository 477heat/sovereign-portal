"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export default function SoulContractPage() {
  return (
    <main className="min-h-screen bg-[#020202] text-green-500 font-mono p-4 md:p-12 selection:bg-green-500 selection:text-black">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-50"></div>

      <div className="max-w-4xl mx-auto border border-green-900 bg-black p-6 md:p-10 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
        
        {/* Header Protocol */}
        <header className="border-b border-green-900 pb-6 mb-10">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter italic">Genesis Soul Contract</h1>
              <p className="text-[10px] opacity-50 tracking-[0.4em]">DECENTRALIZED SPIRITUAL LEDGER // V.4.1</p>
            </div>
            <ConnectButton 
              client={client} 
              chain={baseSepolia}
              theme={"dark"}
              connectButton={{
                label: "INITIATE AUTH",
                className: "!bg-transparent !border !border-green-500 !text-green-500 !rounded-none !font-mono !text-xs"
              }}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column: Litepaper / Bureaucratic Text */}
          <section className="space-y-6">
            <h2 className="text-sm font-bold bg-green-900/30 px-2 py-1 inline-block">LITEPAPER: THE INDENTURE</h2>
            <div className="text-[12px] leading-relaxed opacity-80 h-64 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-green-900">
              <p className="mb-4">1.0 THE CONVEYANCE: The Genesis Soul Contract serves as a permanent, immutable record of spiritual intent on the Base Sepolia network.</p>
              <p className="mb-4">2.0 THE ARCHITECTURE: Built using Thirdweb v5, our portal ensures that the separation of soul and software is handled with the utmost bureaucratic precision.</p>
              <p className="mb-4">3.0 ONE HUMAN, ONE SOUL: Future iterations will employ EAS (Ethereum Attestation Service) to prevent sybil attacks on the afterlife ledger.</p>
              <p className="italic border-l border-green-900 pl-4">"In the machine, we find the final signature."</p>
            </div>
          </section>

          {/* Right Column: Aesthetic Form Placeholder */}
          <section className="border border-green-900/50 p-6 bg-green-950/5 relative">
            <div className="absolute top-0 right-0 p-2 text-[8px] opacity-30">FORM_ID: 88-X</div>
            <h2 className="text-xs font-bold uppercase mb-6 underline decoration-double">Deed of Spiritual Conveyance</h2>
            
            <div className="space-y-4 opacity-40">
              <div className="border-b border-green-900 py-2">
                <span className="text-[9px] block">NAME_FIELD</span>
                <span className="text-sm">AWAITING_CONNECTION...</span>
              </div>
              <div className="border-b border-green-900 py-2">
                <span className="text-[9px] block">SURNAME_FIELD</span>
                <span className="text-sm">AWAITING_CONNECTION...</span>
              </div>
              <div className="border-b border-green-900 py-2">
                <span className="text-[9px] block">TEMPORAL_ORIGIN (DOB)</span>
                <span className="text-sm">XX/XX/XXXX</span>
              </div>
              
              <button disabled className="w-full border border-green-900 text-green-900 py-4 mt-4 uppercase text-[10px] tracking-widest cursor-not-allowed">
                Execute Indenture
              </button>
            </div>
          </section>

        </div>

        <footer className="mt-12 text-[9px] opacity-30 flex justify-between uppercase">
          <span>Encrypted via Terminal Protocol</span>
          <span>© 2026 Sovereign Portal Labs</span>
        </footer>
      </div>
    </main>
  );
}