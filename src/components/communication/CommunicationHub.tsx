
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Send, 
  Bell, 
  Search,
  Filter,
  Phone,
  Video,
  Mail,
  Calendar,
  Users,
  Settings,
  Paperclip
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { AsyncButton } from './AsyncButton';
import { CallButton } from './CallButton';
import { FileUploadButton } from './FileUploadButton';
import { RestrictedButton } from './RestrictedButton';

export function CommunicationHub() {
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Handler functions
  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Simulate message sending
    await new Promise(resolve => setTimeout(resolve, 800));
    setMessage("");
  };

  const handleFileUpload = async (files: FileList) => {
    // Simulate file upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Files uploaded:', files);
  };

  const handleSendBroadcast = async () => {
    // Simulate broadcast sending
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleScheduleBroadcast = async () => {
    // Simulate broadcast scheduling
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Mock data for conversations
  const conversations = [
    {
      id: "1",
      participant: "Marie Dubois",
      studentNumber: "IG25001",
      lastMessage: "Bonjour, j'ai une question concernant mon emploi du temps",
      timestamp: "10:30",
      unread: 2,
      status: "online"
    },
    {
      id: "2",
      participant: "Jean Martin",
      studentNumber: "IG25002",
      lastMessage: "Merci pour votre aide !",
      timestamp: "09:15",
      unread: 0,
      status: "offline"
    },
    {
      id: "3",
      participant: "Sophie Chen",
      studentNumber: "IG25003",
      lastMessage: "Pourriez-vous m'envoyer les documents ?",
      timestamp: "Hier",
      unread: 1,
      status: "online"
    }
  ];

  // Mock data for notifications
  const notifications = [
    {
      id: "1",
      type: "message",
      title: "Nouveau message de Marie Dubois",
      content: "Question sur l'emploi du temps",
      timestamp: "Il y a 5 min",
      isRead: false
    },
    {
      id: "2",
      type: "alert",
      title: "Alerte d'absentéisme",
      content: "Jean Martin - 10 absences ce mois",
      timestamp: "Il y a 1h",
      isRead: false
    },
    {
      id: "3",
      type: "document",
      title: "Demande de certificat",
      content: "Sophie Chen - Certificat de scolarité",
      timestamp: "Il y a 2h",
      isRead: true
    }
  ];

  const getStatusColor = (status: string) => {
    return status === "online" ? "bg-green-500" : "bg-gray-400";
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants Connectés</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RDV Planifiés</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Communication Hub */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-students" />
            Hub de Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messages" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="broadcast">Diffusion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="messages" className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une conversation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversations List */}
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Conversations Récentes</h3>
                  {conversations.map((conv) => (
                    <div key={conv.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" alt={conv.participant} />
                          <AvatarFallback className="bg-students text-white text-sm">
                            {conv.participant[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conv.status)}`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate">{conv.participant}</p>
                          <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{conv.studentNumber}</p>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                      
                      {conv.unread > 0 && (
                        <Badge className="bg-students text-white">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat Interface */}
                <div className="border border-border/50 rounded-lg flex flex-col h-96">
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-students text-white text-sm">M</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">Marie Dubois</p>
                          <p className="text-xs text-muted-foreground">En ligne • IG25001</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <CallButton
                          type="audio"
                          recipientName="Marie Dubois"
                          recipientId="marie_dubois"
                          size="sm"
                          variant="ghost"
                          onCallStart={(callId) => {
                            toast({
                              title: "Appel audio",
                              description: `Appel démarré avec Marie Dubois (${callId})`
                            });
                          }}
                        />
                        <CallButton
                          type="video"
                          recipientName="Marie Dubois"
                          recipientId="marie_dubois"
                          size="sm"
                          variant="ghost"
                          onCallStart={(callId) => {
                            toast({
                              title: "Appel vidéo",
                              description: `Appel vidéo démarré avec Marie Dubois (${callId})`
                            });
                          }}
                        />
                        <RestrictedButton
                          allowedRoles={['admin', 'teacher']}
                          variant="ghost"
                          size="sm"
                          icon={Settings}
                          restrictedMessage="Seuls les enseignants peuvent accéder aux paramètres de conversation"
                          action={() => toast({ title: "Paramètres", description: "Configuration de la conversation" })}
                        >
                          Paramètres
                        </RestrictedButton>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Bonjour, j'ai une question concernant mon emploi du temps de la semaine prochaine.</p>
                        <span className="text-xs text-muted-foreground">10:30</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-students text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Bonjour Marie ! Je vais vérifier cela pour vous. Pouvez-vous me préciser votre programme ?</p>
                        <span className="text-xs text-white/80">10:32</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-border/50">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Tapez votre message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="flex-1 min-h-[40px] max-h-[120px]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <div className="flex flex-col gap-2">
                          <FileUploadButton
                            onFileSelect={handleFileUpload}
                            accept="image/*,application/pdf,.doc,.docx"
                            multiple
                            variant="ghost"
                            size="sm"
                          >
                            <Paperclip className="w-4 h-4" />
                          </FileUploadButton>
                          <AsyncButton
                            onAsyncClick={handleSendMessage}
                            successMessage="Message envoyé"
                            variant="default"
                            size="sm"
                            icon={Send}
                            disabled={!message.trim()}
                          >
                            Envoyer
                          </AsyncButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border rounded-lg transition-colors ${
                    !notif.isRead ? 'border-l-4 border-l-students bg-students/5' : 'border-border/50 hover:bg-muted/30'
                  }`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notif.type === 'message' ? 'bg-blue-100 text-blue-600' :
                        notif.type === 'alert' ? 'bg-red-100 text-red-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {notif.type === 'message' ? <MessageCircle className="w-4 h-4" /> :
                         notif.type === 'alert' ? <Bell className="w-4 h-4" /> :
                         <Mail className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{notif.title}</h4>
                          {!notif.isRead && (
                            <Badge variant="secondary" className="text-xs">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notif.content}</p>
                        <span className="text-xs text-muted-foreground">{notif.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="broadcast" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Destinataires
                  </label>
                  <div className="flex gap-2 mb-4">
                    <Button variant="outline" size="sm">Tous les étudiants</Button>
                    <Button variant="outline" size="sm">Par programme</Button>
                    <Button variant="outline" size="sm">Par niveau</Button>
                    <Button variant="outline" size="sm">Personnalisé</Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Objet
                  </label>
                  <Input placeholder="Objet de l'annonce..." />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Rédigez votre message..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex gap-2">
                  <RestrictedButton
                    allowedRoles={['admin', 'hr', 'teacher']}
                    action={handleSendBroadcast}
                    restrictedMessage="Vous n'avez pas les permissions pour envoyer des annonces"
                    icon={Send}
                  >
                    Envoyer Maintenant
                  </RestrictedButton>
                  <AsyncButton
                    onAsyncClick={handleScheduleBroadcast}
                    successMessage="Annonce programmée avec succès"
                    variant="outline"
                    icon={Calendar}
                  >
                    Programmer
                  </AsyncButton>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
