
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, BookOpen, Users, MapPin } from 'lucide-react';

interface ExamIntegrationDetailsProps {
  module: 'academic' | 'students' | 'resources';
  selectedExam: string;
  hasIntegration: boolean;
}

export function ExamIntegrationDetails({ 
  module, 
  selectedExam, 
  hasIntegration 
}: ExamIntegrationDetailsProps) {
  const moduleConfig = {
    academic: {
      title: 'Intégration Académique',
      icon: BookOpen,
      color: 'text-blue-600',
      description: 'Détails de l\'intégration avec le module académique...'
    },
    students: {
      title: 'Intégration Étudiants',
      icon: Users,
      color: 'text-green-600',
      description: 'Détails de l\'intégration avec le module étudiants...'
    },
    resources: {
      title: 'Intégration Ressources',
      icon: MapPin,
      color: 'text-orange-600',
      description: 'Détails de l\'intégration avec le module ressources...'
    }
  };

  const config = moduleConfig[module];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${config.color}`} />
          {config.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedExam && hasIntegration ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Aucune intégration</AlertTitle>
            <AlertDescription>
              Sélectionnez un examen pour voir les détails de {config.title.toLowerCase()}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
