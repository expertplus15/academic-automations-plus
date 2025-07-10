import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Users, Calendar, Star, Target } from 'lucide-react';

export function ActivityStats() {
  const stats = {
    totalActivities: 3,
    totalHours: 156,
    participationRate: 87,
    eventsAttended: 42,
    achievements: 8,
    favoriteCategory: 'Sport'
  };

  const achievements = [
    {
      id: 1,
      title: 'Sportif assidu',
      description: 'Participation à plus de 20 séances de sport',
      icon: '🏃‍♂️',
      earned: true,
      earnedDate: '2024-01-10',
      category: 'sport'
    },
    {
      id: 2,
      title: 'Acteur en herbe',
      description: 'Participation à une représentation théâtrale',
      icon: '🎭',
      earned: true,
      earnedDate: '2024-01-05',
      category: 'culture'
    },
    {
      id: 3,
      title: 'Solidaire',
      description: 'Participation à 5 actions humanitaires',
      icon: '🤝',
      earned: true,
      earnedDate: '2023-12-20',
      category: 'associatif'
    },
    {
      id: 4,
      title: 'Perfectionniste',
      description: 'Taux de participation supérieur à 95%',
      icon: '⭐',
      earned: false,
      progress: 87,
      target: 95,
      category: 'general'
    },
    {
      id: 5,
      title: 'Multi-activités',
      description: 'Inscription à 5 activités différentes',
      icon: '🎯',
      earned: false,
      progress: 3,
      target: 5,
      category: 'general'
    }
  ];

  const monthlyStats = [
    { month: 'Sep', hours: 24, participation: 92 },
    { month: 'Oct', hours: 32, participation: 88 },
    { month: 'Nov', hours: 28, participation: 85 },
    { month: 'Déc', hours: 20, participation: 82 },
    { month: 'Jan', hours: 16, participation: 87 }
  ];

  const categoriesStats = [
    { category: 'Sport', hours: 98, percentage: 63, color: 'bg-blue-500' },
    { category: 'Culture', hours: 32, percentage: 20, color: 'bg-purple-500' },
    { category: 'Associatif', hours: 26, percentage: 17, color: 'bg-green-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Vue d'ensemble */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activités actives</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">inscriptions en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures totales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">depuis septembre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.participationRate}%</div>
            <p className="text-xs text-muted-foreground">taux moyen</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Récompenses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.achievements}</div>
            <p className="text-xs text-muted-foreground">badges obtenus</p>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des activités</CardTitle>
          <CardDescription>Temps consacré par catégorie d'activité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoriesStats.map((cat) => (
            <div key={cat.category} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  {cat.category}
                </span>
                <span>{cat.hours}h ({cat.percentage}%)</span>
              </div>
              <Progress value={cat.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Évolution mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution mensuelle</CardTitle>
          <CardDescription>Heures d'activité et taux de participation par mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            {monthlyStats.map((month) => (
              <div key={month.month} className="text-center space-y-2">
                <div className="text-sm font-medium">{month.month}</div>
                <div className="text-2xl font-bold">{month.hours}h</div>
                <div className="text-sm text-muted-foreground">{month.participation}%</div>
                <div className="h-20 bg-muted rounded relative">
                  <div 
                    className="bg-primary rounded absolute bottom-0 w-full transition-all"
                    style={{ height: `${(month.hours / 32) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Récompenses et badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Récompenses & Badges
          </CardTitle>
          <CardDescription>Vos accomplissements et objectifs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 border rounded-lg ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground">{achievement.description}</div>
                    </div>
                    
                    {achievement.earned ? (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Star className="w-3 h-3 mr-1" />
                          Obtenu
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(achievement.earnedDate!).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <Progress value={(achievement.progress! / achievement.target!) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}