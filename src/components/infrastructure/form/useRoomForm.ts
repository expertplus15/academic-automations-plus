
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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

export type RoomFormData = z.infer<typeof roomSchema>;

interface UseRoomFormProps {
  room?: any;
  onSuccess?: () => void;
}

export function useRoomForm({ room, onSuccess }: UseRoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equipment, setEquipment] = useState<string[]>(room?.equipment || []);
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

  return {
    form,
    equipment,
    setEquipment,
    isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
