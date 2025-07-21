
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { AcademicSystemSettings } from "@/components/settings/AcademicSystemSettings";

export default function AcademicManagement() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SettingsModuleLayout>
        <SettingsPageHeader 
          title="Gestion Académique" 
          subtitle="Configuration des années académiques et promotion des étudiants" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <AcademicSystemSettings />
          </div>
        </div>
      </SettingsModuleLayout>
    </ProtectedRoute>
  );
}
