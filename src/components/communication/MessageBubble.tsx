import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Copy, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    message_type?: string;
    is_edited?: boolean;
    sender?: {
      full_name: string;
      email: string;
    };
  };
  isOwn: boolean;
  showSender?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, reaction: string) => void;
}

export function MessageBubble({ 
  message, 
  isOwn, 
  showSender = true,
  onReply,
  onReact
}: MessageBubbleProps) {
  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={cn(
      "flex group",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs md:max-w-md p-3 rounded-lg shadow-sm relative",
        isOwn 
          ? "bg-primary text-primary-foreground" 
          : "bg-card border"
      )}>
        {showSender && !isOwn && message.sender && (
          <div className="text-xs font-medium mb-1 text-muted-foreground">
            {message.sender.full_name}
          </div>
        )}
        
        <div className="text-sm whitespace-pre-wrap break-words">
          {message.content}
        </div>
        
        <div className="flex items-center justify-between mt-2 gap-2">
          <div className="flex items-center gap-1 text-xs opacity-70">
            <span>
              {message.created_at && formatMessageTime(message.created_at)}
            </span>
            {message.is_edited && (
              <Badge variant="secondary" className="text-xs">
                modifié
              </Badge>
            )}
          </div>
          
          {/* Message actions - appear on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onReact?.(message.id, '❤️')}
            >
              <Heart className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onReply?.(message.id)}
            >
              <MessageCircle className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleCopyMessage}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}