import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  TestTube,
  AlertTriangle,
  FileText,
  BarChart3,
  Download,
  ChevronDown,
  ChevronRight,
  Zap,
  Database,
  MousePointer,
  Link,
  Activity,
  CheckSquare,
  Square
} from 'lucide-react';
import { useEnhancedModuleTests } from '@/hooks/useEnhancedModuleTests';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TestReportViewer } from './TestReportViewer';

export function EnhancedTestsPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('tests');
  
  const { 
    testSuites, 
    selectedSuites,
    isRunning, 
    currentReport,
    reportHistory,
    runAllTests,
    runSelectedTests, 
    resetTests, 
    getTestSummary,
    getSelectedTestsCount,
    toggleSuite,
    selectAllSuites,
    deselectAllSuites,
    selectSuitesByCategory
  } = useEnhancedModuleTests();
  
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ui':
        return <MousePointer className="w-4 h-4 text-blue-500" />;
      case 'module':
        return <Link className="w-4 h-4 text-green-500" />;
      case 'integration':
        return <Activity className="w-4 h-4 text-purple-500" />;
      case 'performance':
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <TestTube className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleTestExpansion = (testId: string) => {
    setExpandedTests(prev => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };

  const exportReport = () => {
    if (!currentReport) return;
    
    const reportData = {
      ...currentReport,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-report-${currentReport.executionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          size="sm"
        >
          <TestTube className="w-4 h-4 mr-2" />
          Tests Enrichis
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
    <div className="fixed bottom-4 right-4 z-50 w-[800px] max-h-[85vh] overflow-hidden">
      <Card className="shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Tests Enrichis des Modules
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportReport}
                disabled={!currentReport}
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                ×
              </Button>
            </div>
          </div>
          
          {/* État du réseau et résumé */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${networkStatus.isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-muted-foreground">
                  {networkStatus.isOnline ? 'En ligne' : 'Hors ligne'}
                  {networkStatus.effectiveType && ` (${networkStatus.effectiveType})`}
                </span>
              </div>
              
              {currentReport && (
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="w-3 h-3" />
                  <span>Dernier rapport: {currentReport.passRate}% réussite</span>
                </div>
              )}
            </div>

            {/* Résumé des tests */}
            {summary.total > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression: {summary.passed}/{summary.total}</span>
                  <span className="font-medium">{summary.passRate}%</span>
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
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tests" className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                Tests
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Rapport
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Historique
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-4">
              {/* Sélection des suites */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Sélection des suites ({selectedSuites.size})</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAllSuites}
                      className="h-7 px-2 text-xs"
                    >
                      <CheckSquare className="w-3 h-3 mr-1" />
                      Tout
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={deselectAllSuites}
                      className="h-7 px-2 text-xs"
                    >
                      <Square className="w-3 h-3 mr-1" />
                      Aucun
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {testSuites.length === 0 && 
                    ['critical-tests', 'ui-tests', 'module-tests', 'integration-tests', 'performance-tests'].map((suiteId) => {
                      const suiteNames = {
                        'critical-tests': 'Tests Critiques',
                        'ui-tests': 'Tests UI',
                        'module-tests': 'Tests Module',  
                        'integration-tests': 'Tests Intégration',
                        'performance-tests': 'Tests Performance'
                      };
                      const categories = {
                        'critical-tests': 'critical',
                        'ui-tests': 'ui',
                        'module-tests': 'module',  
                        'integration-tests': 'integration',
                        'performance-tests': 'performance'
                      };
                      return (
                        <div key={suiteId} className="flex items-center space-x-2 p-2 rounded border">
                          <Checkbox
                            id={suiteId}
                            checked={selectedSuites.has(suiteId)}
                            onCheckedChange={() => toggleSuite(suiteId)}
                          />
                          <label htmlFor={suiteId} className="text-xs flex items-center gap-1 cursor-pointer">
                            {getCategoryIcon(categories[suiteId as keyof typeof categories])}
                            {suiteNames[suiteId as keyof typeof suiteNames]}
                          </label>
                        </div>
                      );
                    })
                  }
                  {testSuites.map((suite) => (
                    <div key={suite.id} className={`flex items-center space-x-2 p-2 rounded border ${selectedSuites.has(suite.id) ? 'bg-primary/5 border-primary/20' : ''}`}>
                      <Checkbox
                        id={suite.id}
                        checked={selectedSuites.has(suite.id)}
                        onCheckedChange={() => toggleSuite(suite.id)}
                      />
                      <label htmlFor={suite.id} className="text-xs flex items-center gap-1 cursor-pointer">
                        {getCategoryIcon(suite.category)}
                        {suite.name}
                      </label>
                    </div>
                  ))}
                </div>
                
                {selectedSuites.size > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {getSelectedTestsCount()} tests sélectionnés
                  </div>
                )}
              </div>

              <Separator />

              {/* Boutons de contrôle */}
              <div className="flex gap-2">
                <Button
                  onClick={runSelectedTests}
                  disabled={isRunning || !networkStatus.isOnline || selectedSuites.size === 0}
                  size="sm"
                  className="flex-1"
                >
                  {isRunning ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isRunning ? 'Tests en cours...' : `Lancer Tests Sélectionnés (${selectedSuites.size})`}
                </Button>
                
                <Button
                  onClick={runAllTests}
                  disabled={isRunning || !networkStatus.isOnline}
                  variant="outline"
                  size="sm"
                >
                  Tous
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
                    Connexion requise pour les tests de base de données et d'intégration
                  </span>
                </div>
              )}

              {/* Suites de tests */}
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {testSuites.map((suite) => (
                    <div key={suite.id} className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                        {getCategoryIcon(suite.category)}
                        <h4 className="font-medium text-sm flex-1">{suite.name}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getStatusColor(suite.status)}`}
                        >
                          {suite.status}
                        </Badge>
                        {suite.totalDuration && (
                          <span className="text-xs text-muted-foreground">
                            {suite.totalDuration}ms
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 pl-4">
                        {suite.tests.map((test) => (
                          <div key={test.id} className="space-y-1">
                            <div 
                              className="flex items-center justify-between p-2 rounded bg-background hover:bg-muted/50 cursor-pointer"
                              onClick={() => toggleTestExpansion(test.id)}
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {test.subTests && test.subTests.length > 0 ? (
                                  expandedTests.has(test.id) ? 
                                    <ChevronDown className="w-3 h-3" /> :
                                    <ChevronRight className="w-3 h-3" />
                                ) : null}
                                {getStatusIcon(test.status)}
                                <span className="text-sm truncate">{test.name}</span>
                                {test.moduleType === 'ui' && <MousePointer className="w-3 h-3 text-blue-500" />}
                                {test.moduleType === 'database' && <Database className="w-3 h-3 text-green-500" />}
                                {test.moduleType === 'performance' && <Zap className="w-3 h-3 text-yellow-500" />}
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

                            {/* Sous-tests */}
                            {test.subTests && expandedTests.has(test.id) && (
                              <div className="ml-6 space-y-1">
                                {test.subTests.map((subTest) => (
                                  <div 
                                    key={subTest.id}
                                    className="flex items-center justify-between p-2 rounded bg-muted/20"
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      {getStatusIcon(subTest.status)}
                                      <span className="text-xs truncate">{subTest.name}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      {subTest.duration && (
                                        <span>{subTest.duration}ms</span>
                                      )}
                                      {subTest.error && (
                                        <AlertTriangle className="w-3 h-3 text-red-500" />
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
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
                      <p className="text-xs">Cliquez sur "Lancer Tests Enrichis" pour commencer</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="report">
              {currentReport ? (
                <TestReportViewer report={currentReport} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Aucun rapport disponible</p>
                  <p className="text-xs">Lancez les tests pour générer un rapport détaillé</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {reportHistory.length > 0 ? (
                    reportHistory.map((report, index) => (
                      <div 
                        key={report.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => setActiveTab('report')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={report.passRate >= 80 ? 'default' : 'destructive'}
                              className="text-xs"
                            >
                              {report.passRate}%
                            </Badge>
                            <span className="text-sm">
                              {report.passedTests}/{report.totalTests} tests
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {report.startTime.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Durée: {Math.round(report.totalDuration / 1000)}s
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Aucun historique disponible</p>
                      <p className="text-xs">L'historique des tests apparaîtra ici</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}