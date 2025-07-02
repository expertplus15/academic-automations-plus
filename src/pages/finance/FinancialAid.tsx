import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  HandHeart,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';

export default function FinancialAid() {
  const [searchTerm, setSearchTerm] = useState('');

  const aidRequests = [
    {
      id: '1',
      studentName: 'Marie Dubois',
      studentNumber: 'ETU240001',
      aidType: 'emergency',
      amount: 1500,
      applicationDate: '2024-01-15',
      status: 'pending',
      reason: 'Difficultés financières familiales'
    },
    {
      id: '2',
      studentName: 'Jean Martin',
      studentNumber: 'ETU240002',
      aidType: 'housing',
      amount: 2000,
      applicationDate: '2024-01-10',
      status: 'approved',
      reason: 'Aide pour frais de logement'
    },
    {
      id: '3',
      studentName: 'Sophie Laurent',
      studentNumber: 'ETU240003',
      aidType: 'academic',
      amount: 800,
      applicationDate: '2024-01-20',
      status: 'rejected',
      reason: 'Matériel pédagogique spécialisé'
    }
  ];

  const stats = [
    {
      label: "Demandes en cours",
      value: aidRequests.filter(r => r.status === 'pending').length.toString(),
      change: "+3",
      changeType: "neutral" as const
    },
    {
      label: "Montant total approuvé",
      value: `€${aidRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}`,
      change: "+25%",
      changeType: "positive" as const
    },
    {
      label: "Taux d'approbation",
      value: "65%",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      label: "Délai moyen",
      value: "7 jours",
      change: "-2j",
      changeType: "positive" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      approved: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200"
    };
    const labels = {
      pending: "En attente",
      approved: "Approuvée",
      rejected: "Rejetée"
    };
    return { variant: variants[status as keyof typeof variants], label: labels[status as keyof typeof labels] };
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      emergency: "Urgence",
      housing: "Logement",
      academic: "Académique",
      medical: "Médical"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredRequests = aidRequests.filter(request =>
    request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Demandes d'aide financière"
          subtitle="Gestion des demandes d'aide et d'urgence"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle demande"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par étudiant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
                <Button variant="outline" className="gap-2">
                  <HandHeart className="w-4 h-4" />
                  Type d'aide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des demandes */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HandHeart className="w-5 h-5 text-[rgb(245,158,11)]" />
              Demandes d'aide ({filteredRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const statusInfo = getStatusBadge(request.status);
                return (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                        <HandHeart className="w-5 h-5 text-[rgb(245,158,11)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{request.studentName}</p>
                          <Badge variant="outline" className="text-xs">
                            {request.studentNumber}
                          </Badge>
                          <Badge className={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                          <span>Type: {getTypeLabel(request.aidType)}</span>
                          <span>Montant: €{request.amount.toLocaleString()}</span>
                          <span>Demande: {new Date(request.applicationDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                          {request.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Détails
                      </Button>
                      {request.status === 'pending' && (
                        <>
                          <Button size="sm" variant="outline" className="gap-1 text-green-600 hover:text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            Approuver
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700">
                            <XCircle className="w-3 h-3" />
                            Rejeter
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}