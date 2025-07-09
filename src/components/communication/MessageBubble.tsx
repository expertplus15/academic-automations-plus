import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Heart, MessageCircle, Copy, MoreVertical, Edit, Trash2, Download, FileIcon, ImageIcon, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    sender_id: string;
    message_type?: string;
    is_edited?: boolean;
    metadata?: any;
    sender?: {
      full_name: string;
      email: string;
    };
  };
  currentUserId?: string;
  isOwn: boolean;
  showSender?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, reaction: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
}

export function MessageBubble({ 
  message, 
  currentUserId,
  isOwn, 
  showSender = true,
  onReply,
  onReact,
  onEdit,
  onDelete
}: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [reactions, setReactions] = useState<Record<string, number>>(message.metadata?.reactions || {});

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleReaction = (emoji: string) => {
    const newReactions = { ...reactions };
    newReactions[emoji] = (newReactions[emoji] || 0) + 1;
    setReactions(newReactions);
    onReact?.(message.id, emoji);
  };

  const handleDownloadAttachment = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const renderAttachment = () => {
    if (message.message_type === 'IMAGE' && message.metadata?.file_url) {
      return (
        <div className="mt-2">
          <img 
            src={message.metadata.file_url} 
            alt="Attachment" 
            className="max-w-full h-auto rounded cursor-pointer"
            onClick={() => window.open(message.metadata.file_url, '_blank')}
          />
        </div>
      );
    }
    
    if (message.message_type === 'FILE' && message.metadata?.file_url) {
      return (
        <div className="mt-2 p-2 border rounded flex items-center gap-2 bg-muted/20">
          <FileIcon className="h-4 w-4" />
          <span className="text-sm flex-1">{message.metadata.filename || 'Fichier'}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDownloadAttachment(message.metadata.file_url, message.metadata.filename)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    if (message.message_type === 'AUDIO' && message.metadata?.file_url) {
      return (
        <div className="mt-2">
          <audio controls className="w-full">
            <source src={message.metadata.file_url} type="audio/wav" />
          </audio>
        </div>
      );
    }
    
    return null;
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
        
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="text-sm"
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleEdit}>Sauvegarder</Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </div>
            {renderAttachment()}
          </>
        )}
        
        {/* Reactions */}
        {Object.keys(reactions).length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {Object.entries(reactions).map(([emoji, count]) => (
              <Badge 
                key={emoji} 
                variant="secondary" 
                className="text-xs cursor-pointer hover:bg-muted"
                onClick={() => handleReaction(emoji)}
              >
                {emoji} {count}
              </Badge>
            ))}
          </div>
        )}
        
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Smile className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-auto p-2">
                <div className="flex gap-1">
                  {['❤️', '👍', '😂', '😮', '😢', '😡'].map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleReaction(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
            
            {isOwn && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => onDelete?.(message.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}