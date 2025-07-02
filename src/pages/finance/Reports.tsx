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
  FileText,
  Download,
  Eye,
  Calendar,
  Filter
} from 'lucide-react';

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');

  const reports = [
    {
      id: '1',
      name: 'Rapport financier mensuel - Janvier 2024',
      type: 'monthly',
      category: 'Synthèse',
      generatedDate: '2024-02-01',
      period: 'Janvier 2024',
      format: 'PDF',
      size: '2.3 MB',
      status: 'generated'
    },
    {
      id: '2',
      name: 'Analyse des revenus étudiants Q1 2024',
      type: 'quarterly',
      category: 'Revenus',
      generatedDate: '2024-01-15',
      period: 'Q1 2024',
      format: 'Excel',
      size: '1.8 MB',
      status: 'generated'
    },
    {
      id: '3',
      name: 'Rapport des bourses attribuées 2023-2024',
      type: 'annual',
      category: 'Bourses',
      generatedDate: '2024-01-10',
      period: '2023-2024',
      format: 'PDF',
      size: '4.1 MB',
      status: 'generated'
    },
    {
      id: '4',
      name: 'Tableau de bord exécutif - Février 2024',
      type: 'custom',
      category: 'Tableau de bord',
      generatedDate: null,
      period: 'Février 2024',
      format: 'PDF',
      size: null,
      status: 'pending'
    }
  ];

  const stats = [
    {
      label: "Rapports générés",
      value: reports.filter(r => r.status === 'generated').length.toString(),
      change: "+8",
      changeType: "positive" as const
    },
    {
      label: "En cours de génération",
      value: reports.filter(r => r.status === 'pending').length.toString(),
      change: "+1",
      changeType: "neutral" as const
    },
    {
      label: "Téléchargements ce mois",
      value: "47",
      change: "+23%",
      changeType: "positive" as const
    },
    {
      label: "Formats disponibles",
      value: "3",
      change: "0",
      changeType: "neutral" as const
    }
  ];

  const getTypeBadge = (type: string) => {
    const variants = {
      monthly: "bg-blue-100 text-blue-700 border-blue-200",
      quarterly: "bg-green-100 text-green-700 border-green-200",
      annual: "bg-purple-100 text-purple-700 border-purple-200",
      custom: "bg-orange-100 text-orange-700 border-orange-200"
    };
    const labels = {
      monthly: "Mensuel",
      quarterly: "Trimestriel",
      annual: "Annuel",
      custom: "Personnalisé"
    };
    return { variant: variants[type as keyof typeof variants], label: labels[type as keyof typeof labels] };
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      generated: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      error: "bg-red-100 text-red-700 border-red-200"
    };
    const labels = {
      generated: "Généré",
      pending: "En cours",
      error: "Erreur"
    };
    return { variant: variants[status as keyof typeof variants], label: labels[status as keyof typeof labels] };
  };

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Rapports financiers"
          subtitle="Génération et gestion des rapports comptables"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau rapport"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Modèles de rapports */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-blue-100 rounded-xl mx-auto w-fit mb-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Rapport mensuel</h3>
              <p className="text-sm text-muted-foreground">Synthèse financière du mois</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-green-100 rounded-xl mx-auto w-fit mb-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Analyse revenus</h3>
              <p className="text-sm text-muted-foreground">Détail des encaissements</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-purple-100 rounded-xl mx-auto w-fit mb-3">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Rapport bourses</h3>
              <p className="text-sm text-muted-foreground">Suivi des aides financières</p>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0 hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="p-3 bg-[rgb(245,158,11)]/20 rounded-xl mx-auto w-fit mb-3">
                <FileText className="w-6 h-6 text-[rgb(245,158,11)]" />
              </div>
              <h3 className="font-semibold mb-2">Rapport personnalisé</h3>
              <p className="text-sm text-muted-foreground">Créer un rapport sur mesure</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un rapport..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Type
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Période
                </Button>
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rapports */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
              Rapports disponibles ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const typeInfo = getTypeBadge(report.type);
                const statusInfo = getStatusBadge(report.status);
                return (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                        <FileText className="w-5 h-5 text-[rgb(245,158,11)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground">{report.name}</p>
                          <Badge className={typeInfo.variant}>
                            {typeInfo.label}
                          </Badge>
                          <Badge className={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Catégorie: {report.category}</span>
                          <span>Période: {report.period}</span>
                          <span>Format: {report.format}</span>
                          {report.size && <span>Taille: {report.size}</span>}
                          {report.generatedDate && (
                            <span>Généré: {new Date(report.generatedDate).toLocaleDateString('fr-FR')}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <Eye className="w-3 h-3" />
                        Prévisualiser
                      </Button>
                      {report.status === 'generated' && (
                        <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                          <Download className="w-3 h-3" />
                          Télécharger
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