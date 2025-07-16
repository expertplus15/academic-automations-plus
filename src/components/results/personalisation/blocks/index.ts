export { default as HeaderBlock } from './HeaderBlock';
export { default as TableBlock } from './TableBlock';
export { default as SignatureBlock } from './SignatureBlock';
export { default as LogoBlock } from './LogoBlock';
export { default as DateBlock } from './DateBlock';
export { default as VariableBlock } from './VariableBlock';
export { default as QRCodeBlock } from './QRCodeBlock';
export { default as FooterBlock } from './FooterBlock';
export { default as SealBlock } from './SealBlock';

export type BlockType = 
  | 'header'
  | 'table'
  | 'signature'
  | 'logo'
  | 'date'
  | 'variable'
  | 'qrcode'
  | 'footer'
  | 'seal';

export interface BlockProps {
  id: string;
  data?: any;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, data: any) => void;
  className?: string;
}