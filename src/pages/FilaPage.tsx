import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useQueueItems } from '@/hooks/useQueueItems';
import { toast } from 'sonner';
import { ListOrdered, Trash2, GripVertical, Video, Clock, CheckCircle2, Loader2 } from 'lucide-react';

export default function FilaPage() {
  const { items, isLoading, remove } = useQueueItems();

  const counts = {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    processing: items.filter(i => i.status === 'processing').length,
    completed: items.filter(i => i.status === 'completed').length,
  };

  const handleRemove = (id: string) => {
    remove.mutate(id);
  };

  return (
    <DashboardLayout>
      <PageHeader title="Fila de Postagens" subtitle="Acompanhe e gerencie todos os itens na fila de automação." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total" value={counts.total} icon={<ListOrdered className="w-4 h-4 text-muted-foreground" />} color="primary" />
        <MetricCard label="Pendentes" value={counts.pending} icon={<Clock className="w-4 h-4 text-muted-foreground" />} color="muted" />
        <MetricCard label="Processando" value={counts.processing} icon={<Loader2 className="w-4 h-4 text-primary animate-spin" />} color="primary" />
        <MetricCard label="Concluídos" value={counts.completed} icon={<CheckCircle2 className="w-4 h-4 text-success" />} color="success" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Nenhum item na fila de postagem.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-border/30">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors group">
                <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab shrink-0" />
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.media_name || 'Sem nome'}</p>
                  <p className="text-xs text-muted-foreground">{item.account_username || '—'} • {new Date(item.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <StatusBadge status={item.status === 'failed' ? 'error' : item.status} />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
