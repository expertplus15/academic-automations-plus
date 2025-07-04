
import { Routes, Route } from 'react-router-dom';

// Students module pages
import Students from '@/pages/Students';
import StudentsRegistration from '@/pages/students/Registration';
import StudentsProfiles from '@/pages/students/Profiles';
import StudentsTracking from '@/pages/students/Tracking';
import StudentsAlerts from '@/pages/students/Alerts';
import StudentsDocuments from '@/pages/students/Documents';
import StudentsCommunication from '@/pages/students/Communication';

// Students registration sub-module pages
import StudentsRegistrationDashboard from '@/pages/students/registration/Dashboard';
import StudentsRegistrationAnalytics from '@/pages/students/registration/Analytics';
import StudentsRegistrationApproval from '@/pages/students/registration/Approval';
import StudentsRegistrationInterviews from '@/pages/students/registration/Interviews';
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
import FinanceTaxSettings from '@/pages/finance/TaxSettings';
import FinanceReconciliation from '@/pages/finance/Reconciliation';
import FinanceExpenses from '@/pages/finance/Expenses';
import FinanceSuppliers from '@/pages/finance/Suppliers';
import FinanceBalanceSheet from '@/pages/finance/BalanceSheet';
import FinanceIncomeStatement from '@/pages/finance/IncomeStatement';

// New Finance sub-modules (SM1-SM6)
import FinanceAdminIA from '@/pages/finance/AdminIA';
import FinanceBudgetManager from '@/pages/finance/BudgetManager';
import FinanceCommercial from '@/pages/finance/Commercial';
import FinanceCredits from '@/pages/finance/Credits';
import FinanceTreasury from '@/pages/finance/Treasury';
import FinanceReceivables from '@/pages/finance/Receivables';
import FinanceCollection from '@/pages/finance/Collection';
import FinanceRiskScoring from '@/pages/finance/RiskScoring';
import FinanceAnalyticsAccounting from '@/pages/finance/AnalyticsAccounting';
import FinanceStatements from '@/pages/finance/Statements';
import FinanceAccounting from '@/pages/finance/Accounting';
import FinanceManagementControl from '@/pages/finance/ManagementControl';
import FinanceClosing from '@/pages/finance/Closing';
import FinanceConfig from '@/pages/finance/Config';
import FinanceUsers from '@/pages/finance/Users';
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


// Exams module pages
import Exams from '@/pages/Exams';
import ExamsDashboard from '@/pages/exams/Dashboard';
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
import ResultsAnalytics from '@/pages/results/Analytics';
import ResultsInsights from '@/pages/results/Insights';
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
import ResourcesBookings from '@/pages/resources/Bookings';
import ResourcesMaintenance from '@/pages/resources/Maintenance';
import ResourcesProcurement from '@/pages/resources/Procurement';
import ResourcesProperty from '@/pages/resources/Property';

// Settings module pages
import Settings from '@/pages/Settings';
import SettingsCustomization from '@/pages/settings/Customization';
import SettingsInstitutions from '@/pages/settings/Institutions';
import SettingsIntegrations from '@/pages/settings/Integrations';
import SettingsMonitoring from '@/pages/settings/Monitoring';
import SettingsUsers from '@/pages/settings/Users';

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
      <Route path="/finance/tax-settings" element={<FinanceTaxSettings />} />
      <Route path="/finance/reconciliation" element={<FinanceReconciliation />} />
      
      {/* New Finance Sub-Modules (SM1-SM6) */}
      {/* SM1: Administration & IA */}
      <Route path="/finance/admin-ia" element={<FinanceAdminIA />} />
      
      {/* SM2: Facturation & Avoirs */}
      <Route path="/finance/commercial" element={<FinanceCommercial />} />
      <Route path="/finance/credits" element={<FinanceCredits />} />
      
      {/* SM3: Gestion Encaissements */}
      <Route path="/finance/treasury" element={<FinanceTreasury />} />
      
      {/* SM4: Suivi des Créances */}
      <Route path="/finance/receivables" element={<FinanceReceivables />} />
      <Route path="/finance/collection" element={<FinanceCollection />} />
      <Route path="/finance/risk-scoring" element={<FinanceRiskScoring />} />
      
      {/* SM5: Comptabilité Générale */}
      <Route path="/finance/accounting" element={<FinanceAccounting />} />
      <Route path="/finance/analytics-accounting" element={<FinanceAnalyticsAccounting />} />
      <Route path="/finance/statements" element={<FinanceStatements />} />
      
      {/* SM6: Pilotage & Reporting */}
      <Route path="/finance/budget-manager" element={<FinanceBudgetManager />} />
      <Route path="/finance/management-control" element={<FinanceManagementControl />} />
      <Route path="/finance/closing" element={<FinanceClosing />} />
      
      {/* Paramètres */}
      <Route path="/finance/config" element={<FinanceConfig />} />
      <Route path="/finance/users" element={<FinanceUsers />} />
      <Route path="/finance/backups" element={<FinanceBackups />} />

      {/* Students Module Routes - All using StudentsModuleLayout */}
      <Route path="/students" element={<Students />} />
      <Route path="/students/registration" element={<StudentsRegistration />} />
      <Route path="/students/profiles" element={<StudentsProfiles />} />
      <Route path="/students/tracking" element={<StudentsTracking />} />
      <Route path="/students/alerts" element={<StudentsAlerts />} />
      <Route path="/students/documents" element={<StudentsDocuments />} />
      <Route path="/students/communication" element={<StudentsCommunication />} />
      
      {/* Registration sub-module routes */}
      <Route path="/students/registration/dashboard" element={<StudentsRegistrationDashboard />} />
      <Route path="/students/registration/analytics" element={<StudentsRegistrationAnalytics />} />
      <Route path="/students/registration/approval" element={<StudentsRegistrationApproval />} />
      <Route path="/students/registration/interviews" element={<StudentsRegistrationInterviews />} />
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

      {/* Exams Module Routes - All using ExamsModuleLayout */}
      <Route path="/exams" element={<Exams />} />
      <Route path="/exams/dashboard" element={<ExamsDashboard />} />
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
      <Route path="/results/analytics" element={<ResultsAnalytics />} />
      <Route path="/results/insights" element={<ResultsInsights />} />
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
      <Route path="/resources/bookings" element={<ResourcesBookings />} />
      <Route path="/resources/maintenance" element={<ResourcesMaintenance />} />
      <Route path="/resources/procurement" element={<ResourcesProcurement />} />
      <Route path="/resources/property" element={<ResourcesProperty />} />

      {/* Settings Module Routes */}
      <Route path="/settings" element={<Settings />} />
      <Route path="/settings/customization" element={<SettingsCustomization />} />
      <Route path="/settings/institutions" element={<SettingsInstitutions />} />
      <Route path="/settings/integrations" element={<SettingsIntegrations />} />
      <Route path="/settings/monitoring" element={<SettingsMonitoring />} />
      <Route path="/settings/users" element={<SettingsUsers />} />
    </Routes>
  );
}
