import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Users, 
  Pin, 
  Lock, 
  Plus,
  Calendar,
  HelpCircle,
  Megaphone
} from 'lucide-react';
import { useForums } from '@/hooks/useForums';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ForumsListProps {
  courseId?: string;
  onCreateForum?: () => void;
  onForumClick?: (forumId: string) => void;
}

export function ForumsList({ courseId, onCreateForum, onForumClick }: ForumsListProps) {
  const { forums, loading } = useForums(courseId);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'announcements':
        return <Megaphone className="w-4 h-4" />;
      case 'q_and_a':
        return <HelpCircle className="w-4 h-4" />;
      case 'general':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'announcements':
        return 'Annonces';
      case 'q_and_a':
        return 'Questions & Réponses';
      case 'general':
        return 'Général';
      case 'course':
        return 'Cours';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcements':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'q_and_a':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'general':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'course':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const groupedForums = forums.reduce((acc, forum) => {
    if (!acc[forum.category]) {
      acc[forum.category] = [];
    }
    acc[forum.category].push(forum);
    return acc;
  }, {} as Record<string, typeof forums>);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton de création */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Forums de discussion</h2>
          <p className="text-muted-foreground">
            Participez aux discussions et posez vos questions
          </p>
        </div>
        {onCreateForum && (
          <Button onClick={onCreateForum} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouveau forum
          </Button>
        )}
      </div>

      {/* Liste des forums groupés par catégorie */}
      {Object.entries(groupedForums).map(([category, categoryForums]) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            {getCategoryIcon(category)}
            <h3 className="text-lg font-semibold">{getCategoryLabel(category)}</h3>
            <Badge variant="secondary" className={getCategoryColor(category)}>
              {categoryForums.length} forum{categoryForums.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="space-y-2">
            {categoryForums.map((forum) => (
              <Card 
                key={forum.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onForumClick?.(forum.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg text-foreground">
                          {forum.title}
                        </h4>
                        {forum.is_locked && (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      
                      {forum.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {forum.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{forum.posts_count} post{forum.posts_count > 1 ? 's' : ''}</span>
                        </div>
                        
                        {forum.last_post_at && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Dernier post {formatDistanceToNow(new Date(forum.last_post_at), { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(forum.category)}
                      >
                        {getCategoryLabel(forum.category)}
                      </Badge>
                      
                      {forum.is_general && (
                        <Badge variant="secondary">
                          <Users className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {category !== Object.keys(groupedForums)[Object.keys(groupedForums).length - 1] && (
            <Separator className="my-6" />
          )}
        </div>
      ))}

      {forums.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun forum disponible</h3>
            <p className="text-muted-foreground mb-4">
              Il n'y a pas encore de forums de discussion pour ce cours.
            </p>
            {onCreateForum && (
              <Button onClick={onCreateForum} variant="outline">
                Créer le premier forum
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}