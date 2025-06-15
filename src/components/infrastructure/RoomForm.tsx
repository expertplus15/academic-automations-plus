
import { Button } from "@/components/ui/button";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { RoomTypeSelect } from "./form/RoomTypeSelect";
import { StatusSelect } from "./form/StatusSelect";
import { EquipmentManager } from "./form/EquipmentManager";
import { useRoomForm } from "./form/useRoomForm";

interface RoomFormProps {
  room?: any;
  onSuccess?: () => void;
}

export function RoomForm({ room, onSuccess }: RoomFormProps) {
  const { form, equipment, setEquipment, isSubmitting, onSubmit } = useRoomForm({ room, onSuccess });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <BasicInfoFields 
        register={form.register}
        errors={form.formState.errors}
      />

      <div className="grid grid-cols-2 gap-4">
        <RoomTypeSelect
          value={form.watch('room_type')}
          onChange={(value) => form.setValue('room_type', value)}
          error={form.formState.errors.room_type?.message}
        />

        <StatusSelect
          value={form.watch('status')}
          onChange={(value) => form.setValue('status', value)}
        />
      </div>

      <EquipmentManager
        equipment={equipment}
        onEquipmentChange={setEquipment}
      />

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'En cours...' : (room ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
}
