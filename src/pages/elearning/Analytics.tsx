import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="Analytics engagement" 
        subtitle="Insights et métriques d'engagement" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics Engagement</h2>
            <p className="text-muted-foreground">
              Interface d'analytics et insights d'engagement à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}