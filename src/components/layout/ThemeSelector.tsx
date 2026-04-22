import { Palette } from 'lucide-react';
import { useTheme, ThemeColor } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const themes: { key: ThemeColor; label: string; color: string }[] = [
  { key: 'blue', label: 'Azul', color: 'hsl(217, 91%, 60%)' },
  { key: 'red', label: 'Vermelho', color: 'hsl(0, 65%, 48%)' },
  { key: 'gray', label: 'Cinza', color: 'hsl(220, 10%, 50%)' },
  { key: 'purple', label: 'Roxo', color: 'hsl(270, 60%, 55%)' },
  { key: 'gold', label: 'Dourado', color: 'hsl(40, 70%, 50%)' },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all">
          <Palette className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Tema
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="p-2 flex flex-col gap-1">
          {themes.map((t) => (
            <button
              key={t.key}
              onClick={() => setTheme(t.key)}
              className={`flex items-center gap-3 px-2.5 py-2 rounded-md text-sm font-medium transition-all w-full text-left
                ${theme === t.key
                  ? 'bg-primary/10 text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
            >
              <span
                className="w-4 h-4 rounded-full shrink-0 border border-white/10"
                style={{ backgroundColor: t.color }}
              />
              {t.label}
              {theme === t.key && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
