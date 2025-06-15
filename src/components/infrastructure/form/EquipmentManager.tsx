
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface EquipmentManagerProps {
  equipment: string[];
  onEquipmentChange: (equipment: string[]) => void;
}

export function EquipmentManager({ equipment, onEquipmentChange }: EquipmentManagerProps) {
  const [newEquipment, setNewEquipment] = useState('');

  const addEquipment = () => {
    if (newEquipment.trim() && !equipment.includes(newEquipment.trim())) {
      onEquipmentChange([...equipment, newEquipment.trim()]);
      setNewEquipment('');
    }
  };

  const removeEquipment = (equipmentToRemove: string) => {
    onEquipmentChange(equipment.filter(eq => eq !== equipmentToRemove));
  };

  return (
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
  );
}
