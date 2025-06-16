
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Phone, Mail, HelpCircle } from 'lucide-react';
import { UserFlowContext } from '@/services/userFlowService';

interface ExistingUserActionsProps {
  flowContext: UserFlowContext;
}

export function ExistingUserActions({ flowContext }: ExistingUserActionsProps) {
  const { emailCheckResult } = flowContext;

  if (!emailCheckResult.isStudent) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Alert className="border-red-200 bg-red-50">
        <AlertDescription className="text-red-800">
          <strong>Compte étudiant existant détecté</strong>
          <br />
          Un compte étudiant est déjà associé à cette adresse email. 
          Vous devez vous connecter avec vos identifiants existants.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <LogIn className="w-5 h-5" />
            Actions disponibles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => window.location.href = '/login'} 
            className="w-full bg-students hover:bg-students/90"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter avec mes identifiants
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            ou
          </div>

          <div className="grid gap-2">
            <Button variant="outline" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Mot de passe oublié ?
            </Button>
            
            <Button variant="outline" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Contacter l'administration
            </Button>
            
            <Button variant="outline" className="w-full">
              <HelpCircle className="w-4 h-4 mr-2" />
              Aide à la connexion
            </Button>
          </div>
        </CardContent>
      </Card>

      {emailCheckResult.profileData && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-base">Informations du compte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nom:</span>
                <span>{emailCheckResult.profileData.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{flowContext.formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut:</span>
                <span className="text-green-600 font-medium">Étudiant actif</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
