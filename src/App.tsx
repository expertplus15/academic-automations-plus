
import React from 'react';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as Toaster2 } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Dashboard from "@/pages/Dashboard";

// Students Module
import StudentsLayout from "@/pages/students/StudentsLayout";
import StudentsPage from "@/pages/students/StudentsPage";
import StudentsProfiles from "@/pages/students/Profiles";
import StudentsGroups from "@/pages/students/Groups";
import StudentsAlerts from "@/pages/students/Alerts";

// Exams Module  
import ExamsLayout from "@/pages/exams/ExamsLayout";
import ExamsPage from "@/pages/exams/ExamsPage";
import SessionsPage from "@/pages/exams/SessionsPage";
import ExamsPlanning from "@/pages/exams/Planning";
import ExamsSupervision from "@/pages/exams/Supervision";

// Academic Module
import AcademicLayout from "@/pages/academic/AcademicLayout";
import AcademicPage from "@/pages/academic/AcademicPage";

// Results/Evaluation Module
import ResultsLayout from "@/pages/results/ResultsLayout";
import Results from "@/pages/Results";
import GradeEntry from "@/pages/results/GradeEntry";
import Calculations from "@/pages/results/Calculations";
import Validation from "@/pages/results/Validation";
import Documentation from "@/pages/results/Documentation";
import RefactoredPersonalisation from "@/pages/results/RefactoredPersonalisation";
import Production from "@/pages/results/Production";
import Analytics from "@/pages/results/Analytics";

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
            
            {/* Students Management Module */}
            <Route path="/students" element={<StudentsLayout />}>
              <Route index element={<StudentsPage />} />
              <Route path="profiles" element={<StudentsProfiles />} />
              <Route path="new" element={<StudentsProfiles />} />
              <Route path="groups" element={<StudentsGroups />} />
              <Route path="alerts" element={<StudentsAlerts />} />
            </Route>
            
            {/* Exams Management Module */}
            <Route path="/exams" element={<ExamsLayout />}>
              <Route index element={<ExamsPage />} />
              <Route path="sessions" element={<SessionsPage />} />
              <Route path="planning" element={<ExamsPlanning />} />
              <Route path="supervision" element={<ExamsSupervision />} />
            </Route>
            
            {/* Academic Configuration Module */}
            <Route path="/academic" element={<AcademicLayout />}>
              <Route index element={<AcademicPage />} />
            </Route>
            
            {/* Results/Evaluation Module */}
            <Route path="/results" element={<ResultsLayout />}>
              <Route index element={<Results />} />
              <Route path="grade-entry" element={<GradeEntry />} />
              <Route path="calculations" element={<Calculations />} />
              <Route path="validation" element={<Validation />} />
              <Route path="documentation" element={<Documentation />} />
              <Route path="personalisation" element={<RefactoredPersonalisation />} />
              <Route path="production" element={<Production />} />
              <Route path="analytics" element={<Analytics />} />
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
