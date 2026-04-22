import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFunnels() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['funnels'],
    queryFn: async () => {
      const { data, error } = await supabase.from('funnels').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const { data, error } = await supabase.from('funnels').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['funnels'] }); toast.success('Funil criado!'); },
    onError: () => toast.error('Erro ao criar funil'),
  });

  const update = useMutation({
    mutationFn: async (input: { id: string; name: string }) => {
      const { error } = await supabase.from('funnels').update({ name: input.name }).eq('id', input.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['funnels'] }); toast.success('Funil atualizado!'); },
    onError: () => toast.error('Erro ao atualizar funil'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('funnels').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['funnels'] }); toast('Funil removido'); },
    onError: () => toast.error('Erro ao remover funil'),
  });

  return { funnels: query.data ?? [], isLoading: query.isLoading, create, update, remove };
}
