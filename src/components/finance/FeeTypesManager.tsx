import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useFeeTypes } from '@/hooks/finance/useFeeTypes';
import { Plus, Edit, Euro, Percent } from 'lucide-react';

export function FeeTypesManager() {
  const { feeTypes, loading, createFeeType, fetchFeeTypes } = useFeeTypes();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    fee_category: 'mandatory',
    default_amount: '',
    is_percentage: false
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFeeType({
        ...formData,
        default_amount: formData.default_amount ? parseFloat(formData.default_amount) : undefined
      });
      setShowCreateForm(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        fee_category: 'mandatory',
        default_amount: '',
        is_percentage: false
      });
    } catch (error) {
      // Error handled in hook
    }
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      mandatory: "bg-red-100 text-red-700 border-red-200",
      optional: "bg-blue-100 text-blue-700 border-blue-200",
      penalty: "bg-orange-100 text-orange-700 border-orange-200"
    };

    const labels = {
      mandatory: "Obligatoire",
      optional: "Optionnel", 
      penalty: "Pénalité"
    };

    return (
      <Badge className={variants[category as keyof typeof variants] || variants.mandatory}>
        {labels[category as keyof typeof labels] || category}
      </Badge>
    );
  };

  if (loading) {
    return <div className="text-center p-4">Chargement des types de frais...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Types de Frais</h3>
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Créer un Type de Frais</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Frais de scolarité"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="Ex: SCOL"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select value={formData.fee_category} onValueChange={(value) => setFormData({ ...formData, fee_category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Obligatoire</SelectItem>
                    <SelectItem value="optional">Optionnel</SelectItem>
                    <SelectItem value="penalty">Pénalité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Montant par défaut</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.default_amount}
                    onChange={(e) => setFormData({ ...formData, default_amount: e.target.value })}
                    placeholder="0.00"
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_percentage}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_percentage: checked })}
                    />
                    <Label className="text-sm">%</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du type de frais..."
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
        {feeTypes.map((feeType) => (
          <Card key={feeType.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{feeType.name}</h4>
                    <Badge variant="outline" className="text-xs">{feeType.code}</Badge>
                    {getCategoryBadge(feeType.fee_category)}
                  </div>
                  {feeType.description && (
                    <p className="text-sm text-muted-foreground">{feeType.description}</p>
                  )}
                  {feeType.default_amount && (
                    <div className="flex items-center gap-1 text-sm">
                      {feeType.is_percentage ? (
                        <>
                          <Percent className="w-3 h-3" />
                          {feeType.default_amount}%
                        </>
                      ) : (
                        <>
                          <Euro className="w-3 h-3" />
                          {feeType.default_amount}€
                        </>
                      )}
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

      {feeTypes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Aucun type de frais configuré</p>
            <p className="text-sm text-muted-foreground mt-1">
              Créez votre premier type de frais pour commencer
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}