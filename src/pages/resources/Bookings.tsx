import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { BookingsDashboard } from "@/components/resources/BookingsDashboard";

export default function Bookings() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Réservation salles" 
        subtitle="Salles & équipements" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <BookingsDashboard />
        </div>
      </div>
    </ModuleLayout>
  );
}