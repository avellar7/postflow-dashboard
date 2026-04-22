import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useSavedLinks() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['saved_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('saved_links').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: { url: string; label?: string }) => {
      const { data, error } = await supabase.from('saved_links').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['saved_links'] }); toast.success('Link salvo!'); },
    onError: () => toast.error('Erro ao salvar link'),
  });

  const update = useMutation({
    mutationFn: async ({ id, url, label }: { id: string; url?: string; label?: string }) => {
      const { error } = await supabase.from('saved_links').update({ url, label, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['saved_links'] }); toast.success('Link atualizado!'); },
    onError: () => toast.error('Erro ao atualizar link'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('saved_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['saved_links'] }); toast('Link removido'); },
    onError: () => toast.error('Erro ao remover link'),
  });

  return { links: query.data ?? [], isLoading: query.isLoading, create, update, remove };
}
