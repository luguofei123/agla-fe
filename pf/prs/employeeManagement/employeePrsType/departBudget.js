$(function() {
  //open弹窗的关闭方法
  window._close = function(action, msg) {
    if (window.closeOwner) {
      var data = { action: action, msg: msg }
      window.closeOwner(data)
    }
  }
  var svData = ufma.getCommonData()
  var ownerData = window.ownerData
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
	saveEmpPrsType: '/prs/prsitemco/saveEmpPrsType', // 保存
	batchSetting:'/prs/emp/prsType/batchSetting', //批量设置
    selectPrsType: '/prs/emp/prsType/selectMaEmpPrsTypeList' // 获取数据
  }
  var pageLength = 25
  var page = (function() {
    return {
      initCombox: function(formData) {
    	var prsTypeList = $.isNull(formData.data.prsTypeCo) ? [] : formData.data.prsTypeCo;
    	page.prsTypes = prsTypeList;
    	var bankfileStyle = $.isNull(formData.data.bankfileStyle) ? [] : formData.data.bankfileStyle;
        $('#prsType').ufTreecombox({
          idField: 'prtypeCode',
          textField: 'prtypeName',
          placeholder: '请选择数据类型',
          data: prsTypeList,
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        }),
        $('#bankAcc').ufTreecombox({
          idField: 'prstylCode',
          textField: 'prstylName',
          placeholder: '请选择数据类型',
          data: bankfileStyle,
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        }),
        $('#bankAccOther').ufTreecombox({
        	idField: 'prstylCode',
            textField: 'prstylName',
            placeholder: '请选择数据类型',
            data: bankfileStyle,
            leafRequire: true,
            readonly: false,
            onChange: function(sender, data) {},
            onComplete: function(sender, data) {}
          })
      },
      // 初始化表单
      initFormData: function() {
        ufma.get(interfaceURL.selectPrsType, '', function(result) {
	    	if (result.flag == 'fail') {
	    		ufma.showTip(result.msg, function() {}, 'warning')
	        } else if (result.flag == 'success') {
	        	page.initCombox(result.data[0]); 
	        }
        });
        /*if (!$.isEmptyObject(window.ownerData)) {
          $('#frmQuery').setForm(window.ownerData)
          $('#pritemType')
            .getObj()
            .val(window.ownerData.pritemType)
          $('#btn-saveadd').hide()
        } else {
        }*/
      },
      // 校验数据
      checkData: function(formData) {
        if (formData.prsType.trim() === '') {
          ufma.showTip('请选择工资类别', function() {}, 'warning')
          return false
        }
        if (formData.bankAcc.trim() === '') {
          ufma.showTip('请选择银行代发文件格式', function() {}, 'warning')
          return false
        }
        return true
      },
      // 保存
      save: function() {
        var formData = $('#frmQuery').serializeObject()
        if (!page.checkData(formData)) {
          return
        }
        var mo = '';
        for (var j = 0; j < page.prsTypes.length; j++) {
            if (formData.prsType === page.prsTypes[j].prtypeCode ) {
              mo = page.prsTypes[j].mo;
            }
        }
        openData = {
        	prsType:formData.prsType,
        	bankAcc:formData.bankAcc,
        	mo : mo,
        	bankAccOther:formData.bankAccOther,
        	rmwyidList:window.ownerData.rmwyidList
        }
        var url = $.isEmptyObject(window.ownerData)
          ? interfaceURL.savePrsItemCo
          : interfaceURL.batchSetting
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(url, openData, function(result) {
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
