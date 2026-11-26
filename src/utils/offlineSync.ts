'use client';

import { useState, useEffect, useCallback } from 'react';

export interface QueuedPayload {
  id: string;
  tenantId: string;
  type: 'field_report' | 'incident' | 'expense';
  payload: any;
  timestamp: string;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  compressedImagePreview?: string;
  status: 'pending' | 'syncing' | 'synced';
}

const STORAGE_KEY = 'kamilios_offline_sync_queue';
const SIMULATED_OFFLINE_KEY = 'kamilios_simulated_offline';

export function getStoredQueue(): QueuedPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read offline queue from localStorage', err);
    return [];
  }
}

export function saveQueue(queue: QueuedPayload[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new Event('kamilipos:sync_queue_changed'));
  } catch (err) {
    console.error('Failed to write offline queue to localStorage', err);
  }
}

export function addToQueue(item: Omit<QueuedPayload, 'id' | 'timestamp' | 'status'>): QueuedPayload {
  const queue = getStoredQueue();
  const newItem: QueuedPayload = {
    ...item,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  queue.push(newItem);
  saveQueue(queue);
  return newItem;
}

export function removeQueuedItem(id: string): void {
  const queue = getStoredQueue();
  const filtered = queue.filter(item => item.id !== id);
  saveQueue(filtered);
}

export function clearQueue(): void {
  saveQueue([]);
}

export function useOfflineSync() {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [queuedItems, setQueuedItems] = useState<QueuedPayload[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initialize and listen to online/offline events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsBrowserOnline(navigator.onLine);
    const simState = localStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
    setIsSimulatedOffline(simState);
    setQueuedItems(getStoredQueue());

    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);
    const handleQueueChange = () => setQueuedItems(getStoredQueue());

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('kamilipos:sync_queue_changed', handleQueueChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('kamilipos:sync_queue_changed', handleQueueChange);
    };
  }, []);

  const effectiveOnline = isBrowserOnline && !isSimulatedOffline;

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem(SIMULATED_OFFLINE_KEY, String(next));
      }
      return next;
    });
  }, []);

  const queueItem = useCallback((
    type: 'field_report' | 'incident' | 'expense',
    tenantId: string,
    payload: any,
    gpsCoordinates?: { latitude: number; longitude: number; accuracy: number },
    compressedImagePreview?: string
  ) => {
    return addToQueue({
      type,
      tenantId,
      payload,
      gpsCoordinates,
      compressedImagePreview,
    });
  }, []);

  const syncAll = useCallback(async (
    onSyncItem: (item: QueuedPayload) => Promise<void> | void
  ) => {
    if (!effectiveOnline) return;
    const currentQueue = getStoredQueue();
    if (currentQueue.length === 0) return;

    setIsSyncing(true);
    try {
      for (const item of currentQueue) {
        await onSyncItem(item);
        removeQueuedItem(item.id);
      }
    } catch (err) {
      console.error('Error during offline queue synchronization', err);
    } finally {
      setIsSyncing(false);
      setQueuedItems(getStoredQueue());
    }
  }, [effectiveOnline]);

  return {
    isOnline: effectiveOnline,
    isBrowserOnline,
    isSimulatedOffline,
    toggleSimulatedOffline,
    queuedCount: queuedItems.length,
    queuedItems,
    queueItem,
    syncAll,
    isSyncing,
  };
}
