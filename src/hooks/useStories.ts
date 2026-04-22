import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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
    mutationFn: async (input: { account_id?: string | null; strategy?: string; status?: string; media_id?: string; link_url?: string; cta_text?: string }) => {
      const { data, error } = await supabase.from('stories').insert({
        user_id: user!.id,
        account_id: input.account_id ?? null,
        strategy: (input.strategy as any) ?? 'none',
        status: (input.status as any) ?? 'draft',
        media_id: input.media_id ?? null,
        link_url: input.link_url ?? null,
        cta_text: input.cta_text ?? null,
      }).select().single();
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

  const removeAll = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('stories').delete().eq('user_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stories'] }); toast.success('Histórico limpo!'); },
    onError: () => toast.error('Erro ao limpar histórico'),
  });

  return { stories: query.data ?? [], isLoading: query.isLoading, create, remove, removeAll };
}
