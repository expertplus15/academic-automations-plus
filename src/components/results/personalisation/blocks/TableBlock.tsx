import React from 'react';
import { BlockProps } from './index';
import { cn } from '@/lib/utils';

interface TableBlockData {
  title?: string;
  columns: string[];
  rows: (string | number)[][];
  style: 'bordered' | 'striped' | 'minimal' | 'academic';
  showHeader: boolean;
}

const TableBlock: React.FC<BlockProps> = ({
  id,
  data = {
    title: "Tableau de Notes",
    columns: ["Matière", "Note", "Coefficient", "Moyenne"],
    rows: [
      ["Mathématiques", 16, 3, 15.5],
      ["Français", 14, 2, 14.2],
      ["Histoire", 15, 1, 15.8]
    ],
    style: 'academic',
    showHeader: true
  } as TableBlockData,
  isSelected,
  onSelect,
  className
}) => {
  const { title, columns, rows, style, showHeader } = data;

  const tableStyles = {
    bordered: "border-2 border-border",
    striped: "border border-border",
    minimal: "border-0",
    academic: "border-2 border-primary/20"
  };

  const headerStyles = {
    bordered: "bg-accent text-accent-foreground",
    striped: "bg-primary text-primary-foreground",
    minimal: "bg-transparent border-b-2 border-border",
    academic: "bg-primary/10 text-primary font-semibold"
  };

  const rowStyles = {
    bordered: "border-b border-border",
    striped: "even:bg-accent/50",
    minimal: "border-b border-border/50",
    academic: "border-b border-primary/10 even:bg-primary/5"
  };

  return (
    <div 
      className={cn(
        "w-full transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2 rounded-md",
        "cursor-pointer",
        className
      )}
      onClick={() => onSelect?.(id)}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
          {title}
        </h3>
      )}
      
      <div className="overflow-x-auto">
        <table className={cn("w-full", tableStyles[style])}>
          {showHeader && (
            <thead>
              <tr className={headerStyles[style]}>
                {columns.map((column, index) => (
                  <th 
                    key={index}
                    className="px-4 py-3 text-left font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={cn("transition-colors", rowStyles[style])}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-4 py-2 text-foreground"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableBlock;