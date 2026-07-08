interface PendingUnlock {
  name: string;
  timestamp: string;
}

// Key = doorId
export const pendingUnlocks = new Map<string, PendingUnlock>();
