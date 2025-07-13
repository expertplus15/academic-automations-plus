import { supabase } from "@/integrations/supabase/client";

// CRDT-based collaborative editing service
export interface CRDTOperation {
  id: string;
  type: 'insert' | 'delete' | 'update' | 'cursor_move';
  position: number;
  cellId: string;
  value: any;
  userId: string;
  timestamp: number;
  dependencies: string[];
  vectorClock: { [userId: string]: number };
}

export interface CursorPosition {
  userId: string;
  cellId: string;
  position: number;
  color: string;
  userName: string;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  cellId?: string; // Optional reference to a specific cell
  timestamp: number;
  type: 'text' | 'comment' | 'mention';
}

export class CRDTService {
  private static operations: Map<string, CRDTOperation[]> = new Map();
  private static cursors: Map<string, CursorPosition> = new Map();
  private static vectorClocks: Map<string, { [userId: string]: number }> = new Map();
  private static sessionId: string = '';
  private static userId: string = '';
  private static channel: any = null;

  // Initialize CRDT session
  static async initializeSession(resourceId: string, userId: string, userName: string) {
    this.sessionId = `crdt_${resourceId}`;
    this.userId = userId;
    
    // Setup realtime channel for CRDT operations
    this.channel = supabase
      .channel(this.sessionId)
      .on('broadcast', { event: 'operation' }, (payload) => {
        this.handleRemoteOperation(payload);
      })
      .on('broadcast', { event: 'cursor' }, (payload) => {
        this.handleCursorUpdate(payload);
      })
      .on('broadcast', { event: 'chat' }, (payload) => {
        this.handleChatMessage(payload);
      })
      .on('presence', { event: 'sync' }, () => {
        this.syncPresence();
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.channel.track({
            userId,
            userName,
            joinedAt: Date.now(),
            color: this.generateUserColor(userId)
          });
        }
      });

