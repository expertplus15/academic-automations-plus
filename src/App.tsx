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
import Finance from "./pages/Finance";
import Elearning from "./pages/Elearning";
import Hr from "./pages/Hr";
import Resources from "./pages/Resources";
import Partnerships from "./pages/Partnerships";
import Settings from "./pages/Settings";
import Results from "./pages/Results";
import Health from "./pages/Health";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Programs from "./pages/academic/Programs";
import Pathways from "./pages/academic/Pathways";
import Levels from "./pages/academic/Levels";
import Groups from "./pages/academic/Groups";
import Subjects from "./pages/academic/Subjects";
import Infrastructure from "./pages/academic/Infrastructure";
import Timetables from "./pages/academic/Timetables";
import Evaluations from "./pages/academic/Evaluations";
// Students module
import Registration from "./pages/students/Registration";
import Profiles from "./pages/students/Profiles";
import Tracking from "./pages/students/Tracking";
import Alerts from "./pages/students/Alerts";
import Documents from "./pages/students/Documents";
import Communication from "./pages/students/Communication";
// Exams module
import ExamPlanning from "./pages/exams/Planning";
import ExamRooms from "./pages/exams/Rooms";
import ExamSupervisors from "./pages/exams/Supervisors";
import ExamInvitations from "./pages/exams/Invitations";
import ExamMonitoring from "./pages/exams/Monitoring";
import ExamIncidents from "./pages/exams/Incidents";
// Finance module
import Billing from "./pages/finance/Billing";
import Payments from "./pages/finance/Payments";
import Accounting from "./pages/finance/Accounting";
import Payroll from "./pages/finance/Payroll";
import Budgets from "./pages/finance/Budgets";
import FinanceReporting from "./pages/finance/Reporting";
// E-learning module
import Standards from "./pages/elearning/Standards";
import Authoring from "./pages/elearning/Authoring";
import VirtualClasses from "./pages/elearning/VirtualClasses";
import Streaming from "./pages/elearning/Streaming";
import Forums from "./pages/elearning/Forums";
import Gamification from "./pages/elearning/Gamification";
import ElearningAnalytics from "./pages/elearning/Analytics";
// HR module
import Teachers from "./pages/hr/Teachers";
import Contracts from "./pages/hr/Contracts";
import Specialties from "./pages/hr/Specialties";

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
            {/* Main modules */}
            <Route path="/students" element={<Students />} />
            <Route path="/academic" element={<Academic />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/elearning" element={<Elearning />} />
            <Route path="/hr" element={<Hr />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/results" element={<Results />} />
            <Route path="/health" element={<Health />} />
            <Route path="/services" element={<Services />} />
            
            {/* Academic sub-modules */}
            <Route path="/academic/programs" element={<Programs />} />
            <Route path="/academic/pathways" element={<Pathways />} />
            <Route path="/academic/levels" element={<Levels />} />
            <Route path="/academic/groups" element={<Groups />} />
            <Route path="/academic/subjects" element={<Subjects />} />
            <Route path="/academic/infrastructure" element={<Infrastructure />} />
            <Route path="/academic/timetables" element={<Timetables />} />
            <Route path="/academic/evaluations" element={<Evaluations />} />
            
            {/* Students sub-modules */}
            <Route path="/students/registration" element={<Registration />} />
            <Route path="/students/profiles" element={<Profiles />} />
            <Route path="/students/tracking" element={<Tracking />} />
            <Route path="/students/alerts" element={<Alerts />} />
            <Route path="/students/documents" element={<Documents />} />
            <Route path="/students/communication" element={<Communication />} />
            
            {/* Exams sub-modules */}
            <Route path="/exams/planning" element={<ExamPlanning />} />
            <Route path="/exams/rooms" element={<ExamRooms />} />
            <Route path="/exams/supervisors" element={<ExamSupervisors />} />
            <Route path="/exams/invitations" element={<ExamInvitations />} />
            <Route path="/exams/monitoring" element={<ExamMonitoring />} />
            <Route path="/exams/incidents" element={<ExamIncidents />} />
            
            {/* Finance sub-modules */}
            <Route path="/finance/billing" element={<Billing />} />
            <Route path="/finance/payments" element={<Payments />} />
            <Route path="/finance/accounting" element={<Accounting />} />
            <Route path="/finance/payroll" element={<Payroll />} />
            <Route path="/finance/budgets" element={<Budgets />} />
            <Route path="/finance/reporting" element={<FinanceReporting />} />
            
            {/* E-learning sub-modules */}
            <Route path="/elearning/standards" element={<Standards />} />
            <Route path="/elearning/authoring" element={<Authoring />} />
            <Route path="/elearning/virtual-classes" element={<VirtualClasses />} />
            <Route path="/elearning/streaming" element={<Streaming />} />
            <Route path="/elearning/forums" element={<Forums />} />
            <Route path="/elearning/gamification" element={<Gamification />} />
            <Route path="/elearning/analytics" element={<ElearningAnalytics />} />
            
            {/* HR sub-modules */}
            <Route path="/hr/teachers" element={<Teachers />} />
            <Route path="/hr/contracts" element={<Contracts />} />
            <Route path="/hr/specialties" element={<Specialties />} />
            
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
