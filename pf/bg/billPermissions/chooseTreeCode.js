$(function() {
	window._close = function(action, result) {
		if(window.closeOwner) {
			var data = {
				action: action,
				data: result
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
	//接口URL集合
	var interfaceURL = {
		getEleTree: "/bg/sysdata/getEleBgItemValues", //获取辅项具体数据
	};
	var opts = {
		idField: 'code',
		pIdField: 'pCode',
		textField: 'codeName',
		url: '/bg/sysdata/getEleBgItemValues',
		filter: []
	};
	var checkbox = true;
	var leafRequire = true;
	var page = function() {
		return {
			//请求树
			getAccoTree: function() {
				argu = {
					rgCode: onerdata.rgCode,
					setYear: onerdata.setYear,
					agencyCode: onerdata.agencyCode,
					acctCode: onerdata.acctCode, //bugCWYXM-4570--传入账套--zsj
					eleCode: onerdata.eleCode
				}
				ufma.showloading('正在加载数据，请耐心等待...');
				ufma.get(interfaceURL.getEleTree, argu, function(result) {
					page.allTreeData = result.data;
					page.accoTree(result.data);
					ufma.hideloading()
				})

			},

			//树
			accoTree: function(result) {
				treeData = result;
				var treeSetting = {
					view: {
						showLine: false,
						showIcon: false
					},
					check: {
						enable: true,
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
							name: "codeName",
						},

						keep: {
							leaf: true
						}
					},
					callback: {
						onCheck: function(event, treeId, treeNode) {
							var myTree = $.fn.zTree.getZTreeObj(treeId);
							var zNodes = myTree.getNodes(); //获取所有父节点--zsj
							var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
							if(myTree.getCheckedNodes(true).length == allNodes.length) { //全选操作应该判断已勾选数据与所有数据长度的比较--zsj
								$(".uf-selectAll").find("input[name='isAll']").prop("checked", true)
							} else {
								$(".uf-selectAll").find("input[name='isAll']").prop("checked", false)
							}
							var parentTId = treeNode.parentTId;
							var tId = treeNode.tId;
							if($('#' + tId).find('span').hasClass('checkbox_false_full_focus')) {
								if($('#' + tId).find('span').hasClass('treedefault')) {
									$('#' + tId).find('.treedefault').html('');
									$('#' + tId).find('.treedefault').removeClass('treedefault');
									$('#' + tId).find('a').removeClass('curSelectedNode');
								}
							}
						},
						onClick: function(event, treeId, treeNode) {
							event.stopPropagation();
							var parentTId = treeNode.parentTId;
							var tId = treeNode.tId;
							if($('#' + tId).find('a').hasClass('curSelectedNode')) {
								$('#' + tId).siblings().find('.curSelectedNode').removeClass('curSelectedNode')
								$('#' + parentTId).siblings().find('.curSelectedNode').removeClass('curSelectedNode');
							}
						}
					}
				};
				if(!$.isNull(treeObj)) {
					treeObj.destroy();
				}
				treeObj = $.fn.zTree.init($('#accoTree'), treeSetting, treeData);
				treeObj.expandAll(true);
				ufma.hideloading();
				//全选事件
				$(document).on("click", ".uf-selectAll", function() {
					var flag = false;
					if(treeObj) {
						if($(".uf-selectAll").find("input[name='isAll']").prop("checked")) {
							treeObj.checkAllNodes(true);
							flag = true;
						} else {
							treeObj.checkAllNodes(false);
							flag = false;
						}
					}
					setTimeout(function() {
						var myTree = $.fn.zTree.getZTreeObj('accoTree');
						var zNodes = myTree.getNodes(); //获取所有父节点--zsj
						var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
						if(myTree.getCheckedNodes(false).length == allNodes.length) {
							$('#accoTree li').find('.checkbox_false_full').each(function() {
								if($(this).parent().find('span').hasClass('treedefault') && !$(this).parent().find('span').hasClass('checkbox_true_full')) {
									$(this).parent().find('.treedefault').html('');
									$(this).parent().find('.treedefault').removeClass('treedefault');
									$(this).parent().find('a').removeClass('curSelectedNode');
								}
							});
						}
					}, 50)

				});
			},
			//暂存已选中科目的code
			removeRepetition: function(code) {
				if(page.repetition) {
					if(page.repetition.indexOf(code) < 0) {
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
				var searchText = $('#searchText').val();

				function filter(node) {
					var bOk = true;
					if(searchText != '') {
						if(node[opts.textField] != undefined && node[opts.idField] != undefined) {
							if(node[opts.textField].indexOf(searchText) == -1 && node[opts.idField].indexOf(searchText) == -1) {
								return false;
							}
						}
					}
					return bOk;
				}
				for(var i = 0; i < page.allTreeData.length; i++) {
					var node = $.extend(true, {}, page.allTreeData[i]);
					if(node[opts.idField] == "*" || node["id"] == "*") {
						continue;
					}
					if(filter(node)) {
						if(node.id) {
							nodeList.push(node);
						}
					}
				}
				page.accoTree(nodeList);
			},

			//选择会计科目
			selectedTreeNode: function(event, treeId, treeNode) {
				var treeObj = $.fn.zTree.getZTreeObj("accoTree");
				var nodes = treeObj.getCheckedNodes(true);
				var selectedHtml = "";
				$(".have-selected .select-content").html("");
				for(var i = 0; i < nodes.length; i++) {
					if(nodes[i].isLeaf != "0" && nodes[i].isLeaf != 0) {
						selectedHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="selectedNode" type="checkbox" code="' + nodes[i].code + '" accaCode="' + nodes[i].accaCode + '"/>' + nodes[i].codeName + '<span></span></label>';
					}
				}
				$(".have-selected .select-content").append(selectedHtml);
			},
			//移除会计科目
			cancelTreeNode: function() {
				var selectedLabels = $('input[name="selectedNode"]:checked');
				if(selectedLabels.length == 0) {
					ufma.showTip("请选择要移除的科目", function() {

					}, "warning");
					return false;
				}
				var treeObj = $.fn.zTree.getZTreeObj("accoTree");
				$(selectedLabels).each(function() {
					var code = $(this).attr("code");
					var nodes = treeObj.getNodesByParam("id", code, null);
					treeObj.checkNode(nodes[0], false, true);
					$(this).closest("label").remove();
				})
			},
			//组织数据
			orangizeData: function(result) {
				var checkedRow = result;
				var treeData = [];
				var isShow = '';
				if($('#notShowZero').is(':checked')) {
					isShow = '1';
				} else {
					isShow = '0';
				}
				for(var i = 0; i < checkedRow.length; i++) {
					var rowData = {};
					rowData.setId = checkedRow[i].chrId;
					rowData.isShow = isShow;
					rowData.setCode = checkedRow[i].code;
					rowData.setCodeName = checkedRow[i].codeName;
					treeData.push(rowData);
				}
				if(page.action == 'sure') {
					_close('sure', treeData);
				}

			},
			onEventListener: function() {
				$('#searchText').on('keyup', function() {
					var timeId = setTimeout(function() {
						page.doFilter();
					}, 300);
				});
				$('#btnSearch').click(function() {
					page.doFilter();
				});
				$('#btnOk').click(function() {
					page.action = 'sure';
					var nodes = checkbox ? treeObj.getCheckedNodes(true) : treeObj.getSelectedNodes();
					var nodeList = [];
					for(var i = 0; i < nodes.length; i++) {
						var node = nodes[i];
						if(checkbox) {
							if(node[opts.idField] == '*') continue; //bug77711--修改当编码为0时被过滤的问题，若之后需要传“全部”节点，应将此行代码注释，并将对“*”的限制放开
							if(leafRequire && node.isParent) {
								continue;
							}
							if(node.checked == true && (node.check_Child_State == -1 || node.check_Child_State == 2)) {
								nodeList.push(node);
							}
						} else {
							if(leafRequire && node.isParent) {
								ufma.showTip('请选择明细辅助项', function() {}, 'warning');
								return false;
							} else {
								nodeList.push(node);
							}
						}
					}
					page.orangizeData(nodeList);
				});
				$('#btnCancel').click(function() {
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

			},
			init: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.onEventListener();
				page.getAccoTree();
				//底部工具条浮动
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});