
import { useState, useCallback } from 'react';
import { Timetable } from '@/hooks/useTimetables';

interface TimeSlot {
  start: string;
  end: string;
  day: number;
}

export function useTimetableDragDrop(
  timetables: Timetable[],
  updateTimetable: (id: string, updates: any) => Promise<any>
) {
  const [draggedItem, setDraggedItem] = useState<Timetable | null>(null);
  const [dropTarget, setDropTarget] = useState<TimeSlot | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);

  const detectConflicts = useCallback((day: number, startTime: string, endTime: string, excludeId?: string) => {
    return timetables.filter(slot => 
      slot.id !== excludeId &&
      slot.day_of_week === day &&
      ((slot.start_time <= startTime && slot.end_time > startTime) ||
       (slot.start_time < endTime && slot.end_time >= endTime) ||
       (slot.start_time >= startTime && slot.end_time <= endTime))
    );
  }, [timetables]);

  const handleDragStart = (e: React.DragEvent, timetable: Timetable) => {
    setDraggedItem(timetable);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, day: number, timeSlot: any) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ day, start: timeSlot.start, end: timeSlot.end });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = async (e: React.DragEvent, day: number, timeSlot: any) => {
    e.preventDefault();
    if (!draggedItem) return;

    const conflictingSlots = detectConflicts(day, timeSlot.start, timeSlot.end, draggedItem.id);
    
    if (conflictingSlots.length > 0) {
      setConflicts(conflictingSlots.map(s => s.id));
      setTimeout(() => setConflicts([]), 3000);
      return;
    }

    await updateTimetable(draggedItem.id, {
      day_of_week: day,
      start_time: timeSlot.start,
      end_time: timeSlot.end
    });

    setDraggedItem(null);
    setDropTarget(null);
  };

  return {
    draggedItem,
    dropTarget,
    conflicts,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    detectConflicts
  };
}
