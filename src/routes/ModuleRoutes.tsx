
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
import ResultsCalculations from '@/pages/results/Calculations';
import Services from '@/pages/Services';

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

      {/* New ACADEMIC+ Module Routes */}
      <Route path="/results" element={<Results />} />
      <Route path="/results/matrix" element={<ResultsMatrix />} />
      <Route path="/results/calculations" element={<ResultsCalculations />} />
      <Route path="/services" element={<Services />} />
    </Routes>
  );
}
