import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Clock,
  TrendingUp,
  User,
  GraduationCap,
  Calendar
} from 'lucide-react';
import { useAdvancedProcessing } from '@/hooks/useAdvancedProcessing';
import { useToast } from '@/hooks/use-toast';

export function AnomalyDetectionPanel() {
  const { anomalies, loading, resolveAnomaly } = useAdvancedProcessing();
  const { toast } = useToast();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'low':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'investigating':
        return <Eye className="w-4 h-4 text-blue-600" />;
      case 'false_positive':
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'grade':
        return <GraduationCap className="w-4 h-4" />;
      case 'attendance':
        return <Calendar className="w-4 h-4" />;
      case 'student':
        return <User className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleResolve = async (anomalyId: string) => {
    try {
      await resolveAnomaly(anomalyId, 'Résolu par l\'utilisateur');
      toast({
        title: "Anomalie résolue",
        description: "L'anomalie a été marquée comme résolue",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de résoudre l'anomalie",
        variant: "destructive",
      });
    }
  };

  const filteredAnomalies = selectedSeverity === 'all' 
    ? anomalies 
    : anomalies.filter(a => a.severity === selectedSeverity);

  const anomaliesByStatus = {
    new: filteredAnomalies.filter(a => a.status === 'new'),
    investigating: filteredAnomalies.filter(a => a.status === 'investigating'),
    resolved: filteredAnomalies.filter(a => a.status === 'resolved'),
    false_positive: filteredAnomalies.filter(a => a.status === 'false_positive'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Détection d'Anomalies
        </CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={selectedSeverity === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedSeverity('all')}
          >
            Toutes
          </Button>
          <Button
            size="sm"
            variant={selectedSeverity === 'critical' ? 'destructive' : 'outline'}
            onClick={() => setSelectedSeverity('critical')}
          >
            Critiques
          </Button>
          <Button
            size="sm"
            variant={selectedSeverity === 'high' ? 'destructive' : 'outline'}
            onClick={() => setSelectedSeverity('high')}
          >
            Élevées
          </Button>
          <Button
            size="sm"
            variant={selectedSeverity === 'medium' ? 'secondary' : 'outline'}
            onClick={() => setSelectedSeverity('medium')}
          >
            Moyennes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="new" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="new" className="flex items-center gap-2">
              <span>Nouvelles</span>
              <Badge variant="destructive" className="text-xs">
                {anomaliesByStatus.new.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="investigating" className="flex items-center gap-2">
              <span>En cours</span>
              <Badge variant="outline" className="text-xs">
                {anomaliesByStatus.investigating.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex items-center gap-2">
              <span>Résolues</span>
              <Badge variant="secondary" className="text-xs">
                {anomaliesByStatus.resolved.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="false_positive" className="flex items-center gap-2">
              <span>Faux positifs</span>
              <Badge variant="outline" className="text-xs">
                {anomaliesByStatus.false_positive.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {Object.entries(anomaliesByStatus).map(([status, statusAnomalies]) => (
            <TabsContent key={status} value={status} className="space-y-3">
              {statusAnomalies.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune anomalie dans cette catégorie</p>
                </div>
              ) : (
                statusAnomalies.map((anomaly) => (
                  <div key={anomaly.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                          {getEntityIcon(anomaly.entity_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getSeverityIcon(anomaly.severity)}
                            <h4 className="font-medium">{anomaly.description}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Type: {anomaly.anomaly_type}</span>
                            <span>Confiance: {(anomaly.confidence_score * 100).toFixed(1)}%</span>
                            <span>
                              Détectée: {new Date(anomaly.detected_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(anomaly.severity) as any}>
                          {anomaly.severity}
                        </Badge>
                        {getStatusIcon(anomaly.status)}
                      </div>
                    </div>

                    {anomaly.metadata && (
                      <div className="mb-3 p-3 bg-muted rounded">
                        <p className="text-sm font-medium mb-2">Détails:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(anomaly.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="text-muted-foreground">{key}:</span>
                              <span className="ml-1 font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {anomaly.suggested_actions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-2">Actions suggérées:</p>
                        <ul className="text-sm space-y-1">
                          {anomaly.suggested_actions.map((action, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <TrendingUp className="w-3 h-3 text-blue-600" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {anomaly.status === 'new' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleResolve(anomaly.id)}
                        >
                          Marquer comme résolu
                        </Button>
                        <Button size="sm" variant="outline">
                          Investiguer
                        </Button>
                        <Button size="sm" variant="outline">
                          Faux positif
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}