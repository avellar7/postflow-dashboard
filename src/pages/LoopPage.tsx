import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { mockAccounts, mockFolders } from '@/data/mock';
import { toast } from 'sonner';
import { RefreshCw, Infinity, Upload, FlipHorizontal, Palette, ZoomIn, SlidersHorizontal } from 'lucide-react';

export default function LoopPage() {
  const [infiniteLoop, setInfiniteLoop] = useState(false);
  const [cycles, setCycles] = useState(3);
  const [interval, setInterval_] = useState(30);
  const [effects, setEffects] = useState({ mirror: false, invert: false, zoom: false, adjust: false });

  return (
    <DashboardLayout>
      <PageHeader
        title="Novo Loop"
        subtitle="Repita conteúdos automaticamente com intervalos configuráveis entre postagens."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Config */}
          <div className="glass-card p-6 space-y-5">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Conta</label>
              <select className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground">
                {mockAccounts.map(a => <option key={a.id}>{a.username}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Pasta da Biblioteca</label>
              <select className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground">
                {mockFolders.map(f => <option key={f.id}>{f.name} ({f.itemCount} itens)</option>)}
              </select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-2">
                <Infinity className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Loop infinito</p>
                  <p className="text-[10px] text-muted-foreground">Repete sem parar até ser interrompido</p>
                </div>
              </div>
              <button
                onClick={() => setInfiniteLoop(!infiniteLoop)}
                className={`w-10 h-5 rounded-full transition-colors relative ${infiniteLoop ? 'bg-primary' : 'bg-secondary'}`}
              >
                <span className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${infiniteLoop ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>

            {!infiniteLoop && (
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Ciclos</label>
                <input type="number" min={1} max={100} value={cycles} onChange={e => setCycles(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground" />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Intervalo entre postagens: {interval} min</label>
              <input type="range" min={5} max={120} value={interval} onChange={e => setInterval_(Number(e.target.value))}
                className="w-full accent-primary" />
              <p className="text-[10px] text-muted-foreground mt-1">Intervalos maiores são mais seguros para a saúde da conta.</p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20"
              onClick={() => toast.success('Loop configurado (mockado)')}>
              <RefreshCw className="w-4 h-4" /> Iniciar Loop
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Reel Cover */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Capa do Reel
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Personalize a capa que aparece no perfil.</p>

            <div className="border-2 border-dashed border-border/80 rounded-xl p-8 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Clique para enviar uma imagem</p>
              <p className="text-[10px] text-muted-foreground/60">JPG, PNG — 1080×1920 recomendado</p>
            </div>
          </div>

          {/* Effects */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Efeitos Visuais
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Aplique transformações visuais nos vídeos do loop.</p>

            {[
              { key: 'mirror' as const, label: 'Espelhar', desc: 'Inverte a imagem horizontalmente', icon: FlipHorizontal },
              { key: 'invert' as const, label: 'Inverter cores', desc: 'Aplica inversão cromática', icon: Palette },
              { key: 'zoom' as const, label: 'Zoom sutil', desc: 'Zoom leve centralizado', icon: ZoomIn },
              { key: 'adjust' as const, label: 'Ajustes leves', desc: 'Brilho e contraste aleatórios', icon: SlidersHorizontal },
            ].map(effect => (
              <div key={effect.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30 mb-2">
                <div className="flex items-center gap-3">
                  <effect.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{effect.label}</p>
                    <p className="text-[10px] text-muted-foreground">{effect.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEffects({ ...effects, [effect.key]: !effects[effect.key] })}
                  className={`w-10 h-5 rounded-full transition-colors relative ${effects[effect.key] ? 'bg-primary' : 'bg-secondary'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${effects[effect.key] ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}

            <p className="text-[10px] text-muted-foreground/60 mt-3">Esses efeitos são visuais e aplicados na hora da postagem.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
