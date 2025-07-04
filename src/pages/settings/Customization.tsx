import { SettingsModuleLayout } from "@/components/layouts/SettingsModuleLayout";
import { SettingsPageHeader } from "@/components/SettingsPageHeader";

export default function Customization() {
  return (
    <SettingsModuleLayout>
      <SettingsPageHeader 
        title="Personnalisation" 
        subtitle="Interface & thèmes" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Personnalisation</h2>
            <p className="text-muted-foreground">
              Interface de personnalisation des thèmes et de l'interface à venir.
            </p>
          </div>
        </div>
      </div>
    </SettingsModuleLayout>
  );
}