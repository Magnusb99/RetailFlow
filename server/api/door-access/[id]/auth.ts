/*/ server/api/door-access/[id]/auth.post.ts
import { activeSessions } from '../../../utils/sessions'

export default defineEventHandler(async (event) => {
  const doorId = getRouterParam(event, 'id')!
  const userAgent = getHeader(event, 'user-agent') ?? ''
  const host = getHeader(event, 'host') ?? ''

  const form = new FormData()
  form.append('apiKey', process.env.BANKID_API_KEY!)
  form.append('authenticateServiceKey', process.env.BANKID_SERVICE_KEY!)
  form.append('gui', 'false')
  form.append('mobileBankId', 'true')
  form.append('returnRisk', 'true')
  form.append('deviceData', JSON.stringify({
    web: {
      referringDomain: host,
      userAgent,
      deviceIdentifier: crypto.randomUUID()
    }
  }))

  const res = await $fetch<{ sessionId: string; autoStartToken: string; QRCode?: string }>(
    'https://client.grandid.com/json1.1/FederatedLogin',
    { method: 'POST', body: form }
  )

  activeSessions.set(doorId, { doorId, sessionId: res.sessionId })

  return {
    sessionId: res.sessionId,
    autoStartToken: res.autoStartToken,
    qrCode: res.QRCode
  }
})
  */