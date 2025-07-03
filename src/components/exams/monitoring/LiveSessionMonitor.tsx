import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Play, 
  Pause, 
  Square, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  Camera,
  Wifi,
  WifiOff,
  MapPin,
  Bell,
  MessageCircle,
  Settings
} from 'lucide-react';

interface LiveSession {
  id: string;
  examTitle: string;
  room: string;
  roomId: string;
  supervisor: string;
  supervisorId: string;
  studentsPresent: number;
  studentsTotal: number;
  startTime: string;
  endTime: string;
  timeRemaining: string;
  status: 'in_progress' | 'paused' | 'completed' | 'cancelled';
  alerts: Alert[];
  cameraStatus: 'online' | 'offline' | 'error';
  supervisorStatus: 'online' | 'offline';
  lastActivity: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  acknowledged?: boolean;
}

export function LiveSessionMonitor() {
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds

  const [sessions, setSessions] = useState<LiveSession[]>([
    {
      id: 'SES-001',
      examTitle: 'Mathématiques Avancées',
      room: 'Amphi A',
      roomId: 'room-1',
      supervisor: 'Dr. Martin',
      supervisorId: 'sup-1',
      studentsPresent: 45,
      studentsTotal: 50,
      startTime: '09:00',
      endTime: '12:00',
      timeRemaining: '01:23:15',
      status: 'in_progress',
      alerts: [
        {
          id: 'alert-1',
          type: 'warning',
          message: '3 étudiants en retard',
          timestamp: '09:15'
        }
      ],
      cameraStatus: 'online',
      supervisorStatus: 'online',
      lastActivity: 'Il y a 30 secondes'
    },
    {
      id: 'SES-002',
      examTitle: 'Physique Quantique',
      room: 'Salle 205',
      roomId: 'room-2',
      supervisor: 'Prof. Durand',
      supervisorId: 'sup-2',
      studentsPresent: 28,
      studentsTotal: 30,
      startTime: '10:30',
      endTime: '12:30',
      timeRemaining: '01:45:22',
      status: 'in_progress',
      alerts: [],
      cameraStatus: 'online',
      supervisorStatus: 'online',
      lastActivity: 'Il y a 1 minute'
    },
    {
      id: 'SES-003',
      examTitle: 'Chimie Organique',
      room: 'Labo C',
      roomId: 'room-3',
      supervisor: 'Dr. Leblanc',
      supervisorId: 'sup-3',
      studentsPresent: 15,
      studentsTotal: 20,
      startTime: '14:00',
      endTime: '16:00',
      timeRemaining: '00:05:30',
      status: 'in_progress',
      alerts: [
        {
          id: 'alert-2',
          type: 'error',
          message: 'Problème technique détecté',
          timestamp: '15:52'
        },
        {
          id: 'alert-3',
          type: 'info',
          message: 'Temps de l\'épreuve bientôt terminé',
          timestamp: '15:54'
        }
      ],
      cameraStatus: 'error',
      supervisorStatus: 'online',
      lastActivity: 'Il y a 2 minutes'
    }
  ]);

  // Simuler la mise à jour en temps réel
  useEffect(() => {
    if (!autoRefresh || !monitoringActive) return;

    const interval = setInterval(() => {
      setSessions(prev => prev.map(session => {
        const timeRemaining = session.timeRemaining;
        const [hours, minutes, seconds] = timeRemaining.split(':').map(Number);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        
        if (totalSeconds <= 0) {
          return { ...session, status: 'completed' as const, timeRemaining: '00:00:00' };
        }

        const newTotalSeconds = Math.max(0, totalSeconds - refreshInterval);
        const newHours = Math.floor(newTotalSeconds / 3600);
        const newMinutes = Math.floor((newTotalSeconds % 3600) / 60);
        const newSecondsRem = newTotalSeconds % 60;
        
        return {
          ...session,
          timeRemaining: `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSecondsRem.toString().padStart(2, '0')}`
        };
      }));
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefresh, monitoringActive, refreshInterval]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-green-100 text-green-700"><Play className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-700"><Pause className="w-3 h-3 mr-1" />Suspendu</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-700"><CheckCircle className="w-3 h-3 mr-1" />Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700"><Square className="w-3 h-3 mr-1" />Annulé</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case 'error':
        return <Badge className="bg-red-100 text-red-700"><AlertTriangle className="w-3 h-3 mr-1" />Erreur</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700"><AlertTriangle className="w-3 h-3 mr-1" />Attention</Badge>;
      case 'info':
        return <Badge className="bg-blue-100 text-blue-700"><Bell className="w-3 h-3 mr-1" />Info</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const filteredSessions = selectedRoom === 'all' 
    ? sessions 
    : sessions.filter(s => s.roomId === selectedRoom);

  const totalActiveAlerts = sessions.reduce((acc, session) => 
    acc + session.alerts.filter(alert => !alert.acknowledged).length, 0
  );

  return (
    <div className="space-y-6">
      {/* Contrôles de surveillance */}
      <Card className="bg-white rounded-2xl shadow-sm border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-violet-500" />
              Surveillance en temps réel
              {monitoringActive && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </CardTitle>
            <div className="flex items-center gap-3">
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Toutes les salles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les salles</SelectItem>
                  <SelectItem value="room-1">Amphi A</SelectItem>
                  <SelectItem value="room-2">Salle 205</SelectItem>
                  <SelectItem value="room-3">Labo C</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant={monitoringActive ? "default" : "outline"}
                onClick={() => setMonitoringActive(!monitoringActive)}
              >
                {monitoringActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {monitoringActive ? 'Suspendre' : 'Reprendre'}
              </Button>
              <Button variant="outline">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{filteredSessions.length}</div>
              <div className="text-sm text-blue-600">Sessions actives</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredSessions.reduce((acc, s) => acc + s.studentsPresent, 0)}
              </div>
              <div className="text-sm text-green-600">Étudiants présents</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{totalActiveAlerts}</div>
              <div className="text-sm text-orange-600">Alertes actives</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {sessions.filter(s => s.supervisorStatus === 'online').length}
              </div>
              <div className="text-sm text-purple-600">Surveillants connectés</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions en cours */}
      <div className="space-y-4">
        {filteredSessions.map(session => (
          <Card key={session.id} className="bg-white rounded-2xl shadow-sm border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{session.examTitle}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {session.room} • {session.supervisor}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(session.status)}
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informations principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Présents / Total</p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {session.studentsPresent}/{session.studentsTotal}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Temps restant</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold font-mono">{session.timeRemaining}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Caméra</p>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-muted-foreground" />
                    <Badge 
                      variant={session.cameraStatus === 'online' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {session.cameraStatus === 'online' ? 'En ligne' : 
                       session.cameraStatus === 'offline' ? 'Hors ligne' : 'Erreur'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Surveillant</p>
                  <div className="flex items-center gap-2">
                    {session.supervisorStatus === 'online' ? 
                      <Wifi className="w-4 h-4 text-green-500" /> : 
                      <WifiOff className="w-4 h-4 text-red-500" />
                    }
                    <Badge 
                      variant={session.supervisorStatus === 'online' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {session.supervisorStatus === 'online' ? 'Connecté' : 'Déconnecté'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Alertes */}
              {session.alerts.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Alertes ({session.alerts.length})
                  </h4>
                  <div className="space-y-2">
                    {session.alerts.map(alert => (
                      <Alert key={alert.id} className="border-l-4 border-l-orange-500">
                        <AlertDescription className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getAlertBadge(alert.type)}
                            <span>{alert.message}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {alert.timestamp}
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions rapides */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  Dernière activité: {session.lastActivity}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Contact surveillant
                  </Button>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                  {session.status === 'in_progress' && (
                    <Button variant="outline" size="sm">
                      <Pause className="w-4 h-4 mr-1" />
                      Suspendre
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card className="bg-white rounded-2xl shadow-sm border-0">
          <CardContent className="p-12 text-center">
            <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Aucune session active</h3>
            <p className="text-muted-foreground">
              Aucune session d'examen n'est actuellement en cours dans les salles sélectionnées.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}