

## Plano: Refazer tela "Saude das Contas" completa e operacional

### Resumo

Reescrever `SaudePage.tsx` com todos os blocos operacionais solicitados, criar um hook dedicado `useHealthMetrics` para calculos, criar uma tabela `health_settings` para persistir o cap, e adicionar uma mutation para destravar fila. Nenhuma alteracao fora desta tela.

---

### 1. Migration: tabela `health_settings`

Criar tabela para persistir configuracoes operacionais por usuario:

```sql
CREATE TABLE public.health_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  publish_cap integer NOT NULL DEFAULT 3,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.health_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own health settings" ON public.health_settings
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

Tambem adicionar coluna `error_type` em `queue_items` para classificar falhas:

```sql
ALTER TABLE public.queue_items ADD COLUMN IF NOT EXISTS error_type text;
```

Valores possiveis: `ig_error`, `rate_limit`, `other`, `null` (sem erro).

---

### 2. Hook `src/hooks/useHealthMetrics.ts`

Hook dedicado que:
- Busca `queue_items` e `instagram_accounts` (reutiliza queries existentes ou faz queries proprias)
- Calcula todas as metricas derivadas:
  - `processing`: items com status `processing`
  - `publishing`: items com status `processing` e `updated_at` nos ultimos 5min (proxy para "enviando agora")
  - `postedLastHour`: items `completed` com `updated_at` na ultima hora
  - `rateLimited`: items com `error_type = 'rate_limit'` nas ultimas 24h
  - `pending`: items com status `pending`
  - `quarantinedAccounts`: contas com status `quarantined`
  - `postsOk`: items `completed` (ultimas 24h)
  - `igErrors`: items `failed` com `error_type = 'ig_error'` (24h)
  - `rateLimitErrors`: items `failed` com `error_type = 'rate_limit'` (24h)
  - `otherErrors`: items `failed` sem `error_type` ou com `other` (24h)
  - `successRate`: (postsOk / (postsOk + totalFailed)) * 100
  - `heldByJitter`: items `pending` cujo `scheduled_for` ja passou (presos)
- Calcula metricas por conta (agrupando `queue_items` por `account_id`):
  - posts ok, ig errors, rate limits, other errors, pending, success %
  - ordena por mais erros primeiro
- Busca e persiste `health_settings` (publish_cap)
- Expoe mutation `unlockQueue`: atualiza items `processing` ha mais de 10min para `pending`
- Expoe mutation `updateCap`: upsert em `health_settings`

---

### 3. Reescrever `src/pages/SaudePage.tsx`

Estrutura completa da pagina:

**Header**
- Titulo: "Saude das Contas"
- Subtitulo: "Metricas operacionais das ultimas 24h por conta conectada"
- Botao "Atualizar" (refetch queries)
- Botao largo "Destravar fila agora" com microcopy "Limpa processing preso e dispara reprocessamento"
  - Ao clicar: chama `unlockQueue`, mostra toast com quantidade destravada

**Bloco "Fila ao vivo"** (grid 5 colunas)
Cards maiores com:
- Processing (valor + "Container criado, aguardando IG")
- Publicando (valor + "Enviando para o Instagram agora")
- Postados (1h) (valor + "Publicados na ultima hora")
- Rate-limited (valor + "Em backoff por IG / cooldown")
- Pendentes (valor + "Aguardando proximo slot")

**Bloco "Quarentena automatica"**
- Se quarantine > 0: lista contas com status quarantined, nome e badge
- Se quarantine === 0: card positivo "Saude geral OK — nenhuma conta em quarentena"
- Microcopy: "Contas pausadas apos erros seguidos. Liberacao automatica apos cooldown."

**Bloco "Publishes em andamento (seu cap)"**
- Display "X / Y" (processing atual / cap configurado)
- Slider (min 1, max 10, step 1) com valor persistido
- Microcopy: "Ajuste o cap (2 = ultra-seguro · 5 = mais throughput)"
- onChange: debounce e salvar via `updateCap`

**Bloco "Posts segurados por jitter/lock"**
- Contagem de items pending cujo scheduled_for ja venceu
- Microcopy: "Posts com horario vencido aguardando liberacao operacional"

**Cards de resumo** (grid 5 colunas)
- Posts OK (success, icone CheckCircle2)
- IG ERROR (destructive, icone XCircle)
- Rate-limit (warning, icone AlertTriangle)
- Outros erros (muted, icone XCircle)
- Taxa de sucesso (success, valor em %)

**Secao "Por conta"**
- Input filtro por @username
- Lista de contas ordenadas por numero de erros (piores primeiro)
- Cada conta mostra:
  - Username + display_name
  - StatusBadge
  - Mini metricas inline: OK | Erros | Rate-limit | Pendentes | Sucesso %
  - Barra de progresso visual de saude (success rate)
- Estado vazio elegante
- Microcopy no header: "ordenadas por numero de erros (piores primeiro)"

---

### 4. Atualizar `MetricCard` (opcional, minimo)

Adicionar prop `description` opcional para microcopy abaixo do valor. Nao quebra usos existentes.

---

### Arquivos

**Novos:**
- `src/hooks/useHealthMetrics.ts`

**Editados:**
- `src/pages/SaudePage.tsx` (reescrita completa)
- `src/components/shared/MetricCard.tsx` (adicionar prop `description`)

**Migration:**
- Criar tabela `health_settings`
- Adicionar coluna `error_type` em `queue_items`

### Sem mudancas

- Nenhuma outra pagina, componente, sidebar, topbar ou layout
- Nenhuma alteracao visual global
- Backend existente preservado

