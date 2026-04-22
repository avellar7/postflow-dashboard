

## Plano: FASE 2 — Backend Real com Lovable Cloud

Este plano conecta o app POSTFLOW existente ao Lovable Cloud, mantendo a interface 100% intacta. Apenas a camada de dados e autenticação será substituída.

---

### 1. Habilitar Lovable Cloud e instalar Supabase client

- Adicionar `@supabase/supabase-js` ao projeto
- Criar `src/integrations/supabase/client.ts` com o client configurado
- Criar `src/integrations/supabase/types.ts` com os tipos gerados

---

### 2. Criar tabelas via migrations

10 tabelas, todas com RLS habilitado:

| Tabela | Campos principais |
|--------|-------------------|
| `profiles` | id (FK auth.users), email, name, avatar_url, created_at, updated_at |
| `user_roles` | id, user_id (FK auth.users), role (enum: admin/member/viewer) |
| `instagram_accounts` | id, user_id, username, display_name, status (enum), tags (jsonb), notes, timestamps |
| `library_folders` | id, user_id, name, description, timestamps |
| `media_items` | id, user_id, folder_id (FK), title, file_name, file_url, media_type (enum), thumbnail_url, timestamps |
| `saved_captions` | id, user_id, title, content, is_random, timestamps |
| `queue_items` | id, user_id, account_id (FK), media_id (FK), caption_id (FK), mode, post_mode, status (enum), scheduled_for, timestamps |
| `loops` | id, user_id, account_id (FK), folder_id (FK), is_infinite, cycles, interval_minutes, cover_url, effects (jsonb), is_active, timestamps |
| `stories` | id, user_id, account_id (FK), media_id (FK), strategy (enum), status (enum), timestamps |
| `warmup_accounts` | id, user_id, account_id (FK), daily_target, interval_minutes, current_status (enum), timestamps |
| `funnels` | id, user_id, name, description, timestamps |

Trigger automático: ao criar um usuário em auth.users, criar automaticamente um registro em `profiles`.

Roles separados na tabela `user_roles` com função `has_role()` SECURITY DEFINER para evitar recursão RLS.

---

### 3. RLS Policies

Regra base para todas as tabelas de dados:
- SELECT/INSERT/UPDATE/DELETE: `user_id = auth.uid()`

Para `profiles`:
- SELECT próprio perfil: `id = auth.uid()`
- UPDATE próprio perfil: `id = auth.uid()`

Para `user_roles`:
- SELECT: `user_id = auth.uid()`
- INSERT/UPDATE/DELETE: apenas admin via `has_role(auth.uid(), 'admin')`

---

### 4. Autenticação real

**Arquivo: `src/contexts/AuthContext.tsx`** — reescrever internamente (sem mudar a interface do contexto):
- Substituir mock por `supabase.auth.signInWithPassword()`
- `onAuthStateChange` para gerenciar sessão
- `supabase.auth.signOut()` no logout
- Carregar perfil + role do banco após login
- Manter o mesmo `AuthContextType` para não quebrar nenhum componente

**Arquivo: `src/pages/LoginPage.tsx`** — manter exatamente igual visualmente:
- Apenas trocar o `login()` para usar o auth real
- Remover hint de credenciais mock

**Arquivo: `src/components/auth/ProtectedRoute.tsx`** — manter lógica, apenas usar sessão real

**Arquivo: `src/components/layout/Topbar.tsx`** — sem alterações visuais, badge ADM alimentado pelo role real

---

### 5. Camada de dados (hooks React Query)

Criar hooks organizados em `src/hooks/` usando `@tanstack/react-query` + Supabase client:

| Hook | Tabela | Operações |
|------|--------|-----------|
| `useAccounts` | instagram_accounts | list, create, update, delete |
| `useFolders` | library_folders | list, create, update, delete |
| `useCaptions` | saved_captions | list, create, update, delete |
| `useQueueItems` | queue_items | list, create, update, delete |
| `useLoops` | loops | list, create, update, delete |
| `useStories` | stories | list, create, delete |
| `useWarmupAccounts` | warmup_accounts | list, create, update, delete |
| `useFunnels` | funnels | list, create, update, delete |

Cada hook retorna `{ data, isLoading, error }` + mutations com `toast` de sucesso/erro.

---

### 6. Conectar páginas ao backend

Cada página será atualizada para usar os hooks reais em vez dos mocks:

| Página | Mudança |
|--------|---------|
| `PostarPage` | `useCaptions` para CRUD de legendas; `useQueueItems` para preview da fila |
| `LoopPage` | `useLoops` para criar/listar; `useAccounts` e `useFolders` para selects |
| `StoriesPage` | `useStories` para criar/listar; `useAccounts` para selecionar contas |
| `FilaPage` | `useQueueItems` para listar/remover/atualizar status |
| `SaudePage` | Queries derivadas de `useQueueItems` e `useAccounts` para métricas reais |
| `BibliotecaPage` | `useFolders` para CRUD de pastas |
| `AquecimentoPage` | `useWarmupAccounts` para listar/criar/remover |
| `FunilPage` | `useFunnels` para CRUD |
| `ContasPage` | `useAccounts` para CRUD |

Cada página mantém loading states, empty states e toasts já existentes — apenas a fonte de dados muda.

---

### 7. Saúde das Contas (dados derivados)

A tela Saúde calculará métricas a partir de dados reais:
- Total/pendentes/processando/concluídos/falhados: contagem de `queue_items` por status
- Contas em quarentena/warming: contagem de `instagram_accounts` por status
- Taxa de sucesso: `completed / (completed + failed) * 100`
- Fallback para 0 quando não houver dados

---

### 8. Seed inicial / Admin

- Após criar conta via signup (email + senha), inserir manualmente o role `admin` na tabela `user_roles` via Cloud UI
- Instruções claras serão fornecidas ao final da implementação
- Alternativa: criar uma migration de seed que insere o role admin para o primeiro usuário

---

### 9. Storage (preparado, não implementado)

- Criar bucket `media` no Supabase Storage com policy `user_id = auth.uid()`
- Não conectar uploads nesta fase — apenas preparar a infraestrutura
- Campos `file_url`, `thumbnail_url`, `cover_url`, `avatar_url` permanecem nullable

---

### Arquivos criados/editados

**Novos:**
- `src/integrations/supabase/client.ts`
- `src/integrations/supabase/types.ts`
- `src/hooks/useAccounts.ts`
- `src/hooks/useCaptions.ts`
- `src/hooks/useQueueItems.ts`
- `src/hooks/useLoops.ts`
- `src/hooks/useStories.ts`
- `src/hooks/useWarmupAccounts.ts`
- `src/hooks/useFolders.ts`
- `src/hooks/useFunnels.ts`
- Migrations para todas as tabelas + RLS + trigger

**Editados (apenas lógica interna, zero mudança visual):**
- `src/contexts/AuthContext.tsx`
- `src/types/auth.ts`
- `src/pages/PostarPage.tsx`
- `src/pages/LoopPage.tsx`
- `src/pages/StoriesPage.tsx`
- `src/pages/FilaPage.tsx`
- `src/pages/SaudePage.tsx`
- `src/pages/BibliotecaPage.tsx`
- `src/pages/AquecimentoPage.tsx`
- `src/pages/FunilPage.tsx`
- `src/pages/ContasPage.tsx`
- `src/pages/LoginPage.tsx`

**Removido após migração:**
- `src/data/mock.ts` (dados mock não mais necessários)

