
export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
};

export const getAlertTypeLabel = (type: string) => {
  switch (type) {
    case 'low_grade': return 'Note faible';
    case 'excessive_absences': return 'Absences excessives';
    case 'failing_subject': return 'Échec matière';
    case 'attendance_drop': return 'Chute assiduité';
    case 'at_risk': return 'Risque d\'échec';
    default: return type;
  }
};
