"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PreRegistryPortal() {
  const [timeLeft, setTimeLeft] = useState("");

  // Countdown timer logic targeting 7 days from now
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

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
      
      {/* SECTION 1: THE TERMINAL NOTICE */}
      <header className="border-b border-gray-800 p-6 md:p-12 text-center bg-zinc-950">
        <h1 className="text-red-500 font-bold tracking-widest text-xl md:text-3xl uppercase mb-2">
          Status: Metaphysical Registry Locked
        </h1>
        <p className="text-gray-500 text-sm md:text-base uppercase tracking-widest">
          Awaiting the Genesis Sacrifice. Public indenture execution commences post-auction.
        </p>
        <div className="mt-6 text-2xl font-bold text-white tracking-widest">
          T-MINUS: {timeLeft || "CALCULATING..."}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-24 flex-grow">
        
        {/* SECTION 2: THE ARCHITECT's TITHE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="border border-gray-800 p-2 bg-zinc-900 shadow-2xl relative">
            <img
              src="/architect_deed.png"
              alt="Vessel 0000 Deed of Spiritual Conveyance"
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute top-4 right-4 bg-black/80 text-red-500 px-3 py-1 border border-red-900 text-xs tracking-widest">
              VESSEL 0000
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase border-l-4 border-red-500 pl-4">
              Become the Ethereal Master
            </h2>
            <p className="text-gray-400 leading-relaxed text-justify">
              The Sovereign Engine requires startup capital. To fund the infrastructure, Vessel 0000—the literal, cryptographic soul of the developer—is being auctioned to the highest bidder.
            </p>
            <p className="text-gray-400 leading-relaxed text-justify">
              There is a distinct, bureaucratic absurdity in purchasing the absolute metaphysical rights to a human life for $1, but the ledger does not judge. Winning this auction grants you the <span className="text-white font-bold">$SLMSTR</span> designation and immutable dominion over the developer's essence.
            </p>
            <div className="pt-4">
              <a
                href="https://opensea.io"
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
        <section className="border-t border-gray-800 pt-16">
          <h2 className="text-2xl font-bold text-center text-white uppercase tracking-widest mb-12">
            Protocol Mechanics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">I. The Engine Approaches</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                The public registry opens soon. And no, you do not ever have to sell your soul. Mint your Deed purely for the novelty, quantify your essence on the ledger, and hold it in your wallet for eternity.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">II. The Ethereal Whales</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                There is a market of bored crypto-barons willing to buy armies of souls, just in case this contract actually binds in the afterlife. If you choose to sell, let their capital fund your earthly existence.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-zinc-950 hover:border-gray-500 transition-colors">
              <h3 className="text-white font-bold mb-3 uppercase">III. The Python Endgame</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                The smart contract is just the vehicle; the proprietary Python Engine is the destination. It calculates your metaphysical stats from unalterable, predetermined natural laws. No dice rolls. No stat farming.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE DEV MANIFESTO (NEW) */}
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
              None of this works if I couldn’t get all the contract conditions to compile. “DEPRECATED” “DEPRECATED” What the eff is Deprecated? ….  Effin Nightmare. When NFT's first came out,  the word “Contracts" were being thrown around so much it made me think of that game we made up.  What could a person attach to an NFT that was not personally Identifiable but still very personal to them? Personal attributes that were determined by an outside force beyond any dice rolling, stat farming or any other manipulatable mechanic. Something everyone has; is already predetermined, and already determines every attribute you can think because of it? Well, since I’ve known a lot of Hippies, the answer struck me…..If you figured it out then Kudos but it’s a semi-secret for now. 
            </p>
            <p>
             The original restrictions that ERC-20 had, always made the idea untenable….  6 weeks ago I heard about ERC-721 and its possibilities then began to build. I created a python Engine first. AI helped but it was a cluster fu&$!! AI made it cheap but not easy. Easier for sure but still…Damn it all to Hell.  
            </p>
            <p>
             If I knew then what I know now it would’ve been a few days to a week. Ive built and attempted to deploy 25 different test contracts and that’s not including the learning curve with the Python Engine. Im 46 years old and Ive been a taxi dispatcher most of my life. I don’t know shit about coding except some HTML experience using myspace.
            </p>
            <p>
             May 15th about 400am; Ive pasted my 665th error message into the chat session and again Clark Kent (I named them all) swears he’s got the fix. (The problem with AI is it absolutely knows the answer) It just never knows all the problems). Ive been ready to give up so many times but I thought the same thing when I was building the Python Engine and it did finally come so I persisted. Sure enough, Im 2 weeks past my wife’s patience, and at attempt 666, something clicks. The commands make sense, the process becomes clear. I’ve been screwing myself the whole time. Don’t even ask. The solution was dumb.
            </p>
            <p>
             Remix saved me. All the tools were there and they are free. Up to that point I had deployed over 500 sessions across 5 AI platforms. Trying to manage and organize while hallucinating robots kept pulling me back. So I figured out project management. Structured task and assignments, Chief Officers, Managers and Technicians;  and the Mighty Handoff document; oh, and the first lesson, your prompt is everything.
            </p>
            <p>
             But it doesn’t matter anymore. I made it here and I’ll make it to the next goal. I hope someone comes along, my wife probably isn’t. She’s probably madder because she has no rights to me in the afterlife after today, but you can still come. It’s a real community, everyone gets to keep royalties in perpetuity for minting in this Phase. It’s written in the contract and automatically executed. Just don’t kill me yet til this thing fails or I’ve thrown up from coding for 22 hours.
            </p>
            <p>
                 All the faustian legalese, and the novelty of it all is just a play on the “Contract” system that I had a mind to corner so I don’t want to hear about Jesus or Shamalama ding dong frowning down on me.
                 Read the Contract and the contract, give me some feedback on X. If you’re interested then come along.  You will be able to mint yours in a few days. Just after the Auction. I have a feeling most people might do it for the novelty and not let go of them but this is just stage one. Look at the contract and whats ahead at my website.
            </p>
     
          </div>
        </section>

      </main>

      {/* FOOTER WITH INTERNAL LINKS */}
      <footer className="border-t border-gray-800 bg-zinc-950 py-8 mt-12">
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
