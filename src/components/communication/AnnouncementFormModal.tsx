import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { useAnnouncements } from "@/hooks/communication/useAnnouncements";

interface AnnouncementFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: any;
}

export function AnnouncementFormModal({ 
  open, 
  onOpenChange, 
  announcement 
}: AnnouncementFormModalProps) {
  const { toast } = useToast();
  const { createAnnouncement, updateAnnouncement } = useAnnouncements();
  
  interface FormData {
    title: string;
    content: string;
    category: string;
    priority: string;
    target_audience: string;
    is_urgent: boolean;
    is_pinned: boolean;
    publish_immediately: boolean;
    published_at: Date;
    expires_at: Date | null;
  }

  const [formData, setFormData] = useState<FormData>({
    title: announcement?.title || '',
    content: announcement?.content || '',
    category: announcement?.category || 'information',
    priority: announcement?.priority || 'normal',
    target_audience: announcement?.target_audience || 'all',
    is_urgent: announcement?.is_urgent || false,
    is_pinned: announcement?.is_pinned || false,
    publish_immediately: announcement?.status === 'published' || true,
    published_at: announcement?.published_at ? new Date(announcement.published_at) : new Date(),
    expires_at: announcement?.expires_at ? new Date(announcement.expires_at) : null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPublishDate, setShowPublishDate] = useState(false);
  const [showExpiryDate, setShowExpiryDate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        priority: formData.priority as 'high' | 'low' | 'normal' | 'urgent',
        target_audience: [formData.target_audience],
        publication_date: formData.publish_immediately ? formData.published_at : undefined,
        expiration_date: formData.expires_at || undefined,
        acknowledgment_required: formData.is_urgent,
        distribution_channels: ['web'],
      };

      if (announcement) {
        await updateAnnouncement(announcement.id, data);
        toast({
          title: "Annonce modifiée",
          description: "L'annonce a été modifiée avec succès"
        });
      } else {
        await createAnnouncement(data);
        toast({
          title: "Annonce créée",
          description: "L'annonce a été créée avec succès"
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'information',
      priority: 'normal',
      target_audience: 'all',
      is_urgent: false,
      is_pinned: false,
      publish_immediately: true,
      published_at: new Date(),
      expires_at: null,
    });
    setShowPublishDate(false);
    setShowExpiryDate(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      onOpenChange(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {announcement ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Titre de l'annonce"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Contenu *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Contenu détaillé de l'annonce"
                  rows={5}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Paramètres */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="information">Information</SelectItem>
                      <SelectItem value="academique">Académique</SelectItem>
                      <SelectItem value="administratif">Administratif</SelectItem>
                      <SelectItem value="evenement">Événement</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select value={formData.priority} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une priorité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="normal">Normale</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="target_audience">Public cible</Label>
                  <Select value={formData.target_audience} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, target_audience: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le public" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="students">Étudiants</SelectItem>
                      <SelectItem value="teachers">Enseignants</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                      <SelectItem value="staff">Personnel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_urgent"
                    checked={formData.is_urgent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, is_urgent: checked }))
                    }
                  />
                  <Label htmlFor="is_urgent">Annonce urgente</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_pinned"
                    checked={formData.is_pinned}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, is_pinned: checked }))
                    }
                  />
                  <Label htmlFor="is_pinned">Épingler en haut</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publication */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="publish_immediately"
                  checked={formData.publish_immediately}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({ ...prev, publish_immediately: checked }));
                    setShowPublishDate(!checked);
                  }}
                />
                <Label htmlFor="publish_immediately">Publier immédiatement</Label>
              </div>

              {showPublishDate && (
                <div>
                  <Label>Date de publication</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.published_at && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.published_at ? (
                          format(formData.published_at, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.published_at}
                        onSelect={(date) => 
                          setFormData(prev => ({ ...prev, published_at: date || new Date() }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="has_expiry"
                  checked={showExpiryDate}
                  onCheckedChange={(checked) => {
                    setShowExpiryDate(checked);
                    if (!checked) {
                      setFormData(prev => ({ ...prev, expires_at: null }));
                    }
                  }}
                />
                <Label htmlFor="has_expiry">Définir une date d'expiration</Label>
              </div>

              {showExpiryDate && (
                <div>
                  <Label>Date d'expiration</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.expires_at && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.expires_at ? (
                          format(formData.expires_at, "PPP", { locale: fr })
                        ) : (
                          <span>Choisir une date d'expiration</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.expires_at}
                        onSelect={(date) => 
                          setFormData(prev => ({ ...prev, expires_at: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : (announcement ? 'Modifier' : 'Créer l\'annonce')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}