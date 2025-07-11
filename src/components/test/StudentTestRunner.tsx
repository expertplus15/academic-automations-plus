import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, RotateCcw, FileText, Users, AlertTriangle } from 'lucide-react';
import { runStudentModuleTests, StudentTestResult } from '@/utils/studentModuleTests';

export default function StudentTestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<StudentTestResult[]>([]);
  const [progress, setProgress] = useState(0);

  const handleRunTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    try {
      const testResults = await runStudentModuleTests();
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
    const majorFailures = results.filter(r => !r.success && r.severity === 'major').length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    return { total, passed, failed, criticalFailures, majorFailures, passRate };
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'major': return 'secondary';
      case 'minor': return 'outline';
      default: return 'default';
    }
  };

  const groupedResults = results.reduce((acc, result) => {
    const section = result.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(result);
    return acc;
  }, {} as Record<string, StudentTestResult[]>);

  const stats = getStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-green-600" />
            🧪 Tests Module Gestion Étudiants
          </h1>
          <p className="text-muted-foreground mt-2">
            Suite de tests QA pour valider toutes les fonctionnalités du module Gestion des Étudiants v2.1.4
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Couleur: Vert
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Badge: 3 (à investiguer)
            </Badge>
          </div>
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

      {/* Informations contextuelles */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-blue-800">📊 Données actuelles du module :</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• 2 étudiants inscrits</li>
                <li>• 0 nouvelle inscription</li>
                <li>• 100% taux de rétention</li>
                <li>• 2 étudiants actifs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-800">🎯 Points d'attention :</h4>
              <ul className="text-sm space-y-1 text-blue-700">
                <li>• Badge "3" mystérieux à investiguer</li>
                <li>• Workflow d'approbation complet</li>
                <li>• Génération cartes étudiants</li>
                <li>• Intégrations inter-modules</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Barre de progression */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exécution des tests du module étudiants...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques globales */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <div className="text-2xl font-bold text-red-600">{stats.criticalFailures}</div>
              <p className="text-xs text-muted-foreground">Bugs Critiques</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.majorFailures}</div>
              <p className="text-xs text-muted-foreground">Bugs Majeurs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.passRate}%</div>
              <p className="text-xs text-muted-foreground">Taux Réussite</p>
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
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {stats.criticalFailures} bugs critiques détectés
                </Badge>
              )}
              {stats.majorFailures > 0 && (
                <Badge variant="secondary">
                  {stats.majorFailures} bugs majeurs
                </Badge>
              )}
            </div>
            {stats.criticalFailures === 0 && stats.majorFailures === 0 && (
              <p className="text-sm text-green-600 mt-2">
                ✨ Excellent ! Le module est prêt pour la production. Le badge "3" reste à investiguer mais n'impacte pas les fonctionnalités critiques.
              </p>
            )}
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
            const sectionMajor = sectionResults.filter(r => !r.success && r.severity === 'major').length;
            
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
                    <div className="flex gap-2">
                      {sectionCritical > 0 && (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {sectionCritical} critique(s)
                        </Badge>
                      )}
                      {sectionMajor > 0 && (
                        <Badge variant="secondary">
                          {sectionMajor} majeur(s)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Section {section} - {Math.round((sectionPassed / sectionTotal) * 100)}% de réussite
                    {section === 'Tableau de Bord' && ' (Investigation Badge "3" nécessaire)'}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ScrollArea className="h-64">
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
                              <strong>Bug #GE-{result.testId}:</strong> {JSON.stringify(result.details, null, 2)}
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
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              📋 Instructions de Test - Module Gestion Étudiants
            </CardTitle>
            <CardDescription>
              Suite de tests automatisés pour valider le module de Gestion des Étudiants v2.1.4
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">🔍 Tests de fonctionnalités :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Tableau de bord et cartes statistiques</li>
                  <li>• Inscription automatique + validation</li>
                  <li>• Suivi des inscriptions et filtres</li>
                  <li>• Workflow d'approbation</li>
                  <li>• Génération cartes étudiants</li>
                  <li>• Profils étudiants complets</li>
                  <li>• Analyses et tendances</li>
                  <li>• Alertes automatiques</li>
                  <li>• Documents administratifs</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">🎯 Tests techniques :</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Performance recherche (temps limite 500ms)</li>
                  <li>• Connexion base de données</li>
                  <li>• Sécurité et permissions</li>
                  <li>• Intégrité des données</li>
                  <li>• CRUD complet étudiants</li>
                  <li>• Navigation inter-modules</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800">
                <strong>🔍 Attention particulière au Badge mystérieux :</strong> 
                Ce badge avec le chiffre 3 sur le module doit être investigué. Il pourrait indiquer des alertes, 
                nouvelles demandes, mises à jour en attente, ou étudiants nécessitant une action.
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>✅ Critères de validation :</strong> 
                Le module sera validé si tous les tests critiques passent, les fonctionnalités CRUD fonctionnent,
                et les intégrations avec les autres modules sont opérationnelles.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}