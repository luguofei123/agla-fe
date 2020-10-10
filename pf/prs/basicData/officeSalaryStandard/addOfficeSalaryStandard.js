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
  var comBoxData = [
    {
      code: '1',
      codeName: '1级'
    },
    {
      code: '2',
      codeName: '2级'
    },
    {
      code: '3',
      codeName: '3级'
    },
    {
      code: '4',
      codeName: '4级'
    },
    {
      code: '5',
      codeName: '5级'
    },
    {
      code: '6',
      codeName: '6级'
    },
    {
      code: '7',
      codeName: '7级'
    },
    {
      code: '8',
      codeName: '8级'
    },
    {
      code: '9',
      codeName: '9级'
    },
    {
      code: '10',
      codeName: '10级'
    },
    {
      code: '11',
      codeName: '11级'
    },
    {
      code: '12',
      codeName: '12级'
    },
    {
      code: '13',
      codeName: '13级'
    },
    {
      code: '14',
      codeName: '14级'
    },
    {
      code: '15',
      codeName: '15级'
    },
    {
      code: '16',
      codeName: '16级'
    },
    {
      code: '17',
      codeName: '17级'
    },
    {
      code: '18',
      codeName: '18级'
    },
    {
      code: '19',
      codeName: '19级'
    },
    {
      code: '20',
      codeName: '20级'
    },
    {
      code: '21',
      codeName: '21级'
    },
    {
      code: '22',
      codeName: '22级'
    },
    {
      code: '23',
      codeName: '23级'
    },
    {
      code: '24',
      codeName: '24级'
    },
    {
      code: '25',
      codeName: '25级'
    },
    {
      code: '26',
      codeName: '26级'
    },
    {
      code: '27',
      codeName: '27级'
    }
  ]

  //接口URL集合
  var interfaceURL = {
    save: '/prs/base/prsDutyGradeDataCo/save' // 保存
  }
  var pageLength = 25
  var dutyId

  var page = (function() {
    return {
      initComBox: function() {
        $('#highLevel').ufTreecombox({
          idField: 'code',
          textField: 'codeName',
          pIdField: 'pCode', //可选
          placeholder: '请选择职级',
          data: comBoxData,
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        })
        $('#lowestLevel').ufTreecombox({
          idField: 'code',
          textField: 'codeName',
          pIdField: 'pCode', //可选
          placeholder: '请选择职级',
          data: comBoxData,
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        })
      },
      // 初始化表单
      initFormData: function() {
        page.initComBox()
        if (!$.isEmptyObject(window.ownerData.rowData)) {
        	$('#frmQuery').setForm(window.ownerData.rowData);
          $('#dutyName').val(window.ownerData.rowData.dutyName)
          $('#highLevel')
            .getObj()
            .val(
              window.ownerData.rowData.highLevel === 0
                ? ''
                : window.ownerData.rowData.highLevel
            )
          $('#lowestLevel')
            .getObj()
            .val(
              window.ownerData.rowData.lowestLevel === 0
                ? ''
                : window.ownerData.rowData.lowestLevel
            )
          $('#leaderSalary').val(
            $.formatMoney(window.ownerData.rowData.leaderSalary, 2)
          )
          $('#unleaderSalary').val(
            $.formatMoney(window.ownerData.rowData.unleaderSalary, 2)
          )
          dutyId = window.ownerData.rowData.dutyId
          $('#btn-saveadd').hide()
        } else {
          $('#btn-saveadd').show()
        }
      },
      save: function(e) {
        var formData = $('#frmQuery').serializeObject()
        // 校验
        if (formData.dutyName.trim() === '') {
          ufma.showTip('请输入职务名称', function() {}, 'warning')
          return false
        }
        if (getByteLen(formData.dutyName.trim()) > 120) {
          ufma.showTip('职务名称最大可输入120个字符', function() {}, 'warning')
          return false
        }
        var argu = {}
        if (dutyId) {
          argu = window.ownerData.rowData
        } else {
          argu.dutyId = ''
          argu.agencyCode = svData.svAgencyCode
          argu.createDate = ''
          argu.createUser = ''
          argu.dutyCode = ''
          argu.latestOpDate = ''
          argu.latestOpUser = ''
          argu.rgCode = svData.svRgCode
          argu.setYear = svData.svSetYear
        }
        argu.dutyName = formData.dutyName
        argu.leaderSalary = Number(formData.leaderSalary.replace(/,/g, ''))
        argu.unleaderSalary = Number(formData.unleaderSalary.replace(/,/g, ''))
        argu.highLevel = Number(formData.highLevel)
        argu.lowestLevel = Number(formData.lowestLevel)
        argu.isUsed = formData.isUsed

        delete argu.office_level
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.save, argu, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip('保存失败！', function() {}, 'warning')
          } else if (result.flag == 'success') {
            if (e.data.flag) {
              $('#frmQuery').setForm({
                dutyName: '',
                leaderSalary: '',
                unleaderSalary: '',
                highLevel: '',
                lowestLevel: '',
                isUsed:''
              })
            } else {
              _close('save', result.msg)
            }
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
        $('#leaderSalary').on('change', function(e) {
          var val = Number(e.delegateTarget.value.replace(/,/g, ''))
          $('#leaderSalary').val($.formatMoney(val, 2))
        })
        $('#unleaderSalary').on('change', function(e) {
          var val = Number(e.delegateTarget.value.replace(/,/g, ''))
          $('#unleaderSalary').val($.formatMoney(val, 2))
        })

        // 保存并新增按钮点击事件
        $('#btn-saveadd').on('click', { flag: true }, page.save)
        // 保存按钮点击事件
        $('#btn-save').on('click', { flag: false }, page.save)
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
