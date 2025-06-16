
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User, BookOpen, Edit3, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useTimetables, Timetable } from '@/hooks/useTimetables';
import { TimetableSlotModal } from './TimetableSlotModal';
import { cn } from '@/lib/utils';

interface InteractiveTimetableGridProps {
  programId?: string;
  academicYearId?: string;
}

interface TimeSlot {
  start: string;
  end: string;
  day: number;
}

const TIME_SLOTS = [
  { start: '08:00', end: '10:00' },
  { start: '10:30', end: '12:30' },
  { start: '14:00', end: '16:00' },
  { start: '16:30', end: '18:30' },
];

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function InteractiveTimetableGrid({ programId, academicYearId }: InteractiveTimetableGridProps) {
  const { timetables, loading, updateTimetable, deleteTimetable, createTimetable } = useTimetables(programId, academicYearId);
  const [draggedItem, setDraggedItem] = useState<Timetable | null>(null);
  const [dropTarget, setDropTarget] = useState<TimeSlot | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Timetable | null>(null);
  const [newSlotPosition, setNewSlotPosition] = useState<{ day: number; start: string; end: string } | null>(null);

  // Organiser les créneaux par jour et heure
  const organizeSlots = useCallback(() => {
    const grid: { [key: string]: Timetable } = {};
    timetables.forEach(timetable => {
      if (timetable.day_of_week !== null && timetable.day_of_week !== undefined) {
        const key = `${timetable.day_of_week}-${timetable.start_time}`;
        grid[key] = timetable;
      }
    });
    return grid;
  }, [timetables]);

  const slotsGrid = organizeSlots();

  // Détecter les conflits
  const detectConflicts = useCallback((day: number, startTime: string, endTime: string, excludeId?: string) => {
    return timetables.filter(slot => 
      slot.id !== excludeId &&
      slot.day_of_week === day &&
      ((slot.start_time <= startTime && slot.end_time > startTime) ||
       (slot.start_time < endTime && slot.end_time >= endTime) ||
       (slot.start_time >= startTime && slot.end_time <= endTime))
    );
  }, [timetables]);

  // Gestion du glisser-déposer
  const handleDragStart = (e: React.DragEvent, timetable: Timetable) => {
    setDraggedItem(timetable);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, day: number, timeSlot: typeof TIME_SLOTS[0]) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ day, start: timeSlot.start, end: timeSlot.end });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, day: number, timeSlot: typeof TIME_SLOTS[0]) => {
    e.preventDefault();
    if (!draggedItem) return;

    // Vérifier les conflits
    const conflictingSlots = detectConflicts(day, timeSlot.start, timeSlot.end, draggedItem.id);
    
    if (conflictingSlots.length > 0) {
      setConflicts(conflictingSlots.map(s => s.id));
      setTimeout(() => setConflicts([]), 3000);
      return;
    }

    // Mettre à jour le créneau
    await updateTimetable(draggedItem.id, {
      day_of_week: day,
      start_time: timeSlot.start,
      end_time: timeSlot.end
    });

    setDraggedItem(null);
    setDropTarget(null);
  };

  const handleEditSlot = (timetable: Timetable) => {
    setEditingSlot(timetable);
    setModalOpen(true);
  };

  const handleDeleteSlot = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      await deleteTimetable(id);
    }
  };

  const handleNewSlot = (day: number, timeSlot: typeof TIME_SLOTS[0]) => {
    setNewSlotPosition({ day, start: timeSlot.start, end: timeSlot.end });
    setEditingSlot(null);
    setModalOpen(true);
  };

  const handleSaveSlot = async (data: any) => {
    try {
      if (editingSlot) {
        // Modification d'un créneau existant
        await updateTimetable(editingSlot.id, data);
      } else {
        // Création d'un nouveau créneau
        await createTimetable({
          ...data,
          program_id: programId,
          academic_year_id: academicYearId
        });
      }
      setModalOpen(false);
      setEditingSlot(null);
      setNewSlotPosition(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const getSlotKey = (day: number, timeStart: string) => `${day}-${timeStart}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement de l'emploi du temps...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Emploi du Temps Interactif</h3>
          <p className="text-sm text-muted-foreground">
            Glissez-déposez les créneaux pour les réorganiser ou cliquez sur + pour ajouter
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => {
            setNewSlotPosition({ day: 1, start: '08:00', end: '10:00' });
            setEditingSlot(null);
            setModalOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau créneau
          </Button>
        </div>
      </div>

      {/* Conflits détectés */}
      {conflicts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Conflit détecté !</span>
              <span className="text-sm">Impossible de déplacer le créneau - slot occupé</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grille d'emploi du temps */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[1200px]">
              {/* En-tête des jours */}
              <div className="p-4 border-r border-b bg-muted font-semibold text-center">
                Horaires
              </div>
              {DAYS.map((day, index) => (
                <div key={day} className="p-4 border-r border-b bg-muted text-center font-semibold">
                  {day}
                </div>
              ))}

              {/* Créneaux horaires */}
              {TIME_SLOTS.map((timeSlot) => (
                <React.Fragment key={timeSlot.start}>
                  {/* Colonne horaire */}
                  <div className="p-4 border-r border-b bg-muted/50 text-sm font-medium flex items-center justify-center">
                    <div className="text-center">
                      <div>{timeSlot.start}</div>
                      <div className="text-xs text-muted-foreground">{timeSlot.end}</div>
                    </div>
                  </div>
                  
                  {/* Cellules pour chaque jour */}
                  {DAYS.map((_, dayIndex) => {
                    const day = dayIndex + 1; // Les jours commencent à 1 en base de données
                    const slotKey = getSlotKey(day, timeSlot.start);
                    const timetable = slotsGrid[slotKey];
                    const isDropTarget = dropTarget?.day === day && dropTarget?.start === timeSlot.start;
                    const hasConflict = conflicts.includes(timetable?.id || '');

                    return (
                      <div
                        key={`${day}-${timeSlot.start}`}
                        className={cn(
                          "min-h-[120px] border-r border-b relative",
                          "transition-all duration-200",
                          isDropTarget && "bg-blue-50 border-blue-300",
                          !timetable && "hover:bg-accent/30 cursor-pointer"
                        )}
                        onDragOver={(e) => handleDragOver(e, day, timeSlot)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day, timeSlot)}
                        onClick={() => !timetable && handleNewSlot(day, timeSlot)}
                      >
                        {timetable ? (
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, timetable)}
                            className={cn(
                              "absolute inset-2 p-3 rounded-lg cursor-move",
                              "bg-gradient-to-r from-blue-50 to-blue-100",
                              "border-l-4 border-blue-500",
                              "hover:shadow-md transition-all duration-200",
                              "transform hover:scale-[1.02]",
                              hasConflict && "border-red-500 bg-red-50"
                            )}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  {timetable.slot_type === 'course' ? 'Cours' : 
                                   timetable.slot_type === 'exam' ? 'Examen' : 
                                   timetable.slot_type === 'practical' ? 'TP' : timetable.slot_type}
                                </Badge>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditSlot(timetable);
                                    }}
                                  >
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSlot(timetable.id);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-1 font-medium">
                                  <BookOpen className="h-3 w-3 text-blue-600" />
                                  <span className="truncate">
                                    {timetable.subject?.name || 'Matière non définie'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-3 w-3 text-green-600" />
                                  <span className="truncate">
                                    {timetable.room?.name || 'Salle non définie'}
                                  </span>
                                </div>
                                
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <User className="h-3 w-3 text-purple-600" />
                                  <span className="truncate">
                                    {timetable.teacher?.full_name || 'Enseignant non assigné'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-2 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
                            <Plus className="h-8 w-8 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal d'édition/création */}
      <TimetableSlotModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingSlot(null);
          setNewSlotPosition(null);
        }}
        onSave={handleSaveSlot}
        slot={editingSlot}
        timeSlot={newSlotPosition}
      />
    </div>
  );
}
