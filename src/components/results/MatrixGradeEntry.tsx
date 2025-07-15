import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, Users, Save, FileUp, FileDown, Calculator, Zap, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudentGrades, StudentWithGrades, StudentGrade } from '@/hooks/useStudentGrades';
import { usePrograms } from '@/hooks/usePrograms';
import { useSubjects } from '@/hooks/useSubjects';
import { useAcademicYear } from '@/hooks/useAcademicYear';
import { useEvaluationTypes } from '@/hooks/useEvaluationTypes';
import { useSpecializations } from '@/hooks/useSupabase';
import { useAcademicLevels } from '@/hooks/useSupabase';
import { GroupSelector } from '@/components/academic/timetable/GroupSelector';
import { MoteurCalculAcademique, DEFAULT_GRADING_CONFIG } from '@/lib/gradingEngine';

export function MatrixGradeEntry() {
  const [matrixData, setMatrixData] = useState<StudentWithGrades[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [changedGrades, setChangedGrades] = useState<Map<string, StudentGrade>>(new Map());
  
  const { toast } = useToast();
  const { programs, loading: programsLoading } = usePrograms();
  const { data: specializations, loading: specializationsLoading } = useSpecializations();
  const { data: academicLevels, loading: levelsLoading } = useAcademicLevels();
  const { subjects, loading: subjectsLoading } = useSubjects(selectedProgram);
  const { currentYear } = useAcademicYear();
  const { evaluationTypes } = useEvaluationTypes();
  const { getMatriceGrades, saveGradesBatch } = useStudentGrades();
  const gradingEngine = new MoteurCalculAcademique(DEFAULT_GRADING_CONFIG);

  // Filter specializations by selected program
  const filteredSpecializations = specializations?.filter(spec => 
    !selectedProgram || spec.program_id === selectedProgram
  ) || [];

  // Get evaluation type IDs for CC and Exam
  const ccEvalType = evaluationTypes.find(et => et.code === 'CC');
  const examEvalType = evaluationTypes.find(et => et.code === 'EF');

  // Load students and grades when subject and semester change
  useEffect(() => {
    const loadGrades = async () => {
      if (!selectedSubject || !selectedSemester) return;
      
      setLoading(true);
      try {
        const data = await getMatriceGrades(selectedSubject, selectedSemester);
        setMatrixData(data);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, [selectedSubject, selectedSemester, getMatriceGrades, toast]);

  // Reset cascade when selections change
  useEffect(() => {
    if (selectedProgram) {
      setSelectedSpecialization('');
      setSelectedLevel('');
      setSelectedSubject('');
      setMatrixData([]);
      setChangedGrades(new Map());
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedSpecialization) {
      setSelectedGroup('');
      setSelectedSubject('');
      setMatrixData([]);
      setChangedGrades(new Map());
    }
  }, [selectedSpecialization]);

  useEffect(() => {
    if (selectedLevel) {
      setSelectedGroup('');
      setSelectedSubject('');
      setMatrixData([]);
      setChangedGrades(new Map());
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedGroup) {
      setSelectedSubject('');
      setMatrixData([]);
      setChangedGrades(new Map());
    }
  }, [selectedGroup]);

  const calculateRowValues = useCallback((rowIndex: number) => {
    const data = [...matrixData];
    const row = data[rowIndex];
    
    if (row.grades.cc !== undefined && row.grades.examen !== undefined) {
      const moyenne = gradingEngine.calculerMoyenneMatiere(row.grades.cc, row.grades.examen);
      const mention = gradingEngine.attribuerMention(moyenne);
      
      data[rowIndex] = {
        ...row,
        grades: {
          ...row.grades,
          moyenne,
          mention: mention?.label || 'N/A'
        }
      };
      
      setMatrixData(data);
    }
  }, [matrixData, gradingEngine]);

  const handleCellEdit = useCallback((rowIndex: number, field: 'cc' | 'examen', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    
    if (numValue !== undefined && (numValue < 0 || numValue > 20)) {
      toast({
        title: "Valeur invalide",
        description: "La note doit être entre 0 et 20",
        variant: "destructive",
      });
      return;
    }
    
    const data = [...matrixData];
    const row = data[rowIndex];
    
    // Update the matrix data
    data[rowIndex] = {
      ...row,
      grades: {
        ...row.grades,
        [field]: numValue
      }
    };
    
    setMatrixData(data);
    
    // Track changes for batch save
    const gradeKey = `${row.id}-${field}`;
    if (numValue !== undefined && currentYear) {
      const evalTypeId = field === 'cc' ? ccEvalType?.id : examEvalType?.id;
      
      if (!evalTypeId) {
        toast({
          title: "Erreur de configuration",
          description: `Type d'évaluation ${field === 'cc' ? 'CC' : 'EF'} non trouvé`,
          variant: "destructive",
        });
        return;
      }
      
      const gradeData: StudentGrade = {
        student_id: row.id,
        subject_id: selectedSubject,
        evaluation_type_id: evalTypeId,
        grade: numValue,
        semester: selectedSemester,
        academic_year_id: currentYear.id,
        evaluation_date: new Date().toISOString().split('T')[0]
      };
      
      const newChanges = new Map(changedGrades);
      newChanges.set(gradeKey, gradeData);
      setChangedGrades(newChanges);
    }
    
    // Auto-calculate when both CC and exam are filled
    setTimeout(() => calculateRowValues(rowIndex), 100);
    
    if (autoSave && changedGrades.size > 0) {
      // Auto-save after 2 seconds of inactivity
      setTimeout(() => handleSaveAll(), 2000);
    }
  }, [matrixData, selectedSubject, selectedSemester, changedGrades, autoSave, toast]);

  const handleSaveAll = async () => {
    if (changedGrades.size === 0) {
      toast({
        title: "Aucune modification",
        description: "Aucune note à sauvegarder",
      });
      return;
    }
    
    setSaving(true);
    try {
      const gradesToSave = Array.from(changedGrades.values());
      const success = await saveGradesBatch(gradesToSave);
      
      if (success) {
        setChangedGrades(new Map()); // Clear changes after successful save
        toast({
          title: "Notes sauvegardées",
          description: `${gradesToSave.length} notes ont été enregistrées`,
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les notes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCalculateAll = () => {
    matrixData.forEach((_, index) => calculateRowValues(index));
    toast({
      title: "Calculs effectués",
      description: "Toutes les moyennes ont été recalculées",
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Export en cours",
      description: "Le fichier Excel va être téléchargé",
    });
  };

  const importFromExcel = () => {
    // TODO: Implement Excel import
    toast({
      title: "Import disponible",
      description: "Fonctionnalité d'import Excel en cours de développement",
    });
  };

  const getMentionColor = (mention: string) => {
    const colors = {
      'Très Bien': 'bg-green-100 text-green-800',
      'Bien': 'bg-blue-100 text-blue-800',
      'Assez Bien': 'bg-orange-100 text-orange-800',
      'Passable': 'bg-gray-100 text-gray-800',
      'Ajourné': 'bg-red-100 text-red-800'
    };
    return colors[mention as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Saisie Matricielle</h2>
          <p className="text-muted-foreground">Interface collaborative type Google Sheets - Calculs automatiques</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={importFromExcel}>
            <FileUp className="w-4 h-4 mr-2" />
            Import Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <FileDown className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" size="sm" onClick={handleCalculateAll}>
            <Calculator className="w-4 h-4 mr-2" />
            Recalculer Tout
          </Button>
          <Button 
            onClick={handleSaveAll} 
            disabled={saving || changedGrades.size === 0} 
            size="sm"
            variant={changedGrades.size > 0 ? "default" : "outline"}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Sauvegarder {changedGrades.size > 0 && `(${changedGrades.size})`}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* First row: Main selectors */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="space-y-2">
                <label className="text-sm font-medium">Programme</label>
                <Select value={selectedProgram} onValueChange={setSelectedProgram} disabled={programsLoading}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder={programsLoading ? "Chargement..." : "Sélectionner un programme"} />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.code} - {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Spécialisation</label>
                <Select 
                  value={selectedSpecialization} 
                  onValueChange={setSelectedSpecialization}
                  disabled={!selectedProgram || specializationsLoading}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder={
                      !selectedProgram ? "Sélectionner d'abord un programme" :
                      specializationsLoading ? "Chargement..." :
                      "Sélectionner une spécialisation"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSpecializations.map((specialization) => (
                      <SelectItem key={specialization.id} value={specialization.id}>
                        {specialization.code} - {specialization.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Niveau</label>
                <Select 
                  value={selectedLevel} 
                  onValueChange={setSelectedLevel}
                  disabled={levelsLoading}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={levelsLoading ? "Chargement..." : "Sélectionner un niveau"} />
                  </SelectTrigger>
                  <SelectContent>
                    {academicLevels?.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.code} - {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <GroupSelector
                  value={selectedGroup}
                  onChange={setSelectedGroup}
                  programId={selectedProgram}
                  academicYearId={currentYear?.id}
                />
              </div>
            </div>

            {/* Second row: Subject, semester and options */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="space-y-2">
                <label className="text-sm font-medium">Matière</label>
                 <Select 
                   value={selectedSubject} 
                   onValueChange={setSelectedSubject}
                   disabled={!selectedProgram || !selectedSpecialization || !selectedLevel || !selectedGroup || subjectsLoading}
                >
                  <SelectTrigger className="w-64">
                     <SelectValue placeholder={
                       !selectedProgram ? "Sélectionner d'abord un programme" :
                       !selectedSpecialization ? "Sélectionner d'abord une spécialisation" :
                       !selectedLevel ? "Sélectionner d'abord un niveau" :
                       !selectedGroup ? "Sélectionner d'abord une classe" :
                       subjectsLoading ? "Chargement..." :
                       "Sélectionner une matière"
                     } />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Semestre</label>
                <Select value={selectedSemester.toString()} onValueChange={(v) => setSelectedSemester(Number(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">S1</SelectItem>
                    <SelectItem value="2">S2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="checkbox"
                  id="auto-save"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <label htmlFor="auto-save" className="text-sm">Sauvegarde automatique</label>
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
            </div>

            {/* Selection summary */}
            {(selectedProgram || selectedSpecialization || selectedLevel || selectedSubject) && (
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Sélection active :</span>
                  {selectedProgram && <span className="ml-2 px-2 py-1 bg-primary/10 rounded text-primary">
                    {programs.find(p => p.id === selectedProgram)?.name}
                  </span>}
                  {selectedSpecialization && <span className="ml-2 px-2 py-1 bg-blue-100 rounded text-blue-800">
                    {filteredSpecializations.find(s => s.id === selectedSpecialization)?.name}
                  </span>}
                  {selectedLevel && <span className="ml-2 px-2 py-1 bg-green-100 rounded text-green-800">
                    {academicLevels?.find(l => l.id === selectedLevel)?.name}
                  </span>}
                  {selectedSubject && <span className="ml-2 px-2 py-1 bg-orange-100 rounded text-orange-800">
                    {subjects.find(s => s.id === selectedSubject)?.name}
                  </span>}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Matrix Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid className="w-5 h-5" />
            Grille de Saisie - {matrixData.length} étudiants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium bg-muted/50">N° Étudiant</th>
                  <th className="text-left p-3 font-medium bg-muted/50">Nom & Prénom</th>
                  <th className="text-center p-3 font-medium bg-blue-50">CC (/20)</th>
                  <th className="text-center p-3 font-medium bg-green-50">Examen (/20)</th>
                  <th className="text-center p-3 font-medium bg-yellow-50">Moyenne</th>
                  <th className="text-center p-3 font-medium bg-gray-50">Coef.</th>
                  <th className="text-center p-3 font-medium bg-purple-50">Total</th>
                  <th className="text-center p-3 font-medium bg-orange-50">Mention</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Chargement des données...
                      </div>
                    </td>
                  </tr>
                ) : matrixData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      {!selectedProgram ? "Sélectionnez un programme pour commencer" :
                       !selectedSubject ? "Sélectionnez une matière pour voir les étudiants" :
                       "Aucun étudiant trouvé pour cette matière"}
                    </td>
                  </tr>
                ) : matrixData.map((row, index) => (
                  <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-sm">{row.student_number}</td>
                    <td className="p-3 font-medium">{row.profiles.full_name}</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={row.grades.cc ?? ''}
                        onChange={(e) => handleCellEdit(index, 'cc', e.target.value)}
                        className="w-20 text-center"
                        placeholder="--"
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        step="0.25"
                        value={row.grades.examen ?? ''}
                        onChange={(e) => handleCellEdit(index, 'examen', e.target.value)}
                        className="w-20 text-center"
                        placeholder="--"
                      />
                    </td>
                    <td className="p-3 text-center">
                      <div className="font-mono font-medium">
                        {row.grades.moyenne !== undefined ? row.grades.moyenne.toFixed(2) : '--'}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge variant="outline">{row.grades.coefficient || 2}</Badge>
                    </td>
                    <td className="p-3 text-center">
                      <div className="font-mono font-medium">
                        {row.grades.moyenne !== undefined && row.grades.coefficient 
                          ? (row.grades.moyenne * row.grades.coefficient).toFixed(2) 
                          : '--'
                        }
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      {row.grades.mention && (
                        <Badge className={getMentionColor(row.grades.mention)}>
                          {row.grades.mention}
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {matrixData.filter(r => r.grades.moyenne !== undefined).length}
                </div>
                <div className="text-sm text-muted-foreground">Notes Complètes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {matrixData.filter(r => r.grades.moyenne !== undefined && r.grades.moyenne >= 10).length}
                </div>
                <div className="text-sm text-muted-foreground">Admis</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {matrixData.filter(r => r.grades.moyenne !== undefined).length > 0 
                    ? (matrixData.reduce((sum, r) => sum + (r.grades.moyenne || 0), 0) / 
                       matrixData.filter(r => r.grades.moyenne !== undefined).length).toFixed(2)
                    : '--'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Moyenne Classe</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {matrixData.filter(r => r.grades.mention && r.grades.mention.includes('Bien')).length}
                </div>
                <div className="text-sm text-muted-foreground">Mentions</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}