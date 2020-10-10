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
    savePrsDutyGradeSubsidyCo:
      '/prs/prsdutygradesubsidyco/savePrsDutyGradeSubsidyCo', // 新增职务补贴标准
    searchPrsDutyGradeDataCo:
      '/prs/base/prsDutyGradeDataCo/searchPrsDutyGradeDataCo', // 获取职务工资标准列表
    getPrsDutyGradeSubsidyCoByKey:
      '/prs/prsdutygradesubsidyco/getPrsDutyGradeSubsidyCoByKey', // 查询单个职务补贴标准
    updatePrsDutyGradeSubsidyCo:
      '/prs/prsdutygradesubsidyco/updatePrsDutyGradeSubsidyCo', // 修改职务补贴标准
    getTypeItemCoList: '/prs/prsdutygradesubsidyco/getTypeItemCoList' // 获取已启用的工资类型项目
  }

  var pageLength = 25
  var prsDutyGradeSubsidyCoByKeyData
  var modalCellTree = null

  var cacheData = {
    prtypeData: [], // 工资类别数据
    typeItemCoList: null // 已启用的工资类型项目
  }

  var page = (function() {
    return {
      // 设置职务对应表格数据
      setPrsDutyGradeSubsidy: function(tableData) {
        var columns = [
          [
            {
              type: 'indexcolumn',
              field: '',
              width: 40,
              name: '序号',
              headalign: 'center',
              align: 'left',
              render: function(rowid, rowdata, data) {
                return data
              }
            },
            {
              field: 'dutyName',
              name: '职务名称',
              headalign: 'center',
              align: 'left'
            },
            {
              type: 'money',
              field: 'leaderVal',
              name: '领导',
              headalign: 'center',
              align: 'right',
              render: function(rowid, rowdata, data) {
                if (!data || data == '0.00' || data == 0) {
                  return $.formatMoney(0, 2)
                }
                return $.formatMoney(data, 2)
              }
            },
            {
              type: 'money',
              field: 'unleaderVal',
              name: '非领导',
              headalign: 'center',
              align: 'right',
              render: function(rowid, rowdata, data) {
                if (!data || data == '0.00' || data == 0) {
                  return $.formatMoney(0, 2)
                }
                return $.formatMoney(data, 2)
              }
            }
          ]
        ]
        page.initPrsDutyGradeTable(tableData, columns)
      },
      // 职务对应表格初始化
      initPrsDutyGradeTable: function(tableData, columns) {
        page.prsDutyGradeTable = tableData
        var id = 'prsDutyGradeTable'
        $('#' + id).ufDatagrid({
          frozenStartColumn: 1, //冻结开始列,从1开始
          frozenEndColumn: 1, //冻结结束列
          data: tableData,
          disabled: false, // 可选择
          columns: columns,
          initComplete: function(options, data) {}
        })
      },
      // 工资类别对应表格单元格监听事件
      addListenerToMainTable: function() {
        /**
         * 单击单元格可以进入编辑状态
         */
        $('#typeItemTable')
          .off('click', 'tbody td')
          .on('click', 'tbody td', function(e) {
            var tbl = $('#typeItemTable').DataTable()
            var col = tbl.column(this)
            var sId = col.dataSrc()
            if (typeof sId === 'undefined') {
              page.tblClearCbbCell()
              return
            }
            page.tblClearCbbCell()
            // 工资类别
            if (sId === 'prtypeName') {
              page.prtypeNameCell(this, tbl)
            } else if (sId === 'pritemName') {
              // 工资项目
              page.pritemNameCell(this, tbl)
            }
          })
      },
      prtypeNameCell: function(that, tbl) {
        //先清空cell里面的值
        var tmpDivId = 'multiModalCellTree',
          tmpDiv = "<div id='" + tmpDivId + "' style='height:28px'></div>",
          tmpFullName = tbl.cell(that).data()
        tbl.cell(that).data('')
        $(that).html(tmpDiv)
        $(that).attr('lastVal', tmpFullName)
        modalCellTree = page.bindEleComboBox(
          '#' + tmpDivId,
          cacheData.prtypeData,
          page.tblAfterPrtypeNameCellChange,
          'prtypeCode',
          'prtypeName',
          '请选择工资类别'
        )
        $('#' + modalCellTree.setting.id).css('width', '290px')
        $('#' + modalCellTree.setting.id + " input[type='text']").removeAttr(
          'readonly'
        )
        if (!$.isNull(tmpFullName)) {
          //再点击时不清空已选要素
          var code = tbl.row(that).data().prtypeCode
          $('#' + modalCellTree.setting.id)
            .ufmaTreecombox()
            .setValue(code, tmpFullName)
        }
      },
      pritemNameCell: function(that, tbl) {
        //先清空cell里面的值
        var tmpDivId = 'multiModalCellTree',
          tmpDiv = "<div id='" + tmpDivId + "' style='height:28px'></div>",
          tmpFullName = tbl.cell(that).data()
        tbl.cell(that).data('')
        $(that).html(tmpDiv)
        $(that).attr('lastVal', tmpFullName)
        var prtypeCode = tbl.row(that).data().prtypeCode;//解决prtypeCode不存在问题
        var comboxData = [];
        if(cacheData.typeItemCoList[prtypeCode]){
          cacheData.typeItemCoList[prtypeCode].pritems? comboxData = cacheData.typeItemCoList[prtypeCode].pritems:comboxData = []
        }
        modalCellTree = page.bindEleComboBox(
          '#' + tmpDivId,
          comboxData,
          page.tblAfterPritemNameCellChange,
          'pritemCode',
          'pritemName',
          '请选择工资项目'
        )
        $('#' + modalCellTree.setting.id).css('width', '290px')
        $('#' + modalCellTree.setting.id + " input[type='text']").removeAttr(
          'readonly'
        )
        if (!$.isNull(tmpFullName)) {
          //再点击时不清空已选要素
          var code = tbl.row(that).data().pritemCode
          $('#' + modalCellTree.setting.id)
            .ufmaTreecombox()
            .setValue(code, tmpFullName)
        }
      },
      tblClearCbbCell: function() {
        if ($.isNull(modalCellTree)) {
          return
        }
        var $tdTree = $('#' + modalCellTree.setting.id),
          $td = $tdTree.closest('td')
        $tdTree.removeClass()
        $tdTree.removeAttr('id')
        $tdTree.removeAttr('style')
        $tdTree.removeAttr('aria-new')
        $tdTree.empty()
        modalCellTree = null
        if ($td.text() == null || $td.text() == '') {
          if (!$.isNull($td.attr('lastVal'))) {
            $td.empty()
            page.DataTable.cell($td).data($td.attr('lastVal'))
          }
        }
      },
      redrawTypeItemTable: function($td, data) {
        var tbl = page.DataTable
        tbl.cell($td).data(data.prtypeName)
        tbl.row($td).data().prtypeCode = data.prtypeCode
        tbl.row($td).data().pritemCode = ''
        tbl.row($td).data().pritemName = ''
        var tableData = page.DataTable.data()
        var index = tbl.row($td).index()
        // 工资类别不能重复选择
        for (var i = 0; i < tableData.length; i++) {
          if (i !== index && tableData[i].prtypeCode === data.prtypeCode) {
            ufma.showTip('工资类别不能重复选择!', function() {}, 'warning')
            var item = tableData[index]
            item.prtypeCode = ''
            item.prtypeName = ''
            tableData.splice(index, 1, item)
            break
          }
        }
        tbl.clear().draw()
        tbl.rows.add(tableData)
        tbl.columns.adjust().draw()
      },
      tblAfterPrtypeNameCellChange: function(data) {
        if (modalCellTree == null) {
          return
        }
        var $td = $('#' + modalCellTree.setting.id).closest('td')
        if (data.prtypeName != null && data.prtypeName != '') {
          page.redrawTypeItemTable($td, data)
        }
      },
      tblAfterPritemNameCellChange: function(data) {
        if (modalCellTree == null) {
          return
        }
        var $td = $('#' + modalCellTree.setting.id).closest('td')
        var tbl = page.DataTable
        //$td.empty();
        if (data.pritemName != null && data.pritemName != '') {
          tbl.cell($td).data(data.pritemName)
          $(this).attr('pritemCode', data.pritemCode)
          tbl.row($td).data().pritemCode = data.pritemCode
        }
      },
      /**
       * doc : 一个html 的 doc节点
       * eleNameArr：元素的name值，elename
       * funcOnChangeArr：元素的相应事件
       * valueField
       * textField
       */
      bindEleComboBox: function(
        doc,
        data,
        funcOnChangeArr,
        valueField,
        textField,
        placeholder
      ) {
        var rst = null,
          rst = $(doc).ufmaTreecombox({
            valueField: valueField,
            textField: textField,
            placeholder: placeholder,
            data: data,
            leafRequire: true,
            readonly: false,
            onchange: funcOnChangeArr
          })
        return rst
      },
      // 设置工资类别对应表格数据
      setPrsTypeItemSubsidy: function(tableData) {
        var columns = [
          {
            title:
              '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
              '<input type="checkbox" id="th-check" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
              '&nbsp;<span></span></label>',
            className: 'nowrap check-style tc',
            width: 30,
            data: null,
            render: function(data, type, rowdata, meta) {
              return (
                '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                '<input type="checkbox" class="checkboxes" pritemCode="' +
                rowdata.pritemCode +
                '" />' +
                '&nbsp;<span></span></label>'
              )
            }
          },
          {
            title: '序号',
            width: 30,
            className: 'nowrap tc isprint',
            render: function(data, type, rowdata, meta) {
              var index = meta.row + 1
              return '<span>' + index + '</span>'
            }
          },
          {
            title: '工资类别',
            data: 'prtypeName',
            width: 300,
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '工资项目',
            data: 'pritemName',
            width: 300,
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          }
        ]
        page.initTypeItemTable(tableData, columns)
      },
      // 工资类别对应表格初始化
      initTypeItemTable: function(data, columns) {
        var id = 'typeItemTable'
        var toolBar = $('#' + id).attr('tool-bar')
        page.DataTable = $('#' + id).DataTable({
          language: {
            url: bootPath + 'agla-trd/datatables/datatable.default.js'
          },
          data: data,
          bPaginate: false,
          bFilter: false, //去掉搜索框
          bLengthChange: true, //去掉每页显示多少条数据
          processing: true, //显示正在加载中
          bInfo: false, //页脚信息
          bSort: false, //排序功能
          bAutoWidth: false, //表格自定义宽度，和swidth一起用
          bProcessing: true,
          bDestroy: true,
          columns: columns,
          dom: '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
          buttons: [],
          initComplete: function(settings, json) {
            $('#level-salary-grade-table_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            ufma.setBarPos($(window))
            //驻底end

            //checkbox的全选操作
            $('.datatable-group-checkable').on('change', function() {
              var isCorrect = $(this).is(':checked')
              $('#' + id + ' .checkboxes').each(function() {
                isCorrect
                  ? $(this).prop('checked', !0)
                  : $(this).prop('checked', !1)
                isCorrect
                  ? $(this)
                      .closest('tr')
                      .addClass('selected')
                  : $(this)
                      .closest('tr')
                      .removeClass('selected')
              })
              $('.datatable-group-checkable').prop('checked', isCorrect)
            })

            ufma.isShow(page.reslist)
            $('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
          },
          drawCallback: function(settings) {
            //权限控制
            ufma.isShow(page.reslist)
            ufma.setBarPos($(window))
            $('#typeItemTable').ufScrollBar('update')
          }
        })
        page.addListenerToMainTable()
      },
      // 获取职务工资标准列表
      getPrsDutyGradeData: function(flag, tableData) {
        var argu = {
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode
        }

        ufma.post(interfaceURL.searchPrsDutyGradeDataCo, argu, function(
          result
        ) {
          var data = result.data
          var len = data ? data.length : 0
          if (result.flag === 'success') {
            if (flag) {
              var tempData = []
              for (var i = 0; i < data.length; i++) {
                var empty = false
                for (var j = 0; j < tableData.length; j++) {
                  if (data[i].dutyCode === tableData[j].dutyCode) {
                    var item = tableData[j]
                    item.dutyName = data[i].dutyName
                    tempData.push(item)
                    break
                  }
                  if (j === tableData.length - 1) {
                    empty = true
                  }
                }
                if (empty) {
                  tempData.push({
                    prsubsCode: ownerData.prsubsCode,
                    dutyCode: data[i].dutyCode,
                    dutyName: data[i].dutyName,
                    leaderVal: 0,
                    unleaderVal: 0
                  })
                }
              }
              page.setPrsDutyGradeSubsidy(tempData)
            } else {
              for (var i = 0; i < len; i++) {
                data[i].leaderVal = 0
                data[i].unleaderVal = 0
              }
              page.setPrsDutyGradeSubsidy(data)
            }
          } else {
            ufma.showTip(result.msg, function() {}, result.flag)
          }
        })
      },
      // 获取已启用的工资类型项目
      getTypeItemCoList: function(tableData) {
        ufma.post(interfaceURL.getTypeItemCoList, {}, function(result) {
          if (result.flag === 'success') {
            cacheData.prtypeData = []
            cacheData.typeItemCoList = result.data //object 001 002 003
            for (var prop in cacheData.typeItemCoList) {
              if (cacheData.typeItemCoList.hasOwnProperty(prop)) {
                cacheData.prtypeData.push({
                  prtypeCode: cacheData.typeItemCoList[prop].prtypeCode,
                  prtypeName: cacheData.typeItemCoList[prop].prtypeName
                })
              }
            }
            page.setPrsTypeItemSubsidy(tableData)
          } else {
            ufma.showTip(result.msg, function() {}, result.flag)
          }
        })
      },
      // 查询单个职务补贴标准
      getPrsDutyGradeSubsidyCoByKey: function(prsubsCode) {
        var argu = { prsubsCode: prsubsCode }
        ufma.post(interfaceURL.getPrsDutyGradeSubsidyCoByKey, argu, function(
          result
        ) {
          if (result.flag === 'success') {
            prsDutyGradeSubsidyCoByKeyData = result.data
            page.getTypeItemCoList(result.data.prsTypeItemSubsidyCos)
            page.getPrsDutyGradeData(true, result.data.prsDutyGradeSubsidyCos)
          } else {
            ufma.showTip(result.msg, function() {}, result.flag)
          }
        })
      },
      checkData: function(formData) {
        if (formData.prsubsName.trim() === '') {
          ufma.showTip('补贴项目名称', function() {}, 'warning')
          return false
        }
        if (getByteLen(formData.prsubsName.trim()) > 120) {
          ufma.showTip(
            '补贴项目名称最大可输入120个字符',
            function() {},
            'warning'
          )
          return false
        }
        var data = page.DataTable.data().toArray()
        for (var i = 0; i < data.length; i++) {
          if (data[i].prtypeCode && !data[i].pritemCode) {
            var index = i + 1
            ufma.showTip(
              '请选择第' + index + '行的工资项目',
              function() {},
              'warning'
            )
            return false
          }
        }
        return true
      },
      formatTable: function() {
        var tableData = []
        var data = page.DataTable.data().toArray()
        for (var i = 0; i < data.length; i++) {
          if (data[i].prtypeCode && data[i].pritemCode) {
            tableData.push(data[i])
          }
        }
        return tableData
      },
      // flag: true 保存并新增 flag：false 保存
      saveAdd: function(e) {
        var formData = $('#frmQuery').serializeObject()
        if (!page.checkData(formData)) {
          return
        }
        var tableData = $('#prsDutyGradeTable')
          .getObj()
          .getData()
        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i]
          item.leaderVal = Number(item.leaderVal)
          item.unleaderVal = Number(item.unleaderVal)
        }
        var argu = {
          prsubsName: formData.prsubsName,
          isUsed: formData.isUsed,
          PrsDutyGradeSubsidyCos: tableData,
          PrsTypeItemSubsidyCos: page.formatTable()
        }
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.savePrsDutyGradeSubsidyCo, argu, function(
          result
        ) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            if (e.data.flag) {
              $('#frmQuery').setForm({
                prsubsName: '',
                isUsed: 'Y'
              })
              page.getPrsDutyGradeData(false)
              page.setPrsTypeItemSubsidy([])
            } else {
              _close('sure', result.msg)
            }
          }
        })
        var timeId = setTimeout(function() {
          clearTimeout(timeId)
          $('button').attr('disabled', false)
        }, '5000')
      },
      // 修改保存
      save: function() {
        var formData = $('#frmQuery').serializeObject()
        if (!page.checkData(formData)) {
          return
        }
        var tableData = $('#prsDutyGradeTable')
          .getObj()
          .getData()
        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i]
          item.leaderVal = Number(item.leaderVal)
          item.unleaderVal = Number(item.unleaderVal)
        }
        // 新增保存
        if ($.isEmptyObject(window.ownerData)) {
          var argu = {
            prsubsName: formData.prsubsName,
            isUsed: formData.isUsed,
            PrsDutyGradeSubsidyCos: tableData,
            PrsTypeItemSubsidyCos: page.formatTable()
          }
          var url = interfaceURL.savePrsDutyGradeSubsidyCo
        } else {
          // 修改保存
          var argu = {
            prsubsName: formData.prsubsName,
            isUsed: formData.isUsed,
            prsubsCode: prsDutyGradeSubsidyCoByKeyData.prsubsCode,
            agencyCode: prsDutyGradeSubsidyCoByKeyData.agencyCode,
            setYear: prsDutyGradeSubsidyCoByKeyData.setYear,
            rgCode: prsDutyGradeSubsidyCoByKeyData.rgCode,
            createUser: prsDutyGradeSubsidyCoByKeyData.createUser,
            createDate: prsDutyGradeSubsidyCoByKeyData.createDate,
            latestOpUser: prsDutyGradeSubsidyCoByKeyData.latestOpUser,
            latestOpDate: prsDutyGradeSubsidyCoByKeyData.latestOpDate,
            PrsDutyGradeSubsidyCos: tableData,
            PrsTypeItemSubsidyCos: page.formatTable()
          }
          var url = interfaceURL.updatePrsDutyGradeSubsidyCo
        }
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(url, argu, function(result) {
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
      // 初始化表单
      initFormData: function() {
        if (!$.isEmptyObject(window.ownerData)) {
          $('#frmQuery').setForm(window.ownerData)
          $('#btn-saveadd').hide()
        } else {
          $('#btn-saveadd').show()
        }
      },

      initTable: function() {
        // 修改初始化
        if (!$.isEmptyObject(window.ownerData)) {
          page.getPrsDutyGradeSubsidyCoByKey(ownerData.prsubsCode)
        } else {
          // 新增初始化
          page.getTypeItemCoList([])
          page.getPrsDutyGradeData(false)
        }
      },

      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        this.initFormData()
        page.initTable()
      },
      onEventListener: function() {
        //tab切换
        $('.nav-tabs li').on('click', function() {
          var index = $(this).index()
          $('.nav-content')
            .eq(index)
            .removeClass('hidden')
            .siblings('.nav-content')
            .addClass('hidden')
          var nameTableData = []
          if (index == 0) {
            if ($('#prsDutyGradeTable').getObj().getData) {
              nameTableData = $('#prsDutyGradeTable')
                .getObj()
                .getData()
            }
            $('#prsDutyGradeTable')
              .getObj()
              .load(nameTableData)
          } else if (index == 1) {
            nameTableData = page.DataTable.data()
            page.setPrsTypeItemSubsidy(nameTableData)
          }
        })
        //增行
        $(document).on('click', '.btn-add-row', function() {
          page.DataTable.row
            .add({
              prtypeCode: '',
              pritemCode: '',
              prtypeName: '',
              pritemName: ''
            })
            .draw()
        })
        //删行
        $(document).on('click', '.btn-del-row', function() {
          var checks = $('input.checkboxes:checked')
          if (checks.length === 0) {
            ufma.showTip('请选择要删除的数据', function() {}, 'warning')
            return false
          }
          checks.each(function() {
            var tr = $(this).closest('tr')
            page.DataTable.row(tr)
              .remove()
              .draw()
          })
        })
        // 保存并新增按钮点击事件
        $('#btn-saveadd').on('click', { flag: true }, page.saveAdd)
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
