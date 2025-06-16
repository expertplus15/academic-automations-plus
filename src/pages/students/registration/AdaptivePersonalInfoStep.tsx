
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationFormData } from './useRegistrationForm';
import { useState } from 'react';
import { UserFlowContext } from '@/services/userFlowService';
import { RealTimeValidation } from './RealTimeValidation';
import { EnhancedStatusCard } from './EnhancedStatusCard';
import { AccountRecovery } from './AccountRecovery';

interface AdaptivePersonalInfoStepProps {
  form: UseFormReturn<RegistrationFormData>;
  flowContext: UserFlowContext | null;
  onFlowContextChange?: (context: UserFlowContext | null) => void;
}

export function AdaptivePersonalInfoStep({ 
  form, 
  flowContext, 
  onFlowContextChange 
}: AdaptivePersonalInfoStepProps) {
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    canProceed: boolean;
    message: string;
  }>({ isValid: false, canProceed: false, message: '' });
  
  const [showRecovery, setShowRecovery] = useState(false);
  const email = form.watch('email');

  const handleValidationResult = (result: { isValid: boolean; canProceed: boolean; message: string }) => {
    setEmailValidation(result);
  };

  if (showRecovery) {
    return (
      <AccountRecovery 
        email={email}
        onBack={() => setShowRecovery(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête adaptatif */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {flowContext ? 
            (flowContext.flowType === 'existing_user_conversion' ? 
              'Conversion en compte étudiant' : 
              'Informations personnelles'
            ) : 
            'Informations personnelles'
          }
        </h3>
        <p className="text-muted-foreground">
          {flowContext?.flowType === 'existing_user_conversion' 
            ? 'Votre compte existant sera converti en compte étudiant.' 
            : 'Renseignez vos informations d\'identité et de contact.'
          }
        </p>
      </div>

      {/* Formulaire adaptatif */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Jean" 
                  {...field}
                  disabled={flowContext?.flowType === 'existing_user_conversion'}
                />
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
                <Input 
                  placeholder="Dupont" 
                  {...field}
                  disabled={flowContext?.flowType === 'existing_user_conversion'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Email avec validation temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="jean.dupont@email.com" 
                    {...field}
                    className={
                      emailValidation.isValid ? 'border-green-500' : 
                      emailValidation.message && !emailValidation.canProceed ? 'border-red-500' : ''
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <RealTimeValidation 
            email={email}
            onValidationResult={handleValidationResult}
          />
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="06 12 34 56 78" 
                  {...field}
                  disabled={flowContext?.flowType === 'existing_user_conversion'}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Carte de statut améliorée */}
      {flowContext && (
        <EnhancedStatusCard 
          flowContext={flowContext}
          onRecoveryClick={() => setShowRecovery(true)}
        />
      )}

      {/* Champs supplémentaires conditionnels */}
      {(!flowContext || flowContext.flowType !== 'existing_user_conversion') && (
        <>
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
        </>
      )}
    </div>
  );
}
