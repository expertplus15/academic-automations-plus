
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'default';
    case 'approved': return 'default';
    case 'generated': return 'default';
    case 'delivered': return 'default';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'approved': return 'Approuvé';
    case 'generated': return 'Généré';
    case 'delivered': return 'Livré';
    case 'rejected': return 'Rejeté';
    default: return status;
  }
};

export const getTemplateTypeLabel = (type: string) => {
  switch (type) {
    case 'certificate': return 'Certificat';
    case 'transcript': return 'Relevé';
    case 'attestation': return 'Attestation';
    default: return type;
  }
};
