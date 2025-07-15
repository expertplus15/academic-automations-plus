
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AcademicYearProvider } from "@/contexts/AcademicYearContext";
import { CalculationProvider } from "@/contexts/CalculationContext";
import AppRoutes from "@/routes/AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AcademicYearProvider>
          <BrowserRouter>
            <CalculationProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </CalculationProvider>
          </BrowserRouter>
        </AcademicYearProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
