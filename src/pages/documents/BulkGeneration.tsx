import React from 'react';
import { DocumentsModuleLayout } from '@/components/layouts/DocumentsModuleLayout';
import { BulkDocumentGenerator } from '@/components/documents/BulkDocumentGenerator';

export default function BulkGeneration() {
  return (
    <DocumentsModuleLayout>
      <div className="p-6">
        <BulkDocumentGenerator />
      </div>
    </DocumentsModuleLayout>
  );
}