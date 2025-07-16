import React, { createContext, useContext, ReactNode } from 'react';
import { useTemplateEditor } from '../hooks/useTemplateEditor';
import { TemplateEditorContextType } from '../types';

const TemplateEditorContext = createContext<TemplateEditorContextType | undefined>(undefined);

interface TemplateEditorProviderProps {
  children: ReactNode;
}

export function TemplateEditorProvider({ children }: TemplateEditorProviderProps) {
  const editorData = useTemplateEditor();

  return (
    <TemplateEditorContext.Provider value={editorData}>
      {children}
    </TemplateEditorContext.Provider>
  );
}

export function useTemplateEditorContext() {
  const context = useContext(TemplateEditorContext);
  if (context === undefined) {
    throw new Error('useTemplateEditorContext must be used within a TemplateEditorProvider');
  }
  return context;
}