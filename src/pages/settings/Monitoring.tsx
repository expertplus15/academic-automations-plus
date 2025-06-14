import { SettingsPageHeader } from "@/components/SettingsPageHeader";

export default function Monitoring() {
  return (
    <div className="min-h-screen bg-background">
      <SettingsPageHeader 
        title="Monitoring & logs" 
        subtitle="Surveillance système" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Monitoring & Logs</h2>
            <p className="text-muted-foreground">
              Interface de surveillance système et gestion des logs à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}