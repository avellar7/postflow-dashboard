export type UserRole = 'admin' | 'member' | 'viewer';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: MockUser | null;
  isAuthenticated: boolean;
}

const permissionsMap: Record<UserRole, string[]> = {
  admin: ['*'],
  member: ['post', 'loop', 'stories', 'queue', 'library', 'health'],
  viewer: ['queue', 'health', 'library'],
};

export function hasPermission(role: UserRole, action: string): boolean {
  const perms = permissionsMap[role];
  return perms.includes('*') || perms.includes(action);
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@postflow.io',
    role: 'admin',
  },
];
