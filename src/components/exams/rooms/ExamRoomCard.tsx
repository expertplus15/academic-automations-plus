
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Building, Users, Calendar, Edit2, Trash2, Activity } from 'lucide-react';
import { ExamRoom } from '@/hooks/useExamRooms';

interface ExamRoomCardProps {
  room: ExamRoom;
  onEdit: (room: ExamRoom) => void;
  onDelete: (roomId: string) => void;
  onViewSchedule: (room: ExamRoom) => void;
  utilizationData?: {
    totalHours: number;
    scheduledHours: number;
    upcomingExams: number;
  };
}

export function ExamRoomCard({ 
  room, 
  onEdit, 
  onDelete, 
  onViewSchedule,
  utilizationData 
}: ExamRoomCardProps) {
  const [utilization, setUtilization] = useState(0);

  useEffect(() => {
    if (utilizationData) {
      const rate = utilizationData.totalHours > 0 
        ? (utilizationData.scheduledHours / utilizationData.totalHours) * 100 
        : 0;
      setUtilization(Math.round(rate));
    }
  }, [utilizationData]);

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'classroom': return <Building className="w-4 h-4" />;
      case 'laboratory': return <Activity className="w-4 h-4" />;
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

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 100) return 'text-blue-600';
    if (capacity >= 50) return 'text-green-600';
    if (capacity >= 20) return 'text-orange-600';
    return 'text-gray-600';
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
        <p className="text-sm text-muted-foreground">
          Code: {room.code}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informations de base */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Type:</span>
            <span>{getRoomTypeLabel(room.room_type)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Capacité:</span>
            <span className={`flex items-center font-semibold ${getCapacityColor(room.capacity)}`}>
              <Users className="w-3 h-3 mr-1" />
              {room.capacity}
            </span>
          </div>

          {room.building && (
            <div className="flex justify-between col-span-2">
              <span className="text-muted-foreground">Bâtiment:</span>
              <span>{room.building}</span>
            </div>
          )}

          {room.sites && (
            <div className="flex justify-between col-span-2">
              <span className="text-muted-foreground">Site:</span>
              <span>{room.sites.name}</span>
            </div>
          )}
        </div>

        {/* Taux d'utilisation */}
        {utilizationData && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taux d'utilisation:</span>
              <span className="font-medium">{utilization}%</span>
            </div>
            <Progress value={utilization} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{utilizationData.scheduledHours}h programmées</span>
              <span>{utilizationData.upcomingExams} examens prévus</span>
            </div>
          </div>
        )}

        {/* Équipements */}
        {room.equipment && room.equipment.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Équipements:</p>
            <div className="flex flex-wrap gap-1">
              {room.equipment.slice(0, 4).map((equipment: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {equipment}
                </Badge>
              ))}
              {room.equipment.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{room.equipment.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewSchedule(room)}
            className="flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" />
            Planning
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(room)}
            >
              <Edit2 className="w-3 h-3" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(room.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
