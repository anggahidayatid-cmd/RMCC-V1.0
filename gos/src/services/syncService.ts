const CHANNEL_NAME = 'rmcc_realtime_sync_channel';
let broadcastChannel: BroadcastChannel | null = null;

try {
  if (typeof window !== 'undefined' && window.BroadcastChannel) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

export type SyncEventType =
  | 'CAMPAIGNS_UPDATED'
  | 'GOS_UPDATED'
  | 'CALENDAR_UPDATED'
  | 'THEME_UPDATED'
  | 'SETTINGS_UPDATED'
  | 'CRM_UPDATED';

export const emitSyncEvent = (type: SyncEventType, payload?: any) => {
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch (e) {
      console.warn('BroadcastChannel postMessage error', e);
    }
  }

  try {
    localStorage.setItem('rmcc_last_sync', JSON.stringify({ type, payload, timestamp: Date.now() }));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('rmcc_sync', { detail: { type, payload } }));
  }
};

export const subscribeSyncEvents = (callback: (type: SyncEventType, payload?: any) => void) => {
  if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type) {
        callback(event.data.type, event.data.payload);
      }
    };
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'rmcc_last_sync' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && parsed.type) {
          callback(parsed.type, parsed.payload);
        }
      } catch (err) {}
    }
  };

  const handleCustom = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail && customEvent.detail.type) {
      callback(customEvent.detail.type, customEvent.detail.payload);
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('rmcc_sync', handleCustom as EventListener);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.onmessage = null;
    }
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('rmcc_sync', handleCustom as EventListener);
  };
};
