import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Award, Shield, Layout, Plus } from 'lucide-react';
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

// Configuration des catégories optimisée et externalisée
const CATEGORIES = [
  { 
    id: 'bulletins', 
    label: 'Bulletins', 
    icon: FileText, 
    description: 'Créer et gérer les bulletins de notes',
    color: 'bg-blue-500'
  },
  { 
    id: 'transcripts', 
    label: 'Relevés', 
    icon: Award, 
    description: 'Créer et gérer les relevés de notes',
    color: 'bg-purple-500' 
  },
  { 
    id: 'attestations', 
    label: 'Attestations', 
    icon: Shield, 
    description: 'Créer et gérer les attestations',
    color: 'bg-green-500'
  },
  { 
    id: 'templates', 
    label: 'Templates', 
    icon: Layout, 
    description: 'Gérer tous les templates personnalisés',
    color: 'bg-orange-500'
  }
] as const;

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

  // Optimisation : mémoriser les données par catégorie
  const categoryData = useMemo(() => {
    return CATEGORIES.reduce((acc, category) => {
      const documents = category.id === 'templates' 
        ? templates 
        : getDocumentsByType(category.id.slice(0, -1));
      
      acc[category.id] = {
        ...category,
        documents,
        count: documents.length
      };
      return acc;
    }, {} as Record<string, any>);
  }, [templates, getDocumentsByType]);

  // Optimisation : callback pour changer de catégorie
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  // Composant pour le contenu d'une catégorie optimisé
  const CategoryContent = useCallback(({ categoryId }: { categoryId: string }) => {
    const category = categoryData[categoryId];
    
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

    const { documents, label } = category;

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">{label}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </div>
          <Button onClick={() => onNewTemplate(categoryId)} className="hover-scale">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau {label.slice(0, -1)}
          </Button>
        </div>
        
        {documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((template: any) => (
              <DocumentCard
                key={template.id}
                title={template.name}
                description={template.description || `${label.slice(0, -1)} personnalisable`}
                type={categoryId === 'templates' ? 'template' : 
                      categoryId === 'transcripts' ? 'transcript' : 
                      categoryId === 'attestations' ? 'attestation' : 'bulletin'}
                status={template.is_active ? "ready" : "draft"}
                templateId={template.id}
                onPreview={() => onPreview(template.id, categoryId === 'templates' ? 'template' : 
                  categoryId === 'transcripts' ? 'transcript' : 
                  categoryId === 'attestations' ? 'attestation' : 'bulletin')}
                onGenerate={() => onGenerate(template.id, categoryId === 'templates' ? 'template' : 
                  categoryId === 'transcripts' ? 'transcript' : 
                  categoryId === 'attestations' ? 'attestation' : 'bulletin')}
                onEdit={() => onEdit(template.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                {React.createElement(category.icon, { className: "w-8 h-8" })}
              </div>
              <div>
                <p className="text-lg font-medium">Aucun template disponible</p>
                <p className="text-sm">Créez votre premier template pour commencer</p>
              </div>
              <Button 
                onClick={() => onNewTemplate(categoryId)}
                className="mt-4 hover-scale"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un template
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }, [categoryData, templates, onPreview, onGenerate, onEdit, onNewTemplate]);

  return (
    <div className="space-y-6">
      {/* Liste simple des templates */}
      <div className="space-y-4">
        {templates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template: any) => (
              <DocumentCard
                key={template.id}
                title={template.name}
                description={template.description || 'Template personnalisable'}
                type="template"
                status={template.is_active ? "ready" : "draft"}
                templateId={template.id}
                onPreview={() => onPreview(template.id, 'template')}
                onGenerate={() => onGenerate(template.id, 'template')}
                onEdit={() => onEdit(template.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Layout className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg font-medium">Aucun template disponible</p>
                <p className="text-sm">Créez votre premier template pour commencer</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}