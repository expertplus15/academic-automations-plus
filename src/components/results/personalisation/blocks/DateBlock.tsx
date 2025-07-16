import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface DateBlockData {
  format: 'short' | 'long' | 'custom';
  customFormat?: string;
  prefix?: string;
  suffix?: string;
  style: 'plain' | 'boxed' | 'highlighted';
  position: 'left' | 'center' | 'right';
  dynamic: boolean;
}

const DateBlock: React.FC<BlockProps> = ({
  id,
  data = {
    format: 'long',
    prefix: "Fait le",
    suffix: "",
    style: 'plain',
    position: 'right',
    dynamic: true
  } as DateBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { format, customFormat, prefix, suffix, style, position, dynamic } = data;

  const formatDate = (date: Date) => {
    switch (format) {
      case 'short':
        return date.toLocaleDateString('fr-FR');
      case 'long':
        return date.toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'custom':
        return customFormat || date.toLocaleDateString('fr-FR');
      default:
        return date.toLocaleDateString('fr-FR');
    }
  };

  const currentDate = dynamic ? new Date() : new Date('2024-01-15');
  const formattedDate = formatDate(currentDate);

  const positionClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  const styleClasses = {
    plain: "text-foreground",
    boxed: "border border-border p-2 rounded bg-accent/10",
    highlighted: "bg-primary/10 text-primary p-2 rounded font-medium"
  };

  return (
    <div 
      className={cn(
        "w-full transition-all duration-200",
        positionClasses[position],
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-md",
        "cursor-pointer py-2",
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      <div className={cn(
        "inline-flex items-center gap-2",
        styleClasses[style]
      )}>
        <Calendar className="w-4 h-4" />
        <span>
          {prefix && `${prefix} `}
          {formattedDate}
          {suffix && ` ${suffix}`}
        </span>
      </div>
    </div>
  );
};

export default DateBlock;