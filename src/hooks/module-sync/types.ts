
export interface ModuleSyncEvent {
  id: string;
  module: string;
  action: string;
  data: any;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface SyncConfiguration {
  enabledModules: string[];
  syncRules: Record<string, string[]>;
  autoSync: boolean;
  batchSize: number;
}
