import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Settings
} from 'lucide-react';
import { useAdvancedProcessing } from '@/hooks/useAdvancedProcessing';
import { useToast } from '@/hooks/use-toast';

export function AIModelsPanel() {
  const { aiModels, loading, retrainModel } = useAdvancedProcessing();
  const { toast } = useToast();
  const [retrainingModels, setRetrainingModels] = useState<Set<string>>(new Set());

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'training':
        return <RotateCcw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'inactive':
        return <Pause className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'training':
        return 'outline';
      case 'inactive':
        return 'secondary';
      default:
        return 'destructive';
    }
  };

  const getModelTypeLabel = (type: string) => {
    switch (type) {
      case 'anomaly_detection':
        return 'Détection d\'anomalies';
      case 'grade_prediction':
        return 'Prédiction de notes';
      case 'dropout_risk':
        return 'Risque d\'abandon';
      case 'recommendation':
        return 'Recommandations';
      default:
        return type;
    }
  };

  const handleRetrain = async (modelId: string) => {
    try {
      setRetrainingModels(prev => new Set(prev).add(modelId));
      await retrainModel(modelId);
      toast({
        title: "Entraînement lancé",
        description: "Le modèle IA est en cours de réentraînement",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de lancer l'entraînement du modèle",
        variant: "destructive",
      });
    } finally {
      setRetrainingModels(prev => {
        const newSet = new Set(prev);
        newSet.delete(modelId);
        return newSet;
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          Modèles d'Intelligence Artificielle
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiModels.map((model) => (
            <div key={model.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium">{model.name}</h4>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{getModelTypeLabel(model.type)}</span>
                      <span>•</span>
                      <span>v{model.version}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(model.status)}
                  <Badge variant={getStatusColor(model.status) as any}>
                    {model.status === 'active' && 'Actif'}
                    {model.status === 'training' && 'Entraînement'}
                    {model.status === 'inactive' && 'Inactif'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{model.accuracy}%</p>
                  <p className="text-xs text-muted-foreground">Précision</p>
                </div>
                {model.training_data_size && (
                  <div className="text-center">
                    <p className="text-2xl font-bold">{(model.training_data_size / 1000).toFixed(0)}k</p>
                    <p className="text-xs text-muted-foreground">Données</p>
                  </div>
                )}
                {model.last_trained_at && (
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {new Date(model.last_trained_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Dernier entraînement</p>
                  </div>
                )}
                <div className="text-center">
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRetrain(model.id)}
                      disabled={model.status === 'training' || retrainingModels.has(model.id)}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {Object.keys(model.performance_metrics).length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm font-medium mb-2">Métriques de performance</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {Object.entries(model.performance_metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-2 bg-muted rounded">
                        <p className="font-medium">{typeof value === 'number' ? value.toFixed(3) : value}</p>
                        <p className="text-muted-foreground">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}