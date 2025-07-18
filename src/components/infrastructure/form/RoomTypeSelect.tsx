
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RoomTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function RoomTypeSelect({ value, onChange, error }: RoomTypeSelectProps) {
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

  // Ensure all room types have valid, non-empty values
  const validRoomTypes = roomTypes.filter(type => 
    type.value && 
    typeof type.value === 'string' && 
    type.value.trim().length > 0 &&
    type.label &&
    typeof type.label === 'string' &&
    type.label.trim().length > 0
  );

  return (
    <div className="space-y-2">
      <Label>Type de salle</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un type" />
        </SelectTrigger>
        <SelectContent>
          {validRoomTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
