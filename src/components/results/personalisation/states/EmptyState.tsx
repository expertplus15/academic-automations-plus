import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Aucun template disponible</h3>
        <p className="text-muted-foreground mb-6">
          Commencez par créer des types de documents dans le module Documentation
        </p>
        <Button onClick={() => navigate('/results/documentation')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          Aller à Documentation
        </Button>
      </div>
    </div>
  );
}