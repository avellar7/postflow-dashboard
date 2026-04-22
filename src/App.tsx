import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import PostarPage from "./pages/PostarPage";
import LoopPage from "./pages/LoopPage";
import StoriesPage from "./pages/StoriesPage";
import FilaPage from "./pages/FilaPage";
import SaudePage from "./pages/SaudePage";
import BibliotecaPage from "./pages/BibliotecaPage";
import AquecimentoPage from "./pages/AquecimentoPage";
import FunilPage from "./pages/FunilPage";
import ContasPage from "./pages/ContasPage";
import AccountsCallbackPage from "./pages/AccountsCallbackPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <TooltipProvider>
      <Sonner theme="dark" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Protected><PostarPage /></Protected>} />
            <Route path="/loop" element={<Protected><LoopPage /></Protected>} />
            <Route path="/stories" element={<Protected><StoriesPage /></Protected>} />
            <Route path="/fila" element={<Protected><FilaPage /></Protected>} />
            <Route path="/saude" element={<Protected><SaudePage /></Protected>} />
            <Route path="/biblioteca" element={<Protected><BibliotecaPage /></Protected>} />
            <Route path="/aquecimento" element={<Protected><AquecimentoPage /></Protected>} />
            <Route path="/funil" element={<Protected><FunilPage /></Protected>} />
            <Route path="/contas" element={<Protected><ContasPage /></Protected>} />
            <Route path="/accounts/callback" element={<Protected><AccountsCallbackPage /></Protected>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
