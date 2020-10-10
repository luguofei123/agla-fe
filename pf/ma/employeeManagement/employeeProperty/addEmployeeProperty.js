$(function() {
  //open弹窗的关闭方法
  window._close = function(action, msg) {
    if (window.closeOwner) {
      var data = { action: action, msg: msg }
      window.closeOwner(data)
    }
  }
  var ownerData = window.ownerData
  var svData = ufma.getCommonData()
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

  // 接口URL集合
  var interfaceURL = {
    getValSet: '/ma/asvalset/getValSet', //查询值集
    saveMaEmpProperty: '/ma/emp/maEmpProperty/saveMaEmpProperty', //新增/修改人员属性
    getMinKzzdCode: '/ma/emp/maEmpProperty/getMinKzzdCode' // 获取新的人员属性code
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 设置值集是否可编辑
      setValSetId: function(code) {
        if (code === 'C' || code === 'N' || code === 'D') {
          $('#valsetId')
            .getObj()
            .setEnabled(false)
          $('#valsetId')
            .getObj()
            .val('')
          $('#valsetId_input').attr('disabled', true)
        } else {
          $('#valsetId')
            .getObj()
            .setEnabled(true)
          $('#valsetId_input').attr('disabled', false)
        }
        if (
          !$.isNull(window.ownerData.rowData) &&
          window.ownerData.rowData.isSys === 'Y'
        ) {
          $('#valsetId')
            .getObj()
            .setEnabled(false)
          $('#valsetId_input').attr('disabled', true)
        }
      },
      // 初始化数据类型
      initDataType: function() {
        $('#dataType').ufTreecombox({
          idField: 'code',
          textField: 'codeName',
          pIdField: 'pCode', //可选
          placeholder: '请选择数据类型',
          data: [
            {
              code: 'C',
              codeName: '字符'
            },
            {
              code: 'N',
              codeName: '数字'
            },
            {
              code: 'D',
              codeName: '日期'
            },
            {
              code: 'E',
              codeName: '枚举'
            },
            {
              code: 'R',
              codeName: '引用'
            },
            {
              code: 'X',
              codeName: '多选'
            }
          ],
          leafRequire: true,
          readonly: false,
          onChange: function(sender, data) {
            page.setValSetId(data.code)
          },
          onComplete: function(sender, data) {
            if (!$.isNull(window.ownerData.rowData)) {
              // 编辑的时候不可选
              $('#dataType')
                .getObj()
                .val(window.ownerData.rowData.dataType)
            }
          }
        })
      },
      // 初始化值集
      initValueSet: function() {
        ufma.post(interfaceURL.getValSet, {}, function(result) {
          $('#valsetId').ufTreecombox({
            idField: 'valsetId',
            textField: 'valsetName',
            placeholder: '请选择值集',
            data: result.data,
            leafRequire: true,
            readonly: false,
            onChange: function(sender, data) {},
            onComplete: function(sender, data) {
              if (!$.isNull(window.ownerData.rowData)) {
                var len = 0
                for (var i = 0; i < result.data.length; i++) {
                  if (
                    result.data[i].valsetId !==
                    window.ownerData.rowData.valsetId
                  ) {
                    len += 1
                  }
                }
                // 值不存在，添加
                if (len === result.data.length) {
                  var data = result.data
                  data.push({
                    valsetId: window.ownerData.rowData.valsetId,
                    valsetName: window.ownerData.rowData.valsetId
                  })
                  $('#valsetId')
                    .getObj()
                    .load(data)
                }
                $('#valsetId')
                  .getObj()
                  .val(window.ownerData.rowData.valsetId)
              }
              $('#valsetId')
                .getObj()
                .setEnabled(false)
              $('#valsetId_input').attr('disabled', true)
            }
          })
        })
      },
      // 初始化引用类
      // initReferenceClass: function() {
      //   ufma.get('', {}, function(result) {
      //     $('#defValue').ufTreecombox({
      //       idField: 'code',
      //       textField: 'codeName',
      //       pIdField: 'pCode', //可选
      //       placeholder: '请选择引用类',
      //       data: result.data,
      //       leafRequire: true,
      //       readonly: false,
      //       onChange: function(sender, data) {},
      //       onComplete: function(sender, data) {
      //         if (!$.isNull(window.ownerData.rowData)) {
      //           // 编辑的时候不可选
      //           $('#defValue')
      //             .getObj()
      //             .val(window.ownerData.rowData.defValue)
      //         }
      //       }
      //     })
      //   })
      // },
      // 初始化表单
      initFormData: function() {
        if (!$.isEmptyObject(window.ownerData.rowData)) {
          $('#frmQuery').setForm(window.ownerData.rowData)
          if (window.ownerData.rowData.isSys === 'Y') {
            $('#propertyName').attr('disabled', true)
            $('#dataType').attr('disabled', true)
            $('#dataType')
              .getObj()
              .setEnabled(false)
            $('#dataType_input').attr('disabled', true)
          } else {
            $('#propertyName').attr('disabled', false)
            $('#dataType').attr('disabled', false)
            $('#dataType')
              .getObj()
              .setEnabled(true)
            $('#dataType_input').attr('disabled', false)
          }
        } else {
          $('#propertyName').attr('disabled', false)
          $('#dataType')
            .getObj()
            .setEnabled(true)
          $('#dataType_input').attr('disabled', false)
          var argu = {
            rgCode: svData.svRgCode
          }
          ufma.post(interfaceURL.getMinKzzdCode, argu, function(result) {
            $('#propertyCode').val(result.data)
          })
        }
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        this.initDataType()
        this.initValueSet()
        // this.initReferenceClass()
        this.initFormData()
      },
      onEventListener: function() {
        // 保存按钮点击事件
        $('#btn-save').on('click', function() {
          var frmQuery = $('#frmQuery').serializeObject()
          // 校验
          if (frmQuery.propertyCode.trim() === '') {
            ufma.showTip('请输入属性代码！', function() {}, 'warning')
            return false
          }
          if (frmQuery.propertyName.trim() === '') {
            ufma.showTip('请输入属性名称！', function() {}, 'warning')
            return false
          }
          if (getByteLen(frmQuery.propertyCode.trim()) > 30) {
            ufma.showTip(
              '属性代码最大可输入30个字符',
              function() {},
              'warning'
            )
            return false
          }
          if (getByteLen(frmQuery.propertyName.trim()) > 100) {
            ufma.showTip(
              '属性名称最大可输入100个字符',
              function() {},
              'warning'
            )
            return false
          }
          if (frmQuery.dataType === '') {
            ufma.showTip('请选择数据类型！', function() {}, 'warning')
            return false
          } else {
            if (
              frmQuery.dataType === 'E' ||
              frmQuery.dataType === 'R' ||
              frmQuery.dataType === 'X'
            ) {
              if (frmQuery.valsetId === '') {
                if (
                  frmQuery.propertyCode.trim() === 'POSI_LEVEL' ||
                  frmQuery.propertyCode.trim() === 'POSI_CODE'
                ) {
                } else {
                  ufma.showTip('请选择值集！', function() {}, 'warning')
                  return false
                }
              }
            }
          }

          var isUpdate = $.isNull(window.ownerData.rowData) ? '0' : '1'
          var argu = $.extend({}, frmQuery, { isUpdate: isUpdate })
          $('button').attr('disabled', true)
          ufma.showloading('正在加载数据请耐心等待...')
          ufma.post(interfaceURL.saveMaEmpProperty, argu, function(result) {
            flag = result.flag
            ufma.hideloading()
            $('button').attr('disabled', false)
            if (flag == 'fail') {
              ufma.showTip('保存失败！' + result.msg, function() {}, 'warning')
            } else if (flag == 'success') {
              _close('save', '保存成功！')
            }
          })
          var timeId = setTimeout(function() {
            clearTimeout(timeId)
            $('button').attr('disabled', false)
          }, '5000')
        })
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
})
