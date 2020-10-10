$(function() {
	window._close = function(state, voutempSendList, voutempText) {
		if(window.closeOwner) {
			var data = {
				action: state,
				result: {},
				voutempSendList: voutempSendList,
				voutempText: voutempText
			};
			window.closeOwner(data);
		}
	}
	var page = function() {
		var znumsel=0;
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
		var voutempSendList;
		var isParallel;

		return {
			//获取单位下的辅助核算项
			getAssistItem: function() {
				var argu = {
					"agencyCode": page.agencyCode,
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"accsCode": page.accsCode,
					"acctCode": page.acctCode
				};
				var callback = function(result) {
					assistItems = result.data;
				};
				ufma.ajaxDef("/gl/vouTemp/getAccItemByAgency", "get", argu, callback);
			},
			//获取主表格数据  guohx
			getTableData: function(vouGroupId) {
				var callback = function(result) {
					if(page.isParallel == '1') { //是平行记账,既有财务会计也有预算会计
						vouRowDataList = []
						if(!$.isNull(result.data)) {
							if(!$.isNull(result.data.cwVouTempVo)) {
								$('#modelName').val(result.data.cwVouTempVo.templateName); //模板名称
								$('#modelDescp').val(result.data.cwVouTempVo.description); //模板描述
								var cwVouTempVo = result.data.cwVouTempVo;
								var rows = cwVouTempVo.vouDetailTems.length;
								for(var i = 0; i < rows; i++) {
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
									if(!$.isNull(row.detailAssTems)) {
										newRow.ass = page.transAss(row.detailAssTems);
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
							if(!$.isNull(result.data.ysVouTempVo)) {
								var ysVouTempVo = result.data.ysVouTempVo;
								$('#modelName').val(ysVouTempVo.templateName); //模板名称
								$('#modelDescp').val(ysVouTempVo.description); //模板描述
								for(var j = 0; j < ysVouTempVo.vouDetailTems.length; j++) {
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
									if($.isNull(result.data.cwVouTempVo)) {
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
									if(!$.isNull(row.detailAssTems)) {
										newRow.ysass = page.transAss(row.detailAssTems);
									}
									if(j > rows - 1) { //财务行数大于预算
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
									} else if($.isNull(rows)) { //只有预算
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
					} else if(page.isParallel == '0') {
						vouRowDataList = [];
						if(!$.isNull(result.data)) {
							if(!$.isNull(result.data.cwVouTempVo)) {
								$('#modelName').val(result.data.cwVouTempVo.templateName); //模板名称
								$('#modelDescp').val(result.data.cwVouTempVo.description); //模板描述
								var cwVouTempVo = result.data.cwVouTempVo;

								var rows = cwVouTempVo.vouDetailTems.length;
								for(var i = 0; i < rows; i++) {
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
									if(!$.isNull(row.detailAssTems)) {
										newRow.ass = page.transAss(row.detailAssTems);
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
				if(!$.isNull(vouGroupId)) {
					ufma.get("/gl/vouTemp/getTempPair/" + vouGroupId, {}, callback);
				}

			},
			//解析辅助核算项
			transAss: function(assData) {
				var accoAssList = [];
				for(var i = 0; i < assData.length; i++) {
					var ass = assData[0];
					for(var j = 0; j < assistItems.length; j++) {
						var assInfo = assistItems[j].accItemCode;
						assInfo = assInfo.toLowerCase();
						assInfo = assInfo.replace('_i', 'I'); //自定义辅助
						var accitemCode = assInfo + 'Code'; //accItem01Code
						var accitemName = assInfo + 'Name'; //accItem01Name
						if(ass[accitemCode] && (!$.isNull(ass[accitemCode])) && ass[accitemCode] != '*') {
							accoAssList.push(assistItems[j].eleName + ': ' + ass[accitemName]); //部门：01 部门01
						}
					}
				}
				return accoAssList.join(' ');
			},

			//请求模板树 guohx
			getModelTree: function(param) {
				var url = "/gl/vouTemp/getAccoVouTree";
				var argu = {
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"accsCode": page.accsCode,
					"param": param
				}
				ufma.ajaxDef(url, "post", argu, function(result) {
					var atreeArr = result.data;
					var znodes = [];
					for(var i = 0; i < atreeArr.length; i++) {
						var nodeObj = {};
						if(atreeArr[i].id == '11') {
							nodeObj.open = true;
						}
						nodeObj.id = atreeArr[i].id;
						nodeObj.pId = atreeArr[i].pId;
						nodeObj.accoName = atreeArr[i].accoName;
						nodeObj.levNum = atreeArr[i].levNum;
						nodeObj.accoCode = atreeArr[i].accoCode;
						nodeObj.dataFlag = atreeArr[i].dataFlag;
						nodeObj.chrId = atreeArr[i].chrId;
						nodeObj.isLeaf = atreeArr[i].isLeaf;
						nodeObj.vouGroupId = atreeArr[i].vouGroupId;
						znodes.push(nodeObj);

					}
					page.docTree(znodes);
				});
			},
			docTree: function(zNodes) {
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
					if(!be) {
						vouGroupId = treeNode.vouGroupId;
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
					var zTree = $.fn.zTree.init($("#docTree"), setting, zNodes);
					//var zTree = $.fn.zTree.getZTreeObj("atree");
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
					//treeObj.expandAll(false);  //默认展开
					key = $("#mobansearchs");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						.bind("propertychange", searchNode)
						.bind("input", searchNode);
				});
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
			//表格初始化
			newTable: function(tableData) {
				if(tableData.length>0){
					$('.vouUseFrequency-body').hide()
					$('#vouUseFrequency').hide()
					$('.srmbsearchtext').find('.clicks').hide()
				}
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
					"processing": true, // 显示正在加载中
					"bInfo": false, // 页脚信息
					"bSort": false, // 排序功能
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
							class: "tr"
						}, //摘要
						{
							data: "drCr",
							width: "40px",
							render: function(rowid, rowdata, data) {
								if(data.drCr == '1') {
									return '借';
								} else if(data.drCr == '-1') {
									return '贷';
								} else {
									return ' ';
								}
							}
						}, //借贷
						{
							data: "accoName",
							width: "100px"
						}, //科目
						{
							data: "ass",
							width: "100px"
						}, //辅助核算
						{
							data: "ysdrCr",
							width: "40px",
							render: function(rowid, rowdata, data) {
								if(data.ysdrCr == '1') {
									return '借';
								} else if(data.ysdrCr == '-1') {
									return '贷';
								} else {
									return ' ';
								}
							}
						}, //借贷
						{
							data: "ysaccoName",
							width: "100px"
						}, //科目
						{
							data: "ysass",
							width: "100px"
						} //辅助核算
					],
					"initComplete": function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
					},
					"columnDefs": [],
					"drawCallback": function(settings) {
						ufma.parseScroll();
						ufma.isShow(page.reslist);
						page.zsTable.find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						page.zsTable.css("width", "100%");
						//按钮提示
						$("[data-toggle='tooltip']").tooltip();
						$("#modelTable_wrapper").css("cssText", "height:" + page.tableH + "px !important");

				var tabheight = $('.tablecotentheight').eq(0).height()
				$('.vouUseFrequency-body').css('height',tabheight-35+'px')
					}
				});
				return page.zsDataTable;
			},

			newSingleTable: function() {
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
						className: 'nowrap tr'
					},
					{
						title: "借贷",
						data: "drCr",
						className: 'nowrap',
						render: function(rowid, rowdata, data) {
							if(data.drCr == '1') {
								return '借';
							} else if(data.drCr == '-1') {
								return '贷';
							} else {
								return ' ';
							}
						}
					},
					{
						title: "科目",
						data: "accoName",
						className: 'nowrap tr'
					},
					{
						title: "辅助核算",
						data: 'ass',
						className: 'nowrap'
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
					columns: columns,
					data: [],
					initComplete: function(settings, json) {

					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					},
					"drawCallback": function(settings) {
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
				var tabheight = $('.tablecotentheight').eq(0).height()
				$('.vouUseFrequency-body').css('height',tabheight-35+'px')
			},
			//选中凭证模板
			sureModel: function() {
				if($('.vouUseFrequency-body').eq(0).css('display')!='none'){
					var z=0;
					for(var i=0;i<$('.vUFbodymodall').length;i++){
						if($('.vUFbodymodall').eq(i).find('.rightcheck').find('input').is(":checked")){
							z +=1
							voutempSendList=$('.vUFbodymodall').eq(i).find('.rightcheck').attr('vouid')
							voutempText=$('.vUFbodymodall').eq(i).find('.titlename').text()
						}
					}
					if(window.ownerData.isChange == false) {
						ufma.confirm("是否覆盖当前凭证?", function(rst) {
							if(!rst) {
								return false;
							}
							if(z==1) {
								_close('ok', voutempSendList, voutempText);
							} else {
								ufma.alert('请先勾选一个您要操作的凭证模板！', "warning");
								return false;
							}
						}, {
							'type': 'warning'
						});
					} else {
						if(z==1) {
							_close('ok', voutempSendList, voutempText);
						} else {
							ufma.alert('请先勾选一个您要操作的凭证模板！', "warning");
							return false;
						}
					}
				}else{
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					var nodes = treeObj.getSelectedNodes();
					voutempSendList = nodes[0].vouGroupId;
					voutempText = nodes[0].accoName
					if(window.ownerData.isChange == false) {
						ufma.confirm("是否覆盖当前凭证?", function(rst) {
							if(!rst) {
								return false;
							}
							if(!$.isNull(voutempSendList)) {
								_close('ok', voutempSendList, voutempText);
							} else {
								ufma.alert('请先勾选一个您要操作的凭证模板！', "warning");
								return false;
							}
						}, {
							'type': 'warning'
						});
					} else {
						if(!$.isNull(voutempSendList)) {
							_close('ok', voutempSendList, voutempText);
						} else {
							ufma.alert('请先勾选一个您要操作的凭证模板！', "warning");
							return false;
						}
					}
				}
				

			},
			//初始化页面
			initPage: function() {
				//需要根据自己页面写的ID修改
				page.zsTable = $('#modelTable'); //当前table的ID
				page.zsThead = $('#modelTableThead'); //当前table的头部ID
				page.acctCode = window.ownerData.acctCode;
				page.accsCode = window.ownerData.accsCode;
				page.rgCode = window.ownerData.rgCode;
				page.setYear = window.ownerData.setYear;
				page.agencyCode = window.ownerData.agencyCode;
				page.isParallel = window.ownerData.isParallel;
				if(page.isParallel == '0') {
					$("#singleModel").removeClass("hidden");
					$("#doubleModel").addClass("hidden");
					page.newSingleTable();
				} else if(page.isParallel == '1') {
					$("#doubleModel").removeClass("hidden");
					$("#singleModel").addClass("hidden");
					page.newTable([]);
				}
				page.getAssistItem(); //获取辅助核算项
				page.getModelTree(""); //获取模板树
				if(!$.isNull(window.ownerData.searchStr)) {
					$('#mobansearchs').val(window.ownerData.searchStr);
					setTimeout(function() {
						$('#btn-search').trigger('click');
					}, 800)

				}
			},
			selectimp: function() {
				ufma.ajaxDef('/gl/vouTemp/selectTemplates/' + page.agencyCode + '/' + page.acctCode, "get", '', function(result) {
					var bdhm = ''
					if(znumsel+3 > result.data.length-1 && result.data.length>=3){
						for(var i = znumsel; i < result.data.length; i++) {
							bdhm += '<div class="vUFbodymodall">'
							bdhm += '<div  class="vUFbodymodal">'
							bdhm += '<div class="vUFbodymodaltitle">'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="titlename">'+result.data[i].cwVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].cwVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}else{
								bdhm += '<span class="titlename">'+result.data[i].ysVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].ysVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}
							bdhm += '<input type="checkbox" class="datatable-group-checkable"/>&nbsp;'
							bdhm += '<span></span>'
							bdhm += '</label>'
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>财务会计</span>'
							if(result.data[i].cwVouTempVo !=''){
								for(var z=0;z<result.data[i].cwVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].cwVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].cwVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>预算会计</span>'
							if(result.data[i].ysVouTempVo !=''){
								for(var z=0;z<result.data[i].ysVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].ysVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].ysVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '</div>'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}else{
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}
							bdhm += '</div>'
						}
						for(var i = 0; i < result.data.length-znumsel; i++) {
							bdhm += '<div class="vUFbodymodall">'
							bdhm += '<div  class="vUFbodymodal">'
							bdhm += '<div class="vUFbodymodaltitle">'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="titlename">'+result.data[i].cwVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].cwVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}else{
								bdhm += '<span class="titlename">'+result.data[i].ysVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].ysVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}
							bdhm += '<input type="checkbox" class="datatable-group-checkable"/>&nbsp;'
							bdhm += '<span></span>'
							bdhm += '</label>'
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>财务会计</span>'
							if(result.data[i].cwVouTempVo !=''){
								for(var z=0;z<result.data[i].cwVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].cwVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].cwVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>预算会计</span>'
							if(result.data[i].ysVouTempVo !=''){
								for(var z=0;z<result.data[i].ysVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].ysVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].ysVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '</div>'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}else{
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}
							bdhm += '</div>'
						}
						znumsel = result.data.length-znumsel
					}else if(result.data.length>=3){
						for(var i = znumsel; i < znumsel+3; i++) {
							bdhm += '<div class="vUFbodymodall">'
							bdhm += '<div  class="vUFbodymodal">'
							bdhm += '<div class="vUFbodymodaltitle">'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="titlename">'+result.data[i].cwVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].cwVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}else{
								bdhm += '<span class="titlename">'+result.data[i].ysVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].ysVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}
							bdhm += '<input type="checkbox" class="datatable-group-checkable"/>&nbsp;'
							bdhm += '<span></span>'
							bdhm += '</label>'
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>财务会计</span>'
							if(result.data[i].cwVouTempVo !=''){
								for(var z=0;z<result.data[i].cwVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].cwVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].cwVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>预算会计</span>'
							if(result.data[i].ysVouTempVo !=''){
								for(var z=0;z<result.data[i].ysVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].ysVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].ysVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '</div>'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}else{
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}
							bdhm += '</div>'
						}
						znumsel=znumsel+3
					}else{
						for(var i = 0; i < result.data.length; i++) {
							bdhm += '<div class="vUFbodymodall">'
							bdhm += '<div  class="vUFbodymodal">'
							bdhm += '<div class="vUFbodymodaltitle">'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="titlename">'+result.data[i].cwVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].cwVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}else{
								bdhm += '<span class="titlename">'+result.data[i].ysVouTempVo.templateName+'</span>'
								bdhm += '<label vouid="'+result.data[i].ysVouTempVo.vouGroupId+'" class="mt-checkbox mt-checkbox-single mt-checkbox-outline rightcheck">'
							}
							bdhm += '<input type="checkbox" class="datatable-group-checkable"/>&nbsp;'
							bdhm += '<span></span>'
							bdhm += '</label>'
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>财务会计</span>'
							if(result.data[i].cwVouTempVo !=''){
								for(var z=0;z<result.data[i].cwVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].cwVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].cwVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].cwVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].cwVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '<div class="vUFbodymodalbody">'
							bdhm += '<span class="cytitle"><b></b>预算会计</span>'
							if(result.data[i].ysVouTempVo !=''){
								for(var z=0;z<result.data[i].ysVouTempVo.vouDetailTems.length;z++){
									if(result.data[i].ysVouTempVo.vouDetailTems[z].drCr == 1){
										bdhm += '<p>借：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}else{
										bdhm += '<p>贷：'+result.data[i].ysVouTempVo.vouDetailTems[z].accoCode + ' ' + result.data[i].ysVouTempVo.vouDetailTems[z].accoName+'</p>'
									}
								}
	//							bdhm += '<p>贷：4101 事业收入</p>'
								bdhm += '<p class="fu">'+result.data[i].ysVouTempVo.remark + '</p>'	
							}
							bdhm += '</div>'
							bdhm += '</div>'
							if(result.data[i].cwVouTempVo !=''){
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}else{
								bdhm += '<span class="vUFnum">已使用'+result.data[i].useCount+'次</span>'
							}
							bdhm += '</div>'
						}
					}
					$('.vouUseFrequency-body').html(bdhm)
				})

			},
			onEventListener: function() {
				$("#btn-sure").on("click", function() {
					page.sureModel();
				})
				$('#btn-cancle').click(function() {
					_close('ok');
				});
				//模糊搜索左侧模板树
				$(document).on('click','#btn-search', function(e) {
					$('.vouUseFrequency-body').hide()
					$('#vouUseFrequency').hide()
					$('.srmbsearchtext').find('.clicks').hide()
					var param = $('.mobansearchs').eq(0).val();
					page.getModelTree(param);
					//var treeObj = $.fn.zTree.init($("#docTree"));
					var treeObj = $.fn.zTree.getZTreeObj("docTree");
					treeObj.expandAll(true); //默认展开
				});
				$(document).on('click','.srmbsearchtext .clicks',function(){
					page.selectimp()
				})
				//2018-07-23  mayb3 左侧模板树随着滚动条置顶
				$(window).scroll(function(e) {
					var winPos = $(this).scrollTop();
					if(winPos > 64) {
						$(".ufma-layout-slider").css("top", (winPos - 64) + "px");
					} else {
						$(".ufma-layout-slider").css("top", "0px");
					}
				});
				$(document).on("keydown", "#mobansearchs", function(event) {
					event = event || window.event;
					if(event.keyCode == 13) {
						$('#btn-search').trigger('click')
						event.preventDefault();
						event.returnValue = false;
						event.keyCode == 0
						return false;
					}
					if(page.isParallel == '0') {
						$("#singleModel").removeClass("hidden");
						$("#doubleModel").addClass("hidden");
						page.newSingleTable();
					} else if(page.isParallel == '1') {
						$("#doubleModel").removeClass("hidden");
						$("#singleModel").addClass("hidden");
						page.newTable([]);
					}
					$('#modelName').val(''); //模板名称
					$('#modelDescp').val(''); //模板描述
				});
			},
			//此方法必须保留
			init: function() {
				page.reslist = ufma.getPermission();
				ufma.parse(page.namespace);
				this.initPage();
				this.onEventListener();
				page.winH = $(window).height() - 121;
				$(".doc-ztree").css("height", page.winH + "px");
				page.tableH = $(window).height() - 190;
				page.selectimp()
				$('.vouUseFrequency-body').show()
				var tabheight = $('.tablecotentheight').eq(0).height()
				$('.vouUseFrequency-body').css('height',tabheight-35+'px')
			}
		}
	}();

	page.init();
});