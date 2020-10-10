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
    searchPrsDutyGradeDataCo:
      '/prs/base/prsDutyGradeDataCo/searchPrsDutyGradeDataCo', // 查询
    delete: '/prs/base/prsDutyGradeDataCo/delete', // 删除
    sendPrsDutyGradeData: '/prs/base/prsDutyGradeDataCo/sendPrsDutyGradeData', // 下发
    getAgencyTree: '/prs/prsAgency/getAgencyTree'
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 表格列
      columns: function() {
        var columns = [
          {
            title: '',
            width: 30,
            className: 'nowrap tc isprint',
            render: function(data, type, rowdata, meta) {
              var index = meta.row + 1
              return '<span>' + index + '</span>'
            }
          },
          {
            title: '职务名称',
            data: 'dutyName',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '领导职务工资',
            data: 'leaderSalary',
            className: 'isprint nowrap ellipsis text-align-right',
            render: $.fn.dataTable.render.number(',', '.', 2, '')
          },
          {
            title: '非领导职务工资',
            data: 'unleaderSalary',
            className: 'isprint nowrap ellipsis text-align-right',
            render: $.fn.dataTable.render.number(',', '.', 2, '')
          },
          {
            title: '职务与级别对应关系',
            data: 'office_level',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '操作',
            className: 'nowrap minW',
            data: null,
            width: 120,
            render: function(data, type, rowdata, meta) {
              var newRowData = JSON.stringify(rowdata)
              return (
                '<a class="btn btn-icon-only btn-edit btn-permission" data-id="' +
                rowdata.dutyId +
                '" data-rowdata=\'' +
                newRowData +
                "'" +
                '" data-toggle="tooltip" action= "" title="编辑">' +
                '<span class="glyphicon icon-edit"></span></a>' +
                '<a class="btn btn-icon-only btn-delete btn-permission" data-id="' +
                rowdata.dutyId +
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
        var id = 'office-salary-standard-table'
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
                ufma.expXLSForDatatable($('#' + id), '系统职务工资标准')
              })
            //导出end

            $('#office-salary-standard-table_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            ufma.setBarPos($(window))
            //驻底end
            ufma.isShow(page.reslist)
            $('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
          },
          drawCallback: function(settings) {
            if (data.length > 0) {
              $('#' + id).fixedColumns({
                rightColumns: 1 //锁定右侧一列
                // leftColumns: 1//锁定左侧一列
              })
            }
            $('#office-salary-standard-table')
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
            $('#office-salary-standard-table_wrapper').ufScrollBar('update')
          }
        })
      },
      // 设置表格数据
      setTableData: function() {
        var argu = {
          // agencyCode: svData.svAgencyCode,
          agencyCode: '*',
          rgCode: svData.svRgCode
        }
        ufma.post(interfaceURL.searchPrsDutyGradeDataCo, argu, function(
          result
        ) {
          var tableData = []
          for (var i = 0; i < result.data.length; i++) {
            var item = result.data[i]
            var highLevel = item.highLevel
            var lowestLevel = item.lowestLevel
            var office_level = ''

            if (highLevel !== 0 && lowestLevel !== 0) {
              office_level += lowestLevel + '级 至 ' + highLevel + '级'
            } else if (highLevel === 0 && lowestLevel !== 0) {
              office_level += lowestLevel + '级'
            } else if (highLevel !== 0 && lowestLevel === 0) {
              office_level += highLevel + '级'
            }

            item.office_level = office_level
            tableData.push(item)
          }

          page.DataTable.clear().draw()
          if (tableData.length > 0) {
            page.DataTable.rows.add(tableData)
            page.DataTable.columns.adjust().draw()
          }
          $('#office-salary-standard-table')
            .closest('.dataTables_wrapper')
            .ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
          ufma.setBarPos($(window))
        })
      },
      // 打开弹窗
      openWin: function(ele) {
        var title, openData
        if (ele[0].id == 'btn-add-office-salary-standard') {
          title = '新增'
          openData = {}
        } else {
          title = '编辑'

          var rowData = JSON.parse($(ele).attr('data-rowdata'))
          openData = {
            rowData: rowData
          }
        }
        ufma.open({
          url: 'addSysOfficeSalaryStandard.html',
          title: title,
          width: 500,
          height: 400,
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
          ids: []
        }
        if (ele[0].id == 'tool-bar-del') {
          var checks = $('input.checkboxes:checked')
          checks.each(function() {
            var rowId = $(this).attr('data-id')
            argu.ids.push(rowId)
          })
        } else {
          argu.ids.push(ele.attr('data-id'))
        }
        return argu
      },
      // 删除
      delValues: function(ele) {
        ufma.confirm(
          '您确定要删除当前行的数据吗？',
          function(action) {
            if (action) {
              //点击确定的回调函数
              var argu = page.delArgu(ele)
              $('button').attr('disabled', true)
              ufma.showloading('正在加载数据请耐心等待...')
              ufma.post(interfaceURL.delete, argu, function(result) {
                ufma.hideloading()
                $('button').attr('disabled', false)
                page.setTableData()
                ufma.showTip(result.msg, function() {}, result.flag)
              })
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
        //下发
        $('#tool-bar-sendown').on('click', function(e) {
          stopPropagation(e)
          var tableData = page.DataTable.data();
          if (tableData.length == 0) {
              ufma.alert('请选择数据！', 'warning')
              return false
          }
          page.modal = ufma.selectBaseTree({
            url: interfaceURL.getAgencyTree,
            rootName: '所有单位',
            title: '选择下发单位',
            bSearch: true, //是否有搜索框
            checkAll: true, //是否有全选
            buttons: {
              //底部按钮组
              确认下发: {
                class: 'btn-primary',
                action: function(data) {
                  if (data.length == 0) {
                    ufma.alert('请选择单位！', 'warning')
                    return false
                  }
                  var dwCode = []
                  for (var i = 0; i < data.length; i++) {
                    if (!data[i].isParent) {
                      dwCode.push({
                        toAgencyCode: data[i].id
                      })
                    }
                  }
                  var tableData = page.DataTable.data()
                  var ids = []
                  for (var i = 0; i < tableData.length; i++) {
                    ids.push(tableData[i].dutyId)
                  }
                  var argu = {
                    ids: ids,
                    agencyList: dwCode
                  }
                  $('button').attr('disabled', true)
                  ufma.showloading('正在加载数据请耐心等待...')
                  ufma.post(interfaceURL.sendPrsDutyGradeData, argu, function(
                    result
                  ) {
                    ufma.hideloading()
                    $('button').attr('disabled', false)
                    ufma.showTip(result.msg, function() {}, result.flag)
                    page.modal.close()
                  })
                  var timeId = setTimeout(function() {
                    clearTimeout(timeId)
                    $('button').attr('disabled', false)
                  }, '5000')
                  //下发后取消全选
                  $('.datatable-group-checkable,.checkboxes').prop(
                    'checked',
                    false
                  )
                  $('#mainTable')
                    .find('tbody tr.selected')
                    .removeClass('selected')
                }
              },
              取消: {
                class: 'btn-default',
                action: function() {
                  page.modal.close()
                }
              }
            }
          })
        })
        // 新增
        $(document).on('click', '#btn-add-office-salary-standard', function() {
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
