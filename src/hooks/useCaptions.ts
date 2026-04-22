import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useCaptions() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['captions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('saved_captions').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: { content: string; title?: string }) => {
      const { data, error } = await supabase.from('saved_captions').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['captions'] }); toast.success('Legenda salva!'); },
    onError: () => toast.error('Erro ao salvar legenda'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('saved_captions').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['captions'] }); toast('Legenda removida'); },
    onError: () => toast.error('Erro ao remover legenda'),
  });

  return { captions: query.data ?? [], isLoading: query.isLoading, create, remove };
}
