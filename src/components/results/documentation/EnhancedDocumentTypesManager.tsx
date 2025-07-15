import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText, 
  Settings, 
  Copy,
  Trash2,
  Edit,
  CheckCircle,
  Archive,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTemplates, DocumentTemplate } from '@/hooks/useDocumentTemplates';
import { useDocumentCategories } from '@/hooks/useDocumentCategories';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UniversalTemplatePreview } from '@/components/documents/preview/UniversalTemplatePreview';
import { InteractiveTemplateEditor } from '@/components/documents/preview/InteractiveTemplateEditor';

export function EnhancedDocumentTypesManager() {
  const navigate = useNavigate();
  const { 
    templates, 
    variables, 
    loading, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate, 
    duplicateTemplate 
  } = useDocumentTemplates();
  
  const { 
    categories: dynamicCategories, 
    loading: categoriesLoading 
  } = useDocumentCategories();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newDocType, setNewDocType] = useState({
    name: '',
    code: '',
    description: '',
    template_type: '',
    template_content: {},
    variables: [],
    is_active: true,
    requires_approval: false,
    category_id: null,
    program_id: null,
    level_id: null,
    academic_year_id: null,
    auto_generate: false,
    target_audience: {}
  });

  // Convertir les catégories dynamiques au format attendu
  const categories = dynamicCategories.map(cat => ({
    value: cat.code,
    label: cat.name,
    color: `bg-${cat.color}-100 text-${cat.color}-700`
  }));

  const getCategoryInfo = (templateType: string) => {
    return categories.find(c => c.value === templateType) || { label: templateType, color: 'bg-gray-100 text-gray-700' };
  };

  const handleViewTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsViewDialogOpen(true);
  };

  const handleEditTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setIsEditDialogOpen(true);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.template_type === selectedCategory;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && template.is_active) ||
                         (statusFilter === 'inactive' && !template.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateDocType = async () => {
    try {
      await createTemplate({
        ...newDocType,
        code: newDocType.code || `${newDocType.template_type}_${Date.now()}`
      });
      setIsCreateDialogOpen(false);
      setNewDocType({
        name: '',
        code: '',
        description: '',
        template_type: '',
        template_content: {},
        variables: [],
        is_active: true,
        requires_approval: false,
        category_id: null,
        program_id: null,
        level_id: null,
        academic_year_id: null,
        auto_generate: false,
        target_audience: {}
      });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleDuplicateType = async (typeId: string) => {
    try {
      await duplicateTemplate(typeId);
    } catch (error) {
      console.error('Error duplicating template:', error);
    }
  };

  const handleToggleStatus = async (template: DocumentTemplate) => {
    try {
      await updateTemplate(template.id, { is_active: !template.is_active });
    } catch (error) {
      console.error('Error updating template status:', error);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
      try {
        await deleteTemplate(templateId);
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions et filtres */}
      <div className="flex flex-col gap-4">
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
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Créer un Nouveau Type de Document</DialogTitle>
                  <DialogDescription>
                    Définissez les caractéristiques du nouveau type de document
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nom du type *</label>
                      <Input
                        value={newDocType.name}
                        onChange={(e) => setNewDocType({...newDocType, name: e.target.value})}
                        placeholder="ex: Bulletin Trimestriel"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Code *</label>
                      <Input
                        value={newDocType.code}
                        onChange={(e) => setNewDocType({...newDocType, code: e.target.value})}
                        placeholder="ex: BULL_TRIM"
                      />
                    </div>
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
                    <Select 
                      value={newDocType.template_type} 
                      onValueChange={(value) => setNewDocType({...newDocType, template_type: value})}
                    >
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

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newDocType.requires_approval}
                        onChange={(e) => setNewDocType({...newDocType, requires_approval: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Nécessite une approbation</span>
                    </label>
                    
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newDocType.auto_generate}
                        onChange={(e) => setNewDocType({...newDocType, auto_generate: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm">Génération automatique</span>
                    </label>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleCreateDocType} 
                      disabled={!newDocType.name || !newDocType.template_type}
                    >
                      Créer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate('/results/personalisation')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Vers Templates
            </Button>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher un type de document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
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
                <p className="text-2xl font-bold">{templates.filter(t => t.is_active).length}</p>
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
                <p className="text-sm text-muted-foreground">Avec approbation</p>
                <p className="text-2xl font-bold">{templates.filter(t => t.requires_approval).length}</p>
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
                <p className="text-sm text-muted-foreground">Auto-génération</p>
                <p className="text-2xl font-bold">{templates.filter(t => t.auto_generate).length}</p>
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
                <p className="text-sm text-muted-foreground">Variables disponibles</p>
                <p className="text-2xl font-bold">{variables.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des templates */}
      <Card>
        <CardHeader>
          <CardTitle>Types de Documents Configurés ({filteredTemplates.length})</CardTitle>
          <CardDescription>
            Gérez les types existants et leurs configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun template trouvé
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <Card key={template.id} className={`border ${template.is_active ? 'border-border/50' : 'border-dashed border-gray-300 opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${template.is_active ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          <FileText className={`w-5 h-5 ${template.is_active ? 'text-blue-600' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium ${!template.is_active && 'text-gray-500'}`}>
                              {template.name}
                            </h3>
                            {!template.is_active && (
                              <Badge variant="secondary" className="text-xs">
                                Inactif
                              </Badge>
                            )}
                            {template.requires_approval && (
                              <Badge variant="outline" className="text-xs">
                                Approbation requise
                              </Badge>
                            )}
                            {template.auto_generate && (
                              <Badge className="text-xs bg-green-100 text-green-700">
                                Auto-génération
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${template.is_active ? 'text-muted-foreground' : 'text-gray-400'}`}>
                            {template.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge className={`text-xs ${getCategoryInfo(template.template_type).color}`}>
                              {getCategoryInfo(template.template_type).label}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Code: {template.code}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewTemplate(template)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDuplicateType(template.id)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleToggleStatus(template)}>
                              {template.is_active ? 'Désactiver' : 'Activer'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(template.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-purple-600" />
              Personnalisation Avancée
            </CardTitle>
            <CardDescription>
              Créer et éditer les templates visuels avec l'éditeur avancé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/results/personalisation')}
              className="w-full"
            >
              <Edit className="w-4 h-4 mr-2" />
              Éditeur de Templates
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
              Procéder à la validation et production des documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              onClick={() => navigate('/results/validation')}
              className="w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aller à la Validation
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Dialogue de visualisation avec aperçu complet */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Prévisualisation complète avec données de test
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <UniversalTemplatePreview
              template={selectedTemplate}
              onGeneratePDF={() => {
                // TODO: Intégrer avec le service de génération PDF
                console.log('Génération PDF pour template:', selectedTemplate.id);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialogue d'édition avec éditeur interactif */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[1400px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Édition Avancée du Template</DialogTitle>
            <DialogDescription>
              Éditeur interactif avec aperçu en temps réel
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <InteractiveTemplateEditor
              template={selectedTemplate}
              onSave={async (updatedTemplate) => {
                try {
                  await updateTemplate(updatedTemplate.id, updatedTemplate);
                  setIsEditDialogOpen(false);
                } catch (error) {
                  console.error('Error updating template:', error);
                }
              }}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}