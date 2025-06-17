
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { UserFlowContext } from '@/services/userFlowService';

interface ExistingUserActionsProps {
  flowContext: UserFlowContext;
}

export function ExistingUserActions({ flowContext }: ExistingUserActionsProps) {
  if (flowContext.flowType !== 'existing_student') return null;

  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertTriangle className="w-4 h-4 text-red-600" />
      <AlertDescription>
        <div className="space-y-3">
          <p className="text-red-800 font-medium">
            Un compte étudiant existe déjà avec cette adresse email.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="text-red-700 border-red-300">
              <ExternalLink className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
            <Button variant="outline" size="sm" className="text-red-700 border-red-300">
              Mot de passe oublié ?
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
