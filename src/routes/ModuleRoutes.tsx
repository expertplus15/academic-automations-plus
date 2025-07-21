
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { FullPageLoader } from '@/components/LoadingSpinner';

// Lazy loading pour optimiser les performances
const lazyLoad = (componentImport: () => Promise<{ default: React.ComponentType<any> }>) =>
  React.lazy(componentImport);

// Pages principales des modules
const Finance = lazyLoad(() => import('@/pages/Finance'));
const Students = lazyLoad(() => import('@/pages/Students'));
const Academic = lazyLoad(() => import('@/pages/Academic'));
const Results = lazyLoad(() => import('@/pages/Results'));
const Exams = lazyLoad(() => import('@/pages/Exams'));
const Elearning = lazyLoad(() => import('@/pages/Elearning'));
const Hr = lazyLoad(() => import('@/pages/Hr'));
const Resources = lazyLoad(() => import('@/pages/Resources'));
const Services = lazyLoad(() => import('@/pages/Services'));
const Communication = lazyLoad(() => import('@/pages/Communication'));
const Settings = lazyLoad(() => import('@/pages/Settings'));
const Documents = lazyLoad(() => import('@/pages/Documents'));
const Partnerships = lazyLoad(() => import('@/pages/Partnerships'));

// Pages du module Organisation (nouveau)
const Organization = lazyLoad(() => import('@/pages/Organization'));
const OrganizationInfrastructure = lazyLoad(() => import('@/pages/organization/Infrastructure'));
const OrganizationCalendar = lazyLoad(() => import('@/pages/organization/Calendar'));

// Pages du module Finance
const FinanceDashboard = lazyLoad(() => import('@/pages/finance/Dashboard'));
const FinanceInvoices = lazyLoad(() => import('@/pages/finance/Invoices'));
const FinancePayments = lazyLoad(() => import('@/pages/finance/Payments'));
const FinanceBudgetOverview = lazyLoad(() => import('@/pages/finance/BudgetOverview'));
const FinanceReports = lazyLoad(() => import('@/pages/finance/Reports'));
const FinanceAnalytics = lazyLoad(() => import('@/pages/finance/Analytics'));
const FinanceCommercial = lazyLoad(() => import('@/pages/finance/Commercial'));
const FinanceConfig = lazyLoad(() => import('@/pages/finance/Config'));

// Pages du module Étudiants
const StudentsRegistration = lazyLoad(() => import('@/pages/students/Registration'));
const StudentsProfiles = lazyLoad(() => import('@/pages/students/Profiles'));
const StudentsTracking = lazyLoad(() => import('@/pages/students/Tracking'));
const StudentsCards = lazyLoad(() => import('@/pages/students/Cards'));
const StudentsAnalytics = lazyLoad(() => import('@/pages/students/Analytics'));
const StudentsImport = lazyLoad(() => import('@/pages/students/Import'));

// Pages du module Académique
const AcademicPrograms = lazyLoad(() => import('@/pages/academic/Programs'));
const AcademicSubjects = lazyLoad(() => import('@/pages/academic/Subjects'));
const AcademicTimetables = lazyLoad(() => import('@/pages/academic/Timetables'));
const AcademicCalendar = lazyLoad(() => import('@/pages/academic/Calendar'));
const AcademicPathways = lazyLoad(() => import('@/pages/academic/Pathways'));
const AcademicGroups = lazyLoad(() => import('@/pages/academic/Groups'));
const AcademicLevels = lazyLoad(() => import('@/pages/academic/Levels'));
const AcademicDepartments = lazyLoad(() => import('@/pages/academic/Departments'));

// Pages du module Résultats
const ResultsGradingSystem = lazyLoad(() => import('@/pages/results/GradingSystem'));
const ResultsGradeEntry = lazyLoad(() => import('@/pages/results/GradeEntry'));
const ResultsCalculations = lazyLoad(() => import('@/pages/results/Calculations'));
const ResultsValidation = lazyLoad(() => import('@/pages/results/Validation'));
const ResultsDocumentation = lazyLoad(() => import('@/pages/results/Documentation'));
const ResultsPersonalisation = lazyLoad(() => import('@/pages/results/RefactoredPersonalisation'));
const ResultsProduction = lazyLoad(() => import('@/pages/results/Production'));
const ResultsAnalytics = lazyLoad(() => import('@/pages/results/Analytics'));

// Pages du module Examens (simplifiées)
const ExamCreation = lazyLoad(() => import('@/pages/exams/creation'));
const ExamsPlanning = lazyLoad(() => import('@/pages/exams/Planning'));
const ExamsMonitoring = lazyLoad(() => import('@/pages/exams/Monitoring'));

// Pages du module e-Learning
const ElearningCourses = lazyLoad(() => import('@/pages/elearning/Courses'));
const ElearningVirtualClasses = lazyLoad(() => import('@/pages/elearning/VirtualClasses'));
const ElearningAnalytics = lazyLoad(() => import('@/pages/elearning/Analytics'));

// Pages du module RH
const HrTeachers = lazyLoad(() => import('@/pages/hr/Teachers'));
const HrContracts = lazyLoad(() => import('@/pages/hr/Contracts'));

// Pages du module Ressources
const ResourcesInventory = lazyLoad(() => import('@/pages/resources/Inventory'));
const ResourcesBookings = lazyLoad(() => import('@/pages/resources/Bookings'));

