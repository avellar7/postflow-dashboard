import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccounts } from '@/hooks/useAccounts';
import { toast } from 'sonner';
import { Users, Plus, FolderOpen, Trash2, Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

export default function ContasPage() {
  const { accounts, isLoading, create, remove } = useAccounts();
  const [newUsername, setNewUsername] = useState('');

  const handleAdd = () => {
    if (!newUsername.trim()) return;
    create.mutate({ username: newUsername.trim() });
    setNewUsername('');
  };

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

      {/* Add account */}
      <div className="glass-card p-4 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Username do Instagram</label>
          <Input
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="@username"
            className="bg-secondary/50 border-border/50 h-9 text-sm"
          />
        </div>
        <Button size="sm" onClick={handleAdd} disabled={!newUsername.trim() || create.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs shadow-lg shadow-primary/20">
          <Plus className="w-3 h-3" /> Adicionar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : accounts.length === 0 ? (
        <EmptyState icon={Users} title="Nenhuma conta" description="Adicione sua primeira conta do Instagram para começar a automatizar." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map(a => (
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
                <span className="text-xs text-muted-foreground">Status</span>
                <span className="text-sm font-bold text-foreground capitalize">{a.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
