import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_TYPES = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'image/jpeg', 'image/png', 'image/webp'];

interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  mediaId?: string;
}

export function useMediaUpload(folderId?: string | null) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Não autenticado');

      // Validate
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`Tipo não suportado: ${file.type}`);
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('Arquivo excede 100MB');
      }

      const fileId = crypto.randomUUID();
      const ext = file.name.split('.').pop() || 'mp4';
      const storagePath = `${user.id}/${fileId}/${file.name}`;
      const mediaType = file.type.startsWith('video') ? 'video' : 'image';

      // Track progress
      setUploads(prev => [...prev, { file, progress: 0, status: 'uploading' }]);

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Update progress
      setUploads(prev =>
        prev.map(u => u.file === file ? { ...u, progress: 80 } : u)
      );

      // Get file URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(storagePath);

      // Create media_items record
      const { data: mediaItem, error: dbError } = await supabase
        .from('media_items')
        .insert({
          user_id: user.id,
          title: file.name,
          file_name: file.name,
          file_url: storagePath,
          original_file_path: storagePath,
          media_type: mediaType as 'video' | 'image',
          file_size: file.size,
          mime_type: file.type,
          folder_id: folderId || null,
          processing_status: 'raw',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Mark done
      setUploads(prev =>
        prev.map(u => u.file === file ? { ...u, progress: 100, status: 'done', mediaId: mediaItem.id } : u)
      );

      return mediaItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media_items'] });
    },
    onError: (err, file) => {
      setUploads(prev =>
        prev.map(u => u.file === file ? { ...u, status: 'error' } : u)
      );
      toast.error(`Erro no upload: ${err instanceof Error ? err.message : 'erro desconhecido'}`);
    },
  });

  const uploadFiles = async (files: File[]) => {
    const results = [];
    for (const file of files) {
      try {
        const result = await uploadFile.mutateAsync(file);
        results.push(result);
        toast.success(`${file.name} enviado!`);
      } catch {
        // error already handled in onError
      }
    }
    return results;
  };

  const clearUploads = () => setUploads([]);

  return {
    uploads,
    uploadFiles,
    uploadFile,
    clearUploads,
    isUploading: uploadFile.isPending,
  };
}
