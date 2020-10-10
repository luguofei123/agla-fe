$(function () {
	var page = function () {
		var zsDataTable; //全局datatable对象
		var zsTable; //全局table的ID
		var zsThead; //全局table的头部ID
		var agencyCode;
		var rgCode;
		var setYear;
		var cbAcct;
		var acctCode;
		var accsCode;
		var vbacctData;
		var isAgency = true;
		var tableData;
		var assistItems;
		var vouGroupId;
		var vouRowGuildList = []; //放匹配一对模板的vouGroupId
		var vouRowDataList = [];
		var voutempSendList = [];
		var isParallel;//是否是平行记账 '0'否 '1'是
		var selectedPId; //选中节点的PID
		var selectedId;  //选中节点的ID
		var nodeAgency;  //选中节点的单位
		var nodeAcctcode; //选中节点的账套
		var nodeIsTemp; //选中节点是否是模板
		var isLeaf; //是否是末级单位
		var groupCode;
		var groupName;
		var groupLev; //选中节点分组级别
		var parentGroupLev; //选中父级节点分组级别
		var selectTreeObj; //选中节点的对象
		return {
			//获取单位下的辅助核算项
			getAssistItem: function () {
				var argu = {
					"agencyCode": page.agencyCode,
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"accsCode": page.accsCode,
					"acctCode": page.acctCode
				};
				var callback = function (result) {
					assistItems = result.data;
				};
				ufma.ajaxDef("/gl/vouTemp/getAccItemByAgency", "get", argu, callback);
			},
			//获取主表格数据  guohx
			getTableData: function (vouGroupId) {
				var callback = function (result) {
					if (page.isParallel == '1') { //是平行记账,既有财务会计也有预算会计
						vouRowDataList = []
						if (!$.isNull(result.data)) {
							if (!$.isNull(result.data.cwVouTempVo)) {
								if (result.data.cwVouTempVo.templateName != '') {
									$('#modelName').val(result.data.cwVouTempVo.templateName); //模板名称
								}
								if (result.data.cwVouTempVo.description != '') {
									$('#modelDescp').val(result.data.cwVouTempVo.description); //模板描述
								}
								var cwVouTempVo = result.data.cwVouTempVo;
								var rows = cwVouTempVo.vouDetailTems.length;
								for (var i = 0; i < rows; i++) {
									//定义空模板 避免财务预算有一个情况下 绘制表格报错
									var dataModelRows = {
										"vouSeq": " ",
										"descpt": " ",
										"drCr": " ",
										"accoName": " ",
										"ass": " ",
										"ysdrCr": " ",
										"ysaccoName": " ",
										"ysass": " "
									};
									var row = cwVouTempVo.vouDetailTems[i];
									var newRow = {
										vouSeq: row.vouSeq,
										descpt: row.descpt,
										drCr: row.drCr,
										accoName: row.accoCode + ' ' + row.accoName
									}
									if (!$.isNull(row.detailAssTems)) {
										var accoAssList = [];
										// if (!$.isNull(row.accoSurplus)) {
										// 	accoAssList.push('差异项: ' + row.accoSurplusName + ' ');
										// }
										newRow.ass = page.transAss(row.detailAssTems, accoAssList);
									}
									//辅助
									newRow = $.extend(true, dataModelRows, newRow);
									vouRowDataList.push(newRow); //用空模板
								}
							} else {
								var dataModelRows = {
									"vouSeq": " ",
									"descpt": " ",
									"drCr": " ",
									"accoName": " ",
									"ass": " ",
									"ysdrCr": " ",
									"ysaccoName": " ",
									"ysass": " "
								};
								var tmpRow = {};
								newRow = $.extend(true, dataModelRows, newRow);
								vouRowDataList[j] = $.extend(tmpRow, newRow); //用空模板
							}
							if (!$.isNull(result.data.ysVouTempVo)) {
								var ysVouTempVo = result.data.ysVouTempVo;
								if (ysVouTempVo.templateName != '') {
									$('#modelName').val(ysVouTempVo.templateName); //模板名称
								}
								if (ysVouTempVo.description != '') {
									$('#modelDescp').val(ysVouTempVo.description); //模板描述
								}
								for (var j = 0; j < ysVouTempVo.vouDetailTems.length; j++) {
									var dataModelRows = {
										"vouSeq": " ",
										"descpt": " ",
										"drCr": " ",
										"accoName": " ",
										"ass": " ",
										"ysdrCr": " ",
										"ysaccoName": " ",
										"ysass": " "
									};
									var row = ysVouTempVo.vouDetailTems[j];
									if ($.isNull(result.data.cwVouTempVo)) {
										var newRow = {
											vouSeq: row.vouSeq,
											descpt: row.descpt,
											ysdrCr: row.drCr,
											ysaccoName: row.accoCode + ' ' + row.accoName
										} //和财务相同的Key要重命名
									} else {
										var newRow = {
											ysdrCr: row.drCr,
											ysaccoName: row.accoCode + ' ' + row.accoName
										} //和财务相同的Key要重命名
									}
									if (!$.isNull(row.detailAssTems)) {
										var accoAssList = [];
										// if (!$.isNull(row.accoSurplus)) {
										// 	accoAssList.push('差异项: ' + row.accoSurplusName + ' ');
										// }
										newRow.ysass = page.transAss(row.detailAssTems, accoAssList);
									}

									if (j > rows - 1) { //财务行数大于预算
										//vouRowGuildList.push(row.guid);//记录行号
										var dataModelRows = {
											"vouSeq": " ",
											"descpt": " ",
											"drCr": " ",
											"accoName": " ",
											"ass": " ",
											"ysdrCr": " ",
											"ysaccoName": " ",
											"ysass": " "
										};
										newRow = $.extend(true, dataModelRows, newRow);
										vouRowDataList.push(newRow); //不用空模板
									} else if ($.isNull(rows)) { //只有预算
										var dataModelRows = {
											"vouSeq": " ",
											"descpt": " ",
											"drCr": " ",
											"accoName": " ",
											"ass": " ",
											"ysdrCr": " ",
											"ysaccoName": " ",
											"ysass": " "
										};
										newRow = $.extend(true, dataModelRows, newRow);
										vouRowDataList.push(newRow); //不用空模板
									} else { //财务=预算
										var tempDataModelRows = {
											"ysdrCr": " ",
											"ysaccoName": " ",
											"ysass": " "
										};
										var tmpRow = vouRowDataList[j];
										newRow = $.extend(true, tempDataModelRows, newRow);
										vouRowDataList[j] = $.extend(true, tmpRow, newRow); //用空模板
									}
								}
							} else {
								var dataModelRows = {
									"vouSeq": " ",
									"descpt": " ",
									"drCr": " ",
									"accoName": " ",
									"ass": " ",
									"ysdrCr": " ",
									"ysaccoName": " ",
									"ysass": " "
								};
								var tmpRow = {};
								newRow = $.extend(true, dataModelRows, newRow);
								vouRowDataList[j] = $.extend(tmpRow, newRow); //用空模板
							}
							//vouRowDataList为datatable提供数据源
						}
						page.newTable(vouRowDataList);
					} else if (page.isParallel == '0') {
						vouRowDataList = [];
						if (!$.isNull(result.data)) {
							if (!$.isNull(result.data.cwVouTempVo)) {
								$('#modelName').val(result.data.cwVouTempVo.templateName); //模板名称
								$('#modelDescp').val(result.data.cwVouTempVo.description); //模板描述
								var cwVouTempVo = result.data.cwVouTempVo;

								var rows = cwVouTempVo.vouDetailTems.length;
								for (var i = 0; i < rows; i++) {
									var dataModelRows = {
										"vouSeq": " ",
										"descpt": " ",
										"drCr": " ",
										"accoName": " ",
										"ass": " "
									};
									var row = cwVouTempVo.vouDetailTems[i];
									var newRow = {
										vouSeq: row.vouSeq,
										descpt: row.descpt,
										drCr: row.drCr,
										accoName: row.accoCode + ' ' + row.accoName
									}
									if (!$.isNull(row.detailAssTems)) {
										var accoAssList = [];
										// if (!$.isNull(row.accoSurplus)) {
										// 	accoAssList.push('差异项: ' + row.accoSurplusName + ' ');
										// }
										newRow.ass = page.transAss(row.detailAssTems, accoAssList);
									}
									newRow = $.extend(true, dataModelRows, newRow);
									vouRowDataList.push(newRow); //用空模板
								}
							}
						}
						oTable.fnClearTable();
						oTable.fnAddData(vouRowDataList, true);
					}
				}
				//guohx  20200305 修改单位级查询不到系统级模板 故改为传节点的单位账套
				if (!$.isNull(vouGroupId)) {
					ufma.get("/gl/vouTemp/getTempPair/" + vouGroupId + "/" + nodeAgency + "/" + nodeAcctcode + "/" + page.rgCode + "/" + page.setYear, {}, callback);
				} else {
					if (page.isParallel == '1') {
						page.newTable([]);
					} else {
						// oTable.fnClearTable();
						// oTable.fnAddData([], true);
						page.newSingleTable();
					}
				}
			},
			//解析辅助核算项
			transAss: function (assData, accoAssList) {
				// var accoAssList = [];
				for (var i = 0; i < assData.length; i++) {
					var ass = assData[i];
					for (var j = 0; j < assistItems.length; j++) {
						var assInfo = assistItems[j].accItemCode;
						assInfo = assInfo.toLowerCase();
						assInfo = assInfo.replace('_i', 'I'); //自定义辅助
						var accitemCode = assInfo + 'Code'; //accItem01Code
						var accitemName = assInfo + 'Name'; //accItem01Name
						if (ass[accitemCode] && (!$.isNull(ass[accitemCode])) && ass[accitemCode] != '*') {
							accoAssList.push(assistItems[j].accItemName + ': ' + ass[accitemName]); //部门：01 部门01
						}
					}
				}
				return accoAssList.join(' ');
			},

			//获取科目体系 guohx
			getAccSys: function () {
				var url = "/gl/vouTemp/getAccsList";
				var argu = {
					"setYear": page.setYear,
					"rgCode": page.rgCode
				}
				$("#accSys").ufCombox({
					idField: "code",
					textField: "codeName",
					placeholder: "请选择科目体系",
					onChange: function (sender, data) {
						page.accsCode = data.code;
						page.getAssistItem(); //获取辅助核算项
						page.getModelTree("");
						$('#modelName').val(''); //模板名称
						$('#modelDescp').val(''); //模板描述
						if (data.accaCount == '1') {
							page.isParallel = '0';
							$("#singleModel").removeClass("hidden");
							$("#doubleModel").addClass("hidden");
							page.newSingleTable();
						} else if (data.accaCount == '2') {
							page.isParallel = '1';
							$("#doubleModel").removeClass("hidden");
							$("#singleModel").addClass("hidden");
							page.newTable([]);
						}
					}
				});
				ufma.ajaxDef(url, "get", argu, function (result) {
					$("#accSys").getObj().load(result.data);
					if (result.data.length > 0) {
						$("#accSys").getObj().val(result.data[0].code);
						page.accsCode = result.data[0].code;
					}
				});
			},
			//请求模板树 guohx
			getModelTree: function (param) {
				var url = "/gl/vouTemp/getGroupVouTree";
				if (page.isLeaf == 1) {
					var argu = {
						"setYear": page.setYear,
						"rgCode": page.rgCode,
						"agencyCode": page.agencyCode,
						"acctCode": page.acctCode,
						"accsCode": page.accsCode,
						"param": param
					}
				} else {
					var argu = {
						"setYear": page.setYear,
						"rgCode": page.rgCode,
						"agencyCode": page.agencyCode,
						"accsCode": page.accsCode,
						"param": param
					}
				}

				ufma.ajaxDef(url, "post", argu, function (result) {
					ufma.hideloading();
					var atreeArr = result.data;
					var znodes = [];
					for (var i = 0; i < atreeArr.length; i++) {
						var nodeObj = {};
						if (atreeArr[i].id == '11') {
							nodeObj.open = true;
						}
						nodeObj.id = atreeArr[i].id;
						nodeObj.pId = atreeArr[i].pId;
						nodeObj.accoName = atreeArr[i].accoName;
						nodeObj.accoCode = atreeArr[i].accoCode;
						nodeObj.dataFlag = atreeArr[i].dataFlag;
						nodeObj.chrId = atreeArr[i].chrId;
						nodeObj.isLeaf = atreeArr[i].isLeaf;
						nodeObj.vouGroupId = atreeArr[i].vouGroupId;
						nodeObj.agencyCode = atreeArr[i].agencyCode;
						nodeObj.acctCode = atreeArr[i].acctCode;
						nodeObj.isTemp = atreeArr[i].isTemp;
						nodeObj.groupLev = atreeArr[i].groupLev;
						nodeObj.seq = atreeArr[i].seq;
						if (atreeArr[i].isTemp == "N") {
							nodeObj.iconSkin = "icon-file";
						}
						znodes.push(nodeObj);
					}
					page.docTree(znodes);
				});
			},
			docTree: function (zNodes) {
				var setting = {
					data: {
						simpleData: {
							enable: true
						},
						key: {
							name: 'accoName'
						},
					},
					check: {
						enable: true,
						chkStyle: "checkbox",
						chkboxType: { "Y": "s", "N": "ps" }
					},
					edit: {
						drag: {
							autoExpandTrigger: true,
							isCopy: false,
							isMove: true,
							prev: true,
							inner: true,
							next: true,
							autoOpenTime: 300
						},
						enable: true,
						showRemoveBtn: false,
						showRenameBtn: false
					},
					view: {
						fontCss: getFontCss,
						showLine: false,
						showIcon: true,
						selectedMulti: false
					},
					callback: {
						onClick: zTreeOnClick,
						onCheck: zTreeOnCheck,
						beforeDrag: zTreeBeforeDrag,
						beforeDrop: zTreeBeforeDrop,
						onDrop: onDrop
					}
				};
				function zTreeOnClick(event, treeId, treeNode) {
					vouGroupId = treeNode.vouGroupId;
					$('#modelName').val(''); //模板名称
					$('#modelDescp').val(''); //模板描述	
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					var rootArray = ["1", "2", "3", "4", "5", "6", "7", "8", "11"];
					selectTreeObj = treeObj.getSelectedNodes()[0];
					nodeAgency = treeObj.getSelectedNodes()[0].agencyCode;
					nodeAcctcode = treeObj.getSelectedNodes()[0].acctCode;
					nodeIsTemp = treeObj.getSelectedNodes()[0].isTemp;
					selectedPId = treeObj.getSelectedNodes()[0].pId;
					selectedId = treeObj.getSelectedNodes()[0].id;
					page.vouGroupId = treeObj.getSelectedNodes()[0].vouGroupId;
					groupCode = treeObj.getSelectedNodes()[0].accoCode;
					groupName = treeObj.getSelectedNodes()[0].accoName;
					groupLev = treeObj.getSelectedNodes()[0].groupLev;
					isTemp = treeObj.getSelectedNodes()[0].isTemp;
					parentGroupLev = treeObj.getSelectedNodes()[0].getParentNode().groupLev;
					page.getTableData(vouGroupId);
					if ($.inArray(selectedId, rootArray) >= 0) {
						selectedPId = "";
					}
					if (treeNode.checked) {
						treeObj.checkNode(treeNode, false, true);
					} else {
						treeObj.checkNode(treeNode, true, true);
					}
				};
				function zTreeOnCheck(event, treeId, treeNode) {
					var be = treeNode.checked;
					if (be) {
						var vouGroupIdChecked;
						vouGroupIdChecked = treeNode.vouGroupId;
						voutempSendList.push(vouGroupIdChecked);
					}
				};
				function zTreeBeforeDrag(event, treeId, treeNode) {
					if ((nodeAgency == "*") || (selectedId == page.agencyCode)) { //当选中拖拽节点是系统模板下节点或自由模板 不可拖拽
						return false;
					} else {
						return true;
					}
				};
				//用于捕获节点拖拽操作结束之前的事件回调函数，并且根据返回值确定是否允许此拖拽操作
				function zTreeBeforeDrop(treeId, treeNodes, targetNode, moveType) {
					if ($.isNull(selectedPId)) {
						ufma.showTip('请先点击一个节点进行拖拽操作!', function () {
						}, 'warnning');
						ufma.hideloading();
						return false;
					}
					if (targetNode.agencyCode == "*") {
						ufma.showTip('请将该节点在单位级分组或模板下进行拖拽!', function () {
						}, 'warnning');
						ufma.hideloading();
						return false;
					}
					if (treeNodes[0].agencyCode == "*") {
						ufma.showTip('拖拽功能仅支持在自有模板下操作!', function () {
						}, 'warnning');
						ufma.hideloading();
						return false;
					}
					if (moveType == "inner") {
						if (targetNode.isTemp == "Y") {
							if (treeNodes[0].isTemp == "Y") {
								ufma.showTip('请将模版拖动到目标分组中！', function () {
								}, 'warnning');
							} else {
								ufma.showTip('请将分组拖拽到一级分组或者自有模板下！', function () {
								}, 'warnning');
							}
							return false;
						} else {
							return true;
						}
					} else {
						return true;
					}
				};
				/**
					 *
					 * @param event 标准的 js event 对象
					 * @param treeId 目标节点 targetNode 所在 zTree 的 treeId，便于用户操控
					 * @param treeNodes 被拖拽的节点 JSON 数据集合<br>
					 *      如果拖拽操作为 移动，treeNodes 是当前被拖拽节点的数据集合。<br>
					 *      如果拖拽操作为 复制，treeNodes 是复制后 clone 得到的新节点数据。<br>
					 * @param targetNode 成为 treeNodes 拖拽结束的目标节点 JSON 数据对象。如果拖拽成为根节点，则 targetNode = null
					 * @param moveType 指定移动到目标节点的相对位置."inner"：成为子节点，"prev"：成为同级前一个节点，"next"：成为同级后一个节点.如果 moveType = null，表明拖拽无效
					 */
				//用于捕获节点拖拽操作结束的事件回调函数
				function onDrop(event, treeId, treeNodes, targetNode, moveType) {
					console.log(targetNode);
					//被拖拽节点是模板
					ufma.showloading("正在进行重排序, 请稍后...");

					if (treeNodes[0].isTemp == "Y") {
						var seq = '';
						var linkId = '';
						if (moveType) {
							switch (moveType) {
								//成为子节点
								case 'inner':
									seq = targetNode.children.length;
									linkId = targetNode.id;
									break;
								//成为同级前一个节点
								case 'prev':
									seq = targetNode.seq - 1;
									linkId = targetNode.pId;
									break;
								//成为同级后一个节点
								case 'next':
									if (targetNode.isTemp == "Y") {
										seq = 1;
									} else {
										seq = targetNode.seq + 1;
									}
									linkId = targetNode.pId;
									break;
								default:
									break;
							}
						}
						var origin = {
							"acctCode": page.acctCode,
							"agencyCode": page.agencyCode,
							"vouTemSeq": treeNodes[0].seq,
							"vouGroupId": treeNodes[0].vouGroupId,
							"linkId": selectedPId,
							"rgCode": page.rgCode,
							"setYear": page.setYear
						};
						var finish = {
							"acctCode": page.acctCode,
							"agencyCode": page.agencyCode,
							"vouTemSeq": seq,
							"vouGroupId": treeNodes[0].vouGroupId,
							"linkId": linkId,
							"rgCode": page.rgCode,
							"setYear": page.setYear
						}
						var argu = {
							"origin": origin,
							"finish": finish
						}
						var callback = function (result) {
							if (result.flag == 'success') {
								page.getModelTree(""); //获取模板树
								var treeObj = $.fn.zTree.getZTreeObj("docTree");
								var nodes = treeObj.getNodes();
								treeObj.expandNode(nodes[1], true, false, true);
								ufma.showTip('模板重排序成功！', function () {
								}, 'success');
							} else {
								ufma.showTip('模板重排序失败！', function () {
									ufma.hideloading();
								}, 'error');
							}
						};
						ufma.post("/gl/vouTemp/updateVouTemByDrag", argu, callback);
					} else {
						var seq = '';
						var pId = '';
						var groupLev = '';
						if (moveType) {
							switch (moveType) {
								//成为子节点
								case 'inner':
									seq = targetNode.children.length;
									pId = targetNode.id;
									groupLev = targetNode.groupLev + 1;
									break;
								//成为同级前一个节点
								case 'prev':
									seq = targetNode.seq - 1;
									pId = targetNode.pId;
									groupLev = targetNode.groupLev;
									break;
								//成为同级后一个节点
								case 'next':
									if (targetNode.isTemp == "Y") {
										seq = 1;
										if (targetNode.pId == page.agencyCode) {
											groupLev = 1;
										} else {
											groupLev = 2;
										}

									} else {
										seq = targetNode.seq + 1;
										groupLev = targetNode.groupLev;
									}
									pId = targetNode.pId;

									break;
								default:
									break;
							}
						}
						var origin = {};
						var finish = {};
						var argu = {
							"origin": origin,
							"finish": finish
						}
						origin.id = treeNodes[0].id;
						origin.pId = selectedPId;
						origin.groupLev = treeNodes[0].groupLev;
						origin.groupSeq = treeNodes[0].seq;
						origin.agencyCode = page.agencyCode;
						origin.acctCode = page.acctCode;
						origin.setYear = page.setYear;
						origin.rgCode = page.rgCode;
						finish.id = treeNodes[0].id;
						finish.pId = pId;
						finish.groupLev = groupLev;
						finish.groupSeq = seq;
						finish.agencyCode = page.agencyCode;
						finish.acctCode = page.acctCode;
						finish.setYear = page.setYear;
						finish.rgCode = page.rgCode;

						var callback = function (result) {
							if (result.flag == 'success') {
								ufma.showTip('分组重排序成功！', function () {
									page.getModelTree(""); //获取模板树
									var treeObj = $.fn.zTree.getZTreeObj("docTree");
									var nodes = treeObj.getNodes();
									treeObj.expandNode(nodes[1], true, true, true);
								}, 'success');
							} else {
								ufma.showTip('分组重排序失败！', function () {
									ufma.hideloading();
								}, 'error');
							}
						};
						ufma.post("/gl/vouTemp/updateTemGroupByDrag", argu, callback);
					}

				};
				//节点名称超出长度 处理方式
				function addDiyDom(treeId, treeNode) {
					var spaceWidth = 5;
					var switchObj = $("#" + treeNode.tId + "_switch"),
						icoObj = $("#" + treeNode.tId + "_ico");
					switchObj.remove();
					icoObj.before(switchObj);
					if (treeNode.level > 1) {
						var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
						switchObj.before(spaceStr);
					}
					var spantxt = $("#" + treeNode.tId + "_span").html();
					if (spantxt.length > 16) {
						spantxt = spantxt.substring(0, 16) + "...";
						$("#" + treeNode.tId + "_span").html(spantxt);
					}
				}

				function focusKey(e) {
					if (key.hasClass("empty")) {
						key.removeClass("empty");
					}
				}

				function blurKey(e) {
					if (key.get(0).value === "") {
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
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					var nodes = zTree.getNodes();
					var allNodesArr = [];
					var allNodesStr;
					for (var i = 0; i < nodes.length; i++) {
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
					// var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					// var value = $.trim(key.get(0).value);
					// var keyType = "name";
					// if (key.hasClass("empty")) {
					// 	value = "";
					// }
					// if (lastValue === value) return;
					// lastValue = value;
					// if (value === "") return;
					// updateNodes(false);
					// nodeList = zTree.getNodesByParamFuzzy(keyType, value);
					// updateNodes(true);
					// var NodesArr = allNodesArr();
					// if (nodeList.length > 0) {
					// 	var index = NodesArr.indexOf(nodeList[0].id.toString());
					// 	$(".rpt-atree-box-body").scrollTop((30 * index));
					// }
				}

				function updateNodes(highlight) {
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					for (var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
					}
				}

				function getFontCss(treeId, treeNode) {
					return (!!treeNode.highlight) ? {
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
				$(document).ready(function () {
					var treeObj = $.fn.zTree.init($("#docTree"), setting, zNodes);
					var treecode = treeObj.getNodeByParam('id', page.agencyCode)
					if (isAgency) {
						treeObj.expandNode(treecode, true, true)
						setTimeout(function(){
							$("#docTree").scrollTop(0)
						},300)
					}
					key = $("#key");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						.bind("propertychange", searchNode)
						.bind("input", searchNode);
				});
			},

			//获得节点下面的所有子节点
			getAllChildrenNodes: function (treeNode, result) {
				if (treeNode.isParent) {
					var childrenNodes = treeNode.children;
					if (childrenNodes) {
						for (var i = 0; i < childrenNodes.length; i++) {
							result += "," + (childrenNodes[i].id);
							result = page.getAllChildrenNodes(childrenNodes[i], result);
						}
					}
				}
				return result;
			},
			//表格初始化
			newTable: function (tableData) {
				var theadhtml = ''
				theadhtml += '<thead id="modelTableThead">'
				theadhtml += '<tr>'
				theadhtml += '<th width="30" rowspan="2">序号</th>'
				theadhtml += '<th width="100" rowspan="2">摘要</th>'
				theadhtml += '<th colspan="3">财务会计</th>'
				theadhtml += '<th colspan="3">预算会计</th>'
				theadhtml += '</tr>'
				theadhtml += '<tr>'
				theadhtml += '<th width="40">借贷</th>'
				theadhtml += '<th width="100">科目</th>'
				theadhtml += '<th width="100">辅助核算</th>'
				theadhtml += '<th width="40">借贷</th>'
				theadhtml += '<th width="100">科目</th>'
				theadhtml += '<th width="100">辅助核算</th>'
				theadhtml += '</tr>'
				theadhtml += '</thead>'
				$("#modelTable").dataTable().fnDestroy();
				$("#modelTable").html(theadhtml);
				var toolBar = "#model-tool-bar";
				page.zsDataTable = $('#modelTable').DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true
					},
					"bPaginate": false, //翻页功能
					"ordering": false,
					"lengthChange": false,
					"paging": false,
					"bFilter": false, // 去掉搜索框
					"processing": true, // 显示正在加载中
					"bInfo": false, // 页脚信息
					"bSort": false, // 排序功能
					"scrollX": true,
					"data": tableData,
					"columns": [{
						title: "序号",
						data: "vouSeq",
						className: 'tc nowrap',
						width: 30
					},
					{
						data: "descpt",
						width: "100px",
						render: function (data, type, rowdata, meta) {
							if (data == '' || data == null) {
								data = ''
							}
							return '<span  title="' + data + '">' + data + '</span>'
						}
					}, //摘要
					{
						data: "drCr",
						width: "40px",
						render: function (rowid, rowdata, data) {
							if (data.drCr == '1') {
								return '借';
							} else if (data.drCr == '-1') {
								return '贷';
							} else {
								return ' ';
							}
						}
					}, //借贷
					{
						data: "accoName",
						width: "100px",
						render: function (data, type, rowdata, meta) {
							if (data == '' || data == null) {
								data = ''
							}
							return '<span  title="' + data + '">' + data + '</span>'
						}

					}, //科目
					{
						data: "ass",
						width: "100px",
						render: function (data, type, rowdata, meta) {
							if (data == '' || data == null) {
								data = ''
							}
							return '<span  title="' + data + '">' + data + '</span>'
						}
					}, //辅助核算
					{
						data: "ysdrCr",
						width: "40px",
						render: function (rowid, rowdata, data) {
							if (data.ysdrCr == '1') {
								return '借';
							} else if (data.ysdrCr == '-1') {
								return '贷';
							} else {
								return ' ';
							}
						}
					}, //借贷
					{
						data: "ysaccoName",
						width: "100px",
						render: function (data, type, rowdata, meta) {
							if (data == '' || data == null) {
								data = ''
							}
							return '<span  title="' + data + '">' + data + '</span>'
						}
					}, //科目
					{
						data: "ysass",
						width: "100px",
						render: function (data, type, rowdata, meta) {
							if (data == '' || data == null) {
								data = ''
							}
							return '<span  title="' + data + '">' + data + '</span>'
						}
					} //辅助核算
					],
					"dom": 'rt',
					"initComplete": function (settings, json) {
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');

					},
					"columnDefs": [],
					"drawCallback": function (settings) {

						page.zsTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						page.zsTable.css("width", "100%");
						//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						ufma.isShow(page.reslist);
						$(".dataTables_scrollBody").css("border-bottom-width", "0px");
					}
				});
				ufma.isShow(page.reslist);
				return page.zsDataTable;
			},

			newSingleTable: function () {
				var tableId = 'singleTable';
				$("#singleTable").dataTable().fnDestroy();
				$("#singleTable").html(''); //guohx 先清空动态加载列
				var columns = [{
					title: "序号",
					data: "vouSeq",
					className: 'tc nowrap',
					width: 30
				},
				{
					title: "摘要",
					data: "descpt",
					className: 'nowrap tr',
					render: function (data, type, rowdata, meta) {
						if (data == '' || data == null) {
							data = ''
						}
						return '<span  title="' + data + '">' + data + '</span>'
					}
				},
				{
					title: "借贷",
					data: "drCr",
					className: 'nowrap',
					render: function (rowid, rowdata, data) {
						if (data.drCr == '1') {
							return '借';
						} else if (data.drCr == '-1') {
							return '贷';
						} else {
							return ' ';
						}
					}
				},
				{
					title: "科目",
					data: "accoName",
					className: 'nowrap tr',
					render: function (data, type, rowdata, meta) {
						if (data == '' || data == null) {
							data = ''
						}
						return '<span  title="' + data + '">' + data + '</span>'
					}
				},
				{
					title: "辅助核算",
					data: 'ass',
					className: 'nowrap',
					render: function (data, type, rowdata, meta) {
						if (data == '' || data == null) {
							data = ''
						}
						return '<span  title="' + data + '">' + data + '</span>'
					}
				}
				];
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},

					"bPaginate”": false, //翻页功能
					"ordering": false,
					"lengthChange": false,
					"paging": false,
					"bFilter": false, // 去掉搜索框
					"processing": true, // 显示正在加载中
					"bInfo": false, // 页脚信息
					"bSort": false, // 排序功能
					"autoWidth": false,
					"bDestory": true,
					"serverSide": false,
					"ordering": false,
					"scrollX": true,
					columns: columns,
					data: [],
					"dom": 'rt',
					initComplete: function (settings, json) {

						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
					},
					fnCreatedRow: function (nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					},
					"drawCallback": function (settings) {

						ufma.isShow(page.reslist);
						$("#singleTable").find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$("#singleTable").css("width", "100%");
						//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						$(".dataTables_scrollBody").css("border-bottom-width", "0px");
					}
				}
				oTable = $("#" + tableId).dataTable(opts);
				ufma.isShow(page.reslist);
			},
			//打开新增分组界面
			openGroupingWin: function (action) {
				var treeObj = $.fn.zTree.getZTreeObj("docTree");
				if (action == "add") {
					var title = "新增分组";
					var data = {
						"agencyCode": page.agencyCode,
						"acctCode": page.acctCode,
						"setYear": page.setYear,
						"rgCode": page.rgCode,
						"accsCode": page.accsCode,
						"pId": selectedId,
						"action": action,
						"groupLev": parentGroupLev,
						"selectTreeObj": selectTreeObj
					}
				} else {
					var title = "编辑分组";
					var data = {
						"agencyCode": page.agencyCode,
						"acctCode": page.acctCode,
						"setYear": page.setYear,
						"rgCode": page.rgCode,
						"accsCode": page.accsCode,
						"id": selectedId,
						"pId": selectedPId,
						"action": action,
						"groupCode": groupCode,
						"groupName": groupName,
						"groupLev": groupLev,
						"nodeAgency": nodeAgency,
						"selectTreeObj": selectTreeObj
					}
				}
				ufma.open({
					url: "newGrouping.html",
					title: title,
					width: 400,
					height: 200,
					data: data,
					ondestory: function (result) {
						page.getModelTree(""); //获取模板树
						var treeObj = $.fn.zTree.getZTreeObj("docTree");
						var nodes = treeObj.getNodes();
						treeObj.expandNode(nodes[1], true, true, true);
					}
				});
			},
			//打开新增凭证模板界面
			openEditWin: function (action, modelId) {
				if (action == 'add') {
					var stitle = '新增凭证模板';
				} else if (action == 'edit') {
					stitle = '编辑凭证模板';
				}
				if (page.isParallel == '1') {
					var url = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=voumodel&action=voumodel'
					var agecnyopen = page.agencyCode
					var acctopen = page.acctCode
					if (isAgency == false) {
						url = 'newVouModel.html'
						if(action=='edit'){
							var treeObj = $.fn.zTree.getZTreeObj("docTree").getNodes()
							agecnyopen = treeObj[0].agencyCode
							acctopen = treeObj[0].acctCode
						}
					}
					ufma.open({
						url: url,
						title: stitle,
						width: 1250,
						data: {
							'action': action,
							"agencyCode": agecnyopen,
							"acctCode": acctopen,
							"setYear": page.setYear,
							"rgCode": page.rgCode,
							"accsCode": page.accsCode,
							"isAgency": isAgency,
							"modelId": modelId,
							"assistItems": assistItems,
							"linkId": selectedId,
							"linkPId": selectedPId,
							"nodeAgency": nodeAgency
						},
						ondestory: function (result) {
							if (result.action == 'ok') {
								page.getModelTree(""); //获取模板树
								if ($('body').data("code")) { //单位级
									var treeObj = $.fn.zTree.getZTreeObj("docTree");
									var nodes = treeObj.getNodes();
									if (!$.isNull(result.linkId)) { //展开自有模板节点
										if (result.linkId == page.agencyCode) {
											treeObj.expandNode(nodes[1], true, true, true);
										} else {
											for (var i = 0; i < nodes[1].children.length; i++) {
												for (var j = 0; j < nodes[1].children[i].children.length; j++) {
													if (result.linkId == nodes[1].children[i].children[j].id) {
														treeObj.expandNode(nodes[1].children[i].children[j], true, true, true);
														for (var k = 0; k < nodes[1].children[i].children[j].children.length; k++) {
															if (result.id == nodes[1].children[i].children[j].children[k].vouGroupId) {
																treeObj.selectNode(nodes[1].children[i].children[j].children[k]);
																selectedPId = treeObj.getSelectedNodes()[0].pId;
															}
														}

													}
												}
											}
										}
										page.getTableData(result.id);
										vouGroupId = result.id;
									}
								} else {
									var treeObj = $.fn.zTree.getZTreeObj("docTree");
									var nodes = treeObj.getNodes();
									if (!$.isNull(result.linkId)) {
										if (result.linkId == '99') {
											treeObj.expandNode(nodes[0].children[8], true, true, true);
										} else {
											for (var i = 0; i < nodes[0].children.length; i++) {
												for (var j = 0; j < nodes[0].children[i].children.length; j++) {
													if (result.linkId == nodes[0].children[i].children[j].id) {
														treeObj.expandNode(nodes[0].children[i].children[j], true, true, true);
														for (var k = 0; k < nodes[0].children[i].children[j].children.length; k++) {
															if (result.id == nodes[0].children[i].children[j].children[k].vouGroupId) {
																treeObj.selectNode(nodes[0].children[i].children[j].children[k]);
																selectedPId = treeObj.getSelectedNodes()[0].pId;
															}
														}

													}
												}
											}
										}
										page.getTableData(result.id);
										vouGroupId = result.id;
									}
								}
							}
						}
					});
				} else if (page.isParallel == '0') {
					var url = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=voumodel&action=voumodel';
					var agecnyopen = page.agencyCode
					var acctopen = page.acctCode
					if (isAgency == false) {
						url = 'newSingleVouModel.html'
						if(action=='edit'){
							var treeObj = $.fn.zTree.getZTreeObj("docTree").getNodes()
							agecnyopen = treeObj[0].agencyCode
							acctopen = treeObj[0].acctCode
						}
					}
					ufma.open({
						url: 'newSingleVouModel.html',
						title: stitle,
						width: 995,
						height: 450,
						data: {
							'action': action,
							"agencyCode": agecnyopen,
							"acctCode": acctopen,
							"setYear": page.setYear,
							"rgCode": page.rgCode,
							"accsCode": page.accsCode,
							"isAgency": isAgency,
							"modelId": modelId,
							"assistItems": assistItems,
							"linkId": selectedId,
							"linkPId": selectedPId
						},
						ondestory: function (result) {
							if (result.action == 'ok') {
								page.getModelTree(""); //获取模板树
								if ($('body').data("code")) { //单位级
									var treeObj = $.fn.zTree.getZTreeObj("docTree");
									var nodes = treeObj.getNodes();
									if (!$.isNull(result.id)) { //展开自有模板节点
										if (nodes[1].id == page.agencyCode) {
											treeObj.expandNode(nodes[1], true, true, true);
											for (var j = 0; j < nodes[1].children.length; j++) {
												if (nodes[1].children[j].vouGroupId == result.id) {
													treeObj.selectNode(nodes[1].children[j]);
													selectedPId = treeObj.getSelectedNodes()[0].pId;
												}
											}
										}
										page.getTableData(result.id);
										vouGroupId = result.id;
									}
								} else {
									var treeObj = $.fn.zTree.getZTreeObj("docTree");
									var nodes = treeObj.getNodes();
									if (!$.isNull(result.id)) {
										// for (var i = 0, l = nodes[0].children.length; i < l; i++) {
										// 	if (nodes[0].children[i].id == '99') {
										// 		treeObj.expandNode(nodes[0].children[i], true, true, true);
										// 		for (var j = 0; j < nodes[0].children[i].children.length; j++) {
										// 			if (nodes[0].children[i].children[j].vouGroupId == result.id) {
										// 				treeObj.selectNode(nodes[0].children[i].children[j]);
										// 			}
										// 		}
										// 	}
										// }
										// page.getTableData(result.id);
										// vouGroupId = result.id;
										if (result.linkId == '99') {
											treeObj.expandNode(nodes[0].children[8], true, true, true);
										} else {
											for (var i = 0; i < nodes[0].children.length; i++) {
												if (nodes[0].children[i].children != undefined) {
													for (var j = 0; j < nodes[0].children[i].children.length; j++) {
														if (result.linkId == nodes[0].children[i].children[j].id) {
															treeObj.expandNode(nodes[0].children[i].children[j], true, true, true);
															for (var k = 0; k < nodes[0].children[i].children[j].children.length; k++) {
																if (result.id == nodes[0].children[i].children[j].children[k].vouGroupId) {
																	treeObj.selectNode(nodes[0].children[i].children[j].children[k]);
																	selectedPId = treeObj.getSelectedNodes()[0].pId;
																}
															}

														}
													}
												}
											}
										}
										page.getTableData(result.id);
										vouGroupId = result.id;
									}
								}
								if (page.isParallel == '0') {
									page.newSingleTable();
								} else if (page.isParallel == '1') {
									page.newTable([]); //清空表格数据
								}
							}
						}
					});
				}
			},
			//删除模板
			deleteModel: function () {
				var treeObj = $.fn.zTree.getZTreeObj("docTree");
				var nodes = treeObj.getCheckedNodes(true);
				var delData = [];
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (!$.isNull(nodes[i].vouGroupId) && (nodes[i].getCheckStatus().half != true)) {
						delData.push({
							agencyCode: nodes[i].agencyCode,
							vouGroupId: nodes[i].vouGroupId
						});
					}
				}
				if (delData.length == 0 && nodes.length == 0) {
					ufma.showTip('请先勾选您要操作的凭证模板！', "warning");
					return false;
				} else if (delData.length == 0 && nodes.length != 0) {
					ufma.showTip('您勾选的模板不可删除，请选择其他模板', "warning");
					return false;
				}
				ufma.confirm('您确定要删除所选择的凭证模板吗？', function (ac) {
					if (ac) {
						var argu = {
							"delParams": delData,
							"agencyCode": page.agencyCode
						};
						var callback = function (result) {
							if (result.flag == 'success') {
								ufma.showTip('凭证模板已删除！', function () {
									if (page.isParallel == '0') {
										page.newSingleTable();
									} else if (page.isParallel == '1') {
										page.newTable([]); //清空表格数据
									}
									page.getModelTree(""); //获取模板树
									var treeObj = $.fn.zTree.getZTreeObj("docTree");
									var nodes = treeObj.getNodes();
									treeObj.expandNode(nodes[1], true, true, true);
									$('#modelName').val(''); //模板名称
									$('#modelDescp').val(''); //模板描述
								}, 'success');
							}
						};
						ufma.post("/gl/vouTemp/delVouTems", argu, callback);
					}
				}, {
						'type': 'warning'
					});
			},
			//删除分组
			deleteGroup: function () {
				var treeObj = $.fn.zTree.getZTreeObj("docTree");
				var nodes = treeObj.getCheckedNodes(true);
				var ids = [];
				var pIds = [];
				var delData = {};
				for (var i = 0, l = nodes.length; i < l; i++) {
					if (!$.isNull(nodes[i].id) && (nodes[i].isTemp == "N") && (nodes[i].getCheckStatus().half != true)) {
						ids.push(nodes[i].id);
						pIds.push(nodes[i].pId);
					}
				}
				if (ids.length == 0 && nodes.length == 0) {
					ufma.showTip('请先勾选您要操作的分组！', "warning");
					return false;
				} else if (ids.length == 0 && nodes.length != 0) {
					ufma.showTip('您勾选的分组不可删除，请选择其他模板', "warning");
					return false;
				}
				delData = {
					"ids": ids,
					"pIds": pIds,
					"agencyCode": page.agencyCode,
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"acctCode": page.acctCode
				}
				ufma.confirm('您确定要删除所选择的分组吗？', function (ac) {
					if (ac) {
						var callback = function (result) {
							if (result.flag == 'success') {
								ufma.showTip('分组已删除！', function () {
									page.getModelTree(""); //获取模板树
									var treeObj = $.fn.zTree.getZTreeObj("docTree");
									var nodes = treeObj.getNodes();
									treeObj.expandNode(nodes[1], true, true, true);
								}, 'success');
							}
						};
						ufma.post("/gl/vouTemp/deleteTemGroup", delData, callback);
					}
				}, {
						'type': 'warning'
					});
			},

			//初始化页面
			initPage: function () {
				var pfData = ufma.getCommonData();
				page.rgCode = pfData.svRgCode;
				page.setYear = pfData.svSetYear;
				page.agencyCode = pfData.svAgencyCode;
				page.acctCode = pfData.svAcctCode;
				//需要根据自己页面写的ID修改
				page.zsTable = $('#modelTable'); //当前table的ID
				page.zsThead = $('#modelTableThead'); //当前table的头部ID
				if ($('body').data("code")) { //data-code 有值则为单位级

					//获取单位树
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						valueField: "id",
						textField: "codeName",
						readonly: false,
						placeholder: "请选择单位",
						icon: "icon-unit",
						onchange: function (data) {
							page.agencyCode = data.id;
							page.isLeaf = data.isLeaf;
							if (page.isLeaf == 1) { //最末级单位
								//账套选择
								page.cbAcct = $("#cbAcct").ufmaCombox2({
									valueField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									onchange: function (data) {
										page.acctCode = data.code;
										page.accsCode = data.accsCode;
										page.getModelTree(""); //获取模板树
										page.getAssistItem(); //获取辅助核算项
										page.isParallel = data.isParallel;
										$('#dtToolbar').html("");
										if (page.isParallel == '0') {
											$("#singleModel").removeClass("hidden");
											$("#doubleModel").addClass("hidden");
											page.newSingleTable();
										} else if (page.isParallel == '1') {
											$("#doubleModel").removeClass("hidden");
											$("#singleModel").addClass("hidden");
											page.newTable([]);
										}
									}
								});
								//改变单位,账套选择内容改变
								var url = '/gl/eleCoacc/getRptAccts';
								var callback = function (result) {
									vbacctData = result.data
									page.cbAcct = $("#cbAcct").ufmaCombox2({
										data: result.data
									});
									var jumpAcctCode = page.getUrlParam("jumpAcctCode");
									if (!$.isNull(jumpAcctCode)) {
										page.cbAcct.val(jumpAcctCode);
									} else {
										var svFlag = $.inArrayJson(result.data, "code", pfData.svAcctCode);
										if (svFlag != undefined) {
											page.cbAcct.val(pfData.svAcctCode);
										} else {
											if (result.data.length > 0) {
												page.cbAcct.val(result.data[0].code);
												page.accsCode = result.data[0].accsCode;
												page.isParallel = result.data[0].isParallel;
											} else {
												page.cbAcct.val('');
												page.acctCode = ""; //修改单位没有账套时，可以复制模板成功的bug guohx
											}
										}
									}

								}
								ufma.ajaxDef(url, 'get', { "agencyCode": page.agencyCode,"userId":pfData.svUserId,"setYear":pfData.svSetYear }, callback);
								$("#controlAccsys").addClass("hide");
								$("#cbAcct").removeClass("hide");
								$("#btn-add").removeClass("hidden");
								$("#btn-edit").removeClass("hidden");
								$("#btn-del").removeClass("hidden");
								$("#btn-copy").removeClass("hidden");
							} else {
								$("#controlAccsys").removeClass("hide");
								$("#cbAcct").addClass("hide");
								$("#btn-add").removeClass("hidden");
								$("#btn-edit").removeClass("hidden");
								$("#btn-del").removeClass("hidden");
								$("#btn-copy").removeClass("hidden");
								page.getAccSys(); //获取科目体系
							}
						}
					});
					ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", { "setYear": page.setYear, "rgCode": page.rgCode }, function (result) {
						page.cbAgency = $("#cbAgency").ufmaTreecombox2({
							data: result.data
						});
						var agyCode = $.inArrayJson(result.data, "id", page.agencyCode);
						if (agyCode != undefined) {
							page.cbAgency.val(pfData.svAgencyCode);
						} else {
							page.cbAgency.val(result.data[0].id);
						}
					});
					isAgency = true;
				} else {
					page.agencyCode = "*";
					page.acctCode = "*";
					page.getAccSys(); //获取科目体系
					isAgency = false;
				}

				page.getAssistItem(); //获取辅助核算项
				// page.getModelTree(""); //获取模板树
			},
			initPageNew: function () {

				$('#btn-add').click(function () {
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					var treeNodes = treeObj.getSelectedNodes()[0];
					if ($.isNull(treeNodes)) { //未选中任何节点点击新增
						$('#rptPlanList').addClass('hide');
						ufma.showTip('请先选中一个分组或者模板节点进行新增！', "warning");
						return false;
					}
					if ((treeNodes.isTemp == "Y") && (treeNodes.id != page.agencyCode)) { //模板上不可以新增
						$('#rptPlanList').addClass('hide');
						ufma.showTip('不可以在模板节点上新增模板！', "warning");
						return false;
					} else if (page.agencyCode == "*") {
						page.addModel();
					}
					else {
						$('#rptPlanList').removeClass('hide');
						$('#tixian').removeClass('hide');
					}
				});
				$('#btn-add').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'south', //north|south|west|east
					content: "#rptPlanList"
				});
			},
			addModel: function () {
				if ($('body').data("code")) { //data-code 有值则为单位级
					if (!$.isNull(selectedId)) {
						if (nodeAgency != page.agencyCode) {
							ufma.showTip('单位级不能新增系统级模板！', "warning");
							return false;
						}
					}
					if (!$.isNull(page.vouGroupId)) {
						ufma.showTip('不可以在模板节点上新增模板！请重新选择一个非模板节点', "warning");
						return false;
					}
					if (selectedPId == '') {

						ufma.showTip('不可以在系统级分类节点上新增模板！请重新选择一个非分类节点', "warning");
						return false;
					}
					if (selectedPId == undefined && selectedId == undefined) {
						nodeAgency = page.agencyCode
						selectedPId = null
						selectedId = page.agencyCode
						page.vouGroupId = ''
					}
					page.openEditWin('add', '');
				} else {
					if (!$.isNull(page.vouGroupId)) {
						ufma.showTip('不可以在模板节点上新增模板！请重新选择一个非模板节点', "warning");
						return false;
					}
					if (selectedPId == '') {
						ufma.showTip('不可以在系统级分类节点上新增模板！请重新选择一个非分类节点', "warning");
						return false;
					}
					if (nodeAgency == undefined) {
						nodeAgency = '*'
						selectedPId = 11
						selectedId = 99
						page.vouGroupId = ''
					}
					page.openEditWin('add', '');
				}
			},
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
			onEventListener: function () {
				//新增分组
				$('#addGrouping').click(function () {
					if ($('body').data("code")) { //data-code 有值则为单位级
						if (nodeAgency == "*") { //系统模板下节点
							ufma.showTip('不可以在系统级节点上新增分组！请重新选择一个节点', "warning");
							return false;
						}
						page.openGroupingWin("add");
						//二级分组下不可新增分组
					} else {
						if (nodeAgency == "*") { //系统模板下节点
							ufma.showTip('不可以在系统级节点上新增分组！请重新选择一个节点', "warning");
							return false;
						}
						if (selectedPId == '') {
							selectedPId = 11;
						}
						page.openGroupingWin("add");
					}
				});
				//新增模板
				$('#addModel').click(function () {
					page.addModel();
				});
				//修改凭证模板
				$("#btn-edit").on("click", function () {

					// if ($.isNull(vouGroupId)) {
					// 	ufma.showTip('请选择一个末级节点进行修改', "warning");
					// 	return false;
					// }
					if (nodeIsTemp == "Y") {
						page.openEditWin('edit', vouGroupId);
					} else {
						if ((nodeAgency == '*')) {
							ufma.showTip('系统级分组不可以修改!', "warning");
							return false;
						}else if ((nodeAgency == undefined)) {
							ufma.showTip('请先选中一个模板节点进行修改！', "warning");
							return false;
						}
						page.openGroupingWin("edit");
					}
				})
				//删除凭证模板
				$("#btn-del").on("click", function () {
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					var nodes = treeObj.getCheckedNodes(true);
					var onetype = false;
					var twotype = false;
					var threetype = false;
					for (var i = 0, l = nodes.length; i < l; i++) {
						if ((nodes[i].id != page.agencyCode) && (nodes[i].getCheckStatus().half != true)) {
							if (nodes[i].isTemp == "Y") {
								onetype = true;
							} else if (nodes[i].agencyCode == "*") {
								threetype = true;
							} else {
								twotype = true;
							}
						}
					}
					if (onetype && twotype) {
						ufma.showTip('模板分组不可同时删除,请先勾选模板进行删除!', function () { }, 'warnning');
						return false;
					} else if (onetype) {
						page.deleteModel();
					} else if (threetype) {
						ufma.showTip('系统级科目节点不可删除!', function () { }, 'warnning');
						return false;
					} else {
						page.deleteGroup();
					}
				})
				//复制模板到单位级
				$('#btn-copy').on('click', function (e) {
					$("#btn-copy").attr("disabled", true);
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					var nodes = treeObj.getCheckedNodes(true);
					var copyData = [];
					for (var i = 0, l = nodes.length; i < l; i++) {
						if (!$.isNull(nodes[i].vouGroupId)) {
							copyData.push(nodes[i].vouGroupId);
						}
					}
					if (copyData.length == 0) {
						ufma.hideloading();
						ufma.alert('请先勾选您要操作的凭证模板！', "warning");
						$("#btn-copy").attr("disabled", false);
						return false;
					}
					page.modal = ufma.selectBaseTree({
						url: '/gl/vouTemp/getAgencyAcctTreeCopy?accsCode=' + page.accsCode + '&agencyCode=' + page.agencyCode,
						rootName: '所有单位',
						width: 650,
						title: '选择单位',
						bSearch: true, //是否有搜索框
						filter: { //其它过滤条件
							'单位类型': { //标签
								ajax: '/gl/vouTemp/AGENCY_TYPE_CODE', //地址
								formControl: 'combox', //表单元素
								data: {},
								idField: 'ENU_CODE',
								textField: 'ENU_NAME',
								filterField: 'agencyType'
							}
						},
						buttons: { //底部按钮组
							'确认复制': {
								class: 'btn-primary btn-senddown-sure',
								action: function (data) {
									$(".btn-senddown-sure").attr("disabled", true);
									if (data.length == 0) {
										ufma.alert('请选择单位账套！', "warning");
										$(".btn-senddown-sure").attr("disabled", false);
										return false;
									}
									ufma.showloading("正在复制模板, 请稍后...");
									var datas = [];
									for (key in data) {
										if (data[key].isFinal == 1) {
											datas.push({
												"toAgencyCode": data[key].pCode,
												'toAcctCode': data[key].code
											});
										}
									}
									var argu = {
										"accsCode": page.accsCode,
										"vouGroupId": copyData,
										'data': datas
									};
									ufma.post('/gl/vouTemp/sendVouTemp', argu, function (result) {
										// ufma.hideloading();
										ufma.showTip(result.msg, function () {
											$("#btn-copy").attr("disabled", false);
											page.modal.close();
											page.getModelTree(""); //获取模板树
											var treeObj = $.fn.zTree.getZTreeObj("docTree");
											var nodes = treeObj.getNodes();
											treeObj.expandNode(nodes[1], true, true, true);
											treeObj.checkAllNodes(false);
										}, result.flag);
									});
									setTimeout(function () {
										$(".btn-senddown-sure").attr("disabled", false);
										ufma.hideloading()
									}, 500)
								}
							},
							'取消': {
								class: 'btn-default',
								action: function () {
									$("#btn-copy").attr("disabled", false);
									page.modal.close();
								}
							}
						}
					});
					setTimeout(function () {
						$("#btn-copy").attr("disabled", false);
						ufma.hideloading()
					}, 500)
				});
				//模糊搜索左侧模板树
				$('#btn-search').on('click', function (e) {
					var param = $('#key').val();
					page.getModelTree(param);
					var treeObj = $.fn.zTree.getZTreeObj("docTree"); //获取树对象
					treeObj.expandAll(true); //默认展开
				});
				//导出  guohx  
				$('#btnExport').click(function () {
					if (page.isParallel == '1') {
						$("#modelTable").ufTableExport({
							fileName: "凭证模板", // 导出表名
							ignoreColumn: "-1" // 不需要导出的LIE
						});
					} else {
						$("#singleTable").ufTableExport({
							fileName: "凭证模板", // 导出表名
							ignoreColumn: "-1" // 不需要导出的LIE
						});
					}

				});

				$(window).on('resize scroll', function () {
					if (page.isLeaf == 1) { //data-code 有值则为单位级
						var winH = $(window).height();
						var winTop = $('.workspace-top').outerHeight(true);
						var workH = winH - winTop - 32;
						var sc = $(window).scrollTop();
						var offsetTop = sc < winTop ? 0 : sc - winTop;
						workH = workH + (sc < winTop ? sc : winTop);
						$('#wrapLeft').css({ height: workH + 'px', 'overflow': 'hidden', 'top': offsetTop + 'px' });
						var treeH = workH - $('#wrapLeft .bottom-button').outerHeight(true) - $('#wrapLeft .ma-input-group').outerHeight(true);
						$('#wrapLeft .ma-cont-box').css({ height: treeH + 'px', 'overflow': 'auto' });
					} else {
						var winH = $(window).height();
						var winTop = $('.workspace-top').outerHeight(true);
						var workH = winH - winTop - 32;
						var sc = $(window).scrollTop();
						var offsetTop = sc < winTop ? 0 : sc - winTop;
						workH = workH + (sc < winTop ? sc : winTop);
						$('#wrapLeft').css({ height: workH + 'px', 'overflow': 'hidden', 'top': offsetTop + 'px' });
						var treeH = workH - $('#wrapLeft .bottom-button').outerHeight(true) - $('#wrapLeft .ma-input-group').outerHeight(true) - 40;
						$('#wrapLeft .ma-cont-box').css({ height: treeH + 'px', 'overflow': 'auto' });
					}
				}).trigger('resize');
				//回车键搜索
				$(document).on("keydown", "#key", function (event) {
					event = event || window.event;
					if (event.keyCode == 13) {
						$('#btn-search').trigger('click')
						event.preventDefault();
						event.returnValue = false;
						event.keyCode == 0
						return false;
					}
					if (page.isParallel == '0') {
						$("#singleModel").removeClass("hidden");
						$("#doubleModel").addClass("hidden");
						page.newSingleTable();
					} else if (page.isParallel == '1') {
						$("#doubleModel").removeClass("hidden");
						$("#singleModel").addClass("hidden");
						page.newTable([]);
					}
					$('#modelName').val(''); //模板名称
					$('#modelDescp').val(''); //模板描述
				});
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				ufma.parse(page.namespace);
				this.initPage();
				page.initPageNew();
				this.onEventListener();
				ufma.parseScroll();
			}
		}
	}();
	page.init();
});