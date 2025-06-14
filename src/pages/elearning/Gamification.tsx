import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function Gamification() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="Gamification" 
        subtitle="Badges, points et récompenses" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Gamification</h2>
            <p className="text-muted-foreground">
              Interface de gamification avec badges et points à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}