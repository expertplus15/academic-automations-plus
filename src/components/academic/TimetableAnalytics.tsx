
import React, { useState } from 'react';
import { AnalyticsHeader } from './analytics/AnalyticsHeader';
import { AnalyticsMetrics } from './analytics/AnalyticsMetrics';
import { AnalyticsCharts } from './analytics/AnalyticsCharts';

export function TimetableAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedProgram, setSelectedProgram] = useState('all');

  return (
    <div className="space-y-6">
      {/* En-tête et filtres */}
      <AnalyticsHeader
        selectedPeriod={selectedPeriod}
        selectedProgram={selectedProgram}
        onPeriodChange={setSelectedPeriod}
        onProgramChange={setSelectedProgram}
      />

      {/* Métriques clés */}
      <AnalyticsMetrics />

      {/* Graphiques et analytics */}
      <AnalyticsCharts />
    </div>
  );
}
