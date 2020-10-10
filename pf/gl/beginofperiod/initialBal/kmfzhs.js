$(function () {
	window._close = function(status) {
		var data = page.getFZData();

		if(!data) return false;
		if(window.closeOwner) {
			var data = {
				action: status,
				result: data
			};
			window.closeOwner(data);
		}
	}
	function toCamel(str) {
		str = str.toLowerCase()
	  	return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
		    return $1 + $2.toUpperCase();
	  	});
	}
	var accitemOrderSeq;
	var colwidth = 240;
	var curCodefzhsxl = []
	var curCodeexrate = {}
	var curCodeexratelen = {}
	var page = function() {
		var billfzhsxl = {}
		return {
			getFZData: function() {
				var drCr;
				if($('.jf').hasClass('active')) {
					drCr = $('.jf input[name="drCr"]').val();
				} else if($('.df').hasClass('active')) {
					drCr = $('.df input[name="drCr"]').val();
				}
				var amt = 0.00
				var camt = 0.00
				var damt = 0.00
				var tableData = $('#fztable').getObj().getData()
				var adfdc = ''
				var aCode = ''
				var newTableData = [];
				var error = '';
				for(var i = 0; i < tableData.length; i++) {
					var row = tableData[i];
					var newRow = {};
					$.each(row, function(k, v) {
						if(k != "billType" && k != "billDate" && k != "billNo" && k != "expireDate" && k != "dfDc" && k != "accoSurplus" && k != "remark") {
							if(k != "qty" && k != "price" && k != "curCode" && k != "exRate" && k != "currAmt") {
								if(k == "code" || k == "codeName" || k == "id") {
									delete row[k]
								} else if(k != 'stadAmt' && k != "drCr" && k != "dstadAmt" && k != "cstadAmt") {
									// if(v == '') {
									// 	error = '第' + (i + 1) + '行，请录入辅助核算！';
									// }
									newRow[k] = v;
								} else if(k == 'stadAmt') {
									if(v == '' || v == '0.00') {
										error = '第' + (i + 1) + '行，请录入金额！';
										return false;
									}
									v = parseFloat(v).toFixed(2)
									//小于1时精度会不对，进行特殊处理
									amt += parseFloat(v.toString().split('.').join(''));
//									if(window.ownerData.isDrCr) {
//										if(newRow['drCr'] == 1) {
//											damt += parseFloat(v.toString().split('.').join(''))
//										} else {
//											camt += parseFloat(v.toString().split('.').join(''))
//										}
//									}
									newRow['stadAmt'] = parseFloat(v).toFixed(2)
								} else if(k == 'dstadAmt') {
									var now = k['cstadAmt']
									if(v == '' || v == '0.00') {
										if(now == '' || now == '0.00') {
											error = '第' + (i + 1) + '行，请录入金额！';
											return false;
										}
									}
									if(v == '') {
										v=0
									}
									v = parseFloat(v).toFixed(2)
									damt += parseFloat(v.toString().split('.').join(''))
									newRow['dstadAmt'] = parseFloat(v).toFixed(2)
								} else if(k == 'cstadAmt') {
									var now = k['dstadAmt']
									if(v == '' || v == '0.00') {
										if(now == '' || now == '0.00') {
											error = '第' + (i + 1) + '行，请录入金额！';
											return false;
										}
									}
									if(v == '') {
										v=0
									}
									v = parseFloat(v).toFixed(2)
									camt += parseFloat(v.toString().split('.').join(''))
									newRow['cstadAmt'] = parseFloat(v).toFixed(2)
								} else if(k == 'drCr') {
									if(v == '' || v == '0.00') {
										error = '第' + (i + 1) + '行，请录入借贷方向！';
										return false;
									}
									newRow['drCr'] = v;
								}
							} else {
								newRow[k] = v;
							}
						} else {
							newRow[k] = v;
						}
						if(!window.ownerData.isDrCr) {
							newRow['drCr'] = drCr;
						}
					});
					newTableData.push(newRow);
				}
				if(error == '') {
					return {
						'drCr': drCr,
						'amt': parseFloat(amt/100).toFixed(2),
						'damt': parseFloat(damt/100).toFixed(2),
						'camt': parseFloat(camt/100).toFixed(2),
						'data': newTableData,
						'tmpData': tableData
					};
				} else {
					ufma.showTip(error);
					return false;
				}

			},
			showFZTable: function(data,tableDatas) {
				var column = [ // 支持多表头
					{
						type: 'indexcolumn', 
						key: '',
						name: '序号',
						width: 60,
						align: 'center',
						headalign: 'center'
					}
				];
				ufma.ajaxDef("/gl/vou/getSysRuleSet/" + window.ownerData.agencyCode + "?chrCodes=GL036", 'get', "", function(data) {
					if(data.data.GL036){
						column.push({
							type: 'input',
							field: 'remark',
							name: '摘要',
							width: colwidth,
							headalign: 'center',
							render: function (rowid, rowdata, data) {
								if (!data) {
									return "";
								}
								return data;
							}
						})
					}
				});
				var headdata = data
				var nowheadadata = {}
				$.each(headdata, function (i, item) { //解决 回显render问题 用for会把变量看成全局  
					var cbItem = item.accitemCode.toLowerCase();
					var cbitemcode = toCamel(cbItem)+ 'Code'
					nowheadadata[cbitemcode] =''
					column.push({
						type: 'treecombox',
						field: cbitemcode,
						name: item.eleName,
						width: colwidth,
						headalign: 'center',
						idField: 'id',
						textField: 'codeName',
						leafRequire: true,
						pIdField: 'pId',
						data: item.accItemDataList,
						render: function (rowid, rowdata, data) {
							if (!data) {
								return '';
							}
							var shuc = ''
							for(var z=0;z<item.accItemDataList.length;z++){
								if(item.accItemDataList[z].id == data){
									shuc = item.accItemDataList[z].codeName
									break;
								}
							}
							return shuc
						}
					});
				});
				if(window.ownerData.isShowBill == 1) {
					var datakeys = []
					ufma.ajaxDef("/gl/vou/getEleBillType/" + window.ownerData.agencyCode, 'get', '', function(data) {
						datakeys = data.data
						for(var i = 0; i < datakeys.length; i++) {
							datakeys[i].code = datakeys[i].chrCode
							datakeys[i].codeName = datakeys[i].chrCode + ' ' +datakeys[i].chrName
							datakeys[i].id = datakeys[i].code
							if(datakeys[i].pId != '0') {
								for(var z = 0; z < datakeys.length; z++) {
									if(datakeys[i].pId == datakeys[z].CHR_ID) {
										datakeys[i].pId = datakeys[z].code
									}
								}
							}
						}
					})
					column.push({
						type: 'input',
						field: 'billNo',
						name: '票据号',
						width: colwidth,
						headalign: 'center',
						render: function (rowid, rowdata, data) {
							if (!data) {
								return "";
							}
							return data;
	
						}
					});
					column.push({
						type: 'datepicker',
						field: 'billDate',
						name: '票据日期',
						width: colwidth,
						headalign: 'center',
						align: 'center'
					});
					column.push({
						type: 'treecombox',
						field: 'billType',
						name: '票据类型',
						width: colwidth,
						headalign: 'center',
						idField: 'code',
						textField: 'codeName',
						leafRequire: true,
						pIdField: 'parentCode',
						data: datakeys,
						render: function (rowid, rowdata, data) {
							if (!data) {
								return '';
							}
							var shuc = ''
							for(var z=0;z<datakeys.length;z++){
								if(datakeys[z].code == data){
									shuc = datakeys[z].codeName
									break;
								}
							}
							return shuc
						}
					});
				}
				if(window.ownerData.expireDate == 1) {
					column.push({
						type: 'datepicker',
						field: 'expireDate',
						name: '到期日',
						width: colwidth,
						headalign: 'center',
						align: 'center'
					})
				}
				if(window.ownerData.isCur == 1){
					ufma.ajaxDef('/gl/eleCurrRate/getCurrType', "get", {
						"agencyCode": window.ownerData.agencyCode
					}, function(result) {
						curCodefzhsxl = result.data
						for(var i=0;i<curCodefzhsxl.length;i++){
							curCodefzhsxl[i].codeName = curCodefzhsxl[i].chrCode + " " + curCodefzhsxl[i].chrName
							if(curCodefzhsxl[i].eleRateList.length > 0) {
								curCodeexrate['c' + curCodefzhsxl[i].chrCode] =  curCodefzhsxl[i].eleRateList[0].direRate
								curCodeexratelen['c' + curCodefzhsxl[i].chrCode] =  curCodefzhsxl[i].rateDigits
							}
						}
					})
					column.push({
						type: 'treecombox',
						field: 'curCode',
						name: '币种',
						width: colwidth,
						headalign: 'center',
						idField: 'chrCode',
						textField: 'codeName',
						leafRequire: true,
						pIdField: 'pId',
						data: curCodefzhsxl,
						render: function (rowid, rowdata, data) {
							if (!data) {
								return '';
							}
							var shuc = ''
							for(var z=0;z<curCodefzhsxl.length;z++){
								if(curCodefzhsxl[z].chrCode == data){
									shuc = curCodefzhsxl[z].codeName
									break;
								}
							}
							return shuc
						},
						onChange: function (e) {
							if(curCodeexrate['c'+e.rowData.curCode]!=undefined){
								e.sender.parent('div').find('input[name="exRate"]').val(curCodeexrate['c'+e.rowData.curCode])
								e.sender.parent('div').find('input[name="exRate"]').attr('rateDigits',curCodeexratelen['c'+e.rowData.curCode])
							}
						}
					});
					column.push( {
				        type: 'input',
				        field: 'exRate',
				        name: '汇率',
				        width: 120,
				        headalign: 'center',
				        align: 'right',
				        render: function (rowid, rowdata, data) {
				            if (!data || data == "0.00" || data == 0) {
				                return '';
				            }
				            return data;
				        },
				        onKeyup: function (sdr) {
				        	if(/[^\d.-]/.test(sdr.sender.val())) { //替换非数字字符  
								var temp_amount = sdr.sender.val().replace(/[^\d.-]/g, '');
								sdr.sender.val(temp_amount);
							}
				        }
				   	})
					column.push( {
				        type: 'input',
				        field: 'currAmt',
				        name: '外币金额',
				        width: 180,
				        headalign: 'center',
				        align: 'right',
				        render: function (rowid, rowdata, data) {
				            if (!data || data == "0.00" || data == 0) {
				                return '';
				            }
				            return data
				        },
				        onKeyup: function (sdr) {
				        	if(/[^\d.-]/.test(sdr.sender.val())) { //替换非数字字符  
								var temp_amount = sdr.sender.val().replace(/[^\d.-]/g, '');
								sdr.sender.val(temp_amount);
							}
				        }
				  	})
				}
				if(window.ownerData.isQty == 1){
					column.push( {
				        type: 'input',
				        field: 'qty',
				        name: '数量',
				        width: colwidth,
				        headalign: 'center',
				        align: 'right',
				        render: function (rowid, rowdata, data) {
				            if (!data || data == "0.00" || data == 0) {
				                return '';
				            }
				            return  data;
				        },
				        onKeyup: function (sdr) {
				        	if(/[^\d.-]/.test(sdr.sender.val())) { //替换非数字字符  
								var temp_amount = sdr.sender.val().replace(/[^\d.-]/g, '');
								sdr.sender.val(temp_amount);
							}
				        }
				   })
					column.push( {
				        type: 'input',
				        field: 'price',
				        name: '单价',
				        width: colwidth,
				        headalign: 'center',
				        align: 'right',
				        render: function (rowid, rowdata, data) {
				            if (!data || data == "0.00" || data == 0) {
				                return '';
				            }
				            return data;
				        },
				        onKeyup: function (sdr) {
				        	if(/[^\d.-]/.test(sdr.sender.val())) { //替换非数字字符  
								var temp_amount = sdr.sender.val().replace(/[^\d.-]/g, '');
								sdr.sender.val(temp_amount);
							}
				        }
				   })
				}
				if(window.ownerData.isDrCr) {
					column.push({
						type: 'money',
						field: 'dstadAmt',
						name: '借方金额',
						width: 100,
						headalign: 'center',
						align: 'right',
						render: function(rowid, rowdata, data) {
							var text = $.formatMoney(rowdata.dstadAmt, 2);
							return text == '0.00' ? '' : text;
						}
					}, {
						type: 'money',
						field: 'cstadAmt',
						name: '贷方金额',
						width: 100,
						headalign: 'center',
						align: 'right',
						render: function(rowid, rowdata, data) {
							var text = $.formatMoney(rowdata.cstadAmt, 2);
							return text == '0.00' ? '' : text;
						}
					})
				}else{
					column.push({
						type: 'money',
						field: 'stadAmt',
						name: '金额',
						width: 220,
						headalign: 'center',
						align: 'right',
						render: function (rowid, rowdata, data) {
							var text = $.formatMoney(data, 2);
							return text == '0.00' ? '' : text;
						},
						onKeyup:function(sdr){
							//使用失焦改变
							// if(window.ownerData.isCur == 1 && window.ownerData.isQty == 0){
							// 	sdr.sender.removeAttr('iskeyup')
							// 	var stadamt = sdr.sender
							// 	var qty = sdr.sender.parent('div').find('input[name="exRate"]')
							// 	var price = sdr.sender.parent('div').find('input[name="currAmt"]')
							// 	if(stadamt.val()!='' && qty.val()!='' && (price.val()=='' || price.attr('iskeyup')!=undefined)){
							// 		if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(stadamt.val()))){
							// 			price.attr('iskeyup','1')
							// 			if(qty.val()!=0){
							//     			price.val(parseFloat(stadamt.val()/qty.val()).toFixed(2))
							// 			}
							//     	}
							// 	}
							// 	if(stadamt.val()!='' && (qty.val()=='' || qty.attr('iskeyup')!=undefined) && price.val()!=''){
							// 		if(!isNaN(parseFloat(price.val())) && !isNaN(parseFloat(stadamt.val()))){
							// 			qty.attr('iskeyup','1')
							// 			if(price.val()!=0){
							// 	    		qty.val(parseFloat(stadamt.val()/price.val()).toFixed(2))
							// 	    	}
							//     	}
							// 	}
							// }
							// if(window.ownerData.isQty == 1){
							// 	sdr.sender.removeAttr('iskeyup')
							// 	var stadamt = sdr.sender
							// 	var qty = sdr.sender.parent('div').find('input[name="qty"]')
							// 	var price = sdr.sender.parent('div').find('input[name="price"]')
							// 	if(stadamt.val()!='' && qty.val()!='' && (price.val()=='' || price.attr('iskeyup')!=undefined)){
							// 		if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(stadamt.val()))){
							// 			price.attr('iskeyup','1')
							// 			if(qty.val()!=0){
							//     			price.val(parseFloat(stadamt.val()/qty.val()).toFixed(2))
							// 			}
							//     	}
							// 	}
							// 	if(stadamt.val()!='' && (qty.val()=='' || qty.attr('iskeyup')!=undefined) && price.val()!=''){
							// 		if(!isNaN(parseFloat(price.val())) && !isNaN(parseFloat(stadamt.val()))){
							// 			qty.attr('iskeyup','1')
							// 			if(price.val()!=0){
							//     			qty.val(parseFloat(stadamt.val()/price.val()).toFixed(2))
							// 			}
							//     	}
							// 	}
							// }
						}
					})
				}
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 60,
					headalign: 'center',
					render: function (rowid, rowdata, data) {
						return '<button class="btn btn-delete" rowid="' + rowid + '" data-toggle="tooltip" title="删除"><span class="icon-trash"></span></button>';
					}
				});
				var  tabledata = page.dataFZLB(nowheadadata)
				if(tableDatas !=undefined){
					tabledata = tableDatas
				}
				$('#fztable').empty().ufDatagrid({
					data: tabledata,
					disabled: false, // 可选择
					columns: [column],
					initComplete: function (options, data) {
					}
				});
				var drcr = window.ownerData.drCr;
				if(drcr == -1) {
					$('.jf').removeClass('active').find('input').removeAttr('checked');
					$('.df').addClass('active').find('input').attr('checked', 'checked');
				} else {
					$('.df').removeClass('active').find('input').removeAttr('checked');
					$('.jf').addClass('active').find('input').attr('checked', 'checked');
				}
//				//填充数据
				ufma.isShow(page.reslist);
			},
			dataFZLB:function(showhead) {
				var tableData = [];
				var fzData = JSON.parse(window.ownerData.fzData);
				for(var i = 0; i < fzData.length; i++) {
					var  tabledatanow = {}
					var row = fzData[i];
					for(var key in row) {
						var val = row[key];
						if(val != '' && val != '*') {
							if(key.indexOf('_') > 0) {
								var  keys = toCamel(key)
								if(showhead[keys]!=undefined){
									tabledatanow[keys] = val
								}
							} else {
								if(showhead[key]!=undefined){
									tabledatanow[key] = val
								}
							}
							
						}
					}
					tabledatanow.drCr = row.drCr || row.DR_CR
					tabledatanow.stadAmt = row.stadAmt || row.STAD_AMT
					tabledatanow.dstadAmt = row.dstadAmt 
					tabledatanow.cstadAmt = row.cstadAmt 
					tabledatanow.remark = row.remark || row.REMARK
					if(window.ownerData.isShowBill == 1) {
						tabledatanow.billDate = row.billDate || row.BILL_DATE
						tabledatanow.billNo = row.billNo || row.BILL_NO
						tabledatanow.billType = row.billType || row.BILL_TYPE
					}
					if(window.ownerData.expireDate == 1) {
						tabledatanow.expireDate = row.expireDate || row.EXPIRE_DATE
					}
					if(window.ownerData.isCur == 1) {
						tabledatanow.curCode = row.curCode
						tabledatanow.currAmt = row.currAmt 
						tabledatanow.exRate = row.exRate
					}
					if(window.ownerData.isQty == 1) {
						tabledatanow.qty = row.qty
						tabledatanow.price = row.price
					}
					tableData.push(tabledatanow)
				}
				return tableData
			},
			getFZLB: function() {
				var agencyCode = window.ownerData.agencyCode;
				var acctCode = window.ownerData.acctCode;
				var accoCode = window.ownerData.accoCode;
				var argu = {
					'agencyCode': agencyCode,
					'acctCode': acctCode,
					'accoCode': accoCode
				}
				var url = '/gl/sys/coaAcc/getAccoItem';
				var callback = function(result) {
					page.coldata = result.data
					page.showFZTable(result.data);
				}

				ufma.post(url, argu, callback);
			},
			//此方法必须保留
			init: function() {
				setTimeout(function(){
				//获取权限数据
				page.reslist = ufma.getPermission();
				ufma.ajaxDef('/pub/user/menu/config/select?agencyCode='+window.ownerData.agencyCode+'&acctCode='+window.ownerData.acctCode+'&menuId=3b92db28-1947-4153-817b-82f1b17b699f', "get", '', function(data) {
					if(data.data.colwidth!=undefined && !isNaN(parseFloat(data.data.colwidth))){
						$(".colwidth").val(data.data.colwidth)
						colwidth = data.data.colwidth
					}
				})
				page.getFZLB();
				$('#btn-ok').click(function() {
					_close('ok');
				});
				if(window.ownerData.isClosed == false) {
					$("#btn-ok").remove()
					$('input[type="radio"]').attr('disabled', true)
					$('#btn-clean').remove()
				}
				$(document).on('input propertychange', '.colwidth', function () {
					var c = $(this);
					if(/[^\d]/.test(c.val())) { //替换非数字字符  
						var temp_amount = c.val().replace(/[^\d]/g, '');
						$(this).val(temp_amount);
					}
				})
				$(document).on('blur', '.colwidth', function () {
					var c = $(this).val()
					if(c!='' && !isNaN(parseFloat(c))){
						colwidth = c
						var data = {
							"agencyCode":window.ownerData.agencyCode,
							"acctCode":window.ownerData.acctCode,
							"menuId":"3b92db28-1947-4153-817b-82f1b17b699f",
							"configKey":'colwidth',
							"configValue":c
						}
						ufma.ajaxDef('/pub/user/menu/config/update', "post", data, function(data) {})
						var tabledatas = $('#fztable').getObj().getData()
						page.showFZTable(page.coldata,tabledatas)
					}
				})
				page.pfData = ufma.getCommonData();
				$('#accSysAddKJYS').click(function() {
					var obj = $('#fztable').getObj(); // 取对象
					var newId = obj.add();
					obj.edit(newId);
					for(var i=0;i<$('#fztable').find('.indexcolumn').length;i++){
						$('#fztable').find('.indexcolumn').eq(i).html(i+1)
					}
				});
				$('#btn-clean').click(function() {
					$('#fztable').getObj().load([]);
				});
				$(document).on('click','#fztable .btn-delete',function(){
					var obj = $("#fztable").getObj(); // 取对象
					var rowid = $(this).closest('tr').attr('id');
					obj.del(rowid);
					for(var i=0;i<$('#fztable').find('.indexcolumn').length;i++){
						$('#fztable').find('.indexcolumn').eq(i).html(i+1)
					}
				})
				$(document).on('blur','input',function(){
					if($(this).attr('name') == 'exRate'){
						if(!isNaN(parseFloat($(this).val()))){
							$(this).val(parseFloat($(this).val()))
						}
						var ws  = 2
						if($(this).parent('div').find('input[name="exRate"]').attr('rateDigits')!=undefined){
							ws = parseFloat($(this).parent('div').find('input[name="exRate"]').attr('rateDigits'))
						}
			        	var qty = $(this).parent('div').find('input[name="currAmt"]')
			        	var price = $(this).val()
			        	var stadamt = $(this).parent('div').find('#fztablemoneystadAmt')
			        	if(qty.val()!=''){
							if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(price))){
								stadamt.attr('iskeyup','1')
								stadamt.val(parseFloat(qty.val()*price).toFixed(2))
							}
						}
			        	if(stadamt.val()!=''){
							if(!isNaN(parseFloat(stadamt.val())) && !isNaN(parseFloat(price))){
								qty.attr('iskeyup','1')
								if(price!=0){
			            			qty.val(parseFloat(stadamt.val()/price).toFixed(ws))
								}
			            	}
			        	}
					}else if($(this).attr('name') == 'currAmt'){
						if(!isNaN(parseFloat($(this).val()))){
							$(this).val(parseFloat($(this).val()))
						}
						var ws  = 2
						if($(this).parent('div').find('input[name="exRate"]').attr('rateDigits')!=undefined){
							ws = parseFloat($(this).parent('div').find('input[name="exRate"]').attr('rateDigits'))
						}
			        	var qty = $(this).parent('div').find('input[name="exRate"]')
			        	var price = $(this).val()
			        	var stadamt = $(this).parent('div').find('#fztablemoneystadAmt')
			        	if(qty.val()!=''){
							if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(price))){
								stadamt.attr('iskeyup','1')
			            		stadamt.val(parseFloat(qty.val()*price).toFixed(2))
			            	}
			        	}
			        	if(stadamt.val()!=''){
							if(!isNaN(parseFloat(stadamt.val())) && !isNaN(parseFloat(price))){
								qty.attr('iskeyup','1')
								if(price!=0){
				            		qty.val(parseFloat(stadamt.val()/price).toFixed(ws))
				            	}
			            	}
			        	}
					}else if($(this).attr('name') == 'qty'){
						if(!isNaN(parseFloat($(this).val()))){
							$(this).val(parseFloat($(this).val()))
						}
						var ws = window.ownerData.qtyDigits
			        	var qty = $(this).parent('div').find('input[name="price"]')
			        	var price = $(this).val()
			        	var stadamt = $(this).parent('div').find('#fztablemoneystadAmt')
			        	if(qty.val()!=''){
							if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(price))){
								stadamt.attr('iskeyup','1')
			            		stadamt.val(parseFloat(qty.val()*price).toFixed(2))
			            	}
			        	}
			        	if(stadamt.val()!=''){
							if(!isNaN(parseFloat(stadamt.val())) && !isNaN(parseFloat(price))){
								qty.attr('iskeyup','1')
								if(price!=0){
			            		qty.val(parseFloat(stadamt.val()/price).toFixed(ws))
			            	}
			            	}
			        	}
					}else if($(this).attr('name') == 'price'){
						if(!isNaN(parseFloat($(this).val()))){
							$(this).val(parseFloat($(this).val()))
						}
						var ws = window.ownerData.qtyDigits
						$(this).removeAttr('iskeyup')
			        	var qty = $(this).parent('div').find('input[name="qty"]')
			        	var price = $(this).val()
			        	var stadamt = $(this).parent('div').find('#fztablemoneystadAmt')
			        	if(qty.val()!=''){
							if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(price))){
								stadamt.attr('iskeyup','1')
			            		stadamt.val(parseFloat(qty.val()*price).toFixed(2))
			            	}
			        	}
			        	if(stadamt.val()!=''){
							if(!isNaN(parseFloat(stadamt.val())) && !isNaN(parseFloat(price))){
								qty.attr('iskeyup','1')
								if(price!=0){
			            		qty.val(parseFloat(stadamt.val()/price).toFixed(ws))
			            	}
			            	}
			        	}
					}else if($(this).attr('id') == 'fztablemoneystadAmt'){
						if(window.ownerData.isCur == 1 && window.ownerData.isQty == 0){
							var ws  = 2
							if($(this).parent('div').find('input[name="exRate"]').attr('rateDigits')!=undefined){
								ws = parseFloat($(this).parent('div').find('input[name="exRate"]').attr('rateDigits'))
							}
							$(this).removeAttr('iskeyup')
							var stadamt = $(this)
							var qty = $(this).parent('div').find('input[name="exRate"]')
							var price = $(this).parent('div').find('input[name="currAmt"]')
							if(stadamt.val()!='' && qty.val()!=''){
								if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(stadamt.val()))){
									price.attr('iskeyup','1')
									if(qty.val()!=0){
						    			price.val(parseFloat(stadamt.val()/qty.val()).toFixed(ws))
									}
						    	}
							}else if(stadamt.val()!='' && price.val()!=''){
								if(!isNaN(parseFloat(price.val())) && !isNaN(parseFloat(stadamt.val()))){
									qty.attr('iskeyup','1')
									if(price.val()!=0){
							    		qty.val(parseFloat(stadamt.val()/price.val()).toFixed(ws))
							    	}
						    	}
							}
						}
						if(window.ownerData.isQty == 1){
							var ws = window.ownerData.qtyDigits
							$(this).removeAttr('iskeyup')
							var stadamt = $(this)
							var qty = $(this).parent('div').find('input[name="qty"]')
							var price = $(this).parent('div').find('input[name="price"]')
							if(stadamt.val()!='' && qty.val()!=''){
								if(!isNaN(parseFloat(qty.val())) && !isNaN(parseFloat(stadamt.val()))){
									price.attr('iskeyup','1')
									if(qty.val()!=0){
						    			price.val(parseFloat(stadamt.val()/qty.val()).toFixed(ws))
									}
						    	}
							}else if(stadamt.val()!='' && price.val()!=''){
								if(!isNaN(parseFloat(price.val())) && !isNaN(parseFloat(stadamt.val()))){
									qty.attr('iskeyup','1')
									if(price.val()!=0){
						    			qty.val(parseFloat(stadamt.val()/price.val()).toFixed(ws))
									}
						    	}
							}
						}
					}
				})
				

				},100)
			}
		}
	}();
	/////////////////////
	page.init();
});