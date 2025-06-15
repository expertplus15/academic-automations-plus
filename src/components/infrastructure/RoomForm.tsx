
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const roomSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  code: z.string().min(2, 'Le code doit contenir au moins 2 caractères'),
  room_type: z.string().min(1, 'Le type de salle est requis'),
  capacity: z.coerce.number().min(1, 'La capacité doit être d\'au moins 1'),
  building: z.string().optional(),
  status: z.enum(['available', 'occupied', 'maintenance']),
});

type RoomFormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  room?: any;
  onSuccess?: () => void;
}

export function RoomForm({ room, onSuccess }: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipment, setEquipment] = useState<string[]>(room?.equipment || []);
  const [newEquipment, setNewEquipment] = useState('');
  const { toast } = useToast();

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: room ? {
      name: room.name,
      code: room.code,
      room_type: room.room_type,
      capacity: room.capacity,
      building: room.building || '',
      status: room.status || 'available',
    } : {
      status: 'available',
      room_type: 'classroom',
      capacity: 30,
      building: '',
    }
  });

  const roomTypes = [
    { value: 'classroom', label: 'Salle de classe' },
    { value: 'laboratory', label: 'Laboratoire' },
    { value: 'amphitheater', label: 'Amphithéâtre' },
    { value: 'office', label: 'Bureau' },
    { value: 'meeting_room', label: 'Salle de réunion' },
    { value: 'library', label: 'Bibliothèque' },
    { value: 'gym', label: 'Gymnase' },
    { value: 'cafeteria', label: 'Cafétéria' },
  ];

  const addEquipment = () => {
    if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
      setEquipment([...equipment, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipmentToRemove: string) => {
    setEquipment(equipment.filter(eq => eq !== equipmentToRemove));
  };

  const onSubmit = async (data: RoomFormData) => {
    setIsSubmitting(true);
    console.log('Submitting room data:', data);

    try {
      const payload = {
        name: data.name,
        code: data.code,
        room_type: data.room_type,
        capacity: data.capacity,
        building: data.building || null,
        status: data.status,
        equipment: equipment,
      };

      console.log('Payload being sent to Supabase:', payload);

      let result;
      if (room) {
        result = await supabase
          .from('rooms')
          .update(payload)
          .eq('id', room.id);
      } else {
        result = await supabase
          .from('rooms')
          .insert(payload);
      }

      console.log('Supabase result:', result);

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      toast({
        title: room ? 'Salle modifiée' : 'Salle créée',
        description: `La salle a été ${room ? 'modifiée' : 'créée'} avec succès.`,
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting room:', error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la salle</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="ex: Salle A101"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            {...form.register('code')}
            placeholder="ex: A101"
          />
          {form.formState.errors.code && (
            <p className="text-sm text-red-600">{form.formState.errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Type de salle</Label>
          <Select
            value={form.watch('room_type')}
            onValueChange={(value) => form.setValue('room_type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {roomTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.room_type && (
            <p className="text-sm text-red-600">{form.formState.errors.room_type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacité</Label>
          <Input
            id="capacity"
            type="number"
            {...form.register('capacity')}
            placeholder="ex: 30"
          />
          {form.formState.errors.capacity && (
            <p className="text-sm text-red-600">{form.formState.errors.capacity.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="building">Bâtiment</Label>
          <Input
            id="building"
            {...form.register('building')}
            placeholder="ex: Bâtiment A"
          />
        </div>

        <div className="space-y-2">
          <Label>Statut</Label>
          <Select
            value={form.watch('status')}
            onValueChange={(value: 'available' | 'occupied' | 'maintenance') => 
              form.setValue('status', value)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="occupied">Occupée</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Équipements</Label>
        <div className="flex space-x-2">
          <Input
            value={newEquipment}
            onChange={(e) => setNewEquipment(e.target.value)}
            placeholder="Ajouter un équipement"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addEquipment();
              }
            }}
          />
          <Button type="button" onClick={addEquipment} variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {equipment.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {equipment.map((eq, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {eq}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-500" 
                  onClick={() => removeEquipment(eq)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'En cours...' : (room ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
}
