import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assetSchema, AssetFormData } from '@/lib/validations/resources';
import { Asset } from '@/hooks/resources/useAssets';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface EnhancedAssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: Asset;
  mode: 'create' | 'edit' | 'view';
  onSave?: (data: AssetFormData) => Promise<void>;
  initialQRCode?: string;
}

export function EnhancedAssetForm({ 
  isOpen, 
  onClose, 
  asset, 
  mode, 
  onSave,
  initialQRCode 
}: EnhancedAssetFormProps) {
  const isReadOnly = mode === 'view';

  const form = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: asset?.name || '',
      description: asset?.description || '',
      brand: asset?.brand || '',
      model: asset?.model || '',
      serial_number: asset?.serial_number || '',
      location: asset?.location || '',
      status: asset?.status || 'active',
      condition_status: asset?.condition_status || 'good',
      purchase_date: asset?.purchase_date ? new Date(asset.purchase_date) : undefined,
      purchase_price: asset?.purchase_price || undefined,
      current_value: asset?.current_value || undefined,
      warranty_end_date: asset?.warranty_end_date ? new Date(asset.warranty_end_date) : undefined,
      qr_code: asset?.qr_code || initialQRCode || ''
    }
  });

  const onSubmit = async (data: AssetFormData) => {
    try {
      if (onSave) {
        await onSave(data);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const generateQRCode = () => {
    const qrCode = `AST-${Date.now()}`;
    form.setValue('qr_code', qrCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && 'Nouvel équipement'}
            {mode === 'edit' && 'Modifier l\'équipement'}
            {mode === 'view' && 'Détails de l\'équipement'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informations générales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Informations générales</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'équipement *</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} placeholder="Ex: Projecteur Salle A1" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} placeholder="Ex: Epson" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} placeholder="Ex: EB-X41" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serial_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de série</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} placeholder="Ex: EP123456789" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      disabled={isReadOnly} 
                      placeholder="Description détaillée de l'équipement..."
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* État et emplacement */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">État et emplacement</h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le statut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="maintenance">En maintenance</SelectItem>
                          <SelectItem value="retired">Retiré</SelectItem>
                          <SelectItem value="reserved">Réservé</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>État physique *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner l'état" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Bon</SelectItem>
                          <SelectItem value="fair">Correct</SelectItem>
                          <SelectItem value="poor">Mauvais</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emplacement *</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} placeholder="Ex: Salle A101" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Informations financières */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Informations financières</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'achat</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isReadOnly}
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchase_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix d'achat (€)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          disabled={isReadOnly} 
                          placeholder="0.00"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valeur actuelle (€)</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number" 
                          disabled={isReadOnly} 
                          placeholder="0.00"
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="warranty_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fin de garantie</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              disabled={isReadOnly}
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionner une date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* QR Code */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Identification</h3>
              <div className="flex gap-4 items-end">
                <FormField
                  control={form.control}
                  name="qr_code"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Code QR</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isReadOnly} placeholder="Code QR de l'équipement" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isReadOnly && (
                  <Button type="button" variant="outline" onClick={generateQRCode}>
                    <QrCode className="w-4 h-4 mr-2" />
                    Générer
                  </Button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                {mode === 'view' ? 'Fermer' : 'Annuler'}
              </Button>
              {!isReadOnly && (
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting 
                    ? 'Sauvegarde...' 
                    : mode === 'create' ? 'Créer' : 'Modifier'
                  }
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}