import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';

interface VariableBlockData {
  variable: string;
  label?: string;
  defaultValue?: string;
  format?: 'text' | 'number' | 'currency' | 'percentage';
  style: 'inline' | 'badge' | 'highlighted';
}

const VariableBlock: React.FC<BlockProps> = ({
  id,
  data = {
    variable: "student_name",
    label: "Nom de l'étudiant",
    defaultValue: "Jean DUPONT",
    format: 'text',
    style: 'inline'
  } as VariableBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { variable, label, defaultValue, format, style } = data;

  const formatValue = (value: string) => {
    switch (format) {
      case 'number':
        return parseFloat(value).toFixed(2);
      case 'currency':
        return `${parseFloat(value).toFixed(2)} €`;
      case 'percentage':
        return `${parseFloat(value).toFixed(1)} %`;
      default:
        return value;
    }
  };

  const displayValue = defaultValue ? formatValue(defaultValue) : `{${variable}}`;

  const styleClasses = {
    inline: "text-foreground",
    badge: "bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm",
    highlighted: "bg-primary text-primary-foreground px-3 py-1 rounded-md font-medium"
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-md",
        "cursor-pointer",
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      {style !== 'inline' && (
        <Zap className="w-3 h-3" />
      )}
      <span className={cn(styleClasses[style])}>
        {displayValue}
      </span>
      {label && style === 'inline' && (
        <span className="text-xs text-muted-foreground">({label})</span>
      )}
    </div>
  );
};

export default VariableBlock;