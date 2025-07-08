import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";
import { SettingsDashboard } from "@/components/settings/SettingsDashboard";

export default function Settings() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SettingsModuleLayout>
        <SettingsPageHeader 
          title="Paramètres & Configuration" 
          subtitle="Configuration système et personnalisation" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <SettingsDashboard />
          </div>
        </div>
      </SettingsModuleLayout>
    </ProtectedRoute>
  );
}