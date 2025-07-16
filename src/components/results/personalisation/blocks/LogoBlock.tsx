import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';
import { Building2 } from 'lucide-react';

interface LogoBlockData {
  src?: string;
  alt: string;
  size: 'small' | 'medium' | 'large';
  position: 'left' | 'center' | 'right';
  style: 'default' | 'rounded' | 'circle' | 'bordered';
}

const LogoBlock: React.FC<BlockProps> = ({
  id,
  data = {
    src: "",
    alt: "Logo de l'établissement",
    size: 'medium',
    position: 'center',
    style: 'default'
  } as LogoBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { src, alt, size, position, style } = data;

  const sizeClasses = {
    small: "h-12 w-12",
    medium: "h-20 w-20",
    large: "h-32 w-32"
  };

  const positionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  };

  const styleClasses = {
    default: "",
    rounded: "rounded-lg",
    circle: "rounded-full",
    bordered: "border-2 border-primary/20 p-2"
  };

  return (
    <div 
      className={cn(
        "w-full flex transition-all duration-200",
        positionClasses[position],
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-md",
        "cursor-pointer py-4",
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      <div className={cn(
        "flex items-center justify-center bg-accent/10",
        sizeClasses[size],
        styleClasses[style]
      )}>
        {src ? (
          <img 
            src={src} 
            alt={alt}
            className={cn(
              "object-contain w-full h-full",
              style === 'circle' && "rounded-full",
              style === 'rounded' && "rounded-lg"
            )}
          />
        ) : (
          <Building2 className="w-1/2 h-1/2 text-primary" />
        )}
      </div>
    </div>
  );
};

export default LogoBlock;