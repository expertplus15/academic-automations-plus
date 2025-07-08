import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Search, Package, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useProcurementRequests } from '@/hooks/resources/useProcurementRequests';
import { ProcurementApprovalWorkflow } from './ProcurementApprovalWorkflow';
import { ProcurementFormModal } from './ProcurementFormModal';

export function ProcurementDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [approvalModal, setApprovalModal] = useState<{ isOpen: boolean; request: any }>({
    isOpen: false,
    request: null
  });
  const [createModal, setCreateModal] = useState(false);
  
  const { requests, loading, fetchRequests } = useProcurementRequests();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">
          <FileText className="w-3 h-3 mr-1" />
          Brouillon
        </Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Clock className="w-3 h-3 mr-1" />
          Soumise
        </Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approuvée
        </Badge>;
      case 'ordered':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">
          <Package className="w-3 h-3 mr-1" />
          Commandée
        </Badge>;
      case 'delivered':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Livrée
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Rejetée
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="outline" className="border-red-200 text-red-700">Urgent</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-orange-200 text-orange-700">Élevée</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-yellow-200 text-yellow-700">Moyenne</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-green-200 text-green-700">Faible</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.request_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Demandes en attente",
      value: requests.filter(r => r.status === 'submitted').length,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Approuvées",
      value: requests.filter(r => r.status === 'approved').length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "En commande",
      value: requests.filter(r => r.status === 'ordered').length,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      label: "Budget estimé",
      value: `${requests.reduce((sum, r) => sum + (r.total_amount || 0), 0).toLocaleString()}€`,
      icon: ShoppingCart,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  if (loading) {
    return <div className="p-6">Chargement des demandes d'approvisionnement...</div>;
  }

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

      {/* Filters & Actions */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Achats & Approvisionnements
            </CardTitle>
            <Button className="bg-primary text-primary-foreground" onClick={() => setCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle demande
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par titre ou numéro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
                <SelectItem value="submitted">Soumises</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="ordered">Commandées</SelectItem>
                <SelectItem value="delivered">Livrées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{request.title}</h3>
                      <span className="text-sm text-muted-foreground">({request.request_number})</span>
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        <span className="font-medium">Demandeur:</span> {request.requester?.full_name || 'N/A'}
                      </span>
                      {request.total_amount && (
                        <span>
                          <span className="font-medium">Montant:</span> {request.total_amount.toLocaleString()}€
                        </span>
                      )}
                      {request.expected_delivery_date && (
                        <span>
                          <span className="font-medium">Livraison:</span> {new Date(request.expected_delivery_date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      <span>
                        <span className="font-medium">Quantité:</span> {request.quantity}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => console.log('Modifier', request.id)}>
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setApprovalModal({ isOpen: true, request })}>
                    Détails
                  </Button>
                  {request.status === 'submitted' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white" 
                      onClick={() => setApprovalModal({ isOpen: true, request })}
                    >
                      Approuver
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucune demande d'approvisionnement trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ProcurementFormModal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={() => fetchRequests()}
      />

      <ProcurementApprovalWorkflow
        isOpen={approvalModal.isOpen}
        onClose={() => setApprovalModal({ isOpen: false, request: null })}
        request={approvalModal.request}
        onApproved={() => fetchRequests()}
      />
    </div>
  );
}