    return this.sessionId;
  }

  // Generate consistent color for user
  private static generateUserColor(userId: string): string {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
      '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
    ];
    const hash = userId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  // Apply local operation and broadcast
  static async applyOperation(operation: Omit<CRDTOperation, 'id' | 'timestamp' | 'vectorClock' | 'dependencies'>) {
    const vectorClock = this.getVectorClock(this.sessionId);
    vectorClock[this.userId] = (vectorClock[this.userId] || 0) + 1;

    const fullOperation: CRDTOperation = {
      ...operation,
      id: `${this.userId}_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      vectorClock: { ...vectorClock },
      dependencies: this.getOperationDependencies(operation.cellId)
    };

    // Store operation locally
    const ops = this.operations.get(this.sessionId) || [];
    ops.push(fullOperation);
    this.operations.set(this.sessionId, ops);

    // Update vector clock
    this.vectorClocks.set(this.sessionId, vectorClock);

    // Broadcast to other clients
    await this.channel?.send({
      type: 'broadcast',
      event: 'operation',
      payload: fullOperation
    });

    return fullOperation;
  }

  // Handle remote operations
  private static handleRemoteOperation(payload: any) {
    const operation = payload.payload as CRDTOperation;
    
    // Check if operation is already applied
    const ops = this.operations.get(this.sessionId) || [];
    if (ops.find(op => op.id === operation.id)) {
      return;
    }

    // Add to operations log
    ops.push(operation);
    this.operations.set(this.sessionId, ops);

    // Update vector clock
    const vectorClock = this.getVectorClock(this.sessionId);
    Object.keys(operation.vectorClock).forEach(userId => {
      vectorClock[userId] = Math.max(
        vectorClock[userId] || 0,
        operation.vectorClock[userId]
      );
    });
    this.vectorClocks.set(this.sessionId, vectorClock);

    // Apply operation to local state
    this.applyRemoteOperation(operation);
  }

  // Apply remote operation to local state
  private static applyRemoteOperation(operation: CRDTOperation) {
    // Emit event for UI to handle
    window.dispatchEvent(new CustomEvent('crdt-operation', {
      detail: operation
    }));
  }

  // Update cursor position
  static async updateCursor(cellId: string, position: number) {
    const cursor: CursorPosition = {
      userId: this.userId,
      cellId,
      position,
      color: this.generateUserColor(this.userId),
      userName: 'Current User', // Should come from auth
      timestamp: Date.now()
    };

    this.cursors.set(this.userId, cursor);

    await this.channel?.send({
      type: 'broadcast',
      event: 'cursor',
      payload: cursor
    });
  }

  // Handle cursor updates
  private static handleCursorUpdate(payload: any) {
    const cursor = payload.payload as CursorPosition;
    this.cursors.set(cursor.userId, cursor);

    // Emit event for UI
    window.dispatchEvent(new CustomEvent('cursor-update', {
      detail: cursor
    }));
  }

  // Send chat message
  static async sendChatMessage(message: string, cellId?: string, type: 'text' | 'comment' = 'text') {
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random()}`,
      userId: this.userId,
      userName: 'Current User', // Should come from auth
      message,
      cellId,
      timestamp: Date.now(),
      type
    };

    await this.channel?.send({
      type: 'broadcast',
      event: 'chat',
      payload: chatMessage
    });

    return chatMessage;
  }

  // Handle chat messages
  private static handleChatMessage(payload: any) {
    const message = payload.payload as ChatMessage;
    
    // Emit event for UI
    window.dispatchEvent(new CustomEvent('chat-message', {
      detail: message
    }));
  }

  // Get operation dependencies
  private static getOperationDependencies(cellId: string): string[] {
    const ops = this.operations.get(this.sessionId) || [];
    return ops
      .filter(op => op.cellId === cellId)
      .map(op => op.id)
      .slice(-5); // Keep last 5 operations as dependencies
  }

  // Get vector clock
  private static getVectorClock(sessionId: string): { [userId: string]: number } {
    return this.vectorClocks.get(sessionId) || {};
  }

  // Sync presence
  private static syncPresence() {
    const presences = this.channel?.presenceState() || {};
    
    // Emit event for UI
    window.dispatchEvent(new CustomEvent('presence-sync', {
      detail: presences
    }));
  }

  // Get current cursors
  static getCursors(): CursorPosition[] {
    return Array.from(this.cursors.values())
      .filter(cursor => cursor.userId !== this.userId);
  }

  // Resolve conflicts using Last-Writer-Wins strategy
  static resolveConflicts(operations: CRDTOperation[]): CRDTOperation[] {
    const resolved: Map<string, CRDTOperation> = new Map();
    
    operations
      .sort((a, b) => {
        // First sort by vector clock dominance
        const aDominates = this.vectorClockDominates(a.vectorClock, b.vectorClock);
        const bDominates = this.vectorClockDominates(b.vectorClock, a.vectorClock);
        
        if (aDominates && !bDominates) return 1;
        if (bDominates && !aDominates) return -1;
        
        // If concurrent, use timestamp as tiebreaker
        return a.timestamp - b.timestamp;
      })
      .forEach(op => {
        resolved.set(op.cellId, op);
      });
    
    return Array.from(resolved.values());
  }

  // Check vector clock dominance
  private static vectorClockDominates(vc1: { [k: string]: number }, vc2: { [k: string]: number }): boolean {
    const allUsers = new Set([...Object.keys(vc1), ...Object.keys(vc2)]);
    let hasGreater = false;
    
    for (const user of allUsers) {
      const v1 = vc1[user] || 0;
      const v2 = vc2[user] || 0;
      
      if (v1 < v2) return false;
      if (v1 > v2) hasGreater = true;
    }
    
    return hasGreater;
  }

  // Cleanup session
  static cleanup() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.operations.clear();
    this.cursors.clear();
    this.vectorClocks.clear();
  }
}