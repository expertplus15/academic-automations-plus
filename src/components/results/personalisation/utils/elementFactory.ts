import { TemplateElement } from '../types';

export const elementFactory = {
  createElement: (elementType: string, position = { x: 50, y: 50 }): TemplateElement => {
    const id = `${elementType}-${Date.now()}`;
    
    return {
      id,
      type: elementType,
      x: position.x,
      y: position.y,
      width: getDefaultWidth(elementType),
      height: getDefaultHeight(elementType),
      content: getDefaultContent(elementType),
      style: getDefaultStyle(elementType)
    };
  }
};

function getDefaultWidth(type: string): number {
  switch (type) {
    case 'text':
    case 'variable':
      return 200;
    case 'header':
      return 400;
    case 'table':
      return 300;
    case 'qrcode':
    case 'logo':
      return 100;
    default:
      return 150;
  }
}

function getDefaultHeight(type: string): number {
  switch (type) {
    case 'text':
    case 'variable':
      return 40;
    case 'header':
      return 80;
    case 'table':
      return 150;
    case 'qrcode':
    case 'logo':
      return 100;
    default:
      return 60;
  }
}

function getDefaultContent(type: string) {
  const contentMap: Record<string, any> = {
    text: { text: 'Nouveau texte', fontSize: 14, fontWeight: 'normal' },
    heading: { text: 'Nouveau titre', fontSize: 20, fontWeight: 'bold' },
    image: { src: '', alt: 'Image' },
    variable: { variable: 'student.name', label: 'Nom étudiant' },
    table: { rows: 3, columns: 3, headers: ['Col 1', 'Col 2', 'Col 3'] },
    qrcode: { data: 'student.id', size: 100 },
    signature: { signatory: 'Directeur', title: 'Signature' },
    date: { format: 'DD/MM/YYYY', type: 'current' },
    logo: { src: '', institutionName: 'École' },
    header: { title: 'En-tête officiel', subtitle: 'Établissement' },
    footer: { text: 'Pied de page officiel' },
  };
  
  return contentMap[type] || { content: `Élément ${type}` };
}

function getDefaultStyle(type: string) {
  const styleMap: Record<string, any> = {
    text: { color: '#374151', textAlign: 'left', fontFamily: 'system-ui' },
    heading: { color: '#1F2937', textAlign: 'center', fontFamily: 'system-ui' },
    image: { borderRadius: 4, objectFit: 'contain' },
    variable: { color: '#6B7280', fontStyle: 'italic', backgroundColor: '#F3F4F6' },
    logo: { borderRadius: 8, filter: 'none' },
    header: { backgroundColor: '#F9FAFB', borderBottom: '2px solid #E5E7EB', padding: 16 },
    footer: { backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: 12 },
  };
  
  return styleMap[type] || { border: '1px solid #E5E7EB', borderRadius: 4 };
}