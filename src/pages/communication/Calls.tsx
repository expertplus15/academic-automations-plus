import { CommunicationModuleLayout } from "@/components/layouts/CommunicationModuleLayout";
import { CommunicationPageHeader } from "@/components/CommunicationPageHeader";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Video, 
  Phone, 
  PhoneCall,
  PhoneOff,
  Calendar,
  Clock,
  Users,
  Settings,
  Plus,
  Search,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function CommunicationCalls() {
  const { hasRole } = useAuth();
  const { toast } = useToast();

  const recentCalls = [
    {
      id: "1",
      contact: "Marie Dubois",
      type: "video",
      status: "completed",
      duration: "25 min",
      timestamp: "Il y a 2h",
      avatar: "/avatars/marie.jpg"
    },
    {
      id: "2",
      contact: "Équipe Pédagogique",
      type: "audio",
      status: "missed",
      duration: "-",
      timestamp: "Il y a 4h",
      avatar: "/avatars/team.jpg"
    },
    {
      id: "3",
      contact: "Pierre Martin",
      type: "video",
      status: "completed",
      duration: "12 min",
      timestamp: "Hier",
      avatar: "/avatars/pierre.jpg"
    }
  ];

  const scheduledCalls = [
    {
      id: "1",
      title: "Réunion équipe pédagogique",
      participants: ["Marie D.", "Jean P.", "Sophie L."],
      time: "15:00 - 16:00",
      date: "Aujourd'hui",
      type: "video"
    },
    {
      id: "2", 
      title: "Entretien étudiant",
      participants: ["Pierre M."],
      time: "10:30 - 11:00",
      date: "Demain",
      type: "video"
    }
  ];

  const handleStartCall = (type: string) => {
    toast({
      title: `Appel ${type}`,
      description: `Fonctionnalité d'appel ${type} en développement`,
    });
  };

  const handleScheduleCall = () => {
    toast({
      title: "Programmer un appel",
      description: "Fonctionnalité de planification en développement",
    });
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'hr', 'teacher', 'student']}>
      <CommunicationModuleLayout>
        <CommunicationPageHeader 
          title="Appels & Visioconférence" 
          subtitle="Appels audio et vidéo, réunions virtuelles" 
        />
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Appels aujourd'hui</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <Phone className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Durée totale</p>
                      <p className="text-2xl font-bold">3h 45m</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Participants</p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Programmés</p>
                      <p className="text-2xl font-bold">5</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => handleStartCall("audio")}
                    className="h-16 flex flex-col gap-2"
                    variant="outline"
                  >
                    <Phone className="h-6 w-6" />
                    <span>Nouvel Appel Audio</span>
                  </Button>
                  <Button 
                    onClick={() => handleStartCall("vidéo")}
                    className="h-16 flex flex-col gap-2"
                    variant="outline"
                  >
                    <Video className="h-6 w-6" />
                    <span>Nouvelle Visioconférence</span>
                  </Button>
                  <Button 
                    onClick={handleScheduleCall}
                    className="h-16 flex flex-col gap-2"
                    variant="outline"
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Programmer Appel</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Historique des appels */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Appels Récents</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Rechercher..." className="pl-9 w-48" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCalls.map((call) => (
                      <div key={call.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={call.avatar} />
                            <AvatarFallback>{call.contact.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{call.contact}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {call.type === 'video' ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                              <span>{call.timestamp}</span>
                              {call.duration !== '-' && <span>• {call.duration}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={call.status === 'completed' ? 'default' : 'destructive'}>
                            {call.status === 'completed' ? 'Terminé' : 'Manqué'}
                          </Badge>
                          <Button variant="ghost" size="icon" onClick={() => handleStartCall(call.type)}>
                            {call.type === 'video' ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Appels programmés */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Appels Programmés</CardTitle>
                    <Button onClick={handleScheduleCall} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouveau
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scheduledCalls.map((call) => (
                      <div key={call.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{call.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              {call.type === 'video' ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                              <span>{call.date} • {call.time}</span>
                            </div>
                          </div>
                          <Badge variant="outline">Programmé</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {call.participants.join(', ')}
                            </span>
                          </div>
                          <Button size="sm" onClick={() => handleStartCall(call.type)}>
                            Rejoindre
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contrôles de réunion (si en cours) */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  Réunion en cours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Réunion équipe pédagogique</h3>
                    <p className="text-sm text-muted-foreground">5 participants • 23:45</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Camera className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon">
                      <PhoneOff className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CommunicationModuleLayout>
    </ProtectedRoute>
  );
}