import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type StoryInsert = Database['public']['Tables']['stories']['Insert'];

export function useStories() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('stories').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: Omit<StoryInsert, 'user_id'>) => {
      const { data, error } = await supabase.from('stories').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stories'] }); toast.success('Story publicado!'); },
    onError: () => toast.error('Erro ao publicar story'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('stories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stories'] }); toast('Story removido'); },
    onError: () => toast.error('Erro ao remover story'),
  });

  return { stories: query.data ?? [], isLoading: query.isLoading, create, remove };
}
