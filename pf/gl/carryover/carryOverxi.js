$(function() {
	var page = function() {
		var ptData = {};
		var acctData = ''
		var codeforfised = {}
		var rowforfised = {}
		var agencyCode = '',
			acctCode = '',
			accsCode = '',
			isparalel = '',
			accacodes = '';
		var oTable;
		var selvousavedata = [];
		var dataindex = '0';
		var urlObj = {
			"agency": "/gl/eleAgency/getAgencyTree",
			"acct": "/gl/eleCoacc/getRptAccts"
		}
		setTimeout(function() {}, 200)
		return {
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				$('#cbAgency').ufTreecombox({
					url: urlObj.agency,
					idField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					placeholder: '请选择单位',
					icon: 'icon-unit',
					theme: 'label',
					leafRequire: true,
					onChange: function(sender, treeNode) {
						agencyCode = $('#cbAgency').getObj().getValue();
						var url = urlObj.acct ;
						callback = function(result) {
							acctData = result.data
							$("#cbAcct").getObj().load(result.data);
						}
						ufma.get(url, {'userId':ptData.svUserId,'setYear':ptData.svSetYear,'agencyCode':agencyCode}, callback);
						//费用类型

					},
					onComplete: function(sender) {
						if(ptData.svAgencyCode) {
							$('#cbAgency').getObj().val(ptData.svAgencyCode);
						} else {
							$('#cbAgency').getObj().val('1');
						}
						ufma.hideloading();
					}
				});
			},
			stepfisedCode: function() {
				var setyear = ptData.svSetYear;
				var postSet = {
					acctCode: $("#cbAcct").getObj().getValue(),
					agencyCode: $("#cbAgency").getObj().getValue(),
					setYear: setyear
				}
				ufma.post("/gl/CarryOver/search", postSet, function(data) {
					$.each(data.data, function(idx, row) {
						rowforfised[row.fisPerd] = row
						codeforfised[row.fisPerd] = row.calendarGuid
					});
					var fisp = 1;
					for(var i=0;i<data.data.length;i++){
						if(data.data[i].status=='CLOSED' && data.data[i+1]!=undefined && data.data[i+1].status!='CLOSED'){
							fisp = data.data[i].fisPerd+1
							break;
						}else if(data.data[i].status=='CLOSED' && data.data[i+1]==undefined){
							fisp = data.data[i].fisPerd
							break;
						}
					}
					$("#month-line .blue-line").find('.blue-one').removeClass('chooseend').removeClass('choose').removeClass('active')
//					fisp = 7
					for(var i=0;i<fisp;i++){
						if(fisp == i+1){
							$("#month-line .blue-line").find('.blue-one').eq(i).addClass('choose').addClass('active')
							break;
						}else{
							$("#month-line .blue-line").find('.blue-one').eq(i).addClass('chooseend')
						}
					}
					page.stepone()
				});
			},
			stepone: function() {
				var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
				var data = {
					acctCode: $("#cbAcct").getObj().getValue(),
					agencyCode: $("#cbAgency").getObj().getValue(),
					setYear: ptData.svSetYear,
					fisPerd: fisperds,
					calendarGuid: codeforfised[fisperds]
				}
				ufma.ajaxDef('/gl/CarryOver/validatePerdSelf','post',data,function(result){
					if(result.data.errCount > 0) {
						if($("#month-line .blue-line .blue-one.active").hasClass('chooseend')!=true){
							ufma.showTip(result.data.msg,function(){},'warning')
						}
						$("#caisjzsh").text("检查不通过："+result.data.msg)
						$("#copzzszs").html('凭证张数' + 0 + '张')
						$("#cowsh").html('0')
						$("#cowjz").html('0')
						$("#coyjz").html('0')
						$("#coyzf").html('0')
						$("#copzzszs").html('0') 
						$("#btn-prev").addClass('disabled')
						return false
					}else{
						$("#btn-prev").removeClass('disabled')
					}
				})
				if(rowforfised[fisperds]!=undefined && rowforfised[fisperds].status == 'CLOSED') {
					$('.costatus').html('已结账')
					$('.costatus').css('background', '#2c9e06')
					$('.costatus').css('border', '1px solid #2c9e06')
					$('#btn-bqtx').hide()
					$('#btn-quzc').hide()
					$('#btn-vouadd').hide()
					dataindex = 5
					page.stepstatus()
					$('.noaudit').show()
				} else {
					$('.costatus').html('未结账')
					$('.costatus').css('background', '#FFBF00')
					$('.costatus').css('border', '1px solid #FFBF00')
					$('#btn-bqtx').show()
					$('#btn-quzc').show()
					$('#btn-vouadd').show()
					dataindex = 0
					page.stepstatus()
					$('.noaudit').hide()
				}
				if(rowforfised[fisperds]!=undefined){
					$("#copzzszs").html(rowforfised[fisperds].noAuditCount + rowforfised[fisperds].auditCount + rowforfised[fisperds].jzCount + rowforfised[fisperds].cCount)
					$("#cowsh").html(rowforfised[fisperds].noAuditCount)
					$("#cowjz").html(rowforfised[fisperds].auditCount)
					$("#coyjz").html(rowforfised[fisperds].jzCount)
					$("#coyzf").html(rowforfised[fisperds].cCount)
				}
				$("#jzbgpzzs").html('凭证张数' + $("#copzzszs").html() + '张')
				ufma.post("/gl/CarryOver/getCarryReport", data, function(data) {
					var rowtext = ''
					$.each(data.data, function(idx, row) {
						rowtext += row.closing_rule_des + ' '
					});
					if(rowtext!=''){
						$("#coerrnu").html(rowtext)
					}else{
						$("#coerrnudiv").hide()
						$("#coerrnu").html(rowtext)
					}
				});
				var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
				var data = {
					acctCode: $("#cbAcct").getObj().getValue(),
					agencyCode: $("#cbAgency").getObj().getValue(),
					setYear: ptData.svSetYear,
					fisPerd: fisperds,
					rgCode: ptData.svRgCode,
					calendarGuid: codeforfised[fisperds]
				}
				ufma.ajaxDef('/gl/CarryOver/validate', 'post', data, function(data) {
					if(data.data.errCount > 0) {
						msg = data.data.msg
						$("#caisjzsh").text("检查不通过："+msg)
						$("#caisjzsh").prev('span').css('visibility','visible')
					}else{
						$("#caisjzsh").text('记账检查通过')
						$("#caisjzsh").prev('span').css('visibility','hidden')
					}
				})
				ufma.ajaxDef('/gl/CarryOver/getAllDisconVouNo', 'post', data, function(data) {
					if(data.data.length > 0) {
						msg = data.data.msg
						$("#nullnum").text("检查到的空号："+data.data.join(','))
					}else{
						$("#nullnum").text('检查到的空号：无')
					}
				})
			},
			stepfour: function() {
				var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
				var url = '/gl/GlAutoCo/search/' + agencyCode + '/' + acctCode + '/-1/' + accsCode + '/-1/YJ';
				if(fisperds == 12){
					url = '/gl/GlAutoCo/search/' + agencyCode + '/' + acctCode + '/-1/' + accsCode + '/-1/*';
				}
				var callback = function(result) {
					page.drawCarryTable(result.data);
				}
				ufma.ajaxDef(url, 'get', {}, callback);
			},
			drawCarryTable: function(data) {
				var $table = $('#carryCard');
				$table.html('')
				$tbl = $('<table id="tablecarryCard" class="table-bordered ufma-table dataTable bordered"></table>').appendTo($table);
				$('<thead><tr><th style="width:35px"><label class="mt-checkbox mt-checkbox-outline"><input type="checkbox" class="checkalls"><span></span></label></th><th>模板名称</th><th>方案类型</th><th>期间类型</th><th class="nowrap" style="width:100px;">操作</th></tr></thead>').appendTo($tbl);
				var $tbody = $('<tbody></tbody>').appendTo($tbl);
				var firstLetter = '';
				page.cord = data
				page.changecord = {}
				$.each(data, function(idx, row) {
					page.changecord[row.scheGuid] = row
					if(row.agencyCode != "*") {
						var fajb = '';
						if(row.agencyCode != '*') {
							fajb = '单位级';
						} else {
							fajb = '系统级';
						}
						var qjlx = '';
						if(row.vouKind == 'NJ') {
							qjlx = '年结';
						} else if(row.vouKind == 'YJ') {
							qjlx = '月结';
						}
						var tr = '<tr id="' + row.scheGuid + '"><td style="text-align:center;"><label style="margin-top:5px" class="mt-checkbox mt-checkbox-outline"><input type="checkbox"><span></span></label></td><td>' + row.scheName + '</td><td>' + row.enuName + '</td><td>' + qjlx + '</td>' +
							'<td style="text-align:center;">' +
							'<a class="btn-label margin-right-8 btn-set btn-permission btn-setup" data-toggle="tooltip" title="设置"><i class="glyphicon icon-setting"></i></a>';
						tr = tr + '<a class="btn-label margin-right-8 btn-vou btn-permission btn-vouadd" data-toggle="tooltip" title="生成凭证"><i class="glyphicon icon-Certificate"></i></a>';
						tr = tr + '<a class="btn-label btn-permission btn-Drag" data-toggle="tooltip" title="拖动排序"><i class="glyphicon icon-drag"></i></a>';
						tr = tr + '</td></tr>';
						var $row = $(tr).appendTo($tbody);
					}

				});
				$('#carryCard .btn-label[data-toggle="tooltip"]').tooltip();
				$('#tablecarryCard .btn-Drag').on('mousedown', function(e) {
					var callback = function() {
						var idx = 0;
						var ids = []
						$('#tablecarryCard tbody tr').each(function() {
							if(!$(this).hasClass('hide')) {
								idx = idx + 1;
								$(this).find('span.recno').html(idx);
								var idxs = {}
								idxs[$(this).attr('id')] = idx
								ids.push(idxs)
							}
						});
						ufma.post('/gl/GlAutoCo/order', ids, function() {
							ufma.showTip("排序保存成功", function() {}, "success")
						})

					};
					$('#tablecarryCard').tableSort(callback);
				});
				$('#tablecarryCard .btn-vou').on('click', function(e) {
					e.stopPropagation();
					var trid = $(this).closest('tr').attr('id');
					selvousavedata = [trid]
					page.editors = ufma.showModal('vouFisperdmodal', 550, 300);
				});
				$('#tablecarryCard .btn-setup').on('click', function(e) {
					var ids = $(this).parents('tr').attr('id')
					var rows = page.changecord[ids]
					rows['isSet'] = false;
					page.openEditWin(rows)
				});
				ufma.isShow(page.reslist);
			},
			openEditWin: function(card) {
				card = card || {};
				if(card.isAgency == 1) {
					acctCode = page.cbAcct.getValue();
				}
				accsCode = card['accsCode'] || accsCode;
				//				card.isAgency = '1';
				if(card.agencyCode == '*') {
					card.isAgency = '0';
				}
				card['agencyCode'] = agencyCode;
				card['acctCode'] = acctCode;
				card['accsCode'] = accsCode;
				card['bAgency'] = true;
				card['accaCode'] = card.accaCode;
				if(card.seqindex != undefined) {
					card['orderseq'] = card.seqindex
				} else {
					card['orderseq'] = page.cord.length;
				}
				card['accacodes'] = accacodes
				page.carrySetWin = ufma.open({
					url: '../endofperiod/autoCarryforward/carrySet.html',
					title: '转账明细',
					width: 880,
					height: 500,
					data: card,
					ondestory: function(data) {
						//if(data.action=='ok'){
						page.stepfour();
						//}
					}
				});
			},
			makeVou: function(scheGuid) {
				var agencyCode = $('#cbAgency').getObj().getValue();
				var acctCode = $("#cbAcct").getObj().getValue();
				var url = '/gl/GlAutoCo/buildVou?agencyCode=' + agencyCode + '&acctCode=' + acctCode + '&scheGuid=' + scheGuid;
				var callback = function(result) {
					var data = result.data
					var msgs = data.flag+"</br>"
					var msgss = ''
					for(var i in data){
						if(data[i].schName!=undefined){
							msgss+=data[i].schName+"内" +data[i].accoCode+data[i].message+"</br>"
						}
					}
					if(msgss!=''){
						msgs+=msgss
						ufma.showTip(msgs, function() {}, 'error');
					}else{
						ufma.showTip(msgs, function() {}, 'success');
					}
				};
				ufma.get(url, {}, callback);
			},
			onEventListener: function() {
				$(document).on("click", "#vouboxurl" ,function() {
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					$(this).attr('data-href', '/pf/gl/vouboxsi/vouBoxsi.html?menuid=5444eb79-d926-46f5-ae2b-2daf90ab8bcb&checkfisPerd='+fisperds);
					$(this).attr('data-title', '凭证箱');
					// window.parent.openNewMenu($(this));
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', '/pf/gl/vouboxsi/vouBoxsi.html?menuid=5444eb79-d926-46f5-ae2b-2daf90ab8bcb&checkfisPerd='+fisperds, false, "凭证箱");
				});
				$(document).on("click", "#vouboxsorg" ,function() {
					ufma.open({
						title: '凭证重排序',
						width: 900,
						height: 500,
						url: '../sortVoucher/sortVoucherxi.html',
						data: {
							acctCode: $("#cbAcct").getObj().getValue(),
							agencyCode: $("#cbAgency").getObj().getValue(),
                            acctName: $("#cbAcct").getObj().getText(),
							setYear: ptData.svSetYear,
							isDouble: accacodes,
							fisPerd:$("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
						},
						ondestory: function (result) {
							if (result.action == true) {
								ufma.showTip('凭证重排序成功', function () { }, "success");
							}
						}
					});
				});
				$(document).on("click", "#month-line .blue-line .chooseend a" ,function() {
					$(this).parents('.blue-one').addClass('active').siblings("li.blue-one").removeClass("active");
					dataindex = 0
					page.stepstatus()
					page.stepone()
				});
				$(document).on("click", "#month-line .blue-line .choose a" ,function() {
					$(this).parents('.blue-one').addClass('active').siblings("li.blue-one").removeClass("active");
					dataindex = 0
					page.stepstatus()
					page.stepone()
				});
				$(document).on("click", "#btn-noaudit" ,function() {
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					var data = {
						acctCode: $("#cbAcct").getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						fisPerd: fisperds,
						rgCode: ptData.svRgCode,
						calendarGuid: codeforfised[fisperds]
					}
					ufma.ajaxDef('/gl/CarryOver/cancelCarryVou', 'post', data, function(data) {
						ufma.showTip(data.msg,function(){},data.flag)
						if(data.msg=='反结账成功'){
							dataindex = 0
							page.stepstatus()
							page.stepfisedCode()
						}
						
					})
				});
				$(document).on('click', '#btn-prev', function() {
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					var data = {
						acctCode: $("#cbAcct").getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						fisPerd: fisperds,
						rgCode: ptData.svRgCode,
						calendarGuid: codeforfised[fisperds]
					}
					var isrun = true
					var msg = ''
					if(dataindex == 0) {
						ufma.ajaxDef('/gl/CarryOver/validate', 'post', data, function(data) {
							if(data.data.errCount > 0) {
								isrun = false
								msg = data.data.msg
							} else {
								isrun = true
							}
						})
					} else if(dataindex == 1) {
						ufma.ajaxDef('/gl/CarryOver/apportionPerd', 'post', data, function(data) {
							if(data.data > 0) {
								isrun = false
								msg = data.msg
							} else {
								isrun = true
							}
						})
					} else if(dataindex == 2) {
						var scheGuids = []
						for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
							if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
								scheGuids.push($('#tablecarryCard tbody').find('tr').eq(z).attr('id'))
							}
						}
						data.scheGuid = scheGuids
						ufma.ajaxDef('/gl/CarryOver/carryOverPerd', 'post', data, function(data) {
							if(data.data > 0) {
								isrun = false
								msg = data.msg
							} else {
								isrun = true
							}
						})
					} else if(dataindex == 3) {
						ufma.ajaxDef('/gl/CarryOver/checkBalancePerd', 'post', data, function(data) {
							if(data.data.errCount > 0) {
								isrun = false
								var msgg = ''
								for(var z in data.data.msg){
									msgg+=data.data.msg[z]+"<br/>"
								}
								msg = msgg
							} else {
								isrun = true
							}
						})
					} else if(dataindex == 4) {
						isrun = true
						var setyear = ptData.svSetYear;
						var postSet = {
							acctCode: $("#cbAcct").getObj().getValue(),
							agencyCode: $("#cbAgency").getObj().getValue(),
							setYear: setyear
						}
						ufma.post("/gl/CarryOver/search", postSet, function(data) {
							$.each(data.data, function(idx, row) {
								rowforfised[row.fisPerd] = row
								codeforfised[row.fisPerd] = row.calendarGuid
							});
							if(rowforfised[fisperds]!=undefined){
								$("#copzzszs").html(rowforfised[fisperds].noAuditCount + rowforfised[fisperds].auditCount + rowforfised[fisperds].jzCount + rowforfised[fisperds].cCount)
							}
							$("#jzbgpzzs").html('凭证张数' + $("#copzzszs").html() + '张')
						})
					} else if(dataindex == 5) {
						isrun = true
						var setyear = ptData.svSetYear;
						var postSet = {
							acctCode: $("#cbAcct").getObj().getValue(),
							agencyCode: $("#cbAgency").getObj().getValue(),
							setYear: setyear
						}
						ufma.post("/gl/CarryOver/search", postSet, function(data) {
							$.each(data.data, function(idx, row) {
								rowforfised[row.fisPerd] = row
								codeforfised[row.fisPerd] = row.calendarGuid
							});
							if(rowforfised[fisperds]!=undefined){
								$("#copzzszs").html(rowforfised[fisperds].noAuditCount + rowforfised[fisperds].auditCount + rowforfised[fisperds].jzCount + rowforfised[fisperds].cCount)
							}
							$("#jzbgpzzs").html('凭证张数' + $("#copzzszs").html() + '张')
							var fisp = 1;
							for(var i=0;i<data.data.length;i++){
								if(data.data[i].status=='CLOSED' && data.data[i+1]!=undefined && data.data[i+1].status!='CLOSED'){
									fisp = data.data[i].fisPerd+1
									$("#month-line .blue-line").find('.blue-one').removeClass('chooseend').removeClass('choose').removeClass('active')
									for(var z=0;z<fisp;z++){
										if(fisp == z+1){
											$("#month-line .blue-line").find('.blue-one').eq(z).addClass('choose').addClass('active')
											break;
										}else{
											$("#month-line .blue-line").find('.blue-one').eq(z).addClass('chooseend')
										}
									}
									$("#month-line .blue-line .active a").trigger('click')
									$('.newxnd').hide()
									break;
								}else if(data.data[i].status=='CLOSED' && data.data[i+1]==undefined){
									ufma.showTip('结账已完成，请登录新年度继续业务处理',function(){},'success')
									// ufma.showTip('结账已完成，请点击底部按钮生成下年度期初或者登录新年度继续业务处理',function(){},'success')
									$('.newxnd').show()
									break;
								}
							}
						})
					}
					if(dataindex < $("#coleft").find('.conav').length - 1 && isrun == true) {
						dataindex++;
						page.stepstatus()
					} else if(dataindex < $("#coleft").find('.conav').length - 1) {
						ufma.showTip(msg, function() {}, 'warning');
					}

				})
				
				$(document).on('click', '#btn-newxnd', function() {
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					var data = {
						acctCode: $("#cbAcct").getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						fisPerd: fisperds,
						rgCode: ptData.svRgCode,
						calendarGuid: codeforfised[fisperds]
					}
					ufma.get('/gl/newAgencySetInit/initNewYearAccBal/'+ptData.svRgCode+'/'+ptData.svSetYear+'/'+ $("#cbAgency").getObj().getValue()+'/'+$("#cbAcct").getObj().getValue(),'',function(){
						ufma.showTip('结账已完成，请登录新年度继续业务处理',function(){},'success')
						page.stepone()
					})
				})
				$(document).on('click', '#btn-next', function() {
					if(dataindex > 0) {
						dataindex--;
						page.stepstatus()
					}
				})
				$(document).on('change', '#tablecarryCard .checkalls', function() {
					if($(this).is(':checked')) {
						$("#tablecarryCard input[type='checkbox']").prop('checked', true)
					} else {
						$("#tablecarryCard input[type='checkbox']").prop('checked', false)
					}
				})
				$(document).on('click', '#btn-bqtx', function() {
					var updata = {data:[],fisPerd:$("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")}
					for(var i = 0; i < $("#cogrid").find('tbody tr').length; i++) {
						if($("#cogrid").find('tbody tr').eq(i).find("input[type='checkbox']").is(":checked")) {
							updata.data.push(page.cogriddatas[i])
						}
					}
					ufma.ajaxDef('/gl/ApportionBook/autoApportion', 'post', updata, function(data) {
						ufma.showTip(data.msg, function() {}, data.flag)
						var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
						var datas1 = {
							acctCode: $("#cbAcct").getObj().getValue(),
							agencyCode: $("#cbAgency").getObj().getValue(),
							fisPerd: fisperds
						}
						ufma.ajaxDef('/gl/ApportionBook/selectQJ', 'post', datas1, function(data) {
							var trd = ''
							page.cogriddatas = data.data
							for(var i = 0; i < data.data.length; i++) {
								trd += '<tr>'
								trd += '<td style="width:35px;text-align: center;">'
								trd += '<label class="mt-checkbox mt-checkbox-outline">'
								trd += '<input type="checkbox" class="">'
								trd += '<span></span>'
								trd += '</label>'
								trd += '</td>'
								trd += '<td style="width:35px;text-align: center;">' + i + '</td>'
								trd += '<td>' + data.data[i].fylxName + '</td>'
								trd += '<td>' + data.data[i].createDate + '</td>'
								trd += '<td style="text-align: right;">' + data.data[i].apportionMoney + '</td>'
								trd += '<td>' + data.data[i].apportionPeriod + '期</td>'
								trd += '<td style="text-align: right;">' + data.data[i].apportionedMoney + '</td>'
								trd += '<td>' + data.data[i].apportionedPeriod + '期</td>'
								trd += '<td style="text-align: right;">' + data.data[i].noapportionedPeriod + '</td>'
								trd += '<td style="text-align: right;">' + data.data[i].qjApportionMoney+ '</td>'
								trd += '</tr>'
							}
							$("#cogrid").find('tbody').html(trd)
						})
					})
				})
				$(document).on('click', '#btn-quzc', function() {
					var updata = {data:page.cogriddatas,fisPerd:$("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")}
					ufma.ajaxDef('/gl/ApportionBook/autoApportionOut', 'post', updata, function(data) {
						ufma.showTip(data.msg, function() {}, data.flag)
						var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
						var datas1 = {
							acctCode: $("#cbAcct").getObj().getValue(),
							agencyCode: $("#cbAgency").getObj().getValue(),
							fisPerd: fisperds
						}
						ufma.ajaxDef('/gl/ApportionBook/selectQJ', 'post', datas1, function(data) {
							var trd = ''
							page.cogriddatas = data.data
							for(var i = 0; i < data.data.length; i++) {
								trd += '<tr>'
								trd += '<td style="width:35px;text-align: center;">'
								trd += '<label class="mt-checkbox mt-checkbox-outline">'
								trd += '<input type="checkbox" class="">'
								trd += '<span></span>'
								trd += '</label>'
								trd += '</td>'
								trd += '<td style="width:35px;text-align: center;">' + i + '</td>'
								trd += '<td>' + data.data[i].fylxName + '</td>'
								trd += '<td>' + data.data[i].createDate + '</td>'
								trd += '<td style="text-align: right;">' + data.data[i].apportionMoney + '</td>'
								trd += '<td>' + data.data[i].apportionPeriod + '期</td>'
								trd += '<td style="text-align: right;">' + data.data[i].apportionedMoney + '</td>'
								trd += '<td>' + data.data[i].apportionedPeriod + '期</td>'
								trd += '<td style="text-align: right;">' + data.data[i].noapportionedPeriod + '</td>'
								trd += '<td style="text-align: right;">' + data.data[i].qjApportionMoney+ '</td>'
								trd += '</tr>'
							}
							$("#cogrid").find('tbody').html(trd)
						})
					})
				})
				$(document).on('change', '#cogrid .checkalls', function() {
					if($(this).is(':checked')) {
						$("#cogrid input[type='checkbox']").prop('checked', true)
					} else {
						$("#cogrid input[type='checkbox']").prop('checked', false)
					}
				})
				$(document).on('change', '#cogridbar .checkalls', function() {
					if($(this).is(':checked')) {
						$("#cogrid input[type='checkbox']").prop('checked', true)
					} else {
						$("#cogrid input[type='checkbox']").prop('checked', false)
					}
				})
				$(document).on('click', '#jzbgbtn', function() {
					$('#btn-prev').trigger('click')
				})
				$(document).on('click', '#btn-vouadd', function() {
					selvousavedata = []
					for(var z = 0; z < $('#tablecarryCard tbody').find('tr').length; z++) {
						if($('#tablecarryCard tbody').find('tr').eq(z).find('input[type="checkbox"]').is(':checked')) {
							selvousavedata.push($('#tablecarryCard tbody').find('tr').eq(z).attr('id'))
						}
					}
					if(selvousavedata.length > 0) {
						page.editors = ufma.showModal('vouFisperdmodal', 550, 300);
					} else {
						ufma.showTip('请勾选需要生成凭证的内容', 'warning', function() {})
					}
				})
				$(document).on('click', '#btn-vouFisperdqr', function() {
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd");
					var acctCode = $('#cbAcct').getObj().getValue();
					var optionguid= codeforfised[fisperds]
					var fisperd= fisperds
					var vousavedata = selvousavedata.join(',')
					var voutypecode= $("#vouTypeCodesel option:selected").attr('value')
					var url = '/gl/GlAutoCo/buildVou?agencyCode=' + agencyCode + '&acctCode=' + acctCode + '&scheGuid=' + selvousavedata+'&calendarGuid=' + optionguid+'&fisPerd=' + fisperd+'&vouTypeCode=' + voutypecode;
					var callback = function(result) {
						var data = result.data
						var msgs = data.flag+"</br>"
						var msgss = ''
						for(var i in data){
							if(data[i].schName!=undefined){
								msgss+=data[i].schName+"内" +data[i].accoCode+data[i].message+"</br>"
							}
						}
						if(msgss!=''){
							msgs+=msgss
							ufma.showTip(msgs, function() {}, 'error');
						}else{
							ufma.showTip(msgs, function() {}, 'success');
						}
						page.editors.close()
					};
					ufma.get(url, {}, callback);
				})
				$(document).on('click','#btn-vouFisperdclose',function(e){
					page.editors.close()
				})
			},
			stepstatus: function() {
				$("#coleft").find('.conav').removeClass('actives').removeClass('cblue')
				for(var z = 0; z < dataindex; z++) {
					$("#coleft").find('.conav').eq(z).addClass('cblue')
				}
				$("#coleft").find('.conav').eq(dataindex).addClass('actives').addClass('cblue')
				if(dataindex == 2) {
					$('.covousc').show()
				} else {
					$('.covousc').hide()
				}
				if(dataindex == 5) {
					$('#btn-prev').text('完成')
//					$('.noaudit').show()
				} else {
					$('#btn-prev').text('下一步')
//					$('.noaudit').hide()
				}
//				if(dataindex == 5) {
//					$('#btn-prev').hide()
//				} else {
//					$('#btn-prev').show()
//				}
				$('#coright').find('.stepshow').hide()
				$('#coright').find('.stepshow').eq(dataindex).show()
				if(dataindex == 0) {

				} else if(dataindex == 1) {
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					var datas1 = {
						acctCode: $("#cbAcct").getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						fisPerd: fisperds
					}
					ufma.ajaxDef('/gl/ApportionBook/selectQJ', 'post', datas1, function(data) {
						var trd = ''
						page.cogriddatas = data.data
						for(var i = 0; i < data.data.length; i++) {
							trd += '<tr>'
							trd += '<td style="width:35px;text-align: center;">'
							trd += '<label class="mt-checkbox mt-checkbox-outline">'
							trd += '<input type="checkbox" class="">'
							trd += '<span></span>'
							trd += '</label>'
							trd += '</td>'
							trd += '<td style="width:35px;text-align: center;">' + i + '</td>'
							trd += '<td>' + data.data[i].fylxName + '</td>'
							trd += '<td>' + data.data[i].createDate + '</td>'
							trd += '<td style="text-align: right;">' + data.data[i].apportionMoney + '</td>'
							trd += '<td>' + data.data[i].apportionPeriod + '期</td>'
							trd += '<td style="text-align: right;">' + data.data[i].apportionedMoney + '</td>'
							trd += '<td>' + data.data[i].apportionedPeriod + '期</td>'
							trd += '<td style="text-align: right;">' + data.data[i].noapportionedPeriod + '</td>'
							trd += '<td style="text-align: right;">' + data.data[i].qjApportionMoney+ '</td>'
							trd += '</tr>'
						}
						$("#cogrid").find('tbody').html(trd)
					})
				} else if(dataindex == 2) {
					page.stepfour()
				} else if(dataindex == 3) {
					if(isparalel == 1) {
						$(".stepfivedivysp").show()
						$('.stepfivedivys').show()
					} else {
						$(".stepfivedivysp").hide()
						$('.stepfivedivys').hide()
					}
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					var data = {
						acctCode: $("#cbAcct").getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						fisPerd: fisperds,
						rgCode: ptData.svRgCode,
						accsCode:accsCode,
						calendarGuid: codeforfised[fisperds]
					}
					ufma.ajaxDef('/gl/CarryOver/getBalancePerd', 'post', data, function(data) {
						$('.stepfivedivcw').find('.fivejmx').html('')
						$('.stepfivedivcw').find('.fivedmx').html('')
						$('.stepfivedivys').find('.fivejmx').html('')
						$('.stepfivedivys').find('.fivedmx').html('')
						var cj = 0,
							cd = 0,
							yj = 0,
							yd = 0;
						$.each(data.data, function(idx, row) {
							if(row.CHR_CODE < 6) {
								if(row.BAL_DIR == 1) {
									if(row.AMT != undefined && row.AMT != 0) {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥' + $.formatMoney(row.AMT, 2) + '</span>' +
											'</span>'
										$('.stepfivedivcw').find('.fivejmx').append(tr)
										cj += parseFloat(row.AMT)
									} else {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥0.00</span>' +
											'</span>'
										$('.stepfivedivcw').find('.fivejmx').append(tr)
									}

								} else {
									if(row.AMT != undefined && row.AMT != 0) {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥' + $.formatMoney(row.AMT, 2) + '</span>' +
											'</span>'
										$('.stepfivedivcw').find('.fivedmx').append(tr)
										cd += parseFloat(row.AMT)
									} else {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥0.00</span>' +
											'</span>'
										$('.stepfivedivcw').find('.fivedmx').append(tr)
									}
								}
							} else {
								if(row.BAL_DIR == 1) {
									if(row.AMT != undefined && row.AMT != 0) {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥' + $.formatMoney(row.AMT, 2) + '</span>' +
											'</span>'
										$('.stepfivedivys').find('.fivejmx').append(tr)
										yj += parseFloat(row.AMT)
									} else {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥0.00</span>' +
											'</span>'
										$('.stepfivedivys').find('.fivejmx').append(tr)
									}
								} else {
									if(row.AMT != undefined && row.AMT != 0) {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥' + $.formatMoney(row.AMT, 2) + '</span>' +
											'</span>'
										$('.stepfivedivys').find('.fivedmx').append(tr)
										yd += parseFloat(row.AMT)
									} else {
										var tr = '<span>' +
											'<span class="fivename">' + row.CHR_NAME + ':</span>' +
											'<span class="fiveamt">¥0.00</span>' +
											'</span>'
										$('.stepfivedivys').find('.fivedmx').append(tr)
									}
								}
							}
						});
						$('.stepfivedivcw').find('.fivejhj').html('￥' + $.formatMoney(cj, 2))
						$('.stepfivedivcw').find('.fivedhj').html('￥' + $.formatMoney(cd, 2))
						$('.stepfivedivys').find('.fivejhj').html('￥' + $.formatMoney(yj, 2))
						$('.stepfivedivys').find('.fivedhj').html('￥' + $.formatMoney(yd, 2))
						if(parseFloat(cj).toFixed(2) == parseFloat(cd).toFixed(2)) {
							$('.coiconfivec').html('<span class="icon-balance" style="font-size: 80px;"></span>')
						} else {
							$('.coiconfivec').html('<span class="icon-unbalance" style="font-size: 80px;"></span>')
						}
						if(parseFloat(yj).toFixed(2) == parseFloat(yd).toFixed(2)) {
							$('.coiconfivey').html('<span class="icon-balance" style="font-size: 80px;"></span>')
						} else {
							$('.coiconfivey').html('<span class="icon-unbalance" style="font-size: 80px;"></span>')
						}
					})
				} else if(dataindex == 4) {
					$('.stepsixload').height($("#coright").height() - 32).show()
					$('.stepsixsuccess').height($("#coright").height() - 32).hide()
					$('.stepsixerror').height($("#coright").height() - 32).hide()
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					var data = {
						acctCode: $("#cbAcct").getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						fisPerd: fisperds,
						rgCode: ptData.svRgCode,
						calendarGuid: codeforfised[fisperds]
					}
					ufma.ajaxDef('/gl/CarryOver/doCarryVou', 'post', data, function(result) {
						if(result.data.errCount <=0) {
							$('.stepsixload').hide()
							$('.stepsixsuccess').show()
							$('.stepsixerror').hide()
							$('#btn-prev').show()
						} else {
							$('.stepsixload').hide()
							$('.stepsixsuccess').hide()
							$('.stepsixerror').show()
//							$('#btn-prev').hide()
							$("#stepsixerrordata").html(result.data.msg)
						}
					})
				} else if(dataindex == 5) {
					var fisperds = $("#month-line .blue-line .blue-one.active a").attr("data-fisPerd")
					var data = {
						acctCode: $("#cbAcct").getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						fisPerd: fisperds,
						rgCode: ptData.svRgCode,
						calendarGuid: codeforfised[fisperds]
					}
					ufma.ajaxDef('/gl/CarryOver/getCarryReport', 'post', data, function(datas) {
						$("#jzbgdiv").find('.jzbg').remove()
						$.each(datas.data, function(idx, row) {
							$("#jzbgdiv").append('<div class="jzbg"><span class="icon-check-circle"></span>' + row.closing_rule_des + '</div>')
						});
						$('.costatus').html('已结账')
						$('.costatus').css('background', '#2c9e06')
						$('.costatus').css('border', '1px solid #2c9e06')
					})
				}
			},
			defineFisPerd: function() {
//				//获得月份（0-11）
//				var indexMonth = new Date(ptData.svTransDate).getMonth();
//				//时间选择样式
////				$("#month-line .blue-line .blue-one").removeClass("choose");
////				for(var z=0;z<indexMonth;z++){
////					$("#month-line .blue-line .blue-one").eq(z).addClass("choose");
////				}
//				$("#month-line .blue-line .blue-one").removeClass("choose");
//				for(var z=0;z<indexMonth;z++){
//					$("#month-line .blue-line .blue-one").eq(z).addClass("chooseend");
//				}
//				$("#month-line .blue-line .blue-one").eq(indexMonth).addClass("choose");
//
//				console.log($("#month-line .blue-line .blue-one.active a").attr("data-fisPerd"))
			},
			//初始化页面
			initPage: function() {
				$("#cbAcct").ufCombox({
					idField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(data) {
						acctCode = $('#cbAcct').getObj().getValue();
						accacodes = '';
						for(var i = 0; i < acctData.length; i++) {
							if(acctData[i].code == acctCode) {
								accsCode = acctData[i].accsCode
								isparalel = acctData[i].isParallel
								if(acctData[i].isParallel == '1' && acctData[i].isDoubleVou== '1') {
									accacodes = '*'
								} else {
									accacodes = '*'
								}
							}
						}
						if(data.isParallel== '1' && data.isDoubleVou == '1') {
							accacodes = '*'
						} else {
							accacodes = '*'
						}
						var url = '/gl/eleVouType/getVouType/' + agencyCode + '/' + ptData.svSetYear + '/' + acctCode + '/' + accacodes;
						callback = function(result) {
							accaCodedata = result.data
							var tr=''
							for(var i=0;i<accaCodedata.length;i++){
								tr += '<option value="' + accaCodedata[i].code + '">' + accaCodedata[i].name + '</option>'
							}
							$("#vouTypeCodesel").html(tr)
						};
						ufma.ajaxDef(url, 'get', {}, callback);
						dataindex = 0
						page.stepstatus()
						page.stepfisedCode()
					},
					onComplete: function(sender) {
						if(ptData.svAcctCode) {
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}
						ufma.hideloading();
					}
				});
				page.initAgencyScc()
				page.defineFisPerd()
			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				$('#cosetyear').html(ptData.svSetYear+'年')
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
				$('#coright').height($('body').height() - 210)
				$(".girddivcothree").height($('#coright').height() - 120)
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
			}
		}
	}();
	page.init();
});