
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomFilters } from './RoomFilters';
import { RoomCard } from './RoomCard';
import { EmptyRoomsState } from './EmptyRoomsState';
import { CreateRoomDialog } from './CreateRoomDialog';
import { CampusManagement } from './CampusManagement';
import { useTable } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";

export function InfrastructuresList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const { data: rooms, loading, refetch, error } = useTable('rooms', `
    *,
    sites!rooms_site_id_fkey(
      name,
      code,
      campuses!sites_campus_id_fkey(name, code)
    )
  `);
  const { toast } = useToast();

  // Logs de diagnostic
  console.log('🔍 [DIAGNOSTIC] InfrastructuresList - État actuel:', {
    rooms: rooms,
    roomsCount: rooms?.length || 0,
    loading,
    error,
    searchTerm
  });

  // Vérification de l'authentification
  console.log('🔍 [DIAGNOSTIC] Utilisateur authentifié:', supabase.auth.getUser());

  const filteredRooms = rooms?.filter(room =>
    room.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.sites?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.sites?.campuses?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  console.log('🔍 [DIAGNOSTIC] Salles filtrées:', {
    filteredRoomsCount: filteredRooms.length,
    sampleRoom: filteredRooms[0]
  });

  const handleDelete = async (roomId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) return;

    console.log('🔍 [DIAGNOSTIC] Tentative de suppression:', roomId);

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (error) {
      console.error('❌ [DIAGNOSTIC] Erreur suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la salle',
        variant: 'destructive'
      });
    } else {
      console.log('✅ [DIAGNOSTIC] Suppression réussie');
      toast({
        title: 'Salle supprimée',
        description: 'La salle a été supprimée avec succès'
      });
      refetch();
    }
  };

  const handleSuccess = () => {
    setEditingRoom(null);
    refetch();
  };

  // Affichage de l'état de chargement avec diagnostic
  if (loading) {
    console.log('🔄 [DIAGNOSTIC] État de chargement...');
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">Chargement des infrastructures...</p>
          <p className="text-sm text-muted-foreground mt-2">
            Récupération des données depuis la base
          </p>
        </div>
      </div>
    );
  }

  // Affichage des erreurs avec diagnostic
  if (error) {
    console.error('❌ [DIAGNOSTIC] Erreur détectée:', error);
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Erreur de chargement des données:</strong>
            <br />
            {error.message || 'Erreur inconnue'}
            <br />
            <small className="text-xs opacity-75 mt-2 block">
              Détails techniques: {JSON.stringify(error, null, 2)}
            </small>
          </AlertDescription>
        </Alert>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Recharger la page
        </button>
      </div>
    );
  }

  // Vérification si les données sont vides
  if (!rooms || rooms.length === 0) {
    console.log('⚠️ [DIAGNOSTIC] Aucune donnée trouvée');
    return (
      <div className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Aucune infrastructure trouvée</strong>
            <br />
            Il semble qu'aucune salle ne soit configurée dans la base de données.
            <br />
            <small className="text-xs opacity-75 mt-2 block">
              Vérifiez vos permissions d'accès ou créez votre première salle.
            </small>
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rooms">Salles</TabsTrigger>
            <TabsTrigger value="campus">Campus & Sites</TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <RoomFilters 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
              
              <CreateRoomDialog
                isOpen={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={handleSuccess}
              />
            </div>

            <EmptyRoomsState
              searchTerm=""
              onCreateRoom={() => setIsCreateDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="campus">
            <CampusManagement />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  console.log('✅ [DIAGNOSTIC] Rendu normal de la page avec', rooms.length, 'salles');

  return (
    <Tabs defaultValue="rooms" className="space-y-6">
      <TabsList>
        <TabsTrigger value="rooms">Salles</TabsTrigger>
        <TabsTrigger value="campus">Campus & Sites</TabsTrigger>
      </TabsList>

      <TabsContent value="rooms" className="space-y-6">
        <div className="flex justify-between items-center">
          <RoomFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          <CreateRoomDialog
            isOpen={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onSuccess={handleSuccess}
          />
        </div>

        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onEdit={setEditingRoom}
                onDelete={handleDelete}
                onSuccess={handleSuccess}
              />
            ))}
          </div>
        ) : (
          <EmptyRoomsState
            searchTerm={searchTerm}
            onCreateRoom={() => setIsCreateDialogOpen(true)}
          />
        )}
      </TabsContent>

      <TabsContent value="campus">
        <CampusManagement />
      </TabsContent>
    </Tabs>
  );
}
