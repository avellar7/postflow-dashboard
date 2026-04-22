import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type QueueInsert = Database['public']['Tables']['queue_items']['Insert'];

export function useQueueItems() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['queue_items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('queue_items').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: Omit<QueueInsert, 'user_id'>) => {
      const { data, error } = await supabase.from('queue_items').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['queue_items'] }); toast.success('Item adicionado à fila!'); },
    onError: () => toast.error('Erro ao adicionar item'),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Database['public']['Enums']['queue_status'] }) => {
      const { error } = await supabase.from('queue_items').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['queue_items'] }); },
    onError: () => toast.error('Erro ao atualizar status'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('queue_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['queue_items'] }); toast('Item removido da fila'); },
    onError: () => toast.error('Erro ao remover item'),
  });

  return { items: query.data ?? [], isLoading: query.isLoading, create, updateStatus, remove };
}
