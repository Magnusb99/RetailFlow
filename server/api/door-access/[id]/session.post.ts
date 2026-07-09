// Aktiv session – polla status

export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, "id")!;
  const session = activeSessions.get(doorId)!;
  //console.log("Active session found for door ID:",doorId,"Session details:",session,);

  //console.log("\n No form data");

  const form = new FormData();
  form.append("apiKey", process.env.BANKID_API_KEY!);
  form.append("authenticateServiceKey", process.env.BANKID_SERVICE_KEY!);
  form.append("sessionId", session.sessionId);

  //console.log("\n Form data created:", Array.from(form.entries()));

  const res = await $fetch<GetSessionResponse>(
    "https://client.grandid.com/json1.1/GetSession",
    { method: "POST", body: form },
  );

  //console.log("\n GetSession response:", JSON.stringify(res, null, 2));

  if (res.grandidObject?.message?.status === "pending") {
    //console.log("\n Session is still pending. Returning pending status.");
    return {
      status: "pending",
      hintCode: res.grandidObject.message.hintCode,
    };
  }

  if (res.grandidObject?.message?.status === "failed" || res.errorObject) {
    //console.log("\n Session failed. Returning failed status.");
    activeSessions.delete(doorId);
    return {
      status: "failed",
      hintCode: res.grandidObject?.message?.hintCode ?? res.errorObject?.code,
    };
  }

  // Komplett
  const { name, givenName, surname, personalNumber } = res.userAttributes!;

  //console.log("\n Session completed successfully. User details:", {name,givenName,surname,personalNumber,});
  /*
  await $fetch(`${process.env.RASPI_BASE_URL}/unlock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-unlock-secret": process.env.UNLOCK_SHARED_SECRET!,
    },
    body: { name, givenName, surname, personalNumber },
  });
*/
  console.log("\n Unlock request sent to Raspberry Pi for user:", name);
  await setPendingUnlock(doorId, {
    name,
    timestamp: new Date().toISOString(),
  });
  activeSessions.delete(doorId);
  console.log("\n Session deleted at the end");
  return { status: "opened", user: { name } };
});
