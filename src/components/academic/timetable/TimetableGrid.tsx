
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TimetableSlot } from './TimetableSlot';
import { Timetable } from '@/hooks/useTimetables';
import { cn } from '@/lib/utils';

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

interface TimetableGridProps {
  slotsGrid: { [key: string]: Timetable };
  conflicts: string[];
  dropTarget: TimeSlot | null;
  onDragOver: (e: React.DragEvent, day: number, timeSlot: typeof TIME_SLOTS[0]) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, day: number, timeSlot: typeof TIME_SLOTS[0]) => void;
  onDragStart: (e: React.DragEvent, timetable: Timetable) => void;
  onEditSlot: (timetable: Timetable) => void;
  onDeleteSlot: (id: string) => void;
  onNewSlot: (day: number, timeSlot: typeof TIME_SLOTS[0]) => void;
}

export function TimetableGrid({
  slotsGrid,
  conflicts,
  dropTarget,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onEditSlot,
  onDeleteSlot,
  onNewSlot
}: TimetableGridProps) {
  const getSlotKey = (day: number, timeStart: string) => `${day}-${timeStart}`;

  return (
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
                  const day = dayIndex + 1;
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
                      onDragOver={(e) => onDragOver(e, day, timeSlot)}
                      onDragLeave={onDragLeave}
                      onDrop={(e) => onDrop(e, day, timeSlot)}
                      onClick={() => !timetable && onNewSlot(day, timeSlot)}
                    >
                      <TimetableSlot
                        timetable={timetable}
                        isDropTarget={isDropTarget}
                        hasConflict={hasConflict}
                        onDragStart={onDragStart}
                        onEdit={onEditSlot}
                        onDelete={onDeleteSlot}
                        onNewSlot={() => onNewSlot(day, timeSlot)}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
