
import { Routes, Route } from 'react-router-dom';

// Students module pages
import Students from '@/pages/Students';
import StudentsRegistration from '@/pages/students/Registration';
import StudentsProfiles from '@/pages/students/Profiles';
import StudentsTracking from '@/pages/students/Tracking';
import StudentsAlerts from '@/pages/students/Alerts';
import StudentsDocuments from '@/pages/students/Documents';


// Students registration sub-module pages
import StudentsRegistrationDashboard from '@/pages/students/registration/Dashboard';
import StudentsRegistrationAnalytics from '@/pages/students/registration/Analytics';
import StudentsRegistrationApproval from '@/pages/students/registration/Approval';
import StudentsRegistrationCards from '@/pages/students/registration/StudentCards';

import StudentsRegistrationSettings from '@/pages/students/registration/Settings';

// Finance module pages
import Finance from '@/pages/Finance';
import FinanceDashboard from '@/pages/finance/Dashboard';
import FinanceAccounts from '@/pages/finance/Accounts';
import FinanceBilling from '@/pages/finance/Billing';
import FinanceInvoices from '@/pages/finance/Invoices';
import FinancePayments from '@/pages/finance/Payments';
import FinancePaymentMethods from '@/pages/finance/PaymentMethods';
import FinanceFiscalYears from '@/pages/finance/FiscalYears';
import FinanceTemplates from '@/pages/finance/Templates';
import FinanceSchedules from '@/pages/finance/Schedules';
import FinanceAllPayments from '@/pages/finance/AllPayments';
import FinanceScholarships from '@/pages/finance/Scholarships';
import FinanceFinancialAid from '@/pages/finance/FinancialAid';
import FinanceAwards from '@/pages/finance/Awards';
import FinanceBudgetOverview from '@/pages/finance/BudgetOverview';
import FinanceBudgetPlanning from '@/pages/finance/BudgetPlanning';
import FinanceBudgetTracking from '@/pages/finance/BudgetTracking';
import FinanceReports from '@/pages/finance/Reports';
import FinanceCashFlow from '@/pages/finance/CashFlow';
import FinanceAnalytics from '@/pages/finance/Analytics';
import FinanceCategories from '@/pages/finance/Categories';
import ExpenseCategories from '@/pages/finance/ExpenseCategories';

import FinanceReconciliation from '@/pages/finance/Reconciliation';
import FinanceExpenses from '@/pages/finance/Expenses';
import FinanceSuppliers from '@/pages/finance/Suppliers';
import FinanceBalanceSheet from '@/pages/finance/BalanceSheet';
import FinanceIncomeStatement from '@/pages/finance/IncomeStatement';

// New Finance sub-modules (SM1-SM6)

import FinanceBudgetManager from '@/pages/finance/BudgetManager';
import FinanceCommercial from '@/pages/finance/Commercial';
import FinanceTreasury from '@/pages/finance/Treasury';
import FinanceTreasuryPayments from '@/pages/finance/TreasuryPayments';
import FinanceReceivablesCredits from '@/pages/finance/ReceivablesCredits';
import FinanceManagementIntelligence from '@/pages/finance/ManagementIntelligence';
import FinanceClosing from '@/pages/finance/Closing';
import FinanceConfig from '@/pages/finance/Config';

import FinanceBackups from '@/pages/finance/Backups';

// Academic module pages
import Academic from '@/pages/Academic';
import AcademicPrograms from '@/pages/academic/Programs';
import AcademicSubjects from '@/pages/academic/Subjects';
import AcademicDepartments from '@/pages/academic/Departments';
import AcademicLevels from '@/pages/academic/Levels';
import AcademicGroups from '@/pages/academic/Groups';
import AcademicPathways from '@/pages/academic/Pathways';
import AcademicTimetables from '@/pages/academic/Timetables';
import AcademicInfrastructure from '@/pages/academic/Infrastructure';
import AcademicCalendar from '@/pages/academic/Calendar';


