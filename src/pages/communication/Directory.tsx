import React from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { ContactsList } from '@/components/communication/ContactsList';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommunicationHeader } from '@/components/communication/CommunicationHeader';
import { Users, UserPlus } from 'lucide-react';

export default function Directory() {
  const headerActions = [
    {
      label: "Ajouter contact",
      icon: UserPlus,
      onClick: () => {},
      variant: 'default' as const
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <ModuleLayout 
        showHeader={true}
        title="Répertoire"
        subtitle="Contacts étudiants, enseignants et personnel"
      >
        <div className="p-6">
          <ContactsList />
        </div>
      </ModuleLayout>
    </ProtectedRoute>
  );
}