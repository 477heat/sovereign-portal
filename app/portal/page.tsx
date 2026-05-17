"use client";

import React from "react";
import Link from "next/link";
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";

function PortalContent() {
  const account = useActiveAccount();
  const isPowered = !!account;

  return (
    <main className={`min-h-screen bg-black font-mono p-6 md:p-24 transition-colors duration-1000 relative overflow-hidden ${isPowered ? 'text-yellow-400' : 'text-white'}`}>
      
      {/* Background Pulse */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isPowered ? 'opacity-40' : 'opacity-10'}`}>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] ${isPowered ? 'bg-yellow-500/20' : 'bg-white/10'}`}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
        {/* Navigation Bridge */}
        <nav className="absolute top-0 left-0 mb-16">
          <Link href="/" className={`text-[10px] tracking-[0.4em] border px-4 py-2 transition-all ${isPowered ? 'border-yellow-500/40 hover:bg-yellow-500 hover:text-black shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'border-white/20 hover:bg-white hover:text-black'}`}>
            RETURN_TO_HOME
          </Link>
        </nav>

        {/* Main Content */}
        <div className="text-center space-y-12">
          <h1 className="text-4xl md:text-6xl font-light tracking-[0.3em] uppercase">
            Mint Yours Soon
          </h1>

          <div className="flex justify-center">
            <Link 
              href="/architect_soul_contract.md"
              className={`group relative px-12 py-6 border text-lg tracking-[0.2em] uppercase transition-all duration-500 ${
                isPowered 
                ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black shadow-[0_0_30px_rgba(250,204,21,0.3)]' 
                : 'border-white text-white hover:bg-white hover:text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]'
              }`}
            >
              Architects Deed
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="absolute bottom-0 w-full text-[9px] opacity-30 tracking-[0.3em] uppercase flex justify-between items-center">
          <span>Genesis Soul Protocol</span>
          <Link href="/process_flow_chart.md" className="hover:opacity-100 transition-opacity">
            Process Flow Chart
          </Link>
        </footer>
      </div>
    </main>
  );
}

export default function PortalPage() {
  return (
    <ThirdwebProvider>
      <PortalContent />
    </ThirdwebProvider>
  );
}