// Pages du module Services
const Transport = lazyLoad(() => import('@/pages/services/Transport'));
const Catering = lazyLoad(() => import('@/pages/services/Catering'));
const Accommodation = lazyLoad(() => import('@/pages/services/Accommodation'));

// Pages du module Communication  
const Messaging = lazyLoad(() => import('@/pages/communication/Messaging'));
const Announcements = lazyLoad(() => import('@/pages/communication/Announcements'));

// Pages du module Paramètres
const SettingsGeneral = lazyLoad(() => import('@/pages/settings/General'));
const SettingsUsers = lazyLoad(() => import('@/pages/settings/Users'));
const SettingsAcademic = lazyLoad(() => import('@/pages/settings/AcademicManagement'));
const SettingsInstitutions = lazyLoad(() => import('@/pages/settings/Institutions'));
const SettingsCustomization = lazyLoad(() => import('@/pages/settings/Customization'));
const SettingsIntegrations = lazyLoad(() => import('@/pages/settings/Integrations'));
const SettingsMonitoring = lazyLoad(() => import('@/pages/settings/Monitoring'));

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
        {/* Module Organisation (nouveau) */}
        <Route path="/organization" element={<Organization />} />
        <Route path="/organization/infrastructure" element={<OrganizationInfrastructure />} />
        <Route path="/organization/calendar" element={<OrganizationCalendar />} />

        {/* Module Finance */}
        <Route path="/finance" element={<Finance />} />
        <Route path="/finance/dashboard" element={<FinanceDashboard />} />
        <Route path="/finance/invoices" element={<FinanceInvoices />} />
        <Route path="/finance/payments" element={<FinancePayments />} />
        <Route path="/finance/budgets" element={<FinanceBudgetOverview />} />
        <Route path="/finance/reports" element={<FinanceReports />} />
        <Route path="/finance/analytics" element={<FinanceAnalytics />} />
        <Route path="/finance/commercial" element={<FinanceCommercial />} />
        <Route path="/finance/config" element={<FinanceConfig />} />

        {/* Module Étudiants */}
        <Route path="/students" element={<Students />} />
        <Route path="/students/registration" element={<StudentsRegistration />} />
        <Route path="/students/profiles" element={<StudentsProfiles />} />
        <Route path="/students/tracking" element={<StudentsTracking />} />
        <Route path="/students/cards" element={<StudentsCards />} />
        <Route path="/students/analytics" element={<StudentsAnalytics />} />
        <Route path="/students/import" element={<StudentsImport />} />

        {/* Module Académique */}
        <Route path="/academic" element={<Academic />} />
        <Route path="/academic/programs" element={<AcademicPrograms />} />
        <Route path="/academic/subjects" element={<AcademicSubjects />} />
        <Route path="/academic/timetables" element={<AcademicTimetables />} />
        <Route path="/academic/calendar" element={<AcademicCalendar />} />
        <Route path="/academic/pathways" element={<AcademicPathways />} />
        <Route path="/academic/groups" element={<AcademicGroups />} />
        <Route path="/academic/levels" element={<AcademicLevels />} />
        <Route path="/academic/departments" element={<AcademicDepartments />} />
        
        {/* Module Résultats */}
        <Route path="/results/*" element={<Results />} />

        {/* Module Examens (simplifié) */}
        <Route path="/exams" element={<Exams />} />
        <Route path="/exams/creation" element={<ExamCreation />} />
        <Route path="/exams/planning" element={<ExamsPlanning />} />
        <Route path="/exams/monitoring" element={<ExamsMonitoring />} />

        {/* Module e-Learning */}
        <Route path="/elearning" element={<Elearning />} />
        <Route path="/elearning/courses" element={<ElearningCourses />} />
        <Route path="/elearning/virtual-classes" element={<ElearningVirtualClasses />} />
        <Route path="/elearning/analytics" element={<ElearningAnalytics />} />

        {/* Module RH */}
        <Route path="/hr" element={<Hr />} />
        <Route path="/hr/teachers" element={<HrTeachers />} />
        <Route path="/hr/contracts" element={<HrContracts />} />

        {/* Module Ressources */}
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/inventory" element={<ResourcesInventory />} />
        <Route path="/resources/bookings" element={<ResourcesBookings />} />

        {/* Module Services */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/transport" element={<Transport />} />
        <Route path="/services/catering" element={<Catering />} />
        <Route path="/services/accommodation" element={<Accommodation />} />

        {/* Module Communication */}
        <Route path="/communication" element={<Communication />} />
        <Route path="/communication/messaging" element={<Messaging />} />
        <Route path="/communication/announcements" element={<Announcements />} />

        {/* Module Paramètres */}
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/general" element={<SettingsGeneral />} />
        <Route path="/settings/users" element={<SettingsUsers />} />
        <Route path="/settings/academic" element={<SettingsAcademic />} />
        <Route path="/settings/institutions" element={<SettingsInstitutions />} />
        <Route path="/settings/customization" element={<SettingsCustomization />} />
        <Route path="/settings/integrations" element={<SettingsIntegrations />} />
        <Route path="/settings/monitoring" element={<SettingsMonitoring />} />

        {/* Autres modules */}
        <Route path="/documents" element={<Documents />} />
        <Route path="/partnerships" element={<Partnerships />} />
      </Routes>
    </SuspenseWrapper>
  );
}
