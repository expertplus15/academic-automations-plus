import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload,
  FileText,
  Download,
  Eye,
  Trash2,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  Settings,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SCORMPackage {
  id: string;
  title: string;
  identifier: string;
  version: string;
  manifest_url: string;
  launch_url: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
  is_active: boolean;
  course_id?: string;
}

export function SCORMManager() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<SCORMPackage[]>([
    // Mock data
    {
      id: '1',
      title: 'Introduction JavaScript SCORM',
      identifier: 'js-intro-v1',
      version: '1.2',
      manifest_url: '/scorm/js-intro/imsmanifest.xml',
      launch_url: '/scorm/js-intro/index.html',
      file_size: 15728640,
      uploaded_at: '2024-01-15T10:30:00Z',
      uploaded_by: 'admin@example.com',
      is_active: true,
      course_id: 'course-1'
    },
    {
      id: '2',
      title: 'Certification React SCORM',
      identifier: 'react-cert-v2',
      version: '2004',
      manifest_url: '/scorm/react-cert/imsmanifest.xml',
      launch_url: '/scorm/react-cert/story.html',
      file_size: 28456320,
      uploaded_at: '2024-01-20T14:15:00Z',
      uploaded_by: 'teacher@example.com',
      is_active: true
    }
  ]);
  
  const [selectedPackage, setSelectedPackage] = useState<SCORMPackage | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [newPackage, setNewPackage] = useState({
    title: '',
    description: '',
    course_id: '',
    file: null as File | null
  });

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusBadge = (pkg: SCORMPackage) => {
    if (!pkg.is_active) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactif</Badge>;
    }
    return <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>;
  };

  const getVersionBadge = (version: string) => {
    const color = version === '2004' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-purple-100 text-purple-700 border-purple-200';
    return <Badge variant="outline" className={color}>SCORM {version}</Badge>;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier ZIP SCORM",
          variant: "destructive",
        });
        return;
      }
      setNewPackage(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!newPackage.file || !newPackage.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulation d'upload avec progression
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadDialog(false);
          setNewPackage({ title: '', description: '', course_id: '', file: null });
          
          toast({
            title: "Succès",
            description: "Package SCORM uploadé avec succès",
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleDelete = (id: string) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
    toast({
      title: "Succès",
      description: "Package SCORM supprimé",
    });
  };

  const handlePreview = (pkg: SCORMPackage) => {
    // Ouvrir le package SCORM dans un nouvel onglet
    window.open(pkg.launch_url, '_blank');
  };

  const analytics = {
    totalPackages: packages.length,
    activePackages: packages.filter(p => p.is_active).length,
    totalSize: packages.reduce((acc, p) => acc + p.file_size, 0),
    avgCompletionRate: 78.5,
    totalLaunches: 2456
  };

  return (
    <div className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestionnaire SCORM</h2>
          <p className="text-muted-foreground">Gérez vos packages SCORM et xAPI</p>
        </div>
        
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Uploader SCORM
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Uploader un package SCORM</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre du package *</Label>
                <Input
                  id="title"
                  value={newPackage.title}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Introduction JavaScript..."
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newPackage.description}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du contenu..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="course">Cours associé</Label>
                <Select value={newPackage.course_id} onValueChange={(value) => setNewPackage(prev => ({ ...prev, course_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un cours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course-1">JavaScript Fundamentals</SelectItem>
                    <SelectItem value="course-2">React Development</SelectItem>
                    <SelectItem value="course-3">Node.js Backend</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="file">Fichier SCORM (ZIP) *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
                {newPackage.file && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {newPackage.file.name} ({formatFileSize(newPackage.file.size)})
                  </p>
                )}
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Upload en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading || !newPackage.file || !newPackage.title}
                  className="flex-1"
                >
                  {isUploading ? 'Upload...' : 'Uploader'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowUploadDialog(false)}
                  disabled={isUploading}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Packages</p>
                <p className="text-2xl font-bold">{analytics.totalPackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actifs</p>
                <p className="text-2xl font-bold">{analytics.activePackages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taille totale</p>
                <p className="text-2xl font-bold">{formatFileSize(analytics.totalSize)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Taux completion</p>
                <p className="text-2xl font-bold">{analytics.avgCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Play className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lancements</p>
                <p className="text-2xl font-bold">{analytics.totalLaunches}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des packages */}
      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="packages">
            <Package className="w-4 h-4 mr-2" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{pkg.title}</h3>
                      <p className="text-sm text-muted-foreground">{pkg.identifier}</p>
                    </div>
                    {getStatusBadge(pkg)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getVersionBadge(pkg.version)}
                    <Badge variant="outline" className="text-xs">
                      {formatFileSize(pkg.file_size)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Uploadé le {new Date(pkg.uploaded_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <FileText className="w-3 h-3" />
                      <span>Par {pkg.uploaded_by}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePreview(pkg)}
                      className="flex-1"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Lancer
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(pkg.manifest_url, '_blank')}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(pkg.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {packages.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Aucun package SCORM</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par uploader votre premier package SCORM.
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowUploadDialog(true)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Uploader un package
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics SCORM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Analytics détaillées des packages SCORM à venir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Configuration SCORM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Paramètres de configuration SCORM/xAPI à venir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}