

## Plano: Corrigir redirecionamento OAuth do Instagram

### Problema

O preview do Lovable roda dentro de um iframe. Quando `window.location.href` é usado, a navegação acontece **dentro do iframe**, e o Instagram recusa a conexão (`X-Frame-Options: DENY`). Não há nenhum iframe explícito no código do app — o problema é o contexto de execução do preview.

### Solução

Alterar **apenas uma linha** em `src/hooks/useInstagramConnect.ts`:

Substituir:
```typescript
window.location.href = data.url;
```

Por:
```typescript
window.open(data.url, '_blank');
```

Isso abre a URL OAuth do Instagram em uma **nova aba real do navegador**, fora do iframe do preview. O fluxo de callback (`/accounts/callback`) continua funcionando normalmente porque o `redirect_uri` cadastrado na Meta aponta para o domínio publicado (`autopostflow.lovable.app`), que não roda em iframe.

### Alternativa (se preferir sem popup)

Usar `window.top.location.href = data.url` para navegar a janela principal. Porém, isso só funciona se o iframe e o parent estiverem no mesmo domínio — caso contrário, o browser bloqueia por segurança cross-origin. `window.open('...', '_blank')` é a abordagem mais segura e universal.

### Arquivos editados

- `src/hooks/useInstagramConnect.ts` — uma linha alterada

### Sem mudanças

- Nenhuma alteração visual, layout, sidebar, topbar ou identidade
- Edge functions permanecem iguais
- Callback e persistência no banco inalterados

