"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";

// Client ID integrated to satisfy Vercel prerendering requirements
const client = createThirdwebClient({
  clientId: "b75d635aa9a6d9ea968f3478eb5cc970",
});

export default function SoulContractPage() {
  return (
    <main className="min-h-screen bg-[#020202] text-green-500 font-mono p-4 md:p-12 selection:bg-green-500 selection:text-black relative">
      {/* CRT Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-50"></div>

      <div className="max-w-4xl mx-auto border border-green-900 bg-black p-6 md:p-10 shadow-[0_0_25px_rgba(0,255,0,0.15)] relative z-10">
        
        {/* Header Protocol */}
        <header className="border-b border-green-900 pb-6 mb-10 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Genesis Soul Contract</h1>
            <p className="text-[10px] opacity-50 tracking-[0.4em] mt-2">DECENTRALIZED SPIRITUAL LEDGER // V.4.1</p>
          </div>
          <div className="border border-green-500/20 p-1">
            <ConnectButton 
              client={client} 
              chain={baseSepolia}
              theme={"dark"}
              connectButton={{
                label: "INITIATE AUTH",
                className: "!bg-transparent !border !border-green-500 !text-green-500 !rounded-none !font-mono !text-[10px] !px-4 !py-2 hover:!bg-green-500 hover:!text-black !transition-all"
              }}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Left Column: Litepaper Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-widest">Protocol: Litepaper</h2>
            </div>
            
            <div className="text-[12px] leading-relaxed opacity-80 h-80 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-green-900 text-justify">
              <p className="mb-4 text-green-400 font-bold underline">SECTION 1.1: THE DIGITAL ANCHOR</p>
              <p className="mb-4">The Genesis Soul Contract is not merely code; it is a permanent indenture bound to the Base Sepolia testnet. It codifies the transition of metaphysical assets into immutable data blocks.</p>
              
              <p className="mb-4 text-green-400 font-bold underline">SECTION 1.2: INFRASTRUCTURE</p>
              <p className="mb-4">Utilizing the Thirdweb v5 SDK, this portal manages the connection between temporal wallets and the Genesis engine. Every interaction is logged within the bureaucratic void of the blockchain.</p>
              
              <p className="mb-4 text-green-400 font-bold underline">SECTION 1.3: FUTURE ENFORCEMENT</p>
              <p className="mb-4">"One Human, One Soul." While currently in aesthetic mode, future iterations will implement Coinbase EAS (Ethereum Attestation Service) to verify biological uniqueness before conveyance can proceed.</p>
              
              <div className="mt-8 pt-4 border-t border-green-900 italic opacity-60">
                "In the silence of the block, the contract remains eternal."
              </div>
            </div>
          </section>

          {/* Right Column: Interactive Form Placeholder */}
          <section className="border border-green-900/50 p-6 bg-green-950/5 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xs font-bold uppercase underline decoration-double">Deed of Conveyance</h2>
                <span className="text-[8px] opacity-40">FORM_REF: GSC-001</span>
              </div>
              
              <div className="space-y-6 opacity-40 select-none">
                <div className="border-b border-green-900/50 py-1">
                  <label className="text-[9px] uppercase tracking-tighter block mb-1">Mortal First Name</label>
                  <div className="text-sm italic">Awaiting verification...</div>
                </div>
                <div className="border-b border-green-900/50 py-1">
                  <label className="text-[9px] uppercase tracking-tighter block mb-1">Mortal Last Name</label>
                  <div className="text-sm italic">Awaiting verification...</div>
                </div>
                <div className="border-b border-green-900/50 py-1">
                  <label className="text-[9px] uppercase tracking-tighter block mb-1">Temporal Origin (DOB)</label>
                  <div className="text-sm italic">-- / -- / ----</div>
                </div>
              </div>
            </div>

            <button 
              disabled 
              className="w-full border border-green-900 text-green-900 py-4 mt-8 uppercase text-[10px] tracking-[0.3em] font-bold cursor-not-allowed transition-all"
            >
              Execute Indenture
            </button>
          </section>
        </div>

        {/* Bureaucratic Footer */}
        <footer className="mt-12 pt-4 border-t border-green-900 text-[9px] uppercase opacity-40 flex flex-wrap justify-between gap-4">
          <div className="flex gap-4">
            <span>Status: Operational</span>
            <span>Network: Base Sepolia</span>
          </div>
          <span>© 2026 Sovereign Portal Labs // No Rights Reserved</span>
        </footer>
      </div>
    </main>
  );
}