import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Zap, LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast.success('Login realizado com sucesso');
      navigate('/');
    } else {
      toast.error('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen gradient-mesh grid-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 glow-blue">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            POST<span className="text-primary">FLOW</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Automação inteligente</p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 space-y-5">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">Entrar na plataforma</h2>
            <p className="text-xs text-muted-foreground mt-1">Acesse seu painel de automação</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-muted-foreground">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@postflow.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/50 border-border/50 h-10 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-muted-foreground">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-border/50 h-10 text-sm pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 gap-2"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </div>

        {/* Hint */}
        <p className="text-center text-[11px] text-muted-foreground/50 mt-4 font-mono">
          demo: admin@postflow.io / qualquer senha
        </p>
      </div>
    </div>
  );
}
