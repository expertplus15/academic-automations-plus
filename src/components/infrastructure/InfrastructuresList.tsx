
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit2, Trash2, Building, Users, Monitor } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RoomForm } from "./RoomForm";
import { useTable } from "@/hooks/useSupabase";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function InfrastructuresList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const { data: rooms, loading, refetch } = useTable('rooms');
  const { toast } = useToast();

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'classroom': return <Building className="w-4 h-4" />;
      case 'laboratory': return <Monitor className="w-4 h-4" />;
      case 'amphitheater': return <Users className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'classroom': return 'Salle de classe';
      case 'laboratory': return 'Laboratoire';
      case 'amphitheater': return 'Amphithéâtre';
      case 'office': return 'Bureau';
      case 'meeting_room': return 'Salle de réunion';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Occupée';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher une salle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Salle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle salle</DialogTitle>
            </DialogHeader>
            <RoomForm 
              onSuccess={() => {
                setIsCreateDialogOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  {getRoomTypeIcon(room.room_type)}
                  <CardTitle className="text-lg">{room.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(room.status)}>
                  {getStatusLabel(room.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Code: {room.code}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span>{getRoomTypeLabel(room.room_type)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacité:</span>
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {room.capacity} places
                </span>
              </div>

              {room.building && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Bâtiment:</span>
                  <span>{room.building}</span>
                </div>
              )}

              {room.equipment && room.equipment.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Équipements:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.slice(0, 3).map((equipment: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {equipment}
                      </Badge>
                    ))}
                    {room.equipment.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{room.equipment.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingRoom(room)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Modifier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Modifier la salle</DialogTitle>
                    </DialogHeader>
                    <RoomForm 
                      room={editingRoom}
                      onSuccess={() => {
                        setEditingRoom(null);
                        refetch();
                      }}
                    />
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(room.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune salle trouvée</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Aucune salle ne correspond à votre recherche.' : 'Commencez par créer votre première salle.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une salle
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
