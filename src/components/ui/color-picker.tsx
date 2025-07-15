import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Palette } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Predefined color palette
  const presetColors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#06B6D4',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'
  ];

  const handleColorChange = (color: string) => {
    onChange(color);
  };

  const isValidColor = (color: string) => {
    const s = new Option().style;
    s.color = color;
    return s.color !== '';
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start ${className}`}
          style={{
            backgroundColor: value === 'transparent' ? 'transparent' : value,
            backgroundImage: value === 'transparent' 
              ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
              : 'none',
            backgroundSize: value === 'transparent' ? '8px 8px' : 'auto',
            backgroundPosition: value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
          }}
        >
          <div className="flex items-center gap-2 w-full">
            <div 
              className="w-5 h-5 border border-gray-300 rounded flex-shrink-0"
              style={{
                backgroundColor: value === 'transparent' ? 'transparent' : value,
                backgroundImage: value === 'transparent' 
                  ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                  : 'none',
                backgroundSize: value === 'transparent' ? '6px 6px' : 'auto',
                backgroundPosition: value === 'transparent' ? '0 0, 0 3px, 3px -3px, -3px 0px' : 'auto'
              }}
            />
            <span className="flex-1 text-left text-sm font-mono">
              {value === 'transparent' ? 'Transparent' : value}
            </span>
            <Palette className="w-4 h-4 text-muted-foreground" />
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-64 p-3">
        <Tabs defaultValue="palette" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="palette">Palette</TabsTrigger>
            <TabsTrigger value="custom">Personnalisé</TabsTrigger>
          </TabsList>
          
          <TabsContent value="palette" className="space-y-3 mt-3">
            {/* Transparent Option */}
            <div>
              <Label className="text-xs text-muted-foreground">Transparent</Label>
              <div className="mt-1">
                <Button
                  variant={value === 'transparent' ? 'default' : 'outline'}
                  size="sm"
                  className="w-full h-8"
                  onClick={() => handleColorChange('transparent')}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                    backgroundSize: '8px 8px',
                    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
                  }}
                >
                  Transparent
                </Button>
              </div>
            </div>

            {/* Preset Colors */}
            <div>
              <Label className="text-xs text-muted-foreground">Couleurs prédéfinies</Label>
              <div className="grid grid-cols-7 gap-1 mt-2">
                {presetColors.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="sm"
                    className={`w-8 h-8 p-0 border-2 ${
                      value === color ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="space-y-3 mt-3">
            {/* Color Input */}
            <div>
              <Label htmlFor="color-input" className="text-xs text-muted-foreground">
                Code couleur
              </Label>
              <Input
                id="color-input"
                type="text"
                value={value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue === 'transparent' || isValidColor(newValue)) {
                    handleColorChange(newValue);
                  }
                }}
                placeholder="#000000"
                className="mt-1 font-mono text-sm"
              />
            </div>

            {/* HTML Color Input */}
            <div>
              <Label htmlFor="color-picker" className="text-xs text-muted-foreground">
                Sélecteur de couleur
              </Label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="color-picker"
                  type="color"
                  value={value === 'transparent' ? '#000000' : value}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <div className="flex-1 text-xs text-muted-foreground">
                  Cliquez pour ouvrir le sélecteur
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="text-xs text-muted-foreground">Aperçu</Label>
              <div 
                className="w-full h-8 mt-1 border border-gray-300 rounded"
                style={{
                  backgroundColor: value === 'transparent' ? 'transparent' : value,
                  backgroundImage: value === 'transparent' 
                    ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                    : 'none',
                  backgroundSize: value === 'transparent' ? '8px 8px' : 'auto',
                  backgroundPosition: value === 'transparent' ? '0 0, 0 4px, 4px -4px, -4px 0px' : 'auto'
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}