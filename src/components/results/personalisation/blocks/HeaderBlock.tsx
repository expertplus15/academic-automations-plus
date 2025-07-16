import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';

interface HeaderBlockData {
  institution: string;
  address: string;
  phone?: string;
  email?: string;
  logo?: string;
  style: 'formal' | 'modern' | 'classic';
}

const HeaderBlock: React.FC<BlockProps> = ({
  id,
  data = {
    institution: "ÉTABLISSEMENT SCOLAIRE",
    address: "123 Rue de l'Éducation, 75001 Paris",
    phone: "01 23 45 67 89",
    email: "contact@ecole.fr",
    style: 'formal'
  } as HeaderBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { institution, address, phone, email, logo, style } = data;

  const styleClasses = {
    formal: "border-b-4 border-primary bg-gradient-to-r from-background to-accent/5",
    modern: "bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg",
    classic: "border-y-2 border-primary/20 bg-background"
  };

  return (
    <div 
      className={cn(
        "p-6 transition-all duration-200",
        styleClasses[style],
        isSelected && "ring-2 ring-primary ring-offset-2",
        "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      <div className="flex items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center gap-4">
          {logo ? (
            <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
          ) : (
            <div className="h-16 w-16 bg-primary/10 rounded-md flex items-center justify-center">
              <span className="text-primary font-bold text-xl">
                {institution.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground tracking-wide">
              {institution}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {address}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="text-right text-sm text-muted-foreground space-y-1">
          {phone && (
            <div className="flex items-center justify-end gap-2">
              <span>📞</span>
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center justify-end gap-2">
              <span>✉️</span>
              <span>{email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBlock;