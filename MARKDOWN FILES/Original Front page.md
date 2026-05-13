"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ThirdwebProvider, useActiveAccount } from "thirdweb/react";

function LitepaperContent() {
  const account = useActiveAccount();
  const isPowered = !!account;
  const [content, setContent] = useState("");

  // Fetch the markdown from the public folder
  useEffect(() => {
    fetch("/litepaper_v1.md")
      .then((res) => res.text())
      .then((text) => setContent(text))
      .catch((err) => setContent("# ERROR: Protocol Transmission Interrupted"));
  }, []);

  return (
    <main className={`min-h-screen bg-black font-mono p-6 md:p-24 transition-colors duration-1000 relative overflow-hidden ${isPowered ? 'text-yellow-400' : 'text-white'}`}>
      
      {/* Background Pulse */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 ${isPowered ? 'opacity-40' : 'opacity-10'}`}>
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] ${isPowered ? 'bg-yellow-500/20' : 'bg-white/10'}`}></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Navigation Bridge */}
        <nav className="mb-16">
          <Link href="/" className={`text-[10px] tracking-[0.4em] border px-4 py-2 transition-all ${isPowered ? 'border-yellow-500/40 hover:bg-yellow-500 hover:text-black shadow-[0_0_15px_rgba(250,204,21,0.2)]' : 'border-white/20 hover:bg-white hover:text-black'}`}>
            RETURN_TO_PORTAL
          </Link>
        </nav>

        {/* LitGlassmorphism Paper Shell */}
        <article className={`p-8 md:p-16 border bg-black/40 backdrop-blur-xl transition-all duration-1000 ${isPowered ? 'border-yellow-500/30 shadow-[0_0_50px_rgba(250,204,21,0.1)]' : 'border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]'}`}>
          <div className="prose prose-invert max-w-none 
            prose-headings:uppercase prose-headings:tracking-widest 
            prose-p:text-[14px] prose-p:leading-relaxed prose-p:opacity-70 
            prose-strong:text-white prose-strong:font-bold">
            
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl mb-12 border-b border-current pb-4 font-light italic" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg mt-12 mb-6 underline decoration-double underline-offset-8" {...props} />,
                p: ({node, ...props}) => <p className="mb-6" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        <footer className="mt-20 text-[9px] opacity-30 tracking-[0.3em] uppercase flex justify-between">
          <span>Document: litepaper_v1.md</span>
          <span>Genesis Soul Protocol</span>
        </footer>
      </div>
    </main>
  );
}

export default function LitepaperPage() {
  return (
    <ThirdwebProvider>
      <LitepaperContent />
    </ThirdwebProvider>
  );
}