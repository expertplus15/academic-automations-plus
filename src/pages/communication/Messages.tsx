import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  PaperclipIcon,
  Send,
  Circle,
  MoreVertical
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useMessages } from '@/hooks/communication/useMessages';
import { usePresence } from '@/hooks/communication/usePresence';
import { ConversationsList } from '@/components/communication/ConversationsList';
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CommunicationMessages() {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  
  // Real-time messaging hooks
  const { 
    conversations, 
    messages, 
    loading, 
    fetchMessages, 
    createConversation, 
    sendMessage, 
    markAsRead 
  } = useMessages();
  
  const { 
    presenceData, 
    getUserStatus 
  } = usePresence();

  // UI state
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all');
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      markAsRead(selectedConversation);
    }
  }, [selectedConversation, fetchMessages, markAsRead]);

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'unread') {
      // Check if conversation has unread messages
      const lastMessage = conv.last_message;
      return matchesSearch && lastMessage;
    }
    
    if (filter === 'archived') {
      return matchesSearch && conv.is_archived;
    }
    
    return matchesSearch && !conv.is_archived;
  });

  // Helper functions for conversation display
  const getConversationName = (conversation: any) => {
    return conversation.title || "Conversation";
  };

  const getConversationAvatar = (conversation: any) => {
    return getConversationName(conversation).split(' ').map((n: string) => n[0]).join('');
  };

  const isConversationOnline = (conversation: any) => {
    // Check if any participant is online
    return conversation.participants?.some((p: any) => 
      getPresenceStatus(p.user_id) === 'ONLINE'
    ) || false;
  };

  const getLastMessageText = (conversation: any) => {
    return conversation.last_message?.content || "Aucun message";
  };

  const getUnreadCount = (conversation: any) => {
    // This would be calculated based on user's last_read_at vs message timestamps
    return 0; // Placeholder
  };

  // Event handlers
  const handleNewConversation = () => {
    setShowNewConversationDialog(true);
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

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;
    
    try {
      await sendMessage(selectedConversation, {
        content: messageInput.trim(),
        message_type: 'TEXT'
      });
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPresenceStatus = (userId: string) => {
    return getUserStatus(userId);
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm', { locale: fr });
  };

  const formatConversationTime = (timestamp: string) => {
    const now = new Date();
    const msgDate = new Date(timestamp);
    const isToday = now.toDateString() === msgDate.toDateString();
    
    if (isToday) {
      return format(msgDate, 'HH:mm', { locale: fr });
    }
    return format(msgDate, 'dd/MM', { locale: fr });
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
                <Button size="icon" onClick={handleNewConversation}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filter === 'all' ? 'outline' : 'ghost'} 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setFilter('all')}
                >
                  Tous
                </Button>
                <Button 
                  variant={filter === 'unread' ? 'outline' : 'ghost'} 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setFilter('unread')}
                >
                  Non lus
                </Button>
                <Button 
                  variant={filter === 'archived' ? 'outline' : 'ghost'} 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setFilter('archived')}
                >
                  Archivés
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              {loading ? (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Chargement...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-muted-foreground">Aucune conversation</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div 
                    key={conversation.id} 
                    className={`p-4 border-b hover:bg-muted/50 cursor-pointer ${
                      selectedConversation === conversation.id ? 'bg-muted/50' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{getConversationAvatar(conversation)}</AvatarFallback>
                        </Avatar>
                        {isConversationOnline(conversation) && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm truncate">{getConversationName(conversation)}</h3>
                          <span className="text-xs text-muted-foreground">
                            {conversation.updated_at && formatConversationTime(conversation.updated_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{conversation.type}</p>
                        <p className="text-sm text-muted-foreground truncate">{getLastMessageText(conversation)}</p>
                      </div>
                      {getUnreadCount(conversation) > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs h-5">
                          {getUnreadCount(conversation)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Zone de conversation */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header de conversation */}
                <div className="p-4 border-b bg-card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getConversationAvatar(conversations.find(c => c.id === selectedConversation) || {})}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {getConversationName(conversations.find(c => c.id === selectedConversation) || {})}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {isConversationOnline(conversations.find(c => c.id === selectedConversation) || {}) 
                            ? 'En ligne' : 'Hors ligne'}
                        </p>
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
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Zone des messages */}
                <ScrollArea className="flex-1 p-4 bg-muted/30">
                  <div className="space-y-4">
                    {messages[selectedConversation]?.length ? (
                      messages[selectedConversation].map((message, index) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender_id === 'current_user_id' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`p-3 rounded-lg max-w-xs shadow-sm ${
                            message.sender_id === 'current_user_id' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-card'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <span className={`text-xs ${
                              message.sender_id === 'current_user_id' 
                                ? 'text-primary-foreground/70' 
                                : 'text-muted-foreground'
                            }`}>
                              {message.created_at && formatMessageTime(message.created_at)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted-foreground">Aucun message dans cette conversation</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Zone de saisie */}
                <div className="p-4 border-t bg-card">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Input 
                      placeholder="Tapez votre message..." 
                      className="flex-1"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-muted/30">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Sélectionnez une conversation</h3>
                  <p className="text-muted-foreground">
                    Choisissez une conversation dans la liste pour commencer à échanger
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dialog pour nouvelle conversation */}
        <Dialog open={showNewConversationDialog} onOpenChange={setShowNewConversationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvelle conversation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fonctionnalité de création de conversation en développement
              </p>
              <Button onClick={() => setShowNewConversationDialog(false)}>
                Fermer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}