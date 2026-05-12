/*/ server/api/door-access/[id]/status.get.ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  // Hämta access request från DB
  const orderRef = 'TODO_ORDER_REF'
  const doorId = 'TODO_DOOR_ID'

  const collectRes = await $fetch('https://appapi2.test.bankid.com/rp/v6.0/collect', {
    method: 'POST',
    body: { orderRef }
  })

  if (collectRes.status === 'complete') {
    const personalNumber = collectRes.completionData.user.personalNumber
    const risk = collectRes.completionData.risk

    // 1. Kontrollera behörighet
    // 2. Kontrollera risk !== 'high'
    // 3. Skicka kommando till Raspberry Pi

    return {
      status: 'opened',
      user: collectRes.completionData.user
    }
  }

  if (collectRes.status === 'failed') {
    return {
      status: 'failed',
      hintCode: collectRes.hintCode
    }
  }

  return {
    status: 'pending',
    hintCode: collectRes.hintCode
  }
})
*/