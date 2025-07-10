import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Reply, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/hooks/useCommunication';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  onReply?: (messageId: string) => void;
}

export function MessageBubble({ message, onReply }: MessageBubbleProps) {
  const { user } = useAuth();
  const isOwnMessage = message.sender_id === user?.id;
  const isDeleted = message.is_deleted;

  if (isDeleted) {
    return (
      <div className="flex justify-center my-2">
        <div className="text-xs text-muted-foreground italic bg-muted px-3 py-1 rounded-full">
          Ce message a été supprimé
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 group hover:bg-muted/30 p-2 rounded-lg transition-colors",
        isOwnMessage ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isOwnMessage && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={message.sender?.avatar_url} />
          <AvatarFallback className="text-xs">
            {message.sender?.full_name?.split(' ').map(n => n[0]).join('') || '?'}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex-1 space-y-1", isOwnMessage ? "text-right" : "text-left")}>
        {!isOwnMessage && (
          <div className="text-xs font-medium text-muted-foreground">
            {message.sender?.full_name || 'Utilisateur inconnu'}
          </div>
        )}
        
        <div
          className={cn(
            "inline-block max-w-[80%] rounded-lg px-3 py-2 text-sm",
            isOwnMessage
              ? "bg-primary text-primary-foreground ml-auto"
              : "bg-muted"
          )}
        >
          {message.reply_to_id && (
            <div className="text-xs opacity-70 mb-1 p-2 border-l-2 border-current/30 bg-black/10 rounded">
              En réponse à un message
            </div>
          )}
          
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
          
          {message.is_edited && (
            <div className="text-xs opacity-70 mt-1">
              (modifié)
            </div>
          )}
        </div>

        <div className={cn(
          "flex items-center gap-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
          isOwnMessage ? "justify-end" : "justify-start"
        )}>
          <span>
            {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
          </span>
          
          <div className="flex gap-1">
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onReply(message.id)}
              >
                <Reply className="w-3 h-3" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
            >
              <MoreVertical className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {isOwnMessage && (
        <Avatar className="w-8 h-8 mt-1">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="text-xs">
            {user?.email?.charAt(0).toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}