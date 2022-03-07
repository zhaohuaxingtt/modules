import JSEncrypt from './jsencrypt.min.js'
const publicKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDtHWBZlZFuWCQmAqWGH5NaYimrmWHI8/BgHcorxAlq+5bCJyVe8VD9Zm4CRksP/yYPAqWB03B0wm1F1ePObs3ddhpk/MJ8GzbXJY0inj2J0n90QEzhebb/GpHt777EmfY/PuA4fGw8WtW6LHwkr+tnluKlR9f5ZgKByf3mBEge0wIDAQAB`

/**
 * Rsa加密
 * @param {String} str
 * @returns String
 */
export function encryptRsa(str) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(str)
}

/**
 * 密码加密
 * @param {String} str 原始密码
 * @returns 加密后的密码
 */
export function encryptPwd(str) {
  return encryptRsa(str)
}

export function setToken(tokenData) {
  // eslint-disable-next-line no-undef
  return Cookies.set(process.env.VUE_APP_TOKEN_NAME, tokenData)
}
