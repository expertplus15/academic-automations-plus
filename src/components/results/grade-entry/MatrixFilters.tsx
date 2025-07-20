
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCcw } from "lucide-react";
import { useMatrixFilters } from '@/hooks/useMatrixFilters';
import { usePrograms } from '@/hooks/usePrograms';
import { useAcademicLevels } from '@/hooks/useAcademicLevels';
import { useClassGroups } from '@/hooks/useClassGroups';
import { useSubjects } from '@/hooks/useSubjects';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';

export function MatrixFilters() {
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useMatrixFilters();
  const { selectedAcademicYear } = useAcademicYearContext();
  
  // Hooks pour récupérer les données avec filtrage en cascade
  const { programs, loading: programsLoading } = usePrograms();
  const { data: levels, loading: levelsLoading } = useAcademicLevels(filters.program || undefined);
  const { groups, loading: groupsLoading } = useClassGroups(
    filters.program || undefined, 
    selectedAcademicYear?.id,
    filters.level || undefined
  );
  const { subjects, loading: subjectsLoading } = useSubjects(
    filters.program || undefined,
    filters.level || undefined
  );

  console.log('🔍 [MATRIX_FILTERS] Current filters:', filters);
  console.log('📊 [MATRIX_FILTERS] Data counts with cascade filtering:', {
    programs: programs.length,
    levels: levels.length,
    groups: groups.length,
    subjects: subjects.length
  });

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Filtres de sélection</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 text-xs hover-scale"
            >
              <RefreshCcw className="w-3 h-3 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Programme - PREMIER */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Programme *
            </label>
            <Select
              value={filters.program}
              onValueChange={(value) => updateFilter('program', value)}
              disabled={programsLoading}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Tous les programmes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les programmes</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.code} - {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Niveau Académique */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Niveau Académique
            </label>
            <Select
              value={filters.level}
              onValueChange={(value) => updateFilter('level', value)}
              disabled={levelsLoading || !filters.program}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={!filters.program ? "Sélectionner un programme d'abord" : "Tous les niveaux"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.code} - {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Classe */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Classe
            </label>
            <Select
              value={filters.class}
              onValueChange={(value) => updateFilter('class', value)}
              disabled={groupsLoading || !filters.program}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={!filters.program ? "Sélectionner un programme d'abord" : "Toutes les classes"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les classes</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.code} - {group.name} ({group.current_students}/{group.max_students})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Matière */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Matière
            </label>
            <Select
              value={filters.subject}
              onValueChange={(value) => updateFilter('subject', value)}
              disabled={subjectsLoading || !filters.program}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder={!filters.program ? "Sélectionner un programme d'abord" : "Toutes les matières"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les matières</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name} ({subject.credits_ects} ECTS)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recherche */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="h-9 pl-7 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Statistiques des filtres avec indication de filtrage */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className={programs.length === 0 ? 'text-orange-500' : ''}>
              Programmes: {programs.length}
            </span>
            <span className={levels.length === 0 && filters.program ? 'text-orange-500' : ''}>
              Niveaux: {levels.length} {filters.program && levels.length === 0 ? '(aucun pour ce programme)' : ''}
            </span>
            <span className={groups.length === 0 && (filters.program || filters.level) ? 'text-orange-500' : ''}>
              Classes: {groups.length} {(filters.program || filters.level) && groups.length === 0 ? '(aucune pour ces filtres)' : ''}
            </span>
            <span className={subjects.length === 0 && (filters.program || filters.level) ? 'text-orange-500' : ''}>
              Matières: {subjects.length} {(filters.program || filters.level) && subjects.length === 0 ? '(aucune pour ces filtres)' : ''}
            </span>
          </div>
          {selectedAcademicYear && (
            <div className="text-xs text-muted-foreground">
              Année: {selectedAcademicYear.name}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
