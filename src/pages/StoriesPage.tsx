import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { useAccounts } from '@/hooks/useAccounts';
import { useStories } from '@/hooks/useStories';
import { Camera, Upload, Link2, Link2Off, Type, Trash2, Loader2 } from 'lucide-react';

export default function StoriesPage() {
  const { accounts } = useAccounts();
  const { stories, isLoading, create: createStory, remove: removeStory } = useStories();
  const [linkStrategy, setLinkStrategy] = useState<'none' | 'link_bio' | 'text_cta'>('none');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const toggleAccount = (id: string) => {
    setSelectedAccounts(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const handlePublish = () => {
    selectedAccounts.forEach(accountId => {
      createStory.mutate({ account_id: accountId, strategy: linkStrategy, status: 'posted' });
    });
    if (selectedAccounts.length === 0) {
      createStory.mutate({ strategy: linkStrategy, status: 'posted' });
    }
  };

  return (
    <DashboardLayout>
      <PageHeader title="Postagem de Stories" subtitle="Publique stories automaticamente nas suas contas." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> Mídia
            </h2>
            <p className="text-xs text-muted-foreground mb-4">Envie fotos ou vídeos para publicar como story.</p>

            <div className="border-2 border-dashed border-border/80 rounded-xl p-10 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Camera className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Arraste mídia aqui</p>
              <p className="text-[10px] text-muted-foreground/60">JPG, PNG, MP4 — até 15s para vídeos</p>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" /> Estratégia de link
            </h2>
            <div className="space-y-2">
              {[
                { key: 'none' as const, label: 'Sem link', icon: Link2Off, desc: 'Story sem ação de link' },
                { key: 'link_bio' as const, label: 'Link na bio', icon: Link2, desc: 'Direciona para o link da bio' },
                { key: 'text_cta' as const, label: 'CTA textual', icon: Type, desc: 'Texto chamando para ação' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setLinkStrategy(opt.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${linkStrategy === opt.key ? 'border-primary/50 bg-primary/5' : 'border-border/30 bg-secondary/30 hover:bg-secondary/50'}`}
                >
                  <opt.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xs font-semibold text-muted-foreground mb-3">Selecionar contas</h2>
            <div className="space-y-2">
              {accounts.filter(a => a.status === 'active').map(a => (
                <label key={a.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 cursor-pointer">
                  <input type="checkbox" className="rounded accent-primary" checked={selectedAccounts.includes(a.id)} onChange={() => toggleAccount(a.id)} />
                  <span className="text-sm text-foreground">{a.username}</span>
                  <StatusBadge status={a.status} />
                </label>
              ))}
              {accounts.filter(a => a.status === 'active').length === 0 && (
                <p className="text-xs text-muted-foreground">Nenhuma conta ativa encontrada.</p>
              )}
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 shadow-lg shadow-primary/20"
            onClick={handlePublish} disabled={createStory.isPending}>
            <Camera className="w-4 h-4" /> Publicar Story
          </Button>
        </div>

        <div className="glass-card p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Histórico</h2>
            <Button size="sm" variant="ghost" className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7">
              <Trash2 className="w-3 h-3" /> Limpar tudo
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-muted-foreground animate-spin" /></div>
          ) : stories.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum story publicado ainda.</p>
          ) : (
            <div className="space-y-2">
              {stories.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <div>
                    <p className="text-xs font-medium text-foreground">Story #{s.id.slice(0, 6)}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(s.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <StatusBadge status={s.status === 'posted' ? 'completed' : s.status === 'failed' ? 'error' : 'pending'} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
