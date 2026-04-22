import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Trash2 } from 'lucide-react';

interface SavedItem {
  id: string;
  label?: string | null;
  value: string;
}

interface SavedItemPickerProps {
  items: SavedItem[];
  onSelect: (value: string) => void;
  onRemove?: (id: string) => void;
  triggerLabel: string;
  emptyText?: string;
}

export function SavedItemPicker({ items, onSelect, onRemove, triggerLabel, emptyText = 'Nenhum item salvo' }: SavedItemPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" size="sm" variant="outline" className="text-xs gap-1.5 h-7">
          <ChevronDown className="w-3 h-3" /> {triggerLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2 max-h-48 overflow-y-auto" align="start">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-2">{emptyText}</p>
        ) : (
          <div className="space-y-1">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-2 group">
                <button
                  type="button"
                  onClick={() => { onSelect(item.value); setOpen(false); }}
                  className="flex-1 text-left text-xs p-1.5 rounded hover:bg-secondary/50 truncate text-foreground"
                >
                  {item.label || item.value}
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
