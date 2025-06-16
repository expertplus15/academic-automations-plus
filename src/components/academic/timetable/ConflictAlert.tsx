
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface ConflictAlertProps {
  conflicts: string[];
}

export function ConflictAlert({ conflicts }: ConflictAlertProps) {
  if (conflicts.length === 0) return null;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Conflit détecté !</span>
          <span className="text-sm">Impossible de déplacer le créneau - slot occupé</span>
        </div>
      </CardContent>
    </Card>
  );
}
