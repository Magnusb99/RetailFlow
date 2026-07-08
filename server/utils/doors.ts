// server/utils/doors.ts
export async function isValidDoorId(doorId: string): Promise<boolean> {
  if (!/^[a-zA-Z0-9_-]+$/.test(doorId)) return false;

  const storage = useStorage("data"); // matchar "data" i nitro.storage config
  return await storage.hasItem(`${doorId}.json`);
}
