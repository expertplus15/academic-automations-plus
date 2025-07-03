import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video,
  Upload,
  Play,
  Pause,
  BarChart3,
  Eye,
  Clock,
  Users,
  Download,
  Settings,
  Plus
} from 'lucide-react';
import { useVideoStreams } from '@/hooks/useVideoStreams';
import { AdaptiveVideoPlayer } from './AdaptiveVideoPlayer';

export function StreamingDashboard() {
  const { videoStreams, loading } = useVideoStreams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filteredStreams = videoStreams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedTab === 'all') return matchesSearch;
    if (selectedTab === 'ready') return matchesSearch && stream.status === 'ready';
    if (selectedTab === 'processing') return matchesSearch && stream.status === 'processing';
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Prêt</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Traitement</Badge>;
      case 'failed':
        return <Badge variant="destructive">Erreur</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}min`;
    }
    return `${minutes}min`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    const gb = mb / 1024;
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Streaming Vidéo</h2>
          <p className="text-muted-foreground">Gérez vos contenus vidéo et analysez les performances</p>
        </div>
        
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Téléverser une vidéo
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Video className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vidéos totales</p>
                <p className="text-2xl font-bold">{videoStreams.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Play className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prêtes</p>
                <p className="text-2xl font-bold">
                  {videoStreams.filter(v => v.status === 'ready').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En traitement</p>
                <p className="text-2xl font-bold">
                  {videoStreams.filter(v => v.status === 'processing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vues totales</p>
                <p className="text-2xl font-bold">0</p>
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
                placeholder="Rechercher une vidéo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-auto">
              <TabsList className="grid grid-cols-3 w-auto">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="ready">Prêtes</TabsTrigger>
                <TabsTrigger value="processing">Traitement</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Player vidéo sélectionné */}
      {selectedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{selectedVideo.title}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVideo(null)}
              >
                Fermer
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdaptiveVideoPlayer
              videoStream={selectedVideo}
              onProgressUpdate={(progress) => console.log('Progress:', progress)}
            />
          </CardContent>
        </Card>
      )}

      {/* Liste des vidéos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStreams.map((stream) => (
          <Card key={stream.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{stream.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {stream.description || 'Aucune description'}
                  </p>
                </div>
                {getStatusBadge(stream.status)}
              </div>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(stream.duration_seconds)}
                </span>
                <span>{stream.resolution}</span>
                <span>{formatFileSize(stream.file_size)}</span>
              </div>
            </CardHeader>
            
            {/* Thumbnail */}
            <div className="px-6 pb-4">
              <div 
                className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => stream.status === 'ready' && setSelectedVideo(stream)}
              >
                {stream.thumbnail_url ? (
                  <img 
                    src={stream.thumbnail_url} 
                    alt={stream.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {stream.status === 'ready' ? 'Cliquer pour lire' : 'Vidéo en traitement'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <CardContent className="pt-0">
              <div className="flex gap-2">
                {stream.status === 'ready' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedVideo(stream)}
                      className="flex-1"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Lire
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <BarChart3 className="w-3 h-3" />
                    </Button>
                  </>
                )}
                
                <Button size="sm" variant="outline">
                  <Settings className="w-3 h-3" />
                </Button>
                
                {stream.download_url && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(stream.download_url, '_blank')}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              {/* Chapitres */}
              {stream.chapters && Array.isArray(stream.chapters) && stream.chapters.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    {stream.chapters.length} chapitre(s)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {stream.chapters.slice(0, 3).map((chapter: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {chapter.title}
                      </Badge>
                    ))}
                    {stream.chapters.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{stream.chapters.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStreams.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">Aucune vidéo trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Aucune vidéo ne correspond à votre recherche.' : 'Commencez par téléverser votre première vidéo.'}
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Téléverser une vidéo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}