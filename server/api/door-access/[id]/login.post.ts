// server/api/door-access/[id]/login.post.ts

export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, "id")!;

  if (!isValidDoorId(doorId)) {
    throw createError({ statusCode: 404, statusMessage: "Unknown door" });
  }

  console.log("Door ID in login.post.ts:", doorId);

  if (isRateLimited(doorId)) {
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
    });
  }

  // Rensa ev. gammal/kvarvarande session — login ska alltid börja om
  activeSessions.delete(doorId);

  const form = new FormData();
  form.append("apiKey", process.env.BANKID_API_KEY!);
  form.append("authenticateServiceKey", process.env.BANKID_SERVICE_KEY!);
  form.append("returnUrl", `${process.env.PUBLIC_URL}/${doorId}?bankid=1`);
  form.append("gui", "false");
  form.append("mobileBankId", "true");

  const res = await $fetch<{
    sessionId: string;
    autoStartToken: string;
  }>("https://client.grandid.com/json1.1/FederatedLogin", {
    method: "POST",
    body: form,
  });

  activeSessions.set(doorId, { doorId, sessionId: res.sessionId });

  return {
    status: "pending",
    autoStartToken: res.autoStartToken,
  };
});
