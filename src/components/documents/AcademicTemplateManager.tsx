import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { usePrograms } from '@/hooks/usePrograms';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, FileText, Settings, BookOpen, Users, Calculator } from 'lucide-react';

interface AcademicVariable {
  id: string;
  name: string;
  label: string;
  variable_type: string;
  category: string;
  description: string;
}

interface AcademicTemplate {
  id: string;
  name: string;
  code: string;
  description?: string;
  template_type: string;
  html_template: string;
  variables: string[];
  program_id?: string;
  level_id?: string;
  academic_year_id?: string;
  target_audience: string[];
  auto_generate: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function AcademicTemplateManager() {
  const { programs } = usePrograms();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<AcademicTemplate[]>([]);
  const [availableVariables, setAvailableVariables] = useState<AcademicVariable[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<AcademicTemplate | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    template_type: '',
    html_template: '',
    variables: [] as string[],
    program_id: '',
    target_audience: [] as string[],
    auto_generate: false
  });

  // Mock data for variables by category
  const variableCategories = [
    { id: 'student', label: 'Données étudiant', icon: Users },
    { id: 'program', label: 'Programme d\'étude', icon: BookOpen },
    { id: 'grades', label: 'Notes et résultats', icon: Calculator },
    { id: 'academic', label: 'Données académiques', icon: FileText },
    { id: 'institution', label: 'Établissement', icon: Settings },
    { id: 'document', label: 'Document', icon: FileText }
  ];

  const mockVariables: AcademicVariable[] = [
    { id: '1', name: 'student.full_name', label: 'Nom complet', variable_type: 'text', category: 'student', description: 'Nom complet de l\'étudiant' },
    { id: '2', name: 'student.student_number', label: 'Numéro étudiant', variable_type: 'text', category: 'student', description: 'Numéro d\'identification étudiant' },
    { id: '3', name: 'program.name', label: 'Nom du programme', variable_type: 'text', category: 'program', description: 'Nom du programme d\'étude' },
    { id: '4', name: 'grades.overall_average', label: 'Moyenne générale', variable_type: 'calculated', category: 'grades', description: 'Moyenne générale des notes' },
    { id: '5', name: 'academic_year.name', label: 'Année académique', variable_type: 'text', category: 'academic', description: 'Nom de l\'année académique' },
    { id: '6', name: 'institution.name', label: 'Nom établissement', variable_type: 'text', category: 'institution', description: 'Nom de l\'établissement' },
    { id: '7', name: 'document.issue_date', label: 'Date d\'émission', variable_type: 'date', category: 'document', description: 'Date d\'émission du document' }
  ];

  const documentTypes = [
    { value: 'certificate', label: 'Certificat de scolarité' },
    { value: 'transcript', label: 'Relevé de notes' },
    { value: 'attestation', label: 'Attestation' },
    { value: 'diploma', label: 'Diplôme' }
  ];

