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
	
	var iscopy = true
	//保存模板
	var oData = {
		acctCode: window.ownerData.data.acctCode,
		agencyCode: window.ownerData.data.agencyCode
	};
	var isSys = window.ownerData.isSys
	var modalactivedata={}
	//保存模板表格及信息设置数据
	var saveData = {};
	var prtFormat = {};
	var codeRule = window.ownerData.codeRule

	//保存数据(prtFormat+saveData)
	var postTable = {};

	//定义datatables全局变量
	var prtSetDataTable;

	var page = function() {
    	var isCrossDomain = false
		return {
			//表格加载方法(根据辅助核算)
			getPrtSetTable: function(url, jData) {
				var tabledata;
				ufma.ajaxDef(url,'get','',function(data){
					tabledata = data.data
					tabledata.unshift(window.ownerData.codeRule)
				})
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
					"data":tabledata,
					// "ajax": url,
					"bFilter": false, //去掉搜索框
					"processing": true, //显示正在加载中
					"pageLength": -1,
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": [{
							title: "打印项",
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
								var datas = rowdata.accItemName=='会计科目'?1:0
								return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" isacco="'+datas+'" class="isPrint" name="' + rowdata.eleCode + 'isPrint" />&nbsp;' +
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
							if((!isSys && modalactivedata.agencyCode!='*') || isSys){
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
							}
						})
						if((!isSys && modalactivedata.agencyCode!='*') || isSys){}else{
							$('#vpps-data').find('input').attr('disabled',true).prop('disabled',true)
						}
					},
					"drawCallback": function(settings) {
						if(jData.hasOwnProperty('element')) {
							if(!$.isNull(jData.accSep)){
								$('#accSep option[value="'+jData.accSep+'"]').attr('selected',true).prop('selected',true)
							}else{
								$('#accSep option').eq(0).attr('selected',true).prop('selected',true)
							}
							if(jData.isShowBill == '1'){
								$('#isShowBill').eq(0).attr('checked',true).prop('checked',true)
							}else{
								$('#isShowBill').attr('checked',false).prop('checked',false)
							}
							if(jData.printAccoBracket == '1'){
								$('#printAccoBracket').eq(0).attr('checked',true).prop('checked',true)
							}else{
								$('#printAccoBracket').attr('checked',false).prop('checked',false)
							}
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
				if(data.defaultTmpl == "0") {
					$("#vouPrintPrintSet #defaultimpl").prop("checked", false)
				} else {
					$("#vouPrintPrintSet #defaultimpl").prop("checked", true)
				}
				var datamuban  = data.tmplCode
				var dataformattmplCode = data.formattmplCode
				for(var i=0;i<$('#mubansel').find('option').length;i++){
					if($('#mubansel').find('option').eq(i).attr('reportcode')==datamuban && $('#mubansel').find('option').eq(i).attr('templid')== dataformattmplCode){
						$('#mubansel').find('option').eq(i).attr('selected',true).prop('selected',true)
					}
				}
				if($("#mubansel option:selected").attr('templId')=='*'){
					if(isSys){
						$('.rimsurl').hide()
					}else{
						$('.rimsurl').show()
					}
					$('.rimsurls').hide() 
					$('.rimsurldel').hide() 
					$('.rimsurlinset').hide()
					$('.defaultimpls').hide()
					$(".rimsurlinsetmb").hide()
				}else{
					$('.rimsurl').hide()
					$('.rimsurls').show()
					$('.rimsurldel').show() 
					$('.rimsurlinset').show()
					$('.defaultimpls').show()
					$(".rimsurlinsetmb").show()
				}
				//转换JSON
				var jsonData = "";
				if(!$.isNull(data)) {
					jsonData = data.tmplValue == ''?'':eval('(' + data.tmplValue + ')');
					var accObj = $.inArrayJson(jsonData.element, 'accItemName', '会计科目');
					var newaccdata ={
						accItemName: "会计科目",
						codeRule: "4-2-2-2-2-2-2-2-2-2",
						isPrint: "1",
						printLevle: "",
						printType: "1"
					}
					if(jsonData.acco  != ''){
						newaccdata.printType = jsonData.acco
					}
					if(accObj==undefined ){
						jsonData.element.push(newaccdata)
					}
					//赋值模板guid
					saveData.tmplGuid = data.tmplGuid;
					//科目
					// switch(jsonData.acco) {
					// 	case "0":
					// 		$("#dysjsz input[name='print-name'][value='0']").prop("checked", true);
					// 		break;
					// 	case "1":
					// 		$("#dysjsz input[name='print-name'][value='1']").prop("checked", true);
					// 		break;
					// 	case "2":
					// 		$("#dysjsz input[name='print-name'][value='2']").prop("checked", true);
					// 		break;
					// 	case "01":
					// 		$("#dysjsz input[name='print-name'][value='0']").prop("checked", true);
					// 		$("#dysjsz input[name='print-name'][value='1']").prop("checked", true);
					// 		break;
					// 	case "02":
					// 		$("#dysjsz input[name='print-name'][value='0']").prop("checked", true);
					// 		$("#dysjsz input[name='print-name'][value='2']").prop("checked", true);
					// 		break;
					// 	case "":
					// 	default:
					// 		break;
					// }

					//合计值
					$("#dysjsz input[name='print-sum'][value='" + jsonData.total + "']").prop("checked", true);
				} else {
					//赋值模板guid
					saveData.tmplGuid = "";
				}
				//获取辅助核算加载表格
				var dataUrl = "/gl/sys/eleAccItemEnbale/getAccItemAll/" + data.agencyCode+"/"+data.acctCode+"/"+prtSetData.componentId+"/"+prtSetData.formatTmplCode+"/"+prtSetData.tmplCode+"/"+data.tmplGuid;
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
						if(data[i].agencyCode=="*"){
							$xtjmb.push(data[i])
						}else{
							$dwjmb.push(data[i])
						}
					}
					var znodes = [];
					znodes.push()
					var nodeObjs = {};
					nodeObjs.open = true;
					nodeObjs.id = '0';
					nodeObjs.pId = '';
					nodeObjs.tmplName = '系统级';
					nodeObjs.templId = '0';
					nodeObjs.reportCode = '0';
					nodeObjs.agencyCode = '*';
					nodeObjs.acctCode =  '*'
					nodeObjs.tmplGuid = ''
					nodeObjs.formatTmplCode = '*'
					nodeObjs.chrId = '0';
					nodeObjs.reportId = '0';
					nodeObjs.isLeaf = '0';
					znodes.push(nodeObjs);
					for (var i = 0; i < $xtjmb.length; i++) {
						var nodeObj = {};
						nodeObj.id = '11';
						nodeObj.pId = '0';
						nodeObj.open = true; 
						if($xtjmb[i].defaultTmpl == 1 && (isSys || $dwjmb.length==0)){
							nodeObj.tmplName = '<span class="treedefault">默认</span><span>'+$xtjmb[i].tmplName+'</span>';
						}else{
							nodeObj.tmplName = $xtjmb[i].tmplName
						}
						nodeObj.templId = $xtjmb[i].templId;
						nodeObj.tmplNames = $xtjmb[i].tmplName;
						nodeObj.tmplGuid =$xtjmb[i].tmplGuid
						nodeObj.defaultTmpl = $xtjmb[i].defaultTmpl;
						nodeObj.reportCode = $xtjmb[i].reportCode;
						nodeObj.agencyCode = '*'
						nodeObj.acctCode =  '*'
						nodeObj.formatTmplCode = $xtjmb[i].templId;
						nodeObj.formatTmplCode = $xtjmb[i].formattmplCode;
						nodeObj.tmplCode = $xtjmb[i].tmplCode;
						nodeObj.chrId = $xtjmb[i].reportId;
						nodeObj.reportId = $xtjmb[i].reportId;
						nodeObj.isLeaf = '1';
						znodes.push(nodeObj);
					}
					if(isSys!=true){
						nodeObjs = {};
						nodeObjs.open = true;
						nodeObjs.id = '1';
						nodeObjs.pId = '';
						nodeObjs.tmplName = '单位级';
						nodeObjs.templId = '1';
						nodeObjs.reportCode = '1';
						nodeObjs.agencyCode = window.ownerData.data.agencyCode;
						nodeObjs.acctCode = window.ownerData.data.acctCode;
						nodeObjs.formatTmplCode = '*'
						nodeObjs.tmplGuid = ''
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
								nodeObj.tmplName = '<span class="treedefault">默认</span><span>'+$dwjmb[i].tmplName+'</span>';
							}else{
								nodeObj.tmplName = $dwjmb[i].tmplName;
							}
							nodeObj.templId = $dwjmb[i].templId;
							nodeObj.tmplNames = $dwjmb[i].tmplName;
							nodeObj.tmplGuid =$dwjmb[i].tmplGuid
							nodeObj.defaultTmpl = $dwjmb[i].defaultTmpl;
							nodeObj.reportCode = $dwjmb[i].reportCode;
							nodeObj.agencyCode = window.ownerData.data.agencyCode;
							nodeObj.acctCode = window.ownerData.data.acctCode;
							nodeObj.formatTmplCode = $dwjmb[i].formattmplCode;
							nodeObj.tmplCode = $dwjmb[i].tmplCode;
							nodeObj.chrId = $dwjmb[i].reportId;
							nodeObj.reportId = $dwjmb[i].reportId;
							nodeObj.isLeaf = '1';
							znodes.push(nodeObj);
						}
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
							name: 'tmplName'
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
					prtSetData.formatTmplCode = treeNode.formatTmplCode
					prtSetData.tmplCode = treeNode.tmplCode
					if(treeNode.isLeaf != '0') {
						if(treeNode.agencyCode=='*'){
							$(".btn-fanan").show()
							$(".btn-delfanan").hide()
							$('.btn-thisdefault').hide()
						}else{
							$(".btn-fanan").hide()
							$(".btn-delfanan").show()
							$('.btn-thisdefault').show()
							
						}
						if(isSys){
							$(".btn-fanan").hide()
							$('.btn-thisdefault').show()
						}
						if((treeNode.agencyCode=='*' && isSys) || treeNode.agencyCode!='*'){
							$('#btn-save').show()
						}else{
							$('#btn-save').hide()
						}
						$('.lis').removeClass('active')
						$(this).addClass('active')
						$("#vpps-data tbody").html("");
						// $("#vpps-data input[name='print-name']").prop('checked', false);
						$("#vpps-data input[name='print-sum']").prop('checked', false);
						$("#vpps-data #tmplType").prop('checked', false);
//						ufma.post("/gl/vouPrint/getPrtSet", prtSetData, page.getPrtSet);
						$.ajax({
							type: "get",
							url: "/gl/vouPrint/getPrtSetPdfNewByGuid?tmplGuid="+  treeNode.tmplGuid + "&ajax=1",
							data: '',
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
				// $("#dysjsz input[name='print-name']:checked").each(function() {
				// 	accoSum = accoSum + $(this).val();
				// });
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
						eleOne.printLevle = $(this).find(".printLevle:checked").val()==undefined?'':$(this).find(".printLevle:checked").val();
						eleArr.push(eleOne);
					}
				});
				postSet.acco = '';
				postSet.accSep = $("#accSep option:selected").attr("value");
				postSet.isShowBill = $("#isShowBill").is(":checked")?'1':'0';
				postSet.printAccoBracket = $("#printAccoBracket").is(":checked")?'1':'0';
				postSet.element = eleArr;
				var accObj = $.inArrayJson(eleArr, 'accItemName','会计科目')
				if(accObj==undefined ||accObj.isPrint == 0){
					ufma.showTip('会计科目为必须勾选打印项')
					return false;
				}
				postSet.total = $("#dysjsz input[name='print-sum']:checked").val();

				saveData.agencyCode = modalactivedata.agencyCode;
				saveData.acctCode = modalactivedata.acctCode;
				saveData.tmplValue = JSON.stringify(postSet).replace(/\"/g, "'");
				saveData.formattmplCode =$('#mubansel option:selected').attr("templId")
//				if(saveData.formattmplCode == "*"){
//					saveData.tmplAgencyCode = "*";
//				}else{
//					saveData.tmplAgencyCode = oData.agencyCode;
//				}
				saveData.tmplCode =  $('#mubansel option:selected').attr("reportCode")
				saveData.componentId = prtSetData.componentId;
				saveData.tmplName = modalactivedata.tmplNames
//				if($("#vouPrintPrintSet #prtFormatList option:selected").attr("data-agencyCode") == "*") {
				if($(".mblis .active").attr("data-agencyCode") == "*") {
					saveData.tmplGuid = "";
				}
				saveData.tmplGuid = modalactivedata.tmplGuid
				saveData.defaultTmpl = modalactivedata.defaultTmpl;
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
				page.getselData()
		 		$.ajax({
					type:"POST",
					url:"/pqr/api/templ",
					dataType:"json",
					data:{
						agencyCode:window.ownerData.data.agencyCode,
						acctCode:window.ownerData.data.acctCode,
						rgCode:window.ownerData.data.rgCode,
						setYear:window.ownerData.data.setYear,
						directory:'打印凭证',
						sys:'100',
						componentId:window.ownerData.data.componentId,
					},
					success:function(data){
						var trss = ''
						for(var i=0;i<data.data.length;i++){
							if(data.data[i].templId == "*"){
								trss+='<option templId="'+data.data[i].templId+'" reportCode='+data.data[i].reportCode+'>'+data.data[i].templName+'</option>'
							}else{
								if(!isSys){
									trss+='<option templId="'+data.data[i].templId+'" reportCode='+data.data[i].reportCode+'>'+data.data[i].templName+'[单位]</option>'
								}
							}
						}
						$('#mubansel').html(trss)
						if($("#mubansel option:selected").attr('templId')=='*'){
							if(isSys){
								$('.rimsurl').hide()
							}else{
								$('.rimsurl').show()
							}
							$('.rimsurls').hide() 
							$('.rimsurldel').hide() 
							$('.rimsurlinset').hide()
							$('.defaultimpls').hide()
							$(".rimsurlinsetmb").hide()
						}else{
							$('.rimsurl').hide()
							$('.rimsurls').show()
							$('.rimsurldel').show() 
							$('.rimsurlinset').show()
							$('.defaultimpls').show()
							$(".rimsurlinsetmb").show()
						}
					},
					error:function(){
					}
				});
			},
			getselData:function(){
				var Nowdata= {
					"agencyCode":window.ownerData.data.agencyCode,
					"acctCode":window.ownerData.data.acctCode,
					"componentId":"GL_VOU"
				}
				ufma.post("/gl/vouPrint/getPrtTmplPdfNew",Nowdata,page.getPrtFormatList)
			},
			//此方法必须保留
			init: function() {
				this.initPage();
				ufma.parse();
				page.isCrossDomain = window.ownerData.data.isCrossDomain
				var h = $(window).height()
				$(".rpt-left").height(h-110)
				$(".rpt-right").height(h-70)
				$('#docTree').height(h-120)
				page.openNewPages = function (isCrossDomain, that, actionType, baseUrl, isNew, title) {
					if (isCrossDomain) {
						// 此处即为监听到跨域
						var data = {
							actionType: actionType, // closeMenu 关闭   openMenu 打开
							url: window.location.protocol + '//'+ window.location.host  + baseUrl,
							isNew: isNew, // isNew: false表示在iframe中打开，为true的话就是在新页面打开
							title: title // 菜单标题
						}
						window.parent.parent.postMessage(data, '*')
					} else {
						//门户打开方式
						that.attr('data-href',  baseUrl);
						that.attr('data-title', title);
						window.parent.parent.openNewMenu(that);
					}
				};
                $(document).on('click','.printLevle',function(){
                    if($(this).is(":checked") && $(this).hasClass('checkedss')){
                        $(this).attr('checked',false).prop('checked',false).removeClass('checkedss')
                    }else {
						$(this).parents('tr').find('.printLevle').removeClass('checkedss')
						$(this).addClass('checkedss')
					}
                })
				//切换纸张模板下拉
				$(document).on('click', ".accnab li", function() {
					if($(this).hasClass('active') != true) {
						$('.accnab li').removeClass('active')
						$(this).addClass('active')
					}
				})
				$(document).on('change','#mubansel',function(){
					if($("#mubansel option:selected").attr('templId')=='*'){
						if(isSys){
							$('.rimsurl').hide()
						}else{
							$('.rimsurl').show()
						}
						$('.rimsurls').hide() 
						$('.rimsurldel').hide() 
						$('.rimsurlinset').hide()
						$('.defaultimpls').hide()
						$(".rimsurlinsetmb").hide()
					}else{
						$('.rimsurl').hide()
						$('.rimsurls').show()
						$('.rimsurldel').show() 
						$('.rimsurlinset').show()
						$('.defaultimpls').show()
						$(".rimsurlinsetmb").show()
					}
				})
				//勾选打印打印
				$("#vpps-data").on("change", "input.isPrint", function() {
					if($(this).attr('isacco')=='1'){
						$(this).prop("checked", true).attr("checked", true);
					}
					$(this).parents("tr").find("input.printType").prop("disabled", !$(this).prop("checked"));
					$(this).parents("tr").find("input.printLevle").prop("disabled", !$(this).prop("checked"));
					if($(this).prop("checked") == false) {
						$(this).parents("tr").find("input.printType").prop("checked", false);
						$(this).parents("tr").find("input.printLevle").prop("checked", false);
					} else if($(this).prop("checked") == true) {
						$(this).parents("tr").find("input.printType").eq(0).prop("checked", true);
						$(this).parents("tr").find("input.printType").eq(1).prop("checked", true);
						// $(this).parents("tr").find("input.printLevle").eq(0).prop("checked", true);
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

					ufma.post("/gl/vouPrint/updatePrtSetPdfNew", postTable, callback);
					$(this).prop("disabled", true);
				});
				$('.rimsurl').on('click',function(){
					iscopy = true
					$('#mobalname').val('')
					page.editor = ufma.showModal('vouBoxcopy', 400, 200);
				})
				$('.rimsurls').on('click',function(){
					var codes = $('#mubansel option:selected').attr("reportCode")
					var templId = $('#mubansel option:selected').attr("templId")
                    var baseUrl = '/pqr/pages/print/pagesetting/pagesetting.html?code='+codes+'&templ='+ templId;
                    page.openNewPages(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, "模板设置");
				})
				$('.rimsurlinsetmb').on('click',function(){
					var codes = $('#mubansel option:selected').attr("reportCode")
					var templId = $('#mubansel option:selected').attr("templId")
                    var baseUrl = '/pqr/pages/design/templ/templ.html?code='+codes+'&templ='+ templId;
                    page.openNewPages(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, "模板设置");
				})
				$('.rimsurldel').on('click',function(){
					var codes = $('#mubansel option:selected').attr("reportCode")
					var templId = $('#mubansel option:selected').attr("templId")
					$.ajax({
						type:"POST",
						url:"/pqr/api/deletetempl",
						dataType:"json",
						data:{
							reportCode:codes,
							templId:templId
						},
						success:function(data){
							$.ajax({
								type:"POST",
								url:"/pqr/api/templ",
								dataType:"json",
								data:{
									agencyCode:window.ownerData.data.agencyCode,
									acctCode:window.ownerData.data.acctCode,
									rgCode:window.ownerData.data.rgCode,
									setYear:window.ownerData.data.setYear,
									directory:'打印凭证',
									sys:'100',
									componentId:window.ownerData.data.componentId,
								},
								success:function(data){
									var trss = ''
									for(var i=0;i<data.data.length;i++){
										if(data.data[i].templId == "*"){
											trss+='<option templId="'+data.data[i].templId+'" reportCode='+data.data[i].reportCode+'>'+data.data[i].templName+'</option>'
										}else{
											if(!isSys){
												trss+='<option templId="'+data.data[i].templId+'" reportCode='+data.data[i].reportCode+'>'+data.data[i].templName+'[单位]</option>'
											}
										}
									}
									$('#mubansel').html(trss)
									if($("#mubansel option:selected").attr('templId')=='*'){
										$('.rimsurl').show()
										$('.rimsurls').hide() 
										$('.rimsurldel').hide() 
										$('.rimsurlinset').hide()
										$('.defaultimpls').hide()
										$(".rimsurlinsetmb").hide()
									}else{
										$('.rimsurl').hide()
										$('.rimsurls').show()
										$('.rimsurldel').show() 
										$('.rimsurlinset').show()
										$('.defaultimpls').show()
										$(".rimsurlinsetmb").show()
									}
								},
								error:function(){
								}
							});
						},
						error:function(){
							alert("error");
						}
					});
				
				})
				$('.rimsurlinset').on('click',function(){
					iscopy = false
					var names = $('#mubansel option:selected').html()
					names= names.substring(0,names.length-4)
					$('#mobalname').val(names)
					page.editor = ufma.showModal('vouBoxcopy', 400, 200);
				
				})
				$('.btn-thisdefault').on('click',function(){
					page.savePrtSet();
					postTable.pubPrtPrintTmpl.defaultTmpl = 1
					postTable.pubPrtPrintTmpl.tmplGuid = modalactivedata.tmplGuid
					var callback = function(result) {
						ufma.showTip(result.msg, function(){}, result.flag);
						page.getselData()
					}
					ufma.post("/gl/vouPrint/saveDefultTmplPdfNew", postTable, callback);
				})
				$('.btn-fanan').on('click',function(){
					page.editor = ufma.showModal('vouBoxcopyfa', 400, 300);
				})
				$('.btn-delfanan').on('click',function(){
					page.savePrtSet();
					postTable.pubPrtPrintTmpl.tmplGuid = modalactivedata.tmplGuid
					var callback = function(result) {
						ufma.showTip(result.msg, function(){}, result.flag);
						page.getselData()
					}
					ufma.post("/gl/vouPrint/deletePrtSetNew", postTable, callback);
				})
				//点击关闭的事件
				$('#btn-qx').click(function() {
					_close("cancel");
				});
				$('#vouBoxcopysave').click(function() {
					if($('#mobalname').val()!=''){
						if(iscopy){
							var codes = $('#mubansel option:selected').attr("reportCode")
							var templId = $('#mubansel option:selected').attr("templId")
							var names =$("#mobalname").val();			
							var formData = {
							 	'reportCode':codes,
							 	'templId':templId,
							 	'templName':names,
							 	'agencyCode':window.ownerData.data.agencyCode,
							 	'acctCode':window.ownerData.data.acctCode,
							 	'isOrg':1
							}
							var _this=$(this)
						  	$.ajax({
								type:"POST",
								url:"/pqr/api/copytempl",
								dataType:"json",
								data:formData,
								success:function(data){
									var codes = data.data.reportCode
									var templId =  data.data.templId
									var baseUrl = '/pqr/pages/design/templ/templ.html?code='+codes+'&templ='+ templId;
									page.openNewPages(page.isCrossDomain,_this, 'openMenu', baseUrl, false, "模板设置");
								},
								error:function(){
									alert("error");
								}
							});
						}else{
							var codes = $('#mubansel option:selected').attr("reportCode")
							var templId = $('#mubansel option:selected').attr("templId")
							var names =$("#mobalname").val();			
							var formData = new FormData()
							formData.append('reportCode', codes)
							formData.append('templId', templId)
							formData.append('templName', names)
							formData.append('agencyCode', window.ownerData.data.agencyCode)
							formData.append('acctCode', window.ownerData.data.acctCode)
							formData.append('isOrg', 1)
							var xhr = new XMLHttpRequest()
							xhr.open('POST', '/pqr/api/modifytempl', true)
							xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
							xhr.responseType = 'blob'
							//保存文件
							xhr.onload = function (e) {
							    if (xhr.status === 200) {
									$('#mubansel option:selected').html($('#mobalname').val()+'[单位]')
								}
							}
							xhr.onreadystatechange = function () {
							    if (xhr.readyState === 4) {
							      //通信成功时
							      if (xhr.status === 200) {
							        //交易成功时
							      } else {
							        //交易失败时, 处理错误
							        var content = xhr.getResponseHeader('Content-Disposition')
							        var contentArr = content.split(';')
							        var errorMessage = decodeURIComponent(contentArr[1].split('=')[1])
							        alert(errorMessage)
							      }
							    }
							}
							xhr.send(formData)
						}
						page.editor.close()
					}else{
						ufma.showTip('请输入模板名称',function(){},'warning')
					}
				});
				$('#vouBoxcopyfasave').click(function() {
					if($('#mobalnames').val()!=''){
						page.savePrtSet();
						postTable.pubPrtPrintTmpl.agencyCode = oData.agencyCode
						postTable.pubPrtPrintTmpl.acctCode = oData.acctCode
						postTable.pubPrtPrintTmpl.defaultTmpl = 0
						postTable.pubPrtPrintTmpl.tmplName = $('#mobalnames').val()
						var callback = function(result) {
							ufma.showTip(result.msg, function(){}, result.flag);
							page.getselData()
						}
						ufma.post("/gl/vouPrint/copySysPrtSetPdf", postTable, callback);
						page.editor.close()
					}else{
						ufma.showTip('请输入模板名称',function(){},'warning')
					}
				});
				$('#vouBoxcopyqx').click(function() {
					page.editor.close()
				});
				$('#vouBoxcopyfaqx').click(function() {
					page.editor.close()
				});
			}
		}
	}();
	/////////////////////
	page.init();
});