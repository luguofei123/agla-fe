$(function() {
  //open弹窗的关闭方法
  window._close = function(action) {
    if (window.closeOwner) {
      var data = { action: action }
      window.closeOwner(data)
    }
  }
  var svData = ufma.getCommonData()

  //接口URL集合
  var interfaceURL = {
    getPrsLevelList: '/prs/prslevelco/getPrsLevelList', // 查询级别工资档次列表
    savePrsLevelCo: '/prs/prslevelco/savePrsLevelCo' // 保存全部级别工资档次
  }
  var pageLength = 25
  var cellsData
  var tableRowNum = 27
  var tableColNum = 14
  var chineseNum = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九',
    10: '十',
    11: '十一',
    12: '十二',
    13: '十三',
    14: '十四',
    15: '十五',
    16: '十六',
    17: '十七',
    18: '十八',
    19: '十九',
    20: '二十一',
    21: '二十一',
    22: '二十二',
    23: '二十三',
    24: '二十四',
    25: '二十五',
    26: '二十六',
    27: '二十七'
  }
  var newCellsData = []
  if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
      targetLength = targetLength >> 0 //floor if number or convert non-number to 0;
      padString = String(typeof padString !== 'undefined' ? padString : ' ')
      if (this.length > targetLength) {
        return String(this)
      } else {
        targetLength = targetLength - this.length
        if (targetLength > padString.length) {
          padString += padString.repeat(targetLength / padString.length) //append to original to ensure we are longer than needed
        }
        return padString.slice(0, targetLength) + String(this)
      }
    }
  }

  var page = (function() {
    return {
      setInitTableData: function() {
        var tableData = []
        for (var i = 0; i < tableRowNum; i++) {
          tableData.push({
            index: i + 1 + '级',
            '1-money': '',
            '2-money': '',
            '3-money': '',
            '4-money': '',
            '5-money': '',
            '6-money': '',
            '7-money': '',
            '8-money': '',
            '9-money': '',
            '10-money': '',
            '11-money': '',
            '12-money': '',
            '13-money': '',
            '14-money': '',
            '15-money': '',
            '16-money': '',
            '17-money': '',
            '18-money': '',
            '19-money': '',
            '20-money': '',
            '21-money': '',
            '22-money': '',
            '23-money': '',
            '24-money': '',
            '25-money': '',
            '26-money': '',
            '27-money': ''
          })
        }
        return tableData
      },
      /**
       * 将某个单元格或者div变成可以输入金额的输入框
       */
      _BgPub_Bind_InputMoney: function(doc, id, afterInputFun, defaultVal) {
        if ($(doc).find('input#' + id).length > 0) {
          return false
        }

        $(doc).empty()
        var _defVal = ''
        if (defaultVal != null) {
          _defVal = defaultVal
        }
        var iwidth =
          $(doc)
            .closest('td')
            .outerWidth() -
          parseInt(
            $(doc)
              .closest('td')
              .css('padding-left')
          ) -
          parseInt(
            $(doc)
              .closest('td')
              .css('padding-right')
          )
        $(doc).append(
          '<input type="text" id="' +
            id +
            '" style="width:' +
            iwidth +
            'px" value="' +
            _defVal +
            '" onkeyup="this.value=this.value.replace(/[^0-9.]/g,\'\')" ' +
            'onafterpaste="this.value=this.value.replace(/[^0-9.]/g,\'\')"/>'
        )
        $(doc).on('keyup', function(e) {
          if (e.keyCode == 13) {
            //13等于回车键(Enter)键值,ctrlKey 等于 Ctrl
            var v = $('#' + id).val()
            $('#' + id).remove()
            $(doc).empty()
            $(doc).append(v)
            if (afterInputFun != null) {
              afterInputFun(v, doc)
            }
            e.keyCode = 0
          }
        })

        return true
      },
      tbl_afterInputMoney_cellChange: function(value, doc) {
        var tbl = $('#level-salary-grade-table').DataTable()
        var val = value
        if (val == null || val == '') {
          val = ''
        }
        tbl.cell(doc).data(val)
        page.setChangeCellData(tbl, doc)
      },
      setChangeCellData: function(tbl, doc) {
        var rowIndex = tbl.row(doc).index()
        var columnIndex = tbl.column(doc).index()
        var cell = {}
        cell.prlevelCode =
          String(rowIndex + 1).padStart(2, '0') +
          String(columnIndex).padStart(2, '0')
        cell.prlevelName =
          chineseNum[rowIndex + 1] + '级' + chineseNum[columnIndex] + '档'
        cell.prlevelVal =
          tbl.cell(doc).data() === '' ? null : Number(tbl.cell(doc).data())
        for (var i = 0; i < cellsData.length; i++) {
          if (cellsData[i].prlevelCode === cell.prlevelCode) {
            cell = $.extend({}, cellsData[i], cell)
          }
        }
        var index = -1
        for (var i = 0; i < newCellsData.length; ++i) {
          if (newCellsData[i].prlevelCode == cell.prlevelCode) {
            index = i
            break
          }
        }

        if (index !== -1) {
          newCellsData.splice(index, 1, cell)
        } else {
          newCellsData.push(cell)
        }
      },
      addListenerToMainTable: function() {
        /**
         * 单击单元格可以进入编辑状态
         * @param  {[type]} [page.DataTable== null]
         * @return {[type]}
         */
        $('#level-salary-grade-table')
          .off('click', 'tbody td')
          .on('click', 'tbody td', function(e) {
            var tbl = $('#level-salary-grade-table').DataTable()
            var col = tbl.column(this)
            var sId = col.dataSrc()
            if (typeof sId === 'undefined') {
              return
            }
            // 金额
            if (sId.indexOf('-money') !== -1) {
              var rst = page._BgPub_Bind_InputMoney(
                this,
                sId + '_Advmoney-advBgItem',
                page.tbl_afterInputMoney_cellChange,
                tbl.cell(this).data()
              )
              $('#' + sId + '_Advmoney-advBgItem').blur(function(e) {
                var tmpE = jQuery.Event('keyup')
                tmpE.keyCode = 13
                $('#' + sId + '_Advmoney-advBgItem').trigger(tmpE)
              })
              if (rst) {
                $('#' + sId + '_Advmoney-advBgItem').focus()
                $('#' + sId + '_Advmoney-advBgItem').select()
              }
            }
          })
      },
      // 列
      columns: function() {
        var columns = [
          {
            title: '级别',
            width: 30,
            data: 'index',
            className: 'nowrap tc isprint',
            class: 'isprint nowrap ellipsis text-align-center'
            // render: function(data, type, rowdata, meta) {
            //   var index = meta.row + 1
            //   return "<span>" + index + '级' + "</span>";
            // }
          }
        ]

        for (var index = 1; index <= tableColNum; index++) {
          columns.push({
            data: index + '-money',
            class: 'print',
            title: index + '档',
            className: 'nowrap tc isprint',
            class: 'isprint nowrap ellipsis text-align-center',
            render: $.fn.dataTable.render.number(',', '.', 2, '')
          })
        }
        return columns
      },
      // 初始化表格
      initTable: function(data) {
        var id = 'level-salary-grade-table'
        var toolBar = $('#' + id).attr('tool-bar')
        page.DataTable = $('#' + id).dataTable({
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
          columns: page.columns(),
          // "columnDefs": columnDefsArr,
          // "fixedColumns":{
          //     rightColumns: 1
          // },
          // "dom": 'rt<"' + id + '-paginate"ilp>',
          // "dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
          dom: '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
          buttons: [
            {
              extend: 'print',
              text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
              exportOptions: {
                columns: '.isprint'
              },
              customize: function(win) {
                $(win.document.body)
                  .find('h1')
                  .css('text-align', 'center')
                $(win.document.body).css('height', 'auto')
              }
            },
            {
              extend: 'excelHtml5',
              text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
              exportOptions: {
                columns: '.isprint'
              },
              customize: function(xlsx) {
                var sheet = xlsx.xl.worksheets['sheet1.xml']
              }
            }
          ],
          initComplete: function(settings, json) {
            //打印&导出按钮
            $('.datatable-toolbar').appendTo('#dtToolbar')
            // $('#datatables-print').html('');
            // $('#datatables-print').append($(".datatable-toolbar"));
            $('.datatable-toolbar .buttons-print')
              .addClass('btn-print btn-permission')
              .attr({
                'data-toggle': 'tooltip',
                title: '打印'
              })
            $('.datatable-toolbar .buttons-excel')
              .addClass('btn-export btn-permission')
              .attr({
                'data-toggle': 'tooltip',
                title: '导出'
              })

            //驻底begin
            var toolBar = $(this).attr('tool-bar')
            var $info = $(toolBar + ' .info')
            if ($info.length == 0) {
              $info = $('<div class="info"></div>').appendTo(
                $(toolBar + ' .tool-bar-body')
              )
            }
            $info.html('')
            $('.' + id + '-paginate').appendTo($info)

            //导出begin
            $('#dtToolbar .buttons-excel')
              .off()
              .on('click', function(evt) {
                evt = evt || window.event
                evt.preventDefault()
                ufma.expXLSForDatatable($('#' + id), '级别工资档次')
              })
            //导出end

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
            if (data.length > 0) {
              // $('#' + id).fixedColumns({
              //   rightColumns: 1 //锁定右侧一列
              //   // leftColumns: 1//锁定左侧一列
              // })
            }
            $('#level-salary-grade-table')
              .find('td.dataTables_empty')
              .text('')
              .append(
                '<img src="' +
                  bootPath +
                  'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
              )

            //权限控制
            ufma.isShow(page.reslist)
            ufma.setBarPos($(window))
            $('#level-salary-grade-table_wrapper').ufScrollBar('update')
          }
        })
        page.addListenerToMainTable()
      },

      // 设置表格数据
      setTableData: function(queryData) {
        ufma.post(interfaceURL.getPrsLevelList, {}, function(result) {
          var tbl = $('#level-salary-grade-table').DataTable()
          cellsData = result.data
          for (var i = 0; i < cellsData.length; i++) {
            var item = cellsData[i]
            var row = Number(item.prlevelCode.slice(0, 2)) - 1
            var col = Number(item.prlevelCode.slice(2))
            tbl.cell(row, col).data(item.prlevelVal)
          }
        })
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        //初始化表格
        page.initTable(page.setInitTableData())
        page.setTableData()
      },
      onEventListener: function() {
        // 保存按钮点击事件
        $('#btn-save-level-salary-grade').on('click', function() {
          if (newCellsData.length === 0) {
            return
          }
          $('button').attr('disabled', true)
          ufma.showloading('正在加载数据请耐心等待...')
          ufma.post(interfaceURL.savePrsLevelCo, newCellsData, function(
            result
          ) {
            ufma.hideloading()
            $('button').attr('disabled', false)
            if (result.flag == 'fail') {
              ufma.showTip(result.msg, function() {}, 'warning')
            } else if (result.flag == 'success') {
              ufma.showTip(result.msg, function() {}, result.flag)
              newCellsData = []
            }
          })
          var timeId = setTimeout(function() {
            clearTimeout(timeId)
            $('button').attr('disabled', false)
          }, '5000')
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
