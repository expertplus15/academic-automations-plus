import { SettingsPageHeader } from "@/components/SettingsPageHeader";

export default function Integrations() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsPageHeader 
        title="Intégrations tierces" 
        subtitle="API et webhooks" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Intégrations Tierces</h2>
            <p className="text-muted-foreground">
              Interface de gestion des API et webhooks à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}