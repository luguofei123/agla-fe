$(function(){
	var page = function(){
		var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host: "http://" + window.location.host;
		var serachData={
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
			  startStadAmt: null,
			  endStadAmt: null,
			  startVouNo: "",
			  endVouNo: "",
			  vouStatus: "O",
			  vouTypeCode: "",
			  currentPage: 1,
			  pageSize: 25,
			  errFlag:""
		};
		var rpt ={}
		var isaccfullname = false
		var nowfisPerd = ''
		var getdanacctData='';
		var vouTypeArray={};
		var isfispredvouno = false
		var isprintlp =true
		var vbacctData;
		//↓↓下面为传数据时需要用到的全局变量↓↓
		//定义传输数据对象
		var vbObj;
		//定义凭证的vouGuid变量
		var vbGuid;
		//定义登录用户变量
		var user = "姜叶新";
		var zNodes;
		
		//获取门户信息
		var svData;
		
		/*
		//定义时间变量，用于datetimepicker
		var vbDate = new Date();
		var vbYear = vbDate.getFullYear();
		var vbMonth = vbDate.getMonth()+1;
		vbMonth = (vbMonth>9)?vbMonth:"0"+vbMonth;
		var vbDay = vbDate.getDate();
		*/
		
		function getPdf(reportCode, templId, groupDef) {
			var xhr = new XMLHttpRequest()
			var formData = new FormData()
			formData.append('reportCode', reportCode)
			formData.append('templId', templId)
			formData.append('groupDef', groupDef)
			xhr.open('POST', '/pqr/api/printpdfbydata', true)
			xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
			xhr.responseType = 'blob'
		
			//保存文件
			xhr.onload = function(e) {
				if(xhr.status === 200) {
					if(xhr.status === 200) {
						var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
						window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
					}
				}
			}
		
			//状态改变时处理返回值
			xhr.onreadystatechange = function() {
				if(xhr.readyState === 4) {
					//通信成功时
					if(xhr.status === 200) {
						//交易成功时
						ufma.hideloading();
					} else {
						var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
						//提示框，各系统自行选择插件
						alert(content)
						ufma.hideloading();
					}
				}
			}
			xhr.send(formData)
		}
		return{
			
			//设置高度
			setHeight:function(){
				var outH = $("#vouBoxTable").offset().top;
				var tableH = $("#vouBoxTable").outerHeight();
				var barH = $("#vbTable-tool-bar").outerHeight();
				var height = outH+tableH+barH;
				$(".workspace").outerHeight(height);
			},
			returnaccCode:function (code) {
				for(var i=0;i<vbacctData.length;i++){
					if(vbacctData[i].code === code){
						return vbacctData[i].codeName
						break;
					}
				}
			},
			saveruieId:function(url){
				if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
					if (url.indexOf('?') > 0) {
						url = url + "&rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					} else {
						url = url + "?rueicode=" + hex_md5(ufma.getCommonData().svUserCode)
					}
				}
				return url
			},
			selmoneySum:function(){
				var z=0;
				for(var i=0;i<$(".vouHead").length;i++){
					if($(".vouHead").eq(i).hasClass('selected')){
						z+=parseFloat($(".vouHead").eq(i).attr('data-money'))
					}
				}
				$('.vbPageMoneysel').html(page.moneyFormat(z))
			},
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
			returnfispred:function(num){
				if(num<10){
					num = '0' + num.toString()
				}else{
					num = num.toString()
				}
				return num
			},
			//表格金额自动添加千分位和小数点保留两位
			moneyFormat:function(num){
				return num = (num==null)?0:(num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
			},
			
			//
			numFormat:function(s){
				if($.isNull(s)) return '0';
				else return s;
			},
			
			//根据svMenuId和svRoleId获取按钮权限，接口：/df/init/ResState.do?svMenuId=""&svRoleId=""
			/*getPermission:function(reslut){
				var reslist = reslut.reslist;
				ufma.isShow(reslist);
			},*/
			
			//$.ajax()，获取凭证状态
			initVouStatus:function(result){
				var data = result.data;
				serachData.vouStatus = data[0].ENU_CODE;
				
				var $statusLi;
				for(var i=0;i<data.length;i++){
					if(data[i].ENU_NAME=="未审核"){
						$statusLi = $('<li class="active"><a href="javascript:;" data-status="'+data[i].ENU_CODE+'">'+data[i].ENU_NAME+'</a></li>');
					}else{
						$statusLi = $('<li><a href="javascript:;" data-status="'+data[i].ENU_CODE+'">'+data[i].ENU_NAME+'</a></li>');
					}
					$("#vouBox .vbStatus").append($statusLi);
				}
				$statusLiAll = $('<li><a href="javascript:;" data-status="">全部</a></li>');
				$("#vouBox .vbStatus").append($statusLiAll);
			},
			
			//$.ajax()，获取枚举——打印状态
			initPrintStatus:function(result){
				var data = result.data;
				
				var $statusOp = $('<button class="btn btn-primary" value="">全部</button>');
				$("#vouBox #vbPrintStatus").append($statusOp);
				
				for(var i=0;i<data.length;i++){
					var $status = $('<button class="btn btn-default" value="'+data[i].ENU_CODE+'">'+data[i].ENU_NAME+'</button>');
					$("#vouBox #vbPrintStatus").append($status);
				}
			},
			
			//$.ajax()，获取数据数据成功，给凭证类型下拉列表添加option
			initVouType:function(result){
				var data = result.data;
				vouTypeArray={};
				//循环把option填入select
				var $vouTypeOp = '<option value="">  </option>';
				for(var i=0;i<data.length;i++){
					//创建凭证类型option节点
					vouTypeArray[data[i].code] = data[i].name;
					$vouTypeOp += '<option value="'+data[i].code+'">'+data[i].name+'</option>';
				}
				$('#vbVouTypeCode').append($vouTypeOp);
			},
			getVouTypeNameByCode:function(key){
				
				return (vouTypeArray[key]==undefined)?"":vouTypeArray[key];
			},
			
			//$.ajax()，获取数据数据成功，填充表格内容
			initVouBoxTable:function(result){
				if(result.data!=null && $(".searchVou").length > 0){
					var list = result.data.list;
					var paging = result.data.page;
					//定义凭证金额合计变量
					var moneySum = 0;
					//循环加入凭证
					$("#vouBoxTable tbody").html('')
					for(var i=0;i<list.length;i++){
						//凭证头基本节点
						var $headBase = $('<tr class="vouHead" data-money='+list[i].vouHead.amtCr+'><td rowspan='+(list[i].vouDetails.length+2)+' class="vB-check-style">'
							+'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'
							+'<input type="checkbox" name="checkList"/>&nbsp;<span></span>'
							+'</label></td>'
							+'<td rowspan='+(list[i].vouDetails.length+2)+' class="" style="text-overflow: ellipsis;white-space: break-all;">'
							+'<span class="vbvouaccCode" data-code='+list[i].vouHead.acctCode+'>'+page.returnaccCode(list[i].vouHead.acctCode)+'</span>'
							+'</td></tr>');
						//定义凭证头信息节点
							if(isfispredvouno) {
							var $headTitle = $('<td colspan="4" class="">'
								+'<input class="vbGuid" type="hidden" data-errFlag = '+list[i].vouHead.errFlag+' data-group="'+list[i].vouHead.vouGroupId+'"  value="'+list[i].vouHead.vouGuid+'" />'
	                            +'<input class="vouKind" type="hidden" data-group="'+list[i].vouHead.vouKind+'"  value="'+list[i].vouHead.vouKind+'" />'
								+'<input class="vbPerd" type="hidden" data-vouSource="' + list[i].vouHead.vouSource + '" data-status="'+list[i].vouHead.vouStatus+'" data-isBigVou="' + list[i].vouHead.isBigVou +'" data-acca="'+list[i].vouHead.accaCode+'" value="'+list[i].vouHead.fisPerd+'" />'
								+'<a href="javascript:;" class="headInfo pull-left">日期：<span class="vbVouDate">'+list[i].vouHead.vouDate+'</span> 凭证字号：<span class="vbVouNo" data-type="'+list[i].vouHead.vouTypeCode+'">'+list[i].vouHead.vouTypeName+'-'+ page.returnfispred(list[i].vouHead.fisPerd) + '-' +list[i].vouHead.vouNo+'</span> 凭证金额：'+page.moneyFormat(list[i].vouHead.amtCr)+' 附件数：'+page.numFormat(list[i].vouHead.vouCnt)+'张</a>'
								+'</td>');
							} else {
								var $headTitle = $('<td colspan="4" class="">'
								+'<input class="vbGuid" type="hidden" data-errFlag = '+list[i].vouHead.errFlag+' data-group="'+list[i].vouHead.vouGroupId+'"  value="'+list[i].vouHead.vouGuid+'" />'
	                            +'<input class="vouKind" type="hidden" data-group="'+list[i].vouHead.vouKind+'"  value="'+list[i].vouHead.vouKind+'" />'
								+'<input class="vbPerd" type="hidden" data-vouSource="' + list[i].vouHead.vouSource + '"  data-status="'+list[i].vouHead.vouStatus+'" data-isBigVou="' + list[i].vouHead.isBigVou +'" data-acca="'+list[i].vouHead.accaCode+'" value="'+list[i].vouHead.fisPerd+'" />'
								+'<a href="javascript:;" class="headInfo pull-left">日期：<span class="vbVouDate">'+list[i].vouHead.vouDate+'</span> 凭证字号：<span class="vbVouNo" data-type="'+list[i].vouHead.vouTypeCode+'">'+list[i].vouHead.vouTypeName+'-'+list[i].vouHead.vouNo+'</span> 凭证金额：'+page.moneyFormat(list[i].vouHead.amtCr)+' 附件数：'+page.numFormat(list[i].vouHead.vouCnt)+'张</a>'
								+'</td>');
							}
//						var $headTitle = $('<td colspan="4" class="">'
//							+'<input class="vbGuid" type="hidden" data-errFlag = '+list[i].vouHead.errFlag+' data-group="'+list[i].vouHead.vouGroupId+'"  value="'+list[i].vouHead.vouGuid+'" />'
//                          +'<input class="vouKind" type="hidden" data-group="'+list[i].vouHead.vouKind+'"  value="'+list[i].vouHead.vouKind+'" />'
//							+'<input class="vbPerd" type="hidden" data-status="'+list[i].vouHead.vouStatus+'" data-acca="'+list[i].vouHead.accaCode+'" value="'+list[i].vouHead.fisPerd+'" />'
//							+'<a href="javascript:;" class="headInfo pull-left">日期：<span class="vbVouDate">'+list[i].vouHead.vouDate+'</span> 凭证字号：<span class="vbVouNo" data-type="'+list[i].vouHead.vouTypeCode+'">'+list[i].vouHead.vouTypeName+'-'+list[i].vouHead.vouNo+'</span> 凭证金额：'+page.moneyFormat(list[i].vouHead.amtCr)+' 附件数：'+page.numFormat(list[i].vouHead.vouCnt)+'张</a>'
//							+'</td>');
						//定义凭证头人员节点
						var $headTitlePeople;
						//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
						//凭证头人员数据根据状态显示不同信息，需判断凭证状态！3个展现形式
						if(list[i].vouHead.vouStatus=="O"||list[i].vouHead.vouStatus=="C"||list[i].vouHead.vouStatus=="F"){
							$headTitlePeople = $('<div class="pull-right">制单人：'+ufma.parseNull(list[i].vouHead.inputorName)+'</div>');
						}else if(list[i].vouHead.vouStatus=="A"){
							$headTitlePeople = $('<div class="pull-right">制单人：'+ufma.parseNull(list[i].vouHead.inputorName)+' 审核人：'+ufma.parseNull(list[i].vouHead.auditorName)+'</div>');
						}else if(list[i].vouHead.vouStatus=="P"){
							$headTitlePeople = $('<div class="pull-right">制单人：'+ufma.parseNull(list[i].vouHead.inputorName)+' 审核人：'+ufma.parseNull(list[i].vouHead.auditorName)+' 记账人：'+ufma.parseNull(list[i].vouHead.posterName)+'</div>');
						}
						//判断结束，填入凭证头信息节点
						$headTitle.append($headTitlePeople);
						$headBase.append($headTitle);
						
						//凭证金额合计操作
						moneySum = moneySum + list[i].vouHead.amtCr;
						
						//定义凭证头操作节点
						var $headAct;
						//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
						//凭证头根据状态显示不同按钮，需判断凭证状态！4个展现形式
						switch (list[i].vouHead.vouStatus) {
							case "O":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-audit btn-permission vb-audit-one" data-toggle="tooltip" action= "" title="审核">' +
									'<span class="glyphicon icon-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-cancel btn-permission vb-invalid-one" data-toggle="tooltip" action= "" title="作废">' +
									'<span class="glyphicon icon-to-void"></span></a>' +
									'<a data-voutype="' + list[i].vouHead.vouTypeCode + '" data-agencyCode="' + list[i].vouHead.agencyCode +
									'" data-acctCode="' + list[i].vouHead.acctCode + '" data-setYear="' + list[i].vouHead.setYear +
									'" data-rgCode="' + list[i].vouHead.rgCode + '" data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouNo="' + list[i].vouHead.vouNo +
									'" class="btn btn-icon-only btn-sm btn-print-previewpdf btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "A":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-un-audit btn-permission vb-cancelaudit-one" data-toggle="tooltip" action= "" title="销审">' +
									'<span class="glyphicon icon-cancel-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-post btn-permission vb-accounting-one" data-toggle="tooltip" action= "" title="记账">' +
									'<span class="glyphicon icon-account"></span></a>' +
									'<a data-voutype="' + list[i].vouHead.vouTypeCode + '" data-agencyCode="' + list[i].vouHead.agencyCode +
									'" data-acctCode="' + list[i].vouHead.acctCode + '" data-setYear="' + list[i].vouHead.setYear +
									'" data-rgCode="' + list[i].vouHead.rgCode + '" data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouNo="' + list[i].vouHead.vouNo +
									'" class="btn btn-icon-only btn-sm btn-print-previewpdf btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "F":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-audit btn-permission vb-audit-one" data-toggle="tooltip" action= "" title="审核">' +
									'<span class="glyphicon icon-audit"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-cancel btn-permission vb-invalid-one" data-toggle="tooltip" action= "" title="作废">' +
									'<span class="glyphicon icon-to-void"></span></a>' +
									'<a data-voutype="' + list[i].vouHead.vouTypeCode + '" data-agencyCode="' + list[i].vouHead.agencyCode +
									'" data-acctCode="' + list[i].vouHead.acctCode + '" data-setYear="' + list[i].vouHead.setYear +
									'" data-rgCode="' + list[i].vouHead.rgCode + '" data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouNo="' + list[i].vouHead.vouNo +
									'" class="btn btn-icon-only btn-sm btn-print-previewpdf btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							case "P":
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a class="btn btn-icon-only btn-sm btn-turnred btn-permission vb-red-one" data-toggle="tooltip" action= "" title="冲红">' +
									'<span class="glyphicon icon-write-off"></span></a>' +
									'<a data-voutype="' + list[i].vouHead.vouTypeCode + '" data-agencyCode="' + list[i].vouHead.agencyCode +
									'" data-acctCode="' + list[i].vouHead.acctCode + '" data-setYear="' + list[i].vouHead.setYear +
									'" data-rgCode="' + list[i].vouHead.rgCode + '" data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouNo="' + list[i].vouHead.vouNo +
									'" class="btn btn-icon-only btn-sm btn-print-previewpdf btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
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
									'<a data-voutype="' + list[i].vouHead.vouTypeCode + '" data-agencyCode="' + list[i].vouHead.agencyCode +
									'" data-acctCode="' + list[i].vouHead.acctCode + '" data-setYear="' + list[i].vouHead.setYear +
									'" data-rgCode="' + list[i].vouHead.rgCode + '" data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouNo="' + list[i].vouHead.vouNo +
									'" class="btn btn-icon-only btn-sm btn-print-previewpdf btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
							default:
								$headAct = $('<td rowspan=' + (list[i].vouDetails.length + 2) + ' class="vB-action-style">' +
									'<a data-voutype="' + list[i].vouHead.vouTypeCode + '" data-agencyCode="' + list[i].vouHead.agencyCode +
									'" data-acctCode="' + list[i].vouHead.acctCode + '" data-setYear="' + list[i].vouHead.setYear +
									'" data-rgCode="' + list[i].vouHead.rgCode + '" data-fisPerd="' + list[i].vouHead.fisPerd + '" data-vouNo="' + list[i].vouHead.vouNo +
									'" class="btn btn-icon-only btn-sm btn-print-previewpdf btn-permission vb-print-one" data-toggle="tooltip" action= "" title="打印">' +
									'<span class="glyphicon icon-print"></span></a>' +
									'</td>');
								break;
						}
						//判断结束，填入凭证头信息节点
						$headBase.append($headAct);
						//头部tr（凭证头基本节点）填入tbody
						$("#vouBoxTable tbody").append($headBase);
						
						//循环加入每条凭证的分录
						for(var j=0;j<list[i].vouDetails.length;j++){
							//分录基本节点（摘要+科目节点）——科目表未出，先不写，表建好后需写入数据!!！
							var showname = (isaccfullname ? ufma.parseNull(list[i].vouDetails[j].accoCode + " " +list[i].vouDetails[j].accoFullName) : ufma.parseNull(list[i].vouDetails[j].accoCode + " " +list[i].vouDetails[j].accoName))
							var $detailsBase = $('<tr><td class="ellipsis"><span data-toggle="tooltip" title="'+ufma.parseNull(list[i].vouDetails[j].descpt)+'">'+ufma.parseNull(list[i].vouDetails[j].descpt)+'</span></td>'
								+'<td class="ellipsis"><span data-toggle="tooltip" title="'+ufma.parseNull(list[i].vouDetails[j].accoFullName)+'">'+showname+'</span></td></tr>');
							//定义分录金额节点需判断借贷！
							var $detailsMoney;
							//根据借贷类型创建节点，需判断借贷！
							if(list[i].vouDetails[j].drCr==1){
								$detailsMoney = $('<td class="vB-num-style">'+page.moneyFormat(list[i].vouDetails[j].stadAmt)+'</td>'
								+'<td class="vB-num-style"></td>');
							}else if(list[i].vouDetails[j].drCr==-1){
								$detailsMoney = $('<td class="vB-num-style"></td>'
								+'<td class="vB-num-style">'+page.moneyFormat(list[i].vouDetails[j].stadAmt)+'</td>');
							}
							//借贷节点填入分录基本节点
							$detailsBase.append($detailsMoney);
							//分录tr（分录基本节点）填入tbody
							$("#vouBoxTable tbody").append($detailsBase);
						}
						
						//加入更多节点并加入tbody
						var $moreTr = $('<tr><td colspan="4" class="vB-more-style"><span style="float:left;">制单日期：'+list[i].vouHead.inputDate+'</span>'
							+'<input type="hidden" value="'+list[i].vouHead.vouGuid+'" data-isBigVou="' + list[i].vouHead.isBigVou +'" data-acca="'+list[i].vouHead.accaCode+'" />'
							+'<a class="vb-more" data-code='+list[i].vouHead.acctCode+' href="javascript:;">更多'
							+'<span class="glyphicon icon-angle-right"> </span></a>'
							+'</td></tr>');
						$("#vouBoxTable tbody").append($moreTr);
						
					}
					//合计
					$(".vbDataSum").html("共 <span class='vbPageSum'>"+list.length+"</span> 张凭证 金额 <span class='vbPageMoney'>"+page.moneyFormat(moneySum)+"</span>    选中金额 <span class='vbPageMoneysel'>0.00</span>");
					
					//按钮提示
					$("[data-toggle='tooltip']").tooltip();
					$("#vouBoxTable .vb-invalid-one,#vouBoxTable .vb-delete-one").on("click",function(){
						page._self = $(this);
					});
					$('#vouBoxTable .vb-invalid-one').ufTooltip({
		                content: '您确定作废当前凭证吗？',
		                onYes: function () {
		                	page.vbActOne("/gl/vouBox/invalidVous",$(page._self));
		                },
		                onNo: function () {
		                }
	                });
					$('#vouBoxTable .vb-delete-one').ufTooltip({
		                content: '您确定删除当前凭证吗？',
		                onYes: function () {
		                	page.vbActOne("/gl/vouBox/deleteVous",$(page._self));
		                },
		                onNo: function () {
		                }
	                });
					
					//根据凭证，整体上颜色
					$("#vouBox").find("tr.vouHead:odd").each(function(){
						$(this).css({"background-color":"#f9f9f9"}).nextUntil("tr.vouHead").css({"background-color":"#f9f9f9"});
					});
					$("#vouBox").find("tr.vouHead:even").each(function(){
						$(this).css({"background-color":"#ffffff"}).nextUntil("tr.vouHead").css({"background-color":"#ffffff"});
					});
					
					//O:未审核凭证;A:已审核凭证;F:已复审凭证;	P:已记账凭证;C:已作废凭证
					//定义批量操作按钮节点
					var $moreAct='<label class="mt-checkbox mt-checkbox-outline margin-right-8" style="margin-bottom: 0;">'+
						'<input class="vbTable-toolbar-checkAll" type="checkbox" name="test" value="1"> 全选'+
						'<span></span>'+
						'</label>';
					if(serachData.vouStatus=='O'){
						//O:未审核凭证
						$moreAct += '<button id="vb-audit-more" type="button" class="btn btn-sm btn-default btn-downto btn-audit btn-permission">审核</button>'
							+'<button id="vb-invalid-more" type="button" class="btn btn-sm btn-default btn-downto btn-cancel btn-permission">作废</button>'
							+'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print-previewpdf btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").html($moreAct);
					}
					else if(serachData.vouStatus=='A'){
						//A:已审核凭证
						$moreAct += '<button id="vb-cancelaudit-more" type="button" class="btn btn-sm btn-default btn-downto btn-un-audit btn-permission">销审</button>'
							+'<button id="vb-accounting-more" type="button" class="btn btn-sm btn-default btn-downto btn-post btn-permission">记账</button>'
							+'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print-previewpdf btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").html($moreAct);
					}else if(serachData.vouStatus=='F'){
						//F:已复审凭证
						$moreAct += '<button id="vb-audit-more" type="button" class="btn btn-sm btn-default btn-downto btn-audit btn-permission">审核</button>'
							+'<button id="vb-invalid-more" type="button" class="btn btn-sm btn-default btn-downto btn-cancel btn-permission">作废</button>'
							+'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print-previewpdf btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").html($moreAct);
					}else if(serachData.vouStatus=='P'){
						//P:已记账凭证
						$moreAct += '<button id="vb-red-more" type="button" class="btn btn-sm btn-default btn-downto btn-turnred btn-permission" style="display:none;">冲红</button>'
							+'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print-previewpdf btn-permission">打印</button>'+
							'<button id="vb-unaccounting-more" type="button" class="btn btn-sm btn-default btn-downto btn-unaccounting btn-permission">反记账</button>';;
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").html($moreAct);
					}else if(serachData.vouStatus=='C'){
						//C:已作废凭证
						$moreAct += '<button id="vb-reduction-more" type="button" class="btn btn-sm btn-default btn-downto btn-un-cancel btn-permission">还原</button>'
							+'<button id="vb-delete-more" type="button" class="btn btn-sm btn-default btn-downto btn-delete btn-permission">删除</button>'
							+'<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print-previewpdf btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").html($moreAct);
					}
					else{
						//全部
						$moreAct += '<button id="vb-print-more" type="button" class="btn btn-sm btn-default btn-downto btn-print-previewpdf btn-permission">打印</button>';
						//把按钮填入ufma-tool-btns
						$(".ufma-tool-btns").html($moreAct);
					}
					
					//分页部分功能
					//分页  不分页需判断
					if(paging.pageSize!=0){
						//创建基本分页节点
						var $pageBase = $('<ul id="vbTable-pagination" class="pagination pagination-sm pull-left"></ul>');
						//创建上一页节点  根据当前也判断是否可以点
						var $pagePrev;
						if((paging.currentPage-1)==0){
							$pagePrev = $('<li class="vbPrevPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-left"></span></span></li>');
						}else{
							$pagePrev = $('<li class="vbPrevPage"><a href="javascript:;" aria-label="Previous" data-prevpage='+(paging.currentPage-1)+'>'
								+'<span aria-hidden="true" class="glyphicon icon-angle-left"></span>'
								+'</a></li>');
						}
						$pageBase.append($pagePrev);
						//创建页数节点,根据pageSize和凭证数据总数
						//创建页数变量
						var pageAmount = Math.ceil(paging.totalRows/paging.pageSize);
						var $pageItem;
						for(var k=1;k<=pageAmount;k++){
							//第一页和最后一页显示
							if(k==1||k==pageAmount){
								//三元运算判断是否当前页
								$pageItem = (k==paging.currentPage)?$('<li class="vbNumPage active"><span data-gopage='+k+'>'+k+' <span class="sr-only">(current)</span></span></li>'):$('<li class="vbNumPage"><a href="javascript:;" data-gopage='+k+'>'+k+'</a></li>');
							}else{
								//判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
								if((pageAmount-2)<=3){
									//三元运算判断是否当前页
									$pageItem = (k==paging.currentPage)?$('<li class="vbNumPage active"><span data-gopage='+k+'>'+k+' <span class="sr-only">(current)</span></span></li>'):$('<li class="vbNumPage"><a href="javascript:;" data-gopage='+k+'>'+k+'</a></li>');
								}else if((pageAmount-2)>3){
									//判断当前页位置
									if(paging.currentPage<=2){
										//分页按钮加载2到4之间
										if(k>=2&&k<=4){
											//三元运算判断是否当前页
											$pageItem = (k==paging.currentPage)?$('<li class="vbNumPage active"><span data-gopage='+k+'>'+k+' <span class="sr-only">(current)</span></span></li>'):$('<li class="vbNumPage"><a href="javascript:;" data-gopage='+k+'>'+k+'</a></li>');
										}
									}else if(paging.currentPage>2&&paging.currentPage<(pageAmount-1)){
										//分页按钮加载currentPage-1到currentPage+1之间
										if(k>=(paging.currentPage-1)&&k<=(paging.currentPage+1)){
											//三元运算判断是否当前页
											$pageItem = (k==paging.currentPage)?$('<li class="vbNumPage active"><span data-gopage='+k+'>'+k+' <span class="sr-only">(current)</span></span></li>'):$('<li class="vbNumPage"><a href="javascript:;" data-gopage='+k+'>'+k+'</a></li>');
										}
									}else if(paging.currentPage>=(pageAmount-1)){
										//分页按钮加载pageAmount-3到pageAmount-1之间
										if(k>=(pageAmount-3)&&k<=(pageAmount-1)){
											//三元运算判断是否当前页
											$pageItem = (k==paging.currentPage)?$('<li class="vbNumPage active"><span data-gopage='+k+'>'+k+' <span class="sr-only">(current)</span></span></li>'):$('<li class="vbNumPage"><a href="javascript:;" data-gopage='+k+'>'+k+'</a></li>');
										}
									}
								}
							}
							$pageBase.append($pageItem);
						}
						//创建下一页节点 根据当前页判断是否可以点
						var $pageNext;
						if((pageAmount-paging.currentPage)==0){
							$pageNext = $('<li class="vbNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>');
						}else{
							$pageNext = $('<li class="vbNextPage"><a href="javascript:;" aria-label="Next" data-nextpage='+(paging.currentPage+1)+'>'
								+'<span aria-hidden="true" class="glyphicon icon-angle-right"></span>'
								+'</a></li>');
						}
						$pageBase.append($pageNext);
						$("#vouBox .ufma-table-paginate").html($pageBase);
					}
					
					//创建分页大小基本节点
					var $pageSizeBase = $('<div class="pull-left" style="margin: 0 16px;"></div>');
					var $pageSel = $('<select class="vbPageSize bordered-input"></select>');
					//根据pageSize创建下拉列表
					//分页数组
					var pageArr = [25,50,75,100,0];
					var $pageOp;
					//定义是否不分页变量
					var isNoPaging;
					for(var n=0;n<pageArr.length;n++){
						isNoPaging = (pageArr[n]==0)?"不分页":pageArr[n];
						if(pageArr[n]==paging.pageSize){
							$pageOp = $('<option value='+pageArr[n]+' selected>'+isNoPaging+'</option>');
						}else{
							$pageOp = $('<option value='+pageArr[n]+'>'+isNoPaging+'</option>');
						}
						$pageSel.append($pageOp);
					}
					$pageSizeBase.append("<span>显示 </span>");
					$pageSizeBase.append($pageSel);
					$pageSizeBase.append("<span> 条</span>");
					$("#vouBox .ufma-table-paginate").prepend($pageSizeBase);
					
					//创建总数统计节点
					var $vouDataSum = $('<div class="pull-left">共 <span class="vbSum">'+paging.totalRows+'</span> 条</div>');
					$("#vouBox .ufma-table-paginate").prepend($vouDataSum);
					
					/*if(paging.pageSize!=0){
						//创建到哪页和按钮节点
						var $pageGo = $('<div class="pull-left" style="margin-left: 16px;">到 '
							+'<input type="text" id="vbGoPage" class="bordered-input padding-3" placeholder="1"/>'
							+' 页</div>'
							+'<button id="vb-go-btn" type="button" class="btn btn-sm btn-default btn-downto" style="margin-left: 8px;">确定</button>');
						$("#vouBox .ufma-table-paginate").append($pageGo);
					}*/
					
					$("#vouBoxTable input#vbCheckAll").prop("checked",false);
					$("#vouBoxTable input#vbCheckAll").prop("disabled",false);
					$("#btn-print-preview").prop("disabled",false);
				}else{
					$("#vouBoxTable input#vbCheckAll").prop("checked",false);
            		$("#vbTable-tool-bar input.vbTable-toolbar-checkAll").prop("checked",false);
            		$("#vouBoxTable input#vbCheckAll").prop("disabled",true);
            		$("#vbTable-tool-bar input.vbTable-toolbar-checkAll").prop("disabled",true);
                	var $empty = $('<tr><td class="dataTables_empty" valign="top" colspan="6">'
                		+'<img src="'+bootPath+'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>'
                		+'</td></tr>');
            		$("#vouBoxTable tbody").append($empty);
            		$("#btn-print-preview").prop("disabled",true);
				}
				
				//权限判断
//				ufma.isShow(page.reslist);
//				
//				ufma.setPortalHeight();
//				ufma.parseScroll();
//				page.setHeight();	
				ufma.isShow(page.reslist);
				ufma.setBarPos($(window));
				//				page.setHeight();	
			},
			
			//根据单位账套判断是否启用平行记账，不启用时隐藏会计体系
			getIsParallel:function(result){
				var isParallel = result.data;
					
				if(isParallel!="1"){
					$(".vbAccaCode").parents(".vou-query-li").hide();
				}else{
					$(".vbAccaCode").parents(".vou-query-li").show();
				}
			},
			
			//$.ajax()，获取数据数据成功，给会计体系按钮属性值
			initAccaVal:function(result){
				var data = result.data;
				
				var $allAcca = $('<button class="btn btn-primary" value="">全部</button>');
				$("#vouBox .vbAccaCode").append($allAcca);
				
				for(var i=0;i<data.length;i++){
					var $acca = $('<button class="btn btn-default" value="'+data[i].accaCode+'">'+data[i].accaName+'</button>');
					$("#vouBox .vbAccaCode").append($acca);
				}
				
				//判断是否平行记账
				ufma.get("/gl/eleCoacc/getIsParallel?agencyCode="+serachData.agencyCode+"&acctCode="+serachData.acctCode,"",page.getIsParallel);
			},
			
			//单行操作（全部）
			vbActOne:function(url,dom){
				//获得该点击的凭证的vouGuid
				vbGuid = $(dom).parents("tr.vouHead").find("input.vbGuid").val();
				vbGroupId = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-group');
				vbVouNo = $(dom).parents("tr.vouHead").find("span.vbVouNo").text();
				vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-")+1);
				var errFlag = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-errFlag');
				vbPerd = $(dom).parents("tr.vouHead").find("input.vbPerd").val();
				vbAcca = $(dom).parents("tr.vouHead").find("input.vbPerd").attr('data-acca');
				vbVouTypeCode = $(dom).parents("tr.vouHead").find("span.vbVouNo").attr("data-type");
				vbVouStatus = $(dom).parents("tr.vouHead").find("input.vbPerd").attr('data-status');
				var vbVouSource = $(dom).parents("tr.vouHead").find("input.vbPerd").attr('data-vouSource');
//				vbSData = $('#vbStartVouDate').val();
//				vbEData = $('#vbEndVouDate').val();
				if (url == "/gl/vouBox/deleteVous" || url == "/gl/vouBox/reductionVous" ) {
					vbObj = [{
						vouGuid:vbGuid,
						vouGroupId:vbGroupId,
						setYear:serachData.setYear,
						agencyCode:serachData.agencyCode,
						acctCode: $(dom).parents("tr.vouHead").find('.vbvouaccCode').attr('data-code'),
						vouNo:vbVouNo,
						errFlag:errFlag,
						vouTypeCode:vbVouTypeCode,
						vouStatus:vbVouStatus,
						accaCode:vbAcca,
						fisPerd:vbPerd,
						startDate:serachData.startVouDate,
						endtDate:serachData.endVouDate,
						vouSource: vbVouSource
					}];
				} else {
					vbObj = [{
						vouGuid:vbGuid,
						vouGroupId:vbGroupId,
						setYear:serachData.setYear,
						agencyCode:serachData.agencyCode,
						acctCode: $(dom).parents("tr.vouHead").find('.vbvouaccCode').attr('data-code'),
						vouNo:vbVouNo,
						errFlag:errFlag,
						vouTypeCode:vbVouTypeCode,
						vouStatus:vbVouStatus,
						accaCode:vbAcca,
						fisPerd:vbPerd,
						startDate:serachData.startVouDate,
						endtDate:serachData.endVouDate
					}];
				}
				var vbCallback = function(result){
					//page.searchData();
					if(url ==  '/gl/vouBox/auditVous'){
						if(result.data.flag == 'success') {
							ufma.showTip('审核成功', "", 'success');
						} else {
							ufma.showTip(result.data.msg, "", 'error');
						}
					}else{
						ufma.showTip(result.msg, "", result.flag);
					}
					//判断是否不分页
					if($(".ufma-table-paginate").find(".vbPageSize").val()==0){
						//不分页
						page.searchData();
					}else{
						//分页
						$(dom).parents("tr.vouHead").remove();
						$(dom).parents("tr.vouHead").nextUntil("tr.vouHead").remove();
						if($(".ufma-table-paginate").find(".vbPageSize").length!=0){
							var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1)==0)?1:($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1);
							serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length==0)?cPage:$(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
							serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						}
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
						page.searchData();
					}
				};
				ufma.post(url,vbObj,vbCallback);
				$("#vbCheckAll").prop("checked",false);
			},
			
			//单行操作（备选）
			vbActionOne:function(url,dom){
				ufma.showloading('正在处理，请耐心等待...');
				//获得该点击的凭证的vouGuid
				vbGuid = $(dom).parents("tr.vouHead").find("input.vbGuid").val();
				vbGroupId = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-group');
				vbVouNo = $(dom).parents("tr.vouHead").find("span.vbVouNo").text();
				var errFlag = $(dom).parents("tr.vouHead").find("input.vbGuid").attr('data-errFlag');
				vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-")+1);
				vbPerd = $(dom).parents("tr.vouHead").find("input.vbPerd").val();
				vbAcca = $(dom).parents("tr.vouHead").find("input.vbPerd").attr('data-acca');
//				vbSData = $('#vbStartVouDate').val();
//				vbEData = $('#vbEndVouDate').val();
				vbObj = [{
					vouGuid:vbGuid,
					vouGroupId:vbGroupId,
					setYear:serachData.setYear,
					agencyCode:serachData.agencyCode,
					acctCode:$(dom).parents("tr.vouHead").find('.vbvouaccCode').attr('data-code'),
					vouNo:vbVouNo,
					errFlag:errFlag,
					accaCode:vbAcca,
					fisPerd:vbPerd,
					startDate:serachData.startVouDate,
					endtDate:serachData.endVouDate
				}];
				var vbCallback = function(result){
					ufma.hideloading();
					//page.searchData();
					if(url ==  '/gl/vouBox/auditVous'){
						if(result.data.flag == 'success') {
							ufma.showTip('审核成功', "", 'success');
						} else {
							ufma.showTip(result.data.msg, "", 'error');
						}
					}else{
						ufma.showTip(result.msg, "", result.flag);
					}
					//判断是否不分页
					if($(".ufma-table-paginate").find(".vbPageSize").val()==0){
						//不分页
						page.searchData();
					}else{
						//分页
						$(dom).parents("tr.vouHead").remove();
						$(dom).parents("tr.vouHead").nextUntil("tr.vouHead").remove();
						if($(".ufma-table-paginate").find(".vbPageSize").length!=0){
							var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1)==0)?1:($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1);
							serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length==0)?cPage:$(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
							serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						}
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
						page.searchData();
					}
				};
				ufma.post(url,vbObj,vbCallback);
				$("#vbCheckAll").prop("checked",false);
			},
			
			//批量操作（全部）
			vbActMore:function(url){
				ufma.showloading('正在处理，请耐心等待...');
				var vbObjArr = [];
				if($("#vouBoxTable").find(".vouHead.selected").length!=0){
					$("#vouBoxTable").find(".vouHead.selected").each(function(i){
						vbGuid = $(this).find("input.vbGuid").val();
						var vouKind=$(this).find("input.vouKind").val();
						var errFlag = $(this).find("input.vbGuid").attr('data-errFlag');
						vbGroupId = $(this).find("input.vbGuid").attr('data-group');
						vbVouNo = $(this).find("span.vbVouNo").text();
						vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-")+1);
						vbPerd = $(this).find("input.vbPerd").val();
						vbAcca = $(this).find("input.vbPerd").attr('data-acca');
						vbVouTypeCode = $(this).find("span.vbVouNo").attr("data-type");
						vbVouStatus = $(this).find("input.vbPerd").attr('data-status');
						var vbVouSource = $(this).find("input.vbPerd").attr('data-vouSource');
//						vbSData = $('#vbStartVouDate').val();
//						vbEData = $('#vbEndVouDate').val();
						if (url == "/gl/vouBox/deleteVous" ||url ==  '/gl/vouBox/reductionVous') {
							vbObj = {
								vouGuid:vbGuid,
	             				vouKind:vouKind,
								vouGroupId:vbGroupId,
								setYear:serachData.setYear,
								agencyCode:serachData.agencyCode,
								acctCode:$("#vouBoxTable").find(".vouHead.selected").eq(i).find('.vbvouaccCode').attr('data-code'),
								vouNo:vbVouNo,
								errFlag:errFlag,
								vouTypeCode:vbVouTypeCode,
								vouStatus:vbVouStatus,
								accaCode:vbAcca,
								fisPerd:vbPerd,
								startDate:serachData.startVouDate,
								endtDate:serachData.endVouDate,
								vouSource: vbVouSource
							};
						} else {
							vbObj = {
								vouGuid:vbGuid,
	             				vouKind:vouKind,
								vouGroupId:vbGroupId,
								setYear:serachData.setYear,
								agencyCode:serachData.agencyCode,
								acctCode:$("#vouBoxTable").find(".vouHead.selected").eq(i).find('.vbvouaccCode').attr('data-code'),
								vouNo:vbVouNo,
								errFlag:errFlag,
								vouTypeCode:vbVouTypeCode,
								vouStatus:vbVouStatus,
								accaCode:vbAcca,
								fisPerd:vbPerd,
								startDate:serachData.startVouDate,
								endtDate:serachData.endVouDate
							};
						}
						vbObjArr.push(vbObj);
					});
					var vbCallback = function(result){
						//page.searchData();
/*                        if(result.data=='1'){
                            ufma.showTip(result.msg,"",'success');
                        }else if(result.data=='2'){
                            ufma.showTip(result.msg,"",'error');
                        }else{
                        	ufma.showTip(result.msg,"",'success');						
                        }*/
                      	if(url ==  '/gl/vouBox/auditVous'){
							if(result.data.flag == 'success') {
								ufma.showTip('审核成功', "", 'success');
							} else {
								ufma.showTip(result.data.msg, "", 'error');
							}
						}else{
							if(result.flag == 'success') {
								ufma.showTip(result.msg, "", 'success');
							} else {
								ufma.showTip(result.msg, "", 'error');
							}
						}
						//判断是否不分页
						if($(".ufma-table-paginate").find(".vbPageSize").val()==0){
							//不分页
							page.searchData();
						}else{
							//分页
							$("#vouBoxTable tbody").find(".vouHead.selected").remove();
							if($(".ufma-table-paginate").find(".vbPageSize").length!=0){
								var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1)==0)?1:($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1);
								serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length==0)?cPage:$(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
								serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
							}
							$(".vbDataSum").html("");
							$("#vouBoxTable tbody").html('');
							$(".ufma-tool-btns").html('');
							$(".ufma-table-paginate").html("");
							//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
							page.searchData();
						}
						ufma.hideloading();
					}
					setTimeout(function(){
						ufma.post(url,vbObjArr,vbCallback);
					},5)
					$("#vbCheckAll").prop("checked",false);
				}else{
					ufma.showTip("请勾选您要操作的凭证，谢谢！");
					ufma.hideloading();
				}
			},
			
			//批量操作（备选）
			vbActionMore:function(url){
				var vbObjArr = [];
				if($("#vouBoxTable").find(".vouHead.selected").length!=0){
					$("#vouBoxTable").find(".vouHead.selected").each(function(i){
						vbGuid = $(this).find("input.vbGuid").val();
						var vouKind=$(this).find("input.vouKind").val();
						vbGroupId = $(this).find("input.vbGuid").attr('data-group');
						vbVouNo = $(this).find("span.vbVouNo").text();
						vbVouNo = vbVouNo.substring(vbVouNo.indexOf("-")+1);
						vbPerd = $(this).find("input.vbPerd").val();
						vbAcca = $(this).find("input.vbPerd").attr('data-acca');
						
//						vbSData = $('#vbStartVouDate').val();
//						vbEData = $('#vbEndVouDate').val();
						vbObj = {
							vouGuid:vbGuid,
							vouKind:vouKind,
							vouGroupId:vbGroupId,
							setYear:serachData.setYear,
							agencyCode:serachData.agencyCode,
							acctCode:$("#vouBoxTable").find(".vouHead.selected").eq(i).find('.vbvouaccCode').attr('data-code'),
							vouNo:vbVouNo,
							accaCode:vbAcca,
							fisPerd:vbPerd,
							startDate:serachData.startVouDate,
							endtDate:serachData.endVouDate
						};
						vbObjArr.push(vbObj);
					});
					var vbCallback = function(result){
						//page.searchData();
						if(result.data=='1'){
                            ufma.showTip(result.msg,"",'success');
						}else if(result.data=='2'){
                            ufma.showTip(result.msg,"",'warnning');
						}

						//判断是否不分页
						if($(".ufma-table-paginate").find(".vbPageSize").val()==0){
							//不分页
							page.searchData();
						}else{
							//分页
							$("#vouBoxTable tbody").find(".vouHead.selected").remove();
							if($(".ufma-table-paginate").find(".vbPageSize").length!=0){
								var cPage = (($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1)==0)?1:($(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage")-1);
								serachData.currentPage = ($("#vouBoxTable tbody").find("tr.vouHead").length==0)?cPage:$(".ufma-table-paginate .vbNumPage.active").find("span").attr("data-gopage");
								serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
							}
							$(".vbDataSum").html("");
							$("#vouBoxTable tbody").html('');
							$(".ufma-tool-btns").html('');
							$(".ufma-table-paginate").html("");
							//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
							page.searchData();
						}
					}
					ufma.post(url,vbObjArr,vbCallback);
					$("#vbCheckAll").prop("checked",false);
				}else{
					ufma.showTip("请勾选您要操作的凭证，谢谢！");
					ufma.hideloading();
				}
			},
			
			getLastDay:function(year,month){
				 var new_year = year;    //取当前的年份          
	             var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）          
	             if(month>12) {         
	              new_month -=12;        //月份减          
	              new_year++;            //年份增          
	             }         
	             var new_date = new Date(new_year,new_month,1);                //取当年当月中的第一天          
	             return (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期 
			},
			setDayInYear:function(){
				var mydate = new Date(svData.svTransDate);
				var Year=mydate.getFullYear();
				$('#vbStartVouDate').val(Year+'-01-01');
				$('#vbEndVouDate').val(Year+'-12-31');
				serachData.startVouDate=$('#vbStartVouDate').val();
				serachData.endVouDate=$('#vbEndVouDate').val();
			},
			setDayInMonth:function(){
				var mydate = new Date(svData.svTransDate);
				var Year=mydate.getFullYear();
				var Month=(mydate.getMonth()+1);
				if(nowfisPerd!=''){
					Month = nowfisPerd
					nowfisPerd = ''
				}
				Month = Month<10?('0'+Month):Month;
				Day=mydate.getDate();
				$('#vbStartVouDate').val(Year+'-'+Month+'-01');
				
				$('#vbEndVouDate').val(Year+'-'+Month+'-'+this.getLastDay(Year,Month));
				serachData.startVouDate=$('#vbStartVouDate').val();
				serachData.endVouDate=$('#vbEndVouDate').val();
			},
			setDayInDay:function(){
				var mydate = new Date(svData.svTransDate);
				var Year=mydate.getFullYear();
				var Month=(mydate.getMonth()+1);
				Month = Month<10?('0'+Month):Month;
				Day=mydate.getDate();
				Day = Day<10?('0'+Day):Day;
				$('#vbStartVouDate').val(Year+'-'+Month+'-'+Day);
				$('#vbEndVouDate').val(Year+'-'+Month+'-'+Day);
				serachData.startVouDate=$('#vbStartVouDate').val();
				serachData.endVouDate=$('#vbEndVouDate').val();
			},
			
			//初始化页面
			initPage:function(){
				var  Year, Month, Day;
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				svData = ufma.getCommonData();
				if(page.getUrlParam('checkfisPerd')!=null){
					nowfisPerd = page.getUrlParam('checkfisPerd')
				}
				if(page.getUrlParam('danacct')!=null){
					getdanacctData = page.getUrlParam('danacct')
				}
				this.setDayInMonth();
				user = svData.svUserName;
				serachData.setYear = svData.svSetYear;
				serachData.rgCode = svData.svRgCode;
				//表格功能条住底
//				ufma.parseScroll();
				
				//加载枚举表打印状态
				ufma.get("/gl/enumerate/PRINT_STATUS","",this.initPrintStatus);
				
				//账套选择
				$("#cbAcct").ufTextboxlist({
            		idField:'code',
					textField:'codeName',
					pIdField:'pId',
					placeholder:'请选择账套',
					icon:'icon-book',
					leafRequire:true,
					onChange:function(sender, treeNode){
						//serachData.acctCode = data.CHR_CODE;
						serachData.acctCode = $("#cbAcct").getObj().getValue();
						//审核标签默认到未审核
						$("#vouBox .nav-tabs li").removeClass("active");
						$("#vouBox .nav-tabs li").find("[data-status='O']").parents("li").addClass("active");
						serachData.vouStatus = $("#vouBox .nav-tabs li.active").find("a").attr("data-status");
						
						//加载会计体系按钮
						$("#vouBox .vbAccaCode").html("");
						ufma.ajaxDef("/gl/eleAcca/getRptAccas?agencyCode="+serachData.agencyCode+"&acctCode="+serachData.acctCode+"&rgCode="+serachData.rgCode+"&setYear="+serachData.setYear,'get',"",page.initAccaVal);
						ufma.ajaxDef('/pub/user/menu/config/select?agencyCode='+serachData.agencyCode+'&acctCode='+serachData.acctCode+'&menuId=5444eb79-d926-46f5-ae2b-2daf90ab8bcb', "get", '', function(data) {
							if(data.data.vouisfullname==0){
								$('#vouisfullnamesingle').removeAttr("checked");
								$('#vouisfullnamesingles').attr("checked",true).prop('checked',true);;
								isaccfullname =false;
							}else{
								$('#vouisfullnamesingles').removeAttr("checked");
								$('#vouisfullnamesingle').attr("checked",true).prop('checked',true);;
								isaccfullname = true;
							}
						})
						//根据单位账套重新加载会计科目
						var url = '/gl/sys/coaAcc/getAccoTree/'+serachData.setYear+'?agencyCode='+serachData.agencyCode+'&acctCode='+serachData.acctCode;
						callback = function(result){
							page.acco = $("#vbAcco").ufmaTreecombox({
								valueField:'id',
				   				textField:'codeName',
				   				readOnly:false,
							   	leafRequire:true,
							   	popupWidth:1.5,
								data: result.data,
								onchange:function(data){}
							});
						}
						ufma.ajaxDef(url,'get',{},callback);
						//清空其它搜索项
						$('#vbVouTypeCode').val('');
						$('#vbStartVouNo').val('');
						$('#vbEndVouNo').val('');
						$('#vbStartStadAmt').val('');
						$('#vbEndStadAmt').val('');
						rpt.vbInputor.clear()
						$('#vbRemark').val('');
						page.searchData();
				    }
            	});
				page.cbAcct = $("#cbAcct").getObj();
				//单位选择
				page.cbAgency=$("#cbAgency").ufmaTreecombox2({
					valueField:"id",
					textField:"codeName",
					readonly:false,
					placeholder:"请选择单位",
					icon:"icon-unit",
				    onchange:function(data){
				    	serachData.agencyCode = data.id;
				    	ufma.get("/gl/vou/getSysRuleSet/" + serachData.agencyCode + "?chrCodes=GL026,GL028,GL039,GL061", "", function(data) {
							isfispredvouno = data.data.GL028;
							isprintlp = data.data.GL061;
							if(data.data.GL026 == true) {
								//显示挂接按钮
								$('.istreasuryHook').show()
							} else if(data.data.GL026 == false) {
								$('.istreasuryHook').hide()
								$('#vbtreasuryHook').find('button').eq(0).trigger('click')
							}
						});
						//获取凭证来源  add by  guohx
						page.getVouResource();
						page.getVouvbInputor();
						$("#vbVouTypeCode").html("");
						$("#vouBox .vbStatus").html("");
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						//加载凭证类型
						ufma.ajaxDef("/gl/eleVouType/getMultiAcctVouType/"+serachData.agencyCode+"/"+serachData.setYear,"get","",page.initVouType);
						
						//加载凭证状态选项卡
						ufma.ajaxDef("/gl/vouBox/vouStatus?agencyCode="+serachData.agencyCode,"get","",page.initVouStatus);
				    	//改变单位,账套选择内容改变
				    	var url = '/gl/eleCoacc/getRptAccts'
						var callback = function(result){
/*							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});*/
							vbacctData = result.data;
							for(var i=0;i<result.data.length;i++){
								result.data[i].pId='0';
							}
							result.data.splice(0, 0, {code:'0',codeName:'所有账套'}); 
							page.cbAcct.load(result.data);
							
							var svFlag = $.inArrayJson(result.data,"code",svData.svAcctCode);
							if(svFlag!=undefined){
								if(getdanacctData!=''){
									page.cbAcct.val(getdanacctData);
									getdanacctData = ''
								}else{
									page.cbAcct.val(svData.svAcctCode);
								}
								page.searchData();
							}else{
								var treeVal =[];
								for(var i=0;i<result.data.length;i++){

									if(result.data[i].code != '0'){
										treeVal.push(result.data[i].code);	
									}
									
								}
								if(page.cbAcct && treeVal.length > 0){
									if(getdanacctData!=''){
										page.cbAcct.val(getdanacctData);
										getdanacctData = ''
									}else{
										page.cbAcct.val(treeVal.join(','));	
									}
									page.searchData();
								}else{
									ufma.showTip("当前单位无账套，请更新单位！", function() {}, "warning");
								}
								
							}
							ufma.ajaxDef('/pub/user/menu/config/select?agencyCode='+serachData.agencyCode+'&acctCode='+serachData.acctCode+'&menuId=5444eb79-d926-46f5-ae2b-2daf90ab8bcb', "get", '', function(data) {
								if(data.data.vouisfullname==0){
									$('#vouisfullnamesingle').removeAttr("checked");
									$('#vouisfullnamesingles').attr("checked",true).prop('checked',true);;
									isaccfullname =false;
								}else{
									$('#vouisfullnamesingles').removeAttr("checked");
									$('#vouisfullnamesingle').attr("checked",true).prop('checked',true);;
									isaccfullname = true;
								}
							})
						}
						ufma.ajaxDef(url,'get',{'agencyCode':serachData.agencyCode,'userId':svData.svUserId,'setYear':svData.svSetYear},callback);
				    }
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree","get","",function(result){
					page.cbAgency=$("#cbAgency").ufmaTreecombox2({
						data:result.data
					});
					var agyCode = $.inArrayJson(result.data,"id",svData.svAgencyCode);
			    	if(!$.isNull(agyCode)){
			   			page.cbAgency.val(svData.svAgencyCode);
			   		}else{
			   			page.cbAgency.val(result.data[0].id);
			   		}
				});
				
			},
			
			searchData:function(){
				if($(".searchVou").length >0){
					if($("#vouBox .vbStatus li").length==0){
						serachData.vouStatus="O";
					}
					
					//第一行
					if($("#vouBox .vbAccaCode:hidden").get(0)){
						serachData.accaCode = "";
					}else{
						serachData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					}
					serachData.startVouDate=$('#vbStartVouDate').val();
					serachData.endVouDate=$('#vbEndVouDate').val();
					
					//第二行
					if($('#vbVouTypeCode option').length==0){
						serachData.vouTypeCode="";
					}else{
						serachData.vouTypeCode=$('#vbVouTypeCode option:selected').val();
					}
					serachData.startVouNo = $('#vbStartVouNo').val();
					serachData.endVouNo = $('#vbEndVouNo').val();
					if($('#vbStartStadAmt').val()==""){
						serachData.startStadAmt = null;
					}else{
						serachData.startStadAmt = Number($('#vbStartStadAmt').val());
					}
					if($('#vbEndStadAmt').val()==""){
						serachData.endStadAmt = null;
					}else{
						serachData.endStadAmt = Number($('#vbEndStadAmt').val());
					}
					
					//会计科目
					if($('#vbAcco_input').val()==""||page.acco==undefined){
						serachData.accoCode = "";
					}else{
						serachData.accoCode = page.acco.getValue();
					}
					
					//第三行
					serachData.inputorName=rpt.vbInputor.getValue();
					serachData.remark=$('#vbRemark').val();
					serachData.printCount=$('#vouBox #vbPrintStatus button.btn-primary').val();
					serachData.errFlag=$('#vouBox #vbErrFlag button.btn-primary').val();
					serachData.vouSource = $('#vouSource').getObj().getValue();
					//执行此方法时，如果为不分页赋值0；如果分页，当前页默认第1页
					//分页判断分页大小元素存在时，重新赋值(数据未加载的时候分页大小元素不存在，避免因此自动变成不分页)
					if($(".ufma-table-paginate").find(".vbPageSize").length!=0){
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						if($(".ufma-table-paginate").find(".vbPageSize").val()==0){
							serachData.currentPage = 0;
						}else{
							serachData.currentPage = 1;
						}
					}
					$(".vbDataSum").html("");
					$("#vouBoxTable tbody").html('');
					$(".ufma-tool-btns").html('');
					$(".ufma-table-paginate").html("");
					//取账套信息begin
					var acctCodeStr = $("#cbAcct").getObj().getValue();
					if(acctCodeStr=='' || acctCodeStr=='0'){
						acctCodeStr='*';
					}else{
						acctArray = acctCodeStr.split(',');
						if(acctArray[0] == '0'){
							acctArray[0] = '*';
						}
						acctCodeStr = acctArray.join(',');
					}
					//取账套信息end
					serachData.acctCode = acctCodeStr;
					
					ufma.post("/gl/vouBox/searchMaVous",serachData,this.initVouBoxTable);
				}
			},
            initVouTypeRed:function(result){
                var data = result.data;
                //循环把option填入select
                var $vouTypeOp = '';
                for(var i=0;i<data.length;i++){
                    //创建凭证类型option节点
                    $vouTypeOp += '<option value="'+data[i].code+'">'+data[i].name+'</option>';
                }
                $('#vbrvVouType').html($vouTypeOp);
                page.editor = ufma.showModal('vouBoxRedVoucher', 400, 300);
				page.setDayInDay2();
            },
            setDayInDay2:function(){
//              var mydate = new Date();
//              Year=mydate.getFullYear();
//              Month=(mydate.getMonth()+1);
//              Month = Month<10?('0'+Month):Month;
//              Day=mydate.getDate();
//              Day = Day<10?('0'+Day):Day;
//              $('#vbrvVouDate').val(Year+'-'+Month+'-'+Day);
				$('#vbrvVouDate').val(page.svTransDate);
			},
			//获取凭证来源
			getVouResource: function () {
				ufma.ajaxDef('/gl/enumerate/VOU_SOURCE', "get", "", function (result) {
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
						onChange: function (data) {

						},
						onComplete: function (sender) {
							$(".uf-combox-input").attr("autocomplete", "off");
						}
					});
					$("#vouSource").getObj().load(result.data);
					if ($.isNull($("#vouSource").getObj().getValue())) {
						$("#vouSource").getObj().val("*");
					}
				})
			},
			getVouvbInputor: function () {
				ufma.ajaxDef('/gl/vouBox/getInputorNames', "get", {"agencyCode": serachData.agencyCode,"acctCode":"*"}, function (result) {
					var obj = {
						code: "",
						name: ""
					};
					for(var i=0;i<result.data.length;i++){
						for(var z in result.data[i]){
							result.data[i].code=result.data[i][z]
							result.data[i].name=result.data[i][z]
						}
					}
					result.data.unshift(obj);
					//凭证来源
					rpt.vbInputor = $("#vbInputor").ufmaCombox2({
						valueField: 'code',
						textField: 'name',
						readOnly: true,
						data:result.data,
						placeholder: '请选择制单人',
						onchange: function (data) {
							if(rpt.vbInputor.getValue() == user){
								$("#vbShowOwn").attr('checked',true).prop('checked',true)
							}else{
								$("#vbShowOwn").attr('checked',false).prop('checked',false)
							}
						},
						onComplete: function (sender) {
							$(".uf-combox-input").attr("autocomplete", "off");
						}
					});
					$('#vbInputor').find('.ufma-combox-border').css('border','')
					// rpt.vbInputor.load(result.data);
					if ($.isNull(rpt.vbInputor.getValue())) {
						rpt.vbInputor.val("");
					}
					$("#vbInputor_btn").addClass('uf-combox-btn')
					if(!$.isNull(serachData.inputorName)){
						rpt.vbInputor.val(serachData.inputorName)
					}
				})
			},
			onEventListener: function(){
				//点击表格行内的打印按钮
				$("#vouBoxTable").on("click", ".vb-print-one", function () {
					var acctCodeStr = $("#cbAcct").getObj().getValue();
                	var acctList = acctCodeStr.split(',');
                	if((acctList.length==1 && acctList[0]=='0')||(acctList.length==2 && acctList[0]!='0')||acctList.length>2){
                		ufma.showTip('此凭证打印只能选择单一账套！',function(){},'warning');
                		return false;
                	}
					//清除缓存
					ufma.removeCache("iWantToPrint");
					var printCache = {};
					printCache.agencyCode = serachData.agencyCode;
					printCache.acctCode = acctCodeStr;
					printCache.componentId = "GL_VOU";
					var ajaxdata = {
						agencyCode: serachData.agencyCode,
						acctCode: acctCodeStr,
						componentId: 'GL_VOU'
					}
					var postSetData = {
						agencyCode: serachData.agencyCode,
						acctCode: acctCodeStr,
						componentId: "GL_VOU",
						rgCode: svData.svRgCode,
						setYear: svData.svSetYear,
						sys: '100',
						directory: '打印凭证'
					};
					var reportCode = ''
					var templId = ''
					var _this= $(this)
					var Nowdata = {
						"agencyCode": serachData.agencyCode,
						"acctCode": acctCodeStr,
						"componentId": "GL_VOU"
					}
					ufma.ajaxDef("/gl/vouPrint/getPrtTmplPdfNew", 'post', Nowdata, function(data) {
							reportCode = data.data[0].tmplCode
							templId =  data.data[0].formattmplCode
							printCache.tmplCode =  data.data[0].tmplCode
							printCache.formatTmplCode =  data.data[0].formattmplCode
					})
					ufma.showloading('正在打印，请耐心等待...');
					printCache.vouGuids = [];
					var vouGuid = _this.parents("tr.vouHead").find(".vbGuid").val();
					printCache.vouGuids.push(vouGuid);
					var guidArr =printCache.vouGuids
					var lpdata;
					if(isprintlp){
						ufma.ajaxDef("/gl/vou/selectBillListByVouGuids", 'post', printCache.vouGuids, function(data) {
							lpdata = {}
							for(var i=0;i<data.data.length;i++){
								for(var z in data.data[i]){
									lpdata[z]=data.data[i][z]
								}
								
							}
						})
					}
					var callback = function(result) {
						var voudata = []
						for(var i = 0; i < result.data.data.length; i++) {
							if(isprintlp){
								var now = [{}]
								if(lpdata[guidArr[i]]!=undefined){
									now=[lpdata[guidArr[i]]]
								}
								voudata.push({
									'gl_voucher_ds1': result.data.data[i],
									"lp_bill_info":now
								})
							}else{
								voudata.push({
									'gl_voucher_ds1': result.data.data[i],
									"lp_bill_info":[{}]
								})
							}
						}
						var pData = JSON.stringify(voudata);
						getPdf(reportCode, templId, pData)
					}
					ufma.post("/gl/vouPrint/getPrtDataPdf", printCache, callback);
					ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
						vouGuids: printCache.vouGuids
					}, function(data) {});
				});
				//点击打印pdf
				$("#vouBox").on("click", "#btn-print-previewpdf,#vb-print-more,#btn-print-preview,.table-sub-action .btn-print", function () {
					var acctCodeStr = $("#cbAcct").getObj().getValue();
                	var acctList = acctCodeStr.split(',');
                	if((acctList.length==1 && acctList[0]=='0')||(acctList.length==2 && acctList[0]!='0')||acctList.length>2){
                		ufma.showTip('此凭证打印只能选择单一账套！',function(){},'warning');
                		return false;
                	}
					//清除缓存
					ufma.removeCache("iWantToPrint");
					var printCache = {};
					printCache.agencyCode = serachData.agencyCode;
					printCache.acctCode = acctCodeStr;
					printCache.componentId = "GL_VOU";
					var ajaxdata = {
						agencyCode: serachData.agencyCode,
						acctCode: acctCodeStr,
						componentId: 'GL_VOU'
					}
					var postSetData = {
						agencyCode: serachData.agencyCode,
						acctCode: acctCodeStr,
						componentId: "GL_VOU",
						rgCode: svData.svRgCode,
						setYear: svData.svSetYear,
						sys: '100',
						directory: '打印凭证'
					};
					var reportCode = ''
					var templId = ''
					var Nowdata = {
						"agencyCode": serachData.agencyCode,
						"acctCode": acctCodeStr,
						"componentId": "GL_VOU"
					}
					ufma.ajaxDef("/gl/vouPrint/getPrtTmplPdfNew", 'post', Nowdata, function(data) {
							reportCode = data.data[0].tmplCode
							templId =  data.data[0].formattmplCode
							printCache.tmplCode =  data.data[0].tmplCode
							printCache.formatTmplCode =  data.data[0].formattmplCode
					})
					ufma.showloading('正在打印，请耐心等待...');
					if ($("#vouBoxTable tbody .vouHead.selected").get(0)) {
						//有勾选
						printCache.vouGuids = [];
						//遍历表格内勾选的行
						$("#vouBoxTable tbody .vouHead.selected").each(function () {
							var vouGuid = $(this).find(".vbGuid").val();
							printCache.vouGuids.push(vouGuid);
						});
					} else {
						//没勾选
						printCache.vouGuids = [];
						$("#vouBoxTable tbody .vouHead").each(function () {
							var vouGuid = $(this).find(".vbGuid").val();
							printCache.vouGuids.push(vouGuid);
						});
					}
					var guidArr =printCache.vouGuids
					var lpdata;
					if(isprintlp){
						ufma.ajaxDef("/gl/vou/selectBillListByVouGuids", 'post', guidArr, function(data) {
							lpdata = {}
							for(var i=0;i<data.data.length;i++){
								for(var z in data.data[i]){
									lpdata[z]=data.data[i][z]
								}
								
							}
						})
					}
					var callback = function(result) {
						var voudata = []
						for(var i = 0; i < result.data.data.length; i++) {
							if(isprintlp){
								var now = [{}]
								if(lpdata[guidArr[i]]!=undefined){
									now=[lpdata[guidArr[i]]]
								}
								voudata.push({
									'gl_voucher_ds1': result.data.data[i],
									"lp_bill_info":now
								})
							}else{
								voudata.push({
									'gl_voucher_ds1': result.data.data[i],
									"lp_bill_info":[{}]
								})
							}
						}
						var pData = JSON.stringify(voudata);
						getPdf(reportCode, templId, pData)
						ufma.hideloading();
					}
					if($("#vouBoxTable tbody .vouHead.selected").get(0)) {
						ufma.post("/gl/vouPrint/getPrtDataPdf", printCache, callback);
						ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
							vouGuids: printCache.vouGuids
						}, function(data) {});
					}else{
						ufma.confirm('未勾选打印凭证，是否打印当前页所有凭证', function(action) {
							if(action){
								ufma.post("/gl/vouPrint/getPrtDataPdf", printCache, callback);
								ufma.post("/gl/vouPrint/updatePtintCountByGuid", {
									vouGuids: printCache.vouGuids
								}, function(data) {});
							}else{
								ufma.hideloading();
							}
						})
					}
				});
				//点击新增跳转凭证录入页面
				$("#vouBox").on("click","#btn-add",function(){
					ufma.removeCache("cacheData");
					//缓存数据
					var cacheData = {};
					cacheData.agencyCode = serachData.agencyCode;
					cacheData.acctCode = serachData.acctCode;
					cacheData.vouStatus = serachData.vouStatus;
					
					cacheData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					cacheData.startVouDate=$('#vbStartVouDate').val();
					cacheData.endVouDate=$('#vbEndVouDate').val();
					
					cacheData.vouTypeCode=$('#vbVouTypeCode option:selected').val();
					if($('#vbStartStadAmt').val()==""){
						cacheData.startStadAmt=0;
					}else{
						cacheData.startStadAmt=$('#vbStartStadAmt').val();
					}
					if($('#vbEndStadAmt').val()==""){
						cacheData.endStadAmt=0;
					}else{
						cacheData.endStadAmt=$('#vbEndStadAmt').val();
					}
					if($('#vbAcco_input').val()==""||page.acco==undefined){
						cacheData.accoCode = "";
					}else{
						cacheData.accoCode = page.acco.getValue();
					}
				
					cacheData.inputorName=rpt.vbInputor.getValue();
					cacheData.remark=$('#vbRemark').val();
					cacheData.printCount=$('#vouBox #vbPrintStatus button.btn-primary').val();
					cacheData.errFlag=$('#vouBox #vbErrFlag button.btn-primary').val();
					
					cacheData.setYear = serachData.setYear;
					cacheData.rgCode = serachData.rgCode;
					
					ufma.setObjectCache("cacheData",cacheData);
//					window.location.href = '../vou/index.html?dataFrom=vouBox&action=add';
					var baseUrl = page.saveruieId('/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=add');
					uf.openNewPage(page.isCrossDomain,$(this), 'openMenu', baseUrl, false, "凭证录入");
				});
				
				//点击更多
				$("#vouBox #vouBoxTable").on("click",".vb-more",function(){
					ufma.removeCache("cacheData");
					//缓存数据
					var cacheData = {};
					cacheData.agencyCode = serachData.agencyCode;
					cacheData.acctCode = $(this).attr('data-code');
					cacheData.vouStatus = serachData.vouStatus;
					cacheData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					cacheData.startVouDate=$('#vbStartVouDate').val();
					cacheData.endVouDate=$('#vbEndVouDate').val();
					
					cacheData.vouTypeCode=$('#vbVouTypeCode option:selected').val();
					if($('#vbStartStadAmt').val()==""){
						cacheData.startStadAmt=0;
					}else{
						cacheData.startStadAmt=$('#vbStartStadAmt').val();
					}
					if($('#vbEndStadAmt').val()==""){
						cacheData.endStadAmt=0;
					}else{
						cacheData.endStadAmt=$('#vbEndStadAmt').val();
					}
					if($('#vbAcco_input').val()==""||page.acco==undefined){
						cacheData.accoCode = "";
					}else{
						cacheData.accoCode = page.acco.getValue();
					}
				
					cacheData.inputorName=rpt.vbInputor.getValue();
					cacheData.remark=$('#vbRemark').val();
					cacheData.printCount=$('#vouBox #vbPrintStatus button.btn-primary').val();
					cacheData.errFlag=$('#vouBox #vbErrFlag button.btn-primary').val();
					
					cacheData.setYear = serachData.setYear;
					cacheData.rgCode = serachData.rgCode;
					var vouAccaCode = $(this).parents(".vB-more-style").find("input[type='hidden']").attr("data-acca");
					var isbigvou =$(this).parents(".vB-more-style").find("input[type='hidden']").attr('data-isBigVou');
					var vouGuid = $(this).parents(".vB-more-style").find("input[type='hidden']").val();
					ufma.setObjectCache("cacheData",cacheData);
					if(isbigvou != '1'){
						var baseUrl = page.saveruieId('/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=query&vouGuid=' + vouGuid + '&vouAccaCode=' + vouAccaCode);
						uf.openNewPage(page.isCrossDomain,$(this), 'openMenu',baseUrl, false, "凭证录入");
					}else{
						var baseUrl = page.saveruieId('/pf/gl/voubig/voubig.html?menuid=14a44be5-f2bf-4729-8bc7-702c01e3cfcf&dataFrom=vouBox&action=query&vouGuid=' + vouGuid + '&vouAccaCode=' + vouAccaCode);
						uf.openNewPage(page.isCrossDomain,$(this), 'openMenu',baseUrl, false, "凭证查看");
					}
				});
				
				//点击凭证头
				$("#vouBox #vouBoxTable").on("click","a.headInfo",function(){
					ufma.removeCache("cacheData");
					//缓存数据
					var cacheData = {};
					cacheData.agencyCode = serachData.agencyCode;
					cacheData.acctCode = $(this).parents('.vouHead').find('.vbvouaccCode').attr('data-code');
					cacheData.vouStatus = serachData.vouStatus;
					
					cacheData.accaCode = $("#vouBox .vbAccaCode button.btn-primary").val();
					cacheData.startVouDate=$('#vbStartVouDate').val();
					cacheData.endVouDate=$('#vbEndVouDate').val();
					
					cacheData.vouTypeCode=$('#vbVouTypeCode option:selected').val();
					if($('#vbStartStadAmt').val()==""){
						cacheData.startStadAmt=0;
					}else{
						cacheData.startStadAmt=$('#vbStartStadAmt').val();
					}
					if($('#vbEndStadAmt').val()==""){
						cacheData.endStadAmt=0;
					}else{
						cacheData.endStadAmt=$('#vbEndStadAmt').val();
					}
					if($('#vbAcco_input').val()==""||page.acco==undefined){
						cacheData.accoCode = "";
					}else{
						cacheData.accoCode = page.acco.getValue();
					}
				
					cacheData.inputorName=rpt.vbInputor.getValue();
					cacheData.remark=$('#vbRemark').val();
					cacheData.printCount=$('#vouBox #vbPrintStatus button.btn-primary').val();
					cacheData.errFlag=$('#vouBox #vbErrFlag button.btn-primary').val();
					
					cacheData.setYear = serachData.setYear;
					cacheData.rgCode = serachData.rgCode;
					var vouAccaCode = $(this).parents("tr.vouHead").find("input.vbPerd").attr("data-acca");
					var isbigvou =$(this).parents(".vB-more-style").find("input[type='hidden']").attr('data-isBigVou');
					
					var vouGuid = $(this).parents("tr.vouHead").find("input.vbGuid").val();
					
					ufma.setObjectCache("cacheData",cacheData);
//					window.location.href = '../vou/index.html?dataFrom=vouBox&action=query&vouGuid='+vouGuid;
					if(isbigvou != '1'){
						var baseUrl = page.saveruieId('/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=query&vouGuid=' + vouGuid + '&vouAccaCode=' + vouAccaCode);
						uf.openNewPage(page.isCrossDomain,$(this), 'openMenu',baseUrl, false, "凭证录入");
					}else{
						var baseUrl = page.saveruieId('/pf/gl/voubig/voubig.html?menuid=14a44be5-f2bf-4729-8bc7-702c01e3cfcf&dataFrom=vouBox&action=query&vouGuid=' + vouGuid + '&vouAccaCode=' + vouAccaCode);
						uf.openNewPage(page.isCrossDomain,$(this), 'openMenu',baseUrl, false, "凭证查看");
					}
				});
				
				//按钮提示
