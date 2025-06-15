
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Monitor, Edit2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RoomForm } from "./RoomForm";

interface RoomCardProps {
  room: any;
  onEdit: (room: any) => void;
  onDelete: (roomId: string) => void;
  onSuccess: () => void;
}

export function RoomCard({ room, onEdit, onDelete, onSuccess }: RoomCardProps) {
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
                onClick={() => onEdit(room)}
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
                room={room}
                onSuccess={onSuccess}
              />
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(room.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3 mr-1" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
