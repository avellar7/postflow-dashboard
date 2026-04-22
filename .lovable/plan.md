

## Plano: Stories funcional + salvamento global de links e CTAs

### Resumo

Adicionar duas tabelas (`saved_links`, `saved_ctas`), duas colunas na tabela `stories` (`link_url`, `cta_text`), criar hooks CRUD reutilizaveis, tornar a secao "Estrategia de link" funcional com campos reais e reutilizacao, e implementar "Limpar tudo" no historico.

---

### 1. Migration SQL

```sql
-- Tabela saved_links
CREATE TABLE public.saved_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own links" ON public.saved_links
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Tabela saved_ctas
CREATE TABLE public.saved_ctas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  label text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_ctas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own ctas" ON public.saved_ctas
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Colunas extras em stories
ALTER TABLE public.stories ADD COLUMN link_url text;
ALTER TABLE public.stories ADD COLUMN cta_text text;
```

---

### 2. Novos hooks

**`src/hooks/useSavedLinks.ts`**
- CRUD completo: query, create, update, remove
- Mesmo padrao de `useCaptions`
- Toasts em portugues

**`src/hooks/useSavedCtas.ts`**
- CRUD completo: query, create, update, remove
- Mesmo padrao de `useCaptions`
- Toasts em portugues

---

### 3. Reescrever `src/pages/StoriesPage.tsx`

**Estrategia de link — campos condicionais:**

- `none`: sem campos extras (igual hoje)
- `link_bio`: mostrar input de URL + botao "Salvar link" + popover/dropdown com links salvos
  - Validacao basica de URL
  - Ao selecionar link salvo, preenche o campo
- `text_cta`: mostrar textarea de CTA + botao "Salvar CTA" + popover/dropdown com CTAs salvos
  - Ao selecionar CTA salvo, preenche o campo

**Publicar Story:**
- Incluir `link_url` e `cta_text` no payload do `createStory.mutate`

**Limpar tudo:**
- Implementar funcao real que deleta todos os stories do usuario
- Confirmar com dialog antes de executar
- Toast de sucesso

**Historico:**
- Mostrar estrategia e trecho do link/CTA em cada item do historico

---

### 4. Componente reutilizavel `src/components/shared/SavedItemPicker.tsx`

Componente generico de popover/dropdown para selecionar item salvo:
- Props: `items`, `onSelect`, `label`, `emptyText`
- Renderiza lista compacta com botao de selecionar
- Reutilizavel para links, CTAs, e futuramente outros conteudos

---

### Arquivos

**Novos:**
- `src/hooks/useSavedLinks.ts`
- `src/hooks/useSavedCtas.ts`
- `src/components/shared/SavedItemPicker.tsx`

**Editados:**
- `src/pages/StoriesPage.tsx`
- `src/hooks/useStories.ts` (adicionar mutation `removeAll`)

**Migration:**
- Criar `saved_links`, `saved_ctas`
- Adicionar `link_url`, `cta_text` em `stories`

### Sem mudancas

- Layout, sidebar, topbar, outras paginas
- Visual premium dark mode
- Hooks e componentes existentes (captions, media, etc.)

