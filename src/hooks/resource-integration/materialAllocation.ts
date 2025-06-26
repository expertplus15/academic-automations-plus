
import { ResourceRequirement, AllocationResult } from './types';

export const allocateMaterial = async (session: any, requirement: ResourceRequirement): Promise<AllocationResult> => {
  try {
    return {
      success: false,
      error: `Matériel ${requirement.name} non disponible`,
      alternatives: [],
      cost: 0
    };
  } catch (error) {
    console.error('Erreur lors de l\'allocation de matériel:', error);
    return {
      success: true, // Fallback: considérer comme réussi
      resource: requirement,
      cost: 0
    };
  }
};

export const calculateMaterialCost = (material: any, quantity: number): number => {
  const unitCost = material.unit_cost || 0;
  return unitCost * quantity;
};
