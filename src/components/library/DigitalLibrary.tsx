import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Monitor, Download, ExternalLink, Search, FileText, Video, Headphones, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DigitalResource {
  id: string;
  title: string;
  author?: string;
  description?: string;
  resource_type: string;
  format: string;
  file_size?: number;
  duration?: number;
  language: string;
  access_level: string;
  download_url?: string;
  streaming_url?: string;
  external_url?: string;
  thumbnail_url?: string;
  tags: string[];
  created_at: string;
  access_count: number;
}

export function DigitalLibrary() {
  const [resources, setResources] = useState<DigitalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<DigitalResource | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDigitalResources();
  }, []);

  const fetchDigitalResources = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-digital-resources', {
        body: {
          search: searchTerm || undefined,
          type: selectedType !== "all" ? selectedType : undefined,
          format: selectedFormat !== "all" ? selectedFormat : undefined,
        }
      });

      if (error) throw error;
      setResources(data?.resources || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les ressources numériques.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchDigitalResources();
  };

  const handleAccess = async (resource: DigitalResource) => {
    try {
      // Enregistrer l'accès
      await supabase.functions.invoke('track-resource-access', {
        body: { resource_id: resource.id }
      });

      if (resource.external_url) {
        window.open(resource.external_url, '_blank');
      } else if (resource.streaming_url) {
        setSelectedResource(resource);
        setViewerOpen(true);
      } else if (resource.download_url) {
        window.open(resource.download_url, '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès à la ressource:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à cette ressource.",
        variant: "destructive",
      });
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'ebook':
        return <FileText className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Headphones className="w-5 h-5" />;
      case 'website':
        return <Globe className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'ebook':
        return 'E-book';
      case 'video':
        return 'Vidéo';
      case 'audio':
        return 'Audio';
      case 'website':
        return 'Site web';
      case 'document':
        return 'Document';
      default:
        return type;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Bibliothèque numérique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Rechercher une ressource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="ebook">E-books</SelectItem>
                <SelectItem value="video">Vidéos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="website">Sites web</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les formats</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="epub">EPUB</SelectItem>
                <SelectItem value="mp4">MP4</SelectItem>
                <SelectItem value="mp3">MP3</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  {getResourceIcon(resource.resource_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                    {resource.title}
                  </h3>
                  {resource.author && (
                    <p className="text-xs text-muted-foreground">
                      {resource.author}
                    </p>
                  )}
                </div>
              </div>

              {resource.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {resource.description}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline">
                  {getResourceTypeLabel(resource.resource_type)}
                </Badge>
                <Badge variant="secondary">
                  {resource.format.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                {resource.file_size && (
                  <span>{formatFileSize(resource.file_size)}</span>
                )}
                {resource.duration && (
                  <span>{formatDuration(resource.duration)}</span>
                )}
                <span>{resource.access_count} accès</span>
              </div>

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleAccess(resource)}
                >
                  {resource.streaming_url ? (
                    <>
                      <Monitor className="w-3 h-3 mr-1" />
                      Lire
                    </>
                  ) : resource.download_url ? (
                    <>
                      <Download className="w-3 h-3 mr-1" />
                      Télécharger
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ouvrir
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {resources.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Monitor className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune ressource trouvée</h3>
            <p className="text-muted-foreground">
              Aucune ressource numérique ne correspond à vos critères.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lecteur/Visionneuse intégré */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedResource?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            {selectedResource?.resource_type === 'video' ? (
              <video 
                src={selectedResource.streaming_url} 
                controls 
                className="w-full h-full rounded-lg"
              />
            ) : selectedResource?.resource_type === 'audio' ? (
              <audio 
                src={selectedResource.streaming_url} 
                controls 
                className="w-full"
              />
            ) : (
              <iframe 
                src={selectedResource?.streaming_url} 
                className="w-full h-full rounded-lg"
                title={selectedResource?.title}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}