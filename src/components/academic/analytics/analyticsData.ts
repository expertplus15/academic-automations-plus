
export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const roomUsageData = [
  { name: 'A101', usage: 85, capacity: 100 },
  { name: 'A102', usage: 72, capacity: 80 },
  { name: 'B201', usage: 95, capacity: 120 },
  { name: 'B202', usage: 68, capacity: 90 },
  { name: 'C301', usage: 78, capacity: 100 },
  { name: 'Lab1', usage: 90, capacity: 30 },
];

export const weeklyHoursData = [
  { day: 'Lun', courses: 8, practical: 4, exams: 2 },
  { day: 'Mar', courses: 10, practical: 6, exams: 1 },
  { day: 'Mer', courses: 7, practical: 8, exams: 3 },
  { day: 'Jeu', courses: 9, practical: 5, exams: 2 },
  { day: 'Ven', courses: 6, practical: 3, exams: 4 },
  { day: 'Sam', courses: 2, practical: 1, exams: 1 },
];

export const subjectDistributionData = [
  { name: 'Mathématiques', value: 30, hours: 120 },
  { name: 'Informatique', value: 25, hours: 100 },
  { name: 'Physique', value: 20, hours: 80 },
  { name: 'Anglais', value: 15, hours: 60 },
  { name: 'Autres', value: 10, hours: 40 },
];

export const conflictTrendsData = [
  { week: 'S1', conflicts: 12, resolved: 10 },
  { week: 'S2', conflicts: 8, resolved: 8 },
  { week: 'S3', conflicts: 15, resolved: 13 },
  { week: 'S4', conflicts: 6, resolved: 6 },
  { week: 'S5', conflicts: 9, resolved: 8 },
  { week: 'S6', conflicts: 4, resolved: 4 },
];

export const teacherWorkloadData = [
  { name: 'Dr. Martin', hours: 18, efficiency: 92 },
  { name: 'Prof. Dubois', hours: 20, efficiency: 88 },
  { name: 'Dr. Leroy', hours: 16, efficiency: 95 },
  { name: 'Prof. Bernard', hours: 22, efficiency: 85 },
  { name: 'Dr. Moreau', hours: 14, efficiency: 90 },
];

export const keyMetrics = [
  {
    title: 'Taux d\'occupation',
    value: '78%',
    trend: '+5%',
    color: 'text-blue-600'
  },
  {
    title: 'Heures planifiées',
    value: '234h',
    trend: '+12h',
    color: 'text-green-600'
  },
  {
    title: 'Conflits résolus',
    value: '95%',
    trend: '+3%',
    color: 'text-orange-600'
  },
  {
    title: 'Étudiants impactés',
    value: '1,247',
    trend: '+89',
    color: 'text-purple-600'
  }
];
