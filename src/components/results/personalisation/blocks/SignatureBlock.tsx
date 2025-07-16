import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';

interface SignatureBlockData {
  title: string;
  position: string;
  name?: string;
  date?: string;
  location?: string;
  style: 'simple' | 'formal' | 'modern';
  includeDate: boolean;
  includeLocation: boolean;
}

const SignatureBlock: React.FC<BlockProps> = ({
  id,
  data = {
    title: "Le Directeur",
    position: "Directeur des Études",
    name: "",
    date: new Date().toLocaleDateString('fr-FR'),
    location: "Paris",
    style: 'formal',
    includeDate: true,
    includeLocation: true
  } as SignatureBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { title, position, name, date, location, style, includeDate, includeLocation } = data;

  const containerStyles = {
    simple: "border-t border-border/50 pt-4",
    formal: "border-2 border-primary/20 p-4 bg-accent/20",
    modern: "bg-gradient-to-br from-primary/5 to-secondary/5 p-4 rounded-lg border border-border/50"
  };

  return (
    <div 
      className={cn(
        "w-full transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-md",
        "cursor-pointer",
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      <div className={cn("text-right", containerStyles[style])}>
        {/* Date and location */}
        {(includeDate || includeLocation) && (
          <div className="mb-6 text-sm text-muted-foreground">
            {includeLocation && location && <span>{location}, </span>}
            {includeDate && date && <span>le {date}</span>}
          </div>
        )}

        {/* Title and position */}
        <div className="mb-8">
          <p className="font-semibold text-foreground">{title}</p>
          {position && (
            <p className="text-sm text-muted-foreground italic">{position}</p>
          )}
        </div>

        {/* Signature space */}
        <div className="mb-4 h-16 border-b border-dashed border-muted-foreground/30 flex items-end justify-center">
          <span className="text-xs text-muted-foreground mb-1">Signature</span>
        </div>

        {/* Name */}
        {name && (
          <div className="text-sm font-medium text-foreground">
            {name}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureBlock;