$(function () {
	var ptData,
		oTable,
		argu, //表格数据
		comMode = {
			cancelType: 0,
			cancelMode: 1
		}, //核销方式
		sendObj = {}, //post数据
		loadOver = false,
		openDue = false,
		arguData;
		var accsCode = ''
		function tf(str) {
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
		};
	var page = function () {
		return {
			typeStr: '往来单位',
			initSelect: function (id, str, border) {
				if (border) {
					$(id).ufTreecombox({
						valueField: "chrName",
						textField: "chrName",
						readonly: false,
						placeholder: "请选择" + str,
						data: [],
						theme: ''
					});
				} else {
					$(id).ufTreecombox({
						valueField: "chrName",
						textField: "chrName",
						readonly: false,
						placeholder: "请选择" + str,
						data: [],
						theme: 'label',
					});
				}

			},
			select: function () {
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				//根据选择单位改变账套
				ufma.get("/gl/eleAgency/getAgencyTree", arguAge, function (result) {
					page.cbAgency = $("#cbAgency").ufTreecombox({
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						readonly: false,
						placeholder: "请选择单位",
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function (sender, data) {
							sendObj = {
								agencyCode: '', //单位
								acctCode: '', //账套
								accoCode: '', //会计科目
								currentCode: '', //往来单位
								typeSign: 0, //未核销
								accoType: 6, //应收
								startStadAmt: sendObj.startStadAmt,
								endStadAmt: sendObj.endStadAmt,
								remark: $('#remark').val()
							};
							//sendObj.agencyCode = data.CHR_CODE;
							sendObj.agencyCode = data.code; //多区划
							sendObj.agencyName = data.name;
							//缓存单位账套
							var params = {
								selAgecncyCode: sendObj.code,
								selAgecncyName: sendObj.name,
							}
							ufma.setSelectedVar(params);
							//改变单位,账套选择内容改变
							//修改权限  将svUserCode改为 svUserId  20181012
							var acctUrl = '/gl/eleCoacc/getRptAccts?agencyCode=' + sendObj.agencyCode + '&userId=' + ptData.svUserId + '&setYear=' + ptData.svSetYear;
							ufma.get(acctUrl, {}, function (result) {
								//sendObj.acctCode = result.data[0].CHR_CODE;
								page.cbAcct = $("#cbAcct").ufCombox({
									data: result.data,
									onChange: function (sender, data) {
										sendObj.acctCode = data.code; //多区划
										//缓存单位账套
										var params = {
											selAgecncyCode: sendObj.agencyCode,
											selAgecncyName: sendObj.agencyName,
											selAcctCode: data.code,
											selAcctName: data.name
										}
										ufma.setSelectedVar(params);
										//改变账套  选择会计科目
										//修改权限  将svUserCode改为 svUserId  20181012
										ufma.get('/gl/sys/coaAcc/getRptAccoTree?acctCode=' + sendObj.acctCode + '&agencyCode=' + data.agencyCode + '&setYear=' + ptData.svSetYear + '&userId=' + ptData.svUserId + '&accoType=' + sendObj.accoType + '&eleCode=ACCO', {}, function (result) { //多区划
											if (result.data.treeData) {
												page.cbAcco = $("#cbAcco").ufTreecombox({
													idField: 'id', //可选
													valueField: "code",
													textField: "codeName",
													readonly: false,
													pIdField: 'pId', //可选
													placeholder: "请选择会计科目",
													leafRequire: true,
													data: result.data.treeData,
													onChange: function (sender, data) {
														//sendObj.accoCode = data.CHR_CODE
														sendObj.accoCode = data.code; //多区划
														accsCode = data.accsCode
														page.accBal = data.accBal
														page.field1 = data.field1
														page.changeAcco()
														// if (openDue && arguData.colActionType == "02") {
														// 	//切换往来类型 S
														// 	$("#colAction .text").text("个人");
														// 	$("#colAction").attr("data-type", "02");
														// 	//切换往来类型 E
							
														// 	//跳转到此页面时，往来方是往来个人（人员），则请求人员列表并赋值
														// 	var reqData = {
														// 		agencyCode: $("#cbAgency").getObj().getValue(),
														// 		acctCode: sendObj.acctCode,
														// 		setYear: ptData.svSetYear,
														// 		rgCode: ptData.svRgCode,
														// 		eleCode: "EMPLOYEE"
														// 	};
							
														// 	ufma.get('/gl/elecommon/getEleCommonTree', reqData, function (result) {
														// 		page.payerAgencyData = result.data;
														// 		$('#cbCurrent').getObj().load(result.data);
														// 		//跳转赋值
														// 		$("#cbCurrent").getObj().val(arguData.currentCode);
														// 	});
														// } else {
														// 	//切换往来类型 S
														// 	$("#colAction .text").text("往来单位");
														// 	$("#colAction").attr("data-type", "01");
														// 	//切换往来类型 E
							
														// 	//改变单位  选择往来单位
														// 	var reqData = {
														// 		//agencyCode: data.CHR_CODE,
														// 		agencyCode: data.code, //多区划
														// 		acctCode: sendObj.acctCode,
														// 		setYear: ptData.svSetYear,
														// 		rgCode: ptData.svRgCode,
														// 		eleCode: "CURRENT"
														// 	};
							
														// 	ufma.get("/gl/elecommon/getEleCommonTree", reqData, function (result) {
														// 		$('#cbCurrent').getObj().load(result.data);
							
														// 		if (openDue) {
														// 			//跳转赋值
														// 			$("#cbCurrent").getObj().val(arguData.currentCode);
														// 		} else {
														// 			// 正常进入页面赋值
														// 			for (var i = 0; i < result.data.length; i++) {
														// 				if (result.data[i].isLeaf == "1") {
														// 					$('#cbCurrent').getObj().val(result.data[i].code);
														// 					break;
														// 				}
														// 			}
														// 		}
							
														// 	});
														// }
													},
													onComplete: function () {
														//跳转后赋值                                                    
														var timeId = setTimeout(function () {
															$("#cbAcco").getObj().val(openDue ? arguData.accoCode : '11');
															$("#query_table").trigger("click");
															clearTimeout(timeId);
														}, 200);
													}
												});
											}
										});
									},
									onComplete: function (sender) {
										//跳转后负值
										if (openDue) {
											$("#cbAcct").getObj().val(arguData.acctCode);
										} else {
											//正常进入页面赋值
											if (ptData.svAcctCode) {
												$("#cbAcct").getObj().val(ptData.svAcctCode);
											} else {
												$('#cbAcct').getObj().val('1');
											}
										}

									}
								});
							});

							

							page.initSelect('#cbAcco', "会计科目", true)
						},
						onComplete: function (sender) {
							var myDataFrom = page.getQueryString("dataFrom");
							if (myDataFrom != null && myDataFrom.toString().length > 1) {
								openDue = true;
								//应收款参数缓存
								var key = ufma.sessionKey("gl", "notesAccounts", ptData.svRgCode, ptData.svSetYear, ptData.svAgencyCode, ptData.svAcctCode, "notesAccounts");
								var arguStr = sessionStorage.getItem(key);
								arguData = JSON.parse(arguStr);
								$("#cbAgency").getObj().val(arguData.agencyCode);
								if(arguData.cancelStatusName == "未核销") {
									sendObj.typeSign = 0;
								} else if(arguData.cancelStatusName == "已核销") {
									sendObj.typeSign = 1;
								}
							} else if (ptData.svAgencyCode) {
								$('#cbAgency').getObj().val(ptData.svAgencyCode);
							} else {
								$('#cbAgency').getObj().val('1');
							}
							// loadOver = true;
						}
					});
				});

			},
			changeAcco:function(){
				var argu = {
					rgCode: ptData.svRgCode,
					setYear: ptData.svSetYear,
					agencyCode:sendObj.agencyCode,
					acctCode:sendObj.acctCode,
					accsCode:accsCode,
					chrCode:sendObj.accoCode
				}
				ufma.ajaxDef("/ma/sys/coaAcc/queryAccoTable", "get", argu, function (result) {
					if (result) {
						page.accoData = result.data.accoList[0]
						page.unCurrentAss = []
						page.isAss=false
						var count = 0;
						if (page.accoData.eleAccoItems.length != 0) {
							for (var i = 0; i < page.accoData.eleAccoItems.length; i++) {
								//CWYXM-17910 应收款核销和应付款核销界面，选择会计科目后，往来单位和个人的下拉框应根据科目所挂的往来单位或个人来切换 guohx 20200714 
								//不是往来单位也不是个人 就是有辅助核算项
								if (page.accoData.eleAccoItems[i].accitemCode == 'CURRENT') {
									$("#colAction").attr("data-type", '01');
									$("#colAction .text").text("往来单位");
									page.typeStr = '往来单位'
									page.payerAgency();
									// CWYXM-19594 账务处理模块，应收核销切换会计科目第一个辅项人员 第二个其他辅项会走最下面else 增加计数 guohx 20200826
									count++;
								} else if (page.accoData.eleAccoItems[i].accitemCode == 'EMPLOYEE') {
									$("#colAction").attr("data-type", '02');
									$("#colAction .text").text("个人");
									page.typeStr = '往来个人'
									page.payerEmployee();
									count++;
								} else {
									if (count == 0) {
										page.isAss = true
										page.unCurrentAss.push(page.accoData.eleAccoItems[i])
										//雪蕊说既没有挂人员也没有挂往来单位的默认显示往来单位
										$("#colAction").attr("data-type", '01');
										$("#colAction .text").text("往来单位");
										page.typeStr = '往来单位'
										page.payerAgency();
									}
								}
							}
						} else {
							//雪蕊说既没有挂人员也没有挂往来单位的默认显示往来单位
							$("#colAction").attr("data-type", '01');
							$("#colAction .text").text("往来单位");
							page.typeStr = '往来单位'
							page.payerAgency();
						}
						// .eleAccoItems
					}
				});
			},
			//返回地址栏的参数
			getQueryString: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			},
			//初始化table
			initGrid: function () {
				var columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check_H"/>&nbsp;<span></span> </label>',
					data: "guid",
					className: 'tc nowrap no-print',
					width: 30
				},
				{
					title: "标志",
					data: "assCancelType",
					className: 'nowrap isprint'

				},
				{
					title: "凭证日期",
					data: "vouDate",
					width: 100,
					className: 'nowrap tc isprint'
				},
				{
					//title: "凭证号",
					title: "凭证字号", //bug79520
					data: "vouNo",
					className: 'nowrap tr isprint',
					render: function(data, type, full, meta) {
						if(data != null) {
							if(full.vouGuid != null) {
								return '<span class="common-jump-link" data-vouguid="' + full.vouGuid + '">' + data + '</span>';
							} else {
								return data;
							}
						} else {
							return "";
						}
					}
				},
				{
					title: "摘要",
					data: 'vouDesc',
					className: 'nowrap isprint'
				},{
					title: "会计科目",
					data: 'accoCodeName',
					className: 'nowrap isprint'
				}];
				if(page.accoData.field1 == 1){
					if (page.typeStr = '往来个人') {
						columns.push({
							title: "往来方",
							data: 'employeeName',
							className: 'nowrap isprint',
							render: function (data, type, rowdata, meta) {
								if (rowdata.employeeName == undefined) {
									return "";
								}
								return rowdata.employeeName;
		
							}
						},
						{
							title: "往来日期",
							data: 'bussDate',
							className: 'nowrap isprint',
							render: function (data, type, rowdata, meta) {
								if (rowdata.bussDate == undefined) {
									return "";
								}
								return rowdata.bussDate;
		
							}
						},
						{
							title: "往来号",
							data: 'field1',
							className: 'nowrap isprint',
							render: function (data, type, rowdata, meta) {
								if (rowdata.field1 == undefined) {
									return "";
								}
								return rowdata.field1;
		
							}
						})
					}else{
						columns.push({
							title: "往来方",
							data: 'currentName',
							className: 'nowrap isprint',
							render: function (data, type, rowdata, meta) {
								if (rowdata.currentName == undefined) {
									return "";
								}
								return rowdata.currentName;
		
							}
						},
						{
							title: "往来日期",
							data: 'bussDate',
							className: 'nowrap isprint',
							render: function (data, type, rowdata, meta) {
								if (rowdata.bussDate == undefined) {
									return "";
								}
								return rowdata.bussDate;
		
							}
						},
						{
							title: "往来号",
							data: 'field1',
							className: 'nowrap isprint',
							render: function (data, type, rowdata, meta) {
								if (rowdata.field1 == undefined) {
									return "";
								}
								return rowdata.field1;
		
							}
						})
					}
					
				}
				columns.push({
					title: "票据类型",
					data: 'billType',
					className: 'nowrap isprint'
				},
				{
					title: "票据号",
					data: 'billNo',
					className: 'nowrap tr isprint'
				})
				if(page.unCurrentAss.length>0){
					for(var i=0;i<page.unCurrentAss.length;i++){
						//如果显示往来方 不显示人员
						if(!(page.accoData.field1 == 1&&page.unCurrentAss[i].eleName==='人员')){
							var codename = tf(page.unCurrentAss[i].accitemCode)+'Name'
							columns.push({
								title: page.unCurrentAss[i].eleName,
								data: codename,
								className: 'nowrap isprint',
								render: function (data, type, rowdata, meta) {
									if (rowdata[codename] == undefined) {
										return "";
									}
									return rowdata[codename];
			
								}
							})
						}
						
					}
				}
				columns.push({
					title: "借方金额",
					data: 'stadAmt',
					className: 'nowrap tr isprint tdNum',
					render: function (data, type, rowdata, meta) {
						if (rowdata.drCr == -1 || !data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2) +'</div>';

					}
				},
				{
					title: "贷方金额",
					data: 'stadAmt',
					className: 'nowrap tr isprint tdNum',
					render: function (data, type, rowdata, meta) {
						if (rowdata.drCr == 1 || !data || data == 0 || data == "0" || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2) +'</div>';
					}
				},
				{
					title: "已核销金额",
					data: 'amtAlready',
					className: 'nowrap tr isprint tdNum',
					render: function (data, type, rowdata, meta) {
						if (!data || data == 0 || data == 0 || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2) +'</div>';
					}
				},
				{
					title: "待核销金额",
					data: 'amtWait',
					className: 'nowrap tr isprint tdNum',
					render: function (data, type, rowdata, meta) {
						if (!data || data == 0 || data == 0 || data == "0.00") {
							return "";
						}
						return '<div style="text-align: right">' + $.formatMoney(data, 2)+'</div>';
					}
				},
				{
					title: "坏账金额",
					data: 'badMoney',
					className: 'nowrap tr isprint tdNum',
					render: function (data, type, rowdata, meta) {
						if (!data || data == 0 || data == 0 || data == "0.00") {
							return "";
						}
						/*return '<div style="text-align: right">' + $.formatMoney(data, 2); +
						'</div>';*/
						//修改金额算法,坏账确认金额-坏账收回金额
						var money = $.parseFloat(data) - $.parseFloat(rowdata.badBackMoney);
						return '<div style="text-align: right">' + $.formatMoney(money, 2) + '</div>';
					}
				},
				{
					title: "核销时间",
					data: 'createDate',
					className: 'nowrap tc isprint',
					width: 155
				})
				oTable = $("#gridGOV").dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"serverSide": false,
					"ordering": false,
					columns: columns,
					//填充表格数据
					data: [],
					// "dom": 'rt<"gridGOV-paginate"ilp>',
					"dom": '<"datatable-toolbar"B>rt<"gridGOV-paginate"ilp>',
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
							columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}
					],
					initComplete: function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar');
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						document.getElementsByClassName('info')[0].style.top = "47px";
						$('.gridGOV-paginate').appendTo($info);

						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							//ufma.expXLSForDatatable($('#gridGOV'), '应收款核销');
							uf.expTable({
								title: '应收款核销',
								exportTable: '#gridGOV'
							});
						});
						//导出end
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
					},
					"drawCallback": function () {
						//弹出详细凭证
						$("#dueCav").find("td span").on("click", function () {
							var vouGuid = $(this).attr("data-vouguid"); //凭证id
							var vouMenuId = 'f24c3333-9799-439a-94c9-f0cdf120305d';
							if (vouGuid) {
								var baseUrl = '/pf/gl/vou/index.html?menuid=' + vouMenuId + '&dataFrom=accDetailIncome&action=query&vouGuid=' + vouGuid + '&agencyCode=' + sendObj.agencyCode + '&acctCode=' + sendObj.acctCode;
								uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', baseUrl, false, "凭证录入");
							}
							ufma.setBarPos($(window));
						});
						$(".tableBox").css({
							"overflow-x": "auto"
						});
					},
					"columnDefs": [{ //对列进行特殊操作---》适用于checkBox
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap no-print",
						"render": function (data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					}]
				});
			},
			//获取
			loadGrid: function (url, argus) {
				if (openDue && arguData.detailAssGuid) {
					argus.refDetailAssGuid = arguData.detailAssGuid;
				}
				ufma.showloading()
				ufma.get(url, argus, function (result) {
					ufma.hideloading()
					openDue = false;
					argu = result.data;
					var setData = result.data.splice(argu.length - 1);
					$('#sumD').html($.formatMoney(setData[0].crAmtSum, 2));
					$('#sumJ').html($.formatMoney(setData[0].drAmtSum, 2));
					$('#sumC').html($.formatMoney(setData[0].difAmt, 2));
					oTable.fnClearTable();
					if (argu.length != 0) {
						oTable.fnAddData(argu, true);
					}
					// else {
					//     ufma.showTip('数据不存在！', function () {
					//     }, 'warning');
					// }
					//表格模拟滚动条
					$('#gridGOV').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					ufma.setBarPos($(window));
					// $("#gridGOV").fixedColumns({
					//     rightColumns: 1,//锁定右侧一列
					//     // leftColumns: 1//锁定左侧一列
					// });

				})
			},
			onEventListener: function () {
				//查询
				$('#query_table').on('click', function () {
					//新增需求80009--zsj
					var startStadAmt = $('#startStadAmt').val().replace(/,/g, "");
					sendObj.startStadAmt = startStadAmt;
					var endStadAmt = $('#endStadAmt').val().replace(/,/g, "");
					sendObj.endStadAmt = endStadAmt;
					if (sendObj.agencyCode) {
						if (sendObj.acctCode) {
							//bug80009--zsj
							if (parseFloat(sendObj.startStadAmt) > parseFloat(sendObj.endStadAmt)) {
								ufma.showTip('开始金额不能大于结束金额！', function () { }, 'error');
								return false;
							}
							ufma.showloading()
							page.initStyle(); //修改bug75491--zsj--往来类型和会计科目不是必选查询条件
						} else {
							ufma.showTip('请选择账套！', function () { }, 'warning');
						}
					} else {
						ufma.showTip('请选择单位！', function () { }, 'warning');
					}

				});

				//未核销
				$('.noComp').on('click', function() {
					sendObj.typeSign = 0;
					console.log(sendObj.typeSign)
				})
				//已核销
				$('.comp').on('click', function() {
					sendObj.typeSign = 1;
					console.log(sendObj.typeSign)
				})
				//bug74558--zsj--修改方案已经过侯总确认
				//此处将“自动核销”按钮与“设置”图标功能分开，点击弹窗的保存时只传输comMode，不选择核销方式时自动核销默认选中第一个核销方式，且表格数据为空时“核销方式”弹窗仍可以弹出
				//核销方式弹窗
				$('.icon-setting').on('click', function () {
					var isass = ''
					if(page.isAss){
						isass = ' + 辅助核算'
					}
					//此处给没一个input添加了一个id为实现：选择核销方式后点击保存再次打开弹窗时仍为刚才选中的核销方式--zsj-bug74558
					var dlog = "<div class='mask'></div>" +
						"<div class='dlog'>" +
						"<div class='dlog_top'>" +
						"<span>核销方式设置</span>" +
						"<span id='nnSave'>x</span>" +
						"</div>" +
						"<div class='dlog_middle'>" +
						"<div>" +
						"<label class='mt-radio mt-radio-outline'><input type='radio' name='aa' id='checkedone' data-item='1'/><span></span></label>" +
						"<span>" + page.typeStr + " + 会计科目"+isass+"</span>" +
						"</div>" +
						"<div>" +
						"<label class='mt-radio mt-radio-outline'><input type='radio' name='aa' id='checkedtwo' data-item='2' /><span></span></label>" +
						"<span>" + page.typeStr + " + 会计科目"+isass+" + 金额</span>" +
						"</div>" +
						"<div>" +
						"<label class='mt-radio mt-radio-outline'><input type='radio' name='aa' id='checkedThree' data-item='3'/><span></span></label>" +
						"<span>" + page.typeStr + " + 会计科目"+isass+" + 票据号</span>" +
						"</div>" +
						"<div>" +
						"<label class='mt-radio mt-radio-outline'><input type='radio' name='aa' id='checkedfour' data-item='4'/><span></span></label>" +
						"<span>" + page.typeStr + " + 会计科目"+isass+" + 票据号 + 金额</span>" +
						"</div>" +
						"</div>" +
						"<div class='dlog_bottom'>" +
						"<button class='btn btn-default' id='noSave'>取消</button>" +
						"<button class='btn btn-primary' id='saveA'> 保存</button>" +
						"</div>" +
						"</div>";
					$('body').append(dlog);
					//此处根据前面新加的id，在每次打开页面时会判断comMode.cancelMode值，然后选中相应的核销方式，为实现：选择核销方式后点击保存再次打开弹窗时仍为刚才选中的核销方式--zsj-bug74558
					if (comMode.cancelMode == 0 || comMode.cancelMode == 1) {
						$('#checkedone').attr('checked', 'checked');
					} else if (comMode.cancelMode == 2) {
						$('#checkedtwo').attr('checked', 'checked');
					} else if (comMode.cancelMode == 3) {
						$('#checkedThree').attr('checked', 'checked');
					} else if (comMode.cancelMode == 4) {
						$('#checkedfour').attr('checked', 'checked');
					}
					//bug79562--zsj--点击取消和“×”时修改核销方式
					var cancelModeType = '';
					$('body').on('click', 'input', function () {
						if ($(this).attr('data-item')) {
							cancelModeType = $(this).attr('data-item')
						}
					});
					$('#saveA').on('click', function () { //点击保存和取消时都返回主界面
						comMode.cancelMode = cancelModeType;
						$('.mask').eq(0).remove();
						$('.dlog').eq(0).remove();
					});
					$('#noSave,#nnSave').on('click', function () {
						$('.mask').eq(0).remove();
						$('.dlog').eq(0).remove();
					});

				});
				//自动核销
				$('#allCom').on('click', function () {
					if (sendObj.typeSign == 1) {
						ufma.showTip("已核销状态不能核销", function () {

						}, "warning");
						return false;
					}
					if (argu == undefined || argu.length == 0) {
						ufma.showTip('表格数据为空，无法自动核销！', function () { }, 'warning');
					} else {
						comMode.cancelType = 1
						if (comMode.cancelMode == 0) {
							comMode.cancelMode = 1
						}
						var argus = {
							"agencyCode": sendObj.agencyCode,
							"acctCode": sendObj.acctCode,
							"accoCode": sendObj.accoCode,
							"currentCode": sendObj.currentCode,
							"typeSign": "0",
							"cancelType": comMode.cancelType,
							"cancelMode": comMode.cancelMode,
							"accbal": page.accBal,
							"field1": page.field1
						};
						if ($("#colAction").attr("data-type") == "02") {
							argus.employeeCode = argus.currentCode;
							argus.currentCode = "";
						}
						ufma.post(
							"/gl/AssCancel/executeCancelData/" + comMode.cancelType + "/" + comMode.cancelMode, argus,
							function (result) {
								ufma.showTip(result.msg, function () { }, result.flag);
								sendObj.typeSign = 0
								page.initStyle();
							});
						$('.mask').eq(0).remove();
						$('.dlog').eq(0).remove();
					}
				});
				//取消核销
				$('#noCom').on('click', function () {
					if (sendObj.typeSign == 0) {
						ufma.showTip("未核销状态不能取消核销", function () {

						}, "warning");
						return false;
					}
					if (sendObj.typeSign == 1) {
						comMode = {
							cancelType: 3,
							cancelMode: 0
						}
						if (sendObj.typeSign == 1) {
							page.computerd("3")
						}
					}
				});
				//手动核销
				$('#someCom').on('click', function () {
					if (sendObj.typeSign == 1) {
						ufma.showTip("已核销状态不能核销", function () { }, "warning");
						return false;
					}
					if (sendObj.typeSign == 0) {
						comMode = {
							cancelType: 2,
							cancelMode: 0
						}
						if (sendObj.typeSign == 0) {
							page.computerd()
						}
					}
				});
				$("body").on("click", 'input#check_H', function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag)
				});
				$("#all").on("click", function () {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check_H").prop('checked', flag)
				});

				$("body").on("click", 'input.check-all', function () {
					var num = 0;
					var arr = document.querySelectorAll('.check-all')
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].checked) {
							num++
						}
					}
					if (num == arr.length) {
						$("#all").prop('checked', true)
						$("#check_H").prop('checked', true)
					} else {
						$("#all").prop('checked', false)
						$("#check_H").prop('checked', false)
					}
				});
				//显示/隐藏列隐藏框
				$(document).on("click", "#colAction", function (evt) {
					evt.stopPropagation();
					// $("#colList input").each(function(i) {
					//     $(this).prop("checked", page.changeCol[i].visible);
					// });

					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})
				$(document).on('click',function(e){
					if (!$('#colAction')[0].contains(e.target)) {
						$("div.rpt-funnelBox").hide();
					}
				})
				//选择往来类型
				$("#colList").on("click", "span", function () {
					if ($("#colAction .text").text() != $(this).text()) {
						$("#colAction .text").text($(this).text());
						$("#colAction").attr("data-type", $(this).attr("data-type"));
						if ($(this).text() == "往来单位") {
							page.typeStr = '往来单位'
							page.payerAgency();
						} else if ($(this).text() == "个人") {
							page.typeStr = '往来个人'
							page.payerEmployee();
						}
					}

					$(this).closest(".rpt-funnelBox").hide();
				});
				$(".label-more").on("click", function () {
					var timeId = setTimeout(function () {
						ufma.setBarPos($(window));
						clearTimeout(timeId);
					}, 100);
				});	
			},
			//请求往来单位
			payerAgency: function () {
				var reqData = {
					agencyCode: $("#cbAgency").getObj().getValue(),
					acctCode: sendObj.acctCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};

				ufma.get("/gl/elecommon/getEleCommonTree", reqData, function (result) {
					$('#cbCurrent').getObj().load(result.data);
				});
			},
			//请求个人往来（人员列表）
			payerEmployee: function () {
				var reqData = {
					agencyCode: $("#cbAgency").getObj().getValue(),
					acctCode: sendObj.acctCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "EMPLOYEE"
				};

				ufma.get('/gl/elecommon/getEleCommonTree', reqData, function (result) {
					page.payerAgencyData = result.data;
					$('#cbCurrent').getObj().load(result.data);
					// $('#btnQuery').trigger('click');
				});
			},
			//核算
			computerd: function (type) {
				var comArr = [];
				var arr = document.querySelectorAll('.check-all')
				for (var i = 0; i < arr.length; i++) {
					if (arr[i].checked) {
						comArr.push(argu[i])
					}
				}
				if (comArr.length == 0) {
					ufma.showTip('请选择数据！', function () { }, 'warning')
				} else {
					var argus = {
						"agencyCode": sendObj.agencyCode,
						"acctCode": sendObj.acctCode,
						"accoCode": sendObj.accoCode,
						"currentCode": sendObj.currentCode,
						"typeSign": sendObj.typeSign,
						"cancelType": comMode.cancelType,
						"cancelMode": comMode.cancelMode,
						"rowBeanList": comArr,
						"accbal": page.accBal,
						"field1": page.field1
					}
					if ($("#colAction").attr("data-type") == "02") {
						argus.employeeCode = argus.currentCode;
						argus.currentCode = "";
					}
					ufma.post(
						"/gl/AssCancel/executeCancelData/" + comMode.cancelType + "/" + comMode.cancelMode, argus,
						function (result) {
							var msg = result.msg;
							if (type == "3") {
								msg = "取消" + result.msg;
							}
							ufma.showTip(msg, function () {
							}, result.flag);
							page.initStyle()
						});
				}

			},
			//核算完成后初始化样式
			initStyle: function () {
				if($("#tool-bar").find(".slider").length != 0){
					$('#gridGOV_wrapper').ufScrollBar('destroy'); //动态销毁表格前要先销毁滚动条,否则滚动条无效
				}
				oTable.fnClearTable();
				oTable.fnDestroy();
				$('#gridGOV').empty();
				page.initGrid();
				$("#all").prop('checked', false)
				$("#check_H").prop('checked', false)
				var argus = {
					agencyCode: sendObj.agencyCode,
					acctCode: sendObj.acctCode,
					accoCode: sendObj.accoCode,
					currentCode: sendObj.currentCode,
					typeSign: sendObj.typeSign,
					//新增需求80009--zsj
					startStadAmt: sendObj.startStadAmt,
					endStadAmt: sendObj.endStadAmt,
					remark: $('#remark').val()
				};
				if ($("#colAction").attr("data-type") == "02") {
					argus.employeeCode = argus.currentCode;
					argus.currentCode = "";
				}
				var url = '/gl/AssCancel/getCancelData';
				page.loadGrid(url, argus)

			},
			//此方法必须保留
			init: function () {
				ptData = ufma.getCommonData();
				page.accoData = {}
				page.unCurrentAss = []
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				sendObj = {
					agencyCode: '', //单位
					acctCode: '', //账套
					accoCode: '', //会计科目
					currentCode: '', //往来单位
					typeSign: 0, //未核销
					accoType: 4 //应付
				}
				page.select();
				page.initGrid();
				page.onEventListener();
				//初始化账套
				$("#cbAcct").ufCombox({
					/*idField: 'CHR_CODE',
					textField: 'CODE_NAME',*/
					idField: 'code', //多区划
					textField: 'codeName', //多区划
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label'
				});
				//初始化往来单位
				// page.initSelect('#cbCurrent', "往来单位", true)
				// $('#cbCurrent').ufTreecombox({
				// 	idField: 'code',
				// 	textField: 'codeName',
				// 	pIdField: 'pCode', //可选
				// 	readonly: false,
				// 	placeholder: '请选择往来方',
				// 	leafRequire: true,
				// 	onChange: function(sender, data) {
				// 		sendObj.currentCode = data.code;
				// 	}
				// });
				$("#cbCurrent").ufTextboxlist({
					idField: 'code',
					textField: 'codeName',
					pIdField: 'pCode',
					placeholder: '请选择往来方',
					leafRequire: true,
					onChange: function (sender, treeNode) {
						sendObj.currentCode = $("#cbCurrent").getObj().getValue()
					}
				})
				// //初始化会计科目
				page.initSelect('#cbAcco', "会计科目", true);
				$('#startStadAmt,#endStadAmt').amtInputNull();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	/////////////////////
	page.init();
});