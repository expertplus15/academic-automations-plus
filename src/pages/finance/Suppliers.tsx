import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SupplierDialog } from '@/components/finance/SupplierDialog';
import { useSuppliers } from '@/hooks/finance/useSuppliers';
import { Building, Plus, Search, Filter, Eye, Edit, Mail, Phone } from 'lucide-react';
import type { Supplier } from '@/hooks/finance/useSuppliers';

export default function Suppliers() {
  const { suppliers, loading } = useSuppliers();
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.siret?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeSuppliers = suppliers.filter(s => s.is_active).length;
  const inactiveSuppliers = suppliers.filter(s => !s.is_active).length;


  const handleViewSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierDialog(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierDialog(true);
  };

  const handleNewSupplier = () => {
    setSelectedSupplier(null);
    setShowSupplierDialog(true);
  };

  const stats = [
    {
      label: "Total fournisseurs",
      value: suppliers.length.toString(),
      change: "+2",
      changeType: "positive" as const
    },
    {
      label: "Actifs",
      value: activeSuppliers.toString(),
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Inactifs",
      value: inactiveSuppliers.toString(),
      change: "0",
      changeType: "neutral" as const
    },
    {
      label: "Délai moyen",
      value: `${Math.round(suppliers.reduce((sum, s) => sum + s.payment_terms, 0) / suppliers.length || 0)} j`,
      change: "-2j",
      changeType: "positive" as const
    }
  ];

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Fournisseurs"
          subtitle="Gestion de la base de données fournisseurs"
          stats={stats}
          showCreateButton={true}
          onCreateClick={handleNewSupplier}
          createButtonText="Nouveau fournisseur"
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-500" />
                Liste des fournisseurs
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un fournisseur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Chargement...</div>
              ) : (
                <div className="space-y-4">
                  {filteredSuppliers.map((supplier) => (
                    <div key={supplier.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{supplier.name}</div>
                        {supplier.siret && (
                          <div className="text-sm text-muted-foreground">SIRET: {supplier.siret}</div>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          {supplier.contact_email && (
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {supplier.contact_email}
                            </div>
                          )}
                          {supplier.contact_phone && (
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {supplier.contact_phone}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm">{supplier.payment_terms} jours</div>
                          <Badge variant={supplier.is_active ? 'default' : 'secondary'}>
                            {supplier.is_active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewSupplier(supplier)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSupplier(supplier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <SupplierDialog
          open={showSupplierDialog}
          onClose={() => {
            setShowSupplierDialog(false);
            setSelectedSupplier(null);
          }}
          supplier={selectedSupplier}
          mode={selectedSupplier ? 'edit' : 'create'}
        />
      </div>
    </ModuleLayout>
  );
}