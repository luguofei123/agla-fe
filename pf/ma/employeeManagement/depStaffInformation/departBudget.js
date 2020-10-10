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
	saveEmpPrsType: '/ma/prsitemco/saveEmpPrsType', // 保存
	batchUpgrade:'/ma/emp/maEmp/batchUpgrade', //批量设置
	selectUpgrade: '/ma/emp/maEmp/selectUpgrade' // 获取数据
  }
  var pageLength = 25
  var page = (function() {
    return {
      initCombox: function(formData) {
    	var posiLeveList = $.isNull(formData[0].data[0].asValList) ? [] : formData[0].data[0].asValList;
    	page.posiLeveList = posiLeveList;
    	var posiCodeList = $.isNull(formData[1].data[0].asValList) ? [] : formData[1].data[0].asValList;
    	page.posiCodeList = posiCodeList;
        $('#posiLevel').ufTreecombox({
          idField: 'valId',
          textField: 'val',
          placeholder: '请选择数据类型',
          data: posiLeveList,
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        }),
        $('#posiCode').ufTreecombox({
          idField: 'valId',
          textField: 'val',
          placeholder: '请选择数据类型',
          data: posiCodeList,
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        })
      },
      // 初始化表单
      initFormData: function() {
        ufma.get(interfaceURL.selectUpgrade, '', function(result) {
	    	if (result.flag == 'fail') {
	    		ufma.showTip(result.msg, function() {}, 'warning')
	        } else if (result.flag == 'success') {
	        	page.initCombox(result.data); 
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
        if (formData.posiLevel.trim() === '') {
          ufma.showTip('请选择工资类别', function() {}, 'warning')
          return false
        }
        if (formData.posiCode.trim() === '') {
          ufma.showTip('请选择银行代发文件格式', function() {}, 'warning')
          return false
        }
        return true
      },
      // 保存
      save: function() {
        var formData = $('#frmQuery').serializeObject()
//        if (!page.checkData(formData)) {
//          return
//        }
        var PosiLevelIncrease = $("input[name='posiLevelIncrease']:checked").val()==null?"":$("input[name='posiLevelIncrease']:checked").val();
        var PosiCodeIncrease = $("input[name='posiCodeIncrease']:checked").val()==null?"":$("input[name='posiCodeIncrease']:checked").val();
        var posiLevel = formData.posiLevel;
        var posiCode = formData.posiCode;
        if(posiLevel!=null&&""!=posiLevel){
        	PosiLevelIncrease = posiLevel
        }
        if(posiCode!=null&&""!=posiCode){
        	PosiCodeIncrease = posiCode
        }
        if("on" == PosiLevelIncrease){
        	PosiLevelIncrease = ""
        }
        if("on" == PosiCodeIncrease){
        	PosiCodeIncrease = ""
        }
        var posiLevelList = []
        for (var i = 0; i < page.posiLeveList.length; i++) {
        	var item = page.posiLeveList[i]
        	posiLevelList.push(page.posiLeveList[i].valId)
        }
        var posiCodeList = []
        for (var i = 0; i < page.posiCodeList.length; i++) {
        	var item = page.posiCodeList[i]
        	posiCodeList.push(page.posiCodeList[i].valId)
        }
        openData = {
        	posiLevelList:posiLevelList,
        	posiCodeList:posiCodeList,
        	posiLevelIncrease:PosiLevelIncrease,
        	posiCodeIncrease:PosiCodeIncrease,
        	rmwyidList:window.ownerData.rmwyidList
        }
        var url = $.isEmptyObject(window.ownerData)
          ? interfaceURL.savePrsItemCo
          : interfaceURL.batchUpgrade
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
        $('input[name="posiLevelIncrease"]').on('click', function() {
          if ($(this).val() == 'Upgrade') {
        	  $('#posiLevel').getObj().setEnabled();
        	  $('#posiLevel').getObj().val('');
          } else {
        	  $('#posiLevel').getObj().setEnabled(true);
          }
        })
        $('input[name="posiCodeIncrease"]').on('click', function() {
          if ($(this).val() == 'Upgrade') {
        	  $('#posiCode').getObj().setEnabled();
        	  $('#posiCode').getObj().val('');
          } else {
        	  $('#posiCode').getObj().setEnabled(true);
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
