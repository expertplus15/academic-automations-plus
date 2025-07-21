
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAcademicYearContext } from "@/contexts/AcademicYearContext";
import { Badge } from "@/components/ui/badge";

export function AcademicYearFilter() {
  const { selectedAcademicYear, setSelectedAcademicYear, academicYears, loading } = useAcademicYearContext();

  // Sort academic years: current first, then by newest start date  
  const sortedAcademicYears = [...academicYears].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

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
        <SelectTrigger className="w-60">
          <SelectValue placeholder="Sélectionner une année" />
        </SelectTrigger>
        <SelectContent>
          {sortedAcademicYears.map((year) => (
            <SelectItem key={year.id} value={year.id}>
              <div className="flex items-center justify-between w-full gap-2">
                <span>{year.name}</span>
                <div className="flex items-center gap-1">
                  {year.status === 'completed' && (
                    <Badge variant="outline" className="text-xs bg-muted">
                      Terminée
                    </Badge>
                  )}
                  {year.status === 'active' && (
                    <Badge variant="default" className="text-xs">
                      En cours
                    </Badge>
                  )}
                  {year.status === 'planning' && (
                    <Badge variant="secondary" className="text-xs">
                      Planifiée
                    </Badge>
                  )}
                  {year.is_current && (
                    <Badge variant="destructive" className="text-xs">
                      Actuelle
                    </Badge>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
