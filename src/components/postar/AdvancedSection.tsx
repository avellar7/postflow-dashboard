import { ShieldCheck } from 'lucide-react';

interface AdvancedSectionProps {
  smartProcessing: boolean;
  setSmartProcessing: (v: boolean) => void;
  metadataProfile: 'auto' | 'iphone' | 'android' | 'off';
  setMetadataProfile: (v: 'auto' | 'iphone' | 'android' | 'off') => void;
  variations: number;
  setVariations: (v: number) => void;
}

export function AdvancedSection({ smartProcessing, setSmartProcessing, metadataProfile, setMetadataProfile, variations, setVariations }: AdvancedSectionProps) {
  return (
    <div className="glass-card p-6 space-y-5">
      <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" /> Configurações avançadas
      </h2>

      {/* Smart Processing toggle */}
      <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${smartProcessing ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-secondary/30'}`}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <div>
            <p className="text-xs font-semibold text-foreground">Padronização inteligente</p>
            <p className="text-[10px] text-muted-foreground">Normalização automática de mídia</p>
          </div>
        </div>
        <button
          onClick={() => setSmartProcessing(!smartProcessing)}
          className={`w-10 h-5 rounded-full transition-colors relative ${smartProcessing ? 'bg-primary' : 'bg-secondary'}`}
        >
          <span className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${smartProcessing ? 'left-5' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Metadata profile */}
      <div>
        <label className="text-xs font-medium text-foreground block mb-0.5">Perfil de compatibilidade técnica</label>
        <p className="text-[10px] text-muted-foreground mb-3">Normalização de metadados para compatibilidade</p>
        <div className="flex gap-2">
          {([
            { value: 'auto', label: 'Auto' },
            { value: 'iphone', label: 'iPhone' },
            { value: 'android', label: 'Android' },
            { value: 'off', label: 'Desligado' },
          ] as const).map(opt => (
            <button
              key={opt.value}
              onClick={() => setMetadataProfile(opt.value)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${metadataProfile === opt.value ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/30'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Variations */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-foreground">Versões processadas por vídeo</label>
          <span className="text-xs font-bold text-primary">{variations}x</span>
        </div>
        <input type="range" min={1} max={5} value={variations} onChange={e => setVariations(Number(e.target.value))}
          className="w-full accent-primary" />
        <p className="text-[10px] text-muted-foreground mt-1">
          Cada vídeo gera {variations} {variations === 1 ? 'versão processada' : 'versões processadas diferentes'}.
        </p>
      </div>
    </div>
  );
}
