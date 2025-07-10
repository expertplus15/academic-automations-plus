import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

export const MessagesList = memo(function MessagesList() {
  return (
    <Card className="h-full rounded-none border-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Messages</CardTitle>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher..." 
              className="pl-10"
            />
          </div>
          <Button size="sm" className="px-3">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-center text-muted-foreground py-8">
          Sélectionnez une conversation ou créez-en une nouvelle
        </div>
      </CardContent>
    </Card>
  );
});