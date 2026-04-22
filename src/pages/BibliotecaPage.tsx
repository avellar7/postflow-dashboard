import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFolders } from '@/hooks/useFolders';
import { useMediaItems } from '@/hooks/useMediaItems';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { toast } from 'sonner';
import { FolderOpen, Plus, FolderPlus, Trash2, Loader2, ArrowLeft, Upload, Video, Image, Pencil } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function BibliotecaPage() {
  const { folders, isLoading, create, update, remove } = useFolders();
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const activeFolder = folders.find(f => f.id === activeFolderId);

  const handleCreate = () => {
    create.mutate({ name: `Pasta ${folders.length + 1}` });
  };

  const handleRename = (id: string, name: string) => {
    update.mutate({ id, name });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={activeFolder ? activeFolder.name : "Biblioteca"}
        subtitle={activeFolder ? "Mídias desta pasta" : "Organize seus vídeos e mídias em pastas para uso nas automações."}
        actions={
          activeFolder ? (
            <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => setActiveFolderId(null)}>
              <ArrowLeft className="w-3 h-3" /> Voltar
            </Button>
          ) : (
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs shadow-lg shadow-primary/20"
              onClick={handleCreate} disabled={create.isPending}>
              <Plus className="w-3 h-3" /> Nova pasta
            </Button>
          )
        }
      />

      {activeFolderId ? (
        <FolderContent folderId={activeFolderId} />
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
          ) : folders.length === 0 ? (
            <EmptyState icon={FolderPlus} title="Nenhuma pasta criada" description="Crie sua primeira pasta para organizar seus vídeos e mídias." />
          ) : (
            <FolderGrid folders={folders} onOpen={setActiveFolderId} onRemove={(id) => remove.mutate(id)} onRename={handleRename} />
          )}
        </>
      )}
    </DashboardLayout>
  );
}

function FolderGrid({ folders, onOpen, onRemove, onRename }: {
  folders: Array<{ id: string; name: string; created_at: string }>;
  onOpen: (id: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editName.trim();
    if (!trimmed) {
      toast.error('Nome não pode ser vazio');
      return;
    }
    onRename(editingId, trimmed);
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {folders.map(f => (
        <div
          key={f.id}
          className="glass-card p-5 hover:border-primary/30 transition-all cursor-pointer group"
          onClick={() => { if (editingId !== f.id) onOpen(f.id); }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-0.5">
              <button
                onClick={(e) => { e.stopPropagation(); startEdit(f.id, f.name); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(f.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {editingId === f.id ? (
            <Input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveEdit();
                if (e.key === 'Escape') cancelEdit();
              }}
              onBlur={saveEdit}
              onClick={(e) => e.stopPropagation()}
              className="h-7 text-sm font-semibold mb-0.5"
            />
          ) : (
            <h3 className="text-sm font-semibold text-foreground mb-0.5">{f.name}</h3>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{new Date(f.created_at).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FolderContent({ folderId }: { folderId: string }) {
  const { items, isLoading, remove } = useMediaItems(folderId);
  const { uploads, uploadFiles, isUploading } = useMediaUpload(folderId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) uploadFiles(files);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="text-xs gap-1.5" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <Upload className="w-3 h-3" /> Upload
        </Button>
        <input ref={fileInputRef} type="file" accept="video/mp4,video/quicktime,.mov,.mp4,image/jpeg,image/png" multiple className="hidden" onChange={handleFileInput} />
      </div>

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((u, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 border border-border/30">
              <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{u.file.name}</p>
                <Progress value={u.progress} className="h-1 mt-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : items.length === 0 ? (
        <EmptyState icon={Video} title="Pasta vazia" description="Faça upload de arquivos para esta pasta." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="glass-card p-4 group">
              <div className="w-full aspect-video rounded-lg bg-secondary/50 flex items-center justify-center mb-3">
                {item.media_type === 'video' ? (
                  <Video className="w-8 h-8 text-muted-foreground/30" />
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground/30" />
                )}
              </div>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.file_size ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` : '—'} • {item.media_type}
                  </p>
                </div>
                <button
                  onClick={() => remove.mutate(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}