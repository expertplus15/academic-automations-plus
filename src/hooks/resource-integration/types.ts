
export interface ResourceRequirement {
  type: 'room' | 'equipment' | 'material';
  id: string;
  name: string;
  quantity: number;
  priority: 'required' | 'preferred' | 'optional';
  specifications?: Record<string, any>;
}

export interface ResourceAllocation {
  examId: string;
  sessionId: string;
  allocatedResources: ResourceRequirement[];
  alternativeOptions: ResourceRequirement[];
  conflicts: string[];
  allocationStatus: 'pending' | 'partial' | 'complete' | 'conflict';
  costEstimate?: number;
}

export interface ExamResourceSync {
  examId: string;
  resourceRequirements: ResourceRequirement[];
  allocations: ResourceAllocation[];
  availabilityStatus: 'available' | 'limited' | 'unavailable';
  syncStatus: 'pending' | 'synced' | 'conflict' | 'error';
  lastSyncAt?: Date;
}

export interface AllocationResult {
  success: boolean;
  resource?: ResourceRequirement;
  alternatives?: ResourceRequirement[];
  error?: string;
  cost?: number;
}
