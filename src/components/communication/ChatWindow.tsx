import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export const ChatWindow = memo(function ChatWindow() {
  return (
    <Card className="h-full rounded-none border-0">
      <CardContent className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">Aucune conversation sélectionnée</h3>
          <p className="text-sm">Choisissez une conversation dans la liste pour commencer à échanger</p>
        </div>
      </CardContent>
    </Card>
  );
});