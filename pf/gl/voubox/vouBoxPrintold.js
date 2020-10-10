$(function() {
	var page = function() {
		var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host: "http://" + window.location.host;
		var serachData = {
			accaCode: "",
			accoCode: "",
			acctCode: "",
			agencyCode: "",
			startVouDate: "",
			endVouDate: "",
			inputorName: "",
			printCount: "",
			remark: "",
			rgCode: "",
			setYear: "",
			startStadAmt: 0,
			endStadAmt: 0,
			startVouNo: "",
			endVouNo: "",
			vouStatus: "O",
			vouTypeCode: "",
			currentPage: 1,
			pageSize: 20,
			errFlag: "",
			treasuryHook:''
		};
		var vouTypeArray = {};
		var vouisParallel = false
		//↓↓下面为传数据时需要用到的全局变量↓↓
		//定义传输数据对象
		var vbObj;
		//定义凭证的vouGuid变量
		var vbGuid;
		//定义登录用户变量
		var user = "姜叶新";
		var zNodes;
		var vbacctData;
		//获取门户信息
		var svData;
		var voutypeacca = ''
		var vousinglepz = false
		var styleType = "notMergeView"; //样式类型 默认分录模式
		/*
		//定义时间变量，用于datetimepicker
		var vbDate = new Date();
		var vbYear = vbDate.getFullYear();
		var vbMonth = vbDate.getMonth()+1;
		vbMonth = (vbMonth>9)?vbMonth:"0"+vbMonth;
		var vbDay = vbDate.getDate();
		*/

		return {

			//设置高度
			setHeight: function() {
				var outH = $("#vouBoxTable").offset().top;
				var tableH = $("#vouBoxTable").outerHeight();
				var barH = $("#vbTable-tool-bar").outerHeight();
				var height = outH + tableH + barH;
				$(".workspace").outerHeight(height);
			},
			//根据单位code查找账套
			returnaccCode: function(code) {
				for(var i = 0; i < vbacctData.length; i++) {
					if(vbacctData[i].CHR_CODE === code) {
						return vbacctData[i].CODE_NAME
						break;
					}
				}
			},
			//表格金额自动添加千分位和小数点保留两位
			moneyFormat: function(num) {
				if(num != '') {
					return num = (num == null) ? 0 : (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
				} else {
					return 0.00
				}
			},

			//
			numFormat: function(s) {
				if($.isNull(s)) return '0';
				else return s;
			},

			//根据svMenuId和svRoleId获取按钮权限，接口：/df/init/ResState.do?svMenuId=""&svRoleId=""
			/*getPermission:function(reslut){
				var reslist = reslut.reslist;
				ufma.isShow(reslist);
			},*/

			//$.ajax()，获取凭证状态
			initVouStatus: function(result) {
				var data = result.data;
				serachData.vouStatus = data[0].ENU_CODE;

				var $statusLi;
				for(var i = 0; i < data.length; i++) {
					if(data[i].ENU_NAME == "未审核") {
						$statusLi = $('<li class="active"><a href="javascript:;" data-status="' + data[i].ENU_CODE + '">' + data[i].ENU_NAME + '</a></li>');
					} else {
						$statusLi = $('<li><a href="javascript:;" data-status="' + data[i].ENU_CODE + '">' + data[i].ENU_NAME + '</a></li>');
					}
					$("#vouBox .vbStatus").append($statusLi);
				}
				$statusLiAll = $('<li><a href="javascript:;" data-status="">全部</a></li>');
				$("#vouBox .vbStatus").append($statusLiAll);
			},

			//$.ajax()，获取枚举——打印状态
			initPrintStatus: function(result) {
				var data = result.data;

				var $statusOp = $('<button class="btn btn-primary" value="">全部</button>');
				$("#vouBox #vbPrintStatus").append($statusOp);

				for(var i = 0; i < data.length; i++) {
					var $status = $('<button class="btn btn-default" value="' + data[i].ENU_CODE + '">' + data[i].ENU_NAME + '</button>');
					$("#vouBox #vbPrintStatus").append($status);
				}
			},

			//$.ajax()，获取数据数据成功，给凭证类型下拉列表添加option
			initVouType: function(result) {
				var data = result.data;
				vouTypeArray = {};
				//循环把option填入select
				var $vouTypeOp = '<option value="">  </option>';
				for(var i = 0; i < data.length; i++) {
					//创建凭证类型option节点
					vouTypeArray[data[i].CHR_CODE] = data[i].CHR_NAME;
					$vouTypeOp += '<option value="' + data[i].CHR_CODE + '">' + data[i].CHR_NAME + '</option>';
				}
				$('#vbVouTypeCode').html($vouTypeOp);
			},
			getVouTypeNameByCode: function(key) {

				return(vouTypeArray[key] == undefined) ? "" : vouTypeArray[key];
			},
			initVouBoxTable: function(result) {
				tableData = result;
				if(styleType == 'notMergeView') {
					$(".table-tab").css("overflow-x", "auto");
					$("#vouBoxTable").css("width", "100%");
					page.initVouBoxOldTable(tableData);
				} else {
					$(".table-tab").css("overflow-x", "auto");
					$("#vouBoxTable").css("width", "2000px");
					page.initVouBoxNewTable(tableData);

				}
			},
			//绘制新样式表格
			initVouBoxNewTable: function(result) {
				// $('#vouBoxThead').html("");
				var $tableHead = $('#vouBoxThead');
				if(voutypeacca == 1 && vousinglepz == true) { //平行记账单凭证
					var $tableHeadInfo = $('<tr><th class="vB-check-style nowrap"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
						'<input type="checkbox" id="vbCheckAll"/>&nbsp;<span></span></label></th>' +
						'<th class="ellipsis" style="width:60px">凭证来源</th>' +
						'<th class="ellipsis" style="width:80px">凭证号</th>' +
						'<th class="ellipsis" style="width:90px">凭证日期<div/></th>' +
						'<th class="ellipsis">摘要</th>' +
						'<th class="vB-num-style">财务会计金额</th>' +
						'<th class="vB-num-style">预算会计金额</th>' +
						'<th class="ellipsis" style="width:60px">附件张数</th>' +
						'<th class="ellipsis">制单人</th>' +
						'<th class="ellipsis" style="width:90px">制单日期</th>' +
						'<th class="ellipsis">审核人</th>' +
						'<th class="ellipsis" style="width:90px">审核日期</th>' +
						'<th class="ellipsis">记账人</th>' +
						'<th class="ellipsis" style="width:90px">记账日期</th>' +
						'<th class="vB-action-style">操作</th></tr>');
				} else if(voutypeacca == 1 && vousinglepz == false) { //平行记账双凭证
					var $tableHeadInfo = $('<tr><th rowspan="2" class="vB-check-style nowrap"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
						'<input type="checkbox" id="vbCheckAll"/>&nbsp;<span></span></label></th>' +
						'<th rowspan="2" class="ellipsis" style="width:60px">凭证来源</th>' +
						'<th rowspan="2" class="ellipsis" style="width:90px">凭证日期<div/></th>' +
						'<th colspan="3" class="ellipsis">财务会计</th>' +
						'<th colspan="3" class="ellipsis" >预算会计</th>' +
						'<th rowspan="2" class="ellipsis" style="width:60px">附件张数</th>' +
						'<th rowspan="2" class="ellipsis">制单人</th>' +
						'<th rowspan="2" class="ellipsis" style="width:90px">制单日期</th>' +
						'<th rowspan="2" class="ellipsis">审核人</th>' +
						'<th rowspan="2" class="ellipsis" style="width:90px">审核日期</th>' +
						'<th rowspan="2" class="ellipsis">记账人</th>' +
						'<th rowspan="2" class="ellipsis" style="width:90px">记账日期</th>' +
						'<th rowspan="2" class="vB-action-style">操作</th></tr>' +
						'<tr><th class="ellipsis">凭证号</th>' +
						'<th class="ellipsis">摘要</th>' +
						'<th class="vB-num-style">金额</th>' +
						'<th class="ellipsis">凭证号</th>' +
						'<th class="ellipsis">摘要</th>' +
						'<th class="vB-num-style">金额</th></tr>'
					);
				} else { //非平行记账
					var $tableHeadInfo = $('<tr><th class="vB-check-style nowrap"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
						'<input type="checkbox" id="vbCheckAll"/>&nbsp;<span></span></label></th>' +
						'<th class="ellipsis" style="width:60px">凭证来源</th>' +
						'<th class="ellipsis" style="width:80px">凭证号</th>' +
						'<th class="ellipsis" style="width:90px">凭证日期<div/></th>' +
						'<th class="ellipsis">摘要</th>' +
						'<th class="vB-num-style">金额</th>' +
						'<th class="ellipsis" style="width:60px">附件张数</th>' +
						'<th class="ellipsis">制单人</th>' +
						'<th class="ellipsis" style="width:90px">制单日期</th>' +
						'<th class="ellipsis">审核人</th>' +
						'<th class="ellipsis" style="width:90px">审核日期</th>' +
						'<th class="ellipsis">记账人</th>' +
						'<th class="ellipsis" style="width:90px">记账日期</th>' +
						'<th class="vB-action-style">操作</th></tr>');
				}

				$tableHead.html($tableHeadInfo);
				if(!$.isNull(result.data) && $(".searchVou").length > 0) {
					var list = result.data.list;
					var paging = result.data.page;
					//定义凭证金额合计变量
					var moneySum = 0;
					var moneySumys = 0;

					//循环加入凭证
					for(var i = 0; i < list.length; i++) {
						//凭证头基本节点
						var $headBase = $('<tr class="vouHead"><td  class="vB-check-style">' +
							'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
							'<input type="checkbox" name="checkList"/>&nbsp;<span></span>' +
							'</label></td></tr>');

						//凭证金额合计操作
						if(list[i].vouHead.amtCr != '') {
							moneySum = moneySum + list[i].vouHead.amtCr;
						}
						if(list[i].vouHead.ysAmtCr != '') {
							moneySumys = moneySumys + list[i].vouHead.ysAmtCr;
						}
						//循环加入每条凭证的分录
						if(voutypeacca == 1 && vousinglepz == true) { //平行记账单凭证
							var $detailsBase = $('<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.vouSource) + '</span></td>' +
								'<td class="ellipsis tc"><span style="cursor: pointer;"><a class="viewData"  data-vouGuid="' + list[i].vouHead.vouGuid +
								'"data-acca="' + list[i].vouHead.accaCode + '" data-vouKind="' + list[i].vouHead.vouKind +
								'"data-errFlag="' + list[i].vouHead.errFlag + '" data-vouGroupId="' + list[i].vouHead.vouGroupId +
								'"data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouTypeCode="' + list[i].vouHead.vouTypeCode +
								'"data-vouStatus="' + list[i].vouHead.vouStatus + '">' + ufma.parseNull(list[i].vouHead.vouTypeName) +
								'-' + ufma.parseNull(list[i].vouHead.vouNo) + '</a></span></td>' +
								'<td  class="ellipsis tc"><div style="width:90px"><span>' + ufma.parseNull(list[i].vouHead.vouDate) + '</span></div></td>' +
								'<td class="ellipsis" title="' + ufma.parseNull(list[i].vouHead.vouDesc) + '"><span >' + ufma.parseNull(list[i].vouHead.vouDesc) + '</span></td>' +
								'<td class="vB-num-style">' + page.moneyFormat(list[i].vouHead.amtCr) + '</td>' +
								'<td class="vB-num-style">' + page.moneyFormat(list[i].vouHead.ysAmtCr) + '</td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.vouCnt) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.inputorName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.inputDate)).substring(0, 10) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.auditorName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.auditDate)).substring(0, 10) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.posterName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.postDate)).substring(0, 10) + '</span></td>'
							);
						} else if(voutypeacca == 1 && vousinglepz == false) { //平行记账双凭证
							var $detailsBase = $('<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.vouSource) + '</span></td>' +
								'<td  class="ellipsis tc"><div style="width:90px"><span >' + ufma.parseNull(list[i].vouHead.vouDate) + '</span></div></td>' +
								'<td class="ellipsis"><span style="cursor: pointer;"><a class="viewData" data-vouGuid="' + list[i].vouHead.vouGuid +
								'"data-acca="' + list[i].vouHead.accaCode + '" data-vouKind="' + list[i].vouHead.vouKind +
								'"data-errFlag="' + list[i].vouHead.errFlag + '" data-vouGroupId="' + list[i].vouHead.vouGroupId +
								'"data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouTypeCode="' + list[i].vouHead.vouTypeCode +
								'"data-vouStatus="' + list[i].vouHead.vouStatus + '">' + ufma.parseNull(list[i].vouHead.vouTypeName) +
								'-' + ufma.parseNull(list[i].vouHead.vouNo) + '</a></span></td>' +
								'<td class="ellipsis" title="' + ufma.parseNull(list[i].vouHead.vouDesc) + '"><span >' +
								ufma.parseNull(list[i].vouHead.vouDesc) + '</span></td>' +
								'<td class="vB-num-style">' + page.moneyFormat(list[i].vouHead.amtCr) + '</td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.ysVouTypeName) + '-' +
								ufma.parseNull(list[i].vouHead.ysVouNo) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.ysVouDesc) + '</span></td>' +
								'<td class="vB-num-style">' + page.moneyFormat(list[i].vouHead.ysAmtCr) + '</td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.vouCnt) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.inputorName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.inputDate)).substring(0, 10) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.auditorName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.auditDate)).substring(0, 10) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.posterName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.postDate)).substring(0, 10) + '</span></td>'
							);
						} else { //非平行记账
							var $detailsBase = $('<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.vouSource) + '</span></td>' +
								'<td class="ellipsis tc"><span style="cursor: pointer;"><a class="viewData"  data-vouGuid="' + list[i].vouHead.vouGuid +
								'"data-acca="' + list[i].vouHead.accaCode + '" data-vouKind="' + list[i].vouHead.vouKind +
								'"data-errFlag="' + list[i].vouHead.errFlag + '" data-vouGroupId="' + list[i].vouHead.vouGroupId +
								'"data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouTypeCode="' + list[i].vouHead.vouTypeCode +
								'"data-vouStatus="' + list[i].vouHead.vouStatus + '">' + ufma.parseNull(list[i].vouHead.vouTypeName) +
								'-' + ufma.parseNull(list[i].vouHead.vouNo) + '</a></span></td>' +
								'<td  class="ellipsis tc"><div style="width:90px"><span >' + ufma.parseNull(list[i].vouHead.vouDate) + '</span></div></td>' +
								'<td class="ellipsis" title="' + ufma.parseNull(list[i].vouHead.vouDesc) + '"><span >' +
								ufma.parseNull(list[i].vouHead.vouDesc) + '</span></td>' +
								'<td class="vB-num-style">' + page.moneyFormat(list[i].vouHead.amtCr) + '</td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.vouCnt) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.inputorName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.inputDate)).substring(0, 10) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.auditorName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.auditDate)).substring(0, 10) + '</span></td>' +
								'<td class="ellipsis"><span >' + ufma.parseNull(list[i].vouHead.posterName) + '</span></td>' +
								'<td class="ellipsis"><span >' + (ufma.parseNull(list[i].vouHead.postDate)).substring(0, 10) + '</span></td>'
							);
						}
						//分录tr（分录基本节点）填入tbody
						$headBase.append($detailsBase);
						//定义凭证头操作节点
						var $headAct;
						//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
						//凭证头根据状态显示不同按钮，需判断凭证状态！4个展现形式
						switch(list[i].vouHead.vouStatus) {
							case "O":
								$headAct = $('<td  class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-audit btn-permission vb-audit-one" data-toggle="tooltip" action= "" title="审核">' +
									'<span class="glyphicon icon-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-cancel btn-permission vb-invalid-one" data-toggle="tooltip" action= "" title="作废">' +
									'<span class="glyphicon icon-to-void"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "A":
								$headAct = $('<td class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-un-audit btn-permission vb-cancelaudit-one" data-toggle="tooltip" action= "" title="销审">' +
									'<span class="glyphicon icon-cancel-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-post btn-permission vb-accounting-one" data-toggle="tooltip" action= "" title="记账">' +
									'<span class="glyphicon icon-account"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "F":
								$headAct = $('<td  class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-audit btn-permission vb-audit-one" data-toggle="tooltip" action= "" title="审核">' +
									'<span class="glyphicon icon-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-cancel btn-permission vb-invalid-one" data-toggle="tooltip" action= "" title="作废">' +
									'<span class="glyphicon icon-to-void"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "P":
								$headAct = $('<td  class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-turnred btn-permission vb-red-one" data-toggle="tooltip" action= "" title="冲红">' +
									'<span class="glyphicon icon-write-off"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-unaccounting btn-permission vb-unaccounting-one" data-toggle="tooltip" action= "" title="反记账">' +
									'<span class="glyphicon icon-cancel-audit"></span></a>' +
									'</td>');
								break;
							case "C":
								$headAct = $('<td  class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-un-cancel btn-permission vb-reduction-one" data-toggle="tooltip" action= "" title="还原">' +
									'<span class="glyphicon icon-recover"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-delete btn-permission vb-delete-one" data-toggle="tooltip" action= "" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							default:
								$headAct = $('<td  class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
						}
						//判断结束，填入凭证头信息节点
						$headBase.append($headAct);
						$("#vouBoxTable tbody").append($headBase);
					}
					//合计
					if(voutypeacca == 1 && vousinglepz == true) { //平行记账单凭证
						$(".vbDataSum").html("共 <span class='vbPageSum'>" + list.length + "</span> 张凭证  财务会计金额 <span class='vbPageMoney'>" + page.moneyFormat(moneySum) + "</span> 预算会计金额<span class='vbPageMoney'>" + page.moneyFormat(moneySumys) + "  </span>");
					} else if(voutypeacca == 1 && vousinglepz == false) { //平行记账双凭证
						$(".vbDataSum").html("共 <span class='vbPageSum'>" + list.length + "</span> 张凭证  财务会计金额 <span class='vbPageMoney'>" + page.moneyFormat(moneySum) + "</span> 预算会计金额<span class='vbPageMoney'>" + page.moneyFormat(moneySumys) + "  </span>");
					} else { //非平行记账
						$(".vbDataSum").html("共 <span class='vbPageSum'>" + list.length + "</span> 张凭证  金额 <span class='vbPageMoney'>" + page.moneyFormat(moneySum) + "</span>");
					}
					//按钮提示
					$("[data-toggle='tooltip']").tooltip();
					$("#vouBoxTable .vb-invalid-one,#vouBoxTable .vb-delete-one").on("click", function() {
						page._self = $(this);
					});
					$('#vouBoxTable .vb-invalid-one').ufTooltip({
						content: '您确定作废当前凭证吗？',
						onYes: function() {
							page.vbActOne("/gl/vouBox/invalidVous", $(page._self));
						},
						onNo: function() {}
					});
					$('#vouBoxTable .vb-delete-one').ufTooltip({
						content: '您确定删除当前凭证吗？',
						onYes: function() {
							page.vbActOne("/gl/vouBox/deleteVous", $(page._self));
						},
						onNo: function() {}
					});

					//根据凭证，整体上颜色
					$("#vouBox").find("tr.vouHead:odd").each(function() {
						$(this).css({
							"background-color": "#f9f9f9"
						}).nextUntil("tr.vouHead").css({
							"background-color": "#f9f9f9"
						});
					});
					$("#vouBox").find("tr.vouHead:even").each(function() {
						$(this).css({
							"background-color": "#ffffff"
						}).nextUntil("tr.vouHead").css({
							"background-color": "#ffffff"
						});
					});

					//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
					//定义批量操作按钮节点
					var $moreAct = '<label class="mt-checkbox mt-checkbox-outline margin-right-8" style="margin-bottom: 0;">' +
						'<input class="vbTable-toolbar-checkAll" type="checkbox" name="test" value="1"> 全选' +
						'<span></span>' +
						'</label>';
					if(serachData.vouStatus == 'O') {
						//O:未审核凭证
						$moreAct += '<button id="vb-audit-more" type="button" class="btn btn-sm btn-default btn-downto btn-audit btn-permission">审核</button>' +
							'<button id="vb-invalid-more" type="button" class="btn btn-sm btn-default btn-downto btn-cancel btn-permission">作废</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'A') {
						//A:已审核凭证
						$moreAct += '<button id="vb-cancelaudit-more" type="button" class="btn btn-sm btn-default btn-downto btn-un-audit btn-permission">销审</button>' +
							'<button id="vb-accounting-more" type="button" class="btn btn-sm btn-default btn-downto btn-post btn-permission">记账</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'F') {
						//F:已复审凭证
						$moreAct += '<button id="vb-audit-more" type="button" class="btn btn-sm btn-default btn-downto btn-audit btn-permission">审核</button>' +
							'<button id="vb-invalid-more" type="button" class="btn btn-sm btn-default btn-downto btn-cancel btn-permission">作废</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'P') {
						//P:已记账凭证
						$moreAct += '<button id="vb-red-more" type="button" class="btn btn-sm btn-default btn-downto btn-turnred btn-permission" style="display:none;">冲红</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>'+
							'<button id="vb-unaccounting-more" type="button" class="btn btn-sm btn-default btn-downto btn-unaccounting btn-permission">反记账</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'C') {
						//C:已作废凭证
						$moreAct += '<button id="vb-reduction-more" type="button" class="btn btn-sm btn-default btn-downto btn-un-cancel btn-permission">还原</button>' +
							'<button id="vb-delete-more" type="button" class="btn btn-sm btn-default btn-downto btn-delete btn-permission">删除</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else {
						//全部
						$moreAct += '<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					}

					//分页部分功能
					//分页  不分页需判断
					if(paging.pageSize != 0) {
						//创建基本分页节点
						var $pageBase = $('<ul id="vbTable-pagination" class="pagination pagination-sm pull-left"></ul>');
						//创建上一页节点  根据当前也判断是否可以点
						var $pagePrev;
						if((paging.currentPage - 1) == 0) {
							$pagePrev = $('<li class="vbPrevPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-left"></span></span></li>');
						} else {
							$pagePrev = $('<li class="vbPrevPage"><a href="javascript:;" aria-label="Previous" data-prevpage=' + (paging.currentPage - 1) + '>' +
								'<span aria-hidden="true" class="glyphicon icon-angle-left"></span>' +
								'</a></li>');
						}
						$pageBase.append($pagePrev);
						//创建页数节点,根据pageSize和凭证数据总数
						//创建页数变量
						var pageAmount = Math.ceil(paging.totalRows / paging.pageSize);
						var $pageItem;
						for(var k = 1; k <= pageAmount; k++) {
							//第一页和最后一页显示
							if(k == 1 || k == pageAmount) {
								//三元运算判断是否当前页
								$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
							} else {
								//判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
								if((pageAmount - 2) <= 3) {
									//三元运算判断是否当前页
									$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
								} else if((pageAmount - 2) > 3) {
									//判断当前页位置
									if(paging.currentPage <= 2) {
										//分页按钮加载2到4之间
										if(k >= 2 && k <= 4) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									} else if(paging.currentPage > 2 && paging.currentPage < (pageAmount - 1)) {
										//分页按钮加载currentPage-1到currentPage+1之间
										if(k >= (paging.currentPage - 1) && k <= (paging.currentPage + 1)) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									} else if(paging.currentPage >= (pageAmount - 1)) {
										//分页按钮加载pageAmount-3到pageAmount-1之间
										if(k >= (pageAmount - 3) && k <= (pageAmount - 1)) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									}
								}
							}
							$pageBase.append($pageItem);
						}
						//创建下一页节点 根据当前页判断是否可以点
						var $pageNext;
						if((pageAmount - paging.currentPage) == 0) {
							$pageNext = $('<li class="vbNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>');
						} else {
							$pageNext = $('<li class="vbNextPage"><a href="javascript:;" aria-label="Next" data-nextpage=' + (paging.currentPage + 1) + '>' +
								'<span aria-hidden="true" class="glyphicon icon-angle-right"></span>' +
								'</a></li>');
						}
						$pageBase.append($pageNext);
						$("#vouBox .ufma-table-paginate").append($pageBase);
					}

					//创建分页大小基本节点
					var $pageSizeBase = $('<div class="pull-left" style="margin: 0 16px;"></div>');
					var $pageSel = $('<select class="vbPageSize bordered-input"></select>');
					//根据pageSize创建下拉列表
					//分页数组
					var pageArr = [20, 50, 100, 200, 0];
					var $pageOp;
					//定义是否不分页变量
					var isNoPaging;
					for(var n = 0; n < pageArr.length; n++) {
						isNoPaging = (pageArr[n] == 0) ? "不分页" : pageArr[n];
						if(pageArr[n] == paging.pageSize) {
							$pageOp = $('<option value=' + pageArr[n] + ' selected>' + isNoPaging + '</option>');
						} else {
							$pageOp = $('<option value=' + pageArr[n] + '>' + isNoPaging + '</option>');
						}
						$pageSel.append($pageOp);
					}
					$pageSizeBase.append("<span>显示 </span>");
					$pageSizeBase.append($pageSel);
					$pageSizeBase.append("<span> 条</span>");
					$("#vouBox .ufma-table-paginate").prepend($pageSizeBase);

					//创建总数统计节点
					var $vouDataSum = $('<div class="pull-left">共 <span class="vbSum">' + paging.totalRows + '</span> 条</div>');
					$("#vouBox .ufma-table-paginate").prepend($vouDataSum);

					/*if(paging.pageSize!=0){
						//创建到哪页和按钮节点
						var $pageGo = $('<div class="pull-left" style="margin-left: 16px;">到 '
							+'<input type="text" id="vbGoPage" class="bordered-input padding-3" placeholder="1"/>'
							+' 页</div>'
							+'<button id="vb-go-btn" type="button" class="btn btn-sm btn-default btn-downto" style="margin-left: 8px;">确定</button>');
						$("#vouBox .ufma-table-paginate").append($pageGo);
					}*/

					$("#vouBoxTable input#vbCheckAll").prop("checked", false);
					$("#vouBoxTable input#vbCheckAll").prop("disabled", false);
					$("#btn-print-preview").prop("disabled", false);
				} else {
					$("#vouBoxTable input#vbCheckAll").prop("checked", false);
					$("#vbTable-tool-bar input.vbTable-toolbar-checkAll").prop("checked", false);
					$("#vouBoxTable input#vbCheckAll").prop("disabled", true);
					$("#vbTable-tool-bar input.vbTable-toolbar-checkAll").prop("disabled", true);
					if(voutypeacca == 1 && vousinglepz == true) { //平行记账单凭证
						var colspan = 15;
					} else if(voutypeacca == 1 && vousinglepz == false) { //平行记账双凭证
						var colspan = 17;
					} else { //非平行记账
						var colspan = 14;
					}
					var $empty = $('<tr><td class="dataTables_empty" valign="top" colspan="' + colspan + '">' +
						'<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>' +
						'</td></tr>');
					$("#vouBoxTable tbody").append($empty);
					$("#btn-print-preview").prop("disabled", true);
				}
				//权限判断
				ufma.isShow(page.reslist);
				ufma.setPortalHeight();

				//ufma.setBarPos($(window));

				$('#vouBoxModel').ufScrollBar({
					hScrollbar: true,
					mousewheel: false
				});
				$(window).trigger('scroll');

				//				page.setHeight();	
			},
			//$.ajax()，获取数据数据成功，填充表格内容
			initVouBoxOldTable: function(result) {
				$('#vouBoxModel').ufScrollBar('destroy');
				//$('#vouBoxThead').html("");
				var $tableHead = $('#vouBoxThead');
				var $tableHeadInfo = $('<tr><th class="vB-check-style nowrap"><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
					'<input type="checkbox" id="vbCheckAll"/>&nbsp;<span></span></label></th>' +
					'<th class="ellipsis">摘要</th>' +
					'<th class="ellipsis">科目</th>' +
					'<th class="vB-num-style">借方金额</th>' +
					'<th class="vB-num-style">贷方金额</th>' +
					'<th class="vB-action-style">操作</th></tr>');
				$tableHead.html($tableHeadInfo);
				if(!$.isNull(result.data) && $(".searchVou").length > 0) {
					var list = result.data.list;
					var paging = result.data.page;
					//定义凭证金额合计变量
					var moneySum = 0;
					var moneySumys = 0;

					//循环加入凭证
					for(var i = 0; i < list.length; i++) {
						//凭证表格头

						//凭证头基本节点
						var $headBase = $('<tr class="vouHead"><td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-check-style">' +
							'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">' +
							'<input type="checkbox" name="checkList"/>&nbsp;<span></span>' +
							'</label></td></tr>');

						//定义凭证头信息节点
						var $headTitle;
						if(voutypeacca == 1 && vousinglepz == true) {
							$headTitle = $('<td colspan="4" class="">' +
								'<input class="vbGuid" type="hidden" data-errFlag = ' + list[i].vouHead.errFlag + ' data-group="' + list[i].vouHead.vouGroupId + '"  value="' + list[i].vouHead.vouGuid + '" />' +
								'<input class="vouKind" type="hidden" data-group="' + list[i].vouHead.vouKind + '"  value="' + list[i].vouHead.vouKind + '" />' +
								'<input class="vbPerd" type="hidden" data-status="' + list[i].vouHead.vouStatus + '" data-acca="' + list[i].vouHead.accaCode + '" value="' + list[i].vouHead.fisPerd + '" />' +
								'<a href="javascript:;" class="headInfo pull-left">日期：<span class="vbVouDate">' + list[i].vouHead.vouDate + '</span> 凭证字号：<span class="vbVouNo" data-type="' + list[i].vouHead.vouTypeCode + '">' + page.getVouTypeNameByCode(list[i].vouHead.vouTypeCode) + '-' + list[i].vouHead.vouNo + '</span> 财务会计金额：' + page.moneyFormat(list[i].vouHead.amtCr) + ' 预算会计金额：' + page.moneyFormat(list[i].vouHead.ysAmtCr) + ' 附件数：' + page.numFormat(list[i].vouHead.vouCnt) + '张</a>' +
								'</td>');
						} else {
							$headTitle = $('<td colspan="4" class="">' +
								'<input class="vbGuid" type="hidden" data-errFlag = ' + list[i].vouHead.errFlag + ' data-group="' + list[i].vouHead.vouGroupId + '"  value="' + list[i].vouHead.vouGuid + '" />' +
								'<input class="vouKind" type="hidden" data-group="' + list[i].vouHead.vouKind + '"  value="' + list[i].vouHead.vouKind + '" />' +
								'<input class="vbPerd" type="hidden" data-status="' + list[i].vouHead.vouStatus + '" data-acca="' + list[i].vouHead.accaCode + '" value="' + list[i].vouHead.fisPerd + '" />' +
								'<a href="javascript:;" class="headInfo pull-left">日期：<span class="vbVouDate">' + list[i].vouHead.vouDate + '</span> 凭证字号：<span class="vbVouNo" data-type="' + list[i].vouHead.vouTypeCode + '">' + page.getVouTypeNameByCode(list[i].vouHead.vouTypeCode) + '-' + list[i].vouHead.vouNo + '</span> 凭证金额：' + page.moneyFormat(list[i].vouHead.amtCr) + ' 附件数：' + page.numFormat(list[i].vouHead.vouCnt) + '张</a>' +
								'</td>');
						}

						//定义凭证头人员节点
						var $headTitlePeople;
						//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
						//凭证头人员数据根据状态显示不同信息，需判断凭证状态！3个展现形式
						if(list[i].vouHead.vouStatus == "O" || list[i].vouHead.vouStatus == "C" || list[i].vouHead.vouStatus == "F") {
							$headTitlePeople = $('<div class="pull-right">制单人：' + ufma.parseNull(list[i].vouHead.inputorName) + '</div>');
						} else if(list[i].vouHead.vouStatus == "A") {
							$headTitlePeople = $('<div class="pull-right">制单人：' + ufma.parseNull(list[i].vouHead.inputorName) + ' 审核人：' + ufma.parseNull(list[i].vouHead.auditorName) + '</div>');
						} else if(list[i].vouHead.vouStatus == "P") {
							$headTitlePeople = $('<div class="pull-right">制单人：' + ufma.parseNull(list[i].vouHead.inputorName) + ' 审核人：' + ufma.parseNull(list[i].vouHead.auditorName) + ' 记账人：' + ufma.parseNull(list[i].vouHead.posterName) + '</div>');
						}
						//判断结束，填入凭证头信息节点
						$headTitle.append($headTitlePeople);
						$headBase.append($headTitle);

						//凭证金额合计操作
						if(list[i].vouHead.amtCr != '') {
							moneySum = moneySum + list[i].vouHead.amtCr;
						}
						if(list[i].vouHead.ysAmtCr != '') {
							moneySumys = moneySumys + list[i].vouHead.ysAmtCr;
						}
						//定义凭证头操作节点
						var $headAct;
						//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
						//凭证头根据状态显示不同按钮，需判断凭证状态！4个展现形式
						switch(list[i].vouHead.vouStatus) {
							case "O":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-audit btn-permission vb-audit-one" data-toggle="tooltip" action= "" title="审核">' +
									'<span class="glyphicon icon-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-cancel btn-permission vb-invalid-one" data-toggle="tooltip" action= "" title="作废">' +
									'<span class="glyphicon icon-to-void"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "A":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-un-audit btn-permission vb-cancelaudit-one" data-toggle="tooltip" action= "" title="销审">' +
									'<span class="glyphicon icon-cancel-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-post btn-permission vb-accounting-one" data-toggle="tooltip" action= "" title="记账">' +
									'<span class="glyphicon icon-account"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "F":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-audit btn-permission vb-audit-one" data-toggle="tooltip" action= "" title="审核">' +
									'<span class="glyphicon icon-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-cancel btn-permission vb-invalid-one" data-toggle="tooltip" action= "" title="作废">' +
									'<span class="glyphicon icon-to-void"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "P":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-turnred btn-permission vb-red-one" data-toggle="tooltip" action= "" title="冲红">' +
									'<span class="glyphicon icon-write-off"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-unaccounting btn-permission vb-unaccounting-one" data-toggle="tooltip" action= "" title="反记账">' +
									'<span class="glyphicon icon-cancel-audit"></span></a>' +
									'</td>');
								break;
							case "C":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-un-cancel btn-permission vb-reduction-one" data-toggle="tooltip" action= "" title="还原">' +
									'<span class="glyphicon icon-recover"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-delete btn-permission vb-delete-one" data-toggle="tooltip" action= "" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							default:
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-print btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
						}
						//判断结束，填入凭证头信息节点
						$headBase.append($headAct);
						//头部tr（凭证头基本节点）填入tbody
						$("#vouBoxTable tbody").append($headBase);

						//循环加入每条凭证的分录
						for(var j = 0; j < list[i].vouDetails.length; j++) {
							//分录基本节点（摘要+科目节点）——科目表未出，先不写，表建好后需写入数据!!！
							var $detailsBase = $('<tr><td class="ellipsis"><span  title="' + ufma.parseNull(list[i].vouDetails[j].descpt) + '">' + ufma.parseNull(list[i].vouDetails[j].descpt) + '</span></td>' +
								'<td class="ellipsis"><span  title="' + ufma.parseNull(list[i].vouDetails[j].accoName) + '">' + ufma.parseNull(list[i].vouDetails[j].accoName) + '</span></td></tr>');
							//定义分录金额节点需判断借贷！
							var $detailsMoney;
							//根据借贷类型创建节点，需判断借贷！
							if(list[i].vouDetails[j].drCr == 1) {
								$detailsMoney = $('<td class="vB-num-style">' + page.moneyFormat(list[i].vouDetails[j].stadAmt) + '</td>' +
									'<td class="vB-num-style"></td>');
							} else if(list[i].vouDetails[j].drCr == -1) {
								$detailsMoney = $('<td class="vB-num-style"></td>' +
									'<td class="vB-num-style">' + page.moneyFormat(list[i].vouDetails[j].stadAmt) + '</td>');
							}
							//借贷节点填入分录基本节点
							$detailsBase.append($detailsMoney);
							//分录tr（分录基本节点）填入tbody
							$("#vouBoxTable tbody").append($detailsBase);
						}

						//加入更多节点并加入tbody
						var $moreTr = $('<tr><td colspan="4" class="vB-more-style">' +
							'<input type="hidden" value="' + list[i].vouHead.vouGuid + '" data-acca="' + list[i].vouHead.accaCode + '" />' +
							'<a class="vb-more" href="javascript:;">更多' +
							'<span class="glyphicon icon-angle-right"> </span></a>' +
							'</td></tr>');
						$("#vouBoxTable tbody").append($moreTr);

					}
					//合计
					if(voutypeacca == 1 && vousinglepz == true) {
						$(".vbDataSum").html("共 <span class='vbPageSum'>" + list.length + "</span> 张凭证  财务会计金额 <span class='vbPageMoney'>" + page.moneyFormat(moneySum) + "</span> 预算会计金额<span class='vbPageMoney'>" + page.moneyFormat(moneySumys) + "  </span>");
					} else {
						$(".vbDataSum").html("共 <span class='vbPageSum'>" + list.length + "</span> 张凭证  金额 <span class='vbPageMoney'>" + page.moneyFormat(moneySum) + "</span>");
					}

					//按钮提示
					$("[data-toggle='tooltip']").tooltip();
					$("#vouBoxTable .vb-invalid-one,#vouBoxTable .vb-delete-one").on("click", function() {
						page._self = $(this);
					});
					$('#vouBoxTable .vb-invalid-one').ufTooltip({
						content: '您确定作废当前凭证吗？',
						onYes: function() {
							page.vbActOne("/gl/vouBox/invalidVous", $(page._self));
						},
						onNo: function() {}
					});
					$('#vouBoxTable .vb-delete-one').ufTooltip({
						content: '您确定删除当前凭证吗？',
						onYes: function() {
							page.vbActOne("/gl/vouBox/deleteVous", $(page._self));
						},
						onNo: function() {}
					});

					//根据凭证，整体上颜色
					$("#vouBox").find("tr.vouHead:odd").each(function() {
						$(this).css({
							"background-color": "#f9f9f9"
						}).nextUntil("tr.vouHead").css({
							"background-color": "#f9f9f9"
						});
					});
					$("#vouBox").find("tr.vouHead:even").each(function() {
						$(this).css({
							"background-color": "#ffffff"
						}).nextUntil("tr.vouHead").css({
							"background-color": "#ffffff"
						});
					});

					//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
					//定义批量操作按钮节点
					var $moreAct = '<label class="mt-checkbox mt-checkbox-outline margin-right-8" style="margin-bottom: 0;">' +
						'<input class="vbTable-toolbar-checkAll" type="checkbox" name="test" value="1"> 全选' +
						'<span></span>' +
						'</label>';
					if(serachData.vouStatus == 'O') {
						//O:未审核凭证
						$moreAct += '<button id="vb-audit-more" type="button" class="btn btn-sm btn-default btn-downto btn-audit btn-permission">审核</button>' +
							'<button id="vb-invalid-more" type="button" class="btn btn-sm btn-default btn-downto btn-cancel btn-permission">作废</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'A') {
						//A:已审核凭证
						$moreAct += '<button id="vb-cancelaudit-more" type="button" class="btn btn-sm btn-default btn-downto btn-un-audit btn-permission">销审</button>' +
							'<button id="vb-accounting-more" type="button" class="btn btn-sm btn-default btn-downto btn-post btn-permission">记账</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'F') {
						//F:已复审凭证
						$moreAct += '<button id="vb-audit-more" type="button" class="btn btn-sm btn-default btn-downto btn-audit btn-permission">审核</button>' +
							'<button id="vb-invalid-more" type="button" class="btn btn-sm btn-default btn-downto btn-cancel btn-permission">作废</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'P') {
						//P:已记账凭证
						$moreAct += '<button id="vb-red-more" type="button" class="btn btn-sm btn-default btn-downto btn-turnred btn-permission" style="display:none;">冲红</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>'+
							'<button id="vb-unaccounting-more" type="button" class="btn btn-sm btn-default btn-downto btn-unaccounting btn-permission">反记账</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else if(serachData.vouStatus == 'C') {
						//C:已作废凭证
						$moreAct += '<button id="vb-reduction-more" type="button" class="btn btn-sm btn-default btn-downto btn-un-cancel btn-permission">还原</button>' +
							'<button id="vb-delete-more" type="button" class="btn btn-sm btn-default btn-downto btn-delete btn-permission">删除</button>' +
							'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					} else {
						//全部
						$moreAct += '<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").append($moreAct);
					}

					//分页部分功能
					//分页  不分页需判断
					if(paging.pageSize != 0) {
						//创建基本分页节点
						var $pageBase = $('<ul id="vbTable-pagination" class="pagination pagination-sm pull-left"></ul>');
						//创建上一页节点  根据当前也判断是否可以点
						var $pagePrev;
						if((paging.currentPage - 1) == 0) {
							$pagePrev = $('<li class="vbPrevPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-left"></span></span></li>');
						} else {
							$pagePrev = $('<li class="vbPrevPage"><a href="javascript:;" aria-label="Previous" data-prevpage=' + (paging.currentPage - 1) + '>' +
								'<span aria-hidden="true" class="glyphicon icon-angle-left"></span>' +
								'</a></li>');
						}
						$pageBase.append($pagePrev);
						//创建页数节点,根据pageSize和凭证数据总数
						//创建页数变量
						var pageAmount = Math.ceil(paging.totalRows / paging.pageSize);
						var $pageItem;
						for(var k = 1; k <= pageAmount; k++) {
							//第一页和最后一页显示
							if(k == 1 || k == pageAmount) {
								//三元运算判断是否当前页
								$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
							} else {
								//判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
								if((pageAmount - 2) <= 3) {
									//三元运算判断是否当前页
									$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
								} else if((pageAmount - 2) > 3) {
									//判断当前页位置
									if(paging.currentPage <= 2) {
										//分页按钮加载2到4之间
										if(k >= 2 && k <= 4) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									} else if(paging.currentPage > 2 && paging.currentPage < (pageAmount - 1)) {
										//分页按钮加载currentPage-1到currentPage+1之间
										if(k >= (paging.currentPage - 1) && k <= (paging.currentPage + 1)) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									} else if(paging.currentPage >= (pageAmount - 1)) {
										//分页按钮加载pageAmount-3到pageAmount-1之间
										if(k >= (pageAmount - 3) && k <= (pageAmount - 1)) {
											//三元运算判断是否当前页
											$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
										}
									}
								}
							}
							$pageBase.append($pageItem);
						}
						//创建下一页节点 根据当前页判断是否可以点
						var $pageNext;
						if((pageAmount - paging.currentPage) == 0) {
							$pageNext = $('<li class="vbNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>');
						} else {
							$pageNext = $('<li class="vbNextPage"><a href="javascript:;" aria-label="Next" data-nextpage=' + (paging.currentPage + 1) + '>' +
								'<span aria-hidden="true" class="glyphicon icon-angle-right"></span>' +
								'</a></li>');
						}
						$pageBase.append($pageNext);
						$("#vouBox .ufma-table-paginate").append($pageBase);
					}

					//创建分页大小基本节点
					var $pageSizeBase = $('<div class="pull-left" style="margin: 0 16px;"></div>');
					var $pageSel = $('<select class="vbPageSize bordered-input"></select>');
					//根据pageSize创建下拉列表
					//分页数组
					var pageArr = [20, 50, 100, 200, 0];
					var $pageOp;
					//定义是否不分页变量
					var isNoPaging;
					for(var n = 0; n < pageArr.length; n++) {
						isNoPaging = (pageArr[n] == 0) ? "不分页" : pageArr[n];
						if(pageArr[n] == paging.pageSize) {
							$pageOp = $('<option value=' + pageArr[n] + ' selected>' + isNoPaging + '</option>');
						} else {
							$pageOp = $('<option value=' + pageArr[n] + '>' + isNoPaging + '</option>');
						}
						$pageSel.append($pageOp);
					}
					$pageSizeBase.append("<span>显示 </span>");
					$pageSizeBase.append($pageSel);
					$pageSizeBase.append("<span> 条</span>");
					$("#vouBox .ufma-table-paginate").prepend($pageSizeBase);

					//创建总数统计节点
					var $vouDataSum = $('<div class="pull-left">共 <span class="vbSum">' + paging.totalRows + '</span> 条</div>');
					$("#vouBox .ufma-table-paginate").prepend($vouDataSum);

					/*if(paging.pageSize!=0){
						//创建到哪页和按钮节点
						var $pageGo = $('<div class="pull-left" style="margin-left: 16px;">到 '
							+'<input type="text" id="vbGoPage" class="bordered-input padding-3" placeholder="1"/>'
							+' 页</div>'
							+'<button id="vb-go-btn" type="button" class="btn btn-sm btn-default btn-downto" style="margin-left: 8px;">确定</button>');
						$("#vouBox .ufma-table-paginate").append($pageGo);
					}*/

					$("#vouBoxTable input#vbCheckAll").prop("checked", false);
					$("#vouBoxTable input#vbCheckAll").prop("disabled", false);
					$("#btn-print-preview").prop("disabled", false);

				} else {

					$("#vouBoxTable input#vbCheckAll").prop("checked", false);
					$("#vbTable-tool-bar input.vbTable-toolbar-checkAll").prop("checked", false);
					$("#vouBoxTable input#vbCheckAll").prop("disabled", true);
					$("#vbTable-tool-bar input.vbTable-toolbar-checkAll").prop("disabled", true);
					var $empty = $('<tr><td class="dataTables_empty" valign="top" colspan="6">' +
						'<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>' +
						'</td></tr>');
					$("#vouBoxTable tbody").append($empty);
					$("#btn-print-preview").prop("disabled", true);
				}

				//权限判断
				ufma.isShow(page.reslist);

				ufma.setPortalHeight();
				//				page.setHeight();	
			},

			//根据单位账套判断是否启用平行记账，不启用时隐藏会计体系
			getIsParallel: function(result) {
				var isParallel = result.data;
				if(isParallel.IS_DOUBLE_VOU == "1" && isParallel.IS_PARALLEL == "1") {
					$(".vbAccaCode").parents(".vou-query-li").show();
				} else if(isParallel.IS_DOUBLE_VOU == "0" && isParallel.IS_PARALLEL == "1") {
					$(".vbAccaCode").parents(".vou-query-li").show();
				} else {
					$(".vbAccaCode").parents(".vou-query-li").hide();
				}
			},

			//$.ajax()，获取数据数据成功，给会计体系按钮属性值
			initAccaVal: function(result) {
				var data = result.data;

				var $allAcca = $('<button class="btn btn-primary" value="">全部</button>');
				$("#vouBox .vbAccaCode").append($allAcca);

				for(var i = 0; i < data.length; i++) {
					var $acca = $('<button class="btn btn-default" value="' + data[i].accaCode + '">' + data[i].accaName + '</button>');
					$("#vouBox .vbAccaCode").append($acca);
				}

				//判断是否平行记账
				ufma.get("/gl/eleCoacc/getIsParallel?agencyCode=" + serachData.agencyCode + "&acctCode=" + serachData.acctCode, "", page.getIsParallel);
			},

			//单行操作（全部）
			vbActOne: function(url, dom) {
				if(styleType == "notMergeView") { //分录模式
					vbGuid = $(dom).parents("tr.vouHead").find("input.vbGuid").val();
					voukind = $(dom).parents("tr.vouHead").find("input.vbGuid").val();
					var vouKind = $(dom).parents("tr.vouHead").find("input.vouKind").val();
					vbGroupId = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-group');
					var errFlag = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-errFlag');
					vbVouNo = $(dom).parents("tr.vouHead").find("span.vbVouNo").text();
					vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-") + 1);
					vbPerd = $(dom).parents("tr.vouHead").find("input.vbPerd").val();
					vbAcca = $(dom).parents("tr.vouHead").find("input.vbPerd").attr('data-acca');
					vbVouTypeCode = $(dom).parents("tr.vouHead").find("span.vbVouNo").attr("data-type");
					vbVouStatus = $(dom).parents("tr.vouHead").find("input.vbPerd").attr('data-status');
				} else if(styleType == "mergeView") { //单据模式
					console.log($(dom).closest('tr').find("a.viewData").attr('data-vouGuid'));
					vbGuid = $(dom).closest('tr').find("a.viewData").attr('data-vouGuid');
					var vouKind = $(dom).closest('tr').find("a.viewData").attr('data-vouKind');
					var errFlag = $(dom).closest('tr').find("a.viewData").attr('data-errFlag');
					vbGroupId = $(dom).closest('tr').find("a.viewData").attr('data-vouGroupId');
					vbVouNo = $(dom).closest('tr').find("a.viewData").val();
					vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-") + 1);
					vbPerd = $(dom).closest('tr').find("a.viewData").attr('data-fisPerd');
					vbAcca = $(dom).closest('tr').find("a.viewData").attr('data-acca');
					vbVouTypeCode = $(dom).closest('tr').find("a.viewData").attr("data-vouTypeCode");
					vbVouStatus = $(dom).closest('tr').find("a.viewData").attr('data-vouStatus');
				}
				//获得该点击的凭证的vouGuid

				//				vbSData = $('#vbStartVouDate').val();
				//				vbEData = $('#vbEndVouDate').val();
				vbObj = [{
					vouGuid: vbGuid,
					vouKind: vouKind,
					vouGroupId: vbGroupId,
					setYear: serachData.setYear,
					agencyCode: serachData.agencyCode,
					acctCode: serachData.acctCode,
					vouNo: vbVouNo,
					errFlag: errFlag,
					vouTypeCode: vbVouTypeCode,
					vouStatus: vbVouStatus,
					accaCode: vbAcca,
					fisPerd: vbPerd,
					startDate: serachData.startVouDate,
					endtDate: serachData.endVouDate
				}];
				var vbCallback = function(result) {
					//page.searchData();
					ufma.showTip(result.msg, "", result.flag);
					//判断是否不分页
					if($(".ufma-table-paginate").find(".vbPageSize").val() == 0) {
						//不分页
						page.searchData();
					} else {
						//分页
						$(dom).parents("tr.vouHead").remove();
						$(dom).parents("tr.vouHead").nextUntil("tr.vouHead").remove();
						if($(".ufma-table-paginate").find(".vbPageSize").length != 0) {
							var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1) == 0) ? 1 : ($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1);
							serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length == 0) ? cPage : $(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
							serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						}
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
					}
				};
				ufma.post(url, vbObj, vbCallback);
				$("#vbCheckAll").prop("checked", false);
			},

			//单行操作（备选）
			vbActionOne: function(url, dom) {
				//获得该点击的凭证的vouGuid
				vbGuid = $(dom).parents("tr.vouHead").find("input.vbGuid").val();
				var vouKind = $(dom).parents("tr.vouHead").find("input.vouKind").val();
				var errFlag = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-errFlag');
				vbGroupId = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-group');
				vbVouNo = $(dom).parents("tr.vouHead").find("span.vbVouNo").text();
				vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-") + 1);
				vbPerd = $(dom).parents("tr.vouHead").find("input.vbPerd").val();
				vbAcca = $(dom).parents("tr.vouHead").find("input.vbPerd").attr('data-acca');
				//				vbSData = $('#vbStartVouDate').val();
				//				vbEData = $('#vbEndVouDate').val();
				vbObj = [{
					vouGuid: vbGuid,
					vouKind: vouKind,
					vouGroupId: vbGroupId,
					setYear: serachData.setYear,
					agencyCode: serachData.agencyCode,
					acctCode: serachData.acctCode,
					vouNo: vbVouNo,
					errFlag: errFlag,
					accaCode: vbAcca,
					fisPerd: vbPerd,
					startDate: serachData.startVouDate,
					endtDate: serachData.endVouDate
				}];
				var vbCallback = function(result) {
					//page.searchData();
					ufma.showTip(result.msg, "", result.flag);
					//判断是否不分页
					if($(".ufma-table-paginate").find(".vbPageSize").val() == 0) {
						//不分页
						page.searchData();
					} else {
						//分页
						$(dom).parents("tr.vouHead").remove();
						$(dom).parents("tr.vouHead").nextUntil("tr.vouHead").remove();
						if($(".ufma-table-paginate").find(".vbPageSize").length != 0) {
							var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1) == 0) ? 1 : ($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1);
							serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length == 0) ? cPage : $(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
							serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						}
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
					}
				};
				ufma.post(url, vbObj, vbCallback);
				$("#vbCheckAll").prop("checked", false);
			},

			//批量操作（全部）
			vbActMore: function(url) {
				var vbObjArr = [];
				if($("#vouBoxTable").find(".vouHead.selected").length != 0) {
					$("#vouBoxTable").find(".vouHead.selected").each(function() {
						if(styleType == "notMergeView") { //分录模式
							vbGuid = $(this).find("input.vbGuid").val();
							var vouKind = $(this).find("input.vouKind").val();
							var errFlag = $(this).parents("tr.vouHead").find("input.vbGuid").attr('data-errFlag');
							vbGroupId = $(this).find("input.vbGuid").attr('data-group');
							vbVouNo = $(this).find("span.vbVouNo").text();
							vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-") + 1);
							vbPerd = $(this).find("input.vbPerd").val();
							vbAcca = $(this).find("input.vbPerd").attr('data-acca');
							vbVouTypeCode = $(this).find("span.vbVouNo").attr("data-type");
							vbVouStatus = $(this).find("input.vbPerd").attr('data-status');
						} else if(styleType == "mergeView") { //单据模式
							console.log($(this).find("a.viewData").attr('data-vouGuid'));
							vbGuid = $(this).find("a.viewData").attr('data-vouGuid');
							var vouKind = $(this).find("a.viewData").attr('data-vouKind');
							var errFlag = $(this).find("a.viewData").attr('data-errFlag');
							vbGroupId = $(this).find("a.viewData").attr('data-vouGroupId');
							vbVouNo = $(this).find("a.viewData").val();
							vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-") + 1);
							vbPerd = $(this).find("a.viewData").attr('data-fisPerd');
							vbAcca = $(this).find("a.viewData").attr('data-acca');
							vbVouTypeCode = $(this).find("a.viewData").attr("data-vouTypeCode");
							vbVouStatus = $(this).find("a.viewData").attr('data-vouStatus');
						}

						//						vbSData = $('#vbStartVouDate').val();
						//						vbEData = $('#vbEndVouDate').val();
						vbObj = {
							vouGuid: vbGuid,
							vouKind: vouKind,
							vouGroupId: vbGroupId,
							errFlag: errFlag,
							setYear: serachData.setYear,
							agencyCode: serachData.agencyCode,
							acctCode: serachData.acctCode,
							vouNo: vbVouNo,
							vouTypeCode: vbVouTypeCode,
							vouStatus: vbVouStatus,
							accaCode: vbAcca,
							fisPerd: vbPerd,
							startDate: serachData.startVouDate,
							endtDate: serachData.endVouDate
						};
						vbObjArr.push(vbObj);
					});
					var vbCallback = function(result) {
						//page.searchData();
						/*                        if(result.data=='1'){
						                            ufma.showTip(result.msg,"",'success');
						                        }else if(result.data=='2'){
						                            ufma.showTip(result.msg,"",'error');
						                        }else{
						                        	ufma.showTip(result.msg,"",'success');						
						                        }*/
						if(result.flag == 'success') {
							ufma.showTip(result.msg, "", 'success');
						} else {
							ufma.showTip(result.msg, "", 'error');
						}
						//判断是否不分页
						if($(".ufma-table-paginate").find(".vbPageSize").val() == 0) {
							//不分页
							page.searchData();
						} else {
							//分页
							$("#vouBoxTable tbody").find(".vouHead.selected").remove();
							if($(".ufma-table-paginate").find(".vbPageSize").length != 0) {
								var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1) == 0) ? 1 : ($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1);
								serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length == 0) ? cPage : $(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
								serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
							}
							$(".vbDataSum").html("");
							$("#vouBoxTable tbody").html('');
							$(".ufma-tool-btns").html('');
							$(".ufma-table-paginate").html("");
							ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
						}
					}
					ufma.post(url, vbObjArr, vbCallback);
					$("#vbCheckAll").prop("checked", false);
				} else {
					ufma.showTip("请勾选您要操作的凭证，谢谢！");
				}
			},

			//批量操作（备选）
			vbActionMore: function(url) {
				var vbObjArr = [];
				if($("#vouBoxTable").find(".vouHead.selected").length != 0) {
					$("#vouBoxTable").find(".vouHead.selected").each(function() {
						vbGuid = $(this).find("input.vbGuid").val();
						vbGroupId = $(this).find("input.vbGuid").attr('data-group');
						vbVouNo = $(this).find("span.vbVouNo").text();
						vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-") + 1);
						vbPerd = $(this).find("input.vbPerd").val();
						vbAcca = $(this).find("input.vbPerd").attr('data-acca');
						//						vbSData = $('#vbStartVouDate').val();
						//						vbEData = $('#vbEndVouDate').val();
						vbObj = {
							vouGuid: vbGuid,
							vouGroupId: vbGroupId,
							setYear: serachData.setYear,
							agencyCode: serachData.agencyCode,
							acctCode: serachData.acctCode,
							vouNo: vbVouNo,
							accaCode: vbAcca,
							fisPerd: vbPerd,
							startDate: serachData.startVouDate,
							endtDate: serachData.endVouDate
						};
						vbObjArr.push(vbObj);
					});
					var vbCallback = function(result) {
						//page.searchData();
						if(result.data == '1') {
							ufma.showTip(result.msg, "", 'success');
						} else if(result.data == '2') {
							ufma.showTip(result.msg, "", 'warnning');
						}

						//判断是否不分页
						if($(".ufma-table-paginate").find(".vbPageSize").val() == 0) {
							//不分页
							page.searchData();
						} else {
							//分页
							$("#vouBoxTable tbody").find(".vouHead.selected").remove();
							if($(".ufma-table-paginate").find(".vbPageSize").length != 0) {
								var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1) == 0) ? 1 : ($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage") - 1);
								serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length == 0) ? cPage : $(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
								serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
							}
							$(".vbDataSum").html("");
							$("#vouBoxTable tbody").html('');
							$(".ufma-tool-btns").html('');
							$(".ufma-table-paginate").html("");
							ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
						}
					}
					ufma.post(url, vbObjArr, vbCallback);
					$("#vbCheckAll").prop("checked", false);
				} else {
					ufma.showTip("请勾选您要操作的凭证，谢谢！");
				}
			},

			getLastDay: function(year, month) {
				var new_year = year; //取当前的年份          
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）          
				if(month > 12) {
					new_month -= 12; //月份减          
					new_year++; //年份增          
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
				return(new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期 
			},
			setDayInYear: function() {
				var mydate = new Date(svData.svTransDate);
				Year = mydate.getFullYear();
				$('#vbStartVouDate').getObj().setValue(Year + '-01-01');
				$('#vbEndVouDate').getObj().setValue(Year + '-12-31');
				serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
				serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();
			},
			setDayInMonth: function() {
				var mydate = new Date(svData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');

				$('#vbEndVouDate').getObj().setValue(Year + '-' + Month + '-' + this.getLastDay(Year, Month));
				serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
				serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();
			},
			setDayInDay: function() {
				var mydate = new Date(svData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				Day = Day < 10 ? ('0' + Day) : Day;
				$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#vbEndVouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
				serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();
			},
			//获取凭证来源
			getVouResource: function() {
				ufma.ajaxDef('/gl/enumerate/VOU_SOURCE', "get", "", function(result) {
					var obj = {
						ENU_CODE: "*",
						ENU_NAME: "全部",
						codeName: "* 全部"
					};
					result.data.unshift(obj);
					//凭证来源
					$("#vouSource").ufCombox({
						idField: 'ENU_CODE',
						textField: 'ENU_NAME',
						placeholder: '请选择凭证来源',
						onChange: function(data) {

						},
						onComplete: function(sender) {
							$(".uf-combox-input").attr("autocomplete", "off");
						}
					});
					$("#vouSource").getObj().load(result.data);
					if($.isNull($("#vouSource").getObj().getValue())) {
						$("#vouSource").getObj().val("*");
					}
				})
			},
			setTableHeight: function() {
				setTimeout(function() {
					var winHei = $(".container-fluid").height(); //窗口高度
					var toolbar = $(".ufma-tool-bar").height(); //工具条高度
					var agency = $(".vou-selete-box").height(); //单位账套高度
					var tableSub = $(".table-sub").height();
					var query = $(".vou-query-box").height();
					var height = winHei - toolbar - agency - tableSub - query - 18 - 46 - 15;
					$(".table-tab").css("height", height);
				}, 300)

			},
			//初始化页面
			initPage: function() {
				var Year, Month, Day;
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				svData = ufma.getCommonData();
				this.setDayInMonth();
				this.setDayInMonth();
				user = svData.svUserName;
				serachData.setYear = svData.svSetYear;
				serachData.rgCode = svData.svRgCode;
				//表格功能条住底
				//				ufma.parseScroll();

				//page.setTableHeight();
				//加载枚举表打印状态
				ufma.get("/gl/enumerate/PRINT_STATUS", "", this.initPrintStatus);
				//账套选择
				page.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'CHR_CODE',
					textField: 'CODE_NAME',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function(data) {
						serachData.acctCode = data.CHR_CODE;
						if(data.IS_PARALLEL == 1) {
							vouisParallel = true
						} else {
							vouisParallel = false
						}
						if(data.IS_PARALLEL == '1' && data.IS_DOUBLE_VOU == '1') {
							voutypeacca = 1
							vousinglepz = false
						} else if(data.IS_PARALLEL == '1' && data.IS_DOUBLE_VOU == '0') {
							voutypeacca = 1
							vousinglepz = true
						} else if(data.IS_PARALLEL == '0') {
							voutypeacca = 0
							vousinglepz = false
						}
						if(voutypeacca == 1 && vousinglepz == false) {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '*', "get", "", page.initVouType);
						}
						//审核标签默认到未审核
						$("#vouBox .nav-tabs li").removeClass("active");
						$("#vouBox .nav-tabs li").find("[data-status='O']").parents("li").addClass("active");
						serachData.vouStatus = $("#vouBox .nav-tabs li.active").find("a").attr("data-status");

						//加载会计体系按钮
						$("#vouBox .vbAccaCode").html("");
						ufma.get("/gl/eleAcca/getRptAccas?agencyCode=" + serachData.agencyCode + "&acctCode=" + serachData.acctCode + "&rgCode=" + serachData.rgCode + "&setYear=" + serachData.setYear, "", page.initAccaVal);

						//根据单位账套重新加载会计科目
						var url = '/gl/sys/coaAcc/getAccoTree/' + serachData.setYear + '?agencyCode=' + serachData.agencyCode + '&acctCode=' + serachData.acctCode;
						var accaCode = $(".vbAccaCode[class='btn btn-primary']").val();
						if(accaCode != undefined && accaCode != "") {
							url += "&accaCode=" + accaCode;
						}

						callback = function(result) {
							page.acco = $("#vbAcco").ufmaTreecombox({
								valueField: 'id',
								textField: 'codeName',
								readOnly: false,
								leafRequire: true,
								popupWidth: 1.5,
								data: result.data,
								onchange: function(data) {}
							});
						}
						ufma.get(url, {}, callback);

						//获取凭证来源  add by  guohx
						page.getVouResource();

						//清空其它搜索项
						$('#vouSource').val('');
						$('#vbStartVouNo').val('');
						$('#vbEndVouNo').val('');
						$('#vbStartStadAmt').val('');
						$('#vbEndStadAmt').val('');
						$('#vbInputor').val('');
						$('#vbRemark').val('');

						page.searchData();
					}
				});

				//单位选择
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: "id",
					textField: "codeName",
					readonly: false,
					placeholder: "请选择单位",
					icon: "icon-unit",
					onchange: function(data) {
						serachData.agencyCode = data.id;
						ufma.ajaxDef('/gl/sys/busRule/' + serachData.agencyCode + '/GL026','get', "", function(result) { //判断是否显示按钮
							if(result.data == true) {
								//显示挂接按钮
								$('.istreasuryHook').show()
							} else if(result.data == false){
								$('.istreasuryHook').hide()
								$('#vbtreasuryHook').find('button').eq(0).trigger('click')
							}
						})
						//改变单位,账套选择内容改变
						var url = '/gl/eleCoacc/getCoCoaccs/' + serachData.agencyCode;
						var callback = function(result) {
							vbacctData = result.data
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});
							var svFlag = $.inArrayJson(result.data, "CHR_CODE", svData.svAcctCode);
							if(svFlag != undefined) {
								page.cbAcct.val(svData.svAcctCode);
							} else {
								if(result.data.length > 0) {
									page.cbAcct.val(result.data[0].CHR_CODE);
								} else {
									page.cbAcct.val('');
								}
							}
						}
						ufma.ajaxDef(url, 'get', {}, callback);

						$("#vbVouTypeCode").html("");
						$("#vouBox .vbStatus").html("");
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");

						//加载凭证类型
						if(voutypeacca == 1 && vousinglepz == false) {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '*', "get", "", page.initVouType);
						}
						//加载凭证状态选项卡
						ufma.ajaxDef("/gl/vouBox/vouStatus?agencyCode=" + serachData.agencyCode, "get", "", page.initVouStatus);
					}
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", "", function(result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", svData.svAgencyCode);
					if(agyCode != undefined) {
						page.cbAgency.val(svData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});

			},

			searchData: function() {
				if($(".searchVou").length > 0) {
					if($("#vouBox .vbStatus li").length == 0) {
						serachData.vouStatus = "O";
					}

					//第一行
					if($("#vouBox .vbAccaCode:hidden").get(0)) {
						serachData.accaCode = "";
					} else {
						serachData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					}
					serachData.startVouDate = $('#vbStartVouDate').getObj().getValue();
					serachData.endVouDate = $('#vbEndVouDate').getObj().getValue();

					//第二行
					if($('#vbVouTypeCode option').length == 0) {
						serachData.vouTypeCode = "";
					} else {
						serachData.vouTypeCode = $('#vbVouTypeCode option:selected').val();
					}
					serachData.startVouNo = $('#vbStartVouNo').val();
					serachData.endVouNo = $('#vbEndVouNo').val();
					if($('#vbStartStadAmt').val() == "") {
						serachData.startStadAmt = 0;
					} else {
						serachData.startStadAmt = Number($('#vbStartStadAmt').val());
					}
					if($('#vbEndStadAmt').val() == "") {
						serachData.endStadAmt = 0;
					} else {
						serachData.endStadAmt = Number($('#vbEndStadAmt').val());
					}

					//会计科目
					if($('#vbAcco_input').val() == "" || page.acco == undefined) {
						serachData.accoCode = "";
					} else {
						serachData.accoCode = page.acco.getValue();
					}

					//第三行
					serachData.inputorName = $('#vbInputor').val();
					serachData.remark = $('#vbRemark').val();
					serachData.printCount = $('#vouBox #vbPrintStatus button.btn-primary').val();
					serachData.errFlag = $('#vouBox #vbErrFlag button.btn-primary').val();
					serachData.treasuryHook = $('#vouBox #vbtreasuryHook button.btn-primary').val();
					serachData.vouSource = $('#vouSource').getObj().getValue();

					//执行此方法时，如果为不分页赋值0；如果分页，当前页默认第1页
					//分页判断分页大小元素存在时，重新赋值(数据未加载的时候分页大小元素不存在，避免因此自动变成不分页)
					if($(".ufma-table-paginate").find(".vbPageSize").length != 0) {
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						if($(".ufma-table-paginate").find(".vbPageSize").val() == 0) {
							serachData.currentPage = 0;
						} else {
							serachData.currentPage = 1;
						}
					}
					serachData.styleType = styleType;
					$(".vbDataSum").html("");
					$("#vouBoxTable tbody").html('');
					$(".ufma-tool-btns").html('');
					$(".ufma-table-paginate").html("");
					// if (styleType == 'mergeView') {
					// 	page.setTableHeight();
					// }
					ufma.post("/gl/vouBox/searchVous", serachData, this.initVouBoxTable);
				}
			},
			initVouTypeRed: function() {
				//var data = result.data;
				//循环把option填入select
				$('#vbrvVouType').html('');
				$('#vbrvVouTypecw').html('');
				$('#vbrvVouTypeys').html('');
				ufma.get("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '*', "", function(data) {
					var $vouTypeOp = '';
					for(var i = 0; i < data.data.length; i++) {
						//创建凭证类型option节点
						$vouTypeOp += '<option value="' + data.data[i].CHR_CODE + '">' + data.data[i].CHR_NAME + '</option>';
					}
					$('#vbrvVouType').append($vouTypeOp);
				})
				ufma.get("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '1', "", function(data) {
					var $vouTypeOp = '';
					for(var i = 0; i < data.data.length; i++) {
						//创建凭证类型option节点
						$vouTypeOp += '<option value="' + data.data[i].CHR_CODE + '">' + data.data[i].CHR_NAME + '</option>';
					}
					$('#vbrvVouTypecw').append($vouTypeOp);
				})
				ufma.get("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '2', "", function(data) {
					var $vouTypeOp = '';
					for(var i = 0; i < data.data.length; i++) {
						//创建凭证类型option节点
						$vouTypeOp += '<option value="' + data.data[i].CHR_CODE + '">' + data.data[i].CHR_NAME + '</option>';
					}
					$('#vbrvVouTypeys').append($vouTypeOp);
				})
				if(voutypeacca == 1 && vousinglepz == false) {
					$('.setVouType').addClass('hide');
					$('.setVouTypecy').removeClass('hide');
				} else {
					$('.setVouTypecy').addClass('hide');
					$('.setVouType').removeClass('hide');
				}
				page.editor = ufma.showModal('vouBoxRedVoucher', 450, 350);
				page.setDayInDay2();
			},
			setDayInDay2: function() {
				//              var mydate = new Date();
				//              Year=mydate.getFullYear();
				//              Month=(mydate.getMonth()+1);
				//              Month = Month<10?('0'+Month):Month;
				//              Day=mydate.getDate();
				//              Day = Day<10?('0'+Day):Day;
				//              $('#vbrvVouDate').val(Year+'-'+Month+'-'+Day);
				$('#vbrvVouDate').val(page.svTransDate);
			},
			onEventListener: function() {
				//点击表格行内的打印按钮
// 					$("#vouBoxTable").on("click", ".vb-print-one", function () {
// 					//清除缓存
// 					ufma.removeCache("iWantToPrint");
// 
// 					//凭证箱打印缓存数据
// 					var printCache = {};
// 					printCache.base = {
// 						agencyCode: serachData.agencyCode,
// 						acctCode: serachData.acctCode,
// 						componentId: "GL_VOU"
// 					}
// 
// 					printCache.vouGuids = [];
// 					var vouGuid = $(this).parents("tr.vouHead").find(".vbGuid").val();
// 					printCache.vouGuids.push(vouGuid);
// 
// 					//打印判断缓存
// 					var judgeCache = {};
// 					judgeCache.dataFrom = "vouBox";
// 					judgeCache.direct = "0";
// 
// 					var cacheData = {
// 						print: printCache,
// 						judge: judgeCache
// 					};
// 					ufma.setObjectCache("iWantToPrint", cacheData);
// 					window.open('../../pub/printpreview/printPreview.html');
// 					// window.open('/pqr/pages/query/query.html?sys=666&code=8008001001&button&param&show&param=' + printCache.vouGuids.join(','));
// 				});
// 
// 				//点击打印凭证&表格内打印按钮
// 				$("#vouBox").on("click", "#vb-print-more,#btn-print-preview,.table-sub-action .btn-print", function () {
// 					//清除缓存
// 					ufma.removeCache("iWantToPrint");
// 
// 					//凭证箱打印缓存数据
// 					var printCache = {};
// 					printCache.base = {
// 						agencyCode: serachData.agencyCode,
// 						acctCode: serachData.acctCode,
// 						componentId: "GL_VOU"
// 					}
// 
// 					//判断是否勾选
// 					if ($("#vouBoxTable tbody .vouHead.selected").get(0)) {
// 						//有勾选
// 						printCache.vouGuids = [];
// 						//遍历表格内勾选的行
// 						$("#vouBoxTable tbody .vouHead.selected").each(function () {
// 							var vouGuid = $(this).find(".vbGuid").val();
// 							printCache.vouGuids.push(vouGuid);
// 						});
// 					} else {
// 						//没勾选
// 						printCache.vouGuids = [];
// 
// 						var condition = {};
// 
// 						condition.vouStatus = serachData.vouStatus;
// 
// 						condition.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
// 						condition.startVouDate = $('#vbStartVouDate').getObj().getValue();
// 						condition.endVouDate = $('#vbEndVouDate').getObj().getValue();
// 
// 						condition.vouTypeCode = $('#vbVouTypeCode option:selected').val();
// 						if ($('#vbStartStadAmt').val() == "") {
// 							condition.startStadAmt = 0;
// 						} else {
// 							condition.startStadAmt = $('#vbStartStadAmt').val();
// 						}
// 						if ($('#vbEndStadAmt').val() == "") {
// 							condition.endStadAmt = 0;
// 						} else {
// 							condition.endStadAmt = $('#vbEndStadAmt').val();
// 						}
// 						if ($('#vbAcco_input').val() == "" || page.acco == undefined) {
// 							condition.accoCode = "";
// 						} else {
// 							condition.accoCode = page.acco.getValue();
// 						}
// 
// 						condition.inputorName = $('#vbInputor').val();
// 						condition.remark = $('#vbRemark').val();
// 						condition.printCount = $('#vouBox #vbPrintStatus button.btn-primary').val();
// 						condition.errFlag = $('#vouBox #vbErrFlag button.btn-primary').val();
// 
// 						condition.setYear = serachData.setYear;
// 						condition.rgCode = serachData.rgCode;
// 
// 						printCache.condition = condition;
// 					}
// 
// 					//打印判断缓存
// 					var judgeCache = {};
// 					judgeCache.dataFrom = "vouBox";
// 					judgeCache.direct = "0";
// 
// 					var cacheData = {
// 						print: printCache,
// 						judge: judgeCache
// 					};
// 					ufma.setObjectCache("iWantToPrint", cacheData);
// 					window.open('../../pub/printpreview/printPreview.html');
// //					window.open('/pqr/pages/query/query.html?sys=666&code=8008001001&button&param&show&param=' + printCache.vouGuids.join(','));
// 				});
				$("#vouBoxTable").on("click", ".vb-print-one", function() {
					//清除缓存
					ufma.removeCache("iWantToPrint");
					//凭证箱打印缓存数据
					var printCache = {};
					printCache.base = {
						agencyCode: serachData.agencyCode,
						acctCode: serachData.acctCode,
						componentId: "GL_VOU"
					}
					var printCache = {};
					printCache.agencyCode = serachData.agencyCode;
					printCache.acctCode = serachData.acctCode;
					printCache.componentId = "GL_VOU";
					var ajaxdata = {
						agencyCode:serachData.agencyCode,
						acctCode:serachData.acctCode,
						componentId:'GL_VOU'
					}
					var TMPL_CODEs=''
					ufma.ajaxDef('/gl/vouPrint/getUsedPrtList','post',ajaxdata,function(result){
						if(result.data.length==0){
							ufma.showTip('未设置默认打印模板，请在打印设置中设置默认打印模板后执行打印',function(){},'warning')
							return false;
						}else{
							TMPL_CODEs=result.data[0].printTmpl.TMPL_CODE
							printCache.tmplCode=TMPL_CODEs
						}
					})
//					printCache.formatTmplCode = "3001";
//					printCache.tmplCode = "3001";
					printCache.vouGuids = [];
					var vouGuid = $(this).parents("tr.vouHead").find(".vbGuid").val();
					printCache.vouGuids.push(vouGuid);
					var callback = function(result) {
						var pData = result.data;
						var domain = printServiceUrl + '/pqr/pages/query/query.html';
						var uniqueInfo = new Date().getTime().toString()
						var url = domain +
							'?sys=666&code='+TMPL_CODEs+'&print&' +
							'uniqueInfo=' + uniqueInfo
						var myPopup = window.open(url, uniqueInfo);
						var dataCnt = 0;
						var connected = false;
						var index = setInterval(function() {
							if(connected) {
								clearInterval(index)
							} else {
								var message = {
									uniqueInfo: uniqueInfo,
									type: 0
								}
								console.log(message)
								//send the message and target URI
								myPopup.postMessage(message, domain)
							}
						}, 2000)
						window.addEventListener('message', function(event) {
							//连接通信
							if(event.data.hasOwnProperty('uniqueInfo')) {
								if(event.data.uniqueInfo === uniqueInfo) {
									if(event.data.result === 0) {
										connected = true;
										//如果发送测试数据未关闭，先关闭发送测试数据index
										console.log(event.data.uniqueInfo)
										//第一遍发送数据
										var message;
										var dType = 1;
										if(1 == pData.data.length) {
											dType = 2;
										}
										message = {
											uniqueInfo: uniqueInfo,
											type: dType,
											dataType: 1,
											data: {
												'gl_voucher_ds1': pData.data[0]
											}
										}
										console.log(JSON.stringify(message))
										myPopup.postMessage(message, domain)
									} else if(event.data.result === 1) {
										if(connected) {
											dataCnt++;
											var message;
											var dType = 1;
											if(dataCnt == (pData.data.length - 1)) {
												dType = 2;
											}
											message = {
												uniqueInfo: uniqueInfo,
												type: dType,
												dataType: 1,
												data: {
													'gl_voucher_ds1': pData.data[dataCnt]
												}
											}
											myPopup.postMessage(message, domain)
										}
									} else {
										console.log(event.data.reason)
									}
								}
							}
						}, false);
					}
					ufma.post("/gl/vouPrint/getPrtData", printCache, callback);
				});

				//点击打印凭证&表格内打印按钮
				$("#vouBox").on("click", "#vb-print-more,#btn-print-preview,.table-sub-action .btn-print", function() {
					//清除缓存
					ufma.removeCache("iWantToPrint");
					//凭证箱打印缓存数据
					var printCache = {};
					printCache.base = {
						agencyCode: serachData.agencyCode,
						acctCode: serachData.acctCode,
						componentId: "GL_VOU"
					}
					//判断是否勾选
					if($("#vouBoxTable tbody .vouHead.selected").get(0)) {
						//有勾选
						printCache.vouGuids = [];
						//遍历表格内勾选的行
						$("#vouBoxTable tbody .vouHead.selected").each(function() {
							var vouGuid = $(this).find(".vbGuid").val();
							printCache.vouGuids.push(vouGuid);
						});
					} else {
						//没勾选
						printCache.vouGuids = [];
						var condition = {};
						condition.vouStatus = serachData.vouStatus;
						condition.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
						condition.startVouDate = $('#vbStartVouDate').getObj().getValue();
						condition.endVouDate = $('#vbEndVouDate').getObj().getValue();
						condition.vouTypeCode = $('#vbVouTypeCode option:selected').val();
						if($('#vbStartStadAmt').val() == "") {
							condition.startStadAmt = 0;
						} else {
							condition.startStadAmt = $('#vbStartStadAmt').val();
						}
						if($('#vbEndStadAmt').val() == "") {
							condition.endStadAmt = 0;
						} else {
							condition.endStadAmt = $('#vbEndStadAmt').val();
						}
						if($('#vbAcco_input').val() == "" || page.acco == undefined) {
							condition.accoCode = "";
						} else {
							condition.accoCode = page.acco.getValue();
						}
						condition.inputorName = $('#vbInputor').val();
						condition.remark = $('#vbRemark').val();
						condition.printCount = $('#vouBox #vbPrintStatus button.btn-primary').val();
						condition.errFlag = $('#vouBox #vbErrFlag button.btn-primary').val();
						condition.treasuryHook = $('#vouBox #vbtreasuryHook button.btn-primary').val();
						condition.setYear = serachData.setYear;
						condition.rgCode = serachData.rgCode;
						printCache.condition = condition;
					}
					var printCache = {};
					printCache.agencyCode = serachData.agencyCode;
					printCache.acctCode = serachData.acctCode;
					printCache.componentId = "GL_VOU";
					var ajaxdata = {
						agencyCode:serachData.agencyCode,
						acctCode:serachData.acctCode,
						componentId:'GL_VOU'
					}
					var TMPL_CODEs=''
					ufma.ajaxDef('/gl/vouPrint/getUsedPrtList','post',ajaxdata,function(result){
						if(result.data.length==0){
							ufma.showTip('未设置默认打印模板，请在打印设置中设置默认打印模板后执行打印',function(){},'warning')
							return false;
						}else{
							TMPL_CODEs=result.data[0].printTmpl.TMPL_CODE
							printCache.tmplCode=TMPL_CODEs
						}
					})
					if($("#vouBoxTable tbody .vouHead.selected").get(0)) {
						//有勾选
						printCache.vouGuids = [];
						//遍历表格内勾选的行
						$("#vouBoxTable tbody .vouHead.selected").each(function() {
							var vouGuid = $(this).find(".vbGuid").val();
							printCache.vouGuids.push(vouGuid);
						});
					} else {
						//没勾选
						printCache.vouGuids = [];
					}
					var callback = function(result) {
						var pData = result.data;
						var domain = printServiceUrl + '/pqr/pages/query/query.html';
						var uniqueInfo = new Date().getTime().toString()
						var url = domain +
							'?sys=666&code='+TMPL_CODEs+'&print&' +
							'uniqueInfo=' + uniqueInfo
						var myPopup = window.open(url, uniqueInfo);
						var dataCnt = 0;
						var connected = false;
						var index = setInterval(function() {
							if(connected) {
								clearInterval(index)
							} else {
								var message = {
									uniqueInfo: uniqueInfo,
									type: 0
								}
								console.log(message)
								//send the message and target URI
								myPopup.postMessage(message, domain)
							}
						}, 2000)
						window.addEventListener('message', function(event) {
							//连接通信
							if(event.data.hasOwnProperty('uniqueInfo')) {
								if(event.data.uniqueInfo === uniqueInfo) {
									if(event.data.result === 0) {
										connected = true;
										//如果发送测试数据未关闭，先关闭发送测试数据index
										console.log(event.data.uniqueInfo)
										//第一遍发送数据
										var message;
										var dType = 1;
										if(1 == pData.data.length) {
											dType = 2;
										}
										message = {
											uniqueInfo: uniqueInfo,
											type: dType,
											dataType: 1,
											data: {
												'gl_voucher_ds1': pData.data[0]
											}
										}
										console.log(JSON.stringify(message))
										myPopup.postMessage(message, domain)
									} else if(event.data.result === 1) {
										if(connected) {
											dataCnt++;
											var message;
											var dType = 1;
											if(dataCnt == (pData.data.length - 1)) {
												dType = 2;
											}
											message = {
												uniqueInfo: uniqueInfo,
												type: dType,
												dataType: 1,
												data: {
													'gl_voucher_ds1': pData.data[dataCnt]
												}
											}
											myPopup.postMessage(message, domain)
										}
									} else {
									}
								}
							}
						}, false);
					}
					ufma.post("/gl/vouPrint/getPrtData", printCache, callback);
				});

				//点击新增跳转凭证录入页面
				$("#vouBox").on("click", "#btn-add", function() {
					ufma.removeCache("cacheData");
					//缓存数据
					var cacheData = {};
					cacheData.agencyCode = serachData.agencyCode;
					cacheData.acctCode = serachData.acctCode;
					cacheData.vouStatus = serachData.vouStatus;

					cacheData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					cacheData.startVouDate = $('#vbStartVouDate').getObj().getValue();
					cacheData.endVouDate = $('#vbEndVouDate').getObj().getValue();

					cacheData.vouTypeCode = $('#vbVouTypeCode option:selected').val();
					if($('#vbStartStadAmt').val() == "") {
						cacheData.startStadAmt = 0;
					} else {
						cacheData.startStadAmt = $('#vbStartStadAmt').val();
					}
					if($('#vbEndStadAmt').val() == "") {
						cacheData.endStadAmt = 0;
					} else {
						cacheData.endStadAmt = $('#vbEndStadAmt').val();
					}
					if($('#vbAcco_input').val() == "" || page.acco == undefined) {
						cacheData.accoCode = "";
					} else {
						cacheData.accoCode = page.acco.getValue();
					}

					cacheData.inputorName = $('#vbInputor').val();
					cacheData.remark = $('#vbRemark').val();
					cacheData.printCount = $('#vouBox #vbPrintStatus button.btn-primary').val();
					cacheData.errFlag = $('#vouBox #vbErrFlag button.btn-primary').val();
					cacheData.treasuryHook = $('#vouBox #vbtreasuryHook button.btn-primary').val();

					cacheData.setYear = serachData.setYear;
					cacheData.rgCode = serachData.rgCode;

					ufma.setObjectCache("cacheData", cacheData);
					//					window.location.href = '../vou/index.html?dataFrom=vouBox&action=add';

					$(this).attr('data-href', '../../../gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=add');
					$(this).attr('data-title', '凭证录入');
					window.parent.openNewMenu($(this));
				});

				//点击更多
				$("#vouBox #vouBoxTable").on("click", ".vb-more", function() {
					ufma.removeCache("cacheData");
					//缓存数据
					var cacheData = {};
					cacheData.agencyCode = serachData.agencyCode;
					cacheData.acctCode = serachData.acctCode;
					cacheData.vouStatus = serachData.vouStatus;

					cacheData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					cacheData.startVouDate = $('#vbStartVouDate').getObj().getValue();
					cacheData.endVouDate = $('#vbEndVouDate').getObj().getValue();

					cacheData.vouTypeCode = $('#vbVouTypeCode option:selected').val();
					if($('#vbStartStadAmt').val() == "") {
						cacheData.startStadAmt = 0;
					} else {
						cacheData.startStadAmt = $('#vbStartStadAmt').val();
					}
					if($('#vbEndStadAmt').val() == "") {
						cacheData.endStadAmt = 0;
					} else {
						cacheData.endStadAmt = $('#vbEndStadAmt').val();
					}
					if($('#vbAcco_input').val() == "" || page.acco == undefined) {
						cacheData.accoCode = "";
					} else {
						cacheData.accoCode = page.acco.getValue();
					}

					cacheData.inputorName = $('#vbInputor').val();
					cacheData.remark = $('#vbRemark').val();
					cacheData.printCount = $('#vouBox #vbPrintStatus button.btn-primary').val();
					cacheData.errFlag = $('#vouBox #vbErrFlag button.btn-primary').val();
					cacheData.treasuryHook = $('#vouBox #vbtreasuryHook button.btn-primary').val();
					cacheData.setYear = serachData.setYear;
					cacheData.rgCode = serachData.rgCode;
					var vouAccaCode = $(this).parents(".vB-more-style").find("input[type='hidden']").attr("data-acca");

					var vouGuid = $(this).parents(".vB-more-style").find("input[type='hidden']").val();

					ufma.setObjectCache("cacheData", cacheData);
					//					wind ow.location.href = '../vou/index.html?dataFrom=vouBox&action=query&vouGuid='+vouGuid;
					var _this = $(this)
					ufma.ajaxDef('/gl/vou/getVou/' + vouGuid, 'get', '', function(result) {
						if(result.data != null) {
							_this.attr('data-href', '../../../gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=query&vouGuid=' + vouGuid + '&vouAccaCode=' + vouAccaCode);
							_this.attr('data-title', '凭证录入');
							window.parent.openNewMenu(_this);
						} else {
							ufma.showTip('该凭证已在其他页面删除，请刷新页面', function() {}, "warning");
						}
					})

				});

				//点击凭证头
				$("#vouBox #vouBoxTable").on("click", "a.headInfo", function() {
					ufma.removeCache("cacheData");
					//缓存数据
					var cacheData = {};
					cacheData.agencyCode = serachData.agencyCode;
					cacheData.acctCode = serachData.acctCode;
					cacheData.vouStatus = serachData.vouStatus;

					cacheData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					cacheData.startVouDate = $('#vbStartVouDate').getObj().getValue();
					cacheData.endVouDate = $('#vbEndVouDate').getObj().getValue();

					cacheData.vouTypeCode = $('#vbVouTypeCode option:selected').val();
					if($('#vbStartStadAmt').val() == "") {
						cacheData.startStadAmt = 0;
					} else {
						cacheData.startStadAmt = $('#vbStartStadAmt').val();
					}
					if($('#vbEndStadAmt').val() == "") {
						cacheData.endStadAmt = 0;
					} else {
						cacheData.endStadAmt = $('#vbEndStadAmt').val();
					}
					if($('#vbAcco_input').val() == "" || page.acco == undefined) {
						cacheData.accoCode = "";
					} else {
						cacheData.accoCode = page.acco.getValue();
					}

					cacheData.inputorName = $('#vbInputor').val();
					cacheData.remark = $('#vbRemark').val();
					cacheData.printCount = $('#vouBox #vbPrintStatus button.btn-primary').val();
					cacheData.errFlag = $('#vouBox #vbErrFlag button.btn-primary').val();
					cacheData.treasuryHook = $('#vouBox #vbtreasuryHook button.btn-primary').val();
					cacheData.setYear = serachData.setYear;
					cacheData.rgCode = serachData.rgCode;
					var vouAccaCode = $(this).parents("tr.vouHead").find("input.vbPerd").attr("data-acca");

					var vouGuid = $(this).parents("tr.vouHead").find("input.vbGuid").val();

					ufma.setObjectCache("cacheData", cacheData);
					//					window.location.href = '../vou/index.html?dataFrom=vouBox&action=query&vouGuid='+vouGuid;
					var _this = $(this)
					ufma.ajaxDef('/gl/vou/getVou/' + vouGuid, 'get', '', function(result) {
						if(result.data != null) {
							_this.attr('data-href', '../../../gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=query&vouGuid=' + vouGuid + '&vouAccaCode=' + vouAccaCode);
							_this.attr('data-title', '凭证录入');
							window.parent.openNewMenu(_this);
						} else {
							ufma.showTip('该凭证已在其他页面删除，请刷新页面', function() {}, "warning");
						}
					})
				});
				//单据模式下点击编号 跳转凭证录入界面
				$(document).on('click', '.viewData', function(e) {
					ufma.removeCache("cacheData");
					//缓存数据
					var cacheData = {};
					cacheData.agencyCode = serachData.agencyCode;
					cacheData.acctCode = serachData.acctCode;
					cacheData.vouStatus = serachData.vouStatus;

					cacheData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					cacheData.startVouDate = $('#vbStartVouDate').getObj().getValue();
					cacheData.endVouDate = $('#vbEndVouDate').getObj().getValue();

					cacheData.vouTypeCode = $('#vbVouTypeCode option:selected').val();
					if($('#vbStartStadAmt').val() == "") {
						cacheData.startStadAmt = 0;
					} else {
						cacheData.startStadAmt = $('#vbStartStadAmt').val();
					}
					if($('#vbEndStadAmt').val() == "") {
						cacheData.endStadAmt = 0;
					} else {
						cacheData.endStadAmt = $('#vbEndStadAmt').val();
					}
					if($('#vbAcco_input').val() == "" || page.acco == undefined) {
						cacheData.accoCode = "";
					} else {
						cacheData.accoCode = page.acco.getValue();
					}

					cacheData.inputorName = $('#vbInputor').val();
					cacheData.remark = $('#vbRemark').val();
					cacheData.printCount = $('#vouBox #vbPrintStatus button.btn-primary').val();
					cacheData.errFlag = $('#vouBox #vbErrFlag button.btn-primary').val();
					cacheData.treasuryHook = $('#vouBox #vbtreasuryHook button.btn-primary').val();
					cacheData.setYear = serachData.setYear;
					cacheData.rgCode = serachData.rgCode;
					var vouAccaCode = $(this).attr('data-acca');

					var vouGuid = $(this).attr('data-vouGuid');

					ufma.setObjectCache("cacheData", cacheData);
					//					window.location.href = '../vou/index.html?dataFrom=vouBox&action=query&vouGuid='+vouGuid;
					var _this = $(this)
					ufma.ajaxDef('/gl/vou/getVou/' + vouGuid, 'get', '', function(result) {
						if(result.data != null) {
							_this.attr('data-href', '../../../gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=query&vouGuid=' + vouGuid + '&vouAccaCode=' + vouAccaCode);
							_this.attr('data-title', '凭证录入');
							window.parent.openNewMenu(_this);
						} else {
							ufma.showTip('该凭证已在其他页面删除，请刷新页面', function() {}, "warning");
						}
					})
				});

				//按钮提示
				//				$("[data-toggle='tooltip']").tooltip();

				//时间设置
				$(".vouTimes").find(".vouTimeYear").on("click", function() {
					//alert("111111");
					page.setDayInYear();
				});
				$(".vouTimes").find(".vouTimeMonth").on("click", function() {
					page.setDayInMonth();
				});
				$(".vouTimes").find(".vouTimeDay").on("click", function() {
					page.setDayInDay();
				});

				$("#vouBox").find('.searchVou').on('click', function() {
					/*	alert("单位"+$('#vbAgencyCode option:selected').val());
						alert("帐套"+$('#vbAcctCode option:selected').val());
						alert("会计体系"+serachData.accaCode);
						alert("凭证开始时间"+$('#vbStartVouDate').val());
						alert("凭证结束时间"+$('#vbEndVouDate').val());
						alert("凭证类型代码"+$('#vbVouTypeCode option:selected').val());
						alert("开始凭证号"+$('#vbStartVouNo').val());
						alert("结束凭证号"+$('#vbEndVouNo').val());
						alert("会计科目");
						alert("制单人"+$('#vbInputor').val());
						alert("摘要"+$('#vbRemark').val());
						alert("分录起始金额"+$('#vbStartStadAmt').val());
						alert("分录结束金额"+$('#vbEndStadAmt').val());
						alert("打印状态"+$('#vbPrintStatus option:selected').val());
						alert("审核状态");
						alert("页大小"+serachData.pageSize);
						alert("当前页"+serachData.currentPage);*/
					page.searchData();
				});
				//展开更多查询
				$("#vouBox").find('.tip-more').on('click', function() {
					if($(this).find("i").text() == "更多") {
						$(this).find("i").text("收起");
						$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
						$(".vou-query-box-bottom").slideDown();
					} else {
						$(this).find("i").text("更多");
						$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$(".vou-query-box-bottom").slideUp();
					}
				});

				//点击仅显示自己编制的凭证，制单人输入用户名称同时不可录入
				$("#vbShowOwn").on("change", function() {
					if($(this).prop("checked") === true) {
						$("#vbInputor").val(user);
						$("#vbInputor").prop("disabled", true);
					} else {
						$("#vbInputor").val("");
						$("#vbInputor").prop("disabled", false);
					}
				});

				//标签鼠标点击
				$("#vouBox .nav-tabs").on("click", "li", function() {
					$("#vouBox .nav-tabs li").removeClass("active");
					$(this).addClass("active");
					$("#vbCheckAll").prop("checked", false);
					serachData.vouStatus = $(this).find("a").attr("data-status");
					page.searchData();
				});

				//点击会计体系按钮
				$("#vouBox .vbAccaCode").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
						//重新加载会计科目
						var url = '/gl/sys/coaAcc/getAccoTree/' + serachData.setYear + '?agencyCode=' + serachData.agencyCode + '&acctCode=' + serachData.acctCode;
						var accaCode = $(this).val();
						if(accaCode != undefined && accaCode != "") {
							url += "&accaCode=" + accaCode;
						}

						callback = function(result) {
							page.acco = $("#vbAcco").ufmaTreecombox({
								data: result.data
							});
						}
						ufma.get(url, {}, callback);
					}
				});

				//点击期间按钮
				$("#vouBox .vouTimes").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});

				//点击打印状态按钮
				$("#vouBox #vbPrintStatus").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				//点击标错按钮
				$("#vouBox #vbErrFlag").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				
				$("#vouBox #vbtreasuryHook").on("click", "button", function() {
					if(!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});

				//金额输入框
				$("#vbStartStadAmt").on("blur", function() {
					var reg = /^[-\d]+(\.\d+)?$/;
					var max = parseFloat($("#vbEndStadAmt").val());
					var val = parseFloat($(this).val());
					if($(this).val() == "") {
						$(this).val("");
					} else if(!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if(max != "" && val > max) {
						$(this).val("");
						ufma.showTip("起始金额不得大于截止金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbEndStadAmt").on("blur", function() {
					var reg = /^[-\d]+(\.\d+)?$/;
					var min = parseFloat($("#vbStartStadAmt").val());
					var val = parseFloat($(this).val());
					if($(this).val() == "") {
						$(this).val("");
					} else if(!reg.test($(this).val()) && $(this).val() != "") {
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					} else if(min != "" && val < min) {
						$(this).val("");
						ufma.showTip("截止金额不得小于起始金额！");
					} else {
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});

				//绑定日历控件

				//				$("#vouBox").find("#vbStartVouDate").datetimepicker({
				//					format: 'yyyy-mm-dd',
				//					autoclose: true,
				//					todayBtn: true,
				//					startView: 'month',
				//					minView: 'month',
				//					maxView: 'decade',
				//					language: 'zh-CN'
				//				});
				//				$("#vouBox").find("#vbEndVouDate").datetimepicker({
				//					format: 'yyyy-mm-dd',
				//					autoclose: true,
				//					todayBtn: true,
				//					startView: 'month',
				//					minView: 'month',
				//					maxView: 'decade',
				//					language: 'zh-CN'
				//				});

				//选中单条凭证数据
				$("#vouBoxTable").find("tbody").on("click", 'tr input[name="checkList"]', function() {
					var $tr = $(this).parents("tr");
					$tr.toggleClass("selected").nextUntil("tr.vouHead").toggleClass("selected");
					var $tmp = $("[name=checkList]:checkbox");
					$("#vbCheckAll,.vbTable-toolbar-checkAll").prop("checked", $tmp.length == $tmp.filter(":checked").length);
				});

				//checkbox全选
				$("#vouBox").on("click", "#vbCheckAll,.vbTable-toolbar-checkAll", function() {
					if($(this).prop("checked") === true) {
						$("#vbCheckAll,.vbTable-toolbar-checkAll").prop("checked", $(this).prop("checked"));
						$("#vouBoxTable").find("input[name='checkList']").prop("checked", $(this).prop("checked"));
						$("#vouBoxTable").find("tbody tr").addClass("selected").nextUntil("tr.vouHead").addClass("selected");
					} else {
						$("#vbCheckAll,.vbTable-toolbar-checkAll").prop("checked", false);
						$("#vouBoxTable").find("input[name='checkList']").prop("checked", false);
						$("#vouBoxTable").find("tbody tr").removeClass("selected").nextUntil("tr.vouHead").removeClass("selected");
					}
				});

				//单行操作********************
				//点击单行审核操作
				$("#vouBoxTable").on("click", ".vb-audit-one", function() {
					page.vbActOne("/gl/vouBox/auditVous", $(this));
				});
				//点击单行作废操作
				/*				$("#vouBoxTable").on("click",".vb-invalid-one",function(){
									page.vbActOne("/gl/vouBox/invalidVous",$(this));
								});*/
				//点击单行记账操作
				$("#vouBoxTable").on("click", ".vb-accounting-one", function() {
					page.vbActOne("/gl/vouBox/accountingVous", $(this));
				});
				$("#vouBoxTable").on("click", ".vb-unaccounting-one", function() {
					page.vbActOne("/gl/vouBox/unpostVous", $(this));
				});
				//点击单行销审操作
				$("#vouBoxTable").on("click", ".vb-cancelaudit-one", function() {
					page.vbActOne("/gl/vouBox/cancelAuditVous", $(this));
				});
				//点击单行删除操作
				/*				$("#vouBoxTable").on("click",".vb-delete-one",function(){
									page.vbActOne("/gl/vouBox/deleteVous",$(this));
								});*/
				//点击单行还原操作
				$("#vouBoxTable").on("click", ".vb-reduction-one", function() {
					page.vbActOne("/gl/vouBox/reductionVous", $(this));
				});

				//点击单行冲红
				$("#vouBoxTable").on("click", ".vb-red-one", function() {
					if(styleType == "notMergeView") { //分录模式
						page.red = {
							vouGuid: $(this).parents("tr.vouHead").find("input.vbGuid").val(),
							agencyCode: serachData.agencyCode,
							setYear: serachData.setYear
						}
					} else if(styleType == "mergeView") { //单据模式
						page.red = {
							vouGuid: $(this).closest('tr').find("a.viewData").attr('data-vouGuid'),
							agencyCode: serachData.agencyCode,
							setYear: serachData.setYear
						}
					}
					//加载凭证类型
					page.initVouTypeRed();
				});

				//批量操作********************
				//点击批量审核操作
				$("#vbTable-tool-bar").on("click", "#vb-audit-more", function() {
					page.vbActMore("/gl/vouBox/auditVous");
				});
				//点击批量作废操作
				$("#vbTable-tool-bar").on("click", "#vb-invalid-more", function() {
					ufma.confirm("确定作废选中的凭证吗？", function(action) {
						if(action) {
							page.vbActMore("/gl/vouBox/invalidVous");
						}
					});
				});
				//点击批量记账操作
				$("#vbTable-tool-bar").on("click", "#vb-accounting-more", function() {
					page.vbActMore("/gl/vouBox/accountingVous");
				});
				$("#vbTable-tool-bar").on("click", "#vb-unaccounting-more", function() {
					page.vbActMore("/gl/vouBox/unpostVous");
				});
				//点击批量销审操作
				$("#vbTable-tool-bar").on("click", "#vb-cancelaudit-more", function() {
					page.vbActMore("/gl/vouBox/cancelAuditVous");
				});
				//点击批量删除操作
				$("#vbTable-tool-bar").on("click", "#vb-delete-more", function() {
					ufma.confirm("确定删除选中的凭证吗？", function(action) {
						if(action) {
							page.vbActMore("/gl/vouBox/deleteVous");
						}
					});
				});
				//点击批量还原操作
				$("#vbTable-tool-bar").on("click", "#vb-reduction-more", function() {
					page.vbActMore("/gl/vouBox/reductionVous");
				});

				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change", ".vbPageSize", function() {
					page.searchData();
				});

				//点击页数按钮
				$(".ufma-table-paginate").on("click", ".vbNumPage", function() {
					if($(this).find("a").length != 0) {
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						//page.searchData();
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
					}
				});

				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function() {
					if(!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						//page.searchData();
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
					}
				});

				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function() {
					if(!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						//page.searchData();
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
					}
				});

				//跳转页面
				$(".ufma-table-paginate").on("blur", "#vbGoPage", function() {
					var val = $(this).val();
					if(!isNaN($("#vbGoPage").val()) && $(".ufma-table-paginate #vbGoPage").val() <= $(".ufma-table-paginate .vbNumPage").length) {
						$(this).val(val);
					} else {
						$(this).val("");
						ufma.showTip("请输入正确的页码，谢谢！");
					}
				});
				$(".ufma-table-paginate").on("click", "#vb-go-btn", function() {
					serachData.currentPage = $(".ufma-table-paginate").find("#vbGoPage").val();
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#vouBoxTable tbody").html('');
					$(".ufma-tool-btns").html('');
					$(".ufma-table-paginate").html("");
					ufma.post("/gl/vouBox/searchVous", serachData, page.initVouBoxTable);
				});
				$("#vouBoxRedVoucher").find("#vbrvVouDate").datetimepicker({
					format: 'yyyy-mm-dd',
					autoclose: true,
					todayBtn: true,
					startView: 'month',
					minView: 'month',
					maxView: 'decade',
					language: 'zh-CN'
				});

				$('#vbStartVouDate').on("change", function() {

				})
				$('#vbEndVouDate').on("change", function() {

				})
				//点击保存
				$("#btn-save").click(function() {
					var postData;
					if(voutypeacca == 1 && vousinglepz == false) {
						postData = {
							vouGuid: page.red.vouGuid,
							vouDate: $("#vouBoxRedVoucher #vbrvVouDate").val(),
							vouType: $("#vouBoxRedVoucher #vbrvVouTypecw option:selected").attr('value'),
							ysvouType: $("#vouBoxRedVoucher #vbrvVouTypeys option:selected").attr('value'),
						}
					} else {
						postData = {
							vouGuid: page.red.vouGuid,
							vouDate: $("#vouBoxRedVoucher #vbrvVouDate").val(),
							vouType: $("#vouBoxRedVoucher #vbrvVouType option:selected").attr('value'),
							ysvouType: ''
						}
					}
					var callback = function(result) {
						ufma.showTip(result.msg, function() {}, "success");
						page.editor.close();
					}
					ufma.post("/gl/vou/redVoucher", postData, callback);
				});

				//点击取消
				$("#btn-qx").click(function() {
					page.editor.close();
				});

				$(document).on("keydown", function(event) {
					//弹出式询问，左右切换
					//left 37 right 39
					if(event.keyCode == 32) {
						if($(".u-msg-cancel").length == 1) {
							event.preventDefault();
							event.returnValue = false;
							return false;
						}
					}
					if(event.keyCode == 37) {
						if($(".u-msg-cancel").length == 1) {
							if($(".u-msg-cancel").hasClass("btn-primary")) {
								$(".u-msg-cancel").removeClass("btn-primary").addClass("btn-default")
									.css({
										"background-color": "#fff",
										"color": "#333",
										"border": "1px #D9D9D9 solid"
									})
									.siblings(".u-msg-ok").removeClass("btn-default").addClass("btn-primary")
									.css({
										"background-color": "#108ee9",
										"color": "#fff",
										"border": "1px #108ee9 solid"
									});
							}
							event.preventDefault();
							event.returnValue = false;
							return false;
						}
					}
					if(event.keyCode == 39) {
						if($(".u-msg-ok").length == 1) {
							if($(".u-msg-ok").hasClass("btn-primary")) {
								$(".u-msg-ok").removeClass("btn-primary").addClass("btn-default")
									.css({
										"background-color": "#fff",
										"color": "#333",
										"border": "1px #D9D9D9 solid"
									})
									.siblings(".u-msg-cancel").removeClass("btn-default").addClass("btn-primary")
									.css({
										"background-color": "#108ee9",
										"color": "#fff",
										"border": "1px #108ee9 solid"
									});
							}
							event.preventDefault();
							event.returnValue = false;
							return false;
						}
					}
					if(event.keyCode == 13) {
						if($(".u-msg-ok").length == 1) {
							if($(".u-msg-ok").hasClass("btn-primary")) {
								$(".u-msg-ok").click();
							} else if($(".u-msg-cancel").hasClass("btn-primary")) {
								$(".u-msg-cancel").click();
							}
							$(".abstractinp").eq(0).focus();
							event.preventDefault();
							event.returnValue = false;
							return false;
						}
					}

				})
				$('#btnSortVoucher').click(function() {
					var isp = '0'
					if(voutypeacca == 1 && vousinglepz == false) {
						isp = '1,2'
					} else {
						isp = '*'
					}
					ufma.open({
						title: '凭证重排序',
						width: 900,
						height: 500,
						url: '../sortVoucher/sortVoucher.html',
						data: {
							setYear: serachData.setYear,
							agencyCode: serachData.agencyCode,
							acctCode: serachData.acctCode,
							isDouble: isp
						},
						ondestory: function(result) {
							if(result.action == true) {
								ufma.showTip('凭证重排序成功', function() {}, "success");
								page.searchData();
							}
						}
					});
				});
				//切换样式
				$('#btnSwitch').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptPlanList"
				});
				$("#billModel").click(function(e) {
					$('#recordModel').removeAttr("checked");
					styleType = "mergeView";
					page.searchData();
				})
				$('#recordModel').click(function() { //分录模式
					$('#billModel').removeAttr("checked");
					styleType = "notMergeView";
					page.searchData();
				});
			},

			//此方法必须保留
			init: function() {
				var pfData = ufma.getCommonData();
				page.svTransDate = pfData.svTransDate;
				$("#vbStartVouDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function() {
					var dd = page.svTransDate
					var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
					var year = myDate.getFullYear();
					var str = $(this).getObj().getValue();
					var patt1 = new RegExp("^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)0229)$")
					var patt2 = new RegExp("^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$")
					if(patt1.test(str)) {
						var startdate = $('#vbStartVouDate').getObj().getValue();
						var enddate = $('#vbEndVouDate').getObj().getValue();
						var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
						var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
						var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
						if(days < 0) {
							ufma.showTip("日期区间不符", function() {}, "warning");
							setTimeout(function() {
								var mydate = new Date(svData.svTransDate);
								Year = mydate.getFullYear();
								Month = (mydate.getMonth() + 1);
								Month = Month < 10 ? ('0' + Month) : Month;
								Day = mydate.getDate();
								$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');
							}, 100)
						}
					} else if(patt2.test(str)) {
						var startdate = $('#vbStartVouDate').getObj().getValue();
						var enddate = $('#vbEndVouDate').getObj().getValue();
						var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
						var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
						var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
						if(days < 0) {
							ufma.showTip("日期区间不符", function() {}, "warning");
							setTimeout(function() {
								var mydate = new Date(svData.svTransDate);
								Year = mydate.getFullYear();
								Month = (mydate.getMonth() + 1);
								Month = Month < 10 ? ('0' + Month) : Month;
								Day = mydate.getDate();
								$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');
							}, 100)
						}
					} else {
						ufma.showTip("您输入的字符不符合规则", function() {}, "warning");
						var mydate = new Date(svData.svTransDate);
						Year = mydate.getFullYear();
						Month = (mydate.getMonth() + 1);
						Month = Month < 10 ? ('0' + Month) : Month;
						Day = mydate.getDate();
						$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');
					}

				})
				$("#vbEndVouDate").ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: '',
				}).on('change', function() {
					var dd = page.svTransDate
					var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
					var year = myDate.getFullYear();
					var str = $(this).getObj().getValue();
					var patt1 = new RegExp("^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)0229)$")
					var patt2 = new RegExp("^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$")
					if(patt1.test(str)) {
						var startdate = $('#vbStartVouDate').getObj().getValue();
						var enddate = $('#vbEndVouDate').getObj().getValue();
						var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
						var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
						var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
						if(days < 0) {
							ufma.showTip("日期区间不符", function() {}, "warning");
							setTimeout(function() {
								$('#vbEndVouDate').getObj().setValue($('#vbStartVouDate').getObj().getValue());
							}, 100)
						}
					} else if(patt2.test(str)) {
						var startdate = $('#vbStartVouDate').getObj().getValue();
						var enddate = $('#vbEndVouDate').getObj().getValue();
						var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
						var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
						var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
						if(days < 0) {
							ufma.showTip("日期区间不符", function() {}, "warning");
							setTimeout(function() {
								$('#vbEndVouDate').getObj().setValue($('#vbStartVouDate').getObj().getValue());
							}, 100)
						}
					} else {
						ufma.showTip("您输入的字符不符合规则", function() {}, "warning");
						$('#vbEndVouDate').getObj().setValue($('#vbStartVouDate').getObj().getValue());
					}
				})
				this.initPage();
				this.onEventListener();
				ufma.setPortalHeight();
				ufma.parseScroll();
				$(document).on('click', '.vbAccaCode button', function() {
					if(voutypeacca == 1 && vousinglepz == false) {
						if($(this).attr('value') == '') {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + '1,2', "get", "", page.initVouType);
						} else if($(this).attr('value') != '') {
							ufma.ajaxDef("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + serachData.acctCode + "/" + $(this).attr('value'), "get", "", page.initVouType);
						}
					}
				})
			}
		}
	}();

	/////////////////////
	page.init();
});