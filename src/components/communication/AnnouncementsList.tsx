import React, { memo, Suspense, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Megaphone, Calendar, Eye, Edit } from 'lucide-react';
import { AnnouncementsSkeleton } from './CommunicationSkeleton';
import { useAnnouncements } from '@/hooks/useCommunication';
import { AnnouncementEditor } from './AnnouncementEditor';
import { toast } from 'sonner';

export const AnnouncementsList = memo(function AnnouncementsList() {
  return (
    <Suspense fallback={<AnnouncementsSkeleton />}>
      <AnnouncementsListContent />
    </Suspense>
  );
});

const AnnouncementsListContent = memo(function AnnouncementsListContent() {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const { announcements, isLoading } = useAnnouncements();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'normal': return 'bg-primary/10 text-primary';
      case 'low': return 'bg-muted-foreground/10 text-muted-foreground';
      default: return 'bg-muted-foreground/10 text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'draft': return 'bg-orange-500/10 text-orange-700 dark:text-orange-400';
      default: return 'bg-muted-foreground/10 text-muted-foreground';
    }
  };

  const handleCreateAnnouncement = () => {
    setSelectedAnnouncement(null);
    setShowEditor(true);
  };

  const handleEditAnnouncement = (announcement: any) => {
    setSelectedAnnouncement(announcement);
    setShowEditor(true);
  };

  const handleViewAnnouncement = (announcement: any) => {
    toast.info(`Affichage de: ${announcement.title}`);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedAnnouncement(null);
  };

  if (isLoading) {
    return <AnnouncementsSkeleton />;
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Toutes les annonces</h2>
          <Button onClick={handleCreateAnnouncement} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle annonce
          </Button>
        </div>

        <div className="grid gap-4">
          {announcements?.map((announcement) => (
            <Card key={announcement.id} className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Megaphone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Par {announcement.author?.full_name || 'Système'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority === 'high' ? 'Urgent' : 
                       announcement.priority === 'normal' ? 'Normal' : 'Faible'}
                    </Badge>
                    <Badge className={getStatusColor(announcement.status)}>
                      {announcement.status === 'published' ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {announcement.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {announcement.created_at && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(announcement.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                    <div>
                      Catégorie: {announcement.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewAnnouncement(announcement)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditAnnouncement(announcement)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || (
            <Card>
              <CardContent className="p-8 text-center">
                <Megaphone className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Aucune annonce</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre première annonce
                </p>
                <Button onClick={handleCreateAnnouncement}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une annonce
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {showEditor && (
        <AnnouncementEditor
          open={showEditor}
          onClose={handleCloseEditor}
        />
      )}
    </>
  );
});