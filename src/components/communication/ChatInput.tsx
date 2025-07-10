import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useSendMessage } from '@/hooks/useCommunication';

interface ChatInputProps {
  conversationId: string;
  replyToId?: string;
  onCancelReply?: () => void;
}

export function ChatInput({ conversationId, replyToId, onCancelReply }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMessage = useSendMessage();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage.mutate({
      conversationId,
      content: message.trim(),
      replyToId,
    }, {
      onSuccess: () => {
        setMessage('');
        if (onCancelReply) onCancelReply();
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="border-t bg-background p-4">
      {replyToId && (
        <div className="mb-3 p-2 bg-muted rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">En réponse à un message</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            placeholder="Tapez votre message..."
            className="min-h-[40px] max-h-[120px] resize-none pr-20"
            disabled={sendMessage.isPending}
          />
          
          <div className="absolute right-2 bottom-2 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={sendMessage.isPending}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={sendMessage.isPending}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || sendMessage.isPending}
          className="h-10 w-10 p-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}