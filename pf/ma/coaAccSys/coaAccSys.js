$(function() {
	var page = function() {
		var accsCode, accsName, acceCode, acceName, agencyTypeCode, diffAgencyType, isSys;
		return {

			openEditHtm: function(data) {
				page.pageNum = $('#coaAcc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#coaAcc-data_length').find('select').val());
				if(typeof data == 'object') {
					//修改
					data["action"] = "edit";
					data["agencyCode"] = page.agencyCode;
					data["acctCode"] = page.acctCode;
					data["accsCode"] = page.accsCode;
					data["agencyTypeCode"] = agencyTypeCode;
					data["coaccagyAgency"] = coaccagyAgency;
					data["rg"] = page.rgCode;
					data["isSys"] = page.isSys;
					data.diffAgencyType = page.diffAgencyType;
					data.list = page.data
					var deleteCode = data["acceCode"];
					delete data["acceCode"];
					ufma.open({
						url: 'coaAccEdit.html',
						title: '设置会计科目',
						width: 1106,
						height: 465,
						data: data,
						ondestory: function(data) {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					});
					data["acceCode"] = deleteCode;
				} else if(typeof data == 'string') {
					//增加下级
					var param = {};
					param["action"] = "addSub";
					param["agencyCode"] = page.agencyCode;
					param["acctCode"] = page.acctCode;
					param["accsCode"] = page.accsCode;
					param["acceCode"] = page.acceCode;
					param["chrCode"] = data;
					param["supChrCode"] = page.supChrCode;
					param["chrFullname"] = ma.nameTip;
					param["agencyTypeCode"] = agencyTypeCode;
					param["coaccagyAgency"] = coaccagyAgency;
					param["rg"] = page.rgCode;
					param["isSys"] = page.isSys;
					param.diffAgencyType = page.diffAgencyType;
					ufma.open({
						url: 'coaAccEdit.html',
						title: '设置会计科目',
						width: 1106,
						height: 635,
						data: param,
						ondestory: function(data) {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					});
				} else {
					//新增
					var param = {};
					param["action"] = "add";
					param["agencyCode"] = page.agencyCode;
					param["acctCode"] = page.acctCode == "" ? "*" : page.acctCode;
					param["accsCode"] = page.accsCode;
					param["agencyTypeCode"] = agencyTypeCode;
					param["coaccagyAgency"] = coaccagyAgency;
					param["rg"] = page.rgCode;
					param["isSys"] = page.isSys;
					param.diffAgencyType = page.diffAgencyType;
					ufma.open({
						url: 'coaAccEdit.html',
						title: '设置会计科目',
						width: 1106,
						height: 635,
						data: param,
						ondestory: function(data) {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					});
				}
			},

			//初始化科目体系
			initAccs: function() {
				ufma.get("/ma/sys/common/getEleTree", {
						"agencyCode": page.agencyCode,
						"setYear": ma.setYear,
						"rgCode": page.rgCode,
						//"rgCode": '*',
						"eleCode": "ACCS"
					},
					function(result) {
						$('#eleAccs').ufTreecombox({
							idField: 'code',
							textField: 'codeName',
							placeholder: '请选择科目体系',
							leafRequire: true,
							data: result.data,
							onChange: function(sender, data) {
								ufma.deferred(function() {
									page.diffAgencyType = data.diffAgencyType;
									page.accsCode = data.code;
									page.initAcce();
								});
							},
							onComplete: function(sender) {
								var accsCode = $.getUrlParam('chrCode');
								//								if(result!=null){
								accsCode = accsCode || result.data[0].code;
								$('#eleAccs').getObj().val(accsCode);
								//								}
							}
						})

					});
			},

			//初始化会计要素
			initAcce: function() {
				if(!page.accsCode) {
					page.accsCode = $(".eleAccs").find("a[class='label label-radio selected']").attr("value");
				}
				if(!page.accsName) {
					page.accsName = $(".eleAccs").find("a[class='label label-radio selected']").text();
				}
				var argu = {};
				argu["agencyCode"] = page.agencyCode;
				argu["accsCode"] = page.accsCode;
				argu["rgCode"] = ma.rgCode;
				//argu["rgCode"] = '*';
				argu["setYear"] = ma.setYear;
				var htm = '<li class="active"><a href="javascript:;" value="">全部</a></li>';
				ufma.get("/ma/sys/coaAccSys/queryAcce", argu, function(result) {
					$.each(result.data, function(index, row) {
						htm += ufma.htmFormat('<li><a href="javascript:;" value="<%=CHR_CODE%>"><%=CHR_NAME%></a></li>', {
							'CHR_CODE': row.chrCode,
							'CHR_NAME': row.chrName
						});
					});
					$("#tabAcce").html(htm);
					page.getCoaAccList();
				});
			},

			getInterface: function(opt) {
				var urls = {
					del: {
						type: 'delete',
						url: '/ma/sys/coaAccSys/delete?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					active: {
						type: 'put',
						url: '/ma/sys/coaAccSys/abled?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					},
					unactive: {
						type: 'put',
						url: '/ma/sys/coaAccSys/abled?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear
					}
				}
				return urls[opt];
			},

			getCheckedRows: function() {
				var checkedArray = [];
				$("#coaAcc-data .checkboxes:checked").each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},

			//获取科目下级最大code
			getMaxCoaAccCode: function(chrCode, callback) {
				var argu = {};
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["accsCode"] = page.accsCode;
				argu["chrCode"] = chrCode;
				argu["eleCode"] = "ACCO";
				page.supChrCode = chrCode;
				ufma.post('/ma/sys/common/getMaxLowerCode', argu, function(result) {
					if(result.data == '下级代码长度超过分级规则上限！') {
						ufma.showTip('下级代码长度超过分级规则上限！', function() {}, 'warning');
					} else {
						var maxChrCode = result.data;
						var obj = {
							"chrCode": maxChrCode,
							"tableName": 'MA_ELE_ACCO',
							"eleCode": 'ACCO',
							'acctCode': page.acctCode,
							'accsCode': page.accsCode,
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode
						}
						ma.nameTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function(result) {
							ma.nameTip = result.data;

							callback(maxChrCode);
						});

					}

				});

			},

			initArgu: function(argu) {
				argu["rgCode"] = ma.rgCode;
				argu["setYear"] = ma.setYear;
				argu["agencyCode"] = page.agencyCode;
				argu["acctCode"] = page.acctCode;
				argu["accsCode"] = page.accsCode;
				argu["acceCode"] = page.acceCode;
				argu["accaCode"] = page.accaCode;
				return argu;
			},

			//批量操作函数
			delRow: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				var argu = {
					chrCodes: idArray,
					action: action
				};
				argu = page.initArgu(argu);
				page.pageNum = $('#coaAcc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#coaAcc-data_length').find('select').val());
				var callback = function(result) {
					if(action == 'del') {
						if($tr) {
							//单行
							$tr.remove();
						} else {
							//批量
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					} else {
						/*if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
					*/		
							if(action == 'active') {
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('启用成功', function() {}, 'success');
									page.getCoaAccList(page.pageNum, page.pageLen);
								}
							} else if(action == 'unactive') {
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('停用成功！', function() {}, 'success');
									page.getCoaAccList(page.pageNum, page.pageLen);
								}
							}
						/*} else {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}*/
					}
				};
				if(action == 'del') {
					ufma.confirm('您确定要删除选中的会计科目吗？', function(action) {
						if(action) {
							ufma.showloading('数据删除中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'active') {
					ufma.confirm('您确定要启用选中的会计科目吗？', function(action) {
						if(action) {
							ufma.showloading('数据启用中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'unactive') {
					ufma.confirm('您确定要停用选中的会计科目吗？', function(action) {
						if(action) {
							ufma.showloading('数据停用中，请耐心等待...');
							ufma.ajax(options.url, options.type, argu, callback);
						}
					}, {
						type: 'warning'
					});
				}
			},

			//单行操作
			delRowOne: function(action, idArray, $tr) {
				var options = this.getInterface(action);
				var argu = {
					chrCodes: idArray,
					action: action
				};
				argu = page.initArgu(argu);
				page.pageNum = $('#coaAcc-data_paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#coaAcc-data_length').find('select').val());
				var callback = function(result) {
					if(action == 'del') {
						if($tr) {
							$tr.remove();
						} else {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
						if(result.flag == 'success') {
							ufma.hideloading();
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							page.getCoaAccList(page.pageNum, page.pageLen);
							if(action == 'active') {
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('启用成功', function() {}, 'success');
								}
							} else if(action == 'unactive') {
								if(result.flag == 'success') {
									ufma.hideloading();
									ufma.showTip('停用成功！', function() {}, 'success');
								}
							}
						} else {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					}
				};
				if(action == 'addlower') {
					//获取会计科目下级最大code
					page.getMaxCoaAccCode(argu.chrCodes[0], function(result) {
						page.openEditHtm(result);
					});
				} else {
					ufma.ajax(options.url, options.type, argu, callback);
				}
			},

			//判断表格文字局左，数字局右
			contAlign: function(dom) {
				dom.each(function() {
					if(/^[0-9]*$/.test($(this).text()) || /^(-?\d+)(\.\d+)?$/.test($(this).text())) {
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
			bsAndEdt: function(data) {
				this.openEditHtm(data);
			},
			//渲染表格
			renderTable: function(result, pageNum, pageLen) {
				var id = "coaAcc-data";
				var toolBar = $('#' + id).attr('tool-bar');
				page.data = result.data
				$("#" + id).DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": result.data.accoList,
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
								'<input type="checkbox" class="datatable-group-checkable"/>&nbsp;' +
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
							data: "agencyTypeName"
						},
						{
							title: "辅助核算",
							data: "accoItems"
						},
						{
							title: "余额方向",
							data: "accBalName"
						},

						{
							title: "状态",
							data: "enabledName"
						},
						{
							title: "操作",
							data: 'chrCode',
							className: 'tl',
							width: 200
						}
					],
					"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "checktd",
							"render": function(data, type, rowdata, meta) {
								return '<div class="checkdiv">' +
									'</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
									'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp; ' +
									'<span></span> ' +
									'</label>';
							}
						},
						{
							"targets": [1],
							"className": "isprint"
						},
						{
							"targets": [2],
							"serchable": false,
							"orderable": false,
							"className": "coaAcc-subject isprint",
							"render": function(data, type, rowdata, meta) {
								var textIndent = '0';
								if(rowdata.levelNum) {
									textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
								}
								var alldata = JSON.stringify(rowdata);
								return '<a  class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
							}
						},
						{
							"targets": [3],
							"serchable": false,
							"orderable": false,
							"className": "isprint",
							"render": function(data, type, rowdata, meta) {
								return '<div class="coaAcc-assist" title="' + data + '">' + data + '</div>';
							}

						},
						{
							"targets": [4],
							"className": "isprint",
							"render": function(data, type, rowdata, meta) {
								if(rowdata.enabled == 1) {
									return '<span style="color:#00A854;display: block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 240px" title="' + data + '">' + data + '</span>';
								} else {
									return '<span style="color:#F04134;display: block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 240px" title="' + data + '">' + data + '</span>';
								}
							}
						},

						{
							"targets": [-1],
							"serchable": false,
							"orderable": false,
							"className": "text-center nowrap btnGroup",
							"render": function(data, type, rowdata, meta) {
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
								if(rowdata.isLeaf != 0) {
									rd = rd + '<a class="btn btn-icon-only btn-sm btn-permission btn-relationship" data-toggle="tooltip" action= "relationship" rowcode="' + data + '" title="关联科目">' +
										'<span class="glyphicon icon-Association-relationship"></span></a>';
								}
								if(rowdata.isLeaf == 0) {
									rd = rd + '<a class="btn btn-icon-only btn-sm btn-copy" data-toggle="tooltip" action= "copy" rgcode="' + rowdata.rgCode + '" accecode="' + rowdata.acceCode + '"  accscode="' + rowdata.accsCode + '" chrcode="' + rowdata.chrCode + '" setyear="' + rowdata.setYear + '" agencycode="' + rowdata.agencyCode + '"  acctcode="' + rowdata.acctCode + '" title="复制下级科目">' +
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
					"dom": '<"printButtons"B>rt<"' + id + '-paginate"ilp>',
					"initComplete": function(settings, json) {

						//行操作按钮显示tips
						$('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();

						//批量操作与分页的toolbar
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + id + '-paginate').appendTo($info);

						//后续页码重绘
						if(pageLen != "" && typeof(pageLen) != "undefined") {
							$('#' + id).DataTable().page.len(pageLen).draw(false);
							if(pageNum != "" && typeof(pageNum) != "undefined") {
								$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
							}
						}

						//底部工具条浮动
						ufma.parseScroll();

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
						$("#printTableData .buttons-excel").off().on('click', function(evt) {
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
					},
					"drawCallback": function(settings) {
						//datatables中按钮权限控制
						ufma.isShow(page.reslist);
						$('#coaAcc-data .btn').on('click', function() {
							page._self = $(this);
						});

						$('#coaAcc-data .btn-delete').ufTooltip({
							content: '您确定删除当前会计科目吗？',
							onYes: function() {
								ufma.showloading('数据删除中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						});
						$('#coaAcc-data .btn-start').ufTooltip({
							content: '您确定启用当前会计科目吗？',
							onYes: function() {
								ufma.showloading('数据启用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						});
						$('#coaAcc-data .btn-stop').ufTooltip({
							content: '您确定停用当前会计科目吗？',
							onYes: function() {
								ufma.showloading('数据停用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						});
						//表格数据为空
						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						ufma.setBarPos($(window));
					}
				});
				//翻页取消勾选
				$('#' + id).on('page.dt', function() {
					$(".datatable-group-checkable,.checkboxes").prop("checked", false);
					$('#' + id).find("tbody tr.selected").removeClass("selected");
				});
			},
			getCoaAccList: function(pageNum, pageLen) {
				//全部即acceCode为空
				page.acceCode = $('#tabAcce').find("li.active a").attr("value");
				page.acceName = $('#tabAcce').find("li.active a").text();
				var argu = $('#query-tj').serializeObject();
				//判断是否是通过链接打开
				if(page.fromChrCode != null && page.fromChrCode != "") {
					argu.accsCode = page.fromChrCode;
					//第一次加载时使用传送过来的code，以后根据查询条件
					page.fromChrCode = "";
				}
				var argu1 = {}
				argu1["agencyCode"] = page.agencyCode;
				argu1["acctCode"] = page.acctCode;
				argu1["acceCode"] = page.acceCode;
				argu1['accsCode'] = page.accsCode;
				if(page.isLeaf != 1) {
					argu1["acctCode"] = "";
				}
				argu1["rgCode"] = ma.rgCode;
				argu1['setYear'] = ma.setYear;
				ufma.get("/ma/sys/coaAccSys/queryAccoTable", argu1, function(result) {
					page.renderTable(result, pageNum, pageLen);
				});
			},
            issueTips: function(data, isCallBack) {
				var title = "";
				if(isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = '会计科目';
				data.pageType = 'ACCO';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function(data) {
						//窗口关闭时回传的值;
						if(isCallBack) {
							page.getCoaAccList(page.pageNum, page.pageLen);
						}
					}
				});
			},
			onEventListener: function() {

				ufma.searchHideShow($('#coaAcc-data'));

				//行checkbox的单选操作
				$('#coaAcc-data').on("click", '.coaAcc-subject', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					//如果是a标签，就进入查看详情页
					if($ele.is('a')) {
						page.bsAndEdt($ele.data('href'));
						return false;
					}
					var $tr = $ele.closest("tr");
					var $input = $tr.find('input[type="checkbox"]');
					var code = $input.val();
					//选中上级，默认勾选下级
					if($tr.hasClass("selected")) {
						$ele.parents('tbody').find('tr').each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						});
					} else {
						$ele.parents('tbody').find('tr').each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						});
					}
				});
				$('#coaAcc-data').on('click', '.btn-addlower', function() {
					page.delRowOne($(this).attr('action'), [$(this).attr('rowcode')], $(this).closest('tr'));
				});
				//关联科目
				$('#coaAcc-data').on('click', '.btn-relationship', function() {
					var rowData = JSON.parse($(this).closest("td").siblings(".coaAcc-subject").find("a").attr("data-href"));
					// rowData: rowData
					var openData = {
						agencyCode: page.agencyCode,
						acctCode: page.acctCode,
						accsCode: page.accsCode,
						rowData: rowData
					};
					ufma.open({
						url: 'coaAccRelationship.html',
						title: '设置关联科目',
						width: 960,
						height: 600,
						data: openData,
						ondestory: function(data) {
							if(data.action == "save") {
								page.getCoaAccList(page.pageNum, page.pageLen);
							}
						}
					});
				});

				//checkbox的全选操作
				$("#coaAcc-data,#coaAcc-tool-bar").on("change", '.datatable-group-checkable', function() {
					var isCorrect = $(this).is(":checked");
					$("#coaAcc-data .checkboxes").each(function() {
						isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
						isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
					});
					$(".datatable-group-checkable").prop("checked", isCorrect);
				});

				//点击会计要素
				$("#tabAcce").on("click", 'a', function(e) {
					ufma.deferred(function() {
						page.getCoaAccList();
					});
				});

				//新增
				$(".btn-add").on('click', function() {

					page.openEditHtm();
				});

				//批量删除
				$(".btn-delete").on("click", function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择会计科目！', "warning");
						return false;
					}
					page.delRow('del', checkedRow);
				});

				//批量启用
				$('.btn-start').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择会计科目！', "warning");
						return false;
					}
					page.delRow('active', checkedRow);
				});

				//批量停用
				$('.btn-stop').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择会计科目！', "warning");
						return false;
					}
					page.delRow('unactive', checkedRow);
				});

				//下发
				$('.btn-senddown').on('click', function(e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();

					if(gnflData.length == 0) {
						ufma.alert('请选择会计科目！', "warning");
						return false;
					}
					var url = '';
					if($('body').data("code")) {
						url = '/ma/sys/expFuncSys/getRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					} else {
						url = '/ma/sys/expFuncSys/getSysRgInfo?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear;
					}
					page.modal = ufma.selectBaseTree({
						url: url,
						rootName: '所有区划',
						width: 650,
						title: '选择下发区划',
						bSearch: true, //是否有搜索框

						buttons: { //底部按钮组
							'确认下发': {
								class: 'btn-primary',
								action: function(data) {
									if(data.length == 0) {
										ufma.alert('请选择单位账套！', "warning");
										return false;
									}

									var dwCode = [];
									for(var i = 0; i < data.length; i++) {
										//dwCode.push({
										//	"toAgencyCode": data[i].id
										//});
										dwCode.push(data[i].CHR_CODE);
									}
									var url = '/ma/sys/coaAccSys/issue';
									var argu = {
										'chrCodes': gnflData,
										'toRgCodes': dwCode,
										"accsCode": page.accsCode,
										"agencyCode": page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									ufma.post(url, argu, function(result) {
										ufma.hideloading();
										ufma.showTip(result.msg, function() {}, result.flag);
										page.modal.close();
										page.issueTips(result);
									});
									//下发后取消全选
									$(".datatable-group-checkable,.checkboxes").prop("checked", false);
									$("#coaAcc-data").find("tbody tr.selected").removeClass("selected");
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
				});
				$('.btn-choose').on('click', function(e) {
					var params = {
						"accsCode": page.accsCode,
						// "acceCode": "",
						"agencyCode": page.agencyCode,
						"acctCode": "*",
						"agencyTypeCode": page.agencyType,
						"eleCode": "ACCO"
					};
					if(page.acctCode != "" && page.acctCode != undefined) {
						params.acctCode = page.acctCode;
					}
					var openData = {
						checkbox: true
					};
					openData.setYear = ma.setYear;
					openData.flag = "ACCSMA";
					openData.data = params;
					openData.rootName = "会计科目";

					ufma.open({
						url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
						title: '选择会计科目',
						width: 580,
						height: 545,
						data: openData,
						ondestory: function(result) {
							if(result.action) {
								var datas = [{
									"toAgencyCode": page.agencyCode,
									"toAcctCode": "*"
								}];
								if(page.acctCode != "" && page.acctCode != undefined) {
									datas[0].toAcctCode = page.acctCode;
								}
								var accoData = [];
								for(var i = 0; i < result.data.length; i++) {
									accoData.push(result.data[i].code);
								}
								ufma.showloading('数据选用中，请耐心等待...');
								var argu = {
									'chrCodes': accoData,
									"accsCode": page.accsCode,
									'toAgencyAcctList': datas,
									// 'agencyCode':result.data[0].agencyCode,
									'agencyCode': page.agencyCode,
									'rgCode': ma.rgCode,
									'setYear': ma.setYear
								};
								ufma.post('/ma/sys/coaAccSys/issue', argu, function(result) {
									ufma.hideloading();
									page.getCoaAccList(page.pageNum, page.pageLen);
									ufma.showTip(result.msg, function() {}, result.flag);
									page.issueTips(result,true);
								});
							};
						}
					});
				});

				$('#coaAcc-data').on('click', '.btn-copy', function(e) {
					var data = {
						"acctCode": $(this).attr('acctcode'),
						// "accsCode": $(this).attr('accscode'),
						"agencyCode": $(this).attr('agencycode'),
						"setYear": $(this).attr('setyear'),
						"userId": page.pfData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
						"eleCode": 'ACCO',
						"accsCode": page.accsCode
					}
					var acceCode = $(this).attr('acceCode');
					var rgCode = $(this).attr('rgCode');
					var chrCode = $(this).attr('chrCode');
					ufma.open({
						url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
						title: '选择目标科目',
						width: 580,
						height: 545,
						data: {
							'flag': 'ACCOS',
							'rootName': '会计科目',
							'checkbox': false,
							'leafRequire': true,
							'data': data,
						},
						ondestory: function(result) {
							if(result.action) {

								var argu = {
									"destAccoChrCodes": [result.data[0].code],
									"sourceAccoChrCodes": [chrCode],
									"rgCode": rgCode,
									"setYear": data.setYear,
									"agencyCode": data.agencyCode,
									"acctCode": data.acctCode,
									"accsCode": data.accsCode,
									"acceCode": acceCode,
									"accsCode": page.accsCode
								}
								ufma.post('/ma/sys/coaAccSys/copyAcco', argu, function(rst) {
									ufma.showTip(rst.msg, function() {}, 'success');
									page.getCoaAccList(page.pageNum, page.pageLen);
								});
							};
						}
					});
				});
			},

			//获取科目体系
			getAccsCode: function(agencyCode, acctCode) {
				ufma.get('/ma/sys/coaAccSys/getCoCoacc', {
					"agencyCode": agencyCode,
					"acctCode": acctCode
				}, function(result) {
					page.accsCode = result.data.accsCode;
					page.accsName = result.data.accsName;
					page.initAcce();
				});
			},

			//初始化账套
			initAcctScc: function() {
				page.cbAcct = $("#cbAcct").ufmaTreecombox2({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function(data) {
						//console.log(data);
						agencyTypeCode = data.agencyType;
						page.diffAgencyType = data.diffAgencyType;
						page.acctCode = data.code;
						page.accsCode = data.accsCode;
						page.agencyType = data.agencyType;
						page.agencyCode = page.cbAgency.getValue();
						//page.getAccsCode(page.agencyCode, page.acctCode);
						page.initAcce();
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
					},

				});
			},

			//初始化单位/帐套
			initAgencyScc: function() {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					url: "/ma/sys/commonRg/getAllRgInfo?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
					leafRequire: false,
					onchange: function(data) {
						//var code = data.id;
						//page.agencyCode = code;
						pfData.svRgCode = page.cbAgency.getValue();
						ma.rgCode = page.cbAgency.getValue();;
						page.rgCode = page.cbAgency.getValue();
						page.acctCode = '*';
						page.agencyCode = "*";
						page.initAccs();
						//page.initAcce();
						//});
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
					},
					initComplete: function(sender) {
						//page.cbAgency.val(page.pfData.svAgencyCode);
						if(!$.isNull(page.rgCode)) {
							page.cbAgency.val(page.rgCode);
						} else {
							page.cbAgency.val(1);
						}
					}
				});
				page.initAccs();
			},

			init: function() {
				//科目体系跳转
				page.fromChrCode = ma.GetQueryString("chrCode");
				//获取session
				page.pfData = ufma.getCommonData();
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.rgCode = pfData.svRgCode;
				page.isInit = true;
				//权限
				page.reslist = ufma.getPermission();
				if($('body').data("code")) {
					//page.initAcctScc();
					page.initAgencyScc();
					page.isSys = '1';
				} else {
					page.agencyCode = "*";
					ma.rgCode = pfData.svRgCode;
					page.rgCode = pfData.svRgCode;
					page.acctCode = '*';
					page.initAccs();
					page.isSys = '0';
				}
				ufma.parse();
				page.onEventListener();
				$('#eleAccs').ufTreecombox({
					idField: 'accountbookCode',

					textField: 'accountbookName',
					placeholder: '请选择科目体系',
					leafRequire: true,
					data: []
				})
			}
		}
	}();

	page.init();
});