import { useState, useCallback, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useHealthMetrics } from '@/hooks/useHealthMetrics';
import { toast } from 'sonner';
import {
  RefreshCw, Unlock, ShieldAlert, ShieldCheck,
  CheckCircle2, AlertTriangle, XCircle, Percent, Users,
  Loader2, Clock, Send, Radio, Timer, Gauge
} from 'lucide-react';

export default function SaudePage() {
  const {
    isLoading, processing, publishing, postedLastHour, rateLimited, pending,
    heldByJitter, postsOk, igErrors, rateLimitErrors, otherErrors, successRate,
    quarantinedAccounts, accountMetrics, publishCap,
    unlockQueue, updateCap, refetchAll,
  } = useHealthMetrics();

  const [filter, setFilter] = useState('');
  const [localCap, setLocalCap] = useState(publishCap);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setLocalCap(publishCap);
  }, [publishCap]);

  const handleCapChange = useCallback((value: number[]) => {
    const v = value[0];
    setLocalCap(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateCap.mutate(v);
    }, 600);
  }, [updateCap]);

  const filteredAccounts = accountMetrics.filter(a =>
    !filter || a.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Saúde das Contas"
        subtitle="Métricas operacionais das últimas 24h por conta conectada."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs border-border/50 text-foreground hover:bg-secondary gap-1.5"
              onClick={() => { refetchAll(); toast('Dados atualizados'); }}>
              <RefreshCw className="w-3 h-3" /> Atualizar
            </Button>
            <Button size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-lg shadow-primary/20"
              onClick={() => unlockQueue.mutate()}
              disabled={unlockQueue.isPending}>
              {unlockQueue.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Unlock className="w-3 h-3" />}
              Destravar fila agora
            </Button>
          </div>
        }
      />
      <p className="text-[10px] text-muted-foreground -mt-6 mb-6">
        Limpa processing preso e dispara reprocessamento
      </p>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : (
        <>
          {/* Fila ao vivo */}
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-primary" /> Fila ao vivo
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <MetricCard label="Processing" value={processing} color="primary" description="Container criado, aguardando IG" icon={<Clock className="w-4 h-4 text-primary" />} />
            <MetricCard label="Publicando" value={publishing} color="success" description="Enviando para o Instagram agora" icon={<Send className="w-4 h-4 text-success" />} />
            <MetricCard label="Postados (1h)" value={postedLastHour} color="success" description="Publicados na última hora" icon={<CheckCircle2 className="w-4 h-4 text-success" />} />
            <MetricCard label="Rate-limited" value={rateLimited} color="warning" description="Em backoff por IG / cooldown" icon={<AlertTriangle className="w-4 h-4 text-warning" />} />
            <MetricCard label="Pendentes" value={pending} color="muted" description="Aguardando próximo slot" icon={<Timer className="w-4 h-4 text-muted-foreground" />} />
          </div>

          {/* Quarentena + Cap + Jitter row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Quarentena */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-destructive" />
                <span className="text-xs font-semibold text-foreground">Quarentena automática</span>
              </div>
              {quarantinedAccounts.length === 0 ? (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-success">Saúde geral OK</p>
                    <p className="text-[10px] text-muted-foreground">Nenhuma conta em quarentena</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {quarantinedAccounts.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2 rounded-lg bg-destructive/5 border border-destructive/20">
                      <span className="text-sm font-medium text-foreground">@{a.username}</span>
                      <StatusBadge status="quarantine" />
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-muted-foreground mt-3">Contas pausadas após erros seguidos. Liberação automática após cooldown.</p>
            </div>

            {/* Cap */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold text-foreground">Publishes em andamento (seu cap)</span>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold text-primary">{processing}</span>
                <span className="text-lg text-muted-foreground font-medium">/ {localCap}</span>
              </div>
              <Slider
                value={[localCap]}
                onValueChange={handleCapChange}
                min={1}
                max={10}
                step={1}
                className="mb-2"
              />
              <p className="text-[10px] text-muted-foreground">Ajuste o cap (2 = ultra-seguro · 5 = mais throughput)</p>
            </div>

            {/* Jitter */}
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-4 h-4 text-warning" />
                <span className="text-xs font-semibold text-foreground">Posts segurados por jitter / lock</span>
              </div>
              <span className="text-3xl font-bold text-warning">{heldByJitter}</span>
              <p className="text-[10px] text-muted-foreground mt-2">Posts com horário vencido aguardando liberação operacional</p>
            </div>
          </div>

          {/* Summary cards */}
          <div className="mb-2">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Percent className="w-4 h-4 text-success" /> Resumo (24h)
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard label="Posts OK" value={postsOk} icon={<CheckCircle2 className="w-4 h-4 text-success" />} color="success" />
            <MetricCard label="IG ERROR" value={igErrors} icon={<XCircle className="w-4 h-4 text-destructive" />} color="destructive" />
            <MetricCard label="Rate-limit" value={rateLimitErrors} icon={<AlertTriangle className="w-4 h-4 text-warning" />} color="warning" />
            <MetricCard label="Outros erros" value={otherErrors} icon={<XCircle className="w-4 h-4 text-muted-foreground" />} color="muted" />
            <MetricCard label="Taxa de sucesso" value={`${successRate.toFixed(1)}%`} icon={<Percent className="w-4 h-4 text-success" />} color="success" />
          </div>

          {/* Per account */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Por conta
              </h2>
              <input
                type="text"
                placeholder="Filtrar por @username..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 w-48"
              />
            </div>
            <p className="text-[10px] text-muted-foreground mb-4">ordenadas por número de erros (piores primeiro)</p>

            {filteredAccounts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                {accountMetrics.length === 0 ? 'Nenhuma conta cadastrada.' : 'Nenhuma conta corresponde ao filtro.'}
              </p>
            ) : (
              <div className="space-y-2">
                {filteredAccounts.map(a => (
                  <div key={a.accountId} className="p-3 rounded-lg bg-secondary/20 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span>📱</span>
                        <div>
                          <p className="text-sm font-medium text-foreground">@{a.username}</p>
                          <p className="text-[10px] text-muted-foreground">{a.displayName || '—'}</p>
                        </div>
                      </div>
                      <StatusBadge status={a.status === 'quarantined' ? 'quarantine' : a.status} />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono mb-2">
                      <span className="text-success">OK: {a.postsOk}</span>
                      <span className="text-destructive">IG: {a.igErrors}</span>
                      <span className="text-warning">RL: {a.rateLimitErrors}</span>
                      <span className="text-muted-foreground">Outros: {a.otherErrors}</span>
                      <span className="text-muted-foreground">Pend: {a.pending}</span>
                      <span className={a.successRate >= 80 ? 'text-success' : a.successRate >= 50 ? 'text-warning' : 'text-destructive'}>
                        {a.successRate.toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={a.successRate} className="h-1.5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
