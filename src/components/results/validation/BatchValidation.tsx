import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  X, 
  AlertTriangle, 
  Clock,
  Filter,
  MessageSquare,
  Users
} from 'lucide-react';
import { useRealTimeValidation } from '@/hooks/useRealTimeValidation';

export function BatchValidation() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [comments, setComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  const {
    pendingItems,
    loading,
    batchApprove,
    batchReject
  } = useRealTimeValidation();

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

  const handleBatchApprove = async () => {
    await batchApprove(selectedItems, comments);
    setSelectedItems([]);
    setComments('');
    setShowApprovalDialog(false);
  };

  const handleBatchReject = async () => {
    if (!rejectionReason.trim()) return;
    await batchReject(selectedItems, rejectionReason);
    setSelectedItems([]);
    setRejectionReason('');
    setShowRejectionDialog(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const selectedItemsData = pendingItems.filter(item => selectedItems.includes(item.id));
  const totalStudents = selectedItemsData.reduce((sum, item) => sum + item.studentCount, 0);
  const totalAnomalies = selectedItemsData.reduce((sum, item) => sum + item.anomalies, 0);

  return (
    <div className="space-y-6">
      {/* Selection Summary */}
      {selectedItems.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900">
                    {selectedItems.length} élément(s) sélectionné(s)
                  </h3>
                  <p className="text-sm text-blue-700">
                    {totalStudents} étudiants • {totalAnomalies} anomalie(s)
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={() => setShowApprovalDialog(true)}
                  disabled={loading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approuver Tout
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowRejectionDialog(true)}
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Rejeter Tout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedItems([])}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Batch Validation Interface */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Validation par Lot</CardTitle>
              <CardDescription>
                Sélectionnez les éléments à valider en groupe pour un traitement efficace
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                {pendingItems.length} éléments disponibles
              </Badge>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Select All */}
          {pendingItems.length > 0 && (
            <div className="flex items-center space-x-2 pb-4 border-b mb-4">
              <Checkbox
                id="select-all"
                checked={selectedItems.length === pendingItems.length}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                Sélectionner tout ({pendingItems.length} éléments)
              </label>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {pendingItems.map((item) => (
              <Card 
                key={item.id} 
                className={`border transition-all cursor-pointer hover:shadow-md ${
                  selectedItems.includes(item.id) 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-border/50'
                }`}
                onClick={() => handleItemSelect(item.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {item.studentCount} étudiants
                          </span>
                          <span>Par {item.submittedBy}</span>
                          {item.estimatedTime && (
                            <span>~{item.estimatedTime}min</span>
                          )}
                          <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority === 'urgent' ? 'Urgent' : 
                         item.priority === 'high' ? 'Élevée' :
                         item.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                      
                      {item.anomalies > 0 && (
                        <Badge className="bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {item.anomalies} anomalies
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pendingItems.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun élément en attente de validation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver la sélection</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point d'approuver {selectedItems.length} élément(s) 
              concernant {totalStudents} étudiant(s).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Commentaires (optionnel)</label>
              <Textarea
                placeholder="Ajoutez un commentaire pour cette approbation..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
              />
            </div>
            
            {totalAnomalies > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Attention: {totalAnomalies} anomalie(s) détectée(s)
                  </span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Assurez-vous que ces anomalies ont été vérifiées avant d'approuver.
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleBatchApprove} disabled={loading}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approuver {selectedItems.length} élément(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la sélection</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de rejeter {selectedItems.length} élément(s).
              Veuillez préciser la raison du rejet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Raison du rejet *</label>
              <Textarea
                placeholder="Expliquez pourquoi ces éléments sont rejetés..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleBatchReject} 
              disabled={loading || !rejectionReason.trim()}
            >
              <X className="w-4 h-4 mr-2" />
              Rejeter {selectedItems.length} élément(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}