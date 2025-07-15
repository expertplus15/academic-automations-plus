import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Settings,
  User,
  FileText,
  Hash
} from 'lucide-react';
import { TemplateRenderer, getDefaultDataForTemplate } from '@/components/documents/templates/predefined/TemplateRenderer';
import { MockDataService } from '@/services/MockDataService';
import { DocumentTemplate } from '@/hooks/useDocumentTemplates';

interface UniversalTemplatePreviewProps {
  template: DocumentTemplate;
  studentData?: any;
  onDataChange?: (data: any) => void;
  onGeneratePDF?: () => void;
  className?: string;
}

export function UniversalTemplatePreview({ 
  template, 
  studentData, 
  onDataChange,
  onGeneratePDF,
  className = ''
}: UniversalTemplatePreviewProps) {
  const [previewData, setPreviewData] = useState<any>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState('default');

  useEffect(() => {
    // Charger les données de prévisualisation
    const mockData = studentData || MockDataService.getTemplatePreviewData(template.template_type);
    const defaultData = getDefaultDataForTemplate(template.template_type);
    
    setPreviewData({ ...defaultData, ...mockData });
  }, [template, studentData]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  const handleDataChange = (newData: any) => {
    setPreviewData(newData);
    onDataChange?.(newData);
  };

  const renderMetadata = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Informations du Template
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nom:</span>
              <span className="font-medium">{template.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Code:</span>
              <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{template.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline">{template.template_type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Statut:</span>
              <Badge variant={template.is_active ? 'default' : 'secondary'}>
                {template.is_active ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Approbation:</span>
              <Badge variant={template.requires_approval ? 'destructive' : 'secondary'}>
                {template.requires_approval ? 'Requise' : 'Non requise'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-génération:</span>
              <Badge variant={template.auto_generate ? 'default' : 'secondary'}>
                {template.auto_generate ? 'Activée' : 'Désactivée'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Créé le:</span>
              <span>{new Date(template.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {template.description && (
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
            {template.description}
          </p>
        </div>
      )}
    </div>
  );

  const renderVariables = () => {
    const variables = MockDataService.getTemplateVariables();
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4" />
          <h4 className="font-medium">Variables Disponibles</h4>
        </div>
        
        <div className="grid gap-3">
          {Object.entries(variables).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <code className="text-sm font-mono bg-background px-2 py-1 rounded text-primary">
                  {key}
                </code>
              </div>
              <div className="flex-2 text-right">
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStudentSelector = () => (
    <div className="flex items-center gap-2 mb-4">
      <User className="w-4 h-4" />
      <span className="text-sm font-medium">Données de test:</span>
      <Badge variant="outline">Étudiant par défaut</Badge>
    </div>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Aperçu du Template: {template.name}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetZoom}>
                {Math.round(zoomLevel * 100)}%
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setZoomLevel(1)}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              {onGeneratePDF && (
                <Button size="sm" onClick={onGeneratePDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Générer PDF
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Aperçu</TabsTrigger>
              <TabsTrigger value="metadata">Métadonnées</TabsTrigger>
              <TabsTrigger value="variables">Variables</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="space-y-4">
              {renderStudentSelector()}
              <Separator />
              
              <div className="border rounded-lg overflow-hidden bg-white">
                <div 
                  className="p-6"
                  style={{ 
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top left',
                    width: `${100 / zoomLevel}%`
                  }}
                >
                  <TemplateRenderer
                    templateType={template.template_type}
                    data={previewData}
                    isEditable={false}
                    onDataChange={handleDataChange}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metadata" className="space-y-4">
              {renderMetadata()}
            </TabsContent>
            
            <TabsContent value="variables" className="space-y-4">
              {renderVariables()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}