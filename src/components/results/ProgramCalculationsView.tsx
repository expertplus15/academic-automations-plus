import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calculator, 
  FileText, 
  Users,
  TrendingUp
} from 'lucide-react';
import { usePrograms } from '@/hooks/usePrograms';
import { useAcademicYears } from '@/hooks/useAcademicYears';
import { useGradeCalculations, SemesterCalculation } from '@/hooks/useGradeCalculations';
import { useStudents } from '@/hooks/useStudents';
import { SemesterSummaryCard } from './SemesterSummaryCard';
import { TranscriptPreview } from './TranscriptPreview';
import { ProgramStudentsTable } from './ProgramStudentsTable';
import { StudentDetailsCards } from './StudentDetailsCards';
import { StudentProgressCharts } from './StudentProgressCharts';
import { NavigationHeader } from './NavigationHeader';

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
      if (!selectedProgram || !currentYear || filteredStudents.length === 0) {
        setProgramStudentsData([]);
        return;
      }

      try {
        const studentsWithAverages = await Promise.all(
          filteredStudents.map(async (student) => {
            try {
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
            } catch (error) {
              console.error(`Erreur pour l'étudiant ${student.id}:`, error);
              return {
                ...student,
                semester1Average: 0,
                semester2Average: 0,
                generalAverage: 0,
                mention: "Non calculé",
                decision: "Non déterminé"
              };
            }
          })
        );
        
        setProgramStudentsData(studentsWithAverages);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du programme",
          variant: "destructive",
        });
        setProgramStudentsData([]);
      }
    };

    loadProgramStudentsData();
  }, [selectedProgram, currentYear, filteredStudents, calculateSemesterCalculations, calculateGeneralAverage, toast]);

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudent(studentId);
    setActiveTab('student-details');
  };

  const handleBackToProgram = () => {
    setSelectedStudent('');
    setActiveTab('program-overview');
  };

  const selectedStudentData = students.find(s => s.id === selectedStudent);

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
                  <>
                    <SelectItem value="all">Tous les étudiants</SelectItem>
                    {filteredStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.profile?.full_name || 'Nom non renseigné'} ({student.student_number})
                      </SelectItem>
                    ))}
                  </>
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
                <ProgramStudentsTable 
                  students={programStudentsData}
                  onSelectStudent={handleSelectStudent}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="student-details">
            <div className="space-y-6">
              <NavigationHeader
                onBack={handleBackToProgram}
                title={selectedStudentData?.profile?.full_name || 'Étudiant'}
                subtitle={selectedStudentData?.student_number}
              />

              <StudentDetailsCards
                generalAverage={generalAverage}
                semester1Data={semester1Data}
                semester2Data={semester2Data}
                getMention={getMention}
                getDecision={getDecision}
              />

              <StudentProgressCharts
                semester1Data={semester1Data}
                semester2Data={semester2Data}
                generalAverage={generalAverage}
              />
            </div>
          </TabsContent>

          <TabsContent value="semester-details">
            <div className="space-y-6">
              <NavigationHeader
                onBack={handleBackToProgram}
                title={`Détails par semestre - ${selectedStudentData?.profile?.full_name || 'Étudiant'}`}
                subtitle="Calculs détaillés des moyennes selon la formule : Moyenne = ((CC × 0,4) + (EX × 0,6)) / 2"
              />

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
              <NavigationHeader
                onBack={handleBackToProgram}
                title="Relevé de notes"
              />

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