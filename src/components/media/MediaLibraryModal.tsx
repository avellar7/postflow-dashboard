import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useMediaItems } from '@/hooks/useMediaItems';
import { useFolders } from '@/hooks/useFolders';
import { Video, Image, FolderOpen, Check, Loader2 } from 'lucide-react';

interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (items: Array<{ id: string; title: string; file_url: string | null; media_type: string }>) => void;
  multiple?: boolean;
}

export function MediaLibraryModal({ open, onClose, onSelect, multiple = false }: MediaLibraryModalProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { folders } = useFolders();
  const { items, isLoading } = useMediaItems(selectedFolder);

  useEffect(() => {
    if (!open) {
      setSelectedIds(new Set());
      setSelectedFolder(null);
    }
  }, [open]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    const selected = items.filter(i => selectedIds.has(i.id)).map(i => ({
      id: i.id,
      title: i.title,
      file_url: i.file_url,
      media_type: i.media_type,
    }));
    onSelect(selected);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Selecionar da Biblioteca</DialogTitle>
        </DialogHeader>

        {/* Folder tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedFolder(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              !selectedFolder ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            Todos
          </button>
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFolder(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedFolder === f.id ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <FolderOpen className="w-3 h-3" /> {f.name}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">Nenhuma mídia encontrada</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Faça upload de arquivos primeiro</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-1">
              {items.map(item => {
                const selected = selectedIds.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSelect(item.id)}
                    className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                      selected ? 'border-primary bg-primary/5' : 'border-border/30 bg-secondary/20 hover:border-border/60'
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className="w-full aspect-video rounded-lg bg-secondary/50 flex items-center justify-center mb-2">
                      {item.media_type === 'video' ? (
                        <Video className="w-6 h-6 text-muted-foreground/40" />
                      ) : (
                        <Image className="w-6 h-6 text-muted-foreground/40" />
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.file_size ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` : '—'}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            {selectedIds.size} selecionado(s)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs" onClick={onClose}>Cancelar</Button>
            <Button size="sm" className="text-xs bg-primary text-primary-foreground" onClick={handleConfirm} disabled={selectedIds.size === 0}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
