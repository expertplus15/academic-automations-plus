import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  Code,
  TrendingUp,
  Clock,
  Brain
} from 'lucide-react';

interface ValidationRule {
  id: string;
  name: string;
  type: 'threshold' | 'pattern' | 'consistency' | 'statistical';
  isActive: boolean;
  description: string;
  conditions: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  autoFix: boolean;
}

export function AutoValidationEngine() {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedRule, setSelectedRule] = useState<string | null>(null);
  
  const [rules, setRules] = useState<ValidationRule[]>([
    {
      id: '1',
      name: 'Vérification des notes aberrantes',
      type: 'statistical',
      isActive: true,
      description: 'Détecte les notes qui s\'écartent de plus de 2 écarts-types de la moyenne',
      conditions: { threshold: 2, metric: 'standard_deviation' },
      severity: 'warning',
      autoFix: false
    },
    {
      id: '2',
      name: 'Cohérence inter-matières',
      type: 'consistency',
      isActive: true,
      description: 'Vérifie la cohérence des notes entre matières liées',
      conditions: { max_deviation: 5, related_subjects: [] },
      severity: 'info',
      autoFix: false
    },
    {
      id: '3',
      name: 'Format des notes',
      type: 'pattern',
      isActive: true,
      description: 'Valide le format et la plage des notes saisies',
      conditions: { min: 0, max: 20, decimal_places: 2 },
      severity: 'error',
      autoFix: true
    },
    {
      id: '4',
      name: 'Seuil de réussite',
      type: 'threshold',
      isActive: true,
      description: 'Alerte si le taux de réussite est anormalement bas',
      conditions: { min_success_rate: 60 },
      severity: 'critical',
      autoFix: false
    }
  ]);

  const stats = {
    totalRules: rules.length,
    activeRules: rules.filter(r => r.isActive).length,
    autoFixEnabled: rules.filter(r => r.autoFix).length,
    lastRun: '2024-01-15T14:30:00Z',
    processed: 1247,
    validated: 1201,
    flagged: 46
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const toggleAutoFix = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, autoFix: !rule.autoFix } : rule
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'statistical': return <TrendingUp className="w-4 h-4" />;
      case 'consistency': return <CheckCircle className="w-4 h-4" />;
      case 'pattern': return <Code className="w-4 h-4" />;
      case 'threshold': return <AlertTriangle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Engine Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Moteur de Validation Automatique
              </CardTitle>
              <CardDescription>
                Configuration et gestion des règles de validation intelligente
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isRunning ? "default" : "secondary"}>
                {isRunning ? 'Actif' : 'Arrêté'}
              </Badge>
              <Button
                onClick={() => setIsRunning(!isRunning)}
                variant={isRunning ? "destructive" : "default"}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Démarrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalRules}</p>
              <p className="text-sm text-muted-foreground">Règles totales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.activeRules}</p>
              <p className="text-sm text-muted-foreground">Actives</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.autoFixEnabled}</p>
              <p className="text-sm text-muted-foreground">Auto-correction</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.processed}</p>
              <p className="text-sm text-muted-foreground">Traitées</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.validated}</p>
              <p className="text-sm text-muted-foreground">Validées</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.flagged}</p>
              <p className="text-sm text-muted-foreground">Signalées</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Dernière exécution: {new Date(stats.lastRun).toLocaleString()}</span>
            <span>Temps moyen: 0.3s par validation</span>
          </div>
        </CardContent>
      </Card>

      {/* Rules Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Règles de Validation</CardTitle>
              <CardDescription>
                Configurez les règles automatiques pour la validation des données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <Card key={rule.id} className="border border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {getTypeIcon(rule.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{rule.name}</h3>
                              <Badge className={getSeverityColor(rule.severity)}>
                                {rule.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {rule.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`autofix-${rule.id}`} className="text-xs">
                              Auto-fix
                            </Label>
                            <Switch
                              id={`autofix-${rule.id}`}
                              checked={rule.autoFix}
                              onCheckedChange={() => toggleAutoFix(rule.id)}
                              disabled={!rule.isActive}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`active-${rule.id}`} className="text-xs">
                              Actif
                            </Label>
                            <Switch
                              id={`active-${rule.id}`}
                              checked={rule.isActive}
                              onCheckedChange={() => toggleRule(rule.id)}
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRule(rule.id)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Ajouter une Nouvelle Règle
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Rule Editor */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Configuration Règle</CardTitle>
              <CardDescription>
                {selectedRule ? 'Modifiez les paramètres de la règle sélectionnée' : 'Sélectionnez une règle à configurer'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedRule ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="rule-name">Nom de la règle</Label>
                    <Input id="rule-name" placeholder="Nom de la règle" />
                  </div>
                  
                  <div>
                    <Label htmlFor="rule-type">Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de règle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="threshold">Seuil</SelectItem>
                        <SelectItem value="pattern">Motif</SelectItem>
                        <SelectItem value="consistency">Cohérence</SelectItem>
                        <SelectItem value="statistical">Statistique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="rule-severity">Sévérité</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Niveau de sévérité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Avertissement</SelectItem>
                        <SelectItem value="error">Erreur</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="rule-description">Description</Label>
                    <Textarea 
                      id="rule-description" 
                      placeholder="Description de la règle"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rule-conditions">Conditions (JSON)</Label>
                    <Textarea 
                      id="rule-conditions" 
                      placeholder='{"threshold": 2, "metric": "standard_deviation"}'
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedRule(null)}>
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Sélectionnez une règle pour la configurer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}