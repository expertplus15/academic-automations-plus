
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from './useRegistrationForm';
import { useDepartments, usePrograms, useAcademicLevels } from '@/hooks/useSupabase';
import { useEffect } from 'react';

interface ProgramSelectionStepProps {
  form: UseFormReturn<RegistrationFormData>;
}

export function ProgramSelectionStep({ form }: ProgramSelectionStepProps) {
  const { data: departments } = useDepartments();
  const { data: programs } = usePrograms();
  const { data: levels } = useAcademicLevels();

  const selectedDepartment = form.watch('departmentId');
  const filteredPrograms = programs.filter(program => program.department_id === selectedDepartment);

  // Reset program when department changes
  useEffect(() => {
    if (selectedDepartment) {
      form.setValue('programId', '');
    }
  }, [selectedDepartment, form]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choix du programme</h3>
        <p className="text-muted-foreground">Sélectionnez votre formation et niveau d'études.</p>
      </div>

      <FormField
        control={form.control}
        name="departmentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Département *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un département" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name} ({dept.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="programId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Programme *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDepartment}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un programme" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {filteredPrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="yearLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Niveau d'entrée *</FormLabel>
              <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      Année {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Spécialisation (optionnel)</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aucune spécialisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Aucune spécialisation</SelectItem>
                    <SelectItem value="intelligence-artificielle">Intelligence Artificielle</SelectItem>
                    <SelectItem value="cybersecurite">Cybersécurité</SelectItem>
                    <SelectItem value="developpement-web">Développement Web</SelectItem>
                    <SelectItem value="data-science">Data Science</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
