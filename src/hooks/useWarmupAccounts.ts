import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useWarmupAccounts() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['warmup_accounts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('warmup_accounts').select('*, instagram_accounts(username)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: { account_id: string; daily_target?: number; interval_minutes?: number }) => {
      const { data, error } = await supabase.from('warmup_accounts').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['warmup_accounts'] }); toast.success('Conta em aquecimento!'); },
    onError: () => toast.error('Erro ao adicionar aquecimento'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('warmup_accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['warmup_accounts'] }); toast.success('Aquecimento removido!'); },
    onError: () => toast.error('Erro ao remover aquecimento'),
  });

  return { warmups: query.data ?? [], isLoading: query.isLoading, create, remove };
}
