
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Phone, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AccountRecoveryProps {
  email: string;
  onBack: () => void;
}

export function AccountRecovery({ email, onBack }: AccountRecoveryProps) {
  const [recoveryMethod, setRecoveryMethod] = useState<'email' | 'phone' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const { toast } = useToast();

  const handlePasswordReset = async () => {
    setIsLoading(true);
    try {
      // Simulation d'envoi d'email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email envoyé",
        description: "Un lien de réinitialisation a été envoyé à votre adresse email.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de réinitialisation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountUnlock = async () => {
    if (!recoveryCode.trim()) {
      toast({
        title: "Code requis",
        description: "Veuillez entrer le code de récupération.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulation de vérification du code
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (recoveryCode === '123456') {
        toast({
          title: "Compte débloqué",
          description: "Vous pouvez maintenant vous connecter.",
        });
        // Redirection vers la page de connexion
        window.location.href = '/login';
      } else {
        toast({
          title: "Code invalide",
          description: "Le code de récupération est incorrect.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de vérifier le code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="flex items-center gap-2 p-0 h-auto"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au formulaire
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5" />
            Récupération de compte
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Un compte étudiant existe déjà avec l'email : <strong>{email}</strong>
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium">Options de récupération :</h4>
            
            <div className="grid gap-3">
              <Button
                variant="outline"
                onClick={() => setRecoveryMethod('email')}
                className="justify-start h-auto p-4"
                disabled={isLoading}
              >
                <Mail className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Réinitialiser le mot de passe</div>
                  <div className="text-sm text-muted-foreground">
                    Recevoir un lien par email pour créer un nouveau mot de passe
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => setRecoveryMethod('phone')}
                className="justify-start h-auto p-4"
                disabled={isLoading}
              >
                <Phone className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Code de récupération</div>
                  <div className="text-sm text-muted-foreground">
                    Utiliser un code de récupération si vous en avez un
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {recoveryMethod === 'email' && (
            <div className="p-4 border rounded-lg space-y-3">
              <p className="text-sm">
                Un email sera envoyé à <strong>{email}</strong> avec un lien pour réinitialiser votre mot de passe.
              </p>
              <Button 
                onClick={handlePasswordReset} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </Button>
            </div>
          )}

          {recoveryMethod === 'phone' && (
            <div className="p-4 border rounded-lg space-y-3">
              <label className="text-sm font-medium">Code de récupération</label>
              <Input
                placeholder="Entrez votre code de récupération"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value)}
                disabled={isLoading}
              />
              <Button 
                onClick={handleAccountUnlock} 
                disabled={isLoading || !recoveryCode.trim()}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  'Débloquer le compte'
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Contactez l'administration si vous n'avez pas de code de récupération.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
