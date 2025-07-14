import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, FileText, Star, Clock, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Template {
  id: string;
  name: string;
  code: string;
  description?: string;
  template_type: string;
  is_active: boolean;
  requires_approval: boolean;
  created_at: string;
  usage_count?: number;
}

interface TemplateSelectorProps {
  data: any;
  onDataChange: (data: any) => void;
}

export function TemplateSelector({ data, onDataChange }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory]);

  const loadTemplates = async () => {
    try {
      const { data: templatesData, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(templatesData || []);
    } catch (error) {
      console.error('Erreur lors du chargement des templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.template_type === selectedCategory);
    }

    setFilteredTemplates(filtered);
  };

  const handleTemplateSelect = (template: Template) => {
    onDataChange({ ...data, template });
  };

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'bulletin': return '📊';
      case 'transcript': return '🎓';
      case 'certificate': return '🏆';
      case 'report': return '📋';
      default: return '📄';
    }
  };

  const categories = [
    { value: 'all', label: 'Tous les templates' },
    { value: 'bulletin', label: 'Bulletins de notes' },
    { value: 'transcript', label: 'Relevés de notes' },
    { value: 'certificate', label: 'Certificats' },
    { value: 'report', label: 'Rapports' },
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher un template par nom, code ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates recommandés */}
      {searchTerm === '' && selectedCategory === 'all' && (
        <div>
          <h3 className="font-semibold mb-4 flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Templates populaires
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.slice(0, 3).map(template => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                  data.template?.id === template.id ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getTemplateIcon(template.template_type)}</span>
                      <div>
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{template.code}</p>
                      </div>
                    </div>
                    {template.requires_approval && (
                      <Badge variant="secondary" className="text-xs">
                        Approbation
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.description || 'Aucune description disponible'}
                  </p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(template.created_at).toLocaleDateString('fr-FR')}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.template_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Liste complète des templates */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Tous les templates ({filteredTemplates.length})
          </span>
        </h3>

        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h4 className="font-medium mb-2">Aucun template trouvé</h4>
              <p className="text-sm text-muted-foreground">
                Essayez de modifier vos critères de recherche ou créez un nouveau template.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-sm border-2 ${
                  data.template?.id === template.id ? 'border-primary bg-primary/5' : 'border-transparent'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{getTemplateIcon(template.template_type)}</span>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Code: {template.code} • Type: {template.template_type}
                        </p>
                        {template.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {template.requires_approval && (
                        <Badge variant="secondary" className="text-xs">
                          Approbation requise
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Template sélectionné */}
      {data.template && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              ✅ Template sélectionné
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <span className="text-xl">{getTemplateIcon(data.template.template_type)}</span>
              <div>
                <h4 className="font-medium">{data.template.name}</h4>
                <p className="text-sm text-muted-foreground">{data.template.code}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}