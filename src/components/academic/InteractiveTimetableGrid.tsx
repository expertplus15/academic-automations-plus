
import React, { useState, useCallback } from 'react';
import { useTimetables, Timetable } from '@/hooks/useTimetables';
import { TimetableSlotModal } from './TimetableSlotModal';
import { TimetableHeader } from './timetable/TimetableHeader';
import { ConflictAlert } from './timetable/ConflictAlert';
import { TimetableGrid } from './timetable/TimetableGrid';
import { useTimetableDragDrop } from './timetable/useTimetableDragDrop';

interface InteractiveTimetableGridProps {
  programId?: string;
  academicYearId?: string;
}

const TIME_SLOTS = [
  { start: '08:00', end: '10:00' },
  { start: '10:30', end: '12:30' },
  { start: '14:00', end: '16:00' },
  { start: '16:30', end: '18:30' },
];

export function InteractiveTimetableGrid({ programId, academicYearId }: InteractiveTimetableGridProps) {
  const { timetables, loading, updateTimetable, deleteTimetable, createTimetable } = useTimetables(programId, academicYearId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<Timetable | null>(null);
  const [newSlotPosition, setNewSlotPosition] = useState<{ day: number; start: string; end: string } | null>(null);

  const {
    dropTarget,
    conflicts,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useTimetableDragDrop(timetables, updateTimetable);

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

  const handleNewSlotFromHeader = () => {
    setNewSlotPosition({ day: 1, start: '08:00', end: '10:00' });
    setEditingSlot(null);
    setModalOpen(true);
  };

  const handleSaveSlot = async (data: any) => {
    try {
      if (editingSlot) {
        await updateTimetable(editingSlot.id, data);
      } else {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Chargement de l'emploi du temps...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TimetableHeader onNewSlot={handleNewSlotFromHeader} />
      
      <ConflictAlert conflicts={conflicts} />

      <TimetableGrid
        slotsGrid={slotsGrid}
        conflicts={conflicts}
        dropTarget={dropTarget}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragStart={handleDragStart}
        onEditSlot={handleEditSlot}
        onDeleteSlot={handleDeleteSlot}
        onNewSlot={handleNewSlot}
      />

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
