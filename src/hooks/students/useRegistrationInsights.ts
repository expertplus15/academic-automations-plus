import { useState, useEffect } from 'react';

export interface RegistrationInsights {
  // Dashboard metrics
  currentRegistrations: number;
  pendingValidations: number;
  validatedRegistrations: number;
  conversionRate: number;
  
  // Analytics metrics
  averageProcessingTime: number;
  abandonmentRate: number;
  satisfactionScore: number;
  
  // Shared trends
  weeklyTrend: number[];
  dailyTarget: {
    registrations: { current: number; target: number };
    validations: { current: number; target: number };
  };
  
  // Recent activity
  recentActivity: Array<{
    type: 'registration' | 'validation' | 'completion';
    count: number;
    timestamp: string;
  }>;
}

export function useRegistrationInsights() {
  const [insights, setInsights] = useState<RegistrationInsights>({
    currentRegistrations: 127,
    pendingValidations: 43,
    validatedRegistrations: 284,
    conversionRate: 89.3,
    averageProcessingTime: 3.2,
    abandonmentRate: 12.7,
    satisfactionScore: 4.6,
    weeklyTrend: [65, 78, 82, 94, 127],
    dailyTarget: {
      registrations: { current: 127, target: 150 },
      validations: { current: 43, target: 50 }
    },
    recentActivity: [
      { type: 'registration', count: 15, timestamp: '2 min' },
      { type: 'validation', count: 8, timestamp: '5 min' },
      { type: 'completion', count: 12, timestamp: '10 min' }
    ]
  });

  const [loading, setLoading] = useState(false);

  const refreshInsights = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Initial load
    refreshInsights();
  }, []);

  return {
    insights,
    loading,
    refreshInsights
  };
}