export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, "id")!;
  /*
  const item = await useStorage("data").getItem(`${doorId}.json`);
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: "Unknown door" });
  }
*/
  if (isRateLimited(doorId)) {
    throw createError({ statusCode: 429, statusMessage: "Too Many Requests" });
  }

  await deleteActiveSession(doorId);

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

  await setActiveSession(doorId, res.sessionId);

  return {
    status: "pending",
    autoStartToken: res.autoStartToken,
  };
});
