import React, { createContext, useContext, ReactNode } from 'react';
import { useTemplateEditor } from '@/hooks/useTemplateEditor';

interface TemplateEditorContextType {
  state: ReturnType<typeof useTemplateEditor>['state'];
  actions: ReturnType<typeof useTemplateEditor>['actions'];
  templates: ReturnType<typeof useTemplateEditor>['templates'];
  documentTemplates: ReturnType<typeof useTemplateEditor>['documentTemplates'];
  currentTemplate: ReturnType<typeof useTemplateEditor>['currentTemplate'];
  loading: ReturnType<typeof useTemplateEditor>['loading'];
}

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