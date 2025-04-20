
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/use-auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import CompaniesPage from "./pages/CompaniesPage";
import VacanciesPage from "./pages/VacanciesPage";
import CandidatesPage from "./pages/CandidatesPage";
import CandidateDatabasePage from "./pages/CandidateDatabasePage";
import AuditTrailPage from "./pages/AuditTrailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <CompaniesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/companies" element={
              <ProtectedRoute>
                <CompaniesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/vacancies" element={
              <ProtectedRoute>
                <VacanciesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/candidates" element={
              <ProtectedRoute>
                <CandidatesPage />
              </ProtectedRoute>
            } />
            
            <Route path="/candidates/database" element={
              <ProtectedRoute>
                <CandidateDatabasePage />
              </ProtectedRoute>
            } />
            
            <Route path="/audit" element={
              <ProtectedRoute>
                <AuditTrailPage />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
