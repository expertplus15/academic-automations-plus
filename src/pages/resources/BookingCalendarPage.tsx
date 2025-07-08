import { ModuleLayout } from "@/components/layouts/ModuleLayout";
import { ResourcesPageHeader } from "@/components/ResourcesPageHeader";
import { BookingCalendar } from "@/components/resources/BookingCalendar";

export default function BookingCalendarPage() {
  return (
    <ModuleLayout>
      <ResourcesPageHeader 
        title="Calendrier des réservations" 
        subtitle="Visualisation et gestion des conflits" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <BookingCalendar onNewBooking={() => console.log('Nouvelle réservation')} />
        </div>
      </div>
    </ModuleLayout>
  );
}