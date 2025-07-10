import React, { memo, useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Users, Phone, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/useCommunication';
import { useCommunication } from '@/contexts/CommunicationContext';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

export const ChatWindow = memo(function ChatWindow() {
  const { activeConversation, conversations } = useCommunication();
  const { messages, isLoading } = useMessages(activeConversation || undefined);
  const [replyToId, setReplyToId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations?.find(c => c.id === activeConversation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeConversation) {
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
  }

  return (
    <Card className="h-full rounded-none border-0 flex flex-col">
      {/* Header */}
      <CardHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentConversation?.participants?.[0]?.user?.avatar_url} />
              <AvatarFallback>
                {currentConversation?.title?.[0] || currentConversation?.participants?.[0]?.user?.full_name?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {currentConversation?.title || currentConversation?.participants?.map(p => p.user?.full_name).join(', ')}
              </h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {currentConversation?.participants?.length || 0} participant(s)
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p className="text-sm">Aucun message dans cette conversation</p>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {messages?.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                onReply={setReplyToId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>

      {/* Input */}
      <ChatInput
        conversationId={activeConversation}
        replyToId={replyToId}
        onCancelReply={() => setReplyToId(undefined)}
      />
    </Card>
  );
});