// server/utils/pendingUnlocks.ts
import { getStore } from "@netlify/blobs";

function store() {
  return getStore("pending-unlocks");
}

export async function setPendingUnlock(
  doorId: string,
  data: { name: string; timestamp: string },
) {
  await store().setJSON(doorId, data);
}

export async function getPendingUnlock(doorId: string) {
  return await store().get(doorId, { type: "json" });
}

export async function deletePendingUnlock(doorId: string) {
  await store().delete(doorId);
}
