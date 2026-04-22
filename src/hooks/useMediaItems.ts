import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useMediaItems(folderId?: string | null) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['media_items', folderId ?? 'all'],
    queryFn: async () => {
      let q = supabase.from('media_items').select('*').order('created_at', { ascending: false });
      if (folderId) {
        q = q.eq('folder_id', folderId);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      // Get file path first
      const item = query.data?.find(m => m.id === id);
      if (item?.file_url) {
        await supabase.storage.from('media').remove([item.file_url]);
      }
      const { error } = await supabase.from('media_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media_items'] });
      toast.success('Mídia removida!');
    },
    onError: () => toast.error('Erro ao remover mídia'),
  });

  const getSignedUrl = async (filePath: string) => {
    const { data, error } = await supabase.storage
      .from('media')
      .createSignedUrl(filePath, 3600);
    if (error) return null;
    return data.signedUrl;
  };

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    remove,
    getSignedUrl,
  };
}
