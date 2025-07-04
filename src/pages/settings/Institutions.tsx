import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";

export default function Institutions() {
  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Multi-établissements" 
        subtitle="Gestion centralisée des établissements" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Multi-établissements</h2>
            <p className="text-muted-foreground">
              Interface de gestion centralisée des établissements à venir.
            </p>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}