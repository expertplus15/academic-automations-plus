
// Fonctions utilitaires pour la gestion des dates dans l'emploi du temps

export function getCurrentWeekDates(): string[] {
  const today = new Date();
  const currentDay = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + 1);
  
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    week.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
  }
  return week;
}

export function generateTimeSlots(): string[] {
  const slots = [];
  for (let hour = 8; hour <= 18; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
}

export function shouldShowCourse(time: string, dayIndex: number): boolean {
  // Logique simple pour afficher des cours d'exemple
  if (dayIndex === 6) return false; // Pas de cours le dimanche
  if (time === '08:00' && [0, 2, 4].includes(dayIndex)) return true;
  if (time === '10:00' && [1, 3].includes(dayIndex)) return true;
  if (time === '14:00' && [0, 1, 2].includes(dayIndex)) return true;
  return false;
}
