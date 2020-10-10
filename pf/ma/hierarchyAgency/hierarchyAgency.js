﻿﻿$(function() {
	var page = function() {

		// 单位管理接口
		var portList = {
			agencyType : "/ma/pub/enumerate/AGENCY_TYPE_CODE",// 单位类型列表
			tableList : "/ma/sys/eleAgency/queryAgencyList",// 请求表格数据列表
			deleteData : "/ma/sys/eleAgency/delete",// 删除数据
			ableData : "/ma/sys/eleAgency/able",// 停用启用数据
			addlowerData : "/ma/sys/common/getMaxLowerCode",// 获取最大可增加下级编码
			codeRule : "/ma/sys/element/getElementCodeRule",// 获取编码规则
			parentFullName : "/ma/sys/common/getParentChrFullname",// 获取父级的全称
			saveData : "/ma/sys/eleAgency/save",// 保存数据
			findParentList : "/ma/sys/common/findParentList",// 获取参考信息
			distTree : "/ma/sys/eleAgency/distTree"// 获取行政区划树
		};

		return {
			namespace : 'agency',
			agencyCode : "*",
			tableName : "MA_ELE_AGENCY",
			eleCode : "AGENCY",
			get : function(tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			getInterface : function(action) {
				var urls = {
					del : {
						type : 'delete',
						url : portList.deleteData
					},
					active : {
						type : 'put',
						url : portList.ableData
					},
					unactive : {
						type : 'put',
						url : portList.ableData
					},
					addlower : {
						type : 'post',
						url : portList.addlowerData
					}
				}
				return urls[action];
			},
			reqAgencyType : function() {
				var argu = {
					"rgCode" : ma.rgCode,
					"setYear" : ma.setYear
				};
				var $obj = $('#agencyTypeLabel');
				$obj.find(':not(.label-radio[value=""])').remove();
				var labelGroup = '';
				var callback = function(result) {
					$.each(result.data, function(idx, item) {
						labelGroup += '<a name="divKind" value="'
								+ item.ENU_CODE
								+ '" class="label label-radio">'
								+ item.ENU_NAME + '</a>';
					});
					$(labelGroup).appendTo($obj);
				}
				ufma.get(portList.agencyType, argu, callback);
			},

			getExpFunc : function(pageNum, pageLen) {
				//lc====获取用户所在单位的具体值
				//单位编码
				var agency_code=JSON.parse(localStorage.commonData).svAgencyCode;
				//单位名称
				var agency_name=JSON.parse(localStorage.commonData).svAgencyName;
				
				var argu = $('#query-tj').serializeObject();
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;
				//lc
				argu.agency_code=agency_code;
				
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
					var id = "agency-data";
					var toolBar = $('#' + id).attr('tool-bar');
					$("#" + id).dataTable().fnDestroy();
					$('#' + id)
							.DataTable(
									{
										"language" : {
											"url" : bootPath
													+ "agla-trd/datatables/datatable.default.js"
										},
										"fixedHeader" : {
											header : true
										},
										"data" : result.data,
										"ordering" : false,
										"bFilter" : true, // 去掉搜索框
										"bLengthChange" : true, // 去掉每页显示多少条数据
										"processing" : true, // 显示正在加载中
										"pagingType" : "full_numbers", // 分页样式
										"lengthChange" : true, // 是否允许用户自定义显示数量p
										"lengthMenu" : [
												[ 10, 20, 50, 100, 200, -1 ],
												[ 10, 20, 50, 100, 200, "全部" ] ],
										"pageLength" : 20,
										"bInfo" : true, // 页脚信息
										"bAutoWidth" : false, // 表格自定义宽度，和swidth一起用
										"bDestroy" : true,
										"columns" : [
												{
													title : '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"'
															+ 'class="datatable-group-checkable"/>&nbsp;<span></span> </label>',
													data : "chrCode"
												}, {
													title : "单位编码",
													data : "chrCode"
												}, {
													title : "单位名称",
													data : "chrName"
												}, {
													title : "单位类型",
													data : "divName"
												}, {
													title : "单位负责人",
													data : "enCharge"
												}, {
													title : "财务负责人",
													data : "financeCharge"
												}, {
													title : "状态",
													data : "enabled"
												}, {
													title : "操作",
													data : 'chrCode'
												} ],
										"columnDefs" : [
												{
													"targets" : [ 0 ],
													"serchable" : false,
													"orderable" : false,
													"className" : "checktd",
													"render" : function(data,
															type, rowdata, meta) {
														return '<div class="checkdiv"></div>'
																+ '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> '
																+ '<input type="checkbox" class="checkboxes" value="'
																+ data
																+ '" rowid="'
																+ rowdata.chrId
																+ '"/> &nbsp;'
																+ '<span></span> </label>';
													}
												},
												{
													"targets" : [ 1, 3, 4, 5, 6 ],
													"className" : "isprint"
												},
												{
													"targets" : [ 2 ],
													"serchable" : false,
													"orderable" : false,
													"className" : "nowrap isprint",
													"render" : function(data,
															type, rowdata, meta) {
														var textIndent = '0';
														if (rowdata.levelNum) {
															textIndent = (parseInt(rowdata.levelNum) - 1)
																	+ 'em';
														}
														var alldata = JSON
																.stringify(rowdata);
														return '<a style="display:block;text-indent:'
																+ textIndent
																+ '" href="javascript:;" data-href=\''
																+ alldata
																+ '\'>'
																+ data
																+ '</a>';
													}
												},
												{
													"targets" : [ 6 ],
													"render" : function(data,
															type, rowdata, meta) {
														if (rowdata.enabled == 1) {
															return '<span style="color:#00A854">启用</span>';
														} else {
															return '<span style="color:#F04134">停用</span>';
														}

													}
												},
												{
													"targets" : [ -1 ],
													"serchable" : false,
													"orderable" : false,
													"className" : "text-center nowrap btnGroup",
													"render" : function(data,
															type, rowdata, meta) {
														var active = rowdata.enabled == 1 ? 'none'
																: 'inline-block';
														var unactive = rowdata.enabled == 0 ? 'none'
																: 'inline-block';

														return '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" action= "addlower" rowcode="'
																+ data
																+ '" title="增加下级">'
																+ '<span class="glyphicon icon-add-subordinate"></span></a>'
																+ '<a class="btn btn-icon-only btn-sm btn-permission btn-start" style="display:'
																+ active
																+ '" data-toggle="tooltip" action= "active" rowcode="'
																+ data
																+ '" title="启用">'
																+ '<span class="glyphicon icon-play"></span></a>'
																+ '<a class="btn btn-icon-only btn-sm btn-permission btn-stop" style="display:'
																+ unactive
																+ '" data-toggle="tooltip" action= "unactive" rowcode="'
																+ data
																+ '" title="停用">'
																+ '<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="'
																+ data
																+ '" rowid="'
																+ rowdata.chrId
																+ '" title="删除">'
																+ '<span class="glyphicon icon-trash"></span></a>';
													}
												} ],
										"dom" : '<"printButtons"B>rt<"' + id
												+ '-paginate"ilp>',
										buttons : [
												{
													extend : 'print',
													text : '<i class="glyphicon icon-print" aria-hidden="true"></i>',
													exportOptions : {
														columns : '.isprint'
													},
													customize : function(win) {
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
													extend : 'excelHtml5',
													text : '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
													exportOptions : {
														columns : '.isprint'
													},
													customize : function(xlsx) {
														var sheet = xlsx.xl.worksheets['sheet1.xml'];
													}
												} ],
										"initComplete" : function(settings,
												json) {
											$("#printTableData").html("");
											$("#printTableData").append(
													$(".printButtons"));

											$("#printTableData .buttons-print")
													.attr(
															{
																"data-toggle" : "tooltip",
																"title" : "打印"
															});
											$("#printTableData .buttons-excel")
													.attr(
															{
																"data-toggle" : "tooltip",
																"title" : "导出"
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
												if(data[i].flag == "0") {
				$("." + data[i].id).remove();
				//				console.log(data[i].id+"没有权限！");
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
											if ($info.length == 0) {
												$info = $(
														'<div class="info"></div>')
														.appendTo(
																$(toolBar
																		+ ' .tool-bar-body'));
											}
											$info.html('');
											$('.' + id + '-paginate').appendTo(
													$info);

											if (pageLen != ""
													&& typeof (pageLen) != "undefined") {
												$('#' + id).DataTable().page
														.len(pageLen).draw(
																false);
												if (pageNum != ""
														&& typeof (pageNum) != "undefined") {
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
																									"checked",
																									!0)
																							: $(
																									this)
																									.prop(
																											"checked",
																											!1);
																					t ? $(
																							this)
																							.closest(
																									'tr')
																							.addClass(
																									'selected')
																							: $(
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

										},
										"drawCallback" : function(settings) {
											ufma.setBarPos($(window));

											// 权限控制
											ufma.isShow(page.reslist);

											$('#' + id).find("thead th").eq(0)
													.removeClass("sorting_asc");

											$('#' + id)
													.find("td.dataTables_empty")
													.text("")
													.append(
															'<img src="'
																	+ bootPath
																	+ 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

											$(
													'#'
															+ id
															+ ' .btn-addlower[data-toggle="tooltip"]')
													.tooltip();

											$('#' + id + ' .btn').on('click',
													function() {
														page._self = $(this);
													});
											$('#' + id + ' .btn-delete')
													.ufTooltip(
															{
																content : '您确定删除当前单位吗？',
																onYes : function() {
																	page
																			.delRowOne(
																					$(
																							page._self)
																							.attr(
																									'action'),
																					[ $(
																							page._self)
																							.attr(
																									'rowcode') ],
																					$(
																							page._self)
																							.closest(
																									'tr'),
																					$(
																							page._self)
																							.attr(
																									'rowid'));
																},
																onNo : function() {
																}
															})
											$('#' + id + ' .btn-start')
													.ufTooltip(
															{
																content : '您确定启用当前单位吗？',
																onYes : function() {
																	page
																			.delRowOne(
																					$(
																							page._self)
																							.attr(
																									'action'),
																					[ $(
																							page._self)
																							.attr(
																									'rowcode') ],
																					$(
																							page._self)
																							.closest(
																									'tr'));
																},
																onNo : function() {
																}
															})
											$('#' + id + ' .btn-stop')
													.ufTooltip(
															{
																content : '您确定停用当前单位吗？',
																onYes : function() {
																	page
																			.delRowOne(
																					$(
																							page._self)
																							.attr(
																									'action'),
																					[ $(
																							page._self)
																							.attr(
																									'rowcode') ],
																					$(
																							page._self)
																							.closest(
																									'tr'));
																},
																onNo : function() {
																}
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
			delRow : function(action, idArray, $tr, chrIdArr) {
				var options = this.getInterface(action);
				page.pageNum = $('#agency-data_paginate').find(
						'span a.paginate_button.current').text();
				page.pageLen = parseInt($('#agency-data_length').find('select')
						.val());
				var argu = {};
				if (action == 'del') {
					var eleAgencys = [];
					for (var i = 0; i < idArray.length; i++) {
						var obj = {}
						obj.chrCode = idArray[i];
						obj.chrId = chrIdArr[i];
						eleAgencys.push(obj);
					}
					argu = {
						"eleAgencys" : eleAgencys,
						"rgCode" : ma.rgCode,
						"setYear" : ma.setYear
					};
				} else {
					argu = {
						chrCodes : idArray,
						action : action
					};
				}
				var callback = function(result) {
					if (action == 'del') {
						if ($tr){
							$tr.remove();
							ufma.showTip("删除成功！", function() {
							}, "success");
						}
						else
							page.getExpFunc(page.pageNum, page.pageLen);
						ufma.showTip(result.msg, function() {
						}, result.flag);
					} else {
						if ($tr) {
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
					if (result.success == "1") {
						ufma.confirm('您确定要删除选中的单位吗？', function(action) {
							if (action) {
								ufma.ajax(options.url, options.type, argu,
										callback);
							}
						}, {
							type : 'warning'
						});
					} else {
						var msg = "";
						for (var i = 0; i < result.ele_datas.length; i++) {
							if (result.ele_datas[i].datas != null) {
								for (var j = 0; j < result.ele_datas[i].datas.length; j++) {
									msg = msg
											+ result.ele_datas[i].subsys
											+ "子系统，"
											+ result.ele_datas[i].datas[j].chr_code
											+ "禁止删除！" + "\r\n";
								}
							} else {
								msg = msg + result.ele_datas[i].subsys
										+ "子系统禁止删除！";
							}
						}
						ufma.showTip(msg, function() {
						}, 1);
					}
				};
				if (action == 'del') {
					var data = {};
					data["elementcode"] = "AGENCY";
					var ele_datas = [];
					for (var i = 0; i < argu.eleAgencys.length; i++) {
						var ceDTO = {};
						ceDTO["chr_id"] = argu.eleAgencys[0].chrId;
						ceDTO["ele_code"] = argu.eleAgencys[0].chrCode;
						ele_datas.push(ceDTO);
					}
					data["ele_datas"] = JSON.stringify(ele_datas);
					data["rg_code"] = argu.rgCode;
					data["year"] = argu.setYear;
					ufma.ajax("/df/fap/checkElement/check.do", "get", data,
							callbackcheck);
				} else if (action == 'addlower') {
					var newArgu = {}
					newArgu.chrCode = argu.chrCodes[0];
					newArgu.eleCode = page.eleCode;
					newArgu.tableName = page.tableName;
					newArgu.agencyCode = page.agencyCode;
					ufma.ajax(options.url, options.type, newArgu, function(
							result) {
						var data = result.data;
						ma.isRuled = true;
						$("#agency-chrCode").val(data).attr("disabled", true);

						page.action = "addlower";
						page.openEdtWin();
					});
				} else if (action == 'active') {
					ufma.confirm('您确定要启用选中的单位吗？', function(action) {
						if (action) {
							argu.agencyCode = page.agencyCode;
							ufma
									.ajax(options.url, options.type, argu,
											callback);
						}
					}, {
						type : 'warning'
					});
				} else if (action == 'unactive') {
					ufma.confirm('您确定要停用选中的单位吗？', function(action) {
						if (action) {
							argu.agencyCode = page.agencyCode;
							ufma
									.ajax(options.url, options.type, argu,
											callback);
						}
					}, {
						type : 'warning'
					});
				}
			},
			delRowOne : function(action, idArray, $tr, chrIdArr) {
				var options = this.getInterface(action);
				page.pageNum = $('#agency-data_paginate').find(
						'span a.paginate_button.current').text();
				page.pageLen = parseInt($('#agency-data_length').find('select')
						.val());
				var argu = {};
				if (action == 'del') {
					var eleAgencys = [];
					for (var i = 0; i < idArray.length; i++) {
						var obj = {}
						obj.chrCode = idArray[i];
						// obj.chrId = chrIdArr[i];
						obj.chrId = chrIdArr;
						eleAgencys.push(obj);
					}
					argu = {
						"eleAgencys" : eleAgencys,
						"rgCode" : ma.rgCode,
						"setYear" : ma.setYear
					};
				} else {
					argu = {
						chrCodes : idArray,
						action : action
					};
				}

				var callback = function(result) {
					if (action == 'del') {
						if ($tr){
							$tr.remove();
							ufma.showTip("删除成功！", function() {
							}, "success");
						}
						else
							page.getExpFunc(page.pageNum, page.pageLen);
					} else {
						if ($tr) {
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
				if (action == 'del') {
					ufma.ajax(options.url, options.type, argu, callback);
				} else {
					argu.agencyCode = page.agencyCode;
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			getCheckedRows : function() {
				var checkedArray = [];
				$('#agency-data .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			getCheckedRowsId : function() {
				var checkedArray = [];
				$('#agency-data .checkboxes:checked').each(function() {
					checkedArray.push($(this).attr("rowid"));
				});
				return checkedArray;
			},
			openEdtWin : function(data) {
				if (page.action == 'add' || page.action == 'addlower') {
					$("#agency-distCode").ufmaTreecombox().setValue("", "");
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
				if (page.action == 'add') {
					// $("#form-agency").find("input").val("");
					ufma.comboxInit('agency-divKind');
					// 默认选中当前页签的值
					var atype = $("#agencyTypeLabel").find(".selected")
					var kindvalue = atype[0].getAttribute("value");
					var kindname = atype[0].innerText;
					var ops = document.getElementById("agency-divKind");
					for (i = 0; i < ops.length; i++) {
						if (ops.options[i].value == kindvalue) {
							ops.options[i].selected = true;
							var divKindc = document
									.getElementById("select2-agency-divKind-container");
							divKindc.innerText = kindname;
							break;
						}
					}
				}
				if (page.action == 'edit' || page.action == 'addlower') {
					var thisCode = $("#agency-chrCode").val();
					if ($("#agency-chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode" : thisCode,
							"tableName" : page.tableName,
							"eleCode" : page.eleCode,
							"rgCode" : ma.rgCode,
							"setYear" : ma.setYear,
							"agencyCode" : page.agencyCode
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

				page.editor = ufma.showModal('agency-edt', 1090, 580);
				page.formdata = data;
			},

			bsAndEdt : function(data) {
				page.action = 'edit';
				ufma.deferred(function() {
					$('#form-agency').setForm(data);
					$("#agency-distCode").ufmaTreecombox().setValue("", "");
					page.initEnumData(data)
				});
				this.openEdtWin(data);
				page.setFormEnabled();
			},
			save : function(goon) {
				page.pageNum = $('#agency-data_paginate').find(
						'span a.paginate_button.current').text();
				page.pageLen = parseInt($('#agency-data_length').find('select')
						.val());

				var isShow = $('#agency-chrCode').attr('disabled');
				// console.info(isShow);
				if (isShow == "disabled") {
					if (!ma.formValidator("", "", "单位", "add",
							"agency-orgCode", "组织机构代码")) {
						return false;
					}
				} else {
					if (!ma.formValidator("agency-chrCode", "agency-chrName",
							"单位", "add", "agency-orgCode", "组织机构代码")) {
						return false;
					}
				}

				var thisDistCode = $("#agency-distCode").ufmaTreecombox()
						.getValue();
				// console.info(thisDistCode);
				if (thisDistCode == "") {
					ufma.showTip("行政区划不能为空！", function() {
					}, "warning");
					
					return false;
				}
				var argu = $('#form-agency').serializeObject();
				// console.info(argu);
				argu.rgCode = ma.rgCode;
				argu.setYear = ma.setYear;

				if ($("#agency-chrCode").val().length == parseInt(ma.fjfa
						.substring(0, 1))) {
					argu["chrFullname"] = $("#agency-chrName").val();
				} else {
					argu["chrFullname"] = ma.nameTip + "/"
							+ $("#agency-chrName").val();
				}

				var callback = function(result) {
					$("[name='chrId']").val('');
					$("[name='lastVer']").val('');
					$('#agency-chrCode').removeAttr('disabled');
					page.getExpFunc(page.pageNum, page.pageLen);
					if (!goon) {
						ufma.showTip('保存成功！', function() {
						}, 'success');
						$('#form-agency')[0].reset();
						page.editor.close();

					} else {
						ufma.showTip('保存成功,您可以继续添加单位！', function() {
						}, 'success');
						$('#form-agency')[0].reset();
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
				}
				if (!ma.formValidator("agency-chrCode", "agency-chrName",
						"单位", "add", "agency-orgCode", "组织机构代码")) {
					return false;
				}else{
			ufma.post(portList.saveData, argu, callback);}
			},
			setFormEnabled : function() {
				if (page.action == 'edit') {
					ma.isRuled = true;
					$('#agency-chrCode').attr('disabled', 'disabled');

				} else if (page.action == 'add') {
					$('#agency-chrCode').removeAttr('disabled');
				}

				if (page.action == 'add') {
					$('#form-agency')[0].reset();
				}
			},

			onEventListener : function() {
				// 列表页面表格行操作绑定
				$('#agency-data')
						.on(
								'click',
								'tbody td:not(.btnGroup)',
								function(e) {
									e.preventDefault();
									var $ele = $(e.target);
									if ($ele.is('a')) {
										page.bsAndEdt($ele.data('href'));
										return false;
									}
									var $tr = $ele.closest('tr');
									var $input = $ele.closest('tr').find(
											'input[type="checkbox"]');
									var code = $input.val();
									if ($tr.hasClass("selected")) {

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
															if (thisCode
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
															if (thisCode
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
				$('.btn-cacheRefresh')
						.on(
								'click',
								function(e) {
									ufma.showTip('正在加载，请稍后...', function() {
									}, 'success');
									var tokenid = ufma.getCommonData().token;
									$('.btn-cacheRefresh')[0].disabled = true;
									$
											.ajax({
												url : "/df/elementConfig/cacheRefresh.do",
												type : 'get',
												dataType : 'json',
												data : {
													"ajax" : "noCache"
												},
												success : function(data) {
													$('.btn-cacheRefresh')[0].disabled = false;
													ufma.showTip(
															'单位缓存已重新加载成功！',
															function() {
															}, 'success');
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
							ma.codeValidator('agency-chrCode', '单位',
									portList.findParentList + '?tableName='
											+ page.tableName, page.agencyCode,
									"agency-help");
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
					if (checkedRow.length == 0) {
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
					if (checkedRow.length == 0) {
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
					if (checkedRow.length == 0) {
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
			initEnum : function() {
				ufma.ajaxDef(portList.distTree, "get", "", function(result) {
					$("#agency-distCode").ufmaTreecombox({
						valueField : "id",
						textField : "codeName",
						data : result.data,
						leafRequire : false,
						readOnly : false
					})
				})
				ufma.comboxInit('agency-divKind');
			},

			// 枚举项（行政区划、单位类型）显示
			initEnumData : function(curData) {
				$("#agency-distCode").ufmaTreecombox().val(curData.distCode);
				ufma['agency-divKind'].val(curData.divKind).trigger("change");
			},

			// 初始化页面
			initPage : function() {
				// 获取单位类型
				page.reqAgencyType();

				// 表格初始化
				this.getExpFunc();

				// 请求编码规则
				ma.initfifa(portList.codeRule, {
					"tableName" : page.tableName,
					"rgCode" : ma.rgCode,
					"setYear" : ma.setYear
				});

				// 初始化（行政区划、单位类型）枚举
				page.initEnum();
			},

			init : function() {
				page.reslist = ufma.getPermission();

				this.initPage();
				this.onEventListener();
				ufma.parse(page.namespace);
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});