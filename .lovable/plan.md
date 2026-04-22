

## Plano: Ajustar construção da URL OAuth do Instagram

### Problema

A URL gerada pela edge function `instagram-oauth-start` usa `https://www.instagram.com/oauth/authorize` com `URL.searchParams`, que produz uma URL diferente do padrão do app original funcional. Diferenças principais:
- O parâmetro `next` interno usa URL absoluta em vez de relativa
- `enable_fb_login=1` em vez de `0`

Esses parâmetros são controlados pelo Instagram/Meta internamente com base na URL de entrada, mas podemos ajustar a URL base e adicionar `enable_fb_login=0` explicitamente.

### Alteração

**Arquivo:** `supabase/functions/instagram-oauth-start/index.ts`

Substituir a construção da URL (linhas 56-66) por montagem manual da query string para controle total do formato, e adicionar `enable_fb_login=0`:

```typescript
const scope = "instagram_business_basic,instagram_business_content_publish";

const params = new URLSearchParams();
params.set("enable_fb_login", "0");
params.set("force_authentication", "1");
params.set("client_id", clientId);
params.set("redirect_uri", redirectUri);
params.set("response_type", "code");
params.set("scope", scope);
params.set("state", state);

const oauthUrl = `https://www.instagram.com/oauth/authorize?${params.toString()}`;
```

Mudancas:
1. `enable_fb_login=0` -- desabilita login via Facebook, igual ao app original
2. `force_authentication=1` -- forca re-autenticacao, padrao do app original
3. Scope usa virgula simples (ja estava correto)
4. URL montada como string com `URLSearchParams.toString()` para formato limpo

### Deploy

Redeployar `instagram-oauth-start` e testar via CURL para validar a URL gerada.

### Sem mudancas

- Nenhuma alteracao visual, layout ou identidade
- Callback e persistencia no banco inalterados
- `useInstagramConnect.ts` permanece igual

