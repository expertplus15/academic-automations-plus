import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Users, MessageSquare } from 'lucide-react';
import { useContacts, useCreateConversation } from '@/hooks/useCommunication';
import { Card, CardContent } from '@/components/ui/card';

interface NewConversationModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewConversationModal({ open, onClose }: NewConversationModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [conversationTitle, setConversationTitle] = useState('');
  
  const { contacts, isLoading } = useContacts();
  const createConversation = useCreateConversation();

  const filteredContacts = contacts?.filter(contact =>
    contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleCreateConversation = () => {
    if (selectedContacts.length === 0) return;

    const type = selectedContacts.length === 1 ? 'direct' : 'group';
    const title = type === 'group' ? conversationTitle : undefined;

    createConversation.mutate({
      participantIds: selectedContacts,
      title,
      type,
    }, {
      onSuccess: () => {
        onClose();
        setSelectedContacts([]);
        setConversationTitle('');
        setSearchTerm('');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Nouvelle conversation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher des contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Group title */}
          {selectedContacts.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="title">Nom du groupe</Label>
              <Input
                id="title"
                placeholder="Entrez le nom du groupe..."
                value={conversationTitle}
                onChange={(e) => setConversationTitle(e.target.value)}
              />
            </div>
          )}

          {/* Selected contacts */}
          {selectedContacts.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {selectedContacts.length} contact(s) sélectionné(s)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedContacts.map(contactId => {
                    const contact = contacts?.find(c => c.id === contactId);
                    if (!contact) return null;
                    return (
                      <div
                        key={contactId}
                        className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={contact.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {contact.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{contact.full_name}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contacts list */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Chargement des contacts...
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                Aucun contact trouvé
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleContactToggle(contact.id)}
                >
                  <Checkbox
                    checked={selectedContacts.includes(contact.id)}
                    onChange={() => handleContactToggle(contact.id)}
                  />
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={contact.avatar_url} />
                    <AvatarFallback>
                      {contact.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{contact.full_name}</p>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {contact.role}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={createConversation.isPending}
            >
              Annuler
            </Button>
            <Button
              onClick={handleCreateConversation}
              disabled={selectedContacts.length === 0 || createConversation.isPending}
            >
              {createConversation.isPending ? 'Création...' : 'Créer la conversation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}