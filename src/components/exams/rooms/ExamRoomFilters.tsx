
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';

interface ExamRoomFiltersProps {
  onFiltersChange: (filters: {
    searchTerm?: string;
    minCapacity?: number;
    maxCapacity?: number;
    roomType?: string;
    status?: string;
    hasEquipment?: string[];
  }) => void;
}

const EQUIPMENT_OPTIONS = [
  'Projecteur',
  'Ordinateur',
  'Tableau interactif',
  'Climatisation',
  'Sono',
  'Micro',
  'Caméra',
  'WiFi'
];

const ROOM_TYPES = [
  { value: 'classroom', label: 'Salle de classe' },
  { value: 'amphitheater', label: 'Amphithéâtre' },
  { value: 'laboratory', label: 'Laboratoire' },
  { value: 'meeting_room', label: 'Salle de réunion' }
];

export function ExamRoomFilters({ onFiltersChange }: ExamRoomFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [minCapacity, setMinCapacity] = useState<string>('');
  const [maxCapacity, setMaxCapacity] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyFilters = () => {
    const filters = {
      searchTerm: searchTerm || undefined,
      minCapacity: minCapacity ? parseInt(minCapacity) : undefined,
      maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
      roomType: roomType || undefined,
      status: status || undefined,
      hasEquipment: selectedEquipment.length > 0 ? selectedEquipment : undefined
    };
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMinCapacity('');
    setMaxCapacity('');
    setRoomType('');
    setStatus('');
    setSelectedEquipment([]);
    onFiltersChange({});
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev => 
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres de recherche
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Masquer' : 'Avancé'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recherche de base */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une salle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtres avancés */}
        {showAdvanced && (
          <div className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Capacité minimum</label>
                <Input
                  type="number"
                  placeholder="Ex: 30"
                  value={minCapacity}
                  onChange={(e) => setMinCapacity(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Capacité maximum</label>
                <Input
                  type="number"
                  placeholder="Ex: 100"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Type de salle</label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous types</SelectItem>
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous statuts</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="occupied">Occupée</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Équipements requis</label>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_OPTIONS.map((equipment) => (
                  <Badge
                    key={equipment}
                    variant={selectedEquipment.includes(equipment) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleEquipment(equipment)}
                  >
                    {equipment}
                    {selectedEquipment.includes(equipment) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={applyFilters} className="flex-1">
            Appliquer les filtres
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Effacer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
