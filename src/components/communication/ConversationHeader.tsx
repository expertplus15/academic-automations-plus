import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pin, Archive, Settings, MoreVertical, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConversationHeaderProps {
  conversation: {
    id: string;
    title?: string;
    type: string;
    participants?: Array<{
      user_id: string;
      profiles?: {
        full_name: string;
        email: string;
      };
    }>;
  };
  isOnline: boolean;
  participantCount?: number;
  onPin?: () => void;
  onArchive?: () => void;
  onSettings?: () => void;
}

export function ConversationHeader({
  conversation,
  isOnline,
  participantCount = 0,
  onPin,
  onArchive,
  onSettings
}: ConversationHeaderProps) {
  const getConversationName = () => {
    if (conversation.title) return conversation.title;
    if (conversation.type === 'DIRECT' && conversation.participants?.[0]) {
      return conversation.participants[0].profiles?.full_name || 'Utilisateur';
    }
    return 'Conversation';
  };

  const getConversationAvatar = () => {
    const name = getConversationName();
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };

  const getStatusText = () => {
    if (conversation.type === 'GROUP' || conversation.type === 'CHANNEL') {
      return `${participantCount} participant${participantCount > 1 ? 's' : ''}`;
    }
    return isOnline ? 'En ligne' : 'Hors ligne';
  };

  return (
    <div className="p-4 border-b bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-sm font-medium">
                {getConversationAvatar()}
              </AvatarFallback>
            </Avatar>
            {conversation.type === 'DIRECT' && (
              <div className={cn(
                "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                isOnline ? "bg-green-500" : "bg-gray-400"
              )} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">
                {getConversationName()}
              </h3>
              {conversation.type !== 'DIRECT' && (
                <Badge variant="secondary" className="text-xs">
                  {conversation.type === 'GROUP' ? 'Groupe' : 'Canal'}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {getStatusText()}
              </p>
              {conversation.type !== 'DIRECT' && (
                <Users className="w-3 h-3 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onPin}>
            <Pin className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <Archive className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onSettings}>
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}