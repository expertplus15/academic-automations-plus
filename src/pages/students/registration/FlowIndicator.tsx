
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, AlertTriangle, User, UserPlus, UserCheck } from 'lucide-react';
import { UserFlowContext } from '@/services/userFlowService';

interface FlowIndicatorProps {
  flowContext: UserFlowContext;
}

export function FlowIndicator({ flowContext }: FlowIndicatorProps) {
  const { flowType, isBlocked, nextAction, recommendations } = flowContext;

  const getFlowIcon = () => {
    switch (flowType) {
      case 'new_user':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'existing_user_conversion':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'existing_student':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getFlowColor = () => {
    switch (flowType) {
      case 'new_user':
        return 'border-green-200 bg-green-50';
      case 'existing_user_conversion':
        return 'border-blue-200 bg-blue-50';
      case 'existing_student':
        return 'border-red-200 bg-red-50';
    }
  };

  const getFlowBadgeVariant = () => {
    switch (flowType) {
      case 'new_user':
        return 'default';
      case 'existing_user_conversion':
        return 'secondary';
      case 'existing_student':
        return 'destructive';
    }
  };

  return (
    <Card className={`${getFlowColor()} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {getFlowIcon()}
          Type d'inscription détecté
          <Badge variant={getFlowBadgeVariant()}>
            {flowType === 'new_user' && 'Nouveau'}
            {flowType === 'existing_user_conversion' && 'Conversion'}
            {flowType === 'existing_student' && 'Existant'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className={getFlowColor()}>
          <AlertDescription>
            <div className="flex items-center gap-2 font-medium mb-2">
              <ArrowRight className="w-4 h-4" />
              {nextAction}
            </div>
          </AlertDescription>
        </Alert>

        <div>
          <h4 className="font-medium mb-2 text-sm">Ce qui va se passer :</h4>
          <ul className="space-y-1">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
