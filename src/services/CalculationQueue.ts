import { CalculationOptions, CalculationResult } from '@/types/calculations';

export interface QueueItem {
  id: string;
  options: CalculationOptions;
  priority: number;
  addedAt: Date;
  startedAt?: Date;
  resolver: (result: CalculationResult) => void;
  rejecter: (error: Error) => void;
}

export class CalculationQueue {
  private queue: QueueItem[] = [];
  private running: Map<string, QueueItem> = new Map();
  private maxConcurrency: number;
  private isProcessing = false;

  constructor(maxConcurrency = 3) {
    this.maxConcurrency = maxConcurrency;
  }

  async add(options: CalculationOptions): Promise<CalculationResult> {
    return new Promise((resolve, reject) => {
      const id = crypto.randomUUID();
      const priority = this.getPriorityValue(options.priority || 'normal');
      
      const queueItem: QueueItem = {
        id,
        options,
        priority,
        addedAt: new Date(),
        resolver: resolve,
        rejecter: reject
      };

      // Insert in priority order
      const insertIndex = this.queue.findIndex(item => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(queueItem);
      } else {
        this.queue.splice(insertIndex, 0, queueItem);
      }

      this.processQueue();
    });
  }

  private getPriorityValue(priority: 'low' | 'normal' | 'high'): number {
    switch (priority) {
      case 'high': return 3;
      case 'normal': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.running.size >= this.maxConcurrency) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0 && this.running.size < this.maxConcurrency) {
      const item = this.queue.shift()!;
      this.running.set(item.id, item);
      item.startedAt = new Date();

      // Process item asynchronously
      this.processItem(item).catch(error => {
        item.rejecter(error);
      }).finally(() => {
        this.running.delete(item.id);
        this.processQueue(); // Continue processing
      });
    }

    this.isProcessing = false;
  }

  private async processItem(item: QueueItem): Promise<void> {
    try {
      const result = await this.executeCalculation(item.options);
      item.resolver(result);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Calculation failed');
    }
  }

  private async executeCalculation(options: CalculationOptions): Promise<CalculationResult> {
    const startTime = new Date();
    
    try {
      let result: any;
      
      switch (options.type) {
        case 'averages':
          result = await this.calculateAverages(options.params);
          break;
        case 'ects':
          result = await this.calculateECTS(options.params);
          break;
        case 'all':
          result = await this.calculateAll(options.params);
          break;
        case 'advanced':
          result = await this.calculateAdvanced(options.params);
          break;
        default:
          throw new Error(`Unknown calculation type: ${options.type}`);
      }

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      return {
        id: crypto.randomUUID(),
        type: options.type,
        status: 'success',
        progress: 100,
        message: 'Calculation completed successfully',
        startTime,
        endTime,
        duration,
        details: result
      };
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      return {
        id: crypto.randomUUID(),
        type: options.type,
        status: 'error',
        progress: 0,
        message: error instanceof Error ? error.message : 'Calculation failed',
        startTime,
        endTime,
        duration
      };
    }
  }

  private async calculateAverages(params: any): Promise<any> {
    // Simulate calculation with progress updates
    await this.delay(1000);
    return { type: 'averages', processed: 10, total: 10 };
  }

  private async calculateECTS(params: any): Promise<any> {
    await this.delay(1500);
    return { type: 'ects', processed: 5, total: 5 };
  }

  private async calculateAll(params: any): Promise<any> {
    await this.delay(2000);
    return { type: 'all', processed: 15, total: 15 };
  }

  private async calculateAdvanced(params: any): Promise<any> {
    await this.delay(3000);
    return { type: 'advanced', processed: 20, total: 20 };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getQueueStatus() {
    return {
      pending: this.queue.length,
      running: this.running.size,
      total: this.queue.length + this.running.size
    };
  }

  clear(): void {
    this.queue.forEach(item => {
      item.rejecter(new Error('Queue cleared'));
    });
    this.queue = [];
    
    this.running.forEach(item => {
      item.rejecter(new Error('Queue cleared'));
    });
    this.running.clear();
  }
}

// Singleton instance
export const calculationQueue = new CalculationQueue();