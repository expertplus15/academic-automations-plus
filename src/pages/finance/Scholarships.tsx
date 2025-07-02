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
  Award,
  Eye,
  Edit,
  Users,
  Calendar,
  Euro
} from 'lucide-react';

export default function Scholarships() {
  const [searchTerm, setSearchTerm] = useState('');

  const scholarships = [
    {
      id: '1',
      name: 'Bourse d\'excellence académique',
      code: 'BEA2024',
      type: 'merit',
      amount: 5000,
      maxRecipients: 10,
      currentRecipients: 7,
      applicationDeadline: '2024-03-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Aide sociale étudiante',
      code: 'ASE2024',
      type: 'need-based',
      amount: 2500,
      maxRecipients: 25,
      currentRecipients: 18,
      applicationDeadline: '2024-04-01',
      status: 'active'
    },
    {
      id: '3',
      name: 'Bourse recherche et innovation',
      code: 'BRI2024',
      type: 'research',
      amount: 7500,
      maxRecipients: 5,
      currentRecipients: 3,
      applicationDeadline: '2024-02-28',
      status: 'active'
    }
  ];

  const stats = [
    {
      label: "Bourses actives",
      value: scholarships.filter(s => s.status === 'active').length.toString(),
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Budget total alloué",
      value: `€${scholarships.reduce((sum, s) => sum + (s.amount * s.maxRecipients), 0).toLocaleString()}`,
      change: "+15%",
      changeType: "positive" as const
    },
    {
      label: "Bénéficiaires actuels",
      value: scholarships.reduce((sum, s) => sum + s.currentRecipients, 0).toString(),
      change: "+12",
      changeType: "positive" as const
    },
    {
      label: "Taux d'attribution",
      value: "72%",
      change: "+5%",
      changeType: "positive" as const
    }
  ];

  const getTypeLabel = (type: string) => {
    const labels = {
      merit: "Mérite",
      "need-based": "Sociale",
      research: "Recherche",
      sports: "Sportive"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      merit: "bg-blue-100 text-blue-700 border-blue-200",
      "need-based": "bg-green-100 text-green-700 border-green-200",
      research: "bg-purple-100 text-purple-700 border-purple-200",
      sports: "bg-orange-100 text-orange-700 border-orange-200"
    };
    return variants[type as keyof typeof variants] || variants.merit;
  };

  const filteredScholarships = scholarships.filter(scholarship =>
    scholarship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Programmes de bourses"
          subtitle="Gestion des bourses et aides financières"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouvelle bourse"
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
                    placeholder="Rechercher une bourse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Award className="w-4 h-4" />
                  Type
                </Button>
                <Button variant="outline" className="gap-2">
                  <Badge className="w-4 h-4" />
                  Statut
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des bourses */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[rgb(245,158,11)]" />
              Programmes disponibles ({filteredScholarships.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <Award className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{scholarship.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {scholarship.code}
                        </Badge>
                        <Badge className={getTypeBadge(scholarship.type)}>
                          {getTypeLabel(scholarship.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Euro className="w-3 h-3" />
                          {scholarship.amount.toLocaleString()}€
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {scholarship.currentRecipients}/{scholarship.maxRecipients} bénéficiaires
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Échéance: {new Date(scholarship.applicationDeadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="w-48 bg-muted rounded-full h-2 mt-2">
                        <div 
                          className="bg-[rgb(245,158,11)] h-2 rounded-full" 
                          style={{ width: `${(scholarship.currentRecipients / scholarship.maxRecipients) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Voir
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Users className="w-3 h-3" />
                      Candidatures
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Modifier
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
}