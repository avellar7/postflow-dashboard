import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { mockAccounts } from '@/data/mock';
import { Account } from '@/types';
import { toast } from 'sonner';
import { Users, Plus, FolderOpen } from 'lucide-react';

export default function ContasPage() {
  const [accounts] = useState<Account[]>(mockAccounts);

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
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs shadow-lg shadow-primary/20"
              onClick={() => toast.info('Integração com Instagram (mockado)')}>
              <Plus className="w-3 h-3" /> Instagram
            </Button>
          </div>
        }
      />

      {accounts.length === 0 ? (
        <EmptyState icon={Users} title="Nenhuma conta" description="Adicione sua primeira conta do Instagram para começar a automatizar." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(a => (
            <div key={a.id} className="glass-card p-5 hover:border-primary/30 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                    {a.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.username}</p>
                    <p className="text-[10px] text-muted-foreground">{a.postsToday} posts hoje</p>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border/30">
                <span className="text-xs text-muted-foreground">Taxa de sucesso</span>
                <span className={`text-sm font-bold ${a.successRate >= 90 ? 'text-success' : a.successRate >= 60 ? 'text-warning' : 'text-destructive'}`}>
                  {a.successRate}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
