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
  Trophy,
  Eye,
  Edit,
  Euro,
  Calendar,
  User
} from 'lucide-react';

export default function Awards() {
  const [searchTerm, setSearchTerm] = useState('');

  const awards = [
    {
      id: '1',
      studentName: 'Marie Dubois',
      studentNumber: 'ETU240001',
      scholarshipName: 'Bourse d\'excellence académique',
      amount: 5000,
      awardDate: '2024-01-15',
      disbursementDate: '2024-02-01',
      status: 'disbursed',
      academicYear: '2023-2024'
    },
    {
      id: '2',
      studentName: 'Jean Martin',
      studentNumber: 'ETU240002',
      scholarshipName: 'Aide sociale étudiante',
      amount: 2500,
      awardDate: '2024-01-10',
      disbursementDate: null,
      status: 'approved',
      academicYear: '2023-2024'
    },
    {
      id: '3',
      studentName: 'Sophie Laurent',
      studentNumber: 'ETU240003',
      scholarshipName: 'Bourse recherche et innovation',
      amount: 7500,
      awardDate: '2024-01-20',
      disbursementDate: '2024-02-15',
      status: 'disbursed',
      academicYear: '2023-2024'
    }
  ];

  const stats = [
    {
      label: "Attributions totales",
      value: awards.length.toString(),
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "Montant total attribué",
      value: `€${awards.reduce((sum, a) => sum + a.amount, 0).toLocaleString()}`,
      change: "+45%",
      changeType: "positive" as const
    },
    {
      label: "Bourses versées",
      value: awards.filter(a => a.status === 'disbursed').length.toString(),
      change: "+5",
      changeType: "positive" as const
    },
    {
      label: "En attente de versement",
      value: awards.filter(a => a.status === 'approved').length.toString(),
      change: "0",
      changeType: "neutral" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-yellow-100 text-yellow-700 border-yellow-200",
      disbursed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200"
    };
    const labels = {
      approved: "Approuvée",
      disbursed: "Versée",
      cancelled: "Annulée"
    };
    return { variant: variants[status as keyof typeof variants], label: labels[status as keyof typeof labels] };
  };

  const filteredAwards = awards.filter(award =>
    award.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Attributions de bourses"
          subtitle="Suivi des bourses attribuées et versements"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle attribution"
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
                    placeholder="Rechercher par étudiant ou bourse..."
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
                  <Calendar className="w-4 h-4" />
                  Année académique
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des attributions */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[rgb(245,158,11)]" />
              Bourses attribuées ({filteredAwards.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAwards.map((award) => {
                const statusInfo = getStatusBadge(award.status);
                return (
                  <div
                    key={award.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                        <Trophy className="w-5 h-5 text-[rgb(245,158,11)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{award.studentName}</p>
                          <Badge variant="outline" className="text-xs">
                            {award.studentNumber}
                          </Badge>
                          <Badge className={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {award.scholarshipName}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {award.amount.toLocaleString()}€
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Attribution: {new Date(award.awardDate).toLocaleDateString('fr-FR')}
                          </span>
                          {award.disbursementDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Versement: {new Date(award.disbursementDate).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                          <span>Année: {award.academicYear}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Voir
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Edit className="w-3 h-3" />
                        Modifier
                      </Button>
                      {award.status === 'approved' && (
                        <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                          <Euro className="w-3 h-3" />
                          Verser
                        </Button>
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