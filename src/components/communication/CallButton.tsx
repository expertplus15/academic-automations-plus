import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, PhoneOff, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CallButtonProps {
  type: 'audio' | 'video';
  recipientId?: string;
  recipientName?: string;
  recipientAvatar?: string;
  onCallStart?: (callId: string) => void;
  onCallEnd?: () => void;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function CallButton({
  type,
  recipientId,
  recipientName = "Utilisateur",
  recipientAvatar,
  onCallStart,
  onCallEnd,
  className,
  size = "default",
  variant = "default"
}: CallButtonProps) {
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const { toast } = useToast();

  const startCall = async () => {
    try {
      // Simulate WebRTC call initiation
      const callId = `call_${Date.now()}`;
      
      toast({
        title: `Appel ${type === 'video' ? 'vidéo' : 'audio'} initié`,
        description: `Connexion avec ${recipientName}...`
      });

      setIsCallModalOpen(true);
      setIsInCall(true);
      
      if (onCallStart) {
        onCallStart(callId);
      }

      // Simulate call connection after 2 seconds
      setTimeout(() => {
        toast({
          title: "Appel connecté",
          description: "Vous êtes maintenant en communication"
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Erreur d'appel",
        description: "Impossible d'établir la connexion",
        variant: "destructive"
      });
    }
  };

  const endCall = () => {
    setIsInCall(false);
    setIsCallModalOpen(false);
    setIsMuted(false);
    setIsCameraOff(false);
    
    if (onCallEnd) {
      onCallEnd();
    }
    
    toast({
      title: "Appel terminé",
      description: "La communication a été interrompue"
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast({
      title: isMuted ? "Micro activé" : "Micro désactivé",
      description: isMuted ? "Vous pouvez maintenant parler" : "Votre micro est coupé"
    });
  };

  const toggleCamera = () => {
    if (type === 'video') {
      setIsCameraOff(!isCameraOff);
      toast({
        title: isCameraOff ? "Caméra activée" : "Caméra désactivée",
        description: isCameraOff ? "Votre vidéo est visible" : "Votre vidéo est masquée"
      });
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={startCall}
      >
        {type === 'video' ? (
          <Video className="w-4 h-4 mr-2" />
        ) : (
          <Phone className="w-4 h-4 mr-2" />
        )}
        {type === 'video' ? 'Appel vidéo' : 'Appel audio'}
      </Button>

      <Dialog open={isCallModalOpen} onOpenChange={setIsCallModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {type === 'video' ? (
                <Video className="w-5 h-5" />
              ) : (
                <Phone className="w-5 h-5" />
              )}
              Appel {type === 'video' ? 'vidéo' : 'audio'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Call Status */}
            <div className="text-center space-y-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={recipientAvatar} alt={recipientName} />
                <AvatarFallback className="text-2xl">
                  {recipientName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h3 className="text-xl font-semibold">{recipientName}</h3>
                <Badge variant={isInCall ? "default" : "secondary"}>
                  {isInCall ? "En cours" : "Connexion..."}
                </Badge>
              </div>
            </div>

            {/* Video placeholder for video calls */}
            {type === 'video' && (
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                {isCameraOff ? (
                  <div className="text-white text-center">
                    <CameraOff className="w-16 h-16 mx-auto mb-2" />
                    <p>Caméra désactivée</p>
                  </div>
                ) : (
                  <div className="text-white text-center">
                    <Camera className="w-16 h-16 mx-auto mb-2" />
                    <p>Aperçu vidéo</p>
                  </div>
                )}
              </div>
            )}

            {/* Call Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>

              {type === 'video' && (
                <Button
                  variant={isCameraOff ? "destructive" : "outline"}
                  size="lg"
                  onClick={toggleCamera}
                >
                  {isCameraOff ? (
                    <CameraOff className="w-5 h-5" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </Button>
              )}

              <Button
                variant="destructive"
                size="lg"
                onClick={endCall}
              >
                <PhoneOff className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}