import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  FileText, 
  Download,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useGradeCalculations, SemesterCalculation } from '@/hooks/useGradeCalculations';
import { useStudents } from '@/hooks/useStudents';
import { SemesterSummaryCard } from './SemesterSummaryCard';
import { TranscriptPreview } from './TranscriptPreview';

interface ProgramCalculationsViewProps {
  onBackToMatrix?: () => void;
}

export function ProgramCalculationsView({ onBackToMatrix }: ProgramCalculationsViewProps) {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('program-overview');
  const [semester1Data, setSemester1Data] = useState<SemesterCalculation | null>(null);
  const [semester2Data, setSemester2Data] = useState<SemesterCalculation | null>(null);
  const [generalAverage, setGeneralAverage] = useState<number>(0);
  const [programStudentsData, setProgramStudentsData] = useState<any[]>([]);

  const { toast } = useToast();
  const { programs, loading: programsLoading } = usePrograms();
  const { currentYear } = useAcademicYears();
  const { students, loading: studentsLoading } = useStudents();
  const { 
    calculateSemesterCalculations, 
    calculateGeneralAverage, 
    loading: calculationsLoading 
  } = useGradeCalculations();

  // Filter students by selected program
  const selectedProgramData = programs.find(p => p.id === selectedProgram);
  const filteredStudents = students.filter(student => 
    selectedProgramData ? student.program?.name === selectedProgramData.name : false
  );

  // Load calculations when student is selected
  useEffect(() => {
    const loadCalculations = async () => {
      if (!selectedStudent || !currentYear) return;

      try {
        const [s1Data, s2Data] = await Promise.all([
          calculateSemesterCalculations(selectedStudent, currentYear.id, 1),
          calculateSemesterCalculations(selectedStudent, currentYear.id, 2)
        ]);

        setSemester1Data(s1Data);
        setSemester2Data(s2Data);
        setGeneralAverage(calculateGeneralAverage(s1Data, s2Data));
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les calculs",
          variant: "destructive",
        });
      }
    };

    loadCalculations();
  }, [selectedStudent, currentYear, calculateSemesterCalculations, calculateGeneralAverage, toast]);

  // Load program students data when program is selected
  useEffect(() => {
    const loadProgramStudentsData = async () => {
      if (!selectedProgram || !currentYear) return;

      try {
        const programStudents = filteredStudents;
        const studentsWithAverages = await Promise.all(
          programStudents.map(async (student) => {
            const [s1Data, s2Data] = await Promise.all([
              calculateSemesterCalculations(student.id, currentYear.id, 1),
              calculateSemesterCalculations(student.id, currentYear.id, 2)
            ]);
            
            const generalAvg = calculateGeneralAverage(s1Data, s2Data);
            
            return {
              ...student,
              semester1Average: s1Data?.semester_average || 0,
              semester2Average: s2Data?.semester_average || 0,
              generalAverage: generalAvg,
              mention: getMention(generalAvg),
              decision: getDecision(generalAvg)
            };
          })
        );
        
        setProgramStudentsData(studentsWithAverages);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du programme",
          variant: "destructive",
        });
      }
    };

    loadProgramStudentsData();
  }, [selectedProgram, currentYear, calculateSemesterCalculations, calculateGeneralAverage, filteredStudents, toast]);

  const getMention = (average: number): string => {
    if (average >= 16) return "Très Bien";
    if (average >= 14) return "Bien";
    if (average >= 12) return "Assez Bien";
    if (average >= 10) return "Passable";
    return "Insuffisant";
  };

  const getDecision = (average: number): string => {
    return average >= 10 ? "Admis" : "Ajourné";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <CardTitle>Calculs et Relevés de Notes</CardTitle>
            </div>
            
            {onBackToMatrix && (
              <Button variant="outline" onClick={onBackToMatrix}>
                Retour à la matrice
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un programme" />
              </SelectTrigger>
              <SelectContent>
                {programsLoading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : programs.length === 0 ? (
                  <SelectItem value="empty" disabled>Aucun programme disponible</SelectItem>
                ) : (
                  programs.map(program => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            
            <Select value={selectedStudent} onValueChange={setSelectedStudent} disabled={!selectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un étudiant" />
              </SelectTrigger>
              <SelectContent>
                {studentsLoading ? (
                  <SelectItem value="loading" disabled>Chargement...</SelectItem>
                ) : filteredStudents.length === 0 ? (
                  <SelectItem value="empty" disabled>Aucun étudiant dans ce programme</SelectItem>
                ) : (
                  filteredStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.profile?.full_name || 'Nom non renseigné'} ({student.student_number})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {selectedProgram && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="program-overview" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Vue Programme
            </TabsTrigger>
            <TabsTrigger value="student-details" className="flex items-center gap-2" disabled={!selectedStudent}>
              <TrendingUp className="w-4 h-4" />
              Détails Étudiant
            </TabsTrigger>
            <TabsTrigger value="semester-details" className="flex items-center gap-2" disabled={!selectedStudent}>
              <Calculator className="w-4 h-4" />
              Détails Semestres
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2" disabled={!selectedStudent}>
              <FileText className="w-4 h-4" />
              Relevé de notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="program-overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Liste des étudiants - {selectedProgramData?.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {programStudentsData.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucun étudiant trouvé dans ce programme</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Étudiant</th>
                          <th className="text-center p-3 font-medium">N° Étudiant</th>
                          <th className="text-center p-3 font-medium">Semestre 1</th>
                          <th className="text-center p-3 font-medium">Semestre 2</th>
                          <th className="text-center p-3 font-medium">Moyenne Générale</th>
                          <th className="text-center p-3 font-medium">Mention</th>
                          <th className="text-center p-3 font-medium">Décision</th>
                          <th className="text-center p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      
                      <tbody>
                        {programStudentsData.map((student, index) => (
                          <tr key={student.id} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                            <td className="p-3 font-medium">
                              {student.profile?.full_name || 'Nom non renseigné'}
                            </td>
                            <td className="p-3 text-center">{student.student_number}</td>
                            <td className="p-3 text-center font-semibold">
                              {student.semester1Average.toFixed(2)}/20
                            </td>
                            <td className="p-3 text-center font-semibold">
                              {student.semester2Average.toFixed(2)}/20
                            </td>
                            <td className="p-3 text-center font-bold text-primary">
                              {student.generalAverage.toFixed(2)}/20
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={student.generalAverage >= 10 ? "default" : "destructive"}>
                                {student.mention}
                              </Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Badge variant={student.generalAverage >= 10 ? "default" : "destructive"}>
                                {student.decision}
                              </Badge>
                            </td>
                            <td className="p-3 text-center">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(student.id);
                                  setActiveTab('student-details');
                                }}
                              >
                                Voir détails
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="student-details">
            <div className="space-y-6">
              {/* Navigation de retour */}
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedStudent('');
                    setActiveTab('program-overview');
                  }}
                  className="flex items-center gap-2"
                >
                  ← Retour au programme
                </Button>
                <div>
                  <h3 className="text-lg font-semibold">
                    {students.find(s => s.id === selectedStudent)?.profile?.full_name || 'Étudiant'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {students.find(s => s.id === selectedStudent)?.student_number}
                  </p>
                </div>
              </div>

              {/* Cartes résumé améliorées */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calculator className="w-4 h-4" />
                      Moyenne Générale
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">
                      {generalAverage.toFixed(2)}/20
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={generalAverage >= 10 ? "default" : "destructive"}>
                        {getMention(generalAverage)}
                      </Badge>
                      <Badge variant={generalAverage >= 10 ? "default" : "destructive"}>
                        {getDecision(generalAverage)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Semestre 1
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {semester1Data ? `${semester1Data.semester_average.toFixed(2)}/20` : '--'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {semester1Data ? `${semester1Data.courses.length} cours` : 'Aucune donnée'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Semestre 2
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {semester2Data ? `${semester2Data.semester_average.toFixed(2)}/20` : '--'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {semester2Data ? `${semester2Data.courses.length} cours` : 'Aucune donnée'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-10 translate-x-10"></div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Coefficients Totaux
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">
                      {(semester1Data?.total_coefficients || 0) + (semester2Data?.total_coefficients || 0)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      S1: {semester1Data?.total_coefficients || 0} | S2: {semester2Data?.total_coefficients || 0}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Progression et statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Progression Semestrielle</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Semestre 1</span>
                          <span className="font-semibold">{semester1Data?.semester_average.toFixed(2) || 0}/20</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${((semester1Data?.semester_average || 0) / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Semestre 2</span>
                          <span className="font-semibold">{semester2Data?.semester_average.toFixed(2) || 0}/20</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${((semester2Data?.semester_average || 0) / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Moyenne Générale</span>
                          <span className="font-semibold">{generalAverage.toFixed(2)}/20</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full transition-all duration-300" 
                            style={{ width: `${(generalAverage / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition des Cours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Semestre 1</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {semester1Data?.courses.filter(c => c.nature === 'fondamentale').length || 0} Fond.
                          </Badge>
                          <Badge variant="secondary">
                            {semester1Data?.courses.filter(c => c.nature === 'complementaire').length || 0} Comp.
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Semestre 2</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">
                            {semester2Data?.courses.filter(c => c.nature === 'fondamentale').length || 0} Fond.
                          </Badge>
                          <Badge variant="secondary">
                            {semester2Data?.courses.filter(c => c.nature === 'complementaire').length || 0} Comp.
                          </Badge>
                        </div>
                      </div>
                      <div className="pt-3 border-t">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total des cours</span>
                          <span className="text-primary">
                            {(semester1Data?.courses.length || 0) + (semester2Data?.courses.length || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="semester-details">
            <div className="space-y-6">
              {/* Navigation de retour */}
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedStudent('');
                    setActiveTab('program-overview');
                  }}
                  className="flex items-center gap-2"
                >
                  ← Retour au programme
                </Button>
                <div>
                  <h3 className="text-lg font-semibold">
                    Détails par semestre - {students.find(s => s.id === selectedStudent)?.profile?.full_name || 'Étudiant'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Calculs détaillés des moyennes selon la formule : Moyenne = ((CC × 0,4) + (EX × 0,6)) / 2
                  </p>
                </div>
              </div>

              {semester1Data && (
                <SemesterSummaryCard 
                  semesterData={semester1Data}
                  title="Semestre 1"
                />
              )}
              
              {semester2Data && (
                <SemesterSummaryCard 
                  semesterData={semester2Data}
                  title="Semestre 2"
                />
              )}

              {!semester1Data && !semester2Data && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calculator className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Aucune donnée disponible</h3>
                    <p className="text-muted-foreground">
                      Aucune note n'a été trouvée pour cet étudiant.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="transcript">
            <div className="space-y-6">
              {/* Navigation de retour */}
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedStudent('');
                    setActiveTab('program-overview');
                  }}
                  className="flex items-center gap-2"
                >
                  ← Retour au programme
                </Button>
              </div>

              <TranscriptPreview 
                studentId={selectedStudent}
                semester1Data={semester1Data}
                semester2Data={semester2Data}
                generalAverage={generalAverage}
              />
            </div>
          </TabsContent>
        </Tabs>
      )}

      {!selectedProgram && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sélectionnez un programme</h3>
            <p className="text-muted-foreground">
              Choisissez un programme pour voir la liste des étudiants et leurs calculs de moyennes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}