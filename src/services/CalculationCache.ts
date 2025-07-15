import { LRUCache } from 'lru-cache';

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CalculationCache {
  private cache: LRUCache<string, CacheEntry<any>>;
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  constructor(maxSize = 1000) {
    this.cache = new LRUCache<string, CacheEntry<any>>({
      max: maxSize,
      dispose: (value, key) => {
        console.log(`Cache entry disposed: ${key}`);
      }
    });
  }

  private generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `${prefix}:${sortedParams}`;
  }

  set<T>(prefix: string, params: Record<string, any>, data: T, ttl?: number): void {
    const key = this.generateKey(prefix, params);
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };
    this.cache.set(key, entry);
  }

  get<T>(prefix: string, params: Record<string, any>): T | null {
    const key = this.generateKey(prefix, params);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  invalidate(prefix: string, params?: Record<string, any>): void {
    if (params) {
      const key = this.generateKey(prefix, params);
      this.cache.delete(key);
    } else {
      // Invalidate all entries with this prefix
      for (const [key] of this.cache.entries()) {
        if (key.startsWith(`${prefix}:`)) {
          this.cache.delete(key);
        }
      }
    }
  }

  invalidateStudent(studentId: string): void {
    for (const [key] of this.cache.entries()) {
      if (key.includes(`student_id:${studentId}`)) {
        this.cache.delete(key);
      }
    }
  }

  invalidateAcademicYear(academicYearId: string): void {
    for (const [key] of this.cache.entries()) {
      if (key.includes(`academic_year_id:${academicYearId}`)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      hitRate: this.cache.calculatedSize / (this.cache.calculatedSize + this.cache.size) || 0
    };
  }
}

// Singleton instance
export const calculationCache = new CalculationCache();