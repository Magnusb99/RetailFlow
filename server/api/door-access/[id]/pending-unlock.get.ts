//pending-unlock.get.ts

export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, "id")!;
  /*
  if (!isValidDoorId(doorId)) {
    throw createError({ statusCode: 404, statusMessage: "Unknown door" });
  }
*/
  const secret = getHeader(event, "x-unlock-secret");
  console.log(secret + " vs " + process.env.UNLOCK_SHARED_SECRET);
  if (secret !== process.env.UNLOCK_SHARED_SECRET) {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  // pending-unlock.get.ts
  const pending = await getPendingUnlock(doorId);

  if (!pending) {
    return { shouldUnlock: false };
  }
  console.log("Pending unlock found for door ID:", doorId, "Details:", pending);

  await deletePendingUnlock(doorId);

  return {
    shouldUnlock: true,
    name: pending.name,
    timestamp: pending.timestamp,
  };
});
