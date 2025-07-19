import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toaster2 } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Dashboard from "@/pages/Dashboard";
import StudentsLayout from "@/pages/students/StudentsLayout";
import StudentsPage from "@/pages/students/StudentsPage";
import ExamsLayout from "@/pages/exams/ExamsLayout";
import ExamsPage from "@/pages/exams/ExamsPage";
import SessionsPage from "@/pages/exams/SessionsPage";
import AcademicLayout from "@/pages/academic/AcademicLayout";
import AcademicPage from "@/pages/academic/AcademicPage";
import ResultsLayout from "@/pages/results/ResultsLayout";
import Results from "@/pages/Results";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/students" element={<StudentsLayout />}>
              <Route index element={<StudentsPage />} />
            </Route>
            
            <Route path="/exams" element={<ExamsLayout />}>
              <Route index element={<ExamsPage />} />
              <Route path="sessions" element={<SessionsPage />} />
            </Route>
            
            <Route path="/academic" element={<AcademicLayout />}>
              <Route index element={<AcademicPage />} />
            </Route>
            
            <Route path="/results" element={<ResultsLayout />}>
              <Route index element={<Results />} />
            </Route>
          </Routes>
        </div>
        
        <Toaster />
        <Toaster2 />
      </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
