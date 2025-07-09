import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMessages } from "@/hooks/communication/useMessages";
import { Users, Search, X, MessageSquare } from "lucide-react";

interface NewConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewConversationModal({ 
  open, 
  onOpenChange 
}: NewConversationModalProps) {
  const { toast } = useToast();
  const { createConversation } = useMessages();
  
  const [conversationType, setConversationType] = useState<'DIRECT' | 'GROUP'>('DIRECT');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock users data - remplacer par de vraies données
  const availableUsers = [
    { id: '1', name: 'Marie Dubois', role: 'Enseignante', email: 'marie.dubois@etablissement.edu' },
    { id: '2', name: 'Pierre Martin', role: 'Étudiant', email: 'pierre.martin@etudiant.edu' },
    { id: '3', name: 'Sophie Leroy', role: 'Administration', email: 'sophie.leroy@etablissement.edu' },
    { id: '4', name: 'Thomas Bernard', role: 'Étudiant', email: 'thomas.bernard@etudiant.edu' },
    { id: '5', name: 'Julie Moreau', role: 'Enseignante', email: 'julie.moreau@etablissement.edu' },
  ];

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedParticipants.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un participant",
        variant: "destructive"
      });
      return;
    }

    if (conversationType === 'GROUP' && !title.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez donner un titre à la conversation de groupe",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createConversation({
        type: conversationType,
        title: conversationType === 'GROUP' ? title : undefined,
        participants: selectedParticipants,
        metadata: {
          description: description || null
        }
      });
      
      toast({
        title: "Conversation créée",
        description: "La conversation a été créée avec succès"
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la création",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setConversationType('DIRECT');
    setTitle('');
    setDescription('');
    setSelectedParticipants([]);
    setSearchQuery('');
  };

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const removeParticipant = (userId: string) => {
    setSelectedParticipants(prev => prev.filter(id => id !== userId));
  };

  const getSelectedUser = (userId: string) => {
    return availableUsers.find(user => user.id === userId);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Enseignante':
      case 'Enseignant':
        return 'bg-blue-50 text-blue-700';
      case 'Étudiant':
      case 'Étudiante':
        return 'bg-green-50 text-green-700';
      case 'Administration':
        return 'bg-purple-50 text-purple-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Nouvelle conversation
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de conversation */}
          <Card>
            <CardContent className="p-4">
              <div>
                <Label>Type de conversation</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    type="button"
                    variant={conversationType === 'DIRECT' ? 'default' : 'outline'}
                    className="flex items-center gap-2 h-auto p-4"
                    onClick={() => setConversationType('DIRECT')}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Conversation directe</div>
                      <div className="text-xs opacity-75">Discussion 1-à-1</div>
                    </div>
                  </Button>
                  
                  <Button
                    type="button"
                    variant={conversationType === 'GROUP' ? 'default' : 'outline'}
                    className="flex items-center gap-2 h-auto p-4"
                    onClick={() => setConversationType('GROUP')}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">Groupe</div>
                      <div className="text-xs opacity-75">Discussion de groupe</div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations de la conversation */}
          {conversationType === 'GROUP' && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label htmlFor="title">Nom du groupe *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Équipe projet, Cours de mathématiques..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description courte du groupe"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sélection des participants */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label>Participants {conversationType === 'DIRECT' ? '(1 seul)' : ''}</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Participants sélectionnés */}
              {selectedParticipants.length > 0 && (
                <div>
                  <Label className="text-sm">Participants sélectionnés ({selectedParticipants.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedParticipants.map(userId => {
                      const user = getSelectedUser(userId);
                      if (!user) return null;
                      
                      return (
                        <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                          {user.name}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 w-4 h-4 ml-1"
                            onClick={() => removeParticipant(userId)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Liste des utilisateurs */}
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                {filteredUsers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Aucun utilisateur trouvé
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredUsers.map((user) => {
                      const isSelected = selectedParticipants.includes(user.id);
                      const isDisabled = conversationType === 'DIRECT' && 
                                       selectedParticipants.length >= 1 && 
                                       !isSelected;
                      
                      return (
                        <div 
                          key={user.id} 
                          className={`p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors ${
                            isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          onClick={() => !isDisabled && toggleParticipant(user.id)}
                        >
                          <Checkbox
                            checked={isSelected}
                            disabled={isDisabled}
                            onChange={() => !isDisabled && toggleParticipant(user.id)}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{user.name}</span>
                              <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                                {user.role}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || selectedParticipants.length === 0}
            >
              {isSubmitting ? 'Création...' : 'Créer la conversation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}