// Exams module pages
import Exams from '@/pages/Exams';
import ExamCreation from '@/pages/exams/creation';
import ExamsAnalytics from '@/pages/exams/Analytics';
import ExamsOptimization from '@/pages/exams/Optimization';
import ExamsCalendar from '@/pages/exams/Calendar';
import ExamsReports from '@/pages/exams/Reports';
import ExamsSettings from '@/pages/exams/Settings';
import ExamsPlanning from '@/pages/exams/Planning';
import ExamsRooms from '@/pages/exams/Rooms';
import ExamsSupervisors from '@/pages/exams/Supervisors';
import ExamsIncidents from '@/pages/exams/Incidents';
import ExamsInvitations from '@/pages/exams/Invitations';
import ExamsMonitoring from '@/pages/exams/Monitoring';

// New ACADEMIC+ modules
import Results from '@/pages/Results';
import ResultsMatrix from '@/pages/results/Matrix';
import ResultsImport from '@/pages/results/Import';
import ResultsValidation from '@/pages/results/Validation';
import ResultsCalculations from '@/pages/results/Calculations';
import ResultsProcessing from '@/pages/results/Processing';
import ResultsReports from '@/pages/results/Reports';
import ResultsTranscripts from '@/pages/results/Transcripts';
import ResultsTemplates from '@/pages/results/Templates';
import ResultsAnalyticsInsights from '@/pages/results/AnalyticsInsights';
import ResultsHistory from '@/pages/results/History';
import Services from '@/pages/Services';

// eLearning module pages
import Elearning from '@/pages/Elearning';
import ElearningCourses from '@/pages/elearning/Courses';
import ElearningStandards from '@/pages/elearning/Standards';
import ElearningAuthoring from '@/pages/elearning/Authoring';
import ElearningVirtualClasses from '@/pages/elearning/VirtualClasses';
import ElearningStreaming from '@/pages/elearning/Streaming';
import ElearningForums from '@/pages/elearning/Forums';
import ElearningGamification from '@/pages/elearning/Gamification';
import ElearningAnalytics from '@/pages/elearning/Analytics';
import ElearningNotifications from '@/pages/elearning/Notifications';

// HR module pages
import Hr from '@/pages/Hr';
import HrTeachers from '@/pages/hr/Teachers';
import HrContracts from '@/pages/hr/Contracts';
import HrSpecialties from '@/pages/hr/Specialties';
import HrAvailability from '@/pages/hr/Availability';
import HrPerformance from '@/pages/hr/Performance';
import HrSync from '@/pages/hr/Sync';
import HrAnalytics from '@/pages/hr/Analytics';

// Resources module pages
import Resources from '@/pages/Resources';
import ResourcesInventory from '@/pages/resources/Inventory';
import ResourcesCategories from '@/pages/resources/Categories';
import ResourcesHistory from '@/pages/resources/History';
import ResourcesBookings from '@/pages/resources/Bookings';
import ResourcesMaintenance from '@/pages/resources/Maintenance';
import ResourcesProcurement from '@/pages/resources/Procurement';
import ResourcesProperty from '@/pages/resources/Property';
import ResourcesReports from '@/pages/resources/Reports';
import ResourcesNotifications from '@/pages/resources/Notifications';
import ResourcesBookingCalendarPage from '@/pages/resources/BookingCalendarPage';
import ResourcesAnalytics from '@/pages/resources/Analytics';
import ResourcesSettings from '@/pages/resources/Settings';

// Settings module pages
import Settings from '@/pages/Settings';
import SettingsGeneral from '@/pages/settings/General';
import SettingsCustomization from '@/pages/settings/Customization';
import SettingsInstitutions from '@/pages/settings/Institutions';
import SettingsIntegrations from '@/pages/settings/Integrations';
import SettingsMonitoring from '@/pages/settings/Monitoring';
import SettingsUsers from '@/pages/settings/Users';

// Partnerships module pages
import Partnerships from '@/pages/Partnerships';
import PartnershipsCrm from '@/pages/partnerships/Crm';
import PartnershipsInternships from '@/pages/partnerships/Internships';
import PartnershipsAlumni from '@/pages/partnerships/Alumni';
import PartnershipsInternational from '@/pages/partnerships/International';
import PartnershipsEvents from '@/pages/partnerships/Events';

// Documents module pages
import Documents from '@/pages/Documents';

