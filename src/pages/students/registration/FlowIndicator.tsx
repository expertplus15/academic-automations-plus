
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { UserFlowContext } from '@/services/userFlowService';

interface FlowIndicatorProps {
  flowContext: UserFlowContext;
}

export function FlowIndicator({ flowContext }: FlowIndicatorProps) {
  const getFlowIcon = () => {
    switch (flowContext.flowType) {
      case 'new_user':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'existing_user_conversion':
        return <ArrowRight className="w-4 h-4 text-blue-600" />;
      case 'existing_student':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getFlowClass = () => {
    switch (flowContext.flowType) {
      case 'new_user':
        return 'border-green-200 bg-green-50';
      case 'existing_user_conversion':
        return 'border-blue-200 bg-blue-50';
      case 'existing_student':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Alert className={getFlowClass()}>
      <div className="flex items-start gap-3">
        {getFlowIcon()}
        <div className="flex-1">
          <AlertDescription>
            <p className="font-medium mb-2">{flowContext.nextAction}</p>
            <ul className="text-sm space-y-1">
              {flowContext.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-current rounded-full" />
                  {rec}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}
