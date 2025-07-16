import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';

interface FooterBlockData {
  content: string;
  contact?: string;
  website?: string;
  style: 'minimal' | 'formal' | 'modern';
  includePageNumber: boolean;
}

const FooterBlock: React.FC<BlockProps> = ({
  id,
  data = {
    content: "Document officiel de l'établissement",
    contact: "Secrétariat: 01 23 45 67 89",
    website: "www.ecole.fr",
    style: 'formal',
    includePageNumber: true
  } as FooterBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { content, contact, website, style, includePageNumber } = data;

  const styleClasses = {
    minimal: "border-t border-border/50 pt-2",
    formal: "border-t-2 border-primary/20 pt-4 bg-accent/5",
    modern: "bg-gradient-to-t from-primary/5 to-transparent pt-4 border-t border-gradient-to-r from-transparent via-primary/20 to-transparent"
  };

  return (
    <div 
      className={cn(
        "w-full transition-all duration-200",
        styleClasses[style],
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-md",
        "cursor-pointer mt-8",
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        {/* Left content */}
        <div className="flex-1">
          <p>{content}</p>
          {contact && (
            <p className="text-xs mt-1">{contact}</p>
          )}
        </div>

        {/* Center content */}
        {website && (
          <div className="flex-1 text-center">
            <p className="text-xs">{website}</p>
          </div>
        )}

        {/* Right content */}
        {includePageNumber && (
          <div className="flex-1 text-right">
            <p className="text-xs">Page 1</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterBlock;