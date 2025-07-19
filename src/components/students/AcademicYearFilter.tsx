
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAcademicYearContext } from "@/contexts/AcademicYearContext";
import { Badge } from "@/components/ui/badge";

export function AcademicYearFilter() {
  const { selectedAcademicYear, setSelectedAcademicYear, academicYears, loading } = useAcademicYearContext();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Année académique :</span>
        <div className="w-48 h-10 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Année académique :</span>
      <Select
        value={selectedAcademicYear?.id || ""}
        onValueChange={(value) => {
          const year = academicYears.find(y => y.id === value);
          if (year) {
            console.log('🔄 Changing academic year to:', year.name);
            setSelectedAcademicYear(year);
          }
        }}
      >
        <SelectTrigger className="w-52">
          <SelectValue placeholder="Sélectionner une année" />
        </SelectTrigger>
        <SelectContent>
          {academicYears.map((year) => (
            <SelectItem key={year.id} value={year.id}>
              <div className="flex items-center gap-2">
                <span>{year.name}</span>
                {year.is_current && (
                  <Badge variant="secondary" className="text-xs">
                    Actuelle
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
