import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, FileDown, Loader2 } from 'lucide-react';
import { useSemesterGrades, SemesterStudentData } from '@/hooks/useSemesterGrades';
import { useAcademicYear } from '@/hooks/useAcademicYear';
import { cn } from '@/lib/utils';

interface SemesterMatrixViewProps {
  selectedProgram: string;
  selectedGroup: string;
  selectedSemester: number;
}

export function SemesterMatrixView({ selectedProgram, selectedGroup, selectedSemester }: SemesterMatrixViewProps) {
  const [semesterData, setSemesterData] = useState<SemesterStudentData[]>([]);
  const [editingCell, setEditingCell] = useState<{studentId: string, subjectId: string, type: 'cc' | 'ef'} | null>(null);
  
  const { getSemesterGrades, loading } = useSemesterGrades();
  const { currentYear } = useAcademicYear();

  // Load semester data
  useEffect(() => {
    const loadSemesterData = async () => {
      if (!selectedProgram || !selectedSemester || !currentYear?.id) return;
      
      const data = await getSemesterGrades(
        selectedProgram, 
        selectedGroup, 
        selectedSemester, 
        currentYear.id
      );
      setSemesterData(data);
    };

    loadSemesterData();
  }, [selectedProgram, selectedGroup, selectedSemester, currentYear?.id, getSemesterGrades]);

  // Get all unique subjects from the data
  const allSubjects = semesterData.length > 0 ? 
    Object.values(semesterData[0].subjects) : [];

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
      case 'Très Bien': return 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950';
      case 'Bien': return 'text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950';
      case 'Assez Bien': return 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950';
      case 'Passable': return 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-950';
      case 'Insuffisant': return 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950';
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Vue Semestre - Toutes les matières
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              {semesterData.length} étudiants
            </Badge>
            <Badge variant="outline">
              Semestre {selectedSemester}
            </Badge>
            <Button variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
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
                        <div className="flex text-xs text-muted-foreground mt-1">
                          <div className="flex-1">CC</div>
                          <div className="flex-1">EF</div>
                          <div className="flex-1">Moy</div>
                        </div>
                      </div>
                    </th>
                  ))}
                  
                  {/* Overall average and mention */}
                  <th className="border-r border-border p-2 text-center min-w-[120px]">
                    <div>Moyenne</div>
                    <div>Générale</div>
                  </th>
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
                    
                    {/* Overall average */}
                    <td className="border-r border-border p-2 text-center">
                      <div className={cn(
                        "font-bold text-sm rounded px-2 py-1",
                        getGradeColor(student.semester_average)
                      )}>
                        {student.semester_average?.toFixed(2) || '-'}
                      </div>
                    </td>
                    
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
  );
}