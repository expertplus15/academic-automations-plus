// Singleton pour éviter les multiples instances de synchronisation
class SyncManager {
  private static instance: SyncManager;
  private isInitialized = false;
  private channels: any[] = [];

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  initialize() {
    return this.isInitialized;
  }

  setInitialized(value: boolean) {
    this.isInitialized = value;
  }

  addChannel(channel: any) {
    this.channels.push(channel);
  }

  clearChannels(supabaseClient?: any) {
    this.channels.forEach(channel => {
      try {
        if (supabaseClient) {
          supabaseClient.removeChannel(channel);
        }
      } catch (error) {
        console.warn('Erreur lors de la suppression du canal:', error);
      }
    });
    this.channels = [];
  }

  reset(supabaseClient?: any) {
    this.clearChannels(supabaseClient);
    this.isInitialized = false;
  }
}

export default SyncManager;