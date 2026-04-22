import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { MediaLibraryModal } from '@/components/media/MediaLibraryModal';
import { Upload, FolderOpen, Video, X, CheckCircle2, Loader2, Image } from 'lucide-react';
import type { SelectedMedia } from '@/pages/PostarPage';

interface UploadSectionProps {
  selectedMedia: SelectedMedia[];
  onMediaUploaded: (media: SelectedMedia) => void;
  onLibrarySelect: (items: Array<{ id: string; title: string; file_url: string | null; media_type: string }>) => void;
  onRemoveMedia: (id: string) => void;
}

export function UploadSection({ selectedMedia, onMediaUploaded, onLibrarySelect, onRemoveMedia }: UploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, uploadFiles, isUploading, clearUploads } = useMediaUpload();
  const [isDragging, setIsDragging] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFiles = useCallback(async (files: File[]) => {
    const results = await uploadFiles(files);
    for (const r of results) {
      if (r) onMediaUploaded({ id: r.id, title: r.title });
    }
  }, [uploadFiles, onMediaUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFiles(files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) handleFiles(files);
    e.target.value = '';
  }, [handleFiles]);

  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
        <Upload className="w-4 h-4 text-primary" /> Upload de Vídeos
      </h2>
      <p className="text-xs text-muted-foreground mb-4">Arraste seus vídeos ou selecione do computador.</p>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer group ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border/80 hover:border-primary/40'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Video className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3 group-hover:text-primary/60 transition-colors" />
        <p className="text-sm text-muted-foreground mb-1">
          {isDragging ? 'Solte os arquivos aqui' : 'Arraste e solte vídeos aqui'}
        </p>
        <p className="text-[10px] text-muted-foreground/60">MP4, MOV, JPG, PNG — até 100MB</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,.mov,.mp4,image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex-1 border-border/50 text-foreground hover:bg-secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="w-3 h-3 mr-1.5" /> Selecionar arquivos
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs flex-1 border-border/50 text-foreground hover:bg-secondary"
          onClick={() => setLibraryOpen(true)}
        >
          <FolderOpen className="w-3 h-3 mr-1.5" /> Da Biblioteca
        </Button>
      </div>

      {/* Upload progress */}
      {uploads.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploads.map((u, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30 border border-border/30">
              <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center shrink-0">
                {u.status === 'done' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                 u.status === 'error' ? <X className="w-4 h-4 text-destructive" /> :
                 <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{u.file.name}</p>
                {u.status === 'uploading' && <Progress value={u.progress} className="h-1 mt-1" />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected media list */}
      {selectedMedia.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Mídias selecionadas ({selectedMedia.length})</p>
          <div className="space-y-1.5">
            {selectedMedia.map(m => (
              <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                <Video className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs text-foreground truncate flex-1">{m.title}</span>
                <button onClick={() => onRemoveMedia(m.id)} className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <MediaLibraryModal
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={onLibrarySelect}
        multiple
      />
    </div>
  );
}
