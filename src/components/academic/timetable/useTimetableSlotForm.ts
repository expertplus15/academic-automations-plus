
import { useState, useEffect } from 'react';
import { Timetable } from '@/hooks/useTimetables';

interface TimetableSlotFormData {
  subject_id: string;
  room_id: string;
  teacher_id: string;
  group_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_type: string;
  status: string;
}

export function useTimetableSlotForm(
  isOpen: boolean,
  slot?: Timetable | null,
  timeSlot?: { day: number; start: string; end: string } | null
) {
  const [formData, setFormData] = useState<TimetableSlotFormData>({
    subject_id: '',
    room_id: '',
    teacher_id: '',
    group_id: '',
    day_of_week: 1,
    start_time: '08:00',
    end_time: '10:00',
    slot_type: 'course',
    status: 'scheduled'
  });

  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened with slot:', slot);
      console.log('Modal opened with timeSlot:', timeSlot);
      
      setFormData({
        subject_id: slot?.subject_id || '',
        room_id: slot?.room_id || '',
        teacher_id: slot?.teacher_id || '',
        group_id: slot?.group_id || '',
        day_of_week: timeSlot?.day || slot?.day_of_week || 1,
        start_time: timeSlot?.start || slot?.start_time || '08:00',
        end_time: timeSlot?.end || slot?.end_time || '10:00',
        slot_type: slot?.slot_type || 'course',
        status: slot?.status || 'scheduled'
      });
    }
  }, [isOpen, slot, timeSlot]);

  const handleChange = (field: string, value: any) => {
    console.log(`Changing ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    handleChange
  };
}
