$(function() {
  //open弹窗的关闭方法
  window._close = function(action) {
    if (window.closeOwner) {
      var data = { action: action }
      window.closeOwner(data)
    }
  }
  var svData = ufma.getCommonData()
  var ownerData = window.ownerData

  //接口URL集合
  var interfaceURL = {}
  var pageLength = 25

  var page = (function() {
    return {
      // 初始化表单
      initFormData: function() {
        if (!$.isEmptyObject(window.ownerData)) {
          $('#frmQuery').setForm(window.ownerData)
        }
      },

      save: function() {
        var argu = $('#frmQuery').serializeObject()
        // 校验
        if (argu.name === '') {
          ufma.showTip('所得税项目名称', function() {}, 'warning')
          return false
        }
        // TODO: 添加URL
        // 保存
        ufma.post('', argu, function(result) {
          flag = result.flag
          if (flag == 'fail') {
            ufma.showTip('保存失败！', function() {}, 'warning')
          } else if (flag == 'success') {
            ufma.showTip(
              '保存成功！',
              function() {
                 _close('save')
              },
              'success'
            )
          }
        })
        _close('save')
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        this.initFormData()
      },
      onEventListener: function() {
        // 保存按钮点击事件
        $('#btn-save').on('click', page.save)
        // 关闭按钮点击事件
        $('#btn-close').on('click', function() {
          var tmpFormData = $('#frmQuery').serializeObject()
          if (!ufma.jsonContained(ownerData, tmpFormData)) {
            ufma.confirm('您修改了所得税项目，关闭前是否保存', function(isOk) {
              if (isOk) {
                page.save()
              } else {
                _close()
              }
            })
          } else {
            _close()
          }
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
