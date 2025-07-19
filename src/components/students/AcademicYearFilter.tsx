import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAcademicYearContext } from "@/contexts/AcademicYearContext";

export function AcademicYearFilter() {
  const { selectedAcademicYear, setSelectedAcademicYear, academicYears, loading } = useAcademicYearContext();

  if (loading) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Année académique :</span>
      <Select
        value={selectedAcademicYear?.id || ""}
        onValueChange={(value) => {
          const year = academicYears.find(y => y.id === value);
          if (year) setSelectedAcademicYear(year);
        }}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sélectionner une année" />
        </SelectTrigger>
        <SelectContent>
          {academicYears.map((year) => (
            <SelectItem key={year.id} value={year.id}>
              {year.name} {year.is_current && "(Actuelle)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}