import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Settings, 
  TrendingUp, 
  AlertTriangle, 
  Zap,
  Brain,
  Target,
  Shield,
  Users,
  Database
} from 'lucide-react';

export function AdminIntelligence() {
  const [activeOptimizations, setActiveOptimizations] = useState(3);
  
  const predictions = [
    {
      type: 'trésorerie',
      period: 'J+30',
      value: '2.1M€',
      confidence: 95,
      variance: '±50K€'
    },
    {
      type: 'trésorerie', 
      period: 'J+90',
      value: '1.8M€',
      confidence: 85,
      variance: '±120K€'
    },
    {
      type: 'impayés',
      period: 'Risque',
      value: '87%',
      confidence: 87,
      variance: 'précision'
    }
  ];

  const optimizations = [
    {
      id: 1,
      title: 'Optimisation placement trésorerie',
      impact: '+15K€/an',
      status: 'active',
      confidence: 92
    },
    {
      id: 2,
      title: 'Prédiction défaillances paiement',
      impact: '-25% impayés',
      status: 'active', 
      confidence: 87
    },
    {
      id: 3,
      title: 'Optimisation tarifaire formations',
      impact: '+8% revenus',
      status: 'simulation',
      confidence: 78
    }
  ];

  const systemMetrics = [
    { label: 'Utilisateurs actifs', value: '47', change: '+3' },
    { label: 'Transactions/jour', value: '1,247', change: '+12%' },
    { label: 'Uptime', value: '99.9%', change: 'stable' },
    { label: 'Performance', value: '< 200ms', change: '+25%' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-500" />
            Centre de Contrôle IA
          </h2>
          <p className="text-muted-foreground">Administration & Intelligence Artificielle Intégrée</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Zap className="w-3 h-3" />
            {activeOptimizations} optimisations actives
          </Badge>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ia" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ia">Intelligence IA</TabsTrigger>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="ia" className="space-y-6">
          {/* Dashboard IA principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  IA Financière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">Active</div>
                <p className="text-sm text-muted-foreground">Moteur ML opérationnel</p>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Précision prédictions</span>
                    <span className="font-medium">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Optimisations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{activeOptimizations}</div>
                <p className="text-sm text-muted-foreground">En cours d'exécution</p>
                <div className="mt-3 text-sm">
                  <span className="text-green-600 font-medium">+€45K</span>
                  <span className="text-muted-foreground"> impact cumulé</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Alertes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">2</div>
                <p className="text-sm text-muted-foreground">Anomalies détectées</p>
                <div className="mt-3 space-y-1">
                  <div className="text-xs text-orange-600">Transaction suspecte détectée</div>
                  <div className="text-xs text-orange-600">Écart budgétaire inhabituel</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimisations en cours */}
          <Card>
            <CardHeader>
              <CardTitle>Optimisations IA en Cours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">{opt.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Impact: {opt.impact} • Confiance: {opt.confidence}%
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={opt.status === 'active' ? 'default' : 'secondary'}
                      className={opt.status === 'active' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {opt.status === 'active' ? 'Actif' : 'Simulation'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          {/* Prédictions détaillées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Prédictions Financières Avancées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {predictions.map((pred, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{pred.type}</span>
                      <Badge variant="outline">{pred.period}</Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">{pred.value}</div>
                    <div className="text-sm text-muted-foreground mb-3">{pred.variance}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Confiance:</span>
                      <Progress value={pred.confidence} className="flex-1 h-2" />
                      <span className="text-xs font-medium">{pred.confidence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommandations stratégiques */}
          <Card>
            <CardHeader>
              <CardTitle>Recommandations Stratégiques IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Bot className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Optimisation trésorerie Q4</p>
                    <p className="text-sm text-muted-foreground">
                      Recommandation de placement à court terme pour optimiser les rendements (+€12K potentiel)
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Appliquer</Button>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <Bot className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Révision stratégie recouvrement</p>
                    <p className="text-sm text-muted-foreground">
                      Ajustement des seuils de relance basé sur l'analyse comportementale (-15% impayés)
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Analyser</Button>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Bot className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Opportunité tarifaire formations</p>
                    <p className="text-sm text-muted-foreground">
                      Analyse de l'élasticité-prix suggère une augmentation de 5% sans impact sur la demande
                    </p>
                  </div>
                  <Button size="sm" variant="outline">Simuler</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          {/* Configuration système */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  Configuration Centrale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Plan Comptable Français 2014</span>
                  <Badge variant="default">Activé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Workflows intelligents</span>
                  <Badge variant="default">Configuré</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Templates adaptatifs</span>
                  <Badge variant="secondary">En apprentissage</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Moteur de règles no-code</span>
                  <Badge variant="default">Opérationnel</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  Sécurité & Conformité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Chiffrement AES-256</span>
                  <Badge variant="default">Actif</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Trail</span>
                  <Badge variant="default">Complet</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Conformité RGPD</span>
                  <Badge variant="default">Certifié</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sauvegarde auto</span>
                  <Badge variant="default">Quotidienne</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          {/* Monitoring système */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-500" />
                Métriques Système Temps Réel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {systemMetrics.map((metric, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                    <div className="text-xs text-green-600 mt-1">{metric.change}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Intégrations */}
          <Card>
            <CardHeader>
              <CardTitle>Interfaces d'Intégration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <Database className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h4 className="font-medium">APIs REST</h4>
                  <p className="text-sm text-muted-foreground">Connecteurs tiers actifs</p>
                  <Badge variant="default" className="mt-2">12 connectés</Badge>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <h4 className="font-medium">Webhooks</h4>
                  <p className="text-sm text-muted-foreground">Événements temps réel</p>
                  <Badge variant="default" className="mt-2">8 configurés</Badge>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <Users className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <h4 className="font-medium">SSO</h4>
                  <p className="text-sm text-muted-foreground">Authentification unique</p>
                  <Badge variant="default" className="mt-2">SAML/OAuth</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}