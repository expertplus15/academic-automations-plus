
import { supabase } from '@/integrations/supabase/client';
import { ResourceRequirement } from './types';

export const analyzeResourceRequirements = async (examData: any): Promise<ResourceRequirement[]> => {
  const requirements: ResourceRequirement[] = [];

  // Besoins en salles basés sur le nombre d'étudiants
  const { data: registrations } = await supabase
    .from('exam_registrations')
    .select('*')
    .eq('exam_id', examData.id)
    .eq('status', 'registered');

  const studentCount = registrations?.length || examData.max_students || 50;
  
  // Calculer le nombre de salles nécessaires
  const roomsNeeded = Math.ceil(studentCount / 30); // 30 étudiants max par salle
  
  for (let i = 0; i < roomsNeeded; i++) {
    requirements.push({
      type: 'room',
      id: `room_${i}`,
      name: `Salle d'examen ${i + 1}`,
      quantity: 1,
      priority: 'required',
      specifications: {
        capacity: Math.min(studentCount - (i * 30), 30),
        examType: examData.exam_type,
        accessibility: true
      }
    });
  }

  // Besoins en équipements basés sur le type d'examen
  const equipmentNeeds = getEquipmentRequirements(examData);
  requirements.push(...equipmentNeeds);

  // Matériels spécifiques à la matière
  const materialNeeds = await getMaterialRequirements(examData);
  requirements.push(...materialNeeds);

  return requirements;
};

export const getEquipmentRequirements = (examData: any): ResourceRequirement[] => {
  const equipment: ResourceRequirement[] = [];

  // Équipements selon le type d'examen
  switch (examData.exam_type) {
    case 'practical':
      equipment.push({
        type: 'equipment',
        id: 'computers',
        name: 'Ordinateurs',
        quantity: examData.max_students || 30,
        priority: 'required'
      });
      break;
    
    case 'oral':
      equipment.push({
        type: 'equipment',
        id: 'microphones',
        name: 'Microphones',
        quantity: 2,
        priority: 'preferred'
      });
      break;
    
    default:
      // Équipements de base pour examens écrits
      equipment.push({
        type: 'equipment',
        id: 'desks',
        name: 'Tables individuelles',
        quantity: examData.max_students || 30,
        priority: 'required'
      });
  }

  return equipment;
};

export const getMaterialRequirements = async (examData: any): Promise<ResourceRequirement[]> => {
  const materials: ResourceRequirement[] = [];

  // Récupérer les matériels requis depuis la configuration de l'examen
  const materialsRequired = examData.materials_required;
  if (materialsRequired && Array.isArray(materialsRequired) && materialsRequired.length > 0) {
    for (const material of materialsRequired) {
      materials.push({
        type: 'material',
        id: material.id || material.name.toLowerCase().replace(/\s+/g, '_'),
        name: material.name,
        quantity: material.quantity || 1,
        priority: material.required ? 'required' : 'optional'
      });
    }
  }

  return materials;
};
