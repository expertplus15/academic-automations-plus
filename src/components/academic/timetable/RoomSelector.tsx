
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTable } from '@/hooks/useSupabase';

interface RoomSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function RoomSelector({ value, onValueChange }: RoomSelectorProps) {
  const { data: rooms, loading } = useTable('rooms', `
    *,
    sites!rooms_site_id_fkey(name)
  `);

  return (
    <div>
      <Label>Salle *</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner une salle"} />
        </SelectTrigger>
        <SelectContent>
          {rooms?.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.code} - {room.name} ({room.capacity} places)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
