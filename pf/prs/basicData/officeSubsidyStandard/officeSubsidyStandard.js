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
    getPrsDutyGradeSubsidyCoList:
      '/prs/prsdutygradesubsidyco/getPrsDutyGradeSubsidyCoList', // 查询职务补贴标准列表
    deletePrsDutyGradeSubsidyCo:
      '/prs/prsdutygradesubsidyco/deletePrsDutyGradeSubsidyCo' // 批量删除职务补贴标准
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 表格列
      columns: function() {
        var columns = [
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
            title: '补贴项目名称',
            data: 'prsubsName',
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
                '<a class="btn btn-icon-only btn-edit btn-permission" data-prsubsCode="' +
                rowdata.prsubsCode +
                '" prsubsName="' +
                rowdata.prsubsName +
                '" isUsed="' +
                rowdata.isUsed +
                '" data-toggle="tooltip" action= "" title="编辑">' +
                '<span class="glyphicon icon-edit"></span></a>' +
                '<a class="btn btn-icon-only btn-delete btn-permission" data-prsubsCode="' +
                rowdata.prsubsCode +
                '" prsubsName="' +
                rowdata.prsubsName +
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
        var id = 'office-subsidy-standard-table'
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
                ufma.expXLSForDatatable($('#' + id), '职务补贴标准')
              })
            //导出end

            $('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
            ufma.isShow(page.reslist)
            $('#office-subsidy-standard-table_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            ufma.setBarPos($(window))
            //驻底end
          },
          drawCallback: function(settings) {
            if (data.length > 0) {
              $('#' + id).fixedColumns({
                rightColumns: 1 //锁定右侧一列
                // leftColumns: 1//锁定左侧一列
              })
            }
            $('#office-subsidy-standard-table')
              .find('td.dataTables_empty')
              .text('目前还没有你要查询的数据')
              // .append(
              //   '<img src="' +
              //     bootPath +
              //     'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
              // )

              ufma.isShow(page.reslist)
              $('#office-subsidy-standard-table_wrapper').ufScrollBar({
                hScrollbar: true,
                mousewheel: false
              })
              ufma.setBarPos($(window))
          }
        })
      },
      // 设置表格数据
      setTableData: function() {
        ufma.post(interfaceURL.getPrsDutyGradeSubsidyCoList, {}, function(
          result
        ) {
          var tableData = result.data
          page.DataTable.clear().draw()
          if (tableData.length > 0) {
            page.DataTable.rows.add(tableData)
            page.DataTable.columns.adjust().draw()
          }
          // $('#office-subsidy-standard-table')
          //   .closest('.dataTables_wrapper')
          //   .ufScrollBar({
          //     hScrollbar: true,
          //     mousewheel: false
          //   })
          // ufma.setBarPos($(window))
        })
      },
      // 打开弹窗
      openWin: function(ele) {
        var title, openData
        if (ele[0].id == 'btn-add-office-subsidy-standard') {
          title = '新增'
          openData = {}
        } else {
          title = '编辑'
          var prsubsCode = $(ele).attr('data-prsubsCode')
          var prsubsName = $(ele).attr('prsubsName')
          var isUsed = $(ele).attr('isUsed')
          openData = {
            prsubsCode: prsubsCode,
            prsubsName: prsubsName,
            isUsed: isUsed
          }
        }
        ufma.open({
          url: 'addOfficeSubsidyStandard.html',
          title: title,
          width: 800,
          height: 500,
          data: openData,
          ondestory: function(data) {
            //窗口关闭时回传的值
            if (data.action) {
              ufma.showTip(data.msg, function() {}, 'success')
            }
            page.setTableData()
          }
        })
      },
      // 删除传参
      delArgu: function(ele) {
        var argu = {
          prsubsCodes: []
        }
        argu.prsubsCodes.push(ele.attr('data-prsubsCode'))
        return argu
      },
      // 删除
      delValues: function(ele) {
        ufma.confirm(
          '您确定要删除当前行的数据吗',
          function(action) {
            if (action) {
              //点击确定的回调函数
              var argu = page.delArgu(ele)
              $('button').attr('disabled', true)
              ufma.showloading('正在加载数据请耐心等待...')
              ufma.post(
                interfaceURL.deletePrsDutyGradeSubsidyCo,
                argu,
                function(result) {
                  ufma.hideloading()
                  $('button').attr('disabled', false)
                  page.setTableData()
                  ufma.showTip(result.msg, function() {}, result.flag)
                }
              )
              var timeId = setTimeout(function() {
                clearTimeout(timeId)
                $('button').attr('disabled', false)
              }, '5000')
            } else {
              //点击取消的回调函数
            }
          },
          { type: 'warning' }
        )
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        //初始化表格
        page.initTable([])
        page.setTableData()
      },
      onEventListener: function() {
        // 新增
        $(document).on('click', '#btn-add-office-subsidy-standard', function() {
          page.openWin($(this))
        })
        // 编辑
        $(document).on('click', 'a.btn-edit', function() {
          page.openWin($(this))
        })
        // 删除表格行
        $(document).on('click', 'a.btn-delete', function() {
          page.delValues($(this))
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
