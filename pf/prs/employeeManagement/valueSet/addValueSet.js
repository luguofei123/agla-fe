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
    saveAsValSet: '/prs/asvalset/saveAsValSet', //新增保存
    updateAsValSet: '/prs/asvalset/updateAsValSet', //修改保存
    getVal: '/prs/asvalset/getVal' //查询
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 判断当前字符串是否是以另外一个给定的子字符串“开头”的
      stringStartsWith: function(string, startsWith) {
        string = string || ''
        if (startsWith.length > string.length) return false
        return string.substring(0, startsWith.length) === startsWith
      },
      //表格列
      recombineColumns: function() {
        var columns = [
          [
            // 支持多表头
            {
              type: 'checkbox',
              field: '',
              name: '',
              width: 50,
              headalign: 'center',
              className: 'no-print',
              align: 'center'
            },
            {
              type: 'input',
              field: 'valId',
              width: 300,
              name: '代码',
              headalign: 'center',
              align: 'left',
              render: function(rowid, rowdata, data) {
                return data
              },
              onKeyup: function(e) {
                if (e.data == '0' || e.data == 0) {
                  var newData = '0'
                  $('#nameTable2inputvalId').val(newData)
                }
              }
            },
            {
              type: 'input',
              field: 'val',
              width: 400,
              name: '名称',
              headalign: 'center',
              align: 'left',
              render: function(rowid, rowdata, data) {
                return data
              }
            },
            {
              type: 'toolbar',
              field: '',
              width: 140,
              name: '操作',
              align: 'center',
              headalign: 'center',
              render: function(rowid, rowdata, data) {
                return (
                  '<a class="to-up btn btn-icon-only btn-sm btn-move-up" data-toggle="tooltip" action= "" title="上移">' +
                  '<span class="glyphicon icon-arrow-top"></span></a>' +
                  '<a class="to-down btn btn-icon-only btn-sm btn-move-down" data-toggle="tooltip" action= "" title="下移">' +
                  '<span class="glyphicon icon-arrow-bottom"></span></a>'
                )
              }
            }
          ]
        ]
        return columns
      },
      //渲染表格
      showTable: function(tableData) {
        page.tableObjData = tableData
        var id = 'nameTable2'
        $('#' + id).ufDatagrid({
          frozenStartColumn: 1, //冻结开始列,从1开始
          frozenEndColumn: 1, //冻结结束列
          data: tableData,
          disabled: false, // 可选择
          columns: page.recombineColumns(),
          initComplete: function(options, data) {
            //去掉谷歌表单自带的下拉提示
            // $(document).on("focus","input",function () {
            //     $(this).attr("autocomplete", "off");
            // });
          }
        })
      },
      // 获取表格数据
      getTableData: function() {
        if (ownerData.valsetId) {
          var argu = { valsetId: ownerData.valsetId }
          ufma.post(interfaceURL.getVal, argu, function(result) {
            if (result.flag === 'success') {
              var data = result.data
              page.showTable(data)
            } else {
              ufma.showTip(result.msg, function() {}, result.flag)
            }
          })
        } else {
          page.showTable([])
        }
      },
      // 设置表单初始值
      setformData: function() {
        $('#valsetId').val(ownerData.valsetId ? ownerData.valsetId : '')
        $('#valsetName').val(ownerData.valsetName ? ownerData.valsetName : '')
        $('#valSql').val(ownerData.valSql ? ownerData.valSql : '')
        if (ownerData.valSql) {
          $('input[name="sqlValue"]').prop('checked', true)
          $('#valSql').attr('disabled', false)
          $('.btn-add-row ').attr('disabled', true)
          $('.btn-del-row ').attr('disabled', true)
          $('.btn-preview').attr('disabled', false)
        }
        if (ownerData.valsetId) {
          $('#valsetId').attr('disabled', true)
        } else {
          $('#valsetId').attr('disabled', false)
        }
      },
      // 保存校验
      checkformData: function(formData) {
        if ($('input[name="sqlValue"]').prop('checked') == true) {
          if (formData.valSql == '') {
            ufma.showTip('请写值集SQL', function() {}, 'warning')
            return false
          }
        } else {
          if (formData.valsetName.trim() == '') {
            ufma.showTip('请写值集名称', function() {}, 'warning')
            return false
          } else if (formData.valsetId.trim() == '') {
            ufma.showTip('请写值集代码', function() {}, 'warning')
            return false
          }
          if (getByteLen(formData.valsetName.trim()) > 60) {
            ufma.showTip(
              '值集名称最大可输入60个字符',
              function() {},
              'warning'
            )
            return false
          }
          if (getByteLen(formData.valsetId.trim()) > 30) {
            ufma.showTip(
              '值集代码最大可输入30个字符',
              function() {},
              'warning'
            )
            return false
          }
        }
        if (!page.stringStartsWith(formData.valsetId, 'VS_MA_EMP')) {
          ufma.showTip(
            '值集代码必须以 "VS_MA_EMP" 开头，请修改！',
            function() {},
            'warning'
          )
          return false
        }
        // 校验重复
        for (var i = 0; i < window.ownerData.allValsetIds.length; i++) {
          var element = window.ownerData.allValsetIds[i]
          if (
            element === formData.valsetId.trim() &&
            window.ownerData.valsetId !== formData.valsetId.trim()
          ) {
            ufma.showTip('值集代码重复', function() {}, 'warning')
            return false
          }
        }

        var tableData = $('#nameTable2')
          .getObj()
          .getData()
        for (var i = 0; i < tableData.length; i++) {
          for (var j = i + 1; j < tableData.length; j++) {
            if (tableData[i].valId === tableData[j].valId) {
              var rowIndex1 = i + 1
              var rowIndex2 = j + 1
              ufma.showTip(
                '表格代码第' + rowIndex1 + '行和第' + rowIndex2 + '行重复',
                function() {},
                'warning'
              )
              return false
            }
          }
        }

        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i]
          var valId = item.valId
          var val = item.val
          var rowIndex = i + 1
          if (valId.trim() && !val.trim()) {
            ufma.showTip(
              '表格代码第' + rowIndex + '行的名称没有填写',
              function() {},
              'warning'
            )
            return false
          }
          if (getByteLen(valId.trim()) > 30) {
            ufma.showTip(
              '表格代码第' + rowIndex + 
              '行中代码最大可输入30个字符',
              function() {},
              'warning'
            )
            return false
          }
          if (getByteLen(val.trim()) > 60) {
            ufma.showTip(
              '表格代码第' + rowIndex + 
              '行中名称最大可输入60个字符',
              function() {},
              'warning'
            )
            return false
          }

        }

        return true
      },
      // 整理表格数据
      getNewTableData: function(formData) {
        var tableDatas = $('#nameTable2')
          .getObj()
          .getData()

        var tableData = []
        for (var i = 0; i < tableDatas.length; i++) {
          tableData.push({
            valsetId: formData.valsetId, // -- sql语句上方值集代码
            valId: tableDatas[i].valId, // --sql语句下方值集代码
            val: tableDatas[i].val, // --sql语句下方值集名称
            ordIndex: i, // --排序号
            lstdate: '',
            isSystem: 'N'
          })
        }
        return tableData
      },
      // 新增保存
      saveAsValSet: function(argu) {
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.saveAsValSet, argu, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag === 'success') {
            _close('sure', result.msg)
          } else {
            ufma.showTip(result.msg, function() {}, result.flag)
          }
        })
        var timeId = setTimeout(function() {
          clearTimeout(timeId)
          $('button').attr('disabled', false)
        }, '5000')
      },
      // 修改保存
      updateAsValSet: function(argu) {
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.updateAsValSet, argu, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag === 'success') {
            _close('sure', result.msg)
          } else {
            ufma.showTip(result.msg, function() {}, result.flag)
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
        page.getTableData()
        page.setformData()
      },
      onEventListener: function() {
        //选择SQL语句引用值集界面变化
        $('input[name="sqlValue"]').on('change', function() {
          if ($(this).prop('checked')) {
            $('#valSql').attr('disabled', false)
            $('.btn-add-row ').attr('disabled', true)
            $('.btn-del-row ').attr('disabled', true)
            $('.btn-preview').attr('disabled', false)
          } else {
            $('#valSql').attr('disabled', true)
            $('.btn-add-row ').attr('disabled', false)
            $('.btn-del-row ').attr('disabled', false)
            $('.btn-preview').attr('disabled', true)
          }
        })
        //关闭
        $('#btn-close').on('click', function() {
          _close()
        })
        //增行
        $(document).on('mousedown', '.btn-add-row', function() {
          location.href = '#a02'
          var rowdata = {
            valId: '',
            val: ''
          }
          var obj = $('#nameTable2').getObj()
          obj.add(rowdata)
          // ufma.isShow(page.reslist);
        })
        //删行
        $(document).on('mousedown', '.btn-del-row', function() {
          var obj = $('#nameTable2').getObj()
          var checkData = obj.getCheckData()
          var $check = $('#nameTable2').find('.check-item:checked')
          if ($check.length > 0) {
            for (var i = 0; i < checkData.length; i++) {
              var rowid = $check.eq(i).attr('rowid')
              obj.del(rowid)
            }
          } else {
            ufma.showTip('请选择要删除的数据', function() {}, 'warning')
            return false
          }
        })
        //上移
        $(document).on('mousedown', '.to-up span', function() {
          $(document).trigger('mousedown')
          var rowindex =
            $(this)
              .parents('tr')
              .index() - 1
          var key = page.tableObjData[rowindex]
          if (rowindex > 0) {
            page.tableObjData[rowindex] = page.tableObjData[rowindex - 1]
            page.tableObjData[rowindex - 1] = key
            var thistr = $(this).parents('tr')
            var thistrnext = $(this)
              .parents('tr')
              .prev('tr')
            thistr.insertBefore(thistrnext)
          }
        })
        //下移
        $(document).on('mousedown', '.to-down span', function() {
          $(document).trigger('mousedown')
          var rowindex =
            $(this)
              .parents('tr')
              .index() - 1
          var key = page.tableObjData[rowindex]
          if (rowindex < page.tableObjData.length - 1) {
            page.tableObjData[rowindex] = page.tableObjData[rowindex + 1]
            page.tableObjData[rowindex + 1] = key
            var thistr = $(this).parents('tr')
            var thistrnext = $(this)
              .parents('tr')
              .next('tr')
            thistr.insertAfter(thistrnext)
          }
        })
        //确定
        $('#btn-sure').on('click', function() {
          var formData = $('#frmQuery').serializeObject()
          if (!page.checkformData(formData)) {
            return
          }
          var argu = {
            asvalSet: [
              {
                valsetId: formData.valsetId, // --sql语句上方值集代码
                valsetName: formData.valsetName, // --sql语句上方值集名称
                valSql: formData.valSql ? formData.valSql : '', // --sql
                lstdate: '',
                isSystem: 'N'
              }
            ]
          }
          if ($('input[name="sqlValue"]').prop('checked')) {
            argu.asVals = []
          } else {
            for (var i = 0; i < argu.asvalSet.length; i++) {
              argu.asvalSet[i].valSql = ''
            }
            argu.asVals = page.getNewTableData(formData)
          }
          if (ownerData.valsetId) {
            page.updateAsValSet(argu)
          } else {
            page.saveAsValSet(argu)
          }
        })
        //预览
        $('.btn-preview').on('click', function() {
          ufma.get()
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
