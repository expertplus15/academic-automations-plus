import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TemplateRenderer, getDefaultDataForTemplate } from './TemplateRenderer';

interface PredefinedTemplatePreviewProps {
  template: any;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: any) => void;
}

export function PredefinedTemplatePreview({ template, isOpen, onClose, onSelect }: PredefinedTemplatePreviewProps) {
  if (!template) return null;

  const defaultData = getDefaultDataForTemplate(template.template_type || template.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <template.icon className="h-5 w-5" />
                Aperçu: {template.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{template.category}</Badge>
                <Badge variant="secondary">{template.difficulty}</Badge>
                {template.is_popular && (
                  <Badge className="bg-orange-100 text-orange-800">Populaire</Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Fermer
              </Button>
              <Button 
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Personnaliser ce modèle
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Description du template */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">{template.description}</p>
          <div className="mt-2">
            <span className="text-xs font-medium text-blue-700">Sections incluses: </span>
            <span className="text-xs text-blue-600">
              {template.sections.join(' • ')}
            </span>
          </div>
          <div className="mt-1">
            <span className="text-xs font-medium text-blue-700">Variables disponibles: </span>
            <span className="text-xs text-blue-600">
              {template.variables.join(', ')}
            </span>
          </div>
        </div>

        {/* Aperçu du template rendu */}
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-3 pb-2 border-b">
            Aperçu du document généré:
          </div>
          
          {/* Conteneur avec scroll pour le template */}
          <div className="bg-gray-50 border rounded max-h-96 overflow-y-auto">
            <TemplateRenderer
              templateType={template.template_type || template.id}
              data={defaultData}
              isEditable={false}
            />
          </div>
        </div>

        {/* Note d'information */}
        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <p className="text-xs text-yellow-800">
            💡 <strong>Note:</strong> Ceci est un aperçu avec des données d'exemple. 
            Lors de la personnalisation, vous pourrez modifier toutes les sections, 
            ajouter vos propres données et ajuster la mise en forme selon vos besoins.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}