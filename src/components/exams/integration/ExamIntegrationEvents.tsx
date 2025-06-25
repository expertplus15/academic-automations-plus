
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SyncEvent {
  id: string;
  module: string;
  action: string;
  status: string;
  timestamp: Date;
}

interface ExamIntegrationEventsProps {
  events: SyncEvent[];
}

export function ExamIntegrationEvents({ events }: ExamIntegrationEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Événements Récents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {events.slice(0, 10).map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
              <div className={`w-2 h-2 rounded-full ${
                event.status === 'completed' ? 'bg-green-500' :
                event.status === 'failed' ? 'bg-red-500' :
                event.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {event.module}: {event.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun événement récent
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