// Communication module pages
import Communication from '@/pages/Communication';
import CommunicationRoutes from '@/routes/CommunicationRoutes';

// Services module pages
import Transport from '@/pages/services/Transport';
import Catering from '@/pages/services/Catering';
import Accommodation from '@/pages/services/Accommodation';
import Library from '@/pages/services/Library';
import Activities from '@/pages/services/Activities';
import Orientation from '@/pages/services/Orientation';
import Careers from '@/pages/services/Careers';

// Services health pages
import ServicesHealthRecords from '@/pages/services/health/Records';
import ServicesHealthAppointments from '@/pages/services/health/Appointments';
import ServicesHealthMedications from '@/pages/services/health/Medications';
import ServicesHealthEmergency from '@/pages/services/health/Emergency';
import ServicesHealthAccessibility from '@/pages/services/health/Accessibility';

export function ModuleRoutes() {
  return (
    <Routes>
      {/* Finance Module Routes */}
      <Route path="/finance" element={<Finance />} />
      <Route path="/finance/dashboard" element={<FinanceDashboard />} />
      <Route path="/finance/accounts" element={<FinanceAccounts />} />
      <Route path="/finance/billing" element={<FinanceInvoices />} />
      <Route path="/finance/invoices" element={<FinanceInvoices />} />
      <Route path="/finance/payments" element={<FinancePayments />} />
      <Route path="/finance/payment-methods" element={<FinancePaymentMethods />} />
      <Route path="/finance/payment-history" element={<FinanceAllPayments />} />
      <Route path="/finance/fiscal-years" element={<FinanceFiscalYears />} />
      <Route path="/finance/templates" element={<FinanceTemplates />} />
      <Route path="/finance/schedules" element={<FinanceSchedules />} />
      <Route path="/finance/all-payments" element={<FinanceAllPayments />} />
      
      {/* Bourses & Aides */}
      <Route path="/finance/scholarships" element={<FinanceScholarships />} />
      <Route path="/finance/financial-aid" element={<FinanceFinancialAid />} />
      <Route path="/finance/awards" element={<FinanceAwards />} />
      
      {/* Budgets */}
      <Route path="/finance/budget-overview" element={<FinanceBudgetOverview />} />
      <Route path="/finance/budget-planning" element={<FinanceBudgetPlanning />} />
      <Route path="/finance/budget-tracking" element={<FinanceBudgetTracking />} />
      
      {/* Rapports */}
      <Route path="/finance/reports" element={<FinanceReports />} />
      <Route path="/finance/cash-flow" element={<FinanceCashFlow />} />
      <Route path="/finance/analytics" element={<FinanceAnalytics />} />
      
      {/* Expenses */}
      <Route path="/finance/expenses" element={<FinanceExpenses />} />
      <Route path="/finance/suppliers" element={<FinanceSuppliers />} />
      
      {/* Financial Statements */}
      <Route path="/finance/balance-sheet" element={<FinanceBalanceSheet />} />
      <Route path="/finance/income-statement" element={<FinanceIncomeStatement />} />
      
      {/* Configuration */}
      <Route path="/finance/categories" element={<FinanceCategories />} />
      <Route path="/finance/expense-categories" element={<ExpenseCategories />} />
      
      <Route path="/finance/reconciliation" element={<FinanceReconciliation />} />
      
      {/* New Finance Sub-Modules (SM1-SM6) */}
      {/* SM1: Administration & IA */}
      
      
      {/* SM2: Facturation & Avoirs */}
      <Route path="/finance/commercial" element={<FinanceCommercial />} />
      
      {/* SM3: Gestion Encaissements */}
      <Route path="/finance/treasury" element={<FinanceTreasury />} />
      <Route path="/finance/treasury-payments" element={<FinanceTreasuryPayments />} />
      
      {/* SM4: Suivi des Créances & Avoirs */}
      <Route path="/finance/receivables" element={<FinanceReceivablesCredits />} />
      <Route path="/finance/credits" element={<FinanceReceivablesCredits />} />
      <Route path="/finance/collection" element={<FinanceReceivablesCredits />} />
      
      {/* SM5: Comptabilité Générale */}
      
      {/* SM6: Pilotage & Reporting */}
      <Route path="/finance/budget-manager" element={<FinanceBudgetManager />} />
      <Route path="/finance/management-intelligence" element={<FinanceManagementIntelligence />} />
      <Route path="/finance/closing" element={<FinanceClosing />} />
      
      {/* Paramètres */}
      <Route path="/finance/config" element={<FinanceConfig />} />
      
      <Route path="/finance/backups" element={<FinanceBackups />} />

      {/* Students Module Routes - All using StudentsModuleLayout */}
      <Route path="/students" element={<Students />} />
      <Route path="/students/registration" element={<StudentsRegistration />} />
      <Route path="/students/profiles" element={<StudentsProfiles />} />
      <Route path="/students/tracking" element={<StudentsTracking />} />
      <Route path="/students/alerts" element={<StudentsAlerts />} />
      <Route path="/students/documents" element={<StudentsDocuments />} />
      
      
      {/* Registration sub-module routes */}
      <Route path="/students/registration/dashboard" element={<StudentsRegistrationDashboard />} />
      <Route path="/students/registration/analytics" element={<StudentsRegistrationAnalytics />} />
      <Route path="/students/registration/approval" element={<StudentsRegistrationApproval />} />
      <Route path="/students/registration/cards" element={<StudentsRegistrationCards />} />
      <Route path="/students/registration/settings" element={<StudentsRegistrationSettings />} />

      {/* Academic Module Routes - All using AcademicModuleLayout */}
      <Route path="/academic" element={<Academic />} />
      <Route path="/academic/programs" element={<AcademicPrograms />} />
      <Route path="/academic/subjects" element={<AcademicSubjects />} />
      <Route path="/academic/departments" element={<AcademicDepartments />} />
      <Route path="/academic/levels" element={<AcademicLevels />} />
      <Route path="/academic/groups" element={<AcademicGroups />} />
      <Route path="/academic/pathways" element={<AcademicPathways />} />
      <Route path="/academic/timetables" element={<AcademicTimetables />} />
      <Route path="/academic/infrastructure" element={<AcademicInfrastructure />} />
      <Route path="/academic/calendar" element={<AcademicCalendar />} />

      {/* Exams Module Routes - All using ExamsModuleLayout */}
      <Route path="/exams" element={<Exams />} />
      <Route path="/exams/creation" element={<ExamCreation />} />
      <Route path="/exams/planning" element={<ExamsPlanning />} />
      <Route path="/exams/analytics" element={<ExamsAnalytics />} />
      <Route path="/exams/optimization" element={<ExamsOptimization />} />
      <Route path="/exams/calendar" element={<ExamsCalendar />} />
      <Route path="/exams/rooms" element={<ExamsRooms />} />
      <Route path="/exams/supervisors" element={<ExamsSupervisors />} />
      <Route path="/exams/monitoring" element={<ExamsMonitoring />} />
      <Route path="/exams/incidents" element={<ExamsIncidents />} />
      <Route path="/exams/invitations" element={<ExamsInvitations />} />
      <Route path="/exams/reports" element={<ExamsReports />} />
      <Route path="/exams/settings" element={<ExamsSettings />} />

      {/* eLearning Module Routes */}
      <Route path="/elearning" element={<Elearning />} />
      <Route path="/elearning/courses" element={<ElearningCourses />} />
      <Route path="/elearning/standards" element={<ElearningStandards />} />
      <Route path="/elearning/authoring" element={<ElearningAuthoring />} />
      <Route path="/elearning/virtual-classes" element={<ElearningVirtualClasses />} />
      <Route path="/elearning/streaming" element={<ElearningStreaming />} />
      <Route path="/elearning/forums" element={<ElearningForums />} />
      <Route path="/elearning/gamification" element={<ElearningGamification />} />
      <Route path="/elearning/analytics" element={<ElearningAnalytics />} />
      <Route path="/elearning/notifications" element={<ElearningNotifications />} />

      {/* New ACADEMIC+ Module Routes */}
      <Route path="/results" element={<Results />} />
      <Route path="/results/matrix" element={<ResultsMatrix />} />
      <Route path="/results/import" element={<ResultsImport />} />
      <Route path="/results/validation" element={<ResultsValidation />} />
      <Route path="/results/calculations" element={<ResultsCalculations />} />
      <Route path="/results/processing" element={<ResultsProcessing />} />
      <Route path="/results/reports" element={<ResultsReports />} />
      <Route path="/results/transcripts" element={<ResultsTranscripts />} />
      <Route path="/results/templates" element={<ResultsTemplates />} />
      <Route path="/results/analytics-insights" element={<ResultsAnalyticsInsights />} />
      <Route path="/results/history" element={<ResultsHistory />} />
      <Route path="/services" element={<Services />} />

      {/* HR Module Routes */}
      <Route path="/hr" element={<Hr />} />
      <Route path="/hr/teachers" element={<HrTeachers />} />
      <Route path="/hr/contracts" element={<HrContracts />} />
      <Route path="/hr/specialties" element={<HrSpecialties />} />
      <Route path="/hr/availability" element={<HrAvailability />} />
      <Route path="/hr/performance" element={<HrPerformance />} />
      <Route path="/hr/sync" element={<HrSync />} />
      <Route path="/hr/analytics" element={<HrAnalytics />} />

      {/* Resources Module Routes */}
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/inventory" element={<ResourcesInventory />} />
      <Route path="/resources/categories" element={<ResourcesCategories />} />
      <Route path="/resources/history" element={<ResourcesHistory />} />
      <Route path="/resources/bookings" element={<ResourcesBookings />} />
      <Route path="/resources/maintenance" element={<ResourcesMaintenance />} />
      <Route path="/resources/procurement" element={<ResourcesProcurement />} />
      <Route path="/resources/property" element={<ResourcesProperty />} />
      <Route path="/resources/reports" element={<ResourcesReports />} />
      <Route path="/resources/notifications" element={<ResourcesNotifications />} />
      <Route path="/resources/booking-calendar" element={<ResourcesBookingCalendarPage />} />
      <Route path="/resources/analytics" element={<ResourcesAnalytics />} />
      <Route path="/resources/settings" element={<ResourcesSettings />} />

      {/* Settings Module Routes */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/general" element={<SettingsGeneral />} />
      <Route path="/settings/customization" element={<SettingsCustomization />} />
      <Route path="/settings/institutions" element={<SettingsInstitutions />} />
      <Route path="/settings/integrations" element={<SettingsIntegrations />} />
      <Route path="/settings/monitoring" element={<SettingsMonitoring />} />
      <Route path="/settings/users" element={<SettingsUsers />} />


      {/* Communication Module Routes */}
      <Route path="/communication" element={<Communication />} />
      <Route path="/communication/*" element={<CommunicationRoutes />} />

      {/* Documents Module Routes */}
      <Route path="/documents" element={<Documents />} />
      <Route path="/documents/templates" element={<Documents />} />
      <Route path="/documents/generator" element={<Documents />} />
      <Route path="/documents/archives" element={<Documents />} />
      <Route path="/documents/search" element={<Documents />} />
      <Route path="/documents/signatures" element={<Documents />} />
      <Route path="/documents/validation" element={<Documents />} />
      <Route path="/documents/distribution" element={<Documents />} />
      <Route path="/documents/notifications" element={<Documents />} />
      <Route path="/documents/settings" element={<Documents />} />
      <Route path="/documents/compliance" element={<Documents />} />

      {/* Services Module Routes */}
      <Route path="/services/transport" element={<Transport />} />
      <Route path="/services/catering" element={<Catering />} />
      <Route path="/services/accommodation" element={<Accommodation />} />
      <Route path="/services/library" element={<Library />} />
      <Route path="/services/activities" element={<Activities />} />
      <Route path="/services/orientation" element={<Orientation />} />
      <Route path="/services/careers" element={<Careers />} />

      {/* Services Health Routes */}
      <Route path="/services/health/records" element={<ServicesHealthRecords />} />
      <Route path="/services/health/appointments" element={<ServicesHealthAppointments />} />
      <Route path="/services/health/medications" element={<ServicesHealthMedications />} />
      <Route path="/services/health/emergency" element={<ServicesHealthEmergency />} />
      <Route path="/services/health/accessibility" element={<ServicesHealthAccessibility />} />
    </Routes>
  );
}
