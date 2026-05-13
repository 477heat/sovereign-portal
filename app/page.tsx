"use client";

import { createThirdwebClient } from "thirdweb";
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: "b75d635aa9a6d9ea968f3478eb5cc970",
});

export default function SoulContractPage() {
  return (
    <ThirdwebProvider> 
      <main className="min-h-screen bg-[#000000] text-white font-mono p-4 md:p-12 selection:bg-white selection:text-black relative overflow-hidden">
        
        {/* White Ambient Glow Orbs */}
        <div className="fixed -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto border border-white/20 bg-black/40 backdrop-blur-md p-6 md:p-10 shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10">
          
          {/* Header Protocol */}
          <header className="border-b border-white/10 pb-8 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-4xl font-light uppercase tracking-tighter leading-none drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                Genesis Soul Contract
              </h1>
              <p className="text-[9px] opacity-40 tracking-[0.6em] mt-4 uppercase">Bureaucratic Portal // Identity Gate v4.1</p>
            </div>
            
            <div className="group">
              <ConnectButton 
                client={client} 
                chain={baseSepolia}
                theme={"dark"}
                connectButton={{
                  label: "INITIATE AUTH",
                  className: "!bg-white !text-black !border !border-white !rounded-none !font-mono !text-[11px] !px-6 !py-3 !font-bold hover:!bg-black hover:!text-white !transition-all !shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                }}
              />
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Left Column: Litepaper */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-white/50"></div>
                <h2 className="text-[11px] font-bold uppercase tracking-[0.3em] opacity-80">The Indenture</h2>
              </div>
              
              <div className="text-[13px] leading-relaxed opacity-60 h-80 overflow-y-auto pr-6 scrollbar-hide text-justify font-light">
                <p className="mb-6"><span className="text-white font-bold tracking-widest block mb-2 text-[10px]">ARTICLE I: CONVEYANCE</span> 
                The Genesis Soul Contract represents an immutable ledger entry on the Base Sepolia network. By interacting with this portal, the entity acknowledges the digital capture of metaphysical signatures.</p>
                
                <p className="mb-6"><span className="text-white font-bold tracking-widest block mb-2 text-[10px]">ARTICLE II: PROTOCOL</span> 
                Powered by Thirdweb v5, our architecture ensures absolute synchronization between the user's temporal wallet and the blockchain's eternal state.</p>
                
                <p className="mb-6"><span className="text-white font-bold tracking-widest block mb-2 text-[10px]">ARTICLE III: SOVEREIGNTY</span> 
                Future gates will mandate Coinbase EAS verification to ensure "One Human, One Soul" integrity. This is a cold, clinical record of existence.</p>
              </div>
            </section>

            {/* Right Column: High-Glow Form */}
            <section className="border border-white/10 p-8 bg-white/[0.02] flex flex-col justify-between shadow-inner">
              <div>
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-[10px] font-bold uppercase tracking-widest opacity-90 underline underline-offset-8 decoration-white/20">Deed of Conveyance</h2>
                  <span className="text-[8px] opacity-30 font-bold">REF: GSC-001</span>
                </div>
                
                <div className="space-y-8 opacity-20 select-none">
                  <div className="border-b border-white/10 py-2">
                    <label className="text-[8px] uppercase tracking-[0.2em] block mb-2 opacity-50">Legal Forename</label>
                    <div className="text-sm tracking-widest italic">AWAITING_AUTH...</div>
                  </div>
                  <div className="border-b border-white/10 py-2">
                    <label className="text-[8px] uppercase tracking-[0.2em] block mb-2 opacity-50">Legal Surname</label>
                    <div className="text-sm tracking-widest italic">AWAITING_AUTH...</div>
                  </div>
                </div>
              </div>

              <button 
                disabled 
                className="w-full bg-transparent border border-white/10 text-white/20 py-5 mt-12 uppercase text-[10px] tracking-[0.4em] font-black cursor-not-allowed transition-all"
              ></button>