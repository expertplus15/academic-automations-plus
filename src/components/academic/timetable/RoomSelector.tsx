
import React from 'react';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { useRooms } from '@/hooks/useRooms';

interface RoomSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function RoomSelector({ value, onChange, required = false }: RoomSelectorProps) {
  const { rooms, loading } = useRooms();

  const options = rooms.map(room => ({
    value: room.id,
    label: room.name,
    description: `${room.code} • ${room.capacity} places • ${room.room_type}${room.building ? ` • ${room.building}` : ''}`
  }));

  return (
    <div>
      <Label>Salle {required && '*'}</Label>
      <Combobox
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder={loading ? "Chargement..." : "Sélectionner une salle"}
        searchPlaceholder="Rechercher une salle..."
        emptyMessage="Aucune salle trouvée."
        disabled={loading}
      />
    </div>
  );
}
