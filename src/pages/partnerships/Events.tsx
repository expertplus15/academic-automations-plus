import { PartnershipsPageHeader } from "@/components/PartnershipsPageHeader";

export default function Events() {
  return (
    <div className="min-h-screen bg-background">
      <PartnershipsPageHeader 
        title="Organisation événements" 
        subtitle="Forums & conférences" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Organisation Événements</h2>
            <p className="text-muted-foreground">
              Interface d'organisation des forums et conférences à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}