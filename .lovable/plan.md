

## Plano: Corrigir fluxo OAuth do Instagram

### Causa raiz

A tabela `instagram_accounts` nao tem constraint unica em `(user_id, instagram_user_id)`. O upsert com `onConflict: "user_id,instagram_user_id"` falha com erro Postgres `42P10`. Alem disso, o hook abre nova aba e o frontend nao extrai a mensagem real de erro da edge function.

---

### 1. Migration: adicionar unique constraint

```sql
ALTER TABLE public.instagram_accounts
  ADD CONSTRAINT instagram_accounts_user_id_ig_user_id_key
  UNIQUE (user_id, instagram_user_id);
```

---

### 2. `src/hooks/useInstagramConnect.ts`

- Trocar `window.open(data.url, '_blank')` por `window.location.href = data.url`
- No `handleCallback`, ao receber erro do `supabase.functions.invoke`, tentar extrair `data?.error` ou `error?.message` e retornar a mensagem especifica em vez do erro generico

---

### 3. Edge function `instagram-oauth-callback/index.ts`

- Alterar todos os `return new Response(...)` com status nao-200 para **sempre retornar status 200** com `{ ok: false, error: "..." }` no body — isso garante que `supabase.functions.invoke` consegue ler o JSON em vez de lancar erro generico
- Adicionar `console.log` em cada etapa (auth, code, secrets, short token, long token, /me, upsert) para facilitar depuracao futura
- Manter CORS headers em todas as respostas

---

### 4. `src/pages/AccountsCallbackPage.tsx`

- Sem mudanca visual
- Ajustar apenas a logica de erro para exibir `res.error` retornado pelo hook (ja funciona com a correcao do hook)

---

### Arquivos

| Arquivo | Alteracao |
|---------|-----------|
| Migration SQL | Unique constraint em `(user_id, instagram_user_id)` |
| `src/hooks/useInstagramConnect.ts` | `window.location.href`, melhor parse de erro |
| `supabase/functions/instagram-oauth-callback/index.ts` | Status 200 sempre, logs por etapa |

### Sem mudancas

- Layout, visual, sidebar, topbar, outras paginas
- Edge function `instagram-oauth-start` (funciona corretamente)
- `AccountsCallbackPage.tsx` (visual mantido, erro ja vem do hook)

