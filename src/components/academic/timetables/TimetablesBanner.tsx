
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Zap } from 'lucide-react';

export function TimetablesBanner() {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">
                Interface Interactive Avancée
              </h3>
              <p className="text-sm text-blue-700">
                Glisser-déposer, détection de conflits en temps réel et vue calendrier
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            Nouvelle interface
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
