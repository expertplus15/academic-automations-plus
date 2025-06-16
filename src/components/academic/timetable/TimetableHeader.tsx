
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface TimetableHeaderProps {
  onNewSlot: () => void;
}

export function TimetableHeader({ onNewSlot }: TimetableHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">Emploi du Temps Interactif</h3>
        <p className="text-sm text-muted-foreground">
          Glissez-déposez les créneaux pour les réorganiser ou cliquez sur + pour ajouter
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={onNewSlot}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau créneau
        </Button>
      </div>
    </div>
  );
}
