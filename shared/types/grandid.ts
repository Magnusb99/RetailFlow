// shared/types/grandid.ts

export type UiStatus = "idle" | "waiting" | "opened" | "failed" | "blocked";

export interface FederatedLoginResponse {
  sessionId: string;
  autoStartToken: string;
  qrCode?: string;
}

export interface DoorAccessResponse {
  status: "pending" | "opened" | "failed" | "blocked";
  hintCode?: string;
  qrCode?: string;
  autoStartToken?: string;
  reason?: string;
  user?: {
    name: string;
  };
}

export interface GetSessionResponse {
  // Pending
  grandidObject?: {
    code: string;
    message: {
      status: "pending" | "failed";
      hintCode: string;
    };
    sessionId: string;
    QRCode?: string;
    autoStartToken?: string;
  };

  // Komplett
  sessionId?: string;
  username?: string;
  userAttributes?: {
    personalNumber: string;
    name: string;
    givenName: string;
    surname: string;
    ipAddress: string;
    notBefore: string;
    notAfter: string;
    signature: string;
    ocspResponse: string;
    uhi: string;
    bankIdIssueDate: string;
    risk?: "low" | "moderate" | "high";
    stepUp?: {
      mrtd: boolean;
    };
  };

  // Fel
  errorObject?: {
    code: string;
    message: string;
  };
}
