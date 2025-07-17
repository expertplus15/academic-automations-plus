import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Imports organisés par modules
import {
  FinancePage,
  StudentsPage,
  AcademicPage,
  ResultsPage,
  ExamsPage,
  ElearningPage,
  HrPage,
  ResourcesPage,
  ServicesPage,
  CommunicationPage,
  SettingsPage,
  DocumentsPage,
  PartnershipsPage,
} from './lazy';

// Lazy loaded modules
import * as FinanceModules from './lazy/modules/finance';
import * as StudentsModules from './lazy/modules/students';
import * as ResultsModules from './lazy/modules/results';

// Autres modules chargés de manière lazy
const AcademicPrograms = React.lazy(() => import('@/pages/academic/Programs'));
const AcademicSubjects = React.lazy(() => import('@/pages/academic/Subjects'));
const AcademicTimetables = React.lazy(() => import('@/pages/academic/Timetables'));
const AcademicCalendar = React.lazy(() => import('@/pages/academic/Calendar'));

const ExamCreation = React.lazy(() => import('@/pages/exams/creation'));
const ExamsPlanning = React.lazy(() => import('@/pages/exams/Planning'));
const ExamsMonitoring = React.lazy(() => import('@/pages/exams/Monitoring'));

const ElearningCourses = React.lazy(() => import('@/pages/elearning/Courses'));
const ElearningVirtualClasses = React.lazy(() => import('@/pages/elearning/VirtualClasses'));
const ElearningAnalytics = React.lazy(() => import('@/pages/elearning/Analytics'));

const HrTeachers = React.lazy(() => import('@/pages/hr/Teachers'));
const HrContracts = React.lazy(() => import('@/pages/hr/Contracts'));

const ResourcesInventory = React.lazy(() => import('@/pages/resources/Inventory'));
const ResourcesBookings = React.lazy(() => import('@/pages/resources/Bookings'));

const Transport = React.lazy(() => import('@/pages/services/Transport'));
const Catering = React.lazy(() => import('@/pages/services/Catering'));
const Accommodation = React.lazy(() => import('@/pages/services/Accommodation'));

const Messaging = React.lazy(() => import('@/pages/communication/Messaging'));
const Announcements = React.lazy(() => import('@/pages/communication/Announcements'));

const SettingsGeneral = React.lazy(() => import('@/pages/settings/General'));
const SettingsUsers = React.lazy(() => import('@/pages/settings/Users'));

// Composant de chargement
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<FullPageLoader />}>
    {children}
  </Suspense>
);

export function ModuleRoutes() {
  return (
    <SuspenseWrapper>
      <Routes>
        {/* Module Finance */}
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/finance/dashboard" element={<FinanceModules.FinanceDashboard />} />
        <Route path="/finance/invoices" element={<FinanceModules.FinanceInvoices />} />
        <Route path="/finance/payments" element={<FinanceModules.FinancePayments />} />
        <Route path="/finance/budgets" element={<FinanceModules.FinanceBudgetOverview />} />
        <Route path="/finance/reports" element={<FinanceModules.FinanceReports />} />
        <Route path="/finance/analytics" element={<FinanceModules.FinanceAnalytics />} />
        <Route path="/finance/commercial" element={<FinanceModules.FinanceCommercial />} />
        <Route path="/finance/config" element={<FinanceModules.FinanceConfig />} />

        {/* Module Étudiants */}
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/registration" element={<StudentsModules.StudentsRegistration />} />
        <Route path="/students/profiles" element={<StudentsModules.StudentsProfiles />} />
        <Route path="/students/tracking" element={<StudentsModules.StudentsTracking />} />
        <Route path="/students/cards" element={<StudentsModules.StudentsCards />} />
        <Route path="/students/analytics" element={<StudentsModules.StudentsAnalytics />} />

        {/* Module Académique */}
        <Route path="/academic" element={<AcademicPage />} />
        <Route path="/academic/programs" element={<AcademicPrograms />} />
        <Route path="/academic/subjects" element={<AcademicSubjects />} />
        <Route path="/academic/timetables" element={<AcademicTimetables />} />
        <Route path="/academic/calendar" element={<AcademicCalendar />} />

        {/* Module Résultats */}
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/results/grading-system" element={<ResultsModules.ResultsGradingSystem />} />
        <Route path="/results/grade-entry" element={<ResultsModules.ResultsGradeEntry />} />
        <Route path="/results/calculations" element={<ResultsModules.ResultsCalculations />} />
        <Route path="/results/validation" element={<ResultsModules.ResultsValidation />} />
        <Route path="/results/documentation" element={<ResultsModules.ResultsDocumentation />} />
        <Route path="/results/personalisation" element={<ResultsModules.ResultsPersonalisation />} />
        <Route path="/results/production" element={<ResultsModules.ResultsProduction />} />
        <Route path="/results/analytics" element={<ResultsModules.ResultsAnalytics />} />

        {/* Module Examens */}
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exams/creation" element={<ExamCreation />} />
        <Route path="/exams/planning" element={<ExamsPlanning />} />
        <Route path="/exams/monitoring" element={<ExamsMonitoring />} />

        {/* Module e-Learning */}
        <Route path="/elearning" element={<ElearningPage />} />
        <Route path="/elearning/courses" element={<ElearningCourses />} />
        <Route path="/elearning/virtual-classes" element={<ElearningVirtualClasses />} />
        <Route path="/elearning/analytics" element={<ElearningAnalytics />} />

        {/* Module RH */}
        <Route path="/hr" element={<HrPage />} />
        <Route path="/hr/teachers" element={<HrTeachers />} />
        <Route path="/hr/contracts" element={<HrContracts />} />

        {/* Module Ressources */}
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/resources/inventory" element={<ResourcesInventory />} />
        <Route path="/resources/bookings" element={<ResourcesBookings />} />

        {/* Module Services */}
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/transport" element={<Transport />} />
        <Route path="/services/catering" element={<Catering />} />
        <Route path="/services/accommodation" element={<Accommodation />} />

        {/* Module Communication */}
        <Route path="/communication" element={<CommunicationPage />} />
        <Route path="/communication/messaging" element={<Messaging />} />
        <Route path="/communication/announcements" element={<Announcements />} />

        {/* Module Paramètres */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/general" element={<SettingsGeneral />} />
        <Route path="/settings/users" element={<SettingsUsers />} />

        {/* Autres modules */}
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/partnerships" element={<PartnershipsPage />} />
      </Routes>
    </SuspenseWrapper>
  );
}