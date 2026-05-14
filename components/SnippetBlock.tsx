import Image from "next/image";

interface SnippetProps {
  title: string;
  content: string;
  label?: string;
  image?: string;
}

export default function SnippetBlock({ title, content, label = "DATA_STREAM", image }: SnippetProps) {
  return (
    <div className="group relative border border-white/10 bg-black/20 p-8 backdrop-blur-xl transition-all duration-700 hover:border-white/30 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] overflow-hidden">
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] tracking-[0.4em] opacity-30 font-medium uppercase">{label}</span>
          <div className="w-1.5 h-1.5 bg-white shadow-[0_0_10px_white] opacity-0 group-hover:opacity-100 transition-all rounded-full animate-pulse"></div>
        </div>

        {image && (
          <div className="relative w-full h-48 mb-6 overflow-hidden border border-white/10 bg-white/5 grayscale group-hover:grayscale-0 transition-all duration-700">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover opacity-50 group-hover:opacity-100 transition-opacity"
              priority={true}
            />
          </div>
        )}
        
        <h3 className="text-lg font-bold tracking-[0.3em] uppercase mb-3 text-white/90">{title}</h3>
        <p className="text-base leading-relaxed opacity-40 font-light group-hover:opacity-80 transition-opacity">
          {content}
        </p>
      </div>
    </div>
  );
}

