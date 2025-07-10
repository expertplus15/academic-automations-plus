import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ContactsList } from '@/components/communication/ContactsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Directory() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <ModuleLayout>
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Répertoire</h1>
            <p className="text-muted-foreground">Contacts étudiants, enseignants et personnel</p>
          </div>
          
          <ContactsList />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}