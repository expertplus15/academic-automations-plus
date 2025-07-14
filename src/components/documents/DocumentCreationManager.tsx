import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Award, Shield, Layout, Plus, Eye, Edit } from 'lucide-react';
import { DocumentCard } from './DocumentCard';
import { AttestationTab } from './AttestationTab';

interface DocumentCreationManagerProps {
  templates: any[];
  loading: boolean;
  getDocumentsByType: (type: string) => any[];
  onPreview: (templateId: string, type: string) => void;
  onGenerate: (templateId: string, type: string) => void;
  onEdit: (templateId: string) => void;
  onNewTemplate: (type: string) => void;
}

export function DocumentCreationManager({
  templates,
  loading,
  getDocumentsByType,
  onPreview,
  onGenerate,
  onEdit,
  onNewTemplate
}: DocumentCreationManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState('bulletins');

  const categories = [
    { 
      id: 'bulletins', 
      label: 'Bulletins', 
      icon: FileText, 
      description: 'Créer et gérer les bulletins de notes',
      color: 'blue'
    },
    { 
      id: 'transcripts', 
      label: 'Relevés', 
      icon: Award, 
      description: 'Créer et gérer les relevés de notes',
      color: 'purple' 
    },
    { 
      id: 'attestations', 
      label: 'Attestations', 
      icon: Shield, 
      description: 'Créer et gérer les attestations',
      color: 'green'
    },
    { 
      id: 'templates', 
      label: 'Templates', 
      icon: Layout, 
      description: 'Gérer tous les templates personnalisés',
      color: 'orange'
    }
  ];

  const renderCategoryContent = (categoryId: string) => {
    if (categoryId === 'attestations') {
      return (
        <AttestationTab
          templates={templates}
          onPreview={onPreview}
          onGenerate={onGenerate}
          onEdit={onEdit}
        />
      );
    }

    const documentsOfType = categoryId === 'templates' ? templates : getDocumentsByType(categoryId.slice(0, -1));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {categories.find(c => c.id === categoryId)?.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {categories.find(c => c.id === categoryId)?.description}
            </p>
          </div>
          <Button onClick={() => onNewTemplate(categoryId)}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau {categories.find(c => c.id === categoryId)?.label.slice(0, -1)}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentsOfType.map((template) => (
            <DocumentCard
              key={template.id}
              title={template.name}
              description={template.description || `${categories.find(c => c.id === categoryId)?.label.slice(0, -1)} personnalisable`}
              type={categoryId === 'templates' ? 'template' : categoryId === 'transcripts' ? 'transcript' : categoryId === 'attestations' ? 'attestation' : 'bulletin'}
              status={template.is_active ? "ready" : "draft"}
              templateId={template.id}
              onPreview={() => onPreview(template.id, categoryId === 'templates' ? 'template' : categoryId === 'transcripts' ? 'transcript' : categoryId === 'attestations' ? 'attestation' : 'bulletin')}
              onGenerate={() => onGenerate(template.id, categoryId === 'templates' ? 'template' : categoryId === 'transcripts' ? 'transcript' : categoryId === 'attestations' ? 'attestation' : 'bulletin')}
              onEdit={() => onEdit(template.id)}
            />
          ))}
          
          {documentsOfType.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground space-y-2">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  {React.createElement(categories.find(c => c.id === categoryId)?.icon || FileText, {
                    className: "w-8 h-8"
                  })}
                </div>
                <p className="text-lg font-medium">Aucun template disponible</p>
                <p className="text-sm">
                  Créez votre premier template pour commencer
                </p>
                <Button 
                  onClick={() => onNewTemplate(categoryId)}
                  className="mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un template
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Création de Documents</h2>
            <p className="text-muted-foreground">
              Créez et gérez vos templates de documents personnalisés
            </p>
          </div>
        </div>

        {/* Navigation par catégories */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary shadow-md' : ''
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className={`font-medium ${isSelected ? 'text-primary' : ''}`}>
                    {category.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getDocumentsByType(category.id === 'templates' ? '' : category.id.slice(0, -1)).length || 
                     (category.id === 'templates' ? templates.length : 0)} template{
                      (getDocumentsByType(category.id === 'templates' ? '' : category.id.slice(0, -1)).length || 
                       (category.id === 'templates' ? templates.length : 0)) > 1 ? 's' : ''
                    }
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Contenu de la catégorie sélectionnée */}
      <div className="min-h-[400px]">
        {renderCategoryContent(selectedCategory)}
      </div>
    </div>
  );
}