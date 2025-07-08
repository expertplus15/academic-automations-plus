import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageFormSchema, type MessageFormData } from '@/lib/validations';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Plus, MessageSquare, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MessageFormProps {
  onSuccess?: () => void;
}

export function MessageForm({ onSuccess }: MessageFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      recipient_ids: [],
      subject: '',
      content: '',
      message_type: 'direct',
      priority: 'normal',
      attachments: []
    }
  });

  // Check permissions
  if (!hasRole(['admin', 'hr', 'teacher'])) {
    return null;
  }

  const handleSubmit = async (data: MessageFormData) => {
    setLoading(true);
    
    try {
      // Here you would integrate with your messaging API
      console.log('Sending message:', data);
      
      toast({
        title: "Succès",
        description: "Message envoyé avec succès"
      });
      
      setOpen(false);
      form.reset();
      setSelectedRecipients([]);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi du message",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock recipients data - replace with real data
  const availableRecipients = [
    { id: '1', name: 'Marie Dupont', role: 'Étudiante' },
    { id: '2', name: 'Pierre Martin', role: 'Enseignant' },
    { id: '3', name: 'Julie Moreau', role: 'Administrative' }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau Message
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Nouveau Message
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="message_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de message</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="direct">Message direct</SelectItem>
                        <SelectItem value="announcement">Annonce</SelectItem>
                        <SelectItem value="notification">Notification</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="urgent">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sujet du message..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label>Destinataires *</Label>
              <div className="mt-2 space-y-2">
                {selectedRecipients.map((recipientId) => {
                  const recipient = availableRecipients.find(r => r.id === recipientId);
                  return recipient ? (
                    <Badge key={recipientId} variant="secondary" className="mr-2">
                      {recipient.name} ({recipient.role})
                      <button
                        type="button"
                        onClick={() => {
                          const newRecipients = selectedRecipients.filter(id => id !== recipientId);
                          setSelectedRecipients(newRecipients);
                          form.setValue('recipient_ids', newRecipients);
                        }}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ) : null;
                })}
              </div>
              <Select
                onValueChange={(value) => {
                  if (value && !selectedRecipients.includes(value)) {
                    const newRecipients = [...selectedRecipients, value];
                    setSelectedRecipients(newRecipients);
                    form.setValue('recipient_ids', newRecipients);
                  }
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Ajouter un destinataire..." />
                </SelectTrigger>
                <SelectContent>
                  {availableRecipients
                    .filter(r => !selectedRecipients.includes(r.id))
                    .map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {recipient.name} ({recipient.role})
                        </div>
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Écrivez votre message ici..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={loading || selectedRecipients.length === 0}>
                {loading ? 'Envoi...' : 'Envoyer le Message'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}