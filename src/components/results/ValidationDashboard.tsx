import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertTriangle, Play, BarChart3, Settings, Zap, Brain } from 'lucide-react';
import { useAdvancedGradeValidation } from '@/hooks/useAdvancedGradeValidation';
import { useToast } from '@/hooks/use-toast';

export function ValidationDashboard() {
  const { 
    loading, 
    error, 
    alerts, 
    rules, 
    fetchValidationRules, 
    fetchActiveAlerts, 
    getValidationStatistics,
    resolveAlert,
    acknowledgeAlert 
  } = useAdvancedGradeValidation();
  
  const { toast } = useToast();
  const [validationStatus, setValidationStatus] = useState({
    total: 0,
    validated: 0,
    errors: 0,
    warnings: 0,
    pending: 0
  });

  const validationRules = [
    {
      id: 1,
      name: 'Cohérence des notes',
      description: 'Vérification que les notes sont dans la plage 0-20',
      status: 'passed',
      errors: 0,
      warnings: 3
    },
    {
      id: 2,
      name: 'Présence étudiants',
      description: 'Contrôle de la présence des étudiants inscrits',
      status: 'failed',
      errors: 15,
      warnings: 0
    },
    {
      id: 3,
      name: 'Calculs moyennes',
      description: 'Validation des calculs de moyennes pondérées',
      status: 'warning',
      errors: 0,
      warnings: 8
    },
    {
      id: 4,
      name: 'Dates évaluations',
      description: 'Cohérence des dates d\'évaluation',
      status: 'passed',
      errors: 0,
      warnings: 2
    }
  ];

  const recentValidations = [
    {
      date: '2024-01-15 14:30',
      subject: 'Mathématiques L1',
      type: 'Contrôle automatique',
      status: 'success',
      issues: 2
    },
    {
      date: '2024-01-15 14:25',
      subject: 'Informatique L2',
      type: 'Validation manuelle',
      status: 'error',
      issues: 8
    },
    {
      date: '2024-01-15 14:20',
      subject: 'Physique L1',
      type: 'Contrôle automatique',
      status: 'warning',
      issues: 3
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
      case 'success':
        return 'default';
      case 'failed':
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const progressPercentage = Math.round((validationStatus.validated / validationStatus.total) * 100);

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{validationStatus.total}</p>
                <p className="text-sm text-muted-foreground">Total notes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{validationStatus.validated}</p>
                <p className="text-sm text-muted-foreground">Validées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{validationStatus.errors}</p>
                <p className="text-sm text-muted-foreground">Erreurs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{validationStatus.warnings}</p>
                <p className="text-sm text-muted-foreground">Avertissements</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progression générale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Progression de la validation
            <Badge variant="outline">{progressPercentage}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mb-4" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{validationStatus.validated} notes validées</span>
            <span>{validationStatus.pending} en attente</span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles de validation</TabsTrigger>
          <TabsTrigger value="recent">Validations récentes</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Règles de validation</h3>
            <Button>
              <Play className="w-4 h-4 mr-2" />
              Lancer validation complète
            </Button>
          </div>
          
          <div className="grid gap-4">
            {validationRules.map(rule => (
              <Card key={rule.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(rule.status)}
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {rule.errors > 0 && (
                        <Badge variant="destructive">{rule.errors} erreurs</Badge>
                      )}
                      {rule.warnings > 0 && (
                        <Badge variant="secondary">{rule.warnings} avertissements</Badge>
                      )}
                      {rule.errors === 0 && rule.warnings === 0 && (
                        <Badge variant="default">Conforme</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <h3 className="text-lg font-semibold">Validations récentes</h3>
          
          <div className="space-y-3">
            {recentValidations.map((validation, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(validation.status)}
                      <div>
                        <p className="font-medium">{validation.subject}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{validation.date}</span>
                          <span>{validation.type}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(validation.status) as any}>
                      {validation.issues} problème{validation.issues > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <h3 className="text-lg font-semibold">Rapports de validation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rapport hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Synthèse des validations de la semaine dernière
                </p>
                <Button variant="outline" className="w-full">
                  Télécharger PDF
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analyse des erreurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Détail des types d'erreurs rencontrées
                </p>
                <Button variant="outline" className="w-full">
                  Consulter l'analyse
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}