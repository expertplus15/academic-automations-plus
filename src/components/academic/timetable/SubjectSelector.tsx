
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTable } from '@/hooks/useSupabase';

interface SubjectSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  programId?: string;
}

export function SubjectSelector({ value, onValueChange, programId }: SubjectSelectorProps) {
  const { data: subjects, loading } = useTable('subjects', `
    *,
    programs!subjects_program_id_fkey(name)
  `, programId ? { program_id: programId } : undefined);

  return (
    <div>
      <Label>Matière *</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner une matière"} />
        </SelectTrigger>
        <SelectContent>
          {subjects?.map((subject) => (
            <SelectItem key={subject.id} value={subject.id}>
              {subject.code} - {subject.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
