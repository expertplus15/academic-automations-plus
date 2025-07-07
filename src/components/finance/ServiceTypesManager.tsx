import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useServiceTypes } from '@/hooks/finance/useServiceTypes';
import { Plus, Edit, Euro, ShieldCheck } from 'lucide-react';

export function ServiceTypesManager() {
  const { serviceTypes, loading, createServiceType, fetchServiceTypes } = useServiceTypes();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    default_price: '',
    is_taxable: true
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createServiceType({
        ...formData,
        default_price: formData.default_price ? parseFloat(formData.default_price) : undefined
      });
      setShowCreateForm(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        default_price: '',
        is_taxable: true
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  if (loading) {
    return <div className="text-center p-4">Chargement des prestations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Prestations de Services</h3>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle Prestation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une Prestation</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Certificat de scolarité"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: CERT"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix par défaut</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.default_price}
                  onChange={(e) => setFormData({ ...formData, default_price: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="taxable">Soumis à TVA</Label>
                <Switch
                  id="taxable"
                  checked={formData.is_taxable}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_taxable: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description de la prestation..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Créer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {serviceTypes.map((serviceType) => (
          <Card key={serviceType.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{serviceType.name}</h4>
                    <Badge variant="outline" className="text-xs">{serviceType.code}</Badge>
                    {serviceType.is_taxable && (
                      <Badge className="bg-green-100 text-green-700 border-green-200 gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        TVA
                      </Badge>
                    )}
                  </div>
                  {serviceType.description && (
                    <p className="text-sm text-muted-foreground">{serviceType.description}</p>
                  )}
                  {serviceType.default_price && (
                    <div className="flex items-center gap-1 text-sm">
                      <Euro className="w-3 h-3" />
                      {serviceType.default_price}€
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="w-3 h-3" />
                  Modifier
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {serviceTypes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Aucune prestation configurée</p>
            <p className="text-sm text-muted-foreground mt-1">
              Créez votre première prestation pour commencer
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}