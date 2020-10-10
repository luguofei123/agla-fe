$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			}
			window.closeOwner(data);
		}
	};

	var page = function() {
		var ptData = {};
		var agencyCode = '';
		var acctCode = '';
		var oTable, setQuery,selectYear,rptType,selectQj;
		var pageLength = ufma.dtPageLength('#portTable'); //分页
		var sessionKeyArr = [];
		return {
			atreeData: function() {
				//取单位数据
                 var arguAge = {
					setYear:ptData.svSetYear,
					rgCode:ptData.svRgCode
				}
				var url = '/gl/eleAgency/getAgencyTree' ///gl/vouTemp/getAgencyAcctTree
				ufma.get(url,arguAge, function(result) {
				//ufma.get(url, {}, function(result) {
					var atreeArr = result.data;
					var znodes = [];
					for(var i = 0; i < atreeArr.length; i++) {
						var nodeObj = {};
						nodeObj.id = atreeArr[i].id;
						nodeObj.pId = atreeArr[i].pId;
						nodeObj.name = atreeArr[i].codeName;
						nodeObj.CHR_ID = atreeArr[i].chrId;
						nodeObj.agencyType = atreeArr[i].agencyTypeCode;
						nodeObj.isPermis = atreeArr[i].isPermis;
						nodeObj.codeName = atreeArr[i].codeName;
						nodeObj.CHR_CODE = atreeArr[i].code;
						nodeObj.PARENT_ID = atreeArr[i].parentId;
						znodes.push(nodeObj);
					}
					page.atree(znodes);
					page.clickAtree(nodeObj.CHR_CODE,nodeObj.codeName);
					
				})
			},
			//单位账套树
			atree: function(zNodes) {
				var setting = {
					data: {
						simpleData: {
							enable: true
						}
					},
					check: {
						enable: true
					},
					view: {
						fontCss: getFontCss,
						showLine: false,
						showIcon: false,
						selectedMulti: false
					},
					callback: {
						onClick: zTreeOnClick,
						onCheck: zTreeOnCheck
					}
				};

				function zTreeOnClick(event, treeId, treeNode) {
					var be = treeNode.checked;
					var myTree = $.fn.zTree.getZTreeObj(treeId);
					myTree.checkNode(treeNode, !be, true);
					if(!be) {
						page.nowAgencyCode = treeNode.CHR_CODE;
						page.nowAgencyName = treeNode.codeName;
						page.clickAtree(page.nowAgencyCode, page.nowAgencyName);
					}
				};
				function zTreeOnCheck(event, treeId, treeNode) {
					var be = treeNode.checked;
					if(!be) {
						page.nowAgencyCode = treeNode.CHR_CODE;
						page.nowAgencyName = treeNode.codeName;
						page.clickAtree(page.nowAgencyCode, page.nowAgencyName);
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
					var zTree = $.fn.zTree.getZTreeObj("atree");
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
					var zTree = $.fn.zTree.getZTreeObj("atree");
					var value = $.trim(key.get(0).value);
					var keyType = "name";
					if(key.hasClass("empty")) {
						value = "";
					}
					if(lastValue === value) return;
					lastValue = value;
					if(value === "") return;
					updateNodes(false);
					nodeList = zTree.getNodesByParamFuzzy(keyType, value);
					updateNodes(true);
					var NodesArr = allNodesArr();
					if(nodeList.length > 0) {
						var index = NodesArr.indexOf(nodeList[0].id.toString());
						$(".rpt-atree-box-body").scrollTop((30 * index));
					}
				}
				function updateNodes(highlight) {
					var zTree = $.fn.zTree.getZTreeObj("atree");
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
					var treeObj = $.fn.zTree.init($("#atree"), setting, zNodes);
					treeObj.expandAll(true);
					key = $("#key");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						.bind("propertychange", searchNode)
						.bind("input", searchNode);
				});
			},
		
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
	
			//点击左侧单位账套树
			clickAtree: function(agencyCode, agencyName) {
				if(sessionKeyArr.length > 0) {
					for(var i = 0; i < sessionKeyArr.length; i++) {
						sessionStorage.removeItem(sessionKeyArr[i]);
					}
				}
				$("div.rpt-tree-data").hide();

			},
			//返回账表查询的入参结果集
			backTabArgu: function() {
				var treeObj = $.fn.zTree.getZTreeObj("atree");
				var nodes = treeObj.getCheckedNodes(true); //获取选中的单位账套
				var tabArgu = {},
					agencyArr = [];
				var len = nodes.length;
				for(var i = 0; i < len; i++) {
				  if (!nodes[i].children) {//选取账套信息
					agencyArr.push(nodes[i]["CHR_CODE"]);
				  }
				}
				tabArgu.agencyCode = agencyArr.join(); //单位代码
				return tabArgu;
			},
			
			selectYear: function() {
				$('#selectYear').ufCombox({
					url: '/gl/FinalAccounts/getFinalCountRptTask',
					idField: 'taskCode', //可选
					textField: 'taskName', //可选
					readonly: false,
					placeholder: '请选择财务报表任务',
					onChange: function(sender, data) {
						selectYear = $('#selectYear').getObj().getValue();
						rptType = data.rptType;
						page.selectQj();
					},
					onComplete: function(sender) {
						if(selectYear) {
							$('#selectYear').getObj().val(selectYear);
						} else {
							selectYear =  'YZCSYL'
							$('#selectYear').getObj().val(selectYear)
						}
						ufma.hideloading();
					}
				});
			},
			selectQj: function() {
				$('#selectQj').ufCombox({
					url: '/gl/FinalAccounts/getFinalCountQj?rptType='+rptType,
					idField: 'qjCode', //可选
					textField: 'qjName', //可选
					readonly: false,
					placeholder: '请选择期间',
					onChange: function(sender, data) {
						selectQj = $('#selectQj').getObj().getValue();
						if($('#selectQj').getObj().getValue() == ''){
							ufma.showTip('请选择需要同步的期间', function() {
							}, 'error')
							return;
						}
						ufma.showloading('正在查询，请耐心等待...');
						var pagencyCode =  page.backTabArgu();
						YZCSYL = selectYear;
						var url = '/gl/FinalAccounts/getFinalCountResult/' + ptData.svSetYear + '/' + ptData.svRgCode + '/' + YZCSYL + '/' + selectQj
						ufma.post(url, pagencyCode, function(result) {
							ufma.hideloading();
							oTable.fnClearTable();
							if(result.data.length != 0) {
								page.sameTableData = result.data;
								oTable.fnAddData(result.data, true);
							}
							ufma.setBarPos($(window));
						})
					},
					onComplete: function(sender) {
						selectQj = $('#selectQj').getObj().getValue();
					}
				});
			},
			//初始化table
			initGrid: function() {
				var tableId = 'portTable';
				var columns = [{
						//checkBox的选框
						title: '序号',
						data: "rowno", //主键
						className: 'tc nowrap isprint',
						width: 30
					},
					{
						title: "单位代码",
						data: "agencyCode",
						className: 'nowrap isprint'
					},
					{
						title: "单位名称",
						data: "agencyName",
						className: 'nowrap isprint'
					},
					{
						title: "报表代码",
						data: "rptCode",
						className: 'nowrap isprint'
					},
					{
						title: "报表名称",
						data: "rptName",
						className: 'nowrap isprint' //不换行
					},
					{
						title: "中间库表",
						data: "phyTableName",
						className: 'nowrap isprint'
					},
					{
						title: "状态",
						data: 'isSync',
						className: 'nowrap tc isprint',
						width: 60,
						render: function(rowid, rowdata, data, meta) {
							return data.isSync == 0 ? '未同步' : '已同步';
						}
					}
				];
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": [],
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers",
					"pageLength": pageLength,
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								modifier: {
									page: 'current'
								}
							},
							customize: function(win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								modifier: {
									page: 'current'
								}
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('[data-toggle="tooltip"]').tooltip();
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						
						 //导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#portTable'), '财政决算接口');
						});
						//导出end
						var timeId = setTimeout(function() {
							//左侧树高度
							var h = $(window).height() - 88;
							$(".rpt-acc-box-left").height(h);
							var H = $(".rpt-acc-box-right").height();
							if(H > h) {
								$(".rpt-acc-box-left").height(h + 48);
								if($("#tool-bar .slider").length > 0) {
									$(".rpt-acc-box-left").height(h + 52);
								}
							}
							$(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 96);
							clearTimeout(timeId);
						}, 200);
						 ufma.isShow(page.reslist);
					},
					fnCreatedRow: function(nRow, aData, iDataIndex) {
						$('td:eq(0)', nRow).html(iDataIndex + 1);
					},
					"drawCallback": function(settings) {
						$('#portTable').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$(".tableBox").css({
							"overflow-x": "auto"
						});
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
					}
				}
				oTable = $("#" + tableId).dataTable(opts);
			},
			//获取数据
			loadGrid: function() {
				// var pagencyCode =  page.backTabArgu();
				// YZCSYL = selectYear;
				// var url = '/gl/FinalAccounts/getFinalCountResult/' + ptData.svSetYear + '/' + ptData.svRgCode + '/' + YZCSYL
				// ufma.post(url, pagencyCode, function(result) {
				// 	oTable.fnClearTable();
				// 	if(result.data.length != 0) {
				// 		page.sameTableData = result.data;
				// 		oTable.fnAddData(result.data, true);
				// 	}
				// 	ufma.setBarPos($(window));
				// })
			},
			//监听
			onEventListener: function() {
				$('#getSyncState').click(function() {
					if($('#selectQj').getObj().getValue() == ''){
						ufma.showTip('请选择需要同步的期间', function() {
						}, 'error')
						return;
					}
					ufma.showloading('正在查询，请耐心等待...');
					var pagencyCode =  page.backTabArgu();
					YZCSYL = selectYear;
					var url = '/gl/FinalAccounts/getFinalCountResult/' + ptData.svSetYear + '/' + ptData.svRgCode + '/' + YZCSYL + '/' + selectQj
					ufma.post(url, pagencyCode, function(result) {
						ufma.hideloading();
						oTable.fnClearTable();
						if(result.data.length != 0) {
							page.sameTableData = result.data;
							oTable.fnAddData(result.data, true);
						}
						ufma.setBarPos($(window));
					})
				});
				//同步所有数据
				$('#sameStep').click(function() {
					if($('#selectQj').getObj().getValue() == ''){
						ufma.showTip('请选择需要同步的期间', function() {
						}, 'error')
						return;
					}
					var pagencyCode =  page.backTabArgu();
					YZCSYL = selectYear;
					var url = '/gl/FinalAccounts/getFinalCountResult/' + ptData.svSetYear + '/' + ptData.svRgCode + '/' + YZCSYL + '/' + selectQj
					ufma.post(url, pagencyCode, function(result) {
						if(result.data.length > 0){
							ufma.confirm('所选单位含有已经同步的数据，继续同步将清除现有数据，是否继续？',
								function(result){
									if(result){
										ufma.showloading('正在同步数据，请耐心等待...');
										var pagencyCode =  page.backTabArgu();
										var url = '/gl/FinalAccounts/executeFinalCountSyncButton?taskCode='+selectYear+'&selectQj='+selectQj+'&needClear=1'
										ufma.post(url, pagencyCode, function(result) {
											ufma.hideloading();
											if(result.flag == "success") {
												ufma.showTip('同步成功', function() {
												}, 'success')
											}else{
												ufma.showTip(result.msg, function() {
												}, 'error')
											}
										})
									}
								});
						}else{
							ufma.showloading('正在同步数据，请耐心等待...');
							var pagencyCode =  page.backTabArgu();
							var url = '/gl/FinalAccounts/executeFinalCountSyncButton?taskCode='+selectYear+'&selectQj='+selectQj+'&needClear=0'
							ufma.post(url, pagencyCode, function(result) {
								ufma.hideloading();
								if(result.flag == "success") {
									ufma.showTip('同步成功', function() {
									}, 'success')
								}else{
									ufma.showTip(result.msg, function() {
									}, 'error')
								}
							})
						}
					})

				});
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');
					if(!rowIndex) {
						return null;
					}
					var rowData = {};
					var url = '';
					var title = '';
					if($(e.target).is('.btn-rowsame')) {
						rowData = oTable.api(false).rows(rowIndex).data()[0];
						tableMapGuid = rowData.tableMapGuid;
						if(rowData.isSync == 1) {
							ufma.showTip('该数据已被同步，请勿重复操作', function() {
							}, 'warnning')
							return false;
						} else {
							ufma.showloading('正在同步数据，请耐心等待...');
						  	var pagencyCode =  page.backTabArgu();
							var url = '/gl/FinalAccounts/executeFinalCountSync/'+ tableMapGuid;
							ufma.post(url, pagencyCode, function(result) {
								if(result.flag == "success") {
									ufma.hideloading();
									page.loadGrid();
								}
							})
						}
					}
				});
				//搜索框
				ufma.searchHideShow($('#portTable'));
				//表格相关-begin
				//日历
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});

				$('#btn-setting').on('click',function(){
					var data = {
						rgCode:ptData.svRgCode,
						setYear:ptData.svSetYear
					}
					ufma.open({
						url: 'financeAccountsSettingPage.html',
						title: '财务报表与中间库表字段设置',
						width: 1030,
						height:800,
						data: data,
						ondestory: function (res) {
							if(res.flag == 'success'){
								ufma.showTip('保存成功',function(){},'success');
							}
							page.selectYear();
							//窗口关闭时回传的值
							// if (res.action && res.action.action == "save") {
							// 	ufma.showTip(res.action.msg,function () {
							//
							// 	},res.action.flag)
							// }
						}
					});
				})
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});
				page.atreeData();
				page.atree();
				page.initGrid();
				page.selectYear();
				$.fn.dataTable.ext.errMode = 'none';
			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData(); //平台的缓存数据
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	page.init();
});