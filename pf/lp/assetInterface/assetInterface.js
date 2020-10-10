$(function() {
	var page = function() {
		var ptData = ufma.getCommonData();
		var agencyCode = '';
		var acctCode = '';
		var oTable, tableCol, tableData, status, vouData;
		var vouid = [];
		var vouname = [];
		var fieldAll = [];
		var listData = {};
		var list, listgl;
		var columns;
		var vouDate, vouUser, vouGuid, vouNO;
		var bennian = ptData.svSetYear; //本年 年度
		var benqi = ptData.svFiscalPeriod; //本期  月份
		var today = ptData.svTransDate; //今日 年月日
		var listID, listValue, rowdataId, intdata, listType;
		var pageLength = ufma.dtPageLength('#balanceTab'); //分页

		return {
			vouTree: function() {
				var argu = {
					agencyCode: $('#cbAgency').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					acctCode: $('#cbAcct').getObj().getValue()
				};
				dm.vouTree(argu, function(result) {
					vouData = result.data;
					page.loadGrid();
				});
			},
			//获取数据
			loadGrid: function() {
				var fieldAll = [];
				$("#queryMore").find('.listShow').each(function(i) {
					if(i != 0) {
						var fieldOne = {};
						if($(this).find('input').get(0)) {
							if($(this).find('input').length > 1) {
								fieldOne.key = $(this).find('input[data-direction="from"]').attr('name');
								if($(this).find('input[data-direction="from"]').val()) {}
								fieldOne.value = $(this).find('input[data-direction="from"]').val().replace(",", "") + "," + $(this).find('input[data-direction="to"]').val().replace(",", "");
								fieldOne.type = $(this).find('input[data-direction="from"]').attr('data-itype');
							} else {
								fieldOne.key = $(this).find('input').attr('name');
								fieldOne.value = $(this).find('input').val();
								fieldOne.type = $(this).find('input').attr('data-itype');
							}
						}
						fieldAll.push(fieldOne);
					}
				});
				var argu = {
					agencyCode: $('#cbAgency').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					checkOver: status,
					field: fieldAll,
					"dateFrom": $('#dateFrom').getObj().getValue(),
					"dateTo": $('#dateTo').getObj().getValue(),
					schemeGuid: $('#docunmentPlan').getObj().getValue()
				};
				dm.loadGridData(argu, function(result) {
					tableCol = result.data.cols;
					intdata = tableCol.length;
					tableData = result.data.data;
					page.setTable();
					page.moreQuerySet(tableCol);
				});
			},
			//更多条件设置弹框
			moreQuerySet: function() {
				if(tableCol != undefined) {
					$('.lp-setting-box-body').html('');
					for(var i = 0; i < tableCol.length; i++) {
						//如果不是单据编号就创建节点
						if(!$.isNull(tableCol[i].type) && tableCol[i].mapping != 'BILL_DATE') {
							var $label = $('<label class="mt-checkbox mt-checkbox-outline">' +
								'<input type="checkbox" class = "listCheck" name="' + tableCol[i].name + '" data-itype="' + tableCol[i].type + '"  eleCode="' + tableCol[i].mapping + '">&nbsp;<i>' + tableCol[i].name + '</i>' +
								'<span></span></label>');
							$('.lp-setting-box-body').append($label);
						}
					}
				}
			},
			//获取单据方案
			djfa: function() {
				//单据方案
				dm.djfa({
					agencyCode: $('#cbAgency').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}, function(result) {
					$('#docunmentPlan').ufTreecombox({
						idField: "schemeGuid",
						textField: "schemeName",
						placeholder: '请选择单据方案',
						leafRequire: true,
						data: result.data,
						onComplete: function(sender) {},
						onChange: function(sender, treeNode) {
							status = '';
							status = 'N';
							page.loadGrid();
							page.vouTree();
							$('#planItemMore').html('');
						}
					});
					$('#docunmentPlan').getObj().val('001');
				});
			},
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				dm.doGet("agency", arguAge, function(result) {
					$('#cbAgency').ufTreecombox({
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						placeholder: '请选择单位',
						readonly: false,
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, treeNode) {
							//缓存单位账套
							var params = {
								selAgecncyCode: treeNode.id,
								selAgecncyName: treeNode.name
							}
							ufma.setSelectedVar(params);
							agencyCode = $('#cbAgency').getObj().getValue();
							page.djfa();
							dm.acct({
								agencyCode: agencyCode,
								setYear: ptData.svSetYear,
								rgCode : ptData.svRgCode
							}, function(result) {
								$("#cbAcct").ufCombox({
									idField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									theme: 'label',
									leafRequire: true,
									data: result.data, //用来页面显示树的数据
									onChange: function(sender, data) {
										//缓存单位账套
										var params = {
											selAgecncyCode: $('#cbAgency').getObj().getValue(),
											selAgecncyName: $('#cbAgency').getObj().getText(),
											selAcctCode: data.code,
											selAcctName: data.name
										}
										ufma.setSelectedVar(params);
										page.vouTree();

										$('#planItemMore').html('');
									},
									onComplete: function(sender, treeNode) {
										if(ptData.svAcctCode) { //如果有缓存的账套，就赋值
											$("#cbAcct").getObj().val(ptData.svAcctCode);
										} else {
											$('#cbAcct').getObj().val('1');
										}
									}
								});
							});
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
				});
			},
			//初始化table
			initGrid: function(id, data, colArr) {
				columns = [{
					//checkBox的选框
					type: 'checkbox',
					field: 'GL_VOUGUID',
					name: 'aa',
					width: 50,
					headalign: 'center',
					className: 'no-print', // check-item
					align: 'center'
				}];
				if(!$.isNull(tableCol)) {
					for(var i = 0; i < tableCol.length; i++) {
						intdata = tableCol.length;
						var itemName = tableCol[i].name;
						var eleCode = tableCol[i].mapping;
						if(eleCode == "AMT01") {
							columns.push({
								name: itemName,
								field: eleCode,
								width: 200,
								headalign: 'center',
								align: 'right',
								className: 'isprint tdNum',
								render: function(rowid, rowdata, data) {
									var val = $.formatMoney(rowdata.AMT01);
									val == '0.00' ? '' : val;
									return '<span title="' + val + '">' + val + '</span>';
								}
							})
						} else if(eleCode == 'GL_VOUNO') {
							if(status == 'N') {
								columns.push({
									type: 'treecombox',
									field: eleCode,
									name: itemName,
									width: 200,
									headalign: 'center',
									idField: "GL_VOUGUID_USER_DATE",
									textField: "GL_VOUNO",
									pIdField: 'PARENT',
									data: vouData,
									theme: 'label',
									leafRequire: true,
									className: 'vouList isprint',
									onChange: function(e) {},
									beforeExpand: function(e) {},
									render: function(rowid, rowdata, data) {
										if(!$.isNull(data)) {
											return '<span title="' + data + '">' + data + '</span>';
										} else {
											return '';
										}
									}
								});
							} else if(status == 'Y') {
								columns.push({
									field: 'GL_VOUNO',
									name: itemName,
									width: 200,
									headalign: 'center',
									className: 'isprint',
									render: function(rowid, rowdata, data) {
										if(!$.isNull(data)) {
											return '<span title="' + data + '">' + data + '</span>';
										} else {
											return '';
										}
									}
								});
							}
						} else if(eleCode == 'OPT') {
							columns.push({
								type: 'toolbar',
								name: itemName,
								field: eleCode,
								className: 'no-print',
								width: 46,
								headalign: 'center',
								align: 'center',
								render: function(rowid, rowdata, data) {
									if(rowdata.OPT == '' || rowdata.OPT == null) {
										return '';
									} else if(rowdata.OPT == 'N') { //对账
										return '<a class="btn btn-saveAcc icon icon-account btn-permission" rowid="' + rowid + '" conid="' + rowdata + '"></a>';
									} else {
										return '<a class="btn btn-deleteAcc btn-permission icon icon-cancel-audit" rowid="' + rowid + '" conid="' + rowdata + '"</a>';
									}
								}
							});
						} else if(eleCode == 'BILL_NO' || eleCode == 'FIELD10' || eleCode == 'FIELD05') {
							columns.push({
								name: itemName,
								headalign: 'center',
								className: 'isprint',
								field: eleCode,
								width: 200,
								render: function(rowid, rowdata, data) {
									if(!$.isNull(data)) {
										return '<span title="' + data + '">' + data + '</span>';
									} else {
										return '';
									}
								}
							});
						} else {
							columns.push({
								name: itemName,
								headalign: 'center',
								className: 'isprint',
								field: eleCode,
								width: 120,
								render: function(rowid, rowdata, data) {
									if(!$.isNull(data)) {
										return '<span title="' + data + '">' + data + '</span>';
									} else {
										return '';
									}
								}
							});
						}
					}
				}
				var tableId = 'balanceTab';
				oTable = $("#" + tableId).ufDatagrid({
					data: data,
					disabled: false, //可选择
					frozenStartColumn: 1, //冻结开始列,从1开始
					frozenEndColumn: 1, //冻结结束列	
					columns: [columns],
					initComplete: function(settings, json) {
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
						$('#glRptLedgerTable').tblcolResizable();
					},
					drawCallback: function(settings) {

						ufma.isShow(page.reslist);
					}

				});
				page.adjGridTop();
			},
			setTable: function() {
				page.initGrid('balanceTab', tableData, columns);
			},
			//返回本期时间
			dateBenQi: function(startId, endId) {
				var ddYear = bennian;
				var ddMonth = benqi - 1;
				var tdd = new Date(ddYear, ddMonth + 1, 0);
				var ddDay = tdd.getDate();
				$("#" + startId).getObj().setValue(new Date(ddYear, ddMonth, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, ddMonth, ddDay));
			},
			//返回本年时间
			dateBenNian: function(startId, endId) {
				var ddYear = bennian;
				$("#" + startId).getObj().setValue(new Date(ddYear, 0, 1));
				$("#" + endId).getObj().setValue(new Date(ddYear, 11, 31));
			},
			//返回今日时间
			dateToday: function(startId, endId) {
				$("#" + startId + ",#" + endId).getObj().setValue(new Date(today));
			},
			adjGridTop: function() { //设置高度
				var gridTop = $('#balanceTab').offset().top;
				var gridHeight = $(window).height() - gridTop - 75;
				$('#balanceTab').getObj().setBodyHeight(gridHeight);
			},
			//监听
			onEventListener: function() {
				//点击更多条件设置弹框的确定按钮，勾选的条件加载
				$(".lp-setting-box-footer .btn-primary").on("click", function() {
					var $curRow = $('#planItemMore');
					$curRow.html('');
					page.queryIdx = []; //用于存储更多条件的勾选项，防止勾选后点取消造成的页面问题
					var eleListArr = [];
					var fieldOne = {};
					//循环遍历勾选的
					$(".lp-setting-box-body label input:checked").each(function(i) {
						var listCheck = $('.lp-setting-box-body input:checked');
						var $curgroup = $('<div class="form-group listShow"style="margin-top:8px;width:38em;margin-left:-5em;"></div>').prependTo($curRow);
						$('<lable class="control-label auto" style="display:inline-block;width:10em;text-align: right; ">' + $(this).attr('name') + '：</lable>').appendTo($curgroup);
						var $cont;
						switch($(this).attr("data-itype")) {
							case "03":
								$cont = $('<div class="control-element listShow" style="width:200px;margin-left:3px;"><input id="' + $(this).attr('eleCode') + '" type="text" name="' + $(this).attr('eleCode') + '" class="form-control" data-itype="' + $(this).attr('data-itype') + '"/></div>').appendTo($curgroup);
								break;
							case "08":
								$cont = $('<div class="control-element listShow" style="width:200px;margin-left:3px;"><input id="' + $(this).attr('eleCode') + '" type="text" name="' + $(this).attr('eleCode') + '" class="form-control" data-itype="' + $(this).attr('data-itype') + '"/></div>').appendTo($curgroup);
								break;
							case "05":
								$cont = $('<div class="control-element listShow" style="margin-left:3px;margin-bottom:5px;"><input id="' + $(this).attr('eleCode') + '" type="text" name="' + $(this).attr('eleCode') + '" class="form-control moneyConmin" data-direction="from" minlength="0" style="width:125px;" data-itype="' + $(this).attr('data-itype') + '">' +
									'<input id="' + $(this).attr('eleCode') + '" type="text" name="' + $(this).attr('eleCode') + '" class="form-control moneyConmax" data-direction="to" maxlength="18" style="width:125px;margin-left:20px;"></div><div style="margin-left:275px;margin-top:-30px;">-</div>').appendTo($curgroup);
								break;
							case "04":
								$cont = $('<div class="control-element listShow" style="margin-left:3px;"><input id="' + $(this).attr('eleCode') + '" type="text" name="' + $(this).attr('eleCode') + '" class="form-control uf-datepicker" data-direction="from" minlength="0" style="width:125px;" data-itype="' + $(this).attr('data-itype') + '">' +
									'<input id="' + $(this).attr('eleCode') + '" type="text" name="' + $(this).attr('eleCode') + '" class="form-control uf-datepicker" data-direction="to" maxlength="18" style="width:125px;margin-left:20px;margin-top:-30px;"></div><div style="margin-left:275px;margin-top:-30px;">-</div>').appendTo($curgroup);
								break;
							case "07":
								var id = "eleList" + i.toString();
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '"><div id="' + id + '" class="uf-treecombox" name="' + $(this).attr('eleCode') + '" data-itype="' + $(this).attr("data-itype") + '" style="width: 180px"></div></div>');
								var obj = {
									no: i,
									eleCode: $(this).attr("eleCode")
								};
								eleListArr.push(obj);
								break;
							case "02":
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '">' +
									'<input type="text" name="' + $(this).attr('name') + '" class="more-input bordered-input padding-3" data-itype="' + $(this).attr("data-itype") + '" /></div>');
								break;
							default:
								$cont = $('<div class="lp-query-li-cont" eleCode="' + $(this).attr("eleCode") + '">' +
									'<input type="text" name="' + $(this).attr('name') + '" class="more-input bordered-input padding-3" data-itype="' + $(this).attr("data-itype") + '" /></div>');
								break;
						}
						$curgroup.append($cont);
						page.queryIdx.push($(this).parents('label').index());
					});
					//渲染更多条件要素列表
					for(var i = 0; i < eleListArr.length; i++) {
						var id = "#eleList" + eleListArr[i]["no"].toString();
						var eleCode = eleListArr[i]["eleCode"];
						page.getItemDatas(id, eleCode);
					}
					if($("#queryMore").find(".moneyConmin,.moneyConmax").length > 0) {
						$(".moneyCon,.moneyConmax").amtInput();
					}
					//绑定时间控件
					$("#queryMore").find("[data-itype='04']").datetimepicker({
						format: 'yyyy-mm-dd',
						autoclose: true,
						todayBtn: true,
						startView: 'month',
						minView: 'month',
						maxView: 'decade',
						language: 'zh-CN'
					});
					$("#queryMore").find("[data-itype='04'][data-direction='from']").val(new Date().getFullYear() + '-01-01');
					$("#queryMore").find("[data-itype='04'][data-direction='to']").val(new Date().getFullYear() + '-12-31');
					$('.lp-query-box-right .lp-setting-box').slideUp();
				});

				//点击更多条件设置弹框的取消和X按钮
				$(".lp-setting-box-footer .btn-default,.lp-setting-box-header .icon-close").on('click', function() {
					$('.lp-query-box-right .lp-setting-box').slideUp('normal', function() {
						$('.lp-setting-box-body label input:checked').prop('checked', false);
						for(var i = 0; i < page.queryIdx.length; i++) {
							$('.lp-setting-box-body label input').eq(page.queryIdx[i]).prop('checked', true);
						}
					});
				});
				// 点击设置icon弹出条件选择
				$('#btn-setting').on('click', function() {
					var data = {
						rgCode: ptData.svRgCode,
						agencyCode: $("#cbAgency").getObj().getValue(),
						acctCode: $("#cbAcct").getObj().getValue(),
						setYear: ptData.svSetYear,
						schemeGuid: $('#docunmentPlan').getObj().getValue()
					}
					ufma.open({
						url: 'getAccoAndAccItemFrame.html',
						title: '条件选择',
						width: 700,
						height: 500,
						data: data,
						ondestory: function(res) {
							//窗口关闭时回传的值
							if(res.action && res.action.action == "save") {
								ufma.showTip(res.action.msg, function() {

								}, res.action.flag)
								$("#btnQuery").click();
							}
						}
					});
				})

				//点击条件设置
				$('.lp-query-box-right #conditionSet').on('click', function() {
					$('.lp-query-box-right .lp-setting-box').slideDown();
				});
				//导出begin
				$(".btn-export").on('click', function(evt) {
					var expCols = columns.select(function(el, i, res, param) {
						return $.isNull(el.className) || el.className.indexOf('no-print') == -1;
					});
					uf.expTable({
						title: '资产对账',
						data: $('#balanceTab').getObj().getData(),
						columns: [expCols]
					});
				});
				//导出end
				//打印
				$('.btn-print').click(function() {
					var printData = $("#balanceTab").getObj().getData();
					var colArr = [];
					for(var i = 1; i < columns.length - 1; i++) {
						colArr.push(columns[i]);
					}
					if(printData.length > 0) {
						uf.tablePrint({
							mode: "rowHeight",
							pageHeight: 924,
							title: '资产对账',
							topLeft: $('#cbAgency').getObj().getValue(),
							topCenter: '',
							topRight: '记录总数：' + printData.length,
							bottomLeft: '',
							bottomCenter: '',
							bottomRight: '<span class="page-num"></span>',
							data: printData,
							columns: [colArr]
						});
					} else {
						ufma.showTip("表格数据为空！", function() {}, "warning");
						return false;
					}
				});
				//切换页签时默认选择未生成，然后刷新界面
				$('#tabAcce li a').click(function(e) {
					e.preventDefault();
					schId = $('#tabParent .active a').attr('id');
					if($(this).attr('id') == 'wscBtn') {
						status = '';
						status = 'N';
						page.loadGrid();
						$('#calBalance').addClass('hide');
						$('#balanceAcc').removeClass('hide');
					} else if($(this).attr('id') == 'yscBtn') {
						status = '';
						status = 'Y';
						page.loadGrid();
						$('#balanceAcc').addClass('hide');
						$('#calBalance').removeClass('hide');
					}

				});

				//搜索框
				ufma.searchHideShow($('#balanceTab'));
				//对账-begin
				$('#balanceAcc').on('click', function() {
					var obj = $('#balanceTab').getObj(); //取对象
					var balanceData = obj.getCheckData();
					var resultObj = {};
					var $check = $('#balanceTab').find(".check-item:checked");
					var checkData = $('#balanceTab').getObj().getCheckData();
					var argu = {
						schemeGuid: $('#docunmentPlan').getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						acctCode: $("#cbAcct").getObj().getValue(),
						bills: checkData
					}
					if($check.length > 0) {
						dm.balanceAcc(argu, function(result) {
							ufma.showTip(result.msg, function() {}, 'success');
							$('#btnQuery').trigger('click');

						});
					} else {
						ufma.showTip('请至少选择一条数据', function() {}, 'warnning');
					}
				});
				$('#calBalance').on('click', function() {
					var obj = $('#balanceTab').getObj(); //取对象
					var calData = obj.getCheckData();
					var $check = $('#balanceTab').find(".check-item:checked");
					var checkData = $('#balanceTab').getObj().getCheckData();
					var argu = {
						schemeGuid: $('#docunmentPlan').getObj().getValue(),
						agencyCode: $("#cbAgency").getObj().getValue(),
						setYear: ptData.svSetYear,
						rgCode: ptData.svRgCode,
						acctCode: $("#cbAcct").getObj().getValue(),
						bills: checkData
					}
					if($check.length > 0) {
						dm.canBalance(argu, function(result) {
							ufma.showTip(result.msg, function() {}, 'success');
							$('#btnQuery').trigger('click');
						});
					} else {
						ufma.showTip('请至少选择一条数据', function() {}, 'warnning');
					}
				});
				//行操作--对账、取消对账
				$(document).on("click", function(e) {
					e.stopPropagation();
					var obj = $('#balanceTab').getObj(); //取对象
					var rowid = $(e.target).attr("rowid");
					var rowData = obj.getRowByTId(rowid);
					if($(e.target).is('.btn-saveAcc')) {
						var argu = {
							schemeGuid: $('#docunmentPlan').getObj().getValue(),
							agencyCode: $("#cbAgency").getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							acctCode: $("#cbAcct").getObj().getValue(),
							bills: [rowData]
						}
						ufma.confirm("您确认要对账吗？", function(action) {
							if(action) {
								dm.balanceAcc(argu, function(result) {
									ufma.showTip(result.msg, function() {}, 'success');
									$('#btnQuery').trigger('click');
								});
							}
						}, {
							type: 'warning'
						});
					} else if($(e.target).is('.btn-deleteAcc')) {
						var argu = {
							schemeGuid: $('#docunmentPlan').getObj().getValue(),
							agencyCode: $("#cbAgency").getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							acctCode: $("#cbAcct").getObj().getValue(),
							bills: [rowData]
						}
						ufma.confirm("您确定要取消对账吗？？", function(action) {
							if(action) {
								dm.canBalance(argu, function(result) {
									ufma.showTip(result.msg, function() {}, 'success');
									$('#btnQuery').trigger('click');
								});
							}
						}, {
							type: 'warning'
						});
					}
				});
				//编辑弹出层、删除行数据-end
				//表格相关-begin
				//日历
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});
				//绑定日历控件
				var bankDate = {
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				};
				$("#dateFrom,#dateTo").ufDatepicker(bankDate);
				page.dateBenNian("dateFrom", "dateTo");
				//选择期间，改变日历控件的值
				$("#dateBq").on("click", function() {
					page.dateBenQi("dateFrom", "dateTo");
				});
				$("#dateBn").on("click", function() {
					page.dateBenNian("dateFrom", "dateTo");
				});
				$(" #dateJr").on("click", function() {
					page.dateToday("dateFrom", "dateTo");
				});
				//全选			
				$("#btnAll").on("click", function() {
					var flag = $(this).prop("checked");
					$("#balanceTab").find('input.check-item').prop('checked', flag);
					$(".check-all").prop('checked', flag);
				});
				//绑定loadGrid
				$('#btnQuery').on('click', function() {
					var minm = $('#dateFrom').getObj().getValue();
					var maxm = $('#dateTo').getObj().getValue();
					var minmon = $('input[data-direction="from"]').val();
					var maxmon = $('input[data-direction="to"]').val();
					//判断起始金额是否大于结束金额
					if((minm !== '' || minm !== null) && (maxm !== '' || maxm !== null)) {
						if(minm > maxm) {
							ufma.showTip('起始时间大于结束时间！', function(action) {}, 'warning');
						} else if(minmon !== '' || minmon !== null) {
							if(maxmon !== '' || maxmon !== null) {
								if(minmon > maxmon) {
									ufma.showTip('起始金额大于结束金额！', function(action) {}, 'warning');
									$('input[data-direction="from"]').val("");
									$('input[data-direction="to"]').val("");
								} else {
									page.loadGrid();
								}
							}
						}
					}
				});
				//表格相关-end
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				this.initAgencyScc();
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});
			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData(); //平台的缓存数据
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	page.init();
});