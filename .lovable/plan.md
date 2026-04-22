

## Plano: Editar nome de pasta na Biblioteca

### Alteracao unica: `src/pages/BibliotecaPage.tsx`

Modificar o componente `FolderGrid` para suportar edicao inline de nome:

1. Adicionar estado local `editingId` e `editName` no `FolderGrid`
2. Adicionar botao de editar (icone Pencil) ao lado do botao de excluir, visivel no hover
3. Ao clicar em editar:
   - Setar `editingId` para o id da pasta
   - Substituir o `<h3>` do nome por um `<input>` pre-preenchido
   - Focar automaticamente no input
4. Ao confirmar (Enter ou blur):
   - Validar: trim, nao vazio
   - Chamar `update.mutate({ id, name })` do `useFolders`
   - Toast de sucesso/erro ja existe no hook
5. Ao cancelar (Escape): limpar `editingId` sem salvar
6. Impedir que clique no card abra a pasta enquanto estiver editando

### Prop adicional

Passar `onRename: (id: string, name: string) => void` para `FolderGrid`, usando `update.mutate` do `useFolders` (ja existente e funcional no hook).

### Sem mudancas

- Hook `useFolders` ja tem mutation `update` completa com invalidacao e toasts
- Nenhuma alteracao de layout, backend, schema ou outras paginas
- Visual permanece identico exceto pelo icone de editar e input inline

