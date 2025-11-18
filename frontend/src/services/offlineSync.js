const OFFLINE_DATA_KEY = "offline_data";

export const offlineSync = {
  // Save data for offline sync
  saveOfflineData: (key, data) => {
    if (!navigator.onLine) {
      const offlineData = JSON.parse(
        localStorage.getItem(OFFLINE_DATA_KEY) || "{}"
      );
      offlineData[key] = offlineData[key] || [];
      offlineData[key].push({
        data,
        timestamp: new Date().toISOString(),
        synced: false,
      });
      localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
      return true;
    }
    return false;
  },

  // Get all offline data
  getOfflineData: () => {
    return JSON.parse(localStorage.getItem(OFFLINE_DATA_KEY) || "{}");
  },

  // Sync offline data when online
  syncOfflineData: async () => {
    if (!navigator.onLine) return false;

    const offlineData = JSON.parse(
      localStorage.getItem(OFFLINE_DATA_KEY) || "{}"
    );
    const syncedKeys = [];

    for (const [key, items] of Object.entries(offlineData)) {
      for (const item of items) {
        if (!item.synced) {
          try {
            // Here you would implement the actual sync logic
            // For now, we'll just mark as synced
            item.synced = true;
            syncedKeys.push(key);
          } catch (error) {
            console.error(`Failed to sync ${key}:`, error);
          }
        }
      }
    }

    // Remove synced data
    if (syncedKeys.length > 0) {
      localStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
    }

    return syncedKeys.length > 0;
  },

  // Clear all offline data
  clearOfflineData: () => {
    localStorage.removeItem(OFFLINE_DATA_KEY);
  },
};
