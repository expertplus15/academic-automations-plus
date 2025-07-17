import { lazyLoad } from '../index';

// Pages du module Étudiants
export const StudentsRegistration = lazyLoad(() => import('@/pages/students/Registration'));
export const StudentsProfiles = lazyLoad(() => import('@/pages/students/Profiles'));
export const StudentsTracking = lazyLoad(() => import('@/pages/students/Tracking'));
export const StudentsCards = lazyLoad(() => import('@/pages/students/Cards'));
export const StudentsAnalytics = lazyLoad(() => import('@/pages/students/Analytics'));