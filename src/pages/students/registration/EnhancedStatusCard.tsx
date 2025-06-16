
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  User, 
  Mail, 
  School,
  ArrowRight
} from 'lucide-react';
import { UserFlowContext } from '@/services/userFlowService';

interface EnhancedStatusCardProps {
  flowContext: UserFlowContext;
  isSubmitting?: boolean;
  onRecoveryClick?: () => void;
  onRetryClick?: () => void;
  retryCount?: number;
}

export function EnhancedStatusCard({ 
  flowContext, 
  isSubmitting = false, 
  onRecoveryClick,
  onRetryClick,
  retryCount = 0
}: EnhancedStatusCardProps) {
  const { flowType, isBlocked, nextAction, recommendations, emailCheckResult } = flowContext;

  const getStatusIcon = () => {
    if (isSubmitting) return <Clock className="w-5 h-5 animate-pulse text-blue-600" />;
    if (isBlocked) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const getStatusColor = () => {
    if (isBlocked) return 'border-red-200 bg-red-50';
    if (isSubmitting) return 'border-blue-200 bg-blue-50';
    return 'border-green-200 bg-green-50';
  };

  const getBadgeVariant = () => {
    if (isBlocked) return 'destructive';
    if (flowType === 'existing_user_conversion') return 'secondary';
    return 'default';
  };

  return (
    <Card className={`${getStatusColor()} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-base">Statut de l'inscription</span>
          </div>
          <Badge variant={getBadgeVariant()}>
            {flowType === 'new_user' && 'Nouveau'}
            {flowType === 'existing_user_conversion' && 'Conversion'}
            {flowType === 'existing_student' && 'Existant'}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Action principale */}
        <Alert className={getStatusColor()}>
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <ArrowRight className="w-4 h-4" />
                {isSubmitting ? 'Traitement en cours...' : nextAction}
              </div>
              {retryCount > 0 && !isSubmitting && (
                <Badge variant="outline" className="text-xs">
                  Tentative {retryCount}
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>

        {/* Informations du compte */}
        {emailCheckResult.profileData && (
          <div className="bg-white/50 rounded-lg p-3 space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations du compte
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
              </div>
              <span className="font-mono">{flowContext.formData.email}</span>
              
              <div className="flex items-center gap-1">
                <School className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Statut:</span>
              </div>
              <span className={emailCheckResult.isStudent ? 'text-green-600' : 'text-blue-600'}>
                {emailCheckResult.isStudent ? 'Étudiant actif' : 'Compte utilisateur'}
              </span>
            </div>
          </div>
        )}

        {/* Recommandations */}
        <div>
          <h4 className="font-medium mb-2 text-sm">
            {isBlocked ? 'Actions requises :' : 'Ce qui va se passer :'}
          </h4>
          <ul className="space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions pour compte bloqué */}
        {isBlocked && onRecoveryClick && (
          <div className="pt-2 border-t space-y-2">
            <Button 
              onClick={onRecoveryClick}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Options de récupération
            </Button>
          </div>
        )}

        {/* Bouton de retry pour erreurs */}
        {!isBlocked && onRetryClick && retryCount > 0 && !isSubmitting && (
          <div className="pt-2 border-t">
            <Button 
              onClick={onRetryClick}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
