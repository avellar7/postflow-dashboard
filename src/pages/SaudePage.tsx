import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { mockHealthMetrics, mockHealthCards, mockAccounts } from '@/data/mock';
import { toast } from 'sonner';
import {
  Activity, RefreshCw, Unlock, ShieldAlert, ArrowUpRight,
  CheckCircle2, AlertTriangle, XCircle, Percent, Users
} from 'lucide-react';

export default function SaudePage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Saúde das Contas"
        subtitle="Métricas operacionais, sinais de atenção e status geral das suas contas."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs border-border/50 text-foreground hover:bg-secondary gap-1.5"
              onClick={() => toast('Dados atualizados (mockado)')}>
              <RefreshCw className="w-3 h-3" /> Atualizar
            </Button>
            <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-lg shadow-primary/20"
              onClick={() => toast.success('Fila destravada (mockado)')}>
              <Unlock className="w-3 h-3" /> Destravar fila agora
            </Button>
          </div>
        }
      />

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {mockHealthMetrics.map(m => (
          <MetricCard key={m.label} label={m.label} value={m.value} color={m.color} />
        ))}
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            <span className="text-xs font-medium text-muted-foreground">Quarentena automática</span>
          </div>
          <span className="text-2xl font-bold text-destructive">{mockHealthCards.quarantine}</span>
          <p className="text-[10px] text-muted-foreground mt-1">Contas pausadas por segurança</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">Publicando agora</span>
          </div>
          <span className="text-2xl font-bold text-primary">{mockHealthCards.publishing}</span>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium text-muted-foreground">Posts segurados</span>
          </div>
          <span className="text-2xl font-bold text-warning">{mockHealthCards.held}</span>
          <p className="text-[10px] text-muted-foreground mt-1">Aguardando condições seguras</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-muted-foreground">Taxa de sucesso</span>
          </div>
          <span className="text-2xl font-bold text-success">{mockHealthCards.successRate}%</span>
        </div>
      </div>

      {/* Error breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Posts OK" value={mockHealthCards.postsOk} icon={<CheckCircle2 className="w-4 h-4 text-success" />} color="success" />
        <MetricCard label="IG Error" value={mockHealthCards.igError} icon={<XCircle className="w-4 h-4 text-destructive" />} color="destructive" />
        <MetricCard label="Rate-limit" value={mockHealthCards.rateLimit} icon={<AlertTriangle className="w-4 h-4 text-warning" />} color="warning" />
        <MetricCard label="Outros erros" value={mockHealthCards.otherErrors} icon={<XCircle className="w-4 h-4 text-muted-foreground" />} color="muted" />
      </div>

      {/* Per Account */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Por conta
          </h2>
          <input
            type="text"
            placeholder="Filtrar por @username..."
            className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 w-48"
          />
        </div>

        <div className="space-y-2">
          {mockAccounts.map(a => (
            <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30">
              <div className="flex items-center gap-3">
                <span>{a.avatar}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{a.username}</p>
                  <p className="text-[10px] text-muted-foreground">{a.postsToday} posts hoje • {a.successRate}% sucesso</p>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
