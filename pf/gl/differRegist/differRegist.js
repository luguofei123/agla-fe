$(function () {
	var pageLength = ufma.dtPageLength('#gridGOV');
	var sendObj = {};
	var balance;
	var agencyCode = '',
		agencyName = '',
		acctName = '',
		acctCode = '';
	var oTable;
	var tablesdata = [];
	var page = function () {
		return {
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
            moneyFormat: function (num) {
				if (num != '' && num!='-') {
					num = (num == null) ? 0 : (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
					if(num==0){
						return 0.00
					}else{
						return num
					}
				} else {
					return 0.00
				}
			},
			//获取单位下拉树
			initAgencyScc: function () {
				page.cbAgency = $('#cbAgency').ufmaTreecombox2({
					valueField: "id",
					textField: "codeName",
					readonly: false,
					placeholder: "请选择单位",
					icon: "icon-unit",
					onchange: function (data) {
						agencyCode = data.id
						agencyName = data.name
						var url = '/gl/eleCoacc/getRptAccts';
						var callback = function (result) {
							page.cbAcct = $("#cbAcct").ufmaCombox2({
								data: result.data
							});
							var svFlag = $.inArrayJson(result.data, "code", page.pfData.svAcctCode);
							if (svFlag != undefined) {
								page.cbAcct.val(page.pfData.svAcctCode);
							} else {
								if (result.data.length > 0) {
									page.cbAcct.val(result.data[0].code);
								} else {
									page.cbAcct.val('');
								}
							}
						}
						ufma.ajaxDef(url, 'get', {
							'userId': page.pfData.svUserId,
							'setYear': page.pfData.svSetYear,
							'agencyCode': data.id
						}, callback);
					}
				});
				page.cbAcct = $("#cbAcct").ufmaCombox2({
					valueField: 'id',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function (data) {
						acctCode = data.code
						acctName = data.name
						var params = {
							selAgecncyCode: agencyCode,
							selAgecncyName: agencyName,
							selAcctCode: acctCode,
							selAcctName: acctName
						}
						ufma.setSelectedVar(params);
						page.loadGrid()
					}
				});
				ufma.ajaxDef("/gl/eleAgency/getAgencyTree", "get", "", function (result) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						data: result.data
					});
					var agyCode = $.inArrayJson(result.data, "id", page.pfData.svAgencyCode);
					if (agyCode != undefined) {
						page.cbAgency.val(page.pfData.svAgencyCode);
					} else {
						page.cbAgency.val(result.data[0].id);
					}
				});
			},
			//初始化页面
			getColumns: function () {
				if (oTable) {
					oTable.fnClearTable();    //清空数据
					oTable.fnDestroy();         //销毁datatable
				}
				var columns = [
					{
						title: '<label style="width:30px" class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="datatable-group-checkable"/>&nbsp;' +
							'<span></span> ' +
							'</label>',
						className: "nowrap",
						data: 'checkbox'
					},
					{
						title: "凭证来源",
						data: "vouSourceName",
						className: 'nowrap tc isprint'
					},
					{
						title: "凭证字号",
						data: 'vouNo',
						className: 'nowrap isprint'
					},
					{
						title: "凭证日期",
						data: 'vouDate',
						className: 'nowrap tc isprint'
					},
					{
						title: "摘要",
						data: "vouDesc",
						className: 'nowrap isprint',
						width: '300'
					},
					{
						title: "制单人",
						data: "inputorName",
						className: 'nowrap isprint'
					}
				];
				if ($('.nav').find('.active').find('a').attr('code') != '0') {
					columns.push({
						title: "登记日期",
						className: "nowrap tc isprint",
						data: "createDate"
					}, {
						title: "差异情况",
						className: "nowrap isprint",
						data: "surplusInfo",
						width: '300'
					}, {
						title: "操作",
						className: "nowrap text-center",
						data: "toobal"
					})
					var tr = '<thead>< tr role = "row" ><th style="width:30px"></th><th>凭证来源</th><th>凭证字号</th><th>凭证日期</th>' +
						'<th>摘要</th><th>制单人</th><th>登记日期</th><th>差异情况</th><th>操作</th></tr ></thead >'
					$("#gridGOV").html(tr)
				} else {
					columns.push({
						title: "操作",
						className: "nowrap text-center",
						data: "toobal"
					})
					var tr = '<thead>< tr role = "row" ><th style="width:30px"></th><th>凭证来源</th><th>凭证字号</th><th>凭证日期</th>' +
					'<th>摘要</th><th>制单人</th><th>操作</th></tr ></thead >'
					$("#gridGOV").html(tr)
				}
				return columns;
			},
			getcolumnDefs:function(){
				var columnDefs = [{
					"targets": [0],
					"serchable": false,
					"orderable": false,
					"className": "nowrap",
					"render": function (data, type, rowdata, meta) {
						return '<label  style="width:30px" class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input class="djcheck" type="checkbox" class="checkboxes" data-guid="' + rowdata.vouGuid + '" />&nbsp;' +
							'<span></span> ' +
							'</label>';
					}
				}, {
					"targets": [2],
					"serchable": false,
					"orderable": false,
					"className": "nowrap",
					"render": function (data, type, rowdata, meta) {
						return '<a class="btn-register-vou" data-guid='+rowdata.vouGuid+'>'+rowdata.vouTypeName + '-' + rowdata.vouNo+'</a>'
					}
				}, {
					"targets": [4],
					"serchable": false,
					"orderable": false,
					"className": "nowrap",
					"render": function (data, type, rowdata, meta) {
						return '<div class="nowalp" style="width:300px" title="' + rowdata.vouDesc + '">' + rowdata.vouDesc + '</div>'
					}
				}]
				if ($('.nav').find('.active').find('a').attr('code') != '0') {
					columnDefs.push({
						"targets": [-2],
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function (data, type, rowdata, meta) {
							return '<a class="nowalp differmingxi" data-createDate=' + rowdata.createDate + ' data-inputorName=' + rowdata.inputorName + ' data-fisPerd=' + rowdata.fisPerd + ' data-surGuid="' + rowdata.surGuid + '" data-guid="' + rowdata.vouGuid + '" style="width:300px;display:inline-block;" title="' + rowdata.surplusInfo + '">' + rowdata.surplusInfo + '</a>'
						}
					})
					columnDefs.push( {
						"targets": [-1],
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function (data, type, rowdata, meta) {
							if (rowdata.isRegistered == '0') {
								return '<a class="btn btn-icon-only btn-sm  btn-permission btn-register btn-register-dj" data-createDate=' + rowdata.createDate + ' data-inputorName=' + rowdata.inputorName + ' data-fisPerd=' + rowdata.fisPerd + ' data-surGuid="' + rowdata.surGuid + '" data-guid="' + rowdata.vouGuid + '"  data-toggle="tooltip" title="登记">' +
									'<span class="glyphicon icon-Certificate"></span></a>'
							} else {
								return '<a class="btn btn-icon-only btn-sm btn-permission btn-register  btn-register-del"  data-createDate=' + rowdata.createDate + ' data-inputorName=' + rowdata.inputorName + ' data-fisPerd=' + rowdata.fisPerd + ' data-surGuid="' + rowdata.surGuid + '" data-guid="' + rowdata.vouGuid + '"  data-toggle="tooltip" action= "" title="取消登记">' +
									'<span class="glyphicon icon-cancel-card"></span></a>'
							}
						}
					})
				}else{
					columnDefs.push( {
						"targets": [-1],
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function (data, type, rowdata, meta) {
							if (rowdata.isRegistered == '0') {
								return '<a class="btn btn-icon-only btn-sm  btn-permission btn-register btn-register-dj" data-createDate=' + rowdata.createDate + ' data-inputorName=' + rowdata.inputorName + ' data-fisPerd=' + rowdata.fisPerd + ' data-surGuid="' + rowdata.surGuid + '" data-guid="' + rowdata.vouGuid + '"  data-toggle="tooltip" title="登记">' +
									'<span class="glyphicon icon-Certificate"></span></a>'
							} else {
								return '<a class="btn btn-icon-only btn-sm btn-permission btn-register  btn-register-del"  data-createDate=' + rowdata.createDate + ' data-inputorName=' + rowdata.inputorName + ' data-fisPerd=' + rowdata.fisPerd + ' data-surGuid="' + rowdata.surGuid + '" data-guid="' + rowdata.vouGuid + '"  data-toggle="tooltip" action= "" title="取消登记">' +
									'<span class="glyphicon icon-cancel-card"></span></a>'
							}
						}
					})
				}
				return columnDefs
			},

			//初始化table
			initGrid: function (data) {
				var Datas = data.data
				tablesdata = data.data
				var columns = page.getColumns();
				var columnDefs = page.getcolumnDefs();
				var id = 'gridGOV'
				if (oTable) {
					oTable.fnClearTable();    //清空数据
					oTable.fnDestroy();         //销毁datatable
				}
				pageLength = ufma.dtPageLength('#gridGOV');
				oTable = $("#" + id).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": Datas,
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength,
					"bFilter": false, //去掉搜索框
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": columns,
					"columnDefs":columnDefs,
					//填充表格数据
					"dom": 'rt<"' + id + '-paginate"ilp>',
					"initComplete": function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');

						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);
						$('#dtToolbar [data-toggle="tooltip"]').tooltip();
						$(".datatable-group-checkable").on("change", function () {
							var isCorrect = $(this).is(":checked");
							$("#" + id + " .djcheck").each(function () {
								isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
							})
							$(".datatable-group-checkable").prop("checked", isCorrect);
						});
						ufma.setBarPos($(window));
						//导出end
						ufma.isShow(page.reslist);
					},
					"drawCallback": function () {
						$('#gridGOV').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$("#check-head").prop('checked', false)
						$(".datatable-group-checkable").prop('checked', false).attr("checked",false)
						$("#all").prop('checked', false)
						pageLength = ufma.dtPageLength($(this));
						ufma.setBarPos($(window));
						ufma.isShow(page.reslist);
					}
				});
			},
			//获取表格数据
			loadGrid: function () {
				var searchdata = {
					"acctCode": acctCode,
					"agencyCode": agencyCode,
					"endVouDate": $('#endJouDate').getObj().getValue(),
					"isRegistered": $('.nav').find('.active').find('a').attr('code'),
					"rgCode": page.pfData.svRgCode,
					"setYear": page.pfData.svSetYear,
					"startVouDate": $('#startJouDate').getObj().getValue()
				}
				ufma.post('/gl/vou/searchVouSurpluses', searchdata, page.initGrid)
			},
			//返回本期时间
			dateBenQi: function (startId, endId) {
				var ddYear = page.pfData.svSetYear;
				var ddMonth = page.pfData.svTransDate;
				$("#" + startId).getObj().setValue(ddMonth);
				$("#" + endId).getObj().setValue(ddMonth);
				page.loadGrid()
			},
			//返回本年时间
			dateBenNian: function (startId, endId) {
				var ddYear = page.pfData.svSetYear;
				var ddMonth = page.pfData.svTransDate;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11));
				page.loadGrid()
			},
			onEventListener: function () {
				$('#gridGOV').on('click', 'tbody .djcheck', function(e) {
					var t = true
					$(this).parents("tbody").find(".djcheck").each(function() {
						if($(this).is(":checked")!=true){
							t=false
						}
					})
					$(".datatable-group-checkable").attr('checked',t).prop('checked',t)

				});
				$("#all").on("click", function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag)
				});
				$("#queryAll").on("click", function () {
					page.loadGrid()
				});
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function () {
					page.dateBenQi("startJouDate", "endJouDate");
					$(this).addClass('selected')
					$('#dateBn').removeClass('selected')
				});
				$("#dateBn").on("click", function () {
					page.dateBenNian("startJouDate", "endJouDate");
					$(this).addClass('selected')
					$('#dateBq').removeClass('selected')
				});
				$(".nav li").click(function () {
					$(this).addClass('active').siblings('li').removeClass('active')
					if ($('.nav').find('.active').find('a').attr('code') == '0') {
						$('#btn-register-check').show()
						$('#btn-register-del-check').hide()
					} else if ($('.nav').find('.active').find('a').attr('code') == '1') {
						$('#btn-register-check').hide()
						$('#btn-register-del-check').show()
					} else {
						$('#btn-register-check').hide()
						$('#btn-register-del-check').hide()
					}
					page.loadGrid()
				})
				$('#btn-register-check').click(function () {
					ufma.showloading('正在登记，请稍候......')
					var Guid = []
					for (var i = 0; i < $('.djcheck').length; i++) {
						if ($('.djcheck').eq(i).is(":checked")) {
							Guid.push($('.djcheck').eq(i).attr('data-guid'))
						}
					}
					if(Guid.length>0){
						ufma.post('/gl/vou/autoMarkSurplusAndSave', Guid, function (result) {
							ufma.hideloading()
							ufma.showTip("登记成功", function () { }, 'success');
							page.loadGrid()
						})
					}else{
						ufma.hideloading()
						ufma.showTip("请选择至少一条记录", function () { }, 'warning');
					}
				})
				$('#btn-register-del-check').click(function () {
					ufma.showloading('正在取消登记，请稍候......')
					var Guid = []
					for (var i = 0; i < $('.djcheck').length; i++) {
						if ($('.djcheck').eq(i).is(":checked")) {
							Guid.push($('.djcheck').eq(i).attr('data-guid'))
						}
					}
					var opt = {
						"vouGuids":Guid,
						"acctCode": acctCode,
						"agencyCode": agencyCode,
						"rgCode": page.pfData.svRgCode,
						"setYear": page.pfData.svSetYear
					}
					if(Guid.length>0){
						ufma.post('/gl/vou/deleteVouSurplus', opt, function (result) {
							ufma.hideloading()
							ufma.showTip("取消登记成功", function () { }, 'success');
							page.loadGrid()
						})
					}else{
						ufma.hideloading()
						ufma.showTip("请选择至少一条记录", function () { }, 'success');
					}
				})
				$(document).on("click", ".btn-register-dj", function () {
					var Guid = $(this).attr('data-guid')
					var Data = {
						'fisPerd': $(this).attr('data-fisPerd'),
						'surGuid': $(this).attr('data-surGuid'),
						'createDate': $(this).attr('data-createDate'),
						'inputorName': $(this).attr('data-inputorName')
					}
					ufma.open({
						title: '登记差异项',
						width: 1200,
						url: 'differRegistSet.html',
						data: {
							"acctCode": acctCode,
							"agencyCode": agencyCode,
							'guid': Guid,
							'datas': Data
						},
						ondestory: function (result) {
							page.loadGrid()
						}
					});
				})
				$(document).on("click", ".differmingxi", function () {
					var Guid = $(this).attr('data-guid')
					var Data = {
						'fisPerd': $(this).attr('data-fisPerd'),
						'surGuid': $(this).attr('data-surGuid'),
						'createDate': $(this).attr('data-createDate'),
						'inputorName': $(this).attr('data-inputorName')
					}
					ufma.open({
						title: '登记差异项',
						width: 1200,
						url: 'differRegistSet.html',
						data: {
							"acctCode": acctCode,
							"agencyCode": agencyCode,
							'guid': Guid,
							'datas': Data
						},
						ondestory: function (result) {
							page.loadGrid()
						}
					});
				})
				$(document).on("click", ".btn-register-del", function () {
					ufma.showloading('正在取消登记，请稍候......')
					var Guid = $(this).attr('data-guid')
					
					var opt = {
						"vouGuids":[Guid],
						"acctCode": acctCode,
						"agencyCode": agencyCode,
						"rgCode": page.pfData.svRgCode,
						"setYear": page.pfData.svSetYear,
					}
					ufma.post('/gl/vou/deleteVouSurplus', opt, function (result) {
						ufma.hideloading()
						ufma.showTip("取消登记成功", function () { }, 'success');
						page.loadGrid()
					})
				})
				$(document).on("click", ".btn-history", function () {
					ufma.showloading('正在加载数据，请耐心等待')
					//与后端沟通，不再等待回调，仅执行
					ufma.get('/gl/vou/updateVouRegisterFlag/'+page.pfData.svRgCode+'/'+page.pfData.svSetYear+'/'+agencyCode, '', function (result) {})
					ufma.hideloading()
					ufma.showTip('已开始进行处理',function(){},'success')
				})
				$(document).on("click", ".btn-register-vou", function(){
					ufma.removeCache("cacheData");
					//缓存数据
					var _this= $(this)
					var vouGuid= $(this).attr('data-guid')
					var cacheData = {};
					cacheData.agencyCode = agencyCode;
					cacheData.acctCode = acctCode;
					ufma.setObjectCache("cacheData", cacheData);
					ufma.ajaxDef('/gl/vou/getVou/' + vouGuid, 'get', '', function (result) {
						if (result.data != null) {
							/*_this.attr('data-href', '../../../gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=query&vouGuid=' + vouGuid);
							_this.attr('data-title', '凭证录入');
							window.parent.openNewMenu(_this);*/
							var baseUrl = '/pf/gl/vou/index.html?menuid=f24c3333-9799-439a-94c9-f0cdf120305d&dataFrom=vouBox&action=query&vouGuid=' + vouGuid;
				              uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证录入");
						} else {
							ufma.showTip('该凭证已在其他页面删除，请刷新页面', function () { }, "warning");
						}
					})
				})
				$(document).on("click", ".btn-differ", function(){
					var searchdata = {
						"acctCode": acctCode,
						"agencyCode": agencyCode,
						"endVouDate": $('#endJouDate').getObj().getValue(),
						"isRegistered": $('.nav').find('.active').find('a').attr('code'),
						"rgCode": page.pfData.svRgCode,
						"setYear": page.pfData.svSetYear,
						"startVouDate": $('#startJouDate').getObj().getValue()
					}
					ufma.post('/gl/vou/searchSurplusSummaryTable', searchdata, function(result){
						var nowtable =result.data.maSurplusTrees
						var tr = ''
						for(var i=0;i<nowtable.length;i++){
							var amts =''
							if(result.data.surplusAmtMap['surplus'+nowtable[i].id]!=undefined && result.data.surplusAmtMap['surplus'+nowtable[i].id]!=0){
								amts = page.moneyFormat(result.data.surplusAmtMap['surplus'+nowtable[i].id])
							}
							tr+='<tr><td class="level'+nowtable[i].levelNum+'">'+ nowtable[i].codeName +'</td><td class="amt" leaf="'+nowtable[i].isLeaf+'" code="'+nowtable[i].id+'" pcode="'+nowtable[i].pId+'">'+amts+'</td></tr>'
						}
						$('.navtabss').find('tbody').html(tr)
						page.editor=ufma.showModal('differdata', 1000);
						for(var i=0;i<$('.navtabss .amt[leaf=1]').length;i++){
							if($('.navtabss .amt[leaf=1]').eq(i).html()!=''){
								page.editamt($('.navtabss .amt[leaf=1]').eq(i))
							}
						}
					})
				})
				$(document).on("click", "#btn-differ-close", function(){
					page.editor.close()
				})
			},
			editamt:function(lens){
				var pids = lens.attr('pcode')
				$('.amt[code="'+pids+'"]').html('')
				for(var i=0;i<$('.amt[pcode="'+pids+'"]').length;i++){
					var $ths = $('.amt[pcode="'+pids+'"]').eq(i)
				 	var $parentscode= $('.amt[code="'+pids+'"]')
				 	if($parentscode.length>0){
					 	var numss = $parentscode.html()==''?0: parseFloat($parentscode.html().split(",").join(""))
					 	var thisnumss =parseFloat($ths.html().split(",").join(""))
					 	if(!isNaN(numss) && !isNaN(thisnumss)){
							if($ths.attr('code')=='101'|| $ths.attr('code')=='102'){
								$parentscode.html(page.moneyFormat(numss+thisnumss))
							}else if($ths.attr('code')=='103'|| $ths.attr('code')=='104'){
								$parentscode.html(page.moneyFormat(numss-thisnumss))
							}else{
								$parentscode.html(page.moneyFormat(numss+thisnumss))
							}
					 	}
				 	}
				}
				if($('.amt[code="'+pids+'"]').length>0){
					page.editamt($('.amt[code="'+pids+'"]'))
				}
			},
			//此方法必须保留
			initPage: function () {
				page.pfData = ufma.getCommonData();
				var ddMonth = new Date(page.pfData.svTransDate);
				if(page.getUrlParam('checkfisPerd')!=undefined){
					var months = page.getUrlParam('checkfisPerd')-1
					var ddYear = page.pfData.svSetYear;
					ddMonth = new Date(ddYear,months)
				}
				$('#startJouDate').ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: ddMonth
				});
				$('#endJouDate').ufDatepicker({
					format: 'yyyy-mm',
					viewMode: 'month',
					initialDate: ddMonth
				});
				$(".btn-export").off().on('click', function (evt) {
					evt = evt || window.event;
					evt.preventDefault();
					uf.expTable({
						title: '差异项明细表',
						topInfo:[
							['单位：'+agencyCode+' '+agencyName + '（账套：'+acctCode+' '+acctName + '）'],
							['期间：'+$("#startJouDate").getObj().getValue()+'至'+$("#endJouDate").getObj().getValue() + " （单位：元）"]
						],
						exportTable: '#differdataTable'
					});
				});
				page.initAgencyScc()
			},
			init: function () {
				page.reslist = ufma.getPermission();
				this.initPage();
				this.onEventListener();
				ufma.setBarPos($(window));
				ufma.parseScroll();
				page.isCrossDomain = false;
				window.addEventListener('message', function(e) {
					if(e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				});
			}
		}
	}();
	page.init();
});