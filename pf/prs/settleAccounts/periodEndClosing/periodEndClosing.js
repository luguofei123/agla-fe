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
    getPrtypes: '/prs/prsclose/getPrtypes', // 查询工资类别信息
    closeCheck: '/prs/prsclose/closeCheck', // 结账前检查类别信息
    unCloseCheck: '/prs/prsclose/unCloseCheck', // 反结账前检查类别信息
    close: '/prs/prsclose/close', // 结账
    unClose: '/prs/prsclose/unClose' // 反结账
  }
  var pageLength = 25

  var page = (function() {
    return {
      //表格列
      columns: function() {
        var columns = [
          [
            {
              type: 'checkbox',
              field: '',
              name: '',
              width: 40,
              headalign: 'center',
              className: 'no-print',
              align: 'center'
            },
            {
              field: 'prtypeName',
              name: '工资类别',
              headalign: 'center',
              align: 'center'
            },
            {
              field: 'setYear',
              name: '年度',
              headalign: 'center',
              align: 'center'
            },
            {
              field: 'mo',
              name: '月份',
              headalign: 'center',
              align: 'center'
            },
            {
              field: 'payNoMo',
              name: '月批次',
              headalign: 'center',
              align: 'center'
            },
            {
              type: 'combox',
              field: 'closeType',
              name: '结账类型',
              headalign: 'center',
              align: 'left',
              idField: 'closeType',
              textField: 'name',
              pIdField: '',
              data: [
                { closeType: '1', name: '结账到下一月' },
                { closeType: '2', name: '结账到下一批次' }
              ],
              render: function(rowid, rowdata, data) {
                if (!data || data == '') {
                  rowdata['closeType'] = '1'
                  return '结账到下一月'
                }
                if (rowdata['closeType'] == '1') {
                  return '结账到下一月'
                } else if (rowdata['closeType'] == '2') {
                  return '结账到下一批次'
                }
              },
              onChange: function(e) {},
              beforeExpand: function(e) {
                //下拉框初始化
              }
            }
          ]
        ]
        return columns
      },
      // 初始化表格
      initTable: function(data) {
        var id = 'period-end-closing-table'
        var toolBar = $('#' + id).attr('tool-bar')
        page.DataTable = $('#' + id).ufDatagrid({
          frozenStartColumn: 1, //冻结开始列,从1开始
          frozenEndColumn: 1, //冻结结束列
          data: data,
          disabled: false, // 可选择
          bPaginate: false,
          columns: page.columns(),
          initComplete: function(settings, json) {
            $('#add-office-subsidy-standard-table_wrapper').ufScrollBar({
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
                // rightColumns: 1 //锁定右侧一列
                // leftColumns: 1//锁定左侧一列
              })
            }
            $('#period-end-closing-table')
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
            $('#add-office-subsidy-standard-table_wrapper').ufScrollBar(
              'update'
            )
          }
        })
      },
      //获取勾选的数据
      getCheckedRows: function() {
        var obj = $('#period-end-closing-table').getObj()
        var checkData = obj.getCheckData()
        return checkData
      },
      getArgu: function(checkData, callback) {
        var argu = []
        var actions = []
        // 因为confirm为异步操作，所以将代码转换为一个任务队列串行执行
        for (var i = 0; i < checkData.length; i++) {
          var item = checkData[i]
          if (item.mo === 12 && item.closeType === '1') {
            ;(function(checkData) {
              actions.push(function() {
                var html = ''
                html +=
                  '<ul style="margin-top:-10px"><li>当前选择的工资类别 [' + checkData.prtypeName + '] 已发放到 12 月份，结账后为下年 1 月份，</li>' +
                  '<li class="margin-top-10">若选择[是]，会到直接结账到下年并可自动结转单位基础数据;</li>' +
                  '<li class="margin-top-10">若选择[否]，不进行任何操作。</li></ul>'
                ufma.confirm(
                  html,
                  function(action) {
                    if (action) {
                      if (checkData.nextYearDataNum > 0) {
                        ufma.confirm(
                          '当前选择的工资类别 [' +
                            checkData.prtypeName +
                            '] 已存在下一年度的数据,是否覆盖? ',
                          function(action) {
                            if (action) {
                              argu.push({
                                prtypeCode: checkData.prtypeCode,
                                closeType: checkData.closeType,
                                isBaseCarryNextYear: 'Y',
                                isBaseCoverNextYear: 'Y',
                                mo: checkData.mo
                              })
                              if (actions.length !== 0) {
                                actions.shift()()
                              } else {
                                callback(argu)
                              }
                            } else {}
                          },
                          { type: 'warning' }
                        )
                      } else {
                        argu.push({
                          prtypeCode: checkData.prtypeCode,
                          closeType: checkData.closeType,
                          isBaseCarryNextYear: 'Y',
                          mo: checkData.mo
                        })
                        if (actions.length !== 0) {
                          actions.shift()()
                        } else {
                          callback(argu)
                        }
                      }
                    } else {}
                  },
                  { type: 'warning' }
                )
                $(".u-msg-dialog").css("width",'520px');
              })
            })(item)
          } else {
            ;(function(checkData) {
              actions.push(function() {
                argu.push({
                  prtypeCode: checkData.prtypeCode,
                  closeType: checkData.closeType,
                  mo: checkData.mo
                })
                if (actions.length !== 0) {
                  actions.shift()()
                } else {
                  callback(argu)
                }
              })
            })(item)
          }
        }
        console.log(argu)
        if (actions.length !== 0) {
          actions.shift()()
        } else {
          callback(argu)
        }
      },
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        //初始化表格
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.getPrtypes, {}, function(result) {
          ufma.hideloading()
          page.initTable(result.data)
        })
      },
      onEventListener: function() {
        // 结账按钮点击事件
        $('#period-end-closing .btn-close-account').on('click', function() {
          var checkData = page.getCheckedRows()
          if (checkData.length == 0) {
            ufma.alert('请选择要结账的数据！', 'warning')
            return false
          }
          ufma.confirm(
            '您确定对选择的工资类别月结账吗？',
            function(action) {
              if (action) {
                var prtypeCodes = []
                for (var i = 0; i < checkData.length; i++) {
                  prtypeCodes.push(checkData[i].prtypeCode)
                }
                $('button').attr('disabled', true)
                ufma.showloading('正在加载数据请耐心等待...')
                ufma.post(interfaceURL.closeCheck, prtypeCodes, function(
                  result
                ) {
                  ufma.hideloading()
                  $('button').attr('disabled', false)
                  if (result.flag === 'success') {
                    page.getArgu(checkData, function(argu) {
                      ufma.showloading('正在加载数据请耐心等待...')
                      ufma.post(interfaceURL.close, argu, function(result) {
                        ufma.hideloading()
                        if (result.flag === 'success') {
                          ufma.post(interfaceURL.getPrtypes, {}, function(result) {
                            ufma.hideloading()
                            page.initTable(result.data)
                          })
                          ufma.alert(result.msg, 'success')
                        } else {
                          ufma.alert(result.msg, 'warning')
                        }
                        if (result.data) {
                          ufma.alert(
                            '存在下列类别结转到下一年度: ' +
                              result.data +
                              '请修改 [系统环境]-[业务日期] 到下一年度, 再进行工资编辑!',
                            'warning'
                          )
                        }
                      })
                    })
                  } else {
                    ufma.alert(result.msg, 'warning')
                  }
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
        })
        // 反结账按钮点击事件
        $('#period-end-closing .btn-anti-settlement').on('click', function() {
          var checkData = page.getCheckedRows()
          if (checkData.length == 0) {
            ufma.alert('请选择要反结账的数据！', 'warning')
            return false
          }
          ufma.confirm(
            '您确定对选择的工资类别反结账吗？',
            function(action) {
              if (action) {
                var prtypeCodes = []
                for (var i = 0; i < checkData.length; i++) {
                  prtypeCodes.push(checkData[i].prtypeCode)
                }
                $('button').attr('disabled', true)
                ufma.showloading('正在加载数据请耐心等待...')
                ufma.post(interfaceURL.unCloseCheck, prtypeCodes, function(
                  result
                ) {
                  ufma.hideloading()
                  $('button').attr('disabled', false)
                  if (result.flag === 'success') {
                    ufma.showloading('正在加载数据请耐心等待...')
                    ufma.post(interfaceURL.unClose, prtypeCodes, function(
                      result
                    ) {
                      ufma.hideloading()
                      if (result.flag === 'success') {
                        ufma.post(interfaceURL.getPrtypes, {}, function(result) {
                          ufma.hideloading()
                          page.initTable(result.data)
                        })
                        ufma.alert(result.msg, 'success')
                      } else {
                        ufma.alert(result.msg, 'warning')
                      }
                    })
                  } else {
                    ufma.alert(result.msg, 'warning')
                  }
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
