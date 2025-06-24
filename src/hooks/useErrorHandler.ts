
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface AppError {
  id: string;
  type: 'validation' | 'network' | 'database' | 'permission' | 'unknown';
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  context?: string;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<AppError[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createError = useCallback((
    type: AppError['type'],
    message: string,
    details?: any,
    context?: string
  ): AppError => {
    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      details,
      timestamp: new Date(),
      context
    };
  }, []);

  const handleError = useCallback((
    error: any,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      logError = true,
      context = 'Unknown'
    } = options;

    let appError: AppError;

    // Parse different error types
    if (error instanceof Error) {
      // Network errors
      if (error.message.includes('fetch')) {
        appError = createError('network', 'Erreur de connexion réseau', error, context);
      }
      // Validation errors
      else if (error.message.includes('validation') || error.message.includes('invalid')) {
        appError = createError('validation', error.message, error, context);
      }
      // Database errors
      else if (error.message.includes('database') || error.message.includes('query')) {
        appError = createError('database', 'Erreur de base de données', error, context);
      }
      // Permission errors
      else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
        appError = createError('permission', 'Accès non autorisé', error, context);
      }
      else {
        appError = createError('unknown', error.message, error, context);
      }
    }
    // Supabase errors
    else if (error?.error?.message || error?.message) {
      const message = error.error?.message || error.message;
      appError = createError('database', message, error, context);
    }
    // String errors
    else if (typeof error === 'string') {
      appError = createError('unknown', error, null, context);
    }
    // Unknown error format
    else {
      appError = createError('unknown', 'Une erreur inattendue s\'est produite', error, context);
    }

    // Add to errors list
    setErrors(prev => [appError, ...prev.slice(0, 9)]); // Keep last 10 errors

    // Log error
    if (logError) {
      console.error(`[${appError.type.toUpperCase()}] ${appError.context}:`, appError.message, appError.details);
    }

    // Show toast notification
    if (showToast) {
      const toastMessage = getUserFriendlyMessage(appError);
      
      switch (appError.type) {
        case 'validation':
          toast.error('Erreur de validation', { description: toastMessage });
          break;
        case 'network':
          toast.error('Erreur réseau', { description: toastMessage });
          break;
        case 'database':
          toast.error('Erreur de données', { description: toastMessage });
          break;
        case 'permission':
          toast.error('Accès refusé', { description: toastMessage });
          break;
        default:
          toast.error('Erreur', { description: toastMessage });
      }
    }

    return appError;
  }, [createError]);

  const getUserFriendlyMessage = useCallback((error: AppError): string => {
    // Map technical messages to user-friendly ones
    const messageMap: Record<string, string> = {
      'Network request failed': 'Problème de connexion internet',
      'Failed to fetch': 'Impossible de contacter le serveur',
      'Internal server error': 'Erreur serveur temporaire',
      'Unauthorized': 'Vous devez vous connecter',
      'Forbidden': 'Vous n\'avez pas les permissions nécessaires',
      'Not found': 'Ressource introuvable',
      'Conflict': 'Conflit de données détecté'
    };

    return messageMap[error.message] || error.message;
  }, []);

  const clearError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const withErrorHandling = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context: string = 'Operation'
  ): Promise<T | null> => {
    setIsLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } catch (error) {
      handleError(error, { context });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const retry = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    maxRetries: number = 3,
    context: string = 'Retry Operation'
  ): Promise<T | null> => {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await asyncFn();
        if (attempt > 1) {
          toast.success(`Opération réussie après ${attempt} tentatives`);
        }
        return result;
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    handleError(lastError, { context: `${context} (${maxRetries} tentatives)` });
    return null;
  }, [handleError]);

  return {
    errors,
    isLoading,
    handleError,
    clearError,
    clearAllErrors,
    withErrorHandling,
    retry,
    createError
  };
}

// Hook pour les erreurs spécifiques aux examens
export function useExamErrorHandler() {
  const { handleError, withErrorHandling, retry } = useErrorHandler();

  const handleExamError = useCallback((error: any, operation: string) => {
    // Erreurs spécifiques aux examens
    const examErrorMap: Record<string, string> = {
      'exam_not_found': 'Examen introuvable',
      'session_conflict': 'Conflit de planning détecté',
      'room_unavailable': 'Salle non disponible',
      'supervisor_unavailable': 'Surveillant non disponible',
      'insufficient_capacity': 'Capacité de la salle insuffisante',
      'invalid_exam_data': 'Données d\'examen invalides'
    };

    const message = examErrorMap[error?.code] || error?.message || 'Erreur d\'examen';
    handleError(new Error(message), { context: `Exam ${operation}` });
  }, [handleError]);

  return {
    handleExamError,
    withErrorHandling,
    retry
  };
}
