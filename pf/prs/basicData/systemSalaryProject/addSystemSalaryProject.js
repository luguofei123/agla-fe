$(function() {
  //open弹窗的关闭方法
  window._close = function(action, msg) {
    if (window.closeOwner) {
      var data = { action: action, msg: msg }
      window.closeOwner(data)
    }
  }
  // var svData = ufma.getCommonData()
  // var ownerData = window.ownerData
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
    savePrsItem: '/prs/prsitem/savePrsItem', // 新增系统工资项目
    getNewPritemCode: '/prs/prsitem/getNewPritemCode', // 获取新的工资项目编码
    updatePrsItem: '/prs/prsitem/updatePrsItem' // 修改系统工资项目
  }
  var pageLength = 25

  var page = (function() {
    return {
      initPritemTypeCombox: function() {
        $('#pritemType').ufTreecombox({
          idField: 'code',
          textField: 'codeName',
          pIdField: 'pCode', //可选
          placeholder: '请选择数据类型',
          data: [
            {
              code: '01',
              codeName: '基本工资项'
            },
            {
              code: '02',
              codeName: '子女教育'
            },
            {
              code: '03',
              codeName: '继续教育'
            },
            {
              code: '04',
              codeName: '住房贷款利息'
            },
            {
              code: '05',
              codeName: '住房租金'
            },
            {
              code: '06',
              codeName: '赡养老人'
            },
            {
              code: '07',
              codeName: '大病医疗'
            }
          ],
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        })
      },
      // 初始化表单
      initFormData: function() {
        page.initPritemTypeCombox()
        if (!$.isEmptyObject(window.ownerData)) {
          $('#frmQuery').setForm(window.ownerData)
          $('#pritemType')
            .getObj()
            .val(window.ownerData.pritemType)
          $('#btn-saveadd').hide()
        } else {
          ufma.post(interfaceURL.getNewPritemCode, {}, function(result) {
            $('#pritemCode').val(result.data)
            $('#pritemType')
              .getObj()
              .val('01')
          })
          var date = new Date()
          $('#setYear').val(date.getFullYear())
          $('#btn-saveadd').show()
        }
      },
      // 校验数据
      checkData: function(formData) {
        if (formData.pritemCode.trim() === '') {
          ufma.showTip('请输入工资项目编码', function() {}, 'warning')
          return false
        }
        if (formData.pritemName.trim() === '') {
          ufma.showTip('请输入工资项目名称', function() {}, 'warning')
          return false
        }
        if (!formData.pritemType) {
          ufma.showTip('请选择工资项目类型', function() {}, 'warning')
          return false
        }
        if (getByteLen(formData.pritemCode.trim()) > 120) {
          ufma.showTip(
            '工资项目编码最大可输入120个字符',
            function() {},
            'warning'
          )
          return false
        }
        if (getByteLen(formData.pritemName.trim()) > 120) {
          ufma.showTip(
            '工资项目名称最大可输入120个字符',
            function() {},
            'warning'
          )
          return false
        }
        if (formData.pritemName.indexOf('-')>-1) {
          ufma.showTip(
            '工资项目名称不能含有符号“-”',
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
        ufma.post(interfaceURL.savePrsItem, formData, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            var msg = result.msg
            ufma.post(interfaceURL.getNewPritemCode, {}, function(result) {
              $('#pritemCode').val(result.data)
              $('#pritemName').val('')
              ufma.showTip(msg, function() {}, 'success')
            })
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
          ? interfaceURL.savePrsItem
          : interfaceURL.updatePrsItem
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
