import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { useQueueItems } from '@/hooks/useQueueItems';
import { toast } from 'sonner';
import { ListOrdered, Trash2, GripVertical, Video, Clock, CheckCircle2, Loader2, Filter } from 'lucide-react';
import { useState } from 'react';

type StatusFilter = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

export default function FilaPage() {
  const { items, isLoading, remove, updateStatus } = useQueueItems();
  const [filter, setFilter] = useState<StatusFilter>('all');

  const counts = {
    total: items.length,
    pending: items.filter(i => i.status === 'pending').length,
    processing: items.filter(i => i.status === 'processing').length,
    completed: items.filter(i => i.status === 'completed').length,
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  const handleStatusChange = (id: string, status: 'pending' | 'processing' | 'completed' | 'failed') => {
    updateStatus.mutate({ id, status });
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

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : f === 'processing' ? 'Processando' : f === 'completed' ? 'Concluídos' : 'Falhas'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Nenhum item na fila de postagem.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="divide-y divide-border/30">
            {filtered.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/20 transition-colors group">
                <GripVertical className="w-4 h-4 text-muted-foreground/30 cursor-grab shrink-0" />
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Video className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.media_name || 'Sem nome'}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.mode === 'scheduled' && item.scheduled_for
                      ? `Agendado: ${new Date(item.scheduled_for).toLocaleString('pt-BR')}`
                      : item.account_username || 'Imediato'}
                    {' • '}{item.post_mode === 'burst' ? 'Rajada' : 'Sequencial'}
                    {' • '}{new Date(item.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
                <StatusBadge status={item.status === 'failed' ? 'error' : item.status} />
                {/* Status actions */}
                {item.status === 'pending' && (
                  <Button size="sm" variant="outline" className="text-[10px] h-7 opacity-0 group-hover:opacity-100"
                    onClick={() => handleStatusChange(item.id, 'processing')}>
                    Processar
                  </Button>
                )}
                {item.status === 'processing' && (
                  <Button size="sm" variant="outline" className="text-[10px] h-7 opacity-0 group-hover:opacity-100"
                    onClick={() => handleStatusChange(item.id, 'completed')}>
                    Concluir
                  </Button>
                )}
                <button
                  onClick={() => remove.mutate(item.id)}
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
