import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AcademicModuleSidebar } from "@/components/AcademicModuleSidebar";
import { StudentsModuleSidebar } from "@/components/StudentsModuleSidebar";
import { ExamsModuleSidebar } from "@/components/ExamsModuleSidebar";
import { ResultsModuleSidebar } from "@/components/ResultsModuleSidebar";
import { FinanceModuleSidebar } from "@/components/FinanceModuleSidebar";
import { ElearningModuleSidebar } from "@/components/ElearningModuleSidebar";
import { HrModuleSidebar } from "@/components/HrModuleSidebar";
import { ResourcesModuleSidebar } from "@/components/ResourcesModuleSidebar";
import { PartnershipsModuleSidebar } from "@/components/PartnershipsModuleSidebar";
import { SettingsModuleSidebar } from "@/components/SettingsModuleSidebar";
import { ServicesModuleSidebar } from "@/components/ServicesModuleSidebar";
import { HealthModuleSidebar } from "@/components/HealthModuleSidebar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Academic from "./pages/Academic";
import Exams from "./pages/Exams";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard";

  if (isDashboard) {
    return (
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    );
  }

  const getSidebarForPath = () => {
    if (location.pathname.startsWith('/academic')) return <AcademicModuleSidebar />;
    if (location.pathname.startsWith('/students')) return <StudentsModuleSidebar />;
    if (location.pathname.startsWith('/exams')) return <ExamsModuleSidebar />;
    if (location.pathname.startsWith('/results')) return <ResultsModuleSidebar />;
    if (location.pathname.startsWith('/finance')) return <FinanceModuleSidebar />;
    if (location.pathname.startsWith('/elearning')) return <ElearningModuleSidebar />;
    if (location.pathname.startsWith('/hr')) return <HrModuleSidebar />;
    if (location.pathname.startsWith('/resources')) return <ResourcesModuleSidebar />;
    if (location.pathname.startsWith('/partnerships')) return <PartnershipsModuleSidebar />;
    if (location.pathname.startsWith('/settings')) return <SettingsModuleSidebar />;
    if (location.pathname.startsWith('/services')) return <ServicesModuleSidebar />;
    if (location.pathname.startsWith('/health')) return <HealthModuleSidebar />;
    return null;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {getSidebarForPath()}
        <main className="flex-1">
          <Routes>
            <Route path="/students" element={<Students />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
