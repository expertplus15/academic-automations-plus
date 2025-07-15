import React from 'react';
import { TemplateEditorProvider } from '@/contexts/TemplateEditorContext';
import { EditorLayout } from './layout/EditorLayout';
import { LoadingState } from './states/LoadingState';
import { EmptyState } from './states/EmptyState';
import { useDocumentTemplates } from '@/hooks/useDocumentTemplates';
import { Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RefactoredTemplateStudioProps {
  className?: string;
}

function TemplateStudioContent() {
  const { templates, loading } = useDocumentTemplates();

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show empty state
  if (templates.length === 0) {
    return <EmptyState />;
  }

  return <EditorLayout />;
}

export function RefactoredTemplateStudio({ className }: RefactoredTemplateStudioProps) {
  return (
    <TemplateEditorProvider>
      <div className={className}>
        <TemplateStudioContent />
        
        {/* Fullscreen controls are handled inside the context now */}
      </div>
    </TemplateEditorProvider>
  );
}