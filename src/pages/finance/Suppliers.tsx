import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSuppliers } from '@/hooks/finance/useSuppliers';
import { 
  Search, 
  Filter, 
  Building, 
  Eye, 
  Edit,
  Plus,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const { suppliers, loading } = useSuppliers();

  const stats = [
    {
      label: "Fournisseurs actifs",
      value: suppliers.filter(s => s.is_active).length.toString(),
      change: "+3",
      changeType: "positive" as const
    },
    {
      label: "Délai moyen",
      value: "28 jours",
      change: "-2 jours",
      changeType: "positive" as const
    },
    {
      label: "Dépenses totales",
      value: "€485,200",
      change: "+8.5%",
      changeType: "negative" as const
    },
    {
      label: "En cours validation",
      value: "€12,400",
      change: "5 factures",
      changeType: "neutral" as const
    }
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          title="Gestion des Fournisseurs"
          subtitle="Base de données des fournisseurs et partenaires"
          stats={stats}
          showCreateButton={true}
          createButtonText="Nouveau fournisseur"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance/expenses"
          onCreateClick={() => console.log('Create supplier')}
        />

        {/* Filtres et recherche */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email..."
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
                  <Building className="w-4 h-4" />
                  Type
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[rgb(245,158,11)]" />
                Actions rapides
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                <Plus className="w-4 h-4" />
                Ajouter fournisseur
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Building className="w-4 h-4" />
                Import en lot
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Fournisseurs récents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-2">3</p>
              <p className="text-sm text-muted-foreground mb-4">
                Ajoutés cette semaine
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Voir les nouveaux
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-lg">Évaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground mb-2">4.2/5</p>
              <p className="text-sm text-muted-foreground mb-4">
                Note moyenne qualité
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                Voir les évaluations
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Liste des fournisseurs */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[rgb(245,158,11)]" />
              Fournisseurs ({filteredSuppliers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSuppliers.map((supplier, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      <Building className="w-5 h-5 text-[rgb(245,158,11)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{supplier.name}</p>
                        <Badge className={`${
                          supplier.is_active 
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}>
                          {supplier.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {supplier.contact_email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {supplier.contact_email}
                          </div>
                        )}
                        {supplier.contact_phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {supplier.contact_phone}
                          </div>
                        )}
                      </div>
                      {supplier.address && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {supplier.address}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Délai: {supplier.payment_terms} jours
                    </p>
                    {supplier.siret && (
                      <p className="text-xs text-muted-foreground">
                        SIRET: {supplier.siret}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Eye className="w-3 h-3" />
                      Détails
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Éditer
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