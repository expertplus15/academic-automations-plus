import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Eye, 
  Save,
  Copy,
  Trash2,
  Layout,
  Type,
  Image,
  Download,
  Upload,
  Brush,
  Grid,
  Sparkles,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TemplateStudio() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("1");
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  // Mock data for templates
  const templates = [
    {
      id: '1',
      name: 'Bulletin Moderne',
      type: 'bulletin',
      description: 'Design épuré avec mise en page moderne',
      lastModified: '2024-01-15T10:30:00Z',
      isActive: true,
      previewUrl: '/previews/bulletin-moderne.png',
      category: 'Officiel'
    },
    {
      id: '2',
      name: 'Relevé Classique',
      type: 'transcript',
      description: 'Format traditionnel pour documents officiels',
      lastModified: '2024-01-14T15:45:00Z',
      isActive: true,
      previewUrl: '/previews/releve-classique.png',
      category: 'Institutionnel'
    },
    {
      id: '3',
      name: 'Attestation Élégante',
      type: 'certificate',
      description: 'Template premium avec ornements',
      lastModified: '2024-01-13T09:20:00Z',
      isActive: false,
      previewUrl: '/previews/attestation-elegante.png',
      category: 'Premium'
    }
  ];

  const documentTypes = [
    { value: 'bulletin', label: 'Bulletin de Notes' },
    { value: 'transcript', label: 'Relevé Officiel' },
    { value: 'certificate', label: 'Attestation' },
    { value: 'report', label: 'Rapport' }
  ];

  const designElements = [
    { id: 'header', name: 'En-tête', icon: Layout, active: true },
    { id: 'logo', name: 'Logo', icon: Image, active: true },
    { id: 'typography', name: 'Typographie', icon: Type, active: false },
    { id: 'colors', name: 'Couleurs', icon: Palette, active: false },
    { id: 'layout', name: 'Mise en page', icon: Grid, active: false }
  ];

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleSaveTemplate = () => {
    console.log('Saving template:', selectedTemplate);
  };

  const handleDuplicateTemplate = () => {
    console.log('Duplicating template:', selectedTemplate);
  };

  const handleDeleteTemplate = () => {
    console.log('Deleting template:', selectedTemplate);
  };

  return (
    <div className="space-y-6">
      {/* Sélection et actions du template */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brush className="h-5 w-5 text-purple-600" />
                Studio de Création
              </CardTitle>
              <CardDescription>
                Éditeur avancé pour personnaliser vos templates de documents
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}>
                <Eye className="w-4 h-4 mr-2" />
                {previewMode === 'edit' ? 'Aperçu' : 'Édition'}
              </Button>
              <Button onClick={handleSaveTemplate}>
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Template actuel</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleDuplicateTemplate}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {currentTemplate && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{currentTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentTemplate.description}</p>
                </div>
                <Badge variant={currentTemplate.isActive ? "default" : "secondary"}>
                  {currentTemplate.category}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interface d'édition */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau d'outils */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outils de Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Éléments de design */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Éléments</h4>
                <div className="space-y-1">
                  {designElements.map((element) => (
                    <Button
                      key={element.id}
                      variant={element.active ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <element.icon className="w-4 h-4 mr-2" />
                      {element.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium text-sm">Actions</h4>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Upload className="w-4 h-4 mr-2" />
                    Importer
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Sparkles className="w-4 h-4 mr-2" />
                    IA Assist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone d'édition/aperçu */}
        <div className="lg:col-span-3">
          <Card className="h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {previewMode === 'edit' ? 'Éditeur' : 'Aperçu'} - {currentTemplate?.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">100%</Badge>
                  <Button size="sm" variant="outline">
                    <Grid className="w-4 h-4 mr-2" />
                    Grille
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-full">
              {previewMode === 'edit' ? (
                <div className="w-full h-full border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/20">
                  <div className="text-center space-y-4">
                    <Layout className="w-12 h-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium">Zone d'Édition</h3>
                      <p className="text-sm text-muted-foreground">
                        Interface d'édition visuelle du template
                      </p>
                    </div>
                    <Button>
                      <Brush className="w-4 h-4 mr-2" />
                      Commencer l'édition
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full border border-border rounded-lg bg-white flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Eye className="w-12 h-12 text-blue-500 mx-auto" />
                    <div>
                      <h3 className="font-medium">Aperçu du Template</h3>
                      <p className="text-sm text-muted-foreground">
                        Prévisualisation en temps réel de votre design
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Propriétés et configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration du Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList>
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="layout">Mise en Page</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom du template</label>
                  <Input value={currentTemplate?.name || ''} placeholder="Nom du template" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de document</label>
                  <Select value={currentTemplate?.type || ''}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Configuration de la mise en page
              </div>
            </TabsContent>

            <TabsContent value="style" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Personnalisation des styles et couleurs
              </div>
            </TabsContent>

            <TabsContent value="variables" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Gestion des variables dynamiques
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions finales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Eye className="w-5 h-5 text-blue-600" />
              Test et Validation
            </CardTitle>
            <CardDescription>
              Tester le template avec des données réelles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/results/validation')}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Tester Template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Save className="w-5 h-5 text-green-600" />
              Prêt pour Production
            </CardTitle>
            <CardDescription>
              Publier et utiliser en production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/results/production')}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Publier
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}