$(function() {
	var ptData,
		oTable,

		argu //表格数据
	var page = function() {
		return {
			initSelect: function(id, str, border) {
				if(border) {
					$(id).ufTreecombox({
						valueField: "chrName",
						textField: "chrName",
						readonly: false,
						placeholder: "请选择" + str,
						data: [],
						theme: '',
					});
				} else {
					$(id).ufTreecombox({
						valueField: "CODE_NAME",
						textField: "CODE_NAME",
						readonly: false,
						placeholder: "请选择" + str,
						data: [],
						theme: 'label',
					});
				}

			},
			select: function() {
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				//单位
				ufma.get("/gl/eleAgency/getAgencyTree", arguAge, function(result) {
					//ufma.get("/gl/eleAgency/getAgencyTree", {}, function(result) {
					$("#cbAgency").ufTreecombox({
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						readonly: false,
						placeholder: "请选择单位",
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, data) {
							//切换往来类型 S
							$("#colAction .text").text("单位");
							$("#colAction").attr("data-type", "01");
							//切换往来类型 E

							//sendObj.agencyCode = data.CHR_CODE
							sendObj.agencyCode = data.code;
							//缓存单位账套
							var params = {
								selAgecncyCode: data.code,
								selAgecncyName: data.name,
							}
							ufma.setSelectedVar(params);
							$('#billfaceStartAmount').val('')
							$('#billfaceEndAmount').val('')
							//改变单位,账套选择内容改变 //修改权限  将svUserCode改为 svUserId  20181012
							ufma.get('/gl/eleCoacc/getRptAccts?agencyCode=' + sendObj.agencyCode + '&userId=' + sendObj.userId + '&setYear=' + ptData.svSetYear, {}, function(result) {
								page.cbAcct = $("#cbAcct").ufCombox({
									/*idField: 'CHR_CODE',
									textField: 'CODE_NAME',*/
									idField: 'code',
									textField: 'codeName',
									readonly: false,
									placeholder: '请选择账套',
									icon: 'icon-book',
									theme: 'label',
									data: result.data,
									onChange: function(sender, data) {
										//sendObj.acctCode = data.CHR_CODE;
										sendObj.acctCode = data.code;
										//缓存单位账套
										var params = {
											selAgecncyCode: $('#cbAgency').getObj().getValue(),
											selAgecncyName: $('#cbAgency').getObj().getText(),
											selAcctCode: data.code,
											selAcctName: data.name
										}
										ufma.setSelectedVar(params);
										var url = "/gl/sys/coaAcc/getRptAccoTree";
										var reqDatas = {
											agencyCode: $('#cbAgency').getObj().getValue(),
											acctCode: $("#cbAcct").getObj().getValue(),
											accoType: "6",
											setYear: ptData.svSetYear,
											//修改权限  将svUserCode改为 svUserId  20181012
											userId: ptData.svUserId
											// userId: ptData.svUserCode
										};

										//改变账套  选择会计科目
										ufma.get(url, reqDatas, function(result) {
											if(result.data.treeData) {
												$("#cbAcco").ufTreecombox({
													valueField: "code",
													textField: "codeName",
													readonly: false,
													placeholder: "请选择会计科目",
													leafRequire: true,
													data: result.data.treeData,
													onChange: function(sender, data) {
														//sendObj.accoCode = data.CHR_CODE
														sendObj.accoCode = data.code; //多区划
													}
												});
											} else {
												sendObj.accoCode = ''
												ufma.showTip('此账套下没有会计科目！', function() {}, 'warning');
												page.initSelect('#cbAcco', "会计科目")
											}
										});
										$('#query_table').trigger('click');
									},
									onComplete: function(sender) {
										if(ptData.svAcctCode) {
											$("#cbAcct").getObj().val(ptData.svAcctCode);
										} else {
											$('#cbAcct').getObj().val('1');
										}

									}
								});
							});

							//往来单位
							var reqData = {
								//agencyCode: data.CHR_CODE,
								agencyCode: data.code,
								setYear: ptData.svSetYear,
								rgCode: ptData.svRgCode,
								eleCode: "CURRENT"
							};
							ufma.get("/gl/elecommon/getEleCommonTree", reqData, function(result) {
								if(result.data && result.data.length != 0) {
									$("#cbCurrent").ufTreecombox({
										idField: 'code',
										textField: 'codeName',
										pIdField: 'pCode', //可选
										readonly: false,
										placeholder: '请选择往来单位',
										leafRequire: true,
										data: result.data,
										onChange: function(sender, data) {
											sendObj.currentAgency = data.code
										},
										onComplete: function(sender) {
											if(result.data.length > 0) {
												$("#cbCurrent").getObj().val(1);
											}
										}
									});
								} else {
									$("#cbCurrent").getObj().val('');
									ufma.showTip('此单位下没有往来单位！', function() {}, 'warning');
								}
							});
						},
						onComplete: function(sender) {
							//sendObj.agencyCode = result.data[1].CHR_CODE
							//bug79009
							sendObj.agencyCode = result.data[0].code;
							if(ptData.svAgencyCode) {
								$('#cbAgency').getObj().val(ptData.svAgencyCode);
							} else {
								$('#cbAgency').getObj().val('1');
							}
						}
					});
				});
			},

			//初始化table
			initGrid: function() {
				var columns = [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' + 'class="datatable-group-checkable" id="check-head"/>&nbsp;<span></span> </label>',
						className: 'tc nowrap no-print',
						width: 46,
						render: function(data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' index=" + meta.row + " value='0' /> &nbsp;<span></span> </label>";
						}
					},
					{
						title: "序号",
						width: 44,
						className: 'nowrap tc isprint',
						"render": function(data, type, rowdata, meta) {
							var index = meta.row + 1
							return "<span>" + index + "</span>";
						}

					},
					{
						title: "业务日期",
						data: "bussinessDate",
						className: 'nowrap tc isprint',
						width: 100
					},
					{
						title: "摘要",
						data: 'descpt',
						className: 'nowrap isprint'
					},
					{
						title: "凭证号",
						data: "vouNo",
						className: 'nowrap isprint'
					},
					// {
					// 	title: "往来单位",
					// 	data: "currentAgencyName",
					// 	className: 'nowrap isprint'
					// },
					{
						title: "往来方",
						data: "wlfName",
						className: 'nowrap isprint'
					},
					{
						title: "票据类型",
						data: 'billTypeName',
						className: 'nowrap isprint'
					},
					{
						title: "票据号",
						data: 'billNo',
						className: 'nowrap tr isprint'
					},
					{
						title: "会计科目",
						data: 'accoName',
						className: 'nowrap isprint'
					},
					{
						title: "应收金额",
						data: 'recAmount',
						className: 'nowrap tr isprint tdNum',
						render: $.fn.dataTable.render.number(',', '.', 2, '')
						/*render: function(data, type, rowdata, meta) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}*/
					},
					{
						title: "操作",
						width: 70,
						className: 'nowrap tc no-print',
						render: function(data, type, rowdata, meta) {
							return '<a class="btn btn-icon-only btn-sm btn-permission icon-edit f16 btn-amort" rowindex="' + meta.row + '" data-toggle="tooltip" title="编辑">' +
								'<a class="btn btn-icon-only btn-sm btn-permission  icon-trash f16 btn-rollout"  rowindex="' + meta.row + '" data-toggle="tooltip" title="删除">';
						}
					}
				];
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
								columns: [1, 2, 3, 4, 5, 6]
							},
							customize: function(win) {
								$(win.document.body).find('h1').css("text-align", "center");
								$(win.document.body).css("height", "auto");
							}
						},
						{
							extend: 'excelHtml5',
							text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
							exportOptions: {
								columns: [1, 2, 3, 4, 5, 6]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							//ufma.expXLSForDatatable($('#gridGOV'), '期初应收');
							uf.expTable({
								title: '期初应收',
								exportTable: '#gridGOV'
							});
						});

						//导出end
						$info.html('');
						$('.gridGOV-paginate').appendTo($info);
						ufma.setBarPos($(window));
						ufma.isShow(page.reslist);

					},
					"drawCallback": function() {
						ufma.setBarPos($(window));
						$('#gridGov').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});

						$('#gridGOV .btn').on('click', function() {
							page._self = $(this);
						});
						ufma.isShow(page.reslist);
						$('#gridGOV .btn-rollout').ufTooltip({
							trigger: 'click',
							content: '您确定删除当前业务吗？',
							size: 'large',
							animation: 'flipIn',
							gravity: 'south',
							confirm: true,
							theme: 'light',
							yes: '确定',
							no: '取消',
							onYes: function() {
								ufma.post('/gl/GlCbRecPayBook/delRecPayBook', {
									"bookGuids": [argu[page._self.attr('rowindex')].bookGuid]
								}, function(result) {
									if(result.flag == 'success') {
										$('#query_table').trigger('click');
										ufma.showTip('删除成功！', function() {}, 'success');
									}
								})
							},
							onNo: function() {
								console.log('no')
							}

						});
						$('#gridGOV .btn-amort').on('click', function() {
							ufma.open({
								url: 'earlyReceivableBookin.html',
								title: '期初应收登记',
								width: 590,
								height: 440,
								data: {
									sendObj: argu[page._self.attr('rowindex')],
									op: 1,
									type: $("#colAction").attr("data-type")
								},
								ondestory: function() {
									$('#query_table').trigger('click');
								}
							});

						});
					}
				});
			},
			//获取
			loadGrid: function(url, sendObj) {
				if($("#colAction").attr("data-type") == "02") {
					if(sendObj.currentAgency != "") {
						sendObj.employee = sendObj.currentAgency;
						sendObj.currentAgency = "";
					}
				} else {
					sendObj.employee = "";
				}
				ufma.post(url, sendObj, function(result) {

					oTable.fnClearTable();
					if(result.data != undefined) {
						argu = result.data.list
						oTable.fnAddData(argu, true);
					} else {
						//ufma.showTip('没有符合条件的数据！', function() {}, 'warning');
						$("#check-head").prop('checked', false)
						$("#all").prop('checked', false)
					}
				})

			},
			onEventListener: function() {
				//搜索框--根据高保真添加搜索按钮--bug75100--zsj
				ufma.searchHideShow($('#gridGov'));
				//条件查询
				$('#query_table').on('click', function() {
					//控制查询日期--zsj
					if($('#billStartDate').getObj().getValue() > $('#billEndDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					//获取业务开始时间
					sendObj.beginBussinessDate = $('#billStartDate').getObj().getValue()
					//获取业务结束时间
					sendObj.endBussinessDate = $('#billEndDate').getObj().getValue()
					if(sendObj.agencyCode) {
						if(sendObj.acctCode) {
							var minm = $('#billfaceStartAmount').val().replace(/,/g, '');
							var maxm = $('#billfaceEndAmount').val().replace(/,/g, '');
							//判断起始金额是否大于结束金额
							if(minm !== '' || minm !== null) {
								if(maxm !== '' || maxm !== null) {
									if(minm * 1 > maxm * 1) {
										ufma.showTip('起始金额大于结束金额！', function(action) {}, 'warning');
									} else {
										sendObj.beginRecAmount = $('#billfaceStartAmount').val()
										sendObj.endRecAmount = $('#billfaceEndAmount').val()
										page.loadGrid('/gl/GlCbRecPayBook/searchRecPayBooks', sendObj)
									}
								}
							}

						} else {
							ufma.showTip('请选择账套！', function() {}, 'warning');
						}
					} else {
						ufma.showTip('请选择单位！', function() {}, 'warning');
					}
					ufma.setBarPos($(window));
				});
				$('#login').on('click', function() {
					if(sendObj.agencyCode) {
						if(sendObj.acctCode) {
							ufma.open({
								url: 'earlyReceivableBookin.html',
								title: '期初应收登记',
								width: 590,
								height: 440,
								data: {
									sendObj: sendObj,
									op: 0,
									dateTime: ptData.svTransDate //bug79646--zsj
								},
								ondestory: function() {
									$('#query_table').trigger('click');
								}
							});

						} else {
							ufma.showTip('请选择账套！', function() {}, 'warning');
						}
					} else {
						ufma.showTip('请选择单位！', function() {}, 'warning');
					}
				})
				$("body").on("click", 'input#check-head', function() {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#all").prop('checked', flag)
				});
				$("#all").on("click", function() {
					var flag = $(this).prop("checked");
					$("#gridGOV_wrapper").find('input.check-all').prop('checked', flag);
					$("#check-head").prop('checked', flag)
				});

				$("body").on("click", 'input.check-all', function() {
					var num = 0;
					var arr = document.querySelectorAll('.check-all')
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++
						}
					}
					if(num == arr.length) {
						$("#all").prop('checked', true)
						$("#check-head").prop('checked', true)
					} else {
						$("#all").prop('checked', false)
						$("#check-head").prop('checked', false)
					}
				});
				$('#delete').on('click', function() {
					var arr = []
					for(var i = 0; i < $('input.check-all').length; i++) {
						if($('input.check-all')[i].checked) {
							arr.push(argu[i].bookGuid)
						}
					}
					if(arr.length == 0) {
						ufma.showTip('请选择数据！', function() {}, 'warning');
					} else {
						ufma.post('/gl/GlCbRecPayBook/delRecPayBook', {
							"bookGuids": arr
						}, function(result) {
							if(result.flag == 'success') {
								$('#query_table').trigger('click');
								ufma.showTip('删除成功！', function() {}, 'success');
							}
						})
					}

				})
				//显示/隐藏列隐藏框
				$(document).on("click", "#colAction", function(evt) {
					evt.stopPropagation();
					// $("#colList input").each(function(i) {
					//     $(this).prop("checked", page.changeCol[i].visible);
					// });

					$("div.rpt-funnelBox").hide();
					$(this).next("div.rpt-funnelBox").show();
				})
				//选择往来类型
				$("#colList").on("click", "span", function() {
					if($("#colAction .text").text() != $(this).text()) {
						$("#colAction .text").text($(this).text());
						$("#colAction").attr("data-type", $(this).attr("data-type"));
						if($(this).text() == "单位") {
							page.payerAgency();
						} else if($(this).text() == "个人") {
							page.payerEmployee();
						}
					}

					$(this).closest(".rpt-funnelBox").hide();
				})
			},
			//请求往来单位
			payerAgency: function() {
				var reqData = {
					agencyCode: $("#cbAgency").getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};

				ufma.get("/gl/elecommon/getEleCommonTree", reqData, function(result) {
					$('#cbCurrent').getObj().load(result.data);
				});
			},
			//请求个人往来（人员列表）
			payerEmployee: function() {
				var reqData = {
					agencyCode: $("#cbAgency").getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "EMPLOYEE"
				};

				ufma.get('/gl/elecommon/getEleCommonTree', reqData, function(result) {
					page.payerAgencyData = result.data;
					$('#cbCurrent').getObj().load(result.data);
					// $('#btnQuery').trigger('click');
				});
			},
			//初始化往来单位
			initCbCurrent: function() {
				$('#cbCurrent').ufTreecombox({
					idField: 'code',
					textField: 'codeName',
					pIdField: 'pCode', //可选
					readonly: false,
					placeholder: '请选择往来单位',
					leafRequire: true,
					onChange: function(sender, data) {
						sendObj.currentAgency = data.code;
					},
					onComplete: function(sender) {
						if(ptData.svAcctCode) {
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}

					}
				});
			},
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//初始化账套
				$("#cbAcct").ufCombox({
					//					idField: 'CHR_CODE',
					//					textField: 'CODE_NAME',
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label'
				});
				//初始化往来单位
				page.initCbCurrent();
				// //初始化会计科目
				page.initSelect('#cbAcco', "会计科目", true)
				$('#billStartDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});
				$('#billEndDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date()
				});

				function p(s) {
					return s < 10 ? '0' + s : s;
				}
				var myDate = new Date();
				//获取当前年
				var year = myDate.getFullYear();
				//获取当前月
				var month = myDate.getMonth();
				//获取当前日
				var date = myDate.getDate();
				$('#billStartDate').getObj().setValue(year + '-' + p(month) + "-" + p(date));
				//$('#billfaceStartAmount,#billfaceEndAmount').amtInput();
				$('#billfaceStartAmount,#billfaceEndAmount').amtInputNull();
				sendObj = {
					"accoCode": null,
					"acctCode": null,
					'accaCode': null,
					"agencyCode": null,
					"beginBussinessDate": null,
					"beginPayAmount": null,
					"beginRecAmount": null,
					"vouType": null,
					"vouNo": null,
					"billType": null,
					"bookType": 1,
					"currentAgency": "",
					"endBussinessDate": null,
					"endRePayAmount": null,
					"endRecAmount": null,
					"rgCode": ptData.svRgCode,
					"setYear": ptData.svSetYear,
					"userId": ptData.svUserId
				}
			},
			//此方法必须保留
			init: function() {
				ptData = ufma.getCommonData();
				page.select();
				page.initGrid();
				page.onEventListener();
				page.initPage();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	/////////////////////
	page.init();
});