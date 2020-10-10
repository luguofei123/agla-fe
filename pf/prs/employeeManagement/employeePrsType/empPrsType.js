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
    getPrsOrgTree: '/ma/emp/prsOrg/getPrsOrgTree', // 获取部门树
    delete: '/ma/emp/prsOrg/delete', //  删除部门
    able: '/ma/emp/prsOrg/able', // 启用/停用
    getPropertyInList: '/ma/emp/maEmpProperty/getPropertyInList', // 获取在列表中显示的属性字段
    getMaEmpByOrgCodes: '/ma/emp/maEmp/getMaEmpByOrgCodes', // 查询部门下属的人员信息
    delMaEmp: '/ma/emp/maEmp/delMaEmp', // 批量删除人员信息
    selectMaEmpAndPrsCalcData: '/ma/emp/maEmp/selectMaEmpAndPrsCalcData', // 点击新增/编辑获取页面信息
    getPrsLevelList: '/prs/prslevelco/getPrsLevelList', // 查询级别工资档次列表
    getEmpTYpe : '/ma/ele/emptype/selectEmpType' //获取人员身份
  }
  var lastValue = ''
  var nodeList = []
  var pageLength = 25
  var typeCodeList; // 人员身份下拉选项
  // 生成HTML元素
  var createHtml = (function() {
    return {
      // 字符型
      createInput: function(id, name) {
        var html =
          '<div class="form-group col-xs-10 margin-top-10 col-sm-6 col-md-6">' +
          '<label class="control-label text-align-left data-label"><%=name%>:</label>' +
          '<div class="control-element" style="width:200px;">' +
          '<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 200px" autocomplete="off" />' +
          '</div></div>'

        return ufma.htmFormat(html, {
          id: id,
          name: name
        })
      },
      // 数字型
      createNumInput: function(id, name) {
        var html =
          '<div class="form-group col-xs-10 margin-top-10 col-sm-6 col-md-6">' +
          '<label class="control-label text-align-left data-label"><%=name%>:</label>' +
          '<div class="control-element" style="width:200px;">' +
          '<input id="<%=id%>" type="text" name="<%=id%>" class="form-control" maxlength="200" style="width: 200px" autocomplete="off" placeholder="请输入数字"  />' +
          '</div></div>'

        return ufma.htmFormat(html, {
          id: id,
          name: name
        })
      },
      // 日期型
      createDate: function(id, name) {
        var startName = id + 'Start'
        var startId = id + 'Start'
        var endName = id + 'End'
        var endId = id + 'End'
        var html =
          '<div class="form-group col-xs-10 margin-top-10 col-sm-6 col-md-6">' +
          '<label class="control-label text-align-left data-label"><%=name%>:</label>' +
          '<div class="control-element" style="width: 130px !important;">' +
          '<div id="<%=startId%>" name="<%=startId%>" class="uf-datepicker startDate"></div></div>' +
          '<span class="split">-</span>' +
          '<div class="control-element" style="width: 130px !important;">' +
          '<div id="<%=endId%>" name="<%=endId%>" class="uf-datepicker endDate"></div></div></div>'
        return ufma.htmFormat(html, {
          id: id,
          name: name,
          startName: startName,
          startId: startId,
          endName: endName,
          endId: endId
        })
      },
      // 开关
      createRadioGroup: function(id, name, code) {
        var html =
          '<div class="form-group col-xs-10 margin-top-10 col-sm-6 col-md-6">' +
          '<label class="control-label data-label"><%=name%>:</label>' +
          '<div class="control-element"><div class="btn-group radio-group" data-toggle="buttons"><label class="btn btn-default btn-sm">' +
          '<input type="radio" class="toggle" name="<%=id%>" value="<%=code1%>"/><%=codeName1%></label>' +
          '<label class="btn btn-default btn-sm active">' +
          '<input type="radio" class="toggle" name="<%=id%>" value="<%=code2%>" checked/><%=codeName2%></label>' +
          '</div></div></div>'

        return ufma.htmFormat(html, {
          id: id,
          name: name,
          code1: code[0].valId,
          codeName1: code[0].val,
          code2: code[1].valId,
          codeName2: code[1].val
        })
      },
      // 复选框
      createCheckBox: function(id, name, code) {
        var html =
          '<div class="form-group col-xs-10 margin-top-10 col-sm-6 col-md-6">' +
          '<label class="control-label data-label"><%=name%>:</label>' +
          '<span><label class="mt-checkbox mt-checkbox-outline margin-right-20"><input checked name="<%=id%>" type="checkbox" value="<%=code1%>" /><%=codeName1%><span></span></label>' +
          '<label class="mt-checkbox mt-checkbox-outline margin-right-20"><input checked name="<%=id%>" type="checkbox" value="<%=code2%>" /><%=codeName2%><span></span></label>' +
          '</span></div>'

        return ufma.htmFormat(html, {
          id: id,
          name: name,
          code1: code[0].valId,
          codeName1: code[0].val,
          code2: code[1].valId,
          codeName2: code[1].val
        })
      },
      // 枚举型 引用 多选
      createCombox: function(id, name) {
        var html =
          '<div class="form-group col-xs-10 margin-top-10 col-sm-6 col-md-6">' +
          '<label class="control-label data-label"><%=name%>:</label>' +
          '<div class="control-element"><div id="<%=id%>" class="uf-treecombox" idField="code" textField="codeName" leafRequire="true" name="<%=id%>" style="width:200px"></div></div></div>'

        return ufma.htmFormat(html, {
          id: id,
          name: name
        })
      }
    }
  })()

  /** 部门树的回调方法 */
  var treeCallback = (function() {
    return {
      getFontCss: function(treeId, treeNode) {
        return !!treeNode.highlight
          ? {
              color: '#F04134',
              'font-weight': 'bold'
            }
          : {
              color: '#333',
              'font-weight': 'normal'
            }
      },
      beforeClick: function(treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj('tree')
        zTree.checkNode(treeNode, !treeNode.checked, null, true)
      },
      focusKey: function(e) {
        var key = $('#key')
        if (key.hasClass('empty')) {
          key.removeClass('empty')
        }
      },
      blurKey: function(e) {
        var key = $('#key')
        if (key.get(0).value === '') {
          key.addClass('empty')
        }
      },
      getAllChildrenNodes: function(treeNode, result) {
        if (treeNode.isParent) {
          var childrenNodes = treeNode.children
          if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
              result += ',' + childrenNodes[i].id
              result = treeCallback.getAllChildrenNodes(
                childrenNodes[i],
                result
              )
            }
          }
        }
        return result
      },
      allNodesArr: function() {
        var zTree = $.fn.zTree.getZTreeObj('tree')
        var nodes = zTree.getNodes()
        var allNodesArr = []
        var allNodesStr
        for (var i = 0; i < nodes.length; i++) {
          var result = ''
          var result = treeCallback.getAllChildrenNodes(nodes[i], result)
          var NodesStr = result
          NodesStr = NodesStr.split(',')
          NodesStr.splice(0, 1, nodes[i].id)
          NodesStr = NodesStr.join(',')
          allNodesStr += ',' + NodesStr
        }
        allNodesArr = allNodesStr.split(',')
        allNodesArr.shift()
        return allNodesArr
      },
      updateNodes: function(highlight) {
        var zTree = $.fn.zTree.getZTreeObj('tree')
        for (var i = 0, l = nodeList.length; i < l; i++) {
          nodeList[i].highlight = highlight
          zTree.updateNode(nodeList[i])
        }
      },
      searchNode: function(e) {
        if (e.target.value != '') {
          var zTree = $.fn.zTree.getZTreeObj('tree')
          zTree.expandAll(true)
          var key = $('#key')
          var value = $.trim(key.get(0).value)
          var keyType = 'codeName'

          if (key.hasClass('empty')) {
            value = ''
          }
          if (lastValue === value) return
          lastValue = value
          if (value === '') {
            zTree.expandAll(false)
            return
          }
          treeCallback.updateNodes(false)

          nodeList = zTree.getNodesByParamFuzzy(keyType, value)

          treeCallback.updateNodes(true)

          var NodesArr = treeCallback.allNodesArr()
          if (nodeList.length > 0) {
            var index = NodesArr.indexOf(nodeList[0].id.toString())
            $('#tree').scrollTop(20.2 * index)
          }
        } else {
          $('#tree li a').css({
            color: '#333',
            'font-weight': 'normal'
          })
        }
      }
    }
  })()

  var page = (function() {
    return {
      // 初始化树
      initTree: function() {
        page.departMentTree = page.departmentTree(
          {
            url: interfaceURL.getPrsOrgTree,
            checkbox: true
          },
          $('#tree')
        )
        var treeObj = $.fn.zTree.getZTreeObj("tree");
        var nodes = treeObj.getNodesByParam("id", "0", null);
        if (nodes.length>0) {
          treeObj.expandNode(nodes[0], true, false, true);
        }
      },
      departmentTree: function(setting, $tree) {
        setting.idKey = setting.idKey || 'id'
        setting.pIdKey = setting.pIdKey || 'pId'
        setting.nameKey = setting.nameKey || 'codeName'
        setting.rootName = setting.rootName || ''
        setting.async = setting.async || true

        if (!$tree.hasClass('ufmaTree')) {
          $tree.addClass('ufmaTree')
        }
        if (!$tree.hasClass('ztree')) {
          $tree.addClass('ztree')
        }
        var treeSetting = {
          async: {
            enable: setting.async,
            type: 'get',
            dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
            contentType: 'application/json; charset=utf-8',
            url: setting.url || null,
            dataFilter: function(treeId, parentNode, responseData) {
              var data = responseData
              if (responseData.hasOwnProperty('data')) {
                data = responseData.data
              }
              if (!$.isNull(setting.rootName)) {
                var rootNode = {}
                rootNode[setting.idKey] = '0'
                rootNode[setting.nameKey] = setting.rootName
                rootNode['open'] = true
                data.unshift(rootNode)
              }
              if ($.isNull(data)) return false
              for (var i = 0; i < data.length; i++) {
                data[i]['open'] = true
              }
              return data
            }
          },
          view: {
            showLine: false,
            showIcon: false,
            fontCss: treeCallback.getFontCss,
            addHoverDom: treeCallback.addHoverDom,
            removeHoverDom: treeCallback.removeHoverDom
          },
          check: {
            /*chkboxType: {
							"Y": "s",
							"N": "s"
						},*/
            enable: (function() {
              if (setting.checkbox) return setting.checkbox
              else return false
            })()
          },
          data: {
            simpleData: {
              enable: true,
              idKey: setting.idKey,
              pIdKey: setting.pIdKey,
              rootPId: 0
            },

            key: {
              name: setting.nameKey
            },

            keep: {
              leaf: true
            }
          },
          callback: {
            beforeClick: treeCallback.beforeClick,
            onCheck: page.setTableData
          }
        }

        function filter(node) {
          return !node.isParent && node.isFirstNode
        }

        $(document).ready(function() {
          var key = $('#key')
          key
            .bind('focus', treeCallback.focusKey)
            .bind('blur', treeCallback.blurKey)
            .bind('propertychange', treeCallback.searchNode)
            .bind('input', treeCallback.searchNode)
        })

        if (setting.hasOwnProperty('url') && !$.isNull(setting.url)) {
          ufma.ajaxDef(setting.url, 'get', '', function(result) {
            setting.data = result.data || []
            setting.data.push({
              codeName: '全部',
              id: '0',
              pId: null
            })
          })
        }
        var $tree = $.fn.zTree.init($tree, treeSetting, setting.data || [])
        return $tree
      },
      // 获取部门树勾选中的节点code
      getCheckedCodes: function() {
        var checkNodes = page.departMentTree.getCheckedNodes(true)
        var selectNodes = []
        for (var i = 0; i < checkNodes.length; i++) {
          var node = checkNodes[i]
          if (!node.isParent && node.pId !== 0) {
            selectNodes.push(node.code)
          }
        }
        return selectNodes
      },
      // 部门删除
      deleteDepartMent: function() {
        var selectNodes = page.getCheckedCodes()
        if (selectNodes.length == 0) {
          ufma.showTip('请选择要删除的部门!', function() {}, 'warning')
          return false
        }
        var callback = function(result) {
          ufma.showTip(result.msg, function() {}, result.flag)
          page.initTree()
          page.setTableData()
        }
        var argu = {
          orgCodes: selectNodes
        }
        ufma.post(interfaceURL.delete, argu, callback)
      },
      // 部门启用
      startDepartMent: function() {
        var checkNodes = page.departMentTree.getCheckedNodes(true)
        var selectNodes = []
        for (var i = 0; i < checkNodes.length; i++) {
          var node = checkNodes[i]
          if (node.pId !== 0) {
            selectNodes.push(node.code)
          }
        }
        if (selectNodes.length == 0) {
          ufma.showTip('请选择启用部门!', function() {}, 'warning')
          return false
        }
        var callback = function(result) {
          ufma.showTip(result.msg, function() {}, result.flag)
          page.initTree()
          page.setTableData()
        }
        var argu = {
          action: 'active',
          orgCode: selectNodes,
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear
        }
        ufma.post(interfaceURL.able, argu, callback)
      },
      // 部门停用
      stopDepartMent: function() {
        var checkNodes = page.departMentTree.getCheckedNodes(true)
        var selectNodes = []
        for (var i = 0; i < checkNodes.length; i++) {
          var node = checkNodes[i]
          if (node.pId !== 0) {
            selectNodes.push(node.code)
          }
        }
        if (selectNodes.length == 0) {
          ufma.showTip('请选择启用部门!', function() {}, 'warning')
          return false
        }
        var callback = function(result) {
          ufma.showTip(result.msg, function() {}, result.flag)
          page.initTree()
          page.setTableData()
        }
        var argu = {
          action: 'unactive',
          orgCode: selectNodes,
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear
        }
        ufma.post(interfaceURL.able, argu, callback)
      },
      // 打开编辑部门模态框
      openDepEdit: function(title, data) {
        var treeObj = $.fn.zTree.getZTreeObj('tree')
        var nodes = treeObj.transformToArray(treeObj.getNodes());
        var codeArray = []
        for (var i = 0; i < nodes.length; i++) {
          codeArray.push(nodes[i].id)
        }
        var openData = {
          depData: data,
          isUpdate: data ? true : false,
          codeArray: codeArray
        }
        ufma.open({
          url: 'departmentEdit.html',
          title: title,
          width: 720,
          height: 460,
          data: openData,
          ondestory: function(data) {
            //窗口关闭时回传的值
            if (data.action) {
              ufma.showTip(data.msg, function() {}, 'success')
            }
            page.initTree()
            page.setTableData()
          }
        })
      },
      createClassNameHtml: function(htmlArray) {
        var classNameHtml = ''
        var htmls = []
        // 每两个form-group添加一个clearfix
        var htmls = []
        for (var i = 0, len = htmlArray.length; i < len; i += 2) {
          htmls.push(htmlArray.slice(i, i + 2))
        }
        for (var i = 0; i < htmls.length; i++) {
          var item = htmls[i]
          item.push('<div class="clearfix"></div>')
        }

        htmls = [].concat.apply([], htmls)

        var html = htmls.join('')
        classNameHtml +=
          '<div class="form-row">' + html + '<div class="clearfix"></div></div>'

        return classNameHtml
      },
      // 初始化查询条件
      initQuery: function(propertyInList, propertyListData, prsLevelList) {
        page.checkBox = [] // 复选框类型
        page.combox = [] // 下拉选项类型
        page.numInput = [] // 数字类型
        page.charNum = [] // 字符数字类
        page.dateInput = [] // 日期类型
        var htmlArray = []
        var frmQueryHtml = ''
        var queryMoreHtml = ''
        for (var i = 0; i < propertyInList.length; i++) {
          // 是否是查询条件
          if (propertyInList[i].IS_CONDITION === 'y') {
            for (var j = 0; j < propertyListData.length; j++) {
              var item = propertyListData[j]
              if (item.data.length !== 0 && item.ordIndex !== '*') {
                for (var m = 0; m < item.data.length; m++) {
                  var id = item.data[m].propertyCode
                  var name = item.data[m].propertyName
                  if (id === propertyInList[i].PROPERTY_CODE) {
                    if (
                      item.data[m].dataType === 'E' ||
                      item.data[m].dataType === 'R' ||
                      item.data[m].dataType === 'X'
                    ) {
                      // 开关样式
                      if (
                        item.data[m].asValList &&
                        item.data[m].asValList.length === 2
                      ) {
                        htmlArray.push(
                          createHtml.createCheckBox(
                            id,
                            name,
                            item.data[m].asValList
                          )
                        )
                        page.checkBox.push({
                          id: id,
                          name: name
                        })
                      } else {
                        htmlArray.push(createHtml.createCombox(id, name))
                        page.combox.push({
                          id: id,
                          name: name,
                          asValList: item.data[m].asValList
                            ? item.data[m].asValList
                            : [],
                          posiLevelList: item.data[m].posiLevelList
                            ? item.data[m].posiLevelList
                            : []
                        })
                      }
                    } else if (item.data[m].dataType === 'N') {
                      htmlArray.push(createHtml.createNumInput(id, name))
                      page.numInput.push(id)
                      page.charNum.push({
                        id: id,
                        name: name
                      })
                    } else if (item.data[m].dataType === 'D') {
                      htmlArray.push(createHtml.createDate(id, name))
                      page.dateInput.push(id)
                    } else {
                      htmlArray.push(createHtml.createInput(id, name))
                      page.charNum.push({
                        id: id,
                        name: name
                      })
                    }
                  }
                }
              }
            }
          }
        }
        frmQueryHtml += page.createClassNameHtml(htmlArray.slice(0, 2))
        queryMoreHtml += page.createClassNameHtml(htmlArray.slice(2))
        $('#frmQuery').html(frmQueryHtml)
        $('#frmQuery .form-row').children().eq(0).removeClass('margin-top-10')
        $('#frmQuery .form-row').children().eq(1).removeClass('margin-top-10')
        $('#queryMore').html(queryMoreHtml)
        for (var i = 0; i < page.checkBox.length; i++) {
          ;(function(i) {
            var id = page.checkBox[i].id
            // 复选框必须选中一个
            var query = "input[name='" + id + "']"
            $(query).on('click', function() {
              var checked = $(query + ':checked')
              if (checked.length === 0) {
                $(this).prop('checked', true)
              }
            })
          })(i)
        }
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
                onChange: function(e, data) {},
                onComplete: function(sender, data) {}
              })
            } else {
              if(id === 'typeCode') {
                $('#typeCode').ufTextboxlist({
                  autocomplete:'off',
                  idField: 'typeCode',
                  textField: 'val',
                  pIdField: 'pCode', //可选
                  placeholder: '请选择人员身份',
                  data: asValList,
                  // leafRequire: true,
                  readonly: false
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
                  onChange: function (sender, data) {
                  },
                  onComplete: function (sender, data) {
                  }
                })
              }
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
          $('#' + id + 'Start').ufDatepicker({
            format: 'yyyy-mm-dd',
            initialDate: ''
          })
          $('#' + id + 'Start')
            .getObj()
            .setValue('')
          $('#' + id + 'End').ufDatepicker({
            format: 'yyyy-mm-dd',
            initialDate: ''
          })
          $('#' + id + 'End')
            .getObj()
            .setValue('')
        }
      },
      // 初始化表格列
      initColumns: function() {
        ufma.get(interfaceURL.getPropertyInList, '', function(result) {
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            var propertyInList = result.data;
            page.columns = page.setColumns(propertyInList)
            var checkNodes = page.departMentTree.getCheckedNodes(true)
						var selectNodes = []
						for (var i = 0; i < checkNodes.length; i++) {
							var node = checkNodes[i]
							if (node.pId !== 0) {
								selectNodes.push(node.code)
							}
						}
						var argu = {
							orgCodeList: selectNodes,
              agencyCode: svData.svAgencyCode,
              rgCode: svData.svRgCode,
              setYear: svData.svSetYear
            }
            ufma.showloading('正在加载数据请耐心等待...')
            ufma.post(interfaceURL.getMaEmpByOrgCodes, argu, function(result) {
              ufma.hideloading()
              if (result.flag == 'fail') {
                ufma.showTip(result.msg, function() {}, 'warning')
              } else if (result.flag == 'success') {
                var tableData = result.data.page.list
                ufma.get(interfaceURL.selectMaEmpAndPrsCalcData, '', function(
                  result
                ) {
                  if (result.flag == 'fail') {
                    ufma.showTip(result.msg, function() {}, 'warning')
                  } else if (result.flag == 'success') {
                	  var propertyListData = result.data
                      var prsLevelList = [];
                    var argu = {
                      agencyCode: svData.svAgencyCode,
                      setYear: svData.setYear,
                      rgCode: svData.rgCode,
                    };
                    ufma.get(interfaceURL.getEmpTYpe, argu, function (result) {
                      typeCodeList = [];
                      result.data.forEach(i=> {
                        typeCodeList.push({
                          valId: i.chrCode,
                          val: i.chrName,
                          typeCode: i.chrCode,
                          pCode: i.parentCode,
                          ...i
                        })
                      })
                      // typeCodeList = result.data;

                      propertyInList.unshift({
                        PROPERTY_CODE: "typeCode",
                        IS_CONDITION: "y",
                        PROPERTY_NAME: "人员身份"
                      })
                      propertyListData[0].data.unshift({
                        dataType: "E",
                        isEmpty: "N",
                        isEdit : "Y",
                        ordIndex: "0",
                        propertyCode: "typeCode",
                        propertyName: "人员身份",
                        asValList: typeCodeList
                      })
                      page.initQuery(
                          propertyInList,
                          propertyListData,
                          prsLevelList
                      )
                      var data = page.transformTableData(
                          tableData,
                          propertyListData,
                          result.data
                      )
                      // 所有表格数据
                      page.allTableData = data
                      page.initTable(data, page.columns)
                    });
                  }
                })
              }
            })
          }
        })
      },
      // 表格列定义
      setColumns: function(data) {
        var columns = [
          {
            title:
              '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
              'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
            className: 'nowrap check-style no-print',
            render: function(data, type, rowdata, meta) {
              return (
                '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                '<input type="checkbox" class="checkboxes" data-id="' +
                rowdata.rmwyid +
                '" />' +
                '&nbsp;<span></span></label>'
              )
            }
          },
          {
            title: '部门名称',
            data: 'orgName',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '人员身份',
            data: 'typeCode',
            className: 'isprint nowrap',
            render: function (data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          }
        ]
        for (var i = 0; i < data.length; i++) {
          var propertyName = data[i].PROPERTY_NAME
          var propertyCode = data[i].PROPERTY_CODE
          if (propertyCode === 'empName') {
            columns.push({
              title: propertyName,
              data: propertyCode,
              className: 'isprint nowrap ellipsis',
              render: function(data, type, rowdata, meta) {
                if (!data) {
                  return ''
                }
                var newRowData = JSON.stringify(rowdata);
                var isStop = rowdata.isStop;
                if (isStop == '停发' ||　isStop == '是') {
                	isStop = 'Y' ;
                }　else {
                	isStop = 'N' ;
                }
                return (
                  '<a class="btn-edit common-jump-link" data-id="' +
                  rowdata.rmwyid +
                  '"' +
                  'data-code="' + rowdata.empCode + '"' +
                  'data-stop="' + isStop + '"' +
                  ' data-rowdata=\'' +
                  newRowData +
                  "'" +
                  '" data-toggle="tooltip" action= "" title="编辑">' +
                  data +'</a>'
                )
              }
            })
          } else {
            columns.push({
              title: propertyName,
              data: propertyCode,
              className: 'isprint nowrap ellipsis',
              render: function(data, type, rowdata, meta) {
                if (!data) {
                  return ''
                }
                return data
              }
            })
          }
        }
        return columns
      },
      // 初始化表格
      initTable: function(data, columns) {
        var id = 'dep-staff-info-table'
        var toolBar = $('#' + id).attr('tool-bar')
        page.DataTable = $('#' + id).DataTable({
          language: {
            url: bootPath + 'agla-trd/datatables/datatable.default.js'
          },
          data: data,
          fixedHeader: true,
          scrollY: page.getScrollY(),
					scrollX: true,
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
          bAutoWidth: true, //表格自定义宽度，和swidth一起用
          bProcessing: true,
          bDestroy: true,
          columns: columns,
          // "columnDefs": columnDefsArr,
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
                ufma.expXLSForDatatable($('#' + id), $(".modTitle").text())
              })
            //导出end

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
            $('#tool-bar').width($('.prs-workspace').width() - 230)
            $('#tool-bar .slider').width($('.prs-workspace').width() - 250)
            $('#tool-bar').css('margin-left', '250px')
            $('#tool-bar').css('padding-right', '9px')

            // $('#dep-staff-info-table_wrapper').ufScrollBar({
            //   hScrollbar: true,
            //   mousewheel: false
            // })
            ufma.setBarPos($(window))
            //驻底end
          },
          drawCallback: function(settings) {
            //权限控制
            ufma.isShow(page.reslist)
            // s
            ufma.setBarPos($(window))
            //驻底end
          }
        })
      },
      // 计算表格的高度
			getScrollY: function() {
				var $bar = $('.ufma-tool-bar');
				var winH = $(window).height();
				var barH = $bar.outerHeight(true);
				return winH - barH - 56 - 78 - 30 - 40 - 30 + 'px'
			},
      // 转换表格数据
      transformTableData: function(
        tableData,
        propertyListData,
        getPrsLevelList
      ) {
        var obj = {}
        for (var i = 0; i < propertyListData.length; i++) {
          var item = propertyListData[i]
          if (item.data.length !== 0 && item.ordIndex !== '*') {
            for (var j = 0; j < item.data.length; j++) {
              if (
                item.data[j].dataType === 'E' ||
                item.data[j].dataType === 'R' ||
                item.data[j].dataType === 'X'
              ) {
                if (item.data[j].asValList) {
                  obj[item.data[j].propertyCode] = item.data[j].asValList
                } else if (item.data[j].posiLevelList) {
                  //obj[item.data[j].propertyCode] = item.data[j].posiLevelList
                } else {
                  obj[item.data[j].propertyCode] = []
                }
              }
            }
          }
        }
        //obj.posiCode = getPrsLevelList

        for (var i = 0; i < tableData.length; i++) {
          var item = tableData[i]
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              var element = obj[key]
              var code = item[key]
              for (var j = 0; j < element.length; j++) {
                if (code == element[j].valId) {
                  item[key] = element[j].val
                }
              }
            }
          }
          // 部门名称单独处理
          var treeObj = $.fn.zTree.getZTreeObj('tree')
          var nodes = treeObj.transformToArray(treeObj.getNodes())
          for (var index = 0; index < nodes.length; index++) {
            if (item.orgCode === nodes[index].code) {
              item.orgName = nodes[index].name
            }
          }
        }
        return tableData
      },
      cancelCheckAll: function() {
				$("#checkAll,.datatable-group-checkable").prop("checked", false);
			},
      // 设置表格数据
      setTableData: function() {
        var checkNodes = page.departMentTree.getCheckedNodes(true)
        var selectNodes = []
        for (var i = 0; i < checkNodes.length; i++) {
          var node = checkNodes[i]
          if (node.pId !== 0) {
            selectNodes.push(node.code)
          }
        }
        var queryData = $('#frmQuery').serializeObject()
        var typeCodeData = [];
				var strs = new Array(); //定义一数组
				strs = queryData.typeCode.split(","); //字符分割
				for (i = 0; i < strs.length; i++) {
					if(strs[i]!=''){
						typeCodeData.push(strs[i]);
					}
				}
        var moreQueryData = $('#queryMore').serializeObject()
        var startDate = '',endDate= ''
        if($('.startDate').length > 0){
					startDate = $('.startDate').getObj().getValue();
				}
				if($('.endDate').length > 0){
					endDate = $('.endDate').getObj().getValue();
				}
        var argu = {
          orgCodeList: selectNodes,
          agencyCode: svData.svAgencyCode,
          rgCode: svData.svRgCode,
          setYear: svData.svSetYear
        }
        // 复选框数据
        // 都勾选传空字符串
        for (var i = 0; i < page.checkBox.length; i++) {
          var id = page.checkBox[i].id
          var query = "#frmQuery input[name='" + id + "']"
          var length = 0
          $(query + ':checked').each(function(value) {
            queryData[id] = this.value
            length += 1
          })
          if (queryData[id]) {
            queryData[id] = length !== 2 ? queryData[id] : ''
          }
        }
        for (var i = 0; i < page.checkBox.length; i++) {
          var id = page.checkBox[i].id;
          var query = "#queryMore input[name='" + id + "']"
          var length = 0
          $(query + ':checked').each(function(value) {
            moreQueryData[id] = this.value
            length += 1
          })
          if (moreQueryData[id]) {
            moreQueryData[id] =
              moreQueryData[id] && length !== 2 ? moreQueryData[id] : ''
          }
        }
        if(startDate){
					moreQueryData.birthdayStart = startDate;
				}
				if(endDate){
					moreQueryData.birthdayEnd = endDate;
				}
        var birthdayStart = moreQueryData.birthdayStart;
        var birthdayEnd = moreQueryData.birthdayEnd;
        if ($.isNull(birthdayStart) && !$.isNull(birthdayEnd)) {
        	ufma.showTip('日期区间不正确！', function() {}, 'warning');
        	return;
        }
        if ($.isNull(birthdayEnd) && !$.isNull(birthdayStart)) {
        	ufma.showTip('日期区间不正确！', function() {}, 'warning');
        	return;
        }
        argu = $.extend({}, argu, queryData, moreQueryData)
        argu.typeCode = typeCodeData
        ufma.showloading('正在加载数据请耐心等待...')
        ufma.post(interfaceURL.getMaEmpByOrgCodes, argu, function(result) {
          ufma.hideloading()
          if (result.flag == 'fail') {
            ufma.showTip(result.msg, function() {}, 'warning')
          } else if (result.flag == 'success') {
            var tableData = result.data.page.list
            ufma.get(interfaceURL.selectMaEmpAndPrsCalcData, '', function(
              result
            ) {
              if (result.flag == 'fail') {
                ufma.showTip(result.msg, function() {}, 'warning')
              } else if (result.flag == 'success') {
                var propertyListData = result.data
                propertyListData[0].data.unshift({
                  dataType: "E",
                  isEmpty: "N",
                  isEdit : "Y",
                  ordIndex: "0",
                  propertyCode: "typeCode",
                  propertyName: "人员身份",
                  asValList: typeCodeList
                })
                ufma.post(interfaceURL.getPrsLevelList, {}, function(result) {
                  var data = page.transformTableData(
                    tableData,
                    propertyListData,
                    result.data
                  )
                  page.DataTable.clear().draw()
                  if (data.length > 0) {
                    page.DataTable.rows.add(data)
                    page.DataTable.columns.adjust().draw()
                  }
                  $('#dep-staff-info-table')
                    .closest('.dataTables_wrapper')
                    .ufScrollBar({
                      hScrollbar: true,
                      mousewheel: false
                    })
                  ufma.setBarPos($(window))
                  page.cancelCheckAll()
                })
              }
            })
          }
        })
      },
      // 删除传参
      delArgu: function(ele) {
        var argu = {
          rmwyidList: []
        }
        if (ele[0].id == 'tool-bar-del') {
          var checks = $('input.checkboxes:checked')
          checks.each(function() {
            var id = $(this).attr('data-id')
            argu.rmwyidList.push(id)
          })
        } else {
          argu.rmwyidList.push(ele.attr('data-id'))
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
              argu.agencyCode = svData.svAgencyCode
              argu.rgCode = svData.svRgCode
              argu.setYear = svData.svSetYear

              ufma.showloading('正在加载数据请耐心等待...')
              ufma.post(interfaceURL.delMaEmp, argu, function(result) {
                ufma.hideloading()
                page.setTableData()
                ufma.showTip(result.msg, function() {}, result.flag)
              })
            } else {
              //点击取消的回调函数
            }
          },
          { type: 'warning' }
        )
      },
      // 打开弹窗
      openWin: function(ele) {
        var title, openData
        var treeObj = $.fn.zTree.getZTreeObj('tree')
        var nodes = treeObj.transformToArray(treeObj.getNodes())
        var tableData = page.allTableData
        var allEmpCodes = []
        var rmwyidList = []
        var maxOrdIndex = tableData.length !== 0 && tableData[tableData.length - 1].ordIndex
          ? tableData[tableData.length - 1].ordIndex
          : 0
        for (var i = 0; i < tableData.length; i++) {
          allEmpCodes.push(tableData[i].empCode)
        }
	    var checks = $('input.checkboxes:checked');
	    checks.each(function() {
	       var id = $(this).attr('data-id')
	       rmwyidList.push(id)
	    })

        if (ele[0].id == 'btn-add-dep-staff-info') {
        	if (checks.length == 0) {
                ufma.showTip('请选择数据', function() {}, 'warning')
                return false;
            }
        	title = '批量设置'
        	var id = ele.attr('data-id')
        	var empCode = ele.attr('data-code')
        	openData = {
            id: id,
            empCode: empCode,
            orgCodeList: nodes,
            maxOrdIndex: maxOrdIndex,
            allEmpCodes: allEmpCodes,
            rmwyidList:rmwyidList
          }
        	ufma.open({
                url: 'departBudgetAgy.html',
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

        } else {
          title = '添加工资类别'
          var id = ele.attr('data-id')
          var empCode = ele.attr('data-code')
          openData = {
            id: id,
            empCode: empCode,
            orgCodeList: nodes,
            maxOrdIndex: maxOrdIndex,
            allEmpCodes: allEmpCodes,
            isStop : ele.attr('data-stop')
          }
          ufma.open({
              url: 'addStaff.html',
              title: title,
              width: 1200,
              height: 600,
              data: openData,
              ondestory: function(data) {
                //窗口关闭时回传的值
                if (data.action) {
                  ufma.showTip(data.msg, function() {}, 'success')
                }
                page.setTableData()
              }
            })
        }
      },
      //获取人员身份
      getEmpTYpe: function () {
        var argu = {
          agencyCode: svData.svAgencyCode,
          setYear: svData.setYear,
          rgCode: svData.rgCode,
        };
        ufma.get(interfaceURL.getEmpTYpe, argu, function (result) {
          typeCodeList = [];
          result.data.forEach(i=> {
            typeCodeList.push({
              valId: i.chrCode,
              val: i.chrName,
              pCode: i.parentCode,
              ...i
            })
          })
        });
      },
      // 初始化页面
      initPage: function() {
        //权限控制
        page.reslist = ufma.getPermission()
        ufma.isShow(page.reslist)
        page.initTree()
        //初始化表格
        page.initColumns([])
        $('.deparmentTree').height($(window).height() - 194)
      },

      onEventListener: function() {
    	//表格单行选中
          $(document).on("click", "tbody tr", function (e) {
              stopPropagation(e);
              if($("td.dataTables_empty").length > 0){
                  return false;
              }
              var inputDom = $(this).find('input.checkboxes');
              var inputCheck = $(inputDom).prop("checked");
              $(inputDom).prop("checked", !inputCheck);
              $(this).toggleClass("selected");
              var $tmp = $(".checkboxes:checkbox");
              $(".datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);

              return false;
          });
        /**  部门树事件   ***/
        // 新增部门按钮点击事件
        $('.btn-add-department').on('click', function() {
          page.openDepEdit('新增部门')
        })
        // 删除部门
        $('.department-delete').on('click', function(e) {
          ufma.confirm(
            '你确定要删除选中数据吗？',
            function(action) {
              if (action) {
                page.deleteDepartMent()
              }
            },
            {
              type: 'warning'
            }
          )
        })
        // 启用部门
        $('.department-start').on('click', function(e) {
          ufma.confirm(
            '你确定要启用选中数据吗？',
            function(action) {
              if (action) {
                page.startDepartMent()
              }
            },
            {
              type: 'warning'
            }
          )
        })
        // 停用部门
        $('.department-stop').on('click', function(e) {
          ufma.confirm(
            '你确定要停用选中数据吗？',
            function(action) {
              if (action) {
                page.stopDepartMent()
              }
            },
            {
              type: 'warning'
            }
          )
        })
        /**********************************/
        // 查询
        $('#btnQuery').on('click', function() {
          page.setTableData()
        })
        // 新增
        $(document).on('click', '#btn-add-dep-staff-info', function() {
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
        //导入
        $('#btn-import').on('click', function() {
          var openData = {}
          ufma.open({
            url: 'excelImport.html',
            title: '选择人员信息导入格式',
            width: 1090,
            //height:500,
            data: openData,
            ondestory: function(data) {
              //窗口关闭时回传的值
              // if (data.action) {
              page.setTableData()
              // }
            }
          })
        })
      },
      //此方法必须保留
      init: function() {
        ufma.parse()
        page.initPage()
        page.onEventListener()
        ufma.parseScroll()
        page.getEmpTYpe();
      }
    }
  })()

  /////////////////////
  page.init()
  function stopPropagation(e) {
	if (e.stopPropagation)
	    e.stopPropagation();
	else
	    e.cancelBubble = true;
	}
})
