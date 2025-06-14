import { AcademicPageHeader } from "@/components/AcademicPageHeader";
import { useState } from 'react';
import { useTimetables, useCurrentAcademicYear } from '@/hooks/useAcademic';
import { usePrograms } from '@/hooks/useSupabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, BookOpen, Users } from 'lucide-react';

export default function Timetables() {
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const { data: currentYear } = useCurrentAcademicYear();
  const { data: programs } = usePrograms();
  const { data: timetables, loading } = useTimetables({
    academicYearId: currentYear?.id,
    programId: selectedProgram || undefined
  });

  const getDayName = (dayOfWeek: number) => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    return days[dayOfWeek - 1] || '';
  };

  const getSlotTypeColor = (type: string) => {
    switch (type) {
      case 'theory': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'lab': return 'bg-purple-100 text-purple-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSlotTypeLabel = (type: string) => {
    switch (type) {
      case 'theory': return 'Cours';
      case 'practice': return 'TD';
      case 'lab': return 'TP';
      case 'project': return 'Projet';
      default: return type;
    }
  };

  const groupedTimetables = timetables.reduce((acc, timetable) => {
    const day = getDayName(timetable.day_of_week);
    if (!acc[day]) acc[day] = [];
    acc[day].push(timetable);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-background">
      <AcademicPageHeader 
        title="Emploi du Temps" 
        subtitle="Planning intelligent" 
      />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Emplois du Temps
                  </CardTitle>
                  <CardDescription>
                    Année académique: {currentYear?.name || 'Non définie'}
                  </CardDescription>
                </div>
                <Button variant="outline">
                  Générer Planning
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Sélectionner un programme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les programmes</SelectItem>
                    {programs.map((program) => (
                      <SelectItem key={program.id} value={program.id}>
                        {program.code} - {program.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Chargement des emplois du temps...</p>
            </div>
          ) : timetables.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucun emploi du temps</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun cours planifié pour les critères sélectionnés.
                </p>
                <Button>Créer un nouveau créneau</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(groupedTimetables).map(([day, dayTimetables]) => (
                <Card key={day}>
                  <CardHeader>
                    <CardTitle className="text-lg">{day}</CardTitle>
                    <CardDescription>
                      {dayTimetables.length} cours programmé{dayTimetables.length > 1 ? 's' : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dayTimetables
                        .sort((a, b) => a.start_time.localeCompare(b.start_time))
                        .map((timetable) => (
                          <div
                            key={timetable.id}
                            className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {timetable.start_time} - {timetable.end_time}
                                </span>
                              </div>
                              <Badge className={getSlotTypeColor(timetable.slot_type)}>
                                {getSlotTypeLabel(timetable.slot_type)}
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{timetable.subjects?.name}</span>
                              </div>
                              
                              {timetable.profiles && (
                                <div className="flex items-center gap-2">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{timetable.profiles.full_name}</span>
                                </div>
                              )}
                              
                              {timetable.rooms && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{timetable.rooms.name}</span>
                                </div>
                              )}
                              
                              {timetable.class_groups && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{timetable.class_groups.name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}