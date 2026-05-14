// src/components/SnippetBlock.tsx
interface SnippetProps {
  title: string;
  content: string;
  label?: string;
}

export default function SnippetBlock({ title, content, label = "DATA_STREAM" }: SnippetProps) {
  return (
    <div className="group relative border border-white/10 bg-black/20 p-8 backdrop-blur-xl transition-all duration-700 hover:border-white/30 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] overflow-hidden">
      
      {/* Spectral Reveal: A subtle white light that follows the group hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[9px] tracking-[0.4em] opacity-30 font-medium uppercase group-hover:opacity-60 transition-opacity">{label}</span>
          <div className="w-1.5 h-1.5 bg-white shadow-[0_0_10px_white] opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full animate-pulse"></div>
        </div>
        
        <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase mb-3 text-white/90 group-hover:text-white transition-colors">
          {title}
        </h3>
        
        <p className="text-[12px] leading-relaxed opacity-40 font-light group-hover:opacity-80 transition-opacity duration-700">
          {content}
        </p>
      </div>

      {/* Decorative Corner Accent */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/5 group-hover:border-white/20 transition-all"></div>
    </div>
  );
}