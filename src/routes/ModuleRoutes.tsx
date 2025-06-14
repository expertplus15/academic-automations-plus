import { Routes, Route } from "react-router-dom";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";

// Main modules
import Students from "@/pages/Students";
import Academic from "@/pages/Academic";
import Exams from "@/pages/Exams";
import Finance from "@/pages/Finance";
import Elearning from "@/pages/Elearning";
import Hr from "@/pages/Hr";
import Resources from "@/pages/Resources";
import Partnerships from "@/pages/Partnerships";
import Settings from "@/pages/Settings";
import Results from "@/pages/Results";
import Health from "@/pages/Health";
import Services from "@/pages/Services";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";

// Academic sub-modules
import Programs from "@/pages/academic/Programs";
import Pathways from "@/pages/academic/Pathways";
import Levels from "@/pages/academic/Levels";
import Groups from "@/pages/academic/Groups";
import Subjects from "@/pages/academic/Subjects";
import Infrastructure from "@/pages/academic/Infrastructure";
import Timetables from "@/pages/academic/Timetables";
import Evaluations from "@/pages/academic/Evaluations";

// Students module
import Registration from "@/pages/students/Registration";
import Profiles from "@/pages/students/Profiles";
import Tracking from "@/pages/students/Tracking";
import Alerts from "@/pages/students/Alerts";
import Documents from "@/pages/students/Documents";
import Communication from "@/pages/students/Communication";

// Exams module
import ExamPlanning from "@/pages/exams/Planning";
import ExamRooms from "@/pages/exams/Rooms";
import ExamSupervisors from "@/pages/exams/Supervisors";
import ExamInvitations from "@/pages/exams/Invitations";
import ExamMonitoring from "@/pages/exams/Monitoring";
import ExamIncidents from "@/pages/exams/Incidents";

// Finance module
import Billing from "@/pages/finance/Billing";
import Payments from "@/pages/finance/Payments";
import Accounting from "@/pages/finance/Accounting";
import Payroll from "@/pages/finance/Payroll";
import Budgets from "@/pages/finance/Budgets";
import FinanceReporting from "@/pages/finance/Reporting";

// E-learning module
import Standards from "@/pages/elearning/Standards";
import Authoring from "@/pages/elearning/Authoring";
import VirtualClasses from "@/pages/elearning/VirtualClasses";
import Streaming from "@/pages/elearning/Streaming";
import Forums from "@/pages/elearning/Forums";
import Gamification from "@/pages/elearning/Gamification";
import ElearningAnalytics from "@/pages/elearning/Analytics";

// HR module
import Teachers from "@/pages/hr/Teachers";
import Contracts from "@/pages/hr/Contracts";
import Specialties from "@/pages/hr/Specialties";
import Availability from "@/pages/hr/Availability";
import Performance from "@/pages/hr/Performance";
import Sync from "@/pages/hr/Sync";

// Resources module
import Inventory from "@/pages/resources/Inventory";
import Maintenance from "@/pages/resources/Maintenance";
import Procurement from "@/pages/resources/Procurement";
import Bookings from "@/pages/resources/Bookings";
import Property from "@/pages/resources/Property";

// Partnerships module
import Crm from "@/pages/partnerships/Crm";
import Internships from "@/pages/partnerships/Internships";
import Alumni from "@/pages/partnerships/Alumni";
import InternationalExchanges from "@/pages/partnerships/International";
import PartnershipEvents from "@/pages/partnerships/Events";

// Settings module
import Institutions from "@/pages/settings/Institutions";
import SettingsUsers from "@/pages/settings/Users";
import Customization from "@/pages/settings/Customization";
import SettingsIntegrations from "@/pages/settings/Integrations";
import SettingsMonitoring from "@/pages/settings/Monitoring";

// Results module
import Matrix from "@/pages/results/Matrix";
import ResultsReports from "@/pages/results/Reports";
import Calculations from "@/pages/results/Calculations";
import Transcripts from "@/pages/results/Transcripts";
import ResultsAnalyticsPage from "@/pages/results/ResultsAnalytics";

// Health module
import HealthRecords from "@/pages/health/Records";
import HealthAppointments from "@/pages/health/Appointments";
import Medications from "@/pages/health/Medications";
import Emergency from "@/pages/health/Emergency";
import HealthAccessibility from "@/pages/health/Accessibility";

// Services module
import Transport from "@/pages/services/Transport";
import Catering from "@/pages/services/Catering";
import ServicesAccommodation from "@/pages/services/Accommodation";
import ServicesLibrary from "@/pages/services/Library";
import ServicesActivities from "@/pages/services/Activities";

export function ModuleRoutes() {
  return (
    <ModuleLayout>
      <Routes>
        {/* Special routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        
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
        <Route path="/hr/availability" element={<Availability />} />
        <Route path="/hr/performance" element={<Performance />} />
        <Route path="/hr/sync" element={<Sync />} />
        
        {/* Resources sub-modules */}
        <Route path="/resources/inventory" element={<Inventory />} />
        <Route path="/resources/maintenance" element={<Maintenance />} />
        <Route path="/resources/procurement" element={<Procurement />} />
        <Route path="/resources/bookings" element={<Bookings />} />
        <Route path="/resources/property" element={<Property />} />
        
        {/* Partnerships sub-modules */}
        <Route path="/partnerships/crm" element={<Crm />} />
        <Route path="/partnerships/internships" element={<Internships />} />
        <Route path="/partnerships/alumni" element={<Alumni />} />
        <Route path="/partnerships/international" element={<InternationalExchanges />} />
        <Route path="/partnerships/events" element={<PartnershipEvents />} />
        
        {/* Settings sub-modules */}
        <Route path="/settings/institutions" element={<Institutions />} />
        <Route path="/settings/users" element={<SettingsUsers />} />
        <Route path="/settings/customization" element={<Customization />} />
        <Route path="/settings/integrations" element={<SettingsIntegrations />} />
        <Route path="/settings/monitoring" element={<SettingsMonitoring />} />
        
        {/* Results sub-modules */}
        <Route path="/results/matrix" element={<Matrix />} />
        <Route path="/results/reports" element={<ResultsReports />} />
        <Route path="/results/calculations" element={<Calculations />} />
        <Route path="/results/transcripts" element={<Transcripts />} />
        <Route path="/results/analytics" element={<ResultsAnalyticsPage />} />
        
        {/* Health sub-modules */}
        <Route path="/health/records" element={<HealthRecords />} />
        <Route path="/health/appointments" element={<HealthAppointments />} />
        <Route path="/health/medications" element={<Medications />} />
        <Route path="/health/emergency" element={<Emergency />} />
        <Route path="/health/accessibility" element={<HealthAccessibility />} />
        
        {/* Services sub-modules */}
        <Route path="/services/transport" element={<Transport />} />
        <Route path="/services/catering" element={<Catering />} />
        <Route path="/services/accommodation" element={<ServicesAccommodation />} />
        <Route path="/services/library" element={<ServicesLibrary />} />
        <Route path="/services/activities" element={<ServicesActivities />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ModuleLayout>
  );
}