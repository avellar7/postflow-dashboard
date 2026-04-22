import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Account = Tables<'instagram_accounts'>;

export function useAccounts() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('instagram_accounts').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as Account[];
    },
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: async (input: { username: string; display_name?: string; status?: Account['status'] }) => {
      const { data, error } = await supabase.from('instagram_accounts').insert({ ...input, user_id: user!.id }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast.success('Conta adicionada!'); },
    onError: () => toast.error('Erro ao adicionar conta'),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...input }: Partial<Account> & { id: string }) => {
      const { error } = await supabase.from('instagram_accounts').update({ ...input, updated_at: new Date().toISOString() }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast.success('Conta atualizada!'); },
    onError: () => toast.error('Erro ao atualizar conta'),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('instagram_accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['accounts'] }); toast.success('Conta removida!'); },
    onError: () => toast.error('Erro ao remover conta'),
  });

  return { accounts: query.data ?? [], isLoading: query.isLoading, create, update, remove };
}
