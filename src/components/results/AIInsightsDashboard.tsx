import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Target, Zap, Eye, BarChart3 } from 'lucide-react';
import { AIAnalyticsService, Anomaly, IntelligentSuggestion } from '@/services/AIAnalyticsService';
import { useToast } from '@/hooks/use-toast';

interface AIInsightsDashboardProps {
  subjectId?: string;
  programId?: string;
}

export function AIInsightsDashboard({ subjectId, programId }: AIInsightsDashboardProps) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [suggestions, setSuggestions] = useState<IntelligentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('anomalies');
  const [autoOptimization, setAutoOptimization] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAIInsights();
    
    // Subscribe to real-time anomaly detection
    const unsubscribe = AIAnalyticsService.subscribeToAnomalyDetection(
      (anomaly) => {
        setAnomalies(prev => [anomaly, ...prev].slice(0, 20));
        
        if (anomaly.severity === 'critical' || anomaly.severity === 'high') {
          toast({
            title: "Anomalie détectée",
            description: anomaly.title,
            variant: anomaly.severity === 'critical' ? 'destructive' : 'default',
          });
        }
      },
      { subjectId, programId }
    );

    return unsubscribe;
  }, [subjectId, programId, toast]);

  const loadAIInsights = async () => {
    setIsLoading(true);
    try {
      const [anomaliesData, suggestionsData] = await Promise.all([
        AIAnalyticsService.detectAnomalies({ subjectId, programId }),
        AIAnalyticsService.getIntelligentSuggestions({ subjectId })
      ]);

      setAnomalies(anomaliesData);
      setSuggestions(suggestionsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les insights IA",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimizeGrades = async () => {
    if (!subjectId) return;

    try {
      const result = await AIAnalyticsService.optimizeGradeDistribution(subjectId, []);
      
      toast({
        title: "Optimisation proposée",
        description: `Amélioration attendue: ${result.expectedImprovement}%`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'optimisation",
        description: "Impossible d'optimiser les notes",
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Intelligence Artificielle & Insights
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadAIInsights} disabled={isLoading}>
                <Eye className="w-4 h-4 mr-2" />
                Analyser
              </Button>
              <Button 
                variant={autoOptimization ? "default" : "outline"} 
                size="sm"
                onClick={() => setAutoOptimization(!autoOptimization)}
              >
                <Zap className="w-4 h-4 mr-2" />
                Auto-Optimisation: {autoOptimization ? 'ON' : 'OFF'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Anomalies Critiques</p>
                <p className="text-2xl font-bold text-red-600">
                  {anomalies.filter(a => a.severity === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Suggestions Actives</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {suggestions.filter(s => s.impact === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Taux de Confiance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(anomalies.reduce((acc, a) => acc + a.confidence, 0) / Math.max(anomalies.length, 1))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Optimisations Possibles</p>
                <p className="text-2xl font-bold text-blue-600">
                  {suggestions.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Anomalies ({anomalies.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Suggestions ({suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Optimisation
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analyse
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-4">
          {anomalies.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune anomalie détectée</p>
              </CardContent>
            </Card>
          ) : (
            anomalies.map((anomaly) => (
              <Card key={anomaly.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(anomaly.severity)}`} />
                      <CardTitle className="text-base">{anomaly.title}</CardTitle>
                      <Badge variant="outline">{anomaly.type}</Badge>
                    </div>
                    <Badge variant={anomaly.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{anomaly.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Confiance:</span>
                      <Progress value={anomaly.confidence} className="w-20" />
                      <span className="text-sm">{anomaly.confidence}%</span>
                    </div>
                    <Badge variant="outline">
                      {new Date(anomaly.timestamp).toLocaleString()}
                    </Badge>
                  </div>

                  {anomaly.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Suggestions d'actions:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {anomaly.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {suggestions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune suggestion disponible</p>
              </CardContent>
            </Card>
          ) : (
            suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{suggestion.type}</Badge>
                      <Badge className={getImpactColor(suggestion.impact)}>
                        Impact: {suggestion.impact}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{suggestion.description}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Confiance:</span>
                      <Progress value={suggestion.confidence} className="w-20" />
                      <span className="text-sm">{suggestion.confidence}%</span>
                    </div>
                  </div>

                  {suggestion.actions.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Actions possibles:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestion.actions.map((action, index) => (
                          <Button key={index} variant="outline" size="sm">
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimisation Automatique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Target className="w-4 h-4" />
                <AlertDescription>
                  L'optimisation automatique utilise l'IA pour améliorer la distribution des notes et détecter les problèmes en temps réel.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleOptimizeGrades} disabled={!subjectId}>
                  <Target className="w-4 h-4 mr-2" />
                  Optimiser la Distribution
                </Button>
                <Button variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyse Prédictive
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse Avancée</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Fonctionnalités d'analyse avancée à implémenter...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}