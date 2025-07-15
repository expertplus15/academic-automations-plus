import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTemplateEditorContext } from '@/contexts/TemplateEditorContext';

export function TemplateSelector() {
  const { state, actions, templates, documentTemplates, loading } = useTemplateEditorContext();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Template:</span>
      <Select 
        value={state.selectedTemplate} 
        onValueChange={actions.setSelectedTemplate} 
        disabled={loading}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un template"} />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => {
            const docTemplate = documentTemplates.find(dt => dt.id === template.id);
            return (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span>{template.name}</span>
                    <span className="text-xs text-muted-foreground">({template.type})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {!template.is_active && (
                      <Badge variant="secondary" className="text-xs">Inactif</Badge>
                    )}
                    {docTemplate?.requires_approval && (
                      <Badge variant="outline" className="text-xs">Approbation</Badge>
                    )}
                    {docTemplate?.auto_generate && (
                      <Badge className="text-xs bg-green-100 text-green-700">Auto</Badge>
                    )}
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}