import { StatusBadge } from '@/components/shared/StatusBadge';
import { useQueueItems } from '@/hooks/useQueueItems';
import { Play, Video, Loader2 } from 'lucide-react';

export function QueuePreviewSection() {
  const { items: queueItems, isLoading: queueLoading } = useQueueItems();

  return (
    <div className="glass-card p-6">
      <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Play className="w-4 h-4 text-primary" /> Fila de postagem
      </h2>

      {queueLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /></div>
      ) : queueItems.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Nenhum item na fila</p>
      ) : (
        <div className="space-y-2">
          {queueItems.slice(0, 5).map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Video className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{item.media_name || 'Sem nome'}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.mode === 'scheduled' && item.scheduled_for
                      ? new Date(item.scheduled_for).toLocaleString('pt-BR')
                      : item.account_username || 'Imediato'}
                  </p>
                </div>
              </div>
              <StatusBadge status={item.status === 'failed' ? 'error' : item.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
