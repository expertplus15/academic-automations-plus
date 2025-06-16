
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from './useRegistrationForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { checkEmailExists } from '@/services/emailVerificationService';
import { createUserFlowContext, UserFlowContext } from '@/services/userFlowService';
import { useDebounce } from '@/hooks/useDebounce';
import { FlowIndicator } from './FlowIndicator';
import { ExistingUserActions } from './ExistingUserActions';

interface EnhancedPersonalInfoStepProps {
  form: UseFormReturn<RegistrationFormData>;
  onFlowContextChange?: (context: UserFlowContext | null) => void;
}

export function EnhancedPersonalInfoStep({ form, onFlowContextChange }: EnhancedPersonalInfoStepProps) {
  const [emailStatus, setEmailStatus] = useState<'checking' | 'available' | 'existing' | 'student' | 'error' | null>(null);
  const [flowContext, setFlowContext] = useState<UserFlowContext | null>(null);
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

          // Créer le contexte de flux
          const context = createUserFlowContext(result, form.getValues());
          setFlowContext(context);
          onFlowContextChange?.(context);
        })
        .catch(() => {
          setEmailStatus('error');
          setFlowContext(null);
          onFlowContextChange?.(null);
        });
    } else {
      setEmailStatus(null);
      setFlowContext(null);
      onFlowContextChange?.(null);
    }
  }, [debouncedEmail, form, onFlowContextChange]);

  const renderEmailStatus = () => {
    if (!emailStatus) return null;

    const statusConfig = {
      checking: {
        icon: <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />,
        message: 'Vérification en cours...',
        className: 'border-blue-200 bg-blue-50'
      },
      available: {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        message: 'Email disponible pour l\'inscription',
        className: 'border-green-200 bg-green-50'
      },
      existing: {
        icon: <Info className="w-4 h-4 text-blue-600" />,
        message: 'Compte existant détecté - sera converti en compte étudiant',
        className: 'border-blue-200 bg-blue-50'
      },
      student: {
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        message: 'Compte étudiant existant - connexion requise',
        className: 'border-red-200 bg-red-50'
      },
      error: {
        icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        message: 'Erreur lors de la vérification',
        className: 'border-red-200 bg-red-50'
      }
    };

    const config = statusConfig[emailStatus];

    return (
      <Alert className={config.className}>
        <div className="flex items-center gap-2">
          {config.icon}
          <AlertDescription className="text-sm">
            {config.message}
          </AlertDescription>
        </div>
      </Alert>
    );
  };

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
          
          {renderEmailStatus()}
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

      {/* Indicateur de flux et actions */}
      {flowContext && (
        <div className="space-y-4">
          <FlowIndicator flowContext={flowContext} />
          
          {flowContext.flowType === 'existing_student' && (
            <ExistingUserActions flowContext={flowContext} />
          )}
        </div>
      )}

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
