$(function () {
	var page = function () {
		var pageLength = ufma.dtPageLength('#rptPrint-data');
		//定义datatables变量
		var rptPrintDataTable;
		var rptPrintDatanew;
		var printServiceUrl = 'https:' == document.location.protocol ? "https://" + window.location.host : "http://" + window.location.host;
		var TMPL_CODEs = ''
		var isprint = ''
		var prjContentsnow = {}
		var nowout = ''
		var destroyGuid = ''
		var htmlprint  = ''
		var liL = 0;
		var ulL = 0;
		var setchange = false
		//绑定日历控件
		var glRptBalDate = {
			format: 'yyyy-mm',
			autoclose: true,
			todayBtn: true,
			startView: 'year',
			minView: 'year',
			maxView: 'decade',
			language: 'zh-CN2'
		};
		var mxdata ={
			"mxSanlSysND":"明细账三栏式","mxShulSysND":"明细账数量式","mxWbSysND":"明细账外币式","mxSlwbSysND":"明细账数量外币式",
			"mxSanlND":"明细账三栏式","mxShulND":"明细账数量式","mxWbND":"明细账外币式","mxSlwbND":"明细账数量外币式"
		}
		var  zzdata={
			"zzSanlSysND":"总账三栏式","zzShulSysND":"总账外币式","zzSanlND":"总账三栏式","zzShulND":"总账外币式"
		}
		var zhuls = [{
			"id": 'zzSysND',
			"formattmplCode": '0',
			'pId': '0',
			'tmplName': '总账',
			'agencyCode': '*',
			'acctCode': '*',
			'tmplCode': '',
			'isLeaf': '0',
			'code': 'GL_RPT_LEDGER'
		}, {
			"id": 'mxSysND',
			"formattmplCode": '0',
			'pId': '0',
			'tmplName': '明细账',
			'agencyCode': '*',
			'acctCode': '*',
			'tmplCode': '',
			'isLeaf': '0',
			'code': 'GL_RPT_JOURNAL'
		}]
		// {
		// 	"id": 'yeSys',
		// 	"formattmplCode": '0',
		// 	'pId': '0',
		// 	'tmplName': '余额表',
		// 	'agencyCode': '*',
		// 	'acctCode': '*',
		// 	'tmplCode': '',
		// 	'isLeaf': '0',
		// 	'code':'GL_RPT_BAL'
		// }
		var zizhuls = {
			zzSys: [{
				"id": 'zzSanlSysND',
				"formattmplCode": 'zzSys',
				'pId': 'zzSys',
				'tmplName': '三栏式',
				'agencyCode': '*',
				'acctCode': '*',
				'tmplCode': '',
				'isLeaf': '0',
				'isadd': '1',
				'fullName': '总账三栏式'
			}, {
				"id": 'zzShulSysND',
				"formattmplCode": 'zzSys',
				'pId': 'zzSys',
				'tmplName': '外币式',
				'agencyCode': '*',
				'acctCode': '*',
				'tmplCode': '',
				'isLeaf': '0',
				'isadd': '1',
				'fullName': '总账外币式'
			}], mxSys: [{
				"id": 'mxSanlSysND',
				"formattmplCode": 'mxSys',
				'pId': 'mxSys',
				'tmplName': '三栏式',
				'agencyCode': '*',
				'acctCode': '*',
				'tmplCode': '',
				'isLeaf': '0',
				'isadd': '1',
				'fullName': '明细账三栏式'
			}, {
				"id": 'mxShulSysND',
				"formattmplCode": 'mxSys',
				'pId': 'mxSys',
				'tmplName': '数量式',
				'agencyCode': '*',
				'acctCode': '*',
				'tmplCode': '',
				'isLeaf': '0',
				'isadd': '1',
				'fullName': '明细账数量式'
			}, {
				"id": 'mxWbSysND',
				"formattmplCode": 'mxSys',
				'pId': 'mxSys',
				'tmplName': '外币式',
				'agencyCode': '*',
				'acctCode': '*',
				'tmplCode': '',
				'isLeaf': '0',
				'isadd': '1',
				'fullName': '明细账外币式'
			}, {
				"id": 'mxSlwbSysND',
				"formattmplCode": 'mxSys',
				'pId': 'mxSys',
				'tmplName': '数量外币式',
				'agencyCode': '*',
				'acctCode': '*',
				'tmplCode': '',
				'isLeaf': '0',
				'isadd': '1',
				'fullName': '明细账数量外币式'
			}]
			//  yeSys: [{
			// 	"id": 'yeSanlSys',
			// 	"formattmplCode": 'yeSys',
			// 	'pId': 'yeSys',
			// 	'tmplName': '三栏式',
			// 	'agencyCode': '*',
			// 	'acctCode': '*',
			// 	'tmplCode': '',
			// 	'isLeaf': '0',
			// 	'isadd': '1',
			// 	'fullName': '余额表三栏式'
			// }, {
			// 	"id": 'yeShulSys',
			// 	"formattmplCode": 'yeSys',
			// 	'pId': 'yeSys',
			// 	'tmplName': '数量式',
			// 	'agencyCode': '*',
			// 	'acctCode': '*',
			// 	'tmplCode': '',
			// 	'isLeaf': '0',
			// 	'isadd': '1',
			// 	'fullName': '余额表数量式'
			// }, {
			// 	"id": 'yeWbSys',
			// 	"formattmplCode": 'yeSys',
			// 	'pId': 'yeSys',
			// 	'tmplName': '外币式',
			// 	'agencyCode': '*',
			// 	'acctCode': '*',
			// 	'tmplCode': '',
			// 	'isLeaf': '0',
			// 	'isadd': '1',
			// 	'fullName': '余额表外币式'
			// }, {
			// 	"id": 'yeSlwbSys',
			// 	"formattmplCode": 'yeSys',
			// 	'pId': 'yeSys',
			// 	'tmplName': '数量外币式',
			// 	'agencyCode': '*',
			// 	'acctCode': '*',
			// 	'tmplCode': '',
			// 	'isLeaf': '0',
			// 	'isadd': '1',
			// 	'fullName': '余额表数量外币式'
			// }]
		}
		var rptStyleJson = {
			'mxSanlSys':'SANLAN',
			'mxShulSys':'SHULIANG',
			'mxWbSys':'WAIBI',
			'mxSlwbSys':'SHULWAIB',
			'zzSanlSys':'SANLAN',
			'zzShulSys':'WAIBI'

		}
		//获取门户信息
		var svData;
		var setYear;
		var user;
		//定义数据对象
		var searchData = {};
		//获取表格数据对象
		var getTable = {};
		var sorttmplValueArr = [];
		return {
			//数组去重
			uniqueArray: function (array, key) {
				var result = (array[0] == undefined) ? [] : [array[0]];
				for (var i = 1; i < array.length; i++) {
					var item = array[i];
					var repeat = false;
					for (var j = 0; j < result.length; j++) {
						if (item[key] == result[j][key]) {
							repeat = true;
							break;
						}
					}
					if (!repeat) {
						result.push(item);
					}
				}
				return result;
			},  
			download:function (filename, text) {
				var element = document.createElement('a');
				element.setAttribute('href', filename);
				element.setAttribute('download', text);
				
				element.style.display = 'none';
				document.body.appendChild(element);
				
				element.click();
				
				document.body.removeChild(element);
			},
			setget:function(){
				setchange = true
				var timeFn = setInterval(function(){
					if(setchange) { // 第二个没返回
						ufma.get("/gl/vou/requestQueryCheck", "",function(data) {});
					} else {
						clearInterval(timeFn);
					}
				}, 50 * 1000);
				setTimeout(function(){
					setchange = false
				},1800*1000)
			},
			showBtn: function(showBtns) {
				if(showBtns.length > 4) {
					var $moreBtns = $('<div class="btn-group pull-right" style="margin-left: 8px;">' +
						'<button class="btn btn-default btn-sm dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'更多 <span class="caret"></span></button><ul class="dropdown-menu"></ul></div>');
					for(var s = 0; s < showBtns.length; s++) {
						if(s <= (showBtns.length - 4)) {
							var $li = $('<li><a href="javascript:;" id="' + showBtns[s].id + '" class="' + showBtns[s].class + ' btn-permission">' + showBtns[s].name + '</a></li>');
							$moreBtns.find('ul.dropdown-menu').prepend($li);
						} else {
							var $div = $('<div class="btn-group pull-right" style="margin-left: 8px;">' +
								'<button type="button" id="' + showBtns[s].id + '"class="btn btn-sm ' + showBtns[s].class + ' btn-permission">' + showBtns[s].name + '</button></div>');
							$('.rpt-method-tip').append($div);
						}
					}
					$('.rpt-method-tip').prepend($moreBtns);
				} else if(showBtns.length <= 4 && showBtns.length > 0) {
					for(var s = 0; s < showBtns.length; s++) {
						var $div = $('<div class="btn-group pull-right">' +
							'<button type="button" id="' + showBtns[s].id + '" style="margin-left: 8px;" class="btn btn-sm ' + showBtns[s].class + ' btn-permission">' + showBtns[s].name + '</button></div>');
						$('.rpt-method-tip').append($div);
					}
				}
			},
			tf: function (str) {
				var newStr = str.toLowerCase();
				var endStr = "";
				if (newStr.indexOf("_") != "-1") {
					var arr = newStr.split("_");
					for (var i = 1; i < arr.length; i++) {
						arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
					}
					endStr = arr.join("")
				} else {
					endStr = newStr
				}
				return endStr;
			},
			getPdfCatalognew:function(datas){
				var xhr = new XMLHttpRequest()
				var formData = new FormData()
				formData.append('reportCode', 'RPT_CATALOG_PRINT')
				formData.append('templId', "*")
				formData.append('groupDef', JSON.stringify(datas))
				if (datas.length == 0) {
					ufma.showTip('发生额与余额都为零，不需打印')
					return false;
				}
				xhr.open('POST', '/pqr/api/printpdfbydata', true)
				xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
				xhr.responseType = 'blob'

				//保存文件
				xhr.onload = function (e) {
					if (xhr.status === 200) {
						if (xhr.status === 200) {
							var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
							window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
						}
					}
				}

				//状态改变时处理返回值
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4) {
						//通信成功时
						if (xhr.status === 200) {
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
			},
			getPdfData: function (result) {
				if (result.data.data.length == 0) {
					ufma.showTip('发生额与余额都为零，不需打印')
					return false;
				}
				for(var k=0;k<result.data.data.length;k++){
					var tblData = result.data.data[k];
					var datanowqryItems = JSON.parse(JSON.stringify(prjContentsnow.qryItems))
					var ztitle = {}
					var baltitle = {}
					for (var i = 0; i < datanowqryItems.length; i++) {
						var Accs = page.tf(datanowqryItems[i].itemType)
						var accName = Accs + "Name"
						if (datanowqryItems[i].isOutTableShow == '0') {
							ztitle[accName] = datanowqryItems[i].itemTypeName
						}
					}
					var datas = {
						"GL_RPT_PRINT": tblData,
					}
					if ($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_JOURNAL' || $(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_BAL') {
						var j = 1;
						var ntitle = {}
						for (var z in ztitle) {
							ntitle['ext' + j + 'Name'] = ztitle[z]
							for (var i = 0; i < tblData.length; i++) {
								tblData[i]['accItemExt' + j] = tblData[i][z]
							}
							j++
						}
						if(j==1){
						}
						datas = {
							"GL_RPT_PRINT": tblData,
							'GL_RPT_HEAD_EXT': [ntitle]
						}
					}
					if ($(".accnab").find('.active').find('a').attr('forCode') != 'GL_RPT_BAL' && $(".accnab").find('.active').find('a').attr('forCode') != 'GL_RPT_JOURNAL') {
						datas = {
							"GL_RPT_PRINT": tblData,
							'GL_RPT_HEAD_EXT': [ntitle]
						}
					}
					page.pdfprintData.push(datas)
				}
			},
			getPdfDatayun: function (result) {
				setchange = false
				if (result.data.data.length == 0) {
					// ufma.showTip('发生额与余额都为零，不需打印')
					return false;
				}
				for(var k=0;k<result.data.data.length;k++){
					var tblData = result.data.data[k];
					var datanowqryItems = JSON.parse(JSON.stringify(prjContentsnow.qryItems))
					var ztitle = {}
					var theadprint = []
					for (var i = 0; i < datanowqryItems.length; i++) {
						var Accs = page.tf(datanowqryItems[i].itemType)
						var accName = Accs + "Name"
						if (datanowqryItems[i].isOutTableShow == '0') {
							var runs = {
								title:datanowqryItems[i].itemTypeName,
								key:accName
							}
							theadprint.push(runs)
						}
					}
					var datas = {
						"GL_RPT_PRINT": tblData,
					}
					if ($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_JOURNAL') {
						var j = 1;
						var ntitle = {}
						for (var z in ztitle) {
							ntitle['ext' + j + 'Name'] = ztitle[z]
							for (var i = 0; i < tblData.length; i++) {
								tblData[i]['accItemExt' + j] = tblData[i][z]
							}
							j++
						}
						if(j==1){
						}
						var runNum = page.rowNum
						var outTableData = {}
						outTableData.agency= searchData.agencyCode+' '+searchData.agencyName
						outTableData.times = $("#startDate").getObj().getValue()+'至'+$("#endDate").getObj().getValue()
						outTableData.acco = nowout
						outTableData.printor = svData.svUserName
						outTableData.startPage = 1
						outTableData.logo = '/pf/pub/css/logo.png'
						outTableData.date = page.svTransDate
						outTableData.title = '明细账'
						outTableData.showWatermark = true
						var pagelen = tblData.length
						outTableData.totalPage= Math.ceil(pagelen/runNum)
						var resultdata = {
							tableHead:{"drColumns":theadprint},
							tableData:tblData,
							outTableData:outTableData
						}
						htmlprint += YYPrint.engine(page.medata.template,page.medata.meta, resultdata);
					}
					if ($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_LEDGER') {
						var runNum = page.rowNum
						var outTableData = {}
						outTableData.agency= searchData.agencyCode+' '+searchData.agencyName
						outTableData.times = $("#startDate").getObj().getValue()+'至'+$("#endDate").getObj().getValue()
						outTableData.acco = nowout
						outTableData.printor = svData.svUserName
						outTableData.startPage = 1
						outTableData.logo = '/pf/pub/css/logo.png'
						outTableData.date = page.svTransDate
						outTableData.title = '总账'
						outTableData.showWatermark = true
						var pagelen = tblData.length
						outTableData.totalPage= Math.ceil(pagelen/runNum)
						var resultdata = {
							tableHead:{},
							tableData:tblData,
							outTableData:outTableData
						}
						htmlprint += YYPrint.engine(page.medata.template,page.medata.meta, resultdata);
					}
				}
				
			},
			getPdf: function (result,responseIdall,isdowload,textss) {
				ufma.hideloading()
				ufma.showloading('正在生成打印文件，请耐心等待...')
				var responseId;
				if(responseIdall!=undefined){
					responseId = responseIdall
				}else{
					responseId = result.data.printData.responseId
				}
				if($.isNull(responseId)){
					if(result.data.printData[0]!=undefined){
						var printdatass = result.data.printData
						ufma.hideloading()
						ufma.showModal('tableprint', 1200, 400);
						var trs = ''
						var d = 1;
						var datas = searchData.agencyCode+" "+searchData.agencyName+"-"+searchData.acctCode+" "+searchData.acctName+"-"+$(".accnab").find('.active').find('a').text()+'-'+"1至12期间"+svData.svTransDate
						for(var i=0;i<printdatass.length;i++){
							var ds =d+2
							trs+="<tr><td>"+datas+"-"+d+"-"+ds+"</td><td>"+d+"-"+ds+"</td><td responseId='"+printdatass[i]+"'><a class='pdfdowload'>下载<a><a class='pdfprinttable'>打印</a></td></tr>"
							d+=2
						}
						$("#printdowloadtable").find('tbody').html(trs)
					}else{
						ufma.showTip('发生额与余额都为零，不需打印')
					}
					return false;
				}
				function pdfcc(){
					$.ajax({
						type: "get",
						url: "/pqr/api/getSyncPdfFile/"+responseId,
						dataType: "json",
						async: false,
						success: function(data) {
							if(data.code == '500'){
								ufma.hideloading()
								ufma.showTip(data.result)
							}else if(data.code!='200'){
								setTimeout(function(){
									pdfcc()
								},1000)
							}else {
								ufma.hideloading()
								if($.isNull(isdowload)){
									window.open(decodeURIComponent(data.result), '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100') 
								}else{
									page.download(decodeURIComponent(data.result),textss+'.pdf')
								}
							}
						},
						error: function() {}
					});
				}
				pdfcc()
			},
			getpdfcatalog:function(result){
				var catalogid = result.catalogGuid
				var rptTypeName = "未命名";
				if($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_JOURNAL'){
					rptTypeName = "明细账";
				}else if($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_LEDGER'){
					rptTypeName = "总账";
				}
				ufma.ajaxDef('/gl/rpt/getCatalogGuid','post',{"id":catalogid},function(datas){
					var GL_RPT_CATALOG_HEAD =[{
						"titleType": '科目'+rptTypeName+'目录',
						"dwztControl":searchData.agencyCode+' '+searchData.agencyName+' '+searchData.acctCode+' '+searchData.acctName,
						"dyrq": svData.svTransDate,
						"dyr": svData.svUserName
					}]
					var datass = [{
						"GL_RPT_CATALOG_HEAD": GL_RPT_CATALOG_HEAD,
						"GL_RPT_CATALOG_DATA":datas.data
					}]
					var xhr = new XMLHttpRequest()
					var formData = new FormData()
					formData.append('reportCode', 'RPT_CATALOG_PRINT')
					formData.append('templId', "*")
					formData.append('groupDef', JSON.stringify(datass))
					xhr.open('POST', '/pqr/api/printpdfbydata', true)
					xhr.setRequestHeader('context-type', 'text/xml;charset=utf-8')
					xhr.responseType = 'blob'
					//保存文件
					xhr.onload = function (e) {
						if (xhr.status === 200) {
							if (xhr.status === 200) {
								setchange = false
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
								window.open(content, '_blank', 'titlebar=no,location=no,toolbar=no,menubar=no;top=100')
							}
						}
					}

					//状态改变时处理返回值
					xhr.onreadystatechange = function () {
						if (xhr.readyState === 4) {
							//通信成功时
							if (xhr.status === 200) {
								setchange = false
								//交易成功时
								ufma.hideloading();
							} else {
								setchange = false
								var content = decodeURIComponent(xhr.getResponseHeader('Content-Disposition'))
								//提示框，各系统自行选择插件
								alert(content)
								ufma.hideloading();
							}
						}
					}
					xhr.send(formData)
				})
			},
			getExcel: function (result) {
				setchange = false
				var datas = page.exportExcelData;
				if(datas.length == 0){
					ufma.showTip("没有数据需要导出");
					ufma.hideloading();
					return;
				}
				var rptTypeName = "未命名";
				if($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_JOURNAL'){
					rptTypeName = "明细账";
				}else if($(".accnab").find('.active').find('a').attr('forCode')  == 'GL_RPT_LEDGER'){
					rptTypeName = "总账";
				}
				var argu = {
					qryItems:prjContentsnow.qryItems,
					exportData:datas,
					rptTypeName:rptTypeName,
					rptType:$(".accnab").find('.active').find('a').attr('forCode') 
				}
				var url = "/pub/file/batchExport";
				ufma.post(url,argu,function(rst){
					if(rst.flag == 'success'){
						window.location.href = "/pub/file/download?attachGuid=" + rst.data.attachGuid + '&fileName=' + decodeURI(rst.data.fileName);
					}else{
						ufma.showTip("导出失败",function(){},'fail');
					}
					ufma.hideloading();
				});
			},
			getExcelData: function (result) {
				if (result.data.data.length == 0) {
					// ufma.showTip('发生额与余额都为零，不需导出')
					return false;
				}
				for(var k=0;k<result.data.data.length;k++){
					var tblData = result.data.data[k];
					var datanowqryItems = JSON.parse(JSON.stringify(prjContentsnow.qryItems))
					var ztitle = {}
					var baltitle = {}
					for (var i = 0; i < datanowqryItems.length; i++) {
						var Accs = page.tf(datanowqryItems[i].itemType)
						var accName = Accs + "Name"
						if (datanowqryItems[i].isOutTableShow == '0') {
							ztitle[accName] = datanowqryItems[i].itemTypeName
						}
					}
					var datas = {
						"GL_RPT_PRINT": tblData,
					}
					if ($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_JOURNAL' || $(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_BAL') {
						var j = 1;
						var ntitle = {}
						for (var z in ztitle) {
							ntitle['ext' + j + 'Name'] = ztitle[z]
							for (var i = 0; i < tblData.length; i++) {
								tblData[i]['accItemExt' + j] = tblData[i][z]
							}
							j++
						}
						if(j==1){
						}
						datas = {
							"GL_RPT_PRINT": tblData,
							'GL_RPT_HEAD_EXT': [ntitle]
						}
					}
					if ($(".accnab").find('.active').find('a').attr('forCode')  != 'GL_RPT_BAL' && $(".accnab").find('.active').find('a').attr('forCode')  != 'GL_RPT_JOURNAL') {
						datas = {
							"GL_RPT_PRINT": tblData,
							'GL_RPT_HEAD_EXT': [ntitle]
						}
					}
					page.exportExcelData.push(datas)
				}
				
			},
			getAlPrt:function(){
				var seacData = {
					agencyCode: searchData.agencyCode,
					acctCode: searchData.acctCode,
					componentId: "GL_RPT",
					accsCode:page.nowAccsCode
				}
                ufma.ajaxDef('/gl/vouPrint/getPrtTmplPdfNew', "post",seacData, function (data) {
					var NDdata = []
                    for (var i = 0; i < data.data.length; i++) {
                        if(mxdata[data.data[i].formattmplCode]!=undefined){
							data.data[i].pIdName = '明细账'
							data.data[i].forCode = 'GL_RPT_JOURNAL'
                        }
                        if(zzdata[data.data[i].formattmplCode]!=undefined){
                            data.data[i].pIdName = '总账'
							data.data[i].forCode = 'GL_RPT_LEDGER'
						}
						
						if (data.data[i].agencyCode == "*") {
							data.data[i].dataname = data.data[i].tmplName + '(系统级)'
						} else {
							data.data[i].dataname = data.data[i].tmplName
						}
                        data.data[i].id = data.data[i].tmplGuid
                        data.data[i].isLeaf = '1'
						if(mxdata[data.data[i].formattmplCode]!=undefined || zzdata[data.data[i].formattmplCode]!=undefined){
							NDdata.push(data.data[i])
						}
					}
					page.getAllPrtData = NDdata
				})
				var ts = '';
				for (var i = 0; i < page.getAllPrtData.length; i++) {
					ts += '<li><a href="javascript:;" forCode="'+page.getAllPrtData[i].forCode+'" formattmplCode="'+page.getAllPrtData[i].formattmplCode+'" agencyCode = "' + page.getAllPrtData[i].agencyCode + '"  templId = ' + page.getAllPrtData[i].tmplCode + ' dataname="'+page.getAllPrtData[i].dataname+'"  valueid="' + page.getAllPrtData[i].tmplGuid + '">' +  page.getAllPrtData[i].pIdName +'-'+ page.getAllPrtData[i].dataname+ '</a></li>'
				}
				$(".accnab").html(ts);
				if (page.getAllPrtData.length > 0) {
					$(".accnab li").eq(0).addClass('active').css('margin-left', "0px");
				}
				ulL = $(".accnab")[0].offsetWidth;
				liL = 0
				for (var i = 0; i < $(".accnab li").length; i++) {
					liL += $(".accnab li").eq(i)[0].offsetWidth
				}
				$(".accnab").css('width',$("#navdiv")[0].offsetWidth-138+'px')
				ulL = $(".accnab")[0].offsetWidth;
				if (ulL > liL) {
					$("#btn-left").hide()
					$("#btn-right").hide()
				} else {
					$("#btn-left").show()
					$("#btn-right").show()
				}
				
			},
			//根据单位、账套、账簿类型和账簿样式获取模板数据，接口：/gl/GlRpt/getPrtFormatList
			initRptTemplate: function (result) {
				var data = result.data;
				var $op = '';
				$('#rptTemplate').html('')
				//循环填入账簿样式
				for (var i = 0; i < data.length; i++) {
					var dataname = ''
					if (data[i].agencyCode == "*") {
						dataname = data[i].tmplName + '(系统级)'
					} else {
						dataname = data[i].tmplName
					}
					//判断是否是默认
					if (data[i].defaultTmpl == "1" || data[i].tmplGuid == destroyGuid) {
						$op += '<option agencyCode = "' + data[i].agencyCode + '"  templId = ' + data[i].tmplCode + ' valueid="' + data[i].tmplGuid + '" selected="selected">' + dataname + '</option>'
					} else {
						$op += '<option agencyCode = "' + data[i].agencyCode + '" templId = ' + data[i].tmplCode + ' valueid="' + data[i].tmplGuid + '">' + dataname + '</option>'
					}
				}
				// if(data.length == 0){
				// 	$op += '<option agencyCode = "' + data[i].agencyCode + '" templId = '' valueid="' + data[i].tmplGuid + '">' + dataname + '</option>'
				// }
				$('#rptTemplate').append($op);
				// page.getTableData($('#rptTemplate').find("option:selected").attr('valueid'))
			},

			//根据单位、账套和账簿类型获取账簿样式，接口：/gl/GlRpt/RptFormats
			initRptStyle: function (result) {
				var $op = ''
				for (var i = 0; i < result.length; i++) {
					$op += '<option value="' + result[i].id + '">' + result[i].tmplName + '</option>';
				}

				$('#rptStyle').html($op);

				var postSetData = {
					agencyCode: searchData.agencyCode,
					acctCode: searchData.acctCode,
					componentId: "GL_RPT",
					accsCode:page.nowAccsCode,
					formatTmplCode: $(".accnab").find('.active').find('a').attr('formattmplCode')
				};

				//加载模板
				ufma.post("/gl/vouPrint/getPrtTmplPdfNew", postSetData, page.initRptTemplate);
			},

			//填入账簿类型，接口：/gl/enumerate/RPT_TYPE
			initRptType: function () {
				//循环填入账簿类型
				var $op = ''
				for (var i = 0; i < zhuls.length; i++) {
					$op += '<option valuecode="' + zhuls[i].code + '" value="' + zhuls[i].id + '">' + zhuls[i].tmplName + '</option>';
				}

				$('#rptType').html($op);
				//获取第一个数据的账簿类型
				searchData.componentId = zhuls[0].id;
				var datas = zizhuls[zhuls[0].id]
				//加载账簿样式
				page.initRptStyle(datas)
			},
			//设置本期
			setMonth: function () {
				var dd = new Date(page.svTransDate);
				var ddYear = dd.getFullYear();
				$("#startDate").getObj().setValue(ddYear + '-01')
				$("#endDate").getObj().setValue(ddYear + '-12')
				//				$('#rptPrint').find("#startDate").datetimepicker('setDate',(new Date()));
				//				$('#rptPrint').find("#endDate").datetimepicker('setDate',(new Date()));
			},

			//设置本年
			setYear: function () {
				var dd = new Date(page.svTransDate);
				var ddYear = dd.getFullYear();
				$("#startDate").getObj().setValue(ddYear + '-01')
				$("#endDate").getObj().setValue(ddYear + '-12')
				//				$('#rptPrint').find("#startDate").datetimepicker('setDate',(new Date(ddYear,0)));
				//				$('#rptPrint').find("#endDate").datetimepicker('setDate',(new Date(ddYear,11)));
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				svData = ufma.getCommonData();
				var objBtns = [
					//此功能屏蔽
					{
						'id': "btn-export-excel",
						"name": "导出",
						"class": "btn-default  btn-export-excel"
					},{
						"id": "btn-print-cover",
						"name": "打印封面",
						"class": "btn-default btn-print-cover"
					// },{
					// 	"id": "btn-print-catalogAuto",
					// 	"name": "自动打印目录",
					// 	"class": "btn-default btn-print-catalog"
					},{
						"id": "btn-print-set-sys",
						"name": "系统级打印方案设置",
						"class": "btn-default btn-print-set-sys"
					},{
						id: "btn-print-set",
						name: "打印方案设置",
						class: "btn-default btn-print"
					},{
						"id": "btn-print-catalog",
						"name": "打印目录",
						"class": "btn-default btn-print-catalog"
					},{
						"id": "btn-print-delcatalog",
						"name": "清除页码信息",
						"class": "btn-default btn-print-catalog"
					// },{
					// 	"id": "btn-print-yun",
					// 	"name": "云打印",
					// 	"class": "btn-default btn-print-yun"
					},{
						'id': "btn-print-pdf",
						"name": "打印",
						"class": "btn-default btn-print"
					}
				];
				page.showBtn(objBtns)
				ufma.isShow(page.reslist);
				page.svTransDate = svData.svTransDate;
				$("#startDate").ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: ''
				}).on('change', function () {
					var dd = page.svTransDate
					var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
					var year = myDate.getFullYear();
					var startdate = $('#startDate').getObj().getValue();
					var enddate = $('#endDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						setTimeout(function () {
							var mydate = new Date(svData.svTransDate);
							Year = mydate.getFullYear();
							Month = (mydate.getMonth() + 1);
							Month = Month < 10 ? ('0' + Month) : Month;
							$('#startDate').getObj().setValue(Year + '-' + Month);
						}, 100)
					} else {
						if (page.saveskeys == true) {
							page.saveskeys = false
							// var Guids = $('#rptTemplate').find("option:selected").attr('valueid')
							// page.getTableData(Guids)
						}
					}
				})
				$("#endDate").ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: '',
				}).on('change', function () {
					var dd = page.svTransDate
					var myDate = new Date(Date.parse(dd.replace(/-/g, "/")));
					var year = myDate.getFullYear();
					var startdate = $('#startDate').getObj().getValue();
					var enddate = $('#endDate').getObj().getValue();
					var startD = new Date(Date.parse(startdate.replace(/-/g, "/")));
					var endD = new Date(Date.parse(enddate.replace(/-/g, "/")));
					var days = (endD.getTime() - startD.getTime()) / (1000 * 60 * 60 * 24)
					if (days < 0) {
						ufma.showTip("日期区间不符", function () { }, "warning");
						setTimeout(function () {
							$('#endDate').getObj().setValue($('#startDate').getObj().getValue());
						}, 100)
					} else {
						if (page.saveskeys == true) {
							page.saveskeys = false
							// var Guids = $('#rptTemplate').find("option:selected").attr('valueid')
							// page.getTableData(Guids)
						}
					}
				})
				this.setMonth();
				//修改权限  将svUserCode改为 svUserId  20181012
				user = svData.svUserId;
				// user = svData.svUserCode;
				ufma.isShow(page.reslist);
				setYear = svData.svSetYear;

				//账套选择
				page.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function (data) {
						searchData.acctCode = data.code;
						searchData.acctName = data.name;
						page.nowAccsCode = data.accsCode;
						page.isParallelsum = data.isParallel;
						page.isDoubleVousum = data.isDoubleVou;
						var params = {
							selAgecncyCode: searchData.agencyCode,
							selAgecncyName: searchData.agencyName,
							selAcctCode: searchData.acctCode,
							selAcctName: searchData.acctName
						}
						ufma.setSelectedVar(params);
						$('#rptPrint #rptStyle').html('');
						$('#rptPrint #rptTemplate').html('');
						destroyGuid = ''
						//根据单位和账套获取账簿类型
						$('#rptPrint #rptType').html('');
						page.getAlPrt()
						// page.initRptType()
						// ufma.get("/gl/enumerate/RPT_TYPE","",page.initRptType);
					}
				});

				//单位选择
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					valueField: "id",
					textField: "codeName",
					readonly: false,
					placeholder: "请选择单位",
					icon: "icon-unit",
					onchange: function (data) {
						searchData.agencyCode = data.id;
						searchData.agencyName = data.name;
						//改变单位,账套选择内容改变
						var url = '/gl/eleCoacc/getRptAccts';
						var callback = function (result) {
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});
							var svFlag = $.inArrayJson(result.data, "code", svData.svAcctCode);
							if (svFlag != undefined) {
								page.cbAcct.val(svData.svAcctCode);
							} else {
								page.cbAcct.val(result.data[0].code);
							}
						}
						ufma.get(url, { 'userId': svData.svUserId, 'setYear': svData.svSetYear, 'agencyCode': searchData.agencyCode }, callback);
						//切换单位后取消全选
						$(".datatable-group-checkable,.checkboxes").prop("checked", false);
					}
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", svData.svAgencyCode);
					if (agyCode != undefined) {
						page.cbAgency.val(svData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});

			},
			rptOptionArr: function () {
				var rptOptionArr = [];
				$('#rptPrint .rptOption').each(function () {
					var rptOptionObj = {};
					var flag = $(this).prop("checked");
					if (flag) {
						rptOptionObj.defCompoValue = "Y";
					} else {
						rptOptionObj.defCompoValue = "N";
					}
					rptOptionObj.optCode = $(this).val();
					if ($(this).val() == "IS_JUSTSHOW_OCCFISPERD") {
						rptOptionObj.optName = "只显示有发生期间";
					} else if ($(this).val() == "IS_INCLUDE_UNPOST") {
						rptOptionObj.optName = "含未记账凭证";
					} else if ($(this).val() == "IS_HAVE_AMTANDCUR") {
						rptOptionObj.optName = "发生额及余额为零不打印";
					}
					rptOptionArr.push(rptOptionObj);
				})
				return rptOptionArr;
			},
			getTableData: function (Guid) {
				var searchsData = {
					acctCode: searchData.acctCode,
					agencyCode: searchData.agencyCode,
					prjCode: Guid,
					rptType: 'GL_RPT_ALLPRINT',
					setYear: svData.svSetYear
				}
				ufma.showloading('正在查询，请耐心等待...')
				function searchss() {
					ufma.get('/gl/rpt/prj/getPrjcontent', searchsData, function (result) {
						if (!$.isNull(result.data)) {
							var prjContent = JSON.parse(result.data.prjContent)
							prjContent.endFisperd = (new Date($("#endDate").getObj().getValue()).getMonth()) + 1
							prjContent.endDate = $('#endDate').getObj().getValue()
							prjContent.startFisperd = (new Date($("#startDate").getObj().getValue()).getMonth()) + 1
							prjContent.startDate = $('#startDate').getObj().getValue()
							if (prjContent.qryItems.length == 0) {
								prjContent.qryItems.push({
									"condType": "cond",
									"isShowCode": "1",
									"isShowFullName": '1',
									"isOutTablleShow": "0",
									"printLevel": "1",
									"isGradsum": "1",
									"itemType": "ACCO",
									"itemTypeName": "会计科目",
									"items": []
								})
							} else {
							}
							prjContentsnow = prjContent
							var argu = {
								acctCode: searchData.acctCode,//账套编码
								acctName: searchData.acctName,//账套名称
								agencyCode: searchData.agencyCode,//单位编码
								prjCode:$(".accnab").find('.active').find('a').attr('valueid'),
								prjName:$(".accnab").find('.active').find('a').attr('dataname'),
								agencyName: searchData.agencyName,//单位名称
								prjContent: prjContent,//方案id
								setYear: svData.svSetYear,//年度
								rptType: 'GL_RPT_ALLPRINT'//编码
							}
							ufma.post('/gl/rpt/getReportData/GL_RPT_ALLPRINT', argu, function (result) {
								ufma.showTip('查询成功', function () { }, 'success')
								page.saveskeys = true
								page.showTable(result)
								ufma.hideloading()
							})
						} else {
							if ($(".accnab").find('.active').find('a').attr('agencyCode') == '*') {
								var savePrjArgu = {}
								savePrjArgu.acctCode = "*"; //账套代码
								savePrjArgu.agencyCode = "*"; //单位代码
								savePrjArgu.prjCode = $(".accnab").find('.active').find('a').attr('valueid'); //方案代码
								savePrjArgu.prjName = $(".accnab").find('.active').find('a').attr('dataname'); //方案名称
								savePrjArgu.prjScope = '3' //方案作用域
								savePrjArgu.maxPageQuantity = 10000
								savePrjArgu.rptType = 'GL_RPT_ALLPRINT'; //账表类型
								savePrjArgu.setYear = svData.svSetYear; //业务年度
								savePrjArgu.userId = svData.svUserId; //用户Id
								savePrjArgu.prjContent = {
									"rptOption": [{
										"defCompoValue": "N",
										"optCode": "IS_INCLUDE_UNPOST",
										"optName": "含未记账凭证"
									}, {
										"defCompoValue": "N",
										"optCode": "IS_HAVE_AMTANDCUR",
										"optName": "发生额及余额为零不打印"
									}, {
										"defCompoValue": "N",
										"optCode": "IS_JUSTSHOW_OCCFISPERD",
										"optName": "只显示有发生期间"
									}],
									"qryItems": [{
										"condType": "cond",
										"isOutTableShow": "1",
										"printLevel": "10",
										"itemLevel": "10",
										"isGradsum": "0",
										"itemType": "ACCO",
										"itemTypeName": "会计科目",
										"isShowCode": "0",
										"isShowFullName": "0",
										"items": []
									}]
								}
								ufma.ajax('/gl/rpt/prj/savePrjForPrt', "post", savePrjArgu, function (result) {
									searchss()
								});
							} else {
								ufma.showTip('当前方案未设置打印内容')
								ufma.hideloading()
								page.saveskeys = true
								page.showTable({
									data: {
										tableHead: {
											'acco': '会计科目'
										},
										tableData: []
									}
								})
							}
						}
					})
				}
				searchss()
			},
			showTable: function (result) {
				if (rptPrintDataTable != undefined) {
					rptPrintDataTable.clear().destroy();
					$("#rptPrint-data").html('<thead></thead><tbody></tbody>')
					$("#rptPrint-tool-bar").find('.slider').remove()
				}
				var tr1 =''
				var tr2 = ''
				var id = 'rptPrint-data';
				var datas = result.data.tableData
				rptPrintDatanew = result.data.tableData
				var columnsArr = []
				var ss = 0
				var ssthead = {}
				var columnDefsArr = []
				var souttabledata ={}
				$.each(result.data.tableHead, function (i, opts) {
					var zi = i.slice(0, i.length - 4)
					if (ssthead[zi] == undefined) {
						var ziname = result.data.tableHead[i].slice(0, result.data.tableHead[i].length - 2)
						ssthead[zi] = 0
						var title = {
							title: ziname,
							data: zi
						}
						columnsArr.push(title)

						var ziCode = zi + 'Code'
						var ziName = zi + 'Name'
						var valses = {
							"targets": [ss],
							"serchable": false,
							"orderable": false,
							"className": "",
							"render": function (data, type, rowdata, meta) {
								if (rowdata[ziCode] != null && rowdata[ziCode] != '') {
									return '<span class="searchTxt" outtabledata="' + rowdata[ziName] + '">' + rowdata[ziCode] + ' ' + rowdata[ziName] + '</span>'
								} else {
									return ''
								}
							}
						}
						ss++
						tr2+='<th>'+ziname+'</th>'
						columnDefsArr.push(valses)
						souttabledata[ziName] = ziCode
					}
				});
				for(var i=0;i<rptPrintDatanew.length;i++){
					var ssn = ''
					var sscn = ''
					for(var j in souttabledata){
						sscn += rptPrintDatanew[i][souttabledata[j]]+' '+rptPrintDatanew[i][j]+' '
						ssn += rptPrintDatanew[i][j]+' '
					}
					rptPrintDatanew[i].souttableCodeName = sscn
					rptPrintDatanew[i].souttableName = ssn
				}
				$.each(prjContentsnow.qryItems, function (i, opts) {
					var zi = page.tf(opts.itemType)
					var keys = []
					for (var j = 0; j < opts.items.length; j++) {
						keys.push(opts.items[j].code + ' ' + opts.items[j].name)
					}
					var itemshows = keys.join(',')
					if (ssthead[zi] == undefined) {
						var ziname = opts.itemTypeName
						ssthead[zi] = 0
						var title = {
							title: ziname,
							data: zi
						}
						columnsArr.push(title)
						var ziCode = zi + 'Code'
						var ziName = zi + 'Name'
						var valses = {
							"targets": [ss],
							"serchable": false,
							"orderable": false,
							"className": "",
							"render": function (data, type, rowdata, meta) {
								if (itemshows != '') {
									return '<span class="searchTxt" title =" ' + itemshows + '">' + itemshows + '</span>'
								} else {
									return ''
								}
							}
						}
						ss++; 
						tr2+='<th>'+ziname+'</th>'
						columnDefsArr.push(valses)
					}
				})
				tr1+="<tr><th colspan="+ss+">目录</th><th colspan='2'>总页码</th></tr>"
				columnsArr.push({
					title: '打印页码',
					data: 'pageContent'
				})
				columnDefsArr.push({
					"targets": [ss],
					"serchable": false,
					"orderable": false,
					"className": "col-check",
					"render": function (data, type, rowdata, meta) {
						return rowdata.pageContent ==null?"":'<span class="text-left float-left">' + rowdata.pageContent + '</span>'
					}
				})
				ss++;
				columnsArr.push({
					title: '预览',
					data: 'row'
				})
				columnDefsArr.push({
					"targets": [ss],
					"serchable": false,
					"orderable": false,
					"className": "col-check",
					"render": function (data, type, rowdata, meta) {
						return '<a class="btn btn-icon-only btn-sm btn-permission btn-print btn-print-preview"  values="' + meta.row + '" data-toggle="tooltip" action= "" title="打印预览">'
							+ '<span class="glyphicon icon-print-preview"></span></a>'
					}
				})
				$("#rptPrint-data").html("<thead id='rptPrint-data-thead'></thead><tbody></tbody>")
				$("#rptPrint-data-thead").html(tr1+"<tr>"+tr2+"<th>页码</th><th>预览</th></tr>")
				// $('#rptPrint-data_wrapper').ufScrollBar('destroy');
				rptPrintDataTable = $("#" + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": datas,
					"bFilter": false,    //去掉搜索框
					"bLengthChange": true,   //去掉每页显示多少条数据
					"processing": true,//显示正在加载中
					// "pageLength": -1,
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, 100000],
						[20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"bSort": false, //排序功能
					"bAutoWidth": false,//表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": columnsArr,
					"columnDefs": columnDefsArr,
					"dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
					"initComplete": function (settings, json) {
						//行checkbox的单选操作
                        /*$("#" + id + " tbody td.nowrap").on("click", function (e) {
                            e.preventDefault();
                            var $ele = $(e.target);
                            var $tr = $ele.closest("tr");
                            if ($tr.hasClass("selected")) {
                                $tr.find("input.checkboxes").prop("checked", false);
                                $tr.removeClass("selected");
                            } else {
                                $tr.find("input.checkboxes").prop("checked", true);
                                $tr.addClass("selected");
                            }
                        });*/
						//批量操作toolbar与分页
						var toolBar = $('#' + id).attr('tool-bar');
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						$(".datatable-group-checkable").prop("checked", false);
						//checkbox的全选操作
						$(".datatable-group-checkable").on("change", function () {
							var isCorrect = $(this).is(":checked");
							$("#" + id + " .checkboxes").each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$(".datatable-group-checkable").prop("checked", isCorrect);
						});
						$('#' + id).closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window),true);
					},
					"drawCallback": function (settings) {
						ufma.dtPageLength($(this));
						$("#rptPrint-data").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						if ($("#rptPrint-data td.dataTables_empty").get(0)) {
							$("#rptPrint-data input.datatable-group-checkable").prop("disabled", true);
							$("#rptPrint-tool-bar input.datatable-group-checkable").prop("disabled", true);
							$('#rptPrint-data .acco-set').hide();
							$('#rptPrint-data #accounting-set').hide();
						} else {
							$("#rptPrint-data input.datatable-group-checkable").prop("disabled", false);
							$("#rptPrint-tool-bar input.datatable-group-checkable").prop("disabled", false);
							$('#rptPrint-data .acco-set').show();
							$('#rptPrint-data #accounting-set').show();
						}
						//操作按钮显示tips
						$('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();
						//权限判断
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window),true);
					}
				});
			},
			getLastDay: function (year, month) {
				var new_year = year;    //取当前的年份          
				var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）          
				if (month > 12) {
					new_month -= 12;        //月份减          
					new_year++;            //年份增          
				}
				var new_date = new Date(new_year, new_month, 1);                //取当年当月中的第一天          
				return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期 
			},
			backTabArgu: function (dom) {
				var tabArgu = {};

				tabArgu.acctCode = searchData.acctCode;//账套代码
				tabArgu.agencyCode = searchData.agencyCode;//单位代码
				tabArgu.acctName = searchData.acctName;
				tabArgu.agencyName = searchData.agencyName;

				tabArgu.prjCode = $(".accnab").find('.active').find('a').attr('valueid');//方案代码
				tabArgu.prjName = $(".accnab").find('.active').find('a').attr('dataname');//方案名称
				tabArgu.prjScope = "";//方案作用域

				tabArgu.rptType = $(".accnab").find('.active').find('a').attr('forCode');//账表类型
				tabArgu.setYear = svData.svSetYear.toString();//业务年度
				tabArgu.userId = svData.svUserId;//用户id
				if($("#startNum").val()!=''){
					tabArgu.startNum = $("#startNum").val()
				}else{
					tabArgu.startNum = 1
				}
				tabArgu.maxPageQuantity = 10000
				tabArgu.prjContent = page.prjContObj(dom);//方案内容
				
				// tabArgu.prjContent.pageLength = page.rowNum
				return tabArgu;
			},
			qryitemslists:function(dom,trss,isExcel){
				var prjContentsnows = JSON.parse(JSON.stringify(prjContentsnow))
				var datanowqryItems = JSON.parse(JSON.stringify(prjContentsnows.qryItems))
				var trssouttable = ''
				if(datanowqryItems[0].isShowCode!=0 || isExcel){
					trssouttable += trss.souttableCodeName
				}else{
					trssouttable += trss.souttableName
				}
				var srrs = []
				var nowlength = 0
				var isacco = false
				for (var z = 0; z < dom.length; z++) {
					var datanowqryItems = JSON.parse(JSON.stringify(prjContentsnows.qryItems))
					for (var i = 0; i < datanowqryItems.length; i++) {
						var Accs = page.tf(datanowqryItems[i].itemType)
						if (datanowqryItems[i].itemType == "ACCO") {
							isacco = true
						}
						var accCode = Accs + "Code"
						var accName = Accs + "Name"
						datanowqryItems[i].batchSeq = z + 1
						if (dom[z][accCode] != '') {
							var itemss = []
							var nowobj = {
								code: dom[z][accCode],
								name: dom[z][accName]
							}
							datanowqryItems[i].items = [nowobj]
							datanowqryItems[i].isShowItem = '1'
							datanowqryItems[i].km = trssouttable
							srrs.push(datanowqryItems[i])
						} else if (datanowqryItems[i].isOutTableShow == '0') {
							datanowqryItems[i].isShowItem = '1'
							var srcs = []
							for (var s = 0; s < datanowqryItems[i].items.length; s++) {
								var nowobj = {
									code: datanowqryItems[i].items[s].code,
									name: datanowqryItems[i].items[s].name
								}
								srcs.push(nowobj)
							}
							datanowqryItems[i].items = srcs
							datanowqryItems[i].km = trssouttable
							srrs.push(datanowqryItems[i])
						}
					}
				}
				if (!isacco) {
					srrs.push({ 
						"km":'',
						"condType":"cond", 
						"isOutTableShow": "0", 
						// "isShowItem":"1",
						"printLevel": "0", 
						"itemLevel": "0", 
						"isGradsum": "1", 
						"itemType": "ACCO", 
						"itemTypeName": "会计科目", 
						"isShowCode": "0", 
						"isShowFullName": "0", 
						"items": [] 
					})
				}
				return srrs
			},
			prjContObj: function (dom) {
				var prjContentsnows = JSON.parse(JSON.stringify(prjContentsnow))
				var datanowqryItems;
				if(prjContentsnows.qryItems!=undefined){
					datanowqryItems = JSON.parse(JSON.stringify(prjContentsnows.qryItems))
				}else{
					return {}
				}
				var srrs = []
				var nowlength = 0
				var isacco = false
				for (var z = 0; z < dom.length; z++) {
					var datanowqryItems = JSON.parse(JSON.stringify(prjContentsnows.qryItems))
					for (var i = 0; i < datanowqryItems.length; i++) {
						var Accs = page.tf(datanowqryItems[i].itemType)
						if (datanowqryItems[i].itemType == "ACCO") {
							isacco = true
						}
						var accCode = Accs + "Code"
						var accName = Accs + "Name"
						datanowqryItems[i].batchSeq = z + 1
						if (dom[z][accCode] != '') {
							var itemss = []
							var nowobj = {
								code: dom[z][accCode],
								name: dom[z][accName]
							}
							datanowqryItems[i].items = [nowobj]
							datanowqryItems[i].isShowItem = '1'
							srrs.push(datanowqryItems[i])
						} else if (datanowqryItems[i].isOutTableShow == '0') {
							datanowqryItems[i].isShowItem = '1'
							var srcs = []
							for (var s = 0; s < datanowqryItems[i].items.length; s++) {
								var nowobj = {
									code: datanowqryItems[i].items[s].code,
									name: datanowqryItems[i].items[s].name
								}
								srcs.push(nowobj)
							}
							datanowqryItems[i].items = srcs
							srrs.push(datanowqryItems[i])
						}
					}
				}
				if (!isacco) {
					srrs.push({ 
						"condType":"cond", 
						"isOutTableShow": "0", 
						// "isShowItem":"1",
						"printLevel": "0", 
						"itemLevel": "0", 
						"isGradsum": "1", 
						"itemType": "ACCO", 
						"itemTypeName": "会计科目", 
						"isShowCode": "0", 
						"isShowFullName": "0", 
						"items": [] 
					})
				}
				prjContentsnows.qryItems = srrs
				if ($(".accnab").find('.active').find('a').attr('forCode') == "GL_RPT_BAL" || $(".accnab").find('.active').find('a').attr('forCode') == "GL_RPT_LEDGER") {
					prjContentsnows.startDate = "";//起始日期(如2017-01-01)
					prjContentsnows.endDate = "";//截止日期(如2017-12-31)
					prjContentsnows.startYear = new Date($("#startDate").getObj().getValue()).getFullYear().toString();//起始年度(只有年，如2017)
					prjContentsnows.startFisperd = (new Date($("#startDate").getObj().getValue()).getMonth() + 1).toString();//起始期间(只有月份，如7)
					prjContentsnows.endYear = new Date($("#endDate").getObj().getValue()).getFullYear().toString();//截止年度(只有年，如2017)
					prjContentsnows.endFisperd = (new Date($("#endDate").getObj().getValue()).getMonth() + 1).toString();//截止期间(只有月份，如7)
				} else if ($(".accnab").find('.active').find('a').attr('forCode') == "GL_RPT_JOURNAL") {
					var endYear = new Date($("#endDate").getObj().getValue()).getFullYear();
					var endFisperd = new Date($("#endDate").getObj().getValue()).getMonth() + 1;
					prjContentsnows.startDate = $("#startDate").getObj().getValue() + "-01";//起始日期(如2017-01-01)
					prjContentsnows.endDate = $("#endDate").getObj().getValue() + "-" + page.getLastDay(endYear, endFisperd);//截止日期(如2017-12-31)
					prjContentsnows.startYear = "";//起始年度(只有年，如2017)
					prjContentsnows.startFisperd = "";//起始期间(只有月份，如7)
					prjContentsnows.endYear = "";//截止年度(只有年，如2017)
					prjContentsnows.endFisperd = "";//截止期间(只有月份，如7)
					prjContentsnows.rptCondItem = []
				}
				if ($(".accnab").find('.active').find('a').attr('forCode') == "GL_RPT_LEDGER") {
					prjContentsnows.curCode = "*";//币种代码
				}else{
					prjContentsnows.curCode = "*";//币种代码
				}
				if($("#startNum").val()!=''){
					prjContentsnows.startNum = $("#startNum").val()
				}else{
					prjContentsnows.startNum = 1
				}
				prjContentsnows.rptStyle = $(".accnab").find('.active').find('a').attr('forCode');//账表样式
				if($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_JOURNAL'){
					prjContentsnows.rptTitleName = '明细账';//账表中标题名称
				}else if($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_LEDGER'){
					prjContentsnows.rptTitleName = '总账';//账表中标题名称
				}
				return prjContentsnows
			},
			//页面元素事件绑定使用jquery 的 on()方法
			onEventListener: function () {
				$(document).on("click",'.pdfdowload',function(e){
					page.getPdf('',$(this).parents('td').attr('responseId'),'dowload',$(this).parents('tr').find('td').eq(0).text())
				})
				$(document).on("click",'.pdfprinttable',function(e){
					page.getPdf('',$(this).parents('td').attr('responseId'))
				})
				$(document).on('click', '#btn-right', function () {
					var str = $(".accnab li").eq(0).css('margin-left').toString();
					var strin = str.substring(0, str.length - 2)
					if (parseFloat(strin) != 0) {
						strin = strin.substring(1, strin.length)
					}
					if (liL - ulL - parseFloat(strin) > ulL) {
						var lis = parseFloat(strin) + ulL
						$(".accnab li").eq(0).css('margin-left', '-' + lis + 'px')
					} else {
						var lis = liL - ulL
						$(".accnab li").eq(0).css('margin-left', '-' + lis + 'px')
					}
				})
				$(document).on('click', '#btn-left', function () {
					var str = $(".accnab li").eq(0).css('margin-left').toString();
					var strin = str.substring(0, str.length - 2)
					if (parseFloat(strin) != 0) {
						strin = strin.substring(1, strin.length)
					}
					if (parseFloat(strin) > ulL) {
						var lis = parseFloat(strin) - ulL
						$(".accnab li").eq(0).css('margin-left', '-' + lis + 'px')
					} else {
						var lis = liL - ulL
						$(".accnab li").eq(0).css('margin-left', '0px')
					}
				})
				$(document).on('click', '.searchVou', function () {
					$("#startNum").val('')
					var Guids = $(".accnab").find('.active').find('a').attr('valueid')
					page.getTableData(Guids)
				})
				//期间切换
				$('#rptPrint .setTimes').on('click', 'button', function () {
					if (!$(this).hasClass("btn-primary")) {
						//样式改变
						$(this).removeClass("btn-default").addClass("btn-primary").siblings(".btn.btn-primary").removeClass("btn-primary").addClass("btn-default");
					}
				});
				//点击打印封面按钮
				$('#rptPrint #btn-print-cover').on('click', function () {
					var  rptName='' 
					if(mxdata[$(".accnab").find('.active').find('a').attr('formattmplCode')]!=undefined){
						rptName =mxdata[$(".accnab").find('.active').find('a').attr('formattmplCode')] 
					}
					if(zzdata[$(".accnab").find('.active').find('a').attr('formattmplCode')]!=undefined){
						rptName =zzdata[$(".accnab").find('.active').find('a').attr('formattmplCode')] 
					}
					var postCoverData = {
						agencyName: page.cbAgency.getText(),
						rptName: rptName,
						setYear: setYear
					};
					ufma.open({
						url: 'rptPrintPrintCover.html',
						title: '打印封面',
						width: 1000,
						data: { action: 'printCover', data: postCoverData },
						ondestory: function (data) {
							//窗口关闭时回传的值
						}
					});
				});
				$('#rptPrint #btn-print-set').on('click', function () {
					var postCoverData = {
						"accsCode": page.nowAccsCode,
						"acctCode": searchData.acctCode,
						"agencyCode": searchData.agencyCode,
						"setYear": svData.svSetYear,
						"userId": svData.svUserId,
						"isParallelsum": page.isParallelsum,
						"isDoubleVousum": page.isDoubleVousum,
						"isSys": false
					};
					ufma.open({
						url: 'rptPrintPrintSetpg.html',
						title: '打印方案设置',
						width: 1200,
						data: postCoverData,
						ondestory: function (data) {
							//窗口关闭时回传的值
							page.getAlPrt()
						}
					});
				});
				$('#rptPrint #btn-print-set-sys').on('click', function () {
					var postCoverData = {
						"accsCode": page.nowAccsCode,
						"acctCode": searchData.acctCode,
						"agencyCode": searchData.agencyCode,
						"setYear": svData.svSetYear,
						"userId": svData.svUserId,
						"isParallelsum": page.isParallelsum,
						"isDoubleVousum": page.isDoubleVousum,
						"isSys": true
					};
					ufma.open({
						url: 'rptPrintPrintSetpg.html',
						title: '系统级打印方案设置',
						width: 1200,
						data: postCoverData,
						ondestory: function (data) {
							//窗口关闭时回传的值
							page.getAlPrt()
						}
					});
				}); 
				$(document).on('click', '.btn-print-preview', function () {
					var data = rptPrintDatanew[$(this).attr('values')]
					var backTabArgus = page.backTabArgu([])
					var keys1 = {
						reportCode: $(".accnab").find('.active').find('a').attr('templId'),
						templId: '*'
					}
					$.ajax({
						type: "POST",
						url: "/pqr/api/templbycode",
						dataType: "json",
						data: keys1,
						async: false,
						success: function (data) {
							backTabArgus.prjContent.pageLength = data.data.rptLine
						},
						error: function () { }
					});
					
					if(backTabArgus.prjContent.pageLength == 0){
						ufma.showTip('打印模板配置，账簿打印浮动行数设置不可为零')
						ufma.hideloading();
						return false
					}
					var trss = $(this).parents('tr')
					ufma.showloading('正在组织打印数据，请耐心等待...');
					page.pdfprintData = []
					nowout = data.souttableName
					backTabArgus.prjContent.rptStyle = rptStyleJson[$(".accnab").find('.active').find('a').attr('formattmplCode')]
					backTabArgus.rptStyle = rptStyleJson[$(".accnab").find('.active').find('a').attr('formattmplCode')]
					var prjContentsnows = JSON.parse(JSON.stringify(prjContentsnow))
					backTabArgus.prjContent.qryItems = JSON.parse(JSON.stringify(prjContentsnows.qryItems))
					backTabArgus.prjContent.qryItemsList = []
					var ids = $(".accnab").find('.active').find('a').attr('templId')
					backTabArgus.prjContent.reportCode = ids
					backTabArgus.prjContent.templId = "*"
					var qryitemss= page.qryitemslists([data],trss,false)
					backTabArgus.prjContent.qryItemsList.push(qryitemss) 
					var printUuid = 'rptprint'+new Date().getTime()
					backTabArgus.printUuid = printUuid
					var  hex_md5svUserCode = ''
					if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
						hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
					}
					ufma.post("/gl/rpt/getReportPrintBatchDataNew/" + $(".accnab").find('.active').find('a').attr('forCode'), backTabArgus, function(){

					});
					var $that = $(this);
					function scc(){
						$.ajax({
							url: '/gl/rpt/getReportPrintBatchCollect/' + printUuid+'?ajax=1&rueicode='+hex_md5svUserCode,
							type: "GET", //GET
							async: false, //或false,是否异步
							data: {},
							timeout: 1800000, //超时时间
							dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
							contentType: 'application/json; charset=utf-8',
							success: function(result) {
								if(result.data.flag == 'SUCCESS') {
									// page.getPdfData(result)
									page.getPdf(result)
								} else if(result.data.flag == 'FAIL'){
									ufma.hideloading();
									ufma.showTip(result.data.msg, function() {});
								}else if(result.data.flag == 'CONDUCT'){
									setTimeout(function(){
										scc()
									},1000)
								}
							},
							error: function(jqXHR, textStatus) {
								ufma.showTip(jqXHR.status+'服务器错误', function() {
									ufma.hideloading();
								}, "error");
								$that.attr('disabled',false);
							}
						})
                    }
                    scc()
				})
				$(document).on('click', '#btn-print-pdfs,#btn-print-pdf', function () {
					var datas = []
					ufma.showloading('正在组织打印数据，请耐心等待...');
					page.pdfprintData = []
					var keys1 = {
						reportCode: $(".accnab").find('.active').find('a').attr('templId'),
						templId: '*'
					}
					var lengths =''
					$.ajax({
						type: "POST",
						url: "/pqr/api/templbycode",
						dataType: "json",
						data: keys1,
						async: false,
						success: function (data) {
							lengths = data.data.rptLine
						},
						error: function () { }
					});
					if(lengths == 0){
						ufma.showTip('打印模板配置，账簿打印浮动行数设置不可为零')
						ufma.hideloading();
						return false
					}
					var backTabArgus = page.backTabArgu([])
					backTabArgus.prjContent.pageLength = lengths
					backTabArgus.prjContent.rptStyle = rptStyleJson[$(".accnab").find('.active').find('a').attr('formattmplCode')]
					backTabArgus.rptStyle = rptStyleJson[$(".accnab").find('.active').find('a').attr('formattmplCode')]
					// delete backTabArgus.prjContent.qryItems
					var prjContentsnows = JSON.parse(JSON.stringify(prjContentsnow))
					if(prjContentsnows.qryItems==undefined){
						ufma.showTip('无打印数据可打印')
						ufma.hideloading();
						return false
					}
					backTabArgus.prjContent.qryItems = JSON.parse(JSON.stringify(prjContentsnows.qryItems))
					backTabArgus.prjContent.qryItemsList = []					
					for (var i = 0; i < rptPrintDatanew.length; i++) {
						var data = rptPrintDatanew[i]
						var trss = $("#rptPrint-data .checkboxes").eq(i).parents('tr')
						var qryitemss= page.qryitemslists([data], rptPrintDatanew[i],false)
						backTabArgus.prjContent.qryItemsList.push(qryitemss) 
						nowout = data.souttableName
					}
					
					var ids = $(".accnab").find('.active').find('a').attr('templId')
					backTabArgus.prjContent.reportCode = ids
					backTabArgus.prjContent.templId = "*"
					if(backTabArgus.prjContent.qryItemsList.length==0){
						ufma.showTip('请选中至少一行后打印')
						ufma.hideloading();
						return false
					}
					var printUuid = 'rptprint'+new Date().getTime()
					backTabArgus.printUuid = printUuid
					var  hex_md5svUserCode = ''
					if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
						hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
					}
					ufma.post("/gl/rpt/getReportPrintBatchDataNew/" + $(".accnab").find('.active').find('a').attr("forCode"), backTabArgus, function(){

					});
					var $that = $(this);
					function scc(){
						$.ajax({
							url: '/gl/rpt/getReportPrintBatchCollect/' + printUuid+'?ajax=1&rueicode='+hex_md5svUserCode,
							type: "GET", //GET
							async: false, //或false,是否异步
							data: {},
							timeout: 1800000, //超时时间
							dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
							contentType: 'application/json; charset=utf-8',
							success: function(result) {
								if(result.data.flag == 'SUCCESS') {
									// page.getPdfData(result)
									page.getPdf(result)
								} else if(result.data.flag == 'FAIL'){
									ufma.hideloading();
									ufma.showTip(result.data.msg, function() {});
								}else if(result.data.flag == 'CONDUCT'){
									setTimeout(function(){
										scc()
									},1000)
								}
							},
							error: function(jqXHR, textStatus) {
								ufma.showTip(jqXHR.status+'服务器错误', function() {
									ufma.hideloading();
								}, "error");
								$that.attr('disabled',false);
							}
						})
                    }
                    scc()
				})
				$(document).on('click', '#btn-print-yun', function () {
					var datas = []
					ufma.showloading('正在打印，请耐心等待...');
					page.pdfprintData = []
					htmlprint = ''
					var postSetData = {
						reportCode:'GL_RPT_JOURNAL_SANLAN',
						templId:'*'
					}
					if($(".accnab").find('.active').find('a').attr('formattmplCode')=="mxShulSys"){
						postSetData.reportCode='GL_RPT_JOURNAL_SHULIANG'
					}else if($(".accnab").find('.active').find('a').attr('formattmplCode')=="mxWbSys"){
						postSetData.reportCode='GL_RPT_JOURNAL_WAIBI'
					}else if($(".accnab").find('.active').find('a').attr('formattmplCode')=="mxSlwbSys"){
						postSetData.reportCode='GL_RPT_JOURNAL_SLWB'
					}
					if($(".accnab").find('.active').find('a').attr('formattmplCode')=="zzShulSys"){
						postSetData.reportCode='GL_RPT_LEDGER_WAIBI'
					}
					if ($(".accnab").find('.active').find('a').attr("forCode") == 'GL_RPT_LEDGER') {
						postSetData = {
							reportCode:'GL_RPT_LEDGER_SANLAN',
							templId:'*'
						}
						if($(".accnab").find('.active').find('a').attr('formattmplCode')=="zzShulSys"){
							postSetData.reportCode='GL_RPT_LEDGER_WAIBI'
						}
					}
					$.ajax({
						type: "POST",
						url: "/pqr/api/iprint/templbycode",
						dataType: "json",
						async: false,
						data: postSetData,
						success: function(data) {
							page.medata = JSON.parse(data.data.tempContent)
							page.rowNum = data.data.rowNum
						},
						error: function() {}
					});
					var keys1 = {
						reportCode: $(".accnab").find('.active').find('a').attr('templId'),
						templId: '*'
					}
					var lengths =''
					$.ajax({
						type: "POST",
						url: "/pqr/api/templbycode",
						dataType: "json",
						data: keys1,
						async: false,
						success: function (data) {
							lengths = data.data.rptLine
						},
						error: function () { }
					});
					if(lengths == 0){
						ufma.showTip('打印模板配置，账簿打印浮动行数设置不可为零')
						ufma.hideloading();
						return false
					}
					var backTabArgus = page.backTabArgu([])
					backTabArgus.prjContent.pageLength = lengths
					backTabArgus.prjContent.rptStyle = rptStyleJson[$(".accnab").find('.active').find('a').attr('formattmplCode')]
					delete backTabArgus.prjContent.qryItems
					backTabArgus.prjContent.qryItemsList = []
					for (var i = 0; i < rptPrintDatanew.length; i++) {
						var data = rptPrintDatanew[i]
						var trss = $("#rptPrint-data .checkboxes").eq(i).parents('tr')
						var qryitemss= page.qryitemslists([data], rptPrintDatanew[i],false)
						backTabArgus.prjContent.qryItemsList.push(qryitemss) 
						nowout = data.souttableName
						backTabArgus.prjContent.qryItemsList.push(qryitemss) 
					}
					if(backTabArgus.prjContent.qryItemsList.length==0){
						ufma.showTip('请选中至少一行后打印')
						ufma.hideloading();
						return false
					}
					ufma.showloading('正在加载打印，请耐心等待...');
					setTimeout(function(){
						page.setget()
						ufma.ajaxDef("/gl/rpt/getReportPrintBatchDataNew/" + $(".accnab").find('.active').find('a').attr("forCode"), "post", backTabArgus, page.getPdfDatayun);
						ufma.hideloading();
						if(htmlprint == ''){
							ufma.showTip('发生额与余额都为零，不需打印')
						}else{
							YYPrint.print(htmlprint)
						}
					},200)
					// page.getPdf()
				})
				$(document).on('click', '#btn-print-catalog', function () {
					var checkename = []
					var rptTypeName = "未命名";
					if($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_JOURNAL'){
						rptTypeName = "明细账";
					}else if($(".accnab").find('.active').find('a').attr('forCode') == 'GL_RPT_LEDGER'){
						rptTypeName = "总账";
					}
					var postCoverData = {
						agency: searchData.agencyCode+' '+searchData.agencyName,
						acct: searchData.acctCode+' '+searchData.acctName,
						formatTmplCode:$("#rptType").find("option:selected").html(),
						checkname:checkename
					};
					var sData = {
						agencyCode: searchData.agencyCode,
						acctCode: searchData.acctCode,
						rptType:'GL_RPT_ALLPRINT',
						userId:svData.svUserId,
						rgCode:svData.svRgCode,
						setYear:svData.svSetYear,
						prjCode:$(".accnab").find('.active').find('a').attr('valueid')
					};
					ufma.ajaxDef("/gl/rpt/prj/getPrjcontent", "get", sData, function(data){
						if(!$.isNull(data.data.pageContent)){
							postCoverData.yemadata = JSON.parse(data.data.pageContent)
						}else{
							postCoverData.yemadata = []
						}
						
					});
					var GL_RPT_CATALOG_HEAD =[{
						"titleType": '科目'+rptTypeName+'目录',
						"dwztControl": searchData.agencyCode+' '+searchData.acctCode,
						"dyrq": svData.svTransDate,
						"dyr": svData.svUserName
					}]
					var GL_RPT_CATALOG_DATA =[]
					for(var i=0;i<postCoverData.yemadata.length;i++){
						var that = postCoverData.yemadata[i]
						var key = {
							"accoName":that.accoName,
							"pageAllNum": that.pageAllNum,
							"endPage": that.endPage,
							"totalPage": that.totalPage
						}
						GL_RPT_CATALOG_DATA.push(key)
					}
					var datass = [{
						"GL_RPT_CATALOG_HEAD": GL_RPT_CATALOG_HEAD,
						"GL_RPT_CATALOG_DATA":GL_RPT_CATALOG_DATA
					}]
					page.getPdfCatalognew(datass)
				})
				$(document).on('click', '#btn-print-delcatalog', function () {
					var postCoverData = {
						agencyCode: searchData.agencyCode,
						acctCode: searchData.acctCode,
						rptType:'GL_RPT_ALLPRINT',
						userId:svData.svUserId,
						rgCode:svData.svRgCode,
						setYear:svData.svSetYear,
						prjCode:$(".accnab").find('.active').find('a').attr('valueid')
					};
					ufma.ajaxDef("/gl/rpt/prj/deletePageContent", "post", postCoverData, function(data){
						ufma.showTip('清除成功',function(){},'success')
						var Guids = $(".accnab").find('.active').find('a').attr('valueid')
						page.getTableData(Guids)
					});
				})
				$(document).on('click', '#btn-print-catalogAuto', function () {
					var checkename = []
					for (var i = 0; i < $("#rptPrint-data .checkboxes").length; i++) {
						if ($("#rptPrint-data .checkboxes").eq(i).is(":checked")) {
							var name = $("#rptPrint-data .checkboxes").eq(i).parents('tr').find('td').eq(1).text()
							checkename.push(name)
						}
					}
					if(checkename.length==0){
						ufma.showTip('请选中至少一行后打印')
						return false
					}
					var datas = []
					ufma.showloading('正在打印，请耐心等待...');
					page.exportExcelData = []
					var keys1 = {
						reportCode: $(".accnab").find('.active').find('a').attr('templId'),
						templId: '*'
					}
					var lengths =''
					$.ajax({
						type: "POST",
						url: "/pqr/api/templbycode",
						dataType: "json",
						data: keys1,
						async: false,
						success: function (data) {
							lengths = data.data.rptLine
						},
						error: function () { }
					});
					var backTabArgus = page.backTabArgu([])
					backTabArgus.prjContent.pageLength = lengths
					delete backTabArgus.prjContent.qryItems
					backTabArgus.prjContent.qryItemsList = []
					for (var i = 0; i < rptPrintDatanew.length; i++) {
						var data = rptPrintDatanew[i]
						var qryitemss= page.qryitemslists([data], rptPrintDatanew[i],false)
						backTabArgus.prjContent.qryItemsList.push(qryitemss) 
						nowout = data.souttableName
					}
					if(backTabArgus.prjContent.qryItemsList.length==0){
						ufma.showTip('请选中至少一行后打印')
						ufma.hideloading();
						return false
					}
					page.setget()
					ufma.ajaxDef("/gl/rpt/getReportPrintBatchDataNew/" + $(".accnab").find('.active').find('a').attr('forCode'), "post", backTabArgus, page.getpdfcatalog);
				})
				
				$(document).on('click', '#btn-export-excel', function () {
					var checkename = []
					for (var i = 0; i < $("#rptPrint-data .checkboxes").length; i++) {
						if ($("#rptPrint-data .checkboxes").eq(i).is(":checked")) {
							var name = $("#rptPrint-data .checkboxes").eq(i).parents('tr').find('td').eq(1).text()
							checkename.push(name)
						}
					}
					if(checkename.length==0){
						ufma.showTip('请选中至少一行后导出')
						return false
					}
					var datas = []
					ufma.showloading('正在导出，请耐心等待...');
					page.exportExcelData = []
					var keys1 = {
						reportCode: $('#rptTemplate option:selected').attr('templId'),
						templId: '*'
					}
					var lengths =''
					$.ajax({
						type: "POST",
						url: "/pqr/api/templbycode",
						dataType: "json",
						data: keys1,
						async: false,
						success: function (data) {
							lengths = data.data.rptLine
						},
						error: function () { }
					});
					if(lengths == 0){
						ufma.showTip('打印模板配置，账簿打印浮动行数设置不可为零')
						ufma.hideloading();
						return false
					}
					var backTabArgus = page.backTabArgu([])
					backTabArgus.prjContent.pageLength = lengths
					backTabArgus.prjContent.rptStyle = rptStyleJson[$('#rptStyle option:selected').attr("value")]
					backTabArgus.rptStyle = rptStyleJson[$('#rptStyle option:selected').attr("value")]
					// delete backTabArgus.prjContent.qryItems
					var prjContentsnows = JSON.parse(JSON.stringify(prjContentsnow))
					backTabArgus.prjContent.qryItems = JSON.parse(JSON.stringify(prjContentsnows.qryItems))
					backTabArgus.prjContent.qryItemsList = []					
					for (var i = 0; i < $("#rptPrint-data .checkboxes").length; i++) {
						var data = rptPrintDatanew[i]
						var qryitemss= page.qryitemslists([data], rptPrintDatanew[i],false)
						backTabArgus.prjContent.qryItemsList.push(qryitemss) 
						nowout = data.souttableName
					}
					
					var ids = $('#rptTemplate option:selected').attr('templId')
					backTabArgus.prjContent.reportCode = ids
					backTabArgus.prjContent.templId = "*"
					if(backTabArgus.prjContent.qryItemsList.length==0){
						ufma.showTip('请选中至少一行后打印')
						ufma.hideloading();
						return false
					}
					var printUuid = 'rptprint'+new Date().getTime()
					backTabArgus.printUuid = printUuid
					var  hex_md5svUserCode = ''
					if (typeof hex_md5 === "function" && ufma.getCommonData().svUserCode != null) {
						hex_md5svUserCode = hex_md5(ufma.getCommonData().svUserCode)
					}
					page.setget()
					ufma.ajaxDef("/gl/rpt/getReportExportBatchDataNew/" + $('#rptType option:selected').attr('valuecode'), "post", backTabArgus, function(){});
					var $that = $(this);
					function scc(){
						$.ajax({
							url: '/gl/rpt/getReportPrintBatchCollect/' + printUuid+'?ajax=1&rueicode='+hex_md5svUserCode,
							type: "GET", //GET
							async: false, //或false,是否异步
							data: {},
							timeout: 1800000, //超时时间
							dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
							contentType: 'application/json; charset=utf-8',
							success: function(result) {
								if(result.data.flag == 'SUCCESS') {
									// page.getPdfData(result)
									page.getExcelData(result)
									page.getExcel();
								} else if(result.data.flag == 'FAIL'){
									ufma.hideloading();
									ufma.showTip(result.data.msg, function() {});
								}else if(result.data.flag == 'CONDUCT'){
									setTimeout(function(){
										scc()
									},1000)
								}
							},
							error: function(jqXHR, textStatus) {
								ufma.showTip(jqXHR.status+'服务器错误', function() {
									ufma.hideloading();
								}, "error");
								$that.attr('disabled',false);
							}
						})
                    }
                    scc()
				})
				$(document).on('input propertychange', '#startNum', function () {
					var c = $(this);
					if(/[^\d]/.test(c.val())) { //替换非数字字符  
						var temp_amount = c.val().replace(/[^\d]/g, '');
						$(this).val(temp_amount);
					}
				})
				
			},
			//此方法必须保留
			init: function () {
				this.initPage();
				this.onEventListener();
				ufma.parseScroll();
				ufma.parse();
			}
		}
	}();

	/////////////////////
	page.init();
});
