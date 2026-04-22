import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { mockFolders } from '@/data/mock';
import { MediaFolder } from '@/types';
import { toast } from 'sonner';
import { FolderOpen, Plus, FolderPlus, Video } from 'lucide-react';

export default function BibliotecaPage() {
  const [folders, setFolders] = useState<MediaFolder[]>(mockFolders);
  const [showFolders, setShowFolders] = useState(true);

  return (
    <DashboardLayout>
      <PageHeader
        title="Biblioteca"
        subtitle="Organize seus vídeos e mídias em pastas para uso nas automações."
        actions={
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs shadow-lg shadow-primary/20"
            onClick={() => {
              const newFolder: MediaFolder = { id: Date.now().toString(), name: `Pasta ${folders.length + 1}`, itemCount: 0, createdAt: new Date().toISOString().slice(0, 10) };
              setFolders([...folders, newFolder]);
              toast.success('Pasta criada!');
            }}>
            <Plus className="w-3 h-3" /> Nova pasta
          </Button>
        }
      />

      {folders.length === 0 ? (
        <EmptyState icon={FolderPlus} title="Nenhuma pasta criada" description="Crie sua primeira pasta para organizar seus vídeos e mídias." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map(f => (
            <div key={f.id} className="glass-card p-5 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-0.5">{f.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Video className="w-3 h-3" />
                <span>{f.itemCount} itens</span>
                <span>•</span>
                <span>{f.createdAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
