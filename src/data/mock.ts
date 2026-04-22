import type { Account, QueueItem, Caption, MediaFolder, HealthMetric, StoryHistoryItem } from '@/types';

export const mockAccounts: Account[] = [
  { id: '1', username: '@loja.moda.br', status: 'active', avatar: '🟢', postsToday: 12, successRate: 97 },
  { id: '2', username: '@fitnesscoach', status: 'active', avatar: '🟢', postsToday: 8, successRate: 100 },
  { id: '3', username: '@techreviews', status: 'warming', avatar: '🟡', postsToday: 3, successRate: 85 },
  { id: '4', username: '@receitasfaceis', status: 'quarantine', avatar: '🔴', postsToday: 0, successRate: 42 },
];

export const mockQueueItems: QueueItem[] = [
  { id: '1', accountUsername: '@loja.moda.br', mediaName: 'promo_verao_01.mp4', status: 'completed', scheduledAt: '2026-04-22T10:00:00', type: 'reel' },
  { id: '2', accountUsername: '@loja.moda.br', mediaName: 'lookbook_abril.mp4', status: 'processing', scheduledAt: '2026-04-22T10:15:00', type: 'reel' },
  { id: '3', accountUsername: '@fitnesscoach', mediaName: 'treino_costas.mp4', status: 'pending', scheduledAt: '2026-04-22T11:00:00', type: 'reel' },
  { id: '4', accountUsername: '@fitnesscoach', mediaName: 'dica_nutricao.mp4', status: 'pending', scheduledAt: '2026-04-22T11:30:00', type: 'reel' },
  { id: '5', accountUsername: '@techreviews', mediaName: 'review_iphone.mp4', status: 'paused', scheduledAt: '2026-04-22T12:00:00', type: 'reel' },
];

export const mockCaptions: Caption[] = [
  { id: '1', text: '🔥 Novidades que você precisa ver! Confira nossa coleção exclusiva e arrase no look. #moda #tendencia #estilo', createdAt: '2026-04-20' },
  { id: '2', text: '💪 Treino do dia: costas e bíceps. Salva pra não esquecer! #fitness #treino #academia', createdAt: '2026-04-19' },
  { id: '3', text: '📱 Review completo — vale a pena trocar? Assista até o final! #tech #review #smartphone', createdAt: '2026-04-18' },
];

export const mockFolders: MediaFolder[] = [
  { id: '1', name: 'Reels Moda', itemCount: 24, createdAt: '2026-04-01' },
  { id: '2', name: 'Treinos', itemCount: 15, createdAt: '2026-03-28' },
  { id: '3', name: 'Reviews Tech', itemCount: 8, createdAt: '2026-04-10' },
];

export const mockHealthMetrics: HealthMetric[] = [
  { label: 'Processando', value: 1, color: 'primary' },
  { label: 'Publicando', value: 0, color: 'success' },
  { label: 'Postados (1h)', value: 14, color: 'success' },
  { label: 'Rate-limited', value: 1, color: 'warning' },
  { label: 'Pendentes', value: 3, color: 'muted' },
];

export const mockHealthCards = {
  quarantine: 1,
  publishing: 0,
  held: 2,
  postsOk: 142,
  igError: 3,
  rateLimit: 5,
  otherErrors: 1,
  successRate: 94.2,
};

export const mockStoryHistory: StoryHistoryItem[] = [
  { id: '1', accountUsername: '@loja.moda.br', mediaName: 'story_promo.jpg', publishedAt: '2026-04-22T09:30:00', status: 'published' },
  { id: '2', accountUsername: '@fitnesscoach', mediaName: 'story_treino.mp4', publishedAt: '2026-04-21T18:00:00', status: 'published' },
];
