import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useInstagramConnect } from '@/hooks/useInstagramConnect';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Instagram } from 'lucide-react';

export default function AccountsCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleCallback } = useInstagramConnect();
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const code = params.get('code');
    const errParam = params.get('error') || params.get('error_description');

    if (errParam) {
      setError(errParam);
      return;
    }

    if (!code) {
      setError('Código de autorização ausente.');
      return;
    }

    (async () => {
      const res = await handleCallback(code);
      if (res.success) {
        toast.success(res.username ? `Conta @${res.username} conectada!` : 'Conta conectada!');
        navigate('/contas', { replace: true });
      } else {
        setError(res.error || 'Falha ao conectar conta');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-20">
        <div className="glass-card p-8 max-w-md w-full text-center">
          {error ? (
            <>
              <div className="w-12 h-12 rounded-full bg-destructive/15 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Não foi possível conectar</h2>
              <p className="text-xs text-muted-foreground mb-6 break-words">{error}</p>
              <Button size="sm" onClick={() => navigate('/contas')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Voltar para Contas
              </Button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Instagram className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Conectando sua conta
              </h2>
              <p className="text-xs text-muted-foreground">Estamos finalizando a autorização com o Instagram…</p>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
