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
      incomeTaxItemTree: function(setting, $tree) {
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
            fontCss: getFontCss
            // addHoverDom: addHoverDom,
            // removeHoverDom: removeHoverDom,
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
            */
            onCheck: onCheck,
            beforeClick: beforeClick
          }
        }
        // function addHoverDom(treeId, treeNode) {
        // 	var sObj = $("#" + treeNode.tId + "_span");
        // 	if (treeNode.editNameFlag || $("#editBtn_" + treeNode.tId).length > 0) return;
        // 	var addStr = "<span class='button department-edit btn-permission' id='editBtn_" + treeNode.tId +
        // 		"' title='编辑部门信息' onfocus='this.blur();'></span>";
        // 	if (page.isEdit == true) {
        // 		addStr = "<span class='button department-edit' id='editBtn_" + treeNode.tId +
        // 			"' title='编辑部门信息' onfocus='this.blur();'></span>";
        // 	}

        // 	sObj.after(addStr);
        // 	var btn = $("#editBtn_" + treeNode.tId);
        // 	if (btn) btn.bind("click", function () {
        // 		page.clearError();
        // 		page.editor = ufma.showModal('department-edt', 720, 400);
        // 		$('#deprtment-chrCode').val(treeNode.code);
        // 		$('#departmentId').val(treeNode.chrId);
        // 		$('#dpLastVer').val(treeNode.lastVer);
        // 		$('#deptManager').val(treeNode.deptManager);
        // 		$('#deptPhone').val(treeNode.deptPhone);
        // 		$('#deprtment-chrCode').attr('disabled', 'disabled');
        // 		var tempName = treeNode.name;
        // 		var depName = tempName.split(']')[1].split('[')[0];
        // 		var itemEnabled = tempName.split(']')[1].split('[')[1];
        // 		$("#itemEnabled").find("label").removeClass("active");
        // 		$("#itemEnabled").find("label").find("label").prop("checked", false);
        // 		if (itemEnabled == "停用") {
        // 			$("#itemEnabled").find("label").eq(1).addClass("active");
        // 			$("#itemEnabled").find("label").eq(1).find("input").prop("checked", true);
        // 		} else {
        // 			$("#itemEnabled").find("label").eq(0).addClass("active");
        // 			$("#itemEnabled").find("label").eq(0).find("input").prop("checked", true);
        // 		}
        // 		$('#chrName').val(depName);
        // 		page.departmentData = $('#form-department').serializeObject();
        // 	});
        // };

        // function removeHoverDom(treeId, treeNode) {
        // 	$("#editBtn_" + treeNode.tId).unbind().remove();
        // };


        function onCheck(event, treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj('tree')
          zTree.selectNode(treeNode)
        }
        function beforeClick(treeId, treeNode) {
          var zTree = $.fn.zTree.getZTreeObj('tree')
          zTree.checkNode(treeNode, !treeNode.checked, null, true)
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
        page.incomeTaxItemTree = page.incomeTaxItemTree(
          {
            // url: page.treeUrl,
            checkbox: true
          },
          $('#tree')
        )
      },
      // 项目编辑
      editItem: function() {
        var node = page.incomeTaxItemTree.getSelectedNodes()
        if (node.length === 0) {
          ufma.showTip('请选择要编辑的项目!', function() {}, 'warning')
          return
        }
        page.openPage('编辑', node)
      },
      // 项目删除
      deleteItem: function() {
        var url = ''
        var checkNodes = page.incomeTaxItemTree.getCheckedNodes(true)
        var selectNodes = []
        for (var i = 0; i < checkNodes.length; i++) {
          var node = checkNodes[i]
          if (!node.isParent) {
            selectNodes.push(node.id)
          }
        }

        if (selectNodes.length == 0) {
          ufma.showTip('请选择要删除的项目!', function() {}, 'warning')
          return false
        }
        // var departArray = page.orgTreeParamAll(selectNodes)
        var callback = function(result) {
          //ufma.showTip('删除成功!');
          // ufma.alert(result.msg);
          ufma.showTip(result.msg, function() {}, result.flag)
          page.initTree()
        }
        var argu = {
          chrCodes: selectNodes,
        }
        ufma.post(url, argu, callback)
      },
      // 初始化页面
      initPage: function() {
        //权限控制
        // page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist)
      },
      // 打开新增/编辑人员模态框
      openPage: function(title, data) {
        var openData = data ? data : {}
        ufma.open({
          url: 'addIncomeTaxItem.html',
          title: title,
          width: 450,
          height: 250,
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
        // 新增同级按钮点击事件
        $('#btn-add-same-level').on('click', function() {
          var node = page.incomeTaxItemTree.getSelectedNodes()
          if (node.length === 0) {
            ufma.showTip('请选择项目!', function() {}, 'warning')
            return
          }
          var title = '新增同级'
          page.openPage(title)
        })
        // 新增下级按钮点击事件
        $('#btn-add-child').on('click', function() {
          var node = page.incomeTaxItemTree.getSelectedNodes()
          if (node.length === 0) {
            ufma.showTip('请选择项目!', function() {}, 'warning')
            return
          }
          var title = '新增下级'
          page.openPage(title)
        })
        // 编辑
        $('#btn-edit-node').on('click', page.editItem)
        // 删除
        $('#btn-delete-node').on('click', function(e) {
          ufma.confirm(
            '你确定要删除选中数据吗？',
            function(action) {
              if (action) {
                page.deleteItem()
              }
            },
            {
              type: 'warning'
            }
          )
        })
      },

      //此方法必须保留
      init: function() {
        page.initTree()
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
