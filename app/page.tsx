"use client";

import { createThirdwebClient } from "thirdweb";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { baseSepolia } from "thirdweb/chains";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { EAS } from "@ethereum-attestation-service/eas-sdk";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});

export default function SoulContractPage() {
  const account = useActiveAccount();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configuration from Technical Specifications [cite: 3, 6]
  const EAS_ADDRESS = "0x4200000000000000000000000000000000000021"; 

  useEffect(() => {
    if (account?.address) {
      checkAttestation(account.address);
    } else {
      setIsVerified(null);
    }
  }, [account?.address]);

  async function checkAttestation(address: string) {
    setIsLoading(true);
    try {
      const provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
      const eas = new EAS(EAS_ADDRESS);
      eas.connect(provider as any);
      const attestation = await eas.getAttestation(address); 
      setIsVerified(!!attestation && !attestation.revocationTime);
    } catch (error) {
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-green-400 font-mono flex items-center justify-center p-4 selection:bg-green-500 selection:text-black">
      {/* Subtle Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] z-50"></div>

      <div className="max-w-2xl w-full border border-green-900/50 bg-black/80 backdrop-blur-sm p-8 shadow-[0_0_30px_rgba(0,50,0,0.3)] relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex justify-between items-center mb-8 border-b border-green-900 pb-4">
          <div className="text-xs tracking-widest uppercase opacity-60">
            Node: Base-Sepolia-01 // Auth: Required [cite: 2, 6]
          </div>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-900"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-900"></div>
            <div className="w-2 h-2 rounded-full bg-green-900"></div>
          </div>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase mb-2">Genesis Soul Contract</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-50">Bureaucratic Portal v4.1 [cite: 1]</p>
        </header>

        {/* Section A: Connection [cite: 4, 5] */}
        <section className="mb-10 flex flex-col items-center">
          <div className="w-full py-4 px-6 border border-dashed border-green-900/50 bg-green-950/5 mb-4 text-center">
             <p className="text-xs uppercase mb-4 opacity-70">Initialize Neural Link via Wallet</p>
             <ConnectButton 
                client={client} 
                chain={baseSepolia}
                theme={"dark"}
                connectButton={{
                  label: "INITIATE MINT",
                  className: "!bg-transparent !border !border-green-500 !text-green-500 !rounded-none hover:!bg-green-500 hover:!text-black !transition-all !font-mono !uppercase !text-xs !px-8"
                }}
              />
          </div>
        </section>

        {/* Section B & C: Verification & Form  */}
        {account && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center animate-pulse py-10">
                <span className="text-xs">SCANNING EAS REGISTRY FOR MORTAL SIGNATURE... [cite: 8]</span>
              </div>
            ) : isVerified === false ? (
              <div className="bg-red-950/20 border border-red-500/50 p-6 text-red-500 text-xs leading-relaxed animate-in fade-in zoom-in duration-300">
                <p className="font-bold mb-2 underline">[SYSTEM ALERT]: IDENTITY ATTESTATION FAILED</p>
                <p>Mortal verification required via Coinbase EAS. One Human, One Soul rule is currently in effect. Access to spiritual conveyance protocols is restricted. [cite: 7, 9]</p>
              </div>
            ) : isVerified === true && (
              <div className="animate-in slide-in-from-bottom-4 duration-700">
                <div className="border border-green-500/30 p-6">
                  <h2 className="text-sm font-bold uppercase mb-6 border-b border-green-900 pb-2 text-center underline decoration-double">
                    Deed of Spiritual Conveyance [cite: 10]
                  </h2>
                  
                  {/* Intake Form  */}
                  <form className="grid grid-cols-1 gap-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase opacity-50">First Name</label>
                        <input type="text" className="bg-transparent border-b border-green-900 focus:border-green-500 outline-none text-sm p-1" placeholder="MORTAL_NAME_01" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase opacity-50">Last Name</label>
                        <input type="text" className="bg-transparent border-b border-green-900 focus:border-green-500 outline-none text-sm p-1" placeholder="MORTAL_SURNAME" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase opacity-50">Date of Birth</label>
                      <input type="date" className="bg-transparent border-b border-green-900 focus:border-green-500 outline-none text-sm p-1 invert active:bg-green-500" />
                    </div>

                    <button 
                      type="submit" 
                      className="mt-4 w-full bg-green-500 text-black font-bold py-3 uppercase text-xs tracking-[0.2em] hover:bg-green-400 transition-colors"
                    >
                      Execute Indenture [cite: 12]
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Meta */}
        <footer className="mt-12 pt-4 border-t border-green-900/30 text-[9px] uppercase opacity-40 flex justify-between">
          <span>Secure Protocol: AES-256</span>
          <span>© 2026 Genesis Soul Entity</span>
        </footer>
      </div>
    </main>
  );
}