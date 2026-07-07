//server/api/unlock.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log("🔓 UNLOCK TEST-ANROP MOTTAGET:");
  console.log(JSON.stringify(body, null, 2));

  return {
    status: "ok",
    receivedAt: new Date().toISOString(),
    body,
  };
});
