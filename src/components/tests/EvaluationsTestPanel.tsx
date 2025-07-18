import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, Clock, Download, Play, RotateCcw, Users, BookOpen, FileSpreadsheet, Award } from 'lucide-react';
import { evaluationsTestSuite, EvaluationTestReport, EvaluationTestScenario } from '@/utils/evaluationsTestSuite';
import { dutgeTestDataGenerator } from '@/utils/DUTGETestDataGenerator';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface EvaluationsTestPanelProps {
  className?: string;
}

export function EvaluationsTestPanel({ className }: EvaluationsTestPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentReport, setCurrentReport] = useState<EvaluationTestReport | null>(null);
  const [scenarios, setScenarios] = useState<EvaluationTestScenario[]>(
    evaluationsTestSuite.getTestScenarios()
  );
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Exécuter tous les tests
  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentScenario('scenario-configuration');
    
    try {
      const report = await evaluationsTestSuite.runCompleteTestSuite();
      setCurrentReport(report);
      setProgress(100);
      
      toast({
        title: 'Tests Évaluations & Résultats Terminés',
        description: `${report.passedTests}/${report.totalTests} tests réussis`,
        variant: report.passRate >= 80 ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: 'Erreur lors des tests',
        description: 'Une erreur est survenue pendant l\'exécution des tests',
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      setCurrentScenario(null);
    }
  }, []);

  // Exécuter un scénario spécifique
  const runSingleScenario = useCallback(async (scenarioId: string) => {
    setIsRunning(true);
    setCurrentScenario(scenarioId);
    
    try {
      let result;
      switch (scenarioId) {
        case 'scenario-configuration':
          result = await evaluationsTestSuite.runConfigurationScenario();
          break;
        case 'scenario-students':
          result = await evaluationsTestSuite.runStudentsScenario();
          break;
        case 'scenario-grades':
          result = await evaluationsTestSuite.runGradesScenario();
          break;
        default:
          throw new Error(`Scénario ${scenarioId} non implémenté`);
      }
      
      // Mettre à jour le statut du scénario
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId 
          ? { ...s, status: result.success ? 'passed' : 'failed', duration: result.duration }
          : s
      ));
      
      toast({
        title: `Scénario ${scenarioId}`,
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId 
          ? { ...s, status: 'failed' }
          : s
      ));
    } finally {
      setIsRunning(false);
      setCurrentScenario(null);
    }
  }, []);

  // Générer et télécharger les fichiers de test
  const downloadTestFiles = useCallback(() => {
    try {
      // Générer le fichier CSV des étudiants
      const studentsCSV = dutgeTestDataGenerator.generateStudentImportCSV();
      const studentsBlob = new Blob([studentsCSV], { type: 'text/csv' });
      const studentsUrl = URL.createObjectURL(studentsBlob);
      const studentsLink = document.createElement('a');
      studentsLink.href = studentsUrl;
      studentsLink.download = 'Import_Etudiants_DUTGE.csv';
      studentsLink.click();
      
      // Générer les fichiers de notes
      const gradesData = dutgeTestDataGenerator.generateGradesImportData();
      gradesData.forEach(({ matiere, data }) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Notes_${matiere.replace(/\s+/g, '_')}.csv`;
        link.click();
      });
      
      toast({
        title: 'Fichiers de test générés',
        description: 'Les fichiers CSV ont été téléchargés avec succès'
      });
    } catch (error) {
      toast({
        title: 'Erreur de génération',
        description: 'Impossible de générer les fichiers de test',
        variant: "destructive"
      });
    }
  }, []);

  const resetTests = useCallback(() => {
    setCurrentReport(null);
    setScenarios(evaluationsTestSuite.getTestScenarios());
    setProgress(0);
    setCurrentScenario(null);
  }, []);

  const getScenarioIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'passed': return 'default';
      case 'failed': return 'destructive';
      case 'running': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* En-tête */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Tests Module Évaluations & Résultats
          </CardTitle>
          <CardDescription>
            Suite complète de tests pour valider le workflow DUTGE (Gestion des Entreprises)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunning ? 'Tests en cours...' : 'Lancer tous les tests'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={downloadTestFiles}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger fichiers test
            </Button>
            
            <Button 
              variant="outline" 
              onClick={resetTests}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
          
          {isRunning && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progression des tests</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              {currentScenario && (
                <p className="text-sm text-muted-foreground">
                  Scénario en cours: {scenarios.find(s => s.id === currentScenario)?.name}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Scénarios de Test</TabsTrigger>
          <TabsTrigger value="report">Rapport Détaillé</TabsTrigger>
          <TabsTrigger value="data">Données Générées</TabsTrigger>
        </TabsList>

        {/* Onglet Scénarios */}
        <TabsContent value="scenarios" className="space-y-4">
          <div className="grid gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getScenarioIcon(scenario.status)}
                      {scenario.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusBadgeVariant(scenario.status)}>
                        {scenario.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => runSingleScenario(scenario.id)}
                        disabled={isRunning}
                      >
                        Tester
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <ul className="space-y-1 text-sm">
                      {scenario.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground">{index + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                  {scenario.duration && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Durée: {scenario.duration}ms
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Rapport */}
        <TabsContent value="report" className="space-y-4">
          {currentReport ? (
            <div className="grid gap-4">
              {/* Résumé du rapport */}
              <Card>
                <CardHeader>
                  <CardTitle>Résumé d'Exécution</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentReport.passedTests}
                    </div>
                    <div className="text-sm text-muted-foreground">Tests réussis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {currentReport.failedTests}
                    </div>
                    <div className="text-sm text-muted-foreground">Tests échoués</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentReport.passRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Taux de réussite</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentReport.totalDuration}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Durée totale</div>
                  </div>
                </CardContent>
              </Card>

              {/* Métriques de performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques de Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Configuration</div>
                      <div className="text-muted-foreground">
                        {currentReport.performanceMetrics.configurationTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Import Données</div>
                      <div className="text-muted-foreground">
                        {currentReport.performanceMetrics.dataImportTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Saisie Notes</div>
                      <div className="text-muted-foreground">
                        {currentReport.performanceMetrics.gradeEntryTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Calculs</div>
                      <div className="text-muted-foreground">
                        {currentReport.performanceMetrics.calculationTime}ms
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Documents</div>
                      <div className="text-muted-foreground">
                        {currentReport.performanceMetrics.documentGenerationTime}ms
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommandations */}
              {currentReport.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recommandations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentReport.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Aucun rapport disponible. Lancez d'abord les tests.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Onglet Données */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Étudiants DUTGE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">60</div>
                <div className="text-sm text-muted-foreground">
                  Répartis en 2 classes de 30
                </div>
                <div className="mt-2 text-sm">
                  • DUTGE2-A: 30 étudiants<br />
                  • DUTGE2-B: 30 étudiants
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Matières S3
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">
                  Matières du semestre 3
                </div>
                <div className="mt-2 text-sm">
                  • 4 Fondamentales<br />
                  • 3 Complémentaires<br />
                  • 1 Pratique (Stage)
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Notes Générées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">480</div>
                <div className="text-sm text-muted-foreground">
                  Entrées de notes (60×8)
                </div>
                <div className="mt-2 text-sm">
                  • CC1, CC2, TD, TP<br />
                  • Examens finaux<br />
                  • Profils diversifiés
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détail des Matières DUTGE S3</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {dutgeTestDataGenerator.generateMatieres().map((matiere, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{matiere.intitule}</div>
                          <div className="text-sm text-muted-foreground">
                            {matiere.code} • {matiere.enseignant}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div>Coeff. {matiere.coefficient} • {matiere.ects} ECTS</div>
                          <div className="text-muted-foreground">
                            CM: {matiere.volumeHoraire.cm}h | TD: {matiere.volumeHoraire.td}h | TP: {matiere.volumeHoraire.tp}h
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}