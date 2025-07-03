import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Plus,
  Video,
  Users,
  Clock,
  Settings,
  Play,
  Square,
  Download,
  ExternalLink
} from 'lucide-react';
import { useVirtualSessions } from '@/hooks/useVirtualSessions';
import { VirtualSessionModal } from './VirtualSessionModal';

export function VirtualClassManager() {
  const { sessions, loading, createSession, updateSession, startSession, endSession } = useVirtualSessions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const startTime = new Date(session.scheduled_start_time);
    
    if (selectedTab === 'upcoming') {
      return matchesSearch && startTime > now && session.status === 'scheduled';
    }
    if (selectedTab === 'live') {
      return matchesSearch && session.status === 'in_progress';
    }
    if (selectedTab === 'completed') {
      return matchesSearch && session.status === 'completed';
    }
    
    return matchesSearch;
  });

  const getStatusBadge = (session: any) => {
    const now = new Date();
    const startTime = new Date(session.scheduled_start_time);
    const endTime = new Date(session.scheduled_end_time);
    
    switch (session.status) {
      case 'in_progress':
        return <Badge className="bg-red-500 text-white">En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-600">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-gray-400 text-gray-600">Annulé</Badge>;
      default:
        if (startTime <= now && now <= endTime) {
          return <Badge className="bg-orange-500 text-white">Prêt à démarrer</Badge>;
        }
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Programmé</Badge>;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'teams':
        return <Video className="w-4 h-4 text-purple-600" />;
      default:
        return <Video className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  const handleStartSession = async (session: any) => {
    try {
      await startSession(session.id);
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
    }
  };

  const handleEndSession = async (session: any) => {
    try {
      await endSession(session.id);
    } catch (error) {
      console.error('Erreur lors de l\'arrêt:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header avec actions */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Classes Virtuelles</h2>
            <p className="text-muted-foreground">Gérez vos sessions de cours en ligne</p>
          </div>
          
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              setSelectedSession(null);
              setShowSessionModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Session
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sessions programmées</p>
                  <p className="text-2xl font-bold">
                    {sessions.filter(s => s.status === 'scheduled').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Video className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En cours</p>
                  <p className="text-2xl font-bold">
                    {sessions.filter(s => s.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Terminées</p>
                  <p className="text-2xl font-bold">
                    {sessions.filter(s => s.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Heures totales</p>
                  <p className="text-2xl font-bold">
                    {Math.round(sessions.reduce((acc, s) => {
                      if (s.actual_start_time && s.actual_end_time) {
                        const duration = new Date(s.actual_end_time).getTime() - new Date(s.actual_start_time).getTime();
                        return acc + (duration / (1000 * 60 * 60));
                      }
                      return acc;
                    }, 0))}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher une session..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
                <TabsList className="grid grid-cols-4 w-auto">
                  <TabsTrigger value="upcoming">À venir</TabsTrigger>
                  <TabsTrigger value="live">En cours</TabsTrigger>
                  <TabsTrigger value="completed">Terminées</TabsTrigger>
                  <TabsTrigger value="all">Toutes</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Liste des sessions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => {
            const now = new Date();
            const startTime = new Date(session.scheduled_start_time);
            const endTime = new Date(session.scheduled_end_time);
            const canStart = startTime <= now && now <= endTime && session.status === 'scheduled';
            const canEnd = session.status === 'in_progress';

            return (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{session.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {session.description || 'Aucune description'}
                      </p>
                    </div>
                    {getStatusBadge(session)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(session.platform)}
                    <span className="text-xs text-muted-foreground capitalize">
                      {session.platform}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      <Users className="w-3 h-3 inline mr-1" />
                      {session.max_participants} max
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Début: {formatDateTime(session.scheduled_start_time)}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Fin: {formatDateTime(session.scheduled_end_time)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {canStart && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        onClick={() => handleStartSession(session)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Démarrer
                      </Button>
                    )}
                    
                    {canEnd && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50 flex-1"
                        onClick={() => handleEndSession(session)}
                      >
                        <Square className="w-3 h-3 mr-1" />
                        Terminer
                      </Button>
                    )}
                    
                    {session.meeting_url && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(session.meeting_url, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedSession(session);
                        setShowSessionModal(true);
                      }}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aucune session trouvée</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Aucune session ne correspond à votre recherche.' : 'Créez votre première session virtuelle.'}
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowSessionModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <VirtualSessionModal
        open={showSessionModal}
        onOpenChange={setShowSessionModal}
        session={selectedSession}
        onSuccess={() => {
          setShowSessionModal(false);
          setSelectedSession(null);
        }}
      />
    </>
  );
}