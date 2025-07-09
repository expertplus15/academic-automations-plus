import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { PaperclipIcon, Send, Mic, MicOff, Smile, X, FileIcon, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO', metadata?: any) => void;
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = async () => {
    if (selectedFile) {
      await handleFileUpload();
    } else if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput('');
    }
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
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(0);
      
      // Upload to Supabase storage (if configured)
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const filePath = `attachments/${fileName}`;
      
      // For now, simulate upload and send as base64
      const reader = new FileReader();
      reader.onload = () => {
        const isImage = selectedFile.type.startsWith('image/');
        const messageType = isImage ? 'IMAGE' : 'FILE';
        
        onSendMessage(
          selectedFile.name, 
          messageType,
          {
            filename: selectedFile.name,
            file_size: selectedFile.size,
            file_url: reader.result as string,
            mime_type: selectedFile.type
          }
        );
        
        setSelectedFile(null);
        setUploadProgress(null);
        
        toast({
          title: 'Fichier envoyé',
          description: `${selectedFile.name} a été envoyé avec succès`
        });
      };
      
      reader.readAsDataURL(selectedFile);
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'envoyer le fichier',
        variant: 'destructive'
      });
      setUploadProgress(null);
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
          const reader = new FileReader();
          reader.onload = () => {
            onSendMessage(
              'Message vocal',
              'AUDIO',
              {
                filename: `audio_${Date.now()}.wav`,
                file_size: blob.size,
                file_url: reader.result as string,
                mime_type: 'audio/wav',
                duration: chunks.length // Approximate duration
              }
            );
            
            toast({
              title: 'Message vocal envoyé',
              description: 'Votre message vocal a été envoyé'
            });
          };
          reader.readAsDataURL(blob);
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
    <div className="space-y-2">
      {/* File preview */}
      {selectedFile && (
        <div className="p-3 bg-muted/20 border rounded-lg flex items-center gap-2">
          {selectedFile.type.startsWith('image/') ? (
            <ImageIcon className="h-4 w-4" />
          ) : (
            <FileIcon className="h-4 w-4" />
          )}
          <span className="text-sm flex-1">{selectedFile.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFile(null)}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      {/* Upload progress */}
      {uploadProgress !== null && (
        <div className="px-3">
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      <div className="flex gap-2 p-4 border-t bg-card">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,document/*,.pdf,.docx,.xlsx"
        />
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleFileAttach}
          disabled={disabled || selectedFile !== null}
        >
          <PaperclipIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleRecording}
          disabled={disabled || selectedFile !== null}
          className={isRecording ? 'text-red-500 animate-pulse' : ''}
        >
          {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        
        <Input 
          placeholder={selectedFile ? `Envoyer ${selectedFile.name}...` : placeholder}
          className="flex-1"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled || isRecording}
        />
        
        <Button 
          onClick={handleSendMessage} 
          disabled={(!messageInput.trim() && !selectedFile) || disabled || isRecording}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}