import React, { useState, useCallback } from 'react';
import { Save, X, Plus, Trash2, Settings, Eye, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import type { DocumentType } from '@/pages/results/creation/types';

interface DocumentTypeEditorProps {
  documentType?: DocumentType | null;
  onSave: (type: DocumentType) => void;
  onCancel: () => void;
}

const AVAILABLE_VARIABLES = [
  { name: 'student_name', label: 'Nom de l\'étudiant', type: 'string' },
  { name: 'student_number', label: 'Numéro étudiant', type: 'string' },
  { name: 'program', label: 'Programme d\'études', type: 'string' },
  { name: 'academic_year', label: 'Année académique', type: 'string' },
  { name: 'semester', label: 'Semestre', type: 'string' },
  { name: 'grades', label: 'Notes', type: 'array' },
  { name: 'gpa', label: 'Moyenne générale', type: 'number' },
  { name: 'credits', label: 'Crédits ECTS', type: 'number' },
  { name: 'enrollment_date', label: 'Date d\'inscription', type: 'date' },
  { name: 'birth_date', label: 'Date de naissance', type: 'date' },
  { name: 'address', label: 'Adresse', type: 'string' },
  { name: 'phone', label: 'Téléphone', type: 'string' },
  { name: 'email', label: 'Email', type: 'string' }
];

const CATEGORIES = [
  { value: 'academique', label: 'Académique' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'financier', label: 'Financier' },
  { value: 'medical', label: 'Médical' }
];

const COLORS = [
  { value: 'blue', label: 'Bleu', class: 'bg-blue-500' },
  { value: 'green', label: 'Vert', class: 'bg-green-500' },
  { value: 'purple', label: 'Violet', class: 'bg-purple-500' },
  { value: 'red', label: 'Rouge', class: 'bg-red-500' },
  { value: 'yellow', label: 'Jaune', class: 'bg-yellow-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' }
];

export function DocumentTypeEditor({ documentType, onSave, onCancel }: DocumentTypeEditorProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: documentType?.name || '',
    code: documentType?.code || '',
    description: documentType?.description || '',
    category: documentType?.category || 'academique',
    color: documentType?.color || 'blue',
    variables: documentType?.variables || [],
    validation_rules: documentType?.validation_rules || {},
    is_active: documentType?.is_active ?? true
  });

  const [newVariable, setNewVariable] = useState('');
  const [newRule, setNewRule] = useState({ key: '', value: '' });

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleAddVariable = useCallback((variableName: string) => {
    if (variableName && !formData.variables.includes(variableName)) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, variableName]
      }));
    }
  }, [formData.variables]);

  const handleRemoveVariable = useCallback((variable: string) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter(v => v !== variable)
    }));
  }, []);

  const handleAddValidationRule = useCallback(() => {
    if (newRule.key && newRule.value) {
      setFormData(prev => ({
        ...prev,
        validation_rules: {
          ...prev.validation_rules,
          [newRule.key]: newRule.value
        }
      }));
      setNewRule({ key: '', value: '' });
    }
  }, [newRule]);

  const handleRemoveValidationRule = useCallback((key: string) => {
    setFormData(prev => {
      const { [key]: removed, ...rest } = prev.validation_rules;
      return { ...prev, validation_rules: rest };
    });
  }, []);

  const handleSave = useCallback(() => {
    if (!formData.name || !formData.code) {
      toast({
        title: "Erreur de validation",
        description: "Le nom et le code sont requis",
        variant: "destructive"
      });
      return;
    }

    const newType: DocumentType = {
      id: documentType?.id || crypto.randomUUID(),
      name: formData.name,
      code: formData.code.toUpperCase(),
      description: formData.description,
      icon: 'FileText',
      color: formData.color,
      category: formData.category,
      variables: formData.variables,
      validation_rules: formData.validation_rules,
      is_active: formData.is_active,
      created_at: documentType?.created_at || new Date().toISOString()
    };

    onSave(newType);
    
    toast({
      title: "Type de document sauvegardé",
      description: `Le type "${formData.name}" a été sauvegardé avec succès`
    });
  }, [formData, documentType, onSave, toast]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informations de base</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informations générales
              </CardTitle>
              <CardDescription>
                Définissez les informations de base du type de document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du type *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="ex: Bulletin de Notes"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                    placeholder="ex: BULLETIN"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Description du type de document..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Couleur</Label>
                  <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full ${color.class}`} />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Type actif</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Variables disponibles
              </CardTitle>
              <CardDescription>
                Sélectionnez les variables qui seront disponibles dans les templates de ce type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Variables disponibles</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {AVAILABLE_VARIABLES.map((variable) => (
                      <div
                        key={variable.name}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                          formData.variables.includes(variable.name)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => handleAddVariable(variable.name)}
                      >
                        <div>
                          <div className="font-medium">{variable.label}</div>
                          <div className="text-xs text-muted-foreground">{variable.name}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {variable.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Variables sélectionnées</Label>
                  <div className="space-y-2 border rounded-lg p-3 min-h-[200px]">
                    {formData.variables.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Aucune variable sélectionnée</p>
                    ) : (
                      formData.variables.map((variable) => {
                        const varInfo = AVAILABLE_VARIABLES.find(v => v.name === variable);
                        return (
                          <div
                            key={variable}
                            className="flex items-center justify-between p-2 bg-secondary rounded-md"
                          >
                            <div>
                              <div className="font-medium">{varInfo?.label || variable}</div>
                              <div className="text-xs text-muted-foreground">{variable}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemoveVariable(variable)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Règles de validation
              </CardTitle>
              <CardDescription>
                Définissez les règles de validation qui s'appliqueront aux documents de ce type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="Nom de la règle"
                  value={newRule.key}
                  onChange={(e) => setNewRule(prev => ({ ...prev, key: e.target.value }))}
                />
                <Input
                  placeholder="Valeur"
                  value={newRule.value}
                  onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                />
                <Button onClick={handleAddValidationRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              <div className="space-y-2">
                {Object.entries(formData.validation_rules).length === 0 ? (
                  <p className="text-muted-foreground text-sm">Aucune règle de validation définie</p>
                ) : (
                  Object.entries(formData.validation_rules).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 bg-secondary rounded-md"
                    >
                      <div>
                        <span className="font-medium">{key}</span>
                        <span className="text-muted-foreground ml-2">= {String(value)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveValidationRule(key)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>
    </div>
  );
}