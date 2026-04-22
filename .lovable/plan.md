

## Plano: Upload funcional em todo o app

### Diagnostico

Apos varredura completa, os pontos de upload no app sao:

| Tela | Estado atual | Acao necessaria |
|------|-------------|-----------------|
| Postar (UploadSection) | Funcional | Nenhuma |
| Biblioteca (FolderContent) | Funcional | Nenhuma |
| MediaLibraryModal | Funcional | Nenhuma |
| **Stories** | Mockup (dropzone falso) | Implementar upload real |
| **Loop (Capa do Reel)** | Mockup (dropzone falso) | Implementar upload real |
| Contas | Sem campos de upload | Nenhuma (so OAuth) |

Apenas **StoriesPage** e **LoopPage** precisam de correcao.

---

### Alteracoes

**1. `src/pages/StoriesPage.tsx`**

Substituir o dropzone mockado (linhas 41-45) por upload funcional:
- Importar `useMediaUpload` e `MediaLibraryModal`
- Adicionar `useRef` para file input hidden
- Implementar drag-and-drop real (`onDrop`, `onDragOver`, `onDragLeave`)
- Clicar no dropzone abre file picker
- Adicionar botoes "Selecionar arquivos" e "Da Biblioteca"
- Mostrar progresso de upload com status
- Mostrar lista de midias selecionadas com botao remover
- Ao publicar, salvar `media_id` no story criado
- Aceitar: JPG, PNG, MP4, MOV

**2. `src/pages/LoopPage.tsx`**

Substituir o dropzone "Capa do Reel" mockado (linhas 108-119) por upload funcional:
- Importar `useMediaUpload`
- Adicionar `useRef` para file input hidden
- Clicar no dropzone abre file picker (apenas imagens)
- Implementar drag-and-drop real
- Mostrar progresso de upload
- Apos upload, mostrar preview do nome do arquivo e botao para remover
- Salvar `cover_url` (storage path) ao criar o loop
- Aceitar: JPG, PNG, WEBP

Tambem renomear "Anti-deteccao IA" para "Padronizacao inteligente" (conforme plano anterior aprovado, Fase 3 item 12).

**3. Nenhum novo componente ou hook necessario**

Os hooks `useMediaUpload`, `useMediaItems` e o componente `MediaLibraryModal` ja existem e serao reutilizados. Nao ha duplicacao de logica.

### Sem mudancas

- Layout, navegacao, sidebar, topbar
- Visual premium dark mode
- PostarPage, BibliotecaPage, ContasPage (ja funcionais)
- Backend, schema, storage, auth

