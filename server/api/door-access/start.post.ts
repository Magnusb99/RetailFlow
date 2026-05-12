/*/ server/api/door-access/start.post.ts
import { bankIdAgent } from '../../utils/bankid'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const doorId = body.doorId

  const ip =
    getRequestHeader(event, 'x-forwarded-for')?.split(',')[0] ||
    event.node.req.socket.remoteAddress ||
    '127.0.0.1'

  const userAgent = getRequestHeader(event, 'user-agent') || 'unknown'

  const userVisibleText = `Bekräfta att du vill öppna dörren: ${doorId}`

  const bankidRes = await $fetch('https://appapi2.test.bankid.com/rp/v6.0/auth', {
    method: 'POST',
    dispatcher: bankIdAgent as any,
    body: {
      endUserIp: ip,
      returnUrl: `https://din-doman.se/open/${doorId}/callback#nonce=TODO_NONCE`,
      returnRisk: true,
      userVisibleData: Buffer.from(userVisibleText, 'utf8').toString('base64'),
      userVisibleDataFormat: 'plaintext',
      web: {
        referringDomain: 'din-doman.se',
        userAgent,
        deviceIdentifier: 'dev-device'
      }
    }
  })

  return bankidRes
})
*/