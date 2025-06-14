import { Routes, Route } from 'react-router-dom';
import { AcademicRoutes } from '@/routes/AcademicRoutes';
import { ModuleRoutes } from '@/routes/ModuleRoutes';
import Dashboard from '@/pages/Dashboard';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import NotFound from '@/pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/academic/*" element={<AcademicRoutes />} />
      <Route path="/*" element={<ModuleRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}