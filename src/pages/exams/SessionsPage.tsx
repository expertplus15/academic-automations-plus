
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionManagementPanel } from '@/components/exams/sessions/SessionManagementPanel';

export default function SessionsPage() {
  // IDs pour DUT Gestion des Entreprises et année académique courante
  const ACADEMIC_YEAR_ID = '550e8400-e29b-41d4-a716-446655440001';
  const PROGRAM_ID = '550e8400-e29b-41d4-a716-446655440002'; // À adapter selon les données

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Sessions d'Examens</h1>
            <p className="text-muted-foreground mt-2">
              Configuration et suivi des sessions DUT2-GE
            </p>
          </div>
        </div>

        {/* Panel principal */}
        <SessionManagementPanel
          academicYearId={ACADEMIC_YEAR_ID}
          programId={PROGRAM_ID}
        />
      </div>
    </div>
  );
}
