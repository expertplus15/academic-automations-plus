import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { TimetableCalendar } from "@/components/academic/TimetableCalendar";

export default function Timetables() {
  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Emploi du Temps" 
        subtitle="Planning intelligent" 
      />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <TimetableCalendar />
        </div>
      </div>
    </div>
  );
}