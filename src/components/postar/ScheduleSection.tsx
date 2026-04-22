import { Zap, Clock } from 'lucide-react';

interface ScheduleSectionProps {
  mode: 'now' | 'scheduled';
  setMode: (m: 'now' | 'scheduled') => void;
  postMode: 'sequential' | 'burst';
  setPostMode: (m: 'sequential' | 'burst') => void;
  mediaCount: number;
  scheduledFor: string;
  setScheduledFor: (v: string) => void;
}

export function ScheduleSection({ mode, setMode, postMode, setPostMode, mediaCount, scheduledFor, setScheduledFor }: ScheduleSectionProps) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" /> Agendamento
      </h2>

      <div className="flex gap-1 p-1 bg-secondary/50 rounded-lg mb-5">
        <button
          onClick={() => setMode('now')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${mode === 'now' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Zap className="w-3 h-3 inline mr-1" /> Postar agora
        </button>
        <button
          onClick={() => setMode('scheduled')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${mode === 'scheduled' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Clock className="w-3 h-3 inline mr-1" /> Agendar
        </button>
      </div>

      <div className="space-y-4">
        {mode === 'scheduled' && (
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Data e hora</label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={e => setScheduledFor(e.target.value)}
              className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-2">Modo de postagem</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPostMode('sequential')}
              className={`p-3 rounded-xl border text-left transition-all ${postMode === 'sequential' ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'}`}
            >
              <p className="text-xs font-semibold text-foreground">Sequencial</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Mais seguro e estável</p>
            </button>
            <button
              onClick={() => setPostMode('burst')}
              className={`p-3 rounded-xl border text-left transition-all ${postMode === 'burst' ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-secondary/30 hover:bg-secondary/50'}`}
            >
              <p className="text-xs font-semibold text-foreground">Rajada</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Mais rápida</p>
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-xs font-semibold text-primary mb-2">Resumo da automação</p>
          <div className="space-y-1 text-xs text-foreground/70">
            <p>• {mediaCount} mídia(s) selecionada(s)</p>
            <p>• Modo: {postMode === 'sequential' ? 'Sequencial' : 'Rajada'}</p>
            <p>• Execução: {mode === 'now' ? 'Imediata' : `Agendada${scheduledFor ? ` — ${new Date(scheduledFor).toLocaleString('pt-BR')}` : ''}`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
