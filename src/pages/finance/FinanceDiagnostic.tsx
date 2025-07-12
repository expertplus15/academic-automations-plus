import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Database,
  Zap,
  Shield,
  Calculator
} from "lucide-react";
import { runFinanceDiagnostic } from '@/scripts/financeTestRunner';
import { runAcceleratedFinanceDiagnostic } from '@/scripts/acceleratedFinanceDiagnostic';
import type { DiagnosticReport } from '@/scripts/financeTestRunner';

interface TestResultProps {
  result: {
    testName: string;
    status: 'PASS' | 'FAIL' | 'ERROR';
    duration: number;
    details: string;
    expected: string;
    actual: string;
  };
}

const TestResult: React.FC<TestResultProps> = ({ result }) => {
  const getIcon = () => {
    switch (result.status) {
      case 'PASS': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAIL': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'ERROR': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getBadgeVariant = () => {
    switch (result.status) {
      case 'PASS': return 'default';
      case 'FAIL': return 'destructive';
      case 'ERROR': return 'secondary';
    }
  };

  return (
    <Card className="mb-3">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getIcon()}
            <span className="font-medium">{result.testName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant()}>{result.status}</Badge>
            <span className="text-sm text-muted-foreground">
              {result.duration.toFixed(0)}ms
            </span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-1">
          <strong>Attendu:</strong> {result.expected}
        </div>
        <div className="text-sm">
          <strong>Résultat:</strong> {result.actual}
        </div>
        
        {result.status !== 'PASS' && (
          <Alert className="mt-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{result.details}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default function FinanceDiagnostic() {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);
  const [progress, setProgress] = useState(0);
  const [acceleratedMode, setAcceleratedMode] = useState(true);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      if (acceleratedMode) {
        // Mode diagnostic accéléré
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 5, 90));
        }, 500);

        const acceleratedResult = await runAcceleratedFinanceDiagnostic();
        
        clearInterval(progressInterval);
        setProgress(100);
        
        // Convertir le résultat accéléré en format DiagnosticReport
        const mockReport: DiagnosticReport = {
          timestamp: new Date(),
          totalTests: acceleratedResult.results.length,
          passed: acceleratedResult.results.filter(r => r.status === 'SUCCESS').length,
          failed: acceleratedResult.results.filter(r => r.status === 'ERROR').length,
          errors: acceleratedResult.results.filter(r => r.status === 'WARNING').length,
          results: acceleratedResult.results.map(r => ({
            testName: r.step,
            status: r.status === 'SUCCESS' ? 'PASS' : r.status === 'WARNING' ? 'ERROR' : 'FAIL',
            duration: r.duration,
            details: r.details,
            expected: 'Diagnostic réussi',
            actual: r.details
          })),
          recommendations: acceleratedResult.nextActions
        };
        
        setReport(mockReport);
      } else {
        // Mode diagnostic standard
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        const diagnosticReport = await runFinanceDiagnostic();
        
        clearInterval(progressInterval);
        setProgress(100);
        setReport(diagnosticReport);
      }
      
    } catch (error) {
      console.error('Erreur durant le diagnostic:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getOverallScore = () => {
    if (!report) return 0;
    return Math.round((report.passed / report.totalTests) * 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const categorizeResults = () => {
    if (!report) return { infrastructure: [], reconciliation: [], performance: [], calculation: [], security: [] };
    
    return {
      infrastructure: report.results.filter(r => 
        r.testName.includes('Connexion') || r.testName.includes('Données') || r.testName.includes('RLS')
      ),
      reconciliation: report.results.filter(r => 
        r.testName.includes('Matching') || r.testName.includes('Similarité') || r.testName.includes('confiance')
      ),
      performance: report.results.filter(r => 
        r.testName.includes('Performance') || r.testName.includes('volume')
      ),
      calculation: report.results.filter(r => 
        r.testName.includes('Équilibre') || r.testName.includes('totaux')
      ),
      security: report.results.filter(r => 
        r.testName.includes('injection') || r.testName.includes('sécurité')
      )
    };
  };

  const categories = categorizeResults();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Diagnostic Accéléré - Module Finance
          </CardTitle>
          <CardDescription>
            Analyse complète de l'infrastructure, performance et fonctionnalités du module Finance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={acceleratedMode}
                  onChange={(e) => setAcceleratedMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">
                  Mode Diagnostic Accéléré (Recommandé)
                </span>
              </label>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={runDiagnostic} 
                disabled={isRunning}
                size="lg"
              >
                {isRunning ? 'Diagnostic en cours...' : 
                 acceleratedMode ? 'Lancer le Diagnostic Accéléré' : 'Lancer le Diagnostic Standard'}
              </Button>
            
              {isRunning && (
                <div className="flex-1">
                  <Progress value={progress} className="w-full" />
                  <span className="text-sm text-muted-foreground mt-1">
                    {progress}% - {acceleratedMode ? 'Diagnostic accéléré' : 'Analyse standard'} en cours...
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      {report && (
        <>
          {/* Vue d'ensemble */}
          <Card>
            <CardHeader>
              <CardTitle>Résultats du Diagnostic</CardTitle>
              <CardDescription>
                Exécuté le {report.timestamp.toLocaleString('fr-FR')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(getOverallScore())}`}>
                    {getOverallScore()}%
                  </div>
                  <div className="text-sm text-muted-foreground">Score Global</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{report.passed}</div>
                  <div className="text-sm text-muted-foreground">Tests Réussis</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{report.failed}</div>
                  <div className="text-sm text-muted-foreground">Tests Échoués</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{report.errors}</div>
                  <div className="text-sm text-muted-foreground">Erreurs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{report.totalTests}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
              </div>

              {/* Recommandations */}
              {report.recommendations.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Recommandations :</h4>
                  {report.recommendations.map((rec, index) => (
                    <Alert key={index}>
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tests détaillés par catégorie */}
          <Tabs defaultValue="infrastructure" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="infrastructure" className="flex items-center gap-1">
                <Database className="h-4 w-4" />
                Infrastructure
              </TabsTrigger>
              <TabsTrigger value="reconciliation" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Réconciliation
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="calculation" className="flex items-center gap-1">
                <Calculator className="h-4 w-4" />
                Calculs
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Sécurité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="infrastructure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Tests Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.infrastructure.map((result, index) => (
                    <TestResult key={index} result={result} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reconciliation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Tests Algorithme de Réconciliation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.reconciliation.map((result, index) => (
                    <TestResult key={index} result={result} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Tests Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.performance.map((result, index) => (
                    <TestResult key={index} result={result} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calculation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Tests Cohérence des Calculs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.calculation.map((result, index) => (
                    <TestResult key={index} result={result} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Tests Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {categories.security.map((result, index) => (
                    <TestResult key={index} result={result} />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}