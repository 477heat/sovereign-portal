"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PreRegistryPortal() {
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown timer logic targeting May 25th, 2026
  useEffect(() => {
    const targetDate = new Date('2026-05-25T00:00:00');

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft("00:00:00:00");
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono selection:bg-gray-700 flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01),rgba(255,255,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay"></div>
      
      {/* SECTION 1: THE TERMINAL NOTICE */}
      <header className="border-b border-gray-800 p-6 md:p-12 text-center bg-zinc-950">
        <h1 className="text-red-500 font-bold tracking-widest text-xl md:text-3xl uppercase mb-2">
          Status: Registry Initializing...
        </h1>
        <p className="text-gray-500 text-sm md:text-base uppercase tracking-widest">
          Awaiting the Architect Sacrifice. Public indenture execution commences Pre-auction.
        </p>
          <div className="mt-6 text-2xl font-bold text-white tracking-widest flex items-center justify-center gap-2">
            <span>T-MINUS: {timeLeft || "CALCULATING..."}</span>
            <span className="animate-pulse text-red-500">█</span>
          </div>
        
        {/* NEW HEADER LINKS */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8 text-xs md:text-sm font-bold tracking-widest text-gray-500">
          <Link href="/whitepaper" className="hover:text-red-500 transition-colors">[ WHITEPAPER ]</Link>
          <a href="https://opensea.io/SoulessWebDev" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">[ ARCHITECT'S DEED ]</a>
          <Link href="/vanguard" className="hover:text-red-500 transition-colors">[ VANGUARD ]</Link>
        </div>
      </header>

      {/* Reduced spacing from space-y-24 to space-y-12 */}
      <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-12 flex-grow">
        
        {/* SECTION 2: THE ARCHITECT's TITHE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="border border-gray-800 p-2 bg-zinc-900 shadow-2xl relative">
            <img
              src="/architect_deed.png"
              alt="Essence 0000 Deed of Spiritual Conveyance"
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 right-4 bg-black/80 text-red-500 px-3 py-1 border border-red-900 text-xs tracking-widest">
              ESSENCE 0000
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase border-l-4 border-red-500 pl-4">
              Personal Servant the Afterlife
            </h2>
            <p className="text-gray-400 leading-relaxed text-justify">
              First Real Soul Ever Sold to the Public. (Numerous closed door deals)
            </p>
            <p className="text-gray-400 leading-relaxed text-justify">
              Your eternal servant in the afterlife. The holder of this contract is immediately imbued with certain guarantees. Read the contract in its entierty before making an offer. <span className="text-white font-bold">$SLMSTR</span> designation and immutable dominion over the developer's essence (while you retain the asset, of course). 
            </p>
            <div className="pt-4">
              <a
                href="https://opensea.io/SoulessWebDev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-black font-bold uppercase tracking-widest px-8 py-4 hover:bg-red-500 hover:text-white transition-colors duration-300 w-full md:w-auto text-center"
              >
                [ INITIATE BID ]
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3: PROTOCOL PROSPECTUS (UPDATED BLOCKS) */}
        <section className="border-t border-gray-800 pt-8">
          <h2 className="text-2xl font-bold text-center text-white uppercase tracking-widest mb-12">
            Protocol Mechanics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">I. The Engine Initialization</h3>
              <p className="text-gray-600 group-hover:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                SovEngine.xyz is rolling out its Engine 4.6. It is  used to determine attributes and character stats based on Real Identity and your bday.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">II. Collectors Wet Dream</h3>
              <p className="text-gray-600 group-hover:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                Each contract belongs to a real person and each have their own set of Attributes tied to their existence allowing bringing a demand for tradeability. Use the engine and get your soul stats.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">III. Personal Data</h3>
              <p className="text-gray-600 group-hover:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                Its encrypted then burned as a hash onto the contract that only the backend engine can decipher. We purge your personal data from our system and only keep the Decryption Key.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE DEV MANIFESTO */}
        <section className="border border-gray-800 bg-zinc-900 p-6 md:p-12 relative shadow-2xl">
          <div className="absolute top-0 left-0 bg-red-900 text-white text-xs px-2 py-1 uppercase tracking-widest font-bold">
            ARCHITECT_LOG // MAY 2026
          </div>
          <div className="mt-4 space-y-4 text-gray-400 text-sm leading-relaxed font-sans">
            <p>
              Eternal Servitude for a few bucks. Why not.
            </p>
            <p>
              When we were kids my buddy made me read <em>Memnoch the Devil</em> by Anne Rice. Scared religion right out of me. We thought up a game where we collected souls from anyone we could trick into signing a contract. We even had little business cards that we cut at the library from printer paper. The caveat was, the person had to ask you for something before you proposed the signing of it away. We imagined collecting everyone in our family, our friends, my grandma! Anyway, that was when we were 12 and we never got a single one. Here I am now throwing mine to the OpenSea.
            </p>
            <p>
              When NFTs first came out, the word “Contracts” was being thrown around so much it made me think of that game. What could a person attach to an NFT that was not personally identifiable but still very personal to them? Personal attributes determined by an outside force—beyond any dice rolling, stat farming, or manipulatable mechanic. Something everyone has; is already predetermined, and determines every attribute you can think of. Well, since I’ve known a lot of Hippies, the answer struck me. If you figured it out, kudos, but it’s a semi-secret for now.
            </p>
            <p>
              The original restrictions of ERC-20 made the idea untenable. Six weeks ago I heard about ERC-721 and its possibilities, and I began to build. I created a Python Engine first. AI helped, but it was a cluster fu&#36;&amp;!! AI made it cheap, but not easy. Easier for sure but still… Damn it all to Hell.
            </p>
            <p>
              If I knew then what I know now, it would’ve been a few days to a week. I’ve built and attempted to deploy 25 different test contracts, and that’s not including the learning curve with the Python Engine. I’m 46 years old and I’ve been a taxi dispatcher most of my life. I don’t know shit about coding except some HTML experience using MySpace.
            </p>
            <p>
              May 15th, about 4:00 AM; I’ve pasted my 665th error message into the chat session and again Clark Kent (I named them all) swears he’s got the fix. (The problem with AI is it absolutely knows the answer. It just never knows all the problems). I’ve been ready to give up so many times, but I thought the same thing building the Python Engine and it finally came. Sure enough, I’m 2 weeks past my wife’s patience, and on attempt 666, something clicks. The commands make sense, the process becomes clear. I’ve been screwing myself the whole time. Don’t even ask. The solution was dumb.
            </p>
            <p>
              Remix saved me. All the tools were there and they are free. Up to that point I had deployed over 500 sessions across 5 AI platforms trying to manage and organize while hallucinating robots kept pulling me back. So I figured out project management. Structured tasks, Chief Officers, Managers, Technicians, the Mighty Handoff document; oh, and the first lesson: your prompt is everything.
            </p>
            <p>
              But it doesn’t matter anymore. I made it here and I’ll make it to the next goal. I hope someone comes along. My wife probably isn’t. She’s probably madder because she has no rights in the afterlife after today.
            </p>
            <p>
              All the Faustian legalese and the novelty of it all is just a fun little play on the “Contract” system that I had a mind to corner. You will be able to mint yours in a few days. And no, you don't have to sell it. Maybe its the Novelty, Maybe its desperation, you can join me anyway. 
            </p>
          </div>
        </section>

      </main>

      {/* FOOTER WITH INTERNAL LINKS */}
      <footer className="border-t border-gray-800 bg-zinc-950 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-gray-500 tracking-widest">
            <Link href="/Economics" className="hover:text-white transition-colors">[ ECONOMICS ]</Link>
            <Link href="/portal" className="hover:text-white transition-colors">[ PORTAL ]</Link>
            <Link href="/vanguard" className="hover:text-white transition-colors">[ VANGUARD CHARTER ]</Link>
            <Link href="/whitepaper" className="hover:text-white transition-colors">[ WHITEPAPER ]</Link>
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-widest text-center md:text-right">
            © 2026 Sovereign Engine.<br/>Fiat Lux. Caveat Emptor. Memento Mori.
          </div>
        </div>
      </footer>
    </div>
  );
}
