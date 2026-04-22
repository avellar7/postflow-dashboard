

## Plano: Tornar o POSTFLOW Funcional (Backend + Frontend)

Este e um projeto grande. O plano esta dividido em fases sequenciais para manter qualidade e evitar quebras. Sugiro implementar em **3 fases**.

---

### FASE 1 -- Storage, Upload e Biblioteca

**1. Criar storage bucket `media`**

Migration SQL:
- Criar bucket `media` (privado)
- RLS policies no `storage.objects`: usuarios so acessam seus proprios arquivos (path inicia com `user_id/`)

**2. Adicionar colunas em `media_items`**

Migration para adicionar:
- `file_size bigint`
- `mime_type text`
- `duration_seconds numeric`
- `processing_status text default 'raw'` (raw, processing, completed, failed)
- `processing_log jsonb default '[]'`
- `processed_file_path text`
- `original_file_path text`

**3. Adicionar colunas em `queue_items`**

Migration para adicionar:
- `processing_options jsonb default '{}'`
- `output_media_id uuid references media_items(id)`
- `error_message text`

**4. Hook `useMediaUpload`**

Novo hook em `src/hooks/useMediaUpload.ts`:
- Aceita File, valida tipo (MP4/MOV) e tamanho (100MB)
- Upload para storage `media/{user_id}/{uuid}/{filename}`
- Cria registro em `media_items` com file_url, file_name, file_size, mime_type
- Retorna progresso de upload (usando XMLHttpRequest ou supabase upload com onUploadProgress)
- Invalida query `['media_items']`

**5. Hook `useMediaItems`**

Novo hook em `src/hooks/useMediaItems.ts`:
- Lista media_items do usuario
- Suporta filtro por folder_id
- Retorna signed URLs para preview

**6. Atualizar PostarPage -- Upload funcional**

No bloco de upload:
- Drag & drop real com `onDragOver/onDrop`
- Input file hidden acionado pelo botao "Selecionar arquivos"
- Barra de progresso durante upload
- Lista de arquivos sendo enviados com status
- Ao concluir, arquivo aparece como midia selecionada

**7. Modal de Biblioteca**

Novo componente `src/components/media/MediaLibraryModal.tsx`:
- Dialog que lista media_items do usuario
- Filtro por pasta (library_folders)
- Preview com thumbnail ou icone de video
- Selecao de midia(s)
- Botao confirmar que retorna os IDs selecionados

**8. Atualizar BibliotecaPage**

- Ao clicar numa pasta, listar media_items daquela pasta
- Permitir upload de arquivos diretamente na pasta
- Mostrar contagem de itens por pasta

---

### FASE 2 -- Fila, Agendamento e Legendas Funcionais

**9. Atualizar PostarPage -- Agendamento real**

- No modo "Agendar", mostrar date/time picker real
- Persistir `scheduled_for` no queue_items
- Botao "Iniciar automacao" cria item real em queue_items com:
  - media_id da midia selecionada
  - caption_id da legenda selecionada (se houver)
  - mode (now/scheduled)
  - post_mode (sequential/burst)
  - processing_options (metadata_profile, smart_processing, variations)
  - status: pending

**10. Legendas -- editar**

- Adicionar mutation `update` no `useCaptions` hook
- Tornar botao Pencil funcional: inline edit ou modal simples
- Ao criar item na fila, permitir associar legenda

**11. FilaPage melhorias**

- Mostrar mais detalhes por item (modo, agendamento, legenda associada)
- Botao para alterar status manualmente (pending -> processing -> completed)
- Filtros por status

---

### FASE 3 -- Configuracoes Avancadas e Processamento

**12. Renomear "Anti-deteccao IA" para "Padronizacao inteligente"**

No PostarPage, alterar apenas os textos:
- "Anti-deteccao IA" -> "Padronizacao inteligente"
- "Variacao automatica" -> "Normalizacao automatica de midia"
- "Variacoes por video (alterna a cada ciclo)" -> "Versoes processadas por video"
- Subtexto do metadata: "Como o video se identifica para o Instagram" -> "Perfil de compatibilidade tecnica"

**13. Persistir configuracoes avancadas**

As opcoes (smart_processing, metadata_profile, variations) sao salvas no `processing_options` JSON do queue_item ao criar o item na fila. Nao precisa de tabela separada.

**14. Edge function `process-media`**

Backend function que:
- Recebe media_id e processing_options
- Baixa arquivo do storage
- Usa ffmpeg (via Deno FFI ou exec) para:
  - Remover metadata EXIF/GPS para privacidade
  - Normalizar container para MP4/H.264
  - Gerar thumbnail (frame do segundo 1)
  - Aplicar preset de metadata (auto/iphone/android)
  - Gerar N versoes com leves variacoes de bitrate
- Salva arquivos processados no storage
- Atualiza media_items com processed_file_path, thumbnail_url, processing_status, processing_log

**Nota importante sobre ffmpeg**: Edge functions Deno tem limitacoes de tempo (max 60s) e nao tem ffmpeg nativo. A abordagem pratica sera:
- Para thumbnail: usar frame extraction via canvas no frontend, ou aceitar que o primeiro frame e suficiente
- Para metadata removal e normalizacao: implementar o que for possivel server-side, e registrar o que foi aplicado no log
- Marcar no processing_log o que foi feito vs o que nao foi possivel

---

### Resumo de arquivos

**Novos:**
- `src/hooks/useMediaUpload.ts`
- `src/hooks/useMediaItems.ts`
- `src/components/media/MediaLibraryModal.tsx`
- `supabase/functions/process-media/index.ts`

**Editados:**
- `src/pages/PostarPage.tsx` (upload real, biblioteca, agendamento, rename labels)
- `src/pages/BibliotecaPage.tsx` (listar midias por pasta, upload na pasta)
- `src/hooks/useCaptions.ts` (adicionar update mutation)
- `src/hooks/useQueueItems.ts` (adicionar processing_options no create)

**Migrations:**
- Criar bucket `media` + RLS
- ALTER TABLE `media_items` ADD COLUMN (6 colunas)
- ALTER TABLE `queue_items` ADD COLUMN (3 colunas)

### Sem mudancas

- Layout, sidebar, topbar, navegacao
- Sistema de temas
- Auth, RLS existentes
- Visual premium dark mode

---

### Sugestao de execucao

Dado o tamanho, recomendo aprovar e implementar **Fase 1 primeiro** (storage + upload + biblioteca). Depois seguimos com Fase 2 e 3. Posso implementar tudo de uma vez se preferir, mas em fases o risco de quebra e menor.

