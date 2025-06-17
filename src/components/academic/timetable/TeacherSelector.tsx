
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTable } from '@/hooks/useSupabase';

interface TeacherSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TeacherSelector({ value, onValueChange }: TeacherSelectorProps) {
  const { data: teachers, loading } = useTable('profiles', '*', { role: 'teacher' });

  return (
    <div>
      <Label>Enseignant *</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un enseignant"} />
        </SelectTrigger>
        <SelectContent>
          {teachers?.map((teacher) => (
            <SelectItem key={teacher.id} value={teacher.id}>
              {teacher.full_name || teacher.email}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
