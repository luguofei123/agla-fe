/**
 * 常量维护文件
 */
/**
 * 常用正则
 * */
const pvdfReg = {
  /** 电话 */
  TELPHONE_REG: /^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
  /** 手机 */
  MOBILEPHONE_REG: /^1[3456789]\d{9}$/,
  /** 邮箱 */
  EMAIL_REG: /^[a-z0-9A-Z]{1,}@([a-z0-9A-Z]){1,}\.[a-z]{2,}$/,
  /** 身份证 */
  ID_CARD_REG: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  /** uuid */
  UUID_FIELD_REG: /(\w+\.\w+)/
}

const menuIdList = {
  vouMenuId: 'f24c3333-9799-439a-94c9-f0cdf120305d', // 凭证录入
  voubigMenuId: '14a44be5-f2bf-4729-8bc7-702c01e3cfcf',//凭证查看
  journalMenuId: 'f34f56bd-a122-4f6d-a6b4-28b0068c524b' //明细账
}
export {
  menuIdList,
  pvdfReg
}
