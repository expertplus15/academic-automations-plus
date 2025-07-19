
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Mail, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDUT2GESessionManager } from '@/hooks/exams/useDUT2GESessionManager';

// Métriques simulées pour DUT2-GE Session S1-2324
const CURRENT_METRICS = {
  session: {
    code: 'S1-2324-DUTGE',
    status: 'active',
    progress: 85
  },
  exams: {
    total: 18,
    s3: 9,
    s4: 9,
    scheduled: 18,
    completed: 0
  },
  students: {
    registered: 13,
    convocations_sent: 260
  },
  organization: {
    supervisors_assigned: 36,
    rooms_allocated: 8,
    conflicts_resolved: 100
  }
};

export function DUT2GEDashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);
  const { getDUT2GESessions, loading } = useDUT2GESessionManager();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await getDUT2GESessions();
    setSessions(data);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec session active */}
      <Card className="bg-gradient-to-r from-exams/5 to-exams/10 border-exams/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-exams/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-exams" />
                </div>
                Session DUT2-GE S1-2324
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Gestion Examens DUT Gestion des Entreprises - 2ème année
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Opérationnelle
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-exams">{CURRENT_METRICS.exams.total}</p>
              <p className="text-sm text-muted-foreground">Examens planifiés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{CURRENT_METRICS.students.registered}</p>
              <p className="text-sm text-muted-foreground">Étudiants inscrits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{CURRENT_METRICS.organization.supervisors_assigned}</p>
              <p className="text-sm text-muted-foreground">Surveillants affectés</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{CURRENT_METRICS.students.convocations_sent}</p>
              <p className="text-sm text-muted-foreground">Convocations envoyées</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progression organisation</span>
              <span className="text-sm text-muted-foreground">{CURRENT_METRICS.session.progress}%</span>
            </div>
            <Progress value={CURRENT_METRICS.session.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{CURRENT_METRICS.exams.s3} + {CURRENT_METRICS.exams.s4}</p>
                <p className="text-sm text-muted-foreground">Examens S3 + S4</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{CURRENT_METRICS.organization.supervisors_assigned}</p>
                <p className="text-sm text-muted-foreground">Surveillants (2×18)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{CURRENT_METRICS.organization.rooms_allocated}</p>
                <p className="text-sm text-muted-foreground">Salles allouées</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-semibold">{CURRENT_METRICS.organization.conflicts_resolved}%</p>
                <p className="text-sm text-muted-foreground">Sans conflits</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-exams" />
              Gestion Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/exams/sessions')}
              className="w-full justify-start"
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Gérer les Sessions
            </Button>
            <Button 
              onClick={() => navigate('/exams/planning')}
              className="w-full justify-start"
              variant="outline"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Planification Examens
            </Button>
            <Button 
              onClick={() => navigate('/exams/supervisors')}
              className="w-full justify-start"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Attribution Surveillants
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Convocations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Envoyées</span>
              </div>
              <Badge className="bg-green-100 text-green-800">260</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Rappels programmés</span>
              </div>
              <Badge className="bg-blue-100 text-blue-800">78</Badge>
            </div>
            <Button 
              onClick={() => navigate('/exams/invitations')}
              className="w-full"
              variant="outline"
            >
              Gérer les Convocations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Statut détaillé */}
      <Card>
        <CardHeader>
          <CardTitle>Statut Détaillé Session S1-2324-DUTGE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Semestre 3 - Janvier 2024</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Examens écrits</span>
                  <Badge variant="secondary">8 planifiés</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Soutenances orales</span>
                  <Badge variant="secondary">1 planifiée</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Surveillants</span>
                  <Badge className="bg-green-100 text-green-800">18 affectés</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Semestre 4 - Juin 2024</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Examens écrits</span>
                  <Badge variant="secondary">6 planifiés</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Soutenances orales</span>
                  <Badge variant="secondary">3 planifiées</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Jurys constitués</span>
                  <Badge className="bg-green-100 text-green-800">9 personnes</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Logistique</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Salles réservées</span>
                  <Badge className="bg-blue-100 text-blue-800">8 salles</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conflits détectés</span>
                  <Badge className="bg-green-100 text-green-800">0 conflit</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taux couverture</span>
                  <Badge className="bg-green-100 text-green-800">100%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
