import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import PostarPage from "./pages/PostarPage";
import LoopPage from "./pages/LoopPage";
import StoriesPage from "./pages/StoriesPage";
import FilaPage from "./pages/FilaPage";
import SaudePage from "./pages/SaudePage";
import BibliotecaPage from "./pages/BibliotecaPage";
import AquecimentoPage from "./pages/AquecimentoPage";
import FunilPage from "./pages/FunilPage";
import ContasPage from "./pages/ContasPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner theme="dark" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PostarPage />} />
          <Route path="/loop" element={<LoopPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/fila" element={<FilaPage />} />
          <Route path="/saude" element={<SaudePage />} />
          <Route path="/biblioteca" element={<BibliotecaPage />} />
          <Route path="/aquecimento" element={<AquecimentoPage />} />
          <Route path="/funil" element={<FunilPage />} />
          <Route path="/contas" element={<ContasPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
