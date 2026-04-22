import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useFolders() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('library_folders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const { data, error } = await supabase.from('library_folders').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['folders'] }); toast.success('Pasta criada!'); },
    onError: () => toast.error('Erro ao criar pasta'),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...input }: { id: string; name?: string; description?: string }) => {
      const { error } = await supabase.from('library_folders').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['folders'] }); toast.success('Pasta atualizada!'); },
    onError: () => toast.error('Erro ao atualizar pasta'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('library_folders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['folders'] }); toast.success('Pasta removida!'); },
    onError: () => toast.error('Erro ao remover pasta'),
  });

  return { folders: query.data ?? [], isLoading: query.isLoading, create, update, remove };
}
