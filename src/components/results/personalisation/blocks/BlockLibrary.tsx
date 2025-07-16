import React from 'react';
import { 
  HeaderBlock, 
  TableBlock, 
  SignatureBlock, 
  LogoBlock, 
  DateBlock, 
  VariableBlock, 
  QRCodeBlock, 
  FooterBlock, 
  SealBlock,
  BlockType,
  BlockProps 
} from './index';

interface BlockLibraryProps {
  type: BlockType;
  id: string;
  data?: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, data: any) => void;
  className?: string;
}

export const BlockLibrary: React.FC<BlockLibraryProps> = ({ type, ...props }) => {
  switch (type) {
    case 'header':
      return <HeaderBlock {...props} />;
    case 'table':
      return <TableBlock {...props} />;
    case 'signature':
      return <SignatureBlock {...props} />;
    case 'logo':
      return <LogoBlock {...props} />;
    case 'date':
      return <DateBlock {...props} />;
    case 'variable':
      return <VariableBlock {...props} />;
    case 'qrcode':
      return <QRCodeBlock {...props} />;
    case 'footer':
      return <FooterBlock {...props} />;
    case 'seal':
      return <SealBlock {...props} />;
    default:
      return (
        <div className="p-4 bg-muted/50 border border-dashed border-muted-foreground/30 rounded-md">
          <p className="text-sm text-muted-foreground">
            Bloc non reconnu: {type}
          </p>
        </div>
      );
  }
};

// Metadata for each block type
export const blockMetadata = {
  header: {
    name: 'En-tête Officiel',
    description: 'En-tête avec logo et informations institutionnelles',
    category: 'institutional',
    defaultData: {
      institution: "ÉTABLISSEMENT SCOLAIRE",
      address: "123 Rue de l'Éducation, 75001 Paris",
      phone: "01 23 45 67 89",
      email: "contact@ecole.fr",
      style: 'formal'
    }
  },
  table: {
    name: 'Tableau de Notes',
    description: 'Tableau formaté pour les notes et données',
    category: 'specialized',
    defaultData: {
      title: "Tableau de Notes",
      columns: ["Matière", "Note", "Coefficient"],
      rows: [["Mathématiques", 16, 3], ["Français", 14, 2]],
      style: 'academic',
      showHeader: true
    }
  },
  signature: {
    name: 'Zone de Signature',
    description: 'Bloc pour signature officielle',
    category: 'institutional',
    defaultData: {
      title: "Le Directeur",
      position: "Directeur des Études",
      style: 'formal',
      includeDate: true,
      includeLocation: true
    }
  },
  logo: {
    name: 'Logo Institution',
    description: 'Logo de l\'établissement',
    category: 'institutional',
    defaultData: {
      alt: "Logo de l'établissement",
      size: 'medium',
      position: 'center',
      style: 'default'
    }
  },
  date: {
    name: 'Date Dynamique',
    description: 'Date automatique ou personnalisée',
    category: 'specialized',
    defaultData: {
      format: 'long',
      prefix: "Fait le",
      style: 'plain',
      position: 'right',
      dynamic: true
    }
  },
  variable: {
    name: 'Variable Dynamique',
    description: 'Champ de données dynamique',
    category: 'specialized',
    defaultData: {
      variable: "student_name",
      label: "Nom de l'étudiant",
      format: 'text',
      style: 'inline'
    }
  },
  qrcode: {
    name: 'Code QR',
    description: 'Code QR pour vérification',
    category: 'specialized',
    defaultData: {
      data: "https://ecole.fr/verify",
      size: 'medium',
      position: 'right',
      label: "Vérification",
      style: 'bordered'
    }
  },
  footer: {
    name: 'Pied de Page',
    description: 'Pied de page officiel',
    category: 'institutional',
    defaultData: {
      content: "Document officiel",
      style: 'formal',
      includePageNumber: true
    }
  },
  seal: {
    name: 'Sceau Officiel',
    description: 'Cachet ou tampon officiel',
    category: 'institutional',
    defaultData: {
      text: "OFFICIEL",
      size: 'medium',
      position: 'right',
      style: 'circle',
      color: 'primary'
    }
  }
} as const;