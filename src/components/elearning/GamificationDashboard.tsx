import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Award,
  Crown,
  Zap,
  Gift
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

interface GamificationDashboardProps {
  studentId: string;
}

export function GamificationDashboard({ studentId }: GamificationDashboardProps) {
  const { badges, points, totalPoints, loading, getLeaderboard } = useGamification(studentId);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    if (studentId) {
      loadLeaderboard();
    }
  }, [studentId]);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const getNextLevel = () => {
    const levels = [
      { name: 'Débutant', minPoints: 0, maxPoints: 100, color: 'text-gray-600' },
      { name: 'Apprenti', minPoints: 100, maxPoints: 300, color: 'text-blue-600' },
      { name: 'Expérimenté', minPoints: 300, maxPoints: 600, color: 'text-green-600' },
      { name: 'Expert', minPoints: 600, maxPoints: 1000, color: 'text-purple-600' },
      { name: 'Maître', minPoints: 1000, maxPoints: 1500, color: 'text-orange-600' },
      { name: 'Légende', minPoints: 1500, maxPoints: Infinity, color: 'text-yellow-600' }
    ];

    const currentLevel = levels.find(level => 
      totalPoints >= level.minPoints && totalPoints < level.maxPoints
    ) || levels[levels.length - 1];

    const nextLevel = levels[levels.indexOf(currentLevel) + 1];
    const progress = nextLevel ? 
      ((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 : 100;

    return { currentLevel, nextLevel, progress };
  };

  const getBadgeIcon = (badgeType: string) => {
    switch (badgeType) {
      case 'achievement':
        return <Trophy className="w-6 h-6" />;
      case 'participation':
        return <Star className="w-6 h-6" />;
      case 'completion':
        return <Target className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getRecentPoints = () => {
    return points
      .slice(0, 5)
      .map(point => ({
        ...point,
        timeAgo: new Date(point.earned_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));
  };

  const levelInfo = getNextLevel();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Points Total</p>
                <p className="text-3xl font-bold text-primary">{totalPoints}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Zap className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 to-primary"></div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Niveau Actuel</p>
                <p className={`text-2xl font-bold ${levelInfo.currentLevel.color}`}>
                  {levelInfo.currentLevel.name}
                </p>
              </div>
              <Crown className={`w-6 h-6 ${levelInfo.currentLevel.color}`} />
            </div>
            {levelInfo.nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression vers {levelInfo.nextLevel.name}</span>
                  <span>{Math.round(levelInfo.progress)}%</span>
                </div>
                <Progress value={levelInfo.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {levelInfo.nextLevel.minPoints - totalPoints} points restants
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Badges Obtenus</p>
                <p className="text-3xl font-bold text-orange-600">{badges.length}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="badges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="badges" className="gap-2">
            <Award className="w-4 h-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Activité
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="gap-2">
            <Trophy className="w-4 h-4" />
            Classement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="badges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Mes Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              {badges.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((studentBadge) => (
                    <div key={studentBadge.id} className="flex items-center gap-3 p-4 border rounded-lg">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {getBadgeIcon(studentBadge.badge.badge_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{studentBadge.badge.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {studentBadge.badge.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            +{studentBadge.badge.points_value} pts
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(studentBadge.awarded_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun badge encore</h3>
                  <p className="text-muted-foreground">
                    Participez aux activités pour gagner vos premiers badges !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Activité Récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {points.length > 0 ? (
                <div className="space-y-3">
                  {getRecentPoints().map((point) => (
                    <div key={point.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {point.description || point.point_type}
                        </p>
                        <p className="text-xs text-muted-foreground">{point.timeAgo}</p>
                      </div>
                      <Badge variant={point.points > 0 ? "default" : "destructive"}>
                        {point.points > 0 ? '+' : ''}{point.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucune activité</h3>
                  <p className="text-muted-foreground">
                    Votre activité récente apparaîtra ici.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Classement Général
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.map((student, index) => (
                    <div 
                      key={student.student_id} 
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        student.student_id === studentId ? 'bg-primary/10 border border-primary/20' : 'border'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index < 3 ? (
                          <Crown className="w-4 h-4" />
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.total_points} points
                        </p>
                      </div>
                      {student.student_id === studentId && (
                        <Badge variant="default">Vous</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Classement en cours</h3>
                  <p className="text-muted-foreground">
                    Le classement sera disponible une fois que les étudiants auront commencé à gagner des points.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}