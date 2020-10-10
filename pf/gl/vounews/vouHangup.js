$(function() {
	var fiscObj = {
		treasuryHook: "",
	    treasuryVouGuid: "",
	    vouBean:""
	}
	window._close = function(action) {
		if(!action) {
			action = fiscObj
		}
		if(window.closeOwner) {
			if(""==fiscObj.vouBean){
				fiscObj.vouBean=window.ownerData.vouBean
			}
			var data = {
				action: action
			}
			window.closeOwner(data);
		}
	};
	var bheight=200;
	var swheight = 120
	var sheight = 120
	var page = function() {
		var ptData = ufma.getCommonData();
		var agencyCode = '';
		var gkzb_code = ''; // 单据方案定义的国标指标编码
		var oTableConAUT, oTableWGJ, oTableYGJ;
		var vouGuid, schId;
		var SchemeName = window.ownerData.SchemeName;
		var WGJFLdata = window.ownerData.WGJFLdata;
		var WGJFLitem = window.ownerData.WGJFLitem;
		var YGJdata = window.ownerData.YGJ;
		var FLSUN = window.ownerData.FLSUN;
		var YCOUNT = window.ownerData.YCOUNT;
		var WCOUNT = window.ownerData.WCOUNT;
		var optionMode =window.ownerData.operationMode;
		var gwsum = WCOUNT;
		fiscObj.treasuryHook = window.ownerData.treasuryHook;
		fiscObj.treasuryVouGuid=window.ownerData.vouGuid;
		var sumSigle;
		var resultObj = {};
		var $span, $anew;
		var parentData = window.ownerData.parentData;
		var setYearWin = window.ownerData.setYear;
		var rgCodeWin = window.ownerData.rgCode;
		return {
			initTabParent: function() {
				if(!$.isNull(parentData)) {
					var gkdjData = parentData.GKDJ;
					fiscObj.treasuryHook = parentData.treasuryHook;
					for(var i = 0; i < gkdjData.length; i++) {
						var guid = gkdjData[i].schemeGuid;
						resultObj[guid] = gkdjData[i];
						var schemeName = gkdjData[i].SchemeName;
						sumSigle = gkdjData[i].sum;
						if(!$.isNull(guid)) {
							var $ul = $('#tabAcce');
							var $li = $('<li class=""></li>').appendTo($ul);
							$anew = $('<a class="aName" id="' + guid + '">' + schemeName + '</a>').appendTo($li);
							$span = $("<span class='tc sumText' style='color:red;'>" + '(' + sumSigle + ')' + "</span>").appendTo($anew);
							$('#tabAcce li').eq(0).addClass('active');
							schId = $('#tabAcce .active a').attr('id');
						}
					}
				}
				page.initConAUT(schId);
				page.loadGridCon(schId);
			},
			searchTable: function() {
				$('#tabAcce').html('');
				var argu = {
					agencyCode: window.ownerData.agencyCode,
					/*setYear: window.ownerData.setYear,
					rgCode: window.ownerData.rgCode,*/
					setYear: setYearWin,
					rgCode: rgCodeWin,
					acctCode: window.ownerData.acctCode,
					voucherModel: "SEARCH"
				};
				vouGuid = window.ownerData.vouGuid;
				var url = '/gl/vou/getGkzbDetailAss/' + vouGuid;
				ufma.get(url, argu, function(result) {
					//if(result.data.length > 0) {
					    var msg =result.data.msg;
						if(!$.isNull(result.data)) {
						page.allTableData = result.data;
						WGJFLitem = page.allTableData.WGJFL.item;
						WGJFLdata = page.allTableData.WGJFL.content;
						YGJdata = page.allTableData.YGJ;
						gwsum = page.allTableData.WCOUNT;
						fiscObj.treasuryHook = page.allTableData.treasuryHook;
						page.initGridWGJ(WGJFLitem);
						page.loadGridWGJ(WGJFLdata);
						page.initGridYGJ();
						page.loadGridYGJ(YGJdata);
						for(var i = 0; i < page.allTableData.GKDJ.length; i++) {
							var guid = page.allTableData.GKDJ[i].schemeGuid;
							resultObj[guid] = page.allTableData.GKDJ[i];
							var schemeName = page.allTableData.GKDJ[i].SchemeName;
							sumSigle = page.allTableData.GKDJ[i].sum;
							var $ul = $('#tabAcce');
							var $li = $('<li class=""></li>').appendTo($ul);
							$anew = $('<a class="aName" id="' + guid + '">' + schemeName + '</a>').appendTo($li);
							$span = $("<span class='tc sumText' style='color:red;'>" + '(' + sumSigle + ')' + "</span>").appendTo($anew);
							$('#tabAcce li').eq(0).addClass('active');
						}
						page.initConAUT(resultObj[schId]);
						page.loadGridCon(resultObj[schId]);
						$("#djDataSum").html("当前凭证需要挂接的辅助分录共 <span>" + page.allTableData.FLSUN + "</span>条,已挂接 <span>" + page.allTableData.YCOUNT + "</span>条,待挂接<span>" + page.allTableData.WCOUNT + "</span>条");
					} else if(msg !=""){
						ufma.showTip(msg, function() {
							return false;
						}, 'warning')
					}
				})
			},
			initConAUT: function() {
				var tableId = "countryVou"; //表格id
				var toolBar = $('#' + tableId).attr('tool-bar');
				var columns = [{
					//checkBox的选框
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
					data: "schemeGuid", //主键
					className: 'tc nowrap checkHead',
					width: 30
				}];
				if(!$.isNull(schId)) {
					if(!$.isNull(resultObj[schId].item)) {
						$('#countryVou').css('overflow', 'auto');
						for(var i = 0; i < resultObj[schId].item.length; i++) {
							var itemName = resultObj[schId].item[i].itemName;
							var lpField = resultObj[schId].item[i].lpField;
							if("GKZB" == resultObj[schId].item[i].eleCode) {
								gkzb_code = resultObj[schId].item[i].lpField;
							}
							if(lpField == "AMT01") {
								columns.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap',
									render: function(data) {
										var val = $.formatMoney(data);
										return val == '0.00' ? '' : val;
									}
								})
							} else {
								columns.push({
									title: itemName,
									data: lpField,
									className: 'nowrap'
								})
							}
						}
					} else {
						$('.checkHead').addClass('hide');
					}
				} else {
					$('.check-all-H').addClass('hide');
					$('#countryVou').css('overflow', 'auto');
					$('.checkHead').addClass('hide');
				}
				var wheight= $('.ufma-layout-up').height();
				bheight = wheight-156
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": [],
					"scrollY": bheight,
					"processing": true, //显示正在加载中
					"scrollCollapse": false, //是否开启DataTables的高度自适应,当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变
					"autoWidth": true, //是否自适应宽度
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					searching: false,
					destroy: true,
					paging: false,
					"columnDefs": [{ //对列进行特殊操作---》适用于checkBox
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function(data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' name='chebox' class='check-all-H' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					}],
					drawCallback: function(settings) {
						$('#countryVou').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
					},
					"initComplete": function(settings, json) {
						$('#countryVou').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							vScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
					}
				}
				oTableConAUT = $("#" + tableId).dataTable(opts);
			},
			destoryAll: function() {
				if(oTableConAUT) {
					oTableConAUT.fnDestroy();
					schId = '';
					$("#countryVou").html('');
				}
			},
			loadGridCon: function() {
				oTableConAUT.fnClearTable();
				//获取国库单据数据
				if(!$.isNull(schId)) {
					if(resultObj[schId].content.length > 0) {
						oTableConAUT.fnAddData(resultObj[schId].content, true);
					}
				}
			},
			//初始化右边未挂接分录表格
			initGridWGJ: function() {
				//修改挂接时辅助核算项列显示不全问题--zsj
				if(oTableWGJ) {
					oTableWGJ.fnDestroy();
					$("#wgjfl").html('');
				}
				var tableId = "wgjfl"; //为挂接分录表格id
				var toolBar = $('#' + tableId).attr('tool-bar');
				var column = [{
					//checkBox的选框
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable  hide" id="check_W"/>&nbsp;<span></span> </label>',
					data: "DETAIL_ASS_GUID", //主键
					className: 'tc nowrap',
					width: 30
				}];
				if(!$.isNull(WGJFLitem)) {
					if(WGJFLdata.length == 0) {
						for(var i = 0; i < WGJFLitem.length; i++) {
							var itemName = WGJFLitem[i].eleName;
							var lpField = WGJFLitem[i].eleCode;
							if(lpField == "STAD_AMT") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap',
									render: function(data) {
										var val = $.formatMoney(data);
										return val == '0.00' ? '' : val;
									}
								});
							} else if(lpField == "ACCT_CODE") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								});
							} else if(lpField == "AGENCY_CODE") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								});
							} else if(lpField == "CREATE_USER") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								});
							} else if(lpField == "SET_YEAR") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								});
							} else if(lpField == "VOU_GUID") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								});
							} else if(lpField == "DETAIL_ASS_GUID") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								});
							} else if(lpField == "RG_CODE") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								});
							} else {
								column.push({
									title: itemName,
									data: lpField,
									className: 'nowrap'
								});
							}
						} //
					} else if(WGJFLdata.length > 0) {
						for(var i = 0; i < WGJFLitem.length; i++) {
							var itemName = WGJFLitem[i].eleName;
							var lpField = WGJFLitem[i].eleCode;
							if(lpField == "STAD_AMT") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap',
									render: function(data) {
										var val = $.formatMoney(data);
										return val == '0.00' ? '' : val;
									}
								})
							} else if(lpField == "ACCT_CODE") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								})
							} else if(lpField == "AGENCY_CODE") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								})
							} else if(lpField == "CREATE_USER") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								})
							} else if(lpField == "SET_YEAR") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								})
							} else if(lpField == "VOU_GUID") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								})
							} else if(lpField == "DETAIL_ASS_GUID") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								})
							} else if(lpField == "RG_CODE") {
								column.push({
									title: itemName,
									data: lpField,
									className: 'tr nowrap hide'
								})
							} else {
								column.push({
									title: itemName,
									data: lpField,
									className: 'nowrap'
								})
							}
						}
					} //
				} //
				var opts = {
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"data": [],
					"scrollY": swheight,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					"columns": column,
					paging: false,
					"columnDefs": [{ //对列进行特殊操作---》适用于checkBox
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function(data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' name='chebox_right' class='check-all-W hide' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					}],
					drawCallback: function(settings) {
						$('#wgjfl').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
					},
					"initComplete": function(settings, json) {
						ufma.isShow(page.reslist);
						$('#wgjfl').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							vScrollbar: true,
							mousewheel: false
						});
						ufma.setBarPos($(window));
					}
				}
				oTableWGJ = $("#" + tableId).dataTable(opts);
			},
			//获取未挂接分录数据
			loadGridWGJ: function() {
				oTableWGJ.fnClearTable();
				if(!$.isNull(WGJFLdata)) {
					if(WGJFLdata.length > 0) {
						for(var i = 0; i < WGJFLdata.length; i++) {
							oTableWGJ.fnAddData(WGJFLdata[i], true);
						}
					}
				}
				$('#wgjfl').closest('.dataTables_wrapper').ufScrollBar({
					hScrollbar: true,
					vScrollbar: true,
					mousewheel: false
				});
				ufma.setBarPos($(window));
				$("#djDataSum").html("当前凭证需要挂接的辅助分录共 <span>" + FLSUN + "</span>条,已挂接 <span>" + YCOUNT + "</span>条,待挂接<span>" + WCOUNT + "</span>条");
			},
			//初始化右边已挂接分录表格
			initGridYGJ: function() {
				var tableId = "ygjfl"; //已挂接分录表格id
				var toolBar = $('#' + tableId).attr('tool-bar');
				var column = [{
						//checkBox的选框
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check_Y"/>&nbsp;<span></span> </label>',
						data: " billGuid", //主键
						className: 'tc nowrap',
						width: 30
					},
					{
						title: "国库支付凭证号",
						data: "billNo",
						className: 'nowrap'
					},
					{
						title: "支付凭证日期",
						data: "billDate",
						className: 'nowrap'
					},
					{
						title: "支付凭证金额",
						data: "billAmt",
						className: 'tr nowrap',
						render: function(data) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}
					},
					{
						title: "分录序号",
						data: 'vouSeq',
						className: 'nowrap'
					},
					{
						title: "辅助分录金额",
						data: "stadAmt",
						className: 'tr nowrap',
						render: function(data) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
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
					"scrollY": sheight,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					"columns": column,
					paging: false,
					"columnDefs": [{ //对列进行特殊操作---》适用于checkBox
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap",
						"render": function(data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' name='chebox_right' class='check-all-Y hide' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					}],
					drawCallback: function(settings) {
						$('#ygjfl').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
					},
					"initComplete": function(settings, json) {
						ufma.isShow(page.reslist);
					}
				}
				oTableYGJ = $("#" + tableId).dataTable(opts);
			},
			loadGridYGJ: function() {
				oTableYGJ.fnClearTable();
				if(!$.isNull(YGJdata)) {
					if(YGJdata.length > 0) {
						oTableYGJ.fnAddData(YGJdata, true);
					}
				}
				$('#ygjfl').closest('.dataTables_wrapper').ufScrollBar({
					hScrollbar: true,
					vScrollbar: true,
					mousewheel: false
				});
				ufma.setBarPos($(window));
			},
			//获取国库单据复选数据
			getCheckedRows: function() {
				var checkedArray = [];
				$("#countryVou_wrapper").find('input.check-all-H:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			//获取未挂接复选数据
			getCheckedWGJRows: function() {
				var checkedArrayWGJ = [];
				$("#wgjfl_wrapper").find('input.check-all-W:checked').each(function() {
					checkedArrayWGJ.push($(this).val());
				});
				return checkedArrayWGJ;
			},
			//获取已挂接复选数据
			getCheckedYGJRows: function() {
				var checkedArrayYGJ = [];
				$("#ygjfl_wrapper").find('input.check-all-Y:checked').each(function() {
					checkedArrayYGJ.push($(this).val());
				});
				return checkedArrayYGJ;
			},
			onEventListener: function() {
				$("#tabAcce").on("click", 'a', function() {
					page.destoryAll();
					schId = $(this).attr('id');
					page.initConAUT(schId);
					page.loadGridCon(schId);
				});
				$('#vouHangup').on('click', function() {
					page.tableData();
				})
				$('#btnClose').on('click', function() {
					_close(fiscObj);
				});
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});
				//全选			
				$("body").on("click", 'input#check_H', function() {
					var flag = $(this).prop("checked");
					$("#countryVou_wrapper").find('input.check-all-H').prop('checked', flag);
				});
				$("body").on("click", 'input.check-all-H', function() {
					var num = 0;
					var arr = document.querySelectorAll('.check-all-H')
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++
						}
					}
					if(num == arr.length) {
						$("#check_H").prop('checked', true)
					} else {
						$("#check_H").prop('checked', false)
					}
				});
				//全选未挂接分录
				$("body").on("click", 'input#check_W', function() {
					var flag = $(this).prop("checked");
					$("#wgjfl_wrapper").find('input.check-all-W').prop('checked', flag);

					var wgllength = $("#wgjfl_wrapper").find('input.check-all-W')
					var z =0
					for(var i=0;i<wgllength.length;i++){
						if(wgllength.eq(i).is(":checked")){
							z++;
						}
					}
					gwsum = wgllength.length -z +1
				});
				$("body").on("click", '#wgjfl_wrapper .check-all-W', function() {
					var wgllength = $("#wgjfl_wrapper").find('input.check-all-W')
					var z =0
					for(var i=0;i<wgllength.length;i++){
						if(wgllength.eq(i).is(":checked")){
							z++;
						}
					}
					gwsum = wgllength.length -z +1
				});
				$("body").on("click", 'input.check-all-W', function() {
					var num = 0;
					var arr = document.querySelectorAll('.check-all-W')
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++
						}
					}
					if(num == arr.length) {
						$("#check_W").prop('checked', true)
					} else {
						$("#check_W").prop('checked', false)
					}
				});
				//全选已挂接分录
				$("body").on("click", 'input#check_Y', function() {
					var flag = $(this).prop("checked");
					$("#ygjfl_wrapper").find('input.check-all-Y').prop('checked', flag);
				});
				$("body").on("click", 'input.check-all-Y', function() {
					var num = 0;
					var arr = document.querySelectorAll('.check-all-Y')
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++
						}
					}
					if(num == arr.length) {
						$("#check_Y").prop('checked', true)
					} else {
						$("#check_Y").prop('checked', false)
					}
				});

				//搜索
				$(function() {
					$("#btn").click(function() {
						var inputAll = $('#txt').val();
						if(!isNaN(inputAll)) {
							if(resultObj[schId].content.length > 0) {
								for(var i = 0; i < resultObj[schId].content.length; i++) {
									if(inputAll == resultObj[schId].content[i].AMT01) {
										var finallnums = [];
										var finallNum = inputAll.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');
										finallnums.push(finallNum);
										//先隐藏全部，再把符合筛选条件的值显示
										$('#countryVou tbody tr').hide().filter(':contains(' + finallnums + ')').show().css('border-bottom', '1px solid #DFE6EC');
										return false;
									} else {
										var elsenums = [];
										elsenums.push(inputAll);
										$('#countryVou tbody tr').hide().filter(':contains(' + elsenums + ')').show().css('border-bottom', '1px solid #DFE6EC');
									}
								}
							}
						} else {
							//先隐藏全部，再把符合筛选条件的值显示
							$('#countryVou tbody tr').hide().filter(':contains(' + inputAll + ')').show().css('border-bottom', '1px solid #DFE6EC');
						}
					});
					$("#wgjbtn").click(function() {
						var inputAll = $('#wgjtxt').val();
						if(inputAll!='') {
							$('#wgjfl tbody tr').hide()
							if(WGJFLdata.length > 0) {
								for(var i = 0; i < $('#wgjfl tbody tr').length; i++) {
									var text =  $('#wgjfl tbody tr').eq(i).find('td:not(".hide,.tc")').text()
									if(text.indexOf(inputAll) >= 0) {
										$('#wgjfl tbody tr').eq(i).show()
									}
								}
							}
						} else {
							//先隐藏全部，再把符合筛选条件的值显示
							$('#wgjfl tbody tr').show()
						}
					});
				});
				$('#txt').bind('keypress', function(event) {
					if(event.keyCode == "13") {
						$("#btn").click();
					}
				})
				$('#wgjtxt').bind('keypress', function(event) {
					if(event.keyCode == "13") {
						$("#wgjbtn").click();
					}
				})
				//挂接
				$('#btnHangup').on('click', function(evt) {
					if(window.ownerData.vouStatus == 'O') { //O:未审核凭证
						evt.stopPropagation();
						var arrChecked = page.getCheckedRows();
						var arrCheckedRight = page.getCheckedWGJRows();
						var itcm = resultObj[schId].item;
						var vouGuidsa = [];
						var fiscNew = {
							item: itcm,
							content: []
						};
						page.allData = {
							gkzb: gkzb_code,
							GKDJ: fiscNew,
							WGJFL: vouGuidsa,
							agencyCode: window.ownerData.agencyCode,
							/*setYear: window.ownerData.setYear,
							rgCode: window.ownerData.rgCode,*/
							setYear: setYearWin,
							rgCode: rgCodeWin,
							acctCode: window.ownerData.acctCode,
							wsum: gwsum
						};
						var rowData = {}
						if((arrChecked.length > 1 && arrCheckedRight.length == 1) || (arrChecked.length == 1 && arrCheckedRight.length > 1) || (arrChecked.length == 1 && arrCheckedRight.length == 1)) {
							$('#countryVou').find('input.check-all-H:checked').each(function() {
								var rowIndex = $(this).attr('index');
								if(rowIndex) {
									if(oTableConAUT) {
										rowData = oTableConAUT.api(false).row(rowIndex).data();
									}
									fiscNew.content.push(rowData);
								}
							});
							$('#wgjfl').find('input.check-all-W:checked').each(function() {
								var rowIndex = $(this).attr('index');
								if(rowIndex) {
									rowData = oTableWGJ.api(false).row(rowIndex).data();
									vouGuidsa.push(rowData);
								}
							});
							var argu = page.allData;
							var vouGuid=window.ownerData.vouGuid;
							 if('HZ'==optionMode&&!vouGuid){
								 	argu.wgjflItem=window.ownerData.WGJFLitem;
								 	//argu.vouBean=JSON.stringify(window.ownerData.vouBean);
								 	argu.vouBean=window.ownerData.vouBean;
								 	/*argu.vouBean.rgCode=argu.rgCode;
								 	argu.vouBean.setYear=argu.setYear;*/
								 	argu.vouBean.rgCode= rgCodeWin;
								 	argu.vouBean.setYear= setYearWin;
								 	argu.vouBean.vouStatus=window.ownerData.vouStatus;
								 	argu.vouBean.vouGuid=window.ownerData.vouGuid;
								 	ufma.post('/gl/vou/prewSaveVouFiscRel', argu, function(result) { //挂接
									if(result.data.flag = 'true') {
										ufma.showTip(result.data.msg, function() {}, 'success');
										  // 重新加载界面
										 if(result.data.onLoad){
	                                     		  //page.initGridWGJ();
	                                     		if(!$.isNull(result.data.GKDJ)) {
						                          var gkdjData = result.data.GKDJ;
						                           for(var i = 0; i < gkdjData.length; i++) {
							                       var guid = gkdjData[i].schemeGuid;
							                       resultObj[guid] = gkdjData[i];
							                       var schemeName = gkdjData[i].SchemeName;
							                       sumSigle = gkdjData[i].sum;
							                       //bug81550 【20190627 财务云8.0 广东省财政厅】汇总挂接挂接成功后 左侧数量应该显示为“0”--zsj
													$('#' + guid).find('.sumText').html('(' + sumSigle + ')');
						                         }
						                          schId = $('#tabAcce .active a').attr('id');
					                           }
	                                     		  page.loadGridCon(schId);
	                                     		  //重新设置界面的数据
	                                     		  YGJdata = result.data.YGJ;
	                                     		  page.loadGridYGJ()
	                                     		  WGJFLdata =result.data.WGJFL.content;
					                              page.loadGridWGJ();
					                              window.ownerData.vouBean=result.data.vouBean;
	                                     // 关闭界面
										 }else {
	                                            window.ownerData.vouBean=result.data.vouBean;
	                                            fiscObj.vouBean= window.ownerData.vouBean;
	                                            _close(fiscObj);
										 }
										$("#check_H").attr("checked", false);
										$("#check_W").attr("checked", false);
									}
								});
								 }else{
								ufma.post('/gl/vou/saveVouFiscRel', argu, function(result) { //挂接
										 if(result.data.flag = 'true') {
											 ufma.showTip(result.data.msg, function() {}, 'success');
											 $("#check_H").attr("checked", false);
											 $("#check_W").attr("checked", false);
											 page.searchTable();
										 }
									 });
								 }
						} else if(arrChecked.length == 0 && arrCheckedRight.length > 0) {
							ufma.alert('请至少选择一条国库单据数据！', "warning");
							return false;
						} else if(arrChecked.length > 0 && arrCheckedRight.length == 0) {
							ufma.alert('请至少选择一条未挂接分录数据！', "warning");
							return false;
						} else if(arrChecked.length > 1 && arrCheckedRight.length > 1) {
							ufma.alert('不允许多笔国库单据与多笔未挂接分录进行挂接！', "warning");
							return false;
						} else {
							ufma.alert('请选择要挂接的数据！', "warning");
							return false;
						}
					} else {
						ufma.alert('只有未审核凭证才可以挂接！', "warning");
						return false;
					}

				});

				//取消挂接
				$('#btnQuit').on('click', function(evt) {
					if(window.ownerData.vouStatus == 'O') { //O:未审核凭证
						evt.stopPropagation();
						var arrCheckedYGJ = page.getCheckedYGJRows();
						var rowDataItem = {}
						var rowData = []
						if(arrCheckedYGJ.length > 0) {
							$('#ygjfl').find('input.check-all-Y:checked').each(function() {
								var rowIndex = $(this).attr('index');
								if(rowIndex) {
									rowDataItem = oTableYGJ.api(false).row(rowIndex).data();
									rowData.push(rowDataItem)
								}
							});
							var argu = {
								agencyCode: window.ownerData.agencyCode,
								//rgCode: window.ownerData.rgCode,
								rgCode: rgCodeWin,
								setYear:setYearWin,
								createUser: '',
								vouGuids: rowData
							}
							ufma.post('/gl/vou/cancelVouAssBill', argu, function(result) { //挂接
								if(result.data) {
									//CWYXM-10989 国库挂接，点击取消挂接，显示的单据与归属的方案不对应
									schId = $('#tabAcce .active a').attr('id');
									ufma.showTip('取消挂接成功', function() {}, 'success');
									$("#check_Y").attr("checked", false);
									page.searchTable();
								}
							});
						} else {
							ufma.alert('请至少选择一条已挂接分录数据！', "warning");
							return false;
						}
					} else {
						ufma.alert('只有未审核凭证才可以取消挂接！', "warning");
						return false;
					}

				});

			},
			//初始化按钮
			initBtn:function(){
				var isLp =window.ownerData.isLp;
				var vouGuid =window.ownerData.vouGuid;
				if(isLp&&vouGuid){
					//$('#btnHangup').attr("disabled", "disabled"); //--隐藏按钮
					$('#btnHangup').css('display','none'); //--隐藏按钮
					//$('#btnHangup').addclass('hide'); //--隐藏按钮
					//$('#ID').removeClass('hide')--显示按钮
				}
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initTabParent();
				page.initGridWGJ();
				page.loadGridWGJ();
				page.initGridYGJ();
				page.loadGridYGJ();
				page.initBtn();
				$.fn.dataTable.ext.errMode = 'none';
			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				var wheight= $('.ufma-layout-up').height();
				$("#gkdjWapper").css('height',wheight-56+'px')
				$('#gkdjWappertab').css('height',wheight-136+'px')
				$('#countryVou_wrapper, #gkdjWapper .dataTables_empty,#gkdjWappertab').css('height',wheight-136+'px')
				var wheight= $('.ufma-layout-up').height();
				bheight = wheight-176
				$('#wgjdiv,#ygjdiv').css('height',(wheight-56)/2+'px')
				$('#ygjdiv').css('margin-top',(wheight-56)/2+'px') 
				swheight = (wheight-56)/2-90
				sheight = (wheight-56)/2-70
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();

			}
		}
	}();
	page.init();
});