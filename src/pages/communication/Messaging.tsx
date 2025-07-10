import React, { Suspense } from 'react';
import { ModuleLayout } from '@/components/layouts/ModuleLayout';
import { MessagesList } from '@/components/communication/MessagesList';
import { ChatWindow } from '@/components/communication/ChatWindow';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Messaging() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationProvider>
        <ModuleLayout 
          showHeader={true}
          title="Messagerie"
          subtitle="Chat en temps réel et messages privés"
        >
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          }>
            <div className="h-[calc(100vh-16rem)] flex">
              <div className="w-1/3 border-r border-border">
                <MessagesList />
              </div>
              <div className="flex-1">
                <ChatWindow />
              </div>
            </div>
          </Suspense>
        </ModuleLayout>
      </CommunicationProvider>
    </ProtectedRoute>
  );
}