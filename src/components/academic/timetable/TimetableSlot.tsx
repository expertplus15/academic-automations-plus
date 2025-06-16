
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, BookOpen, MapPin, User, Plus } from 'lucide-react';
import { Timetable } from '@/hooks/useTimetables';
import { cn } from '@/lib/utils';

interface TimetableSlotProps {
  timetable?: Timetable;
  isDropTarget: boolean;
  hasConflict: boolean;
  onDragStart: (e: React.DragEvent, timetable: Timetable) => void;
  onEdit: (timetable: Timetable) => void;
  onDelete: (id: string) => void;
  onNewSlot: () => void;
}

export function TimetableSlot({
  timetable,
  isDropTarget,
  hasConflict,
  onDragStart,
  onEdit,
  onDelete,
  onNewSlot
}: TimetableSlotProps) {
  if (timetable) {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, timetable)}
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
                  onEdit(timetable);
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
                  onDelete(timetable.id);
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
    );
  }

  return (
    <div className="absolute inset-2 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors">
      <Plus className="h-8 w-8 text-muted-foreground/40" />
    </div>
  );
}
