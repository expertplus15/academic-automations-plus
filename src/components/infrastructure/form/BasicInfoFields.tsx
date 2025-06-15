
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { RoomFormData } from './useRoomForm';

interface BasicInfoFieldsProps {
  register: UseFormRegister<RoomFormData>;
  errors: FieldErrors<RoomFormData>;
}

export function BasicInfoFields({ register, errors }: BasicInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la salle</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="ex: Salle A101"
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input
            id="code"
            {...register('code')}
            placeholder="ex: A101"
          />
          {errors.code && (
            <p className="text-sm text-red-600">{errors.code.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacité</Label>
          <Input
            id="capacity"
            type="number"
            {...register('capacity')}
            placeholder="ex: 30"
          />
          {errors.capacity && (
            <p className="text-sm text-red-600">{errors.capacity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="building">Bâtiment</Label>
          <Input
            id="building"
            {...register('building')}
            placeholder="ex: Bâtiment A"
          />
        </div>
      </div>
    </>
  );
}
