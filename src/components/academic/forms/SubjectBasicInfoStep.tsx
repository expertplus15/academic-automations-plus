import { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubjectFormData } from './useSubjectForm';

interface SubjectBasicInfoStepProps {
  register: UseFormRegister<SubjectFormData>;
  errors: FieldErrors<SubjectFormData>;
  setValue: UseFormSetValue<SubjectFormData>;
  subject?: any;
}

export function SubjectBasicInfoStep({ register, errors, setValue, subject }: SubjectBasicInfoStepProps) {
  return (
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
              {...register('name')}
              placeholder="Ex: Bases de données relationnelles"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code de la matière *</Label>
            <Input
              id="code"
              {...register('code')}
              placeholder="Ex: BD101"
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Description détaillée de la matière..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Statut</Label>
          <Select onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'archived')} defaultValue={subject?.status || 'active'}>
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
  );
}