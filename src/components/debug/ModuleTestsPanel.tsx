import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  TestTube,
  AlertTriangle
} from 'lucide-react';
import { useModuleTests } from '@/hooks/useModuleTests';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function ModuleTestsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { 
    testSuites, 
    isRunning, 
    runAllTests, 
    resetTests, 
    getTestSummary 
  } = useModuleTests();
  
  const networkStatus = useNetworkStatus();
  const summary = getTestSummary();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg"
          size="sm"
        >
          <TestTube className="w-4 h-4 mr-2" />
          Tests Modules
          {summary.total > 0 && (
            <Badge variant="secondary" className="ml-2">
              {summary.passed}/{summary.total}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-hidden">
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Tests des Modules
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
            >
              ×
            </Button>
          </div>
          
          {/* État du réseau */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${networkStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-muted-foreground">
              {networkStatus.isOnline ? 'En ligne' : 'Hors ligne'}
              {networkStatus.effectiveType && ` (${networkStatus.effectiveType})`}
            </span>
          </div>

          {/* Résumé des tests */}
          {summary.total > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression: {summary.passed}/{summary.total}</span>
                <span>{summary.passRate}%</span>
              </div>
              <Progress value={summary.passRate} className="h-2" />
              
              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span>{summary.passed} réussis</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-red-500" />
                  <span>{summary.failed} échoués</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{summary.pending} en attente</span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4 max-h-96 overflow-y-auto">
          {/* Boutons de contrôle */}
          <div className="flex gap-2">
            <Button
              onClick={runAllTests}
              disabled={isRunning || !networkStatus.isOnline}
              size="sm"
              className="flex-1"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'En cours...' : 'Lancer Tests'}
            </Button>
            
            <Button
              onClick={resetTests}
              disabled={isRunning}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Avertissement hors ligne */}
          {!networkStatus.isOnline && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-amber-800">
                Connexion requise pour les tests de base de données
              </span>
            </div>
          )}

          {/* Suites de tests */}
          {testSuites.map((suite) => (
            <div key={suite.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{suite.name}</h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(suite.status)}`}
                >
                  {suite.status}
                </Badge>
              </div>
              
              <div className="space-y-1 pl-4">
                {suite.tests.map((test) => (
                  <div 
                    key={test.id} 
                    className="flex items-center justify-between p-2 rounded bg-muted/30"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {getStatusIcon(test.status)}
                      <span className="text-sm truncate">{test.name}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {test.duration && (
                        <span>{test.duration}ms</span>
                      )}
                      {test.error && (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {suite.id !== testSuites[testSuites.length - 1].id && (
                <Separator />
              )}
            </div>
          ))}

          {/* État vide */}
          {testSuites.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TestTube className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Aucun test exécuté</p>
              <p className="text-xs">Cliquez sur "Lancer Tests" pour commencer</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}