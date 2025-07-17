import React from 'react';

// Utility pour le lazy loading
export const lazyLoad = (componentImport: () => Promise<{ default: React.ComponentType<any> }>) =>
  React.lazy(componentImport);

// Pages de base
export const IndexPage = lazyLoad(() => import('@/pages/Index'));
export const LoginPage = lazyLoad(() => import('@/pages/Login'));
export const SignupPage = lazyLoad(() => import('@/pages/Signup'));
export const ResetPasswordPage = lazyLoad(() => import('@/pages/ResetPassword'));
export const DashboardPage = lazyLoad(() => import('@/pages/Dashboard'));
export const NotFoundPage = lazyLoad(() => import('@/pages/NotFound'));
export const UnauthorizedPage = lazyLoad(() => import('@/pages/Unauthorized'));

// Pages principales des modules
export const FinancePage = lazyLoad(() => import('@/pages/Finance'));
export const StudentsPage = lazyLoad(() => import('@/pages/Students'));
export const AcademicPage = lazyLoad(() => import('@/pages/Academic'));
export const ResultsPage = lazyLoad(() => import('@/pages/Results'));
export const ExamsPage = lazyLoad(() => import('@/pages/Exams'));
export const ElearningPage = lazyLoad(() => import('@/pages/Elearning'));
export const HrPage = lazyLoad(() => import('@/pages/Hr'));
export const ResourcesPage = lazyLoad(() => import('@/pages/Resources'));
export const ServicesPage = lazyLoad(() => import('@/pages/Services'));
export const CommunicationPage = lazyLoad(() => import('@/pages/Communication'));
export const SettingsPage = lazyLoad(() => import('@/pages/Settings'));
export const DocumentsPage = lazyLoad(() => import('@/pages/Documents'));
export const PartnershipsPage = lazyLoad(() => import('@/pages/Partnerships'));