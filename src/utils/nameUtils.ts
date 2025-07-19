
/**
 * Utility functions for handling student names
 */

export const formatStudentName = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`;
};

export const parseFullName = (fullName: string): { firstName: string; lastName: string } => {
  const parts = fullName.trim().split(' ');
  if (parts.length < 2) {
    return { firstName: fullName, lastName: '' };
  }
  
  // Assume first part is firstName, rest is lastName
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  
  return { firstName, lastName };
};

export const validateNameOrder = (fullName: string): boolean => {
  // Basic validation to check if name follows "Prénom Nom" format
  const parts = fullName.trim().split(' ');
  return parts.length >= 2 && parts.every(part => part.length > 0);
};
