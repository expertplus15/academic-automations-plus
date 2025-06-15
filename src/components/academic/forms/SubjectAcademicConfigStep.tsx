import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectFormData } from './useSubjectForm';

interface SubjectAcademicConfigStepProps {
  register: UseFormRegister<SubjectFormData>;
  errors: FieldErrors<SubjectFormData>;
  setValue: UseFormSetValue<SubjectFormData>;
  watch: UseFormWatch<SubjectFormData>;
  subject?: any;
  programs?: any[];
  levels?: any[];
  classGroups?: any[];
}

export function SubjectAcademicConfigStep({ 
  register, 
  errors, 
  setValue, 
  watch, 
  subject, 
  programs, 
  levels, 
  classGroups 
}: SubjectAcademicConfigStepProps) {
  const watchedHours = watch(['hours_theory', 'hours_practice', 'hours_project']);
  const totalHours = (watchedHours[0] || 0) + (watchedHours[1] || 0) + (watchedHours[2] || 0);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuration académique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="credits_ects" className="text-sm font-semibold">Crédits ECTS *</Label>
                <p className="text-xs text-muted-foreground">
                  Système européen de transfert et d'accumulation de crédits (1-30)
                </p>
              </div>
              <div className="relative">
                <Input
                  id="credits_ects"
                  type="number"
                  min="1"
                  max="30"
                  {...register('credits_ects')}
                  placeholder="6"
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  ECTS
                </div>
              </div>
              {errors.credits_ects && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center">!</span>
                  {errors.credits_ects.message}
                </p>
              )}
              <div className="bg-muted/50 p-2 rounded-md">
                <p className="text-xs text-muted-foreground">
                  💡 Référence: Licence (6 ECTS), Master (3-9 ECTS)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="coefficient" className="text-sm font-semibold">Coefficient *</Label>
                <p className="text-xs text-muted-foreground">
                  Poids de la matière dans le calcul des moyennes (0.5-5.0)
                </p>
              </div>
              <div className="relative">
                <Input
                  id="coefficient"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="5"
                  {...register('coefficient')}
                  placeholder="1.0"
                  className="pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  x{watch('coefficient') || '1'}
                </div>
              </div>
              {errors.coefficient && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center">!</span>
                  {errors.coefficient.message}
                </p>
              )}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Impact</span>
                  <span className={`font-medium ${
                    (watch('coefficient') || 1) >= 2 ? 'text-orange-600' : 
                    (watch('coefficient') || 1) >= 1.5 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {(watch('coefficient') || 1) >= 2 ? 'Élevé' : 
                     (watch('coefficient') || 1) >= 1.5 ? 'Moyen' : 'Standard'}
                  </span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      (watch('coefficient') || 1) >= 2 ? 'bg-orange-500' : 
                      (watch('coefficient') || 1) >= 1.5 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(((watch('coefficient') || 1) / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Programme</Label>
            <Select onValueChange={(value) => setValue('program_id', value)} defaultValue={subject?.program_id || ''}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un programme (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {programs?.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name} ({program.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Niveau académique</Label>
              <Select onValueChange={(value) => setValue('level_id', value)} defaultValue={subject?.level_id || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {levels?.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name} ({level.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Classe</Label>
              <Select onValueChange={(value) => setValue('class_group_id', value)} defaultValue={subject?.class_group_id || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {classGroups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name} ({group.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Volume horaire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours_theory">Heures de théorie</Label>
              <Input
                id="hours_theory"
                type="number"
                min="0"
                max="200"
                {...register('hours_theory')}
                placeholder="0"
              />
              {errors.hours_theory && (
                <p className="text-sm text-destructive">{errors.hours_theory.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours_practice">Heures de pratique</Label>
              <Input
                id="hours_practice"
                type="number"
                min="0"
                max="200"
                {...register('hours_practice')}
                placeholder="0"
              />
              {errors.hours_practice && (
                <p className="text-sm text-destructive">{errors.hours_practice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours_project">Heures de projet</Label>
              <Input
                id="hours_project"
                type="number"
                min="0"
                max="200"
                {...register('hours_project')}
                placeholder="0"
              />
              {errors.hours_project && (
                <p className="text-sm text-destructive">{errors.hours_project.message}</p>
              )}
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Volume horaire total:</span>
              <span className="text-lg font-bold">{totalHours} heures</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}