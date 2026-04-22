import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'destructive' | 'primary' | 'muted';
}

const variantClasses: Record<string, string> = {
  success: 'bg-success/15 text-success border-success/20',
  warning: 'bg-warning/15 text-warning border-warning/20',
  destructive: 'bg-destructive/15 text-destructive border-destructive/20',
  primary: 'bg-primary/15 text-primary border-primary/20',
  muted: 'bg-muted text-muted-foreground border-border',
};

const statusMap: Record<string, { label: string; variant: string }> = {
  pending: { label: 'Pendente', variant: 'muted' },
  processing: { label: 'Processando', variant: 'primary' },
  completed: { label: 'Concluído', variant: 'success' },
  paused: { label: 'Pausado', variant: 'warning' },
  error: { label: 'Erro', variant: 'destructive' },
  active: { label: 'Ativo', variant: 'success' },
  warming: { label: 'Aquecendo', variant: 'warning' },
  quarantine: { label: 'Quarentena', variant: 'destructive' },
  published: { label: 'Publicado', variant: 'success' },
  failed: { label: 'Falhou', variant: 'destructive' },
};

export function StatusBadge({ status, variant }: StatusBadgeProps) {
  const mapped = statusMap[status];
  const v = variant || mapped?.variant || 'muted';
  const label = mapped?.label || status;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${variantClasses[v]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${v === 'success' ? 'bg-success' : v === 'warning' ? 'bg-warning' : v === 'destructive' ? 'bg-destructive' : v === 'primary' ? 'bg-primary' : 'bg-muted-foreground'}`} />
      {label}
    </span>
  );
}
