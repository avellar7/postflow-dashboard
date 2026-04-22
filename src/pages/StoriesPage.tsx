import { useState, useRef, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAccounts } from '@/hooks/useAccounts';
import { useStories } from '@/hooks/useStories';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { MediaLibraryModal } from '@/components/media/MediaLibraryModal';
import { Camera, Upload, Link2, Link2Off, Type, Trash2, Loader2, CheckCircle2, AlertCircle, X, FolderOpen } from 'lucide-react';

interface SelectedMedia {
  id: string;
  title: string;
  file_url: string | null;
  media_type: string;
}

export default function StoriesPage() {
  const { accounts } = useAccounts();
  const { stories, isLoading, create: createStory, remove: removeStory } = useStories();
  const { uploads, uploadFiles, isUploading, clearUploads } = useMediaUpload();
  const [linkStrategy, setLinkStrategy] = useState<'none' | 'link_bio' | 'text_cta'>('none');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia[]>([]);
  const [dragging, setDragging] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handleFiles = useCallback(async (files: File[]) => {
    const results = await uploadFiles(files);
    results.forEach(item => {
      setSelectedMedia(prev => [
        ...prev,
        { id: item.id, title: item.title, file_url: item.file_url, media_type: item.media_type },
      ]);
    });
  }, [uploadFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files);
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) handleFiles(files);
    e.target.value = '';
  };

  const handleLibrarySelect = (items: Array<{ id: string; title: string; file_url: string | null; media_type: string }>) => {
    setSelectedMedia(prev => {
      const ids = new Set(prev.map(m => m.id));
      const newItems = items.filter(i => !ids.has(i.id));
      return [...prev, ...newItems];
    });
  };

  const removeMedia = (id: string) => {
    setSelectedMedia(prev => prev.filter(m => m.id !== id));
  };

  const handlePublish = () => {
    const mediaId = selectedMedia.length > 0 ? selectedMedia[0].id : undefined;
    if (selectedAccounts.length > 0) {
      selectedAccounts.forEach(accountId => {
        createStory.mutate({ account_id: accountId, strategy: linkStrategy, status: 'posted', media_id: mediaId });
      });
    } else {
      createStory.mutate({ strategy: linkStrategy, status: 'posted', media_id: mediaId });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Postagem de Stories" subtitle="Publique stories automaticamente nas suas contas." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Upload de mídia */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Mídia
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Envie fotos ou vídeos para publicar como story.</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,video/mp4,video/quicktime"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
                dragging ? 'border-primary bg-primary/5' : 'border-border/80 hover:border-primary/40'
              }`}
            >
              <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Arraste mídia aqui ou clique para selecionar</p>
              <p className="text-[10px] text-muted-foreground/60">JPG, PNG, MP4, MOV — até 100MB</p>
            </div>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                <Upload className="w-3 h-3" /> Selecionar arquivos
              </Button>
              <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => setLibraryOpen(true)}>
                <FolderOpen className="w-3 h-3" /> Da Biblioteca
              </Button>
            </div>

            {/* Upload progress */}
            {uploads.length > 0 && (
              <div className="mt-4 space-y-2">
                {uploads.map((u, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {u.status === 'uploading' && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                    {u.status === 'done' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                    {u.status === 'error' && <AlertCircle className="w-3 h-3 text-destructive" />}
                    <span className="truncate flex-1 text-muted-foreground">{u.file.name}</span>
                    {u.status === 'uploading' && <Progress value={u.progress} className="w-20 h-1.5" />}
                  </div>
                ))}
              </div>
            )}

            {/* Selected media */}
            {selectedMedia.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground">Mídias selecionadas</p>
                {selectedMedia.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 border border-border/30">
                    <span className="text-xs text-foreground truncate">{m.title}</span>
                    <button onClick={() => removeMedia(m.id)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Link strategy */}
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" /> Estratégia de link
            </h2>
            <div className="space-y-2">
              {[
                { key: 'none' as const, label: 'Sem link', icon: Link2Off, desc: 'Story sem ação de link' },
                { key: 'link_bio' as const, label: 'Link na bio', icon: Link2, desc: 'Direciona para o link da bio' },
                { key: 'text_cta' as const, label: 'CTA textual', icon: Type, desc: 'Texto chamando para ação' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setLinkStrategy(opt.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${linkStrategy === opt.key ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-secondary/30 hover:bg-secondary/50'}`}
                >
                  <opt.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account selection */}
          <div className="glass-card p-6">
            <h2 className="text-xs font-semibold text-muted-foreground mb-3">Selecionar contas</h2>
            <div className="space-y-2">
              {accounts.filter(a => a.status === 'active').map(a => (
                <label key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 cursor-pointer">
                  <input type="checkbox" className="rounded accent-primary" checked={selectedAccounts.includes(a.id)} onChange={() => toggleAccount(a.id)} />
                  <span className="text-sm text-foreground">{a.username}</span>
                  <StatusBadge status={a.status} />
                </label>
              ))}
              {accounts.filter(a => a.status === 'active').length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhuma conta ativa encontrada.</p>
              )}
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20"
            onClick={handlePublish} disabled={createStory.isPending || isUploading}>
            <Camera className="w-4 h-4" /> Publicar Story
          </Button>
        </div>

        {/* History */}
        <div className="glass-card p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Histórico</h2>
            <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7">
              <Trash2 className="w-3 h-3" /> Limpar tudo
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /></div>
          ) : stories.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum story publicado ainda.</p>
          ) : (
            <div className="space-y-2">
              {stories.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div>
                    <p className="text-xs font-medium text-foreground">Story #{s.id.slice(0, 6)}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(s.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <StatusBadge status={s.status === 'posted' ? 'completed' : s.status === 'failed' ? 'error' : 'pending'} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <MediaLibraryModal open={libraryOpen} onClose={() => setLibraryOpen(false)} onSelect={handleLibrarySelect} multiple />
    </DashboardLayout>
  );
}
