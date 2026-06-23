// server/api/door-access/[id]/index.post.ts
import { activeSessions } from '../../../utils/sessions'
import type { GetSessionResponse } from '../../../../app/composables/types'

export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, 'id')!
    console.log("Door ID in index.post.ts:", doorId);

  if (!activeSessions.has(doorId)) {
   const form = new FormData()
    form.append('apiKey', process.env.BANKID_API_KEY!)
    form.append('authenticateServiceKey', process.env.BANKID_SERVICE_KEY!)
    form.append('gui', 'false')
    form.append('qr', 'true')
    form.append('mobileBankId', 'true')

    console.log("Form data prepared for FederatedLogin request:", form);

    const res = await $fetch<{ sessionId: string; autoStartToken: string; QRCode?: string }>(
      'https://client.grandid.com/json1.1/FederatedLogin',
      { method: 'POST', body: form }
    )
    console.log("Response from FederatedLogin request:", res);
    activeSessions.set(doorId, { doorId, sessionId: res.sessionId })

    return {
      status: 'pending',
      autoStartToken: res.autoStartToken,
      qrCode: res.QRCode
    }
  }

  // Aktiv session – polla status
  const session = activeSessions.get(doorId)!
console.log("Active session found for door ID:", doorId, "Session details:", session);
  const form = new FormData()
  form.append('apiKey', process.env.BANKID_API_KEY!)
  form.append('authenticateServiceKey', process.env.BANKID_SERVICE_KEY!)
  form.append('sessionId', session.sessionId)
console.log("Form data prepared for GetSession request:", form);
  const res = await $fetch<GetSessionResponse>(
    'https://client.grandid.com/json1.1/GetSession',
    { method: 'POST', body: form }
  )
  console.log("Response from GetSession request:", res);
  if (res.grandidObject?.message?.status === 'pending') {
    return {
      status: 'pending',
      hintCode: res.grandidObject.message.hintCode,
      qrCode: res.grandidObject.QRCode
    }
  }

  if (res.grandidObject?.message?.status === 'failed' || res.errorObject) {
    activeSessions.delete(doorId)
    return {
      status: 'failed',
      hintCode: res.grandidObject?.message?.hintCode ?? res.errorObject?.code
    }
  }

  // Komplett
  const { name, givenName, surname, personalNumber} = res.userAttributes!


  await $fetch(`${process.env.RASPI_BASE_URL}/${doorId}/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { name, givenName, surname, personalNumber }
  })

  activeSessions.delete(doorId)
  return { status: 'opened', user: { name } }
})