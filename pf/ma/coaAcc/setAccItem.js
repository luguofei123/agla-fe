$(function() {
  window._close = function(action, result, isDef) {
    if (window.closeOwner) {
      var data = {
        action: action,
        data: result,
        isDef: isDef
      };
      window.closeOwner(data);
    }
  };
  var pfData = ufma.getCommonData();
  var treeObj;
  var onerdata = window.ownerData;
  var oTable;
  var checkArgu = [];
  var checkArry = [];
  var treeData;
  var selectedId;
  //接口URL集合
  var interfaceURL = {
    getEleTree: "/ma/sys/common/getEleTree", //获取辅项具体数据
    save: "/ma/sys/coaAcc/save" //保存
  };
  var opts = {
    idField: "code",
    pIdField: "pCode",
    textField: "codeName",
    url: "/ma/sys/common/getEleTree",
    filter: []
  };
  var checkbox = true;
  var leafRequire = true;
  var page = (function() {
    return {
      //请求树
      getAccoTree: function() {
        argu = {
          rgCode: pfData.svRgCode,
          setYear: pfData.svSetYear,
          agencyCode: onerdata.agencyCode,
          acctCode: onerdata.acctCode, //bugCWYXM-4570--传入账套--zsj
          //eleCode: onerdata.rowData.accitemCode
          //bugCWYXM-4221、CWYXM-4220--点击设置按钮不显示辅助核算项内容。解决点击不同辅助核算项按钮时一直显示最后一个辅助核算项的问题
          eleCode: onerdata.rowData.eleCode
        };
        ufma.showloading("正在加载数据，请耐心等待...");
        ufma.get(interfaceURL.getEleTree, argu, function(result) {
          page.allTreeData = result.data;
          if (onerdata.isDef) {
            page.accoTree(result.data, false);
          } else {
            page.accoTree(result.data, true);
          }
          ufma.hideloading();
        });
      },

      //树
      accoTree: function(result, showCheck) {
        treeData = result;
        var treeSetting = {
          view: {
            showLine: false,
            showIcon: false
          },
          check: {
            enable: showCheck,
            chkStyle: "checkbox"
          },

          data: {
            simpleData: {
              enable: true,
              idKey: "code",
              pIdKey: "pCode",
              rootPId: 0
            },

            key: {
              name: "codeName"
            },

            keep: {
              leaf: true
            }
          },
          callback: {
            onCheck: function(event, treeId, treeNode) {
              var myTree = $.fn.zTree.getZTreeObj(treeId);
              var zNodes = myTree.getNodes(); //获取所有父节点--zsj
              /*if(myTree.getCheckedNodes(true).length == zNodes.length) {*/
              var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
              if (myTree.getCheckedNodes(true).length == allNodes.length) {
                //全选操作应该判断已勾选数据与所有数据长度的比较--zsj
                $(".uf-selectAll")
                  .find("input[name='isAll']")
                  .prop("checked", true);
              } else {
                $(".uf-selectAll")
                  .find("input[name='isAll']")
                  .prop("checked", false);
              }
              var parentTId = treeNode.parentTId;
              var tId = treeNode.tId;
              if (
                $("#" + tId)
                  .find("span")
                  .hasClass("checkbox_false_full_focus")
              ) {
                if (
                  $("#" + tId)
                    .find("span")
                    .hasClass("treedefault")
                ) {
                  $("#" + tId)
                    .find(".treedefault")
                    .html("");
                  $("#" + tId)
                    .find(".treedefault")
                    .removeClass("treedefault");
                  $("#" + tId)
                    .find("a")
                    .removeClass("curSelectedNode");
                }
              }
            },
            onClick: function(event, treeId, treeNode) {
              event.stopPropagation();
              var treeObj = $.fn.zTree.getZTreeObj("accoTree");
              if (!$.isNull(treeObj.getSelectedNodes()[0])) {
                selectedId = treeObj.getSelectedNodes()[0].id;
              }
              var parentTId = treeNode.parentTId;
              var tId = treeNode.tId;
              if (selectedId != treeNode.id) {
                if (
                  $("#" + tId)
                    .find("a")
                    .hasClass("curSelectedNode")
                ) {
                  $("#" + tId)
                    .siblings()
                    .find(".curSelectedNode")
                    .removeClass("curSelectedNode");
                  $("#" + parentTId)
                    .siblings()
                    .find(".curSelectedNode")
                    .removeClass("curSelectedNode");
                }
              } else {
                //选中节点为当前默认值时 即为取消默认值的选择
                if (
                  !$("#accoTree li")
                    .find("a.curSelectedNode")
                    .parent()
                    .find("span")
                    .hasClass("treedefault")
                ) {
                  var leaf = $("#accoTree li")
                    .find("a.curSelectedNode")
                    .attr("title")
                    .split(" ");
                  for (var i = 0; i < page.allTreeData.length; i++) {
                    if (page.allTreeData[i].code == leaf[0]) {
                      if (page.allTreeData[i].isLeaf == 1) {
                        $("#accoTree li")
                          .find("a.curSelectedNode")
                          .after('<span class="treedefault" type="radio">默认</span>');
                        $("#accoTree li")
                          .find("a.curSelectedNode")
                          .parents()
                          .siblings()
                          .find(".treedefault")
                          .html("");
                        $("#accoTree li")
                          .find("a.curSelectedNode")
                          .parents()
                          .siblings()
                          .find(".treedefault")
                          .removeClass("treedefault");
                        $("#accoTree li")
                          .find("a.curSelectedNode")
                          .parents()
                          .siblings()
                          .find("a")
                          .removeClass("curSelectedNode");

                        //page.defalutFlag = true;
                      } else {
                        ufma.showTip("请选择明细级内容", function() {}, "warning");
                        return false;
                      }
                    }
                  }
                } else {
                  $("#accoTree li")
                    .find(".treedefault")
                    .html("");
                  $("#accoTree li")
                    .find(".treedefault")
                    .removeClass("treedefault");
                  $("#accoTree li")
                    .find("a")
                    .removeClass("curSelectedNode");
                  var treeObj = $.fn.zTree.getZTreeObj("accoTree");
                  treeObj.cancelSelectedNode();
                }
              }
            },
            //guohx 当弹出为默认值时，只可以选择末级节点
            beforeClick: function(treeId, treeNode, clickFlag) {
              if (ownerData.isDef) {
                return !treeNode.isParent; //当是父节点 返回false 不让选取
              } else {
                return true;
              }
            }
          }
        };
        //
        if (!$.isNull(treeObj)) {
          treeObj.destroy();
        }
        treeObj = $.fn.zTree.init($("#accoTree"), treeSetting, treeData);
        treeObj.expandAll(true);
        ufma.hideloading();
        var timeId = setTimeout(function() {
          page.setSelectedAcco();
          clearTimeout(timeId);
        }, 300);
        // page.queryAccoTable();
        //全选事件
        $(document).on("click", ".uf-selectAll", function() {
          var flag = false;
          if (treeObj) {
            if (
              $(".uf-selectAll")
                .find("input[name='isAll']")
                .prop("checked")
            ) {
              treeObj.checkAllNodes(true);
              flag = true;
            } else {
              treeObj.checkAllNodes(false);
              flag = false;
            }
          }
          setTimeout(function() {
            var myTree = $.fn.zTree.getZTreeObj("accoTree");
            var zNodes = myTree.getNodes(); //获取所有父节点--zsj
            var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
            if (myTree.getCheckedNodes(false).length == allNodes.length) {
              $("#accoTree li")
                .find(".checkbox_false_full")
                .each(function() {
                  if (
                    $(this)
                      .parent()
                      .find("span")
                      .hasClass("treedefault") &&
                    !$(this)
                      .parent()
                      .find("span")
                      .hasClass("checkbox_true_full")
                  ) {
                    $(this)
                      .parent()
                      .find(".treedefault")
                      .html("");
                    $(this)
                      .parent()
                      .find(".treedefault")
                      .removeClass("treedefault");
                    $(this)
                      .parent()
                      .find("a")
                      .removeClass("curSelectedNode");
                  }
                });
            }
          }, 50);
        });
      },
      setSelectedAcco: function(result) {
        var zTreeObj = $.fn.zTree.getZTreeObj("accoTree");
        accitemValueRangeList = onerdata.accitemValueRangeList;
        if (onerdata.isDef) {
          //默认值赋值
          var nodes = treeObj.getNodesByParam("code", onerdata.rowData.defaultCode, null);
          if (nodes.length > 0) {
            zTreeObj.selectNode(nodes[0]);
          }
          for (var i = 0; i < page.allTreeData.length; i++) {
            if (page.allTreeData[i].code == onerdata.rowData.defaultCode) {
              $("#accoTree li")
                .find("a.curSelectedNode")
                .after('<span class="treedefault" type="radio">默认</span>');
              $("#accoTree li")
                .find("a.curSelectedNode")
                .parents()
                .siblings()
                .find(".treedefault")
                .html("");
              $("#accoTree li")
                .find("a.curSelectedNode")
                .parents()
                .siblings()
                .find(".treedefault")
                .removeClass("treedefault");
              $("#accoTree li")
                .find("a.curSelectedNode")
                .parents()
                .siblings()
                .find("a")
                .removeClass("curSelectedNode");
            }
          }
        } else {
          if (accitemValueRangeList.length == 0) {
            return false;
          }
          var selectedHtml = "";
          if (!zTreeObj) {
            return false;
          }
          for (var i = 0; i < accitemValueRangeList.length; i++) {
            var nodes = treeObj.getNodesByParam("code", accitemValueRangeList[i].accitemValue, null);
            if (nodes.length > 0) {
              zTreeObj.checkNode(nodes[0], true, true);
              selectedHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="selectedNode" type="checkbox" code="' + nodes[0].code + '" accaCode="' + nodes[0].code + '"/>' + nodes[0].codeName + "<span></span></label>";
            }
          }
          $(".have-selected .select-content").append(selectedHtml);
        }
      },
      //暂存已选中科目的code
      removeRepetition: function(code) {
        if (page.repetition) {
          if (page.repetition.indexOf(code) < 0) {
            page.repetition.push(code);
          }
        } else {
          page.repetition = [];
          page.repetition.push(code);
        }
      },
      //搜索数据
      doFilter: function() {
        var nodeList = [];
        var searchText = $("#searchText").val();

        function filter(node) {
          var bOk = true;
          if (searchText != "") {
            if (node[opts.textField] != undefined && node[opts.idField] != undefined) {
              if (node[opts.textField].indexOf(searchText) == -1 && node[opts.idField].indexOf(searchText) == -1) {
                return false;
              }
            }
          }
          return bOk;
        }
        for (var i = 0; i < page.allTreeData.length; i++) {
          var node = $.extend(true, {}, page.allTreeData[i]);
          if (node[opts.idField] == "*" || node["id"] == "*") {
            continue;
          }
          if (filter(node)) {
            if (node.id) {
              nodeList.push(node);
            }
          }
        }
        if (onerdata.isDef) {
          page.accoTree(nodeList, false);
        } else {
          page.accoTree(nodeList, true);
        }
      },

      //选择会计科目
      selectedTreeNode: function(event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj("accoTree");
        var nodes = treeObj.getCheckedNodes(true);
        var selectedHtml = "";
        $(".have-selected .select-content").html("");
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i].isLeaf != "0" && nodes[i].isLeaf != 0) {
            selectedHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="selectedNode" type="checkbox" code="' + nodes[i].code + '" accaCode="' + nodes[i].accaCode + '"/>' + nodes[i].codeName + "<span></span></label>";
          }
        }
        $(".have-selected .select-content").append(selectedHtml);
      },
      //移除会计科目
      cancelTreeNode: function() {
        var selectedLabels = $('input[name="selectedNode"]:checked');
        if (selectedLabels.length == 0) {
          ufma.showTip("请选择要移除的科目", function() {}, "warning");
          return false;
        }
        var treeObj = $.fn.zTree.getZTreeObj("accoTree");
        $(selectedLabels).each(function() {
          var code = $(this).attr("code");
          var nodes = treeObj.getNodesByParam("id", code, null);
          treeObj.checkNode(nodes[0], false, true);
          $(this)
            .closest("label")
            .remove();
        });
      },
      //获取要素范围
      /*getCheckedRows: function() {
					  var checkedArray = [];
					  $("#defalutTable .checkboxes:checked").each(function() {
						  checkedArray.push($(this).val());
					  });
					  return checkedArray;
				  },*/
      //组织数据
      orangizeData: function(result) {
        //var checkedRow = page.getCheckedRows();
        var checkedRow = result;
        var rowData = {};
        var data = {};
        var eleAccoAccos = [];
        var showAssitem = [];
        var isShowData = "";
        isShowData = onerdata.isShow;
        $("#accoTree li")
          .find(".checkbox_true_full")
          .each(function() {
            var code = "";
            var codeName = "";
            var isDefault = "";
            if (
              $(this)
                .parent()
                .find("span")
                .hasClass("treedefault")
            ) {
              page.canSave = true;
            }
          });
        //if((isShowData == '0' && checkedRow.length != 1) || (isShowData == '0' && checkedRow.length == 1 && page.canSave != true)) {
        if (isShowData == "0" && checkedRow.length != 1) {
          //ufma.showTip('该要素已设置不显示，请选中一条数据,并设置为默认值', function() {}, 'warning');
          ufma.showTip("该要素已设置不显示，请选择一条数据作为默认值", function() {}, "warning");
          return false;
        } else {
          var checkJson = localStorage.getItem("checkArgu");
          if (!$.isNull(checkJson)) {
            checkArry = eval("(" + checkJson + ")");
          }
          var compareArry = [];
          var chooseFlag = false;
          $("#accoTree li")
            .find(".checkbox_true_full")
            .each(function() {
              var code = "";
              var codeName = "";
              var isDefault = "";
              if ($("#accoTree li").find(".checkbox_true_full").length == 2) {
                var leaf = $(this)
                  .next()
                  .attr("title")
                  .split(" ");
                for (var i = 0; i < page.allTreeData.length; i++) {
                  if (page.allTreeData[i].code == leaf[0]) {
                    if (page.allTreeData[i].isLeaf == 1) {
                      chooseFlag = true;
                    }
                  }
                }
              }
              var codeArr = $(this)
                .parent()
                .find("a")
                .attr("title")
                .split(" ");
              code = codeArr[0];
              var rowData = {
                accitemValue: code,
                isDefault: isDefault
              };
              codeName = $(this)
                .parent()
                .find("a")
                .attr("title");
              compareArry.push(rowData);
              showAssitem.push(codeName);
            });
          //判断两个数组是否相等，主要是为了将没有在缓存中的数加进去
          if (!$.equalsArray(checkArry, compareArry)) {
            eleAccoAccos = checkArry.concat(compareArry);
          }
          var count = 0;
          for (var i = 0; i < eleAccoAccos.length; i++) {
            if (eleAccoAccos[i].isDefault == 0) {
              count++;
            }
          }
          data.eleAccoAccos = eleAccoAccos;
          data.showAssitem = showAssitem;
          page.eleAccoData = eleAccoAccos;
          data.index = onerdata.index;
          data.eleCode = onerdata.rowData.eleCode;
          page.openData = data;
          if (page.action == "sure") {
            _close("sure", data, onerdata.isDef);
          }
        }
      },
      onEventListener: function() {
        $("#searchText").on("keyup", function() {
          var timeId = setTimeout(function() {
            page.doFilter();
          }, 300);
        });
        $("#btnSearch").click(function() {
          page.doFilter();
        });
        $("#btnOk").click(function() {
          if (!onerdata.isDef) {
            //辅助核算
            page.action = "sure";
            var nodes = checkbox ? treeObj.getCheckedNodes(true) : treeObj.getSelectedNodes();
            var nodeList = [];
            for (var i = 0; i < nodes.length; i++) {
              var node = nodes[i];
              if (checkbox) {
                //if(node[opts.idField] == '0' || node[opts.idField] == '*') continue;
                if (node[opts.idField] == "*") continue; //bug77711--修改当编码为0时被过滤的问题，若之后需要传“全部”节点，应将此行代码注释，并将对“*”的限制放开
                if (leafRequire && node.isParent) {
                  continue;
                }
                if (node.checked == true && (node.check_Child_State == -1 || node.check_Child_State == 2)) {
                  nodeList.push(node);
                }
              } else {
                if (leafRequire && node.isParent) {
                  ufma.showTip("请选择明细辅助项", function() {}, "warning");
                  return false;
                } else {
                  nodeList.push(node);
                }
              }
            }
            page.orangizeData(nodeList);
          } else {
            //默认值
            if (!$.isNull(treeObj.getSelectedNodes()[0])) {
              var argu = {
                code: treeObj.getSelectedNodes()[0].code,
                codeName: treeObj.getSelectedNodes()[0].codeName,
                index: onerdata.index
              };
            } else {
              var argu = {
				index: onerdata.index
			  };
            }

            _close("sure", argu, onerdata.isDef);
          }
        });
        $("#btnCancel").click(function() {
          _close(false);
        });
        $("#coaAccCancelAll").on("click", function() {
          _close("cancel");
        });
        $("#node-selecte").on("click", function() {
          page.selectedTreeNode();
        });
        $("#node-cancle").on("click", function() {
          page.cancelTreeNode();
        });
        //保存
        // $("#coaAccSaveAll").on("click", function () {
        // 	var selectedLabels = $('input[name="selectedNode"]');
        // 	page.action = 'save';
        // 	page.orangizeData();
        // 	var argu = {
        // 		"eleAccoItems": [{
        // 			accoCode: onerdata.chrCode,
        // 			accitemCode: onerdata.rowData.accitemCode,
        // 			accitemValueRangeList: page.eleAccoData
        // 		}],
        // 		"rgCode": onerdata.rowData.rgCode,
        // 		"setYear": onerdata.rowData.setYear,
        // 		"agencyCode": onerdata.rowData.agencyCode,
        // 		"acctCode": onerdata.rowData.acctCode,
        // 		"accsCode": onerdata.rowData.accsCode,
        // 		"chrId": onerdata.chrId,
        // 		"chrCode": onerdata.chrCode,
        // 		"lastVer": onerdata.lastVer,
        // 		"saveType": "4.1"
        // 	};

        // 	ufma.post(interfaceURL.save, argu, function (result) {
        // 		_close("save", page.openData);
        // 	})

        // })
      },
      init: function() {
        page.reslist = ufma.getPermission();
        ufma.isShow(page.reslist);
        page.onEventListener();
        if (ownerData.isDef) {
          //   $("#setDefault").removeClass("hide");
          $(".uf-selectAll").addClass("hide");
        } else {
          $("#btnDiv").css("margin-top", "0px");
          //   $("#setDefault").addClass("hide");
          $(".uf-selectAll").removeClass("hide");
        }
        page.getAccoTree();
        //page.initTable();
        $(".current-acco span").html(onerdata.rowData.eleName);
        /*if(onerdata.action == "edit") {
							$("#btnOk").addClass("hidden");
							$("#coaAccSaveAll").removeClass("hidden");
						}*/
        //底部工具条浮动
        ufma.parseScroll();
      }
    };
  })();

  page.init();
});
