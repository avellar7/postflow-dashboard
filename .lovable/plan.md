

## Plano: Auditoria tecnica completa do POSTFLOW — correcoes

### Resumo da auditoria

Apos revisar todos os arquivos, hooks, paginas, tipos e banco, o app esta em bom estado geral. A maioria dos fluxos CRUD esta corretamente conectada ao backend com RLS, toasts e loading states. Seguem os problemas encontrados e as correcoes necessarias:

---

### Problemas encontrados

| # | Area | Problema | Severidade |
|---|------|----------|------------|
| 1 | Aquecimento | `useWarmupAccounts` faz join `*, instagram_accounts(username)` mas o resultado e acessado como `(w as any).instagram_accounts?.username` — funciona mas depende de cast unsafe. Se o join falhar silenciosamente, mostra "Conta" generico | Baixa |
| 2 | LoopPage | Console warning: "Function components cannot be given refs" — nao e um bug funcional, mas polui o console | Baixa |
| 3 | PostarPage | `handleStartAutomation` casta `as any` ao chamar `createQueueItem.mutate` — funciona mas perde type safety | Baixa |
| 4 | Stories | Botao "Publicar Story" nao valida se ha midia selecionada — permite publicar story vazio | Media |
| 5 | Stories | Historico nao mostra botao de remover individual por story (so "Limpar tudo") | Baixa |
| 6 | Saude | `StatusBadge` recebe `status="quarantine"` mas `StatusBadge` nao tem mapeamento para `"quarantined"` (o valor real do enum no banco) — pode mostrar texto cru | Media |
| 7 | Fila | Nao ha botao para marcar item como "failed" — so pode ir de pending para processing e de processing para completed | Baixa |
| 8 | Captions | Botao "Gerar com IA" e mockado — coloca texto fixo, nao gera nada real | Baixa (documentado) |
| 9 | LoopPage | Nao mostra lista de loops ja criados — so permite criar novos | Media |
| 10 | Funil | Nao ha edicao de nome de funil — so criar e deletar | Baixa |

---

### Correcoes a implementar

**1. StoriesPage — validacao antes de publicar**

Adicionar validacao em `handlePublish`:
- Se `linkStrategy === 'link_bio'` e `linkUrl` vazio, mostrar toast de erro
- Se `linkStrategy === 'text_cta'` e `ctaText` vazio, mostrar toast de erro
- Adicionar botao de remover individual em cada story do historico

**2. StatusBadge — adicionar mapeamento "quarantined"**

Adicionar ao `statusMap`:
```
quarantined: { label: 'Quarentena', variant: 'destructive' }
```
Assim tanto `quarantine` quanto `quarantined` funcionam.

**3. LoopPage — mostrar lista de loops criados**

Adicionar secao abaixo do formulario com os loops ja criados (usando `useLoops().loops`), com botao de remover. Segue o mesmo padrao visual das outras paginas (grid de cards glass).

**4. FunilPage — adicionar edicao de nome**

Adicionar edicao inline de nome (mesmo padrao da BibliotecaPage: icone Pencil, input inline, Enter/Escape/blur). Requer adicionar mutation `update` ao `useFunnels` hook.

**5. AquecimentoPage — melhorar display do username**

Remover o cast `(w as any)` e tipar corretamente o retorno do join. Se o join falhar, usar fallback baseado em `account_id`.

**6. PostarPage — remover cast `as any`**

Ajustar o tipo do input do `createQueueItem.mutate` para aceitar `processing_options` corretamente, ou manter o cast com um comentario explicativo.

---

### Arquivos editados

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/shared/StatusBadge.tsx` | Adicionar `quarantined` ao `statusMap` |
| `src/pages/StoriesPage.tsx` | Validacao no `handlePublish`, botao remover por story |
| `src/pages/LoopPage.tsx` | Adicionar listagem de loops criados com delete |
| `src/pages/FunilPage.tsx` | Adicionar edicao inline de nome |
| `src/hooks/useFunnels.ts` | Adicionar mutation `update` |

### Sem mudancas

- Layout, sidebar, topbar, visual global
- Backend, schema, storage, auth
- Nenhuma migration necessaria
- Todas as outras paginas (Postar, Biblioteca, Fila, Saude, Contas, Aquecimento)

