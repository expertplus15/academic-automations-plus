
import { CheckCircle, Clock, User, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RegistrationFormData } from './useRegistrationForm';

interface ValidationStepProps {
  formData: RegistrationFormData;
  elapsedTime: number;
  studentNumber?: string;
  isSuccess?: boolean;
}

export function ValidationStep({ formData, elapsedTime, studentNumber, isSuccess }: ValidationStepProps) {
  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  if (isSuccess && studentNumber) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Inscription réussie!</h3>
          <p className="text-muted-foreground">
            Votre inscription a été validée en {formatTime(elapsedTime)}
          </p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Numéro étudiant attribué</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-students mb-2">{studentNumber}</p>
              <p className="text-sm text-muted-foreground">
                Conservez précieusement ce numéro
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            Un email de confirmation a été envoyé à <strong>{formData.email}</strong> avec 
            vos identifiants de connexion et les prochaines étapes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Validation de l'inscription</h3>
        <p className="text-muted-foreground">
          Vérifiez vos informations avant la finalisation de votre inscription.
        </p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-5 h-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom complet:</span>
              <span>{formData.firstName} {formData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Téléphone:</span>
              <span>{formData.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="w-5 h-5" />
              Programme d'études
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Programme:</span>
              <Badge variant="outline">Programme sélectionné</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Niveau d'entrée:</span>
              <span>Année {formData.yearLevel}</span>
            </div>
            {formData.specialization && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spécialisation:</span>
                <span>{formData.specialization}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Temps écoulé: {formatTime(elapsedTime)}</span>
      </div>
    </div>
  );
}
