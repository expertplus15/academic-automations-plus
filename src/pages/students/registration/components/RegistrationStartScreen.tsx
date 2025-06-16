
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RegistrationStartScreenProps {
  onStart: () => void;
}

export function RegistrationStartScreen({ onStart }: RegistrationStartScreenProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Inscription Automatisée</h2>
        <p className="text-muted-foreground mb-6">
          Complétez votre inscription en moins de 30 secondes grâce à notre processus automatisé.
        </p>
        <Button onClick={onStart} size="lg" className="bg-students hover:bg-students/90">
          Commencer l'inscription
        </Button>
      </CardContent>
    </Card>
  );
}
