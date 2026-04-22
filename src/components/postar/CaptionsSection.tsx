import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCaptions } from '@/hooks/useCaptions';
import { Sparkles, Hash, Smile, Save, Shuffle, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CaptionsSectionProps {
  selectedCaptionId: string | null;
  onSelectCaption: (id: string | null) => void;
}

export function CaptionsSection({ selectedCaptionId, onSelectCaption }: CaptionsSectionProps) {
  const { captions, isLoading, create: createCaption, remove: removeCaption, update: updateCaption } = useCaptions();
  const [captionInput, setCaptionInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleGenerate = () => {
    toast.success('Legenda gerada com IA (mockado)');
    setCaptionInput('✨ Essa legenda foi gerada automaticamente pela nossa IA! Personalize como quiser. #postflow #automacao');
  };

  const handleSaveCaption = () => {
    if (!captionInput.trim()) return;
    createCaption.mutate({ content: captionInput });
    setCaptionInput('');
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditingText(content);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editingText.trim()) return;
    updateCaption.mutate({ id: editingId, content: editingText });
    setEditingId(null);
    setEditingText('');
  };

  const handleRandom = () => {
    if (captions.length === 0) return;
    const random = captions[Math.floor(Math.random() * captions.length)];
    onSelectCaption(random.id);
    setCaptionInput(random.content);
    toast.success('Legenda aleatória selecionada!');
  };

  return (
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
        <Button size="sm" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 gap-1.5 ml-auto" onClick={handleSaveCaption} disabled={createCaption.isPending}>
          <Save className="w-3 h-3" /> Salvar
        </Button>
      </div>

      {isLoading ? (
        <div className="mt-5 flex justify-center"><Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /></div>
      ) : captions.length > 0 && (
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Legendas salvas</p>
            <Button size="sm" variant="ghost" className="text-[10px] text-muted-foreground hover:text-foreground h-6 gap-1" onClick={handleRandom}>
              <Shuffle className="w-3 h-3" /> Aleatória
            </Button>
          </div>
          {captions.map(c => (
            <div
              key={c.id}
              onClick={() => onSelectCaption(selectedCaptionId === c.id ? null : c.id)}
              className={`flex items-start gap-2 p-3 rounded-lg border group cursor-pointer transition-all ${
                selectedCaptionId === c.id
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-secondary/30 border-border/30 hover:border-border/50'
              }`}
            >
              {editingId === c.id ? (
                <div className="flex-1 flex gap-2">
                  <Textarea
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    className="text-xs min-h-[40px] bg-secondary/50 border-border/50"
                    onClick={e => e.stopPropagation()}
                  />
                  <div className="flex flex-col gap-1 shrink-0">
                    <button className="p-1 rounded hover:bg-primary/10 text-primary" onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}>
                      <Check className="w-3 h-3" />
                    </button>
                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground" onClick={(e) => { e.stopPropagation(); setEditingId(null); }}>
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="flex-1 text-xs text-foreground/80 leading-relaxed">{c.content}</p>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); handleStartEdit(c.id, c.content); }}>
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); removeCaption.mutate(c.id); }}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
