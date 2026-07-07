// server/api/door-access/[id]/index.post.ts
import { activeSessions } from "../../../utils/sessions";

export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, "id")!;
  console.log("Door ID in login.post.ts:", doorId);
  console.log("activeSessions size:", activeSessions.size, "keys:", [
    ...activeSessions.keys(),
  ]);
  if (!activeSessions.has(doorId)) {
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
  }
});
