import { SettingsPageHeader } from "@/components/SettingsPageHeader";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsPageHeader 
        title="Paramètres & Configuration" 
        subtitle="Configuration système et personnalisation" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres Système</h2>
            <p className="text-muted-foreground">
              Configuration générale et personnalisation de l'application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}