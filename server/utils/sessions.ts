// server/utils/sessions.ts
interface DoorSession {
  doorId: string;
  sessionId: string;
}

export const activeSessions = new Map<string, DoorSession>();
// Key = doorId, value = aktiv session
