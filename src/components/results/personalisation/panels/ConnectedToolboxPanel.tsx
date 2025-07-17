import React from 'react';
import { TemplateToolbox } from '../TemplateToolbox';
import { useTemplateEditorContext } from '../providers/TemplateEditorProvider';

/**
 * Panel connecté qui intègre la TemplateToolbox avec le système d'édition
 * Gère l'ajout d'éléments via le provider unifié
 */
export function ConnectedToolboxPanel() {
  const { state, actions } = useTemplateEditorContext();

  const handleElementSelect = (elementType: string | null) => {
    if (elementType) {
      // Ajouter l'élément à la position par défaut
      const defaultPosition = {
        x: 50 + Math.random() * 100, // Position légèrement aléatoire
        y: 50 + Math.random() * 100
      };
      
      actions.addElement(elementType, defaultPosition);
    } else {
      // Désélectionner l'élément actuel
      actions.setSelectedElement(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-lg">Outils & Éléments</h3>
        {state.selectedElement && (
          <p className="text-sm text-muted-foreground mt-1">
            Élément sélectionné: {state.selectedElement}
          </p>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden">
        <TemplateToolbox
          onElementSelect={handleElementSelect}
          selectedElement={state.selectedElement}
        />
      </div>
      
      {/* Informations d'aide */}
      <div className="p-4 border-t bg-muted/30">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Cliquez pour ajouter un élément</p>
          <p>• Glissez-déposez pour positionner</p>
          <p>• Double-clic pour éditer</p>
        </div>
      </div>
    </div>
  );
}