import { StudentsModuleLayout } from "@/components/layouts/StudentsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationStats {
  totalApplications: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  todayApplications: number;
  weeklyGrowth: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<RegistrationStats>({
    totalApplications: 0,
    pendingReview: 0,
    approved: 0,
    rejected: 0,
    todayApplications: 0,
    weeklyGrowth: 0
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRegistrationData();
  }, []);

  const fetchRegistrationData = async () => {
    try {
      const { data: students, error } = await supabase
        .from('students')
        .select(`
          id,
          student_number,
          status,
          enrollment_date,
          profile:profiles!inner (
            full_name,
            email
          ),
          program:programs (
            name
          )
        `)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;

      const today = new Date().toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const totalApplications = students?.length || 0;
      const pendingReview = students?.filter(s => s.status === 'suspended').length || 0;
      const approved = students?.filter(s => s.status === 'active').length || 0;
      const rejected = students?.filter(s => s.status === 'dropped').length || 0;
      const todayApplications = students?.filter(s => s.enrollment_date === today).length || 0;
      const weeklyApplications = students?.filter(s => s.enrollment_date >= weekAgo).length || 0;

      setStats({
        totalApplications,
        pendingReview,
        approved,
        rejected,
        todayApplications,
        weeklyGrowth: weeklyApplications
      });

      setRecentApplications(students?.slice(0, 10) || []);

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'inscription",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <StudentsModuleLayout 
        title="Suivi des Inscriptions" 
        subtitle="Tableau de bord des demandes d'inscription"
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-students"></div>
        </div>
      </StudentsModuleLayout>
    );
  }

  return (
    <StudentsModuleLayout 
      title="Suivi des Inscriptions" 
      subtitle="Tableau de bord des demandes d'inscription"
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Candidatures</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+{stats.todayApplications} aujourd'hui</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{stats.pendingReview}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-600">À traiter</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approuvées</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-xl">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">{Math.round((stats.approved / stats.totalApplications) * 100)}% de réussite</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cette semaine</p>
                  <p className="text-2xl font-bold">{stats.weeklyGrowth}</p>
                </div>
                <div className="p-3 bg-students-100 rounded-xl">
                  <Users className="w-6 h-6 text-students" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-students" />
                <span className="text-sm text-students">Nouvelles candidatures</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-students" />
              Candidatures récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length > 0 ? recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-students-100 rounded-lg">
                      <Users className="w-4 h-4 text-students" />
                    </div>
                    <div>
                      <p className="font-semibold">{application.profile?.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {application.student_number} - {application.program?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    {getStatusBadge(application.status)}
                    <span className="text-xs text-muted-foreground block">
                      {new Date(application.enrollment_date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Aucune candidature récente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </StudentsModuleLayout>
  );
}