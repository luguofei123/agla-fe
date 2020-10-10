$(function() {
	var page = function() {
		var zsDataTable; //全局datatable对象
		var zsTable; //全局table的ID
		var zsThead; //全局table的头部ID

		var rgCode;
		var setYear;
		var Ydata = [];
		var pageLength = ufma.dtPageLength('#maTable');
		var pfData = ufma.getCommonData();
		var eleChoose = '';
		return {
			/*
			 * JSON数组去重
			 * @param: [array] json Array
			 * @param: [string] 唯一的key名，根据此键名进行去重
			 */
			uniqueArray: function(array, key) {
				var result = [array[0]];
				for(var i = 1; i < array.length; i++) {
					var item = array[i];
					var repeat = false;
					for(var j = 0; j < result.length; j++) {
						if(item[key] == result[j][key]) {
							repeat = true;
							break;
						}
					}
					if(!repeat) {
						result.push(item);
					}
				}
				return result;
			},

			//获得节点下面的所有子节点
			getAllChildrenNodes: function(treeNode, result) {
				if(treeNode.isParent) {
					var childrenNodes = treeNode.children;
					if(childrenNodes) {
						for(var i = 0; i < childrenNodes.length; i++) {
							result += "," + (childrenNodes[i].id);
							result = page.getAllChildrenNodes(childrenNodes[i], result);
						}
					}
				}
				return result;
			},

			//计算选中的单位下发数据
			selectDataCount: function(flag) {
				var docNum = 0; //选择下发单位个数
				var kindNum = 0; //选择基础类别个数
				var dataNum = 0; //选择基础数据个数

				var kindArr = [];

				$(".cartBox").find(".ztree").each(function() {
					var zId = $(this).attr("id");
					var oneTree = $.fn.zTree.getZTreeObj(zId);

					var nodes = oneTree.getNodes();
					var nodesLen = 0;
					for(var i = 0; i < nodes.length; i++) {
						var result = "";
						result = page.getAllChildrenNodes(nodes[i], result);
						result = result.split(",");
						nodesLen += result.length;
					}
					var pnodes = oneTree.getNodesByParam("id", "0", null);
					var docKindNum = 0; //选中单位下面的基础类别个数
					var docDataNum = 0; //选中单位下面的基础数据个数
					for(var j = 0; j < pnodes.length; j++) {
						docKindNum++;
					}

					//计算基础类别下面的基础数据个数
					for(var i = 0; i < pnodes.length; i++) {
						var that = $("#" + zId + " li a[title='" + pnodes[i].name + "']");
						var docKindDataNum = 0; //选中单位 基础类别下面的基础数据个数
						var result = "";
						result = page.getAllChildrenNodes(pnodes[i], result);
						result = result.split(",");
						for(var j = 1; j < result.length; j++) {
							docKindDataNum++;
						}
						$(that).find("i.docKindData").text(docKindDataNum);
					}

					kindArr = kindArr.concat(pnodes);
					dataNum += (nodesLen - pnodes.length);

					docDataNum = (nodesLen) - docKindNum;

					$("#" + zId).parent().prev("dt").find("i.docKind").text(docKindNum);
					$("#" + zId).parent().prev("dt").find("i.docData").text(docDataNum);
				})

				$(".cartBox dt").each(function() {
					docNum++;
				})

				if(docNum > 0 && $(".cartBox").find(".ztree li").length > 0) {
					kindNum = page.uniqueArray(kindArr, "name").length;
				}

				$("#docSelectNum").text(docNum);
				$("#kindSelectNum").text(kindNum);
				$("#mainSelectNum").text(dataNum);
				if(dataNum > 0 && dataNum < 100) {
					$(".cartCount").css("display", "inline-block").text(dataNum);
					$(".rightFixedBtn").addClass("sizeFont");
					setTimeout(function() {
						$(".rightFixedBtn").removeClass("sizeFont");
					}, 800);
				} else if(dataNum >= 100) {
					$(".cartCount").css("display", "inline-block").text("99+");
					$(".rightFixedBtn").addClass("sizeFont");
					setTimeout(function() {
						$(".rightFixedBtn").removeClass("sizeFont");
					}, 800);
				} else {
					$(".cartCount").css("display", "none").text("");
					$(".rightFixedBtn").removeClass("sizeFont");
				}
			},

			//清空购物车的树
			clearTree: function() {
				$(".cartBox").find(".ztree").each(function() {
					var zId = $(this).attr("id");
					$.fn.zTree.destroy(zId);
				})
				$(".cartBox").html("");
				$(".rightFixedCont").html("");
				page.selectDataCount();
			},

			//单位搜索树
			docTree: function(zNodes) {
				var setting = {
					data: {
						key: {
							name: 'codeName'
						},
						simpleData: {
							enable: true,
							idKey: "id", //节点数据中保存唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]
							pIdKey: "pId", //节点数据中保存其父节点唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]
						}
					},
					check: {
						enable: true,
						chkStyle: "checkbox"
					},
					view: {
						addDiyDom: addDiyDom,
						fontCss: getFontCss,
						showLine: false,
						showIcon: false
					},

					callback: {
						beforeClick: docTreeBeforeClick,
						onClick: docTreeOnClick,
						onCheck: zTreeOnCheck
					}
				};
				// var data={ //非常重要
				// 		keep: { //子节点和父节点属性设置 默认值都为false
				// 		leaf: false, //zTree 的节点叶子节点属性锁，是否始终保持 isParent = false

				// 		parent: false //zTree 的节点父节点属性锁，是否始终保持 isParent = true
				// 		},
				// 		key: { //节点数据
				// 		checked: "checked", //zTree 节点数据中保存 check 状态的属性名称。

				// 		children: "children", //zTree 节点数据中保存子节点数据的属性名称。

				// 		name: "name", //zTree 节点数据保存节点名称的属性名称。

				// 		title: "" //zTree 节点数据保存节点提示信息的属性名称。[setting.view.showTitle = true 时生效]

				// 		},
				// 		simpleData: {
				// 		enable: false, //确定 zTree 初始化时的节点数据、异步加载时的节点数据、或 addNodes 方法中输入的 newNodes 数据是否采用简单数据模式 (Array)

				// 		idKey: "id", //节点数据中保存唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]

				// 		pIdKey: "pId", //节点数据中保存其父节点唯一标识的属性名称。[setting.data.simpleData.enable = true 时生效]

				// 		}
				// }

				//节点名称超出长度 处理方式
				function addDiyDom(treeId, treeNode) {
					var spaceWidth = 5;
					var switchObj = $("#" + treeNode.tId + "_switch"),
						icoObj = $("#" + treeNode.tId + "_ico");
					switchObj.remove();
					icoObj.before(switchObj);

					if(treeNode.level > 1) {
						var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
						switchObj.before(spaceStr);
					}
					var spantxt = $("#" + treeNode.tId + "_span").html();
					if(spantxt.length > 16) {
						spantxt = spantxt.substring(0, 16) + "...";
						$("#" + treeNode.tId + "_span").html(spantxt);
					}
				}

				function zTreeOnCheck(event, treeId, treeNode) {
					var myTree = $.fn.zTree.getZTreeObj(treeId);
					if(myTree.getCheckedNodes(true).length == zNodes.length) {
						$("input[name='isAll']").prop("checked", true)
					} else {
						$("input[name='isAll']").prop("checked", false)
					}
				}

				function docTreeOnClick(event, treeId, treeNode) {
					var be = treeNode.checked;
					var myTree = $.fn.zTree.getZTreeObj(treeId);
					myTree.checkNode(treeNode, !be, true);
					if(myTree.getCheckedNodes(true).length == zNodes.length) {
						$("input[name='isAll']").prop("checked", true)
					} else {
						$("input[name='isAll']").prop("checked", false)
					}
					// page.agencyCode = treeNode.code;
				}

				function docTreeBeforeClick(event, treeId, treeNode) {

				}

				function focusKey(e) {
					if(key.hasClass("empty")) {
						key.removeClass("empty");
					}
				}

				function blurKey(e) {
					if(key.get(0).value === "") {
						key.addClass("empty");
					}
				}

				var lastValue = "",
					nodeList = [],
					fontCss = {};

				function clickRadio(e) {
					lastValue = "";
					searchNode(e);
				}

				function allNodesArr() {
					var zTree = $.fn.zTree.getZTreeObj("docTree");
					var nodes = zTree.getNodes();
					var allNodesArr = [];
					var allNodesStr;
					for(var i = 0; i < nodes.length; i++) {
						var result = "";
						var result = page.getAllChildrenNodes(nodes[i], result);
						var NodesStr = result
						NodesStr = NodesStr.split(",");
						NodesStr.splice(0, 1, nodes[i].id);
						NodesStr = NodesStr.join(",");
						allNodesStr += "," + NodesStr;
					}
					allNodesArr = allNodesStr.split(",");
					allNodesArr.shift();
					return allNodesArr;
				}

				function searchNode(e) {
					var zTree = $.fn.zTree.getZTreeObj("docTree");
					var value = $.trim(key.get(0).value);
					//var keyType = "name";
					var keyType = "codeName";
					if(key.hasClass("empty")) {
						value = "";
					}
					if(lastValue === value) return;
					lastValue = value;
					if(value === "") {
						nodeList = zTree.getNodesByParamFuzzy(keyType, value);
						updateNodes(false);
						return;
					}
					updateNodes(false);

					nodeList = zTree.getNodesByParamFuzzy(keyType, value);

					updateNodes(true);

					var NodesArr = allNodesArr();
					if(nodeList.length > 0) {
						var index = NodesArr.indexOf(nodeList[0].id.toString());
						$("#docTree").scrollTop((20.2 * index));
					}

				}

				function updateNodes(highlight) {
					var zTree = $.fn.zTree.getZTreeObj("docTree");
					for(var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
					}
				}

				function getFontCss(treeId, treeNode) {
					return(!!treeNode.highlight) ? {
						color: "#F04134",
						"font-weight": "bold"
					} : {
						color: "#333",
						"font-weight": "normal"
					};
				}

				function filter(node) {
					return !node.isParent && node.isFirstNode;
				}

				var key;
				$(document).ready(function() {

					var treeObj = $.fn.zTree.init($("#docTree"), setting, zNodes);
					treeObj.expandAll(true);
					key = $("#key");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						.bind("propertychange", searchNode)
						.bind("input", searchNode);
				});

			},

			//加入下发
			maRefOne: function(table, dom, todom, type) {

				function getParent(ID, globalData) {
					var parr = [];
					parr.push(ID);
					var PID = ID;
					for(var i = 0; i < globalData.length; i++) {
						if(globalData[i].id == PID) {
							PID = globalData[i].pId;
							break;
						}
					}
					if(PID && PID != 0) {
						parr.push(PID);
					}
					return parr;
				}

				function addTree(cParrId, globalData, t, agencyCode) {
					var maKind = $(".maKindActive span").text(); //要素类型
					var eleCode = $(".maKindActive").data("code") //要素类型编码
					var mycartTree; //每个单位下面对应的树

					var arr = []; //选中下发的要素，及所有父级要素
					for(var i = 0; i < cParrId.length; i++) {

						for(var j = 0; j < globalData.length; j++) {
							if(globalData[j].id == cParrId[i]) {
								var obj = {};
								obj.id = cParrId[i];
								obj.name = globalData[j].codeName;
								obj.pId = globalData[j].pId;
								obj.eleCode = eleCode;
								obj.CHR_CODE = globalData[j].code;
								obj.RG_CODE = globalData[j].code;
								obj.ENABLED = globalData[j].enabled;
								obj.SET_YEAR = globalData[j].code;
								arr.push(obj);
							}
						}
					}

					var cartId = eleCode + "_" + agencyCode;
					if(t.find("#" + cartId).length == 0) {
						var ddHtml = "<dd><ul id='" + cartId + "' class='ufmaTree ztree'></ul></dd>";
						t.append(ddHtml);
					}

					var treeCartId = $.fn.zTree.getZTreeObj(cartId);
					if(treeCartId) {
						//mycartTree = page.cartTree(cartId);
					} else {
						mycartTree = page.cartTree(cartId);
					}

					mycartTree = $.fn.zTree.getZTreeObj(cartId);
					var pnodes = {
						id: "0",
						pId: "00",
						name: maKind,
						eleCode: eleCode,
						CHR_CODE: "",
						RG_CODE: "",
						ENABLED: "",
						SET_YEAR: ""
					};
					if($("#" + cartId + " li a[title='" + maKind + "']").length <= 0) {
						mycartTree.addNodes(null, pnodes);
						pnodes = mycartTree.getNodeByParam("name", maKind, null);
						//$("#" + cartId + " li a[title='" + maKind + "'] span.node_name").after("<span class='dataTipNum'>(<i class='docKindData'>0</i>)</span>");
						$("<span class='dataTipNum' style='margin-left:10px;'>(<i class='docKindData'>0</i>)</span>").appendTo("#" + cartId + " li a[title='" + maKind + "'] span.node_name");

					} else {
						pnodes = mycartTree.getNodeByParam("name", maKind, null);

					}

					for(var i = arr.length - 1; i >= 0; i--) {
						var nowNode = mycartTree.getNodeByParam("id", arr[i].id, mycartTree.getNodeByParam("name", maKind, null));
						if(nowNode == null) {
							mycartTree.addNodes(pnodes, arr[i]);
						}
						pnodes = mycartTree.getNodeByParam("id", arr[i].id, mycartTree.getNodeByParam("name", maKind, null));
					}
				}
				var treeObj = $.fn.zTree.getZTreeObj("docTree");
				var nodes = treeObj.getCheckedNodes(true);
				if(nodes.length == 0) {
					ufma.alert("请选择下发单位！", "warning");
					// ufma.alert("请选择末级下发单位！", "warning");
					return false;
				}
				$("a[name='bgttypeCode'][class='label label-radio selected']").attr("value");
				var html = '';
				for(var i = 0; i < nodes.length; i++) {
					if(nodes[i].isFinal == "1" && nodes[i].isAcct == true) {
						if($("dl[acctCode='" + nodes[i].code + "']").length == 0 || $("dl[acctCode='" + nodes[i].code + "']").find('dd').length == 0) {
							html = '<dl class="cartBox" agencyCode="' + nodes[i].agencyCode + '" acctCode="' + nodes[i].code + '"></dl>';
						}
					} else if(nodes[i].isFinal == "1" && nodes[i].isAcct == false) {
						//CWYXM-7707--解决先选账套 级再选单位级 时无法加入下发的问题--zsj
						if($("dl[data-code='" + nodes[i].code + "']").length == 0 || $("dl[data-code='" + nodes[i].code + "']").find('dd').length == 0) {
							html = '<dl class="cartBox" data-code="' + nodes[i].code + '" acctCode="*"></dl>';
						}
					} else { //CWYXM-7707解决问题1，3--zsj
						html = '';
					}
					$(".rightFixedCont").append(html);
				}
				// if($("#docTree").find("li a").hasClass("curSelectedNode")) {
				var globalData = page.zsDataTable.data();
				for(var y = 0; y < nodes.length; y++) {
					$(".cartBox").each(function(i) {
						if(nodes[y].code == $(this).attr("acctCode") && $(this).attr("acctCode") != '*' && nodes[y].isAcct == true && nodes[y].isFinal == "1") {
							if(nodes[y].agencyCode == $(this).attr("agencyCode")) {
								if($(this).find("span[data-acctCode='" + nodes[y].code + "']").length == 0) {
									var dtHtml = "<dt>" +
										"<span class='docTitle' data-title='" + nodes[y].agencyCodeName + nodes[y].codeName + "' data-agencyCode='" + nodes[y].agencyCode + "' data-acctCode ='" + nodes[y].code + "'>" + nodes[y].agencyCodeName + ' ' + nodes[y].codeName + "</span>" +
										"<span class='dataTipNum none'>(<i class='docKind'>0</i>个类别，<i class='docData'>0</i>个数据)</span>" +
										"<span class='ma-icon glyphicon icon-angle-top'>" +
										"</dt>";
									$(".cartBox").eq(i).append(dtHtml);
									$("#docSelectNum").text(1);
								}
								var t = $(this);

								if(type == "one") {
									var curId = $(dom).data("id");
									var curPid = $(dom).data('pid');

									var cParrId = getParent(curId, globalData);

									addTree(cParrId, globalData, t, nodes[y].code);
								} else {
									if($("input[name='checkList']:checked").length == 0) {
										ufma.showTip("请选择要下发的数据", function() {

										}, "warning");
										return false
									}

									$("input[name='checkList']:checked").each(function(k) {
										var curId = $(this).val();
										var cParrId = getParent(curId, globalData);
										addTree(cParrId, globalData, t, nodes[y].code);
									});
								}
							}

						} else if(nodes[y].code == $(this).attr("data-code") && $(this).attr("acctCode") == '*' && nodes[y].isAcct == false && nodes[y].isFinal == "1") {
							if($(this).find("span[data-code='" + nodes[y].code + "']").length == 0) {
								var dtHtml = "<dt>" +
									"<span class='docTitle' data-title='" + nodes[y].codeName + "' data-code='" + nodes[y].code + "'>" + nodes[y].codeName + "</span>" +
									"<span class='dataTipNum none'>(<i class='docKind'>0</i>个类别，<i class='docData'>0</i>个数据)</span>" +
									"<span class='ma-icon glyphicon icon-angle-top'>" +
									"</dt>";
								$(".cartBox").eq(i).append(dtHtml);
								$("#docSelectNum").text(1);
							}
							var t = $(this);

							if(type == "one") {
								var curId = $(dom).data("id");
								var curPid = $(dom).data('pid');

								var cParrId = getParent(curId, globalData);

								addTree(cParrId, globalData, t, nodes[y].code);
							} else {
								if($("input[name='checkList']:checked").length == 0) {
									ufma.showTip("请选择要下发的数据", function() {

									}, "warning");
									return false
								}

								$("input[name='checkList']:checked").each(function(k) {
									var curId = $(this).val();
									var cParrId = getParent(curId, globalData);
									addTree(cParrId, globalData, t, nodes[y].code);
								});
							}
						}
					});
				}

				page.selectDataCount();

			},

			//提示下发树
			cartTree: function(cartTreeId) {
				var zNodes;
				var myTree;
				var setting = {
					view: {
						selectedMulti: false,
						showLine: false
					},
					edit: {
						enable: true,
						showRenameBtn: false
					},
					data: {
						simpleData: {
							enable: true
						}
					},
					callback: {
						beforeDrag: beforeDrag,
						onRemove: zTreeOnRemove
					}
				};

				function zTreeOnRemove(event, treeId, treeNode) {
					//alert(treeNode.tId + ", " + treeNode.name);
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					var pNode = treeNode.getParentNode();
					if(pNode != null) {
						var len = pNode.children.length;
						if(len == 0) {
							treeObj.removeNode(pNode);
						}
					}
					var allNodes = treeObj.getNodes();
					for(var i = 0; i < allNodes.length; i++) {
						if(allNodes[i].children.length == 0) {
							treeObj.removeNode(allNodes[i]);
						}
					}
					$('.rightFixedCont .cartBox').each(function() {
						if((!$.isNull($(this).attr('agencycode')) || !$.isNull($(this).attr('data-code'))) && $(this).find('dd ul li').length == 0) {
							$(this).find(".ztree").each(function() {
								$.fn.zTree.destroy(treeId);
							})
							$(this).html('');
							$(this).addClass('removeLi');
							$(this).html($(this).html().replace('<dl>', '').replace('</dl>', ''));
							$(this).parent().find('.removeLi').remove();
						}
					})
					page.selectDataCount(true);
				}

				function beforeDrag(treeId, treeNodes) {
					return false;
				}

				function setEdit() {
					var zTree = $.fn.zTree.getZTreeObj(cartTreeId),
						remove = $("#remove").attr("checked");
				}

				function createTree() {
					myTree = $.fn.zTree.init($("#" + cartTreeId), setting, zNodes);
					myTree.checkAllNodes(true);
					page.selectDataCount();
				}
				//CWYXM-19038【20200630 财务云8.30.10】基础数据下发第一次点击加入下发按钮，前端js报错，第二次点击可成功 guohx 由于jQuery升级ready方法改为异步 所以不走，故注释 20200814
				// $(document).ready(function() {
				createTree();
				setEdit();
				$("#remove").bind("change", setEdit);
				// });

				return myTree;
			},

			//确认下发
			sureMaRef: function() {
				var objs = {
					rgCode: page.rgCode,
					setYear: page.setYear,
					agencyCode: "*",
					// paramList: paramData,
					toAgencyAcctList: []
				};

				//下发到的单位账套
				// var treeObj = $.fn.zTree.getZTreeObj("docTree");
				// var nodes = treeObj.getCheckedNodes(true);
				var nodes = $(".cartBox");
				for(var i = 0; i < nodes.length; i++) {
					var newObj = {
						toAgencyCode: "",
						toAcctCode: "",
						paramList: []
					};
					newObj.toAgencyCode = $(".cartBox").eq(i).attr("agencycode") || $(".cartBox").eq(i).attr("data-code");
					newObj.toAcctCode = $(".cartBox").eq(i).attr("acctcode");
					var docKind = $(".cartBox").eq(i).find(".docKind").text();
					var docData = $(".cartBox").eq(i).find(".docData").text();
					var paramData = [];
					$(".cartBox").eq(i).find("dd").each(function() {
						// $(".cartBox dt").each(function () {
						if(docKind != "0" && docData != "0") {
							var agencyCode = newObj.toAgencyCode;
							var agencyCodeArr = [agencyCode.toString()]

							var treeId = $(this).find("ul.ztree").attr("id");
							var docTree = $.fn.zTree.getZTreeObj(treeId);
							var docTreeNodes = docTree.getNodes();
							if(docTreeNodes.length == 0) {
								ufma.showTip("请选择要下发的要素！", function() {

								}, "warning");
								return false;
							}
							for(var i = 0; i < docTreeNodes.length; i++) {

								var result = "";
								result = page.getAllChildrenNodes(docTreeNodes[i], result);
								result = result.split(",");
								var cnode1 = docTree.getNodeByParam("id", result[1], docTreeNodes[i]);
								var eleObj = {};
								var chrCodesArr = [];
								for(var j = 1; j < result.length; j++) {
									var cnode = docTree.getNodeByParam("id", result[j], docTreeNodes[i]);
									chrCodesArr.push(cnode.CHR_CODE);
								}
								//						var chrCodes = chrCodesArr.join(",")
								eleObj.chrCodes = chrCodesArr;
								eleObj.eleCode = cnode1.eleCode;
								paramData.push(eleObj);
							}
						}
					});
					newObj.paramList = paramData;
					objs.toAgencyAcctList.push(newObj);
				}

				ufma.showloading("正在加载数据，请耐心等待...");
				ufma.ajax("/ma/sys/eleAgrr/issueEleData", "post", objs, page.sureMaRefBack);
			},
			issueTips: function(data, isCallBack) {
				var title = "";
				if(isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				ufma.open({
					url: '../maCommon/issueTipsMaRef.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function(data) {
						//窗口关闭时回传的值;
						page.maRefSuccess();
					}
				});
			},
			//下发回调方法
			sureMaRefBack: function(result) {

				ufma.hideloading();
				page.issueTips(result);
				$(".boxShow").trigger("click");
				// ufma.showTip(result.msg, page.maRefSuccess, "success");
				//page.clearTree();
			},

			//下发回调成功
			maRefSuccess: function() {
				page.clearTree();
			},

			//要素类型初始化回调函数
			initData: function(result) {
				Ydata = result.data
				var typeArr = result.data;
				var typeHtml = "";
				for(var i = 0; i < typeArr.length; i++) {
					var h = ufma.htmFormat('<li><button type="button" class="btn btn-sm btn-default" data-code="<%=code%>"><span><%=name%></span><i>(<%=count%>)</i></button></li>', {
						code: typeArr[i].eleCode,
						name: typeArr[i].eleName,
						count: typeArr[i].typeCount
					});
					typeHtml += h;
				}
				$(".ma-query-ul").html(typeHtml)
					.find("li").eq(0).find("button").removeClass("btn-default")
					.addClass("btn-primary maKindActive");
				eleChoose = $(".ma-query-ul .maKindActive").data("code");
				//加载第一个数据类型下面的表格
				page.getEleTable(typeArr[0].eleCode);
				page.leftTree();
				//page.zsDataTable.ajax.url("/ma/sys/eleAgrr/getEleTable/"+typeArr[0].eleCode).load();

			},
			//获取表格数据
			getEleTable: function(eleCode) {
				var argu = {
					eleCode: eleCode,
					rgCode: page.rgCode,
					setYear: page.setYear,
					agencyCode: "*"
				};
				ufma.showloading("正在加载数据，请耐心等待...");
				ufma.get("/ma/sys/eleAgrr/getEleTable", argu, function(result) {
					var data = result.data;
					pageLength = ufma.dtPageLength('#maTable');
					page.zsDataTable.clear().destroy();
					page.zsDataTable = page.newTable(data);
					ufma.hideloading();
				});
			},

			//初始化单位树回调方法
			docTreeInit: function(result) {
				var docArr = result.data;
				page.acctAlldata = result.data;
				page.docTree(docArr);
				ufma.hideloading();
			},

			//表格初始化
			newTable: function(dataArr) {
				var toolBar = "#maTable-tool-bar";
				var tableId = 'maTable';
				page.zsDataTable = page.zsTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true
					},
					"data": dataArr,
					//"ajax":"maRef.json",
					"processing": true, //显示正在加载中
					"pagingType": "first_last_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"ordering": false,
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
								'id="zsCheckAll"/>&nbsp;<span></span> </label>',
							data: null,
							defaultContent: "",
							className: "zs-check-style"
						},
						{
							title: "",
							data: "id",
							className: "zs-child-style"
						},
						{
							title: "",
							data: "pId",
							className: "zs-parent-style"
						},
						{
							title: "要素规则编码",
							data: "code",
							className: "zs-coder-style"
						},
						{
							title: "",
							data: "code"
						},
						{
							title: "",
							data: "code"
						},
						{
							title: "要素编码",
							data: "code",
							width:300,
							className: 'tl'
						},
						{
							title: "要素名称",
							data: "codeName",
							className: "zs-name-style ellipsis tl",
							"render": function(data, type, full, meta) {
								return '<span title="' + data + '">' + data + '</span>'
							}
						},
						{
							title: "要素状态",
							data: "enabled",
							width:60,
							className: "zs-state-style tc"
						},
						{
							title: "操作",
							data: null,
							width:120,
							className: "zs-action-style"
						}
					],
					"columnDefs": [{
							"targets": [0],
							"searchable": false, //不参与全局搜索
							"orderable": false, //禁止排序
							"render": function(data, type, full, meta) {
								if(data != null) {
									return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkboxes" value="' + data.id + '" class="check' + data.id + '" data-text="' + data.eleName + '" data-pid="' + data.pId + '" data-id="' + data.id + '" data-coder="' + data.CHR_TREE_CODE + '" name="checkList"/>&nbsp;<span></span> </label>';
								} else {
									return "";
								}
							}
						},
						{
							"targets": [1],
							"searchable": false, //不参与全局搜索
							"visible": false //隐藏该列
						},
						{
							"targets": [2],
							"searchable": false, //不参与全局搜索
							"orderable": false, //禁止排序
							"visible": false //隐藏该列
						},
						{
							"targets": [3],
							"searchable": false, //不参与全局搜索
							"orderable": false, //禁止排序
							"visible": false //隐藏该列
						},
						{
							"targets": [4],
							"searchable": false, //不参与全局搜索
							"orderable": false, //禁止排序
							"visible": false //隐藏该列
						},
						{
							"targets": [5],
							"searchable": false, //不参与全局搜索
							"orderable": false, //禁止排序
							"visible": false //隐藏该列
						},
						{
							"targets": [-1],
							"searchable": false, //不参与全局搜索
							"orderable": false, //禁止排序
							"render": function(data, type, full, meta) {
								return '<span class="zs-btn-add zs-add-one" data-pid="' + data.PId + '" data-id="' + data.id + '" data-toggle="tooltip" title="加入下发"><span class="glyphicon icon-Addto_icon"></span></span>';
							}
						}
					],
					"order": [
						[0, null],
						//[6, "asc"],
						[9, null]
					],
					//"dom": 'rt<"maTable-paginate"ilp>',
					"dom": '<"datatable-toolbar">rt<"' + tableId + '-paginate"ilp>',
					"initComplete": function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$(".datatable-group-checkable").prop("checked", false);
						//checkbox全选
						$("#zsCheckAll,.datatable-group-checkable").on("click", function() {
							if($(this).prop("checked") === true) {
								$("#zsCheckAll,.datatable-group-checkable").prop("checked", $(this).prop("checked"));
								page.zsTable.find("input[name='checkList']").prop("checked", $(this).prop("checked"));
								page.zsTable.find("tbody tr").addClass("selected");
							} else {
								$("#zsCheckAll,.datatable-group-checkable").prop("checked", false);
								page.zsTable.find("input[name='checkList']").prop("checked", false);
								page.zsTable.find("tbody tr").removeClass("selected");
							}
						});
						$('#maTable').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						$(".slider").css("left", "263px");
						// $(".slider").addClass("hidden")
						//固定表头
						$("#maTable").fixedTableHead();
					},
					"drawCallback": function(settings) {

						ufma.setBarPos($(window));
						ufma.isShow(page.reslist);
						page.zsTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						page.zsTable.css("width", "100%");

						$("td.zs-state-style").each(function() {
							if($(this).text() == "1") {
								$(this).text("启用").css("color", "#00A854");
							} else if($(this).text() == "0") {
								$(this).text("停用").css("color", "#F04134");
								//$(this).siblings("td.zs-action-style").html("");
							}
						})

						//控制要素名称缩进
						$("td.zs-name-style").each(function(n) {
							var coder = $(this).parent("tr").find("td.zs-check-style input[name='checkList']").data("coder");
							var num = 0;
							for(var i = 0; i < coder.length; i++) {
								if(coder.charAt(i) == "-") {
									num++;
								}
							}
							$(this).css("padding-left", (5 + num * 20) + "px");
						})
						//按钮提示
						$("[data-toggle='tooltip']").tooltip();
					}

				});
				//翻页取消勾选
				$('#maTable').on('page.dt', function() {
					$(".datatable-group-checkable,#zsCheckAll").prop("checked", false);
					$(this).find("tbody tr.selected input").prop("checked", false);
					$(this).find("tbody tr.selected").removeClass("selected");
				});
				return page.zsDataTable;
			},

			//判断后台传过来的表格数据是否正确
			checkTableData: function(data) {
				var isRight = true;
				if(data != null && data != "null") {
					if(data.length > 0) {
						for(var i = 0; i < data.length; i++) {
							if(!data[i].hasOwnProperty("RG_CODE")) {
								ufma.alert("第" + i + "条数据的RG_CODE(" + data[i].RG_CODE + ")字段不存在！", "error");
								isRight = false;
								return false;
							}

							if(!data[i].hasOwnProperty("ENABLED")) {
								ufma.alert("第" + i + "条数据的ENABLED字段不存在！", "error");
								isRight = false;
								return false;
							} else {
								if(data[i].ENABLED != "0" && data[i].ENABLED != "1") {
									ufma.alert("第" + i + "条数据的ENABLED(" + data[i].ENABLED + ")字段值不正确！", "error");
									isRight = false;
									return false;
								}
							}

							if(!data[i].hasOwnProperty("CHR_TREE_CODE")) {
								ufma.alert("第" + i + "条数据的CHR_TREE_CODE字段不存在！", "error");
								isRight = false;
								return false;
							}

							if(!data[i].hasOwnProperty("ELE_CODE")) {
								ufma.alert("第" + i + "条数据的ELE_CODE字段不存在！", "error");
								isRight = false;
								return false;
							}

							if(!data[i].hasOwnProperty("PID")) {
								ufma.alert("第" + i + "条数据的PID字段不存在！", "error");
								isRight = false;
								return false;
							} else {}

							if(!data[i].hasOwnProperty("ID")) {
								ufma.alert("第" + i + "条数据的ID字段不存在！", "error");
								isRight = false;
								return false;
							} else {}

							if(!data[i].hasOwnProperty("SET_YEAR")) {
								ufma.alert("第" + i + "条数据的SET_YEAR字段不存在！", "error");
								isRight = false;
								return false;
							}

							if(!data[i].hasOwnProperty("CHR_NAME")) {
								ufma.alert("第" + i + "条数据的CHR_NAME字段不存在！", "error");
								isRight = false;
								return false;
							}

							if(!data[i].hasOwnProperty("CHR_CODE")) {
								ufma.alert("第" + i + "条数据的CHR_CODE字段不存在！", "error");
								isRight = false;
								return false;
							} else {}

						}
					}
				} else {
					ufma.alert(data + ":格式不正确！", "error");
					isRight = false;
					return false;
				}
				return isRight;
			},
			getType: function() {
				//获取右侧要素类型
				ufma.ajax("/ma/sys/eleAgrr/getType", "get", {
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"agencyCode": "*"
				}, page.initData);
			},
			leftTree: function() {
				//获取左侧单位树
				ufma.ajax("/ma/sys/common/selectIssueAgencyOrAcctTree", "get", {
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"agencyCode": "*",
					//"acctCode":'*',
					eleCode: eleChoose
				}, page.docTreeInit);
			},
			//初始化页面
			initPage: function() {
				page.rgCode = pfData.svRgCode;
				page.setYear = pfData.svSetYear;
				page.getType();
				//需要根据自己页面写的ID修改
				page.zsTable = $('#maTable'); //当前table的ID
				page.zsThead = $('#maThead'); //当前table的头部ID
				var dataArr = [];
				page.zsDataTable = page.newTable(dataArr);
			},
			onEventListener: function() {
				$(".rpt-checkAll").on("click", function() {
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					if(treeObj) {
						if($("input[name='isAll']").prop("checked")) {
							treeObj.checkAllNodes(true);
						} else {
							treeObj.checkAllNodes(false);
						}
					}
				});
				$('.rightFixedCont').on('mouseover', function() {
					var tree = $(this);
					var timeId = setTimeout(function() {
						tree.find('span[title="remove"]').attr("title", "删除");
					}, 300);
				});
				//表格单行选中
				page.zsTable.on("click", "tbody td:not(.zs-action-style)", function(e) {
					//bug79027--zsj--添加勾选上级编码时下级编码一同勾选的方法
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest("tr");
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					if($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(!$.isNull(thisCode) && ((thisCode.substring(0, code.length) == code) || thisCode == code)) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						})

					} else {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(!$.isNull(thisCode) && ((thisCode.substring(0, code.length) == code) || thisCode == code)) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						})
					}

					e.preventDefault();

					var $tmp = $("[name=checkList]:checkbox");

					var t = $ele.find('.checkboxes').is(":checked");
					$ele.find('.checkboxes').prop("checked", !t);
					var num = 0;
					var arr = document.querySelectorAll('#maTable .checkboxes');
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++;
						}
					}
					if(num == arr.length) {
						$("#zsCheckAll,.zs-check-all input").prop('checked', true);
						$(".ufma-tool-btns .datatable-group-checkable").prop('checked', true);
					} else {
						$(".ufma-tool-btns .datatable-group-checkable").prop('checked', false);
						$("#zsCheckAll,.zs-check-all input").prop('checked', false);
					}

					//$("#zsCheckAll,.zs-check-all input").prop("checked", $tmp.length == $tmp.filter(":checked").length);
					//$(".ufma-tool-btns .datatable-group-checkable").prop("checked", $tmp.length == $tmp.filter(":checked").length);
					return false;
					// }
				});

				function getChild(globalData, childArr, cur_id) {
					for(var i = 0; i < globalData.length; i++) {
						if(globalData[i].PID == cur_id) {
							childArr.push(globalData[i].ID);
						}
					}
					if(childArr.length > 0) {
						childArr = getSChild(globalData, childArr);
					}
					return childArr;
				}

				function getSChild(globalData, childArr) {
					if(!childArr) {
						return childArr;
					}
					for(var i = 0; i < childArr.length; i++) {
						var arr = [];
						for(var j = 0; j < globalData.length; j++) {
							if(globalData[j].PID == childArr[i]) {
								arr.push(globalData[j].ID);
							}
						}
						if(arr.length > 0) {
							var child = getSChild(globalData, arr);
							for(var k = 0; k < arr.length; k++) {
								childArr.push(arr[k]);
							}

						}
					}
					return childArr;
				}

				//分组全选
				/*				page.zsTable.on("click", "tbody td:not(.zs-action-style)", function() {
									var that = $(this).closest('tr').find("td.zs-check-style input[name='checkList']");

									var cur_id = $(that).data("id");
									var cur_pid = $(that).data("pid");

									var globalData = page.zsDataTable.data();
									var childArr = [];
									childArr = getChild(globalData, childArr, cur_id);
									childArr.push(cur_id);
									if($(that).prop("checked") === true) {
										for(var i = 0; i < childArr.length; i++) {
											$(".check" + childArr[i]).prop("checked", true);
											$(".check" + childArr[i]).parents("tr").addClass("selected");
										}
									} else {
										for(var i = 0; i < childArr.length; i++) {
											$(".check" + childArr[i]).prop("checked", false);
											$(".check" + childArr[i]).parents("tr").removeClass("selected");
										}
									}


								});*/

				//搜索隐藏显示
				ufma.searchHideShow(page.zsTable);

				//更多要素类型
				$("#moreQuery").on("click", function() {
					if($(this).find("span").hasClass("icon-angle-bottom")) {
						$(this).find("i").text("收起");
						$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");

						$(".ma-query-ul").animate({
							"height": "100%"
						});
						ufma.setBarPos($(window));
					} else {
						$(this).find("i").text("更多");
						$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$(".ma-query-ul").animate({
							"height": "28px"
						});
						//ufma.setBarPos($(window));
						//CWYXM-6661--修改界面错位问题
						var barHeight = $('#documentArea').height();
						var moreHeight = $('.ma-query-ul').height();
						var moveHeight = barHeight - moreHeight;
						$('#maTable-tool-bar').animate({
							"top": moveHeight + 80
						});
					}
				});

				//单选要素类型---zsj
				$(".ma-query-ul").on("click", "li", function() {
					$(this).find("button").addClass("maKindActive btn-primary").removeClass("btn-default");
					$(this).siblings("li").find("button").removeClass("maKindActive  btn-primary").addClass("btn-default");
					var code = $(this).find("button").data("code");
					eleChoose = code;
					page.getEleTable(code);
					ufma.showloading('数据加载中，请耐心等待...');
					// page.leftTree(); //guohx ysdp 20200227142750 切换要素时不刷新左侧单位树
					$("input[name='isAll']").prop("checked", false); //bug77995
					//page.zsDataTable.ajax.url("/ma/sys/eleAgrr/getEleTable/"+code).load();
				})

				//右侧滑出
				$(".rightFixedBtn,.rightFixedHead span").on("click", function() {
					if(!$(".rightFixedBtn").hasClass("boxShow")) {
						page.selectDataCount();
						$(".rightFixedHead span.glyphicon").removeClass("icon-angle-double-left").addClass("icon-angle-double-right");
						$(".rightFixed").animate({
							right: "-1px"
						}, 500);
						$(".rightFixedBtn").animate({
							right: "398px"
						}, 500).addClass("boxShow");
					} else {
						$(".rightFixedHead span.glyphicon").removeClass("icon-angle-double-right").addClass("icon-angle-double-left");
						$(".rightFixed").animate({
							right: "-400px"
						}, 500);
						$(".rightFixedBtn").animate({
							right: "0px"
						}, 500).removeClass("boxShow");
					}
					//CWYXM-7707--解决先选账套 级再选单位级 时出现多余dd的问题--zsj
					$('.rightFixedCont .cartBox').each(function() {
						/*if(!$.isNull($(this).attr('agencycode')) && $(this).find('dd ul li').length == 0) {
							$(this).html('');
						}*/
						if((!$.isNull($(this).attr('agencycode')) || !$.isNull($(this).attr('data-code'))) && $(this).find('dd ul li').length == 0) {
							//$(this).html('');
							//$(this).remove();
							//$(this).html($(this).html().replace('<dl>', '').replace('</dl>', ''));
						}
					})
				});
				$("body").on("click", function(e) {
					if($(e.target).closest(".rightFixedBtn").length == 0 && $(e.target).closest(".rightFixed").length == 0) {
						$(".rightFixed").animate({
							right: "-400px"
						}, 500);
						$(".rightFixedBtn").animate({
							right: "0px"
						}, 500).removeClass("boxShow");
					}
				});

				$(".rightFixedCont").css({
					"height": ($(".rightFixed").height() - 96) + "px"
				});
				$(window).resize(function(e) {
					$(".rightFixed").css({
						"height": ($(window).height() - 2) + "px",
						"top": "0px"
					});
					$(".rightFixedCont").css({
						"height": ($(".rightFixed").height() - 96) + "px"
					});
				}).trigger('resize');

				//购物车更多
				$(document).on("click", ".ma-icon", function() {
					// $(".cartBox").on("click", ".ma-icon", function() {
					var cont = $(this).parent("dt").next("dd");
					if($(this).hasClass("icon-angle-bottom")) {
						$(this).removeClass("icon-angle-bottom").addClass("icon-angle-top");
						$(cont).slideDown();
					} else {
						$(this).removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$(cont).slideUp();
					}
				});

				//加入单个下发
				page.zsTable.on("click", ".zs-add-one", function() {
					page.maRefOne(page.zsDataTable, this, "cartBox", "one");
				})

				//批量加入下发
				$("#zs-add-check").on("click", function() {
					page.maRefOne(page.zsDataTable, this, "cartBox", "batch");
				})

				//清空购物车
				$("#clearTree").on("click", function() {
					page.clearTree();
				})

				//确认下发
				$("#sureMaRef").on("click", function() {
					page.sureMaRef();
					//下发后取消全选
					$(".datatable-group-checkable,#zsCheckAll").prop("checked", false);
					$("#maTable").find("tbody tr.selected input").prop("checked", false);
					$("#maTable").find("tbody tr.selected").removeClass("selected");
				});
			},
			//此方法必须保留
			init: function() {
				page.reslist = ufma.getPermission();
				ufma.parse(page.namespace);
				ufma.parseScroll();
				this.initPage();
				this.onEventListener();
				page.winH = $(window).height() - 165;
				$(".doc-ztree").css("height", page.winH + "px");

				$(window).scroll(function(e) {
					var winPos = $(this).scrollTop();
					if(winPos > 56) {
						$(".ufma-layout-slider").css("top", (winPos - 48) + "px");
					} else {
						$(".ufma-layout-slider").css("top", "0");
						$(".doc-ztree").css("height", (page.winH + parseInt(winPos)) + "px");
					}
				});
			}
		}
	}();

	page.init();
});