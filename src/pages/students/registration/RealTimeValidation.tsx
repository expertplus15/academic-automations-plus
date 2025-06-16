
import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { checkEmailExists } from '@/services/emailVerificationService';
import { useDebounce } from '@/hooks/useDebounce';

interface RealTimeValidationProps {
  email: string;
  onValidationResult: (result: { isValid: boolean; canProceed: boolean; message: string }) => void;
}

export function RealTimeValidation({ email, onValidationResult }: RealTimeValidationProps) {
  const [validationState, setValidationState] = useState<'idle' | 'checking' | 'valid' | 'invalid' | 'blocked'>('idle');
  const [message, setMessage] = useState('');
  const debouncedEmail = useDebounce(email, 800);

  const handleValidationResult = useCallback((result: { isValid: boolean; canProceed: boolean; message: string }) => {
    onValidationResult(result);
  }, [onValidationResult]);

  useEffect(() => {
    if (!debouncedEmail || !debouncedEmail.includes('@')) {
      setValidationState('idle');
      setMessage('');
      handleValidationResult({ isValid: false, canProceed: false, message: '' });
      return;
    }

    let isCancelled = false;

    setValidationState('checking');
    setMessage('Vérification en cours...');

    checkEmailExists(debouncedEmail)
      .then(result => {
        if (isCancelled) return;
        
        if (result.isStudent) {
          setValidationState('blocked');
          setMessage('Compte étudiant existant - Connexion requise');
          handleValidationResult({ isValid: false, canProceed: false, message: 'Compte étudiant existant' });
        } else if (result.hasProfile) {
          setValidationState('valid');
          setMessage('Compte existant - Sera converti en compte étudiant');
          handleValidationResult({ isValid: true, canProceed: true, message: 'Conversion possible' });
        } else {
          setValidationState('valid');
          setMessage('Email disponible pour inscription');
          handleValidationResult({ isValid: true, canProceed: true, message: 'Nouveau compte' });
        }
      })
      .catch(() => {
        if (isCancelled) return;
        
        setValidationState('invalid');
        setMessage('Erreur lors de la vérification');
        handleValidationResult({ isValid: false, canProceed: false, message: 'Erreur de vérification' });
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedEmail, handleValidationResult]);

  const getIcon = () => {
    switch (validationState) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTextColor = () => {
    switch (validationState) {
      case 'valid':
        return 'text-green-600';
      case 'invalid':
      case 'blocked':
        return 'text-red-600';
      case 'checking':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  if (validationState === 'idle') return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${getTextColor()} mt-1`}>
      {getIcon()}
      <span>{message}</span>
    </div>
  );
}
