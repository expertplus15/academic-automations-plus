import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { serviceRequestSchema, type ServiceRequestData } from '@/lib/validations';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Coffee, Bus, UtensilsCrossed, Home, BookOpen } from 'lucide-react';

interface ServiceRequestFormProps {
  onSuccess?: () => void;
}

export function ServiceRequestForm({ onSuccess }: ServiceRequestFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { hasRole, user } = useAuth();
  const { toast } = useToast();

  const form = useForm<ServiceRequestData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      service_type: 'transport',
      title: '',
      description: '',
      priority: 'normal',
      requested_date: '',
      additional_details: {}
    }
  });

  // Anyone can create service requests
  if (!hasRole(['admin', 'hr', 'teacher', 'student'])) {
    return null;
  }

  const handleSubmit = async (data: ServiceRequestData) => {
    setLoading(true);
    
    try {
      // Here you would integrate with your service requests API
      console.log('Creating service request:', data);
      
      toast({
        title: "Succès",
        description: "Demande de service créée avec succès"
      });
      
      setOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la demande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'transport': return <Bus className="w-4 h-4" />;
      case 'catering': return <UtensilsCrossed className="w-4 h-4" />;
      case 'accommodation': return <Home className="w-4 h-4" />;
      case 'library': return <BookOpen className="w-4 h-4" />;
      default: return <Coffee className="w-4 h-4" />;
    }
  };

  const serviceType = form.watch('service_type');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle Demande
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getServiceIcon(serviceType)}
            Nouvelle Demande de Service
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="service_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de service *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="catering">Restauration</SelectItem>
                        <SelectItem value="accommodation">Hébergement</SelectItem>
                        <SelectItem value="library">Bibliothèque</SelectItem>
                        <SelectItem value="health">Santé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la demande *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Réservation transport pour sortie pédagogique"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requested_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date souhaitée *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description détaillée *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre demande en détail..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Service-specific fields based on service type */}
            {serviceType === 'transport' && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-3">Informations Transport</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Nombre de passagers</Label>
                    <Input type="number" placeholder="25" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Destination</Label>
                    <Input placeholder="Paris" className="mt-1" />
                  </div>
                </div>
              </div>
            )}

            {serviceType === 'catering' && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-900 mb-3">Informations Restauration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Nombre de convives</Label>
                    <Input type="number" placeholder="50" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Type de repas</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
                        <SelectItem value="lunch">Déjeuner</SelectItem>
                        <SelectItem value="dinner">Dîner</SelectItem>
                        <SelectItem value="cocktail">Cocktail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Créer la Demande'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}