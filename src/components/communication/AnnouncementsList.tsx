import React, { memo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Megaphone, Calendar, Eye, Edit } from 'lucide-react';
import { AnnouncementsSkeleton } from './CommunicationSkeleton';

export const AnnouncementsList = memo(function AnnouncementsList() {
  return (
    <Suspense fallback={<AnnouncementsSkeleton />}>
      <AnnouncementsListContent />
    </Suspense>
  );
});

const AnnouncementsListContent = memo(function AnnouncementsListContent() {
  const announcements = [
    {
      id: 1,
      title: 'Rentrée académique 2024-2025',
      content: 'Les cours débuteront le lundi 2 septembre 2024. Tous les étudiants sont invités à récupérer leurs cartes étudiantes...',
      author: 'Direction Académique',
      publishedAt: '2024-08-15',
      priority: 'high',
      targetGroups: ['Tous'],
      status: 'published'
    },
    {
      id: 2,
      title: 'Nouvelle plateforme e-learning',
      content: 'Nous avons le plaisir de vous annoncer la mise en service de notre nouvelle plateforme d\'apprentissage en ligne...',
      author: 'Service Informatique',
      publishedAt: '2024-08-10',
      priority: 'normal',
      targetGroups: ['Étudiants', 'Enseignants'],
      status: 'published'
    },
    {
      id: 3,
      title: 'Maintenance serveurs - Weekend',
      content: 'Une maintenance programmée aura lieu ce weekend pour améliorer les performances de nos systèmes...',
      author: 'Service Technique',
      publishedAt: null,
      priority: 'low',
      targetGroups: ['Tous'],
      status: 'draft'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#EF4444]/10 text-[#EF4444]';
      case 'normal': return 'bg-[#4F78FF]/10 text-[#4F78FF]';
      case 'low': return 'bg-[#64748B]/10 text-[#64748B]';
      default: return 'bg-[#64748B]/10 text-[#64748B]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-[#10B981]/10 text-[#10B981]';
      case 'draft': return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      default: return 'bg-[#64748B]/10 text-[#64748B]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Toutes les annonces</h2>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle annonce
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#4F78FF]/10 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-[#4F78FF]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground">Par {announcement.author}</p>
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
                  {announcement.publishedAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(announcement.publishedAt).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                  <div>
                    Cible: {announcement.targetGroups.join(', ')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});