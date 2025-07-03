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
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [semester1Data, setSemester1Data] = useState<SemesterCalculation | null>(null);
  const [semester2Data, setSemester2Data] = useState<SemesterCalculation | null>(null);
  const [generalAverage, setGeneralAverage] = useState<number>(0);

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
      {selectedStudent && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Détails par semestre
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relevé de notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary Cards */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Moyenne Générale
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {generalAverage.toFixed(2)}/20
                  </div>
                  <Badge variant={generalAverage >= 10 ? "default" : "destructive"} className="mt-2">
                    {getMention(generalAverage)}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Semestre 1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {semester1Data ? `${semester1Data.semester_average.toFixed(2)}/20` : '--'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {semester1Data ? `${semester1Data.courses.length} cours` : 'Aucune donnée'}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Semestre 2
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {semester2Data ? `${semester2Data.semester_average.toFixed(2)}/20` : '--'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {semester2Data ? `${semester2Data.courses.length} cours` : 'Aucune donnée'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Decision Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Décision du Jury
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">
                      {getDecision(generalAverage)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Mention: {getMention(generalAverage)}
                    </p>
                  </div>
                  <Badge 
                    variant={generalAverage >= 10 ? "default" : "destructive"}
                    className="text-lg px-4 py-2"
                  >
                    {generalAverage.toFixed(2)}/20
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <div className="space-y-6">
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
            </div>
          </TabsContent>

          <TabsContent value="transcript">
            <TranscriptPreview 
              studentId={selectedStudent}
              semester1Data={semester1Data}
              semester2Data={semester2Data}
              generalAverage={generalAverage}
            />
          </TabsContent>
        </Tabs>
      )}

      {!selectedStudent && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Sélectionnez un étudiant</h3>
            <p className="text-muted-foreground">
              Choisissez un programme et un étudiant pour voir les calculs et générer le relevé de notes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}