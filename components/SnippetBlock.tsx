// src/components/SnippetBlock.tsx
interface SnippetProps {
  title: string;
  content: string;
  label?: string;
}

export default function SnippetBlock({ title, content, label = "DATA_STREAM" }: SnippetProps) {
  return (
    <div className="group border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-500 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[8px] tracking-[0.3em] opacity-30 font-bold uppercase">{label}</span>
        <div className="w-1 h-1 bg-white opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
      </div>
      <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-2 text-white/90">{title}</h3>
      <p className="text-[11px] leading-relaxed opacity-40 font-light group-hover:opacity-70 transition-opacity">
        {content}
      </p>
    </div>
  );
}