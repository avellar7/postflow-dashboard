

## Plano: Sistema de Temas de Cor

### Arquitetura

O app ja usa CSS custom properties (HSL) em `:root` para todas as cores. A estrategia e criar classes CSS por tema (`[data-theme="red"]`, etc.) que sobrescrevem apenas as variaveis de accent/primary, mantendo backgrounds, cards e estrutura escura intactos.

### Arquivos novos

**1. `src/contexts/ThemeContext.tsx`**

Context + Provider que:
- Armazena o tema ativo em state
- Persiste em `localStorage` (chave `postflow-theme`)
- Aplica `data-theme` no `document.documentElement`
- Exporta `useTheme()` com `{ theme, setTheme }`
- Temas: `blue | red | gray | purple | gold`

**2. `src/components/layout/ThemeSelector.tsx`**

Componente discreto com 5 circulos coloridos dentro de um `DropdownMenu`. Cada circulo mostra a cor primaria do tema. Clique aplica o tema instantaneamente. Posicionado na Topbar, entre o botao de agendamento e o avatar.

### Arquivos editados

**3. `src/index.css`** -- Adicionar blocos de tema

Apos o `:root` existente (que vira o tema `blue` padrao), adicionar:

```css
[data-theme="red"] {
  --primary: 0 65% 48%;
  --accent: 0 65% 48%;
  --ring: 0 65% 48%;
  --sidebar-primary: 0 65% 48%;
  --sidebar-ring: 0 65% 48%;
}
[data-theme="gray"] {
  --primary: 220 10% 50%;
  --accent: 220 10% 50%;
  --ring: 220 10% 50%;
  --sidebar-primary: 220 10% 50%;
  --sidebar-ring: 220 10% 50%;
}
[data-theme="purple"] {
  --primary: 270 60% 55%;
  --accent: 270 60% 55%;
  --ring: 270 60% 55%;
  --sidebar-primary: 270 60% 55%;
  --sidebar-ring: 270 60% 55%;
}
[data-theme="gold"] {
  --primary: 40 70% 50%;
  --accent: 40 70% 50%;
  --ring: 40 70% 50%;
  --sidebar-primary: 40 70% 50%;
  --sidebar-ring: 40 70% 50%;
  --primary-foreground: 0 0% 10%;
  --accent-foreground: 0 0% 10%;
  --sidebar-primary-foreground: 0 0% 10%;
}
```

Tambem atualizar `.glow-blue` para usar `var(--primary)` em vez de hardcoded, e renomear para `.glow-primary`. Atualizar `.gradient-mesh` para usar `var(--primary)`.

**4. `src/App.tsx`** -- Envolver com `ThemeProvider`

Adicionar `<ThemeProvider>` dentro do `QueryClientProvider`.

**5. `src/components/layout/Topbar.tsx`** -- Adicionar `ThemeSelector`

Importar e renderizar `<ThemeSelector />` na area direita da topbar, entre o botao "Novo Agendamento" e o badge ADM.

**6. Buscar e atualizar referencias a `glow-blue`** em componentes para usar `glow-primary`.

### Variaveis afetadas por tema

Apenas as variaveis de accent/destaque mudam:
- `--primary`, `--accent`, `--ring`
- `--sidebar-primary`, `--sidebar-ring`
- `--primary-foreground` (apenas gold, que precisa texto escuro)

Variaveis que NAO mudam (mantendo o dark mode):
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--secondary`, `--muted`, `--border`, `--input`
- `--destructive`, `--success`, `--warning`, `--info`

### Comportamento

- Tema padrao: `blue` (identico ao visual atual)
- Troca instantanea sem reload (CSS custom properties)
- Persistencia em `localStorage`
- Sem flicker: tema aplicado antes do render via script inline ou no Provider

### Sem mudancas

- Nenhuma alteracao de layout, estrutura ou componentes
- Nenhuma alteracao no backend
- Nenhuma alteracao em paginas existentes

