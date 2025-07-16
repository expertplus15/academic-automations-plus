import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Type,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormattingToolbarProps {
  selectedElement: any;
  onFormatChange: (property: string, value: any) => void;
  onFontSizeChange: (delta: number) => void;
  className?: string;
}

export function FormattingToolbar({ 
  selectedElement, 
  onFormatChange, 
  onFontSizeChange,
  className 
}: FormattingToolbarProps) {
  if (!selectedElement) return null;

  const currentStyle = selectedElement.style || {};
  const currentContent = selectedElement.content || {};

  return (
    <div className={cn(
      "flex items-center gap-1 p-2 bg-background border rounded-lg shadow-md",
      className
    )}>
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={currentContent.fontWeight === 'bold' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFormatChange('fontWeight', 
            currentContent.fontWeight === 'bold' ? 'normal' : 'bold'
          )}
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant={currentContent.fontStyle === 'italic' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFormatChange('fontStyle', 
            currentContent.fontStyle === 'italic' ? 'normal' : 'italic'
          )}
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant={currentContent.textDecoration === 'underline' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFormatChange('textDecoration', 
            currentContent.textDecoration === 'underline' ? 'none' : 'underline'
          )}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <Button
          variant={currentStyle.textAlign === 'left' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFormatChange('textAlign', 'left')}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant={currentStyle.textAlign === 'center' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFormatChange('textAlign', 'center')}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button
          variant={currentStyle.textAlign === 'right' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onFormatChange('textAlign', 'right')}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font Size */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFontSizeChange(-2)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1 px-2">
          <Type className="h-4 w-4" />
          <span className="text-sm font-medium min-w-[2ch]">
            {currentContent.fontSize || 16}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFontSizeChange(2)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Color Picker */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
        >
          <Palette className="h-4 w-4" />
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: currentStyle.color || '#000000' }}
          />
        </Button>
        
        <input
          type="color"
          value={currentStyle.color || '#000000'}
          onChange={(e) => onFormatChange('color', e.target.value)}
          className="w-0 h-0 opacity-0 absolute"
          id="color-picker"
        />
        <label htmlFor="color-picker" className="cursor-pointer">
          <span className="sr-only">Choisir une couleur</span>
        </label>
      </div>
    </div>
  );
}