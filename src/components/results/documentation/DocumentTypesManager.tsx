import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  FileText, 
  Settings, 
  Copy,
  Trash2,
  Edit,
  CheckCircle,
  Archive,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function DocumentTypesManager() {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDocType, setNewDocType] = useState({
    name: '',
    description: '',
    category: '',
    template: ''
  });

  // Mock data for document types
  const documentTypes = [
    {
      id: '1',
      name: 'Bulletin Semestriel',
      description: 'Bulletin de notes par semestre avec moyennes et appréciations',
      category: 'bulletin',
      isActive: true,
      templatesCount: 3,
      lastModified: '2024-01-15T10:30:00Z',
      createdBy: 'Admin System'
    },
    {
      id: '2',
      name: 'Relevé de Notes Officiel',
      description: 'Document officiel pour transferts et candidatures',
      category: 'transcript',
      isActive: true,
      templatesCount: 2,
      lastModified: '2024-01-14T15:45:00Z',
      createdBy: 'Prof. Martin'
    },
    {
      id: '3',
      name: 'Attestation de Réussite',
      description: 'Certificat de validation d\'un niveau ou diplôme',
      category: 'certificate',
      isActive: true,
      templatesCount: 1,
      lastModified: '2024-01-13T09:20:00Z',
      createdBy: 'Mme. Dubois'
    },
    {
      id: '4',
      name: 'Bulletin Ancien Format',
      description: 'Format legacy pour compatibilité',
      category: 'bulletin',
      isActive: false,
      templatesCount: 1,
      lastModified: '2023-12-20T14:30:00Z',
      createdBy: 'Archive'
    }
  ];

  const categories = [
    { value: 'bulletin', label: 'Bulletin de Notes', color: 'bg-blue-100 text-blue-700' },
    { value: 'transcript', label: 'Relevé Officiel', color: 'bg-green-100 text-green-700' },
    { value: 'certificate', label: 'Attestation', color: 'bg-purple-100 text-purple-700' },
    { value: 'report', label: 'Rapport', color: 'bg-orange-100 text-orange-700' }
  ];

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || { label: category, color: 'bg-gray-100 text-gray-700' };
  };

  const handleCreateDocType = () => {
    // Logic to create new document type
    console.log('Creating document type:', newDocType);
    setIsCreateDialogOpen(false);
    setNewDocType({ name: '', description: '', category: '', template: '' });
  };

  const handleDuplicateType = (typeId: string) => {
    // Logic to duplicate document type
    console.log('Duplicating type:', typeId);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Types de Documents</h3>
          <p className="text-sm text-muted-foreground">
            Gérez les différents types de documents d'évaluation disponibles
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Type
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Type de Document</DialogTitle>
                <DialogDescription>
                  Définissez les caractéristiques du nouveau type de document
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom du type *</label>
                  <Input
                    value={newDocType.name}
                    onChange={(e) => setNewDocType({...newDocType, name: e.target.value})}
                    placeholder="ex: Bulletin Trimestriel"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={newDocType.description}
                    onChange={(e) => setNewDocType({...newDocType, description: e.target.value})}
                    placeholder="Description du type de document..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Catégorie *</label>
                  <Select value={newDocType.category} onValueChange={(value) => setNewDocType({...newDocType, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateDocType} disabled={!newDocType.name || !newDocType.category}>
                    Créer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/results/personalisation')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Vers Templates
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Types actifs</p>
                <p className="text-2xl font-bold">{documentTypes.filter(t => t.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Templates liés</p>
                <p className="text-2xl font-bold">{documentTypes.reduce((sum, t) => sum + t.templatesCount, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Archive className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Archivés</p>
                <p className="text-2xl font-bold">{documentTypes.filter(t => !t.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Catégories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des types de documents */}
      <Card>
        <CardHeader>
          <CardTitle>Types de Documents Configurés</CardTitle>
          <CardDescription>
            Gérez les types existants et leurs configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentTypes.map((docType) => (
              <Card key={docType.id} className={`border ${docType.isActive ? 'border-border/50' : 'border-dashed border-gray-300 opacity-60'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${docType.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <FileText className={`w-5 h-5 ${docType.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!docType.isActive && 'text-gray-500'}`}>
                            {docType.name}
                          </h3>
                          {!docType.isActive && (
                            <Badge variant="secondary" className="text-xs">
                              Archivé
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${docType.isActive ? 'text-muted-foreground' : 'text-gray-400'}`}>
                          {docType.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={`text-xs ${getCategoryInfo(docType.category).color}`}>
                            {getCategoryInfo(docType.category).label}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {docType.templatesCount} template(s) • Modifié par {docType.createdBy}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDuplicateType(docType.id)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-purple-600" />
              Vers Personnalisation
            </CardTitle>
            <CardDescription>
              Créer et éditer les templates visuels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/results/personalisation')}
              className="w-full"
            >
              <Edit className="w-4 h-4 mr-2" />
              Créer Templates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Workflow Suivant
            </CardTitle>
            <CardDescription>
              Procéder à la validation et production
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline"
                onClick={() => navigate('/results/validation')}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Aller à Validation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}