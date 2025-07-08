import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText,
  Search,
  Plus,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Clock
} from 'lucide-react';
import { useTeacherContracts } from '@/hooks/hr/useTeacherContracts';
import { useContractTypes } from '@/hooks/hr/useContractTypes';
import { useToast } from '@/hooks/use-toast';

export default function Contracts() {
  const { contracts, loading: contractsLoading, error: contractsError } = useTeacherContracts();
  const { contractTypes, loading: typesLoading } = useContractTypes();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredContracts = contracts.filter(contract =>
    contract.teacher_profile?.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.teacher_profile?.employee_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.contract_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Brouillon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Expiré</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Résilié</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Suspendu</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const stats = [
    {
      label: "Total contrats",
      value: contracts.length,
      icon: FileText
    },
    {
      label: "Contrats actifs",
      value: contracts.filter(c => c.status === 'active').length,
      icon: FileText
    },
    {
      label: "Types de contrats",
      value: contractTypes.filter(t => t.is_active).length,
      icon: FileText
    }
  ];

  const loading = contractsLoading || typesLoading;

  if (loading) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center">Chargement...</div>
        </div>
      </ModuleLayout>
    );
  }

  if (contractsError) {
    return (
      <ModuleLayout sidebar={<HrModuleSidebar />}>
        <div className="p-8">
          <div className="text-center text-red-600">Erreur: {contractsError}</div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Contrats</h1>
            <p className="text-muted-foreground mt-1">Gérer les contrats des enseignants</p>
          </div>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-white"
            onClick={() => toast({
              title: "Nouveau contrat",
              description: "Fonctionnalité de création de contrat en développement",
            })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau contrat
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par enseignant, numéro de contrat ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Liste des Contrats ({filteredContracts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">
                          {contract.teacher_profile?.profile?.full_name || 'Enseignant non défini'}
                        </h3>
                        {getStatusBadge(contract.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">N°:</span> {contract.teacher_profile?.employee_number}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {contract.contract_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {contract.monthly_salary ? `${contract.monthly_salary.toLocaleString('fr-FR')} €/mois` : 
                           contract.hourly_rate ? `${contract.hourly_rate.toLocaleString('fr-FR')} €/h` : 'Non défini'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {contract.weekly_hours}h/semaine
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Du {new Date(contract.start_date).toLocaleDateString('fr-FR')}
                          {contract.end_date && ` au ${new Date(contract.end_date).toLocaleDateString('fr-FR')}`}
                        </span>
                        {contract.signed_date && (
                          <span className="text-green-600">
                            Signé le: {new Date(contract.signed_date).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: "Voir contrat",
                        description: "Affichage des détails du contrat en développement",
                      })}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: "Modifier contrat",
                        description: "Modification du contrat en développement",
                      })}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredContracts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun contrat trouvé</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}