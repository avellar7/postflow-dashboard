import { NavLink, useLocation } from 'react-router-dom';
import {
  Send, RefreshCw, Camera, ListOrdered, Activity,
  FolderOpen, Flame, GitBranch, Users
} from 'lucide-react';

const mainNav = [
  { label: 'Postar', icon: Send, path: '/' },
  { label: 'Loop', icon: RefreshCw, path: '/loop' },
  { label: 'Stories', icon: Camera, path: '/stories' },
  { label: 'Fila', icon: ListOrdered, path: '/fila' },
  { label: 'Saúde', icon: Activity, path: '/saude' },
];

const resourceNav = [
  { label: 'Biblioteca', icon: FolderOpen, path: '/biblioteca' },
  { label: 'Aquecimento', icon: Flame, path: '/aquecimento' },
  { label: 'Funil', icon: GitBranch, path: '/funil' },
  { label: 'Contas', icon: Users, path: '/contas' },
];

function SidebarSection({ title, items }: { title: string; items: typeof mainNav }) {
  const location = useLocation();

  return (
    <div className="mb-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-4 mb-2">
        {title}
      </p>
      <nav className="flex flex-col gap-0.5 px-2">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-primary/10 text-primary glow-blue'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
            >
              <item.icon className={`h-4 w-4 transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
              <span>{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="w-56 min-h-screen border-r border-border/50 bg-sidebar flex flex-col shrink-0">
      <div className="h-14 flex items-center px-5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
            <Send className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">POSTFLOW</span>
        </div>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <SidebarSection title="Principal" items={mainNav} />
        <SidebarSection title="Recursos" items={resourceNav} />
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
            PF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Meu Workspace</p>
            <p className="text-[10px] text-muted-foreground">Plano Pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
