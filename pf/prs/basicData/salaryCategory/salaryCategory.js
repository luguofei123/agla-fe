$(function() {
  //open弹窗的关闭方法
  window._close = function(action) {
    if (window.closeOwner) {
      var data = { action: action }
      window.closeOwner(data)
    }
  }

  //接口URL集合
  var interfaceURL = {
    findPrsTypeCo: '/prs/PrsTypeCo/findPrsTypeCo', // 查询
    delPrsTypeCos: '/prs/PrsTypeCo/delPrsTypeCos', // 删除
    selectIsUsedByItem: '/prs/PrsTypeCo/selectIsUsedByItem' // 删除前检查
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 表格列
      columns: function() {
        var columns = [
          {
            title:
              '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
              '<input type="checkbox" id="th-check" class="datatable-group-checkable" data-set="#data-table .checkboxes" />' +
              '&nbsp;<span></span></label>',
            className: 'nowrap check-style',
            width: 30,
            data: null,
            render: function(data, type, rowdata, meta) {
              return (
                '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                '<input type="checkbox" class="checkboxes" prtypeCode="' +
                rowdata.prtypeCode +
                '" />' +
                '&nbsp;<span></span></label>'
              )
            }
          },
          {
            title: '工资类别代码',
            data: 'prtypeCode',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '工资类别名称',
            data: 'prtypeName',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '是否计税',
            data: 'isCalcTax',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data === 'Y' ? '是' : '否'
            }
          },
          {
            title: '发放月份',
            data: 'mo',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '是否启用',
            data: 'isUsed',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data === 'Y' ? '是' : '否'
            }
          },
          {
            title: '操作',
            className: 'nowrap minW',
            data: null,
            width: 120,
            render: function(data, type, rowdata, meta) {
              return (
                '<a class="btn btn-icon-only btn-edit btn-permission" prtypeCode="' +
                rowdata.prtypeCode +
                '" prtypeName="' +
                rowdata.prtypeName +
                '" isCalcTax="' +
                rowdata.isCalcTax +
                '" mo="' +
                rowdata.mo +
                '" isUsed="' +
                rowdata.isUsed +
                '" payEditStat="' +
                rowdata.payEditStat +
                '" payRemark="' +
                rowdata.payRemark +
                '" data-toggle="tooltip" action= "" title="编辑">' +
                '<span class="glyphicon icon-edit"></span></a>' +
                '<a class="btn btn-icon-only btn-delete btn-permission" prtypeCode="' +
                rowdata.prtypeCode +
                '" prtypeName="' +
                rowdata.prtypeName +
                '" isCalcTax="' +
                rowdata.isCalcTax +
                '" mo="' +
                rowdata.mo +
                '" isUsed="' +
                rowdata.isUsed +
                '" data-toggle="tooltip" action= "" title="删除">' +
                '<span class="glyphicon icon-trash"></span></a>'
              )
            }
          }
        ]
        return columns
      },
      // 初始化表格
      initTable: function(data) {
        var id = 'salary-category-table'
        var toolBar = $('#' + id).attr('tool-bar')
        page.DataTable = $('#' + id).DataTable({
          language: {
            url: bootPath + 'agla-trd/datatables/datatable.default.js'
          },
          data: data,
          searching: true,
          bFilter: false, //去掉搜索框
          bLengthChange: true, //去掉每页显示多少条数据
          processing: true, //显示正在加载中
          pagingType: 'full_numbers', //分页样式
          lengthChange: true, //是否允许用户自定义显示数量p
          lengthMenu: [[25, 50, 100, -1], [25, 50, 100, '全部']],
          pageLength: pageLength,
          bInfo: true, //页脚信息
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
                ufma.expXLSForDatatable($('#' + id), '工资类别')
              })
            //导出end
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

            $('#salary-category-table_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            ufma.setBarPos($(window))
          },
          drawCallback: function(settings) {
            if (data.length > 0) {
              $('#' + id).fixedColumns({
                rightColumns: 1 //锁定右侧一列
                // leftColumns: 1//锁定左侧一列
              })
            }
            $('#salary-category-table')
              .find('td.dataTables_empty')
              .text('')
              .append(
                '<img src="' +
                  bootPath +
                  'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
              )
            $('#salary-category-table_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            //权限控制
            ufma.isShow(page.reslist)
            ufma.setBarPos($(window))
            // $('#salary-category-table_wrapper').ufScrollBar('update')
          }
        })
      },
      cancelCheckAll: function() {
				$("#checkAll,.datatable-group-checkable").prop("checked", false);
			},
      // 设置表格数据，queryData=查询条件
      setTableData: function(queryData) {
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.findPrsTypeCo, queryData, function(result) {
          ufma.hideloading()
          var tableData = result.data
          page.DataTable.clear().draw()
          if (tableData.length > 0) {
            page.DataTable.rows.add(tableData)
            page.DataTable.columns.adjust().draw()
          }
          $('#salary-category-table')
            .closest('.dataTables_wrapper')
            .ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
          ufma.setBarPos($(window))
          page.cancelCheckAll()
        })
      },
      // 查询
      queryTableData: function() {
        var queryData = $('#frmQuery').serializeObject()
        for (var key in queryData) {
          if (queryData.hasOwnProperty(key)) {
            queryData[key] = queryData[key].trim()
          }
        }
        page.setTableData(queryData)
      },
      // 打开弹窗
      openWin: function(ele) {
        var title, openData
        if (ele[0].id == 'btn-add-salary-category') {
          title = '新增工资类别'
          openData = {}
        } else {
          title = '编辑工资类别'
          var prtypeCode = ele.attr('prtypeCode')
          var prtypeName = ele.attr('prtypeName')
          var isCalcTax = ele.attr('isCalcTax')
          var mo = ele.attr('mo')
          var isUsed = ele.attr('isUsed')
          var payEditStat = ele.attr('payEditStat')
          var payRemark = ele.attr('payRemark')
          openData = {
            prtypeCode: prtypeCode,
            prtypeName: prtypeName,
            isCalcTax: isCalcTax,
            mo: mo,
            isUsed: isUsed,
            payEditStat : payEditStat,
            payRemark: payRemark
          }
        }
        ufma.open({
          url: 'addSalaryCategory.html',
          title: title,
          width: 800,
          height: 500,
          data: openData,
          ondestory: function(data) {
            //窗口关闭时回传的值
            if (data.action) {
              ufma.showTip(data.msg, function() {}, 'success')
            }
            page.queryTableData()
          }
        })
      },
      // 删除传参
      delArgu: function(ele) {
        var argu = {
          prtypeCodes: []
        }
        if (ele[0].id == 'tool-bar-del') {
          var checks = $('input.checkboxes:checked')
          checks.each(function() {
            var prtypeCode = $(this).attr('prtypeCode')
            argu.prtypeCodes.push(prtypeCode)
          })
        } else {
          argu.prtypeCodes.push(ele.attr('prtypeCode'))
        }
        return argu
      },
      /**
       * 删除
       * @param {jQuery Object} ele
       * @param {Boolean} flag true:批量删除 false: 单行删除
       */
      delValues: function(ele, flag) {
        var checks = $('input.checkboxes:checked')
        if (flag && checks.length == 0) {
          ufma.showTip('请选择要删除的数据', function() {}, 'warning')
          return false
        }
        var argu = page.delArgu(ele)
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.selectIsUsedByItem, argu, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag === 'success') {
            var info = flag
              ? '您确定要删除选中的数据吗？'
              : '您确定要删除当前行的数据吗？'
            ufma.confirm(
              info,
              function(action) {
                if (action) {
                  //点击确定的回调函数
                  var argu = page.delArgu(ele)
                  ufma.showloading('正在加载数据请耐心等待...')
                  ufma.post(interfaceURL.delPrsTypeCos, argu, function(result) {
                    ufma.hideloading()
                    page.queryTableData()
                    ufma.showTip(result.msg, function() {}, result.flag)
                  })
                } else {
                  //点击取消的回调函数
                }
              },
              { type: 'warning' }
            )
          } else {
            ufma.showTip(result.msg, function() {}, 'warning')
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
        //初始化表格
        page.initTable([])
        page.queryTableData()
      },
      onEventListener: function() {
        //表格单行选中
         $(document).on('click', 'tbody tr', function(e) {
           stopPropagation(e)
           if ($('td.dataTables_empty').length > 0) {
             return false
           }
           var inputDom = $(this).find('input.checkboxes')
           var inputCheck = $(inputDom).prop('checked')
           $(inputDom).prop('checked', !inputCheck)
           $(this).toggleClass('selected')
           var $tmp = $('.checkboxes:checkbox')
           $('.datatable-group-checkable').prop(
             'checked',
             $tmp.length == $tmp.filter(':checked').length
           )
           return false
         })
        // 查询按钮点击事件
        $('#btnQuery').on('click', function() {
          page.queryTableData()
        })
        // 新增
        $(document).on('click', '#btn-add-salary-category', function() {
          page.openWin($(this))
        })
        // 编辑
        $(document).on('click', 'a.btn-edit', function() {
          page.openWin($(this))
        })
        // 删除
        $(document).on('click', '#tool-bar-del', function() {
          page.delValues($(this), true)
        })
        // 删除表格行
        $(document).on('click', 'a.btn-delete', function() {
          page.delValues($(this), false)
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
