import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, AlertCircle, User, Calendar, DollarSign, Package } from 'lucide-react';
import { useProcurementRequests } from '@/hooks/resources/useProcurementRequests';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProcurementApprovalWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  request: any;
  onApproved: () => void;
}

export function ProcurementApprovalWorkflow({ 
  isOpen, 
  onClose, 
  request, 
  onApproved 
}: ProcurementApprovalWorkflowProps) {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { approveRequest, rejectRequest } = useProcurementRequests();
  const { toast } = useToast();

  if (!request) return null;

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await approveRequest(request.id, approvalNotes);
      toast({
        title: "Demande approuvée",
        description: "La demande d'achat a été approuvée avec succès",
      });
      onApproved();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!approvalNotes.trim()) {
      toast({
        title: "Justification requise",
        description: "Veuillez préciser la raison du rejet",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await rejectRequest(request.id, approvalNotes);
      toast({
        title: "Demande rejetée",
        description: "La demande d'achat a été rejetée",
      });
      onApproved();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Approbation de demande d'achat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Overview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{request.title}</h3>
                <p className="text-sm text-muted-foreground">#{request.request_number}</p>
              </div>
              <div className="text-right">
                <Badge className={getPriorityColor(request.priority)}>
                  {request.priority === 'urgent' && 'Urgent'}
                  {request.priority === 'high' && 'Élevée'}
                  {request.priority === 'medium' && 'Moyenne'}
                  {request.priority === 'low' && 'Faible'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Request Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Demandeur</p>
                  <p className="text-sm text-muted-foreground">{request.requester?.full_name || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Date de demande</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(request.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </p>
                </div>
              </div>

              {request.expected_delivery_date && (
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Livraison souhaitée</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(request.expected_delivery_date), 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Montant total</p>
                  <p className="text-lg font-bold text-primary">{request.total_amount.toLocaleString()}€</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Quantité</p>
                  <p className="text-sm text-muted-foreground">{request.quantity} unité(s)</p>
                </div>
              </div>

              {request.supplier_preference && (
                <div>
                  <p className="text-sm font-medium">Fournisseur préféré</p>
                  <p className="text-sm text-muted-foreground">{request.supplier_preference}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
              {request.description}
            </p>
          </div>

          {/* Justification */}
          {request.justification && (
            <div>
              <h4 className="font-medium mb-2">Justification</h4>
              <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                {request.justification}
              </p>
            </div>
          )}

          {/* Approval Notes */}
          <div className="space-y-2">
            <Label htmlFor="approval_notes">Notes d'approbation</Label>
            <Textarea
              id="approval_notes"
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Commentaires sur la demande (optionnel pour approbation, requis pour rejet)..."
              rows={3}
            />
          </div>

          {/* Budget Impact Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Impact budgétaire</h4>
                <p className="text-sm text-blue-700">
                  Cette demande représente {request.total_amount.toLocaleString()}€ sur le budget {request.budget_year}.
                  Vérifiez la disponibilité budgétaire avant approbation.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              disabled={isSubmitting}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejeter
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approuver
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}