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
  var interfaceURL = {}
  var pageLength = 25
  var setPage = {}
  var tableData = {
    1: [
      {
        income: '不超过36000元的部分',
        'withholding-rate': '3%',
        deduction: '0'
      },
      {
        income: '超过36000元至144000元的部分',
        'withholding-rate': '10%',
        deduction: '2520'
      },
      {
        income: '超过144000元至300000元的部分',
        'withholding-rate': '20%',
        deduction: '16920'
      },
      {
        income: '超过300000元至420000元的部分',
        'withholding-rate': '25%',
        deduction: '31920'
      },
      {
        income: '超过420000元至660000元的部分',
        'withholding-rate': '30%',
        deduction: '52920'
      },
      {
        income: '超过660000元至960000元的部分',
        'withholding-rate': '35%',
        deduction: '85920'
      },
      {
        income: '超过960000元的部分',
        'withholding-rate': '45%',
        deduction: '181920'
      }
    ],
    2: [
      {
        income: '不超过20000元的部分',
        'withholding-rate': '20%',
        deduction: '0'
      },
      {
        income: '超过20000元至50000元的部分',
        'withholding-rate': '30%',
        deduction: '2000'
      },
      {
        income: '超过50000元的部分',
        'withholding-rate': '40%',
        deduction: '7000'
      }
    ],
    3: [
      {
        income: '不超过3000元的部分',
        rate: '3%',
        deduction: '0'
      },
      {
        income: '超过3000元至12000元的部分',
        rate: '10%',
        deduction: '210'
      },
      {
        income: '超过12000元至25000元的部分',
        rate: '20%',
        deduction: '1410'
      },
      {
        income: '超过25000元至35000元的部分',
        rate: '25%',
        deduction: '2660'
      },
      {
          income: '超过35000元至55000元的部分',
          rate: '30%',
          deduction: '4410'
        },
      {
        income: '超过55000元至80000元的部分',
        rate: '35%',
        deduction: '7160'
      },
      {
        income: '超过80000元的部分',
        rate: '45%',
        deduction: '15160'
      }
    ],
    4: [
      {
        income: '不超过36000元的部分',
        rate: '3%'
      },
      {
        income: '超过36000元至144000元的部分',
        rate: '10%'
      },
      {
        income: '超过144000元至300000元的部分',
        rate: '20%'
      },
      {
        income: '超过300000元至420000元的部分',
        rate: '25%'
      },
      {
        income: '超过420000元至660000元的部分',
        rate: '30%'
      },
      {
        income: '超过660000元至960000元的部分',
        rate: '35%'
      },
      {
        income: '超过960000元的部分',
        rate: '45%'
      }
    ]
  }

  var page = (function() {
    return {
      // 表格下面的信息显示
      showInfo(code) {
        switch (code) {
          case '1':
            $('.set-salary-table').show()
            $('.labor-fee-table').hide()
            $('.remuneration-rate-table').hide()
            $('#tax-rate-setting-table').show()
            break
          case '2':
            $('.set-salary-table').hide()
            $('.labor-fee-table').show()
            $('.remuneration-rate-table').hide()
            $('#tax-rate-setting-table').show()
            break
          case '3':
            $('.set-salary-table').hide()
            $('.labor-fee-table').hide()
            $('.remuneration-rate-table').hide()
            $('#tax-rate-setting-table').show()
            break
          case '4':
            $('.set-salary-table').hide()
            $('.labor-fee-table').hide()
            $('.remuneration-rate-table').hide()
            $('#tax-rate-setting-table').show()
            break
          case '5':
            $('.set-salary-table').hide()
            $('.labor-fee-table').hide()
            $('.remuneration-rate-table').show()
            $('#tax-rate-setting-table').hide()
            break
          default:
            break
        }
      },
      // 工资、薪金所得预扣税率表
      setSalaryTable: function() {
        var columns = [
          {
            title: '级数',
            width: 30,
            className: 'nowrap tc isprint',
            render: function(data, type, rowdata, meta) {
              var index = meta.row + 1
              return '<span>' + index + '</span>'
            }
          },
          {
            title: '累计预扣预缴应纳税所得额',
            data: 'income',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '预扣率',
            data: 'withholding-rate',
            className: 'isprint nowrap ellipsis text-align-center',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '速算扣除数',
            data: 'deduction',
            className: 'isprint nowrap ellipsis text-align-center',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          }
        ]
        if (page.DataTable) {
          page.DataTable.destroy()
          $('#tax-rate-setting-table').empty()
        }
        page.initTable(tableData[1], columns)
      },
      // 劳务费报酬所得税率表
      setLaborFeeTable: function() {
        var columns = [
          {
            title: '级数',
            width: 30,
            className: 'nowrap tc isprint',
            render: function(data, type, rowdata, meta) {
              var index = meta.row + 1
              return '<span>' + index + '</span>'
            }
          },
          {
            title: '累计预扣预缴应纳税所得额',
            data: 'income',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '预扣率',
            data: 'withholding-rate',
            className: 'isprint nowrap ellipsis text-align-center',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '速算扣除数',
            data: 'deduction',
            className: 'isprint nowrap ellipsis text-align-center',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          }
        ]
        if (page.DataTable) {
          page.DataTable.destroy()
          $('#tax-rate-setting-table').empty()
        }
        page.initTable(tableData[2], columns)
      },
      // 全年一次性奖金预扣税率表
      setBonusTable: function() {
        var columns = [
          {
            title: '级数',
            width: 30,
            className: 'nowrap tc isprint',
            render: function(data, type, rowdata, meta) {
              var index = meta.row + 1
              return '<span>' + index + '</span>'
            }
          },
          {
            title: '全月应纳税所得额',
            data: 'income',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '税率',
            data: 'rate',
            className: 'isprint nowrap ellipsis text-align-center',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '速算扣除数',
            data: 'deduction',
            className: 'isprint nowrap ellipsis text-align-center',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          }
        ]
        if (page.DataTable) {
          page.DataTable.destroy()
          $('#tax-rate-setting-table').empty()
        }
        page.initTable(tableData[3], columns)
      },
      // 综合所得税率表
      setComprehensiveRateTable: function() {
        var columns = [
          {
            title: '级数',
            width: 30,
            className: 'nowrap tc isprint',
            render: function(data, type, rowdata, meta) {
              var index = meta.row + 1
              return '<span>' + index + '</span>'
            }
          },
          {
            title: '全年应纳税所得额',
            data: 'income',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '税率',
            data: 'rate',
            className: 'isprint nowrap ellipsis text-align-center',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          }
        ]
        if (page.DataTable) {
          page.DataTable.destroy()
          $('#tax-rate-setting-table').empty()
        }
        page.initTable(tableData[4], columns)
      },
      initTable: function(data, columns) {
        var id = 'tax-rate-setting-table'
        var toolBar = $('#' + id).attr('tool-bar')
        page.DataTable = $('#' + id).DataTable({
          language: {
            url: bootPath + 'agla-trd/datatables/datatable.default.js'
          },
          data: data,
          searching: true,
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
                ufma.expXLSForDatatable($('#' + id), '税率设置')
              })
            //导出end

            $('#tax-rate-setting-table_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            ufma.setBarPos($(window))
            //驻底end

            ufma.isShow(page.reslist)
            $('.datatable-toolbar [data-toggle="tooltip"]').tooltip()
          },
          drawCallback: function(settings) {
            $('#tax-rate-setting-table')
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
            $('#tax-rate-setting-table_wrapper').ufScrollBar('update')
          }
        })
      },
      // 初始化页签
      initTabs: function(list) {
        var ts = ''
        if (list.length !== 0) {
          for (var i = 0; i < list.length; i++) {
            ts +=
              '<li><a href="javascript:;" code="' +
              list[i].chrCode +
              '">' +
              list[i].chrName +
              '</a></li>'
          }
          $('.accnab').html(ts)
          if (list.length > 0) {
            $('.accnab li')
              .eq(0)
              .trigger('click')
              .css('margin-left', '0px')
          }
          ulL = $('.accnab')[0].offsetWidth
          liL = 0
          for (var i = 0; i < $('.accnab li').length; i++) {
            liL += $('.accnab li').eq(i)[0].offsetWidth
          }
          if (ulL > liL) {
            $('#btn-left').hide()
            $('#btn-right').hide()
          } else {
            $('#btn-left').show()
            $('#btn-right').show()
          }
        }
      },

      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        // ufma.post("", '', page.initTabs)
        page.initTabs([
          {
            chrCode: '1',
            chrName: '工资、薪金所得预扣税率表'
          },
          {
            chrCode: '2',
            chrName: '劳务费报酬所得税率表'
          },
          {
            chrCode: '3',
            chrName: '全年一次性奖金预扣税率表'
          },
          {
            chrCode: '4',
            chrName: '综合所得税率表'
          },
          {
            chrCode: '5',
            chrName: '稿酬所得税率表'
          }
        ])
      },
      onEventListener: function() {
        $('.accnab li').on('click', function() {
          if ($(this).hasClass('active') != true) {
            $('.accnab li').removeClass('active')
            $(this).addClass('active')
            var code = $(this)
              .find('a')
              .attr('code')
            setPage[code]()
            page.showInfo(code)
          }
        })
      },
      //此方法必须保留
      init: function() {
        setPage = {
          '1': page.setSalaryTable,
          '2': page.setLaborFeeTable,
          '3': page.setBonusTable,
          '4': page.setComprehensiveRateTable,
          '5': function() {}
        }
        ufma.parse()
        page.initPage()
        page.onEventListener()
        ufma.parseScroll()
        setPage['1']()
        page.showInfo('1')
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
