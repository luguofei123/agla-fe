﻿﻿﻿
$(function() {
	var page = function() {

		// 单位管理接口
		var portList = {
			agencyType: "/df/fap/agency/pub/enumerate/AGENCY_TYPE_CODE", // 单位类型列表
			tableList: "/df/fap/agency/sys/eleAgency/queryList", // 请求表格数据列表
			deleteData: "/df/fap/agency/sys/eleAgency/delete", // 删除数据
			ableData: "/df/fap/agency/sys/eleAgency/able", // 停用启用数据
			addlowerData: "/df/fap/agency/sys/common/getMaxLowerCode", // 获取最大可增加下级编码
			codeRule: "/df/fap/agency/sys/element/getEleDetail", // 获取编码规则
			parentFullName: "/df/fap/agency/sys/common/getParentChrFullname", // 获取父级的全称
			saveData: "/df/fap/agency/sys/eleAgency/save", // 保存数据
			findParentList: "/df/fap/agency/sys/common/findParentList", // 获取参考信息
			distTree: "/df/fap/agency/sys/eleAgency/distTree" , // 获取行政区划树
			areaZone: "/df/fap/agency/sys/eleAgency/areaZone", // 获取片区
			currency: "/df/fap/agency/sys/eleAgency/currency", // 获取币种
			leaderCharge: "/df/fap/agency/sys/eleAgency/leaderCharge" // 获取币种			
		};

		return {
			namespace: 'agency',
			agencyCode: "*",
			tableName: "MA_ELE_AGENCY",
			eleCode: "AGENCY",
			get: function(tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			getInterface: function(action) {
				var urls = {
					del: {
						type: 'delete',
						url: portList.deleteData
					},
					active: {
						type: 'put',
						url: portList.ableData
					},
					unactive: {
						type: 'put',
						url: portList.ableData
					},
					addlower: {
						type: 'post',
						url: portList.addlowerData
					}
				}
				return urls[action];
			},
			reqAgencyType: function() {
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				var $obj = $('#agencyTypeLabel');
				$obj.find(':not(.label-radio[value=""])').remove();
				var labelGroup = '';
				var callback = function(result) {
					$.each(result.data, function(idx, item) {
						labelGroup += '<a name="divKind" value="' +
							item.ENU_CODE +
							'" class="label label-radio">' +
							item.ENU_NAME + '</a>';
					});
					$(labelGroup).appendTo($obj);
				}
				ufma.get(portList.agencyType, argu, callback);
			},
			getExpFunc: function(pageNum, pageLen) {
				var argu = $('#query-tj').serializeObject();
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
					var id = "agency-data";
					var toolBar = $('#' + id).attr('tool-bar');
					$("#" + id).dataTable().fnDestroy();
					$('#' + id)
						.DataTable({
							"language": {
								"url": bootPath +
									"agla-trd/datatables/datatable.default.js"
							},
							"fixedHeader": {
								header: true
							},
							"data": result.data,
							"ordering": false,
							"bFilter": true, // 去掉搜索框
							"bLengthChange": true, // 去掉每页显示多少条数据
							"processing": true, // 显示正在加载中
							"pagingType": "full_numbers", // 分页样式
							"lengthChange": true, // 是否允许用户自定义显示数量p
							"lengthMenu": [
								[10, 20, 50, 100, 200, -1],
								[10, 20, 50, 100, 200, "全部"]
							],
							"pageLength": 20,
							"bInfo": true, // 页脚信息
							"bAutoWidth": false, // 表格自定义宽度，和swidth一起用
							"bDestroy": true,
							"columns": [{
								title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
									'class="datatable-group-checkable"/>&nbsp;<span></span> </label>',
								data: "chrCode"
							}, {
								title: "单位编码",
								data: "chrCode"
							}, {
								title: "单位名称",
								data: "chrName"
							}, {
								title: "单位类型",
								data: "divName"
							}, {
								title: "单位负责人",
								data: "enCharge"
							}, {
								title: "财务负责人",
								data: "financeCharge"
							}, {
								title: "状态",
								data: "enabled"
							}, {
								title: "操作",
								data: 'chrCode'
							}],
							"columnDefs": [{
									"targets": [0],
									"serchable": false,
									"orderable": false,
									"className": "checktd",
									"render": function(data,
										type, rowdata, meta) {
										return '<div class="checkdiv"></div>' +
											'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
											'<input type="checkbox" class="checkboxes" value="' +
											data +
											'" rowid="' +
											rowdata.chrId +
											'"/> &nbsp;' +
											'<span></span> </label>';
									}
								},
								{
									"targets": [1, 3, 4, 5, 6],
									"className": "isprint"
								},
								{
									"targets": [2],
									"serchable": false,
									"orderable": false,
									"className": "nowrap isprint",
									"render": function(data,
										type, rowdata, meta) {
										var textIndent = '0';
										if(rowdata.levelNum) {
											textIndent = (parseInt(rowdata.levelNum) - 1) +
												'em';
										}
										var alldata = JSON
											.stringify(rowdata);
										return '<a class="common-jump-link" style="display:block;text-indent:' +
											textIndent +
											'" href="javascript:;" data-href=\'' +
											alldata +
											'\'>' +
											data +
											'</a>';
									}
								},
								{
									"targets": [6],
									"render": function(data,
										type, rowdata, meta) {
										if(rowdata.enabled == 1) {
											return '<span style="color:#00A854">启用</span>';
										} else {
											return '<span style="color:#F04134">停用</span>';
										}

									}
								},
								{
									"targets": [-1],
									"serchable": false,
									"orderable": false,
									"className": "text-center nowrap btnGroup",
									"render": function(data,
										type, rowdata, meta) {
										var active = rowdata.enabled == 1 ? 'none' :
											'inline-block';
										var unactive = rowdata.enabled == 0 ? 'none' :
											'inline-block';

										return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" action= "addlower" rowcode="' +
											data +
											'" title="增加下级">' +
											'<span class="glyphicon icon-add-subordinate"></span></a>' +
											'<a class="btn btn-icon-only btn-sm btn-permission btn-start" style="display:' +
											active +
											'" data-toggle="tooltip" action= "active" rowcode="' +
											data +
											'" title="启用">' +
											'<span class="glyphicon icon-play"></span></a>' +
											'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" style="display:' +
											unactive +
											'" data-toggle="tooltip" action= "unactive" rowcode="' +
											data +
											'" title="停用">' +
											'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' +
											data +
											'" rowid="' +
											rowdata.chrId +
											'" title="删除">' +
											'<span class="glyphicon icon-trash"></span></a>';
									}
								}
							],
							"dom": '<"printButtons"B>rt<"' + id +
								'-paginate"ilp>',
							buttons: [{
									extend: 'print',
									text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
									exportOptions: {
										columns: '.isprint'
									},
									customize: function(win) {
										$(win.document.body)
											.find('h1')
											.css(
												"text-align",
												"center");
										$(win.document.body)
											.css("height",
												"auto");
									}
								},
								{
									extend: 'excelHtml5',
									text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
									exportOptions: {
										columns: '.isprint'
									},
									customize: function(xlsx) {
										var sheet = xlsx.xl.worksheets['sheet1.xml'];
									}
								}
							],
							"initComplete": function(settings,
								json) {
								$("#printTableData").html("");
								$("#printTableData").append(
									$(".printButtons"));

								$("#printTableData .buttons-print")
									.attr({
										"data-toggle": "tooltip",
										"title": "打印"
									});
								$("#printTableData .buttons-excel")
									.attr({
										"data-toggle": "tooltip",
										"title": "导出"
									});
								// 加入权限class

								var data = page.reslist;

								$("#printTableData .buttons-print")
									.addClass(
										" btn-permission btn-print");
								$("#printTableData .buttons-excel")
									.addClass(
										" btn-permission btn-export");
								//增加校验权限，是否删除btn-permission这个属性样式
								for(var i = 0; i < data.length; i++) {
									if(data[i].id == "btn-export" && data[i].flag !== "0") {
										$("#printTableData .buttons-excel")
											.removeClass(
												" btn-permission");
									}
									if(data[i].id == "btn-print" && data[i].flag !== "0") {
										$("#printTableData .buttons-print")
											.removeClass(
												" btn-permission");
									}
								}

								$('#printTableData.btn-group').css(
									"position", "inherit");
								$('#printTableData div.dt-buttons')
									.css("position", "inherit");
								$(
										'#printTableData [data-toggle="tooltip"]')
									.tooltip();

								var $info = $(toolBar + ' .info');
								if($info.length == 0) {
									$info = $(
											'<div class="info"></div>')
										.appendTo(
											$(toolBar +
												' .tool-bar-body'));
								}
								$info.html('');
								$('.' + id + '-paginate').appendTo(
									$info);

								if(pageLen != "" &&
									typeof(pageLen) != "undefined") {
									$('#' + id).DataTable().page
										.len(pageLen).draw(
											false);
									if(pageNum != "" &&
										typeof(pageNum) != "undefined") {
										$('#' + id)
											.DataTable()
											.page(
												parseInt(pageNum) - 1)
											.draw(false);
									}
								}

								$(".datatable-group-checkable")
									.prop("checked", false);
								$(".datatable-group-checkable")
									.on(
										'change',
										function() {
											var t = $(this)
												.is(
													":checked");
											$('.checkboxes')
												.each(
													function() {
														t ? $(
																this)
															.prop(
																"checked", !0) :
															$(
																this)
															.prop(
																"checked", !1);
														t ? $(
																this)
															.closest(
																'tr')
															.addClass(
																'selected') :
															$(
																this)
															.closest(
																'tr')
															.removeClass(
																'selected');
													});
											$(
													".datatable-group-checkable")
												.prop(
													"checked",
													t);

										});
								$('#agency-data').closest('.dataTables_wrapper').ufScrollBar({
									hScrollbar: true,
									mousewheel: false
								});
								//固定表头
								$("#agency-data").fixedTableHead();
								ufma.setBarPos($(window));
							},
							"drawCallback": function(settings) {
								ufma.setBarPos($(window));

								// 权限控制
								ufma.isShow(page.reslist);

								$('#' + id).find("thead th").eq(0)
									.removeClass("sorting_asc");

								$('#' + id)
									.find("td.dataTables_empty")
									.text("")
									.append(
										'<img src="' +
										bootPath +
										'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

								$(
										'#' +
										id +
										' .btn-addlower[data-toggle="tooltip"]')
									.tooltip();

								$('#' + id + ' .btn').on('click',
									function() {
										page._self = $(this);
									});
								$('#' + id + ' .btn-delete')
									.ufTooltip({
										content: '您确定删除当前单位吗？',
										onYes: function() {
											page
												.delRowOne(
													$(
														page._self)
													.attr(
														'action'), [$(
															page._self)
														.attr(
															'rowcode')
													],
													$(
														page._self)
													.closest(
														'tr'),
													$(
														page._self)
													.attr(
														'rowid'));
										},
										onNo: function() {}
									})
								$('#' + id + ' .btn-start')
									.ufTooltip({
										content: '您确定启用当前单位吗？',
										onYes: function() {
											page
												.delRowOne(
													$(
														page._self)
													.attr(
														'action'), [$(
															page._self)
														.attr(
															'rowcode')
													],
													$(
														page._self)
													.closest(
														'tr'));
										},
										onNo: function() {}
									})
								$('#' + id + ' .btn-stop')
									.ufTooltip({
										content: '您确定停用当前单位吗？',
										onYes: function() {
											page
												.delRowOne(
													$(
														page._self)
													.attr(
														'action'), [$(
															page._self)
														.attr(
															'rowcode')
													],
													$(
														page._self)
													.closest(
														'tr'));
										},
										onNo: function() {}
									})

							}
						});
					// 翻页取消勾选
					$('#' + id).on(
						'page.dt',
						function() {
							$(".datatable-group-checkable,.checkboxes")
								.prop("checked", false);
							$('#' + id).find("tbody tr.selected")
								.removeClass("selected");
						});
					ufma.hideloading();
				};
				ufma.get(portList.tableList, argu, callback);
			},

			// 删除、启用、停用、批量操作 增加下级
			delRow: function(action, idArray, $tr, chrIdArr) {
				var options = this.getInterface(action);
				page.pageNum = $('#agency-data_paginate').find(
					'span a.paginate_button.current').text();
				page.pageLen = parseInt($('#agency-data_length').find('select')
					.val());
				var argu = {};
				if(action == 'del') {
					var eleAgencys = [];
					for(var i = 0; i < idArray.length; i++) {
						var obj = {}
						obj.chrCode = idArray[i];
						obj.chrId = chrIdArr[i];
						eleAgencys.push(obj);
					}
					argu = {
						"eleAgencys": eleAgencys,
						"rgCode": ma.rgCode,
						"setYear": ma.setYear
					};
				} else {
					argu = {
						chrCodes: idArray,
						action: action
					};
				}
				var callback = function(result) {
					ufma.hideloading();
					if(action == 'del') {
						if($tr) {
							$tr.remove();
							ufma.showTip("删除成功！", function() {}, "success");
						} else
							page.getExpFunc(page.pageNum, page.pageLen);
						ufma.showTip(result.msg, function() {}, result.flag);
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled',
								action == "active");
							$tr.find('.btn[action="unactive"]').attr(
								'disabled', action == "unactive");
							page.getExpFunc(page.pageNum, page.pageLen);
						} else {
							page.getExpFunc(page.pageNum, page.pageLen);
						}
					}
				};
				var callbackcheck = function(result) {
					ufma.hideloading();
					if(result.success == "1") {
						ufma.confirm('您确定要删除选中的单位吗？', function(action) {
							if(action) {
								ufma.showloading('数据删除中，请耐心等待...');
								ufma.ajax(options.url, options.type, argu,
									callback);
							}
						}, {
							type: 'warning'
						});
					} else {
						var msg = "";
						for(var i = 0; i < result.ele_datas.length; i++) {
							if(result.ele_datas[i].datas != null) {
								for(var j = 0; j < result.ele_datas[i].datas.length; j++) {
									msg = msg +
										result.ele_datas[i].subsys +
										"子系统，" +
										result.ele_datas[i].datas[j].chr_code +
										"禁止删除！" + "\r\n";
								}
							} else {
								msg = msg + result.ele_datas[i].subsys + "子系统禁止删除！";
								if(result.ele_datas[i].msg != null) {
									msg = msg + result.ele_datas[i].msg;
								}
							}
						}
						ufma.showTip(msg, function() {}, 1);
					}
				};
				if(action == 'del') {
					var data = {};
					data["elementcode"] = "AGENCY";
					var ele_datas = [];
					for(var i = 0; i < argu.eleAgencys.length; i++) {
						var ceDTO = {};
						ceDTO["chr_id"] = argu.eleAgencys[0].chrId;
						ceDTO["ele_code"] = argu.eleAgencys[0].chrCode;
						ele_datas.push(ceDTO);
					}
					data["ele_datas"] = JSON.stringify(ele_datas);
					data["rg_code"] = argu.rgCode;
					data["year"] = argu.setYear;
					ufma.showloading('数据删除中，请耐心等待...');
					ufma.ajax("/df/fap/checkElement/check.do", "get", data,
						callbackcheck);
				} else if(action == 'addlower') {
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.eleCode = page.eleCode;
					newArgu.tableName = page.tableName;
					newArgu.agencyCode = page.agencyCode;
					ufma.showloading('正在增加下级，请耐心等待...');
					ufma.ajax(options.url, options.type, newArgu, function(
						result) {
						var data = result.data;
						ma.isRuled = true;
						$("#agency-chrCode").val(data).attr("disabled", true);
						page.action = "addlower";
						ufma.hideloading();
						page.openEdtWin();
					});
				} else if(action == 'active') {
					ufma.confirm('您确定要启用选中的单位吗？', function(action) {
						if(action) {
							ufma.showloading('数据启用中，请耐心等待...');
							argu.agencyCode = page.agencyCode;
							ufma
								.ajax(options.url, options.type, argu,
									callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'unactive') {
					ufma.confirm('您确定要停用选中的单位吗？', function(action) {
						if(action) {
							ufma.showloading('数据停用中，请耐心等待...');
							argu.agencyCode = page.agencyCode;
							ufma
								.ajax(options.url, options.type, argu,
									callback);
						}
					}, {
						type: 'warning'
					});
				}
			},
			delRowOne: function(action, idArray, $tr, chrIdArr) {
				var options = this.getInterface(action);
				page.pageNum = $('#agency-data_paginate').find(
					'span a.paginate_button.current').text();
				page.pageLen = parseInt($('#agency-data_length').find('select')
					.val());
				ufma.showloading('数据删除中，请耐心等待...');
				var argu = {};
				if(action == 'del') {
					var eleAgencys = [];
					for(var i = 0; i < idArray.length; i++) {
						var obj = {}
						obj.chrCode = idArray[i];
						// obj.chrId = chrIdArr[i];
						obj.chrId = chrIdArr;
						eleAgencys.push(obj);
					}
					argu = {
						"eleAgencys": eleAgencys,
						"rgCode": ma.rgCode,
						"setYear": ma.setYear
					};
				} else {
					argu = {
						chrCodes: idArray,
						action: action
					};
				}

				var callback = function(result) {
					if(action == 'del') {
						if($tr) {
							$tr.remove();
							ufma.hideloading();
							ufma.showTip("删除成功！", function() {}, "success");
						} else
							page.getExpFunc(page.pageNum, page.pageLen);
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled',
								action == "active");
							$tr.find('.btn[action="unactive"]').attr(
								'disabled', action == "unactive");
							page.getExpFunc(page.pageNum, page.pageLen);
						} else {
							page.getExpFunc(page.pageNum, page.pageLen);
						}
					}
				};
				if(action == 'del') {
					ufma.ajax(options.url, options.type, argu, callback);
				} else {
					argu.agencyCode = page.agencyCode;
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			getCheckedRows: function() {
				var checkedArray = [];
				$('#agency-data .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			getCheckedRowsId: function() {
				var checkedArray = [];
				$('#agency-data .checkboxes:checked').each(function() {
					checkedArray.push($(this).attr("rowid"));
				});
				return checkedArray;
			},
			openEdtWin: function(data) {
				page.initAccountClass();
				$('#ruleinfo').text('编码规则：' + ma.fjfa);
				$('#agency-help').html('');
				if(page.action == 'add' || page.action == 'addlower') {
					$("#agency-distCode").ufmaTreecombox().setValue("", "");
					$("#agency-currencyCode").ufmaTreecombox().setValue("", "");
					$("#agency-leaderCharge").ufmaTreecombox().setValue("", "");					
					$("#form-agency")
						.find(
							'input:not(#agency-chrCode,[name="isBudg"],[name="isFinancial"],[name="isSelf"],[name="isAcc"],[name="enabled"])')
						.val("");
					$("#form-agency").find(".btn-group").each(
						function() {
							$(this).find("label").eq(0).addClass("active")
								.find("input").attr("checked");
							$(this).find("label").eq(1).removeClass(
								"active").find("input").removeAttr(
								"checked");
						});
					$("#form-agency").find(".btn-group.isSelfGroup").find(
							"label").eq(1).addClass("active").find("input")
						.attr("checked");
					$("#form-agency").find(".btn-group.isSelfGroup").find(
							"label").eq(0).removeClass("active").find("input")
						.removeAttr("checked");
				}
				if(page.action == 'add') {
					// $("#form-agency").find("input").val("");
					ufma.comboxInitModal('agency-divKind');
					// 默认选中当前页签的值
					var atype = $("#agencyTypeLabel").find(".selected")
					var kindvalue = atype[0].getAttribute("value");
					var kindname = atype[0].innerText;
					var ops = document.getElementById("agency-divKind");
					for(i = 0; i < ops.length; i++) {
						if(ops.options[i].value == kindvalue) {
							ops.options[i].selected = true;
							// var divKindc = document
							// 	.getElementById("select2-agency-divKind-container");
							// divKindc.innerText = kindname;
							break;
						}
					}
				}
				if(page.action == 'edit' || page.action == 'addlower') {
					if($("#agency-chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode": thisCode,
							"tableName": page.tableName,
							"eleCode": page.eleCode,
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode
						}
						ma.nameTip = "";
						ufma.ajaxDef(portList.parentFullName, "post", obj,
							function(result) {
								ma.nameTip = result.data;
							});
					}
				}
				$('#agency-edt').find('.form-group').each(function() {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});
				//bugCWYXM-4106--要素为无编码规则时,基础数据维护,新增数据,保存时,提示新增无编码规则不符合分级规则--zsj
				var thisCode = $("#agency-chrCode").val();
				ma.codeValidator('agency-chrCode', '单位',
					portList.findParentList + '?eleCode=AGENCY&acctCode=*', page.agencyCode, page.acctCode,
					"agency-help");
				page.editor = ufma.showModal('agency-edt', 1090, 580);
				page.formdata = data;	
				if(page.action == 'add' || page.action == 'addlower') {				
					$("#agency-currencyCode").ufmaTreecombox().val("CNY");//默认人民币
					$("#agency-currencyCode").ufmaTreecombox().val("");
				}
			},

			bsAndEdt: function(data) {
				page.action = 'edit';
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					"chrCode": data.chrCode
				}
				ufma.get('/df/fap/agency/sys/eleAgency/queryList', argu, function(result) {
					if(!$.isNull(result.data) && result.data.length > 0) {
						page.maEleAgencyAccListData = [];
						page.maEleAgencyAccListData = result.data[0].maEleAgencyAccountList;
						page.initIlaccTable();
						//page.newIllegalTable(); 
					}
				})
				ufma.deferred(function() {
					$('#form-agency').setForm(data);
					$("#agency-distCode").ufmaTreecombox().setValue("", "");
					$("#agency-currencyCode").ufmaTreecombox().setValue("", "");
					$("#agency-leaderCharge").ufmaTreecombox().setValue("", "");
					page.initEnumData(data)
				});
				this.openEdtWin(data);
				page.setFormEnabled();
			},
			save: function(goon) {
				page.pageNum = $('#agency-data_paginate').find(
					'span a.paginate_button.current').text();
				page.pageLen = parseInt($('#agency-data_length').find('select')
					.val());

				var isShow = $('#agency-chrCode').attr('disabled');
				if(isShow == "disabled") {
					if(!ma.formValidator("", "", "单位", "add",
							"agency-orgCode", "组织机构代码")) {
						return false;
					}
				} else {
					if(!ma.formValidator("agency-chrCode", "agency-chrName",
							"单位", "add", "agency-orgCode", "组织机构代码")) {
						return false;
					}
				}

				var thisDistCode = $("#agency-distCode").ufmaTreecombox()
					.getValue();

				if(thisDistCode == "") {
					ufma.showTip("行政区划不能为空！", function() {}, "warning");
					return false;
				}
				var argu = $('#form-agency').serializeObject();
				var treeObj = $.fn.zTree.getZTreeObj("agency-leaderCharge_tree");
				var nodes = treeObj.getNodeByParam("id", argu.leaderCharge, null);
				if(nodes!=null&&nodes.length>0){
					if(nodes[0].is_user!="1"){
						ufma.showTip("分管领导请选择用户！", function() {}, "warning");
						return false;
					}
				}
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				var dist_name = $("#agency-distCode").ufmaTreecombox().getText();
				if(!$.isNull(dist_name)) {
					argu.distName = dist_name.split(' ')[1];
				}
				argu.maEleAgencyAccountList = page.serializeIllegal();
				if(page.maEleCurrentAccist == false) {
					return false;
				}
				if($("#agency-chrCode").val().length == parseInt(ma.fjfa
						.substring(0, 1))) {
					argu["chrFullname"] = $("#agency-chrName").val();
				} else {
					argu["chrFullname"] = ma.nameTip + "/" +
						$("#agency-chrName").val();
				}
				ufma.showloading('数据保存中，请耐心等待...');
				var callback = function(result) {
					$("[name='chrId']").val('');
					$("[name='lastVer']").val('');
					$('#agency-chrCode').removeAttr('disabled');
					page.getExpFunc(page.pageNum, page.pageLen);
					if(!goon) {
						ufma.hideloading();
						ufma.showTip('保存成功！', function() {}, 'success');
						$('#form-agency')[0].reset();
						page.editor.close();

					} else {
						ufma.hideloading();
						ufma.showTip('保存成功,您可以继续添加单位！', function() {}, 'success');
						$('#form-agency')[0].reset();
						$('#currentAccoTab tbody').html('');
						page.newIllegalTable();
						$("#agency-chrCode").removeAttr("disabled");
						$("#form-agency").find(".btn-group").each(
							function() {
								$(this).find("label").eq(0).addClass(
									"active").find("input").attr(
									"checked");
								$(this).find("label").eq(1).removeClass(
									"active").find("input").removeAttr(
									"checked");
							});
						$("#form-agency").find(".btn-group.isSelfGroup").find(
								"label").eq(1).addClass("active").find("input")
							.attr("checked");
						$("#form-agency").find(".btn-group.isSelfGroup").find(
							"label").eq(0).removeClass("active").find(
							"input").removeAttr("checked");
					}
					$("#agency-distCode").ufmaTreecombox().setValue("", "");
					$("#agency-currencyCode").ufmaTreecombox().setValue("", "");
					$("#agency-leaderCharge").ufmaTreecombox().setValue("", "");
				}
				ufma.post(portList.saveData, argu, callback);
			},
			setFormEnabled: function() {
				if(page.action == 'edit') {
					ma.isRuled = true;
					ma.isEdit = true; //bug77453
					$('#agency-chrCode').attr('disabled', 'disabled');

				} else if(page.action == 'add') {
					$('#agency-chrCode').removeAttr('disabled');
				}

				if(page.action == 'add') {
					$('#form-agency')[0].reset();
				}
			},
			//新增账户信息需求--张世洁--begin

			//初始化table
			newIllegalTable: function(rowData) {
				var $table = $('#currentAccoTab');
				//新增时，自动往后加
				var recNo = $table.find('tr').length;
				//修改时，为排序号
				//修改时，为排序号
				if(rowData) {
					recNo = rowData.index + 1;
				}
				var row =
					//顺序：序号recno、银行账户bankAccCode、账户名称bankAccName、账户类型accountClass、开户行banknodeName、网点行号banknodeCode、省份province、城市city、人行联行号pbcInterBankNo、操作
					'<tr>' +
					'<td class="text-center">' +
					'<input type="hidden" name="ilaccId" value="">' +
					'<span class="recno">' + recNo + '</span> ' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="bankAccCode" name="bankAccCode" style="border:none;background-color:transparent;outline-color: transparent;"/>' +
					'<label for="bankAccCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="bankAccName" name="bankAccName" style="border:none;background-color:transparent;outline-color: transparent;"/>' +
					'<label for="bankAccName" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox accountClass" name="accountClass"></div>' +
					'<label for="accountClass" class="control-label hide accountClassLabel"></label>' +
					'</div>' +
					'</td>' +
					//银行类别
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox bankCategoryCode" name="bankCategoryCode"  style="border:none;background-color:transparent;outline-color: transparent;maxlength="120";"></div>' +
					'<label for="bankCategoryCode" class="control-label hide" title=""></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<div class="ufma-combox form-combox banknodeName" name="banknodeName" style="border:none;background-color:transparent;outline-color: transparent;maxlength="120";"></div>' +
					'<label for="banknodeName" class="control-label hide" title=""></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="banknodeCode" name="banknodeCode" style="border:none;background-color:transparent;outline-color: transparent;"/>' +
					'<label for="banknodeCode" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="province" name="province" style="border:none;background-color:transparent;outline-color: transparent;"/>' +
					'<label for="province" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="city" name="city" style="border:none;background-color:transparent;outline-color: transparent;"/>' +
					'<label for="city" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'<td>' +
					'<div class="control-element">' +
					'<input type="text" class="pbcInterBankNo" name="pbcInterBankNo" style="border:none;background-color:transparent;outline-color: transparent;"/>' +
					'<label for="pbcInterBankNo" class="control-label hide"></label>' +
					'</div>' +
					'</td>' +
					'</tr>';
				var $row = $(row).appendTo($table);
				page.initIllegal($row);
				//初始化银行类别
				page.initBankType($row);
				// 初始化开户银行
				page.bankNameList = [];
				page.initBankname($row);
				//修改时显示数据
				if(rowData) {
					$row.find('input[name="bankAccCode"]').val(rowData.bankAccCode);
					$row.find('input[name="bankAccName"]').val(rowData.bankAccName);
					// $row.find('input[name="banknodeName"]').val(rowData.banknodeName);
					$row.find('label[for="bankCategoryCode"]').siblings('.bankCategoryCode').ufmaCombox().setValue(rowData.bankcategoryCode);
					//$row.find('label[for="banknodeName"]').siblings('.banknodeName').ufmaCombox().setValue(rowData.bankcode,rowData.bankcode+" "+rowData.banknodeName); //详情页直接给combox赋值
					if(rowData.bankcode==null||rowData.bankcode=="")
					$row.find('.banknodeName').find(".ufma-combox-input").val(rowData.banknodeName);
				else
					$row.find('.banknodeName').find(".ufma-combox-input").val(rowData.bankcode+" "+rowData.banknodeName);
					// $row.find('label[for="banknodeName"]').siblings('.banknodeName').ufmaCombox().setValue(rowData.bankcode, rowData.banknodeName); //详情页直接给combox赋值
					$row.find('input[name="province"]').val(rowData.province);
					$row.find('input[name="city"]').val(rowData.city);
					$row.find('input[name="banknodeCode"]').val(rowData.banknodeCode);
					$row.find('input[name="pbcInterBankNo"]').val(rowData.pbcInterBankNo);
					/* $row.find('.accountClass').find(".ufma-combox-input").val(rowData.accountClassName);
					$row.find('.accountClassLabel').html(rowData.accountClass); */
					for(key in page.acctClassData){						
						if(page.acctClassData[key].ENU_CODE==rowData.accountClass){
							$row.find('label[for="accountClass"]').siblings('.accountClass').ufmaCombox().setValue(page.acctClassData[key].ENU_CODE,page.acctClassData[key].codeName);
						break;
						}
					}
					//$row.find('label[for="accountClass"]').siblings('.accountClass').ufmaCombox().setValue(rowData.accountClass);
					$row.find('td.btnGroup .btnStart').removeClass('hide');
					$row.find('td.btnGroup .btnStop').removeClass('hide');
					page.rowEnable = rowData.enabled; //bugCWYXM-6109--修改单据状态--zsj
					// $row.find('.accountClassLabel').html(rowData.accountClass);
				}
				//调用操作按钮
				page.setIllegalGroupControl();
			},
			//请求银行类别列表
			getBankType: function () {
				var argu = {};
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				ufma.ajaxDef('/df/fap/agency/sys/eleAgency/selectBankCategoryTree', 'get', argu, function (result) {
					page.bankTypeList = result.data;
				});
			},
			//请求开户银行
			getBankname: function (bankCategoryCode) {
				var argu = {};
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				argu["bankCategoryCode"] = bankCategoryCode;
				ufma.ajaxDef('/df/fap/agency/sys/eleAgency/selectBankTree', 'get', argu, function (result) {
					page.bankNameList = result.data;
				});
			},
			//初始化银行类别
			initBankType: function ($tr) {
				function buildCombox() {
					$tr.find('.bankCategoryCode').each(function () {
						$(this).ufmaCombox({
							valueField: 'code',
							textField: 'codeName',
							name: 'code',
							data: page.bankTypeList,
							readOnly: true,
							onchange: function (node) {
								page.getBankname(node.code);
								page.initBankname($tr);
							}
						});
					})
				}
				buildCombox();
			},
			//初始化开户银行
			initBankname: function ($tr) {
				function buildCombox() {
					$tr.find('.banknodeName').each(function () {
						$(this).ufmaCombox({
							valueField: 'code',
							textField: 'codeName',
							name: 'code',
							data: page.bankNameList,
							readOnly: true,
							onchange: function (node) {
								$tr.find('input[name="banknodeCode"]').val(node.bankNo);
								$tr.find('input[name="province"]').val(node.province);
								$tr.find('input[name="city"]').val(node.city);
								$tr.find('input[name="pbcInterBankNo"]').val(node.pbcInterBankNo);
							}
						});
					})
				}
				buildCombox();
			},
			initIlaccTable: function() {
				$('#currentAccoTab tbody').html('');
				$.each(page.maEleAgencyAccListData, function(index, row) {
					if(row) {
						row.index = index;
						page.newIllegalTable(row);
					}
				});
			},
			initAccountClass: function() {
				var argu = {};
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				ufma.ajaxDef('/df/fap/agency/pub/enumerate/MA_ELE_AGENCY_ACCOUNT_ACCOUNT_CLASS', 'get', argu, function(result) {
					page.acctClassData = result.data;
				});
			},
			//初始化账户类型
			initIllegal: function($tr) {
				$tr.find('.accountClass').each(function() {
					$(this).ufmaCombox({
						valueField: 'ENU_CODE',
						textField: 'codeName',
						name: 'ENU_CODE',
						data: page.acctClassData,
						readOnly: false,
						onchange: function(data) {
							//带出该行账户类型
							/* $tr.find('.accountClass .ufma-combox-input').val(data.ENU_NAME);
							$tr.find('.accountClassLabel').html(data.ENU_CODE); */
						}
					});
				});
			},
			setIllegalGroupControl: function() {
				$('#currentAccoTab tbody tr').each(function() {
					var $tr = $(this);
					if($tr.find('td.btnGroup').length == 0) {
						$tr.append('<td class="nowrap btnGroup">' +
							'<a class="btn btn-icon-only btn-sm btnDel" data-toggle="tooltip" title="删除">' +
							'<span class="glyphicon icon-trash"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnStart" data-toggle="tooltip" title="启用" name="enabled">' +
							'<span class="glyphicon icon-play"></span>' +
							'</a>' +
							'<a class="btn btn-icon-only btn-sm btnStop hide" data-toggle="tooltip" title="停用" name="enabled">' +
							'<span class="glyphicon icon-ban"></span>' +
							'</a>' +
							'</td>');
						$tr.find('td.btnGroup .btn[data-toggle="tooltip"]').tooltip();
						$tr.find('td.btnGroup .btnDel').on('click', function(e) {
							e.stopPropagation();
							ufma.confirm("您确定要删除选中的数据吗？", function(e) {
								if(e) {
									$tr.remove();
								}
							}, {
								type: 'warning'
							});

						});
						//bugCWYXM-6109--修改单据状态--zsj
						if(page.rowEnable == 0) {
							$tr.find('td.btnGroup .btnStop').addClass('hide');
							$tr.find('td.btnGroup .btnStart').removeClass('hide');
						} else if(page.rowEnable == 1) {
							$tr.find('td.btnGroup .btnStart').addClass('hide');
							$tr.find('td.btnGroup .btnStop').removeClass('hide');
						}
						$tr.find('td.btnGroup .btnStart').on('click', function(e) {
							e.stopPropagation();
							$tr.find('td.btnGroup .btnStart').addClass('hide');
							$tr.find('td.btnGroup .btnStop').removeClass('hide');
						});
						$tr.find('td.btnGroup .btnStop').on('click', function(e) {
							e.stopPropagation();
							$tr.find('td.btnGroup .btnStop').addClass('hide');
							$tr.find('td.btnGroup .btnStart').removeClass('hide');
						});
					}
				});
			},
			//账户信息表格数据序列化
			serializeIllegal: function() {
				var aKJYS = [];
				var irow = 0;
				$('#currentAccoTab tbody tr').each(function(idx) {
					var bankAccCode = $(this).find('[name="bankAccCode"]').val();
					var bankAccName = $(this).find('[name="bankAccName"]').val();
					//var banknodeName = $(this).closest("tr").find(".banknodeName").find(".ufma-combox-text").val();
					var banknodeName = $(this).closest("tr").find(".banknodeName").find(".ufma-combox-input").val();
					var bankcode = $(this).closest("tr").find(".banknodeName").find(".ufma-combox-value").val();
					var bankCategoryCode = $(this).closest("tr").find(".bankCategoryCode").find(".ufma-combox-value").val();
					var banknodeCode = $(this).find('[name="banknodeCode"]').val();
					var tmpYS = {};
					if(!$.isNull(bankAccCode) || !$.isNull(bankAccName) || !$.isNull(banknodeName) || !$.isNull(banknodeCode)) {
						irow = irow + 1;
						if(!$.isNull(bankAccCode) && !$.isNull(bankAccName) && !$.isNull(banknodeName) && !$.isNull(banknodeCode)) {
							tmpYS.bankAccCode = bankAccCode;
							tmpYS.bankAccName = bankAccName;
							if(bankcode==null||bankcode=="")
							tmpYS.banknodeName = banknodeName;
							else
							tmpYS.banknodeName = banknodeName.split(" ")[1];
							tmpYS.bankcode = bankcode;
							tmpYS.bankCategoryCode = bankCategoryCode;
							tmpYS.banknodeCode = banknodeCode;
							tmpYS.accountClass =  $(this).closest("tr").find(".accountClass").find(".ufma-combox-value").val();
							//$(this).find('.accountClassLabel').html();
							tmpYS.accountClassName = $(this).find('.accountClass').find(".ufma-combox-input").val();
							tmpYS.province = $(this).find('[name="province"]').val();
							// tmpYS.banknodeName = $(this).find('[name="banknodeName"]').val();
							tmpYS.city = $(this).find('[name="city"]').val();
							tmpYS.pbcInterBankNo = $(this).find('[name="pbcInterBankNo"]').val();
							//如果是启用状态则显示停用标志，启用添加hide
							if($(this).find('td.btnGroup .btnStart').hasClass('hide')) {
								tmpYS.enabled = 1;
							} else {
								tmpYS.enabled = 0;
							}
							aKJYS.push(tmpYS);
							page.maEleCurrentAccist = true;
						} else {
							page.maEleCurrentAccist = false;
							if($.isNull(bankAccCode)) {
								ufma.showTip('请输入第' + irow + '行的银行账号', function() {}, 'warning');
								return false;
							}
							if($.isNull(bankAccName)) {
								ufma.showTip('请输入第' + irow + '行的账户名称', function() {}, 'warning');
								return false;
							}
							if($.isNull(bankCategoryCode)) {
								ufma.showTip('请在下拉列表中选择第' + irow + '行的银行类别数据', function() {}, 'warning');
								return false;
							}
							if ($.isNull(banknodeName)) {
								ufma.showTip('请在下拉列表中选择第' + irow + '行的开户行数据', function () { }, 'warning');
								return false;
							}
							/*ysdp:ZWCW01032830，经赵雪蕊确认去掉网点行号必填的校验--zsj
							 * 
							 * if($.isNull(banknodeCode)) {
								ufma.showTip('请输入第' + irow + '行的网点行号', function() {}, 'warning');
								return false;
							}*/
						}
					} else {
						$(this).remove();
					}

				});
				return aKJYS;
			},
			//新增账户信息需求--张世洁--end
			onEventListener: function() {
				$('#currentAccoMsg').on('click', function() {
					page.newIllegalTable();
				});
				// 列表页面表格行操作绑定
				$('#agency-data')
					.on(
						'click',
						'tbody td:not(.btnGroup)',
						function(e) {
							e.preventDefault();
							var $ele = $(e.target);
							if($ele.is('a')) {
								page.bsAndEdt($ele.data('href'));
								return false;
							}
							var $tr = $ele.closest('tr');
							var $input = $ele.closest('tr').find(
								'input[type="checkbox"]');
							var code = $input.val();
							if($tr.hasClass("selected")) {

								$ele
									.parents("tbody")
									.find("tr")
									.each(
										function() {
											var thisCode = $(
													this)
												.find(
													'input[type="checkbox"]')
												.val();
											if(thisCode
												.substring(
													0,
													code.length) == code) {
												$(this)
													.removeClass(
														"selected");
												$(this)
													.find(
														'input[type="checkbox"]')
													.prop(
														"checked",
														false);
											}
										})

							} else {

								$ele
									.parents("tbody")
									.find("tr")
									.each(
										function() {
											var thisCode = $(
													this)
												.find(
													'input[type="checkbox"]')
												.val();
											if(thisCode
												.substring(
													0,
													code.length) == code) {
												$(this)
													.addClass(
														"selected");
												$(this)
													.find(
														'input[type="checkbox"]')
													.prop(
														"checked",
														true);
											}
										})
							}

						});

				ufma.searchHideShow($('#agency-data'));

				$('.btn-add').on('click', function(e) {
					e.preventDefault();
					page.action = 'add';
					var data = $('#form-agency').serializeObject();
					// console.info(data);
					page.setFormEnabled();
					page.openEdtWin(data);
				});
				//单位管理新增需求：bug81379 --单位管理增加excel导入单位数据的功能，导入方式和其他基础资料保持一致--zsj
				$('.btn-imp').click(function() {
					var url = "/ma/general/excel/impEleDatas?eleCode=AGENCY&rgCode=" + ma.rgCode + "&agencyCode=*&setYear=" + ma.setYear;
					ufma.open({
						title: '单位管理导入',
						url: '../../pub/impXLS/impXLS.html',
						width: 800,
						height: 400,
						data: {
							eleName: '单位管理',
							eleCode: 'AGENCY',
							projectName: 'ma', //这里多加了一个参数，用于区分模板所属模块
							rgCode: pfData.svRgCode,
							agencyCode: '*',
							setYear: pfData.svSetYear,
							url: url
						},
						ondestory: function(rst) {
							page.getExpFunc();
						}
					});
				});
				$('.btn-cacheRefresh')
					.on(
						'click',
						function(e) {
							ufma.showTip('正在加载，请稍后...', function() {}, 'success');
							var tokenid = ufma.getCommonData().token;
							$('.btn-cacheRefresh')[0].disabled = true;
							$
								.ajax({
									url: "/df/elementConfig/cacheRefresh.do",
									type: 'get',
									dataType: 'json',
									data: {
										"ajax": "noCache"
									},
									success: function(data) {
										$('.btn-cacheRefresh')[0].disabled = false;
										ufma.showTip(
											'单位缓存已重新加载成功！',
											function() {}, 'success');
									}
								})

						});

				$('.btn-close').on('click', function() {
					// var tmpFormData = $('#form-agency').serializeObject();
					// if (!ufma.jsonContained(page.formdata, tmpFormData)) {
					// ufma.confirm('您修改了单位信息，关闭前是否保存？', function (action) {
					// if (action) {
					// page.save();
					// } else {
					// page.editor.close();
					// }
					// },{type:'warning'});
					// } else {
					page.editor.close();
					// }
				});
				// 保存
				$('.btn-saveadd').on('click', function() {
					page.save(true);
				});
				$('.btn-save').on('click', function() {
					page.save(false);
				});
				$(document).on('click', '.label-radio', function(e) {
					e = e || window.event;
					e.stopPropagation();
					ufma.deferred(function() {
						page.getExpFunc();
					});
				});
				$("body").on(
					"click",
					function() {
						// 编码验证
						/*ma.codeValidator('agency-chrCode', '单位',
							portList.findParentList + '?tableName='
							+ page.tableName, page.agencyCode,
							"agency-help");*/
						/*//修改传参错误问题
						ma.codeValidator('agency-chrCode', '单位',
							portList.findParentList + '?eleCode=AGENCY', page.agencyCode,
							"agency-help");*/
						// 名称验证
						ma.nameValidator('agency-chrName', '单位');
						// 组织机构代码验证
						ma.inputValidator("agency-orgCode", "组织机构代码");
					})

				// 校验单位电话只能输入数字
				$("#agency-telephone").on("keyup", function() {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				});
				// 校验邮政编码只能输入数字
				$("#agency-postCode").on("keyup", function() {
					$(this).val($(this).val().replace(/[^\d]/g, ''));
				});

				$('button.btn-deleteCheck').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					var checkedRowId = page.getCheckedRowsId();
					if(checkedRow.length == 0) {
						ufma.alert('请选择单位！', "warning");
						return false;
					}
					$("div.uf-tooltip").each(function() {
						$(this).hide();
					})
					page.delRow('del', checkedRow, "", checkedRowId);
				});
				$('button.btn-start').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择单位！', "warning");
						return false;
					}
					$("div.uf-tooltip").each(function() {
						$(this).hide();
					})
					page.delRow('active', checkedRow);
				});
				$('button.btn-stop').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择单位！', "warning");
						return false;
					}
					$("div.uf-tooltip").each(function() {
						$(this).hide();
					})
					page.delRow('unactive', checkedRow);
				});
				// 增加下级
				$('body').on('click', '.btn-addlower', function(e) {
					e.stopPropagation();
					var checkedRow = [];
					checkedRow.push($(this).parents("tr").find("input").val());
					page.delRow('addlower', checkedRow);
				});
			},

			// 初始化（行政区划、单位类型）枚举
			initEnum: function() {
				var argu = {
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				};
				ufma.ajaxDef(portList.distTree, "get", argu, function(result) {
					$("#agency-distCode").ufmaTreecombox({
						valueField: "id",
						textField: "codeName",
						data: result.data,
						leafRequire: false,
						readOnly: false
					})
				});
				ufma.ajaxDef(portList.currency, "get", argu, function(result) {
					$("#agency-currencyCode").ufmaTreecombox({
						valueField: "id",
						textField: "codeName",
						data: result.data,
						leafRequire: false,
						readOnly: false
					})
				});				
				ufma.ajaxDef(portList.leaderCharge, "get", argu, function(result) {
					$("#agency-leaderCharge").ufmaTreecombox({
						valueField: "id",
						textField: "codeName",
						data: result.data,
						leafRequire: false,
						readOnly: false
					})
				});
				ufma.comboxInitModal('agency-divKind');			

				var defaultOption = {
					"key": "",
					"value": "默认"
				};
				ufma.comboxInitModal('agency-areaZone',portList.areaZone,argu,defaultOption);
			},

			// 枚举项（行政区划、单位类型）显示
			initEnumData: function(curData) {
				$("#agency-distCode").ufmaTreecombox().val(curData.distCode);
				$("#agency-currencyCode").ufmaTreecombox().val(curData.currencyCode);
				if(curData.leaderCharge!=""){
				$("#agency-leaderCharge").ufmaTreecombox().val(curData.leaderCharge);	
				}else{
					var id="agency-leaderCharge";
					$('#' + id + '_value').val("");
					$('#' + id + '_text').val("");
					$('#' + id + '_input').val("");
					$('#' + id + '_input').attr('title', "");	
				}
				$("#agency-divKind").val(curData.divKind).trigger("change");
				//报错 ufma['agency-divKind'].val(curData.divKind).trigger("change");
			},

			// 初始化页面
			initPage: function() {
				// 获取单位类型
				page.reqAgencyType();
				page.rowEnable = 0;
				// 表格初始化
				this.getExpFunc();

				// 请求编码规则
				ma.initfifa(portList.codeRule, {
					//"tableName": page.tableName,
					"eleCode": "AGENCY",
					"rgCode": ma.rgCode,
					"setYear": ma.setYear
				}, function(result) {
					page.ruleData = result.data;
				});
				setTimeout(function() {
					$('#ruleinfo').text('编码规则：' + page.ruleData)
				}, 500)
				// 初始化（行政区划、单位类型）枚举
				page.initEnum();
			},

			init: function() {
				page.reslist = ufma.getPermission();

				this.initPage();
				this.onEventListener();
				page.getBankType();
				ufma.parse(page.namespace);
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});