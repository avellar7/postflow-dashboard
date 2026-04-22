import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useInstagramConnect() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startConnect = async () => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('instagram-oauth-start');
      if (error) throw error;
      if (!data?.url) throw new Error('URL de autorização não recebida');
      window.location.href = data.url;
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Falha ao iniciar conexão com Instagram');
      setIsConnecting(false);
    }
  };

  const handleCallback = async (code: string): Promise<{ success: boolean; username?: string; error?: string }> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('instagram-oauth-callback', {
        body: { code },
      });

      // Edge function now always returns 200; check for error in body
      if (error) {
        const msg = data?.error || error?.message || 'Falha ao conectar conta';
        return { success: false, error: msg };
      }
      if (data?.error) {
        return { success: false, error: data.error };
      }
      return { success: true, username: data?.username };
    } catch (e: any) {
      console.error(e);
      return { success: false, error: e?.message || 'Falha ao conectar conta' };
    } finally {
      setIsProcessing(false);
    }
  };

  return { startConnect, handleCallback, isConnecting, isProcessing };
}
