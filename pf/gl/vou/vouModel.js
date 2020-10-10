$(function () {
	window._close = function (state,title) {
		if (window.closeOwner) {
			if(title == undefined){
				title=true
			}
			var data = {
				action: state,
				title:title,
				result: {},
				voutempSendList: voutempSendList,
				//voutempText: ''
				voutempText: voutempText,//bug79089/79088/79072
				nodeAgency: nodeAgency,
				nodeAcctcode: nodeAcctcode
			};
			window.closeOwner(data);
		}
	}
	function configupdate(key, value) {
		var data = {
			"agencyCode": page.agencyCode,
			"acctCode": page.acctCode,
			"menuId": "f24c3333-9799-439a-94c9-f0cdf120305d",
			"configKey": key,
			"configValue": value
		}
		ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function (data) { })
	}
	var voutempSendList;
	var insertvou = false;
	var sortvouModal = false
	var voutempText;//bug79089/79088/79072
	var nodeAgency;  //选中节点的单位
	var nodeAcctcode; //选中节点的账套
	var page = function () {
		var zsDataTable;//全局datatable对象
		var zsTable;//全局table的ID
		var zsThead;//全局table的头部ID
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
		var isParallel;

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
								$('#modelName').val(result.data.cwVouTempVo.templateName); //模板名称
								$('#modelDescp').val(result.data.cwVouTempVo.description); //模板描述
								var cwVouTempVo = result.data.cwVouTempVo;
								var rows = cwVouTempVo.vouDetailTems.length;
								for (var i = 0; i < rows; i++) {
									//定义空模板 避免财务预算有一个情况下 绘制表格报错
									var dataModelRows = { "vouSeq": " ", "descpt": " ", "drCr": " ", "accoName": " ", "ass": " ", "ysdrCr": " ", "ysaccoName": " ", "ysass": " " };
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
								var dataModelRows = { "vouSeq": " ", "descpt": " ", "drCr": " ", "accoName": " ", "ass": " ", "ysdrCr": " ", "ysaccoName": " ", "ysass": " " };
								var tmpRow = {};
								newRow = $.extend(true, dataModelRows, newRow);
								vouRowDataList[j] = $.extend(tmpRow, newRow); //用空模板
							}
							if (!$.isNull(result.data.ysVouTempVo)) {
								var ysVouTempVo = result.data.ysVouTempVo;
								$('#modelName').val(ysVouTempVo.templateName); //模板名称
								$('#modelDescp').val(ysVouTempVo.description); //模板描述
								for (var j = 0; j < ysVouTempVo.vouDetailTems.length; j++) {
									var dataModelRows = { "vouSeq": " ", "descpt": " ", "drCr": " ", "accoName": " ", "ass": " ", "ysdrCr": " ", "ysaccoName": " ", "ysass": " " };
									var row = ysVouTempVo.vouDetailTems[j];
									if ($.isNull(result.data.cwVouTempVo)) {
										var newRow = { vouSeq: row.vouSeq, descpt: row.descpt, ysdrCr: row.drCr, ysaccoName: row.accoCode + ' ' + row.accoName }//和财务相同的Key要重命名
									} else {
										var newRow = { ysdrCr: row.drCr, ysaccoName: row.accoCode + ' ' + row.accoName }//和财务相同的Key要重命名
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
										var dataModelRows = { "vouSeq": " ", "descpt": " ", "drCr": " ", "accoName": " ", "ass": " ", "ysdrCr": " ", "ysaccoName": " ", "ysass": " " };
										newRow = $.extend(true, dataModelRows, newRow);
										vouRowDataList.push(newRow); //不用空模板
									} else if ($.isNull(rows)) { //只有预算
										var dataModelRows = { "vouSeq": " ", "descpt": " ", "drCr": " ", "accoName": " ", "ass": " ", "ysdrCr": " ", "ysaccoName": " ", "ysass": " " };
										newRow = $.extend(true, dataModelRows, newRow);
										vouRowDataList.push(newRow); //不用空模板
									} else {  //财务=预算
										var tempDataModelRows = { "ysdrCr": " ", "ysaccoName": " ", "ysass": " " };
										var tmpRow = vouRowDataList[j];
										newRow = $.extend(true, tempDataModelRows, newRow);
										vouRowDataList[j] = $.extend(true, tmpRow, newRow); //用空模板
									}
								}
							} else {
								var dataModelRows = { "vouSeq": " ", "descpt": " ", "drCr": " ", "accoName": " ", "ass": " ", "ysdrCr": " ", "ysaccoName": " ", "ysass": " " };
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
									var dataModelRows = { "vouSeq": " ", "descpt": " ", "drCr": " ", "accoName": " ", "ass": " " };
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
				if (!$.isNull(vouGroupId)) {
					ufma.get("/gl/vouTemp/getTempPair/" + vouGroupId + "/" + nodeAgency + "/" + nodeAcctcode + "/" + page.rgCode + "/" + page.setYear, {}, callback);
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
						assInfo = assInfo.replace('_i', 'I');//自定义辅助
						var accitemCode = assInfo + 'Code';//accItem01Code
						var accitemName = assInfo + 'Name';//accItem01Name
						if (ass[accitemCode] && (!$.isNull(ass[accitemCode])) && ass[accitemCode] != '*') {
							accoAssList.push(assistItems[j].accItemName + ': ' + ass[accitemName]);//部门：01 部门01
						}
					}
				}
				return accoAssList.join(' ');
			},

			//请求模板树 guohx
			getModelTree: function (param) {

				var url = "/gl/vouTemp/getGroupVouTree";
				var argu = {
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"accsCode": page.accsCode,
					"param": param,
					'isaccfullname': window.ownerData.isaccfullname
				}
				if($("#sortvouModal").is(":checked")){
					argu.orderByUseCount = 1
				}
				ufma.ajaxDef(url, "post", argu, function (result) {//修改成同步，影响了搜索后自动展开所有节点问题
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
						nodeObj.levNum = atreeArr[i].levNum;
						nodeObj.accoCode = atreeArr[i].accoCode;
						nodeObj.agencyCode = atreeArr[i].agencyCode;
						nodeObj.acctCode = atreeArr[i].acctCode;
						nodeObj.dataFlag = atreeArr[i].dataFlag;
						nodeObj.chrId = atreeArr[i].chrId;
						nodeObj.isLeaf = atreeArr[i].isLeaf;
						nodeObj.vouGroupId = atreeArr[i].vouGroupId;
						nodeObj.isTemp = atreeArr[i].isTemp;
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
					view: {
						fontCss: getFontCss,
						showLine: false,
						showIcon: true,
						selectedMulti: false
					},
					callback: {
						onClick: zTreeOnClick
					}
				};
				function zTreeOnClick(event, treeId, treeNode) {
					var be = treeNode.checked;
					if (!be) {
						vouGroupId = treeNode.vouGroupId;
						var treeObj = $.fn.zTree.getZTreeObj("docTree");
						nodeAgency = treeObj.getSelectedNodes()[0].agencyCode;
						nodeAcctcode = treeObj.getSelectedNodes()[0].acctCode;
						$('#modelName').val(''); //模板名称
						$('#modelDescp').val(''); //模板描述
						page.getTableData(vouGroupId);

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
				var lastValue = "", nodeList = [], fontCss = {};
				function clickRadio(e) {
					lastValue = "";
					searchNode(e);
				}
				function allNodesArr() {
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					//var zTree = $.fn.zTree.getZTreeObj("atree");
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
					// //var zTree = $.fn.zTree.getZTreeObj("atree");
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
					//var zTree = $.fn.zTree.getZTreeObj("atree");
					for (var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
					}
				}
				function getFontCss(treeId, treeNode) {
					return (!!treeNode.highlight) ? { color: "#F04134", "font-weight": "bold" } : { color: "#333", "font-weight": "normal" };
				}
				function filter(node) {
					return !node.isParent && node.isFirstNode;
				}
				var key;
				$(document).ready(function () {
					var treeObj = $.fn.zTree.init($("#docTree"), setting, zNodes);
					var treecode = treeObj.getNodeByParam('id', page.agencyCode)
					treeObj.expandNode(treecode, true, true)
					setTimeout(function(){
						$("#docTree").scrollTop(0)
					},300)
					// treeObj.expandAll(false);  //默认展开
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
				//var toolBar = "#model-tool-bar";
				page.zsDataTable = $('#modelTable').DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true
					},
					"bPaginate”": false, //翻页功能
					"ordering": false,
					"lengthChange": false,
					"paging": false,
					"bFilter": false, // 去掉搜索框
					"processing": true,// 显示正在加载中
					"bInfo": false,// 页脚信息
					"bSort": false, // 排序功能
					"data": tableData,
					"columns": [
						{
							title: "序号",
							data: "vouSeq",
							className: 'tc nowrap',
							width: 30
						},
						{
							data: "descpt",
							width: "100px",
							class: "tr",
							render: function (data, type, rowdata, meta) {
								if (data == '' || data == null) {
									data = ''
								}
								return '<span  title="' + data + '">' + data + '</span>'
							}
						},//摘要
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
						},//借贷
						{
							data: "accoName",
							width: "100px",
							render: function (data, type, rowdata, meta) {
								if (data == '' || data == null) {
									data = ''
								}
								return '<span  title="' + data + '">' + data + '</span>'
							}
						},//科目
						{
							data: "ass",
							width: "100px",
							render: function (data, type, rowdata, meta) {
								if (data == '' || data == null) {
									data = ''
								}
								return '<span  title="' + data + '">' + data + '</span>'
							}
						},//辅助核算
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
						},//借贷
						{
							data: "ysaccoName",
							width: "100px",
							render: function (data, type, rowdata, meta) {
								if (data == '' || data == null) {
									data = ''
								}
								return '<span  title="' + data + '">' + data + '</span>'
							}
						},//科目
						{
							data: "ysass",
							width: "100px",
							render: function (data, type, rowdata, meta) {
								if (data == '' || data == null) {
									data = ''
								}
								return '<span  title="' + data + '">' + data + '</span>'
							}
						}//辅助核算
					],
					"initComplete": function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
					},
					"columnDefs": [
					],
					"drawCallback": function (settings) {
						ufma.parseScroll();
						ufma.isShow(page.reslist);
						page.zsTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						page.zsTable.css("width", "100%");
						//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						$("#modelTable_wrapper").css("cssText", "height:" + page.tableH + "px !important");

					}
				});
				return page.zsDataTable;
			},

			newSingleTable: function () {
				var tableId = 'singleTable';
				$("#singleTable").dataTable().fnDestroy();
				$("#singleTable").html('');  //guohx 先清空动态加载列
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
					"processing": true,// 显示正在加载中
					"bInfo": false,// 页脚信息
					"bSort": false, // 排序功能
					"autoWidth": false,
					"bDestory": true,
					"serverSide": false,
					"ordering": false,
					columns: columns,
					data: [],
					initComplete: function (settings, json) {

					},
					fnCreatedRow: function (nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					},
					"drawCallback": function (settings) {
						ufma.parseScroll();
						ufma.isShow(page.reslist);
						$("#singleTable").find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$("#singleTable").css("width", "100%");
						//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						$("#singleTable_wrapper").css("height", page.tableH + "px !important");
					}
				}

				oTable = $("#" + tableId).dataTable(opts);
			},
			//选中凭证模板
			sureModel: function () {
				var treeObj = $.fn.zTree.getZTreeObj("docTree");
				var nodes = treeObj.getSelectedNodes();
				if (nodes.length == 0) {
					ufma.showTip("请先勾选一个您要操作的凭证模板")
					$("#btn-sure").attr("disabled", false);
					return false
				}
				voutempSendList = nodes[0].vouGroupId;
				voutempText = nodes[0].accoName;
				if (!$.isNull(voutempSendList)) {
					if (window.ownerData.isChange == false && insertvou == false) {
						ufma.confirm("是否覆盖当前凭证?", function (rst) {
							if (!rst) {
								$("#btn-sure").attr("disabled", false);
								return false;
							}
							_close('ok');
						}, {
								'type': 'warning'
							});
					} else {
						if (insertvou) {
							_close('ok',false);
						} else {
							_close('ok');
						}
					}
				} else {
					ufma.showTip('请先勾选一个您要操作的凭证模板！', "warning");
					$("#btn-sure").attr("disabled", false);
					return false;
				}
			},
			//初始化页面
			initPage: function () {
				//需要根据自己页面写的ID修改
				page.zsTable = $('#modelTable');//当前table的ID
				page.zsThead = $('#modelTableThead');//当前table的头部ID
				page.acctCode = window.ownerData.acctCode;
				page.accsCode = window.ownerData.accsCode;
				page.rgCode = window.ownerData.rgCode;
				page.setYear = window.ownerData.setYear;
				page.agencyCode = window.ownerData.agencyCode;
				page.isParallel = window.ownerData.isParallel;
				ufma.ajaxDef('/pub/user/menu/config/select?agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&menuId=f24c3333-9799-439a-94c9-f0cdf120305d', "get", '', function (data) {
					if (data.data.insertvouModel == 1) {
						$("#insertvou").prop('checked', true).attr('checked', true)
						insertvou = true
					} else {
						$("#insertvou").prop('checked', false).attr('checked', false)
						insertvou = false
					}
					if (data.data.sortvouModal == 1) {
						$("#sortvouModal").prop('checked', true).attr('checked', true)
						sortvouModal = true
					} else {
						$("#sortvouModal").prop('checked', false).attr('checked', false)
						sortvouModal = false
					}
				})
				if (page.isParallel == '0') {
					$("#singleModel").removeClass("hidden");
					$("#doubleModel").addClass("hidden");
					page.newSingleTable();
				} else if (page.isParallel == '1') {
					$("#doubleModel").removeClass("hidden");
					$("#singleModel").addClass("hidden");
					page.newTable([]);
				}
				page.getAssistItem(); //获取辅助核算项
				page.getModelTree(""); //获取模板树
				if (!$.isNull(window.ownerData.searchStr)) {
					$('#key').val(window.ownerData.searchStr);
					setTimeout(function () {
						$('#btn-search').trigger('click');
					}, 800)

				}
			},
			onEventListener: function () {
				$("#btn-sure").on("click", function () {
					$("#btn-sure").attr("disabled", true);
					page.sureModel();
				})
				$("#insertvou").on("change", function () {
					if ($("#insertvou").is(":checked")) {
						insertvou = true
						configupdate('insertvouModel', 1)
					} else {
						insertvou = false
						configupdate('insertvouModel', 0)
					}
				})
				$('#btn-cancle').click(function () {
					_close('ok');
				});
				//模糊搜索左侧模板树
				$('#btn-search').on('click', function (e) {
					var param = $('#key').val();
					page.getModelTree(param);
					//var treeObj = $.fn.zTree.init($("#docTree"));
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					treeObj.expandAll(true);  //默认展开
				});

				//2018-07-23  mayb3 左侧模板树随着滚动条置顶
				$(window).scroll(function (e) {
					var winPos = $(this).scrollTop();
					if (winPos > 64) {
						$(".ufma-layout-slider").css("top", (winPos - 64) + "px");
					} else {
						$(".ufma-layout-slider").css("top", "0px");
					}
				});
				$('#sortvouModal').on('change', function (e) {
					if ($("#sortvouModal").is(":checked")) {
						sortvouModal = true
						configupdate('sortvouModal', 1)
					} else {
						sortvouModal = false
						configupdate('sortvouModal', 0)
					}
					var param = $('#key').val();
					page.getModelTree(param);
					//var treeObj = $.fn.zTree.init($("#docTree"));
					if(param!=''){
						var treeObj = $.fn.zTree.getZTreeObj("docTree");
						treeObj.expandAll(true);  //默认展开
					}
				});
				
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
				ufma.parse(page.namespace);
				this.initPage();
				this.onEventListener();
				page.winH = $(window).height() - 121;
				$(".doc-ztree").css("height", page.winH + "px");
				page.tableH = $(window).height() - 120;

			}
		}
	}();

	page.init();
});