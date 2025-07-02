
import { Routes, Route } from 'react-router-dom';

// Students module pages
import Students from '@/pages/Students';
import StudentsRegistration from '@/pages/students/Registration';
import StudentsProfiles from '@/pages/students/Profiles';
import StudentsTracking from '@/pages/students/Tracking';
import StudentsAlerts from '@/pages/students/Alerts';
import StudentsDocuments from '@/pages/students/Documents';
import StudentsCommunication from '@/pages/students/Communication';

// Finance module pages
import Finance from '@/pages/Finance';
import FinanceDashboard from '@/pages/finance/Dashboard';
import FinanceAccounts from '@/pages/finance/Accounts';
import FinanceBilling from '@/pages/finance/Billing';
import FinanceInvoices from '@/pages/finance/Invoices';
import FinancePayments from '@/pages/finance/Payments';

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
import AcademicEvaluations from '@/pages/academic/Evaluations';

export function ModuleRoutes() {
  return (
    <Routes>
      {/* Finance Module Routes */}
      <Route path="/finance" element={<Finance />} />
      <Route path="/finance/dashboard" element={<FinanceDashboard />} />
      <Route path="/finance/accounts" element={<FinanceAccounts />} />
      <Route path="/finance/billing" element={<FinanceBilling />} />
      <Route path="/finance/invoices" element={<FinanceInvoices />} />
      <Route path="/finance/payments" element={<FinancePayments />} />

      {/* Students Module Routes - All using ModuleLayout */}
      <Route path="/students" element={<Students />} />
      <Route path="/students/registration" element={<StudentsRegistration />} />
      <Route path="/students/profiles" element={<StudentsProfiles />} />
      <Route path="/students/tracking" element={<StudentsTracking />} />
      <Route path="/students/alerts" element={<StudentsAlerts />} />
      <Route path="/students/documents" element={<StudentsDocuments />} />
      <Route path="/students/communication" element={<StudentsCommunication />} />

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
      <Route path="/academic/evaluations" element={<AcademicEvaluations />} />
    </Routes>
  );
}
