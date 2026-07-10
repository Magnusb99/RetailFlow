// Aktiv session – polla status

export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, "id")!;

  const session = await getActiveSession(doorId);
  if (!session) {
    throw createError({ statusCode: 400, statusMessage: "No active session" });
  }

  const form = new FormData();
  form.append("apiKey", process.env.BANKID_API_KEY!);
  form.append("authenticateServiceKey", process.env.BANKID_SERVICE_KEY!);
  form.append("sessionId", session.sessionId);

  const res = await $fetch<GetSessionResponse>(
    "https://client.grandid.com/json1.1/GetSession",
    { method: "POST", body: form },
  );

  if (res.grandidObject?.message?.status === "pending") {
    return {
      status: "pending",
      hintCode: res.grandidObject.message.hintCode,
    };
  }

  if (res.grandidObject?.message?.status === "failed" || res.errorObject) {
    await deleteActiveSession(doorId);
    return {
      status: "failed",
      hintCode: res.grandidObject?.message?.hintCode ?? res.errorObject?.code,
    };
  }

  // Komplett
  const { name } = res.userAttributes!;
  // session.post.ts
  console.log("Sparar pending unlock för doorId:", JSON.stringify(doorId));
  await setPendingUnlock(doorId, { name, timestamp: new Date().toISOString() });

  await deleteActiveSession(doorId);

  return { status: "opened", user: { name } };
});
