import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type LoopInsert = Database['public']['Tables']['loops']['Insert'];

export function useLoops() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['loops'],
    queryFn: async () => {
      const { data, error } = await supabase.from('loops').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: Omit<LoopInsert, 'user_id'>) => {
      const { data, error } = await supabase.from('loops').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['loops'] }); toast.success('Loop criado!'); },
    onError: () => toast.error('Erro ao criar loop'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('loops').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['loops'] }); toast.success('Loop removido!'); },
    onError: () => toast.error('Erro ao remover loop'),
  });

  return { loops: query.data ?? [], isLoading: query.isLoading, create, remove };
}
