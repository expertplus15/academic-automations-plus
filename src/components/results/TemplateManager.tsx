import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Palette, 
  Eye, 
  Copy, 
  Trash2, 
  Plus, 
  Settings,
  Download,
  Upload,
  Star,
  Edit,
  Save
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  type: 'bulletin' | 'transcript' | 'certificate' | 'report';
  category: 'official' | 'internal' | 'custom';
  format: 'pdf' | 'html' | 'docx';
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
  version: string;
  preview: string;
  settings: {
    layout: 'portrait' | 'landscape';
    size: 'A4' | 'A3' | 'letter';
    margins: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
    };
    fonts: {
      primary: string;
      secondary: string;
      size: {
        title: number;
        heading: number;
        body: number;
        caption: number;
      };
    };
    branding: {
      logo: boolean;
      institutionName: boolean;
      address: boolean;
      contact: boolean;
    };
    elements: {
      header: boolean;
      footer: boolean;
      watermark: boolean;
      qrCode: boolean;
      signature: boolean;
    };
  };
}

export function TemplateManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const [templates] = useState<Template[]>([
    {
      id: 'tpl-001',
      name: 'Bulletin Standard',
      description: 'Bulletin de notes standard avec moyennes et appréciations',
      type: 'bulletin',
      category: 'official',
      format: 'pdf',
      isDefault: true,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      modifiedAt: '2024-01-15T10:30:00Z',
      version: '2.1',
      preview: '/previews/bulletin-standard.png',
      settings: {
        layout: 'portrait',
        size: 'A4',
        margins: { top: 20, bottom: 20, left: 15, right: 15 },
        colors: {
          primary: '#1e40af',
          secondary: '#64748b',
          accent: '#0ea5e9',
          text: '#1f2937'
        },
        fonts: {
          primary: 'Inter',
          secondary: 'Arial',
          size: { title: 24, heading: 18, body: 12, caption: 10 }
        },
        branding: {
          logo: true,
          institutionName: true,
          address: true,
          contact: false
        },
        elements: {
          header: true,
          footer: true,
          watermark: false,
          qrCode: true,
          signature: true
        }
      }
    },
    {
      id: 'tpl-002',
      name: 'Relevé Officiel',
      description: 'Relevé de notes officiel avec sécurisation',
      type: 'transcript',
      category: 'official',
      format: 'pdf',
      isDefault: false,
      isActive: true,
      createdAt: '2024-01-05T00:00:00Z',
      modifiedAt: '2024-01-10T14:20:00Z',
      version: '1.3',
      preview: '/previews/releve-officiel.png',
      settings: {
        layout: 'portrait',
        size: 'A4',
        margins: { top: 25, bottom: 25, left: 20, right: 20 },
        colors: {
          primary: '#7c3aed',
          secondary: '#6b7280',
          accent: '#8b5cf6',
          text: '#111827'
        },
        fonts: {
          primary: 'Times New Roman',
          secondary: 'Arial',
          size: { title: 22, heading: 16, body: 11, caption: 9 }
        },
        branding: {
          logo: true,
          institutionName: true,
          address: true,
          contact: true
        },
        elements: {
          header: true,
          footer: true,
          watermark: true,
          qrCode: true,
          signature: true
        }
      }
    },
    {
      id: 'tpl-003',
      name: 'Certificat Simple',
      description: 'Modèle minimaliste pour certificats internes',
      type: 'certificate',
      category: 'internal',
      format: 'pdf',
      isDefault: false,
      isActive: true,
      createdAt: '2024-01-08T00:00:00Z',
      modifiedAt: '2024-01-12T16:45:00Z',
      version: '1.0',
      preview: '/previews/certificat-simple.png',
      settings: {
        layout: 'landscape',
        size: 'A4',
        margins: { top: 30, bottom: 30, left: 25, right: 25 },
        colors: {
          primary: '#059669',
          secondary: '#64748b',
          accent: '#10b981',
          text: '#374151'
        },
        fonts: {
          primary: 'Georgia',
          secondary: 'Arial',
          size: { title: 28, heading: 20, body: 14, caption: 12 }
        },
        branding: {
          logo: true,
          institutionName: true,
          address: false,
          contact: false
        },
        elements: {
          header: false,
          footer: false,
          watermark: false,
          qrCode: false,
          signature: true
        }
      }
    }
  ]);

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      bulletin: { label: 'Bulletin', className: 'bg-blue-100 text-blue-800' },
      transcript: { label: 'Relevé', className: 'bg-purple-100 text-purple-800' },
      certificate: { label: 'Certificat', className: 'bg-green-100 text-green-800' },
      report: { label: 'Rapport', className: 'bg-orange-100 text-orange-800' }
    };
    
    const variant = variants[type] || variants.bulletin;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      official: { label: 'Officiel', className: 'bg-red-100 text-red-800' },
      internal: { label: 'Interne', className: 'bg-gray-100 text-gray-800' },
      custom: { label: 'Personnalisé', className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const variant = variants[category] || variants.internal;
    return <Badge variant="outline" className={variant.className}>{variant.label}</Badge>;
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Parcourir</TabsTrigger>
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="library">Bibliothèque</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Modèles Disponibles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="space-y-2">
                  <Label>Recherche</Label>
                  <Input
                    placeholder="Nom du modèle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="bulletin">Bulletin</SelectItem>
                      <SelectItem value="transcript">Relevé</SelectItem>
                      <SelectItem value="certificate">Certificat</SelectItem>
                      <SelectItem value="report">Rapport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="official">Officiel</SelectItem>
                      <SelectItem value="internal">Interne</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-2">
                        <FileText className="h-5 w-5 mt-0.5 text-primary" />
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                      {template.isDefault && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {getTypeBadge(template.type)}
                      {getCategoryBadge(template.category)}
                      <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>v{template.version}</span>
                      <span>{new Date(template.modifiedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Aperçu
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Éditeur de Modèles
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Aperçu
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTemplateData ? (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Template Editor */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Nom du modèle</Label>
                      <Input defaultValue={selectedTemplateData.name} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea defaultValue={selectedTemplateData.description} rows={3} />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Mise en page</Label>
                        <Select defaultValue={selectedTemplateData.settings.layout}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portrait">Portrait</SelectItem>
                            <SelectItem value="landscape">Paysage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Taille</Label>
                        <Select defaultValue={selectedTemplateData.settings.size}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A4">A4</SelectItem>
                            <SelectItem value="A3">A3</SelectItem>
                            <SelectItem value="letter">Letter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Couleur principale</Label>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded border"
                          style={{ backgroundColor: selectedTemplateData.settings.colors.primary }}
                        />
                        <Input 
                          type="color" 
                          defaultValue={selectedTemplateData.settings.colors.primary}
                          className="w-20"
                        />
                        <Input 
                          defaultValue={selectedTemplateData.settings.colors.primary}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Live Preview */}
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="aspect-[8.5/11] bg-white rounded shadow-sm border flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2" />
                        <p>Aperçu du modèle</p>
                        <p className="text-sm">{selectedTemplateData.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Sélectionnez un modèle</h3>
                  <p className="text-muted-foreground">
                    Choisissez un modèle à modifier dans l'onglet "Parcourir"
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Paramètres des Modèles
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTemplateData ? (
                <div className="space-y-6">
                  {/* Branding */}
                  <div>
                    <h3 className="font-semibold mb-3">Éléments de branding</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(selectedTemplateData.settings.branding).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="capitalize">
                            {key === 'institutionName' ? 'Nom de l\'institution' : 
                             key === 'address' ? 'Adresse' :
                             key === 'contact' ? 'Contact' : 'Logo'}
                          </Label>
                          <input 
                            type="checkbox" 
                            defaultChecked={value}
                            className="h-4 w-4"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Elements */}
                  <div>
                    <h3 className="font-semibold mb-3">Éléments du document</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(selectedTemplateData.settings.elements).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label className="capitalize">
                            {key === 'header' ? 'En-tête' :
                             key === 'footer' ? 'Pied de page' :
                             key === 'watermark' ? 'Filigrane' :
                             key === 'qrCode' ? 'QR Code' : 'Signature'}
                          </Label>
                          <input 
                            type="checkbox" 
                            defaultChecked={value}
                            className="h-4 w-4"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Typography */}
                  <div>
                    <h3 className="font-semibold mb-3">Typographie</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Police principale</Label>
                        <Select defaultValue={selectedTemplateData.settings.fonts.primary}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Police secondaire</Label>
                        <Select defaultValue={selectedTemplateData.settings.fonts.secondary}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Helvetica">Helvetica</SelectItem>
                            <SelectItem value="Calibri">Calibri</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Sélectionnez un modèle pour configurer ses paramètres
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Bibliothèque de Modèles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Importer un modèle</h3>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez un fichier de modèle ou cliquez pour sélectionner
                    </p>
                    <Button variant="outline">
                      Sélectionner un fichier
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Exporter des modèles</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter le modèle sélectionné
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter tous les modèles
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}