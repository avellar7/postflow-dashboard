export interface Account {
  id: string;
  username: string;
  status: 'active' | 'warming' | 'quarantine' | 'paused';
  avatar: string;
  postsToday: number;
  successRate: number;
}

export interface QueueItem {
  id: string;
  accountUsername: string;
  mediaName: string;
  status: 'pending' | 'processing' | 'completed' | 'paused' | 'error';
  scheduledAt: string;
  type: 'reel' | 'story' | 'post';
}

export interface Caption {
  id: string;
  text: string;
  createdAt: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  itemCount: number;
  createdAt: string;
}

export interface HealthMetric {
  label: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  color: 'primary' | 'success' | 'warning' | 'destructive' | 'muted';
}

export interface StoryHistoryItem {
  id: string;
  accountUsername: string;
  mediaName: string;
  publishedAt: string;
  status: 'published' | 'failed';
}

export interface Funnel {
  id: string;
  name: string;
  stages: FunnelStage[];
  createdAt: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  count: number;
}
