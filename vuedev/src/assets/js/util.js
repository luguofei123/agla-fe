import store from '@/store/index'
/**
 * @description: 金额格式化
 */
export const formatMoney = function (s) {
  var n = 2
  if (!Number(s)) return '0.00'
  var firstChar = String(s).charAt(0)
  s = String(s).replace(/[^\d.]/g, '')

  n = n > 0 && n <= 20 ? n : 2
  s = parseFloat((s + '').replace(/[^\d.-]/g, '')).toFixed(n) + ''
  var l = s
    .split('.')[0]
    .split('')
    .reverse(),
    r = s.split('.')[1]
  var t = ''
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
  }
  s =
    t
      .split('')
      .reverse()
      .join('') +
    '.' +
    r
  if (firstChar == '-') {
    s = '-' + s
  }
  return s
}
export const revertNumMoney = function (str) {
  return typeof str === 'string' ? str.replace(/,/g, '') : ''
}

/**
 * @description: 获取链接查询参数
 */
export const getQueryString = function (key) {
  // 获取参数
  let url = window.location.href
  //截取？后的字符
  url = url.substring(url.indexOf('?'))
  // 正则筛选地址栏
  let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
  // 匹配目标参数
  let result = url.substr(1).match(reg)
  //返回参数值
  return result ? decodeURIComponent(result[2]) : null
}
/**
 * @description: pqr打印公共方法
 * @param {string} reportCode 后端规定的账表编码或类型
 * @param {string} templId 模板id
 * @param {string} groupDef 内容参数
 * @param {function} successCallBack 成功回掉
 * @param {function} failCallBack 失败回调
 */
export const getPdf = function (reportCode, templId, groupDef, successCallBack, failCallBack) {
  let xhr = new XMLHttpRequest()
  let formData = new FormData()
  formData.append('reportCode', reportCode)
  formData.append('templId', templId)
  formData.append('groupDef', groupDef)
  let url = '/pqr/api/printpdfbydata'
  // process.env.NODE_ENV === 'development' ? url = '/dev'+ url : url
  xhr.open('POST', url, true)
  xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
  xhr.responseType = 'blob'

  //保存文件
  xhr.onload = function (e) {
    console.log(e)
    if (xhr.status === 200) {
      if (xhr.status === 200) {
        let content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
        // process.env.NODE_ENV === 'development' ? content = '/dev'+ content : content
        window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
      }
    }
  }

  //状态改变时处理返回值
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      //通信成功时
      if (xhr.status === 200) {
        //交易成功时
        successCallBack()
      } else {
        const content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
        failCallBack(content)
      }
    }
  }
  xhr.send(formData)
}
/**
 * @description: 获取按钮权限
 * @param {string} className
 */
export const getBtnPer = function (className) {
  // console.log(className)
  // console.log(this.btnPerList)
  if (process.env.NODE_ENV != 'development') {
    let btnPerList = this.$store.state.btnPerList
    if (btnPerList) {
      if (className) {
        let flag = false
        btnPerList.forEach((item) => {
          if (item.code === className) {
            flag = true
          }
        })
        if (flag) {
          return ''
        } else {
          return 'btn-permission'
        }
      } else {
        console.log('权限标识className为空')
        return ''
      }
    } else {
      console.log('权限列表btnPerList为空')
      return ''
    }
  } else {
    return ''
  }
}
/**
 * @description: 下载文件
 * @param {} data
 * @param {string} strFileName
 * @param {string} strMimeType
 */
