import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { mockCaptions, mockQueueItems } from '@/data/mock';
import { Caption } from '@/types';
import { toast } from 'sonner';
import {
  Upload, FolderOpen, Sparkles, Hash, Smile, Save,
  Shuffle, Pencil, Trash2, Zap, Clock, Play, Video, ShieldCheck
} from 'lucide-react';

export default function PostarPage() {
  const [captions, setCaptions] = useState<Caption[]>(mockCaptions);
  const [captionInput, setCaptionInput] = useState('');
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [postMode, setPostMode] = useState<'sequential' | 'burst'>('sequential');
  const [mediaCount, setMediaCount] = useState(1);
  const [antiDetection, setAntiDetection] = useState(false);
  const [metadataProfile, setMetadataProfile] = useState<'auto' | 'iphone' | 'android' | 'off'>('auto');
  const [variations, setVariations] = useState(3);

  const handleGenerate = () => {
    toast.success('Legenda gerada com IA (mockado)');
    setCaptionInput('✨ Essa legenda foi gerada automaticamente pela nossa IA! Personalize como quiser. #postflow #automacao');
  };

  const handleSaveCaption = () => {
    if (!captionInput.trim()) return;
    const newCaption: Caption = { id: Date.now().toString(), text: captionInput, createdAt: new Date().toISOString().slice(0, 10) };
    setCaptions([newCaption, ...captions]);
    setCaptionInput('');
    toast.success('Legenda salva!');
  };

  const handleDeleteCaption = (id: string) => {
    setCaptions(captions.filter(c => c.id !== id));
    toast('Legenda removida');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Painel de Automação"
        subtitle="Configure e dispare postagens automáticas para suas contas."
        actions={
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20" onClick={() => toast.success('Automação iniciada (mockado)')}>
            <Play className="w-4 h-4" /> Iniciar automação
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Upload */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Upload de Vídeos
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Arraste seus vídeos ou selecione do computador.</p>

            <div className="border-2 border-dashed border-border/80 rounded-xl p-10 text-center hover:border-primary/40 transition-colors cursor-pointer group">
              <Video className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3 group-hover:text-primary/60 transition-colors" />
              <p className="text-sm text-muted-foreground mb-1">Arraste e solte vídeos aqui</p>
              <p className="text-[10px] text-muted-foreground/60">MP4, MOV — até 100MB</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="text-xs flex-1 border-border/50 text-foreground hover:bg-secondary">
                <Upload className="w-3 h-3 mr-1.5" /> Selecionar arquivos
              </Button>
              <Button variant="outline" size="sm" className="text-xs flex-1 border-border/50 text-foreground hover:bg-secondary">
                <FolderOpen className="w-3 h-3 mr-1.5" /> Da Biblioteca
              </Button>
            </div>
          </div>

          {/* Captions */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Legendas Inteligentes
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Descreva o tema do vídeo e gere legendas otimizadas.</p>

            <Textarea
              placeholder="Ex: vídeo mostrando nova coleção de roupas de verão..."
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground/50 min-h-[80px] text-sm resize-none"
            />

            <div className="flex flex-wrap gap-2 mt-3">
              <Button size="sm" variant="outline" className="text-xs border-border/50 text-foreground hover:bg-secondary gap-1.5" onClick={handleGenerate}>
                <Sparkles className="w-3 h-3" /> Gerar com IA
              </Button>
              <Button size="sm" variant="outline" className="text-xs border-border/50 text-foreground hover:bg-secondary gap-1.5" onClick={() => setCaptionInput(prev => prev + ' #instagram #viral #trend')}>
                <Hash className="w-3 h-3" /> Hashtags
              </Button>
              <Button size="sm" variant="outline" className="text-xs border-border/50 text-foreground hover:bg-secondary gap-1.5" onClick={() => setCaptionInput(prev => prev + ' 🚀🔥✨')}>
                <Smile className="w-3 h-3" /> Emojis
              </Button>
              <Button size="sm" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 gap-1.5 ml-auto" onClick={handleSaveCaption}>
                <Save className="w-3 h-3" /> Salvar
              </Button>
            </div>

            {captions.length > 0 && (
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground">Legendas salvas</p>
                  <Button size="sm" variant="ghost" className="text-[10px] text-muted-foreground hover:text-foreground h-6 gap-1">
                    <Shuffle className="w-3 h-3" /> Aleatória
                  </Button>
                </div>
                {captions.map(c => (
                  <div key={c.id} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/30 border border-border/30 group">
                    <p className="flex-1 text-xs text-foreground/80 leading-relaxed">{c.text}</p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"><Pencil className="w-3 h-3" /></button>
                      <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteCaption(c.id)}><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Scheduling */}
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
                onClick={() => setMode('schedule')}
                className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${mode === 'schedule' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Clock className="w-3 h-3 inline mr-1" /> Agendar
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Quantidade de mídias</label>
                <input
                  type="number" min={1} max={50} value={mediaCount}
                  onChange={e => setMediaCount(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
                />
              </div>

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
                    <p className="text-[10px] text-muted-foreground mt-0.5">Mais rápida e agressiva</p>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-xs font-semibold text-primary mb-2">Resumo da automação</p>
                <div className="space-y-1 text-xs text-foreground/70">
                  <p>• {mediaCount} mídia(s) selecionada(s)</p>
                  <p>• Modo: {postMode === 'sequential' ? 'Sequencial' : 'Rajada'}</p>
                  <p>• Execução: {mode === 'now' ? 'Imediata' : 'Agendada'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Queue Preview */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Play className="w-4 h-4 text-primary" /> Fila de postagem
            </h2>

            <div className="space-y-2">
              {mockQueueItems.slice(0, 3).map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Video className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{item.mediaName}</p>
                      <p className="text-[10px] text-muted-foreground">{item.accountUsername}</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
