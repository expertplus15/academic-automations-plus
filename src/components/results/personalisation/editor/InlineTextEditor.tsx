import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface InlineTextEditorProps {
  element: any;
  isEditing: boolean;
  onContentChange: (content: string) => void;
  onEditingChange: (isEditing: boolean) => void;
  className?: string;
}

export function InlineTextEditor({
  element,
  isEditing,
  onContentChange,
  onEditingChange,
  className
}: InlineTextEditorProps) {
  const [tempContent, setTempContent] = useState(element.content?.text || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      // Focus sur l'élément d'édition
      const activeRef = element.type === 'text' && element.content?.text?.length > 50 
        ? textareaRef.current 
        : inputRef.current;
      
      if (activeRef) {
        activeRef.focus();
        activeRef.select();
      }
    }
  }, [isEditing]);

  useEffect(() => {
    setTempContent(element.content?.text || '');
  }, [element.content?.text]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleSave = () => {
    onContentChange(tempContent);
    onEditingChange(false);
  };

  const handleCancel = () => {
    setTempContent(element.content?.text || '');
    onEditingChange(false);
  };

  const handleBlur = () => {
    // Attendre un peu pour voir si on clique sur la toolbar
    setTimeout(() => {
      if (document.activeElement?.closest('.formatting-toolbar')) {
        return; // Ne pas fermer si on utilise la toolbar
      }
      handleSave();
    }, 100);
  };

  if (!isEditing) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center cursor-text",
          "hover:bg-primary/5 hover:outline hover:outline-1 hover:outline-primary/20",
          "transition-all duration-200",
          className
        )}
        onDoubleClick={() => onEditingChange(true)}
        style={{
          fontSize: element.content?.fontSize || 16,
          fontWeight: element.content?.fontWeight || 'normal',
          fontStyle: element.content?.fontStyle || 'normal',
          textDecoration: element.content?.textDecoration || 'none',
          color: element.style?.color || '#000000',
          textAlign: element.style?.textAlign || 'left',
          padding: '4px 8px',
          minHeight: '24px',
          wordWrap: 'break-word'
        }}
      >
        {element.content?.text || 'Double-cliquez pour éditer'}
      </div>
    );
  }

  // Déterminer si on utilise un textarea ou un input
  const isMultiline = tempContent.length > 50 || tempContent.includes('\n');

  return (
    <div className={cn("w-full h-full", className)}>
      {isMultiline ? (
        <textarea
          ref={textareaRef}
          value={tempContent}
          onChange={(e) => setTempContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            "w-full h-full border-2 border-primary outline-none resize-none",
            "bg-yellow-50/80 backdrop-blur-sm rounded px-2 py-1",
            "font-inherit text-inherit"
          )}
          style={{
            fontSize: element.content?.fontSize || 16,
            fontWeight: element.content?.fontWeight || 'normal',
            fontStyle: element.content?.fontStyle || 'normal',
            textDecoration: element.content?.textDecoration || 'none',
            color: element.style?.color || '#000000',
            textAlign: element.style?.textAlign || 'left'
          }}
          placeholder="Tapez votre texte..."
        />
      ) : (
        <input
          ref={inputRef}
          type="text"
          value={tempContent}
          onChange={(e) => setTempContent(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className={cn(
            "w-full h-full border-2 border-primary outline-none",
            "bg-yellow-50/80 backdrop-blur-sm rounded px-2 py-1",
            "font-inherit text-inherit"
          )}
          style={{
            fontSize: element.content?.fontSize || 16,
            fontWeight: element.content?.fontWeight || 'normal',
            fontStyle: element.content?.fontStyle || 'normal',
            textDecoration: element.content?.textDecoration || 'none',
            color: element.style?.color || '#000000',
            textAlign: element.style?.textAlign || 'left'
          }}
          placeholder="Tapez votre texte..."
        />
      )}
      
      {/* Instructions d'édition */}
      <div className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
        Entrée pour sauver • Échap pour annuler
      </div>
    </div>
  );
}