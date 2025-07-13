import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlayCircle, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  BarChart3,
  FileText,
  Database,
  Route,
  Zap,
  Settings
} from 'lucide-react';
import { runCompleteAcademicDiagnostic } from '@/scripts/academicCompleteDiagnostic';

interface DiagnosticResult {
  module: string;
  version: string;
  testDate: string;
  summary: {
    healthScore: number;
    status: 'PRODUCTION_READY' | 'PARTIAL' | 'CRITICAL' | 'BROKEN';
    criticalIssues: number;
    improvements: number;
  };
  results: {
    working: string[];
    broken: string[];
    missing: string[];
  };
  performance: {
    [key: string]: string;
  };
  nextSteps: string[];
  routes: {
    [route: string]: {
      status: 'working' | 'broken' | 'missing';
      loadTime?: number;
      errors?: string[];
    };
  };
  data: {
    [table: string]: {
      count: number;
      status: 'sufficient' | 'insufficient' | 'empty';
    };
  };
}

export function AcademicDiagnosticReport() {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setLogs([]);
    setDiagnostic(null);

    // Capturer les logs de console
    const originalConsoleLog = console.log;
    console.log = (...args) => {
      setLogs(prev => [...prev, args.join(' ')]);
      originalConsoleLog(...args);
    };

    try {
      const result = await runCompleteAcademicDiagnostic();
      setDiagnostic(result);
    } catch (error) {
      console.error('Erreur lors du diagnostic:', error);
      setLogs(prev => [...prev, `❌ ERREUR: ${error}`]);
    } finally {
      console.log = originalConsoleLog;
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRODUCTION_READY':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'PARTIAL':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'CRITICAL':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'BROKEN':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRODUCTION_READY':
        return 'bg-green-500';
      case 'PARTIAL':
        return 'bg-yellow-500';
      case 'CRITICAL':
        return 'bg-red-500';
      case 'BROKEN':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const downloadReport = () => {
    if (!diagnostic) return;
    
    const blob = new Blob([JSON.stringify(diagnostic, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic-diagnostic-${diagnostic.testDate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">🎓 Diagnostic Module Académique</h1>
          <p className="text-muted-foreground">
            Analyse complète du module Gestion Académique v2.1.4
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runDiagnostic} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <PlayCircle className="h-4 w-4" />
            {isRunning ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
          </Button>
          {diagnostic && (
            <Button variant="outline" onClick={downloadReport}>
              <Download className="h-4 w-4" />
              Télécharger le rapport
            </Button>
          )}
        </div>
      </div>

      {/* Summary Card */}
      {diagnostic && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(diagnostic.summary.status)}
              Résumé du diagnostic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {diagnostic.summary.healthScore}%
                </div>
                <div className="text-sm text-muted-foreground">Score de santé</div>
                <Progress value={diagnostic.summary.healthScore} className="mt-2" />
              </div>
              <div className="text-center">
                <Badge variant="outline" className={getStatusColor(diagnostic.summary.status)}>
                  {diagnostic.summary.status}
                </Badge>
                <div className="text-sm text-muted-foreground mt-2">Statut général</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {diagnostic.summary.criticalIssues}
                </div>
                <div className="text-sm text-muted-foreground">Problèmes critiques</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {diagnostic.summary.improvements}
                </div>
                <div className="text-sm text-muted-foreground">Améliorations proposées</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      {diagnostic && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Données
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Fonctionnel ({diagnostic.results.working.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {diagnostic.results.working.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Problèmes ({diagnostic.results.broken.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {diagnostic.results.broken.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Manquant ({diagnostic.results.missing.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {diagnostic.results.missing.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>État des données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(diagnostic.data).map(([table, info]) => (
                    <div key={table} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium capitalize">{table}</h4>
                        <Badge variant={
                          info.status === 'sufficient' ? 'default' :
                          info.status === 'insufficient' ? 'secondary' : 'destructive'
                        }>
                          {info.status}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">{info.count}</div>
                      <div className="text-sm text-muted-foreground">enregistrements</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>État des routes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(diagnostic.routes).map(([route, info]) => (
                    <div key={route} className="flex justify-between items-center p-3 border rounded">
                      <span className="font-mono">{route}</span>
                      <div className="flex items-center gap-2">
                        {info.loadTime && (
                          <span className="text-sm text-muted-foreground">
                            {info.loadTime}ms
                          </span>
                        )}
                        <Badge variant={
                          info.status === 'working' ? 'default' :
                          info.status === 'broken' ? 'destructive' : 'secondary'
                        }>
                          {info.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Métriques de performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(diagnostic.performance).map(([test, result]) => (
                    <div key={test} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2 capitalize">{test}</h4>
                      <div className="text-lg font-mono">{result}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prochaines étapes recommandées</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {diagnostic.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs d'exécution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
                  {logs.map((log, idx) => (
                    <div key={idx}>{log}</div>
                  ))}
                  {isRunning && (
                    <div className="animate-pulse">▊ Diagnostic en cours...</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Initial State */}
      {!diagnostic && !isRunning && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold mb-2">Diagnostic Module Académique</h2>
            <p className="text-muted-foreground mb-6">
              Cliquez sur "Lancer le diagnostic" pour analyser l'état complet du module
            </p>
            <Button onClick={runDiagnostic} size="lg">
              <PlayCircle className="h-5 w-5 mr-2" />
              Commencer le diagnostic
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isRunning && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⚙️</div>
            <h2 className="text-xl font-bold mb-2">Diagnostic en cours...</h2>
            <p className="text-muted-foreground">
              Analyse des données, routes, et performances
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}