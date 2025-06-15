
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

export function InfrastructuresList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const { data: rooms, loading, refetch } = useTable('rooms', `
    *,
    sites!rooms_site_id_fkey(
      name,
      code,
      campuses!sites_campus_id_fkey(name, code)
    )
  `);
  const { toast } = useToast();

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.sites?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.sites?.campuses?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (roomId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) return;

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la salle',
        variant: 'destructive'
      });
    } else {
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

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

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