export const download = function (data, strFileName, strMimeType) {
  var self = window, // this script is only for browsers anyway...
    u = 'application/octet-stream', // this default mime also triggers iframe downloads
    m = strMimeType || u,
    x = data,
    D = document,
    a = D.createElement('a'),
    z = function (a) {
      return String(a)
    },
    B = self.Blob || self.MozBlob || self.WebKitBlob || z,
    BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
    fn = strFileName || 'download',
    blob,
    b,
    ua,
    fr

  //if(typeof B.bind === 'function' ){ B=B.bind(self); }

  if (String(this) === 'true') {
    //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
    x = [x, m]
    m = x[0]
    x = x[1]
  }

  //go ahead and download dataURLs right away
  if (String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)) {
    return navigator.msSaveBlob // IE10 can't do a[download], only Blobs:
      ? navigator.msSaveBlob(d2b(x), fn)
      : saver(x) // everyone else can save dataURLs un-processed
  } //end if dataURL passed?

  try {
    blob = x instanceof B ? x : new B([x], { type: m })
  } catch (y) {
    if (BB) {
      b = new BB()
      b.append([x])
      blob = b.getBlob(m) // the blob
    }
  }

  function d2b(u) {
    var p = u.split(/[:;,]/),
      t = p[1],
      dec = p[2] == 'base64' ? atob : decodeURIComponent,
      bin = dec(p.pop()),
      mx = bin.length,
      i = 0,
      uia = new Uint8Array(mx)

    for (i; i < mx; ++i) uia[i] = bin.charCodeAt(i)

    return new B([uia], { type: t })
  }

  function saver(url, winMode) {
    if ('download' in a) {
      //html5 A[download]
      a.href = url
      a.setAttribute('download', fn)
      a.innerHTML = 'downloading...'
      D.body.appendChild(a)
      setTimeout(function () {
        a.click()
        D.body.removeChild(a)
        if (winMode === true) {
          setTimeout(function () {
            self.URL.revokeObjectURL(a.href)
          }, 250)
        }
      }, 66)
      return true
    }

    //do iframe dataURL download (old ch+FF):
    var f = D.createElement('iframe')
    D.body.appendChild(f)
    if (!winMode) {
      // force a mime that will download:
      url = 'data:' + url.replace(/^data:([\w\/\-\+]+)/, u)
    }

    f.src = url
    setTimeout(function () {
      D.body.removeChild(f)
    }, 333)
  } //end saver

  if (navigator.msSaveBlob) {
    // IE10+ : (has Blob, but not a[download] or URL)
    return navigator.msSaveBlob(blob, fn)
  }

  if (self.URL) {
    // simple fast and modern way using Blob and URL:
    saver(self.URL.createObjectURL(blob), true)
  } else {
    // handle non-Blob()+non-URL browsers:
    if (typeof blob === 'string' || blob.constructor === z) {
      try {
        return saver('data:' + m + ';base64,' + self.btoa(blob))
      } catch (y) {
        return saver('data:' + m + ',' + encodeURIComponent(blob))
      }
    }

    // Blob but not URL:
    fr = new FileReader()
    fr.onload = function (e) {
      saver(this.result)
    }
    fr.readAsDataURL(blob)
  }
  return true
}
/**
 * @description: 返回在哪种设备
 */

export const is_anroid_ios = function () {
  var u = navigator.userAgent
  if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    // console.log('ios 终端');
    return 'ios'
  } else if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
    // console.log('Android 终端');
    return 'Android'
  }
  return 'others'
}
/**
 * @description: 返回是否在微信或QQ环境
 */
export const is_weixn_qq = function () {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return 'weixin'
  } else if (ua.match(/QQ/i) == 'qq') {
    return 'QQ'
  }
  return 'others'
}
export const setObjectCache = function (key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}
export const removeCache = function (key) {
  window.sessionStorage.removeItem(key)
}
/**
 * @description: 平台的页面跳转方法
 * @param {Boolean} isCrossDomain 是否跨域
 * @param {jquery} that 一般是点击的链接dom的jquery对象
 * @param {String} actionType 跨域模式下打开还是关闭
 * @param {String} baseUrl 打开的url
 * @param {String} isNew 跨域模式下打开方式
 * @param {String} title 页面标题
 */
export const openNewPage = function (isCrossDomain, that, actionType, baseUrl, isNew, title) {
  var isCrossDomains = false
  try {
    var href = window.top.location.href
  } catch (e) {
    isCrossDomains = true
  }
  var roleId = store.state.pfData.svRoleId
  if (isCrossDomain || isCrossDomains) {
    // 此处即为监听到跨域
    var data = {
      actionType: actionType, // closeMenu 关闭   openMenu 打开
      url: window.location.protocol + '//' + window.location.host + baseUrl + '&roleId=' + roleId,
      isNew: isNew, // isNew: false表示在iframe中打开，为true的话就是在新页面打开
      title: title, // 菜单标题
    }
    if (!window.parent.postMessage) {
      window.parent.parent.postMessage(data, '*')
    } else {
      window.parent.postMessage(data, '*')
    }
  } else if (window.parent.addTabToParent != undefined || window.parent.parent.addTabToParent != undefined) {
    //门户打开方式  85门户打开菜单方法
    if (!window.parent.addTabToParent) {
      window.parent.parent.addTabToParent(title, baseUrl + '&roleId=' + roleId)
    } else {
      window.parent.addTabToParent(title, baseUrl + '&roleId=' + roleId)
    }
  } else {
    //门户打开方式 80门户打开菜单方法
    that.attr('data-href', baseUrl + '&roleId=' + roleId);
    that.attr('data-title', title);
    if (!window.parent.openNewMenu) {
      window.parent.parent.openNewMenu(that)
    } else {
      window.parent.openNewMenu(that)
    }
  }
}
/**
 * @description: 是否从rmis跳转
 * @return {Boolean}
 */
export const fromRmis = function () {
  let url = window.location.href
  if (url.indexOf('fromrmis=') > -1) {
    let arr = url.split('&')
    return arr.some((item) => {
      return item.split('fromrmis=')[1] === '1'
    })
  } else {
    return false
  }
}
/**
 * @description: 获取从rmis跳转带的参数
 * @return {Object}
 */
export const getFromRmisArgu = function () { }

