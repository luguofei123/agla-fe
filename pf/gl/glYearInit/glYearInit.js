$(function() {
	var page = function() {
		var pageData = {
			agencyCode: '',
			bgplanData: '',
			tblDt: '',
			tabData: [],
			bgPlanCode: ''
		}
		var oTableChack, oTableCarrry, oTableEnd, oTableTwo, oTableOutentry;
		return {
			//转换为驼峰
			shortLineToTF: function(str) {
				var arr = str.split("_");
				for(var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
				}
				for(var i = 1; i < arr.length; i++) {
					arr[i] = arr[i].toLowerCase()
					arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
				}
				return arr.join("");
			},
			//初始化单位
			initAgency: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				var arguAge = {
					setYear: page.setYear,
					rgCode: page.rgCode
				}
				var disableFlag = false;
				if(page.disableFlag == true) {
					disableFlag == true;
				} else if(page.disableFlag == false) {
					disableFlag = false;
				}
				dm.doGet("agency", arguAge, function(result) {
					ufma.hideloading();
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						valueField: 'id',
						textField: 'codeName',
						readOnly: false,
						placeholder: '请选择单位',
						icon: 'icon-unit',
						leafRequire: true,
						data: result.data, //json 数据
						onchange: function(data) {
							page.agencyCode = data.code;
							page.agencyName = data.name;
							var agencyText = data.codeName;
							$('#agencyText').html('');
							$('#agencyText').html('单位: ' + agencyText);
							var url = dm.getCtrl('acct');
							var arguAcct = {
								agencyCode: data.code,
								setYear: page.setYear,
								rgCode: page.rgCode
							}
							ufma.get(url, arguAcct, function(result) {
								var acctData = result.data;
								page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									valueField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									data: acctData,
									onchange: function(data) {
										page.acctCode = data.code;
										page.accsCode = data.accsCode;
										page.acctName = data.name;
										if(page.chooseAcctFlag == true) {
											ufma.showTip('请选择账套', function() {}, 'warning');
											return false;
										} else {
											page.initAgencyStatus();
											$('#onePage').removeClass('hide');
										}
										//缓存单位账套
										var params = {
											selAgecncyCode: page.agencyCode,
											selAgecncyName: page.agencyName,
											selAcctCode: page.acctCode,
											selAcctName: page.acctName
										}
										ufma.setSelectedVar(params);
									},
									initComplete: function(sender) {
										if(!$.isNull(page.pfData.acctCode) && page.pfData.acctCode != '*' && !$.isNull(page.pfData.acctName)) {
											page.cbAcct.val(page.pfData.acctCode, page.pfData.acctName);
										} else {
											if(page.chooseAcctFlag == true) {
												$('#onePage').addClass('hide');
												page.cbAcct.val('');
											} else {
												page.cbAcct.select(1);
											}
										}
									}
								});
							});
						},
						initComplete: function(sender) {
							if(page.pfData.svAgencyCode) {
								page.cbAgency.val(page.pfData.svAgencyCode);
							} else {
								page.cbAgency.select(1);
							}
							ufma.hideloading();
						}
					});
				})
			},
			//获取单位年结状态
			initAgencyStatus: function() {
				var arguAge = {
					"carryWhole": true,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"userId": page.pfData.svUserId,
					"userName": page.pfData.svUserName,
					"roleId": "",
					"roleName": ""
				}
				dm.doPost("agencyStatus", arguAge, function(result) {
					var status = result.data;
					if(status == false) {
						$('#arginText').removeClass('hide');
						$('#statusText').addClass('hide');
						$('#beginEnd').html('生成新年度账');
					} else {
						$('#statusText').removeClass('hide');
						$('#arginText').addClass('hide');
						$('#beginEnd').html('生成新年度账');
					}
				});
			},
			clearTimeLine: function() {
				$('#zdzzTimeline').html('');
				page.timeline = $('#zdzzTimeline').ufmaTimeline([{
					step: '数据检查',
					target: 'zdzj'
				}, {
					step: '结转处理',
					target: 'savemb'
				}, {
					step: '结转完成',
					target: 'setend'
				}]);
				$('#btnPrev').addClass('hide');
			},
			//初始化会计科目
			initAcco: function() {
				//CWYXM-12691 ---项目反馈 上下年度单位账套编码调整后，自定义年结，未带出下一年度科目数据--zsj
				var argu = {
					"acctCode": page.acctCode,
					"agencyCode": page.agencyCode,
					"setYear": page.setYear + 1,
					"rgCode": page.rgCode
				}
				dm.doPost('getAcco', argu, function(result) {
					page.accoDataAll = result.data;
					var keyAcco = [];
					for(var m = 0; m < result.data.length; m++) {
						keyAcco.push(result.data[m].code);
					}
					var keysArr = Object.keys(localStorage);
					for(var i = 0; i < keysArr.length; i++) {
						var deleKey = keysArr[i];
						if($.inArray(deleKey, keyAcco) > 0) {
							localStorage.removeItem(deleKey)
						}
					}
					page.cwAccoData = [];
					page.ysAccoData = [];
					for(var i = 0; i < result.data.length; i++) {
						if(result.data[i].accaCode == '1') {
							page.cwAccoData.push(result.data[i]);
						} else if(result.data[i].accaCode == '2') {
							page.ysAccoData.push(result.data[i]);
						}
					}
					$('#carryOverArea').removeClass('hide');
					page.initCarryTable();
					page.showAccoOne();
					$('.setAcco,.setRemark,.spanSquire,.btnGroupsOver').removeClass('hide');
				});
			},
			//初始化科目表格
			initCarryTable: function() {
				var scrollHeight = 0;
				if(oTableCarrry) {
					pageLengthCarrry = ufma.dtPageLength('#carryOver');
					oTableCarrry.fnDestroy();
				}
				if($(window).height() > 657) {
					if($('#assOverTable').hasClass('hide')) {
						scrollHeight = 400;
					} else {
						scrollHeight = 280;
					}
				} else {
					if($('#assOverTable').hasClass('hide')) {
						scrollHeight = 280;
					} else {
						scrollHeight = 120;
					}
				}
				var tblId = 'carryOver';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
						data: "nowAccoCode",
						title: page.setYear + "年度科目",
						className: "tc nowrap commonShow lastYearAcco",
						width: 150,
						"render": function(data, type, rowdata, meta) {
							if(!$.isNull(data)) {
								if(rowdata.existsItem == true) {
									var accoAccItemList = '';
									if(rowdata.accoAccItemList.length != 0 && !$.isNull(rowdata.accoAccItemList)) {
										var str = JSON.stringify(rowdata.accoAccItemList);
										accoAccItemList = str.replace(/\"/g, "'");
									}
									return '<div class="checkAccoY nowAcco" data-accaCode="' + rowdata.accaCode + '" index="' + meta.row + '" title="' + data + rowdata.nowCodeName + '" data-accoCodeName="' + rowdata.nowCodeName + '"  data-accoCode="' + data + '" data-assist="' + accoAccItemList + '"><div>' + data + '(' + rowdata.nowCodeName + ')' + '</div><span class="icon-text-fu fixed f24 ufma-yellow" style="float: right;margin-top: -24px; margin-right: -5px;"></span></div>';
								} else {
									return '<div class="checkAccoN nowAcco" data-accaCode="' + rowdata.accaCode + '" index="' + meta.row + '"  data-accoCode="' + data + '"  title="' + data + rowdata.nowCodeName + '">' + data + '(' + rowdata.nowCodeName + ')' + '</div>';
								}
							} else {
								return '';
							}

						}
					},
					{
						data: "nextAccoCode",
						title: (page.setYear + 1) + "年度科目",
						className: "tc nowrap commonShow",
						width: 150,
						"render": function(data, type, rowdata, meta) {
							return '<div class="uf-combox accoOne"  data-nexAcco="' + data + '" style="width:250px;"></div>';
						}
					},
					{
						data: "drCr",
						title: "借/贷",
						className: "tc nowrap",
						width: 50,
						"render": function(data, type, rowdata, meta) {
							if(data == '1') {
								return '<div>借</div>';
							} else if(data == '-1') {
								return '<div>贷</div>';
							}
						}
					}, {
						data: 'balAmt',
						title: '可结转余额',
						className: 'nowrap isprint tr canBalAmt',
						width: 100,
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					}
				];
				oTableCarrry = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false,
					"serverSide": false,
					"ordering": false,
					"scrollY": scrollHeight,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function(settings, json) {
						ufma.isShow(reslist);
					},
					drawCallback: function(settings) {
						$('#carryOver').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						ufma.setBarPos($(window));
						var wrapperWidth = $('#carryOver_wrapper').width();
						var tableWidth = $('#carryOver').width();
						if(tableWidth > wrapperWidth) {
							$('#carryOver').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							$('#carryOver').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						};
						page.firstChange = true;
						$("#" + tblId).find('.accoOne').each(function() {
							var treeUseData = [];
							var trAccaCode = $(this).closest('tr').find('.lastYearAcco .nowAcco').attr('data-accaCode');
							if(trAccaCode == "1") {
								treeUseData = [];
								treeUseData = page.cwAccoData; //财务 科目
							} else if(trAccaCode == "2") {
								treeUseData = [];
								treeUseData = page.ysAccoData; //预算科目
							}
							$this = $(this);
							page.chageCode = '';
							page.changeType = false;
							var tree = $(this).ufmaTreecombox2({
								valueField: 'id',
								textField: 'codeName',
								readonly: false,
								leafRequire: true,
								placeholder: '请选择科目',
								data: treeUseData, //json 数据
								onchange: function(sender, data) {
									page.nextAccoCode = sender.code;
									page.nextCodeName = sender.name;
									page.chageCode = sender.code;
									var id = sender.tId.split('_')[0];
									var treeData = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('data-assist');
									var comCode = $('#' + id).closest('tr').find('.lastYearAcco div').attr('data-accoCode');
									$('#' + id).closest('tr').find('.lastYearAcco div').attr('changeCode', sender.code);
									$('#' + id).closest('tr').find('.lastYearAcco div').attr('changeName', sender.name);
									$('#' + id).closest('tr').find('.lastYearAcco div').attr('changeDrcr', sender.accBal);

									//判断是初始化change还是手动change
									if(comCode != sender.code) {
										page.changeType = true;
										$('#' + id).closest('tr').find('.checkAccoY').attr('accItemList', '');
										$('#' + id).closest('tr').find('.checkAccoY').attr('assiList', '');
									}
									//判断已经点过“辅”
									if(!$('#assOverTable').hasClass("hide") && $('#' + id).closest('tr').find('.lastYearAcco div').hasClass('clickAssist')) {
										$('#nowTable').attr('nowTableList', '');
										$('#nowTable').attr('newAddList', '');
										$('#nextArea').attr('nextTableList', '');
										page.assisTreeData = [];
										if(treeData && !$.isNull(treeData)) {
											page.assisTreeData = eval("(" + treeData + ")");
										} else {
											page.assisTreeData = [];
										}
										$('.assistTab').removeClass('hide');
										$('.nextTableArea').addClass('hide');
										$('#nextArea').removeClass('active');
										$('#nowTable').addClass('active');

										page.initAssistTable("codeChange", []);
										page.showAccoTwo();
										page.notChange = true;
										var treeUseDataT = [];
										var trAccaCodeT = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('data-accaCode');
										if(trAccaCodeT == "1") {
											treeUseDataT = [];
											treeUseDataT = page.cwAccoData; //财务 科目
										} else if(trAccaCodeT == "2") {
											treeUseDataT = [];
											treeUseDataT = page.ysAccoData; //预算科目
										}
									}
								},
								initComplete: function(sender) {
									var treeData = $(sender).attr('data-nexAcco')
									tree.val(treeData);
									page.firstChange = false;
								}
							});
						});
					}
				});
			},
			//获取设置科目表格数据
			showAccoOne: function() {
				var arguAge = {
					"carryWhole": true,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"userId": page.pfData.svUserId,
					"userName": page.pfData.svUserName,
					"roleId": "",
					"roleName": ""
				}
				ufma.showloading('数据加载中，请耐心等待...');
				dm.doPost("getAccoRelation", arguAge, function(result) {
					ufma.hideloading();
					oTableCarrry.fnClearTable();
					if(result.data.length != 0) {
						oTableCarrry.fnAddData(result.data, true);
					}
				});
			},
			//初始化辅助项处理表格
			initAssistTable: function() {
				if(oTableTwo) {
					pageLengthTwo = ufma.dtPageLength('#assistTable');
					oTableTwo.fnDestroy();
				}
				var tblId = 'assistTable';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "accoCode",
					title: page.setYear + "年度科目",
					className: "tc nowrap commonShow lastYearAcco",
					width: 200,
					"render": function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span class="accoTwo" index="' + meta.row + '" data-accaCode="' + rowdata.accaCode + '" title="' + page.nowAccoCode + page.nowAccoCodeName + '">' + page.nowAccoCode + '(' + page.nowAccoCodeName + ')' + '</span>';
						} else {
							return '';
						}
					}
				}];

				for(var i = 0; i < page.assisTreeData.length; i++) {
					var k = 1;
					columns.push({
						data: page.shortLineToTF(page.assisTreeData[i].accitemCode) + 'CodeName',
						title: page.assisTreeData[i].eleName,
						"targets": [k],
						"serchable": false,
						"orderable": false,
						"className": "nowrap commonShow",
						"width": 200,
						"render": function(data, type, rowdata, meta) {
							var code = page.shortLineToTF(page.assisTreeData[meta.col - 1].accitemCode) + 'Code';
							var name = page.shortLineToTF(page.assisTreeData[meta.col - 1].accitemCode) + 'CodeName';
							if(!$.isNull(rowdata[code])) {
								return '<span title="' + rowdata[code] + ' ' + rowdata[name] + '">' + rowdata[code] + ' ' + rowdata[name] + '</span>';
							} else {
								return '';
							}

						}
					});
					k++;
				}

				columns.push({
					data: 'stadAmt',
					title: '可结转余额',
					className: 'nowrap isprint tr',
					width: 100,
					render: $.fn.dataTable.render.number(',', '.', 2, '')
				});

				oTableTwo = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false,
					"serverSide": false,
					"ordering": false,
					"scrollY": 110,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function(settings, json) {
						ufma.isShow(reslist);
					},
					drawCallback: function(settings) {
						$('#assistTable').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						if(page.clickFlag == true) {
							if($(window).height() > 657) {
								$('#carryOver_wrapper .dataTables_scrollBody').css('height', '280px')
							} else {
								$('#carryOver_wrapper .dataTables_scrollBody').css('height', '180px')
							}
						} else {
							if($(window).height() > 657) {
								$('#carryOver_wrapper .dataTables_scrollBody').css('height', '400px')
							} else {
								$('#carryOver_wrapper .dataTables_scrollBody').css('height', '260px')
							}
						}
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
						var wrapperWidth = $('#assistTable_wrapper').width();
						var tableWidth = $('#assistTable').width();
						if(tableWidth > wrapperWidth) {
							$('#assistTable').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							$('#assistTable').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
					}
				});
			},
			//辅助项处理表格加载数据
			showAccoTwo: function() {
				var arguAge = {
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"accoCode": page.selectAccoCode
				}
				ufma.showloading('数据加载中，请耐心等待...');
				dm.doPost("getItem", arguAge, function(result) {
					ufma.hideloading();
					oTableTwo.fnClearTable();
					if(result.data.length != 0) {
						oTableTwo.fnAddData(result.data, true);
						page.changeType = false;
					}
				});
			},
			//初始化下一年度表格
			initNextTable: function(nextTableData) {
				var treeUseData = [];
				var trAccaCode = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('data-accaCode');
				if(trAccaCode == "1") {
					treeUseData = [];
					treeUseData = page.cwAccoData; //财务 科目
				} else if(trAccaCode == "2") {
					treeUseData = [];
					treeUseData = page.ysAccoData; //预算科目
				}
				var column = [ // 支持多表头
					{
						type: 'checkbox',
						field: '',
						name: '',
						width: 40,
						headalign: 'center',
						align: 'center'
					},
					{
						field: "accoCode",
						name: (page.setYear + 1) + "年度科目",
						width: 200,
						headalign: 'center',
						className: 'tc',
						"render": function(rowid, rowdata, data, meta) {
							return '<span data-accaCode="' + rowdata.accaCode + '" title="' + page.accoCode + page.accoCodeName + '">' + page.accoCode + '(' + page.accoCodeName + ')' + '</span>';
						}
					}
				];
				if(!$.isNull(nextTableData) && nextTableData.length > 0) {
					$.each(nextTableData, function(i, item) {
						var cbItem = item.eleCode;
						var idField = page.shortLineToTF(item.accitemCode) + 'Code';
						var textField = page.shortLineToTF(item.accitemCode) + 'CodeName';
						column.push({
							type: 'treecombox',
							field: idField,
							idField: "code",
							textField: "codeName",
							name: item.eleName,
							leafRequire: true,
							width: 240,
							headalign: 'center',
							className: "assTree",
							data: nextTableData[i].accItemDataList,
							"render": function(rowid, rowdata, data, meta) {
								//BUGCWYXM-4727--指标分解树组件清空问题--zsj
								if(!$.isNull(data)) {
									if($.isNull(rowdata[textField])) {
										var showCodeName = '';
										for(var m = 0; m < nextTableData[i].accItemDataList.length; m++) {
											if(nextTableData[i].accItemDataList[m].code == data) {
												showCodeName = nextTableData[i].accItemDataList[m].codeName;
											}
										}
										return '<span title="' + showCodeName + '">' + showCodeName + '</span>';
									} else {
										return '<span title="' + data + " " + rowdata[textField] + '">' + data + " " + rowdata[textField] + '</span>';
									}
								} else {
									return '';
								}
							}
						});
					});
				}
				column.push({
					field: "drCr",
					name: "借/贷",
					width: 80,
					headalign: 'center',
					className: 'tc',
					"render": function(rowid, rowdata, data, meta) {
						if(!$.isNull(data)) {
							if(data == -1) {
								return '<span>贷</span>';
							} else if(data == 1) {
								return '<span>借</span>';
							}
						} else if(!$.isNull(page.changeDrcr)) {
							if(page.changeDrcr == -1) {
								return '<span>贷</span>';
							} else if(page.changeDrcr == 1) {
								return '<span>借</span>';
							}

						} else {
							return '';
						}
					}
				}, {
					type: 'money',
					field: 'stadAmt',
					name: '结转金额',
					width: 150,
					align: 'right',
					headalign: 'center',
					className: "carryDownCurInput",
					render: function(rowid, rowdata, data) {
						var text = $.formatMoney(rowdata.stadAmt, 2);
						return text == '0.00' ? '' : '<span title="' + text + '">' + text + '</span>';
					},
					onKeyup: function(e) {

					}
				});
				column.push({
					type: 'toolbar',
					field: 'option',
					name: '操作',
					width: 150,
					headalign: 'center',
					className: 'delOpt',
					render: function(rowid, rowdata, data, meta) {
						return '<button class="btn btn-del btn-delete icon-trash" data-toggle="tooltip" title="删除"></button>';
					}
				});

				$('#nextTable').ufDatagrid({
					data: page.allNextData,
					disabled: false, // 可选择
					columns: [column],
					toolbar: [{
							type: 'checkbox',
							class: 'check-all',
							text: '全选'
						},
						{
							type: 'button',
							class: 'btn-default btn-delete',
							text: '删除',
							action: function() {
								ufma.confirm('您确定要删除选中的行数据吗？', function(action) {
									if(action) {
										$('#nextTable tr').find('input.check-item:checked').each(function() {
											var trdId = $(this).attr('rowid');
											$('#nextTable').getObj().del(trdId);
										});
										page.orgDelData();
									} else {
										//点击取消的回调函数
									}
								}, {
									type: 'warning'
								});
							}
						}, {
							type: 'button',
							class: 'btn btn-sm btn-default glyphicon icon-add',
							text: '新增行',
							action: function() {
								page.tableDataSelect = [];
								page.tableDataSelect = $('#nextTable').getObj().getData();
								page.addFlag = true;
								var data = {
									accoCode: page.accoCode,
									accoCodeName: page.accoCodeName,
									drCr: page.changeDrcr,
									stadAmt: 0
								};
								$('#nextTable').getObj().add(data);
							}
						}
					],
					initComplete: function(options, data) {
						ufma.isShow(reslist);
					}
				});
			},
			//点击下一年度获取辅助项
			canChooseTree: function(accoCodeArr, nowTableData) {
				page.allAssiCol = [];
				page.cloArr = ['accoCode', 'drCr', 'stadAmt'];
				var allAssiColCom = [];
				for(var z = 0; z < page.allAssiCol.length; z++) {
					allAssiColCom.push(page.shortLineToTF(page.allAssiCol[z].accitemCode) + 'Code');
				}
				var trAccaCodeT = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('data-accaCode');
				var nextAcctCode = '';
				var nextAgencyCode = '';
				if(trAccaCodeT == '1') {
					for(var m = 0; m < page.cwAccoData.length; m++) {
						if(accoCodeArr == page.cwAccoData[m].code) {
							nextAcctCode = page.cwAccoData[m].acctCode;
							nextAgencyCode = page.cwAccoData[m].agencyCode;
						}
					}
				} else if(trAccaCodeT == '2') {
					for(var m = 0; m < page.ysAccoData.length; m++) {
						if(accoCodeArr == page.ysAccoData[m].code) {
							nextAcctCode = page.ysAccoData[m].acctCode;
							nextAgencyCode = page.ysAccoData[m].agencyCode;
						}
					}
				}
				var argu = {
					"acctCode": nextAcctCode,
					"agencyCode": nextAgencyCode,
					"setYear": page.setYear + 1,
					"rgCode": page.rgCode,
					"accoCode": accoCodeArr
				}
				ufma.ajaxDef('/gl/generateNewAccount/getAccoItem', 'post', argu, function(result) {
					if(result.data.length > 0) {
						var memberAssiArr = [];
						for(var m = 0; m < result.data.length; m++) {
							memberAssiArr.push(result.data[m]);
						}
						for(var j = 0; j < memberAssiArr.length; j++) {
							var newCode = page.shortLineToTF(memberAssiArr[j].accitemCode) + 'Code';
							if(!$.isNull(newCode) && $.inArray(newCode, page.cloArr) === -1) {
								page.cloArr.push(newCode);
							}
							if(!$.isNull(newCode) && $.inArray(newCode, allAssiColCom) === -1) {
								page.allAssiCol.push(memberAssiArr[j]);
								allAssiColCom.push(newCode);
							}
						}
						localStorage.removeItem(accoCodeArr);
						localStorage.setItem(accoCodeArr, JSON.stringify(page.allAssiCol));
					} else {
						page.cloArr = ['accoCode', 'drCr', 'stadAmt'];
					}
				})
				page.allNextData = nowTableData;
				var finalData = [];
				for(var j = 0; j < nowTableData.length; j++) {
					var colArr = {};
					for(var m = 0; m < page.cloArr.length; m++) {
						var colName = page.cloArr[m];
						if(nowTableData[j][colName]) {
							nowTableData[j].stadAmt = !$.isNull(nowTableData[j].stadAmt) ? parseFloat(nowTableData[j].stadAmt) : 0;
							nowTableData[j].drCr = parseInt(page.changeDrcr);
							colArr[colName] = nowTableData[j][colName];
							colArr.accoCodeName = page.accoCodeName;
						}
					}
					finalData.push(colArr);
				}
				if(finalData.length != 0 && !$.isNull(finalData)) {
					var str = JSON.stringify(finalData);
					var nextTableList = str.replace(/\"/g, "'");
					//$('#nextArea').attr('nextTableList', nextTableList);
				}
				$('.nextTableArea').removeClass('hide');
				if(page.allAssiCol.length > 0) {
					page.initNextTable(page.allAssiCol);
					page.memberNextAssi = page.allAssiCol;
				} else {
					page.cloArr = ['accoCode', 'drCr', 'stadAmt'];
					page.initNextTable([]);
					page.allAssiCol = [];
					page.memberNextAssi = [];
				}
				if(page.allAssiCol.length > 0) {
					localStorage.removeItem("allUseNextAssi");
					localStorage.setItem("allUseNextAssi", JSON.stringify(page.allAssiCol));
				}
			},
			//加载检查表格
			initCheckTable: function() {
				if(oTableChack) {
					oTableChack.fnDestroy();
				}
				var tblId = 'dataCheck';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "checkName",
					title: "检查项",
					className: " tc nowrap",
					width: "30px"
				}, {
					data: "checkResult",
					title: "检查结果",
					className: "tc nowrap",
					width: "30px",
					"render": function(data, type, rowdata, meta) {
						if(rowdata.checkResult == true) {
							return '<span class="already" style="color:#00A854;">已通过</span>';
						} else if(rowdata.checkResult == false) {
							return '<span class="needAgain" style="color: #F04134;">未通过</span>';
						}

					}
				}, {
					data: "detailInfo",
					title: "详细信息",
					className: "nowrap detailInfo tl ellipsis commonShow",
					width: "100px",
					"render": function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				}];
				oTableChack = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false,
					"serverSide": false,
					"ordering": false,
					"scrollY": 260,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function(settings, json) {
						ufma.isShow(reslist);
					},
					drawCallback: function(settings) {
						$('#dataCheck').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
					}
				});
			},
			//获取检查数据结果
			showRull: function() {
				var arguAge = {
					"carryWhole": page.carryWhole,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"userId": page.pfData.svUserId,
					"userName": page.pfData.svUserName,
					"roleId": "",
					"roleName": ""
				}
				ufma.showloading('数据加载中，请耐心等待...');
				dm.doPost("dataCheck", arguAge, function(result) {
					ufma.hideloading();
					oTableChack.fnClearTable();
					if(result.data.data.length != 0) {
						oTableChack.fnAddData(result.data.data, true);
					}
				});
			},
			//初始化结转最终表格
			initEndTable: function() {
				if(oTableEnd) {
					oTableEnd.fnDestroy();
				}
				var tblId = 'turnEndTab';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "checkName",
					title: "结转",
					className: "tc nowrap",
					width: "30px"
				}, {
					data: "checkResult",
					title: "结转结果",
					className: "tc nowrap",
					width: "30px",
					"render": function(data, type, rowdata, meta) {
						if(rowdata.checkResult == true) {
							return '<span class="already" style="color:#00A854;">结转成功</span>';
						} else if(rowdata.checkResult == false) {
							return '<span class="needAgain" style="color: #F04134;">结转中断</span>';
						}

					}
				}, {
					data: "detailInfo",
					title: "详细信息",
					className: "nowrap detailInfo tl ellipsis commonShow",
					width: "100px",
					"render": function(data, type, rowdata, meta) {
						if(!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}

					}
				}];
				oTableEnd = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"paging": false,
					"serverSide": false,
					"ordering": false,
					"scrollY": 260,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function(settings, json) {
						ufma.isShow(reslist);
					},
					drawCallback: function(settings) {
						$('#turnEndTab').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						ufma.setBarPos($(window));
						var wrapperWidth = $('#turnEndTab_wrapper').width();
						var tableWidth = $('#turnEndTab').width();
						if(tableWidth > wrapperWidth) {
							$('#turnEndTab').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							ufma.setBarPos($(window));
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						} else {
							$('#turnEndTab').closest('.dataTables_wrapper').ufScrollBar('destroy');
							$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent")
						}
					}
				});
			},

			//获取结转处理表格数据
			showTblData: function() {
				ufma.showloading('数据加载中，请耐心等待...');
				$('#oneResult').removeClass('hide');
				$('#threeResult,#twoResult').addClass('hide');
				var argu = {
					"carryWhole": page.carryWhole,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"userId": page.pfData.svUserId,
					"userName": page.pfData.svUserName,
					"roleId": "",
					"roleName": "",
					"detailBeanList": page.detailBeanList
				}
				dm.doPost("carryForward", argu, function(result) {
					ufma.hideloading();
					oTableEnd.fnClearTable();
					if(!$.isNull(result.data.data) && result.data.data.length != 0) {
						if(result.data.flag == true) {
							$('#twoResult').removeClass('hide');
							$('#oneResult').addClass('hide');
						} else {
							$('#threeResult').removeClass('hide');
							$('#oneResult').addClass('hide');
						}
						oTableEnd.fnAddData(result.data.data, true)
					}
				});
			},

			//初始化未达账表格
			initOutentryTable: function() {
				if(oTableOutentry) {
					oTableOutentry.fnDestroy();
				}
				var tblId = 'outEntryTab';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					data: "schemaName",
					title: "对账方案",
					className: "tc nowrap commonShow",
					width: "30px",
					"render": function(data, type, rowdata, meta) {
						return '<span title="' + data + '">' + data + '</span>';

					}
				}, {
					data: "isOk",
					title: "结转结果",
					className: "tc nowrap",
					width: "30px",
					"render": function(data, type, rowdata, meta) {
						if(rowdata.isOk == true) {
							return '<span class="already" style="color:#00A854;">成功</span>';
						} else if(rowdata.isOk == false) {
							return '<span class="needAgain" style="color: #F04134;">失败</span>';
						}

					}
				}, {
					data: "msg",
					title: "详细信息",
					className: "nowrap detailInfo tl ellipsis commonShow",
					width: "100px",
					"render": function(data, type, rowdata, meta) {
						return '<span title="' + data + '">' + data + '</span>';

					}
				}];

				oTableOutentry = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"pageLength": ufma.dtPageLength("#" + tblId),
					"serverSide": false,
					"ordering": false,
					columns: columns,
					//填充表格数据
					data: [],
					"dom": "rt",
					initComplete: function(settings, json) {
						ufma.isShow(reslist);
					},
					drawCallback: function(settings) {
						$('#outEntryTab').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.isShow(reslist);
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
					}
				});
			},
			//获取未达账表格数据
			showOutentry: function() {
				var arguAge = {
					"agencyCode": page.agencyCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode
				}
				ufma.showloading('数据加载中，请耐心等待...');
				dm.doPost("getBankScheData", arguAge, function(result) {
					ufma.hideloading();
					oTableOutentry.fnClearTable();
					if(result.data.length != 0) {
						oTableOutentry.fnAddData(result.data, true);
					}
				});
			},

			//选中要处理的指标进行处理--指标年结
			yearInitFun: function() {
				var assBeanList = [];
				var useAssist = [];
				var countNull = 0;
				var turnMoney = 0;
				if(page.withAssist == false) {
					page.detailBeanList = [];
					$('#carryOver_wrapper').find('.nowAcco').each(function() {
						var detailArgu = {};
						var rowIndex = $(this).attr('index');
						var carryDownCur = 0;
						if(rowIndex && $(this).closest('td').siblings().find(".accoTwo").length > 0) {
							detailArgu = $.extend(detailArgu, oTableCarrry.api(false).row(rowIndex).data());
							detailArgu.nextAccoCode = $(this).closest('td').siblings().find(".accoOne").getObj().getValue();
							detailArgu.nextCodeName = $(this).closest('td').siblings().find(".accoOne").getObj().getText().split(' ')[1];
							detailArgu.assBeanList = [];
							detailArgu.accoAccItemList = [];
							detailArgu.vouDetailAsses = [];
						} else {
							detailArgu = $.extend(detailArgu, oTableCarrry.api(false).row(rowIndex).data());
							//CZSB-128--下一年会计科目传参--zsj
							detailArgu.nextAccoCode = $(this).closest('td').siblings().find(".accoOne").getObj().getValue();
							detailArgu.nextCodeName = $(this).closest('td').siblings().find(".accoOne").getObj().getText().split(' ')[1];
							detailArgu.assBeanList = [];
							detailArgu.accoAccItemList = [];
							detailArgu.vouDetailAsses = [];
						}
						page.detailBeanList.push(detailArgu);
					});
				} else if(page.withAssist == true) {
					page.detailBeanList = [];
					$('#carryOver_wrapper').find('.nowAcco').each(function() {
						var detailArgu = {};
						var rowIndex = $(this).attr('index');
						var carryDownCur = 0;
						detailArgu = $.extend(detailArgu, oTableCarrry.api(false).row(rowIndex).data());
						//CZSB-128--下一年会计科目传参--zsj
						detailArgu.nextAccoCode = $(this).closest('td').siblings().find(".accoOne").getObj().getValue();
						detailArgu.nextCodeName = $(this).closest('td').siblings().find(".accoOne").getObj().getText().split(' ')[1];
						detailArgu.accoAccItemList = [];
						//判断包含clickAssist但是没有accItemList
						if(rowIndex && ($(this).hasClass('checkAccoY'))) {
							var accItemList = $(this).attr('accItemList');
							var vouDetailList = $(this).attr('assiList');
							if(!$.isNull(accItemList)) {
								var assisListData = [];
								if(accItemList && !$.isNull(accItemList)) {
									assisListData = eval("(" + accItemList + ")");
									var finalAssi = [];
									for(var m = 0; m < assisListData.length; m++) {
										delete(assisListData[m]["index"]);
										delete(assisListData[m]["accoCodeName"]);
									}
									detailArgu.assBeanList = assisListData;
								}
							} else {
								detailArgu.assBeanList = [];
							}
							if(!$.isNull(vouDetailList)) {
								var vouDetailData = [];
								if(vouDetailList && !$.isNull(vouDetailList)) {
									vouDetailData = eval("(" + vouDetailList + ")");
									if(vouDetailData.length > 0) {
										var finalData = [];
										for(var j = 0; j < vouDetailData.length; j++) {
											var accoColArr = {};
											for(var m = 0; m < page.cloArr.length; m++) {
												var colName = page.cloArr[m];
												if(vouDetailData[j][colName] && vouDetailData[j][colName] != '*') {
													accoColArr[colName] = vouDetailData[j][colName];
													accoColArr.stadAmt = !$.isNull(vouDetailData[j].stadAmt) ? parseFloat(vouDetailData[j].stadAmt) : 0;
													accoColArr.drCr = parseInt(page.changeDrcr);
												}
											}
											finalData.push(accoColArr);
										}
										detailArgu.vouDetailAsses = finalData;
									} else {
										detailArgu.vouDetailAsses = [];
									}
								}
							} else {
								detailArgu.vouDetailAsses = [];
							}
						} else {
							detailArgu.assBeanList = [];
							detailArgu.vouDetailAsses = [];
						}
						page.detailBeanList.push(detailArgu);
					});
				}
				$('#cbAgency,#cbAcct').addClass('ufma-combox-disabled');
				$('#onePage,#twoPage,#carryOverArea').addClass('hide');
				$('#dataCheckArea').removeClass('hide');
				page.initCheckTable();
				page.carryWhole = false;
				page.showRull();
				$('#zdzzTimeline,#assCheckCancel').removeClass('hide');
				$('#dataCheckCancel').addClass('hide');
			},
			//点击辅字
			orgAttrData: function() {
				if($('#nowTable').hasClass('active')) { //表示没有切换到下一年度过 
					var assistTableData = [];
					$('#assistTable td.lastYearAcco').find('.accoTwo').each(function() {
						var rowIndex = $(this).attr('index');
						if(rowIndex) {
							oTableTwo.api(false).row(rowIndex).data().nextAccoCode = page.accoCode;
							oTableTwo.api(false).row(rowIndex).data().accoCode = page.accoCode;
							assistTableData.push(oTableTwo.api(false).row(rowIndex).data());
						}
					});
					if(assistTableData.length != 0 && !$.isNull(assistTableData)) {
						var str = JSON.stringify(assistTableData);
						var nowTableList = str.replace(/\"/g, "'");
						$('#nowTable').attr('nowTableList', nowTableList);
					}
				}
				if($('#nextArea').hasClass('active')) { //表示没有切换到本年度过 
					var finalData = [];
					var nexTableData = $('#nextTable').getObj().getData();
					for(var j = 0; j < nexTableData.length; j++) {
						var colArr = {};
						for(var m = 0; m < page.cloArr.length; m++) {
							var colName = page.cloArr[m]
							if(nexTableData[j][colName]) {
								nexTableData[j].stadAmt = parseFloat(nexTableData[j].stadAmt);
								nexTableData[j].drCr = parseInt(page.changeDrcr);
								colArr[colName] = nexTableData[j][colName];
								colArr.accoCodeName = nexTableData[j].accoCodeName;
							}
						}
						finalData.push(colArr);
					}
					if(finalData.length != 0 && !$.isNull(finalData)) {
						var str = JSON.stringify(finalData);
						rightArr = str.replace(/\"/g, "'");
						var nextTableList = str.replace(/\"/g, "'");
						$('#nextArea').attr('nextTableList', nextTableList);
					}
				}
			},
			//删除时组织数据
			orgDelData: function() {
				page.allNextData = [];
				var accoCodeArr = '';
				var nexTableData = $('#nextTable').getObj().getData();
				var newAddList = '';
				var finalData = [];
				var newAddData = [];

				for(var j = 0; j < nexTableData.length; j++) {
					var colArr = {};
					for(var m = 0; m < page.cloArr.length; m++) {
						var colName = page.cloArr[m]
						if(nexTableData[j][colName]) {
							nexTableData[j].stadAmt = parseFloat(nexTableData[j].stadAmt);
							nexTableData[j].drCr = parseInt(page.changeDrcr);
							colArr[colName] = nexTableData[j][colName];
							colArr.accoCodeName = nexTableData[j].accoCodeName;
						}
					}
					finalData.push(colArr);
				}
				if(finalData.length != 0 && !$.isNull(finalData)) {
					var str = JSON.stringify(finalData);
					rightArr = str.replace(/\"/g, "'");
					var nextTableList = str.replace(/\"/g, "'");
					$('#nextArea').attr('nextTableList', nextTableList);
				} else {
					$('#nextArea').attr('nextTableList', '');
				}
				if(nexTableData.length != 0 && !$.isNull(nexTableData)) {
					accoCodeArr = page.accoCode;
					page.canChooseTree(accoCodeArr, nexTableData);
				} else {
					page.cloArr = ['accoCode', 'drCr', 'stadAmt'];
					page.allNextData = [];
					page.initNextTable([]);
					page.allAssiCol = [];
					page.memberNextAssi = [];
					localStorage.removeItem("allUseNextAssi");
				}
			},
			//点击辅字时比较
			comPireLi: function() {
				var accItemList = '';
				var assiList = '';
				if($('#nowTable').hasClass('active')) {
					var nowDt = [];
					var nowList = '';
					//当前年度
					if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList'))) {
						accItemList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList');
					} else {
						if(!$.isNull($('#nowTable').attr('nowTableList'))) {
							accItemList = $('#nowTable').attr('nowTableList');
						} else {
							$('#assistTable td.lastYearAcco').find('.accoTwo').each(function() {
								var rowIndex = $(this).attr('index');
								if(rowIndex) {
									oTableTwo.api(false).row(rowIndex).data().nextAccoCode = page.accoCode;
									oTableTwo.api(false).row(rowIndex).data().accoCode = page.accoCode;
									nowDt.push(oTableTwo.api(false).row(rowIndex).data());
								}
							});
							if(nowDt.length != 0 && !$.isNull(nowDt)) {
								var str = JSON.stringify(nowDt);
								nowList = str.replace(/\"/g, "'");
							}
							accItemList = nowList;
						}
					}
					//下一年页签
					if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList'))) {
						assiList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList');
					} else {
						if(!$.isNull($('#nextArea').attr('nextTableList'))) {
							assiList = $('#nextArea').attr('nextTableList');
						}
					}
				} else if($('#nextArea').hasClass('active')) {
					var nexList = '';
					var nexDt = [];
					//下一年页签
					if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList'))) {
						assiList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList');
					} else {
						if(!$.isNull($('#nextArea').attr('nextTableList'))) {
							assiList = $('#nextArea').attr('nextTableList');
						} else {
							nexDt = $('#nextTable').getObj().getData();
							if(nexDt.length != 0 && !$.isNull(nexDt)) {
								var str = JSON.stringify(nexDt);
								nexList = str.replace(/\"/g, "'");
							}
							assiList = nexList;
						}
					}
					//当前年度
					if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList'))) {
						accItemList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList');
					} else {
						if(!$.isNull($('#nowTable').attr('nowTableList'))) {
							accItemList = $('#nowTable').attr('nowTableList');
						}
					}
				}
				var argObj = {
					accItemList: accItemList,
					assiList: assiList
				}
				return argObj;
			},
			onEventListener: function() {
				//点击开始年结：隐藏onePage
				$('#beginEnd').on('click', function() {
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					$('#onePage,#twoPageNext').addClass('hide');
					$('#twoPage,#toTurn').removeClass('hide');
					page.clickBtn = 'beginEnd';
					page.disableFlag = true;
					page.clearTimeLine();
					$('#allTurn').prop('checked', 'checked');
					$('#accoTurn').removeAttr('checked');
				});
				//生成未达账项
				$('#outentry').on('click', function() {
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					$('#onePage,#dataCheckArea,#twoPage,#carryOverArea,#dealArea').addClass('hide');
					page.clearTimeLine();
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					$('#zdzzTimeline,#outEntryArea').removeClass('hide');
					page.timeline.next();
					page.initOutentryTable();
					page.showOutentry();
					page.timeline.next();
				});

				//开始完全结转
				$('#toTurn').on('click', function() {
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					$('#onePage,#twoPage').addClass('hide');
					$('#dataCheckArea').removeClass('hide');
					page.initCheckTable();
					if($('#allTurn').attr('checked')) {
						page.carryWhole = true;
						page.withAssist = true;
						page.detailBeanList = [];
						$('#dataCheckCancel').removeClass('hide');
						$('#assCheckCancel').addClass('hide');
					} else if($('#accoTurn').attr('checked')) {
						page.carryWhole = false;
						page.withAssist = false;
						$('#dataCheckCancel').addClass('hide');
						$('#assCheckCancel').removeClass('hide');
					}
					page.showRull();
					$('#zdzzTimeline').removeClass('hide');
					page.timeline.next();
				});
				//选择结转方式-上一步
				$('#twoPagePrev').on('click', function() {
					$('#cbAgency,#cbAcct').removeClass(' ufma-combox-disabled');
					$('#twoPage').addClass('hide');
					$('#onePage').removeClass('hide');
				});
				//完全结转：数据检查下一步
				$('#dataCheckNext').on('click', function() {
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					$('#onePage,#twoPage,#dataCheckArea').addClass('hide');
					$('#dealArea,#dealCancel').removeClass('hide');
					page.timeline.next();
					page.initEndTable();
					page.showTblData();
				});
				//重新检查
				$('#checkAgain').on('click', function() {
					page.showRull();
				})
				//选择结转方式-完全结转
				$('#allTurn').on('click', function() {
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					page.carryWhole = true;
					page.withAssist = true;
					page.detailBeanList = [];
					$('#twoPageNext').addClass('hide');
					$('#toTurn').removeClass('hide');
				});
				//选择结转方式-科目结转
				$('#accoTurn').on('click', function() {
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					page.carryWhole = false;
					page.withAssist = false;
					$('#twoPageNext').removeClass('hide');
					$('#toTurn').addClass('hide');
				});
				//点击检查界面的下一步
				$('#twoPageNext').on('click', function() {
					$('#cbAgency,#cbAcct').addClass(' ufma-combox-disabled');
					$('#onePage,#twoPage,#assOverTable').addClass('hide');
					page.initAcco();
				});
				//点击科目表格的“辅”字出现辅助项表格
				$('#carryOver').on('click', '.checkAccoY', function() {
					var nextSelect = $(this).closest('td').siblings().find(".accoOne").getObj().getValue();
					if(!$.isNull(nextSelect)) {
						var actionType = '';
						var oldAssData = '';
						var accItemList = '';
						var assiList = '';
						var compireMoney = 0;
						var comArg = {};
						var accItemListDat = [];

						var assiListDat = [];
						var memrCode = '';
						var changeCode = '';
						if(!$.isNull($(this).attr('accItemList'))) {
							actionType = 'member';
							var nowDtList = $(this).attr('accItemList');
							memrCode = $(this).attr('memrCode');
							changeCode = $(this).attr('changeCode');
							if(memrCode != changeCode) {
								page.accoCode = $(this).attr('changeCode');
								page.accoCodeName = $(this).attr('changeName');
								page.changeDrcr = $(this).attr('changeDrcr');
								$(this).attr('accItemList', '');
								$(this).attr('assiList', '');
							}
						} else {
							actionType = 'clickY';
						}
						if($("#carryOver tr").find('.checkAccoY.clickAssist').length == 0) {
							$(this).addClass('clickAssist');
						} else {
							if(!$(this).hasClass('clickAssist')) {
								comArg = page.comPireLi();
								if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList'))) {
									accItemList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList');
								} else {
									accItemList = comArg.accItemList;
								}
								if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList'))) {
									assiList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList');
								} else {
									assiList = comArg.assiList;
								}
								compireMoney = !$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html()) ? $("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html().replace(/,/g, "") : 0;
								if(!$.isNull(accItemList)) {
									accItemListDat = eval("(" + accItemList + ")");
								}
								if(!$.isNull(assiList)) {
									if($('#nowTable').hasClass('active')) {
										assiListDat = eval("(" + assiList + ")");
									} else {
										assiListDat = $('#nextTable').getObj().getData();
									}
								}
								if(!$.isNull(assiList)) {
									var count = 0;
									var balCount = 0;
									var moneySum = 0;
									var assCount = 0;
									//主表格下一年度科目
									var mainAcco = $("#carryOver tr").find('.checkAccoY.clickAssist').closest('td').siblings().find(".accoOne").getObj().getValue();
									if($.isNull(mainAcco)) {
										count++;
									}
									//当前年度下一年度科目
									for(var m = 0; m < accItemListDat.length; m++) {
										if($.isNull(accItemListDat[m].nextAccoCode)) {
											count++;
										}
									}
									//下一 年度科目
									if(assiListDat.length > 0) {
										moneySum = 0;
										for(var m = 0; m < assiListDat.length; m++) {
											var assiCode = assiListDat[m].accoCode;
											if($.isNull(assiCode)) {
												count++;
											} else {
												var memberAssiObj = localStorage.getItem(assiCode);
												var memberAssiArr = [];
												var memObj = [];
												if(!$.isNull(memberAssiObj)) {
													memberAssiArr = eval("(" + memberAssiObj + ")");
													for(var n = 0; n < memberAssiArr.length; n++) {
														var ascciCode = page.shortLineToTF(memberAssiArr[n].accitemCode) + 'Code';
														//CWYXM-12422 --账务自定义年结，如果新年度科目设置辅项非必填--zsj
														if(memberAssiArr[n].isMust == "1" && ($.isNull(assiListDat[m][ascciCode]) || assiListDat[m][ascciCode] == "*")) {
															assCount++;
														}
													}
												}
												//判断金额是否为空
												if($.isNull(assiListDat[m].stadAmt) || assiListDat[m].stadAmt == 0) {
													balCount++;
												} else {
													moneySum += parseFloat(assiListDat[m].stadAmt);
												}
											}
										}
										if(count > 0) {
											var year = (page.setYear + 1);
											ufma.showTip(year + '年度科目不能为空', function() {}, 'warning');
											return false;
										} else if(assCount > 0) {
											ufma.showTip('辅助项不能为空', function() {}, 'warning');
											return false;
										} else if(balCount > 0) {
											ufma.showTip('结转金额必须大于0', function() {}, 'warning');
											return false;
										} else if(parseFloat(parseFloat(moneySum).toFixed(2)) > parseFloat(parseFloat(compireMoney).toFixed(2))) {
											ufma.showTip('结转金额不能大于可结转余额', function() {}, 'warning');
											return false;
										}
									}
								}
								$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('memrCode', page.accoCode);
								$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('accItemList', accItemList);
								$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('assiList', assiList); //切换上面表格时将下一年度表格数据作为属性附上
								$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('oldAssData', oldAssData);
								$(this).closest('tr').siblings().find('.checkAccoY').removeClass('clickAssist');
								$(this).addClass('clickAssist');
							} else {
								comArg = page.comPireLi();
								if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList'))) {
									accItemList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList');
								} else {
									accItemList = comArg.accItemList;
								}
								if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList'))) {
									assiList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList');
								} else {
									assiList = comArg.assiList;
								}
								compireMoney = !$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html()) ? $("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html().replace(/,/g, "") : 0;
								if(!$.isNull(accItemList)) {
									accItemListDat = eval("(" + accItemList + ")");
								}
								if(!$.isNull(assiList)) {
									if($('#nowTable').hasClass('active')) {
										assiListDat = eval("(" + assiList + ")");
									} else {
										assiListDat = $('#nextTable').getObj().getData();
									}
								}
								if(!$.isNull(assiList)) {
									var count = 0;
									var balCount = 0;
									var moneySum = 0;
									var assCount = 0;
									//主表格下一年度科目
									var mainAcco = $("#carryOver tr").find('.checkAccoY.clickAssist').closest('td').siblings().find(".accoOne").getObj().getValue();
									if($.isNull(mainAcco)) {
										count++;
									}
									//当前年度下一年度科目
									for(var m = 0; m < accItemListDat.length; m++) {
										if($.isNull(accItemListDat[m].nextAccoCode)) {
											count++;
										}
									}
									//下一 年度科目
									if(assiListDat.length > 0) {
										moneySum = 0;
										for(var m = 0; m < assiListDat.length; m++) {
											var assiCode = assiListDat[m].accoCode;
											if($.isNull(assiCode)) {
												count++;
											} else {
												var memberAssiObj = localStorage.getItem(assiCode);
												var memberAssiArr = [];
												var memObj = [];
												if(!$.isNull(memberAssiObj)) {
													memberAssiArr = eval("(" + memberAssiObj + ")");
													for(var n = 0; n < memberAssiArr.length; n++) {
														var ascciCode = page.shortLineToTF(memberAssiArr[n].accitemCode) + 'Code';
														//CWYXM-12422 --账务自定义年结，如果新年度科目设置辅项非必填--zsj
														if(memberAssiArr[n].isMust == "1" && ($.isNull(assiListDat[m][ascciCode]) || assiListDat[m][ascciCode] == "*")) {
															assCount++;
														}
													}
												}
												//判断金额是否为空
												if($.isNull(assiListDat[m].stadAmt) || assiListDat[m].stadAmt == 0) {
													balCount++;
												} else {
													moneySum += parseFloat(assiListDat[m].stadAmt);
												}
											}
										}
										if(count > 0) {
											var year = (page.setYear + 1);
											ufma.showTip(year + '年度科目不能为空', function() {}, 'warning');
											return false;
										} else if(assCount > 0) {
											ufma.showTip('辅助项不能为空', function() {}, 'warning');
											return false;
										} else if(balCount > 0) {
											ufma.showTip('结转金额必须大于0', function() {}, 'warning');
											return false;
										} else if(parseFloat(parseFloat(moneySum).toFixed(2)) > parseFloat(parseFloat(compireMoney).toFixed(2))) {
											ufma.showTip('结转金额不能大于可结转余额', function() {}, 'warning');
											return false;
										}
									}
								}
								$(this).attr('memrCode', page.accoCode);
								$(this).attr('accItemList', accItemList);
								$(this).attr('assiList', assiList); //切换上面表格时将下一年度表格数据作为属性附上
								$(this).attr('oldAssData', oldAssData);
							}
						}
						var changeFlag = true;
						page.oldData = [];
						page.oldRightData = [];
						if(!$.isNull(changeCode) && !$.isNull(memrCode) && changeCode == memrCode) {
							page.orgAttrData();
						}
						$('#nextArea').removeClass('hide');
						$('#nowTable').addClass('active');
						$('#nextArea').removeClass('active');
						$('.assistTab').removeClass('hide');
						$('.nextTableArea').addClass('hide');
						$('#nowTable').attr('nowTableList', '');
						$('#nowTable').attr('newAddList', '');
						$('#nextArea').attr('nextTableList', '');
						localStorage.removeItem("allUseNextAssi");
						page.selectAccoCode = $(this).attr('data-accoCode');
						//判断是否包含data-assistList，重新给表格加载数据
						$('#accoOverBegin').addClass('hide');
						var treeData = $(this).attr('data-assist');
						$('#assOverTable,#assOverBegin').removeClass('hide');
						if(actionType == 'clickY') {
							page.accoCode = $(this).attr('changeCode');
							page.accoCodeName = $(this).attr('changeName');
							page.changeDrcr = $(this).attr('changeDrcr');
						}
						page.nowAccoCode = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('data-accoCode');
						page.nowAccoCodeName = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('data-accoCodeName');
						page.assisTreeData = [];
						if(treeData && !$.isNull(treeData)) {
							page.assisTreeData = eval("(" + treeData + ")");
						} else {
							page.assisTreeData = [];
						}
						if($(this).attr('accItemList') && !$.isNull($(this).attr('accItemList'))) {
							var assData = $(this).attr('accItemList');
							var oldTabdata = eval("(" + assData + ")");
							page.oldData = [];
							page.oldData = oldTabdata;
						}
						if($(this).attr('assiList') && !$.isNull($(this).attr('assiList'))) {
							var assData = $(this).attr('assiList');
							var oldTabdata = eval("(" + assData + ")");
							page.oldRightData = [];
							page.oldRightData = oldTabdata;
						}
						page.clickFlag = true;
						page.initAssistTable();
						if(page.oldData && page.oldData.length > 0) {
							oTableTwo.fnClearTable();
							oTableTwo.fnAddData(page.oldData, true);
						} else {
							page.showAccoTwo();
						}
						page.notChange = true;
					} else {
						var year = (page.setYear + 1);
						ufma.showTip(year + '年度科目不能为空', function() {}, 'warning');
						return false;
					}

				});
				//点击科目表格不含“辅”字的列，则隐藏辅助项
				$('#carryOver').on('click', '.checkAccoN', function() {
					var nextSelect = $(this).closest('td').siblings().find(".accoOne").getObj().getValue();
					if(!$.isNull(nextSelect)) {
						var changeFlag = true;
						var oldAssData = '';
						var accItemList = '';
						var assiList = '';
						page.oldData = [];
						var comArg = {};
						page.orgAttrData();
						if($("#carryOver tr").find('.checkAccoY.clickAssist').length != 0) {
							comArg = page.comPireLi();
							accItemList = comArg.accItemList;
							assiList = comArg.assiList;
							$('#nowTable').attr('nowTableList', '');
							$('#nowTable').attr('newAddList', '');
							$('#nextArea').attr('nextTableList', '');
							var accItemListDat = []
							if(!$.isNull(accItemList)) {
								accItemListDat = eval("(" + accItemList + ")");
							}
							var assiListDat = []
							if(!$.isNull(assiList)) {
								assiListDat = eval("(" + assiList + ")");
							}
							if(!$.isNull(assiList)) {
								var count = 0;
								var balCount = 0;
								var moneySum = 0;
								var assCount = 0;
								//主表格下一年度科目
								var mainAcco = $("#carryOver tr").find('.checkAccoY.clickAssist').closest('td').siblings().find(".accoOne").getObj().getValue();
								if($.isNull(mainAcco)) {
									count++;
								}
								//当前年度下一年度科目
								for(var m = 0; m < accItemListDat.length; m++) {
									if($.isNull(accItemListDat[m].nextAccoCode)) {
										count++;
									}
								}
								//下一 年度科目
								for(var m = 0; m < assiListDat.length; m++) {
									var assiCode = assiListDat[m].accoCode;
									if($.isNull(assiCode)) {
										count++;
									} else {
										var memberAssiObj = localStorage.getItem(assiCode);
										var memberAssiArr = [];
										var memObj = [];
										if(!$.isNull(memberAssiObj)) {
											memberAssiArr = eval("(" + memberAssiObj + ")");
											for(var n = 0; n < memberAssiArr.length; n++) {
												var ascciCode = page.shortLineToTF(memberAssiArr[n].accitemCode) + 'Code';
												//CWYXM-12422 --账务自定义年结，如果新年度科目设置辅项非必填--zsj
												if(memberAssiArr[n].isMust == "1" && ($.isNull(assiListDat[m][ascciCode]) || assiListDat[m][ascciCode] == "*")) {
													assCount++;
												}
											}
										}
										//判断金额是否为空
										if($.isNull(assiListDat[m].stadAmt) || assiListDat[m].stadAmt == 0) {
											balCount++;
										} else {
											moneySum += parseFloat(assiListDat[m].stadAmt);
										}
									}
								}
								var compireMoney = !$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html()) ? $("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html().replace(/,/g, "") : 0;
								if(count > 0) {
									var year = (page.setYear + 1);
									ufma.showTip(year + '年度科目不能为空', function() {}, 'warning');
									return false;
								} else if(assCount > 0) {
									ufma.showTip('辅助项不能为空', function() {}, 'warning');
									return false;
								} else if(balCount > 0) {
									ufma.showTip('结转金额必须大于0', function() {}, 'warning');
									return false;
								} else if(parseFloat(parseFloat(moneySum).toFixed(2)) > parseFloat(parseFloat(compireMoney).toFixed(2))) {
									ufma.showTip('结转金额不能大于可结转余额', function() {}, 'warning');
									return false;
								}
							}
							$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('memrCode', page.accoCode);
							$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('accItemList', accItemList);
							$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('assiList', assiList); //切换上面表格时将下一年度表格数据作为属性附上
							$(this).closest('tr').siblings().find('.checkAccoY.clickAssist').attr('oldAssData', oldAssData);
							$(this).closest('tr').siblings().find('.checkAccoY').removeClass('clickAssist');
						}
						localStorage.removeItem("allUseNextAssi");
						$('#assOverTable,#assOverBegin').addClass('hide');
						var countAccItem = 0;
						$('#carryOver_wrapper').find('.checkAccoY.nowAcco').each(function() {
							if(!$.isNull($(this).attr('accitemlist'))) {
								countAccItem++;
							}
						});
						if(countAccItem > 0) {
							$('#accoOverBegin').addClass('hide');
							$('#assOverBegin').removeClass('hide');
						} else {
							$('#accoOverBegin').removeClass('hide');
							$('#assOverBegin').addClass('hide');
						}
						$('#nextArea .nextTableArea').addClass('hide');

						$('#nowTable').addClass('active');
						$('.assistTab').addClass('hide');
						page.clickFlag = false;
						page.notChange = true;
					} else {
						var year = (page.setYear + 1);
						ufma.showTip(year + '年度科目不能为空', function() {}, 'warning');
						return false;
					}

				});
				//点击检查界面的上一步
				$('#dataCheckCancel').on('click', function() {
					$('#dataCheckArea,#onePage').addClass('hide');
					$('#twoPage').removeClass('hide');
					$('#cbAgency,#cbAcct').removeClass(' ufma-combox-disabled');
					$('#zdzzTimeline').addClass('hide');
					page.clearTimeLine();
				});
				//辅助项界面上一步
				$('#assOverCancel').on('click', function() {
					$('#onePage,#carryOverArea,#assOverTable').addClass('hide');
					$('#twoPage').removeClass('hide');
					page.clearTimeLine();
				});
				//点击完成
				$('#dealSure,#outEntrySure').on('click', function() {
					$('#onePage').removeClass('hide');
					$('#carryOverArea,#dataCheckArea,#dealArea,#zdzzTimeline,#outEntryArea').addClass('hide');
					page.initAgencyStatus();
					page.disableFlag = false;
					$('#cbAgency,#cbAcct').removeClass(' ufma-combox-disabled');
				});
				//按科目结转-开始结转金额
				$('#accoOverBegin').on('click', function() {
					$('#cbAgency,#cbAcct').addClass('ufma-combox-disabled');
					//CZSB-138--校验下一年度科目是否为空--zsj
					var count = 0;
					$('#carryOver_wrapper').find('.nowAcco').each(function() {
						var rowIndex = $(this).attr('index');
						var nextAccoCode = $(this).closest('td').siblings().find(".accoOne").getObj().getValue();
						if($.isNull(nextAccoCode)) {
							count++;
						}
					});
					if(count == 0) {
						$('#onePage,#twoPage,#carryOverArea').addClass('hide');
						$('#dataCheckArea').removeClass('hide');
						page.carryWhole = false;
						$('#zdzzTimeline,#assCheckCancel').removeClass('hide');
						page.timeline.next();
						$('#dataCheckCancel').addClass('hide');
						page.withAssist = false;
						page.yearInitFun();
						page.notChange = true;
					} else {
						var year = (page.setYear + 1);
						ufma.showTip(year + '年度科目不能为空', function() {}, 'warning');
						return false;
					}

				});
				//按辅助项结转--暂不控制辅助项是否为空
				$('#assOverBegin').on('click', function() {
					//CZSB-138--校验下一年度科目是否为空--zsj
					var count = 0;
					var balCount = 0;
					var moneySum = 0;
					var assCount = 0;
					var tableData = [];
					if($('#nextArea').hasClass('active')) {
						moneySum = 0;
						tableData = $('#nextTable').getObj().getData();
						if(tableData.length > 0) {
							if(tableData.length != 0 && !$.isNull(tableData)) {
								var str = JSON.stringify(tableData);
								var nextStr = str.replace(/\"/g, "'");
								$('#nextArea').attr('nextTableList', nextStr);
							}
							for(var m = 0; m < tableData.length; m++) {
								var assiCode = tableData[m].accoCode;
								if($.isNull(assiCode)) {
									count++;
								} else {
									var memberAssiObj = localStorage.getItem(assiCode);
									var memberAssiArr = [];
									var memObj = [];
									if(!$.isNull(memberAssiObj)) {
										memberAssiArr = eval("(" + memberAssiObj + ")");
										for(var n = 0; n < memberAssiArr.length; n++) {
											var ascciCode = page.shortLineToTF(memberAssiArr[n].accitemCode) + 'Code';
											//CWYXM-12422 --账务自定义年结，如果新年度科目设置辅项非必填--zsj
											if(memberAssiArr[n].isMust == "1") {
												if($.inArray(ascciCode, page.cloArr) && ($.isNull(tableData[m][ascciCode]) || tableData[m][ascciCode] == '*')) {
													assCount++;
												}
											}
										}
									}
									//判断金额是否为空
									if($.isNull(tableData[m].stadAmt) || tableData[m].stadAmt == 0) {
										balCount++;
									} else {
										moneySum += parseFloat(tableData[m].stadAmt);
									}
								}
							}
						}
					} else {
						var assiListDat = [];
						var assiList = $('#nextArea').attr('nextTableList');
						if(!$.isNull(assiList)) {
							if($('#nowTable').hasClass('active')) {
								assiListDat = eval("(" + assiList + ")");
							} else {
								assiListDat = $('#nextTable').getObj().getData();
							}
						}
						if(assiListDat.length > 0) {
							moneySum = 0;
							for(var m = 0; m < assiListDat.length; m++) {
								var assiCode = assiListDat[m].accoCode;
								if($.isNull(assiCode)) {
									count++;
								} else {
									var memberAssiObj = localStorage.getItem(assiCode);
									var memberAssiArr = [];
									var memObj = [];
									if(!$.isNull(memberAssiObj)) {
										memberAssiArr = eval("(" + memberAssiObj + ")");
										for(var n = 0; n < memberAssiArr.length; n++) {
											var ascciCode = page.shortLineToTF(memberAssiArr[n].accitemCode) + 'Code';
											//CWYXM-12422 --账务自定义年结，如果新年度科目设置辅项非必填--zsj
											if(memberAssiArr[n].isMust == "1" && ($.isNull(assiListDat[m][ascciCode]) || assiListDat[m][ascciCode] == "*")) {
												assCount++;
											}
										}
									}
									//判断金额是否为空
									if($.isNull(assiListDat[m].stadAmt) || assiListDat[m].stadAmt == 0) {
										balCount++;
									} else {
										moneySum += parseFloat(assiListDat[m].stadAmt);
									}
								}
							}
						}
					}
					$('#carryOver_wrapper').find('.nowAcco').each(function() {
						var nextAccoCode = $(this).closest('td').siblings().find(".accoOne").getObj().getValue();
						if($.isNull(nextAccoCode)) {
							count++;
						}
					});

					var compireMoney = !$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html()) ? $("#carryOver tr").find('.checkAccoY.clickAssist').closest('tr').find('td.canBalAmt').html().replace(/,/g, "") : 0;
					if(!$.isNull($('#nextArea').attr('nextTableList'))) {
						if(balCount > 0) {
							ufma.showTip('结转金额必须大于0', function() {}, 'warning');
							return false;
						} else if(parseFloat(parseFloat(moneySum).toFixed(2)) > parseFloat(parseFloat(compireMoney).toFixed(2))) {
							ufma.showTip('结转金额不能大于可结转余额', function() {}, 'warning');
							return false;
						}
					}
					if(count == 0 && assCount == 0 && balCount == 0) {
						page.orgAttrData();
						var accItemList = $('#nowTable').attr('nowTableList');
						var assiList = $('#nextArea').attr('nextTableList');
						$("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList', accItemList);
						$("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList', assiList);
						page.withAssist = true;
						page.carryWhole = false;
						page.yearInitFun();
					} else {
						if(count > 0) {
							var year = (page.setYear + 1);
							ufma.showTip(year + '年度科目不能为空', function() {}, 'warning');
							return false;
						} else if(assCount > 0) {
							ufma.showTip('辅助项不能为空', function() {}, 'warning');
							return false;
						}
					}
					$('#nowTable').attr('nowTableList', '');
					$('#nowTable').attr('newAddList', '');
					$('#nextArea').attr('nextTableList', '');
				});
				//按科目结转-开始结转金额--上一步
				$('#assCheckCancel').on('click', function() {
					$('#dataCheckCancel').addClass('hide');
					$('#cbAgency,#cbAcct').addClass('ufma-combox-disabled');
					$('#onePage,#twoPage,#dataCheckArea,#zdzzTimeline,#assCheckCancel').addClass('hide');
					$('#carryOverArea').removeClass('hide');
					page.timeline.prev();
				});
				//完成界面的上一步 
				$('#dealCancel').on('click', function() {
					$('#onePage,#twoPage,#carryOverArea,#dealArea,#outEntryArea,#dealCancel').addClass('hide');
					$('#dataCheckArea').removeClass('hide');
					if(page.carryWhole == true) {
						$('#dataCheckCancel').removeClass('hide');
						$('#assCheckCancel').addClass('hide');
					} else if(page.carryWhole == false) {
						$('#dataCheckCancel').addClass('hide');
						$('#assCheckCancel').removeClass('hide');
					}
					page.timeline.prev();
				});
				//切换本年度与下一年度
				$('#tabAcce li a').click(function(e) {
					e.preventDefault();
					if($.isNull(page.accoCode)) {
						$('#nowTable').addClass('active');
						$('#nextArea').removeClass('active');
						ufma.showTip('结转科目不能为空，请重新选择', function() {}, 'warning');
						return false;
					} else {
						if($(this).attr('id') == 'aAssistTable') {
							if($('#nextArea').hasClass('active')) { //标识从下一年度切换到当前年度
								if(!$('.nextTableArea').hasClass('hide')) {
									var nexTableData = $('#nextTable').getObj().getData();
									var nextTableList = '';
									var newAddData = [];
									var newAddList = '';
									if(nexTableData.length != 0 && !$.isNull(nexTableData)) {
										var str = JSON.stringify(nexTableData);
										nextTableList = str.replace(/\"/g, "'");
										$('#nextArea').attr('nextTableList', nextTableList);
									}
								}
							}
							$('.assistTab').removeClass('hide');
							$('.nextTableArea').addClass('hide');
							$('#nextArea').removeClass('active');
							$('#nowTable').addClass('active');
							$("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList', nextTableList);
						} else if($(this).attr('id') == 'aNextTable') {
							var nowTableList = '';
							var accoCodeArr = '';
							page.accoCode = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('changeCode');
							page.accoCodeName = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('changeName');
							if($('#nowTable').hasClass('active')) { //标识从当前年度跳到下一年度
								var accoListData = [];
								$('#assistTable td.lastYearAcco').find('.accoTwo').each(function() {
									var rowIndex = $(this).attr('index');
									if(rowIndex) {
										oTableTwo.api(false).row(rowIndex).data().nextAccoCode = page.accoCode;
										oTableTwo.api(false).row(rowIndex).data().accoCode = page.accoCode;
										//oTableTwo.api(false).row(rowIndex).data().accoCodeName = page.accoCodeName;
										accoListData.push(oTableTwo.api(false).row(rowIndex).data());
									}
								});
								if(accoListData.length != 0 && !$.isNull(accoListData)) {
									var str = JSON.stringify(accoListData);
									nowTableList = str.replace(/\"/g, "'");
								}
								if(!$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList')) && !$.isNull($("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList'))) { //为已点击过辅字的科目
									var memNextList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('assiList');
									var memNowList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList');
									$('#nowTable').attr('nowTableList', memNowList);
									$('#nextArea').attr('nextTableList', memNextList);
									var memNextData = [];
									if(memNextList && !$.isNull(memNextList)) {
										memNextData = eval("(" + memNextList + ")");
									}
									nowTableList = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList');
									accoCodeArr = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('changeCode');
									page.canChooseTree(accoCodeArr, memNextData);
								} else if(!$.isNull($('#nextArea').attr('nextTableList'))) { //为已点击过下一年度的科目
									var assistTableData = [];
									var nextTableList = $('#nextArea').attr('nextTableList');
									if(!$.isNull(nextTableList)) {
										if(nextTableList && !$.isNull(nextTableList)) {
											assistTableData = eval("(" + nextTableList + ")");
										}
									}
									accoCodeArr = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('changeCode');
									page.canChooseTree(accoCodeArr, assistTableData);
									if(page.oldRightData && page.oldRightData.length > 0) {
										accoCodeArr = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('changeCode');
										page.canChooseTree(accoCodeArr, page.oldRightData);
										page.oldRightData = [];
									}
								} else {
									//为新操作
									accoCodeArr = $("#carryOver tr").find('.checkAccoY.clickAssist').attr('changeCode');
									page.canChooseTree(accoCodeArr, accoListData);
								}
								$('#nowTable').attr('nowTableList', nowTableList);
							}
							$("#carryOver tr").find('.checkAccoY.clickAssist').attr('accItemList', nowTableList);
							$('.nextTableArea').removeClass('hide');
							$('#nextArea').addClass('active');
							$('#nowTable').removeClass('active');
							$('.assistTab').addClass('hide');
							if($(window).height() > 657) {
								$('#carryOver_wrapper .dataTables_scrollBody').css('height', '280px');
								$("#nextTable").css("height", "198px");
								$("#nextTableBody").css("height", "114px");

							} else {
								$('#carryOver_wrapper .dataTables_scrollBody').css('height', '180px');
								$("#nextTable").css("height", "173px");
								$("#nextTableBody").css("height", "100px");
								$('#nextTableFoot').css({
									"height": "33px",
									"line-height": "30px"
								});
							}
						}
					}
				});
				$("#nextTable").on('mousedown', '.btn-del', function(e) {
					e.stopPropagation();
					var rowid = $(this).closest('tr').attr('id');
					var obj = $('#nextTable').getObj(); // 取对象
					ufma.confirm('您确定要删除选中的行数据吗？', function(action) {
						if(action) {
							obj.del(rowid);
							page.orgDelData();
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});
				});
				//全选
				$(document).on('change', '#nextTable .check-item', function() {
					var checkLeng = $('#nextTable tr').find('input.check-item:checked').length;
					var dataLength = $('#nextTable').getObj().getData().length;
					if(checkLeng == dataLength) {
						$('#nextTable tr').find('input.check-all').prop('checked', true);
						$('#nextTableFoot').find('input.check-all').prop('checked', true);
					} else {
						$('#nextTable tr').find('input.check-all').removeAttr('checked');
						$('#nextTableFoot').find('input.check-all').removeAttr('checked');
					}
				});
				//导出结转详细信息 begin guohx  CWYXM-16883 在生成新年度账节点，结转完成后的报错信息较多时，客户需要复制粘贴报错信息，用以查询问题 20200701
				$("#exportExcel").off().on('click', function (evt) {
					evt = evt || window.event;
					evt.preventDefault();
					uf.expTable({
						title: page.agencyName + ' 系统年结自检信息',
						exportTable: '#dataCheck'
					});
				});
				//导出end
			},
			//初始化页面
			initPage: function() {
				this.initAgency();
				$('#agencyText').html('');
				page.timeline = $('#zdzzTimeline').ufmaTimeline([{
					step: '数据检查',
					target: 'zdzj'
				}, {
					step: '结转处理',
					target: 'savemb'
				}, {
					step: '完成',
					target: 'setend'
				}]);
				$('#nowTable').attr('nowTableList', '');
				$('#nowTable').attr('newAddList', '');
				$('#nextArea').attr('nextTableList', '');
			},
			init: function() {
				//获取session
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				page.pfData = ufma.getCommonData();
				page.setYear = parseInt(page.pfData.svSetYear);
				localStorage.removeItem("allUseNextAssi");
				var keysArr = Object.keys(localStorage);
				for(var i = 0; i < keysArr.length; i++) {
					var deleKey = keysArr[i];
					deleKey.indexOf('nextTable') !== -1 ? localStorage.removeItem(deleKey) : '';
				}
				page.rgCode = page.pfData.svRgCode;
				page.clickFlag = false;
				page.withAssist = true;
				page.addFlag = false;
				page.allNextData = [];
				page.oldData = [];
				page.accoDataAll = [];
				page.ysAccoData = []; //预算科目
				page.cwAccoData = []; //财务科目
				page.nextAccoCode = '';
				page.nextCodeName = '';
				page.oldTableDta = [];
				page.notChange = true;
				page.cloArr = ['accoCode', 'drCr', 'stadAmt'];
				page.drCrSelect = '';
				page.memberNextAssi = [];
				page.allAssiCol = [];
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});