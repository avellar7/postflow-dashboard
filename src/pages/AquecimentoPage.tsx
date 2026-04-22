import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hooks/useAccounts';
import { useWarmupAccounts } from '@/hooks/useWarmupAccounts';
import { Flame, Clock, Target, Layers, ShieldCheck, Plus, Trash2, Loader2 } from 'lucide-react';

export default function AquecimentoPage() {
  const { accounts } = useAccounts();
  const { warmups, isLoading, create, remove } = useWarmupAccounts();
  const [selectedAccountId, setSelectedAccountId] = useState('');

  const handleAdd = () => {
    if (!selectedAccountId) return;
    create.mutate({ account_id: selectedAccountId });
    setSelectedAccountId('');
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Aquecimento de Contas"
        subtitle="Contas em aquecimento publicam em ritmo reduzido para ganhar estabilidade operacional."
      />

      {/* Add warmup form */}
      <div className="glass-card p-4 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Conta para aquecer</label>
          <select className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground"
            value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)}>
            <option value="">Selecione uma conta...</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.username}</option>)}
          </select>
        </div>
        <Button size="sm" onClick={handleAdd} disabled={!selectedAccountId || create.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs">
          <Plus className="w-3 h-3" /> Adicionar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : warmups.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="Nenhuma conta em aquecimento"
          description="Quando uma conta for adicionada ao modo de aquecimento, ela aparecerá aqui."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {warmups.map(w => (
            <div key={w.id} className="glass-card p-5 group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-warning" />
                  <span className="text-sm font-semibold text-foreground">
                    {(w as any).instagram_accounts?.username || 'Conta'}
                  </span>
                </div>
                <button onClick={() => remove.mutate(w.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Meta diária: {w.daily_target} posts</p>
                <p>Intervalo: {w.interval_minutes} min</p>
                <p>Status: {w.current_status}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info card */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Flame className="w-4 h-4 text-warning" /> Como funciona o aquecimento
          </h3>
          <div className="space-y-3">
            {[
              { icon: Clock, text: 'Intervalo maior entre postagens para reduzir risco' },
              { icon: Target, text: 'Meta de posts atingida antes de voltar ao ritmo normal' },
              { icon: Layers, text: 'Execução paralela sem afetar o desempenho de outras contas' },
              { icon: ShieldCheck, text: 'Recomendado para contas novas ou sensíveis' },
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-3">
                <rule.icon className="w-4 h-4 text-warning mt-0.5 shrink-0" />
                <p className="text-xs text-foreground/80">{rule.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
