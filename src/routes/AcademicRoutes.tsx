import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AcademicLayout } from '@/layouts/AcademicLayout';
import { UnifiedAcademicDashboard } from '@/components/academic/UnifiedAcademicDashboard';

// Academic sub-pages
import Programs from '@/pages/academic/Programs';
import Pathways from '@/pages/academic/Pathways';
import Levels from '@/pages/academic/Levels';
import Groups from '@/pages/academic/Groups';
import Subjects from '@/pages/academic/Subjects';
import Infrastructure from '@/pages/academic/Infrastructure';
import Timetables from '@/pages/academic/Timetables';
import Evaluations from '@/pages/academic/Evaluations';

export function AcademicRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher']}>
      <Routes>
        <Route path="/" element={<AcademicLayout />}>
          <Route index element={<UnifiedAcademicDashboard />} />
          <Route path="programs" element={<Programs />} />
          <Route path="pathways" element={<Pathways />} />
          <Route path="levels" element={<Levels />} />
          <Route path="groups" element={<Groups />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="timetables" element={<Timetables />} />
          <Route path="evaluations" element={<Evaluations />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}