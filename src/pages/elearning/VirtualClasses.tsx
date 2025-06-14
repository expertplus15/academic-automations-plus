import { ElearningPageHeader } from "@/components/ElearningPageHeader";

export default function VirtualClasses() {
  return (
    <div className="min-h-screen bg-background">
      <ElearningPageHeader 
        title="Classes virtuelles" 
        subtitle="Intégration Zoom, Teams" 
      />
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Classes Virtuelles</h2>
            <p className="text-muted-foreground">
              Interface de gestion des classes virtuelles à venir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}