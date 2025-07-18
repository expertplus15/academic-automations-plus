import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, Clock, Download, Play, RotateCcw, TestTube, Award, BarChart3 } from 'lucide-react';
import { useEnhancedModuleTests, TestSuite, TestReport } from '@/hooks/useEnhancedModuleTests';
import { EvaluationsTestPanel } from './EvaluationsTestPanel';
import { cn } from '@/lib/utils';

interface EnhancedTestsPanelProps {
  className?: string;
}

export function EnhancedTestsPanel({ className }: EnhancedTestsPanelProps) {
  const {
    testSuites,
    selectedSuites,
    isRunning,
    currentReport,
    reportHistory,
    selectSuite,
    selectAllSuites,
    deselectAllSuites,
    runSelectedTests,
    runAllTests,
    exportReport,
    clearHistory
  } = useEnhancedModuleTests();

  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('suites');

  // Simuler la progression des tests
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isRunning]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'idle': return <TestTube className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'running': return 'secondary';
      case 'idle': return 'outline';
      default: return 'destructive';
    }
  };

  const calculateOverallStats = () => {
    const allTests = testSuites.flatMap(suite => suite.tests);
    const totalTests = allTests.length;
    const passedTests = allTests.filter(test => test.status === 'passed').length;
    const failedTests = allTests.filter(test => test.status === 'failed').length;
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    return { totalTests, passedTests, failedTests, passRate };
  };

  const stats = calculateOverallStats();

  return (
    <div className={cn("space-y-6", className)}>
      {/* En-tête général */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Suite de Tests Complète
          </CardTitle>
          <CardDescription>
            Tests automatisés pour tous les modules de la plateforme
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
              onClick={runSelectedTests}
              disabled={isRunning || selectedSuites.size === 0}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Tests sélectionnés ({selectedSuites.size})
            </Button>
            
            {currentReport && (
              <Button 
                variant="outline" 
                onClick={exportReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter rapport
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={clearHistory}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
          
          {isRunning && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Progression globale</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Statistiques globales */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.totalTests}</div>
              <div className="text-sm text-muted-foreground">Total tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.passedTests}</div>
              <div className="text-sm text-muted-foreground">Réussis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failedTests}</div>
              <div className="text-sm text-muted-foreground">Échoués</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.passRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Taux réussite</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="suites">Suites de Tests</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations & Résultats</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Onglet Suites de Tests */}
        <TabsContent value="suites" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button size="sm" variant="outline" onClick={selectAllSuites}>
              Tout sélectionner
            </Button>
            <Button size="sm" variant="outline" onClick={deselectAllSuites}>
              Tout désélectionner
            </Button>
          </div>

          <div className="grid gap-4">
            {testSuites.map((suite) => (
              <Card key={suite.id} className="cursor-pointer hover:bg-accent/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSuites.has(suite.id)}
                        onChange={() => selectSuite(suite.id)}
                        className="rounded border-border"
                      />
                      {getStatusIcon(suite.status)}
                      {suite.name}
                    </div>
                    <Badge variant={getBadgeVariant(suite.status)}>
                      {suite.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {suite.tests.length} tests • Catégorie: {suite.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {suite.tests.map((test) => (
                        <div key={test.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(test.status)}
                            {test.name}
                          </div>
                          {test.duration && (
                            <span className="text-muted-foreground">{test.duration}ms</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Évaluations & Résultats */}
        <TabsContent value="evaluations" className="space-y-4">
          <EvaluationsTestPanel />
        </TabsContent>

        {/* Onglet Rapports */}
        <TabsContent value="reports" className="space-y-4">
          {currentReport ? (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Rapport d'Exécution Actuel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  </div>
                </CardContent>
              </Card>

              {/* Détails des suites */}
              {currentReport.suiteResults.map((suite) => (
                <Card key={suite.suiteId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {suite.suiteName}
                      <Badge variant={suite.status === 'passed' ? 'default' : 'destructive'}>
                        {suite.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Tests: {suite.totalTests}</div>
                        <div className="text-muted-foreground">
                          ✅ {suite.passedTests} • ❌ {suite.failedTests}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">Durée: {suite.duration}ms</div>
                        <div className="text-muted-foreground">Catégorie: {suite.category}</div>
                      </div>
                      <div>
                        {suite.criticalIssues.length > 0 && (
                          <div className="text-red-600">
                            {suite.criticalIssues.length} problème(s) critique(s)
                          </div>
                        )}
                        {suite.warnings.length > 0 && (
                          <div className="text-yellow-600">
                            {suite.warnings.length} avertissement(s)
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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

        {/* Onglet Historique */}
        <TabsContent value="history" className="space-y-4">
          {reportHistory.length > 0 ? (
            <div className="space-y-4">
              {reportHistory.map((report, index) => (
                <Card key={report.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Exécution #{reportHistory.length - index}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={report.passRate >= 80 ? 'default' : 'destructive'}>
                          {report.passRate.toFixed(1)}%
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(report.startTime).toLocaleString()}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Total: {report.totalTests}</div>
                        <div className="text-muted-foreground">tests</div>
                      </div>
                      <div>
                        <div className="font-medium text-green-600">✅ {report.passedTests}</div>
                        <div className="text-muted-foreground">réussis</div>
                      </div>
                      <div>
                        <div className="font-medium text-red-600">❌ {report.failedTests}</div>
                        <div className="text-muted-foreground">échoués</div>
                      </div>
                      <div>
                        <div className="font-medium">{report.totalDuration}ms</div>
                        <div className="text-muted-foreground">durée</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Aucun historique disponible.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}