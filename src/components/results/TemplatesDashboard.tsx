import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Plus, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Download,
  Upload,
  Settings,
  Layout
} from 'lucide-react';

export function TemplatesDashboard() {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Bulletin Standard L1',
      type: 'bulletin',
      category: 'academic',
      lastModified: '2024-01-15',
      author: 'Admin',
      usageCount: 245,
      isDefault: true,
      status: 'active'
    },
    {
      id: 2,
      name: 'Relevé de Notes Master',
      type: 'transcript',
      category: 'official',
      lastModified: '2024-01-12',
      author: 'Secrétariat',
      usageCount: 87,
      isDefault: false,
      status: 'active'
    },
    {
      id: 3,
      name: 'Bulletin Personnalisé Arts',
      type: 'bulletin',
      category: 'specialized',
      lastModified: '2024-01-10',
      author: 'Dept. Arts',
      usageCount: 23,
      isDefault: false,
      status: 'draft'
    },
    {
      id: 4,
      name: 'Attestation de Réussite',
      type: 'certificate',
      category: 'official',
      lastModified: '2024-01-08',
      author: 'Admin',
      usageCount: 156,
      isDefault: false,
      status: 'active'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templateStats = {
    total: templates.length,
    active: templates.filter(t => t.status === 'active').length,
    drafts: templates.filter(t => t.status === 'draft').length,
    totalUsage: templates.reduce((sum, t) => sum + t.usageCount, 0)
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bulletin':
        return <FileText className="w-4 h-4" />;
      case 'transcript':
        return <Layout className="w-4 h-4" />;
      case 'certificate':
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bulletin':
        return 'Bulletin';
      case 'transcript':
        return 'Relevé';
      case 'certificate':
        return 'Attestation';
      default:
        return 'Document';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'academic':
        return 'Académique';
      case 'official':
        return 'Officiel';
      case 'specialized':
        return 'Spécialisé';
      default:
        return 'Standard';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templateStats.total}</p>
                <p className="text-sm text-muted-foreground">Templates totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Layout className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templateStats.active}</p>
                <p className="text-sm text-muted-foreground">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Edit className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templateStats.drafts}</p>
                <p className="text-sm text-muted-foreground">Brouillons</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{templateStats.totalUsage}</p>
                <p className="text-sm text-muted-foreground">Utilisations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="library" className="space-y-4">
        <TabsList>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="settings">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="space-y-4">
          {/* Contrôles de recherche et filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 flex-1">
                  <Input
                    placeholder="Rechercher un template..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                  <select
                    className="px-3 py-2 border rounded-md"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">Toutes catégories</option>
                    <option value="academic">Académique</option>
                    <option value="official">Officiel</option>
                    <option value="specialized">Spécialisé</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des templates */}
          <div className="grid gap-4">
            {filteredTemplates.map(template => (
              <Card key={template.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(template.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          {template.isDefault && (
                            <Badge variant="secondary" className="text-xs">Par défaut</Badge>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{getTypeLabel(template.type)}</span>
                          <span>{getCategoryLabel(template.category)}</span>
                          <span>Modifié le {template.lastModified}</span>
                          <span>par {template.author}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant={getStatusColor(template.status) as any}>
                          {template.status === 'active' ? 'Actif' : 'Brouillon'}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {template.usageCount} utilisations
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Éditeur de templates</h3>
            <div className="flex gap-2">
              <Button variant="outline">Aperçu</Button>
              <Button>Sauvegarder</Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                <Layout className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Éditeur de templates</h3>
                <p className="mb-4">
                  Créez et personnalisez vos templates de bulletins et relevés
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Commencer un nouveau template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-semibold">Configuration des templates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Paramètres généraux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Template par défaut</label>
                  <p className="text-sm text-muted-foreground">Bulletin Standard L1</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Format de sortie</label>
                  <p className="text-sm text-muted-foreground">PDF haute qualité</p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Droits d'accès</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Création de templates</label>
                  <p className="text-sm text-muted-foreground">Administrateurs et enseignants</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Modification</label>
                  <p className="text-sm text-muted-foreground">Créateur et administrateurs</p>
                </div>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Gérer les droits
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}