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

  var page = (function() {
    var baseUrl = ''

    return {
      //选择列
      renderSeletableColumns: function(datas) {
        var datas = [
          { code: 'length', name: '优先级' },
          { code: 'wageCode', name: '工资项目名称' },
          { code: 'dataSourceCode', name: '数据来源' },
          { code: 'formula', name: '公式定义' },
          { code: 'enableCode', name: '是否启用' },
          { code: 'clearCode', name: '下月清零' },
          { code: 'shunxuhao', name: '顺序号' },
          { code: 'personTax', name: '个人所得税项' },
          { code: 'personTaxBasic', name: '个人所得税计算基数项目' },
          { code: 'personAnnualBonus', name: '年终奖个人所得税项目' }
        ]
        var arr = [
          'length',
          'wageCode',
          'dataSourceCode',
          'formula',
          'enableCode',
          'clearCode',
          'clearCode',
          'shunxuhao'
        ]
        var pHtml = ''
        for (var i = 0; i < datas.length; i++) {
          if (arr.indexOf(datas[i].code) >= 0) {
            pHtml +=
              '<p><label class="mt-checkbox mt-checkbox-outline" title="' +
              datas[i].name +
              '"><input type="checkbox" checked="checked" data-code="' +
              datas[i].code +
              '" data-index="1">' +
              datas[i].name +
              '<span></span></label></p>'
          } else {
            pHtml +=
              '<p><label class="mt-checkbox mt-checkbox-outline" title="' +
              datas[i].name +
              '"><input type="checkbox" checked="" data-code="' +
              datas[i].code +
              '" data-index="1">' +
              datas[i].name +
              '<span></span></label></p>'
          }
        }
        $('#colList').append(pHtml)
      },
      getAllChildrenNodes: function(treeNode, result) {
        if (treeNode.isParent) {
          var childrenNodes = treeNode.children
          if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
              result += ',' + childrenNodes[i].id
              result = page.getAllChildrenNodes(childrenNodes[i], result)
            }
          }
        }
        return result
      },
      departmentTree: function(setting, $tree) {
        setting.idKey = setting.idKey || 'id'
        setting.pIdKey = setting.pIdKey || 'pId'
        setting.nameKey = setting.nameKey || 'name'
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
            //url: setting.url || null,
            url: 'test.json',
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
            fontCss: getFontCss,
            addHoverDom: addHoverDom,
            removeHoverDom: removeHoverDom
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
            /*onAsyncError: function(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
							ufma.alert(XMLHttpRequest);
						},*/
            /*onClick: setting.onClick || null,
						onDblClick: setting.onDblClick || null,
						onCheck: setting.onCheck || null,*/
            beforeClick: beforeClick
          }
        }
        function addHoverDom(treeId, treeNode) {
          var sObj = $('#' + treeNode.tId + '_span')
          if (treeNode.editNameFlag || $('#editBtn_' + treeNode.tId).length > 0)
            return
          var addStr =
            "<span class='button department-edit btn-permission' id='editBtn_" +
            treeNode.tId +
            "' title='编辑部门信息' onfocus='this.blur();'></span>"
          if (page.isEdit == true) {
            addStr =
              "<span class='button department-edit' id='editBtn_" +
              treeNode.tId +
              "' title='编辑部门信息' onfocus='this.blur();'></span>"
          }

          sObj.after(addStr)
          var btn = $('#editBtn_' + treeNode.tId)
          if (btn)
            btn.bind('click', function(e) {
              e.stopPropagation()
              page.openDepEdit('编辑部门', {
                chrCode: '',
                chrId: '',
                chrName: '',
                deptManager: '',
                deptPhone: '',
                enabled: '',
                lastVer: ''
              })
              // page.clearError();
              // page.editor = ufma.showModal('department-edt', 720, 400);
              // $('#deprtment-chrCode').val(treeNode.code);
              // $('#departmentId').val(treeNode.chrId);
              // $('#dpLastVer').val(treeNode.lastVer);
              // $('#deptManager').val(treeNode.deptManager);
              // $('#deptPhone').val(treeNode.deptPhone);
              // $('#deprtment-chrCode').attr('disabled', 'disabled');
              // var tempName = treeNode.name;
              // var depName = tempName.split(']')[1].split('[')[0];
              // var itemEnabled = tempName.split(']')[1].split('[')[1];
              // $("#itemEnabled").find("label").removeClass("active");
              // $("#itemEnabled").find("label").find("label").prop("checked", false);
              // if (itemEnabled == "停用") {
              // 	$("#itemEnabled").find("label").eq(1).addClass("active");
              // 	$("#itemEnabled").find("label").eq(1).find("input").prop("checked", true);
              // } else {
              // 	$("#itemEnabled").find("label").eq(0).addClass("active");
              // 	$("#itemEnabled").find("label").eq(0).find("input").prop("checked", true);
              // }
              // $('#chrName').val(depName);
              // page.departmentData = $('#form-department').serializeObject();
            })
        }

        function removeHoverDom(treeId, treeNode) {
          $('#editBtn_' + treeNode.tId)
            .unbind()
            .remove()
        }

        function beforeClick(treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj('tree')
          zTree.checkNode(treeNode, !treeNode.checked, null, true)
          // page.newTable();
          //return false;
        }

        function focusKey(e) {
          if (key.hasClass('empty')) {
            key.removeClass('empty')
          }
        }

        function blurKey(e) {
          if (key.get(0).value === '') {
            key.addClass('empty')
          }
        }
        var lastValue = '',
          nodeList = [],
          fontCss = {}

        function clickRadio(e) {
          lastValue = ''
          searchNode(e)
        }

        function allNodesArr() {
          var zTree = $.fn.zTree.getZTreeObj('tree')
          var nodes = zTree.getNodes()
          var allNodesArr = []
          var allNodesStr
          for (var i = 0; i < nodes.length; i++) {
            var result = ''
            var result = page.getAllChildrenNodes(nodes[i], result)
            var NodesStr = result
            NodesStr = NodesStr.split(',')
            NodesStr.splice(0, 1, nodes[i].id)
            NodesStr = NodesStr.join(',')
            allNodesStr += ',' + NodesStr
          }
          allNodesArr = allNodesStr.split(',')
          allNodesArr.shift()
          return allNodesArr
        }

        function searchNode(e) {
          if (e.target.value != '') {
            var zTree = $.fn.zTree.getZTreeObj('tree')
            zTree.expandAll(true)
            var value = $.trim(key.get(0).value)
            var keyType = 'name'

            if (key.hasClass('empty')) {
              value = ''
            }
            if (lastValue === value) return
            lastValue = value
            if (value === '') {
              zTree.expandAll(false)
              return
            }
            updateNodes(false)

            nodeList = zTree.getNodesByParamFuzzy(keyType, value)

            updateNodes(true)

            var NodesArr = allNodesArr()
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

        function updateNodes(highlight) {
          var zTree = $.fn.zTree.getZTreeObj('tree')
          for (var i = 0, l = nodeList.length; i < l; i++) {
            nodeList[i].highlight = highlight
            zTree.updateNode(nodeList[i])
          }
        }

        function getFontCss(treeId, treeNode) {
          return !!treeNode.highlight
            ? {
                color: '#F04134',
                'font-weight': 'bold'
              }
            : {
                color: '#333',
                'font-weight': 'normal'
              }
        }

        function filter(node) {
          return !node.isParent && node.isFirstNode
        }

        var key
        $(document).ready(function() {
          key = $('#key')
          key
            .bind('focus', focusKey)
            .bind('blur', blurKey)
            .bind('propertychange', searchNode)
            .bind('input', searchNode)
        })

        var $tree

        var $tree
        if (setting.hasOwnProperty('url') && !$.isNull(setting.url)) {
          ufma.ajaxDef(setting.url, 'get', '', function(result) {
            setting.data = result.data || []
          })
        }
        $tree = $.fn.zTree.init($tree, treeSetting, setting.data || [])

        return $tree
      },
      // 初始化树
      initTree: function() {
        page.departMentTree = page.departmentTree(
          {
            // url: page.treeUrl,
            checkbox: true
          },
          $('#tree')
        )
      },
      // 部门删除
      deleteDepartMent: function() {
        var url = ''
        var type = 'POST'
        var checkNodes = page.departMentTree.getCheckedNodes(true)
        var selectNodes = []
        for (var i = 0; i < checkNodes.length; i++) {
          var node = checkNodes[i]
          if (!node.isParent) {
            selectNodes.push(node.code)
          }
        }

        if (selectNodes.length == 0) {
          ufma.showTip('请选择要删除的部门!', function() {}, 'warning')
          return false
        }
        var departArray = page.orgTreeParamAll(selectNodes)
        var callback = function(result) {
          //ufma.showTip('删除成功!');
          // ufma.alert(result.msg);
          ufma.showTip(result.msg, function() {}, result.flag)
          page.initTree()
        }
        var argu = {
          chrCodes: selectNodes,
          tableName: 'MA_ELE_DEPARTMENT',
          agencyCode: page.agencyCode
        }
        ufma.post(url, argu, callback)
      },
      // 部门启用
      startDepartMent: function() {
        url = page.baseUrl + 'department/able'
        type = 'POST'
        var selectNodes = page.departMentTree.getCheckedNodes(true)
        if (selectNodes.length == 0) {
          ufma.showTip('请选择启用部门!', function() {}, 'warning')
          return false
        }
        var departArray = page.orgTreeParam(selectNodes)
        var callback = function(result) {
          ufma.showTip(result.msg, function() {}, result.flag)
          page.initTree()
        }
        var argu = {
          action: 'active',
          chrCodes: departArray,
          tableName: 'MA_ELE_DEPARTMENT',
          agencyCode: page.agencyCode
        }

        ufma.put(url, argu, callback)
      },
      // 部门停用
      stopDepartMent: function() {
        url = page.baseUrl + 'department/able'
        type = 'POST'
        var selectNodes = page.departMentTree.getCheckedNodes(true)
        if (selectNodes.length == 0) {
          ufma.showTip('请选择停用部门!', function() {}, 'warning')
          return false
        }
        var departArray = page.orgTreeParam(selectNodes)
        var callback = function(result) {
          ufma.showTip(result.msg, function() {}, result.flag)
          page.initTree()
        }
        var argu = {
          action: 'unactive',
          chrCodes: departArray,
          tableName: 'MA_ELE_DEPARTMENT',
          agencyCode: page.agencyCode
        }
        ufma.put(url, argu, callback)
      },

      // 表格行操作接口
      // getInterface: function(action) {
      //   var urls = {
      //     delete: {
      //       type: 'delete',
      //       url: page.baseUrl + ''
      //     },
      //     active: {
      //       type: 'post',
      //       url: page.baseUrl + ''
      //     },
      //     unactive: {
      //       type: 'post',
      //       url: page.baseUrl + ''
      //     }
      //   }
      //   return urls[action]
      // },
      // 表格行操作事件
      // rowEvent: function(action, code, $tr) {
      //   var options = page.getInterface(action)
      //   var argu = {
      //     action: action,
      //     code: code
      //   }
      //   var callback = function(data) {
      //     if (action == 'delete') {
      //       if ($tr) {
      //         ufma.showTip(data.msg, function() {}, data.flag)
      //       }
      //       ufma.setBarPos($(window))
      //     } else if (action == 'active') {
      //       if (data.flag == 'success') {
      //         ufma.showTip('启用成功', function() {}, 'success')
      //       }
      //     } else if (action == 'unactive') {
      //       if (data.flag == 'success') {
      //         ufma.showTip('禁用成功！', function() {}, 'success')
      //       }
      //     } else {
      //       if ($tr) {
      //         $tr
      //           .find('.btn[action="active"]')
      //           .attr('disabled', action == 'active')
      //         $tr
      //           .find('.btn[action="unactive"]')
      //           .attr('disabled', action == 'unactive')
      //       }
      //       ufma.setBarPos($(window))
      //     }
      //     var propertyType = $('a[name="property-type"].selected').attr('value')
      //     var queryData = page.getQueryData(propertyType)
      //     page.setTableData(queryData)
      //   }
      //   if (action == 'delete') {
      //     ufma.delete(options.url, argu, callback)
      //   } else {
      //     ufma.post(options.url, argu, callback)
      //   }
      // },
      // 获取查询条件 propertyType: 属性类别
      // getQueryData: function(propertyType) {
      //   var queryData = {
      //     propertyType: propertyType,
      //     isUse: '',
      //     isDisplay: '',
      //     allowEmpty: '',
      //     displayInList: '',
      //     filterCondition: '',
      //     addressField: '',
      //     dataType: ''
      //   }
      //   $("input[name='isUse']:checked").each(function(value) {
      //     queryData.isUse += this.value + ','
      //   })
      //   $("input[name='isDisplay']:checked").each(function(value) {
      //     queryData.isDisplay += this.value + ','
      //   })
      //   $("input[name='allowEmpty']:checked").each(function(value) {
      //     queryData.allowEmpty += this.value + ','
      //   })
      //   $("input[name='displayInList']:checked").each(function(value) {
      //     queryData.displayInList += this.value + ','
      //   })
      //   $("input[name='filterCondition']:checked").each(function(value) {
      //     queryData.filterCondition += this.value + ','
      //   })
      //   $("input[name='addressField']:checked").each(function(value) {
      //     queryData.addressField += this.value + ','
      //   })
      //   $("input[name='dataType']:checked").each(function(value) {
      //     queryData.dataType += this.value + ','
      //   })
      //   return queryData
      // },
      // 设置表格数据，queryData=查询条件
      // setTableData: function(queryData) {
      //   // TODO: 修改后端接口
      //   ufma.post('', queryData, function(result) {
      //     var tableData = result.data
      //     page.DataTable.clear().draw()
      //     if (tableData.length > 0) {
      //       page.DataTable.rows.add(tableData)
      //       page.DataTable.columns.adjust().draw()
      //     }
      //     $('#dep-salary-summary-table')
      //       .closest('.dataTables_wrapper')
      //       .ufScrollBar({
      //         hScrollbar: true,
      //         mousewheel: false
      //       })
      //     ufma.setBarPos($(window))
      //   })
      // },
      // 表格列定义
      columns: function() {
        // TODO: 需要根据接口修改列data
        var columns = [
          {
            title:
              '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
              'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
            className: 'tc nowrap check-style no-print',
            render: function(data, type, rowdata, meta) {
              return (
                "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' id=" +
                rowdata.id +
                ' index=' +
                meta.row +
                " value='0' /> &nbsp;<span></span> </label>"
              )
            }
          },
          {
            title: '属性代码',
            data: 'code',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              var textIndent = '0'
              if (rowdata.levelNum) {
                textIndent = parseInt(rowdata.levelNum) - 1 + 'em'
              }
              var alldata = JSON.stringify(rowdata)
              return (
                '<a style="display:block;text-indent:' +
                textIndent +
                '" href="javascript:;" data-href=\'' +
                alldata +
                "'>" +
                data +
                '</a>'
              )
            }
          },
          {
            title: '属性名称',
            data: 'name',
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
            data: 'isUse',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '是否显示',
            data: 'isDisplay',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '允许为空',
            data: 'allowEmpty',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '列表中显示',
            data: 'displayInList',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '过滤条件',
            data: 'filterCondition',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '通讯录字段',
            data: 'addressField',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '数据类型',
            data: 'dataType',
            className: 'isprint nowrap ellipsis',
            render: function(data, type, rowdata, meta) {
              if (!data) {
                return ''
              }
              return data
            }
          },
          {
            title: '值集',
            data: 'valueSet',
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
            data: 'class',
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
            // width: 120,
            render: function(data, type, rowdata, meta) {
              // 预置属性
              if (rowdata.propertyType === '1') {
                return (
                  '<a class="btn btn-icon-only btn-edit btn-permission property-single-edit" code="' +
                  rowdata.code +
                  '" name="' +
                  rowdata.name +
                  '" rowindex="' +
                  meta.row +
                  '" data-toggle="tooltip" action= "edit" title="修改">' +
                  '<span class="glyphicon icon-edit"></span></a>' +
                  '<a class="btn btn-icon-only btn-start btn-permission property-single-start" code="' +
                  rowdata.code +
                  '" name="' +
                  rowdata.name +
                  '" rowindex="' +
                  meta.row +
                  '" data-toggle="tooltip" action= "active" title="启用">' +
                  '<span class="glyphicon icon-play"></span></a>' +
                  '<a class="btn btn-icon-only btn-stop btn-permission property-single-stop" code="' +
                  rowdata.code +
                  '" name="' +
                  rowdata.name +
                  '" rowindex="' +
                  meta.row +
                  '" data-toggle="tooltip" action= "unactive" title="禁用">' +
                  '<span class="glyphicon icon-ban"></span></a>'
                )
              } else {
                // 自定义属性
                return (
                  '<a class="btn btn-icon-only btn-edit btn-permission property-single-edit" code="' +
                  rowdata.code +
                  '" name="' +
                  rowdata.name +
                  '" rowindex="' +
                  meta.row +
                  '" data-toggle="tooltip" action= "edit" title="修改">' +
                  '<span class="glyphicon icon-edit"></span></a>' +
                  '<a class="btn btn-icon-only btn-start btn-permission property-single-start" code="' +
                  rowdata.code +
                  '" name="' +
                  rowdata.name +
                  '" rowindex="' +
                  meta.row +
                  '" data-toggle="tooltip" action= "active" title="启用">' +
                  '<span class="glyphicon icon-play"></span></a>' +
                  '<a class="btn btn-icon-only btn-stop btn-permission property-single-stop" code="' +
                  rowdata.code +
                  '" name="' +
                  rowdata.name +
                  '" rowindex="' +
                  meta.row +
                  '" data-toggle="tooltip" action= "unactive" title="禁用">' +
                  '<span class="glyphicon icon-ban"></span></a>' +
                  '<a class="btn btn-icon-only btn-delete btn-permission property-single-delete" code="' +
                  rowdata.code +
                  '" name="' +
                  rowdata.name +
                  '" rowindex="' +
                  meta.row +
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
        var id = 'dep-salary-summary-table'
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

            //checkbox的全选操作
            // $('.datatable-group-checkable').on("change", function () {
            //     var isCorrect = $(this).is(':checked');
            //     $('#' + id + ' .checkboxes').each(function () {
            //         isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
            //         isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
            //     });
            //     $('.datatable-group-checkable').prop("checked", isCorrect);
            // });

            ufma.isShow(page.reslist)
            // var $elem = $('#dep-salary-summary-table_wrapper')
            // var height = $(window).height() - 250
            // $elem.attr('style', $elem.attr('style') + '; ' + 'height: ' + height + 'px !important');
          },
          drawCallback: function(settings) {
            if (data.length > 0) {
              $('#' + id).fixedColumns({
                rightColumns: 1 //锁定右侧一列
                // leftColumns: 1//锁定左侧一列
              })
            }

            $("[data-toggle='tooltip']").tooltip()
            $('#' + id)
              .find('td.dataTables_empty')
              .text('')
              .append(
                '<img src="' +
                  bootPath +
                  'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
              )
            $('#' + id + ' .btn').on('click', function() {
              //page.delRow($(this).attr('action'), [$(this).attr('chrCode')], $(this).closest('tr'));
              page._self = $(this)
              if ($(this).hasClass('property-single-edit')) {
                var propertyType = $('a[name="property-type"].selected').attr(
                  'value'
                )
                var title =
                  propertyType === '1'
                    ? '编辑预置人员属性'
                    : '编辑自定义人员属性'
                var code = $(this).attr('code')
                var name = $(this).attr('name')
                var rowIndex = $(this).attr('rowindex')
                var data = page.DataTable.row(rowIndex).data()
                page.openPage(title, data)
              }
            })
            $('#' + id + ' .property-single-delete').ufTooltip({
              content: '您确定删除当前属性吗？',
              onYes: function() {
                page.rowEvent(
                  $(page._self).attr('action'),
                  [$(page._self).attr('code')],
                  $(page._self).closest('tr')
                )
              },
              onNo: function() {}
            })
            $('#' + id + ' .property-single-start').ufTooltip({
              content: '您确定启用当前属性吗？',
              onYes: function() {
                page.rowEvent(
                  $(page._self).attr('action'),
                  [$(page._self).attr('code')],
                  $(page._self).closest('tr')
                )
              },
              onNo: function() {}
            })
            $('#' + id + ' .property-single-stop').ufTooltip({
              content: '您确定禁用当前属性吗？',
              onYes: function() {
                page.rowEvent(
                  $(page._self).attr('action'),
                  [$(page._self).attr('code')],
                  $(page._self).closest('tr')
                )
              },
              onNo: function() {}
            })

            //权限控制
            ufma.isShow(page.reslist)
            ufma.setBarPos($(window))
            $('#' + id + '_wrapper').ufScrollBar('update')
          }
        })
      },
      // 初始化页面
      initPage: function() {
        // var queryData = this.getQueryData('1')
        // ufma.post('', queryData, function(result) {
        //   var tableData =
        //     result.data && result.data.length > 0 ? result.data : []
        //   page.initTable(tableData)
        //   $('#dep-salary-summary-table')
        //     .closest('.dataTables_wrapper')
        //     .ufScrollBar({
        //       hScrollbar: true,
        //       mousewheel: false
        //     })
        //   ufma.setBarPos($(window))
        // })
        //权限控制
        // page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist)
        page.renderSeletableColumns()
      },
      // 打开新增部门模态框
      openDepEdit: function(title, data) {
        var openData = data ? data : {}
        ufma.open({
          url: 'departmentEdit.html',
          title: title,
          width: 720,
          height: 460,
          data: openData,
          ondestory: function(data) {
            //窗口关闭时回传的值
            if (data.action === 'save') {
              // var propertyType = $('a[name="property-type"].selected').attr(
              //   'value'
              // )
              // var queryData = page.getQueryData(propertyType)
              // page.setTableData(queryData)
              // $("#value-set-table_wrapper").ufScrollBar('destroy');
              // page.getSearchData();
            }
          }
        })
      },
      // 打开新增/编辑人员模态框
      openPage: function(title, data) {
        var openData = data ? data : {}
        ufma.open({
          url: 'addStaff.html',
          title: title,
          width: 1100,
          height: 600,
          data: openData,
          ondestory: function(data) {
            //窗口关闭时回传的值
            if (data.action === 'save') {
              // var propertyType = $('a[name="property-type"].selected').attr(
              //   'value'
              // )
              // var queryData = page.getQueryData(propertyType)
              // page.setTableData(queryData)
              // $("#value-set-table_wrapper").ufScrollBar('destroy');
              // page.getSearchData();
            }
          }
        })
      },

      onEventListener: function() {
        // 新增部门按钮点击事件
        $('.btn-add-department').on('click', function() {
          page.openDepEdit('新增部门', {
            chrCode: '',
            chrId: '',
            chrName: '',
            deptManager: '',
            deptPhone: '',
            enabled: '',
            lastVer: ''
          })
        })
        // 新增按钮点击事件
        $('#btn-add-dep-salary-summary').on('click', function() {
          var title = '新增人员'
          page.openPage(title)
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
          page.startDepartMent()
        })
        // 停用部门
        $('.department-stop').on('click', function(e) {
          page.stopDepartMent()
        })
        // 查询按钮点击事件
        $('#btnQuery').on('click', function() {
          var argu = $.extend(
            {},
            $('#frmQuery').serializeObject(),
            $('#queryMore').serializeObject()
          )
          console.log(argu)
          page.initTable([])
        })
        $('#dep-salary-summary-table').on(
          'click',
          'tbody td:not(.btnGroup)',
          function(e) {
            e.preventDefault()
            var $ele = $(e.target)
            if ($ele.is('a')) {
              var tabledata = $ele.data('href')

              page.openPage('编辑人员', tabledata)
              return false
            }
            var $tr = $ele.closest('tr')
            var $input = $ele.closest('tr').find('input[type="checkbox"]')
            var code = $input.data('code').toString()
            if ($tr.hasClass('selected')) {
              $ele
                .parents('tbody')
                .find('tr')
                .each(function() {
                  var thisCode = $(this)
                    .find('input[type="checkbox"]')
                    .data('code')
                    .toString()

                  if (thisCode.substring(0, code.length) == code) {
                    $(this).removeClass('selected')
                    $(this)
                      .find('input[type="checkbox"]')
                      .prop('checked', false)
                  }
                })
            } else {
              $ele
                .parents('tbody')
                .find('tr')
                .each(function() {
                  var thisCode = $(this)
                    .find('input[type="checkbox"]')
                    .data('code')
                    .toString()

                  if (thisCode.substring(0, code.length) == code) {
                    $(this).addClass('selected')
                    $(this)
                      .find('input[type="checkbox"]')
                      .prop('checked', true)
                  }
                })
            }
          }
        )
        // 批量删除
        $('#delete-more').on('click', function() {
          var checkedArray = []
          $('#dep-salary-summary-table .check-all:checked').each(function() {
            checkedArray.push($(this).attr('id'))
          })
          if (checkedArray.length === 0) {
            ufma.showTip('请选择数据！', function() {}, 'warning')
          } else {
            ufma.confirm(
              '您确定要删除选中的数据吗？',
              function(action) {
                if (action) {
                  // 点击确定的回调函数
                  // TODO: 添加批量删除接口 重新渲染表格
                  // ufma.post('', { data: checkedArray }, function(result) {
                  //   if (result.flag == 'success') {
                  //     ufma.showTip('删除成功！', function() {}, 'success')
                  //     var propertyType = $(
                  //       'a[name="property-type"].selected'
                  //     ).attr('value')
                  //     var queryData = page.getQueryData(propertyType)
                  //     page.setTableData(queryData)
                  //   } else {
                  //     ufma.showTip(result.msg, function() {}, 'success')
                  //   }
                  // })
                }
              },
              { type: 'warning' }
            )
          }
        })
        //显示/隐藏列隐藏框
        // $('#colAction').on('click', function(evt) {
        //   evt.stopPropagation()
        //   // $("#colList input").each(function(i){
        //   // 	$(this).prop("checked",page.changeCol[i].visible);
        //   // })

        //   $(this)
        //     .next('.rpt-funnelBoxList')
        //     .removeClass('hidden')
        // })

				$('#dep-salary-summary').on("click","#colAction",function(evt){
					evt.stopPropagation();
					// $("#colList input").each(function(i){
					// 	$(this).prop("checked",page.changeCol[i].visible);
					// })
					
          $(this)
          .next('.rpt-funnelBoxList')
          .show()
				})

        $('#addCol').on('click', function(evt) {
          // $('.rpt-funnelBoxList').addClass('hidden')
          $('.rpt-funnelBoxList').hide()
          evt.stopPropagation()
          // $("#colList label").each(function(i) {
          //     page.changeCol[i].visible = $(this).find("input").prop("checked");
          //     var nn = $(this).find("input").data("index");
          //     if($(this).find("input").is(":checked")) {
          //         page.glRptJournalDataTable.column(nn).visible(true);
          //         $(page.glRptJournalDataTable.settings()[0].aoColumns[nn].nTh).addClass("isprint");
          //     } else {
          //         page.glRptJournalDataTable.column(nn).visible(false);
          //         $(page.glRptJournalDataTable.settings()[0].aoColumns[nn].nTh).removeClass("isprint");
          //     }
          // });
          // page.glRptJournalDataTable.columns.adjust().draw();
        })

        // // 属性类别按钮点击事件
        // $('a[name="property-type"]').on('click', function() {
        //   var queryData = page.getQueryData($(this).attr('value'))
        //   page.setTableData(queryData)
        //   // 切换显示删除按钮
        //   if ($(this).attr('value') === '0') {
        //     $('#delete-more').show()
        //   } else {
        //     $('#delete-more').hide()
        //   }
        // })
        // // 复选框必须选中一个
        // $("input[name='isUse']").on('click', function() {
        //   var checked = $("input[name='isUse']:checked")
        //   if (checked.length === 0) {
        //     $(this).prop('checked', true)
        //   }
        // })
        // $("input[name='isDisplay']").on('click', function() {
        //   var checked = $("input[name='isDisplay']:checked")
        //   if (checked.length === 0) {
        //     $(this).prop('checked', true)
        //   }
        // })
        // $("input[name='allowEmpty']").on('click', function() {
        //   var checked = $("input[name='allowEmpty']:checked")
        //   if (checked.length === 0) {
        //     $(this).prop('checked', true)
        //   }
        // })
        // $("input[name='displayInList']").on('click', function() {
        //   var checked = $("input[name='displayInList']:checked")
        //   if (checked.length === 0) {
        //     $(this).prop('checked', true)
        //   }
        // })
        // $("input[name='filterCondition']").on('click', function() {
        //   var checked = $("input[name='filterCondition']:checked")
        //   if (checked.length === 0) {
        //     $(this).prop('checked', true)
        //   }
        // })
        // $("input[name='addressField']").on('click', function() {
        //   var checked = $("input[name='addressField']:checked")
        //   if (checked.length === 0) {
        //     $(this).prop('checked', true)
        //   }
        // })
        // $("input[name='dataType']").on('click', function() {
        //   var checked = $("input[name='dataType']:checked")
        //   if (checked.length === 0) {
        //     $(this).prop('checked', true)
        //   }
        // })
      },

      //此方法必须保留
      init: function() {
        page.initTree()
        page.initTable([
          {
            code: '1',
            name: '11',
            isUse: '是',
            isDisplay: '是',
            allowEmpty: '1',
            displayInList: '1',
            filterCondition: '1',
            addressField: '1',
            dataType: '1',
            valueSet: '1',
            class: '1'
          }
        ])
        //绑定日历控件
        var bankDate = {
          format: 'yyyy-mm-dd',
          initialDate: ''
        }
        $('#dateStart,#dateEnd').ufDatepicker(bankDate)

        ufma.parse()
        page.initPage()
        page.onEventListener()
        ufma.parseScroll()
        $('.deparmentTree').height($(window).height() - 194)
      }
    }
  })()
  /////////////////////
  page.init()
})
