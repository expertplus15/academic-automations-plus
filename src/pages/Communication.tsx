import React, { Suspense } from 'react';
import { CommunicationModuleLayout } from '@/components/layouts/CommunicationModuleLayout';
import { CommunicationBanner } from '@/components/communication/CommunicationBanner';
import { CommunicationStatusCards } from '@/components/communication/CommunicationStatusCards';
import { CommunicationModuleCards } from '@/components/communication/CommunicationModuleCards';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Communication() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'teacher', 'hr', 'student']}>
      <CommunicationProvider>
        <CommunicationModuleLayout showHeader={false}>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          }>
            <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
              <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="space-y-8 animate-fade-in">
                  <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
                    <CommunicationBanner />
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <CommunicationStatusCards />
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <CommunicationModuleCards />
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </CommunicationModuleLayout>
      </CommunicationProvider>
    </ProtectedRoute>
  );
}