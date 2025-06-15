import { Button } from '@/components/ui/button';
import { usePrograms, useTable } from '@/hooks/useSupabase';
import { StepIndicator } from './forms/StepIndicator';
import { SubjectBasicInfoStep } from './forms/SubjectBasicInfoStep';
import { SubjectAcademicConfigStep } from './forms/SubjectAcademicConfigStep';
import { useSubjectForm } from './forms/useSubjectForm';

interface SubjectFormProps {
  subject?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FORM_STEPS = [
  { number: 1, label: 'Références' },
  { number: 2, label: 'Configuration académique' }
];

export function SubjectForm({ subject, onSuccess, onCancel }: SubjectFormProps) {
  const { data: programs, loading: programsLoading } = usePrograms();
  const { data: levels } = useTable('academic_levels');
  const { data: classGroups } = useTable('class_groups');

  const {
    form,
    isSubmitting,
    currentStep,
    onSubmit,
    handleNextStep,
    handlePrevStep
  } = useSubjectForm(subject, onSuccess);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <StepIndicator currentStep={currentStep} steps={FORM_STEPS} />

      {currentStep === 1 && (
        <SubjectBasicInfoStep
          register={form.register}
          errors={form.formState.errors}
          setValue={form.setValue}
          subject={subject}
        />
      )}

      {currentStep === 2 && (
        <SubjectAcademicConfigStep
          register={form.register}
          errors={form.formState.errors}
          setValue={form.setValue}
          watch={form.watch}
          subject={subject}
          programs={programs}
          levels={levels}
          classGroups={classGroups}
        />
      )}

      <div className="flex justify-between">
        <div className="flex space-x-2">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={handlePrevStep}>
              Précédent
            </Button>
          )}
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          {currentStep < 2 ? (
            <Button type="button" onClick={handleNextStep}>
              Suivant
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting || programsLoading}>
              {isSubmitting ? (subject ? 'Modification...' : 'Création...') : (subject ? 'Modifier' : 'Créer la matière')}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}