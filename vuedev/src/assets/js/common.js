import axios from './http.js'
export default {
  getQueryString: function (key) {
    // 获取参数
    var url = window.location.href
    //截取？后的字符
    url = url.substring(url.indexOf('?'))
    // 正则筛选地址栏
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
    // 匹配目标参数
    var result = url.substr(1).match(reg)
    //返回参数值
    return result ? decodeURIComponent(result[2]) : null
  },
  base64OBj: function () {
    // private property
    let _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

    // public method for encoding
    this.encode = function (input) {
      var output = ''
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4
      var i = 0
      input = _utf8_encode(input)
      while (i < input.length) {
        chr1 = input.charCodeAt(i++)
        chr2 = input.charCodeAt(i++)
        chr3 = input.charCodeAt(i++)
        enc1 = chr1 >> 2
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
        enc4 = chr3 & 63
        if (isNaN(chr2)) {
          enc3 = enc4 = 64
        } else if (isNaN(chr3)) {
          enc4 = 64
        }
        output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4)
      }
      return output
    }

    // public method for decoding
    this.decode = function (input) {
      if (typeof input == 'undefined') {
        return ''
      }
      var output = ''
      var chr1, chr2, chr3
      var enc1, enc2, enc3, enc4
      var i = 0
      input = input.replace(/[^A-Za-z0-9+/=]/g, '')
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++))
        enc2 = _keyStr.indexOf(input.charAt(i++))
        enc3 = _keyStr.indexOf(input.charAt(i++))
        enc4 = _keyStr.indexOf(input.charAt(i++))
        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
        chr3 = ((enc3 & 3) << 6) | enc4
        output = output + String.fromCharCode(chr1)
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2)
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3)
        }
      }
      output = _utf8_decode(output)
      return output
    }

    // private method for UTF-8 encoding
    var _utf8_encode = function (string) {
      string = string.replace(/\r\n/g, '\n')
      var utftext = ''
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n)
        if (c < 128) {
          utftext += String.fromCharCode(c)
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192)
          utftext += String.fromCharCode((c & 63) | 128)
        } else {
          utftext += String.fromCharCode((c >> 12) | 224)
          utftext += String.fromCharCode(((c >> 6) & 63) | 128)
          utftext += String.fromCharCode((c & 63) | 128)
        }
      }
      return utftext
    }

    // private method for UTF-8 decoding
    var _utf8_decode = function (utftext) {
      var string = ''
      var i = 0
      var c = 0,
        c2 = 0,
        c3 = 0
      while (i < utftext.length) {
        c = utftext.charCodeAt(i)
        if (c < 128) {
          string += String.fromCharCode(c)
          i++
        } else if (c > 191 && c < 224) {
          c2 = utftext.charCodeAt(i + 1)
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
          i += 2
        } else {
          c2 = utftext.charCodeAt(i + 1)
          c3 = utftext.charCodeAt(i + 2)
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
          i += 3
        }
      }
      return string
    }
  },
  getSelectedVar: function () {
    var base = new this.base64OBj()
    var getSelEnviornmentVar = JSON.parse(sessionStorage.getItem('selEnviornmentVar'))
    if (getSelEnviornmentVar) {
      var selEnviornmentVar = {
        selAgecncyCode: getSelEnviornmentVar.selAgecncyCode ? base.decode(getSelEnviornmentVar.selAgecncyCode) : '',
        selAgecncyName: getSelEnviornmentVar.selAgecncyName ? base.decode(getSelEnviornmentVar.selAgecncyName) : '',
        selAcctCode: getSelEnviornmentVar.selAcctCode ? base.decode(getSelEnviornmentVar.selAcctCode) : '',
        selAcctName: getSelEnviornmentVar.selAcctName ? base.decode(getSelEnviornmentVar.selAcctName) : '',
        selAccBookCode: getSelEnviornmentVar.selAccBookCode ? base.decode(getSelEnviornmentVar.selAccBookCode) : '',
        selAccBookName: getSelEnviornmentVar.selAccBookName ? base.decode(getSelEnviornmentVar.selAccBookName) : '',
      }
      return selEnviornmentVar
    }
  },
  /**
   * @description: 获取登录用户的
   * @return {Promise}
   */
  getCommonData: function () {
    let base = new this.base64OBj()
    //获取平台版本
    return axios.get('/ma/sys/common/getFapVersion').then((result) => {
      if (result.data.flag != 'success') {
        throw result.data.msg
      }
      // console.log('result.data.data: ', result.data.data);
      if (result.data.data == '1') {
        //85
        return new Promise((resolve, reject) => {
          axios.get('/ma/sys/common/getParamBean').then((result) => {
            let commonData = result.data.data
            if (commonData) {
              resolve(commonData)
            } else {
              throw '从/ma/sys/common/getParamBean接口获取的commonData为空'
            }
          })
        })
      } else {
        //80
        return new Promise((resolve) => {
          let portalCommonData = JSON.parse(localStorage.getItem('commonData'))
          if (!portalCommonData) {
            if (location.href.indexOf('/pf/vue/prs/mySalaryMobile') > -1) {
              resolve({})
            } else {
              var reloginHtml = '/pf/portal/login/relogin.html'
              top.location.href = reloginHtml
              resolve({})
            }
          }
          var commonData = {
            svAgencyCode: base.decode(portalCommonData.svAgencyCode),
            svFiscalPeriod: base.decode(portalCommonData.svFiscalPeriod),
            svSetYear: base.decode(portalCommonData.svSetYear),
            svRgCode: base.decode(portalCommonData.svRgCode),
            //区划为空base.decode(portalCommonData.svRgCode),
            svTransDate: base.decode(portalCommonData.svTransDate),
            svUserId: base.decode(portalCommonData.svUserId),
            svRoleName: base.decode(portalCommonData.svRoleName),
            svSysDate: base.decode(portalCommonData.svSysDate),
            svRoleCode: base.decode(portalCommonData.svRoleCode),
            svAcctCode: base.decode(portalCommonData.svAcctCode),
            svAcctName: base.decode(portalCommonData.svAcctName),
            svUserCode: base.decode(portalCommonData.svUserCode),
            svMenuId: base.decode(portalCommonData.svMenuId),
            //菜单id为空
            svUserName: base.decode(portalCommonData.svUserName),
            svAgencyName: base.decode(portalCommonData.svAgencyName),
            svRgName: base.decode(portalCommonData.svRgName),
            //区划名称为空
            svRoleId: base.decode(portalCommonData.svRoleId),
            token: base.decode(portalCommonData.token),
          }
          //如果有单位账套的缓存，则取缓存的值
          var selEnviornmentVar = this.getSelectedVar()
          if (selEnviornmentVar) {
            commonData.svAgencyCode = selEnviornmentVar.selAgecncyCode ? selEnviornmentVar.selAgecncyCode : commonData.svAgencyCode
            commonData.svAgencyName = selEnviornmentVar.selAgecncyName ? selEnviornmentVar.selAgecncyName : commonData.svAgencyName
            commonData.svAcctCode = selEnviornmentVar.selAcctCode ? selEnviornmentVar.selAcctCode : commonData.svAcctCode
            commonData.svAcctName = selEnviornmentVar.selAcctName ? selEnviornmentVar.selAcctName : commonData.svAcctName
          }
          resolve(commonData)
        })
      }
    })
  },
}
