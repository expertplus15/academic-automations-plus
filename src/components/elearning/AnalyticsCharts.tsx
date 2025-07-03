import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Placeholder pour les graphiques - Recharts sera intégré plus tard
import { 
  TrendingUp, 
  Users, 
  Clock, 
  BookOpen,
  Award,
  PlayCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsChartsProps {
  timeRange: string;
}

export function AnalyticsCharts({ timeRange }: AnalyticsChartsProps) {
  // Mock data - remplacer par de vraies données
  const engagementData = [
    { name: 'Lun', sessions: 45, completion: 78, timeSpent: 120 },
    { name: 'Mar', sessions: 52, completion: 82, timeSpent: 135 },
    { name: 'Mer', sessions: 48, completion: 75, timeSpent: 110 },
    { name: 'Jeu', sessions: 61, completion: 88, timeSpent: 150 },
    { name: 'Ven', sessions: 55, completion: 79, timeSpent: 125 },
    { name: 'Sam', sessions: 38, completion: 65, timeSpent: 95 },
    { name: 'Dim', sessions: 42, completion: 71, timeSpent: 105 },
  ];

  const courseCompletionData = [
    { name: 'Complétés', value: 342, color: '#10b981' },
    { name: 'En cours', value: 156, color: '#f59e0b' },
    { name: 'Abandonnés', value: 48, color: '#ef4444' },
    { name: 'Pas commencés', value: 89, color: '#6b7280' },
  ];

  const topCoursesData = [
    { name: 'React Avancé', students: 245, completion: 89 },
    { name: 'JavaScript ES6+', students: 198, completion: 92 },
    { name: 'Node.js Backend', students: 156, completion: 76 },
    { name: 'CSS Moderne', students: 134, completion: 94 },
    { name: 'TypeScript', students: 112, completion: 81 },
  ];

  const learningTimeData = [
    { hour: '8h', time: 45 },
    { hour: '10h', time: 68 },
    { hour: '12h', time: 32 },
    { hour: '14h', time: 89 },
    { hour: '16h', time: 76 },
    { hour: '18h', time: 54 },
    { hour: '20h', time: 41 },
    { hour: '22h', time: 23 },
  ];

  const stats = [
    {
      title: "Sessions actives",
      value: "1,234",
      change: "+12%",
      changeType: "increase" as const,
      icon: PlayCircle,
      color: "bg-blue-500"
    },
    {
      title: "Taux de completion",
      value: "87.5%",
      change: "+5.2%",
      changeType: "increase" as const,
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Temps moyen/cours",
      value: "2h 45m",
      change: "-8m",
      changeType: "decrease" as const,
      icon: Clock,
      color: "bg-purple-500"
    },
    {
      title: "Taux d'abandon",
      value: "12.3%",
      change: "-3.1%",
      changeType: "decrease" as const,
      icon: AlertTriangle,
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques en header */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 mr-1 ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <span className={`text-sm ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Engagement des étudiants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Graphique d'engagement - Recharts à intégrer</p>
            </div>
          </CardContent>
        </Card>

        {/* Répartition des cours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-500" />
              Statut des cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Graphique en secteurs - Recharts à intégrer</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top cours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Cours les plus populaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Graphique barres horizontales - Recharts à intégrer</p>
            </div>
          </CardContent>
        </Card>

        {/* Heures d'apprentissage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              Répartition horaire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Graphique linéaire - Recharts à intégrer</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights et recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Insights et Recommandations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <Badge className="bg-green-100 text-green-700">Positif</Badge>
              </div>
              <h4 className="font-semibold text-green-800">Engagement en hausse</h4>
              <p className="text-sm text-green-700 mt-1">
                L'engagement des étudiants a augmenté de 12% cette semaine
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <Badge className="bg-blue-100 text-blue-700">Info</Badge>
              </div>
              <h4 className="font-semibold text-blue-800">Pic d'activité 14h</h4>
              <p className="text-sm text-blue-700 mt-1">
                Le pic d'activité se situe à 14h avec 89 minutes d'apprentissage
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700">Attention</Badge>
              </div>
              <h4 className="font-semibold text-orange-800">Taux d'abandon weekend</h4>
              <p className="text-sm text-orange-700 mt-1">
                Le taux d'abandon augmente le weekend (-23% d'engagement)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}