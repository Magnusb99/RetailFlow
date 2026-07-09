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

  const pending = pendingUnlocks.get(doorId);
  console.log(
    "Pending unlock for door ID:",
    doorId,
    "Pending details:",
    pending,
  );
  if (!pending) {
    return { shouldUnlock: false };
  }

  // Viktigt: ta bort direkt så samma unlock inte konsumeras två gånger
  pendingUnlocks.delete(doorId);

  return {
    shouldUnlock: true,
    name: pending.name,
    timestamp: pending.timestamp,
  };
});
