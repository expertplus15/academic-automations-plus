
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  elapsedTime: number;
  isBlocked?: boolean;
  flowType?: string;
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  elapsedTime, 
  isBlocked = false, 
  flowType 
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;
  const estimatedTime = flowType === 'existing_user_conversion' ? '15s' : '30s';

  const formatTime = (seconds: number) => {
    return `${seconds}s`;
  };

  const getStatusBadge = () => {
    if (isBlocked) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Bloqué
        </Badge>
      );
    }

    if (currentStep === totalSteps) {
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-green-500">
          <CheckCircle className="w-3 h-3" />
          Terminé
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        En cours
      </Badge>
    );
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Progression</span>
          {getStatusBadge()}
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatTime(elapsedTime)} / {estimatedTime}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Étape {currentStep} sur {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {flowType === 'existing_user_conversion' && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          ⚡ Processus accéléré pour compte existant
        </div>
      )}
    </div>
  );
}
