$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	}

	//模板设置传输数据
	var prtSetData = {
		// formatTmplCode:"",
		tmplCode: "",
		agencyCode: "",
		acctCode: "",
		componentId: window.ownerData.data.componentId
	};
	
	//保存模板
	var oData = {
		acctCode: window.ownerData.data.acctCode,
		agencyCode: window.ownerData.data.agencyCode
	};
	var modalactivedata={}
	//保存模板表格及信息设置数据
	var saveData = {};
	var prtFormat = {};

	//保存数据(prtFormat+saveData)
	var postTable = {};

	//定义datatables全局变量
	var prtSetDataTable;

	var page = function() {

		return {
			//表格加载方法(根据辅助核算)
			getPrtSetTable: function(url, jData) {
				var h = $(window).height()-230
				var id = "vpps-data";
				//              var toolBar = $('#'+id).attr('tool-bar');
				prtSetDataTable = $("#" + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					//                  "fixedHeader": {
					//				    	header: true
					//				    },385px
					"scrollY": h+'px',
					"scrollCollapse": true,
					"ajax": url,
					"bFilter": false, //去掉搜索框
					"processing": true, //显示正在加载中
					"pageLength": -1,
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": [{
							title: "辅助项",
							data: "accItemName"
						},
						{
							title: "编码规则",
							className: "nowrap",
							data: "codeRule"
						},
						{
							title: "是否打印",
							data: null
						},
						{
							title: "打印代码",
							data: null
						},
						{
							title: "打印名称",
							data: null
						},
						{
							title: "打印全称",
							data: null
						},
						{
							title: "明细",
							data: null
						},
						{
							title: "一",
							data: null
						},
						{
							title: "二",
							data: null
						},
						{
							title: "三",
							data: null
						},
						{
							title: "四",
							data: null
						},
						{
							title: "五",
							data: null
						},
						{
							title: "六",
							data: null
						},
						{
							title: "七",
							data: null
						},
						{
							title: "八",
							data: null
						},
						{
							title: "九",
							data: null
						},
						{
							title: "十",
							data: null
						},
						{
							title: "操作",
							data: null
						}
					],
					"columnDefs": [{
							"targets": [0, 1],
							"orderable": false
						},
						{
							"targets": [2],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="isPrint" name="' + rowdata.eleCode + 'isPrint" />&nbsp;' +
									'<span></span>' +
									'</label>';
							}
						},
						{
							"targets": [3],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="printType" disabled="disabled" name="' + rowdata.eleCode + 'printType" value="0" />&nbsp;' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [4],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printType" disabled="disabled" name="' + rowdata.eleCode + 'printType" value="1" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [5],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printType" disabled="disabled" name="' + rowdata.eleCode + 'printType" value="2" /> &nbsp;' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [6],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="0" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [7],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="1" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [8],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="2" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [9],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="3" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [10],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="4" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [11],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="5" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [12],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="6" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [13],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="7" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [14],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="8" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [15],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="9" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [16],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="radio" class="printLevle" disabled="disabled" name="' + rowdata.eleCode + 'printLevle" value="10" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [17],
							"orderable": false,
							"serchable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								return '<a class="btn-label btn-Drag" data-toggle="tooltip" title="拖动排序"><i class="glyphicon icon-drag"></i></a>'
							}
						}
					],
					"dom": 'rt',
					"initComplete": function(settings, json) {
						$('#vpps-data .btn-Drag').on('mousedown',function(){
							var callback = function() {
								var idx = 0;
								var ids = []
								$('#sortGrid tbody tr').each(function() {
									if(!$(this).hasClass('hide')) {
										idx = idx + 1;
										$(this).find('span.recno').html(idx);
										var idxs = {}
										idxs[$(this).attr('id')] = idx
										ids.push(idxs)
									}
								});
							};
							$('#vpps-data').tableSort(callback);
						})
					},
					"drawCallback": function(settings) {
						if(jData.hasOwnProperty('element')) {
							//循环载入设置值
							for(var i = 0; i < jData.element.length; i++) {
								//是否打印
								if(jData.element[i].isPrint == "0") {
									$("#vpps-data input[name='" + jData.element[i].eleCode + "isPrint']").prop("checked", false);
								} else if(jData.element[i].isPrint == "1") {
									$("#vpps-data input[name='" + jData.element[i].eleCode + "isPrint']").prop("checked", true);
								}

								//打印类型
								switch(jData.element[i].printType) {
									case "0":
										$("#vpps-data input[name='" + jData.element[i].eleCode + "printType'][value='0']").prop("checked", true);
										break;
									case "1":
										$("#vpps-data input[name='" + jData.element[i].eleCode + "printType'][value='1']").prop("checked", true);
										break;
									case "2":
										$("#vpps-data input[name='" + jData.element[i].eleCode + "printType'][value='2']").prop("checked", true);
										break;
									case "01":
										$("#vpps-data input[name='" + jData.element[i].eleCode + "printType'][value='0']").prop("checked", true);
										$("#vpps-data input[name='" + jData.element[i].eleCode + "printType'][value='1']").prop("checked", true);
										break;
									case "02":
										$("#vpps-data input[name='" + jData.element[i].eleCode + "printType'][value='0']").prop("checked", true);
										$("#vpps-data input[name='" + jData.element[i].eleCode + "printType'][value='2']").prop("checked", true);
										break;
									default:
										break;
								}

								//打印级次
								$("#vpps-data input[name='" + jData.element[i].eleCode + "printLevle'][value='" + jData.element[i].printLevle + "']").prop("checked", true);

								//根据是否打印禁用后方checkbox
								$("#vpps-data input.isPrint").each(function() {
									if($(this).prop("checked") == true) {
										$(this).parents('tr').find("input.printType").prop("disabled", false);
										$(this).parents('tr').find("input.printLevle").prop("disabled", false);
									}
								});
							}
						}
					}
				});
			},
			//获取模板设置信息
			getPrtSet: function(result) {
				var data = result.data;
				if(data.pubPrtPrintTmpl.defaultTmpl == "0") {
					$("#vouPrintPrintSet #defaultimpl").prop("checked", false)
				} else {
					$("#vouPrintPrintSet #defaultimpl").prop("checked", true)
				}
				//转换JSON
				var jsonData = "";
				if(data.pubPrtPrintTmpl != null) {
					jsonData = data.pubPrtPrintTmpl.tmplValue == ''?'':eval('(' + data.pubPrtPrintTmpl.tmplValue + ')');
					//赋值模板guid
					saveData.tmplGuid = data.pubPrtPrintTmpl.tmplGuid;
					//科目
					switch(jsonData.acco) {
						case "0":
							$("#dysjsz input[name='print-name'][value='0']").prop("checked", true);
							break;
						case "1":
							$("#dysjsz input[name='print-name'][value='1']").prop("checked", true);
							break;
						case "2":
							$("#dysjsz input[name='print-name'][value='2']").prop("checked", true);
							break;
						case "01":
							$("#dysjsz input[name='print-name'][value='0']").prop("checked", true);
							$("#dysjsz input[name='print-name'][value='1']").prop("checked", true);
							break;
						case "02":
							$("#dysjsz input[name='print-name'][value='0']").prop("checked", true);
							$("#dysjsz input[name='print-name'][value='2']").prop("checked", true);
							break;
						case "":
							$("#dysjsz input[name='print-name'][value='1']").prop("checked", true);
						default:
							$("#dysjsz input[name='print-name'][value='1']").prop("checked", true);
							break;
					}

					//合计值
					$("#dysjsz input[name='print-sum'][value='" + jsonData.total + "']").prop("checked", true);
				} else {
					//赋值模板guid
					saveData.tmplGuid = "";
				}
				//获取辅助核算加载表格
				var dataUrl = "/gl/sys/eleAccItemEnbale/getAccItemAll/" + window.ownerData.data.agencyCode;
				page.getPrtSetTable(dataUrl, jsonData);
			},

			//获取模板种类
			getPrtFormatList: function(result) {
				var data = result.data;
				if(data.length > 0) {
					prtSetData.tmplCode = data[0].reportCode;
					modalactivedata = data[0]
					for(var i=0;i<data;i++){
						if(data[i].defaultTmpl == 1){
							prtSetData.tmplCode = data[i].reportCode;
							prtSetData.tmplName = data[i].templName;
							modalactivedata = data[i]
							return false
						}
					}
					prtSetData.agencyCode = window.ownerData.data.agencyCode;
					prtSetData.acctCode = window.ownerData.data.acctCode;
					prtSetData.componentId = "GL_VOU";
					var $xtjmb= []
					var $dwjmb= []
					for(var i = 0; i < data.length; i++) {
						if(data[i].templId=="*"){
							$xtjmb.push(data[i])
//							$xtjmb +='<div templId = '+data[i].templId+' value="' + data[i].reportCode + '" 
//									'valueid="' + data[i].reportId + '" 
//									data-agencyCode="' + window.ownerData.data.agencyCode + '" '
//							data-acctCode="' + window.ownerData.data.acctCode +
//							'" data-formatTmplCode="' + window.ownerData.data.formatTmplCode + '">' +
//							data[i].templName + '</div>'
						}else{
							$dwjmb.push(data[i])
						}
					}
//					$(".xtjmb").html($xtjmb);
//					$(".dwjmb").html($dwjmb);
					var znodes = [];
					znodes.push()
					var nodeObjs = {};
					nodeObjs.open = true;
					nodeObjs.id = '0';
					nodeObjs.pId = '';
					nodeObjs.Name = '系统级';
					nodeObjs.templId = '0';
					nodeObjs.reportCode = '0';
					nodeObjs.agencyCode = window.ownerData.data.agencyCode;
					nodeObjs.acctCode = window.ownerData.data.acctCode;
//					nodeObjs.formatTmplCode = window.ownerData.data.formatTmplCode;
					nodeObjs.chrId = '0';
					nodeObjs.reportId = '0';
					nodeObjs.isLeaf = '0';
					znodes.push(nodeObjs);
					for (var i = 0; i < $xtjmb.length; i++) {
						var nodeObj = {};
						nodeObj.id = '11';
						nodeObj.pId = '0';
						nodeObj.open = true;
						if($xtjmb[i].defaultTmpl == 1){
							nodeObj.Name = '<span>'+$xtjmb[i].templName+'<span class="treedefault">默认</span></span>';
						}else{
							nodeObj.Name = $xtjmb[i].templName
						}
						nodeObj.templId = $xtjmb[i].templId;
						nodeObj.tmplName = $xtjmb[i].templName;
						nodeObj.reportCode = $xtjmb[i].reportCode;
						nodeObj.agencyCode = window.ownerData.data.agencyCode;
						nodeObj.acctCode = window.ownerData.data.acctCode;
//						nodeObj.formatTmplCode = window.ownerData.data.formatTmplCode;
						nodeObj.chrId = $xtjmb[i].reportId;
						nodeObj.reportId = $xtjmb[i].reportId;
						nodeObj.isLeaf = '1';
						znodes.push(nodeObj);
					}
					nodeObjs = {};
					nodeObjs.open = true;
					nodeObjs.id = '1';
					nodeObjs.pId = '';
					nodeObjs.Name = '单位级';
					nodeObjs.templId = '1';
					nodeObjs.reportCode = '1';
					nodeObjs.agencyCode = window.ownerData.data.agencyCode;
					nodeObjs.acctCode = window.ownerData.data.acctCode;
//					nodeObjs.formatTmplCode = window.ownerData.data.formatTmplCode;
					nodeObjs.chrId = '1';
					nodeObjs.reportId = '1';
					nodeObjs.isLeaf = '0';
					znodes.push(nodeObjs);
					for (var i = 0; i < $dwjmb.length; i++) {
						var nodeObj = {};
						nodeObj.id = '11';
						nodeObj.pId = '1';
						nodeObj.open = true;
						if($dwjmb[i].defaultTmpl == 1){
							nodeObj.Name = '<span>'+$xtjmb[i].templName+'<span class="treedefault">默认</span></span>';
						}else{
							nodeObj.Name = $dwjmb[i].templName;
						}
						nodeObj.templId = $dwjmb[i].templId;
						nodeObj.tmplName = $dwjmb[i].templName;
						nodeObj.reportCode = $dwjmb[i].reportCode;
						nodeObj.agencyCode = window.ownerData.data.agencyCode;
						nodeObj.acctCode = window.ownerData.data.acctCode;
//						nodeObj.formatTmplCode = window.ownerData.data.formatTmplCode;
						nodeObj.chrId = $dwjmb[i].reportId;
						nodeObj.reportId = $dwjmb[i].reportId;
						nodeObj.isLeaf = '1';
						znodes.push(nodeObj);
					}
					page.docTree(znodes);
				}
			},
			docTree: function (zNodes) {
				var setting = {
					data: {
						simpleData: {
							enable: true
						},
						key: {
							name: 'Name'
						},
					},
					check: {
						enable: false
					},
					view: {
						nameIsHTML: true,
						fontCss: getFontCss,
						showLine: false,
						showIcon: false,
						selectedMulti: false
					},
					callback: {
						onClick: zTreeOnClick
					}
				};

				function zTreeOnClick(event, treeId, treeNode) {
					modalactivedata = treeNode
					if(treeNode.reportCode != '') {
						if(treeNode.templId=='*'){
							$('.rimsurlgr').show()
							$('.rimsurlsgr').hide()
						}else{
							$('.rimsurlgr').hide()
							$('.rimsurlsgr').show()
						}
						prtSetData.tmplCode = treeNode.reportCode;
//						prtSetData.formatTmplCode =treeNode.templId;
						prtSetData.tmplName = treeNode.tmplName;
						prtSetData.agencyCode =treeNode.agencyCode;
						prtSetData.acctCode = treeNode.acctCode;
						prtSetData.componentId = 'GL_VOU';
						$('.lis').removeClass('active')
						$(this).addClass('active')
						$("#vpps-data tbody").html("");
						$("#vpps-data input[name='print-name']").prop('checked', false);
						$("#vpps-data input[name='print-sum']").prop('checked', false);
						$("#vpps-data #tmplType").prop('checked', false);
//						ufma.post("/gl/vouPrint/getPrtSet", prtSetData, page.getPrtSet);
						$.ajax({
							type: "post",
							url: "/gl/vouPrint/getPrtSet" + "?ajax=1",
							data: JSON.stringify(prtSetData),
							contentType: 'application/json; charset=utf-8',
							async: true,
							success: function(data) {
								if(data.flag == "success") {
									page.getPrtSet(data)
								}else{
									ufma.showTip(data.msg, function() {}, "error",'3000');
								}
							},
							error: function(data) {
								_this.removeClass("btn-disablesd")
								ufma.showTip("数据库连接失败", function() {}, "error");
								$("#zezhao").html('')
								$("#zezhao").hide();
							}
						});
					} else if(treeNode.id!='0' && treeNode.id!='1') {
						
					} else {
						ufma.showTip('当前模板未设置模板代码，请在打印模板设置处设置模板代码', function() {}, 'warning')
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
						"font-weight": "bold",
							"font-size":'16px'
					} : {
							color: "#333",
							"font-weight": "normal",
							"font-size":'14px'
						};
				}

				function filter(node) {
					return !node.isParent && node.isFirstNode;
				}
				var key;
				$(document).ready(function () {
					var treeObj = $.fn.zTree.init($("#docTree"), setting, zNodes);
					key = $("#key");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						
					var mrxzid = modalactivedata.reportId
					zTree = $.fn.zTree.getZTreeObj("docTree");//treeDemo界面中加载ztree的div
					var node = zTree.getNodeByParam("chrId",mrxzid );
					zTree.cancelSelectedNode();//先取消所有的选中状态
					zTree.selectNode(node,true);//将指定ID的节点选中
					zTree.setting.callback.onClick(null, zTree.setting.treeId, node)
				});
			},
			//保存数据
			savePrtSet: function(result) {
				//设置数据
				var postSet = {};
				var accoSum = "";
				$("#dysjsz input[name='print-name']:checked").each(function() {
					accoSum = accoSum + $(this).val();
				});
				var eleArr = [];
				$("#vpps-data tbody tr").each(function() {
					//判断表格tr内是否有勾选(有勾选才传值)
					if($(this).find(":checked").length != 0) {
						var eleOne = prtSetDataTable.row($(this)).data();
						eleOne.isPrint = $(this).find(".isPrint").prop("checked") ? "1" : "0";
						var typeSum = "";
						$(this).find(".printType:checked").each(function() {
							typeSum = typeSum + $(this).val();
						});
						eleOne.printType = typeSum;
						eleOne.printLevle = $(this).find(".printLevle:checked").val();
						eleArr.push(eleOne);
					}
				});
				postSet.acco = accoSum;
				postSet.element = eleArr;
				postSet.total = $("#dysjsz input[name='print-sum']:checked").val();

				saveData.agencyCode = oData.agencyCode;
				saveData.acctCode = oData.acctCode;
				saveData.tmplValue = JSON.stringify(postSet).replace(/\"/g, "'");
//				saveData.formattmplCode = prtSetData.formatTmplCode
				saveData.tmplCode = prtSetData.tmplCode;
				saveData.tmplName = prtSetData.tmplName;
				saveData.componentId = prtSetData.componentId;
//				if($("#vouPrintPrintSet #prtFormatList option:selected").attr("data-agencyCode") == "*") {
				if($(".mblis .active").attr("data-agencyCode") == "*") {
					saveData.tmplGuid = "";
				}
				saveData.defaultTmpl = $("#vouPrintPrintSet #defaultimpl").is(":checked") ? "1" : "0";;
				prtFormat.tmplType = $("#vouPrintPrintSet #tmplType").prop("checked") ? "1" : "0";
				prtFormat.formattmplGuid = $("#vouPrintPrintSet #tmplType").attr("data-guid");

				postTable.pubPrtPrintTmpl = saveData;
				postTable.pubPrtFormatTmpl = prtFormat;

				return postTable;
			},

			initPage: function() {
				page.reslist = ufma.getPermission();
				//				ufma.isShow(page.reslist);

				//加载模板种类
				// ufma.post("/gl/vouPrint/getPrtFormatList",window.ownerData.data,this.getPrtFormatList);]
				// var settestdata = JSON.parse(window.sessionStorage.getItem("testData"))
				
//				ufma.post("/pqr/api/report?sys=100", window.ownerData.data, this.getPrtFormatList);
				ufma.post("/pqr/api/report?sys=100", window.ownerData.data, function(result){
					var datady = {
						acctCode: window.ownerData.data.acctCode,
						agencyCode: window.ownerData.data.agencyCode,
						componentId:  window.ownerData.data.componentId,
						rgCode: window.ownerData.data.rgCode,
						setYear: window.ownerData.data.setYear,
						data:result.data
					}
					ufma.post("/gl/vouPrint/getTrimPrtList", datady, page.getPrtFormatList);
				});
			},

			//此方法必须保留
			init: function() {
				this.initPage();
				ufma.parse();
				var h = $(window).height()
				$('#docTree').height(h)
				$(".rpt-left").height(h-100)
				$(".rpt-right").height(h-50)
				$('#docTree').height(h-100)
				
				//切换纸张模板下拉
				$(document).on('click', ".accnab li", function() {
					if($(this).hasClass('active') != true) {
						$('.accnab li').removeClass('active')
						$(this).addClass('active')
					}
				})
//				$("#vouPrintPrintSet #prtFormatList").on("change", function() {
				$(document).on('click','.mblis .lis',function(){
					if($(this).hasClass('active')!=true){
						if($(this).attr('value') != '') {
							if($(this).attr('templId')=='*'){
								$('.rimsurl').show()
							}else{
								$('.rimsurl').hide()
							}
							// prtSetData.formatTmplCode = $(this).find("option:selected").attr("data-formatTmplCode");
							prtSetData.tmplCode = $(this).attr('value');
							prtSetData.agencyCode = $(this).attr("data-agencyCode");
							prtSetData.acctCode = $(this).attr("data-acctCode");
							prtSetData.componentId = 'GL_VOU';
							$('.lis').removeClass('active')
							$(this).addClass('active')
							$("#vpps-data tbody").html("");
							$("#vpps-data input[name='print-name']").prop('checked', false);
							$("#vpps-data input[name='print-sum']").prop('checked', false);
							$("#vpps-data #tmplType").prop('checked', false);
//							ufma.post("", prtSetData, page.getPrtSet);
							$.ajax({
								type: "post",
								url: "/gl/vouPrint/getPrtSet" + "?ajax=1",
								data: JSON.stringify(prtSetData),
								contentType: 'application/json; charset=utf-8',
								async: true,
								success: function(data) {
									if(data.flag == "success") {
										page.getPrtSet(data)
									}else{
										ufma.showTip(data.msg, function() {}, "error",'3000');
									}
								},
								error: function(data) {
									_this.removeClass("btn-disablesd")
									ufma.showTip("数据库连接失败", function() {}, "error");
									$("#zezhao").html('')
									$("#zezhao").hide();
								}
							});
						} else {
							ufma.showTip('当前模板未设置模板代码，请在打印模板设置处设置模板代码', function() {}, 'warning')
						}
					}
					
				});

				//勾选打印打印
				$("#vpps-data").on("change", "input.isPrint", function() {
					$(this).parents("tr").find("input.printType").prop("disabled", !$(this).prop("checked"));
					$(this).parents("tr").find("input.printLevle").prop("disabled", !$(this).prop("checked"));
					if($(this).prop("checked") == false) {
						$(this).parents("tr").find("input.printType").prop("checked", false);
						$(this).parents("tr").find("input.printLevle").prop("checked", false);
					} else if($(this).prop("checked") == true) {
						$(this).parents("tr").find("input.printType").eq(0).prop("checked", true);
						$(this).parents("tr").find("input.printType").eq(1).prop("checked", true);
						$(this).parents("tr").find("input.printLevle").eq(0).prop("checked", true);
					}
				});

				//点击保存的事件
				$('#btn-save').on('click', function() {
					page.savePrtSet();

					var callback = function(result) {
						var closeTip = function() {
							_close("save");
						}
						ufma.showTip(result.msg, closeTip, result.flag);
					}

					ufma.post("/gl/vouPrint/savePrtSet", postTable, callback);
					$(this).prop("disabled", true);
				});
				$('.rimsurl').on('click',function(){
//					var codes = $("#vouPrintPrintSet #prtFormatList option:selected").attr('value')
//					var ids= $("#vouPrintPrintSet #prtFormatList option:selected").attr('valueid')
//					var templId = $("#vouPrintPrintSet #prtFormatList option:selected").attr('templId')
					var codes = modalactivedata.reportcode
					var ids= modalactivedata.reportId
					var templId = modalactivedata.templId
					$(this).attr("data-title", "模板设置")
					$(this).attr("data-href", '/pqr/pages/design/design/design.html?reportcode='+codes+'&reportId='+ids)
					window.parent.parent.openNewMenu($(this));
				})
				$('.rimsurls').on('click',function(){
//					var codes = $("#vouPrintPrintSet #prtFormatList option:selected").attr('value')
//					var ids= $("#vouPrintPrintSet #prtFormatList option:selected").attr('valueid')
//					var templId = $("#vouPrintPrintSet #prtFormatList option:selected").attr('templId')
					var codes = modalactivedata.reportcode
					var ids= modalactivedata.reportId
					var templId = modalactivedata.templId
					$(this).attr("data-title", "模板设置")
					$(this).attr("data-href", '/pqr/pages/design/design/design.html?reportcode='+codes+'&reportId='+ids+'&templId='+ templId)
					window.parent.parent.openNewMenu($(this));
				})
				$('.btn-thisdefault').on('click',function(){
					page.savePrtSet();
					postTable.pubPrtPrintTmpl.defaultTmpl = 1
					var callback = function(result) {
						ufma.showTip(result.msg, function(){}, result.flag);
						ufma.post("/pqr/api/report?sys=100", window.ownerData.data, function(result){
							var datady = {
								acctCode: window.ownerData.data.acctCode,
								agencyCode: window.ownerData.data.agencyCode,
								componentId:  window.ownerData.data.componentId,
								rgCode: window.ownerData.data.rgCode,
								setYear: window.ownerData.data.setYear,
								data:result.data
							}
							ufma.post("/gl/vouPrint/getTrimPrtList", datady, page.getPrtFormatList);
						});
					}
					ufma.post("/gl/vouPrint/savePrtSet", postTable, callback);
				})
				//点击关闭的事件
				$('#btn-qx').click(function() {
					_close("cancel");
				});
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				})
			}
		}
	}();
	/////////////////////
	page.init();
});