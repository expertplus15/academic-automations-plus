
import { Button } from "@/components/ui/button";
import { Building, Plus } from "lucide-react";

interface EmptyRoomsStateProps {
  searchTerm: string;
  onCreateRoom: () => void;
}

export function EmptyRoomsState({ searchTerm, onCreateRoom }: EmptyRoomsStateProps) {
  return (
    <div className="text-center py-12">
      <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune salle trouvée</h3>
      <p className="text-gray-500 mb-4">
        {searchTerm ? 'Aucune salle ne correspond à votre recherche.' : 'Commencez par créer votre première salle.'}
      </p>
      {!searchTerm && (
        <Button onClick={onCreateRoom}>
          <Plus className="w-4 h-4 mr-2" />
          Créer une salle
        </Button>
      )}
    </div>
  );
}
