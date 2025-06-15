
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StatusSelectProps {
  value: 'available' | 'occupied' | 'maintenance';
  onChange: (value: 'available' | 'occupied' | 'maintenance') => void;
}

export function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <div className="space-y-2">
      <Label>Statut</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
}
