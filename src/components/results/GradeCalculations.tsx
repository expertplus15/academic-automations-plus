import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Award, BookOpen, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { DropdownRecalculate } from './DropdownRecalculate';
import { useToast } from '@/hooks/use-toast';
import { NavigationQuickLinks } from './NavigationQuickLinks';
import { MoteurCalculAcademique, DEFAULT_GRADING_CONFIG } from '@/lib/gradingEngine';

interface StudentResult {
  id: string;
  studentNumber: string;
  fullName: string;
  subjects: Array<{
    id: string;
    name: string;
    cc: number;
    examen: number;
    moyenne: number;
    coefficient: number;
    total: number;
    mention: string;
    ects: number;
  }>;
  moyenneGenerale: number;
  mentionGenerale: string;
  ectsObtenus: number;
  ectsTotal: number;
  decision: string;
  compensation: boolean;
}

export function GradeCalculations() {
  const [students, setStudents] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<Date | null>(null);
  const { toast } = useToast();
  const gradingEngine = new MoteurCalculAcademique(DEFAULT_GRADING_CONFIG);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: StudentResult[] = [
      {
        id: '1',
        studentNumber: 'ETU001',
        fullName: 'Alice Martin',
        subjects: [
          { id: '1', name: 'Mathématiques', cc: 15, examen: 16, moyenne: 15.4, coefficient: 3, total: 46.2, mention: 'Bien', ects: 6 },
          { id: '2', name: 'Physique', cc: 12, examen: 14, moyenne: 13.2, coefficient: 2, total: 26.4, mention: 'Assez Bien', ects: 4 },
          { id: '3', name: 'Chimie', cc: 18, examen: 17, moyenne: 17.4, coefficient: 2, total: 34.8, mention: 'Très Bien', ects: 4 }
        ],
        moyenneGenerale: 15.34,
        mentionGenerale: 'Bien',
        ectsObtenus: 14,
        ectsTotal: 14,
        decision: 'ADMIS',
        compensation: false
      },
      {
        id: '2',
        studentNumber: 'ETU002', 
        fullName: 'Bob Dupont',
        subjects: [
          { id: '1', name: 'Mathématiques', cc: 8, examen: 11, moyenne: 9.8, coefficient: 3, total: 29.4, mention: 'Ajourné', ects: 0 },
          { id: '2', name: 'Physique', cc: 12, examen: 13, moyenne: 12.6, coefficient: 2, total: 25.2, mention: 'Assez Bien', ects: 4 },
          { id: '3', name: 'Chimie', cc: 14, examen: 15, moyenne: 14.6, coefficient: 2, total: 29.2, mention: 'Bien', ects: 4 }
        ],
        moyenneGenerale: 12.05,
        mentionGenerale: 'Passable',
        ectsObtenus: 8,
        ectsTotal: 14,
        decision: 'ADMIS',
        compensation: true
      }
    ];
    setStudents(mockData);
  }, []);

  const handleRecalculateAll = async () => {
    setLoading(true);
    try {
      // Simulate calculation time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastCalculation(new Date());
      toast({
        title: "Calculs terminés",
        description: `${students.length} dossiers étudiants recalculés avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de recalculer les moyennes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    return decision === 'ADMIS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
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

  const globalStats = {
    totalStudents: students.length,
    admitted: students.filter(s => s.decision === 'ADMIS').length,
    averageGrade: students.reduce((sum, s) => sum + s.moyenneGenerale, 0) / students.length,
    ectsCompletion: students.reduce((sum, s) => sum + (s.ectsObtenus / s.ectsTotal * 100), 0) / students.length,
    compensationCount: students.filter(s => s.compensation).length
  };

  return (
    <div className="space-y-6">
      {/* Navigation fluide */}
      <NavigationQuickLinks currentContext="results" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Calculs & Moyennes</h2>
          <p className="text-muted-foreground">Moyennes automatiques, ECTS, compensations et mentions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={loading}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Valider Résultats
          </Button>
          <DropdownRecalculate
            variant="default"
            size="sm"
            disabled={loading}
            onCalculationComplete={(type, success) => {
              if (success) {
                setLastCalculation(new Date());
              }
            }}
          />
        </div>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{globalStats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Étudiants</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{globalStats.admitted}</div>
                <div className="text-sm text-muted-foreground">Admis</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{globalStats.averageGrade.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">Moyenne</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{globalStats.ectsCompletion.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">ECTS</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold text-orange-600">{globalStats.compensationCount}</div>
                <div className="text-sm text-muted-foreground">Compensations</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="results">Résultats Détaillés</TabsTrigger>
          <TabsTrigger value="subjects">Par Matière</TabsTrigger>
          <TabsTrigger value="ects">Crédits ECTS</TabsTrigger>
        </TabsList>

        {/* Detailed Results */}
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Résultats par Étudiant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{student.fullName}</h3>
                        <p className="text-sm text-muted-foreground">N° {student.studentNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDecisionColor(student.decision)}>
                          {student.decision}
                        </Badge>
                        {student.compensation && (
                          <Badge variant="outline" className="text-orange-600">
                            Compensation
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted/50 rounded">
                        <div className="text-xl font-bold text-primary">{student.moyenneGenerale.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">Moyenne Générale</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded">
                        <Badge className={getMentionColor(student.mentionGenerale)}>
                          {student.mentionGenerale}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">Mention</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded">
                        <div className="text-xl font-bold text-purple-600">
                          {student.ectsObtenus}/{student.ectsTotal}
                        </div>
                        <div className="text-sm text-muted-foreground">ECTS</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded">
                        <Progress 
                          value={(student.ectsObtenus / student.ectsTotal) * 100} 
                          className="h-2 mb-1"
                        />
                        <div className="text-sm text-muted-foreground">
                          {((student.ectsObtenus / student.ectsTotal) * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Matière</th>
                            <th className="text-center p-2">CC</th>
                            <th className="text-center p-2">Examen</th>
                            <th className="text-center p-2">Moyenne</th>
                            <th className="text-center p-2">Coef.</th>
                            <th className="text-center p-2">Total</th>
                            <th className="text-center p-2">ECTS</th>
                            <th className="text-center p-2">Mention</th>
                          </tr>
                        </thead>
                        <tbody>
                          {student.subjects.map((subject) => (
                            <tr key={subject.id} className="border-b">
                              <td className="p-2 font-medium">{subject.name}</td>
                              <td className="p-2 text-center">{subject.cc.toFixed(2)}</td>
                              <td className="p-2 text-center">{subject.examen.toFixed(2)}</td>
                              <td className="p-2 text-center font-semibold">{subject.moyenne.toFixed(2)}</td>
                              <td className="p-2 text-center">{subject.coefficient}</td>
                              <td className="p-2 text-center font-semibold">{subject.total.toFixed(2)}</td>
                              <td className="p-2 text-center">{subject.ects}</td>
                              <td className="p-2 text-center">
                                <Badge className={getMentionColor(subject.mention)} variant="outline">
                                  {subject.mention}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Subject */}
        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques par Matière</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Mathématiques', 'Physique', 'Chimie'].map((subject) => {
                  const subjectGrades = students.flatMap(s => 
                    s.subjects.filter(sub => sub.name === subject)
                  );
                  const average = subjectGrades.reduce((sum, g) => sum + g.moyenne, 0) / subjectGrades.length;
                  const passRate = (subjectGrades.filter(g => g.moyenne >= 10).length / subjectGrades.length) * 100;
                  
                  return (
                    <div key={subject} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{subject}</h3>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Moyenne: <span className="font-semibold text-foreground">{average.toFixed(2)}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Réussite: <span className="font-semibold text-green-600">{passRate.toFixed(0)}%</span>
                          </span>
                        </div>
                      </div>
                      <Progress value={passRate} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ECTS Credits */}
        <TabsContent value="ects">
          <Card>
            <CardHeader>
              <CardTitle>Validation des Crédits ECTS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{student.fullName}</h3>
                      <p className="text-sm text-muted-foreground">N° {student.studentNumber}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{student.ectsObtenus}/{student.ectsTotal}</div>
                        <div className="text-sm text-muted-foreground">ECTS</div>
                      </div>
                      <Progress 
                        value={(student.ectsObtenus / student.ectsTotal) * 100} 
                        className="w-32 h-2"
                      />
                      <Badge className={student.ectsObtenus === student.ectsTotal ? 
                        'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                        {student.ectsObtenus === student.ectsTotal ? 'Validé' : 'Partiel'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {lastCalculation && (
        <div className="text-sm text-muted-foreground text-center">
          Derniers calculs effectués le {lastCalculation.toLocaleString()}
        </div>
      )}
    </div>
  );
}