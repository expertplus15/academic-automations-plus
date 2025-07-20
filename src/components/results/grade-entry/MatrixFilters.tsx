
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, X, RefreshCw } from 'lucide-react';
import { useAcademicLevels } from '@/hooks/useAcademicLevels';
import { usePrograms } from '@/hooks/usePrograms';
import { useClassGroups } from '@/hooks/useClassGroups';
import { useAcademicYearContext } from '@/contexts/AcademicYearContext';

interface MatrixFiltersProps {
  selectedLevel: string;
  selectedProgram: string;
  selectedClass: string;
  selectedSubject: string;
  onLevelChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onReset?: () => void;
}

export function MatrixFilters({
  selectedLevel,
  selectedProgram,
  selectedClass,
  selectedSubject,
  onLevelChange,
  onProgramChange,
  onClassChange,
  onSubjectChange,
  onReset
}: MatrixFiltersProps) {
  const { selectedAcademicYear } = useAcademicYearContext();
  const { data: academicLevels = [], loading: levelsLoading } = useAcademicLevels();
  const { programs = [], loading: programsLoading } = usePrograms();
  const { groups = [], loading: groupsLoading } = useClassGroups(selectedProgram, selectedAcademicYear?.id);

  // Filter levels by selected program
  const filteredLevels = academicLevels.filter(level => {
    if (selectedProgram === '') return true;
    return programs.some(program => program.id === selectedProgram && program.level_id === level.id);
  });

  // Mock subjects for now - in a real app, these would come from a hook
  const subjects = [
    { id: 'math', name: 'Mathématiques' },
    { id: 'physics', name: 'Physique' },
    { id: 'chemistry', name: 'Chimie' },
    { id: 'biology', name: 'Biologie' },
    { id: 'computer-science', name: 'Informatique' },
    { id: 'economics', name: 'Économie' }
  ];

  const handleProgramChange = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    onProgramChange(actualValue);
    // Reset dependent filters
    onLevelChange('');
    onClassChange('');
  };

  const handleLevelChange = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    onLevelChange(actualValue);
    // Reset dependent filters
    onClassChange('');
  };

  const handleClassChange = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    onClassChange(actualValue);
  };

  const handleSubjectChange = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    onSubjectChange(actualValue);
  };

  const totalStudents = groups.reduce((sum, group) => sum + group.current_students, 0);
  const availablePrograms = programs.length;
  const availableLevels = filteredLevels.length;

  const hasActiveFilters = selectedProgram || selectedLevel || selectedClass || selectedSubject;

  if (!selectedAcademicYear) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Veuillez sélectionner une année académique pour filtrer les données</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres de sélection
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              {selectedAcademicYear.name}
            </Badge>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReset}
                className="h-8 px-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Grille des filtres - responsive et optimisée */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Programme - EN PREMIER */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Programme <span className="text-primary">*</span>
            </label>
            <Select 
              value={selectedProgram || 'all'} 
              onValueChange={handleProgramChange} 
              disabled={programsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un programme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="font-medium">Tous les programmes</span>
                </SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    <div className="flex flex-col items-start">
                      <span>{program.name}</span>
                      <span className="text-xs text-muted-foreground">{program.code}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProgram && (
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                {programs.find(p => p.id === selectedProgram)?.code}
              </Badge>
            )}
          </div>

          {/* Niveau académique - EN SECOND */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Niveau académique
            </label>
            <Select 
              value={selectedLevel || 'all'} 
              onValueChange={handleLevelChange} 
              disabled={levelsLoading || (!selectedProgram && programs.length > 0)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="font-medium">Tous les niveaux</span>
                </SelectItem>
                {filteredLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLevel && (
              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                {academicLevels.find(l => l.id === selectedLevel)?.name}
              </Badge>
            )}
          </div>

          {/* Classe - EN TROISIÈME */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Classe
            </label>
            <Select 
              value={selectedClass || 'all'} 
              onValueChange={handleClassChange} 
              disabled={groupsLoading || !selectedProgram}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une classe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="font-medium">Toutes les classes</span>
                </SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex flex-col items-start">
                      <span>{group.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {group.current_students}/{group.max_students} étudiants
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedClass && (
              <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                {groups.find(g => g.id === selectedClass)?.name}
              </Badge>
            )}
          </div>

          {/* Matière - EN DERNIER */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Matière
            </label>
            <Select 
              value={selectedSubject || 'all'} 
              onValueChange={handleSubjectChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner une matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="font-medium">Toutes les matières</span>
                </SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedSubject && (
              <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700">
                {subjects.find(s => s.id === selectedSubject)?.name}
              </Badge>
            )}
          </div>
        </div>

        {/* Statistiques et état de chargement */}
        <div className="flex items-center justify-between pt-4 border-t bg-muted/20 rounded-lg p-3">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-sm text-muted-foreground">
                Programmes: <span className="font-semibold text-foreground">{availablePrograms}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">
                Niveaux: <span className="font-semibold text-foreground">{availableLevels}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-muted-foreground">
                Classes: <span className="font-semibold text-foreground">{groups.length}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span className="text-sm text-muted-foreground">
                Étudiants: <span className="font-semibold text-foreground">{totalStudents}</span>
              </span>
            </div>
          </div>

          {(levelsLoading || programsLoading || groupsLoading) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Synchronisation...</span>
            </div>
          )}
        </div>

        {/* Messages d'aide contextuelle */}
        {hasActiveFilters && totalStudents === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Aucun étudiant trouvé avec les filtres sélectionnés. 
              Essayez d'ajuster vos critères de sélection.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
