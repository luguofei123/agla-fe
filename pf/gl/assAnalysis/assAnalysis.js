$(function () {
	var pageLength = ufma.dtPageLength('#assAnalysisTable');
	var pfData = ufma.getCommonData();
	var oTable;
	var titledata ={
		BEG_CR_AMT:'期初贷方余额',
		BEG_DR_AMT:'期初借方余额',
		C_DR_AMT:'借方发生',
		TOTAL_DR_AMT:'借方累计',
		C_CR_AMT:'贷方发生',
		TOTAL_CR_AMT:'贷方累计',
		END_CR_AMT:'期末贷方余额',
		END_DR_AMT:'期末借方余额'
	}
	var page = function () {
		var rpt ={}
		rpt.rptType= 'GL_RPT_ASS_ANALYZE'
		rpt.nowSetYear = pfData.svSetYear; //当前年份
		rpt.nowUserId = pfData.svUserId; //登录用户ID
		rpt.nowUserName = pfData.svUserName; //登录用户
		rpt.nowAccsCode = pfData.svAccsCode;
		rpt.nowAgencyCode = pfData.svAgencyCode; //登录单位代码
		rpt.nowAgencyName = pfData.svAgencyName; //登录单位名称
		rpt.nowAcctCode = pfData.svAcctCode; //账套代码
		rpt.nowAcctName = pfData.svAcctName; //账套名称
		// prjList: "/gl/rpt/prj/getPrjList", //查询方案列表接口
		//取数接口：/gl/rpt/getReportData/GL_RPT_ASS_ANALYZE
		return {
			agencyacct:function(){
				rpt.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: 'id',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择单位',
					icon: 'icon-unit',
					onchange: function(data) {
						//给全局单位变量赋值
						rpt.nowAgencyCode = data.id;
						rpt.nowAgencyName = data.name;
						page.reqAcctList()
					}
				});
				rpt.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'code',
					textField: 'codeName',
					readOnly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function(data) {
						//给全局账套变量赋值
						rpt.nowAccsCode = data.accsCode;
						rpt.nowAcctCode = data.code;
						rpt.nowAcctName = data.name;
						rpt.isParallelsum = data.isParallel;
						rpt.isDoubleVousum = data.isDoubleVou;
						//缓存单位账套
						var params = {
							selAgecncyCode: rpt.nowAgencyCode,
							selAgecncyName: rpt.nowAgencyName,
							selAcctCode: rpt.nowAcctCode,
							selAcctName: rpt.nowAcctName
						}
						ufma.setSelectedVar(params);
						page.showPlan({
							"agencyCode": rpt.nowAgencyCode,
							"acctCode": rpt.nowAcctCode,
							"rptType": rpt.rptType,
							"userId": rpt.svUserId,
							"setYear": rpt.nowSetYear
						});
						$('.fanantitle').eq(0).html("");
						var url = '/gl/EleAccItem/getRptAccItemTypePost?acctCode='+rpt.nowAcctCode+'&agencyCode='+rpt.nowAgencyCode+'&setYear='+rpt.nowSetYear+'&userId='+rpt.nowUserId;
						ufma.post(url, [], function(result){
							rpt.nowAccItemTypeList = result.data;
						});
						$('.form-tablesearch').find('.form-group').addClass('hide').html('')
						page.showTable([])
					}
				});
			},
			reqAgencyList:function() {
				ufma.ajax('/gl/eleAgency/getAgencyTree', "get", "", function(result) {
					var data = result.data;
					rpt.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var code = data[0].id;
					var name = data[0].name;
					var codeName = data[0].codeName;
					if(rpt.nowAgencyCode != "" && rpt.nowAgencyName != "") {
						var agency = $.inArrayJson(data, 'id', rpt.nowAgencyCode);
						if(agency != undefined) {
							rpt.cbAgency.val(rpt.nowAgencyCode);
						} else {
							rpt.nowAgencyCode = code;
							rpt.nowAgencyName = name;
							rpt.cbAgency.val(code);
						}
					} else {
						rpt.nowAgencyCode = rpt.cbAgency.getValue();
						rpt.nowAgencyName = rpt.cbAgency.getText();
						rpt.cbAgency.val(code);
					}
				});
			},
			reqAcctList:function(){
				var acctArgu = {
					"agencyCode": rpt.nowAgencyCode,
					"userId": pfData.svUserId,
					"setYear": pfData.svSetYear
				};
				ufma.ajax('/gl/eleCoacc/getRptAccts', "get", acctArgu, function(result) {
					var data = result.data;
					rpt.cbAcct = $("#cbAcct").ufmaCombox2({
						data: data
					});
					if(data.length > 0) {
						var code = data[0].code;
						var codeName = data[0].codeName;
						var name = data[0].name;
						if(rpt.nowAcctCode != "" && rpt.nowAcctName != "") {
							var flag = rpt.cbAcct.val(rpt.nowAcctCode);
							if(flag == "undefined") {
								rpt.cbAcct.val(rpt.nowAcctCode);
							} else if(flag == false) {
								rpt.cbAcct.setValue(code, codeName);
								rpt.nowAcctCode = code;
								rpt.nowAcctName = name;
							}
						} else {
							rpt.cbAcct.val(code);
						}
					} else {
						ufma.showTip("该单位下面没有账套，请重新选择单位！", function () { }, "warning");
					}
				});
			},
			showPlan: function(argu) {
				function buildPlanItem(data) {
					var data= data.data
					for(var i = 0; i < data.length; i++) {
						var liHtml = ufma.htmFormat('<li data-code="<%=code%>" data-scope="<%=scope%>" data-guid="<%=guid%>" data-name="<%=name%>"><%=name%><b class="btn-close glyphicon icon-close"></b><span class="count"><%=count%></span></li>', {
							code: data[i].prjCode,
							name: data[i].prjName,
							scope: data[i].prjScope,
							guid: data[i].prjGuid,
							count: data[i].qryCount
						});
						$(liHtml)[data[i].prjCode == dm.curPlan.prjCode ? 'addClass' : 'removeClass']('selected').appendTo("#rptPlanList ul");
						
					}
					for(var i=0;i<$('#rptPlanList .uf-tip-menu').find('li').length;i++){
						if($('#rptPlanList .uf-tip-menu').find('li').eq(i).attr('data-code') == page.menucode){
							$('#rptPlanList .uf-tip-menu').find('li').eq(i).siblings('.selected').removeClass('selected');
							$('#rptPlanList .uf-tip-menu').find('li').eq(i).addClass('selected');
							$('.fanantitle').html($('#rptPlanList .uf-tip-menu').find('li').eq(i).text())
							page.xiugaifanansel(page.menucode)
							page.menucode =undefined
						}
					}
				}
				$("#rptPlanList").html('<ul class="uf-tip-menu"></ul>');
				ufma.get('/gl/rpt/prj/getPrjList', argu, buildPlanItem);
				// ufma.get('/gl/rpt/prj/getSharePrjList', argu, buildPlanItem);
			},
			xiugaifanansel:function(prjCode){
				var prjContArgu = {
					"acctCode": rpt.nowAcctCode,
					"agencyCode": rpt.nowAgencyCode,
					"prjCode": prjCode,
					"rptType": rpt.rptType,
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId
				};
				ufma.ajax("/gl/rpt/prj/getPrjcontent", "get", prjContArgu, function(result){
					//编辑查询数据接口 
					page.setData=JSON.parse(result.data.prjContent)
					var prjContent = JSON.parse(result.data.prjContent)
					page.showOutsearch(prjContent.qryItems)
					prjContent.endFisperd=(new Date($("#vbEndVouDate").getObj().getValue()).getMonth()) + 1
					prjContent.endDate=$('#vbEndVouDate').getObj().getValue()
					prjContent.startFisperd=(new Date($("#vbStartVouDate").getObj().getValue()).getMonth()) + 1
					prjContent.startDate=$('#vbStartVouDate').getObj().getValue()
					page.setquery = {}
					for(var i=0;i<prjContent.qryItems.length;i++){
						page.setquery[prjContent.qryItems[i].itemType] = prjContent.qryItems[i].items
					}
					page.setcolquery=0
					for(var i=0;i<prjContent.rptOption.length;i++){
						if(prjContent.rptOption[i].defCompoValue == 'Y'&& prjContent.rptOption[i].optCode!="IS_INCLUDE_UNPOST"&& prjContent.rptOption[i].optCode!="IS_INCLUDE_JZ"){
							if(prjContent.rptOption[i].optCode=="IS_SHOW_BEGAMT" || prjContent.rptOption[i].optCode=="IS_SHOW_ENDAMT"){
								page.setcolquery+=2
							}else{
								page.setcolquery+=1
							}
						}
					}
				});
			},
			fanansel:function(prjCode){
				var prjContArgu = {
					"acctCode": rpt.nowAcctCode,
					"agencyCode": rpt.nowAgencyCode,
					"prjCode": prjCode,
					"rptType": rpt.rptType,
					"setYear": rpt.nowSetYear,
					"userId": rpt.nowUserId
				};
				ufma.ajax("/gl/rpt/prj/getPrjcontent", "get", prjContArgu, function(result){
					//编辑查询数据接口 
					page.setData=JSON.parse(result.data.prjContent)
					var prjContent = JSON.parse(result.data.prjContent)
					page.searchdataTable(prjContent)
				});
			},
			searchdataTable:function(prjContent){
				page.showOutsearch(prjContent.qryItems)
				prjContent.endFisperd=(new Date($("#vbEndVouDate").getObj().getValue()).getMonth()) + 1
				prjContent.endDate=$('#vbEndVouDate').getObj().getValue()
				prjContent.startFisperd=(new Date($("#vbStartVouDate").getObj().getValue()).getMonth()) + 1
				prjContent.startDate=$('#vbStartVouDate').getObj().getValue()
				page.setquery = {}
				for(var i=0;i<prjContent.qryItems.length;i++){
					page.setquery[prjContent.qryItems[i].itemType] = prjContent.qryItems[i].items
				}
				page.setcolquery=0
				for(var i=0;i<prjContent.rptOption.length;i++){
					if(prjContent.rptOption[i].defCompoValue == 'Y'&& prjContent.rptOption[i].optCode!="IS_INCLUDE_UNPOST"&& prjContent.rptOption[i].optCode!="IS_INCLUDE_JZ"){
						if(prjContent.rptOption[i].optCode=="IS_SHOW_BEGAMT" || prjContent.rptOption[i].optCode=="IS_SHOW_ENDAMT"){
							page.setcolquery+=2
						}else{
							page.setcolquery+=1
						}
					}
				}
				var isShowDetail = $("input[name='zeroAmtNotShow']:checked").eq(0).val();
				var nowss = ''
				for(var i = 0; i < prjContent.rptOption.length; i++) {
					if(prjContent.rptOption[i].optCode == "ZERO_AMT_NOT_SHOW"){
						nowss = i
					}
		
				}
				if(isShowDetail != undefined && isShowDetail == 1){
					var cond = {
						defCompoValue: "Y",
						optCode: "ZERO_AMT_NOT_SHOW",
						optName: "金额为零不显示"
					};
					if(nowss==''){
						prjContent.rptOption.push(cond);
					}else{
						prjContent.rptOption[nowss].defCompoValue = 'Y'
					}
				}else{
					var cond = {
						defCompoValue: "N",
						optCode: "ZERO_AMT_NOT_SHOW",
						optName: "金额为零不显示"
					};
					if(nowss==''){
						prjContent.rptOption.push(cond);
					}else{
						prjContent.rptOption[nowss].defCompoValue = 'N'
					}
				}
				var argu={
					acctCode:rpt.nowAcctCode,
					acctName:rpt.nowAcctName,
					agencyCode:rpt.nowAgencyCode,
					agencyName:rpt.nowAgencyName,
					prjContent:prjContent,
					setYear:rpt.nowSetYear,
					rptType:'GL_RPT_ASS_ANALYZE'
				}
				ufma.post('/gl/rpt/getReportData/GL_RPT_ASS_ANALYZE',argu,function(result){
					if(result.data.tableData!=undefined){
						page.tableDatas = result.data.tableData
						page.tablePrintData = result.data.tablePrintData
						page.tablePrintHead = result.data.tablePrintHead
						page.showTable(result.data.tableData)
					}
				})
			},
			setDayInYear: function () {
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				$('#vbStartVouDate').getObj().setValue(Year + '-01-01');
				$('#vbEndVouDate').getObj().setValue(Year + '-12-31');
			},
			setDayInMonth: function () {
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');
				$('#vbEndVouDate').getObj().setValue(Year + '-' + Month + '-' + this.getLastDay(Year, Month));
			},
			getLastDay: function (year, month) {
				var new_year = year; //取当前的年份          
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）          
				if (month > 12) {
					new_month -= 12; //月份减          
					new_year++; //年份增          
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天          
				return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期 
			},
			setDayInDay: function () {
				var mydate = new Date(pfData.svTransDate);
				Year = mydate.getFullYear();
				Month = (mydate.getMonth() + 1);
				Month = Month < 10 ? ('0' + Month) : Month;
				Day = mydate.getDate();
				Day = Day < 10 ? ('0' + Day) : Day;
				$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
				$('#vbEndVouDate').getObj().setValue(Year + '-' + Month + '-' + Day);
			},
			showOutsearch:function(itemdata){
				$('.form-tablesearch').find('.form-group').addClass('hide')
				for(var i=0;i<itemdata.length;i++){
					if(itemdata[i].isOutTablleShow == '1'){
						$('.form-tablesearch').find('.form-group').eq(i-2).removeClass('hide')
						var htmldata='<label class="control-label mw100 text-right">'+itemdata[i].itemTypeName+'：</label>'+
						'<div class="control-element pr10">'+
						'<div id="accList'+i+'" class="ufma-textboxlist w200" name="'+itemdata[i].itemType+'"></div>'+
						'</div>'
						$('.form-tablesearch').find('.form-group').eq(i-2).html(htmldata)
						if(itemdata[i].items.length>0){
							$('#accList' +i).ufmaTextboxlist({
								valueField: 'code',
								textField: 'codeName',
								name: itemdata[i].itemType,
								leafRequire: true,
								data: itemdata[i].items,
								expand: false
							});
						}else{
							var eleCode = ''
							for(var s=0;s<rpt.nowAccItemTypeList.length;s++){
								if(itemdata[i].itemType == rpt.nowAccItemTypeList[s].accItemCode){
									eleCode = rpt.nowAccItemTypeList[s].eleCode
								}
							}
							var argu = {
								"acctCode": rpt.nowAcctCode,
								"agencyCode": rpt.nowAgencyCode,
								"setYear": rpt.nowSetYear,
								"userId": rpt.nowUserId,
								'accsCode':rpt.nowAccsCode,
								'eleCode':eleCode,
								'accItemCode':itemdata[i].itemType
							}
							ufma.ajaxDef('/gl/common/glAccItemData/getAccItemTree','get',argu,function(result){
								$('#accList' +i).ufmaTextboxlist({
									valueField: 'code',
									textField: 'codeName',
									name: itemdata[i].itemType,
									leafRequire: true,
									data: result.data,
									expand: false
								});
							})
						}
					}
				}
			},
			defaultColumns:function(){
				var tr1 = '<th colspan="2">\\</th><th colspan="2">合计</th>'
				var tr2 = '<th>编码</th><th>名称</th><th>借方发生</th><th>贷方发生</th>'
				var Columns = []
				Columns.push({
					title: '<span class="tce">编码</span>',
					data: 'z',
					// width:300,
					className: 'nowrap tl isprint'
				})
				Columns.push({
					title: '<span class="tce">名称</span>',
					data: 'zname',
					// width:300,
					className: 'nowrap tl isprint'
				})
				Columns.push({
					title: '<span class="tce">借方发生</span>',
					data: 's',
					// width:150,
					className: 'nowrap tr isprint',
					render: function (data, type, rowdata, meta) {
						return data == ''? '':$.formatMoney(data);
					}
				})
				Columns.push({
					title: '<span class="tce">贷方发生</span>',
					data: 'r',
					// width:150,
					className: 'nowrap tr isprint',
					render: function (data, type, rowdata, meta) {
						return data == ''? '':$.formatMoney(data);
					}
				})
				$("#assAnalysisTablehead").html('<tr>'+tr1+'</tr><tr>'+tr2+'</tr>')
				return Columns
			},
			getColumns:function(data){
				page.printheads = []
				var Columns = []
				var tr1 = '<th colspan="2">'+page.setData.qryItems[1].itemTypeName +'\\'+page.setData.qryItems[0].itemTypeName+'</th>'
				var tr2 = '<th>编码</th><th>名称</th>'
				var keylength = 0
				page.damed={}
				page.damedprint={}
				//编辑表头
				var dataones = data[0]
				var tr1iscf = {}
				var namd =page.setData.qryItems[1].itemTypeName +'\\'+page.setData.qryItems[0].itemTypeName
				$.each(dataones,function(d,index){
					if(d.indexOf('|')=='-1'){
						Columns.push({
							title: '<span class="tce">编码</span>',
							data: d,
							// width:300,
							className: 'nowrap tl isprint',
							render: function (data, type, rowdata, meta) {
								return rowdata[d] == ''? '':rowdata[d].split(' ')[0]
							}
						})
						Columns.push({
							title: '<span class="tce">名称</span>',
							data: d+'name',
							// width:300,
							className: 'nowrap tl isprint',
							render: function (data, type, rowdata, meta) {
								return rowdata[d] == ''? '':rowdata[d].split(' ')[1]
							}
						})
						page.printheads.push({
							"title":'编码',
							"key":d
						})
						page.printheads.push({
							"title":'名称',
							"key":d+'name'
						})
					}
				})
				var twokeys = {}
				for(var z in dataones){
					if(z.indexOf('|')!='-1'){
						var names = z.split('|')
						var keys = names[1].slice(0,-5)
						var codes = names[2]
						var printbs = keys+codes
						if(page.damed[keys] == undefined){
							page.damed[keys]={}
						}
						if(page.damedprint[printbs] == undefined){
							page.damedprint[printbs]={}
							page.damedprint[printbs].chidren=[]
						}
						if(page.damed[keys][codes]==undefined){
							if(codes == 'HJ'){
								page.damed[keys][codes] ={title:"合计",lengths:1}
								page.damedprint[printbs].title = '合计'
								tr1+='<th data-length = '+codes+'>'+page.damed[keys][codes].title+'</th>'
							}else{
								for(var s=0;s<page.setquery[keys].length;s++){
									if(page.setquery[keys][s].code == codes){
										page.damedprint[printbs].title = page.setquery[keys][s].code+' '+page.setquery[keys][s].name
										page.damed[keys][codes] ={title:page.setquery[keys][s].code+' '+page.setquery[keys][s].name,lengths:1}
										tr1+='<th  data-length = '+codes+'>'+page.damed[keys][codes].title+'</th>'
									}
								}
							}
						}else{
							page.damed[keys][codes].lengths += 1
						}
						Columns.push({
							title: '<span class="tce">'+ titledata[names[0]]+'</span>',
							data: z,
							// width:150,
							className: 'nowrap tr isprint tdNum',
							render: function (data, type, rowdata, meta) {
								return data == ''? '':$.formatMoney(data);
							}
						})
						page.damedprint[printbs].chidren.push({
							title:titledata[names[0]],
							key:z
						})
						keylength++;
						tr2+='<th>'+titledata[names[0]]+'</th>'
						
					}
					// printhead.push({
					// 	"title":page.damed[keys][codes],
					// 	"children":[

					// 	]
					// })
				}
				for(var i in page.damedprint){
					var ss = {
						title:page.damedprint[i].title,
						children:page.damedprint[i].chidren
					}
					page.printheads.push(ss)
				}
				// $("#assAnalysisTable").css("width",keylength*150+'px')
				$("#assAnalysisTablehead").html('<tr>'+tr1+'</tr><tr>'+tr2+'</tr>')
				for(var i in page.damed){
					for(var z in page.damed[i]){
						$("#assAnalysisTablehead").find("th[data-length="+z+"]").attr("colspan",page.damed[i][z].lengths)
					}
				}
				return Columns
			},
			showTable:function(data){
				var id = 'assAnalysisTable'
				$("#" + id +" tbody").html('')
				if (oTable) {
					$('#' + id).closest('.dataTables_wrapper').ufScrollBar('destroy');
					$("#" + id).dataTable().fnClearTable();    //清空数据
					$("#" + id).dataTable().fnDestroy();         //销毁datatable
				}
				var columns;
				if(data.length!=0){
					columns = page.getColumns(data);
				}else{
					columns = page.defaultColumns();
				}
				pageLength = ufma.dtPageLength('#assAnalysisTable');
				oTable = $("#" + id).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					"autoWidth": true,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"serverSide": false,
					"ordering": false,
					'destory':true,
					"columns": columns,
					//填充表格数据
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function (data, columnIdx) {
									var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
									if ($(data).length == 0) {
										return thisHead.pTitle + data;
									} else {
										return thisHead.pTitle + $(data)[0].innerHTML;
									}
								}
							}
						},
						customize: function (win) {
							$(win.document.body).find('h1').css("text-align", "center");
							$(win.document.body).css("height", "auto");
						}
					},
					{
						extend: 'excelHtml5',
						text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint',
							format: {
								header: function (data, columnIdx) {
									var thisHead = $.inArrayJson(page.headerArr, 'index', columnIdx);
									if ($(data).length == 0) {
										return thisHead.pTitle + data;
									} else {
										return thisHead.pTitle + $(data)[0].innerHTML;
									}
								}
							}
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}
					],
					"initComplete": function (settings, json) {
						ufma.hideloading()
						$('.dt-buttons').remove()
						ufma.searchHideShow(oTable);
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');

						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$("#printTableData .btn-export").addClass("btn-export").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$(".btn-export").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							uf.expTable({
								title: '辅助分析表',
								topInfo:[
									['单位：'+rpt.nowAgencyCode+' '+rpt.nowAgencyName + '（账套：'+rpt.nowAcctCode+' '+rpt.nowAcctName + '）'],
									['期间：'+$("#vbStartVouDate").getObj().getValue()+'至'+$("#vbEndVouDate").getObj().getValue() + " （单位：元）"],
									['方案名称：'+$(".fanantitle").html()]
								],
								exportTable: '#' + id
							});
						});
						$('.' + id + '-paginate').appendTo($info);
						$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						// $(".btn-print").off().on('click',function(){
						// 	var postSetData = {
						// 		reportCode:'GL_RPT_ANALYSE1',
						// 		templId:'*'
						// 	}
						// 	$.ajax({
						// 		type: "POST",
						// 		url: "/pqr/api/iprint/templbycode",
						// 		dataType: "json",
						// 		data: postSetData,
						// 		success: function(data) {
						// 			if(data.status!='error'){
						// 				var printcode= data.data.printCode
						// 				var medata = JSON.parse(data.data.tempContent)
						// 				var runNum = data.data.rowNum
						// 				var result={
						// 					tableHead:{"drColumns":page.printheads},
						// 					tableData:page.tableDatas
						// 				}
						// 				var outTableData = {}
						// 				outTableData.agency=rpt.nowAgencyCode+' '+rpt.nowAgencyName
						// 				outTableData.times = $("#vbStartVouDate").getObj().getValue()+'至'+$("#vbEndVouDate").getObj().getValue()
						// 				outTableData.acco = $(".fanantitle").html()
						// 				outTableData.printor = rpt.nowUserName
						// 				outTableData.startPage = 1
						// 				outTableData.date = pfData.svTransDate
						// 				outTableData.title = '辅助分析表'
						// 				outTableData.showWatermark = true
						// 				var pagelen = result.tableData.length
						// 				outTableData.totalPage= Math.ceil(pagelen/runNum)
						// 				result.outTableData = outTableData
						// 				for(var i=0;i<result.tableData.length;i++){
						// 					for(var z in result.tableData[i]){
						// 						if(result.tableData[i][z]!='' && !isNaN(result.tableData[i][z])){
						// 							result.tableData[i][z] = parseFloat(result.tableData[i][z]).toFixed(2)
						// 						}
						// 					}
						// 				}
						// 				var names = medata.template
						// 				var html = YYPrint.engine(medata.template,medata.meta, result);
						// 				YYPrint.print(html)
						// 			}else{
						// 				ufma.showTip("云服务未启用", function () { }, "warning")
						// 			}
						// 		},
						// 		error: function() {}
						// 	});
						// })
						$(".btn-print").off().on('click',function(){
							page.editor = ufma.showModal('tableprint', 450, 350);
							var postSetData = {
								agencyCode: rpt.nowAgencyCode,
								acctCode: rpt.nowAcctCode,
								componentId: $('#rptType option:selected').val(),
								rgCode: pfData.svRgCode,
								setYear: pfData.svSetYear,
								sys: '100',
								directory: '辅助分析表'
							};
							$.ajax({
								type: "POST",
								url: "/pqr/api/templ",
								dataType: "json",
								data: postSetData,
								success: function (data) {
									var data = data.data;
									$('#rptTemplate').html('')
									for (var i = 0; i < data.length; i++) {
										var jData = data[i].reportCode
										$op = $('<option templId = ' + data[0].templId + ' valueid="' + data[i].reportCode + '" value="' + jData + '">' + data[i].reportName + '</option>');
										$('#rptTemplate').append($op);
									}
								},
								error: function () { }
							});
							
						})
						ufma.setBarPos($(window));
						//导出end
						ufma.isShow(page.reslist);
						// $("#"+id).tblcolResizable();
						$("#assAnalysisTable").eq(0).find('thead').find('tr').eq(1).find('th').css('width','')
						page.leftfixedcolumns()
						$("#assAnalysisTableleft").find('thead').find('tr').eq(0).find('th').eq(0).css('width',$("#assAnalysisTable").find('thead').find('tr').eq(0).find('th').eq(0).css('width'))
						$("#assAnalysisTableleft").css('width',$("#assAnalysisTable").find('thead').find('tr').eq(0).find('th').eq(0).css('width'))
						// $("#"+id).fixedTableHead();
					},
					"drawCallback": function (settings) {
						if(data.length!=0){
							// $("#" + id).fixedColumns({
							// 	// rightColumns: 1,//锁定右侧一列
							// 	leftColumns: 2//锁定左侧一列
							// });
							page.leftfixedcolumns()
							$("#assAnalysisTable").eq(0).find('thead').find('tr').eq(1).find('th').css('width','')
							$("#"+id).eq(0).tblcolResizable({},function(){
								$("#assAnalysisTableleft").find('thead').find('tr').eq(0).find('th').eq(0).css('width',$("#assAnalysisTable").find('thead').find('tr').eq(0).find('th').eq(0).css('width'))
								$("#assAnalysisTableleft").css('width',$("#assAnalysisTable").find('thead').find('tr').eq(0).find('th').eq(0).css('width'))
							});
						}
						$("#" + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						// $('.wrapper-left #assAnalysisTablehead').find('tr').eq(1).css('visibility','hidden')
						pageLength = ufma.dtPageLength($(this));
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
					}
				});
			},
			leftfixedcolumns:function(){
				var ths = ''
				ths+='<tr role="row">'
				ths+=$("#assAnalysisTable").find('thead').find('tr').eq(0).find('th').eq(0).prop('outerHTML')
				ths+='</tr><tr role="row">'
				ths+=$("#assAnalysisTable").find('thead').find('tr').eq(1).find('th').eq(0).prop('outerHTML')
				ths+=$("#assAnalysisTable").find('thead').find('tr').eq(1).find('th').eq(1).prop('outerHTML')
				ths+='</tr>'
				$("#assAnalysisTableleft").find('thead').html(ths)
				var trs = ''
				var trbody = $("#assAnalysisTable").find('tbody').find('tr')
				for(var i=0;i<trbody.length;i++){
					if(i%2!=0){
						trs+='<tr class="even" role="row">'
					}else{
						trs+='<tr class="odd" role="row">'
					}
					trs+=trbody.eq(i).find('td').eq(0).prop('outerHTML')
					trs+=trbody.eq(i).find('td').eq(1).prop('outerHTML')
					trs+='</tr>'
				}
				$("#assAnalysisTableleft").find('tbody').html(trs)
			},
			onEventListener: function () {
				$("#rptPlanList").off().on('click', 'li', function(e) {
					if($(e.target).is('.btn-close')) {
						var _li = $(this).closest('li');
						var planCode = _li.attr('data-code');
						var planName = _li.attr('data-name');
						ufma.confirm('您确定要删除查询方案' + planName + '吗?', function(action) {
							if(action) {
								var argu = {
									"agencyCode": dm.svAcctCode,
									"prjCode": planCode,
									"rptType": rpt.rptType,
									"setYear": rpt.nowSetYear,
									"userId": rpt.nowUserId,
								};
								ufma.delete('/gl/rpt/prj/deletePrj', argu, function(data){
									ufma.showTip('删除成功',function(){},'success')
									_li.remove();
									page.showPlan({
										"agencyCode": rpt.nowAgencyCode,
										"acctCode": rpt.nowAcctCode,
										"rptType": rpt.rptType,
										"userId": rpt.svUserId,
										"setYear": rpt.nowSetYear
									});
									$("#rptPlanList").ufTooltip('hide');
								});
							}
						});
					} else {
						$("#rptPlanList").ufTooltip('hide');
						$(this).siblings('.selected').removeClass('selected');
						$(this).addClass('selected');
						var planCode = $(this).attr('data-code');
						$('.fanantitle').html($(this).attr("data-name"));
						page.fanansel(planCode);
					}
				});
				$("#dateBn").on("click", function () {
					page.setDayInYear();
				});
				$("#dateBq").on("click", function () {
					page.setDayInMonth();
				});
				$("#dateBr").on("click", function () {
					page.setDayInDay();
				});
				$(document).on('click',"#saveMethod",function(){
					ufma.open({
						title: '查询方案',
						width: 900,
						url: 'assAnalysisModel.html',
						data:{
							"accListData":rpt.nowAccItemTypeList,
							"accsCode": rpt.nowAccsCode,
							"acctCode": rpt.nowAcctCode,
							"agencyCode": rpt.nowAgencyCode,
							"setYear": rpt.nowSetYear,
							"userId": rpt.nowUserId,
							'isParallelsum':rpt.isParallelsum,
							'menucode':$("#rptPlanList").find('li.selected').attr('data-code'),
							'prjScope':$("#rptPlanList").find('li.selected').attr('data-scope'),
							'setData':page.setData,
							'fanantitle':$('.fanantitle').html()
						},
						ondestory: function (result) {
							if(result.action == 'ok'){
								page.menucode = $("#rptPlanList").find('li.selected').attr('data-code')
								page.showPlan({
									"agencyCode": rpt.nowAgencyCode,
									"acctCode": rpt.nowAcctCode,
									"rptType": rpt.rptType,
									"userId": rpt.svUserId,
									"setYear": rpt.nowSetYear
								})
							}else if(result.action == 'search'){
								page.setData=result.data
								page.searchdataTable(result.data)
							}
						}
					});
				})
				$(document).on('click',"#searchTableData",function(){
					if($("#rptPlanList").find('li.selected').length<1 && page.setData.length == 0){
						ufma.showTip('请选择一个查询方案后查询')
						return false
					}else{
						var prjContent = JSON.parse(JSON.stringify(page.setData))
						for(var i=0;i<$('.form-tablesearch').find('.ufma-textboxlist').length;i++){
							var names=$('.form-tablesearch').find('.ufma-textboxlist').eq(i).ufmaTextboxlist().getText().split(',')
							var codes=$('.form-tablesearch').find('.ufma-textboxlist').eq(i).ufmaTextboxlist().getValue().split(',')
							var codename=$('.form-tablesearch').find('.ufma-textboxlist').eq(i).ufmaTextboxlist().setting.name
							if(codes!=''){
								var itemsData = []
								for(var z=0;z<codes.length;z++){
									var itemss={}
									itemss.code=codes[z]
									itemss.name=names[z]
									itemsData.push(itemss)
								}
								for(var z=0;z<prjContent.qryItems.length;z++){
									if(prjContent.qryItems[z].itemType == codename && itemsData.length>0){
										prjContent.qryItems[z].items = itemsData
									}
								}
							}
						}
						prjContent.endFisperd=(new Date($("#vbEndVouDate").getObj().getValue()).getMonth()) + 1
						prjContent.endDate=$('#vbEndVouDate').getObj().getValue()
						prjContent.startFisperd=(new Date($("#vbStartVouDate").getObj().getValue()).getMonth()) + 1
						prjContent.startDate=$('#vbStartVouDate').getObj().getValue()
						page.setquery = {}
						if(prjContent.qryItems && prjContent.qryItems.length) {
							for(var i=0;i<prjContent.qryItems.length;i++){
								page.setquery[prjContent.qryItems[i].itemType] = prjContent.qryItems[i].items
							}
						}
						var isShowDetail = $("input[name='zeroAmtNotShow']:checked").eq(0).val();
						var nowss = ''
						for(var i = 0; i < prjContent.rptOption.length; i++) {
							if(prjContent.rptOption[i].optCode == "ZERO_AMT_NOT_SHOW"){
								nowss = i
							}
				
						}
						if(isShowDetail != undefined && isShowDetail == 1){
							var cond = {
								defCompoValue: "Y",
								optCode: "ZERO_AMT_NOT_SHOW",
								optName: "金额为零不显示"
							};
							if(nowss==''){
								prjContent.rptOption.push(cond);
							}else{
								prjContent.rptOption[nowss].defCompoValue = 'Y'
							}
						}else{
							var cond = {
								defCompoValue: "N",
								optCode: "ZERO_AMT_NOT_SHOW",
								optName: "金额为零不显示"
							};
							if(nowss==''){
								prjContent.rptOption.push(cond);
							}else{
								prjContent.rptOption[nowss].defCompoValue = 'N'
							}
						}
						var argu={
							acctCode:rpt.nowAcctCode,
							acctName:rpt.nowAcctName,
							agencyCode:rpt.nowAgencyCode,
							agencyName:rpt.nowAgencyName,
							prjContent:prjContent,
							setYear:rpt.nowSetYear,
							rptType:'GL_RPT_ASS_ANALYZE'
						}
						ufma.showloading('正在查询，请稍候')
						// 查询时，修改方案的查询次数
						var guid = $("#rptPlanList").find('li.selected').attr("data-guid");
						ufma.ajaxDef("/gl/rpt/prj/addQryCount?prjId=" + (guid ? guid : ''), "get", "", function(result) {});
						// 重新查询方案列表
						page.showPlan({
							"agencyCode": rpt.nowAgencyCode,
							"acctCode": rpt.nowAcctCode,
							"rptType": rpt.rptType,
							"userId": rpt.svUserId,
							"setYear": rpt.nowSetYear
						})
						ufma.post('/gl/rpt/getReportData/GL_RPT_ASS_ANALYZE',argu,function(result){
							ufma.hideloading()
							if(result.data.tableData!=undefined){
								page.tableDatas = result.data.tableData
								page.tablePrintData = result.data.tablePrintData
								page.tablePrintHead = result.data.tablePrintHead
								page.showTable(result.data.tableData)
							}
						})
					}
				})
				$(document).on('click','#assAnalysisTable tbody tr',function(){
					$('.teselected').removeClass('teselected')
					$(this).addClass('teselected');
				})
				
				
			},
			//重构
			initPage: function () {
				page.agencyacct()
				page.reqAgencyList()
				//绑定日历控件
				$("#vbStartVouDate").ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: '',
				}).on('change', function () {
					var startdate = $('#vbStartVouDate').getObj().getValue();
					var enddate = $('#vbEndVouDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						$('#vbStartVouDate').getObj().setValue(Year + '-' + Month + '-01');
					}
				})
				$("#vbEndVouDate").ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: '',
				}).on('change', function () {
					var startdate = $('#vbStartVouDate').getObj().getValue();
					var enddate = $('#vbEndVouDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						$('#vbEndVouDate').getObj().setValue($('#vbStartVouDate').getObj().getValue());
					}
				})
				this.setDayInMonth();
				$('#showMethodTip').click(function () {
					if ($("#rptPlanList").find('li').length == 0) {
						$("#rptPlanList ul").append('<li class="tc">无可用方案</li>');
					};
				});
				$('#showMethodTip').ufTooltip({
					className: 'p0',
					trigger: 'click', //click|hover
					opacity: 1,
					confirm: false,
					gravity: 'north', //north|south|west|east
					content: "#rptPlanList"
				});
				$("#btn-tableprintsave").off().on('click', function () {
					var xhr = new XMLHttpRequest()
					var formData = new FormData()
					formData.append('reportCode', $('#rptTemplate option:selected').attr('valueid'))
					formData.append('templId',$('#rptTemplate option:selected').attr('templId'))
					var datas = [{
						"GL_RPT_ANALYZE": page.tablePrintData,
						'GL_RPT_HEAD_EXT': [page.tablePrintHead]
					}]
					formData.append('groupDef', JSON.stringify(datas))
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
					page.editor.close();
				});
				$("#btn-tableprintqx").off().on('click', function () {
					page.editor.close();
				})
			},
			//此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.setData=[]
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	/////////////////////
	page.init();
});