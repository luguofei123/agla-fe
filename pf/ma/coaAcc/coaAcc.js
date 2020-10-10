$(function () {
	var page = function () {
		var accsCode, accsName, acceCode, acceName, agencyTypeCode, diffAgencyType;
		var acctAlldata;
		return {

			openEditHtm: function (data) {
				var newIsParallel = "0";
				if ($('body').data("code") && page.isLeaf != 0) {
					//有账套且是叶子节点
					if (page.isParallel == 1) {
						newIsParallel = "1";
					}
				} else if (page.accaCount == 2) {
					//没有账套
					newIsParallel = "1";
				}
				page.pageNum = $('#coaAcc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#coaAcc-data_length').find('select').val());
				if (typeof data == 'object') {
					//修改
					data["action"] = "edit";
					data["agencyCode"] = page.agencyCode;
					data["acctCode"] = page.acctCode == "" ? "*" : page.acctCode;
					//data["accsCode"] = page.accsCode;
					data["accsCode"] = page.useAccsCode;
					data["setYear"] = page.setYear;
					data["rgCode"] = page.rgCode;
					data["accsName"] = page.accsName;
					if (page.agencyCode != "*") {
						data["agencyTypeCode"] = agencyTypeCode;
					}
					data["coaccagyAgency"] = coaccagyAgency;
					data["isParallel"] = newIsParallel;
					data.diffAgencyType = page.diffAgencyType;
					data.list = page.data;
					var deleteCode = data["acceCode"];
					delete data["acceCode"];
					page.coaAccEdit = ufma.open({
						url: 'coaAccEdit.html',
						title: '设置会计科目',
						width: 1106,
						height: 635,
						data: data,
						ondestory: function (result) {
							// if (result && result.action == true) {
								page.getCoaAccList(page.pageNum, page.pageLen);
							// }
						}
					});
					data["acceCode"] = deleteCode;
				} else if (typeof data == 'string') {
					//增加下级
					var param = {};
					param["action"] = "addSub";
					param["agencyCode"] = page.agencyCode;
					param["acctCode"] = page.acctCode == "" ? "*" : page.acctCode;
					//param["accsCode"] = page.accsCode;
					param["accsCode"] = page.useAccsCode;
					param["accsName"] = page.accsName;
					param["acceCode"] = page.acceCode;
					param["setYear"] = page.setYear;
					param["rgCode"] = page.rgCode;
					param["chrCode"] = data;
					param["supChrCode"] = page.supChrCode;
					param["chrFullname"] = ma.nameTip;
					param["agencyTypeCode"] = agencyTypeCode;
					param["isParallel"] = newIsParallel;
					param["coaccagyAgency"] = coaccagyAgency;
					param.diffAgencyType = page.diffAgencyType;
					param.list = page.data;
					page.coaAccEdit = ufma.open({
						url: 'coaAccEdit.html',
						title: '设置会计科目',
						width: 1106,
						height: 635,
						data: param,
						ondestory: function (result) {
							//if(result && result.action == true) {
							page.getCoaAccList(page.pageNum, page.pageLen);
							//}
						}
					});
				} else {
					//新增
					var param = {};
					param["action"] = "add";
					param["agencyCode"] = page.agencyCode;
					param["acctCode"] = page.acctCode == "" ? "*" : page.acctCode;
					//param["accsCode"] = page.accsCode;
					param["accsCode"] = page.useAccsCode;
					param["accsName"] = page.accsName;
					param["agencyTypeCode"] = agencyTypeCode;
					param["isParallel"] = newIsParallel;
					param["setYear"] = page.setYear;
					param["rgCode"] = page.rgCode;
					param["coaccagyAgency"] = coaccagyAgency;
					param.diffAgencyType = page.diffAgencyType;
					param.list = page.data;
					page.coaAccEdit = ufma.open({
						url: 'coaAccEdit.html',
						title: '设置会计科目',
						width: 1106,
						height: 635,
						data: param,
						ondestory: function (result) {
							//CZSB-2887 新增科目后，点击弹窗的关闭图标或关闭按钮后，列表页面都没有进行刷新 雪蕊说不管怎样都刷新
							// if (result && result.action == true) {
								page.getCoaAccList(page.pageNum, page.pageLen);
							// }
						}
					});
				}
			},

			//初始化科目体系
			initAccs: function () {
				ufma.get("/ma/sys/common/getEleTree", {
					"agencyCode": page.agencyCode,
					"setYear": page.setYear,
					"rgCode": page.rgCode,
					"eleCode": "ACCS"
				},
					function (result) {
						$('#eleAccs').ufTreecombox({
							idField: 'code',
							textField: 'codeName',
							placeholder: '请选择科目体系',
							//leafRequire: true,
							leafRequire: false,
							data: result.data,
							onChange: function (sender, data) {
								ufma.deferred(function () {
									page.diffAgencyType = data.diffAgencyType;
									page.accaCount = data.accaCount;
									//page.accsCode = data.code;
									page.accsName = data.name;
									page.useAccsCode = data.code; //$('#eleAccs').getObj().getValue();
									page.initAcce();
								});
							},
							onComplete: function (sender) {
								var accsCode = $.getUrlParam('chrCode');
								accsCode = accsCode || result.data[0].code;
								$('#eleAccs').getObj().val(accsCode);
							}
						})

					});
			},

			//初始化会计要素
			initAcce: function () {
				/*if(!page.accsCode) {
					page.accsCode = $(".eleAccs").find("a[class='label label-radio selected']").attr("value");
				}*/
				if (!page.useAccsCode) {
					page.useAccsCode = $(".eleAccs").find("a[class='label label-radio selected']").attr("value");
				}
				if (!page.accsName) {
					page.accsName = $(".eleAccs").find("a[class='label label-radio selected']").text();
				}
				var argu = {};
				argu["agencyCode"] = page.agencyCode;
				argu["accsCode"] = page.useAccsCode; //page.accsCode;
				if (!$.isNull(page.useAccsCode)) {
					var htm = '<li class="active"><a href="javascript:;" value="">全部</a></li>';
					ufma.get("/ma/sys/coaAcc/queryAcce", argu, function (result) {
						$.each(result.data, function (index, row) {
							htm += ufma.htmFormat('<li><a href="javascript:;" value="<%=CHR_CODE%>"><%=CHR_NAME%></a></li>', {
								'CHR_CODE': row.chrCode,
								'CHR_NAME': row.chrName
							});
						});
						$("#tabAcce").html(htm);
						if (page.chooseAcctFlag == true) {
							ufma.showTip('请选择账套', function () { }, 'warning');
							return false;
						} else {
							page.getCoaAccList();
						}

					});
				} else {
					var htm = '<li class="active"><a href="javascript:;" value="">全部</a></li>';
					$("#tabAcce").html(htm);
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					}
				}
			},

			getInterface: function (opt) {
				var urls = {
					del: {
						type: 'delete',
						url: '/ma/sys/coaAcc/delete'
					},
					active: {
						type: 'put',
						url: '/ma/sys/coaAcc/abled'
					},
					unactive: {
						type: 'put',
						url: '/ma/sys/coaAcc/abled'
					}
				}
				return urls[opt];
			},

			getCheckedRows: function () {
				var checkedArray = [];
				$("#coaAcc-data .checkboxes:checked").each(function () {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},

			//获取科目下级最大code
			getMaxCoaAccCode: function (chrCode, callback) {
				var argu = {};
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["accsCode"] = page.useAccsCode; //page.accsCode;
				argu["chrCode"] = chrCode;
				argu["eleCode"] = "ACCO";
				page.supChrCode = chrCode;
				ufma.post('/ma/sys/common/getMaxLowerCode', argu, function (result) {
					if (result.data == '下级代码长度超过分级规则上限！') {
						ufma.showTip('下级代码长度超过分级规则上限！', function () { }, 'warning');
					} else {
						var maxChrCode = result.data;
						var obj = {
							"chrCode": maxChrCode,
							"tableName": 'MA_ELE_ACCO',
							"eleCode": 'ACCO',
							'acctCode': page.acctCode,
							'accsCode': page.useAccsCode, //page.accsCode,
							"rgCode": ma.rgCode,
							"setYear": page.setYear,
							"agencyCode": page.agencyCode
						}
						ma.nameTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function (result) {
							ma.nameTip = result.data;
							callback(maxChrCode);
						});

					}

				});

			},

			initArgu: function (argu) {
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = page.setYear;
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["accsCode"] = page.useAccsCode; //page.accsCode;
				argu["acceCode"] = page.acceCode;
				argu["accaCode"] = page.accaCode;
				return argu;
			},

			//批量操作函数
			delRow: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				var argu = {
					chrCodes: idArray,
					action: action
				};
				argu = page.initArgu(argu);
				page.pageNum = $('#coaAcc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#coaAcc-data_length').find('select').val());
				var callback = function (result) {
					if (action == 'del') {
						if ($tr) {
							//单行
							$tr.remove();
						} else {
							//批量
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
							page.getCoaAccList(page.pageNum, page.pageLen);
							$(".CheckAll").prop("checked", false);
						}
					} else {
						/*此处为批量操作，此段代码导致批量操作成功后没有相应提示，故注释此段代码--zsj
						 * if ($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");*/

						if (action == 'active') {
							if (result.flag == 'success') {
								ufma.hideloading();
								ufma.showTip('启用成功', function () { }, 'success');
								page.getCoaAccList(page.pageNum, page.pageLen);
								$(".CheckAll").prop("checked", false);
							}
						} else if (action == 'unactive') {
							if (result.flag == 'success') {
								ufma.hideloading();
								ufma.showTip('停用成功！', function () { }, 'success');
								page.getCoaAccList(page.pageNum, page.pageLen);
								$(".CheckAll").prop("checked", false);

							}
						}
						/*} else {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}*/
					}
				};
				if (action == 'del') {
					ufma.confirm('您确定要删除选中的会计科目吗？', function (action) {
						if (action) {
							ufma.showloading('数据删除中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				} else if (action == 'active') {
					ufma.confirm('您确定要启用选中的会计科目吗？', function (action) {
						if (action) {
							ufma.showloading('数据启用中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				} else if (action == 'unactive') {
					ufma.confirm('您确定要停用选中的会计科目吗？', function (action) {
						if (action) {
							ufma.showloading('数据停用中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
							type: 'warning'
						});
				}
			},

			//单行操作
			delRowOne: function (action, idArray, $tr) {
				var options = this.getInterface(action);
				var argu = {
					chrCodes: idArray,
					action: action
				};
				argu = page.initArgu(argu);
				page.pageNum = $('#coaAcc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#coaAcc-data_length').find('select').val());
				var callback = function (result) {
					if (action == 'del') {
						if ($tr) {
							$tr.remove();
						} else {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
						if (result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function () { }, 'success'); //guohx 增加删除成功提示
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					} else {
						if ($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							page.getCoaAccList(page.pageNum, page.pageLen);
							if (action == 'active') {
								if (result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('启用成功', function () { }, 'success');
								}
							} else if (action == 'unactive') {
								if (result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('停用成功！', function () { }, 'success');
								}
							}
						} else {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					}
				};
				if (action == 'addlower') {
					//获取会计科目下级最大code
					page.getMaxCoaAccCode(argu.chrCodes[0], function (result) {
						page.openEditHtm(result);
					});
				} else {
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},

			//判断表格文字局左，数字局右
			contAlign: function (dom) {
				dom.each(function () {
					if (/^[0-9]*$/.test($(this).text()) || /^(-?\d+)(\.\d+)?$/.test($(this).text())) {
						$(this).css({
							"text-align": "right"
						});
					} else {
						$(this).css({
							"text-align": "left"
						});
					}
				});
			},

			//打开详情编辑页
			bsAndEdt: function (data) {
				this.openEditHtm(data);
			},
			//渲染表格
			renderTable: function (result, pageNum, pageLen) {
				var id = "coaAcc-data";
				var toolBar = $('#' + id).attr('tool-bar');
				if (result && result.data) {
					page.data = result.data;
				} else {
					page.data = [];
				}
				var tableData = [];
				if (result.data && result.data.accoList) {
					tableData = result.data.accoList;
				} else {
					tableData = [];
				}
				$("#" + id).DataTable({
					"language": {
						"url": bootPath + "trd/datatables/datatable.default.js"
					},
					"data": tableData,
					// "ajax": "coaAcc.json",
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
					"fixedHeader": {
						header: true //表头固定

					},
					"columns": [{
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
							'<input type="checkbox" class="datatable-group-checkable CheckAll"/>&nbsp;' +
							'<span></span> ' +
							'</label>',
						data: "chrCode"
					},
					{
						title: "科目编码",
						data: "chrCode"
					},
					{
						title: "科目名称",
						data: "chrName"
					},
					{
						title: "适用单位",
						data: "agencyTypeName",
						width: 90
					},
					{
						title: "辅助核算",
						data: "accoItems"
					},
					{
						title: "余额方向",
						data: "accBalName",
						className: 'tc',
						width: 70
					},

					{
						title: "状态",
						data: "enabledName",
						className: 'tc',
						width: 60
					},
					{
						title: "操作",
						data: 'chrCode',
						className: 'tc',
						width: 120
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
								'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp; ' +
								'<span></span> ' +
								'</label>';
						}
					},
					{
						"targets": [1],
						"className": "isprint commonShow"
					},
					{
						"targets": [2],
						"serchable": false,
						"orderable": false,
						"className": "coaAcc-subject isprint",
						"render": function (data, type, rowdata, meta) {
							var textIndent = '0';
							if (rowdata.levelNum) {
								textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
							}
							var alldata = JSON.stringify(rowdata);
							return '<a class="common-jump-link commonShow" title="' + data + '" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
						}
					},
					{
						"targets": [3],
						"serchable": false,
						"orderable": false,
						"className": "isprint",
						"render": function (data, type, rowdata, meta) {
							return '<div class="coaAcc-assist commonShow" title="' + data + '">' + data + '</div>';
						}

					},
					{
						"targets": [4],
						"className": "isprint commonShow",
						"render": function (data, type, rowdata, meta) {
							if (rowdata.enabled == 1) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '<span title="' + data + '">' + data + '</span>';
							}
						}
					},
					{
						"targets": [6],
						"className": "isprint commonShow",
						"render": function (data, type, rowdata, meta) {
							if (rowdata.enabled == 1) {
								return '<span style="color:#00A854" title="' + data + '">' + data + '</span>';
							} else {
								return '<span style="color:#F04134" title="' + data + '">' + data + '</span>';
							}
						}
					},

					{
						"targets": [-1],
						"serchable": false,
						"orderable": false,
						"className": "text-center nowrap btnGroup",
						"render": function (data, type, rowdata, meta) {
							var active = rowdata.enabled == 1 ? 'hidden' : 'hidden:false';
							var unactive = rowdata.enabled == 0 ? 'hidden' : 'hidden:false';
							var rd = '<a class="btn btn-icon-only btn-sm btn-permission btn-addlower" data-toggle="tooltip" action= "addlower" rowcode="' + data + '" title="增加下级">' +
								'<span class="glyphicon icon-add-subordinate"></span></a>' +
								'<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowcode="' + data + '" title="启用">' +
								'<span class="glyphicon icon-play"></span></a>' +
								'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowcode="' + data + '" title="停用">' +
								'<span class="glyphicon glyphicon icon-ban"></span></a>' +
								'<a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' + data + '" title="删除">' +
								'<span class="glyphicon icon-trash"></span></a>'
							if (rowdata.isLeaf != 0) {
								rd = rd + '<a class="btn btn-icon-only btn-sm btn-permission btn-relationship" data-toggle="tooltip" action= "relationship" rowcode="' + data + '" title="关联科目">' +
									'<span class="glyphicon icon-Association-relationship"></span></a>';
							}
							if (rowdata.isLeaf == 0) {
								rd = rd + '<a class="btn btn-icon-only btn-sm btn-permission btn-copy btn-add" data-toggle="tooltip" action= "copy" rgcode="' + rowdata.rgCode + '" accecode="' + rowdata.acceCode + '"  accscode="' + rowdata.accsCode + '" chrcode="' + rowdata.chrCode + '" setyear="' + rowdata.setYear + '" agencycode="' + rowdata.agencyCode + '"  acctcode="' + rowdata.acctCode + '" title="复制下级科目">' +
									'<span class="glyphicon icon-discount"></span></a>';
							}
							return rd;
						}
					}
					],
					buttons: [{
						extend: 'print',
						text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
						exportOptions: {
							columns: '.isprint'
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
							columns: '.isprint'
						},
						customize: function (xlsx) {
							var sheet = xlsx.xl.worksheets['sheet1.xml'];
						}
					}
					],
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					"initComplete": function (settings, json) {

						//行操作按钮显示tips
						$('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();

						//批量操作与分页的toolbar
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						//后续页码重绘
						if (pageLen != "" && typeof (pageLen) != "undefined") {
							$('#' + id).DataTable().page.len(pageLen).draw(false);
							if (pageNum != "" && typeof (pageNum) != "undefined") {
								$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
							}
						}

						//打印
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
						$("#printTableData .buttons-excel").off().on('click', function (evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#' + id), '会计科目');
						});
						//导出end
						//加入权限class
						$("#printTableData .buttons-print").addClass(" btn-permission btn-print");
						$("#printTableData .buttons-excel").addClass(" btn-permission btn-export");

						$('#printTableData [data-toggle="tooltip"]').tooltip();

						//权限控制
						ufma.isShow(page.reslist);
						ufma.setBarPos($(window));
						$('#coaAcc-data').tblcolResizable();
						//固定表头
						$("#coaAcc-data").fixedTableHead($("#all"));
					},
					"drawCallback": function (settings) {
						//datatables中按钮权限控制
						ufma.isShow(page.reslist);
						$('#coaAcc-data').tblcolResizable();
						$('#coaAcc-data .btn').on('click', function () {
							page._self = $(this);
						});

						$('#coaAcc-data .btn-delete').ufTooltip({
							content: '您确定删除当前会计科目吗？',
							onYes: function () {
								ufma.showloading('数据删除中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						});
						$('#coaAcc-data .btn-start').ufTooltip({
							content: '您确定启用当前会计科目吗？',
							onYes: function () {
								ufma.showloading('数据启用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						});
						$('#coaAcc-data .btn-stop').ufTooltip({
							content: '您确定停用当前会计科目吗？',
							onYes: function () {
								ufma.showloading('数据停用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function () { }
						});
						//表格数据为空
						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.setBarPos($(window));
						
					}
				});
				//翻页取消勾选
				$('#' + id).on('page.dt', function () {
					$(".datatable-group-checkable,.checkboxes").prop("checked", false);
					$(".CheckAll").prop("checked", false);
					$('#' + id).find("tbody tr.selected").removeClass("selected");
				});
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
				//argu1['accsCode'] = page.accsCode;
				argu1['accsCode'] = page.useAccsCode;
				if (page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				ufma.get("/ma/sys/coaAcc/queryAccoTable", argu1, function (result) {
					page.renderTable(result, pageNum, pageLen);
				});
			},
			issueTips: function (data, isCallBack) {
				var title = "";
				if (isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.pageType = 'ACCO';
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
			getUrlParam: function (name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
				var r = window.location.search.substr(1).match(reg); //匹配目标参数
				if (r != null)
					return unescape(r[2]);
				return null; //返回参数值
			},
			onEventListener: function () {

				ufma.searchHideShow($('#coaAcc-data'));

				//行checkbox的单选操作
				// $('#coaAcc-data').on("click", '.coaAcc-subject', function (e) {
				$('#coaAcc-data').on('click', 'tbody td:not(.btnGroup)', function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					//如果是a标签，就进入查看详情页
					if ($ele.is('a')) {
						page.bsAndEdt($ele.data('href'));
						return false;
					}
					var $tr = $ele.closest("tr");
					var $input = $tr.find('input[type="checkbox"]');
					var code = $input.val();
					//选中上级，默认勾选下级
					var t = true
					if ($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if (thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
							if ($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					} else {
						$ele.parents("tbody").find("tr").each(function () {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if (thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
							if ($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
					}
					$(".datatable-group-checkable").attr('checked', t).prop('checked', t)
				});
				$('#coaAcc-data').on('click', '.btn-addlower', function () {
					page.delRowOne($(this).attr('action'), [$(this).attr('rowcode')], $(this).closest('tr'));
				});
				//关联科目
				$('#coaAcc-data').on('click', '.btn-relationship', function (e) {
					stopPropagation(e);

					function stopPropagation(e) {
						if (e.stopPropagation)
							e.stopPropagation();
						else
							e.cancelBubble = true;
					}
					var rowData = JSON.parse($(this).closest("td").siblings(".coaAcc-subject").find("a").attr("data-href"));
					// rowData: rowData
					var openData = {
						agencyCode: page.agencyCode,
						acctCode: page.acctCode,
						accsCode: page.useAccsCode, //page.accsCode,
						rowData: rowData
					};
					ufma.open({
						url: 'coaAccRelationship.html',
						title: '设置关联科目',
						width: 960,
						height: 600,
						data: openData,
						ondestory: function (data) {
							if (data.action == "save") {
								page.getCoaAccList(page.pageNum, page.pageLen);
							}
						}
					});
				});
				/*				//设置关联辅助项
								$(".set-accitem").on("click", function() {
									var openData = {};
									if(localStorage.getItem("ma_setAccItem")) {
										openData = JSON.parse(localStorage.getItem("ma_setAccItem"))
									}
									ufma.open({
										url: 'setAccItem.html',
										title: '设置关联辅助项',
										//width: 1106,
										//height: 635,
										width: 580,
										height: 545,
										data: openData,
										ondestory: function(data) {
											if(data.action) {
												page.coaAccEdit.setData(data);
											}
										}
									});
								});*/

				//checkbox的全选操作
				$("#coaAcc-data,#coaAcc-tool-bar").on("change", '.datatable-group-checkable', function () {
					var isCorrect = $(this).is(":checked");
					$("#coaAcc-data .checkboxes").each(function () {
						isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
						isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
					});
					$(".datatable-group-checkable").prop("checked", isCorrect);
				});

				//点击会计要素
				$("#tabAcce").on("click", 'a', function (e) {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						ufma.deferred(function () {
							page.getCoaAccList();
							$(".datatable-group-checkable,.checkboxes").prop("checked", false);
							$(".CheckAll").prop("checked", false);
						});
					}
				});

				//新增
				$("#btn-add").on('click', function () {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						page.openEditHtm();
					}
				});

				//批量删除
				$(".btn-delete").on("click", function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择会计科目！', "warning");
							return false;
						}
						page.delRow('del', checkedRow);
					}
				});

				//批量启用
				$('.btn-start').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择会计科目！', "warning");
							return false;
						}
						page.delRow('active', checkedRow);
					}
				});

				//批量停用
				$('.btn-stop').on('click', function (e) {
					e.stopPropagation();
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var checkedRow = page.getCheckedRows();
						if (checkedRow.length == 0) {
							ufma.alert('请选择会计科目！', "warning");
							return false;
						}
						page.delRow('unactive', checkedRow);
					}
				});

				//下发
				$('.btn-senddown').on('click', function (e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();
					var chooseAcct, chooseAgency;
					if (gnflData.length == 0) {
						ufma.showTip('请选择会计科目！', function () { }, "warning");
						return false;
					}
					page.modal = ufma.selectBaseTree({
						//url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode + '&accsCode=' + page.accsCode + '&eleCode=ACCO',
						url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + page.setYear + '&agencyCode=' + page.agencyCode + '&accsCode=' + page.useAccsCode + '&eleCode=ACCO',
						rootName: '所有账套',
						width: 650,
						title: '选择下发账套',
						bSearch: true, //是否有搜索框
						checkAll: true, //是否有全选
						leafRequire: true,
						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function (data) {
									ufma.hideloading();
									if (data.length == 0) {
										ufma.alert('请选择单位账套！', "warning");
										return false;
									}
									acctAlldata = data;
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

									var url = '/ma/sys/coaAcc/issue';
									var argu = {
										'chrCodes': gnflData,
										'toAgencyAcctList': dwCode,
										"accsCode": page.useAccsCode, //page.accsCode,
										"agencyCode": page.agencyCode,
										"acctCode": page.acctCode,
										"rgCode": ma.rgCode,
										"setYear": page.setYear
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									ufma.post(url, argu, function (result) {
										ufma.hideloading();
										page.modal.close();
										page.issueTips(result);
									});
									//下发后取消全选
									$(".datatable-group-checkable,.checkboxes").prop("checked", false);
									$(".CheckAll").prop("checked", false);
									$("#coaAcc-data").find("tbody tr.selected").removeClass("selected");
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
				$('.btn-choose').on('click', function (e) {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						var params = {
							"accsCode": page.useAccsCode, //page.accsCode,
							// "acceCode": "",
							"agencyCode": page.agencyCode,
							"acctCode": "*",
							"agencyTypeCode": page.agencyType,
							"eleCode": "ACCO"
						};
						if (page.acctCode != "" && page.acctCode != undefined) {
							params.acctCode = page.acctCode;
						}
						var openData = {
							checkbox: true
						};
						openData.setYear = page.setYear;
						openData.flag = "ACCSMA";
						openData.data = params;
						openData.rootName = "会计科目";
						// openData.checkAll = true;

						ufma.open({
							url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
							title: '选择会计科目',
							width: 580,
							height: 635,
							data: openData,
							ondestory: function (result) {
								if (result.action) {
									var datas = [{
										"toAgencyCode": page.agencyCode,
										"toAcctCode": "*"
									}];
									var tagencyCode = result.data[0].agencyCode;
									if (page.acctCode != "" && page.acctCode != undefined) {
										datas[0].toAcctCode = page.acctCode;
									}
									var accoData = [];
									for (var i = 0; i < result.data.length; i++) {
										accoData.push(result.data[i].code);
									}
									ufma.showloading('数据选用中，请耐心等待...');
									var argu = {
										'chrCodes': accoData,
										"accsCode": page.useAccsCode, //page.accsCode,
										'toAgencyAcctList': datas,
										'agencyCode': tagencyCode,
										'rgCode': ma.rgCode,
										'setYear': page.setYear
									};
									ufma.post('/ma/sys/coaAcc/issue', argu, function (result) {
										ufma.hideloading();
										//page.modal.close();
										page.issueTips(result, true);
										page.getCoaAccList();
									});
								};
							}
						});
					}
				});
				$('#coaAcc-data').on('click', '.btn-copy', function (e) {
					var data = {
						"acctCode": $(this).attr('acctcode'),
						// "accsCode": $(this).attr('accscode'),
						"agencyCode": $(this).attr('agencycode'),
						"setYear": parseInt($(this).attr('setyear')),
						"userId": page.pfData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
						"eleCode": 'ACCO',
						"accsCode": page.useAccsCode //page.accsCode
					}
					var acceCode = $(this).attr('acceCode');
					var rgCode = $(this).attr('rgCode');
					var chrCode = $(this).attr('chrCode');
					ufma.open({
						url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
						title: '选择目标科目',
						width: 580,
						height: 635,
						data: {
							'flag': 'ACCOS',
							'rootName': '会计科目',
							'checkbox': false,
							'leafRequire': true,
							'data': data,
						},
						ondestory: function (result) {
							if (result.action) {

								var argu = {
									"destAccoChrCodes": [result.data[0].code],
									"sourceAccoChrCodes": [chrCode],
									"rgCode": rgCode,
									"setYear": parseInt(data.setYear),
									"agencyCode": data.agencyCode,
									"acctCode": data.acctCode,
									"accsCode": data.accsCode,
									"acceCode": acceCode,
									"accsCode": page.useAccsCode //page.accsCode
								}
								ufma.post('/ma/sys/coaAcc/copyAcco', argu, function (rst) {
									ufma.showTip(rst.msg, function () { }, 'success');
									page.getCoaAccList(page.pageNum, page.pageLen);
								});
							};
						}
					});
				});
				$('#showAcctOrAccs').on('click', function () {
					//bug77311--zsj--当选择主管单位时，科目体系显示在单位的旁边--复选框
					//if($('#showAcctOrAccs').is(':checked')) {
					if (page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function () { }, 'warning');
						return false;
					} else {
						if (page.showFlag == true) {
							$("#cbAcct").addClass('hide');
							$("#dw-kmtx").removeClass('hide');
							page.initAccs();
							$('#showText').html('显示账套');
							page.showFlag = false;
							$('#showAcctOrAccs').attr('checked', false);
							page.acctCode = '*'; //科目体系下账套传*，科目体系为选中的值
							page.useAccsCode = $('#eleAccs').getObj().getValue();
							//page.getCoaAccList();
						} else if (page.showFlag == false) {
							$("#cbAcct").removeClass('hide');
							$("#dw-kmtx").addClass('hide');
							$('#showText').html('显示科目体系');
							page.showFlag = true;
							$('#showAcctOrAccs').attr('checked', false);
							page.acctCode = page.useAcctCode; //账套下账套传选中的值，科目体系默认为账套的科目体系
							page.useAccsCode = page.accsCode; //此时的科目体系是 账套对应的科目 体系，注：不要轻易改动page.accsCode
							page.getCoaAccList();
						}
					}

				});
				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				$("#coaAcc-data thead ").on("mouseover", function () {
					$("#coaAcc-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "1px solid #D9D9D9")
					})
				}).on("mouseout", function () {
					$("#coaAcc-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "none")
					})
				});
				//当出现固定表头时，悬浮加边框线 guohx 
				$("#all").scroll(function () {
					$("#coaAcc-datafixed thead").on("mouseover", function () {
						$("#coaAcc-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "1px solid #D9D9D9")
						})
					}).on("mouseout", function () {
						$("#coaAcc-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "none")
						})
					});
				})
			},
			//获取科目体系
			getAccsCode: function (agencyCode, acctCode) {
				ufma.get('/ma/sys/coaAcc/getCoCoacc', {
					"agencyCode": agencyCode,
					"acctCode": acctCode
				}, function (result) {
					//page.accsCode = result.data.accsCode;
					page.useAccsCode = result.data.accsCode;
					page.accsName = result.data.accsName;
					page.initAcce();
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
										agencyTypeCode = data.agencyTypeCode;
										page.isParallel = data.isParallel;
										page.diffAgencyType = data.diffAgencyType;
										page.acctCode = data.code;
										page.useAcctCode = data.code;
										page.acctName = data.name;
										page.accsCode = data.accsCode;
										page.accsName = data.accsName;
										page.agencyType = data.agencyTypeCode;
										page.useAccsCode = data.accsCode;
										page.initAcce();
										if(page.chooseAcctFlag == true) {
											ufma.showTip('请选择账套', function() {}, 'warning');
											return false;
										} else {
											var res = page.tableAcctUse;
											page.renderTable(res, page.pageNum, page.pageLen);
										}
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
										if(!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
											page.cbAcct.val(page.acctCode, page.acctName);
										} else {
											page.cbAcct.select(1);
										}
									}

								});*/
			},
			//获取要素的详细信息
			getEleDetail: function () {
				var argu = {
					eleCode: 'ACCO',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: page.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, callbackFun);

				function callbackFun(data, ctrlName) {
					//本级控制下发按钮显示/隐藏
					page.agencyCtrlLevel = data.agencyCtrllevel;
					var isAcctLevel = data.isAcctLevel;
					var issueType = data.issueType; //逐级下发：2；一发到底：1；一发到底不显示账套、科目体系切换按钮--zsj
					if (issueType == '1') {
						$('#showCheckBox').hide();
						page.acctCode = '*';
					} else if (issueType == '2') {
						if (page.showFlag == true) {
							$('#showCheckBox').show();

						} else {
							$('#showCheckBox').hide();
							page.acctCode = '*';
						}
					}
				}
			},
			//初始化单位/帐套
			initAgencyScc: function () {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + page.setYear,
					leafRequire: false,
					onchange: function (data) {
						var code = data.id;
						page.agencyCode = data.code;
						page.agencyName = data.name;
						page.isLeaf = data.isLeaf;
						if (data.isLeaf != 0) {
							page.showFlag = true;
							page.getEleDetail();
							$("#cbAcct").removeClass('hide');
							$(".btn-choose").show();
							//$('#showCheckBox').show();
							$("#dw-kmtx").addClass('hide');
							if ($("#dw-kmtx").hasClass('hide')) {
								$('#showText').html('显示科目体系');
							} else if ($("#cbAcct").hasClass('hide')) {
								$('#showText').html('显示账套');
							}
							page.accsCode = '';
							//末级单位不显示下发按钮
							$(".btn-senddown").hide();
							//显示账套问题--zsj
							ufma.get('/ma/sys/eleCoacc/getAcctTree/' + code, {
								"setYear": page.setYear,
								"rgCode": page.rgCode
							}, function (result) {
								var acctData = result.data;
								page.tableAcctUse = result.data;
								if (acctData.length == 0) {
									page.acctCode = "";
									page.accsCode = '';
									page.useAccsCode = '';
									$('#' + 'coaAcc-data').find("tbody").empty().append('<tr class="odd">+<td valign="top" colspan="8" class="dataTables_empty" style="padding:5px"><img src="' + bootPath + 'images/noData.png" style="text-align:center"/><br/><i>目前还没有你要查询的数据</i></td></tr>');
									ufma.setBarPos($(window));
									var res = {
										data: {
											accoList: []
										}
									};
									page.chooseAcctFlag = true;
								} else {
									page.chooseAcctFlag = false;
								}
								page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									valueField: 'code',
									textField: 'codeName',
									placeholder: '请选择账套',
									icon: 'icon-book',
									data: acctData,
									onchange: function (data) {
										agencyTypeCode = data.agencyTypeCode;
										page.isParallel = data.isParallel;
										page.diffAgencyType = data.diffAgencyType;
										page.acctCode = data.code;
										page.useAcctCode = data.code;
										page.acctName = data.name;
										page.accsCode = data.accsCode;
										page.accsName = data.accsName;
										page.agencyType = data.agencyTypeCode;
										page.useAccsCode = data.accsCode;
										page.initAcce();
										//page.renderTable(acctData, page.pageNum, page.pageLen);
										if (page.chooseAcctFlag == true) {
											page.renderTable(acctData, page.pageNum, page.pageLen);
											ufma.showTip('请选择账套', function () { }, 'warning');
											return false;
										} else {
											page.getCoaAccList(page.pageNum, page.pageLen);
										}
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
									initComplete: function (sender) {
										var jumpAcctCode = page.getUrlParam("jumpAcctCode");
										if (!$.isNull(jumpAcctCode)) {
											page.cbAcct.val(jumpAcctCode);
										} else {
											if (!$.isNull(page.acctCode) && page.acctCode != '*' && !$.isNull(page.acctName)) {
												page.cbAcct.val(page.acctCode, page.acctName);
											} else {
												if (page.chooseAcctFlag == true) {
													page.initAcce();
													$('#' + 'coaAcc-data').find("tbody").empty().append('<tr class="odd">+<td valign="top" colspan="8" class="dataTables_empty" style="padding:5px"><img src="' + bootPath + 'images/noData.png" style="text-align:center"/><br/><i>目前还没有你要查询的数据</i></td></tr>');
													ufma.setBarPos($(window));
													page.cbAcct.val('');
												} else {
													page.cbAcct.select(1);
												}
											}
										}
									}
								});
								/*if(acctData.length == 0) {
									page.cbAcct.val('');
									$('#' + 'coaAcc-data').find("tbody").empty().append('<tr class="odd">+<td valign="top" colspan="7" class="dataTables_empty" style="padding:5px"><img src="' + bootPath + 'images/noData.png" style="text-align:center"/><br/><i>目前还没有你要查询的数据</i></td></tr>');;
									ufma.setBarPos($(window));
									var res = {
										data: {
											accoList: []
										}
									};
									page.chooseAcctFlag = true;
									ufma.showTip('请选择账套', function() {}, 'warning');
									return false;
								} else {
									page.chooseAcctFlag = false;
								}*/

								if (acctData != null) {
									/*page.cbAcct = $("#cbAcct").ufmaTreecombox2({
										data: acctData,
									});*/
									/*setTimeout(100);
									if(page.acctCode != "" && page.acctName != "" && page.acctCode != "*" && page.acctName != "*" & page.isInit) {
										page.cbAcct.setValue(page.acctCode, page.acctName);
									}*/
									page.isInit = false;
								}
							});
							//page.initAcctScc();

						} else {
							//非末级单位不显示账套选择框和选用科目按钮
							page.chooseAcctFlag = false;
							$("#cbAcct").addClass('hide');
							page.showFlag = false;
							$(".btn-choose").hide();
							$("#dw-kmtx").removeClass('hide');
							page.getEleDetail();
							page.initAccs();
							$(".btn-senddown").show();
							//$('#showCheckBox').hide();
						}
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
					initComplete: function (sender) {
						if (!$.isNull(page.agencyCode) && page.agencyCode != '*') {
							page.cbAgency.val(page.agencyCode);
						} else {
							page.cbAgency.select(1);
						}
					}
				});

			},

			init: function () {
				//科目体系跳转
				page.fromChrCode = ma.GetQueryString("chrCode");
				//获取session
				page.pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				//CWYXM-4318对于post请求将整数转字符串时在postgresql中会报错
				page.setYear = parseInt(page.pfData.svSetYear);
				page.rgCode = page.pfData.svRgCode;
				page.isInit = true;
				//权限
				page.reslist = ufma.getPermission();
				if ($('body').data("code")) {
					page.initAgencyScc();
				} else {
					page.agencyCode = "*";
					page.acctCode = '*';
					page.initAccs();
					page.useAccsCode = $('#eleAccs').getObj().getValue();
				}
				setTimeout(function () {
					//CWYXM-19621 基础资料会计科目，滑动滚动条样式问题 guohx 20200827
					var portlet = $(".ufma-portlet").height();
					var toolbar = $("#coaAcc-tool-bar").height();
					if ($('body').data("code")) {
						var centerHeight = $(window).height() - portlet - 34 - toolbar - 8 - 4 - 40;
					} else {
						var centerHeight = $(window).height() - portlet - 34 - toolbar - 8 - 40;
					}
					$('#all').css("height", centerHeight);
					$('#all').css("width", $(".table-sub").width());
					$('#all').css("overflow", "auto");
				}, 500)
				ufma.parse();
				page.onEventListener();
				$('#eleAccs').ufTreecombox({
					idField: 'accountbookCode',
					textField: 'accountbookName',
					placeholder: '请选择科目体系',
					leafRequire: true,
					data: []
				})
				//底部工具条浮动
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});