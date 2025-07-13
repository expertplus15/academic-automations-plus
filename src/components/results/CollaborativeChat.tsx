import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Send, Pin, Reply, Smile, Paperclip, MoreVertical } from 'lucide-react';
import { CRDTService, ChatMessage } from '@/services/CRDTService';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CollaborativeChatProps {
  isOpen: boolean;
  onToggle: () => void;
  sessionId: string;
  currentCellId?: string;
}

export function CollaborativeChat({ isOpen, onToggle, sessionId, currentCellId }: CollaborativeChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'comments' | 'mentions'>('all');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for chat messages
  useEffect(() => {
    const handleChatMessage = (event: CustomEvent) => {
      const message = event.detail as ChatMessage;
      setMessages(prev => [...prev, message].slice(-100)); // Keep last 100 messages
    };

    window.addEventListener('chat-message', handleChatMessage as EventListener);
    
    return () => {
      window.removeEventListener('chat-message', handleChatMessage as EventListener);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageType: 'text' | 'comment' = currentCellId ? 'comment' : 'text';
    
    try {
      await CRDTService.sendChatMessage(
        newMessage, 
        currentCellId, 
        messageType
      );
      
      setNewMessage('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredMessages = messages.filter(message => {
    switch (filter) {
      case 'comments':
        return message.type === 'comment';
      case 'mentions':
        return message.message.includes('@'); // Simple mention detection
      default:
        return true;
    }
  });

  const getMessageIcon = (message: ChatMessage) => {
    switch (message.type) {
      case 'comment':
        return <MessageSquare className="w-3 h-3 text-blue-500" />;
      case 'mention':
        return <Pin className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Chat
        {messages.filter(m => m.timestamp > Date.now() - 5000).length > 0 && (
          <Badge variant="destructive" className="ml-2 px-1 py-0 text-xs">
            {messages.filter(m => m.timestamp > Date.now() - 5000).length}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 z-50 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat Collaboratif
          </CardTitle>
          <div className="flex items-center gap-2">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-xs bg-transparent border rounded px-2 py-1"
            >
              <option value="all">Tous</option>
              <option value="comments">Commentaires</option>
              <option value="mentions">Mentions</option>
            </select>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              ×
            </Button>
          </div>
        </div>
        
        {currentCellId && (
          <Badge variant="outline" className="w-fit text-xs">
            Contexte: Cellule {currentCellId}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-full">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {filteredMessages.map((message, index) => (
              <div key={message.id} className="flex gap-2 text-sm">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {message.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-xs">{message.userName}</span>
                    {getMessageIcon(message)}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(message.timestamp, { 
                        locale: fr, 
                        addSuffix: true 
                      })}
                    </span>
                  </div>
                  
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <p className="text-sm">{message.message}</p>
                    
                    {message.cellId && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Cellule: {message.cellId}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2"
                      onClick={() => setReplyingTo(message)}
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Répondre
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Smile className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping.length > 0 && (
              <div className="text-xs text-muted-foreground italic">
                {isTyping.join(', ')} {isTyping.length === 1 ? 'écrit' : 'écrivent'}...
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />
        
        <div className="p-4 space-y-2">
          {replyingTo && (
            <div className="bg-muted/50 rounded p-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Répondre à {replyingTo.userName}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0"
                  onClick={() => setReplyingTo(null)}
                >
                  ×
                </Button>
              </div>
              <p className="text-muted-foreground truncate">{replyingTo.message}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentCellId ? "Commenter cette cellule..." : "Tapez votre message..."}
              className="flex-1 text-sm"
            />
            <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Paperclip className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Smile className="w-3 h-3" />
            </Button>
            <span className="ml-auto">Entrée pour envoyer</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}