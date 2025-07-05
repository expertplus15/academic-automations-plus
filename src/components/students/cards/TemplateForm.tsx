import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentCards, CardTemplate } from '@/hooks/students/useStudentCards';
import { Loader2, Palette, Layout, Image } from 'lucide-react';

interface TemplateFormProps {
  template?: CardTemplate | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TemplateForm({ template, onSuccess, onCancel }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_default: false,
    is_active: true,
    template_data: {
      layout: 'standard',
      colors: {
        primary: '#10B981',
        secondary: '#1F2937',
        text: '#FFFFFF'
      },
      fields: [
        'student_name',
        'student_number',
        'program_name',
        'expiry_date',
        'photo',
        'qr_code'
      ],
      dimensions: {
        width: 85.6,
        height: 54,
        unit: 'mm'
      }
    }
  });

  const { createTemplate, updateTemplate, loading } = useStudentCards();

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        is_default: template.is_default,
        is_active: template.is_active,
        template_data: template.template_data
      });
    }
  }, [template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = template 
      ? await updateTemplate(template.id, formData)
      : await createTemplate(formData);
      
    if (result.success) {
      onSuccess();
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      template_data: {
        ...prev.template_data,
        colors: {
          ...prev.template_data.colors,
          [colorKey]: value
        }
      }
    }));
  };

  const handleFieldToggle = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      template_data: {
        ...prev.template_data,
        fields: checked 
          ? [...prev.template_data.fields, field]
          : prev.template_data.fields.filter(f => f !== field)
      }
    }));
  };

  const availableFields = [
    { key: 'student_name', label: 'Nom de l\'étudiant' },
    { key: 'student_number', label: 'Numéro étudiant' },
    { key: 'program_name', label: 'Programme' },
    { key: 'expiry_date', label: 'Date d\'expiration' },
    { key: 'photo', label: 'Photo' },
    { key: 'qr_code', label: 'Code QR' },
    { key: 'barcode', label: 'Code-barres' },
    { key: 'issue_date', label: 'Date d\'émission' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-full overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Informations Générales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom du Template</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Template Standard..."
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du template..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_default">Template par défaut</Label>
              <Switch
                id="is_default"
                checked={formData.is_default}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_default: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Actif</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Couleurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primary">Couleur Primaire</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary"
                  type="color"
                  value={formData.template_data.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.template_data.colors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  placeholder="#10B981"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondary">Couleur Secondaire</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="secondary"
                  type="color"
                  value={formData.template_data.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.template_data.colors.secondary}
                  onChange={(e) => handleColorChange('secondary', e.target.value)}
                  placeholder="#1F2937"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="text">Couleur du Texte</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="text"
                  type="color"
                  value={formData.template_data.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={formData.template_data.colors.text}
                  onChange={(e) => handleColorChange('text', e.target.value)}
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fields Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Champs à Afficher
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableFields.map((field) => (
              <div key={field.key} className="flex items-center space-x-2">
                <Switch
                  id={field.key}
                  checked={formData.template_data.fields.includes(field.key)}
                  onCheckedChange={(checked) => handleFieldToggle(field.key, checked)}
                />
                <Label htmlFor={field.key} className="text-sm">
                  {field.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="outline" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {template ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}