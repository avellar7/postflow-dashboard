import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'destructive' | 'muted';
  description?: string;
}

const colorMap: Record<string, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  destructive: 'text-destructive',
  muted: 'text-muted-foreground',
};

export function MetricCard({ label, value, icon, color = 'primary', description }: MetricCardProps) {
  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {icon}
      </div>
      <span className={`text-2xl font-bold ${colorMap[color]}`}>{value}</span>
      {description && <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>}
    </div>
  );
}
