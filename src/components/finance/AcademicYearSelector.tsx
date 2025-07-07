import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { Calendar, Check } from 'lucide-react';

export function AcademicYearSelector() {
  const { academicYears, selectedAcademicYear, setSelectedAcademicYear, loading } = useAcademicYearContext();

  const getStatusBadge = (status: string) => {
    const variants = {
      current: "bg-green-100 text-green-700 border-green-200",
      planning: "bg-blue-100 text-blue-700 border-blue-200",
      archived: "bg-gray-100 text-gray-700 border-gray-200",
      closed: "bg-red-100 text-red-700 border-red-200"
    };

    const labels = {
      current: "En cours",
      planning: "Planification",
      archived: "Archivée",
      closed: "Fermée"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.planning}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement des années académiques...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[hsl(var(--primary))]" />
          Année Académique
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Année sélectionnée</label>
          <Select 
            value={selectedAcademicYear?.id || ''} 
            onValueChange={(value) => {
              const year = academicYears.find(y => y.id === value);
              if (year) setSelectedAcademicYear(year);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une année académique" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.id} value={year.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{year.name}</span>
                    {year.is_current && <Check className="w-4 h-4 text-green-600" />}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedAcademicYear && (
          <div className="p-4 bg-accent/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{selectedAcademicYear.name}</h4>
              {getStatusBadge(selectedAcademicYear.status)}
            </div>
            <div className="text-sm text-muted-foreground">
              Du {new Date(selectedAcademicYear.start_date).toLocaleDateString('fr-FR')} 
              au {new Date(selectedAcademicYear.end_date).toLocaleDateString('fr-FR')}
            </div>
            {selectedAcademicYear.is_current && (
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Check className="w-3 h-3" />
                Année en cours
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Cette sélection s'applique à tous les modules financiers de cette session.
        </div>
      </CardContent>
    </Card>
  );
}