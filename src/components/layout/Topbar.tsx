import { Plus, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Topbar() {
  return (
    <header className="h-14 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
          <Zap className="w-3 h-3 text-warning" />
          <span className="text-xs font-mono font-medium text-muted-foreground">
            BOT :: <span className="text-warning">IDLE</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-xs font-semibold shadow-lg shadow-primary/20"
          onClick={() => toast.success('Agendamento criado (mockado)')}
        >
          <Plus className="w-3.5 h-3.5" />
          Novo Agendamento
        </Button>
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
          U
        </div>
      </div>
    </header>
  );
}
