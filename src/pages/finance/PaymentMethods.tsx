import React, { useState } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { FinanceModuleSidebar } from '@/components/FinanceModuleSidebar';
import { FinancePageHeader } from '@/components/FinancePageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  CreditCard, 
  Edit,
  Trash2,
  Globe,
  Building,
  Settings
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  description: string;
  is_online: boolean;
  is_active: boolean;
  processing_fee_percentage: number;
}

export default function PaymentMethods() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    is_online: false,
    processing_fee_percentage: 0
  });

  // Mock data
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      name: 'Carte bancaire',
      code: 'CARD',
      description: 'Paiement par carte bancaire',
      is_online: true,
      is_active: true,
      processing_fee_percentage: 2.5
    },
    {
      id: '2',
      name: 'Virement bancaire',
      code: 'TRANSFER',
      description: 'Virement bancaire',
      is_online: false,
      is_active: true,
      processing_fee_percentage: 0
    },
    {
      id: '3',
      name: 'Espèces',
      code: 'CASH',
      description: 'Paiement en espèces',
      is_online: false,
      is_active: true,
      processing_fee_percentage: 0
    },
    {
      id: '4',
      name: 'Chèque',
      code: 'CHECK',
      description: 'Paiement par chèque',
      is_online: false,
      is_active: true,
      processing_fee_percentage: 0
    },
    {
      id: '5',
      name: 'PayPal',
      code: 'PAYPAL',
      description: 'Paiement en ligne via PayPal',
      is_online: true,
      is_active: false,
      processing_fee_percentage: 3.4
    }
  ];

  const stats = [
    {
      label: "Méthodes actives",
      value: paymentMethods.filter(pm => pm.is_active).length.toString(),
      change: "+1",
      changeType: "positive" as const
    },
    {
      label: "Paiements en ligne",
      value: paymentMethods.filter(pm => pm.is_online && pm.is_active).length.toString(),
      change: "0",
      changeType: "neutral" as const
    },
    {
      label: "Frais moyens",
      value: `${(paymentMethods.reduce((sum, pm) => sum + pm.processing_fee_percentage, 0) / paymentMethods.length).toFixed(1)}%`,
      change: "-0.2%",
      changeType: "positive" as const
    },
    {
      label: "Configurations",
      value: paymentMethods.length.toString(),
      change: "+1",
      changeType: "positive" as const
    }
  ];

  const filteredMethods = paymentMethods.filter(method =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating payment method:', formData);
    setShowForm(false);
    setFormData({
      name: '',
      code: '',
      description: '',
      is_online: false,
      processing_fee_percentage: 0
    });
  };

  return (
    <ModuleLayout sidebar={<FinanceModuleSidebar />}>
      <div className="p-8 space-y-8">
        <FinancePageHeader
          title="Méthodes de paiement"
          subtitle="Configuration des moyens de paiement"
          stats={stats}
          showCreateButton={false}
          showExportButton={true}
          showBackButton={true}
          backPath="/finance"
        />

        {/* Filtres et actions */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une méthode de paiement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                    <Plus className="w-4 h-4" />
                    Nouvelle méthode
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nouvelle méthode de paiement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">Code</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fee">Frais de traitement (%)</Label>
                      <Input
                        id="fee"
                        type="number"
                        step="0.1"
                        value={formData.processing_fee_percentage}
                        onChange={(e) => setFormData(prev => ({ ...prev, processing_fee_percentage: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_online"
                        checked={formData.is_online}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_online: checked }))}
                      />
                      <Label htmlFor="is_online">Paiement en ligne</Label>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                        Annuler
                      </Button>
                      <Button type="submit" className="flex-1 bg-[rgb(245,158,11)] hover:bg-[rgb(245,158,11)]/90">
                        Créer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Liste des méthodes */}
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[rgb(245,158,11)]" />
              Méthodes configurées ({filteredMethods.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[rgb(245,158,11)]/10 rounded-xl">
                      {method.is_online ? (
                        <Globe className="w-5 h-5 text-[rgb(245,158,11)]" />
                      ) : (
                        <Building className="w-5 h-5 text-[rgb(245,158,11)]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">{method.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {method.code}
                        </Badge>
                        <Badge className={method.is_active ? 
                          "bg-green-100 text-green-700 border-green-200" : 
                          "bg-red-100 text-red-700 border-red-200"
                        }>
                          {method.is_active ? 'Actif' : 'Inactif'}
                        </Badge>
                        {method.is_online && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                            En ligne
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                      {method.processing_fee_percentage > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Frais: {method.processing_fee_percentage}%
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Settings className="w-3 h-3" />
                      Configurer
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="w-3 h-3" />
                      Éditer
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                      Supprimer
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