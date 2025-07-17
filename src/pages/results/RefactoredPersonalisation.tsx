import React from 'react';
import { TemplateEditorProvider } from '@/components/results/personalisation/providers/TemplateEditorProvider';
import { SimpleDocumentEditor } from '@/components/results/personalisation/SimpleDocumentEditor';

export default function RefactoredPersonalisation() {
  return (
    <TemplateEditorProvider>
      <SimpleDocumentEditor />
    </TemplateEditorProvider>
  );
}