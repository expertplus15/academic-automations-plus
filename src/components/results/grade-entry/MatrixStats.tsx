import React from 'react';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/components/documents/enhanced/StatsCard';

interface MatrixStatsProps {
  studentsCount: number;
  isLoading: boolean;
  dutgeStats?: any;
}

export function MatrixStats({ studentsCount, isLoading, dutgeStats }: MatrixStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Étudiants"
        value={studentsCount}
        description="Total des étudiants actifs"
        icon={Users}
        color="blue"
      />
      
      <StatsCard
        title="Matières"
        value={dutgeStats?.subjectsCount || 0}
        description="Matières disponibles"
        icon={BookOpen}
        color="green"
      />
      
      <StatsCard
        title="Évaluations"
        value={dutgeStats?.evaluationsCount || 0}
        description="Évaluations en cours"
        icon={GraduationCap}
        color="purple"
      />
      
      <StatsCard
        title="Taux de saisie"
        value={`${dutgeStats?.completionRate || 0}%`}
        description="Notes saisies"
        icon={TrendingUp}
        color="orange"
      />
    </div>
  );
}