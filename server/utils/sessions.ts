// server/utils/sessions.ts
import { getStore } from "@netlify/blobs";

interface DoorSession {
  doorId: string;
  sessionId: string;
  createdAt: number;
}

function store() {
  return getStore("active-sessions");
}

export async function setActiveSession(doorId: string, sessionId: string) {
  const session: DoorSession = {
    doorId,
    sessionId,
    createdAt: Date.now(),
  };
  await store().setJSON(doorId, session);
}

export async function getActiveSession(
  doorId: string,
): Promise<DoorSession | null> {
  return await store().get(doorId, { type: "json" });
}

export async function hasActiveSession(doorId: string): Promise<boolean> {
  const session = await getActiveSession(doorId);
  return !!session;
}

export async function deleteActiveSession(doorId: string) {
  await store().delete(doorId);
}
