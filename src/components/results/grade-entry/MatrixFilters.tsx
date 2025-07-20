
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
}

export function MatrixFilters({
  selectedLevel,
  selectedProgram,
  selectedClass,
  selectedSubject,
  onLevelChange,
  onProgramChange,
  onClassChange,
  onSubjectChange
}: MatrixFiltersProps) {
  const { selectedAcademicYear } = useAcademicYearContext();
  const { data: academicLevels, loading: levelsLoading } = useAcademicLevels();
  const { programs, loading: programsLoading } = usePrograms();
  const { groups, loading: groupsLoading } = useClassGroups(selectedProgram, selectedAcademicYear?.id);

  // Filter programs by selected level
  const filteredPrograms = programs.filter(program => 
    selectedLevel === '' || program.level_id === selectedLevel
  );

  // Mock subjects for now - in a real app, these would come from a hook
  const subjects = [
    { id: 'math', name: 'Mathématiques' },
    { id: 'physics', name: 'Physique' },
    { id: 'chemistry', name: 'Chimie' },
    { id: 'biology', name: 'Biologie' }
  ];

  const handleLevelChange = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    onLevelChange(actualValue);
    // Reset dependent filters
    onProgramChange('');
    onClassChange('');
  };

  const handleProgramChange = (value: string) => {
    const actualValue = value === 'all' ? '' : value;
    onProgramChange(actualValue);
    // Reset dependent filters
    onClassChange('');
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtres de sélection</h3>
        {selectedAcademicYear && (
          <Badge variant="outline">
            {selectedAcademicYear.name}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Niveau académique */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Niveau académique</label>
          <Select value={selectedLevel} onValueChange={handleLevelChange} disabled={levelsLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              {academicLevels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedLevel && (
            <Badge variant="secondary" className="text-xs">
              {academicLevels.find(l => l.id === selectedLevel)?.name}
            </Badge>
          )}
        </div>

        {/* Programme */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Programme</label>
          <Select value={selectedProgram} onValueChange={handleProgramChange} disabled={programsLoading}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un programme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les programmes</SelectItem>
              {filteredPrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  {program.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedProgram && (
            <Badge variant="secondary" className="text-xs">
              {programs.find(p => p.id === selectedProgram)?.name}
            </Badge>
          )}
        </div>

        {/* Classe */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Classe</label>
          <Select value={selectedClass} onValueChange={onClassChange} disabled={groupsLoading || !selectedProgram}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name} ({group.current_students}/{group.max_students})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedClass && (
            <Badge variant="secondary" className="text-xs">
              {groups.find(g => g.id === selectedClass)?.name}
            </Badge>
          )}
        </div>

        {/* Matière */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Matière</label>
          <Select value={selectedSubject} onValueChange={onSubjectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les matières</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSubject && (
            <Badge variant="secondary" className="text-xs">
              {subjects.find(s => s.id === selectedSubject)?.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Compteurs */}
      <div className="flex items-center gap-4 pt-2 border-t">
        <div className="text-sm text-muted-foreground">
          Programmes: <span className="font-medium">{filteredPrograms.length}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Classes: <span className="font-medium">{groups.length}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Étudiants: <span className="font-medium">{groups.reduce((sum, group) => sum + group.current_students, 0)}</span>
        </div>
      </div>
    </div>
  );
}
