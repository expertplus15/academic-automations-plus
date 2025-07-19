
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap, Users, TrendingUp, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { DUT2GEGradingEngine, DUT2GE_GRADING_CONFIG } from '@/config/GradingRulesDUT2GE';
import { useSemesterGrades } from '@/hooks/useSemesterGrades';
import { useAcademicYear } from '@/hooks/useAcademicYear';
import { useToast } from '@/hooks/use-toast';

interface StudentResult {
  id: string;
  studentNumber: string;
  fullName: string;
  subjectAverages: Record<string, number>;
  semester3Average: number | null;
  semester4Average: number | null;
  generalAverage: number | null;
  mention: string;
  decision: string;
  hasCompensation: boolean;
}

interface DeliberationStats {
  totalStudents: number;
  admis: number;
  ajournes: number;
  tauxReussite: number;
  moyenneGeneral: number;
  mentions: Record<string, number>;
  matieresDifficiles: Array<{ name: string; average: number }>;
}

export function DeliberationPanel() {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [studentResults, setStudentResults] = useState<StudentResult[]>([]);
  const [stats, setStats] = useState<DeliberationStats | null>(null);
  const [validationStatus, setValidationStatus] = useState<'pending' | 'validated' | 'published'>('pending');
  const [deliberationNotes, setDeliberationNotes] = useState<string>('');

  const { getSemesterGrades, loading } = useSemesterGrades();
  const { currentYear } = useAcademicYear();
  const { toast } = useToast();
  const gradingEngine = new DUT2GEGradingEngine();

  // Load and calculate results
  useEffect(() => {
    const loadResults = async () => {
      if (!selectedProgram || !currentYear?.id) return;

      // Get semester 3 data
      const semester3Data = await getSemesterGrades(selectedProgram, selectedGroup, 3, currentYear.id);
      // Get semester 4 data
      const semester4Data = await getSemesterGrades(selectedProgram, selectedGroup, 4, currentYear.id);

      // Merge and calculate results
      const allStudents = new Map();
      
      // Process semester 3 data
      semester3Data.forEach(student => {
        allStudents.set(student.id, {
          id: student.id,
          studentNumber: student.student_number,
          fullName: student.full_name,
          semester3Subjects: student.subjects,
          semester4Subjects: {}
        });
      });

      // Process semester 4 data
      semester4Data.forEach(student => {
        if (allStudents.has(student.id)) {
          allStudents.get(student.id).semester4Subjects = student.subjects;
        } else {
          allStudents.set(student.id, {
            id: student.id,
            studentNumber: student.student_number,
            fullName: student.full_name,
            semester3Subjects: {},
            semester4Subjects: student.subjects
          });
        }
      });

      // Calculate final results for each student
      const results: StudentResult[] = [];
      const subjectAverages: Record<string, number[]> = {};

      allStudents.forEach(student => {
        const grades: Record<string, { cc: number | null; exam: number | null }> = {};
        
        // Combine grades from both semesters
        const allSubjects = { ...student.semester3Subjects, ...student.semester4Subjects };
        Object.entries(allSubjects).forEach(([subjectId, subjectData]: [string, any]) => {
          grades[subjectId] = {
            cc: subjectData.cc,
            exam: subjectData.ef
          };
          
          // Track subject averages for stats
          if (subjectData.moyenne !== null) {
            if (!subjectAverages[subjectId]) subjectAverages[subjectId] = [];
            subjectAverages[subjectId].push(subjectData.moyenne);
          }
        });

        const result = gradingEngine.calculateStudentResults(grades);
        
        results.push({
          id: student.id,
          studentNumber: student.studentNumber,
          fullName: student.fullName,
          subjectAverages: result.subjectAverages,
          semester3Average: result.semester3Average,
          semester4Average: result.semester4Average,
          generalAverage: result.generalAverage,
          mention: result.mention,
          decision: result.decision,
          hasCompensation: result.hasCompensation
        });
      });

      setStudentResults(results);

      // Calculate statistics
      const totalStudents = results.length;
      const admis = results.filter(r => r.decision === 'ADMIS').length;
      const ajournes = totalStudents - admis;
      const validAverages = results.filter(r => r.generalAverage !== null).map(r => r.generalAverage!);
      const moyenneGeneral = validAverages.length > 0 ? 
        validAverages.reduce((sum, avg) => sum + avg, 0) / validAverages.length : 0;

      const mentions: Record<string, number> = {};
      results.forEach(r => {
        mentions[r.mention] = (mentions[r.mention] || 0) + 1;
      });

      // Find difficult subjects
      const matieresDifficiles = Object.entries(subjectAverages)
        .map(([subjectId, averages]) => {
          const subject = DUT2GE_GRADING_CONFIG.subjects.find(s => s.id === subjectId);
          return {
            name: subject?.name || subjectId,
            average: averages.reduce((sum, avg) => sum + avg, 0) / averages.length
          };
        })
        .filter(subject => subject.average < 12)
        .sort((a, b) => a.average - b.average)
        .slice(0, 3);

      setStats({
        totalStudents,
        admis,
        ajournes,
        tauxReussite: totalStudents > 0 ? (admis / totalStudents) * 100 : 0,
        moyenneGeneral,
        mentions,
        matieresDifficiles
      });
    };

    loadResults();
  }, [selectedProgram, selectedGroup, currentYear?.id, getSemesterGrades]);

  const handleValidation = async () => {
    try {
      // Here you would typically save the deliberation results to the database
      setValidationStatus('validated');
      toast({
        title: 'Délibération validée',
        description: 'Les résultats ont été validés avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de valider la délibération',
        variant: 'destructive',
      });
    }
  };

  const generatePV = async () => {
    try {
      // Generate official PV document
      const pvData = {
        academicYear: currentYear?.name,
        program: 'DUT Gestion des Entreprises',
        level: 'DUT2',
        deliberationDate: new Date().toLocaleDateString('fr-FR'),
        studentResults,
        stats,
        notes: deliberationNotes
      };

      // Here you would generate the actual PDF document
      console.log('PV Data:', pvData);
      
      toast({
        title: 'PV généré',
        description: 'Le procès-verbal de délibération a été généré',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le PV',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Délibération - Session Finale
          </CardTitle>
          <CardDescription>
            Validation des résultats et génération du procès-verbal de délibération
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Programme</label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le programme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dut2-ge">DUT2 Gestion des Entreprises</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Année académique</label>
              <Select value={currentYear?.id || ''} disabled>
                <SelectTrigger>
                  <SelectValue placeholder={currentYear?.name || 'Aucune année active'} />
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {stats && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="results">Résultats détaillés</TabsTrigger>
            <TabsTrigger value="analytics">Statistiques</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
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
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.admis}</div>
                      <div className="text-sm text-muted-foreground">Admis</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-2xl font-bold text-red-600">{stats.ajournes}</div>
                      <div className="text-sm text-muted-foreground">Ajournés</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="text-2xl font-bold">{stats.tauxReussite.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Taux réussite</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Répartition des mentions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.mentions).map(([mention, count]) => (
                      <div key={mention} className="flex justify-between items-center">
                        <span className="text-sm">{mention}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Matières en difficulté</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.matieresDifficiles.map((matiere, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{matiere.name}</span>
                        <Badge variant="destructive">{matiere.average.toFixed(1)}/20</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Résultats individuels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Matricule</th>
                        <th className="text-left p-2">Nom</th>
                        <th className="text-center p-2">S3</th>
                        <th className="text-center p-2">S4</th>
                        <th className="text-center p-2">Moyenne</th>
                        <th className="text-center p-2">Mention</th>
                        <th className="text-center p-2">Décision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentResults.map(student => (
                        <tr key={student.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-mono">{student.studentNumber}</td>
                          <td className="p-2">{student.fullName}</td>
                          <td className="p-2 text-center">
                            {student.semester3Average?.toFixed(2) || '-'}
                          </td>
                          <td className="p-2 text-center">
                            {student.semester4Average?.toFixed(2) || '-'}
                          </td>
                          <td className="p-2 text-center font-medium">
                            {student.generalAverage?.toFixed(2) || '-'}
                          </td>
                          <td className="p-2 text-center">
                            <Badge variant={
                              student.mention === 'TRÈS BIEN' ? 'default' :
                              student.mention === 'BIEN' ? 'secondary' :
                              student.mention === 'ASSEZ-BIEN' ? 'outline' :
                              student.mention === 'PASSABLE' ? 'outline' : 'destructive'
                            }>
                              {student.mention}
                            </Badge>
                          </td>
                          <td className="p-2 text-center">
                            <Badge variant={student.decision === 'ADMIS' ? 'default' : 'destructive'}>
                              {student.decision}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{stats.moyenneGeneral.toFixed(2)}/20</div>
                  <div className="text-sm text-muted-foreground">Moyenne générale promotion</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">
                    {((stats.mentions['TRÈS BIEN'] || 0) + (stats.mentions['BIEN'] || 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">Mentions Bien et Très Bien</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">{stats.matieresDifficiles.length}</div>
                  <div className="text-sm text-muted-foreground">Matières en difficulté</div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Analyse de la session</div>
                <ul className="text-sm space-y-1">
                  <li>• Taux de réussite de {stats.tauxReussite.toFixed(1)}% conforme aux objectifs</li>
                  <li>• Moyenne générale de {stats.moyenneGeneral.toFixed(2)}/20 satisfaisante</li>
                  <li>• {stats.matieresDifficiles.length} matière(s) nécessitent un suivi pédagogique</li>
                  <li>• {Object.values(stats.mentions).reduce((sum, count) => sum + count, 0)} étudiants évalués</li>
                </ul>
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="validation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notes de délibération</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Observations du jury, recommandations, cas particuliers..."
                  value={deliberationNotes}
                  onChange={(e) => setDeliberationNotes(e.target.value)}
                  rows={6}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={generatePV}>
                <FileText className="h-4 w-4 mr-2" />
                Générer PV
              </Button>
              <Button onClick={handleValidation} disabled={validationStatus === 'validated'}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {validationStatus === 'validated' ? 'Validé' : 'Valider la délibération'}
              </Button>
            </div>

            {validationStatus === 'validated' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Délibération validée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
