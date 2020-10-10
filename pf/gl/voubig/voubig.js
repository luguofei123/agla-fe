$(function () {
	var searchData = {
		pageSize:50,
		currentPage:1,
		descpt:'',
		accoCode:'',
		startAmt:'',
		endAmt:''
	}
	var searchAssData = {
		pageSize:50,
		currentPage:1,
		descpt:'',
		accoCode:'',
		startAmt:'',
		endAmt:''
	}
	var noAccItemArr={
		expireDate:'到期日',
		billNo:'票据号',
		price:'单价',
		qty:'数量',
		exRate:'汇率',
		billDate:'票据日期',
		billType:'票据类型',
		remark:'摘要',
		bussDate:'往来日期',
		currAmt:'外币金额',
		billType:'票据类型',
		curCode:'币种'
	}
	var  hex_md5svUserCode = ''
	if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
		hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
	}
	var posturl ={
		'getVoudetail':'/gl/bigvou/getVouDetails/',
		'getVoudetailAss':'/gl/bigvou/getVouDetailAsss/',
		'upVoudetail':'/gl/bigvou/updateVouDetails',
		'upVoudetailAss':'/gl/bigvou/updateVouDetailAsss'
	}
	var vouGuid ;
	var page = function () {
		return {
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
			tf:function(str) {
				var newStr = str.toLowerCase();
				var endStr = "";
				if(newStr.indexOf("_") != "-1") {
					var arr = newStr.split("_");
					for(var i = 1; i < arr.length; i++) {
						arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
					}
					endStr = arr.join("")
				} else {
					endStr = newStr
				}
				return endStr;
			},
			formatNum:function(str) {
				var newStr = "";
				var count = 0;
				str = str.toString();
				if(str.indexOf("-") == -1) {
			
					if(str == "") {
						str = "0.00"
						return str
					} else if(isNaN(str)) {
						str = "0.00"
						return str
					} else if(str.indexOf(".") == -1) {
						for(var i = str.length - 1; i >= 0; i--) {
							if(count % 3 == 0 && count != 0) {
								newStr = str.charAt(i) + "," + newStr;
							} else {
								newStr = str.charAt(i) + newStr;
							}
							count++;
						}
						str = newStr + ".00"; //自动补小数点后两位
						return str
					} else {
						for(var i = str.indexOf(".") - 1; i >= 0; i--) {
							if(count % 3 == 0 && count != 0) {
								newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
							} else {
								newStr = str.charAt(i) + newStr; //逐个字符相接起来
							}
							count++;
						}
						str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
						return str
					}
				} else {
					str = str = str.replace("-", "");
					if(str == "") {
						str = "0.00"
						return str
					} else if(isNaN(str)) {
						str = "0.00"
						return str
					} else if(str.indexOf(".") == -1) {
						for(var i = str.length - 1; i >= 0; i--) {
							if(count % 3 == 0 && count != 0) {
								newStr = str.charAt(i) + "," + newStr;
							} else {
								newStr = str.charAt(i) + newStr;
							}
							count++;
						}
						str = newStr + ".00"; //自动补小数点后两位
						return "-" + str
					} else {
						for(var i = str.indexOf(".") - 1; i >= 0; i--) {
							if(count % 3 == 0 && count != 0) {
								newStr = str.charAt(i) + "," + newStr; //碰到3的倍数则加上“,”号
							} else {
								newStr = str.charAt(i) + newStr; //逐个字符相接起来
							}
							count++;
						}
						str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
						return "-" + str
					}
				}
			},
			titles:function(){
				var seda = {
					pageSize:1,
					currentPage:1,
					descpt:'',
					accoCode:'',
					startAmt:'',
					endAmt:''
				}
				ufma.ajaxDef('/gl/vou/getVou/'+vouGuid,'get',seda, function(result){
					var titles =''
					if(result.data[0]!=null){
						page.datanow  = result.data[0]
					}
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						valueField: "id",
						textField: "codeName", 
						readonly: false,
						placeholder: "请选择单位",
						data: [{"id":page.datanow.agencyCode,"codeName":page.datanow.agencyCode +' '+page.datanow.agencyName}],
						icon: "icon-unit",
						onchange: function (data) {
						}
					});
					page.cbAcct = $("#cbAcct").ufmaCombox2({
						valueField: 'id',
						textField: 'codeName',
						placeholder: '请选择账套',
						data: [{"id":page.datanow.acctCode,"codeName":page.datanow.acctCode +' '+page.datanow.acctName}],
						icon: 'icon-book',
						onchange: function (data) {
						}
					});
					page.cbAgency.val(page.datanow.agencyCode)
					page.cbAcct.val(page.datanow.acctCode)
					titles+=' <span class="vouSource">'+ page.datanow.vouSourceName +'</span><span>凭证号：</span><span class="voutye">'+ page.datanow.vouTypeName +'</span>'
					titles+='<span class="vouNo">'+ page.datanow.vouNo + '</span><span>凭证日期：</span><span class="vouDate">'+ page.datanow.vouDate + '</span>'
					titles+='<span class="titlevou">记账凭证</span><span id="pzzhuantai"></span>'
					$(".titleagencyacct").html(titles)
					$("#fjd").html(page.datanow.vouCnt)
					if(page.datanow.vouStatus == "O") {
						$("#pzzhuantai").show();
						$("#pzzhuantai").css("background", "#00A553");
						$("#pzzhuantai").text("未审核").attr("vou-status", page.datanow.vouStatus);
					} else if(page.datanow.vouStatus == "A") {
						$("#pzzhuantai").show();
						$("#pzzhuantai").css("background", "#00A553");
						$("#pzzhuantai").text("已审核").attr("vou-status", page.datanow.vouStatus);
						$(".datesno").show()
					} else if(page.datanow.vouStatus == "C") {
						$("#pzzhuantai").show();
						$("#pzzhuantai").css("background", "#EE4033");
						$("#pzzhuantai").text("已作废").attr("vou-status", page.datanow.vouStatus);
						$(".datesno").show()
					} else if(page.datanow.vouStatus == "P") {
						$("#pzzhuantai").show();
						$("#pzzhuantai").css("background", "#00A553");
						$("#pzzhuantai").text("已记账").attr("vou-status", page.datanow.vouStatus);
						$(".datesno").show()
					} else {
						$("#pzzhuantai").hide().text("").removeAttr("vou-status");
					}
				});
			},
			delasstable:function(){
				$("#voubigtableasshead").css("top",0)
				$('#voubigtableasshead').css({'width':$('#voubigtableass').outerWidth()+'px'})
				$(".voudetailAssdiv").scrollTop(0)
				$("#voubigtableasshead").find('thead').html('')
				$("#voubigtableass").find('thead').html('')
				$("#voubigtableass").find('tbody').html('')
				$("#vbTable-tool-barAss .vbDataSum").html("");
				$("#vbTable-tool-barAss .ufma-tool-btns").html('');
				$("#vbTable-tool-barAss").find('.ufma-table-paginate').html("");
			},
			searchdata:function(){
				vouGuid =page.getUrlParam('vouGuid')
				searchData.descpt = $("#despct").val()
				if($("#stadAmtFrom").val()!=''){
					searchData.startAmt = parseFloat($("#stadAmtFrom").val())
				}else{
					searchData.startAmt = ''
				}
				if($("#stadAmtTo").val()!=''){
					searchData.endAmt = parseFloat($("#stadAmtTo").val())
				}else{
					searchData.endAmt = ''
				}
				searchData.accoCode = page.accotree.getValue()
				for(var i=0;i<$(".form-horizontal").find('.ufma-treecombox').length;i++){
					if($(".form-horizontal").find('.ufma-treecombox').eq(i).attr('id')!='vbAcco'){
						var ids = $(".form-horizontal").find('.ufma-treecombox').eq(i).attr('id')
						if($(".form-horizontal").find('.ufma-treecombox').eq(i).ufmaTreecombox().getValue()==''){
							delete searchData[ids]
						}else{
							searchData[ids] = $(".form-horizontal").find('.ufma-treecombox').eq(i).ufmaTreecombox().getValue()
						}
					}
				}
			},
			searchtable:function(result){
				var dataas = result.data.list
				var paging = {
					pageSize:searchData.pageSize,
					currentPage:searchData.currentPage,
					totalRows:result.data.total
				}
				page.rowtable(result.data.list)
				page.delasstable()
				page.ufmabar(paging)
			},
			searchtableAss:function(result){
				var assData = []
				var thisdata = result.data.list
				var codes = $('#voubigtable').find('.active').find('.acco').attr('data-accocode')
				for(var i=0;i<page.accitemOrderSeq.length;i++){
					if(page.accitemOrderSeq[i].accoCode == codes){
						assData  = page.accitemOrderSeq[i].accitemList
					}
				}
				if(page.acco[codes].expireDate == 1){
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"expireDate"
					})
				}
				if(page.acco[codes].showBill == 1){
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"billNo"
					})
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"billType"
					})
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"billDate"
					})
				}
				if(page.acco[codes].currency == 1){
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"curCode"
					})
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"exRate"
					})
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"currAmt"
					})
				}
				if(page.acco[codes].qty == 1){
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"price"
					})
					assData.push({
						"IS_SHOW":"1",
						"ACCITEM_CODE":"qty"
					})
				}
				var paging = {
					pageSize:searchAssData.pageSize,
					currentPage:searchAssData.currentPage,
					totalRows:result.data.total
				}
				if(thisdata.length>0){
					page.assTable(assData,thisdata)
					page.ufmabar(paging,'vbTable-tool-barAss')
				}else{
					page.delasstable()
				}
			},
			getass:function(){
				ufma.ajaxDef('/gl/vou/getVouWithAccitem/'+vouGuid,'get','',function(result){
					var useData=result.data
					var usedatalist = {}
					for(var i=0;i<useData.length;i++){
						var key = page.tf(useData[i])+'Code'
						usedatalist[key]=useData[i]
					}
					$.each(page.tablehead,function(i,value){
						if(usedatalist[i]!=undefined){
							var tr = ''
							tr+='<div class="form-group">'
							tr+='<label class="control-label">'+page.tablehead[i].ELE_NAME+'：</label>'
							tr+='<div class="control-element">'
							tr+='<div class="ufma-treecombox w324" id="'+usedatalist[i]+'_CODE"></div>'
							tr+='</div>'
							tr+='</div>'
							$(".form-horizontal").append(tr)
							$('#'+usedatalist[i]+'_CODE').ufmaTreecombox({
								valueField: "id",
								textField: "codeName", 
								readOnly: false,
								leafRequire: true,
								popupWidth: 1.5,
								data: page.fzhsxl[i],
								onchange: function (data) {
								}
							});
						}
					})
				})
			},
			getacco:function(){
				var url = '/gl/sys/coaAcc/getAccoTree/' + page.setYear + '?agencyCode=' + page.datanow.agencyCode + '&acctCode=' + page.datanow.acctCode;
				callback = function (result) {
					page.accotree = $("#vbAcco").ufmaTreecombox({
						valueField: "id",
						textField: "codeName", 
						readOnly: false,
						leafRequire: false,
						popupWidth: 1.5,
						data: result.data,
						onchange: function (data) {
						}
					});
				}
				ufma.ajaxDef(url,'get',{}, callback);
				var voudate = page.datanow.vouDate 
				var years = new Date(voudate).getFullYear()
				ufma.ajaxDef("/gl/vou/getAccoAndAccitem/"+ page.datanow.agencyCode + "/" + page.datanow.acctCode +"/"+page.datanow.vouTypeCode +"/" + years, "get", '', function(data) {
					page.tablehead = data.data.tableHead;
					page.fzhsxl = data.data.optionData;
					page.accitemOrderSeq = data.data.accitemOrder
					page.acco={}
					for(var i=0;i<data.data.accos.length;i++){
						page.acco[data.data.accos[i].accoCode] = data.data.accos[i]
					}
				})
				ufma.ajaxDef('/gl/eleCurrRate/getCurrType', "get", {
					"agencyCode": page.datanow.agencyCode
				}, function(result) {
					page.curCodefzhsxl = result.data
				})
				ufma.ajaxDef('/gl/vou/getEleBillType/'+ page.datanow.agencyCode, "get",'', function(data) {
					page.billfzhsxl = data.data
				})
			},
			ufmabar:function(paging,ids){
				var id ='vbTable-tool-bar'
				if(ids!=undefined){
					id=ids
				}
				if (paging.pageSize != 0) {
					//创建基本分页节点
					var $pageBase = $('<ul id="vbTable-pagination" class="pagination pagination-sm pull-left"></ul>');
					//创建上一页节点  根据当前也判断是否可以点
					var $pagePrev;
					if ((paging.currentPage - 1) == 0) {
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
					for (var k = 1; k <= pageAmount; k++) {
						//第一页和最后一页显示
						if (k == 1 || k == pageAmount) {
							//三元运算判断是否当前页
							$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
						} else {
							//判断分页页数除去第一页和最后一页按钮的剩下的按钮数量是否大余3
							if ((pageAmount - 2) <= 3) {
								//三元运算判断是否当前页
								$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
							} else if ((pageAmount - 2) > 3) {
								//判断当前页位置
								if (paging.currentPage <= 2) {
									//分页按钮加载2到4之间
									if (k >= 2 && k <= 4) {
										//三元运算判断是否当前页
										$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
									}
								} else if (paging.currentPage > 2 && paging.currentPage < (pageAmount - 1)) {
									//分页按钮加载currentPage-1到currentPage+1之间
									if (k >= (paging.currentPage - 1) && k <= (paging.currentPage + 1)) {
										//三元运算判断是否当前页
										$pageItem = (k == paging.currentPage) ? $('<li class="vbNumPage active"><span data-gopage=' + k + '>' + k + ' <span class="sr-only">(current)</span></span></li>') : $('<li class="vbNumPage"><a href="javascript:;" data-gopage=' + k + '>' + k + '</a></li>');
									}
								} else if (paging.currentPage >= (pageAmount - 1)) {
									//分页按钮加载pageAmount-3到pageAmount-1之间
									if (k >= (pageAmount - 3) && k <= (pageAmount - 1)) {
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
					if ((pageAmount - paging.currentPage) == 0) {
						$pageNext = $('<li class="vbNextPage disabled"><span><span aria-hidden="true" class="glyphicon icon-angle-right"></span></span></li>');
					} else {
						$pageNext = $('<li class="vbNextPage"><a href="javascript:;" aria-label="Next" data-nextpage=' + (paging.currentPage + 1) + '>' +
							'<span aria-hidden="true" class="glyphicon icon-angle-right"></span>' +
							'</a></li>');
					}
					$pageBase.append($pageNext);
					$("#"+id +" .ufma-table-paginate").html($pageBase);
				}
				//创建分页大小基本节点
				var $pageSizeBase = $('<div class="pull-left" style="margin: 0 16px;"></div>');
				var $pageSel = $('<select class="vbPageSize bordered-input"></select>');
				//根据pageSize创建下拉列表
				//分页数组
				var pageArr = [20, 50, 100, 200];
				var $pageOp;
				//定义是否不分页变量
				var isNoPaging;
				for (var n = 0; n < pageArr.length; n++) {
					isNoPaging = (pageArr[n] == 0) ? "不分页" : pageArr[n];
					if (pageArr[n] == paging.pageSize) {
						$pageOp = $('<option value=' + pageArr[n] + ' selected>' + isNoPaging + '</option>');
					} else {
						$pageOp = $('<option value=' + pageArr[n] + '>' + isNoPaging + '</option>');
					}
					$pageSel.append($pageOp);
				}
				$pageSizeBase.append("<span>显示 </span>");
				$pageSizeBase.append($pageSel);
				$pageSizeBase.append("<span> 条</span>");
				$("#"+id +" .ufma-table-paginate").prepend($pageSizeBase);

				//创建总数统计节点
				var $vouDataSum = $('<div class="pull-left">共 <span class="vbSum">' + paging.totalRows + '</span> 条</div>');
				$("#"+id +" .ufma-table-paginate").prepend($vouDataSum);
			},
			rowtable:function(datas){
				$("#voubigtablehead").css("top",0)
				$(".voudetailAccdiv").scrollTop(0)
				page.listdata=datas;
				var tr = ''
				if(datas!='' &&  datas.length>0){
					for(var i=0;i<datas.length;i++){
						if(page.acco[datas[i].accoCode]==undefined){
							page.acco[datas[i].accoCode]={'accoFullName':''}
						}
						if(datas[i].drCr == -1) {
							tr+='<tr><td class="despct">'+datas[i].descpt+'</td><td class="acco" data-title='+i+' data-accocode="'+datas[i].accoCode+'" data-accoName="'+page.acco[datas[i].accoCode].accoFullName+'">'+datas[i].accoCode+' '+page.acco[datas[i].accoCode].accoFullName+'</td>'
							tr+='<td class="amt"></td><td class="amt">'+page.formatNum(datas[i].stadAmt)+'</td></tr>'
						}else{
							tr+='<tr><td class="despct">'+datas[i].descpt+'</td><td class="acco" data-title='+i+' data-accocode="'+datas[i].accoCode+'" data-accoName="'+page.acco[datas[i].accoCode].accoFullName+'">'+datas[i].accoCode+' '+page.acco[datas[i].accoCode].accoFullName+'</td>'
							tr+='<td class="amt">'+page.formatNum(datas[i].stadAmt)+'</td><td class="amt"></td></tr>'
						}
					}
					$("#voubigtable").find("tbody").html(tr)
				}else{
					$("#voubigtable").find("tbody").html('')
				}
				// ufma.setBarPos($(window));
			},
			assTable:function(data,nowdata){
				$("#voubigtableasshead").css("top",0)
				$(".voudetailAssdiv").scrollTop(0)
				var codename = $('#voubigtable').find('.active').find('.acco').html()
				// var  th = '<tr><th><span class="colwidth">会计科目</span></th>'
				var  th = '<tr>'
				for(var i=0;i<data.length;i++){
					if(data[i].IS_SHOW == 1){
						var key = page.tf(data[i].ACCITEM_CODE)+'Code'
						if(page.tablehead[key]!=undefined){
							var name =page.tablehead[key].ELE_NAME
							th+='<th><span class="colwidth">'+name+'</span></th>'
						}else{
							th+='<th><span class="colwidth">'+noAccItemArr[data[i].ACCITEM_CODE]+'</span></th>'
						}
					}
				}
				th+="<th><span class='colwidth'>金额</span></th></tr>"
				$("#voubigtableasshead").find('thead').html(th)
				$("#voubigtableass").find('thead').html(th)
				var tr =''
					for(var j=0;j<nowdata.length;j++){
						tr += '<tr>'
						// tr += '<tr><td><span class="colwidth">'+codename+'</span></td>'
						for(var i=0;i<data.length;i++){
							if(data[i].IS_SHOW == 1){
								var key = page.tf(data[i].ACCITEM_CODE)+'Code'
								var datakey =nowdata[j][key]
								if(page.fzhsxl[key]!=undefined){
									for(var z=0;z<page.fzhsxl[key].length;z++){
										if(page.fzhsxl[key][z].id == datakey){
											tr+='<td><span class="colwidth">'+page.fzhsxl[key][z].codeName+'</span></td>'
										}
									}
								}else{
									if(noAccItemArr[data[i].ACCITEM_CODE] != undefined){
										if(data[i].ACCITEM_CODE=='billType'){
											var nowk = ''
											for(var z=0;z<page.billfzhsxl.length;z++){
												if(page.billfzhsxl[z].chrCode == nowdata[j][data[i].ACCITEM_CODE]){
													nowk='<td><span class="colwidth">'+page.billfzhsxl[z].chrCode+' '+page.billfzhsxl[z].chrName+'</span></td>'
												}
											}
											if(nowk==''){
												nowk ='<td><span class="colwidth"></span></td>'
											}
											tr+=nowk
										}else if(data[i].ACCITEM_CODE=='curCode'){
											var nowk = ''
											for(var z=0;z<page.curCodefzhsxl.length;z++){
												if(page.curCodefzhsxl[z].chrCode == nowdata[j][data[i].ACCITEM_CODE]){
													nowk='<td><span class="colwidth">'+page.curCodefzhsxl[z].chrCode+' '+page.curCodefzhsxl[z].chrName+'</span></td>'
												}
											}
											if(nowk==''){
												nowk ='<td><span class="colwidth"></span></td>'
											}
											tr+=nowk
										}else if(data[i].ACCITEM_CODE=='currAmt'){
											tr+='<td><span class="colwidth">'+page.formatNum(nowdata[j][data[i].ACCITEM_CODE])+'</span></td>'
										}else{
											tr+='<td><span class="colwidth">'+nowdata[j][data[i].ACCITEM_CODE]+'</span></td>'
										}
									}
								}
							}
						}
						tr+="<td class='amt'><span class='colwidth'>"+page.formatNum(nowdata[j].stadAmt)+"</span></td></tr>"
					}
				$("#voubigtableass").find('tbody').html(tr)
				$('#voubigtableasshead').css({'width':$('#voubigtableass').outerWidth()+'px'})
			},
			onEventListener: function () {
				$(".ufma-table-paginate").on("change", ".vbPageSize", function () {
					if($(this).parents('#vbTable-tool-bar').length>0){
						searchData.pageSize =  parseFloat($(this).find("option:selected").attr("value"))
						searchData.currentPage = 1
						$(".vbDataSum").html("");
						$("#vouBoxTable tbody").html('');
						$(".ufma-tool-btns").html('');
						$(".ufma-table-paginate").html("");
						page.searchdata()
						ufma.ajaxDef(posturl.getVoudetail+vouGuid,'get',searchData, page.searchtable);
					}else{
						searchAssData.pageSize =  parseFloat($(this).find("option:selected").attr("value"))
						searchAssData.currentPage = 1
						page.delasstable()
						var indexs = parseFloat($('#voubigtable').find('.active').find('.acco').attr('data-title'))
						var datas = page.listdata[indexs]
						ufma.ajaxDef(posturl.getVoudetailAss+vouGuid+'/'+page.listdata[indexs].detailGuid,'get',searchAssData,page.searchtableAss)
					}
				});
				$(".ufma-table-paginate").on("click", ".vbNumPage", function () {
					if($(this).parents('#vbTable-tool-bar').length>0){
						if ($(this).find("a").length != 0) {
							searchData.currentPage=parseFloat($(this).find("a").attr("data-gopage"))
							//page.searchData();
							page.searchdata()
							ufma.ajaxDef(posturl.getVoudetail+vouGuid,'get',searchData, page.searchtable);
						}
					}else{
						searchAssData.currentPage=parseFloat($(this).find("a").attr("data-gopage"))
						var indexs = parseFloat($('#voubigtable').find('.active').find('.acco').attr('data-title'))
						var datas = page.listdata[indexs]
						ufma.ajaxDef(posturl.getVoudetailAss+vouGuid+'/'+page.listdata[indexs].detailGuid,'get',searchAssData,page.searchtableAss)
					}
				});
				//点击上一页
				$(".ufma-table-paginate").on("click", ".vbPrevPage", function () {
					if($(this).parents('#vbTable-tool-bar').length>0){
						if (!$(".ufma-table-paginate .vbPrevPage").hasClass("disabled")) {
							searchData.currentPage=searchData.currentPage-1
							page.searchdata()
							ufma.ajaxDef(posturl.getVoudetail+vouGuid,'get',searchData, page.searchtable);
						}
					}else{
						searchAssData.currentPage=searchAssData.currentPage-1
						var indexs = parseFloat($('#voubigtable').find('.active').find('.acco').attr('data-title'))
						var datas = page.listdata[indexs]
						ufma.ajaxDef(posturl.getVoudetailAss+vouGuid+'/'+page.listdata[indexs].detailGuid,'get',searchAssData,page.searchtableAss)
					}
				});
				//点击下一页
				$(".ufma-table-paginate").on("click", ".vbNextPage", function () {
					if($(this).parents('#vbTable-tool-bar').length>0){
						if (!$(".ufma-table-paginate .vbNextPage").hasClass("disabled")) {
							searchData.currentPage=parseFloat(searchData.currentPage)+1
							page.searchdata()
							ufma.ajaxDef(posturl.getVoudetail+vouGuid,'get',searchData, page.searchtable);
						}
					}else{
						searchAssData.currentPage=parseFloat(searchAssData.currentPage)+1
						page.delasstable()
						var indexs = parseFloat($('#voubigtable').find('.active').find('.acco').attr('data-title'))
						var datas = page.listdata[indexs]
						ufma.ajaxDef(posturl.getVoudetailAss+vouGuid+'/'+page.listdata[indexs].detailGuid,'get',searchAssData,page.searchtableAss)

					}
				});
				$(".btn-search").on("click", function () {
					$("#despct").val(searchData.descpt)
					$("#stadAmtFrom").val(searchData.startAmt)
					$("#stadAmtTo").val(searchData.endAmt)
					page.accotree.val(searchData.accoCode)
					page.editor=ufma.showModal('vouassData', 1050, 500);
				});
				$(document).on("click", "#btn-vouassclose", function(){
					$("#despct").val(searchData.descpt)
					$("#stadAmtFrom").val(searchData.startAmt)
					$("#stadAmtTo").val(searchData.endAmt)
					page.accotree.val(searchData.accoCode)
					page.editor.close()
				})
				$(document).on("click", "#voubigtable tbody tr", function(){
					if($(this).hasClass('active')!=true){
						$(this).addClass('active').siblings().removeClass('active')
					}
					var indexs = parseFloat($(this).find('.acco').attr('data-title'))
					var datas = page.listdata[indexs]
					searchAssData.currentPage =1
					ufma.ajaxDef(posturl.getVoudetailAss+vouGuid+'/'+page.listdata[indexs].detailGuid,'get',searchAssData,page.searchtableAss);
				})
				$('.voudetailAccdiv').scroll(function(){
					$('#voubigtablehead').css({'top':$('.voudetailAccdiv').scrollTop()+'px'})
				});
				$('.voubigtableassdiv').scroll(function(){
					$('#voubigtableasshead').css({'top':$('.voubigtableassdiv').scrollTop()+'px'})
				});
				$("#btn-emty").on("click", function () {
					$("#despct").val('')
					$("#stadAmtFrom").val('')
					$("#stadAmtTo").val('')
					$("#vbAcco").find('.uf-combox-clear').trigger('click')
					for(var i=0;i<$(".form-horizontal").find('.ufma-treecombox').length;i++){
						$(".form-horizontal").find('.ufma-treecombox').eq(i).find('.uf-combox-clear').trigger('click')
					}
				});
				$(document).on("input","#stadAmtFrom,#stadAmtTo", function () {
					// if(isNaN(parseFloat($(this).val()))){
					// 	$(this).val('')
					// }
					var c = $(this);
					if(/[^\d.-]/.test(c.val())) { //替换非数字字符  
						var temp_amount = c.val().replace(/[^\d.-]/g, '');
						$(this).val(temp_amount);
					}
				});
				$(document).on("blur","#stadAmtFrom,#stadAmtTo", function () {
					if(!isNaN(parseFloat($(this).val()))){
						$(this).val(parseFloat($(this).val()).toFixed(2))
					}else{
						$(this).val('')
					}
				});
				$("#btn-qrsearch").on("click", function () {
					searchData.currentPage = 1
					page.searchdata()
					if(searchData.startAmt>searchData.endAmt && searchData.startAmt!='' && searchData.endAmt!=''){
						ufma.showTip('起始金额不能大于截止金额')
						return false
					}else if($("#stadAmtFrom").val()=='0' && searchData.endAmt<0){
						ufma.showTip('起始金额不能大于截止金额')
						return false
					}
					ufma.ajaxDef(posturl.getVoudetail+vouGuid,'get',searchData, page.searchtable);
					page.editor.close()
				});
				$(document).on("click", ".btn-upload", function () {
					$("#zezhao").show();
					$("#zezhao").html('<div class="yu">加载附件中，请稍候</div>');
					var vouGroupId = page.datanow.vouGroupId
					ufma.ajaxDef("/gl/file/getFileList/"+vouGroupId,'get','',function(data){
						var fileinputs = '';
						fileinputs += '<div id="vouAttachBox">'
						fileinputs += '<div class="u-msg-title">'
						fileinputs += '<p style="font-size:16px">凭证附件</p>'
						fileinputs += '<div class="attach-close icon-close"></div>'
						fileinputs += '</div>'
						fileinputs += '<div class="u-msg-content">'
						fileinputs += '<div class="attach-step1">'
						fileinputs += '<div class="attach-toolbar">'
						fileinputs += '<div class="attach-toolbar-tip">'
						fileinputs += '<p>附件数：共<input type="input" class="voucnt"> <span class="voucntnum">' +$("#fjd").html() + '</span> 张<span class="glyphicon icon-edit"></span>'
						fileinputs += '<span class="glyphicon icon-check"></span>'
						fileinputs += '<span class="glyphicon icon-close"></span></p>'
						fileinputs += '</div>'
						fileinputs += '<div class="attach-toolbar-btns">'
						fileinputs += '<button class="btn btn-primary" id="attachUploadBtn">上传</button>'
						fileinputs += '<button class="btn btn-primary" id="attachsaomiaoBtn">拍照</button>'
						fileinputs += '<button class="btn btn-primary" id="attachgaopaiyiBtn">扫描</button>'
						fileinputs += '</div>'
						fileinputs += '<div class="attach-clear"></div>'
						fileinputs += '</div>'
						fileinputs += '<div class="attach-show">'
						fileinputs += '<div class="attach-noData" style="display:none;">'
						fileinputs += '<img src="../../images/noData.png" />'
						fileinputs += '<p>目前还没有附件，请选择上传/扫描</p>'
						fileinputs += '</div>'
						fileinputs += '<ul class="attach-show-list">'
						for (var i = 0; i < data.data.length; i++) {
							fileinputs += '<li class="attach-show-li" names="' + data.data[i].attachGuid + '">'
							fileinputs += '<div class="attach-img-box">'
							if (data.data[i].fileFormat.toLowerCase() == ".txt") {
								fileinputs += '<img class="attach-img-file" src="img/txt.png" />'
							} else if (data.data[i].fileFormat.toLowerCase() == ".doc" || data.data[i].fileFormat.toLowerCase() == ".docx") {
								fileinputs += '<img class="attach-img-file" src="img/word.png" />'
							} else if (data.data[i].fileFormat.toLowerCase() == ".xlsx" || data.data[i].fileFormat.toLowerCase() == ".xls") {
								fileinputs += '<img class="attach-img-file" src="img/xls.png" />'
							} else if (data.data[i].fileFormat.toLowerCase() == ".ppt" || data.data[i].fileFormat.toLowerCase() == ".pptx") {
								fileinputs += '<img class="attach-img-file" src="img/ppt.png" />'
							} else if (data.data[i].fileFormat.toLowerCase() == ".pdf") {
								fileinputs += '<img class="attach-img-file" src="img/pdf.png" />'
							} else if (data.data[i].fileFormat.toLowerCase() == ".jpg" || data.data[i].fileFormat.toLowerCase() == ".png" || data.data[i].fileFormat.toLowerCase() == ".gif" || data.data[i].fileFormat.toLowerCase() == ".bmp" || data.data[i].fileFormat.toLowerCase() == ".jpeg") {
								fileinputs += '<img class="attach-img-file" src="/gl/file/download?attachGuid=' + data.data[i].attachGuid + '" />'
							} else if (data.data[i].fileFormat.toLowerCase() == ".rar" || data.data[i].fileFormat.toLowerCase() == ".zip" || data.data[i].fileFormat.toLowerCase() == ".7z") {
								fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
							} else {
								fileinputs += '<img class="attach-img-file" src="img/other.png" />'
							}
							fileinputs += '</div>'
							fileinputs += '<div class="attach-img-tip">'
							fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
							fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
							fileinputs += '<span class="attach-clear"></span>'
							fileinputs += '</div>'
							if (data.data[i].remark == null) {
								fileinputs += '<div class="attach-img-sub" title="' + i + '">暂无备注</div>'
							} else {
								fileinputs += '<div class="attach-img-sub" title="' + data.data[i].remark + '">' + data.data[i].remark + '</div>'
							}
							fileinputs += '<div class="attach-img-sub-edit">'
							fileinputs += '<input type="text" value="' + data.data[i].remark + '" />'
							fileinputs += '<span class="glyphicon icon-check"></span>'
							fileinputs += '</div>'
							fileinputs += '<div class="attach-img-btns">'
							fileinputs += '<span class="glyphicon icon-edit"></span>'
							fileinputs += '<span class="glyphicon icon-download"></span>'
							fileinputs += '<span class="glyphicon icon-trash"></span>'
							fileinputs += '</div>'
							fileinputs += '</li>'
						}
						fileinputs += '</ul>'
						fileinputs += '</div>'
						fileinputs += '</div>'
						fileinputs += '<div class="attach-step2">'
						fileinputs += '<div class="attach-toolbar">'
						fileinputs += '<div class="attach-toolbar-back">'
						fileinputs += '<span class="glyphicon icon-angle-left"></span>返回'
						fileinputs += '</div>'
						fileinputs += '</div>'
						fileinputs += '<div class="attach-upload-box">'
						fileinputs += '<div class="attach-upload-noData">'
						fileinputs += '<span class="glyphicon icon-upload-lg"></span>'
						fileinputs += '<p>点击或点击后将文件拖拽到这里上传</p>'
						fileinputs += '</div>'
						fileinputs += '<form enctype="multipart/form-data" style="margin-top:10px;">'
						fileinputs += '<input id="attachUploadFile" type="file" multiple class="file" data-overwrite-initial="false">'
						fileinputs += '</form>'
						fileinputs += '<div class="attach-upload-toolbar" style="display:none">'
						fileinputs += '<button class="btn btn-primary" id="attach-upload-start">开始上传</button>'
						fileinputs += '<span class="attach-uploaded-info"></span>'
						fileinputs += '</div>'
						fileinputs += '</div>'
						fileinputs += '</div>'
						fileinputs += '<div class="attach-step3"></div>'
						fileinputs += '</div>'
						fileinputs += '</div>'
						$("#zezhao").html(fileinputs);
						$("#vouAttachBox").show();
						$("#vouAttachBox").css("background", "#fff");
						$("#vouAttachBox #attachUploadFile").fileinput({
							language: "zh",
							uploadUrl: "/gl/file/upload",
							//		allowedFileExtensions: ['jpg', 'png', 'gif', 'txt', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt'],
							overwriteInitial: false,
							uploadasync: false, //默认异步上传
							showUpload: true, //是否显示上传按钮
							maxFileSize: 102400,
							showRemove: false, //显示移除按钮
							showPreview: true, //是否显示预览
							browseClass: "btn btn-primary", //按钮样式
							msgSizeTooSmall: "文件 {name} ({size} KB) 太小了，必须大于 {minSize} KB.",
							uploadExtraData: function (previewId, index) {
								var obj = {};
								obj.vouGuid = page.datanow.vouGuid;
								return obj;
							},
							slugCallback: function (filename) {
								return filename.replace('(', '_').replace(']', '_');
							},
							fileimageuploaded: function () {
								console.info(1);
							},
						}).on("fileuploaded", function (event, data, previewId, index) {
							if (data.response) {
								ufma.showTip('处理成功', function () { }, "success");
								$(".kv-file-remove").css('display', 'none');
							}
						})
					})
				})
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				vouGuid =page.getUrlParam('vouGuid')
				ufma.isShow(page.reslist);
				page.nowDate = ptData.svTransDate; //当前年月日
				page.setYear = ptData.svSetYear; //本年 年度
				page.month = ptData.svFiscalPeriod; //本期 月份
				page.today = ptData.svTransDate; //今日 年月日
				page.titles()
				page.getacco()
				page.getass()
				ufma.ajaxDef(posturl.getVoudetail+vouGuid,'get',searchData, page.searchtable);
				var bodyheight = ($(document.body)[0].clientHeight-135)
				if(bodyheight<440){
					bodyheight = 440
					$(".voudetailAccdiv").height(bodyheight-200)
					$(".voudetailAssdiv").height(200)
					$(".voubigtableassdiv").height(150)
				}else{
					$(".voudetailAccdiv").height(bodyheight/2+100)
					$(".voudetailAssdiv").height(bodyheight/2-100)
					$(".voubigtableassdiv").height(bodyheight/2-140)
				}
				$(".voudetailAccdiv").find('.ufma-tool-bar').css("top",$(".voudetailAccdiv").height()-40+"px")
				$(".voudetailAssdiv").find('.ufma-tool-bar').css("top",$(".voudetailAssdiv").height()-40+"px")
				$(".voudetailAccdiv,.voudetailAssdiv").on('scroll',function(){
					var height = $(this).height()-39 +$(this).scrollTop()
					$(this).find('.ufma-tool-bar').css("top",height+"px")
				})
			},
			init: function () {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parse();
			}
		}
	}();
	page.init();
	var att = {
		vouAttachBox: "",
		vouAttachShowList: "",
		namespace: "#vouAttachBox",
		inObjArray: function (keyName, val, arr) {
			var index = -1;
			for (var i = 0; i < arr.length; i++) {
				if (val == arr[i][keyName]) {
					index = i;
				}
			}
			return index;
		}
	};
	
	
	$(document).on("click", ".attach-img-btns .icon-edit", function () {
		if (page.datanow.vouStatus == "O") {
			var editDom = $(this).parent(".attach-img-btns").siblings(".attach-img-sub-edit");
			var txt = $(editDom).siblings(".attach-img-sub").attr("title");
			$(editDom).siblings(".attach-img-sub").hide();
			$(editDom).find("input").val(txt);
			$(editDom).show();
		} else {
			ufma.showTip("抱歉，此状态附件无法修改备注", function () { }, "warning")
		}
	
	});
	var updateattach = true;
	$(document).on("click", "#attachUploadBtn", function () {
		if (page.datanow.vouStatus == "O") {
			$("#vouAttachBox").find(".attach-step1").hide();
			$("#vouAttachBox").find(".attach-step2").show();
		} else {
			var istdata = $("#pzzhuantai").html()
			var isattdata = "抱歉，凭证处于" + istdata + "状态附件无法继续上传"
			ufma.showTip(isattdata, function () { }, "warning")
		}
	});
	
	$(document).on("click", "#attachgaopaiyiBtn", function () {
		if (page.datanow.vouStatus == "O") {
			ufma.open({
				title: '高拍仪上传',
				width: 970,
				height: 600,
				url: '/pf/gl/sdkphoto/sdkphoto.html',
				data: {
					guid: page.datanow.vouGuid
				},
				ondestory: function (result) {
					var ssupdateattach = result.updateattach
					$.ajax({
						type: "get",
						url: "/gl/file/getFileList/" + page.datanow.vouGroupId + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						success: function (data) {
							var fileinputs = '';
							for (var i = 0; i < data.data.length; i++) {
								fileinputs += '<li class="attach-show-li" names="' + data.data[i].attachGuid + '">'
								fileinputs += '<div class="attach-img-box">'
								if (data.data[i].fileFormat == ".txt") {
									fileinputs += '<img class="attach-img-file" src="img/txt.png" />'
								} else if (data.data[i].fileFormat == ".doc" || data.data[i].fileFormat == ".docx") {
									fileinputs += '<img class="attach-img-file" src="img/word.png" />'
								} else if (data.data[i].fileFormat == ".xlsx" || data.data[i].fileFormat == ".xls") {
									fileinputs += '<img class="attach-img-file" src="img/xls.png" />'
								} else if (data.data[i].fileFormat == ".ppt" || data.data[i].fileFormat == ".pptx") {
									fileinputs += '<img class="attach-img-file" src="img/ppt.png" />'
								} else if (data.data[i].fileFormat == ".pdf") {
									fileinputs += '<img class="attach-img-file" src="img/pdf.png" />'
								} else if (data.data[i].fileFormat == ".jpg" || data.data[i].fileFormat == ".png" || data.data[i].fileFormat == ".gif" || data.data[i].fileFormat == ".bmp" || data.data[i].fileFormat == ".jpeg") {
									fileinputs += '<img class="attach-img-file" src="/gl/file/download?attachGuid=' + data.data[i].attachGuid + '" />'
								} else if (data.data[i].fileFormat == ".rar" || data.data[i].fileFormat == ".zip" || data.data[i].fileFormat == ".7z") {
									fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
								} else {
									fileinputs += '<img class="attach-img-file" src="img/other.png" />'
								}
								fileinputs += '</div>'
								fileinputs += '<div class="attach-img-tip">'
								fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
								fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
								fileinputs += '<span class="attach-clear"></span>'
								fileinputs += '</div>'
								if (data.data[i].remark != null) {
									fileinputs += '<div class="attach-img-sub" title="' + data.data[i].remark + '">' + data.data[i].remark + '</div>'
								} else {
									fileinputs += '<div class="attach-img-sub" title="">暂无备注</div>'
								}
								fileinputs += '<div class="attach-img-sub-edit">'
								fileinputs += '<input type="text" value="' + data.data[i].remark + '" />'
								fileinputs += '<span class="glyphicon icon-check"></span>'
								fileinputs += '</div>'
								fileinputs += '<div class="attach-img-btns">'
								fileinputs += '<span class="glyphicon icon-edit"></span>'
								fileinputs += '<span class="glyphicon icon-download"></span>'
								fileinputs += '<span class="glyphicon icon-trash"></span>'
								fileinputs += '</div>'
								fileinputs += '</li>'
							}
							$(".attach-show-list").html(fileinputs)
							var thisvouguid = new Object();
							thisvouguid.vouGroupId = page.datanow.vouGroupId;
							if (ssupdateattach == false) {
								ufma.confirm('是否更新凭证附件张数?', function (action) {
									if (action) {
										$.ajax({
											type: "post",
											url: "/gl/file/changeVouCnt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
											async: false,
											data: JSON.stringify(thisvouguid),
											contentType: 'application/json; charset=utf-8',
											success: function (data) {
												if (data.flag == "success") {
													$("#fjd").html(data.data[0].vouCnt);
												} else {
													ufma.showTip(data.msg, function () { }, "error");
												}
											},
											error: function () {
												ufma.showTip("无法连接数据库", function () { }, "error");
											}
										});
									}
								})
								updateattach = true;
							}
						}
	
					});
				}
			});
		} else {
			var istdata = $("#pzzhuantai").html()
			var isattdata = "抱歉，凭证处于" + istdata + "状态附件无法继续上传"
			ufma.showTip(isattdata, function () { }, "warning")
		}
	});
	
	$(document).on("click", ".kv-file-upload", function () {
		updateattach = false;
	});
	$(document).on("click", ".attach-toolbar-back", function () {
		mediaStreamTrack && mediaStreamTrack.stop();
		var vouGroupId = page.datanow.vouGroupId
		$.ajax({
			type: "get",
			url: "/gl/file/getFileList/" + page.datanow.vouGroupId + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			success: function (data) {
				$("#zezhao").show();
				$("#zezhao").html("");
				var fileinputs = '';
				fileinputs += '<div id="vouAttachBox">'
				fileinputs += '<div class="u-msg-title">'
				fileinputs += '<p style="font-size:16px">凭证附件</p>'
				fileinputs += '<div class="attach-close icon-close"></div>'
				fileinputs += '</div>'
				fileinputs += '<div class="u-msg-content">'
				fileinputs += '<div class="attach-step1">'
				fileinputs += '<div class="attach-toolbar">'
				fileinputs += '<div class="attach-toolbar-tip">'
				fileinputs += '<p>附件数：共<input type="input" class="voucnt"> <span class="voucntnum">' + $("#fjd").html() + '</span> 张<span title="修改" class="glyphicon icon-edit"></span>'
				fileinputs += '<span title = "保存" class="glyphicon icon-check"></span>'
				fileinputs += '<span title ="取消" class="glyphicon icon-close"></span></p>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-toolbar-btns">'
				fileinputs += '<button class="btn btn-primary" id="attachUploadBtn">上传</button>'
				fileinputs += '<button class="btn btn-primary" id="attachsaomiaoBtn">拍照</button>'
				fileinputs += '<button class="btn btn-primary" id="attachgaopaiyiBtn">扫描</button>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-clear"></div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-show">'
				fileinputs += '<div class="attach-noData" style="display:none;">'
				fileinputs += '<img src="../../images/noData.png" />'
				fileinputs += '<p>目前还没有附件，请选择上传/扫描</p>'
				fileinputs += '</div>'
				fileinputs += '<ul class="attach-show-list">'
				for (var i = 0; i < data.data.length; i++) {
					fileinputs += '<li class="attach-show-li" names="' + data.data[i].attachGuid + '">'
					fileinputs += '<div class="attach-img-box">'
					if (data.data[i].fileFormat == ".txt") {
						fileinputs += '<img class="attach-img-file" src="img/txt.png" />'
					} else if (data.data[i].fileFormat == ".doc" || data.data[i].fileFormat == ".docx") {
						fileinputs += '<img class="attach-img-file" src="img/word.png" />'
					} else if (data.data[i].fileFormat == ".xlsx" || data.data[i].fileFormat == ".xls") {
						fileinputs += '<img class="attach-img-file" src="img/xls.png" />'
					} else if (data.data[i].fileFormat == ".ppt" || data.data[i].fileFormat == ".pptx") {
						fileinputs += '<img class="attach-img-file" src="img/ppt.png" />'
					} else if (data.data[i].fileFormat == ".pdf") {
						fileinputs += '<img class="attach-img-file" src="img/pdf.png" />'
					} else if (data.data[i].fileFormat == ".jpg" || data.data[i].fileFormat == ".png" || data.data[i].fileFormat == ".gif" || data.data[i].fileFormat == ".bmp" || data.data[i].fileFormat == ".jpeg") {
						fileinputs += '<img class="attach-img-file" src="/gl/file/download?attachGuid=' + data.data[i].attachGuid + '" />'
					} else if (data.data[i].fileFormat == ".rar" || data.data[i].fileFormat == ".zip" || data.data[i].fileFormat == ".7z") {
						fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
					} else {
						fileinputs += '<img class="attach-img-file" src="img/other.png" />'
					}
					fileinputs += '</div>'
					fileinputs += '<div class="attach-img-tip">'
					fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
					fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
					fileinputs += '<span class="attach-clear"></span>'
					fileinputs += '</div>'
					if (data.data[i].remark != null) {
						fileinputs += '<div class="attach-img-sub" title="' + data.data[i].remark + '">' + data.data[i].remark + '</div>'
					} else {
						fileinputs += '<div class="attach-img-sub" title="">暂无备注</div>'
					}
					fileinputs += '<div class="attach-img-sub-edit">'
					fileinputs += '<input type="text" value="' + data.data[i].remark + '" />'
					fileinputs += '<span class="glyphicon icon-check"></span>'
					fileinputs += '</div>'
					fileinputs += '<div class="attach-img-btns">'
					fileinputs += '<span class="glyphicon icon-edit"></span>'
					fileinputs += '<span class="glyphicon icon-download"></span>'
					fileinputs += '<span class="glyphicon icon-trash"></span>'
					fileinputs += '</div>'
					fileinputs += '</li>'
				}
				fileinputs += '</ul>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-step2">'
				fileinputs += '<div class="attach-toolbar">'
				fileinputs += '<div class="attach-toolbar-back">'
				fileinputs += '<span class="glyphicon icon-angle-left"></span>返回'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-upload-box">'
				fileinputs += '<div class="attach-upload-noData">'
				fileinputs += '<span class="glyphicon icon-upload-lg"></span>'
				fileinputs += '<p>点击或点击后将文件拖拽到这里上传</p>'
				fileinputs += '</div>'
				fileinputs += '<form enctype="multipart/form-data" style="margin-top:10px;">'
				fileinputs += '<input id="attachUploadFile" type="file" multiple class="file" data-overwrite-initial="false">'
				fileinputs += '</form>'
				fileinputs += '<div class="attach-upload-toolbar" style="display:none">'
				fileinputs += '<button class="btn btn-primary" id="attach-upload-start">开始上传</button>'
				fileinputs += '<span class="attach-uploaded-info"></span>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				fileinputs += '<div class="attach-step3"></div>'
				fileinputs += '</div>'
				fileinputs += '</div>'
				$("#zezhao").html(fileinputs);
				$("#vouAttachBox").show();
				$("#vouAttachBox").css("background", "#fff");
				$("#vouAttachBox #attachUploadFile").fileinput({
					language: "zh",
					uploadUrl: "/gl/file/upload",
					//		allowedFileExtensions: ['jpg', 'png', 'gif', 'txt', 'pdf', 'xls', 'xlsx', 'doc', 'docx', 'ppt'],
					overwriteInitial: false,
					uploadasync: false, //默认异步上传
					showUpload: true, //是否显示上传按钮
					showRemove: false, //显示移除按钮
					maxFileSize: 102400,
					showPreview: true, //是否显示预览
					browseClass: "btn btn-primary", //按钮样式    
					uploadExtraData: function (previewId, index) {
						var obj = {};
						obj.vouGuid = page.datanow.vouGuid;
						return obj;
					},
					slugCallback: function (filename) {
						return filename.replace('(', '_').replace(']', '_');
					},
					fileimageuploaded: function () {
						console.info(1);
					},
				}).on("fileuploaded", function (event, data, previewId, index) {
					if (data.response) {
						$(".file-preview-frame .file-upload-indicator[title='上传']").parents(".file-preview-frame").find(".kv-file-remove").hide();
						ufma.showTip('处理成功', function () { }, "success");
					}
				})
			}
	
		});
		var thisvouguid = new Object();
		thisvouguid.vouGroupId = page.datanow.vouGroupId;
		if (updateattach == false) {
			ufma.confirm('是否更新凭证附件张数?', function (action) {
				if (action) {
					$.ajax({
						type: "post",
						url: "/gl/file/changeVouCnt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(thisvouguid),
						contentType: 'application/json; charset=utf-8',
						success: function (data) {
							if (data.flag == "success") {
									$("#fjd").html(data.data[0].vouCnt);
							} else {
								ufma.showTip(data.msg, function () { }, "error");
							}
						},
						error: function () {
							ufma.showTip("无法连接数据库", function () { }, "error");
						}
					});
				}
			})
			updateattach = true;
		}
	
	});
	var count = 0;
	$(".file-preview").on("click", function () {
		count++;
		if (count == 0) {
			$("#vouAttachBox #attachUploadFile").click();
		}
	})
	
	$(document).on("click", "#vouAttachBox .attach-upload-noData", function () {
		$(this).hide();
		$("#vouAttachBox #attachUploadFile").click();
		$("#vouAttachBox .attach-upload-toolbar").show();
	})
	
	//选择上传文件
	$(document).on("click", ".attach-show-li-add", function () {
		$("#vouAttachBox #attachUploadFile").click();
	})
	
	//开始上传
	$(document).on("click", "#attach-upload-start", function () {
		var shangc = true;
		var sk = 0;
		for (var i = 0; i < $(".attach-step2").find(".krajee-default").length; i++) {
			if ($(".attach-step2").find(".krajee-default").eq(i).find(".file-thumb-progress").hasClass("hide")) {
				sk += 1;
			}
		}
		if (sk != $(".attach-step2").find(".krajee-default").length / 2) {
			shangc = false;
		}
		if ($('.file-upload-indicator .glyphicon-exclamation-sign').length > 0) {
			ufma.showTip("您有超出大小的附件无法上传", function () { }, "warning")
		} else if ($(".kv-upload-progress").hasClass("hide") && shangc == false) {
			updateattach = false
			$(".fileinput-upload-button").click();
		} else {
			ufma.showTip("您没有上传新的附件", function () { }, "warning")
		}
	})
	
	$(document).on("mouseenter", ".krajee-default", function () {
		$(this).find(".attach-img-file-pos-bg").css("background", "#E6F4FD");
	}).on("mouseleave", ".krajee-default", function () {
		$(this).find(".attach-img-file-pos-bg").css("background", "#fff");
	});
	
	//判断上下翻页按钮是否可用
	att.isDisabledBtn = function (index) {
		if (att.fileArr.length > 1) {
			if (index == 0) {
				$("#kvFileinputModal .btn-prev").attr("disabled", "disabled");
				$("#kvFileinputModal .btn-next").removeAttr("disabled");
			} else if (index == att.fileArr.length - 1) {
				$("#kvFileinputModal .btn-next").attr("disabled", "disabled");
				$("#kvFileinputModal .btn-prev").removeAttr("disabled");
			} else {
				$("#kvFileinputModal .btn-prev,#kvFileinputModal .btn-next").removeAttr("disabled");
			}
		} else if (att.fileArr.length == 1) {
			$("#kvFileinputModal .btn-prev,#kvFileinputModal .btn-next").attr("disabled", "disabled");
		}
	};
	
	//预览文件
	$(document).on("click", ".attach-img-box", function () {
		$("#kvFileinputModal .btn-prev,#kvFileinputModal .btn-next").removeAttr("disabled");
		att.fileArr = [];
		$(att.namespace + " .attach-show-list li").each(function () {
			var fileObj = {};
			fileObj.name = $(this).find(".attach-img-name").text();
			fileObj.namex = $(this).find(".attach-img-name").find("b").text();
			fileObj.bytes = $(this).find(".attach-img-byte").text();
			fileObj.sub = $(this).find(".attach-img-sub").attr("title");
			fileObj.src = $(this).find(".attach-img-file").attr("src");
			att.fileArr.push(fileObj);
		})
	
		att.thisName = $(this).siblings(".attach-img-tip").find(".attach-img-name").text();
		att.thisNamex = $(this).siblings(".attach-img-tip").find(".attach-img-name").find("b").text();
		att.thisBytes = $(this).siblings(".attach-img-tip").find(".attach-img-byte").text();
		att.thisSrc = $(this).find(".attach-img-file").attr("src");
	
		var index = att.inObjArray("name", att.thisName, att.fileArr);
	
		att.isDisabledBtn(index);
	
		$("#kvFileinputModal").find(".kv-zoom-title").html(att.thisNamex + ' <samp>(' + att.thisBytes + ')</samp>');
		$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.thisSrc + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.thisName + '" alt="' + att.thisName + '" style="width:auto; height:auto; max-width: 100%; max-height: 100%;"/>');
	
		var modalFooter = '<div class="kv-modalFooter">' +
			'<span class="glyphicon icon-download"></span>' +
			'<span class="glyphicon icon-trash"></span>' +
			'</div>';
		$("#kvFileinputModal").find(".modal-dialog").find(".kv-modalFooter").remove();
		$("#kvFileinputModal").find(".modal-dialog").append($(modalFooter));
	
		//	$("#kvFileinputModal").modal("show");
		$("#kvFileinputModal").css("display", "block");
		$("#kvFileinputModal").css("z-index", "2005");
		$("#kvFileinputModal").css("opacity", "1");
	
	});
	
	//预览上一个文件
	$(document).on("click", "#kvFileinputModal .btn-prev", function () {
		var name = $(this).parents(".modal-body").find(".file-preview-image").attr("title");
		var index = att.inObjArray("name", name, att.fileArr);
		if (index > 0) {
			var newIndex = index - 1;
			$("#kvFileinputModal").find(".kv-zoom-title").html(att.fileArr[newIndex].namex + ' <samp>(' + att.fileArr[newIndex].bytes + ')</samp>');
			$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.fileArr[newIndex].src + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.fileArr[newIndex].name + '" alt="' + att.fileArr[newIndex].name + '" style="width:auto; height:auto; max-width: 100%; max-height: 100%;"/>');
			att.isDisabledBtn(newIndex);
		}
	
	});
	
	//预览下一个文件
	$(document).on("click", "#kvFileinputModal .btn-next", function () {
		var name = $(this).parents(".modal-body").find(".file-preview-image").attr("title");
		var index = att.inObjArray("name", name, att.fileArr);
		if (index < att.fileArr.length - 1) {
			var newIndex = index + 1;
			$("#kvFileinputModal").find(".kv-zoom-title").html(att.fileArr[newIndex].namex + ' <samp>(' + att.fileArr[newIndex].bytes + ')</samp>');
			$("#kvFileinputModal").find(".kv-zoom-body").html('<img src=' + att.fileArr[newIndex].src + ' class="file-preview-image kv-preview-data file-zoom-detail" title="' + att.fileArr[newIndex].name + '" alt="' + att.fileArr[newIndex].name + '" style="width:auto; height:auto; max-width: 100%; max-height: 100%;"/>');
			att.isDisabledBtn(newIndex);
		}
	
	});
	
	$(document).on("click", ".btn-close", function () {
		if ($(this).find("i").hasClass("glyphicon-remove")) {
			$("#kvFileinputModal").hide();
		}
	})
	
	$(document).on("click", ".attach-show-li .icon-download", function () {
		var downloadvouguid = $(this).parents(".attach-show-li").attr("names");
		var hostname = window.location.hostname;
		var port = window.location.port;
		var dizidowload = "http://" + hostname + ":" + port + "/gl/file/download?attachGuid=" + downloadvouguid;
		window.open(dizidowload)
	
	})
	$(document).on("click", ".attach-img-sub-edit .icon-check", function () {
		_this = $(this);
		var thisbeizhuguid = $(this).parents(".attach-show-li").attr("names");
		var beizhuneirong = $(this).prev("input").val();
		var beizhuremark = new Object();
		beizhuremark.remark = beizhuneirong;
		beizhuremark.attachGuid = thisbeizhuguid;
		$.ajax({
			type: "post",
			url: "/gl/file/editRemark" + "?ajax=1&rueicode=" + hex_md5svUserCode,
			async: false,
			data: JSON.stringify(beizhuremark),
			contentType: 'application/json; charset=utf-8',
			success: function (data) {
				if (data.flag == "success") {
					_this.parent(".attach-img-sub-edit").hide();
					var txt = _this.siblings("input").val();
					_this.parent(".attach-img-sub-edit").siblings(".attach-img-sub").text(txt).attr("title", txt).show();
				} else {
					ufma.showTip(data.msg, function () { }, "error");
				}
			},
			error: function (data) {
				ufma.showTip("无法连接数据库", function () { }, "error");
			}
		});
	})
	
	$(document).on("click", ".attach-img-btns .icon-trash", function () {
		if (page.datanow.vouStatus == "O") {
			var delectbeizhu = new Object();
			delectbeizhu.attachGuid = $(this).parents(".attach-show-li").attr("names");
			_this = $(this);
			$.ajax({
				type: "delete",
				url: "/gl/file/delAtt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
				async: false,
				data: JSON.stringify(delectbeizhu),
				contentType: 'application/json; charset=utf-8',
				success: function (data) {
					updateattach = false
					if (data.flag == "success") {
						_this.parents(".attach-show-li").remove();
						var lilength = $(".attach-show-list").find(".attach-show-li").length;

						$(".attach-toolbar-tip").find(".voucntnum").html(lilength)
					} else {
						ufma.showTip(data.msg, function () { }, "error");
					}
				},
				error: function (data) {
					ufma.showTip("无法连接数据库", function () { }, "error");
				}
			});
		} else {
			ufma.showTip("抱歉,此状态附件无法删除", function () { }, "warning")
		}
	
	});
	$(document).on("click", ".attach-close", function (e) {
		mediaStreamTrack && mediaStreamTrack.stop();
		var thisvouguid = new Object();
		thisvouguid.vouGroupId = page.datanow.vouGroupId;
		if (updateattach == false) {
			ufma.confirm('是否更新凭证附件张数?', function (action) {
				if (action) {
					$.ajax({
						type: "post",
						url: "/gl/file/changeVouCnt" + "?ajax=1&rueicode=" + hex_md5svUserCode,
						async: false,
						data: JSON.stringify(thisvouguid),
						contentType: 'application/json; charset=utf-8',
						success: function (data) {
							if (data.flag == "success") {
								$("#fjd").html(data.data[0].vouCnt);
							} else {
								ufma.showTip(data.msg, function () { }, "error");
							}
						},
						error: function () {
							ufma.showTip("无法连接数据库", function () { }, "error");
						}
					});
				}
			})
			updateattach = true;
		}
		$("#zezhao").hide();
		$("#zezhao").html("");
	})
	var mediaStreamTrack;
	var falshqidong;
	var context
	var snap
	var aVideo
	$(document).on("click", "#attachsaomiaoBtn", function () {
		if (page.datanow.vouStatus == "O") {
			$("#vouAttachBox").find(".attach-step1").hide();
			$("#vouAttachBox").find(".attach-step3").show();
			$("#vouAttachBox").find(".attach-step3").html('');
			var shexiang = '';
			shexiang += '<div class="attach-toolbar">'
			shexiang += '<div class="attach-toolbar-back">'
			shexiang += '<span class="glyphicon icon-angle-left"></span>返回'
			shexiang += '</div>'
			shexiang += '</div>'
			shexiang += '<video id="myVideo" autoplay style="width:640px;height:360px"></video>'
			shexiang += '<canvas id="luxcanvas" height="480" width="640" style="display:none;"></canvas>'
			shexiang += '<p id="status" style="display: none;"></p>'
			shexiang += '<div id="webcam">'
			shexiang += '</div>'
			shexiang += '<div id="btn-paishe">拍照</div>'
			shexiang += '<div class="shangchuanneirong">'
			shexiang += '</div>'
			shexiang += '<div id="btn-paishetijiao">上传</div>'
			$("#vouAttachBox").find(".attach-step3").html(shexiang)
			falshqidong = false;
			context = document.getElementById('luxcanvas').getContext('2d');
			aVideo = document.getElementById('myVideo');
			snap = $('#btn-paishe');
			navigator.getUserMedia = navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia ||
				navigator.msGetUserMedia; //获取媒体对象（这里指摄像头）
			navigator.getUserMedia({
				video: true
			}, gotStream, noStream); //参数1获取用户打开权限；参数二是一个回调函数，自动传入视屏流，成功后调用，并传一个视频流对象，参数三打开失败后调用，传错误信息
	
			function gotStream(stream) {
	
				// video.src = URL.createObjectURL(stream); // 老写法
				aVideo.srcObject = stream;
	
				aVideo.onerror = function () {
					stream.stop();
				};
				stream.onended = noStream;
				aVideo.onloadedmetadata = function () {
				};
			}
			function noStream(err) {
				alert(err);
			}
		} else {
			var istdata = $("#pzzhuantai").html()
			ufma.showTip("抱歉，凭证处于" + istdata + "状态附件无法继续上传", function () { }, "warning")
		}
	})
	$(document).on("click", "#btn-paishe", function () {
		if (falshqidong == false) {
			context.drawImage(aVideo, 0, 0, 640, 480);
			var dnn = context.canvas.toDataURL();
			$(".shangchuanneirong").prepend('<div class="shangchuanshuru"><img src="' + dnn + '" width="220"><div class="paishecaozuo"><input class="xiugaipaishe" type="text" placeholder="点击此处输入附件名称"><div class="delpaishe icon-trash"></div><div class="chuanpaishe icon-upload"></div></div>')
		} else {
			webcam.capture();
			setTimeout(function () {
				var dnn = context.canvas.toDataURL()
				$(".shangchuanneirong").prepend('<div class="shangchuanshuru"><img src="' + dnn + '" width="220"><div class="paishecaozuo"><input class="xiugaipaishe" type="text" placeholder="点击此处输入附件名称"><div class="delpaishe icon-trash"></div><div class="chuanpaishe icon-upload"></div></div>')
			}, 200)
		}
	})
	$(document).on("click", "#btn-paishetijiao", function () {
		if ($(this).hasClass("btn-disablesd") != true) {
			$(this).addClass("btn-disablesd")
			var paisheobj = new Object();
			if ($(".shangchuanneirong").find(".shangchuanshuru").length == $(".shangchuanneirong").find(".shangchuanshuruyishangchuan").length) {
				ufma.showTip("您没有上传新的图片", function () { }, "error");
			} else {
				paisheobj.vouGuid = page.datanow.vouGuid;
				var imgList = new Array();
				for (var i = 0; i < $(".shangchuanneirong").find(".shangchuanshuru").length; i++) {
					var shangchuangimg = new Object()
					if ($(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val() == "") {
						shangchuangimg.imgName = "扫描图片" + (i + 1)
						$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val("扫描图片" + (i + 1))
					} else {
						shangchuangimg.imgName = $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").val()
					}
					shangchuangimg.imgStr = $(".shangchuanneirong").find(".shangchuanshuru").eq(i).find("img").attr("src");
					imgList.push(shangchuangimg);
				}
				paisheobj.imgList = imgList
				$.ajax({
					type: "post",
					url: "/gl/file/uploadImage" + "?ajax=1&rueicode=" + hex_md5svUserCode,
					async: false,
					data: JSON.stringify(paisheobj),
					contentType: 'application/json; charset=utf-8',
					success: function (data) {
						if (data.flag == "success") {
							updateattach = false
							ufma.showTip("上传成功", function () { }, "success");
							for (var i = 0; i < $(".shangchuanneirong").find(".shangchuanshuru").length; i++) {
								$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".delpaishe").remove();
								$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".chuanpaishe").remove();
								$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").after("<div class='xiugaipaishewc'>文件上传完成</div>");
								$(".shangchuanneirong").find(".shangchuanshuru").eq(i).find(".xiugaipaishe").attr("disabled", true);
								$(".shangchuanneirong").find(".shangchuanshuru").eq(i).addClass("shangchuanshuruyishangchuan");
							}
						} else {
							ufma.showTip(data.msg, function () { }, "error");
						}
					},
					error: function (data) {
						ufma.showTip("连接数据库失败", function () { }, "error");
					}
				});
			}
	
			$(this).removeClass("btn-disablesd")
		}
	
	})
	$(document).on("click", ".delpaishe", function () {
		$(this).parents(".shangchuanshuru").remove();
	})
	$(document).on("click", ".chuanpaishe", function () {
		_this = $(this)
		if ($(this).hasClass("btn-disablesd") != true) {
			$(this).addClass("btn-disablesd")
			var paisheobj = new Object();
			paisheobj.vouGuid = page.datanow.vouGuid;
			var imgList = new Array();
			var shangchuangimg = new Object()
			if ($(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val() == "") {
				shangchuangimg.imgName = "扫描图片" + 1
				$(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val("扫描图片" + 1)
			} else {
				shangchuangimg.imgName = $(this).parents(".shangchuanneirong").find(".shangchuanshuru").find(".xiugaipaishe").val()
			}
			shangchuangimg.imgStr = $(this).parents(".shangchuanneirong").find(".shangchuanshuru").find("img").attr("src");
			imgList.push(shangchuangimg);
			paisheobj.imgList = imgList
			$.ajax({
				type: "post",
				url: "/gl/file/uploadImage" + "?ajax=1&rueicode=" + hex_md5svUserCode,
				async: false,
				data: JSON.stringify(paisheobj),
				contentType: 'application/json; charset=utf-8',
				success: function (data) {
					if (data.flag == "success") {
						updateattach = false
						ufma.showTip("上传成功", function () { }, "success");
						_this.parents(".shangchuanshuru").find(".delpaishe").remove();
						_this.parents(".shangchuanshuru").find(".xiugaipaishe").after("<div class='xiugaipaishewc'>文件上传完成</div>");
						_this.parents(".shangchuanshuru").find(".xiugaipaishe").attr("disabled", true);
						_this.parents(".shangchuanshuru").addClass("shangchuanshuruyishangchuan");
						_this.remove();
					}
				},
				error: function (data) {
					ufma.showTip("连接数据库失败", function () { }, "error");
				}
			});
			$(this).removeClass("btn-disablesd")
		}
	})
	
	$(document).on("focus", ".attach-toolbar-tip .voucnt", function () {
		var c = $(this);
		if(/[^\d]/.test(c.val())) { //替换非数字字符  
			var temp_amount = c.val().replace(/[^\d]/g, '');
			if(temp_amount == ''){
				$(this).val(0);
			}else{
				$(this).val(parseFloat(temp_amount).toFixed(0));
			}
		}
	})
	$(document).on("click", ".attach-toolbar-tip .icon-check", function () {
		if (page.datanow.vouStatus == "O") {
			$(".attach-toolbar-tip .icon-check").hide()
			$(".attach-toolbar-tip .icon-close").hide()
			$(".voucnt").blur()
			$.ajax({
				type: "get",
				url: "/gl/vou/updateVouCnt/"+page.datanow.vouGuid+"/"+ $(".voucnt").val()+ "?ajax=1&rueicode=" + hex_md5svUserCode,
				async: false,
				data: '',
				contentType: 'application/json; charset=utf-8',
				success: function (data) {
					if (data.flag == "success") {
						$(".attach-toolbar-tip .icon-edit").show()
						$(".attach-toolbar-tip .icon-check").hide()
						$(".attach-toolbar-tip .icon-close").hide()
						$(".voucnt").hide()
						$(".voucntnum").html($(".voucnt").val()).show()
						$("#fjd").html($(".voucnt").val());
					} else {
						ufma.showTip(data.msg, function () { }, "error");
					}
				},
				error: function () {
					ufma.showTip("无法连接数据库", function () { }, "error");
				}
			});
		} else {
			ufma.showTip("抱歉,此状态附件无法修改", function () { }, "warning")
		}
	})
	
	$(document).on("click", ".attach-toolbar-tip .icon-edit", function () {
		if (page.datanow.vouStatus == "O") {
			$(".attach-toolbar-tip .icon-check").show()
			$(".attach-toolbar-tip .icon-close").show()
			$(".attach-toolbar-tip .icon-edit").hide()
			$(".voucnt").val($(".voucntnum").html()).show()
			$(".voucntnum").hide()
		} else {
			ufma.showTip("抱歉,此状态附件无法修改", function () { }, "warning")
		}
	})
	
	$(document).on("click", ".attach-toolbar-tip .icon-close", function () {
		$(".attach-toolbar-tip .icon-check").hide()
		$(".attach-toolbar-tip .icon-close").hide()
		$(".attach-toolbar-tip .icon-edit").show()
		$(".voucnt").val($(".voucntnum").html()).hide()
		$(".voucntnum").show()
	})
});