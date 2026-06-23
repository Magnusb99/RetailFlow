/*/ server/utils/bankid.ts
import https from 'node:https'
import fs from 'node:fs'

export const bankIdAgent = new https.Agent({
  cert: fs.readFileSync('./certs/bankid-test-client.crt'),
  key: fs.readFileSync('./certs/bankid-test-client.key'),
  ca: fs.readFileSync('./certs/bankid-test-ca.pem'),
})
  */