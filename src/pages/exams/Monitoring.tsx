import { useState, useEffect } from 'react';
import { ExamsModuleLayout } from "@/components/layouts/ExamsModuleLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  AlertTriangle, 
  Clock, 
  Users, 
  MapPin,
  Activity,
  CheckCircle,
  Play,
  Pause,
  Square,
  Camera,
  Shield,
  Wifi,
  WifiOff
} from 'lucide-react';

export default function Monitoring() {
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [monitoringStatus, setMonitoringStatus] = useState<'active' | 'paused' | 'stopped'>('active');
  const [liveData, setLiveData] = useState({
    activeSessions: 3,
    totalStudents: 87,
    activeAlerts: 2,
    connectedSupervisors: 8
  });

  // Données simulées des sessions en cours
  const [liveSessions] = useState([
    {
      id: 'SES-001',
      examTitle: 'Mathématiques Avancées',
      room: 'Amphi A',
      supervisor: 'Dr. Martin',
      studentsPresent: 45,
      studentsTotal: 50,
      startTime: '09:00',
      endTime: '12:00',
      timeRemaining: '01:23:15',
      status: 'in_progress',
      alerts: ['Retard de 3 étudiants'],
      cameraStatus: 'online',
      internetStatus: 'stable'
    },
    {
      id: 'SES-002',
      examTitle: 'Physique Quantique',
      room: 'Salle 205',
      supervisor: 'Mme. Dubois',
      studentsPresent: 28,
      studentsTotal: 30,
      startTime: '14:00',
      endTime: '16:30',
      timeRemaining: '02:15:42',
      status: 'in_progress',
      alerts: [],
      cameraStatus: 'online',
      internetStatus: 'stable'
    },
    {
      id: 'SES-003',
      examTitle: 'Chimie Organique',
      room: 'Labo C',
      supervisor: 'Prof. Lévy',
      studentsPresent: 14,
      studentsTotal: 15,
      startTime: '10:30',
      endTime: '12:00',
      timeRemaining: '00:45:28',
      status: 'ending_soon',
      alerts: ['Équipement défaillant - Poste 7'],
      cameraStatus: 'offline',
      internetStatus: 'unstable'
    }
  ]);

  // Alertes en temps réel
  const [realtimeAlerts] = useState([
    {
      id: 'ALR-001',
      timestamp: new Date().toLocaleTimeString(),
      level: 'warning',
      message: 'Caméra déconnectée - Labo C',
      session: 'SES-003',
      resolved: false
    },
    {
      id: 'ALR-002',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toLocaleTimeString(),
      level: 'info',
      message: 'Connexion réseau instable - Labo C',
      session: 'SES-003',
      resolved: false
    },
    {
      id: 'ALR-003',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toLocaleTimeString(),
      level: 'resolved',
      message: 'Retard étudiant résolu - Amphi A',
      session: 'SES-001',
      resolved: true
    }
  ]);

  // Simulation du temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // Mise à jour des données toutes les 30 secondes
      setLiveData(prev => ({
        ...prev,
        // Simulation de variations minimes
        totalStudents: prev.totalStudents + Math.floor(Math.random() * 3) - 1
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-green-100 text-green-700"><Play className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'ending_soon':
        return <Badge className="bg-orange-100 text-orange-700"><Clock className="w-3 h-3 mr-1" />Fin proche</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-700"><Pause className="w-3 h-3 mr-1" />Pause</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAlertBadge = (level: string) => {
    switch (level) {
      case 'warning':
        return <Badge className="bg-orange-100 text-orange-700">Attention</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-700">Erreur</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700">Résolu</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-700">Info</Badge>;
    }
  };

  const handleMonitoringControl = (action: 'play' | 'pause' | 'stop') => {
    switch (action) {
      case 'play':
        setMonitoringStatus('active');
        break;
      case 'pause':
        setMonitoringStatus('paused');
        break;
      case 'stop':
        setMonitoringStatus('stopped');
        break;
    }
  };

  return (
    <ExamsModuleLayout 
      title="Surveillance temps réel" 
      subtitle="Sessions en cours de surveillance"
    >
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Statut de surveillance */}
          <Card className={`${
            monitoringStatus === 'active' ? 'bg-green-50 border-green-200' :
            monitoringStatus === 'paused' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${
                    monitoringStatus === 'active' ? 'bg-green-500 animate-pulse' :
                    monitoringStatus === 'paused' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Surveillance {
                        monitoringStatus === 'active' ? 'Active' :
                        monitoringStatus === 'paused' ? 'En Pause' :
                        'Arrêtée'
                      }
                    </h3>
                    <p className="text-muted-foreground">
                      {monitoringStatus === 'active' && 'Surveillance en temps réel des sessions d\'examens'}
                      {monitoringStatus === 'paused' && 'Surveillance temporairement suspendue'}
                      {monitoringStatus === 'stopped' && 'Surveillance arrêtée - Redémarrage requis'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={monitoringStatus === 'active' ? 'outline' : 'default'}
                    onClick={() => handleMonitoringControl('play')}
                    disabled={monitoringStatus === 'active'}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Démarrer
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMonitoringControl('pause')}
                    disabled={monitoringStatus !== 'active'}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleMonitoringControl('stop')}
                    disabled={monitoringStatus === 'stopped'}
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Arrêter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métriques temps réel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{liveData.activeSessions}</p>
                    <p className="text-sm text-muted-foreground">Sessions Actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{liveData.totalStudents}</p>
                    <p className="text-sm text-muted-foreground">Étudiants en Examen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{liveData.activeAlerts}</p>
                    <p className="text-sm text-muted-foreground">Alertes Actives</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{liveData.connectedSupervisors}</p>
                    <p className="text-sm text-muted-foreground">Surveillants Connectés</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sessions">Sessions Actives</TabsTrigger>
              <TabsTrigger value="alerts">Alertes ({realtimeAlerts.filter(a => !a.resolved).length})</TabsTrigger>
              <TabsTrigger value="monitoring">Contrôles</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="space-y-6">
              {/* Filtres */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrer par salle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les salles</SelectItem>
                        <SelectItem value="amphi-a">Amphi A</SelectItem>
                        <SelectItem value="salle-205">Salle 205</SelectItem>
                        <SelectItem value="labo-c">Labo C</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Vue d'ensemble
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sessions en cours */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {liveSessions.map((session) => (
                  <Card key={session.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{session.examTitle}</CardTitle>
                        {getStatusBadge(session.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{session.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <span>{session.supervisor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{session.studentsPresent}/{session.studentsTotal} présents</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono">{session.timeRemaining}</span>
                        </div>
                      </div>

                      {/* Status techniques */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Camera className={`w-4 h-4 ${session.cameraStatus === 'online' ? 'text-green-500' : 'text-red-500'}`} />
                          <span>Caméra {session.cameraStatus === 'online' ? 'OK' : 'Hors ligne'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {session.internetStatus === 'stable' ? 
                            <Wifi className="w-4 h-4 text-green-500" /> : 
                            <WifiOff className="w-4 h-4 text-orange-500" />
                          }
                          <span>Réseau {session.internetStatus === 'stable' ? 'stable' : 'instable'}</span>
                        </div>
                      </div>

                      {/* Alertes de session */}
                      {session.alerts.length > 0 && (
                        <Alert>
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>
                            {session.alerts.join(', ')}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          Surveiller
                        </Button>
                        <Button size="sm" variant="outline">
                          <Camera className="w-4 h-4 mr-1" />
                          Caméras
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Alertes Temps Réel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realtimeAlerts.map((alert) => (
                      <div key={alert.id} className={`flex items-center justify-between p-3 rounded border ${
                        alert.resolved ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-mono text-muted-foreground">
                            {alert.timestamp}
                          </div>
                          <div>
                            <p className="font-medium">{alert.message}</p>
                            <p className="text-sm text-muted-foreground">Session: {alert.session}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getAlertBadge(alert.level)}
                          {!alert.resolved && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Résoudre
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="monitoring" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contrôles de Surveillance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleMonitoringControl('play')}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMonitoringControl('pause')}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMonitoringControl('stop')}
                      >
                        <Square className="w-4 h-4 mr-1" />
                        Stop
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Contrôlez l'état de la surveillance générale des sessions.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de Surveillance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Alertes automatiques</span>
                        <Badge className="bg-green-100 text-green-700">Activé</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enregistrement vidéo</span>
                        <Badge className="bg-green-100 text-green-700">Activé</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Notifications push</span>
                        <Badge className="bg-green-100 text-green-700">Activé</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ExamsModuleLayout>
  );
}