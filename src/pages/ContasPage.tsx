import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hooks/useAccounts';
import { useInstagramConnect } from '@/hooks/useInstagramConnect';
import { Users, FolderOpen, Trash2, Loader2, Instagram, CheckCircle2 } from 'lucide-react';

function formatDate(iso?: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString('pt-BR');
  } catch {
    return null;
  }
}

export default function ContasPage() {
  const { accounts, isLoading, remove } = useAccounts();
  const { startConnect, isConnecting } = useInstagramConnect();

  return (
    <DashboardLayout>
      <PageHeader
        title="Contas"
        subtitle="Gerencie suas contas conectadas ao sistema."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs border-border/50 text-foreground hover:bg-secondary gap-1.5">
              <FolderOpen className="w-3 h-3" /> Pasta
            </Button>
          </div>
        }
      />

      {/* Connect Instagram CTA */}
      <div className="glass-card p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Instagram className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Conectar conta do Instagram</p>
            <p className="text-[11px] text-muted-foreground">Autorize via Meta para conectar sua conta profissional.</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={startConnect}
          disabled={isConnecting}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs shadow-lg shadow-primary/20"
        >
          {isConnecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Instagram className="w-3 h-3" />}
          + Instagram
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : accounts.length === 0 ? (
        <EmptyState icon={Users} title="Nenhuma conta" description="Conecte sua primeira conta do Instagram para começar a automatizar." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(a => {
            const connectedAt = formatDate((a as any).connected_at);
            const isConnected = !!(a as any).access_token;
            return (
              <div key={a.id} className="glass-card p-5 hover:border-primary/30 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                      📱
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.username}</p>
                      <p className="text-[10px] text-muted-foreground">{a.display_name || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={a.status === 'quarantined' ? 'quarantine' : a.status} />
                    <button onClick={() => remove.mutate(a.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30">
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                      <CheckCircle2 className="w-3 h-3" /> Conectada
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Status</span>
                  )}
                  <span className="text-[11px] text-muted-foreground">
                    {connectedAt ? `Conectada em ${connectedAt}` : <span className="capitalize text-foreground font-bold">{a.status}</span>}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
