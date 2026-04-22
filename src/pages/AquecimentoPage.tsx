import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Flame, Clock, Target, Layers, ShieldCheck } from 'lucide-react';

export default function AquecimentoPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Aquecimento de Contas"
        subtitle="Contas em aquecimento publicam em ritmo reduzido para ganhar estabilidade operacional."
      />

      <EmptyState
        icon={Flame}
        title="Nenhuma conta em aquecimento"
        description="Quando uma conta for adicionada ao modo de aquecimento, ela aparecerá aqui."
      />

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
