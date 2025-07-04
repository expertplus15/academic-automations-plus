import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export function AutomationDashboard() {
  const [automationRules, setAutomationRules] = useState([
    {
      id: '1',
      name: 'Alertes contrats expirants',
      description: 'Notification 30 jours avant expiration des contrats',
      type: 'contract_expiry',
      isActive: true,
      lastRun: '2024-01-15 08:00:00',
      nextRun: '2024-01-16 08:00:00',
      status: 'running',
      triggers: 2
    },
    {
      id: '2',
      name: 'Rappels évaluations',
      description: 'Rappel pour les évaluations en retard',
      type: 'evaluation_reminder',
      isActive: true,
      lastRun: '2024-01-15 09:00:00',
      nextRun: '2024-01-16 09:00:00',
      status: 'running',
      triggers: 5
    },
    {
      id: '3',
      name: 'Maintenance préventive',
      description: 'Planification automatique des maintenances',
      type: 'maintenance_schedule',
      isActive: false,
      lastRun: '2024-01-14 10:00:00',
      nextRun: null,
      status: 'paused',
      triggers: 0
    },
    {
      id: '4',
      name: 'Validation réservations',
      description: 'Approbation automatique selon critères',
      type: 'booking_approval',
      isActive: true,
      lastRun: '2024-01-15 11:30:00',
      nextRun: '2024-01-15 12:30:00',
      status: 'running',
      triggers: 12
    }
  ]);

  const toggleRule = (id: string) => {
    setAutomationRules(prev => 
      prev.map(rule => 
        rule.id === id 
          ? { 
              ...rule, 
              isActive: !rule.isActive, 
              status: !rule.isActive ? 'running' : 'paused',
              nextRun: !rule.isActive ? new Date(Date.now() + 3600000).toISOString() : null
            }
          : rule
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Actif
        </Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          <Pause className="w-3 h-3 mr-1" />
          Pausé
        </Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Erreur
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = [
    {
      label: "Règles actives",
      value: automationRules.filter(r => r.isActive).length,
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Exécutions aujourd'hui",
      value: automationRules.reduce((sum, r) => sum + r.triggers, 0),
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Règles en pause",
      value: automationRules.filter(r => !r.isActive).length,
      icon: Pause,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      label: "Taux de succès",
      value: "98%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Automation Rules */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Règles d'automatisation
            </CardTitle>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {automationRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{rule.name}</h3>
                      {getStatusBadge(rule.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {rule.lastRun && (
                        <span>
                          <span className="font-medium">Dernière exécution:</span> {new Date(rule.lastRun).toLocaleString('fr-FR')}
                        </span>
                      )}
                      {rule.nextRun && (
                        <span>
                          <span className="font-medium">Prochaine:</span> {new Date(rule.nextRun).toLocaleString('fr-FR')}
                        </span>
                      )}
                      <span>
                        <span className="font-medium">Déclenchements:</span> {rule.triggers}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}