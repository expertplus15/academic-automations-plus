import React, { useState, useRef, useCallback } from 'react';
import { ReleveNotesEMDTemplate, ReleveNotesEMDData } from '@/components/documents/templates/predefined/ReleveNotesEMDTemplate';

interface EditableElement {
  id: string;
  type: 'text' | 'table' | 'image' | 'signature';
  field?: keyof ReleveNotesEMDData;
  x: number;
  y: number;
  width: number;
  height: number;
  content: any;
  isSelected: boolean;
  isEditing: boolean;
}

interface InteractiveTemplateEditorProps {
  data: Partial<ReleveNotesEMDData>;
  onDataChange?: (data: Partial<ReleveNotesEMDData>) => void;
}

export function InteractiveTemplateEditor({ data, onDataChange }: InteractiveTemplateEditorProps) {
  const [elements, setElements] = useState<EditableElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Initialiser les éléments éditables à partir du template
  React.useEffect(() => {
    if (elements.length === 0) {
      const initialElements: EditableElement[] = [
        {
          id: 'header-republique',
          type: 'text',
          field: 'republique',
          x: 50,
          y: 20,
          width: 200,
          height: 20,
          content: data.republique || 'République Française',
          isSelected: false,
          isEditing: false,
        },
        {
          id: 'header-ministere',
          type: 'text',
          field: 'ministere',
          x: 50,
          y: 40,
          width: 250,
          height: 20,
          content: data.ministere || 'Ministère de l\'Enseignement Supérieur',
          isSelected: false,
          isEditing: false,
        },
        {
          id: 'header-ecole',
          type: 'text',
          field: 'ecole',
          x: 50,
          y: 60,
          width: 200,
          height: 20,
          content: data.ecole || 'École Supérieure de Management',
          isSelected: false,
          isEditing: false,
        },
        {
          id: 'student-nom',
          type: 'text',
          field: 'nom',
          x: 150,
          y: 180,
          width: 200,
          height: 20,
          content: data.nom || 'Nom de l\'étudiant',
          isSelected: false,
          isEditing: false,
        },
        {
          id: 'student-niveau',
          type: 'text',
          field: 'niveau',
          x: 150,
          y: 200,
          width: 150,
          height: 20,
          content: data.niveau || 'Niveau',
          isSelected: false,
          isEditing: false,
        },
        {
          id: 'logo',
          type: 'image',
          x: 300,
          y: 20,
          width: 80,
          height: 80,
          content: 'LOGO EMD',
          isSelected: false,
          isEditing: false,
        }
      ];
      setElements(initialElements);
    }
  }, [data, elements.length]);

  const handleElementClick = useCallback((elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedElementId(elementId);
    setElements(prev => prev.map(el => ({
      ...el,
      isSelected: el.id === elementId
    })));
  }, []);

  const handleElementDoubleClick = useCallback((elementId: string) => {
    setEditingElementId(elementId);
    setElements(prev => prev.map(el => ({
      ...el,
      isEditing: el.id === elementId
    })));
  }, []);

  const handleMouseDown = useCallback((elementId: string, event: React.MouseEvent) => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragOffset({
      x: (event.clientX - rect.left) / zoom - element.x,
      y: (event.clientY - rect.top) / zoom - element.y
    });
  }, [elements, zoom]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging || !selectedElementId) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = (event.clientX - rect.left) / zoom - dragOffset.x;
    const newY = (event.clientY - rect.top) / zoom - dragOffset.y;

    setElements(prev => prev.map(el => 
      el.id === selectedElementId 
        ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
        : el
    ));
  }, [isDragging, selectedElementId, dragOffset, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleContentChange = useCallback((elementId: string, newContent: string) => {
    setElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, content: newContent } : el
    ));

    // Synchroniser avec les données du template
    const element = elements.find(el => el.id === elementId);
    if (element?.field && onDataChange) {
      onDataChange({ ...data, [element.field]: newContent });
    }
  }, [elements, data, onDataChange]);

  const handleCanvasClick = useCallback(() => {
    setSelectedElementId(null);
    setEditingElementId(null);
    setElements(prev => prev.map(el => ({ 
      ...el, 
      isSelected: false, 
      isEditing: false 
    })));
  }, []);

  const addNewElement = useCallback((type: 'text' | 'image') => {
    const newElement: EditableElement = {
      id: `element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 150 : 100,
      height: type === 'text' ? 20 : 100,
      content: type === 'text' ? 'Nouveau texte' : 'Nouvelle image',
      isSelected: true,
      isEditing: false,
    };

    setElements(prev => [...prev.map(el => ({ ...el, isSelected: false })), newElement]);
    setSelectedElementId(newElement.id);
  }, []);

  const deleteSelectedElement = useCallback(() => {
    if (selectedElementId) {
      setElements(prev => prev.filter(el => el.id !== selectedElementId));
      setSelectedElementId(null);
    }
  }, [selectedElementId]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <button
          onClick={() => addNewElement('text')}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
        >
          + Texte
        </button>
        <button
          onClick={() => addNewElement('image')}
          className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
        >
          + Image
        </button>
        <div className="w-px h-6 bg-border mx-2" />
        <button
          onClick={deleteSelectedElement}
          disabled={!selectedElementId}
          className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 disabled:opacity-50"
        >
          Supprimer
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <span className="text-sm">Zoom:</span>
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
            className="w-8 h-8 rounded bg-muted hover:bg-muted/80 flex items-center justify-center"
          >
            -
          </button>
          <span className="text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
            className="w-8 h-8 rounded bg-muted hover:bg-muted/80 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* Canvas d'édition */}
      <div className="flex-1 overflow-auto bg-accent/20">
        <div
          ref={containerRef}
          className="relative min-w-[800px] min-h-[1000px] mx-auto bg-white shadow-lg cursor-default"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Template en arrière-plan */}
          <div className="pointer-events-none opacity-30">
            <ReleveNotesEMDTemplate data={data} isEditable={false} />
          </div>

          {/* Éléments éditables superposés */}
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move ${
                element.isSelected 
                  ? 'ring-2 ring-primary ring-offset-2' 
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
              }}
              onClick={(e) => handleElementClick(element.id, e)}
              onDoubleClick={() => handleElementDoubleClick(element.id)}
              onMouseDown={(e) => handleMouseDown(element.id, e)}
            >
              {element.isEditing ? (
                <input
                  type="text"
                  value={element.content}
                  onChange={(e) => handleContentChange(element.id, e.target.value)}
                  onBlur={() => {
                    setEditingElementId(null);
                    setElements(prev => prev.map(el => 
                      el.id === element.id ? { ...el, isEditing: false } : el
                    ));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                  className="w-full h-full border-none outline-none bg-yellow-50 px-1"
                  autoFocus
                />
              ) : (
                <div className={`w-full h-full flex items-center ${
                  element.type === 'text' ? 'text-sm' : 'text-xs text-center bg-muted/50'
                }`}>
                  {element.type === 'image' ? (
                    <div className="w-full h-full bg-muted border-2 border-dashed border-muted-foreground flex items-center justify-center">
                      {element.content}
                    </div>
                  ) : (
                    element.content
                  )}
                </div>
              )}

              {/* Poignées de redimensionnement */}
              {element.isSelected && (
                <>
                  <div className="absolute -right-1 -bottom-1 w-3 h-3 bg-primary rounded-full cursor-se-resize" />
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full cursor-e-resize" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rounded-full cursor-s-resize" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panneau de propriétés */}
      {selectedElementId && (
        <div className="border-t p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">Propriétés de l'élément</h3>
          {(() => {
            const element = elements.find(el => el.id === selectedElementId);
            if (!element) return null;
            
            return (
              <div className="grid grid-cols-4 gap-2 text-sm">
                <div>
                  <label className="block text-xs font-medium">X</label>
                  <input
                    type="number"
                    value={Math.round(element.x)}
                    onChange={(e) => {
                      const newX = parseFloat(e.target.value) || 0;
                      setElements(prev => prev.map(el => 
                        el.id === selectedElementId ? { ...el, x: newX } : el
                      ));
                    }}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium">Y</label>
                  <input
                    type="number"
                    value={Math.round(element.y)}
                    onChange={(e) => {
                      const newY = parseFloat(e.target.value) || 0;
                      setElements(prev => prev.map(el => 
                        el.id === selectedElementId ? { ...el, y: newY } : el
                      ));
                    }}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium">Largeur</label>
                  <input
                    type="number"
                    value={Math.round(element.width)}
                    onChange={(e) => {
                      const newWidth = parseFloat(e.target.value) || 50;
                      setElements(prev => prev.map(el => 
                        el.id === selectedElementId ? { ...el, width: newWidth } : el
                      ));
                    }}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium">Hauteur</label>
                  <input
                    type="number"
                    value={Math.round(element.height)}
                    onChange={(e) => {
                      const newHeight = parseFloat(e.target.value) || 20;
                      setElements(prev => prev.map(el => 
                        el.id === selectedElementId ? { ...el, height: newHeight } : el
                      ));
                    }}
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}