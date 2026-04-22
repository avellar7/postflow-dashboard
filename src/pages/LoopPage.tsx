import { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAccounts } from '@/hooks/useAccounts';
import { useFolders } from '@/hooks/useFolders';
import { useLoops } from '@/hooks/useLoops';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { RefreshCw, Infinity, Upload, FlipHorizontal, Palette, ZoomIn, SlidersHorizontal, ShieldCheck, EyeOff, Loader2, CheckCircle2, AlertCircle, X, Trash2 } from 'lucide-react';

/* ── Loop creation form ── */
function LoopForm({ accounts, folders, createLoop, uploadFiles }: {
  accounts: any[];
  folders: any[];
  createLoop: any;
  uploadFiles: any;
}) {
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [infiniteLoop, setInfiniteLoop] = useState(false);
  const [cycles, setCycles] = useState(3);
  const [interval, setInterval_] = useState(30);
  const [effects, setEffects] = useState({ mirror: false, invert: false, zoom: false, blur: false });
  const [smartProcessing, setSmartProcessing] = useState(false);
  const [metadataProfile, setMetadataProfile] = useState<'auto' | 'iphone' | 'android' | 'off'>('auto');
  const [variations, setVariations] = useState(3);

  const [coverPath, setCoverPath] = useState<string | null>(null);
  const [coverName, setCoverName] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [draggingCover, setDraggingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const activeEffectsCount = Object.values(effects).filter(Boolean).length;

  const handleCoverFiles = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      const { toast } = await import('sonner');
      toast.error('Formato não suportado. Use JPG, PNG ou WEBP.');
      return;
    }
    setCoverUploading(true);
    try {
      const results = await uploadFiles([file]);
      if (results.length > 0) {
        setCoverPath(results[0].file_url);
        setCoverName(results[0].title);
      }
    } finally {
      setCoverUploading(false);
    }
  }, [uploadFiles]);

  const handleCoverDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDraggingCover(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleCoverFiles(files);
  }, [handleCoverFiles]);

  const handleCoverInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) handleCoverFiles(files);
    e.target.value = '';
  };

  const handleCreateLoop = () => {
    createLoop.mutate({
      account_id: selectedAccountId || null,
      folder_id: selectedFolderId || null,
      is_infinite: infiniteLoop,
      cycles: infiniteLoop ? null : cycles,
      interval_minutes: interval,
      effects: effects as any,
      cover_url: coverPath,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Conta</label>
            <select className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
              value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)}>
              <option value="">Selecione...</option>
              {accounts.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">Pasta da Biblioteca</label>
            <select className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
              value={selectedFolderId} onChange={e => setSelectedFolderId(e.target.value)}>
              <option value="">Selecione...</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
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
            <button onClick={() => setInfiniteLoop(!infiniteLoop)}
              className={`w-10 h-5 rounded-full transition-colors relative ${infiniteLoop ? 'bg-primary' : 'bg-secondary'}`}>
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
            onClick={handleCreateLoop} disabled={createLoop.isPending}>
            <RefreshCw className="w-4 h-4" /> Criar Loop
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
          <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleCoverInput} />
          {coverPath ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-xs text-foreground truncate">{coverName}</span>
              </div>
              <button onClick={() => { setCoverPath(null); setCoverName(null); }} className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => coverInputRef.current?.click()}
              onDrop={handleCoverDrop}
              onDragOver={e => { e.preventDefault(); setDraggingCover(true); }}
              onDragLeave={() => setDraggingCover(false)}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${draggingCover ? 'border-primary bg-primary/5' : 'border-border/80 hover:border-primary/40'}`}
            >
              {coverUploading ? <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" /> : <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />}
              <p className="text-xs text-muted-foreground">{coverUploading ? 'Enviando...' : 'Clique ou arraste uma imagem'}</p>
              <p className="text-[10px] text-muted-foreground/60">JPG, PNG, WEBP — 1080×1920 recomendado</p>
            </div>
          )}
        </div>

        {/* Effects */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Efeitos Visuais
            </h2>
            {activeEffectsCount > 0 && (
              <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                {activeEffectsCount}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-4">Aplique transformações visuais nos vídeos do loop.</p>
          {[
            { key: 'mirror' as const, label: 'Espelhar', desc: 'Inverte a imagem horizontalmente', icon: FlipHorizontal },
            { key: 'invert' as const, label: 'Inverter cores', desc: 'Aplica inversão cromática', icon: Palette },
            { key: 'zoom' as const, label: 'Zoom sutil', desc: 'Zoom leve centralizado', icon: ZoomIn },
            { key: 'blur' as const, label: 'Desfoque leve', desc: 'Filtro de privacidade', icon: EyeOff },
          ].map(effect => (
            <div key={effect.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30 mb-2">
              <div className="flex items-center gap-3">
                <effect.icon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-foreground">{effect.label}</p>
                  <p className="text-[10px] text-muted-foreground">{effect.desc}</p>
                </div>
              </div>
              <button onClick={() => setEffects({ ...effects, [effect.key]: !effects[effect.key] })}
                className={`w-10 h-5 rounded-full transition-colors relative ${effects[effect.key] ? 'bg-primary' : 'bg-secondary'}`}>
                <span className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${effects[effect.key] ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
          <p className="text-[10px] text-muted-foreground/60 mt-3">Esses efeitos são visuais e aplicados na hora da postagem.</p>
        </div>

        {/* Smart processing & Metadata */}
        <div className="glass-card p-6 space-y-5">
          <div className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${smartProcessing ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-secondary/30'}`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs font-semibold text-foreground">Padronização inteligente</p>
                <p className="text-[10px] text-muted-foreground">Normalização automática de mídia</p>
              </div>
            </div>
            <button onClick={() => setSmartProcessing(!smartProcessing)}
              className={`w-10 h-5 rounded-full transition-colors relative ${smartProcessing ? 'bg-primary' : 'bg-secondary'}`}>
              <span className={`w-4 h-4 rounded-full bg-foreground absolute top-0.5 transition-all ${smartProcessing ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-0.5">Perfil de metadata</label>
            <p className="text-[10px] text-muted-foreground mb-3">Perfil de compatibilidade técnica</p>
            <div className="flex gap-2">
              {([
                { value: 'auto', label: 'Auto' },
                { value: 'iphone', label: 'iPhone' },
                { value: 'android', label: 'Android' },
                { value: 'off', label: 'Desligado' },
              ] as const).map(opt => (
                <button key={opt.value} onClick={() => setMetadataProfile(opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${metadataProfile === opt.value ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/30'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-foreground">Versões processadas por vídeo</label>
              <span className="text-xs font-bold text-primary">{variations}x</span>
            </div>
            <input type="range" min={1} max={5} value={variations} onChange={e => setVariations(Number(e.target.value))}
              className="w-full accent-primary" />
            <p className="text-[10px] text-muted-foreground mt-1">
              Cada vídeo da pasta gera {variations} {variations === 1 ? 'versão processada' : 'versões processadas'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function LoopPage() {
  const { accounts } = useAccounts();
  const { folders } = useFolders();
  const { loops, isLoading, create: createLoop, remove } = useLoops();
  const { uploadFiles } = useMediaUpload();

  return (
    <DashboardLayout>
      <PageHeader
        title="Novo Loop"
        subtitle="Repita conteúdos automaticamente com intervalos configuráveis entre postagens."
      />

      <LoopForm accounts={accounts} folders={folders} createLoop={createLoop} uploadFiles={uploadFiles} />

      {/* Existing loops */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-foreground mb-4">Loops criados</h2>
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /></div>
        ) : loops.length === 0 ? (
          <EmptyState icon={RefreshCw} title="Nenhum loop criado" description="Crie seu primeiro loop acima para começar." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loops.map(l => (
              <div key={l.id} className="glass-card p-5 group hover:border-primary/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">
                      {l.is_infinite ? 'Loop infinito' : `${l.cycles ?? 0} ciclos`}
                    </span>
                  </div>
                  <button onClick={() => remove.mutate(l.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>Intervalo: {l.interval_minutes} min</p>
                  <p>Status: {l.is_active ? 'Ativo' : 'Inativo'}</p>
                  <p>{new Date(l.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
