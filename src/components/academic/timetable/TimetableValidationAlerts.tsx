
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface TimetableValidationAlertsProps {
  validationErrors: string[];
  conflictWarnings: string[];
}

export function TimetableValidationAlerts({ 
  validationErrors, 
  conflictWarnings 
}: TimetableValidationAlertsProps) {
  if (validationErrors.length === 0 && conflictWarnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Erreurs de validation */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Avertissements de conflit */}
      {conflictWarnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-1">Conflits détectés :</div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {conflictWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
