
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  FileCheck, 
  TrendingUp,
  Eye,
  Download
} from 'lucide-react';
import { useRealTimeValidation } from '@/hooks/useRealTimeValidation';

export function GradeValidationSystem() {
  const {
    metrics,
    pendingItems,
    loading,
    autoValidate,
    batchApprove,
    batchReject,
    refreshData
  } = useRealTimeValidation();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedItems.length === pendingItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pendingItems.map(item => item.id));
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transcript': return FileCheck;
      case 'bulletin': return FileCheck;
      case 'certificate': return FileCheck;
      default: return FileCheck;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approuvées</p>
                <p className="text-2xl font-bold text-green-600">{metrics.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Anomalies</p>
                <p className="text-2xl font-bold text-red-600">{metrics.anomalies}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score qualité</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.qualityScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progression de la validation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Activité du jour</span>
              <span>{metrics.todayActivity} validations</span>
            </div>
            <Progress value={metrics.qualityScore} className="h-2" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">{metrics.approved}</div>
                <div className="text-muted-foreground">Approuvées</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-600">{metrics.pending}</div>
                <div className="text-muted-foreground">En attente</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-red-600">{metrics.rejected}</div>
                <div className="text-muted-foreground">Rejetées</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Validations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Validations en attente</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                Actualiser
              </Button>
              {selectedItems.length > 0 && (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => batchApprove(selectedItems, 'Validation en lot')}
                  >
                    Approuver ({selectedItems.length})
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => batchReject(selectedItems, 'Rejet en lot')}
                  >
                    Rejeter ({selectedItems.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pendingItems.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Toutes les validations sont à jour</h3>
              <p className="text-muted-foreground">Aucune validation en attente</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === pendingItems.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-muted-foreground">
                  Sélectionner tout ({pendingItems.length} éléments)
                </span>
              </div>

              {pendingItems.map((item) => {
                const IconComponent = getTypeIcon(item.type);
                return (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleItemSelect(item.id)}
                      className="rounded border-gray-300"
                    />
                    
                    <IconComponent className="w-5 h-5 text-muted-foreground" />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <Badge variant={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        {item.anomalies > 0 && (
                          <Badge variant="destructive">
                            {item.anomalies} anomalie{item.anomalies > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.studentCount} étudiants • Soumis par {item.submittedBy}
                        {item.estimatedTime && ` • ${item.estimatedTime} min estimées`}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(item.submittedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => batchApprove([item.id])}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileCheck className="w-6 h-6" />
              <span>Valider tout automatiquement</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Download className="w-6 h-6" />
              <span>Exporter les validations</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Rapport de qualité</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
