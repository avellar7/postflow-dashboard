

## Plano: Integração OAuth com Instagram/Meta (Fase inicial)

Conectar contas profissionais do Instagram via OAuth oficial da Meta, mantendo a interface atual 100% intacta. Sem publicação, webhooks ou refresh avançado nesta fase.

---

### 1. Secrets (Lovable Cloud)

Serão solicitados via `add_secret` antes da implementação:
- `INSTAGRAM_APP_ID`
- `INSTAGRAM_APP_SECRET`
- `INSTAGRAM_REDIRECT_URI` (valor: `https://autopostflow.lovable.app/accounts/callback`)

App Secret permanece apenas na edge function — nunca exposto ao cliente.

---

### 2. Ajustes no banco (migration mínima)

Adicionar colunas à tabela `instagram_accounts` já existente:

| Coluna | Tipo | Nullable |
|---|---|---|
| `instagram_user_id` | text | yes |
| `access_token` | text | yes |
| `token_type` | text | yes |
| `permissions` | jsonb | yes |
| `connected_at` | timestamptz | yes |

Índice único `(user_id, instagram_user_id)` para fazer upsert e evitar duplicatas. RLS já existente (`user_id = auth.uid()`) continua válido.

---

### 3. Edge functions

**`supabase/functions/instagram-oauth-start/index.ts`**
- Recebe request autenticado do usuário
- Monta URL OAuth: `https://www.instagram.com/oauth/authorize` com `client_id`, `redirect_uri`, `response_type=code`, `scope=instagram_business_basic,instagram_business_content_publish`, e um `state` aleatório (user_id assinado)
- Retorna `{ url }` para o frontend redirecionar

**`supabase/functions/instagram-oauth-callback/index.ts`**
- Recebe `{ code }` do frontend (rota `/accounts/callback`)
- Valida JWT do usuário (verify_jwt = true)
- Troca `code` por short-lived token em `https://api.instagram.com/oauth/access_token` (POST form-urlencoded com `client_id`, `client_secret`, `grant_type=authorization_code`, `redirect_uri`, `code`)
- Troca short-lived por long-lived token em `https://graph.instagram.com/access_token?grant_type=ig_exchange_token`
- Busca dados da conta em `https://graph.instagram.com/v21.0/me?fields=id,username,account_type`
- Upsert em `instagram_accounts` (chave `user_id + instagram_user_id`): `username`, `instagram_user_id`, `access_token`, `token_type='bearer'`, `permissions`, `connected_at=now()`, `status='active'`
- Retorna `{ success, username }`

Tratamento de erro com mensagens claras para cada etapa (code inválido, token falhou, fetch perfil falhou, erro ao salvar).

---

### 4. Frontend

**`src/pages/AccountsCallbackPage.tsx`** (nova)
- Lê `code` e `error` da URL
- Se `error`: mostra estado de erro com botão "Voltar para Contas"
- Se `code`: loading elegante (glass-card centralizado com spinner + texto "Conectando sua conta do Instagram...")
- Invoca edge function `instagram-oauth-callback` com `{ code }`
- Sucesso: `toast.success('Conta @username conectada!')` e `navigate('/contas')`
- Erro: estado de erro com mensagem e botão voltar

**`src/App.tsx`**
- Adicionar rota `<Route path="/accounts/callback" element={<Protected><AccountsCallbackPage /></Protected>} />`

**`src/pages/ContasPage.tsx`** (mudança mínima, sem alterar layout)
- Substituir o input "username manual" + botão "Adicionar" pelo botão **"+ Instagram"** que dispara o fluxo OAuth. O card glass que contém o input permanece com o mesmo visual; apenas troca-se o conteúdo interno por uma call-to-action coerente (ícone Instagram + texto "Conectar conta profissional do Instagram via Meta").
- No card de cada conta, exibir `connected_at` formatado como "Conectada em dd/mm/yyyy" quando presente, e um pequeno badge "Conectada" quando houver `access_token`. Mantém o `StatusBadge` e layout atuais.
- `remove.mutate(id)` continua igual (apenas deleta registro local, sem revogar na Meta).

**`src/hooks/useInstagramConnect.ts`** (novo)
- `startConnect()`: invoca edge function `instagram-oauth-start`, recebe `url`, faz `window.location.href = url`
- `handleCallback(code)`: invoca `instagram-oauth-callback`, retorna resultado
- Estados `isConnecting` / `isProcessing` com toasts apropriados

---

### 5. Arquivos criados/editados

**Novos:**
- `supabase/functions/instagram-oauth-start/index.ts`
- `supabase/functions/instagram-oauth-callback/index.ts`
- `src/pages/AccountsCallbackPage.tsx`
- `src/hooks/useInstagramConnect.ts`
- Migration para adicionar colunas

**Editados (mudanças mínimas):**
- `src/App.tsx` — adicionar rota callback
- `src/pages/ContasPage.tsx` — trocar input manual por botão OAuth, exibir `connected_at`
- `src/integrations/supabase/types.ts` — regenerado automaticamente

---

### 6. Segurança

- Edge functions validam JWT (usuário autenticado obrigatório)
- App Secret só existe no ambiente da edge function
- Conta salva com `user_id = auth.uid()` e protegida por RLS existente
- `state` no OAuth contém user_id para prevenir CSRF / account mix-up
- Token armazenado apenas no backend (coluna `access_token`), nunca retornado ao cliente em listagens (o hook `useAccounts` continua com `select('*')` — aceitável nesta fase pois RLS garante isolamento; pode ser refinado depois com uma view pública)

---

### 7. Fora de escopo (confirmado)

- Publicação real de posts/stories
- Webhooks
- Refresh automático de token (long-lived token já dura 60 dias)
- Revogação na Meta ao remover
- Sincronização de insights

