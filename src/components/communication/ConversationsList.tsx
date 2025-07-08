import React, { useState } from 'react';
import { Search, Plus, Archive, MoreVertical, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useMessages } from '@/hooks/communication/useMessages';
import { PresenceIndicator } from './PresenceIndicator';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConversationsListProps {
  selectedConversation: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
}

export function ConversationsList({
  selectedConversation,
  onConversationSelect,
  onNewConversation
}: ConversationsListProps) {
  const { conversations, loading } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') {
      // Check if conversation has unread messages (simplified logic)
      return matchesSearch && conv.last_message;
    }
    
    if (filter === 'archived') {
      return matchesSearch && conv.is_archived;
    }
    
    return matchesSearch && !conv.is_archived;
  });

  const getConversationName = (conversation: any) => {
    if (conversation.title) return conversation.title;
    
    // For direct conversations, use participant names
    if (conversation.type === 'DIRECT' && conversation.participants?.length === 2) {
      const otherParticipant = conversation.participants.find((p: any) => p.user_id !== 'current_user_id');
      return otherParticipant?.profiles?.full_name || 'Conversation';
    }
    
    return `${conversation.type} Conversation`;
  };

  const getConversationAvatar = (conversation: any) => {
    const name = getConversationName(conversation);
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const getLastMessageText = (conversation: any) => {
    if (!conversation.last_message) return "Aucun message";
    return conversation.last_message.content;
  };

  const formatConversationTime = (timestamp: string) => {
    const now = new Date();
    const msgDate = new Date(timestamp);
    const isToday = now.toDateString() === msgDate.toDateString();
    
    if (isToday) {
      return format(msgDate, 'HH:mm', { locale: fr });
    }
    return format(msgDate, 'dd/MM', { locale: fr });
  };

  const getUnreadCount = (conversation: any) => {
    // This would be calculated based on user's last_read_at vs message timestamps
    // For now, return 0 as placeholder
    return 0;
  };

  const isConversationOnline = (conversation: any) => {
    // Check if any participant is online (simplified)
    return conversation.participants?.some((p: any) => p.user_id !== 'current_user_id') || false;
  };

  return (
    <div className="w-80 border-r bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une conversation..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" onClick={onNewConversation}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Filter tabs */}
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'outline' : 'ghost'} 
            size="sm" 
            className="flex-1"
            onClick={() => setFilter('all')}
          >
            Tous
          </Button>
          <Button 
            variant={filter === 'unread' ? 'outline' : 'ghost'} 
            size="sm" 
            className="flex-1"
            onClick={() => setFilter('unread')}
          >
            Non lus
          </Button>
          <Button 
            variant={filter === 'archived' ? 'outline' : 'ghost'} 
            size="sm" 
            className="flex-1"
            onClick={() => setFilter('archived')}
          >
            Archivés
          </Button>
        </div>
      </div>
      
      {/* Conversations list */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Aucune conversation trouvée' : 'Aucune conversation'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div 
              key={conversation.id} 
              className={`p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                selectedConversation === conversation.id ? 'bg-muted/50 border-l-4 border-l-primary' : ''
              }`}
              onClick={() => onConversationSelect(conversation.id)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getConversationAvatar(conversation)}</AvatarFallback>
                  </Avatar>
                  {conversation.type === 'DIRECT' && isConversationOnline(conversation) && (
                    <div className="absolute -bottom-1 -right-1">
                      <PresenceIndicator 
                        userId={conversation.participants?.[0]?.user_id || ''} 
                        size="sm" 
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm truncate">
                      {getConversationName(conversation)}
                    </h3>
                    <div className="flex items-center gap-1">
                      {conversation.updated_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatConversationTime(conversation.updated_at)}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Archive className="h-4 w-4 mr-2" />
                            Archiver
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-1">
                    {conversation.type === 'GROUP' ? 'Groupe' : 
                     conversation.type === 'CHANNEL' ? 'Canal' : 'Direct'}
                  </p>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {getLastMessageText(conversation)}
                  </p>
                </div>
                
                {getUnreadCount(conversation) > 0 && (
                  <Badge className="bg-primary text-primary-foreground text-xs h-5 min-w-[20px] flex items-center justify-center">
                    {getUnreadCount(conversation)}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}