//				$("[data-toggle='tooltip']").tooltip();
				
				//时间设置
				$(".vouTimes").find(".vouTimeYear").on("click",function(){
					//alert("111111");
					page.setDayInYear();
				});
				$(".vouTimes").find(".vouTimeMonth").on("click",function(){
					page.setDayInMonth();
				});
				$(".vouTimes").find(".vouTimeDay").on("click",function(){
					page.setDayInDay();
				});
				
				$("#vouBox").find('.searchVou').on('click',function(){
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
				$("#vouBox").find('.tip-more').on('click',function(){
					if($(this).find("i").text() == "更多"){
						$(this).find("i").text("收起");
						$(this).find("span").removeClass("icon-angle-bottom").addClass("icon-angle-top");
						$(".vou-query-box-bottom").slideDown(10, function () {
							ufma.setBarPos($(window));
						});
					}else{
						$(this).find("i").text("更多");
						$(this).find("span").removeClass("icon-angle-top").addClass("icon-angle-bottom");
						$(".vou-query-box-bottom").slideUp(10, function () {
							ufma.setBarPos($(window));
						});
					}
				});
				
				//点击仅显示自己编制的凭证，制单人输入用户名称同时不可录入
				$("#vbShowOwn").on("change",function(){
					if ($(this).prop("checked") === true) {
						rpt.vbInputor.val(user)
					} else {
						rpt.vbInputor.clear()
					}
				});
				
				//标签鼠标点击
				$("#vouBox .nav-tabs").on("click","li",function(){
					$("#vouBox .nav-tabs li").removeClass("active");
					$(this).addClass("active");
					$("#vbCheckAll").prop("checked",false);
					serachData.vouStatus=$(this).find("a").attr("data-status");
					page.searchData();
				});
				
				//点击会计体系按钮
				$("#vouBox .vbAccaCode").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				
				//点击期间按钮
				$("#vouBox .vouTimes").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				
				//点击打印状态按钮
				$("#vouBox #vbPrintStatus").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				//点击标错按钮
				$("#vouBox #vbErrFlag").on("click","button",function(){
					if(!$(this).hasClass("btn-primary")){
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				
				//金额输入框
				$("#vbStartStadAmt").on("blur",function(){
					var reg = /^\d+(\.\d+)?$/;
					var max = parseFloat($("#vbEndStadAmt").val());
					var val = parseFloat($(this).val());
					if($(this).val()==""){
						$(this).val("");
					}else if(!reg.test($(this).val())&&$(this).val()!=""){
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					}else if(max!=""&&val>max){
						$(this).val("");
						ufma.showTip("起始金额不得大于截止金额！");
					}else{
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				$("#vbEndStadAmt").on("blur",function(){
					var reg = /^\d+(\.\d+)?$/;
					var min = parseFloat($("#vbStartStadAmt").val());
					var val = parseFloat($(this).val());
					if($(this).val()==""){
						$(this).val("");
					}else if(!reg.test($(this).val())&&$(this).val()!=""){
						$(this).val("");
						ufma.showTip("请输入正确的金额，谢谢！");
					}else if(min!=""&&val<min){
						$(this).val("");
						ufma.showTip("截止金额不得小于起始金额！");
					}else{
						val = parseFloat(val.toFixed(2));
						$(this).val(val);
					}
				});
				
				//绑定日历控件
				$("#vouBox").find("#vbStartVouDate").datetimepicker({
				    format: 'yyyy-mm-dd',
			        autoclose: true,
			        todayBtn: true,
			        startView: 'month',
			        minView:'month',
			        maxView:'decade',
			        language: 'zh-CN'
				});
				$("#vouBox").find("#vbEndVouDate").datetimepicker({
				    format: 'yyyy-mm-dd',
			        autoclose: true,
			        todayBtn: true,
			        startView: 'month',
			        minView:'month',
			        maxView:'decade',
			        language:'zh-CN'
				});
				
				//选中单条凭证数据
				$("#vouBoxTable").find("tbody").on("click",'tr input[name="checkList"]',function () {
	            	var $tr = $(this).parents("tr");
	            	$tr.toggleClass("selected").nextUntil("tr.vouHead").toggleClass("selected");
	            	var $tmp = $("[name=checkList]:checkbox");
	           		$("#vbCheckAll,.vbTable-toolbar-checkAll").prop("checked", $tmp.length == $tmp.filter(":checked").length);
	           		page.selmoneySum()
	      		});
				
				//checkbox全选
				$("#vouBox").on("click","#vbCheckAll,.vbTable-toolbar-checkAll", function() {
					if($(this).prop("checked") === true) {
						$("#vbCheckAll,.vbTable-toolbar-checkAll").prop("checked", $(this).prop("checked"));
						$("#vouBoxTable").find("input[name='checkList']").prop("checked", $(this).prop("checked"));
						$("#vouBoxTable").find("tbody tr").addClass("selected").nextUntil("tr.vouHead").addClass("selected");
					} else {
						$("#vbCheckAll,.vbTable-toolbar-checkAll").prop("checked", false);
						$("#vouBoxTable").find("input[name='checkList']").prop("checked", false);
						$("#vouBoxTable").find("tbody tr").removeClass("selected").nextUntil("tr.vouHead").removeClass("selected");
					}
	           		page.selmoneySum()
				});
				
				//单行操作********************
				//点击单行审核操作
				$("#vouBoxTable").on("click",".vb-audit-one",function(){
					page.vbActOne("/gl/vouBox/auditVous",$(this));
				});
				//点击单行作废操作
/*				$("#vouBoxTable").on("click",".vb-invalid-one",function(){
					page.vbActOne("/gl/vouBox/invalidVous",$(this));
				});*/
				//点击单行记账操作
				$("#vouBoxTable").on("click",".vb-accounting-one",function(){
					page.vbActOne("/gl/vouBox/accountingVous",$(this));
				});
				$("#vouBoxTable").on("click", ".vb-unaccounting-one", function () {
					page.vbActOne("/gl/vouBox/unpostVous", $(this));
				});
				//点击单行销审操作
				$("#vouBoxTable").on("click",".vb-cancelaudit-one",function(){
					page.vbActOne("/gl/vouBox/cancelAuditVous",$(this));
				});
				//点击单行删除操作
/*				$("#vouBoxTable").on("click",".vb-delete-one",function(){
					page.vbActOne("/gl/vouBox/deleteVous",$(this));
				});*/
				//点击单行还原操作
				$("#vouBoxTable").on("click",".vb-reduction-one",function(){
					page.vbActOne("/gl/vouBox/reductionVous",$(this));
				});
				
				//点击单行冲红
				$("#vouBoxTable").on("click",".vb-red-one",function(){
					page.red = {
						vouGuid:$(this).parents("tr.vouHead").find("input.vbGuid").val(),
						agencyCode:serachData.agencyCode,
						setYear:serachData.setYear
					}
                    //加载凭证类型
                    var redcode = $(this).parents('tr').find('.vbvouaccCode').attr('data-code')
                    ufma.get("/gl/eleVouType/getVouType/" + serachData.agencyCode + "/" + serachData.setYear + "/" + redcode + "/" + '*',"",page.initVouTypeRed);

				});
				
				//批量操作********************
				//点击批量审核操作
				$("#vbTable-tool-bar").on("click","#vb-audit-more",function(){
					page.vbActMore("/gl/vouBox/auditVous");
				});
				//点击批量作废操作
				$("#vbTable-tool-bar").on("click","#vb-invalid-more",function(){
					ufma.confirm("确定作废选中的凭证吗？",function(action){
						if(action){
							page.vbActMore("/gl/vouBox/invalidVous");
						}
					});
				});
				$("#vbTable-tool-bar").on("click", "#vb-unaccounting-more", function () {
					page.vbActMore("/gl/vouBox/unpostVous");
				});
				//点击批量记账操作
				$("#vbTable-tool-bar").on("click","#vb-accounting-more",function(){
					page.vbActMore("/gl/vouBox/accountingVous");
				});
				//点击批量销审操作
				$("#vbTable-tool-bar").on("click","#vb-cancelaudit-more",function(){
					page.vbActMore("/gl/vouBox/cancelAuditVous");
				});
				//点击批量删除操作
				$("#vbTable-tool-bar").on("click","#vb-delete-more",function(){
					ufma.confirm("确定删除选中的凭证吗？",function(action){
						if(action){
							page.vbActMore("/gl/vouBox/deleteVous");
						}
					});
				});
				//点击批量还原操作
				$("#vbTable-tool-bar").on("click","#vb-reduction-more",function(){
					page.vbActMore("/gl/vouBox/reductionVous");
				});
				
				//分页尺寸下拉发生改变
				$(".ufma-table-paginate").on("change",".vbPageSize",function(){
					page.searchData();
				});
				
				//点击页数按钮
				$(".ufma-table-paginate").on("click",".vbNumPage",function(){
					if($(this).find("a").length!=0){
						serachData.currentPage = $(this).find("a").attr("data-gopage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						//page.searchData();
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
						page.searchData();
					}
				});
				
				//点击上一页
				$(".ufma-table-paginate").on("click",".vbPrevPage",function(){
					if(!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")){
						serachData.currentPage = $(this).find("a").attr("data-prevpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						//page.searchData();
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
						page.searchData();
					}
				});
				
				//点击下一页
				$(".ufma-table-paginate").on("click",".vbNextPage",function(){
					if(!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")){
						serachData.currentPage = $(this).find("a").attr("data-nextpage");
						serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
						//page.searchData();
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
						page.searchData();
					}
				});
				
				//跳转页面
				$(".ufma-table-paginate").on("blur","#vbGoPage",function(){
					var val = $(this).val();
					if(!isNaN($("#vbGoPage").val())&&$(".ufma-table-paginate #vbGoPage").val()<=$(".ufma-table-paginate .vbNumPage").length){
						$(this).val(val);
					}else{
						$(this).val("");
						ufma.showTip("请输入正确的页码，谢谢！");
					}
				});
				$(".ufma-table-paginate").on("click","#vb-go-btn",function(){
					serachData.currentPage = $(".ufma-table-paginate").find("#vbGoPage").val();
					serachData.pageSize = $(".ufma-table-paginate").find(".vbPageSize").val();
					$(".vbDataSum").html("");
					$("#vouBoxTable tbody").html('');
					$(".ufma-tool-btns").html('');
					$(".ufma-table-paginate").html("");
					//ufma.post("/gl/vouBox/searchVous",serachData,page.initVouBoxTable);
					page.searchData();
				});
                $("#vouBoxRedVoucher").find("#vbrvVouDate").datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    todayBtn: true,
                    startView: 'month',
                    minView:'month',
                    maxView:'decade',
                    language: 'zh-CN'
                });

                $('#vbStartVouDate').on("change", function() {
                    var dd=page.svTransDate
                    var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
                    var year = myDate.getFullYear();
                    var str = $(this).val();
                    var patt1 = new RegExp("^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)0229)$")
                    var patt2 = new RegExp("^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$")
                    if(patt1.test(str)) {
                        var startdate = $('#vbStartVouDate').val();
                        var enddate = $('#vbEndVouDate').val();
                        var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
                        var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
                        var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
                        if(days < 0) {
							ufma.showTip("日期区间不符", function() {}, "warning");
//							setTimeout(function(){
//								var mydate = new Date(svData.svTransDate);
//								Year=mydate.getFullYear();
//								Month=(mydate.getMonth()+1);
//								Month = Month<10?('0'+Month):Month;
//								Day=mydate.getDate();
//								$('#vbStartVouDate').val(Year+'-'+Month+'-01');
//							},100)
						}
                    } else if(patt2.test(str)) {
                        var startdate = $('#vbStartVouDate').val();
                        var enddate = $('#vbEndVouDate').val();
                        var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
                        var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
                        var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
                        if(days < 0) {
                        	ufma.showTip("日期区间不符", function() {}, "warning");
//							setTimeout(function(){
//								var mydate = new Date(svData.svTransDate);
//								Year=mydate.getFullYear();
//								Month=(mydate.getMonth()+1);
//								Month = Month<10?('0'+Month):Month;
//								Day=mydate.getDate();
//								$('#vbStartVouDate').val(Year+'-'+Month+'-01');
//							},100)
                        }
                    } else {
                        ufma.showTip("您输入的字符不符合规则", function() {}, "warning");
						var mydate = new Date(svData.svTransDate);
						var Year=mydate.getFullYear();
						var Month=(mydate.getMonth()+1);
						Month = Month<10?('0'+Month):Month;
						Day=mydate.getDate();
						$('#vbStartVouDate').val(Year+'-'+Month+'-01');
                    }

                })
				$('#vbEndVouDate').on("change", function() {
					var dd=page.svTransDate
					var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
					var year = myDate.getFullYear();
					var str = $(this).val();
					var patt1 = new RegExp("^(?:(?!0000)[0-9]{4}(?:(?:0[1-9]|1[0-2])(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])(?:29|30)|(?:0[13578]|1[02])31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)0229)$")
					var patt2 = new RegExp("^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$")
					if(patt1.test(str)) {
						var startdate = $('#vbStartVouDate').val();
						var enddate = $('#vbEndVouDate').val();
						var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
						var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
						var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
						if(days < 0) {
							ufma.showTip("日期区间不符", function() {}, "warning");
//							setTimeout(function(){
//								$('#vbEndVouDate').val($('#vbStartVouDate').val());
//							},100)
						}
					} else if(patt2.test(str)) {
						var startdate = $('#vbStartVouDate').val();
						var enddate = $('#vbEndVouDate').val();
						var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
						var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
						var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
						if(days < 0) {
							ufma.showTip("日期区间不符", function() {}, "warning");
//							setTimeout(function(){
//								$('#vbEndVouDate').val($('#vbStartVouDate').val());
//							},100)
						}
					} else {
						ufma.showTip("您输入的字符不符合规则", function() {}, "warning");
						$('#vbEndVouDate').val($('#vbStartVouDate').val());
					}

				})
                //点击保存
                $("#btn-save").click(function(){
                    var postData = {
                        vouGuid:page.red.vouGuid,
                        vouDate:$("#vouBoxRedVoucher #vbrvVouDate").val(),
                        vouType:$("#vouBoxRedVoucher #vbrvVouType option:selected").val(),
                    	ysvouType:''
					};
                    var callback = function(result){
                    	ufma.showTip(result.msg, function() {}, "success");
                        page.editor.close();
                    }
                    ufma.post("/gl/vou/redVoucher",postData,callback);
                });

                //点击取消
                $("#btn-qx").click(function(){
                    page.editor.close();
                });

				$(document).on("keydown", function(event){
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
							if($(".u-msg-cancel").hasClass("btn-primary")){
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
							if($(".u-msg-ok").hasClass("btn-primary")){
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
							if($(".u-msg-ok").hasClass("btn-primary")){
								$(".u-msg-ok").click();
							}else if($(".u-msg-cancel").hasClass("btn-primary")){
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
                	if(serachData.agencyCode == ''){
                		ufma.showTip('请选择单位！',function(){},'warning');
                		return false;
                	}
					var acctCodeStr = $("#cbAcct").getObj().getValue();
                  if(acctCodeStr == ''){
                		ufma.showTip('请选择账套！',function(){},'warning');
                		return false;
                	}    
                	var acctCodeStr = $("#cbAcct").getObj().getValue();
                	var acctList = acctCodeStr.split(',');
                	if((acctList.length==1 && acctList[0]=='0')||(acctList.length==2 && acctList[0]!='0')||acctList.length>2){
//              		ufma.showTip('凭证重排只能选择单一账套！',function(){},'warning');
//              		return false;
						 ufma.open({
	                        title: '凭证重排序',
	                        width: 1200,
	                        height: 500,
	                        url: '../sortVoucher/sortVoucherxi.html',
	                        data: {
	                            setYear: serachData.setYear,
	                            agencyCode: serachData.agencyCode,
	                            acctCode: $("#cbAcct").getObj().getValue(),
	                            acctName: $("#cbAcct").getObj().getText(),
								isDouble: '*'
	                        },
	                        destory: function(result) {
								if(result.action){
									$('.searchVou').trigger('click');
								}
	                        }
                    	});
                	}else{
	            		ufma.open({
	                        title: '凭证重排序',
	                        width: 900,
	                        height: 500,
	                        url: '../sortVoucher/sortVoucher.html',
	                        data: {
	                            setYear: serachData.setYear,
	                            agencyCode: serachData.agencyCode,
	                            acctCode: $("#cbAcct").getObj().getValue(),
								isDouble: '*'
	                        },
	                        destory: function(result) {
								if(result.action){
									$('.searchVou').trigger('click');
								}
	                        }
	                    });
                	}
                   
				});
				$('#btnSwitch').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptPlanList"
				});
				$("#vouisfullnamesingles").click(function (e) {
					$('#vouisfullnamesingle').removeAttr("checked");
					isaccfullname = false
					page.searchData();
					var data = {
				    "agencyCode":serachData.agencyCode,
				    "acctCode":serachData.acctCode,
				    "menuId":"5444eb79-d926-46f5-ae2b-2daf90ab8bcb",
				    "configKey":'vouisfullname',
				    "configValue":'0'
					}
					ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function(data) {})
				})
				$("#vouisfullnamesingle").click(function (e) {
					$('#vouisfullnamesingles').removeAttr("checked");
					isaccfullname = true
					page.searchData();
					var data = {
				    "agencyCode":serachData.agencyCode,
				    "acctCode":serachData.acctCode,
				    "menuId":"5444eb79-d926-46f5-ae2b-2daf90ab8bcb",
				    "configKey":'vouisfullname',
				    "configValue":'1'
					}
					ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function(data) {})
				})
			},
			
			//此方法必须保留
			init:function(){
                var pfData = ufma.getCommonData();
                page.svTransDate=pfData.svTransDate;
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
				var windowWidth = $(window).width();
		        if(windowWidth > 1600) {
		        	$('#vouBoxThead').addClass('bigpin').removeClass('xiaopin')
				} else {
		        	$('#vouBoxThead').addClass('xiaopin').removeClass('bigpin')
				}
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
	window.onresize = function(){
		var windowWidth = $(window).width();
        if(windowWidth > 1600) {
        	$('#vouBoxThead').addClass('bigpin').removeClass('xiaopin')
		} else {
        	$('#vouBoxThead').addClass('xiaopin').removeClass('bigpin')
		}
	}
/////////////////////
    page.init();
});