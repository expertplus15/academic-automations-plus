import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrograms, useTable } from '@/hooks/useSupabase';
import { useSubjectForm } from './forms/useSubjectForm';

interface SubjectFormProps {
  subject?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SubjectForm({ subject, onSuccess, onCancel }: SubjectFormProps) {
  const { data: programs, loading: programsLoading } = usePrograms();
  const { data: levels } = useTable('academic_levels');
  const { data: classGroups } = useTable('class_groups');

  const {
    form,
    isSubmitting,
    onSubmit
  } = useSubjectForm(subject, onSuccess);

  const watchedHours = form.watch(['hours_theory', 'hours_practice', 'hours_project']);
  const totalHours = (watchedHours[0] || 0) + (watchedHours[1] || 0) + (watchedHours[2] || 0);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Références de la matière */}
      <Card>
        <CardHeader>
          <CardTitle>Références de la matière</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la matière *</Label>
              <Input
                id="name"
                {...form.register('name')}
                placeholder="Ex: Bases de données relationnelles"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code de la matière *</Label>
              <Input
                id="code"
                {...form.register('code')}
                placeholder="Ex: BD101"
              />
              {form.formState.errors.code && (
                <p className="text-sm text-destructive">{form.formState.errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              placeholder="Description détaillée de la matière..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Statut</Label>
            <Select onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive' | 'archived')} defaultValue={subject?.status || 'active'}>
              <SelectTrigger>
                <SelectValue placeholder="Statut de la matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="archived">Archivé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Configuration académique */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration académique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                  {...form.register('credits_ects')}
                  placeholder="6"
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  ECTS
                </div>
              </div>
              {form.formState.errors.credits_ects && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center">!</span>
                  {form.formState.errors.credits_ects.message}
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
                  {...form.register('coefficient')}
                  placeholder="1.0"
                  className="pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                  x{form.watch('coefficient') || '1'}
                </div>
              </div>
              {form.formState.errors.coefficient && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-destructive/20 flex items-center justify-center">!</span>
                  {form.formState.errors.coefficient.message}
                </p>
              )}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Impact</span>
                  <span className={`font-medium ${
                    (form.watch('coefficient') || 1) >= 2 ? 'text-orange-600' : 
                    (form.watch('coefficient') || 1) >= 1.5 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {(form.watch('coefficient') || 1) >= 2 ? 'Élevé' : 
                     (form.watch('coefficient') || 1) >= 1.5 ? 'Moyen' : 'Standard'}
                  </span>
                </div>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      (form.watch('coefficient') || 1) >= 2 ? 'bg-orange-500' : 
                      (form.watch('coefficient') || 1) >= 1.5 ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(((form.watch('coefficient') || 1) / 5) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Programme</Label>
            <Select onValueChange={(value) => form.setValue('program_id', value)} defaultValue={subject?.program_id || ''}>
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
              <Select onValueChange={(value) => form.setValue('level_id', value)} defaultValue={subject?.level_id || ''}>
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
              <Select onValueChange={(value) => form.setValue('class_group_id', value)} defaultValue={subject?.class_group_id || ''}>
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

      {/* Volume horaire */}
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
                {...form.register('hours_theory')}
                placeholder="0"
              />
              {form.formState.errors.hours_theory && (
                <p className="text-sm text-destructive">{form.formState.errors.hours_theory.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours_practice">Heures de pratique</Label>
              <Input
                id="hours_practice"
                type="number"
                min="0"
                max="200"
                {...form.register('hours_practice')}
                placeholder="0"
              />
              {form.formState.errors.hours_practice && (
                <p className="text-sm text-destructive">{form.formState.errors.hours_practice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours_project">Heures de projet</Label>
              <Input
                id="hours_project"
                type="number"
                min="0"
                max="200"
                {...form.register('hours_project')}
                placeholder="0"
              />
              {form.formState.errors.hours_project && (
                <p className="text-sm text-destructive">{form.formState.errors.hours_project.message}</p>
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

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || programsLoading}>
          {isSubmitting ? (subject ? 'Modification...' : 'Création...') : (subject ? 'Modifier' : 'Créer la matière')}
        </Button>
      </div>
    </form>
  );
}