import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';
import { QrCode } from 'lucide-react';

interface QRCodeBlockData {
  data: string;
  size: 'small' | 'medium' | 'large';
  position: 'left' | 'center' | 'right';
  label?: string;
  style: 'default' | 'bordered' | 'rounded';
}

const QRCodeBlock: React.FC<BlockProps> = ({
  id,
  data = {
    data: "https://ecole.fr/verify/student/123456",
    size: 'medium',
    position: 'right',
    label: "Vérification en ligne",
    style: 'bordered'
  } as QRCodeBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { data: qrData, size, position, label, style } = data;

  const sizeClasses = {
    small: "h-16 w-16",
    medium: "h-24 w-24",
    large: "h-32 w-32"
  };

  const positionClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end"
  };

  const styleClasses = {
    default: "",
    bordered: "border-2 border-border p-2 rounded",
    rounded: "rounded-lg overflow-hidden"
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
      <div className="flex flex-col items-center gap-2">
        <div className={cn(
          "flex items-center justify-center bg-background",
          sizeClasses[size],
          styleClasses[style]
        )}>
          {/* Placeholder QR Code - in a real app, use a QR code library */}
          <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
            <QrCode className="w-1/2 h-1/2 text-foreground" />
          </div>
        </div>
        
        {label && (
          <span className="text-xs text-muted-foreground text-center max-w-24">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default QRCodeBlock;