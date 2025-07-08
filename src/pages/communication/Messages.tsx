import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Phone, 
  Video, 
  Settings,
  Pin,
  Archive,
  Trash2,
  PaperclipIcon
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationMessages() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const conversations = [
    {
      id: "1",
      name: "Marie Dubois",
      role: "Enseignant",
      lastMessage: "Les documents pour le cours de demain sont prêts",
      timestamp: "14:30",
      unread: 2,
      avatar: "/avatars/marie.jpg",
      online: true
    },
    {
      id: "2", 
      name: "Équipe Scolarité",
      role: "Groupe",
      lastMessage: "Rappel: réunion pédagogique à 16h",
      timestamp: "13:15",
      unread: 0,
      avatar: "/avatars/team.jpg",
      online: false
    },
    {
      id: "3",
      name: "Pierre Martin",
      role: "Étudiant",
      lastMessage: "Merci pour les explications",
      timestamp: "11:45",
      unread: 0,
      avatar: "/avatars/pierre.jpg",
      online: true
    }
  ];

  const handleNewMessage = () => {
    toast({
      title: "Nouveau message",
      description: "Fonctionnalité de messagerie en développement",
    });
  };

  const handleCall = () => {
    toast({
      title: "Appel",
      description: "Fonctionnalité d'appel en développement",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Appel vidéo",
      description: "Fonctionnalité de visioconférence en développement",
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Messages Instantanés" 
          subtitle="Messagerie interne pour communication directe" 
        />
        <div className="flex h-[calc(100vh-120px)]">
          {/* Sidebar des conversations */}
          <div className="w-80 border-r bg-card">
            <div className="p-4 border-b">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher une conversation..." className="pl-9" />
                </div>
                <Button size="icon" onClick={handleNewMessage}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Tous</Button>
                <Button variant="ghost" size="sm" className="flex-1">Non lus</Button>
                <Button variant="ghost" size="sm" className="flex-1">Archivés</Button>
              </div>
            </div>
            
            <div className="overflow-y-auto">
              {conversations.map((conversation) => (
                <div key={conversation.id} className="p-4 border-b hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm truncate">{conversation.name}</h3>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{conversation.role}</p>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs h-5">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone de conversation */}
          <div className="flex-1 flex flex-col">
            {/* Header de conversation */}
            <div className="p-4 border-b bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>MD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">Marie Dubois</h3>
                    <p className="text-xs text-muted-foreground">En ligne</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCall}>
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleVideoCall}>
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Pin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Zone des messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-muted/30">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-card p-3 rounded-lg max-w-xs shadow-sm">
                    <p className="text-sm">Bonjour, avez-vous eu le temps de consulter les documents que j'ai envoyés ?</p>
                    <span className="text-xs text-muted-foreground">13:45</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-xs">
                    <p className="text-sm">Oui, je les ai consultés. Tout est parfait !</p>
                    <span className="text-xs text-primary-foreground/70">13:47</span>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-card p-3 rounded-lg max-w-xs shadow-sm">
                    <p className="text-sm">Parfait ! Les documents pour le cours de demain sont prêts</p>
                    <span className="text-xs text-muted-foreground">14:30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <PaperclipIcon className="h-4 w-4" />
                </Button>
                <Input placeholder="Tapez votre message..." className="flex-1" />
                <Button onClick={handleNewMessage}>Envoyer</Button>
              </div>
            </div>
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}