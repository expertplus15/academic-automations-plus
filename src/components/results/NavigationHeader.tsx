import { Button } from '@/components/ui/button';

interface NavigationHeaderProps {
  onBack: () => void;
  title: string;
  subtitle?: string;
}

export function NavigationHeader({ onBack, title, subtitle }: NavigationHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        ← Retour au programme
      </Button>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}