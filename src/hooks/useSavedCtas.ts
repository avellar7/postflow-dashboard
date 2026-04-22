import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useSavedCtas() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['saved_ctas'],
    queryFn: async () => {
      const { data, error } = await supabase.from('saved_ctas').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: { content: string; label?: string }) => {
      const { data, error } = await supabase.from('saved_ctas').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['saved_ctas'] }); toast.success('CTA salvo!'); },
    onError: () => toast.error('Erro ao salvar CTA'),
  });

  const update = useMutation({
    mutationFn: async ({ id, content, label }: { id: string; content?: string; label?: string }) => {
      const { error } = await supabase.from('saved_ctas').update({ content, label, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['saved_ctas'] }); toast.success('CTA atualizado!'); },
    onError: () => toast.error('Erro ao atualizar CTA'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('saved_ctas').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['saved_ctas'] }); toast('CTA removido'); },
    onError: () => toast.error('Erro ao remover CTA'),
  });

  return { ctas: query.data ?? [], isLoading: query.isLoading, create, update, remove };
}
