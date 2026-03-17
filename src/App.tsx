import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Training from "./pages/Training";
import TrainingLesson from "./pages/TrainingLesson";
import TrainingTest from "./pages/TrainingTest";
import VibeCoding from "./pages/VibeCoding";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/Admin";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { RegisterDialog } from "@/components/RegisterDialog";

const queryClient = new QueryClient();

const ScrollManager = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Всегда скроллим наверх при смене страницы;
  // прокрутка к новостям делается отдельно на главной через state.
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname, location.search]);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LoginDialog />
        <RegisterDialog />
        <BrowserRouter>
          <ScrollManager>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/training" element={<Training />} />
              <Route path="/training/:topicId" element={<TrainingLesson />} />
              <Route path="/training/:topicId/test" element={<TrainingTest />} />
              <Route path="/vibe-coding" element={<VibeCoding />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ScrollManager>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
