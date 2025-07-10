import React, { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useConversations } from '@/hooks/useCommunication';
import { useCommunication } from '@/contexts/CommunicationContext';
import { NewConversationModal } from './NewConversationModal';

export const MessagesList = memo(function MessagesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const { conversations, isLoading } = useConversations();
  const { activeConversation, setActiveConversation } = useCommunication();

  const filteredConversations = conversations?.filter(conv =>
    conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants?.some(p => 
      p.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  return (
    <>
      <Card className="h-full rounded-none border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Messages</CardTitle>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Rechercher..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              size="sm" 
              className="px-3"
              onClick={() => setShowNewConversation(true)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Chargement...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Aucune conversation</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setShowNewConversation(true)}
              >
                Créer une conversation
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map(conversation => (
                <div
                  key={conversation.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    activeConversation === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setActiveConversation(conversation.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conversation.participants?.[0]?.user?.avatar_url} />
                      <AvatarFallback>
                        {conversation.title?.[0] || conversation.participants?.[0]?.user?.full_name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm truncate">
                          {conversation.title || conversation.participants?.map(p => p.user?.full_name).join(', ')}
                        </h3>
                        {conversation.last_message && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(conversation.last_message.created_at), 'HH:mm', { locale: fr })}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {conversation.last_message?.content || 'Aucun message'}
                      </p>
                    </div>
                    {conversation.unread_count && conversation.unread_count > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unread_count}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NewConversationModal
        open={showNewConversation}
        onClose={() => setShowNewConversation(false)}
      />
    </>
  );
});