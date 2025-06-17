
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubjectSelector } from './SubjectSelector';
import { RoomSelector } from './RoomSelector';
import { TeacherSelector } from './TeacherSelector';
import { GroupSelector } from './GroupSelector';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

interface TimetableSlotFormFieldsProps {
  formData: {
    subject_id: string;
    room_id: string;
    teacher_id: string;
    group_id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
    slot_type: string;
  };
  onChange: (field: string, value: any) => void;
  programId?: string;
  academicYearId?: string;
}

export function TimetableSlotFormFields({ 
  formData, 
  onChange, 
  programId, 
  academicYearId 
}: TimetableSlotFormFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Jour de la semaine</Label>
        <Select 
          value={formData.day_of_week.toString()} 
          onValueChange={(value) => onChange('day_of_week', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((day, index) => (
              <SelectItem key={index + 1} value={(index + 1).toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Heure de début</Label>
          <Input 
            type="time" 
            value={formData.start_time}
            onChange={(e) => onChange('start_time', e.target.value)}
          />
        </div>
        <div>
          <Label>Heure de fin</Label>
          <Input 
            type="time" 
            value={formData.end_time}
            onChange={(e) => onChange('end_time', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Type de créneau</Label>
        <Select 
          value={formData.slot_type} 
          onValueChange={(value) => onChange('slot_type', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="course">Cours</SelectItem>
            <SelectItem value="practical">TP</SelectItem>
            <SelectItem value="exam">Examen</SelectItem>
            <SelectItem value="conference">Conférence</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SubjectSelector
        value={formData.subject_id}
        onChange={(value) => onChange('subject_id', value)}
        programId={programId}
        required
      />

      <RoomSelector
        value={formData.room_id}
        onChange={(value) => onChange('room_id', value)}
        required
      />

      <TeacherSelector
        value={formData.teacher_id}
        onChange={(value) => onChange('teacher_id', value)}
        required
      />

      <GroupSelector
        value={formData.group_id}
        onChange={(value) => onChange('group_id', value)}
        programId={programId}
        academicYearId={academicYearId}
      />
    </div>
  );
}
