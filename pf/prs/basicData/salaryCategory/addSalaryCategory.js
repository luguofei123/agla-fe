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
    savePrsTypeCo: '/prs/PrsTypeCo/savePrsTypeCo', // 新增保存
    updatePrsTypeCo: '/prs/PrsTypeCo/updatePrsTypeCo' // 修改保存
  }

  var page = (function() {
    return {
      initMoCombox: function() {
        $('#mo').ufTreecombox({
          idField: 'code',
          textField: 'codeName',
          pIdField: 'pCode', //可选
          placeholder: '请选择数据类型',
          data: [
            {
              code: '1',
              codeName: '1月'
            },
            {
              code: '2',
              codeName: '2月'
            },
            {
              code: '3',
              codeName: '3月'
            },
            {
              code: '4',
              codeName: '4月'
            },
            {
              code: '5',
              codeName: '5月'
            },
            {
              code: '6',
              codeName: '6月'
            },
            {
              code: '7',
              codeName: '7月'
            },
            {
              code: '8',
              codeName: '8月'
            },
            {
              code: '9',
              codeName: '9月'
            },
            {
              code: '10',
              codeName: '10月'
            },
            {
              code: '11',
              codeName: '11月'
            },
            {
              code: '12',
              codeName: '12月'
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
        page.initMoCombox()
        if (!$.isEmptyObject(window.ownerData)) {//编辑
          $('#mo_wrap').addClass('hide');
          $('#modis_wrap').removeClass('hide');
          $('#frmQuery').setForm(window.ownerData);
          $('#frmQuery').setForm({modis: window.ownerData.mo+'月'});
          $('#prtypeCode').attr('disabled', true)
          $('#btn-saveadd').hide();
          var payEditStat = window.ownerData.payEditStat;
          if (!$.isNull(payEditStat)) {
        	  $('#mo').getObj().setEnabled();
          }
        } else {
          $('#mo_wrap').removeClass('hide');
          $('#modis_wrap').addClass('hide');
          $('#frmQuery').setForm({
            prtypeCode: '',
            prtypeName: '',
            isCalcTax: 'Y',
            mo: '1',
            isUsed: 'Y'
          })
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
        if (!formData.mo&&!formData.modis) {
          ufma.showTip('请选择发放月份', function() {}, 'warning')
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
        if (getByteLen(formData.payRemark.trim()) > 400) {
          ufma.showTip(
            '发放说明最大可输入400个字符',
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
        ufma.post(interfaceURL.savePrsTypeCo, formData, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            $('#frmQuery').setForm({
              prtypeCode: '',
              prtypeName: '',
              isCalcTax: 'Y',
              mo: '1',
              isUsed: 'Y'
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
          ? interfaceURL.savePrsTypeCo
          : interfaceURL.updatePrsTypeCo
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
