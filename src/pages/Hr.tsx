import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { HrModuleSidebar } from '@/components/HrModuleSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Calendar,
  TrendingUp,
  UserCheck,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useTeacherProfiles } from '@/hooks/hr/useTeacherProfiles';
import { useTeacherContracts } from '@/hooks/hr/useTeacherContracts';

export default function Hr() {
  const { teacherProfiles, loading: profilesLoading } = useTeacherProfiles();
  const { contracts, loading: contractsLoading } = useTeacherContracts();

  const activeTeachers = teacherProfiles.filter(t => t.status === 'active').length;
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const totalProfiles = teacherProfiles.length;
  
  // Calculer les contrats qui expirent bientôt (dans les 30 prochains jours)
  const soonExpiringContracts = contracts.filter(c => {
    if (!c.end_date || c.status !== 'active') return false;
    const endDate = new Date(c.end_date);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return endDate <= thirtyDaysFromNow && endDate >= now;
  }).length;

  const stats = [
    {
      label: "Enseignants actifs",
      value: activeTeachers.toString(),
      change: `${totalProfiles} total`,
      changeType: "positive" as const
    },
    {
      label: "Contrats actifs",
      value: activeContracts.toString(),
      change: `${contracts.length} total`,
      changeType: "positive" as const
    },
    {
      label: "Contrats à renouveler",
      value: soonExpiringContracts.toString(),
      change: "30 prochains jours",
      changeType: soonExpiringContracts > 0 ? "warning" as const : "positive" as const
    },
    {
      label: "Profils complets",
      value: totalProfiles > 0 ? Math.round((activeTeachers / totalProfiles) * 100) + "%" : "0%",
      change: "Données à jour",
      changeType: "positive" as const
    }
  ];

  // Activités récentes basées sur les vraies données
  const recentActivities = [
    ...teacherProfiles.slice(0, 2).map(teacher => ({
      id: teacher.id,
      teacher: teacher.profile?.full_name || 'Nom non défini',
      action: "Profil créé",
      status: teacher.status === 'active' ? "completed" : "pending",
      date: new Date(teacher.created_at).toISOString().split('T')[0]
    })),
    ...contracts.slice(0, 1).map(contract => ({
      id: contract.id,
      teacher: contract.teacher_profile?.profile?.full_name || 'Nom non défini',
      action: contract.status === 'active' ? "Contrat actif" : "Contrat créé",
      status: contract.status === 'active' ? "completed" : "progress",
      date: new Date(contract.created_at).toISOString().split('T')[0]
    }))
  ].slice(0, 3);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Complété</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'progress':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200"><TrendingUp className="w-3 h-3 mr-1" />En cours</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <ModuleLayout sidebar={<HrModuleSidebar />}>
      <div className="p-8 space-y-8">
        {/* Header avec statistiques */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ressources Humaines</h1>
            <p className="text-muted-foreground text-lg mt-1">Gestion du personnel enseignant et administratif</p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white rounded-2xl shadow-sm border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <UserCheck className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activités récentes */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-500" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
              {profilesLoading || contractsLoading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Chargement des activités...
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune activité récente</p>
                </div>
              ) : recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{activity.teacher}</p>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(activity.status)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Indicateurs de performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Graphiques de performance à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Ajouter un enseignant</p>
                      <p className="text-xs text-muted-foreground">Nouveau profil</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Gérer les contrats</p>
                      <p className="text-xs text-muted-foreground">Renouvellements</p>
                    </div>
                  </div>
                </button>

                <button className="w-full p-3 text-left rounded-xl border border-border/50 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="font-medium">Disponibilités</p>
                      <p className="text-xs text-muted-foreground">Planification</p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white rounded-2xl shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm font-medium text-yellow-700">
                    {soonExpiringContracts} contrats à renouveler
                  </p>
                  <p className="text-xs text-yellow-600">Échéance dans 30 jours</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm font-medium text-blue-700">8 évaluations en retard</p>
                  <p className="text-xs text-blue-600">À compléter</p>
                </div>

                <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-sm font-medium text-green-700">Synchronisation RH</p>
                  <p className="text-xs text-green-600">Dernière mise à jour : aujourd'hui</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
}