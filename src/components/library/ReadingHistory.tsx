import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, TrendingUp, Target, Award, Clock, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReadingActivity {
  id: string;
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
  };
  loan_date: string;
  return_date?: string;
  pages_read?: number;
  total_pages?: number;
  reading_time_minutes?: number;
  rating?: number;
  review?: string;
  status: string;
}

interface ReadingStats {
  total_books_read: number;
  total_pages_read: number;
  total_reading_time: number;
  favorite_category: string;
  average_rating: number;
  books_this_month: number;
  reading_goal_progress: number;
  reading_goal_target: number;
}

interface Recommendation {
  id: string;
  title: string;
  author: string;
  category: string;
  match_score: number;
  reason: string;
  cover_url?: string;
}

export function ReadingHistory() {
  const [activities, setActivities] = useState<ReadingActivity[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReadingData();
  }, []);

  const fetchReadingData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-reading-history');

      if (error) throw error;
      setActivities(data?.activities || []);
      setStats(data?.stats || null);
      setRecommendations(data?.recommendations || []);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre historique de lecture.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRateBook = async (activityId: string, rating: number, review?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('rate-book', {
        body: { activity_id: activityId, rating, review }
      });

      if (error) throw error;

      toast({
        title: "Évaluation enregistrée",
        description: "Merci pour votre évaluation !",
      });

      fetchReadingData();
    } catch (error) {
      console.error('Erreur lors de l\'évaluation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre évaluation.",
        variant: "destructive",
      });
    }
  };

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const renderStars = (rating?: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${
              rating && i < rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            } ${
              interactive ? 'cursor-pointer hover:text-yellow-400' : ''
            }`}
            onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques de lecture */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.total_books_read}</p>
                  <p className="text-xs text-muted-foreground">Livres lus</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-lg font-bold">{formatReadingTime(stats.total_reading_time)}</p>
                  <p className="text-xs text-muted-foreground">Temps de lecture</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{stats.average_rating.toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Note moyenne</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm font-bold">{stats.books_this_month}/{stats.reading_goal_target}</p>
                  <p className="text-xs text-muted-foreground">Objectif mensuel</p>
                  <Progress 
                    value={(stats.books_this_month / stats.reading_goal_target) * 100} 
                    className="mt-1 h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Historique de lecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{activity.book.title}</h3>
                        <p className="text-sm text-muted-foreground">{activity.book.author}</p>
                        <Badge variant="outline" className="mt-1">
                          {activity.book.category}
                        </Badge>
                      </div>
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status === 'completed' ? 'Terminé' : 'En cours'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Emprunté le</p>
                        <p>{format(new Date(activity.loan_date), "dd/MM/yyyy", { locale: fr })}</p>
                      </div>
                      {activity.return_date && (
                        <div>
                          <p className="text-muted-foreground">Rendu le</p>
                          <p>{format(new Date(activity.return_date), "dd/MM/yyyy", { locale: fr })}</p>
                        </div>
                      )}
                      {activity.pages_read && activity.total_pages && (
                        <div>
                          <p className="text-muted-foreground">Progression</p>
                          <p>{activity.pages_read}/{activity.total_pages} pages</p>
                          <Progress 
                            value={(activity.pages_read / activity.total_pages) * 100} 
                            className="mt-1 h-2"
                          />
                        </div>
                      )}
                      {activity.reading_time_minutes && (
                        <div>
                          <p className="text-muted-foreground">Temps de lecture</p>
                          <p>{formatReadingTime(activity.reading_time_minutes)}</p>
                        </div>
                      )}
                    </div>

                    {activity.status === 'completed' && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Votre évaluation</span>
                          {renderStars(
                            activity.rating, 
                            !activity.rating, 
                            (rating) => handleRateBook(activity.id, rating)
                          )}
                        </div>
                        {activity.review && (
                          <p className="text-sm text-muted-foreground">
                            "{activity.review}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {activities.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun historique</h3>
                    <p className="text-muted-foreground">
                      Votre historique de lecture apparaîtra ici.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recommandations personnalisées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec) => (
                  <Card key={rec.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-3 mb-3">
                        <div className="flex-shrink-0">
                          {rec.cover_url ? (
                            <img 
                              src={rec.cover_url} 
                              alt={rec.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-muted rounded flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                            {rec.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-1">
                            {rec.author}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {rec.category}
                          </Badge>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-3 h-3 text-green-600" />
                          <span className="text-xs font-medium">
                            {rec.match_score}% de correspondance
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {rec.reason}
                        </p>
                      </div>

                      <Button size="sm" className="w-full">
                        Voir le livre
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {recommendations.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune recommandation</h3>
                    <p className="text-muted-foreground">
                      Lisez quelques livres pour recevoir des recommandations personnalisées.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}