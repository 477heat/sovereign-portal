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
      Sovereign Engine Portal 
          </h1>
    <div className="flex items-center gap-6 mt-4">
      <p className="text-[9px] opacity-40 tracking-[0.6em] uppercase">
        {isPowered ? "SOUL_DETECTED // POWER_LEVEL_110%" : "Awaiting Vital Connection // v4.1"}
      </p>
      
"use client";
import Link from "next/link";
import SnippetBlock from "@/components/SnippetBlock"; // Using the '@' alias

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black text-white font-sans p-8 md:p-24 overflow-hidden relative">
      {/* 1. Header Section */}
      <header className="mb-24">
        <h1 className="text-6xl font-extralight uppercase tracking-[0.8em]">Genesis</h1>
      </header>

      {/* 2. Modular Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <SnippetBlock 
          title="The Protocol" 
          content="A decentralized spiritual ledger built on Base Sepolia, ensuring absolute immutability of the soul." 
        />
        <SnippetBlock 
          title="Identity Gate" 
          content="Future integration with Coinbase EAS will mandate a 'One Human, One Soul' attestation."
          label="AUTH_V4.1" 
        />
        <SnippetBlock 
          title="The Ledger" 
          content="Real-time synchronization between mortal wallets and eternal on-chain state." 
        />
      </div>

      {/* 3. Navigation CTA */}
      <div className="mt-24 text-center">
        <Link href="/portal" className="text-[10px] tracking-[0.6em] border border-white/20 px-12 py-4 hover:bg-white hover:text-black transition-all">
          ENTER_PORTAL
        </Link>
      </div>
    </main>
  );
}