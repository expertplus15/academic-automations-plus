import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFinanceData } from '@/hooks/useFinanceData';
import { 
  Search, 
  Filter, 
  Users, 
  Eye, 
  CreditCard,
  AlertTriangle,
  DollarSign,
  Calendar
} from 'lucide-react';

export default function Accounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const { accounts, loading } = useFinanceData();

  const stats = [
    {
      label: "Comptes actifs",
      value: accounts.filter(acc => acc.status === 'active').length.toString(),
      change: "+5",
      changeType: "positive" as const
    },
    {
      label: "Solde total",
      value: `€${accounts.reduce((sum, acc) => sum + acc.current_balance, 0).toLocaleString()}`,
      change: "+8.2%",
      changeType: "positive" as const
    },
    {
      label: "Comptes débiteurs",
      value: accounts.filter(acc => acc.current_balance < 0).length.toString(),
      change: "-2",
      changeType: "positive" as const
    },
    {
      label: "Paiements en retard",
      value: accounts.filter(acc => acc.status === 'overdue').length.toString(),
      change: "+3",
      changeType: "negative" as const
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-700 border-green-200",
      suspended: "bg-yellow-100 text-yellow-700 border-yellow-200",
      overdue: "bg-red-100 text-red-700 border-red-200",
      closed: "bg-gray-100 text-gray-700 border-gray-200"
    };

    const labels = {
      active: "Actif",
      suspended: "Suspendu",
      overdue: "En retard",
      closed: "Fermé"
    };

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.active}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const getBalanceBadge = (balance: number) => {
    if (balance > 0) {
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Créditeur</Badge>;
    } else if (balance < 0) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Débiteur</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700 border-green-200">Soldé</Badge>;
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.student.profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.student.student_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <ModuleLayout sidebar={<FinanceModuleSidebar />}>
        <div className="p-8">
          <div className="text-center">Chargement...</div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Comptes étudiants"
          subtitle="Gestion des comptes et soldes étudiants"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau compte"
          showExportButton={true}
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou numéro étudiant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Statut
                </Button>
                <Button variant="outline" className="gap-2">
                  <DollarSign className="w-4 h-4" />
                  Solde
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Année fiscale
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des comptes */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[rgb(245,158,11)]" />
              Comptes ({filteredAccounts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAccounts.map((account, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <Users className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">
                          {account.student.profile.full_name}
                        </p>
                        {getStatusBadge(account.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.student.student_number} • {account.student.profile.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getBalanceBadge(account.current_balance)}
                        {account.last_payment_date && (
                          <span className="text-xs text-muted-foreground">
                            Dernier paiement: {new Date(account.last_payment_date).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`font-semibold text-lg ${
                        account.current_balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        €{Math.abs(account.current_balance).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>Facturé: €{account.total_charged.toLocaleString()}</p>
                      <p>Payé: €{account.total_paid.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Détails
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <CreditCard className="w-3 h-3" />
                      Facturer
                    </Button>
                    {account.current_balance < 0 && (
                      <Button size="sm" className="gap-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                        <AlertTriangle className="w-3 h-3" />
                        Relancer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Relances automatiques</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Envoyer des relances aux comptes en retard
              </p>
              <Button className="w-full gap-2">
                <AlertTriangle className="w-4 h-4" />
                Envoyer relances
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Facturation en lot</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Créer des factures pour plusieurs étudiants
              </p>
              <Button variant="outline" className="w-full gap-2">
                <CreditCard className="w-4 h-4" />
                Facturation groupée
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Rapport financier</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Générer un rapport des comptes étudiants
              </p>
              <Button variant="outline" className="w-full gap-2">
                <DollarSign className="w-4 h-4" />
                Générer rapport
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleLayout>
  );
}