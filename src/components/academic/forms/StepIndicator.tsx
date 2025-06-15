interface StepIndicatorProps {
  currentStep: number;
  steps: { number: number; label: string }[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex items-center space-x-2 ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {step.number}
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-border ml-4"></div>
          )}
        </div>
      ))}
    </div>
  );
}