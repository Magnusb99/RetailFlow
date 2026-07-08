// server/utils/doors.ts
import { existsSync } from "node:fs";
import { join } from "node:path";

const DOORS_DIR = join(process.cwd(), "public/data");

export function isValidDoorId(doorId: string): boolean {
  // Extra viktigt: skydda mot path traversal (t.ex. doorId = "../../etc/passwd")
  if (!/^[a-zA-Z0-9_-]+$/.test(doorId)) return false;

  const filePath = join(DOORS_DIR, `${doorId}.json`);
  return existsSync(filePath);
}
