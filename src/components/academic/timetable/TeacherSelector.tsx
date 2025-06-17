
import React from 'react';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { useTeachers } from '@/hooks/useTeachers';

interface TeacherSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function TeacherSelector({ value, onChange, required = false }: TeacherSelectorProps) {
  const { teachers, loading } = useTeachers();

  const options = teachers.map(teacher => ({
    value: teacher.id,
    label: teacher.full_name,
    description: teacher.email
  }));

  return (
    <div>
      <Label>Enseignant {required && '*'}</Label>
      <Combobox
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder={loading ? "Chargement..." : "Sélectionner un enseignant"}
        searchPlaceholder="Rechercher un enseignant..."
        emptyMessage="Aucun enseignant trouvé."
        disabled={loading}
      />
    </div>
  );
}
