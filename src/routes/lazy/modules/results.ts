import { lazyLoad } from '../index';

// Pages du module Résultats
export const ResultsGradingSystem = lazyLoad(() => import('@/pages/results/GradingSystem'));
export const ResultsGradeEntry = lazyLoad(() => import('@/pages/results/GradeEntry'));
export const ResultsCalculations = lazyLoad(() => import('@/pages/results/Calculations'));
export const ResultsValidation = lazyLoad(() => import('@/pages/results/Validation'));
export const ResultsDocumentation = lazyLoad(() => import('@/pages/results/Documentation'));
export const ResultsPersonalisation = lazyLoad(() => import('@/pages/results/RefactoredPersonalisation'));
export const ResultsProduction = lazyLoad(() => import('@/pages/results/Production'));
export const ResultsAnalytics = lazyLoad(() => import('@/pages/results/Analytics'));