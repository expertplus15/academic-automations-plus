
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from './useRegistrationForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { checkEmailExists } from '@/services/emailVerificationService';
import { useDebounce } from '@/hooks/useDebounce';

interface PersonalInfoStepProps {
  form: UseFormReturn<RegistrationFormData>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  const [emailStatus, setEmailStatus] = useState<'checking' | 'available' | 'existing' | 'student' | 'error' | null>(null);
  const email = form.watch('email');
  const debouncedEmail = useDebounce(email, 1000);

  useEffect(() => {
    if (debouncedEmail && debouncedEmail.includes('@')) {
      setEmailStatus('checking');
      checkEmailExists(debouncedEmail)
        .then(result => {
          if (result.isStudent) {
            setEmailStatus('student');
          } else if (result.hasProfile) {
            setEmailStatus('existing');
          } else {
            setEmailStatus('available');
          }
        })
        .catch(() => setEmailStatus('error'));
    } else {
      setEmailStatus(null);
    }
  }, [debouncedEmail]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Informations personnelles</h3>
        <p className="text-muted-foreground">Renseignez vos informations d'identité et de contact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom *</FormLabel>
              <FormControl>
                <Input placeholder="Jean" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input placeholder="Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jean.dupont@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {emailStatus && (
            <Alert className={`
              ${emailStatus === 'available' ? 'border-green-200 bg-green-50' : ''}
              ${emailStatus === 'student' ? 'border-red-200 bg-red-50' : ''}
              ${emailStatus === 'existing' ? 'border-yellow-200 bg-yellow-50' : ''}
              ${emailStatus === 'checking' ? 'border-blue-200 bg-blue-50' : ''}
            `}>
              <div className="flex items-center gap-2">
                {emailStatus === 'available' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {emailStatus === 'student' && <AlertCircle className="w-4 h-4 text-red-600" />}
                {emailStatus === 'existing' && <Info className="w-4 h-4 text-yellow-600" />}
                {emailStatus === 'checking' && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                
                <AlertDescription className="text-sm">
                  {emailStatus === 'checking' && 'Vérification en cours...'}
                  {emailStatus === 'available' && 'Email disponible pour l\'inscription'}
                  {emailStatus === 'student' && 'Ce compte étudiant existe déjà. Veuillez vous connecter.'}
                  {emailStatus === 'existing' && 'Compte existant détecté. Il sera converti en compte étudiant.'}
                  {emailStatus === 'error' && 'Erreur lors de la vérification de l\'email'}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone *</FormLabel>
              <FormControl>
                <Input placeholder="06 12 34 56 78" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date de naissance *</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse complète *</FormLabel>
            <FormControl>
              <Input placeholder="123 rue de la République, 75001 Paris" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
