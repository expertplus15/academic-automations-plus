
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, FileDown, Loader2, Calculator, TrendingUp } from 'lucide-react';
import { useSemesterGrades, SemesterStudentData } from '@/hooks/useSemesterGrades';
import { useAcademicYear } from '@/hooks/useAcademicYear';
import { DUT2GEGradingEngine } from '@/config/GradingRulesDUT2GE';
import { cn } from '@/lib/utils';

interface SemesterMatrixViewProps {
  selectedProgram: string;
  selectedGroup: string;
  selectedSemester: number;
}

interface EnhancedStudentData extends SemesterStudentData {
  calculatedAverage?: number;
  finalDecision?: string;
  hasCompensation?: boolean;
}

export function SemesterMatrixView({ selectedProgram, selectedGroup, selectedSemester }: SemesterMatrixViewProps) {
  const [semesterData, setSemesterData] = useState<EnhancedStudentData[]>([]);
  const [showCalculations, setShowCalculations] = useState(false);
  
  const { getSemesterGrades, loading } = useSemesterGrades();
  const { currentYear } = useAcademicYear();
  const gradingEngine = new DUT2GEGradingEngine();

  // Load semester data with enhanced calculations
  useEffect(() => {
    const loadSemesterData = async () => {
      if (!selectedProgram || !selectedSemester || !currentYear?.id) return;
      
      const data = await getSemesterGrades(
        selectedProgram, 
        selectedGroup, 
        selectedSemester, 
        currentYear.id
      );

      // Enhance data with DUT2-GE calculations
      const enhancedData: EnhancedStudentData[] = data.map(student => {
        const grades: Record<string, { cc: number | null; exam: number | null }> = {};
        
        // Convert subject data to grading engine format
        Object.entries(student.subjects).forEach(([subjectId, subjectData]) => {
          grades[subjectId] = {
            cc: subjectData.cc,
            exam: subjectData.ef || subjectData.examen
          };
        });

        const result = gradingEngine.calculateStudentResults(grades);
        
        return {
          ...student,
          calculatedAverage: selectedSemester === 3 ? result.semester3Average : result.semester4Average,
          finalDecision: result.decision,
          hasCompensation: result.hasCompensation
        };
      });

      setSemesterData(enhancedData);
    };

    loadSemesterData();
  }, [selectedProgram, selectedGroup, selectedSemester, currentYear?.id, getSemesterGrades]);

  // Get all unique subjects from the data
  const allSubjects = semesterData.length > 0 ? 
    Object.values(semesterData[0].subjects) : [];

  // Calculate statistics
  const stats = {
    totalStudents: semesterData.length,
    averageGeneral: semesterData.length > 0 ? 
      semesterData.reduce((sum, s) => sum + (s.calculatedAverage || 0), 0) / semesterData.length : 0,
    admis: semesterData.filter(s => s.finalDecision === 'ADMIS').length,
    subjectAverages: allSubjects.map(subject => ({
      name: subject.subject_name,
      average: semesterData.reduce((sum, student) => {
        const subjectData = student.subjects[subject.subject_id];
        return sum + (subjectData?.moyenne || 0);
      }, 0) / semesterData.length
    })).sort((a, b) => a.average - b.average)
  };

  // Get grade color class
  const getGradeColor = (grade: number | null) => {
    if (grade === null) return '';
    if (grade >= 16) return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950';
    if (grade >= 14) return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950';
    if (grade >= 12) return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950';
    if (grade >= 10) return 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-950';
    return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950';
  };

  // Get mention color
  const getMentionColor = (mention: string) => {
    switch (mention) {
      case 'Très Bien': case 'TRÈS BIEN': return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950';
      case 'Bien': case 'BIEN': return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950';
      case 'Assez Bien': case 'ASSEZ-BIEN': return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950';
      case 'Passable': case 'PASSABLE': return 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-950';
      case 'Insuffisant': case 'AJOURNÉ': return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950';
      default: return '';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Chargement des données du semestre...</span>
        </CardContent>
      </Card>
    );
  }

  if (!selectedProgram) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Veuillez sélectionner un programme pour afficher la vue semestre</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Header */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Étudiants</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.averageGeneral.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Moyenne S{selectedSemester}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{stats.admis}</div>
                <div className="text-sm text-muted-foreground">Validés</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div>
              <div className="text-2xl font-bold">
                {stats.totalStudents > 0 ? ((stats.admis / stats.totalStudents) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Taux réussite</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Matrix */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Matrice Semestre {selectedSemester} - Vue complète DUT2-GE
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCalculations(!showCalculations)}
              >
                <Calculator className="w-4 h-4 mr-2" />
                {showCalculations ? 'Masquer' : 'Afficher'} calculs
              </Button>
              <Badge variant="outline">
                {semesterData.length} étudiants
              </Badge>
              <Badge variant="outline">
                Semestre {selectedSemester}
              </Badge>
              <Button variant="outline" size="sm">
                <FileDown className="w-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {semesterData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune donnée disponible pour ce semestre</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    {/* Student info columns */}
                    <th className="sticky left-0 bg-background border-r border-border p-2 text-left min-w-[80px]">
                      N° Étudiant
                    </th>
                    <th className="sticky left-[80px] bg-background border-r border-border p-2 text-left min-w-[200px]">
                      Nom & Prénom
                    </th>
                    
                    {/* Subject columns */}
                    {allSubjects.map(subject => (
                      <th key={subject.subject_id} className="border-r border-border text-center min-w-[180px]">
                        <div className="p-2">
                          <div className="font-medium text-sm">{subject.subject_name}</div>
                          <div className="text-xs text-muted-foreground">Coeff. {subject.coefficient}</div>
                          <div className="flex text-xs text-muted-foreground mt-1">
                            <div className="flex-1">CC</div>
                            <div className="flex-1">EF</div>
                            <div className="flex-1">Moy</div>
                          </div>
                        </div>
                      </th>
                    ))}
                    
                    {/* Enhanced columns */}
                    <th className="border-r border-border p-2 text-center min-w-[100px]">
                      <div>Moyenne</div>
                      <div>Semestre</div>
                    </th>
                    {showCalculations && (
                      <>
                        <th className="border-r border-border p-2 text-center min-w-[100px]">
                          <div>Moyenne</div>
                          <div>DUT2-GE</div>
                        </th>
                        <th className="border-r border-border p-2 text-center min-w-[120px]">
                          Décision
                        </th>
                      </>
                    )}
                    <th className="p-2 text-center min-w-[120px]">
                      Mention
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {semesterData.map((student, rowIndex) => (
                    <tr key={student.id} className={cn(
                      "border-b border-border hover:bg-muted/50",
                      rowIndex % 2 === 0 ? "bg-background" : "bg-muted/20"
                    )}>
                      {/* Student info */}
                      <td className="sticky left-0 bg-inherit border-r border-border p-2 font-mono text-sm">
                        {student.student_number}
                      </td>
                      <td className="sticky left-[80px] bg-inherit border-r border-border p-2 font-medium">
                        {student.full_name}
                      </td>
                      
                      {/* Subject grades */}
                      {allSubjects.map(subject => {
                        const studentSubject = student.subjects[subject.subject_id];
                        return (
                          <td key={subject.subject_id} className="border-r border-border">
                            <div className="flex">
                              {/* CC Grade */}
                              <div className="flex-1 p-1">
                                <div className={cn(
                                  "text-center text-xs rounded px-1 py-0.5 min-h-[20px]",
                                  getGradeColor(studentSubject?.cc)
                                )}>
                                  {studentSubject?.cc?.toFixed(1) || '-'}
                                </div>
                              </div>
                              {/* EF Grade */}
                              <div className="flex-1 p-1">
                                <div className={cn(
                                  "text-center text-xs rounded px-1 py-0.5 min-h-[20px]",
                                  getGradeColor(studentSubject?.ef)
                                )}>
                                  {studentSubject?.ef?.toFixed(1) || '-'}
                                </div>
                              </div>
                              {/* Average */}
                              <div className="flex-1 p-1">
                                <div className={cn(
                                  "text-center text-xs font-medium rounded px-1 py-0.5 min-h-[20px]",
                                  getGradeColor(studentSubject?.moyenne)
                                )}>
                                  {studentSubject?.moyenne?.toFixed(1) || '-'}
                                </div>
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      
                      {/* Semester average */}
                      <td className="border-r border-border p-2 text-center">
                        <div className={cn(
                          "font-bold text-sm rounded px-2 py-1",
                          getGradeColor(student.semester_average)
                        )}>
                          {student.semester_average?.toFixed(2) || '-'}
                        </div>
                      </td>

                      {/* Enhanced calculations */}
                      {showCalculations && (
                        <>
                          <td className="border-r border-border p-2 text-center">
                            <div className={cn(
                              "font-bold text-sm rounded px-2 py-1",
                              getGradeColor(student.calculatedAverage)
                            )}>
                              {student.calculatedAverage?.toFixed(2) || '-'}
                            </div>
                          </td>
                          <td className="border-r border-border p-2 text-center">
                            <Badge variant={student.finalDecision === 'ADMIS' ? 'default' : 'destructive'}>
                              {student.finalDecision || '-'}
                            </Badge>
                          </td>
                        </>
                      )}
                      
                      {/* Mention */}
                      <td className="p-2 text-center">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs",
                            getMentionColor(student.mention)
                          )}
                        >
                          {student.mention || '-'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subject Statistics */}
      {stats.subjectAverages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analyse par matière</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {stats.subjectAverages.map((subject, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                  <span className="text-sm font-medium">{subject.name}</span>
                  <Badge variant={subject.average < 10 ? 'destructive' : subject.average < 12 ? 'secondary' : 'default'}>
                    {subject.average.toFixed(1)}/20
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
