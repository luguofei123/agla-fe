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
    pageMaEmpProperty: '/prs/emp/maEmpProperty/pageMaEmpProperty', // 展示人员属性
    delMaEmpProperty: '/prs/emp/maEmpProperty/delMaEmpProperty', // 批量删除人员属性
    setIsUsedMaEmpProperty: '/prs/emp/maEmpProperty/setIsUsedMaEmpProperty' // 启用/禁用
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 表格列定义
      columns: function() {
        var columns = [
          {
            title:
              '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
              'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
            className: 'nowrap check-style no-print',
            render: function(data, type, rowdata, meta) {
              return (
                '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                '<input type="checkbox" class="checkboxes" propertyCode="' +
                rowdata.propertyCode +
                '" />' +
                '&nbsp;<span></span></label>'
              )
            }
          },
          {
            title: '属性代码',
            data: 'propertyCode',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              // 自定义属性
              if (rowdata.isSys === 'N') {
                return '<span style="color:#108ee9">' + data + '</span>'
              } else {
                return data
              }
            }
          },
          {
            title: '属性名称',
            data: 'propertyName',
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
            title: '是否显示',
            data: 'isVisible',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data === 'Y' ? '是' : '否'
            }
          },
          {
            title: '允许为空',
            data: 'isEmpty',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data === 'Y' ? '是' : '否'
            }
          },
          {
            title: '列表中显示',
            data: 'isList',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data === 'Y' ? '是' : '否'
            }
          },
          {
            title: '过滤条件',
            data: 'isCondition',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data === 'Y' ? '是' : '否'
            }
          },
          {
            title: '通讯录字段',
            data: 'isPhonebook',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data === 'Y' ? '是' : '否'
            }
          },
          {
            title: '数据类型',
            data: 'dataType',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              var obj = {
                C: '字符',
                N: '数字',
                D: '日期',
                E: '枚举',
                R: '引用',
                X: '多选'
              }
              if (!data) {
                return ''
              }
              return obj[data] ? obj[data] : ''
            }
          },
          {
            title: '值集',
            data: 'valsetId',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '引用类',
            data: 'defValue',
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
              // 预置属性
              if (rowdata.isSys === 'Y') {
                return (
                  '<a class="btn btn-icon-only btn-edit btn-permission property-single-edit" propertyCode="' +
                  rowdata.propertyCode +
                  '" data-rowdata=\'' +
                  newRowData +
                  "'" +
                  '" data-toggle="tooltip" action= "edit" title="修改">' +
                  '<span class="glyphicon icon-edit"></span></a>' +
                  '<a class="btn btn-icon-only btn-start btn-permission property-single-start" propertyCode="' +
                  rowdata.propertyCode +
                  '" data-toggle="tooltip" action= "active" title="启用">' +
                  '<span class="glyphicon icon-play"></span></a>' +
                  '<a class="btn btn-icon-only btn-stop btn-permission property-single-stop" propertyCode="' +
                  rowdata.propertyCode +
                  '" data-toggle="tooltip" action= "unactive" title="禁用">' +
                  '<span class="glyphicon icon-ban"></span></a>'
                )
              } else {
                // 自定义属性
                return (
                  '<a class="btn btn-icon-only btn-edit btn-permission property-single-edit" propertyCode="' +
                  rowdata.propertyCode +
                  '" data-rowdata=\'' +
                  newRowData +
                  "'" +
                  '" data-toggle="tooltip" action= "edit" title="修改">' +
                  '<span class="glyphicon icon-edit"></span></a>' +
                  '<a class="btn btn-icon-only btn-start btn-permission property-single-start" propertyCode="' +
                  rowdata.propertyCode +
                  '" data-toggle="tooltip" action= "active" title="启用">' +
                  '<span class="glyphicon icon-play"></span></a>' +
                  '<a class="btn btn-icon-only btn-stop btn-permission property-single-stop" propertyCode="' +
                  rowdata.propertyCode +
                  '" data-toggle="tooltip" action= "unactive" title="禁用">' +
                  '<span class="glyphicon icon-ban"></span></a>' +
                  '<a class="btn btn-icon-only btn-delete btn-permission property-single-delete" propertyCode="' +
                  rowdata.propertyCode +
                  '" data-toggle="tooltip" action= "delete" title="删除">' +
                  '<span class="glyphicon icon-trash"></span></a>'
                )
              }
            }
          }
        ]
        return columns
      },
      // 初始化表格
      initTable: function(data) {
        var id = 'employee-property-table'
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
            $('#datatables-print').html('')
            $('#datatables-print').append($('.printButtons'))
            $('#datatables-print .buttons-print')
              .addClass('btn-print btn-permission')
              .attr({
                'data-toggle': 'tooltip',
                title: '打印'
              })
            $('#datatables-print .buttons-excel')
              .addClass('btn-export btn-permission')
              .attr({
                'data-toggle': 'tooltip',
                title: '导出'
              })
            $('#datatables-print [data-toggle="tooltip"]').tooltip()

            //驻底begin
            $('.datatable-toolbar').appendTo('#dtToolbar')
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
                ufma.expXLSForDatatable($('#' + id), '人员属性')
              })
            //导出end

            $('#' + id + '_wrapper').ufScrollBar({
              hScrollbar: true,
              mousewheel: false
            })
            ufma.setBarPos($(window))
            //驻底end

            // checkbox的全选操作
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
          },
          drawCallback: function(settings) {
            if (data.length > 0) {
              $('#' + id).fixedColumns({
                rightColumns: 1 //锁定右侧一列
                // leftColumns: 1//锁定左侧一列
              })
            }

            $('#' + id)
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
            $('#' + id + '_wrapper').ufScrollBar('update')
          }
        })
      },
      cancelCheckAll: function() {
				$("#checkAll,.datatable-group-checkable").prop("checked", false);
			},
      // 设置表格数据，queryData=查询条件
      setTableData: function(queryData) {
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.pageMaEmpProperty, queryData, function(result) {
          ufma.hideloading()
          var tableData = result.data.pageList
          page.DataTable.clear().draw()
          if (tableData.length > 0) {
            page.DataTable.rows.add(tableData)
            page.DataTable.columns.adjust().draw()
          }
          $('#employee-property-table')
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
        var queryData = page.getQueryData()
        page.setTableData(queryData)
      },
      // 获取查询条件
      getQueryData: function() {
        var queryData = {
          isSys: page.code ? page.code : 'Y',
          isUsed: '',
          isEmpty: '',
          isVisible: '',
          dataType:
            $('#dataType')
              .getObj()
              .getValue() === 'A'
              ? ''
              : $('#dataType')
                  .getObj()
                  .getValue(),
          isList: '',
          isCondition: '',
          isPhonebook: '',
          propertyName: $('#propertyName')
            .val()
            .trim()
        }
        $("input[name='isUsed']:checked").each(function(value) {
          queryData.isUsed += this.value
        })
        queryData.isUsed = queryData.isUsed !== 'YN' ? queryData.isUsed : ''
        $("input[name='isEmpty']:checked").each(function(value) {
          queryData.isEmpty += this.value
        })
        queryData.isEmpty = queryData.isEmpty !== 'YN' ? queryData.isEmpty : ''
        $("input[name='isVisible']:checked").each(function(value) {
          queryData.isVisible += this.value
        })
        queryData.isVisible =
          queryData.isVisible !== 'YN' ? queryData.isVisible : ''
        $("input[name='isList']:checked").each(function(value) {
          queryData.isList += this.value
        })
        queryData.isList = queryData.isList !== 'YN' ? queryData.isList : ''
        $("input[name='isCondition']:checked").each(function(value) {
          queryData.isCondition += this.value
        })
        queryData.isCondition =
          queryData.isCondition !== 'YN' ? queryData.isCondition : ''
        $("input[name='isPhonebook']:checked").each(function(value) {
          queryData.isPhonebook += this.value
        })
        queryData.isPhonebook =
          queryData.isPhonebook !== 'YN' ? queryData.isPhonebook : ''

        return queryData
      },
      // 打开新增/编辑人员属性模态框
      openWin: function(ele) {
        var title, openData
        if (ele[0].id == 'btn-add-employee-property') {
          title = '新增自定义人员属性'
          openData = {}
        } else {
          var rowData = JSON.parse($(ele).attr('data-rowdata'))
          title =
            rowData.isSys === 'Y' ? '编辑预置人员属性' : '编辑自定义人员属性'
          openData = {
            rowData: rowData
          }
        }
        ufma.open({
          url: 'addEmployeeProperty.html',
          title: title,
          width: 800,
          height: 400,
          data: openData,
          ondestory: function(data) {
            //窗口关闭时回传的值
            if (data.action) {
              ufma.showTip(data.msg, function() {}, 'success')
              page.queryTableData()
            }
          }
        })
      },
      // 启用
      startProperty: function(ele) {
        ufma.confirm(
          '是否启用当前人员属性？',
          function(action) {
            if (action) {
              //点击确定的回调函数
              var argu = {
                propertyCode: ele.attr('propertyCode'),
                isUsed: 'Y'
              }
              $('button').attr('disabled', true)
              ufma.showloading('正在加载数据请耐心等待...')
              ufma.post(interfaceURL.setIsUsedMaEmpProperty, argu, function(
                result
              ) {
                ufma.hideloading()
                $('button').attr('disabled', false)
                page.queryTableData()
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
      stopProperty: function(ele) {
        ufma.confirm(
          '是否停用当前人员属性？',
          function(action) {
            if (action) {
              //点击确定的回调函数
              var argu = {
                propertyCode: ele.attr('propertyCode'),
                isUsed: 'N'
              }
              $('button').attr('disabled', true)
              ufma.showloading('正在加载数据请耐心等待...')
              ufma.post(interfaceURL.setIsUsedMaEmpProperty, argu, function(
                result
              ) {
                ufma.hideloading()
                $('button').attr('disabled', false)
                page.queryTableData()
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
      // 删除传参
      delArgu: function(ele) {
        var argu = {
          propertyCode: []
        }
        if (ele[0].id == 'delete-more') {
          var checks = $('input.checkboxes:checked')
          checks.each(function() {
            var propertyCode = $(this).attr('propertyCode')
            argu.propertyCode.push(propertyCode)
          })
        } else {
          argu.propertyCode.push(ele.attr('propertyCode'))
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
        var info = flag
          ? '您确定要删除选中的数据吗？'
          : '您确定要删除当前行的数据吗？'
        ufma.confirm(
          info,
          function(action) {
            if (action) {
              //点击确定的回调函数
              var argu = page.delArgu(ele)
              $('button').attr('disabled', true)
              ufma.showloading('正在加载数据请耐心等待...')
              ufma.post(interfaceURL.delMaEmpProperty, argu, function(result) {
                ufma.hideloading()
                $('button').attr('disabled', false)
                page.queryTableData()
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
      // 初始化页面
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        $('#dataType').ufTreecombox({
          idField: 'code',
          textField: 'codeName',
          pIdField: 'pCode', //可选
          placeholder: '请选择数据类型',
          data: [
            {
              code: 'A',
              codeName: '全部'
            },
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
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        })
        $('#dataType')
          .getObj()
          .setValue('A', '全部')
        page.initTabs([
          {
            chrCode: 'Y',
            chrName: '预置属性'
          },
          {
            chrCode: 'N',
            chrName: '自定义属性'
          }
        ])
        //初始化表格
        page.initTable([])
        page.queryTableData()
      },
      onEventListener: function() {
        // 查询按钮点击事件
        $('#btnQuery').on('click', function() {
          page.queryTableData()
        })
        // 新增按钮点击事件
        $('#btn-add-employee-property').on('click', function() {
          page.openWin($(this))
        })
        // 属性类别切换事件
        $('.accnab li').on('click', function() {
          if ($(this).hasClass('active') != true) {
            $('.accnab li').removeClass('active')
            $(this).addClass('active')
            var code = $(this)
              .find('a')
              .attr('code')
            page.code = code
            page.queryTableData()
            // 切换显示删除按钮
            if (code === 'N') {
              $('#delete-more').show()
            } else {
              $('#delete-more').hide()
            }
          }
        })
        // 编辑
        $(document).on('click', 'a.btn-edit', function() {
          page.openWin($(this))
        })
        // 启用
        $(document).on('click', 'a.btn-start', function() {
          page.startProperty($(this))
        })
        // 停用
        $(document).on('click', 'a.btn-stop', function() {
          page.stopProperty($(this))
        })
        // 删除
        $(document).on('click', '#delete-more', function() {
          page.delValues($(this), true)
        })
        // 删除表格行
        $(document).on('click', 'a.btn-delete', function() {
          page.delValues($(this), false)
        })
        // 复选框必须选中一个
        $("input[name='isUsed']").on('click', function() {
          var checked = $("input[name='isUsed']:checked")
          if (checked.length === 0) {
            $(this).prop('checked', true)
          }
        })
        $("input[name='isVisible']").on('click', function() {
          var checked = $("input[name='isVisible']:checked")
          if (checked.length === 0) {
            $(this).prop('checked', true)
          }
        })
        $("input[name='isEmpty']").on('click', function() {
          var checked = $("input[name='isEmpty']:checked")
          if (checked.length === 0) {
            $(this).prop('checked', true)
          }
        })
        $("input[name='isList']").on('click', function() {
          var checked = $("input[name='isList']:checked")
          if (checked.length === 0) {
            $(this).prop('checked', true)
          }
        })
        $("input[name='isCondition']").on('click', function() {
          var checked = $("input[name='isCondition']:checked")
          if (checked.length === 0) {
            $(this).prop('checked', true)
          }
        })
        $("input[name='isPhonebook']").on('click', function() {
          var checked = $("input[name='isPhonebook']:checked")
          if (checked.length === 0) {
            $(this).prop('checked', true)
          }
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
