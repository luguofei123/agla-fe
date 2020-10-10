$(function () {
	var interfaceURL = {
		getEleDetail: "/ma/sys/element/getEleDetail", //获取编码规则控制方式等
	};
	var page = function () {
		var agencyCtrlLevel;
		var agencyCode;
		var agencyName;
		var rgCode;
		var setYear;
		var dataT = [];
		var acctAlldata;
		return {
			eleCode: "CURRENCY",
			tableParam: "MA_ELE_CURRENCY",
			openEditHtm: function (data) {
				if (data) {
					data["action"] = "edit";
					data["agencyCode"] = page.agencyCode;
					data["acctCode"] = page.acctCode;
					data["agencyCtrlLevel"] = page.agencyCtrlLevel;
					data["rgCode"] = page.rgCode;
					data["setYear"] = page.setYear;
					data["fjfa"] = ma.fjfa;
					ufma.open({
						url: 'currencyRateEdit.html',
						title: '设置币种汇率',
						width: 1100,
						height: 550,
						data: data,
						ondestory: function (data) {
							page.initCurr(page.agencyCode);
							page.initCurrencyRate("", page.agencyCode);
						}
					});
				} else {
					var param = {};
					param["action"] = "add";
					param["agencyCode"] = page.agencyCode;
					param["acctCode"] = page.acctCode;
					param["agencyCtrlLevel"] = page.agencyCtrlLevel;
					param["rgCode"] = page.rgCode;
					param["setYear"] = page.setYear;
					param["fjfa"] = ma.fjfa;
					ufma.open({
						url: 'currencyRateEdit.html',
						title: '设置币种汇率',
						width: 1100,
						height: 550,
						data: param,
						ondestory: function (data) {
							//                            if (data.action == 'saveSuccess') {
							page.initCurr(page.agencyCode);
							page.initCurrencyRate("", page.agencyCode);
							//                            }
						}
					});
				}
			},

			getDWUsedInfo: function (data, columnsArr) {
				page.usedDataTable = $('#dw-used').DataTable({
					"data": data,
					"columns": columnsArr,
					"bPaginate": false, //翻页功能
					"bLengthChange": false, //改变每页显示数据数量
					"bFilter": false, //过滤功能
					"bSort": false, //排序功能
					"bInfo": false, //页脚信息
					"bAutoWidth": false //自动宽度
				});
			},

			deleteCurRate: function (chrCode) {
				var argu = {
					chrCodes: [chrCode],
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					rgCode: page.rgCode,
					setYear: page.setYear
				};
				var url = '/ma/sys/eleCurrRate/delete';
				var callback = function (result) {
					if (result.flag == 'success') {
						ufma.showTip('删除成功！', function () {
							page.initCurrencyRate("", page.agencyCode);
							page.initCurr(page.agencyCode);
						}, "success");
					}
				};
				ufma.delete(url, argu, callback);
			},

			initCurr: function (coCode) {
				$(".group-checkable").prop("checked", false);
				if (page.chooseAcctFlag == true) {
					ufma.showTip('请选择账套', function () { }, 'warning');
					return false;
				} else {
					var url = "/ma/sys/eleCurrRate/getCurrType";
					var argu = {
						agencyCode: coCode,
						acctCode: page.acctCode,
						rgCode: page.rgCode,
						setYear: page.setYear
					}
					var htm = '';
					var callback = function (result) {
						if (result) {
							htm += '<a name="enabled" value="" class="label label-radio selected">全部</a>';
							$.each(result.data, function (index, row) {
								htm += ufma.htmFormat('<a name="enabled" value="<%=currencyCode%>" class="label label-radio"><%=currencyName%></a>', {
									'currencyCode': row.currencyCode,
									'currencyName': row.currencyName
								});
							});
						}
						$('#query-rate .form-group .control-element').html(htm);

						page.reslist = ufma.getPermission();
						ufma.isShow(page.reslist);

					};
					ufma.get(url, argu, callback);
				}

			},

			initCurrencyRate: function (currencyCode, coCode) {
				$(".group-checkable").prop("checked", false);
				if (page.chooseAcctFlag == true) {
					ufma.showTip('请选择账套', function () { }, 'warning');
					return false;
				} else {
					page.tableHtm = "";
					var argu = {};
					if (currencyCode) {
						argu["currencyCode"] = currencyCode;
					}
					argu["agencyCode"] = coCode;
					argu.acctCode = page.acctCode;
					argu.rgCode = page.rgCode;
					argu.setYear = page.setYear;
					var callback = function (result) {
						if (result) {
							$.each(result.data, function (index, tableData) {
								page.drawRateTable(tableData, index);
							});
						}
						$('#rateTab').html(page.tableHtm);
						$("[data-toggle='tooltip']:not(.btn-delete)").tooltip();
						var contentH = $('.container-fluid').height();
						var tableH = $('#rateTab').height() + $('.tab-head').height();
						var topH = $('.workspace-top').height();
						if (contentH > tableH) {
							var scorllH = topH + tableH + 60;
							$('#currencyRate-tool-bar').css({
								"top": scorllH + 'px',
								"position": "absolute"
							});
						} else {
							var scorllH = topH + contentH + 60;
							$('#currencyRate-tool-bar').css({
								"top": scorllH + 'px',
								"position": "absolute"
							});
						}
						page.reslist = ufma.getPermission();
						ufma.isShow(page.reslist);
						//删除
						$('#rateTab .btn-delete').on("click", function () {
							if (page.chooseAcctFlag == true) {
								ufma.showTip('请选择账套', function () { }, 'warning');
								return false;
							} else {
								page.self = $(this);
								$('#rateTab .btn-delete').ufTooltip({
									content: '您确定删除当前币种吗？',
									onYes: function () {
										var tableData = page.self.closest('tr').data("elecurrency");
										tableData = eval('(' + tableData + ')');
										page.deleteCurRate(tableData.eleCurrency.chrCode);
									},
									onNo: function () { }
								})
							}
						});

					};
					ufma.get("/ma/sys/eleCurrRate/getCurrRate", argu, callback);
				}

			},

			//绘制表格
			drawRateTable: function (tableData, index) {
				if (tableData) {
					page.tableHtm += "<div class='curRate-div'><table class='curRate-tab bordered'>";
					page.drawRateTableThead(tableData.eleCurrency, tableData, index);
					//第一个表格展开，其余表格隐藏
					//                    if (index == 0) {
					//                        page.tableHtm += '<tbody>';
					//                    } else {
					//                        page.tableHtm += '<tbody  style="display:none;">';
					//                    }
					$.each(tableData.eleRates, function (index, tbodydata) {
						page.drawRateTableTbody(tbodydata);
					});
					page.tableHtm += "</tbody></table></div>";
				}
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
			},

			//绘制表头
			drawRateTableThead: function (theaddata, tableData, index) {
				//tableData.eleRates.push(tableData.eleCurrency)
				if (tableData.eleRates.length > 0) {
					dataT.push(tableData.eleRates[0]);
				}
				var tabData = JSON.stringify(tableData);

				tabData = tabData.replace(/\"/g, "'");
				if (theaddata) {
					//console.info(JSON.stringify(theaddata));
					var eleRatesArr = tableData.eleRates
					var ratesArr = [];
					for (var i = 0; i < eleRatesArr.length; i++) {
						ratesArr.push(eleRatesArr[i].chrCode);
					}
					var ratesStr = ratesArr.join(",");
					page.tableHtm += ufma.htmFormat('<thead>' +
						' <tr data-eleCurrency="<%=eleCurrency%>">' +
						' <th style="width:10px;">' +
						' <input type="checkbox" class="checkboxes" value="' + theaddata.chrId + '"  data-code="' + theaddata.chrCode + '" data-rates="' + ratesStr + '"/>' +
						//                        '	<label class="mt-checkbox mt-checkbox-outline margin-right-8">'+
						//                        '		<input class="" type="checkbox" class="checkboxes" value="'+theaddata.chrId+'" >&nbsp;'+
						//                        '		<span></span>'+
						//                        '	</label>'+
						'</th>' +
						' <th colspan="4"><%=chrName%></th>' +
						' <th>' +
						'    <div style="float:right;">' +
						'       <span style="margin-right:15px;">', {
							'chrName': theaddata.chrName,
							'eleCurrency': tabData
						});
					// if (page.agencyCode == "*") {
					//     page.tableHtm += '<i class="icon-add btn-senddown btn-permission" style="margin-right: 7px;cursor: pointer;" data-toggle="tooltip" title="加入下发"></i>';
					// }
					page.tableHtm += '<i class="icon-setting btn-edit btn-permission" style="margin-right: 7px;cursor: pointer;" data-toggle="tooltip" title="修改"></i>' +
						'<i class="icon-trash btn-delete btn-permission" style="margin-right: 7px;cursor: pointer;" data-toggle="tooltip" title="删除"></i>' +
						' </span> <span class="groupBtn">';
					if (index == 0) {
						page.tableHtm += '<i class="icon-angle-top" style="cursor: pointer;"></i>';
					} else {
						page.tableHtm += ' <i class="icon-angle-top" style="cursor: pointer;"></i>';
					}
					page.tableHtm +=
						'   </span>' +
						'   </div>' +
						'   </th>' +
						'   </tr>' +
						'</thead>';
				}
			},

			//绘制表格行
			drawRateTableTbody: function (tbodydata) {
				if (tbodydata) {
					page.tableHtm += ufma.htmFormat('<tr>' +
						'<td style="width:30px;"></td>' +
						'<td class="curName"><%=chrName%></td>' +
						'<td><%=curDate%></td>' +
						'<td><%=direRate%></td>' +
						'<td><%=inDireRate%></td>' +
						'<td></td>' +
						'</tr>', {
							'chrName': tbodydata.chrName,
							'curDate': tbodydata.curDate,
							'direRate': tbodydata.direRate,
							'inDireRate': tbodydata.inDireRate
						});
				}
			},

			//获取表格多选框数据
			getCheckedRows: function () {
				var checkedArray = [];
				$('#rateTab .checkboxes:checked').each(function () {

					checkedArray.push($(this).attr('data-code'));
				});
				return checkedArray;
			},

			getCheckedRowsCodes: function () {
				var checkedArrayCodes = [];
				$('#rateTab .checkboxes:checked').each(function () {
					checkedArrayCodes.push('' + $(this).data("code") + '');
				});
				return checkedArrayCodes;
			},

			getCheckedCodesRates: function () {
				var checkedArrayRates = [];
				$('#rateTab .checkboxes:checked').each(function () {
					// var obj = {};
					// obj.chrCode = $(this).data("code");
					// var rates = $(this).data("rates").toString();
					// var ratesArr = [];
					// if(rates.length > 1) {
					// 	ratesArr = rates.split(",");
					// } else if(rates.length == 1) {
					// 	ratesArr.push(rates);
					// } else {
					// 	ratesArr = [];
					// }
					// obj.rateCodes = ratesArr;
					checkedArrayRates.push($(this).data("code"));
				});
				return checkedArrayRates;
			},

			//初始化加载引用单位信息
			reqInitRightIssueAgy: function () {
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': page.agencyCode,
					"chrCodes": [],
					'eleCode': page.eleCode
				}
				ufma.post("/ma/sys/common/countAgencyUse", argu, function (result) {
					var data = result.data;
					var columnsArr = [{
						data: "agencyCode",
						title: "单位ID",
						visible: false
					},
					{
						data: "agencyName",
						title: "单位"
					},
					{
						data: "issuedCount",
						title: "已用"
					}
					];

					var isRight = true;
					if (data != null && data != "null") {
						if (data.length > 0) {
							for (var i = 0; i < data.length; i++) {
								//console.info(JSON.stringify(data[i]));
								if (!data[i].hasOwnProperty("agencyCode")) {
									ufma.alert("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
								if (!data[i].hasOwnProperty("agencyName")) {
									ufma.alert("第" + i + "条数据的agencyName(" + data[i].agencyName + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
								if (!data[i].hasOwnProperty("issuedCount")) {
									ufma.alert("第" + i + "条数据的issuedCount(" + data[i].issuedCount + ")字段不存在！", "error");
									isRight = false;
									return false;
								}
							}
						}
					} else {
						ufma.alert(data + ":格式不正确！", "error");
						isRight = false;
						return false;
					}

					if (isRight) {
						page.getDWUsedInfo(data, columnsArr);
					} else {
						ufma.alert("后台数据格式不正确！", "error");
						return false;
					}
				})
			},
			getCoaAccList: function (pageNum, pageLen) {
				//全部即acceCode为空
				page.acceCode = $('#tabAcce').find("li.active a").attr("value");
				page.acceName = $('#tabAcce').find("li.active a").text();
				var argu = $('#query-tj').serializeObject();
				//判断是否是通过链接打开
				if (page.fromChrCode != null && page.fromChrCode != "") {
					argu.accsCode = page.fromChrCode;
					//第一次加载时使用传送过来的code，以后根据查询条件
					page.fromChrCode = "";
				}
				var argu1 = {}
				argu1["agencyCode"] = page.agencyCode;
				argu1["acctCode"] = page.acctCode;
				argu1["acceCode"] = page.acceCode;
				argu1['accsCode'] = page.accsCode;
				if (page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				argu1["rgCode"] = ma.rgCode;
				argu1['setYear'] = ma.setYear;
				ufma.get("/ma/sys/coaAccSys/queryAccoTable", argu1, function (result) {
					//page.renderTable(result, pageNum, pageLen);
				});
			},
			issueTips: function (data, isCallBack) {
				var title = "";
				if (isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = '币种汇率';
				data.pageType = 'CURRENCY';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function (data) {
						//窗口关闭时回传的值;
						if (isCallBack) {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					}
				});
			},
			onEventListener: function () {
				//选用页面表格行操作绑定
				ufma.searchHideShow($('#expfunc-choose-datatable'));
				$('#expfunc-choose-datatable').on('click', 'tbody td', function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.data("code").toString();
					if ($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							console.info(thisCode);
							if (thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						})
					} else {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
							console.info(thisCode);
							if (thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						})
					}
				});

				$(document).on('click', '.label-radio', function (e) {
					e = e || window.event;
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var currencyCode = $(this).attr('value');
						ufma.deferred(function () {
							page.initCurrencyRate(currencyCode, page.agencyCode);
						});
					}
				});

				//新增
				$('.btn-add').on('click', function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						page.openEditHtm();
					}
				});

				//下发
				/*操作列已被注释，故此方法应该没有用了--zsj		
				 * $('#rateTab').on('click', 'i.btn-senddown', function(e) {
									e.stopPropagation();
									var tableData = $(this).closest('tr').data("elecurrency");
									tableData = eval('(' + tableData + ')');
									var gnflData = tableData.eleCurrency.chrCode;
									var eleRatesArr = tableData.eleRates
									var ratesArr = [];
									for(var i = 0; i < eleRatesArr.length; i++) {
										ratesArr.push(eleRatesArr[i].chrCode);
									}
									var paramData = [{
										chrCode: gnflData,
										rateCodes: ratesArr
									}];
									page.modal = ufma.selectBaseTree({
										url: '/ma/sys/eleAgency/getAgencyTree?rgCode=' + page.rgCode + '&setYear=' + page.setYear,
										rootName: '所有单位',
										title: '选择下发单位',
										bSearch: true,
										filter: { //其它过滤条件
											'单位类型': { //标签
												ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
												formControl: 'combox', //表单元素
												data: {
													rgCode: page.rgCode,
													setYear: page.setYear
												},
												idField: 'ENU_CODE',
												textField: 'ENU_NAME',
												filterField: 'agencyType',
											}
										},
										buttons: {
											'确认下发': {
												class: 'btn-primary',
												action: function(data) {
													if(data.length == 0) {
														ufma.alert('请选择单位！', "warning");
														return false;
													}
													var dwCode = [];
													for(var i = 0; i < data.length; i++) {
														dwCode.push({
															"toAgencyCode": data[i].id
														});
													}

													var url = '/ma/sys/eleCurrRate/issue';
													var argu = {
														'chrCodes': paramData,
														'toAgencyAcctList': dwCode,
														"rgCode": page.rgCode,
														"setYear": page.setYear,
														"agencyCode": page.agencyCode
													};
													var callback = function(result) {
														if(result.flag == "success") {
															ufma.showTip("下发成功！", function() {}, "success");
															page.modal.close();

														} else {
															ufma.alert("下发失败！", "error");
															return false;
														}
													};
													ufma.post(url, argu, callback);
												}
											},
											'取消': {
												class: 'btn-default',
												action: function() {
													page.modal.close();
												}
											}
										}
									});
								});*/

				//编辑
				$('#rateTab').on('click', '.btn-edit', function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var tableData = $(this).closest('tr').data("elecurrency");
						tableData = eval('(' + tableData + ')');
						page.openEditHtm(tableData);
					}
				});

				//折叠
				$('#rateTab').on('click', '.icon-angle-top', function () {
					$(this).closest('table').find('tbody').hide();
					$(this).removeClass('icon-angle-top');
					$(this).addClass('icon-angle-bottom');
					var rateTabHeight = $(this).parent().parent().closest('th').parent().parent().siblings().height();
					var rateTheadHeight = $(this).parent().parent().closest('th').parent().parent().height();
					var topH = $('.workspace-top').height();
					var contentH = $('.workspace-center').height();
					var tableH = $('#rateTab').height() + $('.tab-head').height();
					if (contentH > tableH) {
						var scorllH = tableH - rateTabHeight + rateTheadHeight + topH + 72;
						$('#currencyRate-tool-bar').css({
							"top": scorllH + 'px',
							"position": "absolute"
						});
					} else {
						var scorllH = contentH - rateTabHeight + rateTheadHeight + topH + 72;
						$('#currencyRate-tool-bar').css({
							"top": scorllH + 'px',
							"position": "absolute"
						});
					}
				});

				//展开
				$('#rateTab').on('click', '.icon-angle-bottom', function () {
					$(this).closest('table').find('tbody').show();
					$(this).removeClass('icon-angle-bottom');
					$(this).addClass('icon-angle-top');
					var rateTabHeight = $(this).parent().parent().closest('th').parent().parent().siblings().height();
					var rateTheadHeight = $(this).parent().parent().closest('th').parent().parent().height();
					var topH = $('.workspace-top').height();
					var contentH = $('.workspace-center').height();
					var tableH = $('#rateTab').height() + $('.tab-head').height();
					if (contentH > tableH) {
						var scorllH = tableH + rateTabHeight + topH + rateTheadHeight - 97 + 80;
						$('#currencyRate-tool-bar').css({
							"top": scorllH + 'px',
							"position": "absolute"
						});
					} else {
						var scorllH = contentH + rateTabHeight + topH + rateTheadHeight - 97;
						$('#currencyRate-tool-bar').css({
							"top": scorllH + 'px',
							"position": "absolute"
						});
					}
				});

				$(window).scroll(function () {
					var scltop = $(window).scrollTop() + $("body").height() - 30
					$("#currencyRate-tool-bar").css({
						"position": "absolute",
						"top": scltop + "px"
					});
				});
				//全选
				$(".group-checkable").on('change', function () {
					var t = $(this).is(":checked");
					$('#rateTab .checkboxes').each(function () {
						t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
						t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
					});
					$(".group-checkable").prop("checked", t);
				});

				//获取选中数据的引用单位
				if (!$('body').data("code")) {
					$("#currencyRate").on("change", "input[type='checkbox']", function () {
						var chrCodes = [];
						chrCodes = page.getCheckedRowsCodes();
						console.info(JSON.stringify(chrCodes));
						if (chrCodes.length > 0) {
							var argu = {
								"rgCode": ma.rgCode,
								"setYear": ma.setYear,
								'agencyCode': page.agencyCode,
								"chrCodes": chrCodes,
								'eleCode': page.eleCode
							}
							ufma.post("/ma/sys/common/countAgencyUse", argu, function (result) {
								var data = result.data;
								var columnsArr = [{
									data: "issuedCount",
									title: "编码",
									visible: false
								},
								{
									data: "agencyCode",
									title: "单位代码"
								},
								{
									data: "agencyName",
									title: "单位名称"
								}
								];

								var isRight = true;
								if (data != null && data != "null") {
									if (data.length > 0) {
										for (var i = 0; i < data.length; i++) {
											if (!data[i].hasOwnProperty("agencyCode")) {
												console.info("第" + i + "条数据的agencyCode(" + data[i].agencyCode + ")字段不存在！");
												isRight = false;
												return false;
											}
											if (!data[i].hasOwnProperty("agencyName")) {
												console.info("第" + i + "条数据的agencyName(" + data[i].agencyName + ")字段不存在！");
												isRight = false;
												return false;
											}
										}
									}
								} else {
									console.info(data + ":格式不正确！");
									isRight = false;
									return false;
								}

								if (isRight) {
									page.usedDataTable.clear().destroy();
									page.getDWUsedInfo(data, columnsArr);
								} else {
									ufma.alert("后台数据格式不正确！", "error");
									return false;
								}

							});
						} else {
							//购物车表格初始化
							page.usedDataTable.clear().destroy();
							page.reqInitRightIssueAgy();
						}
					});
				}
				//批量删除
				$('.btn-del').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择币种！', "warning");
							return false;
						}
						$("div.uf-tooltip").each(function () {
							$(this).hide();
						})
						var argu = {
							chrCodes: checkedRow,
							agencyCode: page.agencyCode,
							acctCode: page.acctCode,
							rgCode: page.rgCode,
							setYear: page.setYear
						};
						var url = '/ma/sys/eleCurrRate/delete';
						var callback = function (result) {
							if (result.flag == 'success') {
								ufma.showTip('删除成功！', function () {
									page.initCurrencyRate("", page.agencyCode);
									page.initCurr(page.agencyCode);
								}, "success");
							}
						};
						ufma.confirm('您确定删除选中的币种吗？', function (action) {
							if (action) {
								ufma.delete(url, argu, callback);
							}
						}, {
								type: 'warning'
							});
					}

				});
				/*bug78798--zsj--经尹哥确认将打印和导出都隐藏起来		
				 * $('.btn-print').click(function() {
					if(dataT.length == 0) {
						ufma.showTip('汇率币种为空，无可打印内容！', function() {}, 'warning');
						return false;
					}
					var cloums = [
						[{
								field: 'chrName',
								name: '币种/目标币种',
							},
							{
								field: 'curDate',
								name: '月份'
							},
							{
								field: 'direRate',
								name: '直接汇率'
							},
							{
								field: 'inDireRate',
								name: '间接汇率'
							}
						]
					];
					$('.uf-fix').addClass('no-print');
					uf.tablePrint({
						mode: "rowHeight",
						pageHeight: 924,
						title: '币种汇率',
						topLeft: $('.org').text(),
						topCenter: '',
						topRight: '记录总数：' + dataT.length,
						bottomLeft: '',
						bottomCenter: '',
						bottomRight: '<span class="page-num"></span>',
						data: dataT,
						columns: cloums

					});

				});
				$('.btn-export').click(function() {
					if(dataT.length == 0) {
						ufma.showTip('汇率币种为空，无可导出内容！', function() {}, 'warning');
						return false;
					}
					var cloums = [
						[{
								field: 'chrName',
								name: '币种/目标币种',
							},
							{
								field: 'curDate',
								name: '月份'
							},
							{
								field: 'direRate',
								name: '直接汇率'
							},
							{
								field: 'inDireRate',
								name: '间接汇率'
							}
						]
					];
					uf.expTable({
						title: '币种汇率',
						data: dataT,
						columns: cloums
					});

				});*/
				//批量下发
				$('#currencyRateBtnDown').on('click', function (e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRowsCodes();
					var paramData = page.getCheckedCodesRates();
					if (gnflData.length == 0) {
						ufma.alert('请选择币种！', "warning");
						return false;
					}
					var url = '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + page.rgCode + '&setYear=' + page.setYear + '&eleCode=CURRENCY' + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode;
					page.modal = ufma.selectBaseTree({
						url: url,
						rootName: '所有单位',
						title: '选择下发单位',
						bSearch: true,
						checkAll: true, //是否有全选
						filter: { //其它过滤条件
							'单位类型': { //标签
								ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
								formControl: 'combox', //表单元素
								data: {
									rgCode: page.rgCode,
									setYear: page.setYear
								},
								idField: 'ENU_CODE',
								textField: 'ENU_NAME',
								filterField: 'agencyType',
							}
						},
						buttons: {
							'确认下发': {
								class: 'btn-primary',
								action: function (data) {
									if (data.length == 0) {
										ufma.alert('请选择单位！', "warning");
										return false;
									}
									//bugCWYXM-4851--修改下发问题--zsj
									acctAlldata = data;
									/*var dwCode = [];
									for(var i = 0; i < data.length; i++) {
										dwCode.push({
											"toAgencyCode": data[i].id
										});
									}*/
									var isAcctTruedata = [];
									var isAcctFalsedata = [];
									var isAcctLeafdata = [];
									var dwCode = [];
									if (acctAlldata) {
										if (acctAlldata.length > 0) {
											for (var i = 0; i < acctAlldata.length; i++) {
												//if(acctAlldata[i].isAcct == true && acctAlldata[i].agencyCode != '' && acctAlldata[i].isLeaf == '1') {
												//单位账套：校验条件--isAcct = true && isFinal =1;传参：toAgencyCode：传选中的单位，toAcctCode:传选中的账套--zsj
												if (acctAlldata[i].isAcct == true && acctAlldata[i].isFinal == '1') {
													chooseAcct = acctAlldata[i].code;
													chooseAgency = acctAlldata[i].agencyCode;
													isAcctTruedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
											for (var i = 0; i < acctAlldata.length; i++) {
												//单位：校验条件--isAcct = false && isFinal =1；传参：toAgencyCode：传选中的单位，toAcctCode:"*"--zsj
												if (acctAlldata[i].isAcct == false && acctAlldata[i].isFinal == '1') {
													chooseAgency = acctAlldata[i].code;
													chooseAcct = '*';
													isAcctFalsedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
										}
									}
									dwCode = isAcctTruedata.concat(isAcctFalsedata);
									var url = '/ma/sys/eleCurrRate/issue';
									var argu = {
										'chrCodes': paramData,
										'toAgencyAcctList': dwCode,
										"rgCode": page.rgCode,
										"setYear": page.setYear,
										"agencyCode": page.agencyCode
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function (result) {
										ufma.hideloading();
										//经海哥确认将所有信息显示在表格中--zsj
										page.modal.close();
										page.issueTips(result);
										/*if(result.flag == "success") {
											ufma.showTip("下发成功！", function() {}, "success");
											page.modal.close();
											page.issueTips(result);
										} else {
											ufma.alert("下发失败！", "error");
											return false;
										}*/
									};
									ufma.post(url, argu, callback);
								}
							},
							'取消': {
								class: 'btn-default',
								action: function () {
									page.modal.close();
								}
							}
						}
					});
				});

				//"单位级页面监听------------"
				$('.btn-choose').on('click', function (e) {
					e.preventDefault();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						/*page.getExpFuncChoose();
						page.openChooseWin();*/
						//由于原始将选用界面问题太多，且维护不便，故统一为公共界面--zsj
						ufma.open({
							url: '../maCommon/comChooseIssue.html',
							title: '选用',
							width: 1000,
							height: 500,
							data: {
								getUrl: '/ma/sys/common/getCanIssueEleTree',
								useUrl: "/ma/sys/eleCurrRate/issue",
								pageName: '币种汇率',
								rgCode: ma.rgCode,
								setYear: ma.setYear,
								agencyCode: page.agencyCode,
								acctCode: page.acctCode,
								eleCode: "CURRENCY",
								bgttypeCode: ""
							},
							ondestory: function (result) {
								if (result.action) {
									page.initCurrencyRate("", page.agencyCode);
									page.initCurr(page.agencyCode);
									page.issueTips(result, true);
								}
							}
						});
					}
				});
				//选用
				$('.btn-agyChoose').on('click', function (e) {
					var checkRow = page.getChooseCheckedRows();
					var toAgencyAcctList = [];
					toAgencyAcctList.push({
						toAgencyCode: page.agencyCode,
						toAcctCode: page.acctCode
					});
					if (checkRow.length > 0) {
						var argu = {
							chrCodes: checkRow,
							//toAgencyCodes: [page.agencyCode],
							toAgencyAcctList: toAgencyAcctList,
							agencyCode: page.issueAgecyCode,
							rgCode: page.rgCode,
							setYear: page.setYear
						}
						var url = "/ma/sys/eleCurrRate/issue";
						var callback = function (result) {
							if (result) {
								//ufma.showTip("选用成功", function() {}, "success");
								page.choosePage.close();
								$(".u-overlay,#ufma_expfunc-choose_top,.u-msg-close").hide();
								page.initCurrencyRate("", page.agencyCode);
								page.initCurr(page.agencyCode);
								page.issueTips(result, true);
							}

						};
						ufma.post(url, argu, callback);
					} else {
						ufma.alert("请选择要选用的数据！", "warning");
						return false;
					}

				});

				$('.btn-agyClose').on('click', function (e) {
					e.preventDefault();
					//page.choosePage.close();
					page.modal.close();
				});
				$(window).scroll(function () {
					var scltop = $(window).scrollTop() + $("body").height() - 40
					$("#expfunc-tool-bar").css({
						"position": "absolute",
						"top": scltop + "px"
					})
					var heitab = $("#expfunc-choose-content .tab-content").height() + 10
					var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
					if (scltop <= heitab) {
						$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
					} else {
						$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
					}

				});
			},

			initAgyPage: function (agencyCode) {
				this.initCurr(agencyCode);
				this.initCurrencyRate("", agencyCode);

			},

			initSysPage: function (sysCode) {
				this.initCurr(sysCode);
				this.initCurrencyRate("", sysCode);
				page.reqInitRightIssueAgy();
			},

			//选用页面初始化
			getExpFuncChoose: function () {
				/*var url = "/ma/sys/eleCurrRate/getCurrRate";
				var argu = {};
				argu["agencyCode"] = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.rgCode = page.rgCode;
				argu.setYear = page.setYear;*/
				var url = "/ma/sys/common/getCanIssueEleTree";
				var argu = {
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: "CURRENCY",
					bgttypeCode: ""
				};
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function (result) {
					var data = result.data;
					if (result.data.length > 0) {
						page.issueAgecyCode = result.data[0].agencyCode;
					}
					var newData = [];
					/*for(var i = 0; i < data.length; i++) {
						var dataObj = {};
						dataObj.chrId = data[i].eleCurrency.chrId;
						dataObj.chrCode = data[i].eleCurrency.chrCode;
						dataObj.chrName = data[i].eleCurrency.chrName;
						dataObj.curSign = data[i].eleCurrency.curSign;

						var rateArr = [];
						for(var j = 0; j < data[i].eleRates.length; j++) {
							var rate = data[i].eleRates[j].chrCode;
							rateArr.push(rate);
						}
						var rateArrStr = rateArr.join(",");
						dataObj.rateCodes = rateArrStr;
						newData.push(dataObj);
					}*/
					var id = "expfunc-choose-datatable";
					var toolBar = $('#' + id).attr('tool-bar');
					$('#' + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						//	"data": newData,
						"data": result.data,
						"bFilter": true, //去掉搜索框
						"bLengthChange": true, //去掉每页显示多少条数据
						"processing": true, //显示正在加载中
						"pagingType": "full_numbers", //分页样式
						"lengthChange": true, //是否允许用户自定义显示数量p
						"lengthMenu": [
							[20, 50, 100, 200, -1],
							[20, 50, 100, 200, "全部"]
						],
						"pageLength": ufma.dtPageLength("#" + id),
						"bInfo": true, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度，和swidth一起用
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
								'class="datatable-choose-checkall"/> &nbsp; <span></span> </label>',
							data: "code"
						},
						{
							title: "功能分类编码",
							data: "code"
						},
						{
							title: "功能分类名称",
							data: "name"
						},
						{
							title: "状态",
							data: "enabledName"
						}
						],
						"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "checktd",
							"render": function (data, type, rowdata, meta) {
								return '<div class="checkdiv">' +
									'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									//'<input type="checkbox" class="checkboxes" value="' + data + '" data-code="' + rowdata.chrCode + '" data-rates="' + rowdata.rateCodes + '" />&nbsp;' +
									'<input type="checkbox" class="checkboxes" data-code="' + rowdata.code + '"/>&nbsp;' +
									'<span></span> </label>';
							}
						},
						{
							"targets": [3],
							"render": function (data, type, rowdata, meta) {
								if (rowdata.enabled == 1) {
									return '<span style="color:#00A854">' + data + '</span>';
								} else {
									return '<span style="color:#F04134">' + data + '</span>';
								}
							}
						}
						],
						"dom": 'rt<"' + id + '-paginate"ilp>',
						"initComplete": function (settings, json) {

							var $info = $(toolBar + ' .info');
							if ($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('.' + id + '-paginate').appendTo($info);
							ufma.setBarPos($(window));
							var heitab = $("#expfunc-choose .tab-content").height();
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							var searchHeight = $('#expfunc-choose .table-sub').height();
							var scorllTop = heitab - searchHeight;
							var scltop = $('#expfunc-choose-datatable').height();
							if (scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", scorllTop + 'px').css("position", 'absolute')
							}
						},
						"drawCallback": function (settings) {
							$(".datatable-choose-checkall").prop("checked", false);
							$(".datatable-choose-checkall").on('change', function () {
								var t = $(this).is(":checked");
								$('#' + id + ' .checkboxes').each(function () {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-choose-checkall").prop("checked", t);
							});
							var heitab = $("#expfunc-choose .tab-content").height();
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							var searchHeight = $('#expfunc-choose .table-sub').height();
							var scorllTop = heitab - searchHeight;
							var scltop = $('#expfunc-choose-datatable').height();
							if (scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", scorllTop + 'px').css("position", 'absolute')
							}
							page.reslist = ufma.getPermission();
							ufma.isShow(page.reslist);
							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						}
					});
					ufma.hideloading();
				};
				ufma.get(url, argu, callback);
			},
			//选用模态框
			openChooseWin: function () {
				page.choosePage = ufma.showModal('expfunc-choose', 1000, 500);
			},
			/*			getChooseCheckedRows: function() {
							var checkedArrayRates = [];
							$('#expfunc-choose-datatable .checkboxes:checked').each(function() {
								var obj = {};
								obj.chrCode = $(this).data("code");
								var rates = $(this).data("rates").toString();
								var ratesArr = [];
								if(rates.length > 1) {
									ratesArr = rates.split(",");
								} else if(rates.length == 1) {
									ratesArr.push(rates);
								} else {
									ratesArr = [];
								}
								obj.rateCodes = ratesArr;
								checkedArrayRates.push(obj);
							});
							return checkedArrayRates;

						},*/
			getChooseCheckedRows: function () {
				var checkedArray = [];
				$('#expfunc-choose-datatable .checkboxes:checked').each(function () {
					var chrCode = $(this).attr('data-code');
					checkedArray.push(chrCode);
				});
				return checkedArray;
			},
			initfifaCallBack: function (data, ctrlName) {

			},
			getEleDetail: function () {
				var argu = {
					eleCode: 'CURRENCY',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifa(interfaceURL.getEleDetail, argu, function (data, ctrlName) {
					// page.ts = ma.ruleData.codeRule;
					//本级控制下发按钮显示/隐藏
					page.agencyCtrlLevel = data.agencyCtrllevel;
					var isAcctLevel = data.isAcctLevel;
					if ($('body').data("code")) {
						if (isAcctLevel == '1' && page.acctFlag == true) {
							$("#cbAcct").show();
							ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
								"setYear": page.setYear,
								"rgCode": page.rgCode
							}, function (result) {
								var acctData = result.data;
								if (acctData.length > 0) {
									page.chooseAcctFlag = false;
									/*	page.cbAcct = $("#cbAcct").ufmaTreecombox2({
											data: acctData,
										});*/
								} else {
									page.acctCode = '';
									page.acctName = '';
									page.accsCode = '';
									page.accsName = '';
									page.chooseAcctFlag = true;
								}
								page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									valueField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									data: acctData,
									icon: 'icon-book',
									onchange: function (data) {
										page.acctCode = data.code;
										page.acctName = data.name;
										page.accsCode = data.accsCode;
										page.accsName = data.accsName;
										page.initAgyPage(page.agencyCode);
										//缓存单位账套
										var params = {
											selAgecncyCode: page.agencyCode,
											selAgecncyName: page.agencyName,
											selAcctCode: page.acctCode,
											selAcctName: page.acctName
										}
										ufma.setSelectedVar(params);
									},
									initComplete: function (sender) {
										if (!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
											page.cbAcct.val(page.acctCode, page.acctName);
										} else if (acctData.length > 0) {
											page.cbAcct.select(1);
										} else {
											page.cbAcct.val('');
											page.accsCode = '';
											page.acctCode = '';
											page.chooseAcctFlag = true;
											page.initAgyPage(page.agencyCode);
										}
									}
								});
							});
							//page.initAcctScc();

						} else {
							$("#cbAcct").hide();
							page.acctCode = '*';
							page.initAgyPage(page.agencyCode);
						}
					}
					if ($('body').data("code") && page.isLeaf != 0) {
						//单位为末级单位时不显示下发按钮
						$(".btn-senddown").hide();
					} else {
						//非末级单位需根据控制规则显示/隐藏按钮
						//guohx 20200217 与雪蕊确认，上下级公用显示下发按钮 不区分选用还是下发
						if (page.agencyCtrlLevel == "03") {
							//上下级无关下发隐藏
							$(".btn-senddown").hide();
						} else {
							//上下级公用,下级细化可增加一级,下级细化不可增加一级下发显示
							$(".btn-senddown").show();
						}
					}
					//请求上级控制信息
					page.parentCtrlBtn(ctrlName);
				});
			},
			//根据上级信息控制界面新增、选用、增加下级按钮,显示/隐藏
			parentCtrlBtn: function (ctrlName) {
				//请求上级控制信息
				var argu2 = {
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: "CURRENCY",
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifaParent(argu2, function (data2) {
					page.agencyCtrlLevel2 = data2.agencyCtrllevel;
					var ctrlName2;
					if (page.agencyCtrlLevel2 == "0101") {
						//上下级公用下发,新增，选用，增加下级都隐藏（在表格的complete中做了控制）
						$(".btn-add").hide();
						//$(".btn-choose").hide();
						$(".btn-choose").show(); //经赵雪蕊确认能下发得单位级都能选用--zsj--CWYXM-6746
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "0102") {
						//上下级公用选用，新增隐藏，选用显示，增加下级隐藏（在表格的complete中做了控制）
						$(".btn-choose").show();
						$(".btn-add").hide();
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "0201") {
						//下级细化可增加一级，选用不强制，新增显示，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").show();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "0202") {
						//下级细化不可增加一级，新增显示，选用不强制，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").hide();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if (page.agencyCtrlLevel2 == "03") {
						//上下级无关，新增不强制，选用隐藏，增加下级不强制（在表格的complete中做了控制）
						$(".btn-choose").hide();
						$(".btn-add").show();
						ctrlName2 = data2.agencyCtrlName;
					}

					//控制信息提示
					var newCtrlInfor = "提示：";
					// if(ctrlName2 && ctrlName){
					// 	newCtrlInfor ='<div>提示：'+ctrlName2+'</div><div>'+ctrlName+'</div>';
					// }
					newCtrlInfor = newCtrlInfor + ctrlName;
					$(".table-sub-info").html(newCtrlInfor);
				});
			},
			//初始化单位
			initAgency: function () {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					leafRequire: false,
					onchange: function (data) {
						page.agencyCode = data.code;
						page.agencyName = data.name;
						page.isLeaf = data.isLeaf;
						if (data.isLeaf == '0') {
							//非末级单位不显示账套选择框
							$("#cbAcct").hide();
							page.acctFlag = false;
						} else {
							$("#cbAcct").show();
							page.acctFlag = true;
						}
						page.getEleDetail();
						//缓存单位账套
						var params = {
							selAgecncyCode: page.agencyCode,
							selAgecncyName: page.agencyName,
							selAcctCode: page.acctCode,
							selAcctName: page.acctName
						}
						ufma.setSelectedVar(params);
					},
					initComplete: function (sender) {
						if (page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
							page.cbAgency.val(page.agencyCode);
						} else {
							page.cbAgency.val(1);
						}
					}
				});
			},
			//初始化账套
			initAcctScc: function () {
				/*				page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									valueField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									onchange: function(data) {
										page.acctCode = data.code;
										page.acctName = data.name;
										page.accsCode = data.accsCode;
										page.accsName = data.accsName;
										page.initAgyPage();
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
										if(!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
											page.cbAcct.val(page.acctCode, page.acctName);
										} else {
											page.cbAcct.select(1);
										}
									}
								});*/
			},
			init: function () {
				var pfData = ufma.getCommonData();
				page.rgCode = pfData.svRgCode;
				page.setYear = pfData.svSetYear;
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				//如果有单位账套的缓存，则取缓存的值
				var selEnviornmentVar = ufma.getSelectedVar();
				if (selEnviornmentVar) {
					page.agencyCode = selEnviornmentVar.selAgecncyCode;
					page.agencyName = selEnviornmentVar.selAgecncyName;
					page.acctCode = selEnviornmentVar.selAcctCode;
					page.acctName = selEnviornmentVar.selAcctName;
				}

				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				if ($('body').data("code")) {
					//单位级
					page.initAgency();
					// ufma.get("/ma/sys/common/queryCtrlLevel", {
					// 	"tableName": page.tableParam,
					// 	"rgCode": page.rgCode,
					// 	"setYear": page.setYear
					// }, function (result) {
					// 	var data = result.data;
					// 	page.agencyCtrlLevel = data.agencyCtrlLevel;
					// 	if (page.agencyCtrlLevel == "0101") { //无按钮
					// 		$(".btn-choose,.btn-add").hide();
					// 	} else if (page.agencyCtrlLevel == "0102") { //右上角：选用
					// 		$(".btn-choose").show();
					// 		$(".btn-add").hide();
					// 	} else if (page.agencyCtrlLevel == "0201") { //右上角：新增  表格：增加下级（币种不需要）
					// 		$(".btn-choose").hide();
					// 		$(".btn-add").show();
					// 	} else if (page.agencyCtrlLevel == "0202") { //右上角：新增（币种不需要） 表格：增加下级（币种不需要）
					// 		$(".btn-choose").hide();
					// 		$(".btn-add").hide();
					// 	} else if (page.agencyCtrlLevel == "03") { //右上角：新增
					// 		$(".btn-choose").hide();
					// 		$(".btn-add").show();
					// 	}
					// })

				} else {
					page.agencyCode = "*";
					page.acctCode = '*';
					page.getEleDetail();
					this.initSysPage("*");
				}
				this.onEventListener();
				ufma.parse();
			}
		}
	}();

	page.init();
});