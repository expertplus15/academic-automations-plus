import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PaperclipIcon, Send, Mic, MicOff, Smile } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'TEXT' | 'AUDIO') => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Tapez votre message..." 
}: MessageInputProps) {
  const [messageInput, setMessageInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    onSendMessage(messageInput.trim());
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implement file upload in Phase 4
      toast({
        title: 'Fonctionnalité à venir',
        description: 'Les pièces jointes seront disponibles dans la phase suivante'
      });
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          // TODO: Convert to text or upload audio in Phase 4
          toast({
            title: 'Enregistrement terminé',
            description: 'Les messages vocaux seront disponibles dans la phase suivante'
          });
          stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible d\'accéder au microphone',
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <div className="flex gap-2 p-4 border-t bg-card">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,document/*"
      />
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleFileAttach}
        disabled={disabled}
      >
        <PaperclipIcon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleRecording}
        disabled={disabled}
        className={isRecording ? 'text-red-500' : ''}
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Input 
        placeholder={placeholder}
        className="flex-1"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={disabled || isRecording}
      />
      
      <Button 
        onClick={handleSendMessage} 
        disabled={!messageInput.trim() || disabled || isRecording}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}