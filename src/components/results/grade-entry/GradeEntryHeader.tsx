
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export function GradeEntryHeader() {
  const navigate = useNavigate();
  const { selectedAcademicYear, setSelectedAcademicYear, academicYears, loading } = useAcademicYearContext();

  const getStatusBadge = (status: string) => {
    const variants = {
      current: "bg-success/10 text-success border-success/20",
      planning: "bg-primary/10 text-primary border-primary/20",
      archived: "bg-muted text-muted-foreground border-border",
      closed: "bg-destructive/10 text-destructive border-destructive/20"
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/results")}
          className="hover-scale text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        <div className="h-6 w-px bg-border" />
        <div>
          <h1 className="text-xl font-semibold text-foreground">Saisie des Notes</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion matricielle et manuelle des évaluations</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Année Académique</label>
          <div className="flex items-center gap-2">
            <Select 
              value={selectedAcademicYear?.id || ''} 
              onValueChange={(value) => {
                const year = academicYears.find(y => y.id === value);
                if (year) setSelectedAcademicYear(year);
              }}
              disabled={loading}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sélectionner une année" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    {year.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAcademicYear && getStatusBadge(selectedAcademicYear.status)}
          </div>
        </div>
      </div>
    </div>
  );
}
