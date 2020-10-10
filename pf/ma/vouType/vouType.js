$(function () {
	var page = function () {
		// 定义全局变量，向后台传输数据chrId,chrValue,chrConmode;
		var chrCode, chrName, remark, vouFullname;
		var isrpt = ''
		// 传输设置数据的对象
		var postSet, fifa;
		var isSys, baseUrl, agencyCode, oTableCarrry;

		return {
			getErrMsg: function (errcode) {
				var error = {
					0: '凭证类型编码不能为空',
					1: '凭证类型全称不能为空',
					2: '凭证类型简称不能为空',
					3: '凭证类型全称和简称不能相同'
				}
				return error[errcode];
			},
			initVouType: function () {
				var url;
				if (page.isSys) {
					url = '/ma/sys/eleVouType/selectAll';
				} else {
					url = '/ma/sys/eleVouType/selectAll';
				}
				var callback = function (result) {
					$(".vouTypes").html("");
					var bgcolor = ['#D19DEF', '#63BEFF', '#FFD149', '#64DDA0', '#FFA0A0'];
					for (var i = 0; i < result.data.length; i++) {
						var index = Math.floor(Math.random() * 5);
						var $dl = $('<div class="one-voutype col-md-3" style="padding-bottom:15px">' +
							'<div class="ufma-card ufma-card-icon">' +
							'<div style="background-color:' + bgcolor[index] + '" class="card-icon">' +
							'<span class="icon" color-index="3"><span class="icon">' + result.data[i].chrCode + '</span></span>' +
							'</div>' +
							'<div class="ufma-card-header">' +
							'<p class="font-size16 chrId hidden">' + result.data[i].chrId + '</p>' +
							'<p class="font-size16 vouFullname hidden">' + result.data[i].vouFullname + '</p>' +
							'<p class="font-size16 useCount hidden">' + result.data[i].useCount + '</p>' +
							'<div class="chrName">' + result.data[i].chrName + '</div>' +
							'</div>' +
							'<div class="ufma-card-body">' +
							'<div>凭证类型编码：<span class="chrCode">' + result.data[i].chrCode + '</span></div>' +
							'<p class="font-size14 remark hidden">' + result.data[i].remark + '</span></p>' +
							'</div>' +
							'<div class="ufma-card-footer">' +
							'<a class="btn-label vouTypedown btn-permission btn-senddown"><i class="icon-download glyphicon"></i>下发</a>' +
							//'<a class="btn-label vouTypeEdit btn-permission btn-edit"><i class="icon-edit glyphicon"></i>编辑</a>' +
							(page.agencyCtrlLevel == "0101" ? '<a class="btn-label vouTypeEdit btn-permission btn-edit" accaCode = "' + result.data[i].accaCode + '"><i class="icon-edit glyphicon"></i>查看</a>' : '<a class="btn-label vouTypeEdit btn-permission btn-edit" accaCode = "' + result.data[i].accaCode + '"><i class="icon-edit glyphicon"></i>编辑</a>') +
							(page.agencyCtrlLevel == "0101" ? '' : '<a class="btn-label vouTypeDel btn-permission btn-delete"><i class="icon-trash glyphicon"></i>删除</a>') +

							'<p class="lastVerHidden hidden">' + result.data[i].lastVer + '</span></p>' +
							'</div>' +
							'</div>' +
							'</div>');
						$(".vouTypes").append($dl);
						if (page.agencyCode != '*') {
							$(".vouTypes").find('.vouTypedown').addClass('hidden');
						}
						//卡片绘制完后执行
						page.reslist = ufma.getPermission();
						ufma.isShow(page.reslist);
					}
				};
				if (page.isSys) {
					ufma.get(url, {
						agencyCode: '*',
						acctCode: "*",
						setYear: ma.setYear,
						rgCode: ma.rgCode
					}, callback);
				} else {
					ufma.get(url, {
						agencyCode: page.agencyCode,
						acctCode: page.cbAcct.getValue,
						setYear: ma.setYear,
						rgCode: ma.rgCode
					}, callback);
				}
			},

			clearmodel: function () {
				$("#form-vouType").find("input[name='chrId']").val("");
				$("#form-vouType").find("input[name='chrCode']").val("");
				$("#form-vouType").find("input[name='chrName']").val("");
				$("#form-vouType").find("input[name='vouFullname']").val("");
				$("#form-vouType").find("textarea[name='remark']").val("");
				page.isEdit = false;
				page.showAccoOne(); //财务云项目CWYXM-9768 --基础资料-凭证类型，点击保存并新增按钮，关联科目页签未清空--zsj
				$('#chrCode').removeAttr('disabled');
			},
			downto: function (ids, e) {
				e.stopPropagation();
				if (ids.length == 0) {
					ufma.alert('请选择凭证类型！');
					return false;
				}
				page.modal = ufma.selectBaseTree({
					url: '/ma/sys/eleAgency/getAgencyTree',
					rootName: '所有单位',
					title: '选择下发单位',
					bSearch: true, //是否有搜索框
					filter: { //其它过滤条件
						'单位类型': { //标签
							ajax: '/ma/pub/enumerate/AGENCY_TYPE_CODE', //地址
							formControl: 'combox', //表单元素
							data: {},
							idField: 'ENU_CODE',
							textField: 'ENU_NAME',
							filterField: 'agencyType',
						}
					},
					buttons: { //底部按钮组
						'确认下发': {
							class: 'btn-primary',
							action: function (data) {
								if (data.length == 0) {
									ufma.alert('请选择单位！');
									return false;
								}
								var dwCode = [];
								for (var i = 0; i < data.length; i++) {
									if (!data[i].isParent) {
										dwCode.push(data[i].id);
									}
								}
								var url = '/ma/sys/eleVouType/issue';
								var argu = {
									'chrCodes': ids,
									'toAgencyCodes': dwCode
								};
								var callback = function (result) {
									ufma.showTip(result.msg, function () { }, result.flag);
									page.modal.close();
								};
								ufma.post(url, argu, callback);
								//下发后取消全选
								$(".datatable-group-checkable,.checkboxes").prop("checked", false);
								$("input[name='check']").prop("checked", false);
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
			},
			save: function (flag) {
				if ($("#form-vouType .form-group.error").get(0)) {
					return false;
				}

				postSet = $("#form-vouType").serializeObject();
				//保存前校验
				if (postSet.chrCode == "") {
					ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
					$('#chrCode').closest('.form-group').addClass('error');
					return false;
				}
				if (postSet.chrName == "") {
					ufma.showInputHelp('chrName', '<span class="error">' + page.getErrMsg(2) + '</span>');
					$('#chrName').closest('.form-group').addClass('error');
					return false;
				}
				if (postSet.vouFullname == "") {
					ufma.showInputHelp('vouFullname', '<span class="error">' + page.getErrMsg(1) + '</span>');
					$('#vouFullname').closest('.form-group').addClass('error');
					return false;
				}
				postSet.agencyCode = page.agencyCode;
				postSet.acctCode = page.cbAcct.getValue();
				postSet.setYear = ma.setYear;
				postSet.rgCode = ma.rgCode;
				var detailBeanList = [];
				$('#carryOver_wrapper').find('.nowAcco span').each(function () {
					var detailArgu = {};
					var rowIndex = $(this).attr('data-index');
					detailArgu = $.extend(detailArgu, oTableCarrry.api(false).row(rowIndex).data());
					if ($(this).closest('tr').find('.optGroups .btn-start').hasClass('hide')) { //显示“停用”代表已启用
						detailArgu.enabled = 1;
					} else if ($(this).closest('tr').find('.optGroups .btn-stop').hasClass('hide')) { //显示“启用”代表已停用
						detailArgu.enabled = 0;
					}
					detailBeanList.push(detailArgu);
				});
				postSet.accoList = detailBeanList;
				if (isrpt == '0') {
					postSet.accaCode = '*'
				}
				var url = page.baseUrl + 'eleVouType/save';
				var callback = function (result) {
					if (flag) {
						ufma.showTip(result.msg, '', result.flag);
						//						/page.clearmodel();
						// $("#vouType-edt").modal('hide')
						page.editor.close()
					} else {
						page.clearmodel()
						ufma.showTip("保存成功，您可以继续添加数据！", '', result.flag);
						page.formdata = $('#form-vouType').serializeObject();
					}
					page.initVouType();
				};
				ufma.post(url, postSet, callback);
			},
			initFifa: function () {
				callback = function (result) {
					var codeRule = result.data.codeRule;
					if (codeRule != null && codeRule != '') {
						page.fifa = parseInt(codeRule.split('-')[0]);
					}
				}
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': page.agencyCode,
					"eleCode": 'VOUTYPE'
				};
				ufma.get('/ma/sys/element/getEleDetail', argu, callback);
			},
			//初始化科目表格 ---CWYXM-9250增加凭证类型关联会计科目功能--zsj
			initAccoTable: function () {
				if (oTableCarrry) {
					//pageLengthCarrry = ufma.dtPageLength('#carryOver');
					oTableCarrry.fnDestroy();
				}
				var tblId = 'carryOver';
				$("#" + tblId).html(''); //清空原有表格
				var columns = [{
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
						'<input type="checkbox" class="datatable-group-checkable" id="checkedTab"/>&nbsp;' +
						'<span></span> ' +
						'</label>',
					data: "chrCode",
					width: 40
				}, {
					data: "chrCode",
					title: "科目编码",
					className: "tc nowrap commonShow nowAcco",
					width: 150,
					"render": function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<span title="' + data + '" data-index="' + meta.row + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				},
				{
					data: "chrName",
					title: "科目名称",
					className: "tc nowrap commonShow",
					width: 150,
					"render": function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				},
				{
					data: "agencyTypeName",
					title: "适用单位",
					className: "tc nowrap commonShow",
					width: 150,
					"render": function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				},
				{
					data: "accoItems",
					title: "辅助核算",
					className: "tc nowrap commonShow",
					width: 150,
					"render": function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				},
				{
					data: "accBalName",
					title: "余额方向",
					className: "tc nowrap",
					width: 50,
					"render": function (data, type, rowdata, meta) {
						if (!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}
					}
				},
				{
					title: "操作",
					data: "opt",
					width: 100,
					className: 'nowrap tc optGroups',
					"render": function (data, type, rowdata, meta) {
						var active = rowdata.enabled == 1 ? 'hidden' : '';
						var unactive = rowdata.enabled == 0 ? 'hidden' : '';
						var delFlag = rowdata.isUsed == 1 ? 'disabled' : '';
						// sunch【CWYXM-10007】【20191130 财务云8.20.12】基础资料-凭证类型，去掉启用/禁用按钮，同时删除不再校验是否已在凭证中使用
						var rd =
							// '<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowcode="' + data + '" title="启用">' +
							// '<span class="glyphicon icon-play"></span></a>' +
							// '<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowcode="' + data + '" title="停用">' +
							// '<span class="glyphicon glyphicon icon-ban"></span></a>' +
							'<a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" data-delId ="' + rowdata.chrId + '" action= "del" ' + delFlag + ' rowcode="' + data + '" title="删除">' +
							'<span class="glyphicon icon-trash"></span></a>'
						return rd;
					}
				}
				];

				oTableCarrry = $("#" + tblId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"autoWidth": false,
					"bDestory": true,
					//填充表格数据
					"data": [],
					"scrollY": 180,
					"processing": true, //显示正在加载中
					"serverSide": false,
					"ordering": false,
					paging: false, //CWYXM--9687--在datatable使用scrollY时记得加上paging:false,而且最好把pageLength相关都删除，不然表格数据 显示不完整--ZSJ
					columns: columns,
					"columnDefs": [{
						"targets": [0],
						"serchable": false,
						"orderable": false,
						"className": "checktd tc",
						"render": function (data, type, rowdata, meta) {
							return '<div class="checkdiv">' +
								'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
								'<input type="checkbox" data-used="' + rowdata.isUsed + '" data-chrId="' + rowdata.chrId + '" class="checkboxes" value="' + data + '" />&nbsp; ' +
								'<span></span> ' +
								'</label>';
						}
					}],
					"dom": "rt",
					initComplete: function (settings, json) {
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
						ufma.isShow(page.reslist);
					},
					drawCallback: function (settings) {
						$('#carryOver').find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$('.dataTables_wrapper.no-footer .dataTables_scrollBody').css("border-bottom", "1px solid transparent");
						//CWYXM-9692---基础资料-凭证类型，选用科目后，按行删除没反应--zsj
						$('#carryOver .btn-delete').on('click', function (e) {
							var $delete = $(this);
							ufma.confirm('您确定删除当前会计科目吗？', function (action) {
								if (action) {
									ufma.showloading('数据删除中，请耐心等待...');
									var chrIdArr = [];
									var id = '';
									id = $delete.attr('data-delId');
									chrIdArr.push(id);
									var argu = {
										"agencyCode": page.agencyCode,
										"rgCode": page.rgCode,
										"setYear": page.setYear,
										"acctCode": page.acctCode,
										"chrIds": chrIdArr
									}
									ufma.post('/ma/sys/eleVouType/deleteVouTypeRanges', argu, function (result) {
										ufma.showTip(result.msg, function () { }, result.flag);
										page.isEdit = false;
										page.showAccoOne();
									});
									ufma.hideloading();

								}
							}, {
									type: 'warning'
								});

						});
						$('#carryOver .btn-start').on('click', function (e) {
							var $start = $(this);
							ufma.confirm('您确定启用当前会计科目吗？', function (action) {
								if (action) {
									ufma.hideloading();
									ufma.showTip('启用成功', function () {
										$start.parent().find('.btn[action="active"]').addClass('hide');
										$start.parent().find('.btn[action="unactive"]').removeClass('hide');
										$start.parent().find('.btn[action="active"]').attr('hidden');
										$start.parent().find('.btn[action="unactive"]').removeAttr('hidden');
									}, 'success');

								}
							}, {
									type: 'warning'
								});

						});
						$('#carryOver .btn-stop').on('click', function (e) {
							var $stop = $(this);
							ufma.confirm('您确定停用当前会计科目吗？', function (action) {
								if (action) {
									ufma.hideloading();
									ufma.showTip('停用成功', function () {
										$stop.parent().find('.btn[action="unactive"]').addClass('hide');
										$stop.parent().find('.btn[action="active"]').removeClass('hide');
										$stop.parent().find('.btn[action="active"]').removeAttr('hidden');
										$stop.parent().find('.btn[action="unactive"]').attr('hidden');
									}, 'success');

								}
							}, {
									type: 'warning'
								});
						});
						ufma.isShow(page.reslist);
					}
				});
			},

			//获取设置科目表格数据--CWYXM-9250【20191130外交部】增加凭证类型关联会计科目功能--zsj
			showAccoOne: function () {
				var arguAge = {
					"agencyCode": page.agencyCode,
					"rgCode": page.rgCode,
					"setYear": page.setYear,
					"acctCode": page.acctCode,
					"vouTypeCode": $('#chrCode').val(),
					"isEdit": page.isEdit
				}
				ufma.showloading('数据加载中，请耐心等待...');
				ufma.post("/ma/sys/eleVouType/getAccoTable", arguAge, function (result) {
					ufma.hideloading();
					oTableCarrry.fnClearTable();
					if (result.data.length != 0) {
						oTableCarrry.fnAddData(result.data, true);
						page.parentData = result.data;
						//	page.formdata = $.extend(page.formdata, page.parentData);
					}
				});
			},
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象 
				var r = window.location.search.substr(1).match(reg); //匹配目标参数 
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值 
			},
			onEventListener: function () {
				//checkbox的全选操作
				$("#tool-bar").on("change", '.datatable-group-checkable', function () {
					var isCorrect = $(this).is(":checked");
					$("#carryOver .checkboxes").each(function () {
						isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
						//isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
					});
					$(".datatable-group-checkable").prop("checked", isCorrect);
				});
				//CWYXM-9726--基础资料-凭证类型，科目列表，左上全选按钮无效--zsj
				$(document).on("click", 'thead #checkedTab', function () {
					var isCorrect = $(this).is(":checked");
					$("#carryOver .checkboxes").each(function () {
						isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
						//isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
					});
					$(".datatable-group-checkable").prop("checked", isCorrect);
				});
				//checkbox的单选操作
				$("#carryOver").on("change", 'input.checkboxes', function () {
					var flag = $(this).prop("checked");
					var num = 0;
					var arr = document.querySelectorAll('.checkboxes');
					for (var i = 0; i < arr.length; i++) {
						if (arr[i].checked) {
							num++;
						}
					}
					if (num == arr.length) {
						$(".datatable-group-checkable").prop('checked', true);

					} else {
						$(".datatable-group-checkable").prop('checked', false);
					}
				});
				//编码修改 时需要判断是否重新关联科目
				$('#chrCode').on('focus', function () {
					page.chrCodeOld = $('#chrCode').val();
				});
				$('#chrCode').on('change', function () {
					if (page.chooseData.length > 0 && !$.isNull(page.chrCodeOld)) {
						ufma.confirm('修改编码后需要重新关联科目，是否仍然确定修改？', function (e) {
							if (e) {
								//清空已关联数据--再次保存科目关系时需要传oldVouTypeCode和vouTypeCode
								var argu = {
									"agencyCode": page.agencyCode,
									"rgCode": page.rgCode,
									"setYear": page.setYear,
									"acctCode": page.acctCode,
									oldVouTypeCode: page.chrCodeOld
								}
								ufma.delete('/ma/sys/eleVouType/deleteVouTypeAccoRange', argu, function () {
									$('#chrCode').val('');
									oTableCarrry.fnClearTable();
								});
							}
						}, {
								type: 'warning'
							});
					}

				});
				//批量删除
				$('#btnDelte').on('click', function () {
					//CWYXM-9931 基础资料-凭证类型，科目未选择时点击删除、启用、禁用应校验--zsj
					if ($("#carryOver .checkboxes:checked").length > 0) {
						ufma.confirm('您确定删除这些会计科目吗？', function (action) {
							if (action) {
								ufma.hideloading();
								var chrIdArr = [];
								$("#carryOver .checkboxes:checked").each(function () {
									var id = '';
									id = $(this).attr('data-chrId');
									chrIdArr.push(id);
									/*var usedFLag = $(this).attr('data-used');
									  if(usedFLag != '1') {
										  chrIdArr.push(id);
									}*/
								});
								//CWYXM-9725 基础资料-凭证类型，科目应支持批量删除--zsj
								// if(chrIdArr.length == 0) {
								// 	ufma.showTip('已使用的科目不能删除', function() {}, 'warning');
								// 	return false;
								// } else {
								// sunch CWYXM-10007 删除不再校验是否已在凭证中使用
								var argu = {
									"agencyCode": page.agencyCode,
									"rgCode": page.rgCode,
									"setYear": page.setYear,
									"acctCode": page.acctCode,
									"chrIds": chrIdArr
								}
								ufma.post('/ma/sys/eleVouType/deleteVouTypeRanges', argu, function (result) {
									ufma.showTip(result.msg, function () { }, result.flag);
									page.isEdit = false;
									page.showAccoOne();
									$(".datatable-group-checkable,.checkboxes").prop("checked", false);
								});
								// }

							}
						}, {
								type: 'warning'
							});
					} else {
						ufma.showTip('请先选择关联科目', function () { }, 'warning');
						return false;
					}
				});
				//批量启用 
				$('#btnStart').on('click', function () {
					//CWYXM-9931 基础资料-凭证类型，科目未选择时点击删除、启用、禁用应校验--zsj
					if ($("#carryOver .checkboxes:checked").length > 0) {
						ufma.confirm('您确定启用这些会计科目吗？', function (action) {
							if (action) {
								ufma.hideloading();
								ufma.showTip('启用成功', function () { }, 'success');
								$("#carryOver .checkboxes:checked").each(function () {
									$(this).closest('tr').find('.btn[action="active"]').addClass('hide');
									$(this).closest('tr').find('.btn[action="unactive"]').removeClass('hide');
									$(this).closest('tr').find('.btn[action="active"]').attr('hidden');
									$(this).closest('tr').find('.btn[action="unactive"]').removeAttr('hidden');
								});
							}
						}, {
								type: 'warning'
							});
					} else {
						ufma.showTip('请先选择关联科目', function () { }, 'warning');
						return false;
					}

				});
				//批量停用
				$('#btnStop').on('click', function () {
					//CWYXM-9931 基础资料-凭证类型，科目未选择时点击删除、启用、禁用应校验--zsj
					if ($("#carryOver .checkboxes:checked").length > 0) {
						ufma.confirm('您确定停用当前会计科目吗？', function (action) {
							if (action) {
								ufma.hideloading();
								ufma.showTip('停用成功', function () { }, 'success');
								$("#carryOver .checkboxes:checked").each(function () {
									$(this).closest('tr').find('.btn[action="unactive"]').addClass('hide');
									$(this).closest('tr').find('.btn[action="active"]').removeClass('hide');
									$(this).closest('tr').find('.btn[action="active"]').removeAttr('hidden');
									$(this).closest('tr').find('.btn[action="unactive"]').attr('hidden');
								});
							}
						}, {
								type: 'warning'
							});
					} else {
						ufma.showTip('请先选择关联科目', function () { }, 'warning');
						return false;
					}

				});
				//CWYXM-9250【20191130外交部】增加凭证类型关联会计科目功能--zsj
				$('#chooseAcco').on('click', function () {
					if (!$.isNull($('#chrCode').val())) {
						ufma.open({
							url: 'vouTypeNew.html',
							title: '会计科目选择',
							width: 600,
							height: 680,
							data: {
								"agencyCode": page.agencyCode,
								"rgCode": page.rgCode,
								"setYear": page.setYear,
								"acctCode": page.acctCode,
								"vouTypeCode": $('#chrCode').val()
							},
							ondestory: function (action) {
								if (action) {
									page.chooseData = [];
									page.chooseData = action.data;
									page.isEdit = false;
									page.showAccoOne();
								}
								var dlgTop = $(document).scrollTop() + ($(window).height() - 500) / 2;
								$("#ufma_vouType-edt").parents(".u-msg-dialog-top").css("top", dlgTop + "px")
							}
						});
						setTimeout(function () {
							var dlgTop = $(document).scrollTop() + ($(window).height() - 500) / 2;
							$("#ufma_vouType-edt").parents(".u-msg-dialog-top").css("top", dlgTop + "px")
						}, 200)

					} else {
						ufma.showTip('请先填写凭证编码', function () { }, 'warning');
					}

				});
				//鼠标移入凭证
				$('.vouTypes').on("mouseover", ".one-voutype", function () {
					$(this).find('label').removeClass('hidden');
				});
				//鼠标离开凭证
				$('.vouTypes').on("mouseout", ".one-voutype", function () {
					if (!($(this).find('#CheckVou').is(':checked'))) {
						$(this).find('label').addClass('hidden');
					};
				});
				//全选
				$('#selectAll').on('click', function () {
					if ($(this).is(':checked')) {
						$('.vouTypes').find('input[name="check"]').prop('checked', true);
						$('.vouTypes').find('label').removeClass('hidden');
					} else {
						$('.vouTypes').find('input[name="check"]').prop('checked', false);
						$('.vouTypes').find('label').addClass('hidden');
					}
				});
				//单选下发
				$('.vouTypes').on("click", ".vouTypedown", function (e) {
					var ids = [$(this).parents(".ufma-card").find(".chrCode").text()];
					page.downto(ids, e);

				});
				//多选下发
				$('#vouTypeBtnDown').on('click', function (e) {

					var allVou = $('.vouTypes').find('input[name="check"]');
					var ids = [];
					for (var i = 0; i < allVou.length; i++) {

						if (allVou[i].checked) {
							ids.push(allVou[i].value);
						}
					}
					page.downto(ids, e);
				});
				$(".vouTypes").on("click", ".vouTypeEdit", function () {
					$('#form-vouType').find('.form-group').each(function () {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
					$("#vouTypeAddLabel").html("<h4>修改凭证类型</h4>");
					// $("#vouType-edt").modal('show');
					page.editor = ufma.showModal('vouType-edt', 800, 500);
					var usecount = parseInt($(this).parents(".ufma-card").find('.useCount').text());
					$('#chrCode').attr('disabled', true); //CWYXM-9755--基础资料-凭证类型，保存后编码应不可编辑，已与刘总确认--zsj
					if (usecount > 0) {
						$("#form-vouType").find("input[name='chrCode']").attr('disabed', 'disabled');
						$("#form-vouType").find("input[name='chrName']").attr('disabed', 'disabled');
						$("#form-vouType").find("input[name='vouFullname']").attr('disabed', 'disabled');
					}
					$("#form-vouType").find("input[name='chrId']").val($(this).parents(".ufma-card").find(".chrId").text());
					$("#form-vouType").find("input[name='chrCode']").val(ufma.parseNull($(this).parents(".ufma-card").find(".chrCode").text()));
					$("#form-vouType").find("input[name='chrName']").val(ufma.parseNull($(this).parents(".ufma-card").find(".chrName").text()));
					$("#form-vouType").find("input[name='vouFullname']").val(ufma.parseNull($(this).parents(".ufma-card").find(".vouFullname").text()));
					$("#form-vouType").find("textarea[name='remark']").val(ufma.parseNull($(this).parents(".ufma-card").find(".remark").text()));
					$("#form-vouType").find("input[name='lastVer']").val($(this).parents(".ufma-card").find(".lastVerHidden").text());
					$("#form-vouType").find("#accaCode").getObj().val($(this).attr("accaCode"));
					page.formdata = $("#form-vouType").serializeObject();
					page.initAccoTable();
					page.isEdit = true;
					page.showAccoOne();
				});
				$(".vouTypes").on("click", ".vouTypeDel", function () {
					var chrCode = $(this).parents(".ufma-card").find(".chrCode").text();
					ufma.confirm('您确定删除选中的数据吗？', function (e) {
						if (e) {
							url = page.baseUrl + 'eleVouType/delete';
							var argu = {
								chrCodes: [chrCode],
								agencyCode: page.agencyCode,
								acctCode: page.cbAcct.getValue(),
								eleCode: 'VOUTYPE',
								rgCode: ma.rgCode,
								setYear: ma.setYear
							};
							var callback = function (result) {
								page.initVouType();
								page.clearmodel();
								if (result.flag == 'success') {
									ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
								}
							}
							ufma.delete(url, argu, callback);
						}
					}, {
							type: 'warning'
						})
				});
				$("#btn-saveadd").on("click", function () {
					page.save(false)
				});
				$("#btn-save").on("click", function () {
					page.save(true);
				});
				$("#btn-add").on("click", function () {
					if (page.chooseAcctFlag == false) {
						page.clearmodel();
						$("#vouTypeAddLabel").html("<h4>新增凭证类型</h4>");
						$('#form-vouType').find('.form-group').each(function () {
							$(this).removeClass('error');
							$(this).find(".input-help-block").remove();
						});
						// $("#vouType-edt").modal('show')
						page.editor = ufma.showModal('vouType-edt', 800, 500);
						$('#chrCode').removeAttr('disabled');
						$("#form-vouType").find("input[name='lastVer']").val("");
						page.formdata = $('#form-vouType').serializeObject();
						page.isEdit = false;
						page.initAccoTable();
						page.showAccoOne();
					} else {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					}
				});
				$("#btn-close").on("click", function () {
					var tmpFormData = $('#form-vouType').serializeObject();
					//	tmpFormData = $.extend(tmpFormData, page.chooseData);
					if (!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') != 'none') {
						ufma.confirm('您修改了凭证类型信息，关闭前是否保存？', function (action) {
							if (action) {
								page.save(false);

							} else {
								page.clearmodel();
								// $("#vouType-edt").modal('hide');
								page.editor.close()
							}
						}, {
								type: 'warning'
							});
					} else {
						if ($("#chrCode").prop("disabled")) {
							var argu = {
								"acctCode": page.acctCode,
								"agencyCode": page.agencyCode,
								"rgCode": page.rgCode,
								"setYear": page.setYear,
								"vouTypeCode": $('#chrCode').val()
							}
							ufma.post("/ma/sys/eleVouType/deleteVouTypeAccoRangeTemp", argu, function () {

							})
						}
						//page.clearmodel();
						// $("#vouType-edt").modal('hide');
						page.editor.close()
					}

				});
				//校验
				//  chrCode  vouFullname  chrName
				$("#chrCode").on('blur', function () {
					if ($(this).val() == '') {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					} else if (!ufma.isNumOrChar($(this).val())) {
						ufma.showInputHelp('chrCode', '<span class="error">凭证类型编码只能为数字或字母！</span>');
						$('#chrCode').closest('.form-group').addClass('error');
						$('#chrCode').val('');
					} else if ($(this).val().length != page.fifa) {
						ufma.showInputHelp('chrCode', '<span class="error">不符合编码规则，编码规则为:' + page.fifa + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					}
				}).on('focus', function (e) {
					e.stopepropagation;
					ufma.hideInputHelp('chrCode');
					$('#chrCode').closest('.form-group').removeClass('error');
				});
				$("#vouFullname").on('blur', function () {
					if ($(this).val() == '') {
						ufma.showInputHelp('vouFullname', '<span class="error">' + page.getErrMsg(1) + '</span>');
						$('#vouFullname').closest('.form-group').addClass('error');
					} else {
						if ($(this).val() == $("#chrName").val()) {
							ufma.showInputHelp('vouFullname', '<span class="error">' + page.getErrMsg(3) + '</span>');
							$('#vouFullname').closest('.form-group').addClass('error');
						} else {
							ufma.hideInputHelp('vouFullname');
							$('#vouFullname').closest('.form-group').removeClass('error');
							ufma.hideInputHelp('chrName');
							$('#chrName').closest('.form-group').removeClass('error');
						}
					}
				}).on('focus', function (e) {
					e.stopepropagation;
					ufma.hideInputHelp('vouFullname');
					$('#vouFullname').closest('.form-group').removeClass('error');
				});

				$("#chrName").on('blur', function () {
					if ($(this).val() == '') {
						ufma.showInputHelp('chrName', '<span class="error">' + page.getErrMsg(2) + '</span>');
						$('#chrName').closest('.form-group').addClass('error');
					}
				}).on('focus', function (e) {
					e.stopepropagation;
					ufma.hideInputHelp('chrName');
					$('#chrName').closest('.form-group').removeClass('error');
				});

				$(document).on("click", "#ufma_vouType-edt .u-msg-close", function () {
					if ($("#chrCode").prop("disabled")) {
						var argu = {
							"acctCode": page.acctCode,
							"agencyCode": page.agencyCode,
							"rgCode": page.rgCode,
							"setYear": page.setYear,
							"vouTypeCode": $('#chrCode').val()
						}
						ufma.post("/ma/sys/eleVouType/deleteVouTypeAccoRangeTemp", argu, function () {

						})
					}
				})
			},

			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.rgCode = pfData.svRgCode;
				page.setYear = parseInt(pfData.svSetYear);
				page.chooseData = [];
				page.isEdit = false;
				//初始化会计体系
				$('#accaCode').ufCombox({
					idField: 'accaCode',
					textField: 'accaName',
					readonly: true,
					data: [{
						'accaCode': '1',
						'accaName': '财务会计'
					}, {
						'accaCode': '2',
						'accaName': '预算会计'
					}],
					onComplete: function (sender) {
						$('#accaCode').getObj().val('1');
					}
				});

				if ($('body').data("code")) {
					page.cbAgency = $("#cbAgency").ufmaTreecombox2({
						url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
						onchange: function (data) {
							page.agencyCode = data.code;
							page.agencyName = data.name;
							page.initFifa();
							ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
								"setYear": page.setYear,
								"rgCode": page.rgCode
							}, function (result) {
								var acctData = result.data;
								if (acctData.length == 0) {
									page.chooseAcctFlag = true;
									$(".vouTypes").html("");
								} else if (acctData.length > 0) {
									page.chooseAcctFlag = false;
								}
								page.cbAcct = $("#cbAcct").ufmaCombox2({
									data: acctData,
									initComplete: function (sender) {
										//修改账套无法自动获取问题--zsj--bug76812
										var jumpAcctCode = page.getUrlParam("jumpAcctCode");
										if (!$.isNull(jumpAcctCode)) {
											page.cbAcct.val(jumpAcctCode);
										} else {
											if (!$.isNull(pfData.svAcctCode)) {
												page.cbAcct.val(pfData.svAcctCode);
												pfData.svAcctCode = '';
											} else if (acctData.length > 0) {
												page.cbAcct.select(0);
												page.isInit = false;
											} else {
												ufma.showTip('该单位下没有账套，请重新选择', function () { }, 'warning');
												page.chooseAcctFlag = true;
												return false;
											}
										}
									}
								});
							});
							//缓存单位账套
							var params = {
								selAgecncyCode: page.agencyCode,
								selAgecncyName: page.agencyName,
							}
							ufma.setSelectedVar(params);
						},
						initComplete: function (sender) {
							if (!$.isNull(pfData.svAgencyCode)) {
								page.cbAgency.val(pfData.svAgencyCode);
							} else {
								if (page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
									page.cbAgency.val(page.agencyCode);
								} else {
									page.cbAgency.val('1');
								}
							}
						}
					});
					page.cbAcct = $("#cbAcct").ufmaCombox2({
						valueField: 'code',
						textField: 'codeName',
						placeholder: '请选择账套',
						icon: 'icon-book',
						onchange: function (data) {
							page.isSys = false;
							page.baseUrl = '/ma/sys/';
							if (data.isParallel == '1' && data.isDoubleVou == '1') {
								isrpt = '1'
								$(".accaisshow").show()
							} else {
								isrpt = '0'
								$(".accaisshow").hide()
							}
							page.initVouType();
							page.acctCode = page.cbAcct.getValue();
							//缓存单位账套
							var params = {
								selAgecncyCode: page.agencyCode,
								selAgecncyName: page.agencyName,
								selAcctCode: data.code,
								selAcctName: data.name
							}
							ufma.setSelectedVar(params);
						},
						initComplete: function (sender) { }
					})

					var argu = {
						"rgCode": ma.rgCode,
						"setYear": ma.setYear,
						'agencyCode': page.agencyCode,
						"eleCode": 'VOUTYPE'
					};
					ufma.get("/ma/sys/element/getEleDetail", argu, function (result) {
						var data = result.data;
						page.agencyCtrlLevel = data.agencyCtrlLevel;
					})
				} else {
					page.agencyCode = "*";
					page.isSys = true;
					page.baseUrl = '/ma/sys/';
					this.initVouType();
				}
				page.fifa = 0;
				page.chooseAcctFlag = false;
				page.initFifa();
				this.onEventListener();
				page.formdata = $("#form-vouType").serializeObject();
				//ufma.setWorkspaceHeight();

				//卡片绘制完后执行

				ufma.parse();
			}
		}
	}();

	page.init();
});