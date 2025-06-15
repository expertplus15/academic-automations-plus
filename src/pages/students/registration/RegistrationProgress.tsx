
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegistrationProgressProps {
  currentStep: number;
  elapsedTime: number;
}

const steps = [
  { number: 1, title: 'Informations personnelles', description: 'Identité et contact' },
  { number: 2, title: 'Choix du programme', description: 'Formation et niveau' },
  { number: 3, title: 'Documents', description: 'Pièces justificatives' },
  { number: 4, title: 'Validation', description: 'Finalisation' },
];

export function RegistrationProgress({ currentStep, elapsedTime }: RegistrationProgressProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card rounded-lg border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Progression de l'inscription</h2>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-students" />
          <span className={cn(
            "font-mono font-medium",
            elapsedTime > 30 ? "text-destructive" : elapsedTime > 20 ? "text-yellow-600" : "text-students"
          )}>
            {formatTime(elapsedTime)}
          </span>
          <span className="text-muted-foreground">/ 00:30</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          
          return (
            <div key={step.number} className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                isCompleted ? "bg-students text-white" :
                isCurrent ? "bg-students/20 text-students border-2 border-students" :
                "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              
              <div className="text-center">
                <p className={cn(
                  "text-sm font-medium",
                  (isCompleted || isCurrent) ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute h-0.5 w-16 mt-5 ml-16 transition-colors",
                  isCompleted ? "bg-students" : "bg-muted"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
