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
    save: '/prs/emp/prsOrg/save', // 部门新增/修改
    getPrsOrgCodeRule: '/prs/emp/prsOrg/getPrsOrgCodeRule', // 部门编码规则
    getPrsOrgEmp: '/prs/emp/prsOrg/getPrsOrgEmp' // 获取负责人信息
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 部门编码规则
      initOrgCodeRule: function() {
        ufma.get(interfaceURL.getPrsOrgCodeRule, '', function(result) {
          var data = result.data
          if (data != null && data != '') {
            $('#prompt').text('编码规则：' + data)
            page.orgCodeRule = data
          }
        })
      },
      // 初始化负责人下拉列表
      initPrincipal: function(data) {
        $('#principal').ufTreecombox({
          idField: 'empCode',
          textField: 'empName',
          pIdField: 'pCode', //可选
          placeholder: '请选择负责人',
          data: data,
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {
            $('#tel').val(data.empTel)
          },
          onComplete: function(sender, data) {}
        })
      },
      // 初始化表单
      initFormData: function() {
        if (window.ownerData.isUpdate) {
          var argu = {
            orgCode: window.ownerData.depData.code,
            agencyCode: svData.svAgencyCode,
            rgCode: svData.svRgCode,
            setYear: svData.svSetYear
          }
          ufma.post(interfaceURL.getPrsOrgEmp, argu, function(result) {
            page.initPrincipal(result.data)
            $('#frmQuery').setForm({
              orgCode: window.ownerData.depData.code,
              orgName: window.ownerData.depData.name,
              isUsed: window.ownerData.depData.isUsed,
              principal: window.ownerData.depData.principal,
              tel: window.ownerData.depData.officePhone
            })
          })
          $('#orgCode').attr('disabled', true)
          $('#btn-saveadd').hide()
        } else {
          page.initPrincipal([])
          $('#orgCode').attr('disabled', false)
          $('#btn-saveadd').show()
        }
      },
      // 校验数据
      checkData: function(formData) {
        if (formData.orgCode.trim() === '') {
          ufma.showTip('请输入部门编码!', function() {}, 'warning')
          return false
        }
        if (formData.orgName.trim() === '') {
          ufma.showTip('请输入部门名称!', function() {}, 'warning')
          return false
        }
        if (getByteLen(formData.orgCode.trim()) > 120) {
          ufma.showTip('部门编码最大可输入120个字符!', function() {}, 'warning')
          return false
        }
        if (getByteLen(formData.orgName.trim()) > 120) {
          ufma.showTip('部门名称最大可输入120个字符!', function() {}, 'warning')
          return false
        }

        // 编码已存在
        if (
          !window.ownerData.isUpdate &&
          $.inArray(formData.orgCode.trim(), page.codeArray) != -1
        ) {
          ufma.showTip('编码已存在!', function() {}, 'warning')
          return false
        }

        // 编码不符合编码规则
        if (page.orgCodeRule) {
          page.dmJson = ufma.splitDMByFA(
            page.orgCodeRule,
            formData.orgCode.trim()
          )
          if (!page.dmJson.isRuled) {
            ufma.showTip('部门编码不符合编码规则!', function() {}, 'warning')
            return false
          }
        }
        // 上级编码不存在
        page.aInputParentCode = page.dmJson.parentDM.split(',')
        page.aInputParentCode.pop()
        if (page.aInputParentCode.length > 0) {
          page.aInputParentCode = page.aInputParentCode.pop()
        } else {
          page.aInputParentCode = '0'
        }
        if (
          page.aInputParentCode &&
          $.inArray(page.aInputParentCode, page.codeArray) === -1
        ) {
          ufma.showTip('上级编码不存在!', function() {}, 'warning')
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
        var argu = {
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
          orgCode: formData.orgCode.trim(),
          orgName: formData.orgName.trim(),
          parentOrgCode: page.aInputParentCode,
          isLowest: 'N',
          isUsed: formData.isUsed,
          principal: $('#principal')
            .getObj()
            .getValue(),
          tel: formData.tel,
          op: 0
        }
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.save, argu, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            ufma.showTip(result.msg, function() {}, 'success')
            page.codeArray.push(formData.orgCode.trim())
            $('#frmQuery').setForm({
              orgCode: '',
              orgName: '',
              principal: '',
              tel: '',
              isUsed: 'Y'
            })

            $('#principal')
              .getObj()
              .val('')
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
        var argu = {
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear,
          orgCode: formData.orgCode.trim(),
          orgName: formData.orgName.trim(),
          parentOrgCode: page.aInputParentCode,
          isLowest: window.ownerData.isLowest,
          isUsed: formData.isUsed,
          principal: $('#principal')
            .getObj()
            .getValue(),
          tel: formData.tel,
          op: window.ownerData.isUpdate ? 1 : 0
        }
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.save, argu, function(result) {
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
        page.initOrgCodeRule()
        page.codeArray = window.ownerData.codeArray
      },
      onEventListener: function() {
        // 保存并新增按钮点击事件
        $('#department-saveadd').on('click', page.saveAdd)
        // 保存按钮点击事件
        $('#department-save').on('click', page.save)
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
