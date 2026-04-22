

## Plan: Tela de Login Mockada + Autenticação Local com Roles

### O que será criado

1. **Sistema de autenticação mockado** com contexto React, persistência em localStorage e estrutura de roles preparada para evolução futura.

2. **Tela de login premium** em `/login` com visual dark mode coerente com o app.

3. **Proteção de rotas** — todas as páginas do dashboard redirecionam para `/login` se não houver sessão.

4. **Badge ADM** visível na Topbar quando o usuário logado tiver role `admin`.

5. **Logout funcional** no avatar da Topbar.

---

### Arquivos novos

| Arquivo | Descrição |
|---------|-----------|
| `src/types/auth.ts` | Tipos `UserRole` (`admin`, `member`, `viewer`), `MockUser`, `AuthState` |
| `src/contexts/AuthContext.tsx` | Context + Provider com login/logout mockado, persistência em localStorage, usuário padrão admin |
| `src/components/auth/ProtectedRoute.tsx` | Wrapper que redireciona para `/login` se não autenticado |
| `src/pages/LoginPage.tsx` | Tela de login premium dark mode |

### Arquivos editados

| Arquivo | Mudança |
|---------|---------|
| `src/App.tsx` | Envolver com `AuthProvider`, adicionar rota `/login`, proteger rotas do dashboard com `ProtectedRoute` |
| `src/components/layout/Topbar.tsx` | Mostrar badge "ADM" ao lado do avatar quando role=admin; adicionar dropdown ou botão de logout |

---

### Detalhes técnicos

**Tipos (auth.ts)**
- `type UserRole = 'admin' \| 'member' \| 'viewer'`
- `interface MockUser { id, name, email, role, avatar }`
- Usuário padrão: `{ name: 'Administrador', email: 'admin@postflow.io', role: 'admin' }`

**AuthContext**
- Estado: `user: MockUser | null`, `isAuthenticated: boolean`
- Funções: `login(email, password)` valida contra credenciais mockadas, salva em `localStorage('postflow_session')`; `logout()` limpa localStorage e redireciona para `/login`
- No mount, verifica localStorage para restaurar sessão
- Exporta hook `useAuth()`

**ProtectedRoute**
- Lê `useAuth()`, se não autenticado redireciona via `<Navigate to="/login" />`

**LoginPage**
- Layout centralizado com fundo gradient-mesh + grid-bg (mesmo do app)
- Card glass com logo POSTFLOW, campos email e senha, botão "Entrar"
- Credenciais mockadas exibidas como hint sutil abaixo do formulário
- Animação de entrada suave
- Se já autenticado, redireciona para `/`

**Topbar**
- Badge pill "ADM" com cor primária ao lado do avatar quando `user.role === 'admin'`
- Avatar clicável abre dropdown com nome do usuário e botão "Sair"

**Permissões**
- Helper `hasPermission(role, action)` em auth.ts com mapa de permissões por role, pronto para uso futuro
- Nesta fase apenas o admin existe e tem acesso total

