import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AccountMetrics {
  accountId: string;
  username: string;
  displayName: string | null;
  status: string;
  postsOk: number;
  igErrors: number;
  rateLimitErrors: number;
  otherErrors: number;
  pending: number;
  totalErrors: number;
  successRate: number;
}

export function useHealthMetrics() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const queueQuery = useQuery({
    queryKey: ['health_queue_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('queue_items')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    refetchInterval: 30000,
  });

  const accountsQuery = useQuery({
    queryKey: ['health_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instagram_accounts')
        .select('*');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const settingsQuery = useQuery({
    queryKey: ['health_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('health_settings')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const items = queueQuery.data ?? [];
  const accounts = accountsQuery.data ?? [];
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

  // Live queue metrics
  const processing = items.filter(i => i.status === 'processing').length;
  const publishing = items.filter(i => i.status === 'processing' && new Date(i.updated_at) >= fiveMinutesAgo).length;
  const postedLastHour = items.filter(i => i.status === 'completed' && new Date(i.updated_at) >= oneHourAgo).length;
  const rateLimited = items.filter(i => (i as any).error_type === 'rate_limit' && new Date(i.updated_at) >= twentyFourHoursAgo).length;
  const pending = items.filter(i => i.status === 'pending').length;

  // Held by jitter: pending items whose scheduled_for already passed
  const heldByJitter = items.filter(i =>
    i.status === 'pending' && i.scheduled_for && new Date(i.scheduled_for) < now
  ).length;

  // 24h summary
  const items24h = items.filter(i => new Date(i.updated_at) >= twentyFourHoursAgo);
  const postsOk = items24h.filter(i => i.status === 'completed').length;
  const failedItems = items24h.filter(i => i.status === 'failed');
  const igErrors = failedItems.filter(i => (i as any).error_type === 'ig_error').length;
  const rateLimitErrors = failedItems.filter(i => (i as any).error_type === 'rate_limit').length;
  const otherErrors = failedItems.filter(i => !(i as any).error_type || (i as any).error_type === 'other').length;
  const totalFailed = failedItems.length;
  const successRate = (postsOk + totalFailed) > 0 ? (postsOk / (postsOk + totalFailed)) * 100 : 0;

  // Quarantined accounts
  const quarantinedAccounts = accounts.filter(a => a.status === 'quarantined');

  // Per-account metrics
  const accountMetrics: AccountMetrics[] = accounts.map(account => {
    const accountItems = items24h.filter(i => i.account_id === account.id);
    const ok = accountItems.filter(i => i.status === 'completed').length;
    const failed = accountItems.filter(i => i.status === 'failed');
    const ig = failed.filter(i => (i as any).error_type === 'ig_error').length;
    const rl = failed.filter(i => (i as any).error_type === 'rate_limit').length;
    const other = failed.filter(i => !(i as any).error_type || (i as any).error_type === 'other').length;
    const pend = accountItems.filter(i => i.status === 'pending').length;
    const total = ok + failed.length;
    return {
      accountId: account.id,
      username: account.username,
      displayName: account.display_name,
      status: account.status,
      postsOk: ok,
      igErrors: ig,
      rateLimitErrors: rl,
      otherErrors: other,
      pending: pend,
      totalErrors: ig + rl + other,
      successRate: total > 0 ? (ok / total) * 100 : 0,
    };
  }).sort((a, b) => b.totalErrors - a.totalErrors);

  // Cap
  const publishCap = settingsQuery.data?.publish_cap ?? 3;

  // Mutations
  const unlockQueue = useMutation({
    mutationFn: async () => {
      const stuckItems = items.filter(
        i => i.status === 'processing' && new Date(i.updated_at) < tenMinutesAgo
      );
      if (stuckItems.length === 0) return 0;
      const ids = stuckItems.map(i => i.id);
      const { error } = await supabase
        .from('queue_items')
        .update({ status: 'pending', updated_at: new Date().toISOString() })
        .in('id', ids);
      if (error) throw error;
      return stuckItems.length;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({ queryKey: ['health_queue_items'] });
      qc.invalidateQueries({ queryKey: ['queue_items'] });
      if (count === 0) {
        toast.info('Nenhum item preso encontrado');
      } else {
        toast.success(`${count} item(ns) destravado(s) com sucesso`);
      }
    },
    onError: () => toast.error('Erro ao destravar fila'),
  });

  const updateCap = useMutation({
    mutationFn: async (cap: number) => {
      const { error } = await supabase
        .from('health_settings')
        .upsert({ user_id: user!.id, publish_cap: cap, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['health_settings'] });
    },
    onError: () => toast.error('Erro ao salvar cap'),
  });

  const refetchAll = () => {
    queueQuery.refetch();
    accountsQuery.refetch();
    settingsQuery.refetch();
  };

  return {
    isLoading: queueQuery.isLoading || accountsQuery.isLoading || settingsQuery.isLoading,
    processing,
    publishing,
    postedLastHour,
    rateLimited,
    pending,
    heldByJitter,
    postsOk,
    igErrors,
    rateLimitErrors,
    otherErrors,
    successRate,
    quarantinedAccounts,
    accountMetrics,
    publishCap,
    unlockQueue,
    updateCap,
    refetchAll,
  };
}
