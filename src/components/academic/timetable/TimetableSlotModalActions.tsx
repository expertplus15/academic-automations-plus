
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TimetableSlotModalActionsProps {
  isLoading: boolean;
  isValidating: boolean;
  isEditing: boolean;
  onClose: () => void;
  onSave: () => void;
}

export function TimetableSlotModalActions({
  isLoading,
  isValidating,
  isEditing,
  onClose,
  onSave
}: TimetableSlotModalActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button 
        variant="outline" 
        onClick={onClose} 
        disabled={isLoading || isValidating}
      >
        Annuler
      </Button>
      <Button 
        onClick={onSave} 
        disabled={isLoading || isValidating}
        className="min-w-[100px]"
      >
        {isLoading || isValidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isValidating ? 'Validation...' : 'Sauvegarde...'}
          </>
        ) : (
          isEditing ? 'Modifier' : 'Créer'
        )}
      </Button>
    </div>
  );
}
