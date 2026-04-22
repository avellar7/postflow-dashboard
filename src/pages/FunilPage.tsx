import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useFunnels } from '@/hooks/useFunnels';
import { GitBranch, Plus, Trash2, Loader2, Pencil, Check, X } from 'lucide-react';

export default function FunilPage() {
  const { funnels, isLoading, create, update, remove } = useFunnels();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    create.mutate({ name: name.trim() });
    setName('');
  };

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const saveEdit = () => {
    if (!editingId || !editName.trim()) return;
    update.mutate({ id: editingId, name: editName.trim() });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <DashboardLayout>
      <PageHeader title="Funis" subtitle="Crie e gerencie funis de automação para suas campanhas." />

      <div className="glass-card p-4 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">Nome do funil</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="Ex: Funil de vendas"
            className="w-full bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
        <Button size="sm" onClick={handleCreate} disabled={!name.trim() || create.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs">
          <Plus className="w-3 h-3" /> Criar Funil
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 text-muted-foreground animate-spin" /></div>
      ) : funnels.length === 0 ? (
        <EmptyState icon={GitBranch} title="Nenhum funil criado" description="Crie seu primeiro funil para organizar suas campanhas de automação." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnels.map(f => (
            <div key={f.id} className="glass-card p-5 hover:border-primary/30 transition-all group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <GitBranch className="w-4 h-4 text-primary shrink-0" />
                  {editingId === f.id ? (
                    <input
                      autoFocus
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                      onBlur={saveEdit}
                      className="flex-1 bg-secondary/50 border border-primary/50 rounded px-2 py-0.5 text-sm text-foreground outline-none"
                    />
                  ) : (
                    <h3 className="text-sm font-semibold text-foreground truncate">{f.name}</h3>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {editingId === f.id ? (
                    <>
                      <button onClick={saveEdit} className="p-1 rounded hover:bg-primary/10 text-primary transition-all">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={cancelEdit} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(f.id, f.name)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove.mutate(f.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(f.created_at).toLocaleDateString('pt-BR')}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
