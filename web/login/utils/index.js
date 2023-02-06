/*
 * @Author: 余继鹏 917955345@qq.com
 * @Date: 2022-04-11 18:30:03
 * @LastEditors: 余继鹏 917955345@qq.com
 * @LastEditTime: 2023-02-06 16:21:42
 * @FilePath: \front-modules\web\login\utils\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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

//获取token
export function getToken() {
    return Cookies.get(process.env.VUE_APP_TOKEN_NAME)
}