
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RegistrationStartScreenProps {
  onStart: () => void;
}

export function RegistrationStartScreen({ onStart }: RegistrationStartScreenProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Inscription Intelligente</h2>
        <p className="text-muted-foreground mb-6">
          Système d'inscription automatisé avec détection de comptes existants et validation en temps réel.
        </p>
        <div className="text-sm text-muted-foreground mb-6">
          ✨ Validation instantanée<br/>
          🔄 Conversion automatique de comptes<br/>
          ⚡ Processus ultra-rapide (moins de 30 secondes)
        </div>
        <Button onClick={onStart} size="lg" className="bg-students hover:bg-students/90">
          Commencer l'inscription
        </Button>
      </CardContent>
    </Card>
  );
}
