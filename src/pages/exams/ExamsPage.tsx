
import React from 'react';
import { DUT2GEDashboard } from '@/components/exams/DUT2GEDashboard';

export default function ExamsPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Module Examens & Organisation</h1>
            <p className="text-muted-foreground mt-2">
              Gestion complète des sessions d'examens DUT2-GE avec IA
            </p>
          </div>
        </div>

        {/* Dashboard DUT2-GE */}
        <DUT2GEDashboard />
      </div>
    </div>
  );
}
