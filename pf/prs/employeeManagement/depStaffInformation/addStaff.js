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
    selectMaEmpAndPrsCalcData: '/prs/emp/maEmp/selectMaEmpAndPrsCalcData', // 点击新增/编辑获取页面信息
    selectMaEmp: '/prs/emp/maEmp/selectMaEmp', // 查询具体人员信息
    saveMaEmp: '/prs/emp/maEmp/saveMaEmp', // 新增/修改人员信息  rmwyid 有值为修改   没有是新增
    getIntervalPrsLevelCo: '/prs/prslevelco/getIntervalPrsLevelCo' // 查询两个级别之间级别工资档次列表
  }
  var pageLength = 25

  // 生成HTML元素
  var createHtml = (function() {
    return {
      // 字符型
      createInput: function(require, id, name) {
        var str = '';
        name === '人员编码'&&window.ownerData.id?str = ' disabled':str ='';
        var html =
          '<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
          '<label class="control-label text-align-left data-label"><%=name%>:</label>' +
          '<div class="control-element" style="width:180px;">' +
          '<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 180px" autocomplete="off" '+str+'/>' +
          '</div></div>'

        return ufma.htmFormat(html, {
          required: require ? 'required' : '',
          id: id,
          name: name
        })
      },
      // 数字型
      createNumInput: function(require, id, name) {
        var html =
          '<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
          '<label class="control-label text-align-left data-label"><%=name%>:</label>' +
          '<div class="control-element" style="width:180px;">' +
          '<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 180px" autocomplete="off" placeholder="请输入数字"  />' +
          '</div></div>'

        return ufma.htmFormat(html, {
          required: require ? 'required' : '',
          id: id,
          name: name
        })
      },
      // 日期型
      createDate: function(require, id, name) {
        var html =
          '<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
          '<label class="control-label text-align-left data-label"><%=name%>:</label>' +
          '<div class="control-element" style="width:180px;">' +
          '<div id="<%=id%>" name="<%=id%>" class="uf-datepicker" style="width:200px;"></div></div></div>'
        return ufma.htmFormat(html, {
          required: require ? 'required' : '',
          id: id,
          name: name
        })
      },
      // 开关
      createRadioGroup: function(require, id, name, code) {
        var html =
          '<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
          '<label class="control-label data-label"><%=name%>:</label>' +
          '<div class="control-element"><div class="btn-group radio-group" data-toggle="buttons"><label class="btn btn-default btn-sm">' +
          '<input type="radio" class="toggle" name="<%=id%>" value="<%=code1%>"/><%=codeName1%></label>' +
          '<label class="btn btn-default btn-sm active">' +
          '<input type="radio" class="toggle" name="<%=id%>" value="<%=code2%>" checked/><%=codeName2%></label>' +
          '</div></div></div>'

        return ufma.htmFormat(html, {
          required: require ? 'required' : '',
          id: id,
          name: name,
          code1: code[0].valId,
          codeName1: code[0].val,
          code2: code[1].valId,
          codeName2: code[1].val
        })
      },
      // 枚举型 引用 多选
      createCombox: function(require, id, name) {
        var html =
          '<div class="form-group <%=required%> margin-top-10 col-xs-10 col-sm-4 col-md-4">' +
          '<label class="control-label data-label"><%=name%>:</label>' +
          '<div class="control-element"><div id="<%=id%>" class="uf-treecombox" idField="code" textField="codeName" leafRequire="true" name="<%=id%>" style="width:180px"></div></div></div>'

        return ufma.htmFormat(html, {
          required: require ? 'required' : '',
          id: id,
          name: name
        })
      }
    }
  })()

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
              type: 'input',
              field: 'bankAcc',
              name: '默认银行账号',
              headalign: 'center',
              align: 'center',
              onKeyup: function(e) {
                if (e.data !== '') {
                  var newData = e.data.replace(/[^\d]/g, '')
                  $('#salary-categoryinputbankAcc').val(newData)
                }
              }
            },
            {
              type: 'input',
              field: 'bankAccOther',
              name: '其它银行账号',
              headalign: 'center',
              align: 'center',
              onKeyup: function(e) {
                if (e.data !== '') {
                  var newData = e.data.replace(/[^\d]/g, '')
                  $('#salary-categoryinputbankAccOther').val(newData)
                }
              }
            },
            {
              type: 'combox',
              field: 'isStop',
              name: '是否停发',
              headalign: 'center',
              align: 'center',
              idField: 'isStop',
              textField: 'isStopName',
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

                if (window.ownerData.id && tableData[rowNo - 1].id) {
                  $('#salary-categorycomboxprtypeCode')
                    .getObj()
                    .setEnabled(false)
                } else {
                  $('#salary-categorycomboxprtypeCode')
                    .getObj()
                    .setEnabled(true)
                }
              }
            )
          }
        })
      },
      createClassNameHtml: function(name, htmlArray) {
        var classNameHtml = ''
        var htmls = []
        // 每三个form-group添加一个clearfix
        var htmls = []
        for (var i = 0, len = htmlArray.length; i < len; i += 3) {
          htmls.push(htmlArray.slice(i, i + 3))
        }
        for (var i = 0; i < htmls.length; i++) {
          var item = htmls[i]
          item.push('<div class="clearfix"></div>')
        }

        htmls = [].concat.apply([], htmls)

        var html = htmls.join('')
        classNameHtml +=
          '<div class="info-title margin-bottom-10">' +
          name +
          '</div><div class="form-row">' +
          html +
          '<div class="clearfix"></div></div>'

        return classNameHtml
      },
      // 初始化表单
      initForm: function(data, posiCode) {
        page.property = {}
        page.combox = [] // 下拉选项类型
        page.numInput = [] // 数字类型
        page.charNum = [] // 字符数字类
        page.dateInput = [] // 日期类型
        page.require = [] // 必须输入
        var classNameHtml = ''
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          if (item.data.length !== 0 && item.ordIndex !== '*') {
            var htmlArray = []
            for (var j = 0; j < item.data.length; j++) {
              var require = item.data[j].isEmpty === 'N' ? true : false
              var id = item.data[j].propertyCode
              var name = item.data[j].propertyName
              page.property[id] = ''
              if (require) {
                page.require.push({
                  id: id,
                  name: name
                })
              }
              if (
                item.data[j].dataType === 'E' ||
                item.data[j].dataType === 'R' ||
                item.data[j].dataType === 'X'
              ) {
                // 开关样式
                if (
                  item.data[j].asValList &&
                  item.data[j].asValList.length === 2
                ) {
                  htmlArray.push(
                    createHtml.createRadioGroup(
                      require,
                      id,
                      name,
                      item.data[j].asValList
                    )
                  )
                } else {
                  htmlArray.push(createHtml.createCombox(require, id, name))
                  page.combox.push({
                    id: id,
                    name: name,
                    asValList: item.data[j].asValList
                      ? item.data[j].asValList
                      : [],
                    posiLevelList: item.data[j].posiLevelList
                      ? item.data[j].posiLevelList
                      : []
                  })
                }
              } else if (item.data[j].dataType === 'N') {
                htmlArray.push(createHtml.createNumInput(require, id, name))
                page.numInput.push(id)
                page.charNum.push({
                  id: id,
                  name: name
                })
              } else if (item.data[j].dataType === 'D') {
                htmlArray.push(createHtml.createDate(require, id, name))
                page.dateInput.push(id)
              } else {
                htmlArray.push(createHtml.createInput(require, id, name))
                page.charNum.push({
                  id: id,
                  name: name
                })
              }
            }
            classNameHtml += page.createClassNameHtml(item.className, htmlArray)
          }
          if (item.ordIndex === '*') {
            page.prsTypeCo = item.data.prsTypeCo
            page.bankfileStyle = item.data.bankfileStyle
          }
        }

        $('#form-container').html(classNameHtml)
        for (var i = 0; i < page.combox.length; i++) {
          var id = page.combox[i].id
          var name = page.combox[i].name
          var asValList = page.combox[i].asValList
          var posiLevelList = page.combox[i].posiLevelList
          if (posiLevelList.length !== 0) {
            $('#' + id).ufTreecombox({
              idField: 'dutyCode',
              textField: 'dutyName',
              pIdField: 'pCode', //可选
              placeholder: '请选择' + name,
              data: posiLevelList,
              leafRequire: true,
              readonly: false,
              onChange: function(e, data) {
                ufma.post(
                  interfaceURL.getIntervalPrsLevelCo,
                  {
                    minLevel: data.highLevel,
                    maxLevel: data.lowestLevel
                  },
                  function(result) {
                    var data = []
                    for (var i = 0; i < result.data.length; i++) {
                      data.push({
                        valId: result.data[i].prlevelCode,
                        val: result.data[i].prlevelName
                      })
                    }

                    $('#posiCode')
                      .getObj()
                      .load(data)
                    $('#posiCode')
                      .getObj()
                      .val(posiCode ? posiCode : '')
                  }
                )
              },
              onComplete: function(sender, data) {}
            })
          } else {
            $('#' + id).ufTreecombox({
              idField: 'valId',
              textField: 'val',
              pIdField: 'pCode', //可选
              placeholder: '请选择' + name,
              data: asValList,
              leafRequire: true,
              readonly: false,
              onChange: function(sender, data) {},
              onComplete: function(sender, data) {}
            })
          }
        }
        for (var i = 0; i < page.numInput.length; i++) {
          var id = page.numInput[i]
          // 数字类型需要处理
          $('#' + id).numberInput()
        }
        for (var i = 0; i < page.dateInput.length; i++) {
          var id = page.dateInput[i]
          //绑定日历控件
          $('#' + id).ufDatepicker({
            format: 'yyyy-mm-dd',
            initialDate: ''
          })
        }
        var orgCodeList = []
        // 过滤停用部门
        for (var i = 0; i < window.ownerData.orgCodeList.length; i++) {
          if (window.ownerData.orgCodeList[i].isUsed === 'Y') {
            var item = window.ownerData.orgCodeList[i]
            orgCodeList.push({
              code: item.code,
              name: item.name,
              pId: item.pId
            })
          }
        }
        // 部门名称 单独处理
        $('#orgCode').ufTreecombox({
          idField: 'code',
          textField: 'name',
          pIdField: 'pId', //可选
          placeholder: '请选择部门',
          data: orgCodeList,
          leafRequire: true,
          readonly: true,
          onChange: function(sender, data) {},
          onComplete: function(sender, data) {}
        })
        if(window.ownerData.id){
          $('#orgCode').getObj().setEnabled(false)
        }

        // 填写身份证号后，自动带出“出生日期”
        $('#identityCode').on('blur', function() {
          var identityType = $('#identityType')
            .getObj()
            .getValue()
          var identityCode = $('#identityCode').val()
          if (identityType === '01' && ufma.checkIdCard(identityCode)) {
            var birthday =
              identityCode.substr(6, 4) +
              '-' +
              identityCode.substr(10, 2) +
              '-' +
              identityCode.substr(12, 2)
            $('#birthday').val(birthday)
          }
        })
      },

      // 校验数据
      checkData: function(formData) {
        for (var i = 0; i < window.ownerData.allEmpCodes.length; i++) {
          var element = window.ownerData.allEmpCodes[i]
          if (
            element === formData.empCode &&
            element !== window.ownerData.empCode
          ) {
            ufma.showTip('人员编码重复，请重新录入！', function() {}, 'warning')
            return false
          }
        }
        for (var i = 0; i < page.require.length; i++) {
          var item = page.require[i]
          if (formData[item.id].trim() === '') {
            ufma.showTip('请输入' + item.name, function() {}, 'warning')
            return false
          }
        }
        for (var i = 0; i < page.charNum.length; i++) {
          var item = page.charNum[i]
          if (getByteLen(formData[item.id].trim()) > 120) {
            var message = item.name + '最大可输入120个字符'
            ufma.showTip(message, function() {}, 'warning')
            return false
          }
        }
        // 身份证号合法性校验
        if ($('#identityType') && $('#identityCode')) {
          var identityType = $('#identityType')
            .getObj()
            .getValue()
          var identityCode = $('#identityCode').val()
          if (
            identityType === '01' &&
            identityCode !== '' &&
            !ufma.checkIdCard(identityCode)
          ) {
            ufma.showTip('请输入正确的证件号码', function() {}, 'warning')
            return false
          }
        }
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
                  page.initForm(formData, result.data.posiCode)
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
        //增行
        $('.btn-add-row').on('click', function() {
          var formData = $('#frmQuery').serializeObject()
          var rowdata = {
            id: '',
            rmwyid: '',
            agencyCode: svData.svAgencyCode,
            prtypeCode: '',
            prstylCode: '',
            prstylCodeOther: '',
            setYear: svData.setYear,
            bankAcc: formData.bankAcc,
            bankAccOther: formData.bankAccOther,
            isStop: 'N',
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
          var obj = $('#salary-category').getObj()
          var checkData = obj.getCheckData()
          var $check = $('#salary-category').find('.check-item:checked')
          if ($check.length > 0) {
            for (var i = 0; i < checkData.length; i++) {
              if (checkData[i].id) {
                page.delproTypeCodeList.push(checkData[i])
              }
              var rowid = $check.eq(i).attr('rowid')
              obj.del(rowid)
            }
          }
          var tableData = obj.getData()
          obj.load(tableData)
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
