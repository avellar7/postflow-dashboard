import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Funnel } from '@/types';
import { toast } from 'sonner';
import { GitBranch, Plus, Trash2 } from 'lucide-react';

export default function FunilPage() {
  const [funnels, setFunnels] = useState<Funnel[]>([]);
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const newFunnel: Funnel = {
      id: Date.now().toString(),
      name,
      stages: [
        { id: '1', name: 'Topo', count: 0 },
        { id: '2', name: 'Meio', count: 0 },
        { id: '3', name: 'Fundo', count: 0 },
      ],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setFunnels([...funnels, newFunnel]);
    setName('');
    toast.success('Funil criado!');
  };

  return (
    <DashboardLayout>
      <PageHeader title="Funis" subtitle="Gerencie seus funis de vendas e observações por etapa." />

      <div className="flex gap-3 mb-8 max-w-md">
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Nome do novo funil..."
          className="flex-1 bg-secondary/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50"
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs shadow-lg shadow-primary/20" onClick={handleCreate}>
          <Plus className="w-3 h-3" /> Criar Funil
        </Button>
      </div>

      {funnels.length === 0 ? (
        <EmptyState icon={GitBranch} title="Nenhum funil criado ainda" description="Crie seu primeiro funil para organizar suas vendas e observações." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {funnels.map(f => (
            <div key={f.id} className="glass-card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-primary" />
                </div>
                <button onClick={() => { setFunnels(funnels.filter(x => x.id !== f.id)); toast('Funil removido'); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{f.name}</h3>
              <div className="flex gap-2">
                {f.stages.map(s => (
                  <div key={s.id} className="flex-1 text-center p-2 rounded-lg bg-secondary/30 border border-border/30">
                    <p className="text-lg font-bold text-foreground">{s.count}</p>
                    <p className="text-[10px] text-muted-foreground">{s.name}</p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">Criado em {f.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
