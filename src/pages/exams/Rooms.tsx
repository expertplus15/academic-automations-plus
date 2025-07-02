
import React, { useState, useEffect } from 'react';
import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Plus, BarChart3, Calendar, AlertCircle } from 'lucide-react';
import { useExamRooms } from '@/hooks/useExamRooms';
import { ExamRoomFilters } from '@/components/exams/rooms/ExamRoomFilters';
import { ExamRoomCard } from '@/components/exams/rooms/ExamRoomCard';
import { CreateRoomDialog } from '@/components/infrastructure/CreateRoomDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Rooms() {
  const { 
    rooms, 
    loading, 
    error, 
    fetchRooms, 
    checkRoomAvailability,
    getRoomUtilization,
    createRoom,
    updateRoom,
    deleteRoom 
  } = useExamRooms();

  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [utilizationData, setUtilizationData] = useState<Record<string, any>>({});

  // Charger les données d'utilisation pour chaque salle
  useEffect(() => {
    const loadUtilizationData = async () => {
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const utilData: Record<string, any> = {};
      
      for (const room of rooms) {
        const sessions = await getRoomUtilization(room.id, startDate, endDate);
        const scheduledHours = sessions.reduce((total, session) => {
          const start = new Date(session.start_time);
          const end = new Date(session.end_time);
          return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0);
        
        utilData[room.id] = {
          totalHours: 30 * 8, // 30 jours * 8h par jour
          scheduledHours: Math.round(scheduledHours * 100) / 100,
          upcomingExams: sessions.length
        };
      }
      
      setUtilizationData(utilData);
    };

    if (rooms.length > 0) {
      loadUtilizationData();
    }
  }, [rooms, getRoomUtilization]);

  const handleFiltersChange = async (filters: any) => {
    await fetchRooms(filters);
  };

  const handleEditRoom = (room: any) => {
    console.log('Edit room:', room);
    // TODO: Implémenter l'édition
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      await deleteRoom(roomId);
    }
  };

  const handleViewSchedule = (room: any) => {
    console.log('View schedule for room:', room);
    // TODO: Implémenter la vue planning
  };

  const handleCreateSuccess = async () => {
    setIsCreateDialogOpen(false);
    await fetchRooms();
  };

  // Métriques globales
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
  const averageUtilization = Object.values(utilizationData).length > 0 
    ? Object.values(utilizationData).reduce((sum: number, data: any) => 
        sum + (data.scheduledHours / data.totalHours * 100), 0) / Object.values(utilizationData).length
    : 0;

  if (loading && rooms.length === 0) {
    return (
      <ExamsModuleLayout 
        title="Gestion salles" 
        subtitle="Capacités et attribution des salles"
      >
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Chargement des salles...</div>
        </div>
      </ExamsModuleLayout>
    );
  }

  return (
    <ExamsModuleLayout 
      title="Gestion salles" 
      subtitle="Capacités et attribution des salles"
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Métriques globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalRooms}</p>
                    <p className="text-sm text-muted-foreground">Salles Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{availableRooms}</p>
                    <p className="text-sm text-muted-foreground">Disponibles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalCapacity}</p>
                    <p className="text-sm text-muted-foreground">Capacité Totale</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(averageUtilization)}%</p>
                    <p className="text-sm text-muted-foreground">Taux d'Utilisation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="rooms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rooms">Liste des Salles</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rooms" className="space-y-6">
              {/* Filtres et Actions */}
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <ExamRoomFilters onFiltersChange={handleFiltersChange} />
                </div>
                
                <CreateRoomDialog
                  isOpen={isCreateDialogOpen}
                  onOpenChange={setIsCreateDialogOpen}
                  onSuccess={handleCreateSuccess}
                />
              </div>

              {/* Liste des salles */}
              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room) => (
                    <ExamRoomCard
                      key={room.id}
                      room={room}
                      onEdit={handleEditRoom}
                      onDelete={handleDeleteRoom}
                      onViewSchedule={handleViewSchedule}
                      utilizationData={utilizationData[room.id]}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Aucune salle trouvée</h3>
                    <p className="text-muted-foreground mb-6">
                      Commencez par créer votre première salle d'examen.
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une salle
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics des Salles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Répartition par Type</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          rooms.reduce((acc, room) => {
                            acc[room.room_type] = (acc[room.room_type] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([type, count]) => (
                          <div key={type} className="flex justify-between">
                            <span className="capitalize">{type.replace('_', ' ')}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Répartition par Statut</h4>
                      <div className="space-y-2">
                        {Object.entries(
                          rooms.reduce((acc, room) => {
                            acc[room.status] = (acc[room.status] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        ).map(([status, count]) => (
                          <div key={status} className="flex justify-between">
                            <span className="capitalize">{status}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}
