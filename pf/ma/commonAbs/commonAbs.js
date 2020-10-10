$(function() {
	var pageLength = ufma.dtPageLength('#expfunc-data');
	var page = function() {
		var agencyCtrlLevel;
		var agencyCtrlLevelName;
		var acctAlldata;
		var sessionData = JSON.parse(window.sessionStorage.getItem("maobjData"))
		if(sessionData != undefined) {
			ufma.removeCache("maobjData");
		}
		var pageNum = '';
		var pageLen = '';
		return {
			system: '',
			agencyCode: "*",
			namespace: 'expFunc',
			get: function(tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			//雪蕊说暂时做不到 实现摘要绑定到科目上 先注释掉 guohx 20200528
			// initAccoTree: function() {
			// 	//根据单位账套重新加载会计科目
			// 	var url = '/gl/sys/coaAcc/getAccoTree/' + ma.setYear + '?agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&rgCode=' + ma.rgCode;

			// 	callback = function(result) {
			// 		page.acco = $("#accoCode").ufmaTreecombox({
			// 			valueField: 'id',
			// 			textField: 'codeName',
			// 			readOnly: false,
			// 			leafRequire: false,
			// 			popupWidth: 1.5,
			// 			data: result.data,
			// 			onchange: function(data) {},
			// 			initComplete: function(sender) {
			// 				if(!$.isNull(page.accoCode) && page.accoCode != '*' && !$.isNull(page.accoName)) {
			// 					page.acco.val(page.accoCode, page.accoName);
			// 				}
			// 			}
			// 		});
			// 	}
			// 	ufma.get(url, {}, callback);
			// },
			getInterface: function(action) {
				var urls = {
					select: {
						type: 'select',
						url: '/ma/desc/selectMaDescList?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					del: {
						type: 'delete',
						url: '/ma/desc/delete?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					active: {
						type: 'put',
						url: '/ma/desc/able?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					unactive: {
						type: 'put',
						url: '/ma/desc/able?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					save: {
						type: 'save',
						url: '/ma/desc/saveMaDesc'
					}
				}
				return urls[action];
			},
			initTable: function(result) {
				var id = "expfunc-data";
				var toolBar = $('#' + id).attr('tool-bar');
				$('#' + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"fixedHeader": {
						header: true
					},
					"data": result,
					"bFilter": true, //去掉搜索框
					"bLengthChange": true, //去掉每页显示多少条数据
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[10, 20, 50, 100, 200, -1],
						[10, 20, 50, 100, 200, "全部"]
					],
					"pageLength": pageLength, //默认每页显示100条
					"bInfo": true, //页脚信息
					"bSort": false, //排序功能
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bProcessing": true,
					"bDestroy": true,
					"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
								'class="datatable-group-checkable"/>&nbsp;<span></span> </label>',
							data: "descptId"
						},
						{
							title: "常用摘要编码",
							data: "descCode",
							className: "commonShow nowrap",
							"render": function(data, type, rowdata, meta) {
								if(!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return "";
								}
							}
						},
						{
							title: "常用摘要名称",
							data: "descName",
							className: "commonShow nowrap",
							"render": function(data, type, rowdata, meta) {
								var textIndent = '0';
								if(rowdata.levelNum) {
									textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
								}
								var alldata = JSON.stringify(rowdata);
								return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-id="' + alldata.descptId + '" data-href=\'' + alldata + '\'>' + data + '</a>';
							}
						},
						{
							title: "助记码",
							data: "assCode",
							className: "commonShow nowrap",
							"render": function(data, type, rowdata, meta) {
								if(!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return "";
								}
							}
						},
						{
							title: "系统",
							data: "system",
							className: "commonShow nowrap"
						},
						{
							title: "操作",
							data: 'isUsed'
						}
					],
					"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "checktd tc",
							"render": function(data, type, rowdata, meta) {
								return '<div class="checkdiv">' +
									'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [1, 2, 3, 4],
							"className": "isprint"
						},
						{
							"targets": [-2],
							"serchable": false,
							"orderable": false,
							"className": "text-center",
							"render": function(data, type, rowdata, meta) {
								if(data == 'GL') {
									return "账务处理";
								} else if(data == 'CU') {
									return "出纳管理";
								} else {
									return "";
								}
							}
						},
						{
							"targets": [-1],
							"serchable": false,
							"orderable": false,
							"className": "text-center nowrap btnGroup",
							"render": function(data, type, rowdata, meta) {
								var active = rowdata.isUsed == '1' ? 'hidden' : '';
								var unactive = rowdata.isUsed == '0' ? 'hidden' : '';
								return '<a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' + rowdata.descptId + '" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>';
							}
						}
					],
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: '.isprint'
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
								columns: '.isprint'
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					"initComplete": function(settings, json) {
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));
						$("#printTableData .buttons-print").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#printTableData .buttons-excel").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#expfunc-data'), '常用摘要');
						});
						//导出end
						//加入权限class
						$("#printTableData .buttons-print").addClass(" btn-permission btn-print");
						$("#printTableData .buttons-excel").addClass(" btn-permission btn-export");

						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();

						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						if(pageLen != "" && typeof(pageLen) != "undefined") {
							$('#' + id).DataTable().page.len(pageLen).draw(false);
							if(pageNum != "" && typeof(pageNum) != "undefined") {
								$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
							}
						}

						$(".datatable-group-checkable").prop("checked", false);
						$(".datatable-group-checkable").on('change', function() {
							var t = $(this).is(":checked");
							$('.checkboxes').each(function() {
								t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								//t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
							});
							$(".datatable-group-checkable").prop("checked", t);
						});
						//权限控制
						ufma.isShow(page.reslist);
						$('#expfunc-data').closest('.dataTables_wrapper').ufScrollBar({
							hScrollbar: true,
							mousewheel: false
						});
						//固定表头
						$("#expfunc-data").fixedTableHead();

					},
					"drawCallback": function(settings) {
						pageLength = ufma.dtPageLength('#expfunc-data');
						//权限控制
						ufma.isShow(page.reslist);

						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$('#' + id + ' .btn').on('click', function() {
							page._self = $(this);
						});
						$('#' + id + ' .btn-delete').ufTooltip({
							content: '您确定删除当前常用摘要吗？',
							onYes: function() {
								ufma.showloading('数据删除中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						})
						ufma.setBarPos($(window));
					}
				});
				//翻页取消勾选
				$('#' + id).on('page.dt', function() {
					$(".datatable-group-checkable,.checkboxes").prop("checked", false);
					$('#' + id).find("tbody tr.selected").removeClass("selected");
				});

			},
			getExpFunc: function() {
				var argu = $('#query-tj').serializeObject();
				page.system = argu.system;
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
					ufma.hideloading();
					page.initTable(result.data);
					ufma.setBarPos($(window));
				}
				page.queryList(argu, callback);
			},
			queryList: function(argu, callback) {
				ufma.get(this.getInterface('select').url + "&agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode, argu, callback);
			},

			//删除、启用、停用、批量操作  增加下级
			delRow: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					chrCodes: idArray,
					action: action,
					acctCode: page.acctCode,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode
				};
				var callback = function(result) {
					if(action == 'del') {
						if($tr)
							$tr.remove();
						else {
							page.getExpFunc();
						}
						if(result.flag == 'success') {

							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					}
				};
				if(action == 'del') {
					ufma.confirm('您确定要删除选中的常用摘要吗？', function(action) {
						if(action) {
							ufma.showloading('数据删除中，请耐心等待...');
							//单位级
							argu.agencyCode = page.agencyCode;
							argu.acctCode = page.acctCode;

							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				}
			},
			delRowOne: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				var argu = {
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					chrCodes: idArray,
					action: action,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				var callback = function(result) {
					if(action == 'del') {
						/*不重新加载，删除父亲结点
						if ($tr)
						    $tr.remove();
						else
						*/
						page.getExpFunc();
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					}
				};
				if(action == 'del') {
					//单位级
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					ufma.ajax(options.url, options.type, argu, callback);
				} else {
					//单位级
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},
			getCheckedRows: function() {
				var checkedArray = [];
				$('#expfunc-data .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			getChooseCheckedRows: function() {
				var checkedArray = [];
				$('#expfunc-choose-datatable .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			openEdtWin: function(data) {
				// page.accoCode = '';
				// page.accoName = '';
				//初始化级次
				if(page.action == 'edit') {
					page.descptId = data.descptId;
				}
				if(page.action == 'edit') {
					//ma.isEdit为true，编辑回显，校验编码不显示错误信息
					ma.isEdit = true;
				}
				if(page.action == 'edit') {
					var thisCode = $("#expFunc-chrCode").val();
					if($("#expFunc-chrCode") != "" && thisCode != "") {
						var obj = {
							"chrCode": thisCode,
							"tableName": "MA_ELE_EXPFUNC",
							"eleCode": "EXPFUNC",
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"acctCode": page.acctCode,
							"agencyCode": page.agencyCode,
							'descptId': page.descptId
						}
						ma.nameTip = "";
						if(data != undefined) {
							ma.nameTip = data.chrFullname;
						}
					}
				}
				$('.u-msg-footer button').removeAttr('disabled')
				if(page.action == 'add') {
					data.chrId = "";
					data.chrCode = "";
					data.chrName = "";
					$("form input[type='hidden']").val("");
				}

				page.editor = ufma.showModal('expfunc-edt', 560, 420);
				if(page.system === 'CU') {
					$('#CU').click();
					// $('#hideModel').addClass("hide");
					$('#CU').prop('checked', true);
					$('#GL').removeAttr('checked');
				} else {
					$('#GL').click();
					$('#GL').prop('checked', true);
					$('#CU').removeAttr('checked');
					// $('#hideModel').removeClass("hide");
					// page.accoCode = data.accoCode;
					// page.accoName = data.accoName;
					//$('#accoCode').getObj().val(data.accoCode);
				}

				page.formdata = data;
				if(page.formdata) {
					for(var i = 1; i < 6; i++) {
						if(page.formdata["field" + i] == null) {
							page.formdata["field" + i] = ''
						}
					}
				}

				if($('.btn-save').prop('display') == 'none') {
					$('#form-expfunc').disable()
				}
			},
			bsAndEdt: function(data) {
				page.action = 'edit';
				$('#expFunc-chrCode').attr('disabled', true);
				ufma.deferred(function() {
					$('#form-expfunc').setForm(data);
				});
				// page.initAccoTree();
				//CWYXM-7346 --基础资料中常用摘要的界面，新增后的常用摘要没有修改的入口，需要增加编辑修改功能--zsj
				if(page.action == 'edit') {
					setTimeout(function() {
						page.openEdtWin(data);
						page.setFormEnabled();
					}, 1500)
				} else {
					page.openEdtWin(data);
					page.setFormEnabled();
				}
			},
			save: function(goon) {
				pageNum = $('#expfunc-data_paginate').find('span a.paginate_button.current').text();
				pageLen = parseInt($('#expfunc-data_length').find('select').val());
				/*if(!ma.formValidator("expFunc-chrCode", "expFunc-chrName", "常用摘要", page.action)) {
					return false;
				}*/
				var argu = $('#form-expfunc').serializeObject();
				argu.agencyCode = page.agencyCode;
				//CWYXM-7346 --基础资料中常用摘要的界面，新增后的常用摘要没有修改的入口，需要增加编辑修改功能--zsj
				if($.isNull(argu.descCode) || $.isNull(argu.descName)) {
					ufma.showTip('必填项不能为空', function() {}, 'warning')
					return false;
				} else {
					var system = $("input[name='system']:checked").val();
					if(!system) {
						ufma.hideloading();
						ufma.showTip('请选择至少一种系统', function() {}, 'error')
						return;
					} else {
						if(system == 'CU') {
							// argu.accoCode = '';
							// argu.accoName = '';
							argu.system = system;
						} else {
							// var acco = $("#accoCode").ufmaTreecombox().getText();
							// if(!$.isNull(acco)) {
							// 	argu.accoName = acco.split(' ')[1];
							// }
						}
					}
					ufma.showloading('数据保存中，请耐心等待...');
					var callback = function(result) {
						ufma.hideloading();
						$("[name='chrId']").val('');
						$('#expFunc-chrCode').removeAttr('disabled');
						page.getExpFunc();
						if(!goon) {
							ufma.showTip('保存成功！', function() {}, 'success');
							$('#form-expfunc')[0].reset();
							page.editor.close();
							$('.form-group').removeClass('error')
							$('#expFunc-chrCode-help').remove()

						} else {
							ufma.showTip('保存成功,您可以继续添加常用摘要！', function() {}, 'success');
							$('#form-expfunc')[0].reset();
							$("#expFunc-chrCode").removeAttr("disabled");
							page.formdata = $('#form-expfunc').serializeObject();

							ma.fillWithBrother($('#expFunc-chrCode'), {
								"chrCode": argu.chrCode,
								"eleCode": "EXPFUNC",
								"agencyCode": page.agencyCode,
								"acctCode": page.acctCode
							});
							//CWYXM-7346 --基础资料中常用摘要的界面，新增后的常用摘要没有修改的入口，需要增加编辑修改功能--zsj
							if(page.system === 'CU') {
								$('#CU').click();
								// $('#hideModel').addClass("hide");
								$('#CU').prop('checked', true);
								$('#GL').removeAttr('checked');
							} else {
								$('#GL').click();
								$('#GL').prop('checked', true);
								$('#CU').removeAttr('checked');
								// $('#hideModel').removeClass("hide");
							}
						}
					}
					var url = "";
					if(page.agencyCode == "*") {
						argu.rgCode = ma.rgCode;
						argu.setYear = ma.setYear;
						argu.acctCode = '*';
						url = this.getInterface('save').url;
					} else {
						argu.rgCode = ma.rgCode;
						argu.setYear = ma.setYear;
						argu.acctCode = page.acctCode;
						url = this.getInterface('save').url;
					}
					if(page.action == 'edit') {
						argu.descptId = page.descptId;
					}
					ufma.post(url, argu, callback);
				}
			},
			setFormEnabled: function() {
				if(page.action == 'edit') {
					if($('body').data("code")) {
						if(page.agencyCtrlLevel == "0101" || page.agencyCtrlLevel == "0102") {
							$('#expFunc-chrName').attr('disabled', 'disabled');
							$("#expfunc-edt .btn-saveadd,#expfunc-edt .btn-save").hide();
						} else {
							$('#expFunc-chrName').removeAttr('disabled');
							$("#expfunc-edt .btn-saveadd,#expfunc-edt .btn-save").show();
						}
					} else {
						$('#expfunc-chrName').removeAttr('disabled');
						$("#expfunc-edt .btn-saveadd,#expfunc-edt .btn-save").show();
					}
					$(document).find('.form-group').each(function() {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
				} else if(page.action == 'add') {
					$('#expFunc-chrCode').removeAttr('disabled');
				}
				ma.isRuled = true;
				if(page.action == 'add') {
					$('#form-expfunc')[0].reset();
				}
			},
			onEventListener: function() {
				$('#expFunc-chrCode').on('blur', function() {
					$(this).val($(this).val().replace(/[\W]|_/g, ''));
				})
				//列表页面表格行操作绑定
				$('#expfunc-data').on('click', 'tbody td:not(.btnGroup)', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					page.action = 'edit';
					if($ele.is('a')) {
						page.bsAndEdt($ele.data('href'));
						return false;
					} else if($ele.parent().find('.checkboxes').hasClass('checkboxes')) {
						var t = $ele.parent().find('.checkboxes').is(":checked");
						$ele.parent().find('.checkboxes').prop("checked", !t);
						var num = 0;
						var arr = document.querySelectorAll('.checkboxes');
						for(var i = 0; i < arr.length; i++) {
							if(arr[i].checked) {
								num++;
							}
						}
						if(num == arr.length) {
							$(".datatable-group-checkable").prop('checked', true);
							$(".datatable-group-checkable").prop('checked', true);
						} else {
							$(".datatable-group-checkable").prop('checked', false);
							$(".datatable-group-checkable").prop('checked', false);
						}
					}
				});
				ma.searchHideShow('index-search', '#expfunc-data', 'searchHideBtn');

				$('.btn-add').on('click', function(e) {
					e.preventDefault();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						page.action = 'add';
						var data = $('#form-expfunc').serializeObject();
						page.setFormEnabled();
						page.openEdtWin(data);
					}
				});
				$('.btn-close').on('click', function() {
					var tmpFormData = $('#form-expfunc').serializeObject();
					if(!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') != 'none') {
						ufma.confirm('您修改了常用摘要信息，关闭前是否保存？', function(action) {
							if(action) {
								page.save(false);
							} else {
								page.editor.close();
								$('.form-group').removeClass('error')
								$('#expFunc-chrCode-help').remove()
							}
						}, {
							type: 'warning'
						});
					} else {
						page.editor.close();
						$('.form-group').removeClass('error')
						$('#expFunc-chrCode-help').remove()
					}
				});
				//保存
				$('.btn-saveadd').on('click', function() {
					page.save(true);
				});
				$('.btn-save').on('click', function() {
					page.save(false);
				});
				$('.btn-delete').on('click', function(e) {
					e.stopPropagation();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if(checkedRow.length == 0) {
							ufma.alert('请选择常用摘要！', "warning");
							return false;
						}
						page.delRow('del', checkedRow);
					}
				});
				$('#GL').on('click', function(e) {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						if(!$('#GL').is(":checked")) {
							// $('#hideModel').addClass("hide");
						} else {
							// $('#hideModel').removeClass("hide");
							$('#CU').removeAttr("checked");
						}
					}

				});
				$('#CU').on('click', function(e) {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						if($('#CU').is(":checked")) {
							// $('#hideModel').addClass("hide");
							$('#GL').prop("checked", false);
						}
					}

				});
				$('#sysSearch').on('change', function(e) {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						page.getExpFunc();
					}

				});
			},
			//获取要素的详细信息
			getEleDetail: function() {
				//if (isAcctLevel == '1') {
				ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
					"setYear": page.setYear,
					"rgCode": page.rgCode
				}, function(result) {
					var acctData = result.data;
					/*page.cbAcct = $("#cbAcct").ufmaTreecombox2({
						data: acctData,
					});*/
					if(acctData.length > 0) {
						page.chooseAcctFlag = false;
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
						onchange: function(data) {
							page.acctCode = data.code;
							page.acctName = data.name;
							page.accsCode = data.accsCode;
							page.accsName = data.accsName;
							$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
							if(page.chooseAcctFlag == false) {
								page.getExpFunc();
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
							if(!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
								page.cbAcct.setValue(page.acctCode, page.acctName);
							} else if(acctData.length > 0) {
								page.cbAcct.select(1);
							} else {
								page.cbAcct.val('');
								page.accsCode = '';
								page.acctCode = '';
								page.chooseAcctFlag = true;
								var data = [];
								page.initTable(data);
								ufma.showTip('请选择账套', function() {}, 'warning');
								return false;
							}
						}
					});
				});
			},
			//根据上级信息控制界面新增、选用、增加下级按钮,显示/隐藏
			parentCtrlBtn: function(ctrlName) {
				//请求上级控制信息
				var argu2 = {
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: "EXPFUNC",
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifaParent(argu2, function(data2) {
					page.agencyCtrlLevel2 = data2.agencyCtrllevel;
					var ctrlName2;
					if(page.agencyCtrlLevel2 == "0101") {
						//上下级公用下发,新增，选用，增加下级都隐藏（在表格的complete中做了控制）
						$(".btn-add").hide();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0102") {
						//上下级公用选用，新增隐藏，选用显示，增加下级隐藏（在表格的complete中做了控制）
						$(".btn-add").hide();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0201") {
						//下级细化可增加一级，选用不强制，新增显示，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0202") {
						//下级细化不可增加一级，新增显示，选用不强制，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "03") {
						$(".btn-add").show();
						ctrlName2 = data2.agencyCtrlName;
					}

					//控制信息提示
					var newCtrlInfor = "提示：";
					newCtrlInfor = newCtrlInfor + ctrlName;
					$(".table-sub-info").html(newCtrlInfor);
					//表格初始化
					page.getExpFunc();
				});
			},

			//初始化页面
			initPage: function() {
				setTimeout(function() {

					//名称验证
					ma.nameValidator('expFunc-chrName', '常用摘要');
				}, 300);
				//获取要素上级控制信息
			},
			//初始化单位
			initAgencyCode: function() {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
					leafRequire: false,
					onchange: function(data) {
						// page.agencyCode = page.cbAgency.getValue();
						page.agencyCode = data.code;
						page.agencyName = data.name;
						page.acctCode = '';
						page.acctName = '';
						page.accsCode = '';
						page.accsName = '';
						page.getEleDetail();
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);

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
						if(page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
							page.cbAgency.val(page.agencyCode);
						} else {
							page.cbAgency.val(1);
						}
					}
				});
			},
			init: function() {
				//获取session
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.reslist = ufma.getPermission();
				page.chooseAcctFlag = false;
				var data = [];
				page.initTable(data);
				ufma.parseScroll();
				if($('body').data("code")) {
					page.initAgencyCode();

				} else {
					page.agencyCode = "*";
					page.acctCode = "*";
				}
				this.initPage();
				this.onEventListener();
				ufma.parse(page.namespace);

				//请求自定义属性
				//				reqFieldList(page.agencyCode, "EXPFUNC");
			}
		}
	}();

	page.init();
});