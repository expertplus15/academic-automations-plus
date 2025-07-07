import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings
} from 'lucide-react';

export function TaxSettingsManager() {
  const [autoCalculation, setAutoCalculation] = useState(true);
  const [vatEnabled, setVatEnabled] = useState(true);

  const taxRates = [
    {
      id: '1',
      name: 'TVA Standard',
      rate: 20.0,
      type: 'VAT',
      category: 'Services éducatifs',
      isDefault: true,
      isActive: true
    },
    {
      id: '2',
      name: 'TVA Réduite',
      rate: 10.0,
      type: 'VAT',
      category: 'Formations professionnelles',
      isDefault: false,
      isActive: true
    },
    {
      id: '3',
      name: 'Exonération',
      rate: 0.0,
      type: 'EXEMPT',
      category: 'Enseignement supérieur',
      isDefault: false,
      isActive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Configuration générale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[hsl(var(--primary))]" />
            Configuration générale
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-calc" className="text-sm font-medium">
                    Calcul automatique de la TVA
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Calculer automatiquement les taxes sur les transactions
                  </p>
                </div>
                <Switch
                  id="auto-calc"
                  checked={autoCalculation}
                  onCheckedChange={setAutoCalculation}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="vat-enabled" className="text-sm font-medium">
                    TVA activée
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Appliquer la TVA aux services éligibles
                  </p>
                </div>
                <Switch
                  id="vat-enabled"
                  checked={vatEnabled}
                  onCheckedChange={setVatEnabled}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company-vat">Numéro de TVA intracommunautaire</Label>
                <Input
                  id="company-vat"
                  placeholder="FR12345678901"
                  defaultValue="FR12345678901"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tax-period">Période de déclaration</Label>
                <select className="w-full p-2 border border-border rounded-md">
                  <option value="monthly">Mensuelle</option>
                  <option value="quarterly">Trimestrielle</option>
                  <option value="annual">Annuelle</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taux de TVA */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[hsl(var(--primary))]" />
            Taux de TVA configurés
          </CardTitle>
          <Button>
            Ajouter un taux
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taxRates.map((rate) => (
              <div
                key={rate.id}
                className="flex items-center justify-between p-4 rounded-xl border hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[hsl(var(--primary))]/10 rounded-xl">
                    <Calculator className="w-5 h-5 text-[hsl(var(--primary))]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground">{rate.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {rate.type}
                      </Badge>
                      {rate.isDefault && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                          Par défaut
                        </Badge>
                      )}
                      {rate.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Catégorie: {rate.category}</span>
                      <span>Taux: {rate.rate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline">
                    {rate.isActive ? 'Désactiver' : 'Activer'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Règles spéciales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--primary))]" />
            Règles et exonérations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Exonération enseignement supérieur</h4>
              <p className="text-sm text-blue-700 mb-3">
                Les formations diplômantes de l'enseignement supérieur sont exonérées de TVA selon l'article 261-4-4° du CGI.
              </p>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <span className="text-sm">Appliquer automatiquement</span>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2">TVA réduite formations professionnelles</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Taux réduit de 10% applicable aux formations professionnelles continues.
              </p>
              <div className="flex items-center gap-2">
                <Switch defaultChecked />
                <span className="text-sm">Appliquer automatiquement</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="special-rules">Règles personnalisées</Label>
            <Textarea
              id="special-rules"
              placeholder="Définir des règles fiscales spécifiques..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button className="gap-2">
          <Save className="w-4 h-4" />
          Sauvegarder les paramètres
        </Button>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}