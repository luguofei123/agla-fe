$(function() {
  //open弹窗的关闭方法
  window._close = function(action, msg) {
    if (window.closeOwner) {
      var data = { action: action, msg: msg }
      window.closeOwner(data)
    }
  }
  function getByteLen(val) {
    var len = 0
    for (var i = 0; i < val.length; i++) {
      var a = val.charAt(i)
      if (a.match(/[^\x00-\xff]/gi) != null) {
        len += 2
      } else {
        len += 1
      }
    }
    return len
  }

  //接口URL集合
  var interfaceURL = {
    savePrsType: '/prs/PrsType/savePrsType', // 新增保存
    updatePrsType: '/prs/PrsType/updatePrsType' // 修改保存
  }

  var page = (function() {
    return {
      // 初始化表单
      initFormData: function() {
        if (!$.isEmptyObject(window.ownerData)) {
          $('#frmQuery').setForm(window.ownerData)
          $('#prtypeCode').attr('disabled', true)
          $('#btn-saveadd').hide()
        } else {
          $('#prtypeCode').attr('disabled', false)
          $('#btn-saveadd').show()
        }
      },
      // 校验数据
      checkData: function(formData) {
        if (formData.prtypeCode.trim() === '') {
          ufma.showTip('请输入工资类别代码', function() {}, 'warning')
          return false
        }
        if (formData.prtypeName.trim() === '') {
          ufma.showTip('请输入工资类别名称', function() {}, 'warning')
          return false
        }
        if (getByteLen(formData.prtypeCode.trim()) > 120) {
          ufma.showTip(
            '工资类别代码最大可输入120个字符',
            function() {},
            'warning'
          )
          return false
        }
        if (getByteLen(formData.prtypeName.trim()) > 120) {
          ufma.showTip(
            '工资类别名称最大可输入120个字符',
            function() {},
            'warning'
          )
          return false
        }
        return true
      },

      // 保存并新增
      saveAdd: function(formData) {
        var formData = $('#frmQuery').serializeObject()
        if (!page.checkData(formData)) {
          return
        }
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.savePrsType, formData, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            $('#frmQuery').setForm({
              prtypeCode: '',
              prtypeName: ''
            })
            ufma.showTip(result.msg, function() {}, 'success')
          }
        })
        var timeId = setTimeout(function() {
          clearTimeout(timeId)
          $('button').attr('disabled', false)
        }, '5000')
      },
      // 保存
      save: function() {
        var formData = $('#frmQuery').serializeObject()
        if (!page.checkData(formData)) {
          return
        }
        var url = $.isEmptyObject(window.ownerData)
          ? interfaceURL.savePrsType
          : interfaceURL.updatePrsType
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(url, formData, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            _close('sure', result.msg)
          }
        })
        var timeId = setTimeout(function() {
          clearTimeout(timeId)
          $('button').attr('disabled', false)
        }, '5000')
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        this.initFormData()
      },
      onEventListener: function() {
        // 保存并新增按钮点击事件
        $('#btn-saveadd').on('click', page.saveAdd)
        // 保存按钮点击事件
        $('#btn-save').on('click', page.save)
        // 关闭按钮点击事件
        $('#btn-close').on('click', function() {
          _close()
        })
      },

      //此方法必须保留
      init: function() {
        ufma.parse()
        page.initPage()
        page.onEventListener()
        ufma.parseScroll()
      }
    }
  })()
  /////////////////////
  page.init()

  function stopPropagation(e) {
    if (e.stopPropagation) e.stopPropagation()
    else e.cancelBubble = true
  }
})
