import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Database, 
  TrendingUp,
  Target,
  Activity,
  FileBarChart
} from 'lucide-react';
import type { TestReport } from '@/hooks/useEnhancedModuleTests';

interface TestReportViewerProps {
  report: TestReport;
}

export function TestReportViewer({ report }: TestReportViewerProps) {
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'partial':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ui':
        return <Target className="w-4 h-4 text-blue-500" />;
      case 'module':
        return <Activity className="w-4 h-4 text-green-500" />;
      case 'integration':
        return <Database className="w-4 h-4 text-purple-500" />;
      case 'performance':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileBarChart className="w-4 h-4 text-gray-500" />;
    }
  };

  const getErrorTypeIcon = (errorType: string) => {
    switch (errorType) {
      case 'network':
        return <Activity className="w-3 h-3 text-red-500" />;
      case 'database':
        return <Database className="w-3 h-3 text-orange-500" />;
      case 'timeout':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'ui':
        return <Target className="w-3 h-3 text-blue-500" />;
      default:
        return <XCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <ScrollArea className="h-96">
      <div className="space-y-4">
        {/* En-tête du rapport */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileBarChart className="w-5 h-5" />
              Rapport d'Exécution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Démarré:</span>
                <p className="font-medium">{report.startTime.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Terminé:</span>
                <p className="font-medium">{report.endTime.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Durée totale:</span>
                <p className="font-medium">{formatDuration(report.totalDuration)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ID d'exécution:</span>
                <p className="font-mono text-xs">{report.executionId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résumé général */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-5 h-5" />
              Résumé Général
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Taux de réussite</span>
                <span className="font-bold text-lg">{report.passRate}%</span>
              </div>
              <Progress value={report.passRate} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{report.passedTests} réussis</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span>{report.failedTests} échoués</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{report.skippedTests} ignorés</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>{report.totalTests} total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métriques de performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-5 h-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Durée moyenne:</span>
                <p className="font-medium">{formatDuration(report.performanceMetrics.averageTestDuration)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Test le plus lent:</span>
                <p className="font-medium">{report.performanceMetrics.slowestTest.name}</p>
                <p className="text-xs text-muted-foreground">{formatDuration(report.performanceMetrics.slowestTest.duration)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Test le plus rapide:</span>
                <p className="font-medium">{report.performanceMetrics.fastestTest.name}</p>
                <p className="text-xs text-muted-foreground">{formatDuration(report.performanceMetrics.fastestTest.duration)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Requêtes réseau:</span>
                <p className="font-medium">
                  {report.performanceMetrics.networkRequests}
                  {report.performanceMetrics.failedNetworkRequests > 0 && (
                    <span className="text-red-500 ml-1">
                      ({report.performanceMetrics.failedNetworkRequests} échecs)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats par suite */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5" />
              Résultats par Suite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.suiteResults.map((suite) => (
                <div key={suite.suiteId} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(suite.category)}
                      <span className="font-medium text-sm">{suite.suiteName}</span>
                    </div>
                    <Badge className={`text-xs ${getStatusColor(suite.status)}`}>
                      {suite.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span>{suite.passedTests}/{suite.totalTests} réussis</span>
                    <span>{formatDuration(suite.duration)}</span>
                    <span className="text-right">{suite.category}</span>
                  </div>

                  {suite.criticalIssues.length > 0 && (
                    <div className="mt-2 p-2 bg-red-50 rounded text-xs">
                      <div className="font-medium text-red-700 mb-1">Issues critiques:</div>
                      {suite.criticalIssues.map((issue, index) => (
                        <div key={index} className="text-red-600">{issue}</div>
                      ))}
                    </div>
                  )}

                  {suite.warnings.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                      <div className="font-medium text-yellow-700 mb-1">Avertissements:</div>
                      {suite.warnings.map((warning, index) => (
                        <div key={index} className="text-yellow-600">{warning}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analyse des erreurs */}
        {report.errorAnalysis.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5" />
                Analyse des Erreurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.errorAnalysis.map((error, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2">
                      {getErrorTypeIcon(error.errorType)}
                      <div className="flex-1">
                        <div className="font-medium text-sm">{error.testName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Type: {error.errorType} • Fréquence: {error.frequency}
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          {error.errorMessage}
                        </div>
                        <div className="text-xs text-blue-600 mt-2 p-2 bg-blue-50 rounded">
                          <span className="font-medium">Recommandation:</span> {error.recommendedAction}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommandations */}
        {report.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="w-5 h-5" />
                Recommandations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {report.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded text-sm">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="text-blue-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
}