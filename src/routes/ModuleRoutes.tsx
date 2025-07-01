
import { Routes, Route } from 'react-router-dom';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';

// Students module pages
import Students from '@/pages/Students';
import StudentsRegistration from '@/pages/students/Registration';
import StudentsProfiles from '@/pages/students/Profiles';
import StudentsTracking from '@/pages/students/Tracking';
import StudentsAlerts from '@/pages/students/Alerts';
import StudentsDocuments from '@/pages/students/Documents';
import StudentsCommunication from '@/pages/students/Communication';

export function ModuleRoutes() {
  return (
    <Routes>
      {/* Students Module Routes */}
      <Route path="/students" element={<Students />} />
      <Route path="/students/registration" element={<StudentsRegistration />} />
      <Route path="/students/profiles" element={<StudentsProfiles />} />
      <Route path="/students/tracking" element={<StudentsTracking />} />
      <Route path="/students/alerts" element={<StudentsAlerts />} />
      <Route path="/students/documents" element={<StudentsDocuments />} />
      <Route path="/students/communication" element={<StudentsCommunication />} />
    </Routes>
  );
}
