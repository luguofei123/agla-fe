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
    selectMaEmpAndPrsCalcData: '/prs/emp/prsType/selectMaEmpPrsTypeList', // 点击新增/编辑获取页面信息
    selectMaEmp: '/prs/emp/prsType/selectMaEmp', // 查询具体人员信息
    saveMaEmp: '/prs/emp/prsType/saveMaEmp', // 新增/修改人员信息  rmwyid 有值为修改   没有是新增
    getIntervalPrsLevelCo: '/prs/prslevelco/getIntervalPrsLevelCo', // 查询两个级别之间级别工资档次列表
    checkDelData : '/prs/emp/prsType/checkDelData' // 删除时判断是否结账
  }
  var pageLength = 25

  var page = (function() {
    return {
      // 定义列
      columns: function() {
        var columns = [
          [
            {
              type: 'checkbox',
              width: 30,
              align: 'center',
              headalign: 'center'
            },
            {
              type: 'indexcolumn',
              width: 40,
              name: '序号',
              align: 'center',
              headalign: 'center'
            },
            {
              type: 'combox',
              field: 'prtypeCode',
              name: '工资类别',
              width: 80,
              headalign: 'center',
              align: 'center',
              idField: 'prtypeCode',
              textField: 'prtypeName',
              data: page.prsTypeCo,
              render: function(rowid, rowdata, data) {
                if (!data) {
                  return ''
                }
                for (var i = 0; i < page.prsTypeCo.length; i++) {
                  if (rowdata.prtypeCode === page.prsTypeCo[i].prtypeCode) {
                    return page.prsTypeCo[i].prtypeName
                  }
                }
                return ''
              },
              onChange: function(e, data) {
                // 工资类别不能重复选择
                var rowid = e.rowId
                var rowNoarr = rowid.split('_')
                var rowNo = parseInt(rowNoarr[rowNoarr.length - 1])
                var tableData = $('#salary-category')
                  .getObj()
                  .getData()
                for (var i = 0; i < tableData.length; i++) {
                  if (
                    i !== rowNo - 1 &&
                    tableData[i].prtypeCode === e.itemData.prtypeCode
                  ) {
                    $('#salary-categorycomboxprtypeCode')
                      .getObj()
                      .clear()
                    ufma.showTip(
                      '存在重复数据，请检查',
                      function() {},
                      'warning'
                    )
                  }
                }
              },
              beforeExpand: function(e) {}
            },
            {
              type: 'combox',
              field: 'bankAcc',
              name: '默认银行账号',
              headalign: 'center',
              align: 'center',
              idField: 'accountNo',
              textField: 'accountNo',
              data: page.maEmpAccountList,
              render: function(rowid, rowdata, data) {
                  if (!data) {
                    return ''
                  }
                  for (var i = 0; i < page.maEmpAccountList.length; i++) {
                    if (rowdata.bankAcc === page.maEmpAccountList[i].accountNo) {
                      return page.maEmpAccountList[i].accountNo
                    }
                  }
                  return ''
                },
                onChange: function(e, data) {
                  $('#salary-categoryinputbankAccName').prop('disabled','disabled').attr('disabled','disabled').val(e.itemData.bankCategoryName)
                  // 银行账号不能重复选择
//                  var rowid = e.rowId
//                  var rowNoarr = rowid.split('_')
//                  var rowNo = parseInt(rowNoarr[rowNoarr.length - 1])
//                  var tableData = $('#salary-category')
//                    .getObj()
//                    .getData()
//                  for (var i = 0; i < tableData.length; i++) {
//                    if (
//                      i !== rowNo - 1 &&
//                      tableData[i].bankAcc === e.itemData.accountNo
//                    ) {
//                      $('#salary-categorycomboxbankAcc')
//                        .getObj()
//                        .clear()
//                      ufma.showTip(
//                        '存在重复数据，请检查',
//                        function() {},
//                        'warning'
//                      )
//                    }
//                  }
                },
                beforeExpand: function(e) {}
            },
            {
              type: 'input',
              field: 'bankAccName',
              name: '默认银行类别',
              width: 80,
              headalign: 'center',
              align: 'center'
            },
            {
              type: 'combox',
              field: 'bankAccOther',
              name: '其它银行账号',
              headalign: 'center',
              align: 'center',
              idField: 'accountNo',
              textField: 'accountNo',
              data: page.maEmpAccountList,
              render: function(rowid, rowdata, data) {
                  if (!data) {
                    return ''
                  }
                  for (var i = 0; i < page.maEmpAccountList.length; i++) {
                    if (rowdata.bankAccOther === page.maEmpAccountList[i].accountNo) {
                      return page.maEmpAccountList[i].accountNo
                    }
                  }
                  return ''
                },
                onChange: function(e, data) {
                  $('#salary-categoryinputbankAccOtherName').prop('disabled','disabled').attr('disabled','disabled').val(e.itemData.bankCategoryName)
                  // 银行账号不能重复选择
//                  var rowid = e.rowId
//                  var rowNoarr = rowid.split('_')
//                  var rowNo = parseInt(rowNoarr[rowNoarr.length - 1])
//                  var tableData = $('#salary-category')
//                    .getObj()
//                    .getData()
//                  for (var i = 0; i < tableData.length; i++) {
//                    if (
//                      i !== rowNo - 1 &&
//                      tableData[i].bankAccOther === e.itemData.accountNo
//                    ) {
//                      $('#salary-categorycomboxbankAccOther')
//                        .getObj()
//                        .clear()
//                      ufma.showTip(
//                        '存在重复数据，请检查',
//                        function() {},
//                        'warning'
//                      )
//                    }
//                  }
                },
                beforeExpand: function(e) {}
            },
            {
              type: 'input',
              field: 'bankAccOtherName',
              name: '其它银行类别',
              width: 80,
              headalign: 'center',
              align: 'center'
            },
            {
              type: 'combox',
              field: 'isStop',
              name: '是否停发',
              headalign: 'center',
              align: 'center',
              idField: 'isStop',
              textField: 'isStopName',
              width: 60,
              data: [
                { isStop: 'Y', isStopName: '是' },
                { isStop: 'N', isStopName: '否' }
              ],
              render: function(rowid, rowdata, data) {
                if (!data || data == '') {
                  return ''
                }
                if (rowdata['isStop'] == 'Y') {
                  return '是'
                } else if (rowdata['isStop'] == 'N') {
                  return '否'
                } else {
                  return ''
                }
              },
              onChange: function(e) {},
              beforeExpand: function(e) {}
            },
            {
              type: 'combox',
              field: 'bankfileStyle',
              name: '银行代发文件格式',
              headalign: 'center',
              align: 'center',
              idField: 'prstylCode',
              textField: 'prstylName',
              data: page.bankfileStyle,
              render: function(rowid, rowdata, data) {
                if (!data) {
                  return ''
                }
                for (var i = 0; i < page.bankfileStyle.length; i++) {
                  if (
                    rowdata.bankfileStyle === page.bankfileStyle[i].prstylCode
                  ) {
                    return page.bankfileStyle[i].prstylName
                  }
                }
                return ''
              },
              onChange: function(e, data) {},
              beforeExpand: function(e) {}
            },
            {
              type: 'combox',
              field: 'bankfileStyleOther',
              name: '其它银行代发文件格式',
              headalign: 'center',
              align: 'center',
              idField: 'prstylCode',
              textField: 'prstylName',
              data: page.bankfileStyle,
              render: function(rowid, rowdata, data) {
                if (!data) {
                  return ''
                }
                for (var i = 0; i < page.bankfileStyle.length; i++) {
                  if (
                    rowdata.bankfileStyleOther ===
                    page.bankfileStyle[i].prstylCode
                  ) {
                    return page.bankfileStyle[i].prstylName
                  }
                }
                return ''
              },
              onChange: function(e, data) {},
              beforeExpand: function(e) {}
            }
          ]
        ]
        return columns
      },
      //渲染表格
      initTable: function(tableData) {
        page.tableObjData = tableData
        var id = 'salary-category'
        $('#' + id).ufDatagrid({
          frozenStartColumn: 1, //冻结开始列,从1开始
          frozenEndColumn: 1, //冻结结束列
          data: tableData,
          disabled: false, // 可选择
          columns: page.columns(),
          initComplete: function(options, data) {
            $(document).on(
              'focus',
              '#salary-categorycomboxprtypeCode_input',
              function() {
                var rowid = $('.uf-grid-table-edit').attr('rowid')
                var rowNoarr = rowid.split('_')
                var rowNo = parseInt(rowNoarr[rowNoarr.length - 1])
                var tableData = $('#salary-category')
                  .getObj()
                  .getData()
                //【sunch】【CWYXM-8353】只有一条的时候为何不能修改？里面的代码暂时注释，有问题请反馈
                if (window.ownerData.id && tableData[rowNo - 1].id) {
                  // $('#salary-categorycomboxprtypeCode')
                  //   .getObj()
                  //   .setEnabled(false)
                } else {
                  $('#salary-categorycomboxprtypeCode')
                    .getObj()
                    .setEnabled(true)
                }
              }
            )
          }
        })
        setTimeout(function(){
          $('#salary-categoryinputbankCategoryName').prop('disabled','disabled').attr('disabled','disabled');
          $('#salary-categoryinputotherBankCategoryName').prop('disabled','disabled').attr('disabled','disabled');
        },0)
      },
      /**
       * 初始化表单
       * @param {Array} data 工资类别数据 和 银行代发文件格式数据
       * @param {*} posiCode 
       * @param {Object} maEmpAccountList 用户基础数据
       */
      initForm: function(data, posiCode,maEmpAccountList) {
    	var classNameHtml = ''
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          if (item.ordIndex === '*') {
            page.prsTypeCo = item.data.prsTypeCo
            page.bankfileStyle = item.data.bankfileStyle
            page.maEmpAccountList = maEmpAccountList
          }
        }
      },

      // 校验数据
      checkData: function(formData) {
        var tableData = $('#salary-category')
        .getObj()
        .getData()
        for (var i = 0; i < tableData.length; i++) {
          if (!tableData[i].prtypeCode) {
            var index = i + 1
            ufma.showTip(
              '工资类别列表第' + index +
              '行，工资类别没有设置，请检查！',
              function() {},
              'warning'
            )
            return false
          }
        }

        return true
      },
      // 新增参数
      getAddArgu: function(proTypeCodeList, formData) {
        var tableData = []
        for (var i = 0; i < proTypeCodeList.length; i++) {
          proTypeCodeList[i].rmwyid = window.ownerData.id
            ? window.ownerData.id
            : ''
          proTypeCodeList[i].id = window.ownerData.id ? window.ownerData.id : ''
          proTypeCodeList[i].mo = ''
          for (var j = 0; j < page.prsTypeCo.length; j++) {
            if (
              proTypeCodeList[i].prtypeCode === page.prsTypeCo[j].prtypeCode
            ) {
              proTypeCodeList[i].mo = page.prsTypeCo[j].mo
            }
          }
          tableData.push(proTypeCodeList[i])
        }
        return $.extend({}, formData, {
          proTypeCodeList: tableData,
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear
        })
      },
      // 编辑参数
      getEditArgu: function(proTypeCodeList, formData) {
        var tableData = []
        var tableData1 = []
        for (var i = 0; i < proTypeCodeList.length; i++) {
          if (!proTypeCodeList[i].rmwyid) {
            proTypeCodeList[i].rmwyid = window.ownerData.id
              ? window.ownerData.id
              : ''
            proTypeCodeList[i].id = window.ownerData.id
              ? window.ownerData.id
              : ''
            proTypeCodeList[i].mo = ''
            for (var j = 0; j < page.prsTypeCo.length; j++) {
              if (
                proTypeCodeList[i].prtypeCode === page.prsTypeCo[j].prtypeCode
              ) {
                proTypeCodeList[i].mo = page.prsTypeCo[j].mo
              }
            }
            tableData.push(proTypeCodeList[i])
          } else {
            tableData1.push(proTypeCodeList[i])
          }
        }
        return $.extend({}, formData, {
          addTypeCodeList: tableData,
          proTypeCodeList: tableData1,
          delproTypeCodeList: page.delproTypeCodeList,
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear
        })
      },
      getArgu: function(formData) {
        var proTypeCodeList = $('#salary-category')
          .getObj()
          .getData()
        var argu
        // 编辑
        if (window.ownerData.id) {
          argu = page.getEditArgu(proTypeCodeList, formData)
        } else {
          argu = page.getAddArgu(proTypeCodeList, formData)
        }

        if (window.ownerData.id) {
          argu.rmwyid = window.ownerData.id
        } else {
          argu.rmwyid = ''
        }

        return argu
      },
      // 保存并新增
      saveAdd: function(formData) {
        var formData = $('#frmQuery').serializeObject()
        if (!page.checkData(formData)) {
          return
        }
        var argu = page.getArgu(formData)
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.saveMaEmp, argu, function(result) {
          ufma.hideloading()
          $('button').attr('disabled', false)
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            var msg = result.msg
            $('#frmQuery').setForm(page.property)
            $('#salary-category')
              .getObj()
              .load([])
            $('#posiCode')
              .getObj()
              .load([])
            window.ownerData.maxOrdIndex += 1
            window.ownerData.allEmpCodes.push(formData.empCode)
            ufma.showTip(msg, function() {}, 'success')
          }
        })
        var timeId = setTimeout(function() {
          clearTimeout(timeId)
          $('button').attr('disabled', false)
        }, '5000')
      },
      // 保存
      save: function() {
        var formData = $('#frmQuery').serializeObject()
        if (!page.checkData(formData)) {
          return
        }
        var argu = page.getArgu(formData)
        if (window.ownerData.id) {
          argu.rmwyid = window.ownerData.id
        } else {
          argu.rmwyid = ''
        }
        $('button').attr('disabled', true)
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.saveMaEmp, argu, function(result) {
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

      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        ufma.get(interfaceURL.selectMaEmpAndPrsCalcData, '', function(result) {
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            var formData = result.data
            for (var i = 0; i < formData.length; i++) {
              if (formData[i].className === '基本信息') {
                formData[i].data.unshift({
                  dataType: 'E',
                  isEmpty: 'N',
                  ordIndex: '0',
                  propertyCode: 'orgCode',
                  propertyName: '部门名称'
                })
              }
            }
            // 修改
            if (window.ownerData.id) {
              $('#person-saveadd').hide()
              var argu = {
                rmwyid: window.ownerData.id,
                agencyCode: svData.svAgencyCode,
                rgCode: svData.svRgCode,
                setYear: svData.svSetYear
              }
              ufma.post(interfaceURL.selectMaEmp, argu, function(result) {
                if (result.flag == 'fail') {
                  ufma.showTip(result.msg, function() {}, 'warning')
                } else if (result.flag == 'success') {
                  page.initForm(formData, result.data.posiCode ,result.data.maEmpAccountList)
                  $('#frmQuery').setForm(result.data)

                  page.initTable(result.data.proTypeCodeList)
                }
              })
            } else {
              page.initForm(formData)
              // 是否领导默认为否 ，停发状态默认为发放
              $('#frmQuery').setForm({
                isFugle: 'N',
                isStop: 'N',
                ordIndex: Number(window.ownerData.maxOrdIndex) + 1
              })
              $('#person-saveadd').show()
              page.initTable([])
            }
          }
        })
        page.delproTypeCodeList = [] // 工资类别删除保存原有数据
      },
      onEventListener: function() {
        $('#salary-category').on('click', function(){
          $('#salary-categoryinputbankCategoryName').prop('disabled','disabled').attr('disabled','disabled');
          $('#salary-categoryinputotherBankCategoryName').prop('disabled','disabled').attr('disabled','disabled');
        })
        //增行
        $('.btn-add-row').on('click', function() {
        	$("#salary-categoryBody").css("height","100%");
          var formData = $('#frmQuery').serializeObject()
          var rowdata = {
            id: '',
            rmwyid: '',
            agencyCode: svData.svAgencyCode,
            prtypeCode: '',
            prstylCode: '',
            prstylCodeOther: '',
            setYear: svData.setYear,
            bankAcc: $.isNull(page.maEmpAccountList) || page.maEmpAccountList.length == 0 ? "" : page.maEmpAccountList[0].accountNo,
            bankAccName: $.isNull(page.maEmpAccountList) || page.maEmpAccountList.length == 0 ? "" : page.maEmpAccountList[0].bankCategoryName,
            bankAccOther: '',
            bankAccOtherName: '',
            isStop: $.isNull(ownerData.isStop) ? 'N' : ownerData.isStop,
            createUser: '',
            createDate: '',
            latestOpUser: '',
            latestOpDate: '',
            rgCode: svData.rgCode,
            bankfileStyle: '',
            bankfileStyleOther: ''
          }
          var obj = $('#salary-category').getObj()
          obj.add(rowdata)
        })
        //删行
        $('.btn-del-row').on('click', function() {
          var formData = $('#frmQuery').serializeObject();
          var obj = $('#salary-category').getObj();
          var checkData = obj.getCheckData();
          var $check = $('#salary-category').find('.check-item:checked');
          if ($check.length > 0) {
            for (var i = 0; i < checkData.length; i++) {
              if (checkData[i].id) {
            	  for (var k = 0; k < page.prsTypeCo.length; k++) {
                      if (checkData[i].prtypeCode === page.prsTypeCo[k].prtypeCode) {
                    	  checkData[i].prtypeName = page.prsTypeCo[k].prtypeName;
                    	  break;
                      }
                  }
            	  page.delproTypeCodeList.push(checkData[i])
              }
              //var rowid = $check.eq(i).attr('rowid')
              //obj.del(rowid)
            }
            
            if (page.delproTypeCodeList == null || page.delproTypeCodeList.length == 0) {
            	for (var i = 0; i < checkData.length; i++) {
      	            var rowid = $check.eq(i).attr('rowid')
      	            obj.del(rowid)
      	        }
            	var tableData = obj.getData()
                obj.load(tableData)
            } else {
            	var argu = page.getArgu(formData)
                if (window.ownerData.id) {
                  argu.rmwyid = window.ownerData.id
                } else {
                  argu.rmwyid = ''
                }
                ufma.post(interfaceURL.checkDelData, argu, function(result) {
                  if (result.flag == 'warn') {
                    ufma.showTip(result.msg, function() {}, 'warning');
                    page.delproTypeCodeList = [];
                    $($check).removeAttr("checked");
                    return;
                  } else if (result.flag == 'success') {
                	  for (var i = 0; i < checkData.length; i++) {
          	            var rowid = $check.eq(i).attr('rowid')
          	            obj.del(rowid)
          	        }
                  }
                  var tableData = obj.getData()
                  obj.load(tableData)
                })
            }
          }
        })
        // 保存并新增按钮点击事件
        $('#person-saveadd').on('click', page.saveAdd)
        // 保存按钮点击事件
        $('#person-save').on('click', page.save)
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
        // $('#input-id').fileinput({
        //   autoReplace: true,
        //   maxFileCount: 1,
        //   allowedFileExtensions: ["jpg", "png", "gif"]
        // })
      }
    }
  })()
  /////////////////////
  page.init()
})
