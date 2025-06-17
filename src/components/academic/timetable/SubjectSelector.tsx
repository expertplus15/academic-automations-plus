
import React from 'react';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';
import { useSubjects } from '@/hooks/useSubjects';

interface SubjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  programId?: string;
  required?: boolean;
}

export function SubjectSelector({ value, onChange, programId, required = false }: SubjectSelectorProps) {
  const { subjects, loading } = useSubjects(programId);

  const options = subjects.map(subject => ({
    value: subject.id,
    label: subject.name,
    description: `${subject.code} • ${subject.credits_ects} ECTS`
  }));

  return (
    <div>
      <Label>Matière {required && '*'}</Label>
      <Combobox
        options={options}
        value={value}
        onValueChange={onChange}
        placeholder={loading ? "Chargement..." : "Sélectionner une matière"}
        searchPlaceholder="Rechercher une matière..."
        emptyMessage="Aucune matière trouvée."
        disabled={loading}
      />
    </div>
  );
}
