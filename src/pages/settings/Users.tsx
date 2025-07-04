import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";

export default function Users() {
  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Utilisateurs & rôles" 
        subtitle="RBAC contrôle d'accès" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Utilisateurs & Rôles</h2>
            <p className="text-muted-foreground">
              Interface de gestion des utilisateurs et contrôle d'accès à venir.
            </p>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}