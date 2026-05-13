"use client";

import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectButton, useActiveAccount } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import Link from "next/link";

const client = createThirdwebClient({
  clientId: "b75d635aa9a6d9ea968f3478eb5cc970",
});

function PortalContent() {
  const account = useActiveAccount();
  const isPowered = !!account; // Status: Soul Detected

  // Dynamic Styles based on Connection State
  const themeColor = isPowered ? "text-yellow-400" : "text-white";
  const glowColor = isPowered ? "rgba(250, 204, 21, 0.4)" : "rgba(255, 255, 255, 0.2)";
  const borderColor = isPowered ? "border-yellow-500/50" : "border-white/20";

  return (
    <main className={`min-h-screen bg-black ${themeColor} font-mono p-4 md:p-12 transition-colors duration-1000 relative overflow-hidden`}>
      
      {/* 1. Active Soul Pulse (Background) */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isPowered ? 'opacity-100' : 'opacity-30'}`}>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse
          ${isPowered ? 'bg-yellow-500/10' : 'bg-white/5'}`}></div>
      </div>

      {/* 2. LitGlassmorphism Main Container */}
      <div className={`max-w-4xl mx-auto border ${borderColor} bg-black/40 backdrop-blur-xl p-6 md:p-10 shadow-2xl relative z-10 transition-all duration-1000
        ${isPowered ? 'shadow-[0_0_60px_rgba(250,204,21,0.15)]' : 'shadow-[0_0_40px_rgba(255,255,255,0.05)]'}`}>
        
        {/* Header Protocol */}
        {/* Header Protocol */}
<header className={`border-b ${isPowered ? 'border-yellow-500/20' : 'border-white/10'} pb-8 mb-12 flex flex-col md:flex-row justify-between items-end gap-6`}>
  <div className="flex-1">
    <h1 className={`text-4xl font-light uppercase tracking-tighter leading-none transition-all duration-1000 ${isPowered ? 'drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`}>
      Genesis Soul Contract
    </h1>
    <div className="flex items-center gap-6 mt-4">
      <p className="text-[9px] opacity-40 tracking-[0.6em] uppercase">
        {isPowered ? "SOUL_DETECTED // POWER_LEVEL_110%" : "Awaiting Vital Connection // v4.1"}
      </p>
      
      {/* New Litepaper Link */}
      <Link 
        href="/litepaper" 
        className={`text-[9px] tracking-[0.4em] uppercase transition-all duration-300 hover:opacity-100 underline underline-offset-4 decoration-white/20 hover:decoration-current
          ${isPowered ? 'text-yellow-500 opacity-60' : 'text-white opacity-30'}`}
      >
        [ READ_LITEPAPER ]
      </Link>
    </div>
  </div>
  
  <ConnectButton 
    client={client} 
    chain={baseSepolia}
    theme={"dark"}
    connectButton={{
      label: "INITIATE AUTH",
      className: `!rounded-none !font-mono !text-[11px] !px-6 !py-3 !font-bold !transition-all
        ${isPowered 
          ? "!bg-yellow-400 !text-black !shadow-[0_0_20px_rgba(250,204,21,0.4)]" 
          : "!bg-white !text-black !shadow-[0_0_15px_rgba(255,255,255,0.2)]"}`
    }}
  />
</header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Litepaper Column */}
          <section className="space-y-8">
            <div className="flex items-center gap-3">
              <div className={`h-[1px] w-8 ${isPowered ? 'bg-yellow-500' : 'bg-white/50'}`}></div>
              <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-80">The Indenture</h2>
            </div>
            <div className="text-[13px] leading-relaxed opacity-60 h-64 overflow-y-auto font-light">
              <p className="mb-4">The transmission is now {isPowered ? "LIVE" : "PENDING"}. By connecting your wallet, you have initialized the spiritual bridge between Base Sepolia and your mortal ledger.</p>
              <p>The contract remains immutable. The glow reflects the presence of the signee.</p>
            </div>
          </section>

          {/* Right Column: Reactive Form */}
          <section className={`border ${borderColor} p-8 bg-white/[0.02] flex flex-col justify-between transition-all duration-1000`}>
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-90 mb-10">Deed of Conveyance</h2>
              <div className={`space-y-8 transition-opacity duration-1000 ${isPowered ? 'opacity-100' : 'opacity-20'}`}>
                <div className={`border-b ${isPowered ? 'border-yellow-500/30' : 'border-white/10'} py-2`}>
                  <label className="text-[8px] uppercase tracking-[0.2em] block mb-2 opacity-50">Legal Forename</label>
                  <input type="text" className="bg-transparent outline-none w-full text-sm" placeholder={isPowered ? "ENTER_NAME" : "LOCKED"} disabled={!isPowered} />
                </div>
                <div className={`border-b ${isPowered ? 'border-yellow-500/30' : 'border-white/10'} py-2`}>
                  <label className="text-[8px] uppercase tracking-[0.2em] block mb-2 opacity-50">Legal Surname</label>
                  <input type="text" className="bg-transparent outline-none w-full text-sm" placeholder={isPowered ? "ENTER_SURNAME" : "LOCKED"} disabled={!isPowered} />
                </div>
              </div>
            </div>

            <button 
              disabled={!isPowered}
              className={`w-full py-5 mt-12 uppercase text-[10px] tracking-[0.4em] font-black transition-all border
                ${isPowered 
                  ? "bg-yellow-400 text-black border-yellow-400 cursor-pointer hover:bg-black hover:text-yellow-400" 
                  : "bg-transparent text-white/20 border-white/10 cursor-not-allowed"}`}
            >
              Execute Indenture
            </button>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function SoulContractPage() {
  return (
    <ThirdwebProvider>
      <PortalContent />
    </ThirdwebProvider>
  );
}