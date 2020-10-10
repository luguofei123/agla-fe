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
		getEleTree: "/ma/sys/eleVouType/getAccoTree", //获取辅项具体数据
		saveVou: "/ma/sys/eleVouType/saveVouTypeAccoRange", //保存辅项具体数据
		save: "/ma/sys/coaAcc/save" //保存
	};
	var opts = {
		idField: 'code',
		pIdField: 'pCode',
		textField: 'codeName',
		url: '/ma/sys/common/getEleTree',
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
					acctCode: onerdata.acctCode,
					vouTypeCode: onerdata.vouTypeCode,
					isNotFiltByVouType: '1'
				}
				ufma.showloading('正在加载数据，请耐心等待...');
				ufma.post(interfaceURL.getEleTree, argu, function(result) {
					page.allTreeData = result.data;
					page.accoTree(result.data);
					ufma.hideloading()
				});
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
							var parentTId = treeNode.parentTId;
							var tId = treeNode.tId;
							/*if(treeNode.isUsed == '1' && !$('#' + tId).find('span.button.chk').hasClass('checkbox_true_full')) {
								ufma.showTip('该关联科目已被使用，禁止取消关联', function() {}, 'warning');
								setTimeout(function() {
									$('#' + tId).find('span.button.chk').trigger('click');
								}, 100);
							}*/
							var myTree = $.fn.zTree.getZTreeObj(treeId);
							var zNodes = myTree.getNodes(); //获取所有父节点--zsj
							/*if(myTree.getCheckedNodes(true).length == zNodes.length) {*/
							var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
							if(myTree.getCheckedNodes(true).length == allNodes.length) { //全选操作应该判断已勾选数据与所有数据长度的比较--zsj
								$(".uf-selectAll").find("input[name='isAll']").prop("checked", true);
							} else {
								$(".uf-selectAll").find("input[name='isAll']").prop("checked", false);
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
				var timeId = setTimeout(function() {
					page.setSelectedAcco(treeData);
					clearTimeout(timeId);
				}, 300)
				//全选事件
				$(document).on("click", ".uf-selectAll", function() {
					var myTree = $.fn.zTree.getZTreeObj('accoTree');
					var checkedArr = myTree.getCheckedNodes(true);
					var flag = false;
					var oldChecked = false; //之前未勾选
					//如果点击后为勾选状态，则说明之前为未勾选，反之亦然
					if($('.uf-selectAll').is('checked')) {
						oldChecked = false;
					} else {
						oldChecked = true;
					}
					if(treeObj) {
						if($(".uf-selectAll").find("input[name='isAll']").prop("checked")) {
							treeObj.checkAllNodes(true);
							flag = true;
						} else {
							treeObj.checkAllNodes(false);
							flag = false;
						}
						//CWYXM-9729 --基础资料-凭证类型，已使用科目，在选用科目页面，通过全选按钮可取消，应控制住勾选且不可取消
						/*setTimeout(function() {
							var count = 0;
							if(flag == false && oldChecked == true) {
								for(var i = 0; i < checkedArr.length; i++) {
									if(checkedArr[i].isUsed == '1' && !$('#' + checkedArr[i].tId).find('span.button.chk').hasClass('checkbox_true_full')) {
										count++;
										$('#' + checkedArr[i].tId).find('span.button.chk').trigger('click');
									}
								}
							}
							if(count > 0) {
								ufma.showTip('该关联科目已被使用，禁止取消关联', function() {}, 'warning');
								count = 0;
							}
						}, 50)*/
					}

				});

			},
			setSelectedAcco: function(result) {
				var selectedHtml = "";
				var zTreeObj = $.fn.zTree.getZTreeObj("accoTree");
				if(!zTreeObj) {
					return false;
				}
				for(var i = 0; i < result.length; i++) {
					var nodes = [];
					if(result[i].isSelected == '1') {
						nodes = treeObj.getNodesByParam("code", result[i].code, null);
					}
					if(nodes.length > 0) {
						zTreeObj.checkNode(nodes[0], true, true);
						selectedHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="selectedNode" type="checkbox" code="' + nodes[0].code + '" accaCode="' + nodes[0].code + '"/>' + nodes[0].codeName + '<span></span></label>';
					}
				}
				$(".have-selected .select-content").append(selectedHtml);
				setTimeout(function() {
					var myTree = $.fn.zTree.getZTreeObj('accoTree');
					var zNodes = myTree.getNodes(); //获取所有父节点--zsj
					var allNodes = myTree.transformToArray(zNodes); //获取所有节点--zsj
					if(myTree.getCheckedNodes(true).length == allNodes.length) {
						$(".uf-selectAll").find("input[name='isAll']").prop("checked", true);
					}
				}, 50)
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
			orangizeData: function(data) {
				var argu = {
					rgCode: onerdata.rgCode,
					setYear: onerdata.setYear,
					agencyCode: onerdata.agencyCode,
					acctCode: onerdata.acctCode,
					accoCodes: data,
					vouTypeCode: onerdata.vouTypeCode
				}
				ufma.post(interfaceURL.saveVou, argu, function(result) {
					if(result.flag == "success") {
						_close('sure', data);
					}
				});
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
								node.isSelected = '1';
								nodeList.push(node.code);
							}
						} else {
							if(leafRequire && node.isParent) {
								ufma.showTip('请选择明细辅助项', function() {}, 'warning');
								return false;
							} else {
								node.isSelected = '1';
								nodeList.push(node.code);
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