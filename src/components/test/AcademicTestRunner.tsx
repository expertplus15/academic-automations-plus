import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, RotateCcw, FileText } from 'lucide-react';
import { runAcademicModuleTests, AcademicTestResult } from '@/utils/academicModuleTests';

export default function AcademicTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<AcademicTestResult[]>([]);
  const [progress, setProgress] = useState(0);

  const handleRunTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    try {
      const testResults = await runAcademicModuleTests();
      setResults(testResults);
      setProgress(100);
    } catch (error) {
      console.error('Erreur lors de l\'exécution des tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearResults = () => {
    setResults([]);
    setProgress(0);
  };

  const getStats = () => {
    const total = results.length;
    const passed = results.filter(r => r.success).length;
    const failed = total - passed;
    const criticalFailures = results.filter(r => !r.success && r.severity === 'critical').length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return { total, passed, failed, criticalFailures, passRate };
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'major': return 'secondary';
      case 'minor': return 'outline';
      default: return 'default';
    }
  };

  const getSuccessVariant = (success: boolean) => {
    return success ? 'default' : 'destructive';
  };

  const groupedResults = results.reduce((acc, result) => {
    const section = result.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(result);
    return acc;
  }, {} as Record<string, AcademicTestResult[]>);

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🧪 Tests Module Gestion Académique</h1>
          <p className="text-muted-foreground mt-2">
            Suite de tests QA pour valider toutes les fonctionnalités du module académique
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleRunTests}
            disabled={isRunning}
            className="gap-2"
            size="lg"
          >
            <PlayCircle className="h-4 w-4" />
            {isRunning ? 'Tests en cours...' : 'Lancer les Tests'}
          </Button>
          
          {results.length > 0 && (
            <Button
              onClick={handleClearResults}
              variant="outline"
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {/* Barre de progression */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exécution des tests...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques globales */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Tests Total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
              <p className="text-xs text-muted-foreground">Réussis</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">Échoués</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.criticalFailures}</div>
              <p className="text-xs text-muted-foreground">Bugs Critiques</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.passRate}%</div>
              <p className="text-xs text-muted-foreground">Taux de Réussite</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statut de validation */}
      {results.length > 0 && (
        <Card className={stats.criticalFailures === 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className={`text-xl font-bold ${stats.criticalFailures === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.criticalFailures === 0 ? '✅ MODULE VALIDÉ' : '❌ MODULE NON VALIDÉ'}
              </div>
              {stats.criticalFailures > 0 && (
                <Badge variant="destructive">
                  {stats.criticalFailures} bugs critiques détectés
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Résultats détaillés par section */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rapport Détaillé par Section
          </h2>
          
          {Object.entries(groupedResults).map(([section, sectionResults]) => {
            const sectionPassed = sectionResults.filter(r => r.success).length;
            const sectionTotal = sectionResults.length;
            const sectionCritical = sectionResults.filter(r => !r.success && r.severity === 'critical').length;
            
            return (
              <Card key={section}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {section}
                      <Badge variant={sectionCritical > 0 ? "destructive" : "default"}>
                        {sectionPassed}/{sectionTotal}
                      </Badge>
                    </CardTitle>
                    {sectionCritical > 0 && (
                      <Badge variant="destructive">
                        {sectionCritical} critique(s)
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Tests de la section {section} - {Math.round((sectionPassed / sectionTotal) * 100)}% de réussite
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {sectionResults.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            result.success 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={result.success ? 'text-green-600' : 'text-red-600'}>
                                {result.success ? '✅' : '❌'}
                              </span>
                              <span className="font-medium text-sm">
                                {result.testId} - {result.message.replace(/^[✅❌]\s*/, '')}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge variant={getSeverityVariant(result.severity)} className="text-xs">
                                {result.severity}
                              </Badge>
                              {result.duration && (
                                <span className="text-xs text-muted-foreground">
                                  {result.duration}ms
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {result.details && !result.success && (
                            <div className="mt-2 text-xs text-muted-foreground bg-white p-2 rounded border">
                              <strong>Détails:</strong> {JSON.stringify(result.details, null, 2)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Instructions d'utilisation */}
      {results.length === 0 && !isRunning && (
        <Card>
          <CardHeader>
            <CardTitle>📋 Instructions de Test</CardTitle>
            <CardDescription>
              Suite de tests automatisés pour valider le module de Gestion Académique
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">🔍 Tests inclus :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Navigation et affichage des pages</li>
                  <li>• Opérations CRUD (Création, Lecture, Mise à jour, Suppression)</li>
                  <li>• Connectivité base de données</li>
                  <li>• Validation des données</li>
                  <li>• Performance et temps de chargement</li>
                  <li>• Fonctionnalités Import/Export</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">📊 Critères de validation :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• <Badge variant="destructive" className="text-xs">Critique</Badge> : Fonctionnalité essentielle</li>
                  <li>• <Badge variant="secondary" className="text-xs">Majeur</Badge> : Fonctionnalité importante</li>
                  <li>• <Badge variant="outline" className="text-xs">Mineur</Badge> : Amélioration UX</li>
                  <li>• ✅ Module validé si 0 bug critique</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note :</strong> Ces tests valident les fonctionnalités selon la procédure QA définie. 
                Cliquez sur "Lancer les Tests" pour commencer l'évaluation complète du module.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}