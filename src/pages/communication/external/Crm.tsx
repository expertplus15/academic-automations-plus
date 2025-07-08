import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Building, 
  Plus, 
  FileText, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MessageSquare,
  Video,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Edit,
  Trash2,
  Eye,
  Users
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { usePartners } from '@/hooks/communication/usePartners';
import { useState, useEffect } from 'react';
import { PartnerForm } from '@/components/communication/PartnerForm';
import { PartnerDetailsModal } from '@/components/communication/PartnerDetailsModal';
import { InteractionHistory } from '@/components/communication/InteractionHistory';

export default function CommunicationCrm() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  const { 
    partners, 
    loading, 
    fetchPartners, 
    createPartner, 
    updatePartner, 
    deletePartner 
  } = usePartners();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isInteractionHistoryOpen, setIsInteractionHistoryOpen] = useState(false);

  const canManagePartners = hasRole(['admin', 'hr']);

  useEffect(() => {
    fetchPartners({
      type: typeFilter || undefined,
      status: statusFilter || undefined
    });
  }, [fetchPartners, typeFilter, statusFilter]);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         partner.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (partner.email && partner.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleRestrictedAction = (action: string) => {
    if (!canManagePartners) {
      toast({
        title: "Accès refusé",
        description: `Vous n'avez pas les permissions pour ${action}`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleCreatePartner = async (data: any) => {
    if (!handleRestrictedAction("créer des partenaires")) return;
    
    try {
      await createPartner(data);
      setIsPartnerFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleUpdatePartner = async (id: string, data: any) => {
    if (!handleRestrictedAction("modifier des partenaires")) return;
    
    try {
      await updatePartner(id, data);
      setSelectedPartner(null);
      setIsPartnerFormOpen(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!handleRestrictedAction("supprimer des partenaires")) return;
    
    try {
      await deletePartner(id);
      toast({
        title: "Partenaire supprimé",
        description: "Le partenaire a été supprimé avec succès",
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'STAGE': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'EMPLOI': return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'PARTENARIAT': return 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300';
      case 'FOURNISSEUR': return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      default: return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIF': return 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300';
      case 'INACTIF': return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
      case 'PROSPECT': return 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300';
      case 'CLIENT': return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      default: return 'bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  const exportData = () => {
    const dataToExport = filteredPartners.map(partner => ({
      nom: partner.name,
      entreprise: partner.company,
      email: partner.email,
      telephone: partner.phone,
      secteur: partner.sector,
      type: partner.type,
      statut: partner.status,
      cree_le: partner.created_at
    }));

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'partenaires-crm.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export réussi",
      description: `${dataToExport.length} partenaires exportés`,
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="CRM Partenaires" 
          subtitle="Communication et relations avec les partenaires externes" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header with Actions */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Relations Partenaires</h2>
                <p className="text-muted-foreground">Gérez vos communications avec les entreprises partenaires ({partners.length} contacts)</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" onClick={() => {
                  toast({
                    title: "Message groupé",
                    description: "Fonctionnalité de messagerie en développement",
                  });
                }}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Groupé
                </Button>
                <Dialog open={isPartnerFormOpen} onOpenChange={setIsPartnerFormOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        if (!handleRestrictedAction("ajouter des partenaires")) return;
                        setSelectedPartner(null);
                      }}
                      disabled={!canManagePartners}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nouveau Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedPartner ? 'Modifier le contact' : 'Nouveau contact partenaire'}
                      </DialogTitle>
                    </DialogHeader>
                    <PartnerForm
                      partner={selectedPartner}
                      onSubmit={selectedPartner 
                        ? (data) => handleUpdatePartner(selectedPartner.id, data)
                        : handleCreatePartner
                      }
                      onCancel={() => {
                        setIsPartnerFormOpen(false);
                        setSelectedPartner(null);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                      <p className="text-2xl font-bold">{partners.length}</p>
                    </div>
                    <Building className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contacts Actifs</p>
                      <p className="text-2xl font-bold">
                        {partners.filter(p => p.status === 'ACTIF').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Prospects</p>
                      <p className="text-2xl font-bold">
                        {partners.filter(p => p.status === 'PROSPECT').length}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Partenariats</p>
                      <p className="text-2xl font-bold">
                        {partners.filter(p => p.type === 'PARTENARIAT').length}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher un contact partenaire..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Type de relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous types</SelectItem>
                      <SelectItem value="STAGE">Stages</SelectItem>
                      <SelectItem value="EMPLOI">Emplois</SelectItem>
                      <SelectItem value="PARTENARIAT">Partenariats</SelectItem>
                      <SelectItem value="FOURNISSEUR">Fournisseurs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tous statuts</SelectItem>
                      <SelectItem value="ACTIF">Actif</SelectItem>
                      <SelectItem value="INACTIF">Inactif</SelectItem>
                      <SelectItem value="PROSPECT">Prospect</SelectItem>
                      <SelectItem value="CLIENT">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('');
                    setStatusFilter('');
                  }}>
                    <Filter className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Partners Communication List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Contacts & Communications</span>
                  {loading && <div className="text-sm text-muted-foreground">Chargement...</div>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPartners.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {searchQuery || typeFilter || statusFilter 
                        ? 'Aucun partenaire trouvé avec ces critères' 
                        : 'Aucun partenaire enregistré'}
                    </p>
                    {canManagePartners && !searchQuery && !typeFilter && !statusFilter && (
                      <Button 
                        className="mt-4" 
                        onClick={() => setIsPartnerFormOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter le premier partenaire
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPartners.map((partner) => (
                      <div key={partner.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{partner.name}</h3>
                            <p className="text-sm text-muted-foreground">{partner.company} • {partner.sector}</p>
                            <div className="flex items-center gap-4 mt-1">
                              {partner.email && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {partner.email}
                                </div>
                              )}
                              {partner.phone && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Phone className="h-3 w-3" />
                                  {partner.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col gap-1">
                            <Badge className={getTypeColor(partner.type)}>
                              {partner.type}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(partner.status)}>
                              {partner.status}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Créé le {new Date(partner.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedPartner(partner);
                                setIsDetailsModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedPartner(partner);
                                setIsInteractionHistoryOpen(true);
                              }}
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedPartner(partner);
                                setIsDetailsModalOpen(true);
                              }}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir détails
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setSelectedPartner(partner);
                                setIsInteractionHistoryOpen(true);
                              }}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Historique
                              </DropdownMenuItem>
                              {canManagePartners && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedPartner(partner);
                                    setIsPartnerFormOpen(true);
                                  }}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600" 
                                    onClick={() => handleDeletePartner(partner.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partner Details Modal */}
            <PartnerDetailsModal
              partner={selectedPartner}
              open={isDetailsModalOpen}
              onOpenChange={setIsDetailsModalOpen}
            />

            {/* Interaction History Modal */}
            <InteractionHistory
              partner={selectedPartner}
              open={isInteractionHistoryOpen}
              onOpenChange={setIsInteractionHistoryOpen}
            />
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}