import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileSpreadsheet, 
  Users, 
  BookOpen,
  GraduationCap,
  Filter,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';
import { useSpecializations } from '@/hooks/useSpecializations';
import { useAcademicLevels } from '@/hooks/useAcademicLevels';
import { useSubjects } from '@/hooks/useSubjects';
import { useMatrixExport } from '@/hooks/useMatrixExport';

export function MatrixExportInterface() {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const { programs, loading: programsLoading } = usePrograms();
  const { data: specializations, loading: specializationsLoading } = useSpecializations(selectedProgram);
  const { data: levels, loading: levelsLoading } = useAcademicLevels();
  const { subjects, loading: subjectsLoading } = useSubjects(selectedProgram);

  const { 
    exportToExcel, 
    exportToPdf, 
    loading: exportLoading,
    studentsCount,
    subjectsCount
  } = useMatrixExport({
    programId: selectedProgram,
    specializationId: selectedSpecialization,
    levelId: selectedLevel,
    semester: selectedSemester
  });

  // Reset dependent selectors when parent changes
  const handleProgramChange = (value: string) => {
    setSelectedProgram(value);
    setSelectedSpecialization("");
    setSelectedLevel("");
    setSelectedSemester("");
  };

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value);
    setSelectedLevel("");
    setSelectedSemester("");
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setSelectedSemester("");
  };

  const isExportReady = selectedProgram && selectedLevel && selectedSemester;

  const getSelectedSummary = () => {
    if (!isExportReady) return null;

    const program = programs?.find(p => p.id === selectedProgram);
    const specialization = specializations?.find(s => s.id === selectedSpecialization);
    const level = levels?.find(l => l.id === selectedLevel);

    return {
      program: program?.name || 'Programme sélectionné',
      specialization: specialization?.name || 'Toutes spécialisations',
      level: level?.name || 'Niveau sélectionné',
      semester: selectedSemester === '1' ? '1er Semestre' : '2ème Semestre'
    };
  };

  const summary = getSelectedSummary();

  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            Export Matriciel Excel
          </CardTitle>
          <CardDescription>
            Générez des tableaux Excel formatés avec les notes de tous les étudiants par matière.
            Idéal pour créer des relevés de notes et faire des analyses par classe.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filtres de sélection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de sélection
          </CardTitle>
          <CardDescription>
            Sélectionnez les critères pour générer votre export matriciel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Programme */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Programme *</label>
              <Select 
                value={selectedProgram} 
                onValueChange={handleProgramChange}
                disabled={programsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un programme" />
                </SelectTrigger>
                <SelectContent>
                  {programs?.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Spécialisation */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Spécialisation</label>
              <Select 
                value={selectedSpecialization} 
                onValueChange={handleSpecializationChange}
                disabled={!selectedProgram || specializationsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les spécialisations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les spécialisations</SelectItem>
                  {specializations?.map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Niveau */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Niveau *</label>
              <Select 
                value={selectedLevel} 
                onValueChange={handleLevelChange}
                disabled={!selectedProgram || levelsLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels?.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semestre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre *</label>
              <Select 
                value={selectedSemester} 
                onValueChange={setSelectedSemester}
                disabled={!selectedLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un semestre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1er Semestre</SelectItem>
                  <SelectItem value="2">2ème Semestre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Résumé de la sélection */}
          {summary && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-3">Sélection actuelle :</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {summary.program}
                </Badge>
                {summary.specialization !== 'Toutes spécialisations' && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <GraduationCap className="w-3 h-3" />
                    {summary.specialization}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {summary.level}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {summary.semester}
                </Badge>
              </div>

              {isExportReady && (
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {studentsCount || 0} étudiants
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {subjectsCount || 0} matières
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions d'export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Actions d'export
          </CardTitle>
          <CardDescription>
            Générez vos documents selon le format souhaité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export Excel */}
            <Card className="border-2 border-dashed border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Export Excel Matriciel</h3>
                    <p className="text-sm text-muted-foreground">
                      Tableau avec formules de calcul
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Étudiants en lignes, matières en colonnes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Calculs automatiques des moyennes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    Format éditable et imprimable
                  </li>
                </ul>
                <Button 
                  onClick={exportToExcel}
                  disabled={!isExportReady || exportLoading}
                  className="w-full"
                >
                  {exportLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                  )}
                  Exporter en Excel
                </Button>
              </CardContent>
            </Card>

            {/* Export PDF */}
            <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Relevés PDF Individuels</h3>
                    <p className="text-sm text-muted-foreground">
                      Documents officiels par étudiant
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    Relevé personnalisé par étudiant
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    En-têtes et logos institutionnels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    Prêt pour distribution
                  </li>
                </ul>
                <Button 
                  onClick={exportToPdf}
                  disabled={!isExportReady || exportLoading}
                  variant="outline"
                  className="w-full"
                >
                  {exportLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Générer PDF Relevés
                </Button>
              </CardContent>
            </Card>
          </div>

          {!isExportReady && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">
                Veuillez sélectionner un programme, un niveau et un semestre pour activer les exports.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}