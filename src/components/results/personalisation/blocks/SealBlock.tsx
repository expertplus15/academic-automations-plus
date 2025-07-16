import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface SealBlockData {
  text: string;
  subtext?: string;
  size: 'small' | 'medium' | 'large';
  position: 'left' | 'center' | 'right';
  style: 'circle' | 'badge' | 'stamp';
  color: 'primary' | 'secondary' | 'accent';
}

const SealBlock: React.FC<BlockProps> = ({
  id,
  data = {
    text: "OFFICIEL",
    subtext: "ÉTABLISSEMENT",
    size: 'medium',
    position: 'right',
    style: 'circle',
    color: 'primary'
  } as SealBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { text, subtext, size, position, style, color } = data;

  const sizeClasses = {
    small: "h-16 w-16 text-xs",
    medium: "h-20 w-20 text-sm",
    large: "h-24 w-24 text-base"
  };

  const positionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  };

  const styleClasses = {
    circle: "rounded-full border-4",
    badge: "rounded-lg border-2 px-4",
    stamp: "rounded border-4 border-dashed rotate-12 transform"
  };

  const colorClasses = {
    primary: "border-primary text-primary bg-primary/5",
    secondary: "border-secondary text-secondary bg-secondary/5",
    accent: "border-accent text-accent bg-accent/5"
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
        "flex flex-col items-center justify-center font-bold",
        sizeClasses[size],
        styleClasses[style],
        colorClasses[color]
      )}>
        <Shield className="w-4 h-4 mb-1" />
        <div className="text-center leading-tight">
          <div>{text}</div>
          {subtext && (
            <div className="text-xs font-normal opacity-80">
              {subtext}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SealBlock;