  const templateByProgram = [
    { program: 'Informatique de Gestion', templates: ['Certificat IG', 'Relevé IG'] },
    { program: 'Génie Logiciel', templates: ['Certificat GL', 'Relevé GL'] },
    { program: 'Génie Civil', templates: ['Certificat GC', 'Relevé GC'] }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      template_type: '',
      html_template: '',
      variables: [],
      program_id: '',
      target_audience: [],
      auto_generate: false
    });
  };

  const handleVariableToggle = (variableName: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.includes(variableName)
        ? prev.variables.filter(v => v !== variableName)
        : [...prev.variables, variableName]
    }));
  };

  const generateDefaultTemplate = (type: string, variables: string[]) => {
    const templates = {
      certificate: `
        <div class="document-header">
          <h1>{{institution.name}}</h1>
          <h2>CERTIFICAT DE SCOLARITÉ</h2>
        </div>
        <div class="document-body">
          <p>L'administration certifie que :</p>
          <p><strong>{{student.full_name}}</strong></p>
          <p>Numéro d'étudiant : {{student.student_number}}</p>
          <p>Est régulièrement inscrit(e) en {{program.name}} pour l'année académique {{academic_year.name}}.</p>
          <p>Ce certificat est délivré pour servir et valoir ce que de droit.</p>
        </div>
        <div class="document-footer">
          <p>Fait le {{document.issue_date}}</p>
          <p>Document N° {{document.number}}</p>
        </div>
      `,
      transcript: `
        <div class="document-header">
          <h1>{{institution.name}}</h1>
          <h2>RELEVÉ DE NOTES</h2>
        </div>
        <div class="document-body">
          <p><strong>Étudiant :</strong> {{student.full_name}}</p>
          <p><strong>Programme :</strong> {{program.name}}</p>
          <p><strong>Année académique :</strong> {{academic_year.name}}</p>
          <p><strong>Moyenne générale :</strong> {{grades.overall_average}}/20</p>
          <p><strong>Crédits ECTS acquis :</strong> {{ects.earned}}</p>
        </div>
        <div class="document-footer">
          <p>Document N° {{document.number}}</p>
          <p>Émis le {{document.issue_date}}</p>
        </div>
      `
    };
    return templates[type as keyof typeof templates] || '';
  };

  const filteredVariables = selectedCategory === 'all' 
    ? mockVariables 
    : mockVariables.filter(v => v.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Modèles Académiques</h2>
          <p className="text-muted-foreground">Modèles synchronisés avec les données académiques</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Modèle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un modèle académique</DialogTitle>
              <DialogDescription>
                Créez un modèle connecté aux données académiques réelles
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Informations de base</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
                <TabsTrigger value="template">Modèle HTML</TabsTrigger>
                <TabsTrigger value="preview">Aperçu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nom du modèle</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Certificat de scolarité - IG"
                    />
                  </div>
                  <div>
                    <Label htmlFor="code">Code</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="CERT_IG"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du modèle..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type de document</Label>
                    <Select value={formData.template_type} onValueChange={(value) => setFormData({ ...formData, template_type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
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
                  
                  <div>
                    <Label htmlFor="program">Programme spécifique (optionnel)</Label>
                    <Select value={formData.program_id} onValueChange={(value) => setFormData({ ...formData, program_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les programmes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tous les programmes</SelectItem>
                        {programs.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Public cible</Label>
                  <div className="flex flex-wrap gap-2">
                    {['students', 'administration', 'external'].map((audience) => (
                      <div key={audience} className="flex items-center space-x-2">
                        <Checkbox
                          id={audience}
                          checked={formData.target_audience.includes(audience)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData(prev => ({ ...prev, target_audience: [...prev.target_audience, audience] }));
                            } else {
                              setFormData(prev => ({ ...prev, target_audience: prev.target_audience.filter(a => a !== audience) }));
                            }
                          }}
                        />
                        <Label htmlFor={audience} className="text-sm capitalize">
                          {audience}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="variables" className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-1/3">
                    <Label>Catégories</Label>
                    <div className="space-y-2 mt-2">
                      <Button
                        variant={selectedCategory === 'all' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory('all')}
                      >
                        Toutes les variables
                      </Button>
                      {variableCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'default' : 'outline'}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setSelectedCategory(category.id)}
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {category.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <Label>Variables disponibles</Label>
                    <div className="border rounded-md p-4 max-h-60 overflow-y-auto mt-2">
                      {filteredVariables.map((variable) => (
                        <div key={variable.id} className="flex items-start space-x-2 py-2 border-b last:border-b-0">
                          <Checkbox
                            id={variable.name}
                            checked={formData.variables.includes(variable.name)}
                            onCheckedChange={() => handleVariableToggle(variable.name)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={variable.name} className="font-medium text-sm">
                              {variable.label}
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {`{{${variable.name}}}`} - {variable.description}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {variable.variable_type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="template" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="html-template">Modèle HTML</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const template = generateDefaultTemplate(formData.template_type, formData.variables);
                      setFormData({ ...formData, html_template: template });
                    }}
                    disabled={!formData.template_type}
                  >
                    Générer modèle par défaut
                  </Button>
                </div>
                <Textarea
                  id="html-template"
                  value={formData.html_template}
                  onChange={(e) => setFormData({ ...formData, html_template: e.target.value })}
                  placeholder="<div>Votre modèle HTML avec les variables {{variable.name}}</div>"
                  className="min-h-80 font-mono text-sm"
                />
                <div className="text-sm text-muted-foreground">
                  <p>Variables sélectionnées :</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.variables.map((variable) => (
                      <Badge key={variable} variant="secondary" className="text-xs">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                <div className="border rounded-md p-4 bg-background">
                  <h3 className="font-medium mb-4">Aperçu du document</h3>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: formData.html_template
                        .replace(/\{\{student\.full_name\}\}/g, 'Jean Dupont')
                        .replace(/\{\{student\.student_number\}\}/g, 'ETU2024001')
                        .replace(/\{\{program\.name\}\}/g, 'Informatique de Gestion')
                        .replace(/\{\{academic_year\.name\}\}/g, '2024-2025')
                        .replace(/\{\{institution\.name\}\}/g, 'École Supérieure')
                        .replace(/\{\{document\.issue_date\}\}/g, new Date().toLocaleDateString('fr-FR'))
                        .replace(/\{\{document\.number\}\}/g, 'DOC20240001')
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Modèle créé",
                  description: "Le modèle académique a été créé avec succès."
                });
                setIsCreateDialogOpen(false);
                resetForm();
              }}>
                Créer le modèle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates by Program */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templateByProgram.map((programGroup) => (
          <Card key={programGroup.program} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-primary" />
                {programGroup.program}
              </CardTitle>
              <CardDescription>
                {programGroup.templates.length} modèles disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {programGroup.templates.map((templateName) => (
                  <div key={templateName} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{templateName}</span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un modèle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Academic Variables Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Variables Académiques Disponibles</CardTitle>
          <CardDescription>
            Variables automatiquement synchronisées avec les données académiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {variableCategories.map((category) => {
              const IconComponent = category.icon;
              const categoryVariables = mockVariables.filter(v => v.category === category.id);
              
              return (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center">
                    <IconComponent className="w-4 h-4 mr-2 text-primary" />
                    <h4 className="font-medium">{category.label}</h4>
                  </div>
                  <div className="space-y-2">
                    {categoryVariables.map((variable) => (
                      <div key={variable.id} className="text-sm">
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          {`{{${variable.name}}}`}
                        </code>
                        <p className="text-muted-foreground text-xs mt-1">
                          {variable.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}