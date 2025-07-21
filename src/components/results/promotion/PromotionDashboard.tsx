import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  AlertTriangle, 
  Plus,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function PromotionDashboard() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['promotion-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotion_campaigns')
        .select(`
          *,
          source_academic_year:academic_years!source_academic_year_id(name),
          target_academic_year:academic_years!target_academic_year_id(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: stats } = useQuery({
    queryKey: ['promotion-stats'],
    queryFn: async () => {
      // Simuler des statistiques
      return {
        totalStudents: 1247,
        eligibleStudents: 1089,
        promotedStudents: 967,
        averageSuccess: 87.3
      };
    }
  });

  const { data: recentCampaigns } = useQuery({
    queryKey: ['recent-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('promotion_campaigns')
        .select(`
          *,
          source_academic_year:academic_years!source_academic_year_id(name),
          target_academic_year:academic_years!target_academic_year_id(name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Étudiants</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-blue-600">Année en cours</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Éligibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats?.eligibleStudents || 0}</div>
            <p className="text-xs text-green-600">
              {stats?.totalStudents ? Math.round((stats.eligibleStudents / stats.totalStudents) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Promus</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats?.promotedStudents || 0}</div>
            <p className="text-xs text-purple-600">Dernière campagne</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Taux de Réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats?.averageSuccess || 0}%</div>
            <p className="text-xs text-orange-600">Moyenne globale</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-500" />
              Campagnes Récentes
            </CardTitle>
            <CardDescription>
              Historique des dernières promotions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCampaigns?.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{campaign.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {campaign.source_academic_year?.name} → {campaign.target_academic_year?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    campaign.status === 'completed' ? 'default' :
                    campaign.status === 'in_progress' ? 'secondary' :
                    campaign.status === 'draft' ? 'outline' : 'destructive'
                  }>
                    {campaign.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                    {campaign.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                    {campaign.status}
                  </Badge>
                </div>
              </div>
            ))}
            {(!recentCampaigns || recentCampaigns.length === 0) && (
              <p className="text-muted-foreground text-center py-4">Aucune campagne récente</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Actions Rapides
            </CardTitle>
            <CardDescription>
              Lancer ou configurer une promotion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Campagne de Promotion
            </Button>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <GraduationCap className="h-4 w-4 mr-2" />
                Assistant de Promotion Automatique
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Analyser l'Éligibilité des Étudiants
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="h-4 w-4 mr-2" />
                Générer un Rapport de Performance
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progression par Programme</CardTitle>
          <CardDescription>
            Taux de réussite et progression par filière
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Informatique', eligible: 95, total: 120, rate: 79 },
              { name: 'Commerce', eligible: 87, total: 98, rate: 89 },
              { name: 'Gestion', eligible: 156, total: 180, rate: 87 },
              { name: 'Communication', eligible: 67, total: 75, rate: 89 }
            ].map((program) => (
              <div key={program.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{program.name}</span>
                  <span className="text-muted-foreground">
                    {program.eligible}/{program.total} ({program.rate}%)
                  </span>
                </div>
                <Progress value={program.rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}