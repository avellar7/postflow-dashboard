import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ThemeColor = 'blue' | 'red' | 'gray' | 'purple' | 'gold';

interface ThemeContextValue {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'postflow-theme';

function getInitialTheme(): ThemeColor {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['blue', 'red', 'gray', 'purple', 'gold'].includes(stored)) {
      return stored as ThemeColor;
    }
  } catch {}
  return 'blue';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeColor>(getInitialTheme);

  const setTheme = (t: ThemeColor) => {
    setThemeState(t);
    try { localStorage.setItem(STORAGE_KEY, t); } catch {}
  };

  useEffect(() => {
    const el = document.documentElement;
    if (theme === 'blue') {
      el.removeAttribute('data-theme');
    } else {
      el.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
