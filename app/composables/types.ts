// types/grandid.ts
export type CartItem = {
  id: number
  name: string
  price: number
  slot: number
}

export interface GetSessionResponse {
  // Pending
  grandidObject?: {
    code: string
    message: {
      status: 'pending' | 'failed'
      hintCode: string
    }
    sessionId: string
    QRCode?: string
    autoStartToken?: string
  }

  // Komplett
  sessionId?: string
  username?: string
  userAttributes?: {
    personalNumber: string
    name: string
    givenName: string
    surname: string
    ipAddress: string
    notBefore: string
    notAfter: string
    signature: string
    ocspResponse: string
    uhi: string
    bankIdIssueDate: string
    risk?: 'low' | 'moderate' | 'high'
    stepUp?: {
      mrtd: boolean
    }
  }

  // Fel
  errorObject?: {
    code: string
    message: string
  }
}