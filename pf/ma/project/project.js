$(function() {
	var page = function() {
		inputParentName: '';
		//声明 全局datatable对象、全局tableID、全局tableID 局table的头部ID
		var projectTableAll, projectBox, projectTable, projectThead;
		var clevel = "";
		var prourlCode = "";
		var active = "";
		var unactive = "";

		var module = "ma"; //模块代码
		var compoCode = "project"; //部件代码
		var rgCode = "87"; //区划代码
		//储存页面已存在session的key
		var sessionKeyArr = [];
		var namespace = 'projectid';
		var agencyCode;
		var fifa;
		var selectTableUrl;
		var aParentCode;
		var pageLen;
		//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
		var prevAgencyCode = '';
		var sessionData = JSON.parse(window.sessionStorage.getItem("maobjData"))
		if(sessionData != undefined) {
			prevAgencyCode = sessionData.agencyCode;
			ufma.removeCache("maobjData");
		}
		var acctAlldata;
		//解决增加下级时/ma/sys/common/selectParentTree接口参数chrCode传输有误--zsj
		var parentCode = '';
		//bug79133--解决保存并新增时上级项目未刷新问题、编辑界面上级项目未正确带入问题
		var editParentCode = '';
		return {
			isRuled: true,
			//初始化页面
			initPage: function(pageNum, pageLen) {
				page.aParentCode = [];
				var tt = new Object();
				tt.agencyCode = page.agencyCode;
				tt.allowAddsub = "string";
				page.setSelectData();
				page.datetype();
				//page.loadGridData();
			},
			initTable: function(tableData) {
				var toolBar = "#project-tool-bar";
				var id = "project-table-id";
				page.projectTableAll = page.projectTable.DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": tableData,
					"processing": true,
					"pagingType": "full_numbers",
					"lengthChange": true,
					"bDestroy": true,
					"bAutoWidth": false, //表格自定义宽度，和swidth一起用
					"bSort": false, //排序功能
					"pageLength": ufma.dtPageLength("#" + id),
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					"fixedHeader": {
						header: true,
						footer: true
					},
					"columns": [{
							title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline "> <input type="checkbox"' +
								'id="CheckAll"/> &nbsp;<span></span> </label>',
							data: 'chrCode',
							defaultContent: "",
							className: "check-width"
						},
						{
							title: "项目编码",
							data: "chrCode",
							className: "project-stau isprint",
							width: 300,
							"render": function(data, type, rowdata, meta) {
								if(!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return "";
								}
							}
						},
						{
							title: "项目名称",
							data: "chrName",
							className: "project-stau isprint"
						},
						{
							title: "项目负责人",
							data: "promanagerName",
							className: "project-stau isprint",
							"render": function(data, type, rowdata, meta) {
								if(!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return "";
								}
							}
						},
						{
							title: "项目类别",
							data: "protypeName",
							className: "project-stau isprint",
							"render": function(data, type, rowdata, meta) {
								if(!$.isNull(data)) {
									return '<span title="' + data + '">' + data + '</span>';
								} else {
									return "";
								}
							}
						},
						{
							title: "状态",
							data: "enabledCn",
							width: 60,
							className: "project-stau isprint",
						},
						{
							title: "操作",
							data: "chrCode",
							width: 120,
							"searchable": false,
						},
						{
							title: "开始日期",
							data: "startdate",
							"searchable": false,
						},
						{
							title: "结束日期",
							data: "enddate",
							"searchable": false,
						},
						{
							title: "备注",
							data: "summary",
							"searchable": false,
						}
					],
					"columnDefs": [{
							"targets": [0],
							"searchable": false,
							"orderable": false,
							"render": function(data, type, rowdata, meta) {
								if(data != null) {
									return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline check-width"> <input class="singleCheck" type="checkbox" name="checkList" value="' + data + '" data-code="' + rowdata.chrCode + '"/> &nbsp;<span></span> </label>';
								} else {
									return "";
								}
							}
						},
						{
							"targets": [2],
							"serchable": false,
							"orderable": false,
							"className": "nowrap",
							"render": function(data, type, rowdata, meta) {
								var textIndent = '0';
								if(rowdata.levelNum) {
									textIndent = (parseInt(rowdata.levelNum) - 1) + 'em';
								}
								var alldata = JSON.stringify(rowdata);
								return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" title="' + data + '" data-href=\'' + alldata + '\'>' + data + '</a>';
							}
						},
						{
							"targets": [6],
							"serchable": false,
							"orderable": false,
							"width": 120,
							"className": "tc nowrap btnGroup",
							"render": function(data, type, rowdata, meta) {

								var active = rowdata.enabled == 1 ? 'hidden' : 'hidden:false';
								var unactive = rowdata.enabled == 0 ? 'hidden' : 'hidden:false';
								var chrCode = rowdata.chrCode;
								var addlower = "";
								if($('body').attr("data-code")) {
									if(page.agencyCtrlLevel != '0101') {
										addlower = "";
									} else {
										addlower = 'hidden';
									}
								} else {
									addlower = '';
								}
								if (isOperate == "1") {
									var rd = '<a class="btn btn-icon-only btn-sm btn-addlower ' + (ma.fjfa != '' ? '' : 'none') + '" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="增加下级" disabled>' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission project-single-start btn-start" ' + active + '  data-toggle="tooltip" action="active" chrCode=' + chrCode + ' title="启用" disabled>' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission project-single-stop btn-stop"  ' + unactive + '  data-toggle="tooltip" action="unactive" chrCode=' + chrCode + ' title="停用" disabled>' +
									'<span class="glyphicon glyphicon icon-ban"></span></a></span></a><a class="btn btn-icon-only btn-sm project-single-delete btn-delete" data-toggle="tooltip" ' + addlower + ' action= "delete" rowid="' + data + '" chrCode="' + chrCode + '" title="删除" disabled>' +
									'<span class="glyphicon icon-trash"></span></a>';
								if(rowdata.isLeaf == 0) {
									rd = rd + '<a class="btn btn-icon-only btn-sm btn-copy" data-toggle="tooltip" action= "copy" rgcode="' + rowdata.rgCode + '" chrcode="' + rowdata.chrCode + '" setyear="' + rowdata.setYear + '" agencycode="' + rowdata.agencyCode + '" title="复制下级项目" disabled>' +
										'<span class="glyphicon icon-discount"></span></a>';
								}
								return rd;
								} else {
									var rd = '<a class="btn btn-icon-only btn-sm btn-addlower ' + (ma.fjfa != '' ? '' : 'none') + '" data-toggle="tooltip" ' + addlower + '  action= "addlower" rowid="' + data + '" chrCode="' + chrCode + '" agencyCode="' + agencyCode + '" title="增加下级">' +
									'<span class="glyphicon icon-add-subordinate"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission project-single-start btn-start" ' + active + '  data-toggle="tooltip" action="active" chrCode=' + chrCode + ' title="启用">' +
									'<span class="glyphicon icon-play"></span></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission project-single-stop btn-stop"  ' + unactive + '  data-toggle="tooltip" action="unactive" chrCode=' + chrCode + ' title="停用">' +
									'<span class="glyphicon glyphicon icon-ban"></span></a></span></a><a class="btn btn-icon-only btn-sm project-single-delete btn-delete" data-toggle="tooltip" ' + addlower + ' action= "delete" rowid="' + data + '" chrCode="' + chrCode + '" title="删除">' +
									'<span class="glyphicon icon-trash"></span></a>';
								if(rowdata.isLeaf == 0) {
									rd = rd + '<a class="btn btn-icon-only btn-sm btn-copy" data-toggle="tooltip" action= "copy" rgcode="' + rowdata.rgCode + '" chrcode="' + rowdata.chrCode + '" setyear="' + rowdata.setYear + '" agencycode="' + rowdata.agencyCode + '" title="复制下级项目">' +
										'<span class="glyphicon icon-discount"></span></a>';
								}
								return rd;
								}
								
							}
						},
						{
							"targets": [3, 4, 5],
							"serchable": false
						},
						{
							"targets": [7, 8, 9],
							"serchable": false,
							"orderable": false,
							"visible": false
						}

					],
					"order": [
						[0, null]
					],
					"dom": '<"printButtons"B>rt<"project-table-id-paginate"ilp>',
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
						ufma.hideloading();
						if($('body').attr("data-code")) {
							if(page.agencyCtrlLevel != '0101') {
								$('#project-delete').removeClass('hidden')
							} else {
								$('#project-delete').addClass('hidden')
							}
						} else {
							$('#project-delete').removeClass('hidden')
						}
						$("#printTableData").html("");
						$("#printTableData").append($(".printButtons"));

						$("#printTableData .buttons-print").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#printTableData .buttons-excel").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						//导出begin
						$("#printTableData .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#' + id), '项目');
						});
						//导出end							
						$('#printTableData.btn-group').css("position", "inherit");
						$('#printTableData div.dt-buttons').css("position", "inherit");
						$('#printTableData [data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.project-table-id-paginate').appendTo($info);

						if(pageLen != "" && typeof(pageLen) != "undefined") {
							$('#project-table-id').DataTable().page.len(pageLen).draw(false);
							if(pageNum != "" && typeof(pageNum) != "undefined") {
								$('#project-table-id').DataTable().page(parseInt(pageNum) - 1).draw(false);
							}
						}
						//全选
						$("#CheckAll,.check-all input").on("click", function() {
							if($(this).prop("checked") === true) {
								$("#CheckAll,.check-all input").prop("checked", $(this).prop("checked"));
								page.projectTable.find("input[name='checkList']").prop("checked", $(this).prop("checked"));
								page.projectTable.find("tbody tr").addClass("selected");
							} else {
								$("#CheckAll,.check-all input").prop("checked", false);
								page.projectTable.find("input[name='checkList']").prop("checked", false);
								page.projectTable.find("tbody tr").removeClass("selected");
							}
						});
						$("#project-table-id").tblcolResizable();
						//固定表头
						$("#project-table-id").fixedTableHead($("#outDiv"));
					},
					"drawCallback": function(settings) {
						// page.reslist = ufma.getPermission();
						ufma.isShow(page.reslist);

						$("[data-toggle='tooltip']").tooltip();
						$("[data-toggle='tooltip']").tooltip();
						$("td.project-stau").each(function() {
							if($(this).text() == "启用") {
								$(this).css("color", "#00A854");
							} else if($(this).text() == "停用") {
								$(this).css("color", "#F04134");
							}
						});

						$('#' + id).find("td.dataTables_empty").text("")
							.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

						$('#' + id + ' .btn').on('click', function() {
							//page.delRow($(this).attr('action'), [$(this).attr('chrCode')], $(this).closest('tr'));
							page._self = $(this);

						});
						$('#' + id + ' .project-single-delete').ufTooltip({
							content: '您确定删除当前项目吗？',
							onYes: function() {
								ufma.showloading('数据删除中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						});
						$('#' + id + ' .project-single-start').ufTooltip({
							content: '您确定启用当前项目吗？',
							onYes: function() {
								ufma.showloading('数据启用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						});
						$('#' + id + ' .project-single-stop').ufTooltip({
							content: '您确定停用当前项目吗？',
							onYes: function() {
								ufma.showloading('数据停用中，请耐心等待...');
								page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
							},
							onNo: function() {}
						});
					}
				});
				//翻页取消勾选
				$("#project-table-id").on('page.dt', function() {
					$(".datatable-group-checkable,#CheckAll").prop("checked", false);
					$("#project-table-id").find("tbody tr.selected input").prop("checked", false);
					$("#project-table-id").find("tbody tr.selected").removeClass("selected");
				});
			},
			loadGridData: function() {
				if(page.chooseAcctFlag == true) {
					page.projectTableAll.clear().destroy();
					var data = [];
					if(data.length != 0) {
						page.initTable(result.data);
					}
					ufma.showTip('请选择账套', function() {}, 'warning');
					return false;
				} else {
					//表格入口
					page.projectBox = $("#project-box-id");
					page.projectTable = $('#project-table-id');
					page.projectThead = $('#project-thead-id');
					page.loadCallback = function(result) {
						//bugCWYXM4895--切换单位时没有重新渲染表格导致表头错乱问题--zsj
						page.projectTableAll.clear().destroy();
						page.initTable(result.data);
					}
					page.selectTableUrl = page.baseUrl + "eleProject/select/" + enabled;
					ufma.get(page.selectTableUrl, {
						"agencyCode": page.agencyCode,
						"acctCode": page.acctCode
					}, page.loadCallback);
				}

			},

			//选用页面初始化
			getProjectChoose: function(pageNum, pageLen) {
				/*var argu = $('#query-tj').serializeObject();
				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;*/
				var argu = {
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					eleCode: 'PROJECT',
					bgttypeCode: ""
				};
				//var url = "/ma/sys/eleProject/select/" + enabled;
				//ufma.showloading('正在加载数据，请耐心等待...');
				var callback = function(result) {
					if(result.data.length > 0) {
						page.issueAgecyCode = result.data[0].agencyCode;
					}
					var id = "expfunc-choose-datatable";
					var toolBar = $('#' + id).attr('tool-bar');
					$('#' + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						// "fixedHeader": {
						//     header: true
						// },
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
								//title: page.pageTitle + "编码",
								title: "项目编码",
								data: "code",
								"render": function(data, type, rowdata, meta) {
									if(!$.isNull(data)) {
										return '<span title="' + data + '">' + data + '</span>';
									} else {
										return "";
									}
								}
							},
							{
								//title: page.pageTitle + "名称",
								title: "项目名称",
								data: "codeName",
								"render": function(data, type, rowdata, meta) {
									if(!$.isNull(data)) {
										return '<span title="' + data + '">' + data + '</span>';
									} else {
										return "";
									}
								}
							},
							{
								title: "状态",
								data: "enabled"
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
										'<input type="checkbox" class="checkboxes" value="' + data + '" />&nbsp;' +
										'<span></span> </label>';
								}
							},
							{
								"targets": [3],
								"render": function(data, type, rowdata, meta) {
									if(rowdata.enabled == 1) {
										return '<span style="color:#00A854">启用</span>';
									} else {
										return '<span style="color:#F04134">停用</span>';
									}
								}
							}
						],
						"dom": 'rt<"' + id + '-paginate"ilp>',
						"initComplete": function(settings, json) {
							var $info = $(toolBar + ' .info');
							if($info.length == 0) {
								$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							}
							$info.html('');
							$('[data-toggle="tooltip"]').tooltip();
							$('.' + id + '-paginate').appendTo($info);
							$('#' + id + ' tbody td').on('click', function(e) {
								e.preventDefault();
								var $ele = $(e.target);
								var $tr = $ele.closest('tr');
								if($tr.hasClass('selected')) {
									$tr.removeClass('selected');
									$tr.find('input[type="checkbox"]').prop("checked", false);
								} else {
									$tr.addClass('selected');
									$tr.find('input[type="checkbox"]').prop("checked", true);
								}
							});
							ufma.setBarPos($(window));
							var heitab = $("#expfunc-choose-content .tab-content").height() + 10
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							if(scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
							}
						},
						"drawCallback": function(settings) {
							ufma.setBarPos($(window));
							// ufma.parseScroll();
							$('#' + id).find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
							$(".datatable-choose-checkall").prop("checked", false);
							$(".datatable-choose-checkall").on('change', function() {
								var t = $(this).is(":checked");
								$('#' + id).find('.checkboxes').each(function() {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-choose-checkall").prop("checked", t);
							});
							var heitab = $("#expfunc-choose-content .tab-content").height() + 10
							var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
							if(scltop <= heitab) {
								$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
							} else {
								$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
							}
						}
					});
					//ufma.hideloading();
				};
				ufma.get(ma.commonApi.getCanIssueEleTree, argu, callback);
				//ufma.get(url, argu, callback);
			},
			serilizeProjInfo: function() {
				var argu1 = $('#jbxx').serializeObject();
				var argu2 = $('#xmxx').serializeObject();
				var data = $.extend(argu1, argu2);
				return data;
			},
			openEditWin: function(data) {
				page.defaultRightInfor("project-ul", "项目");
				page.isRuled = true
				page.editor = ufma.showModal('project-edt', 1050, 500);
				//bugCWYXM-4424--打开弹窗时应该加载相应的树-zsj
				$('#protypeCode').ufTreecombox({
					idField: 'code',
					textField: 'codeName',
					pIdField: 'pCode',
					data: [],
					readonly: false,
					leafRequire: true,
					name: 'protypeCode'
				});
				page.initDepproCode();
				page.initProType();
				page.initDepartMent();
				page.initFZR();
				page.initCDDW();
				if(!$.isNull(data) && data.length > 0) {
					editParentCode = data.parentCodeName;
				}

				//校验--项目代码
				if((page.action == 'add' || page.action == 'addlower')) { // && ma.fjfa != ''--此处不能加上编码规则--zsj
					$('#chrCode').on('keydown keyup change', function(e) {
						e.stopepropagation;
						$('#chrCode').closest('.form-group').removeClass('error');
						$(this).val($(this).val().replace(/[^\w\.\/]/ig, '')); //修改bug77427--zsj--项目编码允许输入英文字母和下划线、数字的编码
						var textValue = $(this).val();
					}).on('blur', function() {
						var value = $(this).val();
						var dmJson = ufma.splitDMByFA(ma.fjfa, value);
						//修改bug77349--zsj
						if(ma.fjfa != '') {
							page.isRuled = dmJson.isRuled;
						} else {
							page.isRuled = true;
						}
						page.aInputParentCode = dmJson.parentDM.split(',');
						page.aInputParentCode.pop();
						if((page.aInputParentCode.length > 0)) {
							page.aInputParentCode = [page.aInputParentCode.pop()];
						} else {
							page.aInputParentCode = [];
						}
						var t = $(this);
						if(value.length > 0) {
							page.showParentHelp(value, t);
							// page.initUpProject(textValue);
						}

					});
				}

				//先注销，单击行打开的时候因为初始化的数据和序列化的数据区别较大，无法判定是否已修改
				//page.formdata=data;
				page.initXMFJ();
				page.formdata = page.serilizeProjInfo();
				if(ma.fjfa != '') {
					$('#prompt').text('编码规则：' + ma.ruleData.codeRule);
				}

				//查看和增加下级，打开窗口0.5m后，获取上级项目
				var timeId = setTimeout(function() {
					clearTimeout(timeId)
					page.initUpProject($("#chrCode").val());
				}, 500)
			},
			//编码名称下面的提示
			showHelpTips: function(value, t) {
				var timeId = setTimeout(function() {
					value = t.val(t.val().replace(/[^\w\.\/]/ig, '')); //修改bug77427--zsj--项目编码允许输入英文字母和下划线、数字的编码
					value = t.val();
					if(value == '') {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					} else if(!ufma.isNumOrChar(value)) {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(6) + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
						$('#chrCode').val('');
					} else if(!page.isRuled) {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(9) + ' ' + ma.fjfa + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					} else if(!ufma.arrayContained(page.aParentCode, page.aInputParentCode) && page.aInputParentCode.length > 0) {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(3) + '</span>');
						$('#chrCode').closest('.form-group').addClass('error');
					} else if($.inArray(value, page.aParentCode) != -1 && page.action != 'edit') {
						ufma.showInputHelp('chrCode', '<span class="error">' + page.getErrMsg(8) + '</span>'); //已存在
						$('#chrCode').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('chrCode');
						$('#chrCode').closest('.form-group').removeClass('error');
						var obj = {
							"chrCode": value,
							"tableName": 'MA_ELE_PROJECT',
							"eleCode": 'PROJECT',
							"rgCode": ma.rgCode,
							"setYear": ma.setYear,
							"agencyCode": page.agencyCode,
							"acctCode": page.acctCode
						}
						ma.nameTip = "";
						ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function(result) {
							ma.nameTip = result.data;
						});
					}
					clearTimeout(timeId);
					// page.initUpProject(); //编码输入完毕后获取上级项目--bug79257--zsj

					page.initUpProject($("#chrCode").val());
				}, 200);
			},
			//还原基础资料item弹窗的默认值
			defaultRightInfor: function(id, infor) {
				$("#" + id).html("");
				var liHtml = '<li>请输入' + infor + '编码获得参考信息</li>';
				$("#" + id).html(liHtml)
			},
			openChooseWin: function() {
				page.choosePage = ufma.showModal('project-choose', 1000, 500);
			},
			setFormEnabled: function() {
				$('#xmxx').find('.form-group').each(function() {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});
				$('#jbxx').find('.form-group').each(function() {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});
				if(page.action == 'edit') {
					$("#project-edt>.u-msg-title>h4").text("编辑项目")
					$('#chrCode').attr('disabled', true)
				}
				if(page.action == 'addlower') {
					$('#chrCode').attr('disabled', false)
				}
				if(page.action == 'add') {
					$("#project-edt>.u-msg-title>h4").text("新增项目")
					$('#chrCode').attr('disabled', false)
					$('#jbxx')[0].reset();
					$('#xmxx')[0].reset();
				}
				//平台维护不可修改
				if (isOperate == "1") {
					setTimeout(function () {
						$("#jbxx").disable();
						$("#xmxx").disable();
					}, 300)
					$("#attachUploadBtn").addClass("disabled");
					$("#btn-saveadd").addClass("disabled");
					$("#btn-save").addClass("disabled");
				}
			},
			//
			initField: function(data) {
				$("#field1").ufmaTreecombox().setValue("", "");
				$("#field2").ufmaTreecombox().setValue("", "");
				$("#field3").ufmaTreecombox().setValue("", "");
				$("#field4").ufmaTreecombox().setValue("", "");
				$("#field5").ufmaTreecombox().setValue("", "");
				ufma.deferred(function() {
					$('#form-expfunc').setForm(data);
					$("#field1").ufmaTreecombox().val(data.field1);
					$("#field2").ufmaTreecombox().val(data.field2);
					$("#field3").ufmaTreecombox().val(data.field3);
					$("#field4").ufmaTreecombox().val(data.field4);
					$("#field5").ufmaTreecombox().val(data.field5);
				});
			},

			//取消全选
			cancelCheckAll: function() {
				$("#CheckAll,.check-all input").prop("checked", false);
				page.projectTable.find("input[name='checkList']").prop("checked", false);
				page.projectTable.find("tbody tr").removeClass("selected");
			},

			delRow: function(action, chrCodes, $tr) {
				page.pageNum = $('.project-table-id-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#project-table-id_length').find('select').val());
				var argu = {};
				var callback = function(result) {
					ufma.hideloading();
					if(action == 'delete') {
						if($tr)
							$tr.remove();
						if(result.flag == 'success') {
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else if(action == 'active') {
						if(result.flag == 'success') {
							ufma.showTip('启用成功', function() {}, 'success');
						}
					} else if(action == 'unactive') {
						if(result.flag == 'success') {
							ufma.showTip('停用成功！', function() {}, 'success');
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");

						}
					}
					page.loadGridData();
					page.cancelCheckAll();
					page.initPage(page.pageNum, page.pageLen);
				}
				if(action == 'delete') {
					ufma.confirm('您确定删除选中的数据吗？', function(action) {
						if(action) {
							//点击确定的回调函数
							ufma.showloading('数据删除中，请耐心等待...');
							var url = page.baseUrl + "eleProject/delete";
							argu.agencyCode = page.agencyCode;
							argu.acctCode = page.acctCode;
							argu.chrCodes = chrCodes;
							ufma.delete(url, argu, callback);
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});
				} else {
					var url = page.baseUrl + "eleProject/able";
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					argu.chrCodes = chrCodes;
					argu.table = 'MA_ELE_PROJECT';
					argu.action = action;
					if(action == "active") {
						ufma.confirm('您确定启用选中的项目吗？', function(e) {
							ufma.showloading('数据启用中，请耐心等待...');
							if(e) {
								ufma.put(url, argu, callback);
							}
						}, {
							type: 'warning'
						})
					} else if(action == "unactive") {
						ufma.confirm('您确定停用选中的项目吗？', function(e) {
							ufma.showloading('数据停用中，请耐心等待...');
							if(e) {
								ufma.put(url, argu, callback);
							}
						}, {
							type: 'warning'
						})
					}

				}

			},
			delRowOne: function(action, chrCodes, $tr) {
				page.pageNum = $('.project-table-id-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#project-table-id_length').find('select').val());
				var argu = {};
				var callback = function(result) {
					ufma.hideloading();
					if(action == 'delete') {
						ufma.hideloading();
						if(result.flag == 'success') {
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else if(action == 'active') {
						ufma.hideloading();
						if(result.flag == 'success') {
							ufma.showTip('启用成功', function() {}, 'success');
						}
					} else if(action == 'unactive') {
						ufma.hideloading();
						if(result.flag == 'success') {
							ufma.showTip('停用成功！', function() {}, 'success');
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
					}
					page.loadGridData();
					page.initPage(page.pageNum, page.pageLen);
				}
				if(action == 'delete') {
					var url = page.baseUrl + "eleProject/delete";
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					argu.chrCodes = chrCodes;
					ufma.delete(url, argu, callback);
				} else if(action == 'addlower') {
					$('#expFunc-chrCode').trigger('click');
					page.action = 'addlower';
					parentCode = chrCodes[0];
					var argu = {
						chrCode: chrCodes[0],
						eleCode: 'PROJECT',
						tableName: 'MA_ELE_PROJECT',
						'agencyCode': page.agencyCode,
						'acctCode': page.acctCode
					};
					var callback = function(result) {
						var data = result.data;
						page.clearModelData();
						$('#jbxx')[0].reset();
						$('#xmxx')[0].reset();
						$('#chrCode').val(data)
						page.openEditWin();
						$('#chrCode').trigger('blur');
						// page.initProject();

					}
					//					ufma.post('/ma/agy/eleProject/getMaxLowerCode', argu, callback);
					ufma.post('/ma/sys/common/getMaxLowerCode', argu, callback);
				} else {
					var url = page.baseUrl + "eleProject/able";
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					argu.chrCodes = chrCodes;
					argu.table = 'MA_ELE_PROJECT';
					argu.action = action;
					ufma.put(url, argu, callback);
				}

			},
			//日期控件
			datetype: function() {
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date()
				});
			},

			//下拉框赋值
			setSelectData: function() {
				//进度条初始化
				// $(".abt .bt").addClass("abt-btno");
				// $(".abt p").addClass("abt-pno");

				ufma.comboxInit('project-type');
				//ufma.comboxInit('depproCode');
				//for input string的注释
				// ufma.comboxInit('parentId');
			},

			getErrMsg: function(errcode) {
				var error = {
					0: '项目编码不能为空',
					1: '上级项目不能为空',
					2: '项目名称不能为空',
					3: '上级编码不存在',
					4: '项目负责人不能空',
					5: '承担单位不能空',
					6: '编码只能是字母或者数字',
					8: '编码已存在',
					9: '编码不符合编码规则:'
				}
				return error[errcode];
			},

			jCodeName: {},

			showParentHelp: function(parentCodes, t) {
				if(!ufma.isNumOrChar(parentCodes)) {
					return true;
				}
				var url = '/ma/sys/common/findParentList?chrCode=' + parentCodes + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=PROJECT';
				var callback = function(result) {
					var htm = '';
					if(result.data.length > 0) {
						page.aParentCode = [];
						page.aParentName = [];
					}
					$.each(result.data, function(idx, row) {
						if(idx == 0) {
							htm += ufma.htmFormat('<li style="padding-left:0px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.code,
								'CHR_NAME': row.name
							});
						} else {
							htm += ufma.htmFormat('<li style="padding-left:16px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.code,
								'CHR_NAME': row.name
							});
						}
						page.aParentCode.push(row.code);
						page.jCodeName[row.code] = row.name;
					});
					$('#project-ul').html(htm);
					page.showHelpTips(parentCodes, t);
				};
				ufma.get(url, '', callback);
			},

			//button控制
			setButtonDisable: function(id) {
				if(enabled == "1") {
					var tag = document.getElementById("project-start");
					tag.disabled = true;
					var tag = document.getElementById("project-stop");
					tag.disabled = false;
					active = "disabled";
					unactive = "";
				} else if(enabled == "0") {
					var tag = document.getElementById("project-start");
					tag.disabled = false;
					var tag = document.getElementById("project-stop");
					tag.disabled = true;
					active = "";
					unactive = "disabled";
				} else if(enabled == "-1") {
					var tag = document.getElementById("project-start");
					tag.disabled = false;
					var tag = document.getElementById("project-stop");
					tag.disabled = false;
					active = "";
					unactive = "";
				}
			},

			//保存入库请求
			save: function(goon) {
				page.pageNum = $('.project-table-id-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#project-table-id_length').find('select').val());
				//CWYXM-7814--修改新增时涉密级别问题--zsj
				$(".abt .abt-btr").each(function() {
					if($(this).attr('id') == "one") {
						clevel = "0";
					} else if($(this).attr('id') == "two") {
						clevel = "1";
					} else if($(this).attr('id') == "three") {
						clevel = "2";
					} else if($(this).attr('id') == "four") {
						clevel = "3";
					}
				});
				var url = page.baseUrl + 'eleProject/save';
				var argu1 = $('#jbxx').serializeObject();

				var argu2 = $('#xmxx').serializeObject();

				var argu = $.extend(argu1, argu2);
				argu.clevel = clevel;
				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.setYear = ma.setYear;
				argu.rgCode = ma.rgCode;
				ufma.showloading('正在保存数据，请耐心等待...');
				var callback = function(result) {
					ufma.hideloading();
					ufma.showTip(result.msg, '', result.flag);
					if(result.flag == 'success') {
						//page.addLastVer();
						page.loadGridData();
						page.initPage(page.pageNum, page.pageLen);
					}
					if(goon) {
						page.clearModelData();
						ma.fillWithBrother($('#chrCode'), {
							"chrCode": argu.chrCode,
							"eleCode": 'PROJECT',
							"agencyCode": page.agencyCode
						});
						//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
						setTimeout(function() {//CWYXM-9565--显示上级项目
							var parentCode = $('#chrCode').val();
							page.initUpProject(parentCode);
						}, 1000)

					} else {
						var attachNum = $('#vouAttachBox').find('.attach-num').text();
						if(attachNum == '0') {
							ufma.confirm('项目信息保存成功，是否继续上传附件？', function(ok) {
								if(!ok) {
									page.editor.close();
								} else {
									$('#project-edt .u-msg-content').scrollTop($('#vouAttachBox').position().top);
								}
							})
							$('#chrId').val(result.data.chrId);
							$("#lastVer").val(result.data.lastVer);
						} else {
							page.editor.close();
						}
						page.action = 'edit'
					}
				}
				argu.agencyCode = page.agencyCode;
				var chrFullname = "";
				if(ma.nameTip != null && ma.nameTip != undefined) {
					chrFullname = ma.nameTip + '/' + argu.chrName;
				} else {
					chrFullname = argu.chrName;
				}
				argu.chrFullname = chrFullname;
				argu.promanager = $("#promanager").getObj().getItem() ? $("#promanager").getObj().getItem().code : "";
				ufma.post(url, argu, callback);
			},
			addLastVer: function() {
				var lastVerVal = $('#lastVer').val();
				if(lastVerVal == '' || lastVerVal == undefined) {
					lastVerVal = 0;
				}
				lastVerVal = parseInt(lastVerVal) + 1;
				$('#lastVer').val(lastVerVal);
			},
			clearModelData: function() {
				$("#project-edt").find("input[name='chrId']").val("");
				$("#project-edt").find("input[name='chrCode']").val("");
				$("#project-edt").find("input[name='chrName']").val("");
				$("#project-edt").find("input[name='startdate']").val("");
				$("#project-edt").find("input[name='enddate']").val("");
				$("#assCode").val("");
				$('#summaryNeed').val('');
				//$("#project-edt").find("input[name='summary']").val("");
				$("#project-edt").find("input[name='lastVer']").val("");
				$(".abt .bt:first").addClass('abt-btr').removeClass('abt-btno');
				$(".abt p:first").addClass('abt-btr').removeClass('abt-btno');
				$(".abt .bt:gt(0)").addClass("abt-btno").removeClass("abt-btr");
				$(".abt p:gt(0)").addClass("abt-pno").removeClass("abt-pr");
				//新增时项目状态重置为：未开始--zsj
				$("#wks").addClass("selected").siblings().removeClass("selected");
			},
			setModelData: function(paramter) {
				$("#project-edt").find("input[name='chrId']").val(paramter.chrId);
				$("#project-edt").find("input[name='chrCode']").val(paramter.chrCode);
				$("#project-edt").find("input[name='chrName']").val(paramter.chrName);
				// $("#project-edt").find("input[name='startdate']").val(paramter.startdate);
				// $("#project-edt").find("input[name='enddate']").val(paramter.enddate);
				$("#startdate").getObj().setValue(paramter.startdate);
				$("#enddate").getObj().setValue(paramter.enddate);
				//$("#project-edt").find("input[name='summary']").val(paramter.summary);
				$("#project-edt").find("input[name='lastVer']").val(paramter.lastVer);
				$("#project-edt").find("input[name='assCode']").val(paramter.assCode);
				//$('#proagency').getObj().val(paramter.proagency);
				if(!$.isNull(page.promanagerData)) {
					for(var i = 0; i < page.promanagerData.length; i++) {
						if(page.promanagerData[i].code == paramter.promanager) {
							paramter.promanager = page.promanagerData[i].id
						}
					}
					$('#promanager').getObj().val(paramter.promanager);
				}

				//$('#promanager').getObj().val(paramter.promanager)
				$('#bgtorgCode').getObj().val(paramter.bgtorgCode);
				$('#orgCode').getObj().val(paramter.orgCode);
				if(!$.isNull(page.depproCodeData) && page.depproCodeData.length > 0) {
					$('#depproCode').getObj().val(paramter.depproCode);
				}

				$('#protypeCode').getObj().val(paramter.protypeCode);
				if(page.action != 'edit') {
					page.showParentHelp(paramter.chrCode);
				}
				if(paramter.chrName.length > 0) {

					page.parentCode = paramter.parentCode;
					page.initUpProject(paramter.chrCode);
					//page.upProject.val(paramter.chrId);
					$('#proagency').getObj().val(paramter.proagency);
				}
				var clevel = paramter.clevel;
				$(".abt .bt").addClass("abt-btno").removeClass("abt-btr");
				$(".abt p").addClass("abt-pno").removeClass("abt-pr");
				if(clevel == "0") {
					$("#one").addClass("abt-btr").removeClass("abt-btno");
					$("#clevelOne").addClass("abt-pr").removeClass("abt-pno");
				} else if(clevel == "1") {
					$("#two").addClass("abt-btr").removeClass("abt-btno");
					$("#clevelTwo").addClass("abt-pr").removeClass("abt-pno");
				} else if(clevel == "2") {
					$("#three").addClass("abt-btr").removeClass("abt-btno");
					$("#clevelThree").addClass("abt-pr").removeClass("abt-pno");
				} else if(clevel = "3") {
					$("#four").addClass("abt-btr").removeClass("abt-btno");
					$("#clevelFour").addClass("abt-pr").removeClass("abt-pno");
				}

				//修改导入项目或编辑已有项目时对项目状态的赋值--zsj--bug78752
				var prostatus = paramter.prostatus;
				if(prostatus == "1") {
					$("#wks").addClass("selected").siblings().removeClass("selected");
				} else if(prostatus == "2") {
					$("#jxz").addClass("selected").siblings().removeClass("selected");
				} else if(prostatus == "3") {
					$("#wcbjs").addClass("selected").siblings().removeClass("selected");
				} else if(prostatus = "4") {
					$("#jswc").addClass("selected").siblings().removeClass("selected");
				}
				$('#summaryNeed').val(paramter.summary);
			},

			getCheckedRowIds: function() {
				table = page.projectTableAll;
				activeLine = table.rows('.selected');
				var data = activeLine.data();
				var rowids = [];
				for(i = 0; i < data.length; i++) {
					rowids.push(data[i].chrId);
				}
				return rowids;
			},
			getCheckedRows: function() {
				table = page.projectTableAll;
				activeLine = table.rows('.selected');
				var data = activeLine.data();
				var rowids = [];
				for(i = 0; i < data.length; i++) {
					rowids.push(data[i].chrCode);
				}
				return rowids;
			},
			getDW: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//bug79047
				//var codes = page.getCheckedRowIds();
				var codes = page.getCheckedRows();
				var id = 'dw-used';
				var url = "/ma/sys/common/countAgencyUse";
				var argu = {
					//'codes': codes,
					"table": 'MA_ELE_PROJECT',
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					'agencyCode': page.agencyCode,
					"acctCode": page.acctCode,
					'chrCodes': codes,
					'eleCode': 'PROJECT'
				};
				var callback = function(result) {
					ufma.hideloading();
					$('#dw-used').DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"data": result.data,
						"bFilter": false, //去掉搜索框
						"paging": false,
						"bLengthChange": true, //去掉每页显示多少条数据
						"processing": true, //是否显示正在加载
						"pagingType": "first_last_numbers", //分页样式
						"lengthChange": false, //是否允许用户自定显示数量
						"pageLength": ufma.dtPageLength("#" + id),
						"bInfo": false, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度
						"bProcessing": true,
						"bDestroy": true,
						"columns": [{
								title: "单位",
								data: "agencyName"

							},
							{
								title: "已用",
								data: "issuedCount"
							}
						]
					});
				}
				ufma.post(url, argu, callback);
			},

			initUpProject: function(chrCode) {
				var data = [];

				function buildCombox() {
					page.upProject = $('#parentId').ufmaCombox({
						valueField: 'code',
						textField: 'codeName',
						data: data,
						parentCode: 'code'
					});
					if(data.length > 0) {
						if(page.action == "edit") {
							page.upProject.val(page.parentCode)
						}
					}
					//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
					if(!$.isNull(editParentCode)) {
						$("#parentId_input").val(editParentCode);
					}
					//修改bug77349--zsj
					if(data.length != 0 && (page.action == 'add' || page.action == 'addlower')) {
						$("#parentId_input").val(data[0].codeName);
					}

				};

				if(chrCode == '') {
					buildCombox();
					return false;
				}

				var callback = function(result) {

					data = result.data;
					buildCombox();
				};
        // var url = '/ma/sys/common/selectParentTree';
				// ufma.post(url, {
				// 	"chrCode": chrCode,
				// 	"eleCode": "PROJECT",
				// 	"rgCode": ma.rgCode,
				// 	"setYear": ma.setYear,
				// 	"agencyCode": page.agencyCode,
				// 	"acctCode": page.acctCode
				// }, callback);
        // CWYXM-19371 --基础数据维护->财政项目，财政项目没有编码规则时，修改界面中上级财政项目应该过滤掉：1.修改数据本身；2.修改数据的下级财政项目--zsj
        var argu = {};
        argu.eleCode = 'PROJECT';
        argu.agencyCode = page.agencyCode;
        argu.acctCode = page.acctCode;
        argu.rgCode = ma.rgCode;
        argu.setYear = ma.setYear;
        argu.chrCode = chrCode;
        var url = '/ma/sys/common/getParentTree';
        ufma.get(url, argu, callback);
			},
			//财政项目
			initDepproCode: function() {
				var data = [];

				function buildCombox() {
					$('#depproCode').ufTreecombox({
						idField: "code",
						textField: "codeName",
						pIdField: "pId",
						readonly: false,
						placeholder: "",
						leafRequire: true,
						data: data,
						onChange: function (sender, data) {
							page.initProType(data.code);
						}
					});
				};
				var callback = function(result) {
					data = result.data;
					page.depproCodeData = data;
					buildCombox();
				};
				var url = '/ma/sys/common/getEleTree';
				ufma.get(url, {
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					setYear: ma.setYear,
					rgCode: ma.rgCode,
					eleCode: 'DEPPRO'
				}, callback);
			},

			initProject: function(name) {
				page.upProject = $('#parentId').ufmaCombox({
					valueField: 'code',
					textField: 'codeName',
					//name: 'chrId'
					parentCode: 'code'
				});
				setTimeout(function() {
					//$("#parentId_input").val(parentCode);
				}, 300)

				function buildCombox() {};
				if(chrCode == '') {
					buildCombox();
					return false;
				}

				var callback = function(result) {
					buildCombox();
					page.upProject = $('#parentId').ufmaCombox({
						valueField: 'code',
						textField: 'codeName',
						//name: 'chrId'
						data: result.data,
						parentCode: 'code'
					});
				};
				var url = '/ma/sys/common/selectParentTree';
				//解决增加下级时/ma/sys/common/selectParentTree接口参数chrCode传输有误--zsj
				var chrCode = $("#chrCode").val();
				ufma.post(url, {
					"chrCode": chrCode,
					"eleCode": "PROJECT",
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode
				}, callback);
			},
			initProType: function(code) {
				var data = [];
				function buildCombox() {
					$('#protypeCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode',
						data: data,
						readonly: false,
						leafRequire: true,
						name: 'protypeCode'
					});
				};
				var callback = function (result) {
					data = result.data;
					buildCombox();
					//只有当后端返回数据为1条时，才赋值 guohx 20200824 有缺陷 当没有设置对应的项目类别 并且刚好该单位下只有一条项目类别时，还是会赋值 CWYXM-19499
					if (!$.isNull(code) && result.data.length == 1) {
						$("#protypeCode").getObj().setValue(data[0].code, data[0].codeName)
					}
				};
				if($('body').attr('data-code')) {
					var url = '/ma/sys/common/getEleTree?setYear=' + pfData.svSetYear + '&rgCode=' + pfData.svRgCode + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=PROTYPE'
				} else {
					var url = '/ma/sys/common/getEleTree?setYear=' + pfData.svSetYear + '&rgCode=' + pfData.svRgCode + '&agencyCode=*&acctCode=*&eleCode=PROTYPE'
				}
				ufma.get(url, {"chrCode":code}, callback);
			},
			//预算管理部门和只能管理部门下拉框
			initDepartMent: function() {
				var data = [];

				function buildCombox() {
					$('#orgCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode',
						readonly: false,
						data: data,
						leafRequire: true,
						name: 'orgCode'
					});
					$('#bgtorgCode').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode',
						readonly: false,
						data: data,
						leafRequire: true,
						name: 'bgtorgCode'
					});
				};
				var callback = function(result) {
					data = result.data;
					buildCombox();
				};
				var url;
				if($('body').attr('data-code')) {
					//http://localhost:8081/ma/sys/common/getEleTree?setYear=2018&rgCode=87&agencyCode=*&eleCode=DEPARTMENT&ajax=1
					var url = '/ma/sys/common/getEleTree?setYear=' + pfData.svSetYear + '&rgCode=' + pfData.svRgCode + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=DEPARTMENT'
				} else {
					var url = '/ma/sys/common/getEleTree?setYear=' + pfData.svSetYear + '&rgCode=' + pfData.svRgCode + '&agencyCode=*&acctCode=*&eleCode=DEPARTMENT'
				}
				ufma.get(url, "", callback);
			},
			initFZR: function() {
				var data = [];

				function buildCombox() {
					$('#promanager').ufTreecombox({
						idField: 'id',
						textField: 'codeName',
						pIdField: 'pId',
						readonly: false,
						data: data,
						leafRequire: true,
						name: 'promanager'
					});

				};
				var callback = function(result) {
					data = result.data;
					page.promanagerData = data;
					buildCombox();
				};
				var url = '/ma/sys/department/getDeptEmployeeTree?rgCode=' + pfData.svRgCode + '&setYear=' + pfData.svSetYear + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode;

				ufma.get(url, "", callback);
			},
			//承担单位
			initCDDW: function() {
				var data = [];

				function buildCombox() {
					$('#proagency').ufTreecombox({
						idField: 'id',
						textField: 'codeName',
						pIdField: 'pId',
						readonly: false,
						data: data,
						leafRequire: true,
						name: 'proagency'
					});

				};
				var callback = function(result) {
					data = result.data;
					buildCombox();
				};
				var url = '/ma/sys/eleAgency/getAgencyTree'
				ufma.get(url, "", callback);
			},
			initXMFJ: function() {
				$("#vouAttachBox").find(".attach-step2").hide();
				$("#vouAttachBox").find(".attach-step1").show();
				$("#vouAttachBox").find('.file-preview-frame').remove();
				$('#vouAttachBox').find('.attach-num').text("0");
				var projectId = $('#chrId').val();
				$.ajax({
					type: "get",
					url: "/ma/sys/eleProject/getFileList?chrId=" + projectId,
					async: false,
					success: function(data) {
						$('.attach-show').html("");
						var fileinputs = '';
						if(data.data != null && data.data != '') {
							$('#vouAttachBox').find('.attach-num').text(data.data.length);
							fileinputs += '<ul class="attach-show-list">';
							for(var i = 0; i < data.data.length; i++) {
								fileinputs += '<li class="attach-show-li" names="' + data.data[i].attachGuid + '">'
								fileinputs += '<div class="attach-img-box">'
								if(data.data[i].fileFormat == ".txt") {
									fileinputs += '<img class="attach-img-file" src="img/txt.png" />'
								} else if(data.data[i].fileFormat == ".doc" || data.data[i].fileFormat == ".docx") {
									fileinputs += '<img class="attach-img-file" src="img/word.png" />'
								} else if(data.data[i].fileFormat == ".xlsx" || data.data[i].fileFormat == ".xls") {
									fileinputs += '<img class="attach-img-file" src="img/xls.png" />'
								} else if(data.data[i].fileFormat == ".ppt" || data.data[i].fileFormat == ".pptx") {
									fileinputs += '<img class="attach-img-file" src="img/ppt.png" />'
								} else if(data.data[i].fileFormat == ".pdf") {
									fileinputs += '<img class="attach-img-file" src="img/pdf.png" />'
								} else if(data.data[i].fileFormat == ".jpg" || data.data[i].fileFormat == ".png" || data.data[i].fileFormat == ".gif" || data.data[i].fileFormat == ".bmp" || data.data[i].fileFormat == ".jpeg") {
									fileinputs += '<img class="attach-img-file" src="/ma/sys/eleProject/download?attachGuid=' + data.data[i].attachGuid + '" />'
								} else if(data.data[i].fileFormat == ".rar" || data.data[i].fileFormat == ".zip" || data.data[i].fileFormat == ".7z") {
									fileinputs += '<img class="attach-img-file" src="img/yasuo.png" />'
								} else {
									fileinputs += '<img class="attach-img-file" src="img/other.png" />'
								}
								fileinputs += '</div>'
								fileinputs += '<div class="attach-img-tip">'
								fileinputs += '<span class="attach-img-name"><b>' + data.data[i].fileName + '</b><s style="display:none">' + i + '</s></span>'
								fileinputs += '<span class="attach-img-byte">' + data.data[i].fileSize + '</span>'
								fileinputs += '<span class="attach-clear"></span>'
								fileinputs += '</div>'
								if(data.data[i].remark != null) {
									fileinputs += '<div class="attach-img-sub" title="' + data.data[i].remark + '">' + data.data[i].remark + '</div>'
								} else {
									fileinputs += '<div class="attach-img-sub" title="">暂无备注</div>'
								}
								fileinputs += '<div class="attach-img-sub-edit">'
								fileinputs += '<input type="text" value="' + data.data[i].remark + '" />'
								fileinputs += '<span class="glyphicon icon-check"></span>'
								fileinputs += '</div>'
								fileinputs += '<div class="attach-img-btns">'
								fileinputs += '<span class="glyphicon icon-edit"></span>'
								fileinputs += '<span class="glyphicon icon-download"></span>'
								fileinputs += '<span class="glyphicon icon-trash"></span>'
								fileinputs += '</div>'
								fileinputs += '</li>'
							}
							fileinputs += '</ul>';
						} else {
							fileinputs += '<div class="attach-noData">';
							fileinputs += '<img src="../../images/noData.png"/>';
							fileinputs += '<p>目前还没有附件，请选择上传/扫描</p>';
							fileinputs += '</div>';
						}
						$('.attach-show').html(fileinputs);

					}
				})
			},
			issueTips: function(data, isCallBack) {
				var title = "";
				if(isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = '项目';
				data.pageType = 'PROJECT';
				ufma.open({
					url: '../maCommon/issueTips.html',
					title: title,
					width: 1100,
					data: data,
					ondestory: function(data) {
						//窗口关闭时回传的值;
						if(isCallBack) {
							page.selectTableUrl = page.baseUrl + "eleProject/select/" + enabled;
							page.loadGridData();
						}
					}
				});
			},
			//bugCWYXM-4242--获取选用勾选的数据--zsj
			getChooseCheckedRows: function() {
				var checkedArray = [];
				$('#expfunc-choose-datatable .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			onEventListener: function() {
				//增加下级
				$("body").on('click', '.btn-addlower', function(e) {
					e.stopPropagation();
					page.action = 'addlower'
					//page.setFormEnabled();
					page.delRowOne($(this).attr('action'), [$(this).attr('chrCode')], $(this).closest('tr'));
					// page.initProject($(this).closest('tr').find('a').first().data('href').chrName);
					var checkedRow = [];
					checkedRow.push($(this).parents("tr").find("input").data("code"));
					page.delRow('addlower', checkedRow);

				});
				$('#project-table-id').on('click', 'tbody td:not(.btnGroup)', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					if($ele.is('a')) {
						$('#jbxx').setForm($ele.data('href'));
						page.action = 'edit';
						page.setFormEnabled();
						page.initField($ele.data('href'));
						page.openEditWin($ele.data('href'));
						var timeId = setTimeout(function() {
							clearTimeout(timeId)
							page.setModelData($ele.data('href'));
						}, 1000);
						//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
						// page.initUpProject();
						return false;
					}

					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.data("code").toString();
					// $input.prop('checked',!$input.prop('checked'));
					// $tr[$input.prop('checked')?'addClass':'removeClass']('selected');
					if(ma.fjfa != '') {
						var t = true
						if($tr.hasClass('selected')) {
							$ele.parents("tbody").find("tr").each(function() {
								var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
								if(thisCode.substring(0, code.length) == code) {
									$(this).removeClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", false);
								}
								if($(this).find('input[type="checkbox"]').is(":checked") != true) {
									t = false
								}
							})
						} else {
							$ele.parents("tbody").find("tr").each(function() {
								var thisCode = $(this).find('input[type="checkbox"]').data("code").toString();
								if(thisCode.substring(0, code.length) == code) {
									$(this).addClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", true);
								}
								if($(this).find('input[type="checkbox"]').is(":checked") != true) {
									t = false
								}
							})
						}
						$("#CheckAll,.check-all input").attr('checked', t).prop('checked', t)
					} else {
						//无编码规则--zsj
						var $tr = $(this).closest("tr");
						var dataCode = $tr.find(".singleCheck").attr("data-code");
						var tDatas = page.projectTableAll.data()
						var t = true
						$ele.parents("tbody").find("tr").each(function() {
							if($(this).find('input[type="checkbox"]').is(":checked") != true) {
								t = false
							}
						})
						$("#CheckAll,.check-all input").attr('checked', t).prop('checked', t)
						$tr.toggleClass("selected");
						if($tr.hasClass("selected")) {
							$(this).find(".singleCheck").prop("checked", true);
						} else {
							$(this).find(".singleCheck").prop("checked", false);
						}
						var isChecked = $(this).find(".singleCheck").prop("checked")
						for(var i = 0; i < tDatas.length; i++) {
							var parentCode = tDatas[i].parentCode;
							if(tDatas[i].chrCode.substring(0, dataCode.length) == dataCode || parentCode == dataCode) {
								$('#project-table-id').find("tbody").find("tr").eq(i).find(".singleCheck").prop("checked", isChecked)
							}
						}

					}
				});
				// ufma.searchHideShow(page.projectTable);
				ma.searchHideShow('index-search', '#project-table-id', 'searchHideBtn');
				ma.searchHideShow('choose-search', '#expfunc-choose-datatable', 'searchHideChooseBtn');
				//购物车
				$('.ufma-shopping-trolley').on('click', function(e) {
					page.getDW();
				});
				$('.btn-add').on('click', function(e) {
					e.preventDefault();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						page.clearModelData();
						page.action = 'add';
						page.setFormEnabled();
						page.openEditWin(page.serilizeProjInfo());
					}
				});
				//保存并新增
				$('#btn-saveadd').on('click', function() {
					if(ufma.hasNoError('#xmxx') && ufma.hasNoError('#jbxx')) {
						page.save(true);
						$('#chrCode').removeAttr('disabled');
					}
				});
				//选用页面表格行操作绑定
				$('#expfunc-choose-datatable').on('click', 'tbody td', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					if(ma.fjfa != '') {
						var t = true
						if($tr.hasClass('selected')) {
							$ele.parents("tbody").find("tr").each(function() {
								var thisCode = $(this).find('input[type="checkbox"]').val();
								if(thisCode.substring(0, code.length) == code) {
									$(this).addClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", true);
								}
								if($(this).find('input[type="checkbox"]').is(":checked") != true) {
									t = false
								}
							})
						} else {
							$ele.parents("tbody").find("tr").each(function() {
								var thisCode = $(this).find('input[type="checkbox"]').val();
								if(thisCode.substring(0, code.length) == code) {
									$(this).removeClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", false);
								}
								if($(this).find('input[type="checkbox"]').is(":checked") != true) {
									t = false
								}
							})

						}
						$(".datatable-choose-checkall").attr('checked', t).prop('checked', t)
					} else {
						var t = true
						if($tr.hasClass("selected")) {
							$ele.parents("tbody").find("tr").each(function() {
								var thisCode = $(this).find('input[type="checkbox"]').val();
								if(thisCode.substring(0, code.length) == code) {
									$(this).removeClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", false);
								}
								if($(this).find('input[type="checkbox"]').is(":checked") != true) {
									t = false
								}
							})
						} else {
							$ele.parents("tbody").find("tr").each(function() {
								var thisCode = $(this).find('input[type="checkbox"]').val();
								if(thisCode.substring(0, code.length) == code) {
									$(this).addClass("selected");
									$(this).find('input[type="checkbox"]').prop("checked", true);
								}
								if($(this).find('input[type="checkbox"]').is(":checked") != true) {
									t = false
								}
							})
						}
						$(".datatable-choose-checkall").attr('checked', t).prop('checked', t)

					}

				});
				$('#btn-close').on('click', function() {
					page.pageNum = $('.project-table-id-paginate').find('span a.paginate_button.current').text();
					page.pageLen = parseInt($('#project-table-id_length').find('select').val());
					var tempData = page.serilizeProjInfo();
					if(!ufma.jsonContained(page.formdata, tempData) && $('.btn-save').prop('display') == 'block') {
						ufma.confirm('您修改了项目信息，关闭前是否保存', function(isOk) {
							if(isOk) {
								if(ufma.hasNoError('#xmxx') && ufma.hasNoError('#jbxx')) {
									page.save(true);
									page.initPage(page.pageNum, page.pageLen);
								}
							} else {
								page.editor.close();
							}
						})
					} else {
						page.editor.close();
					}
				});
				//保存
				$('#btn-save').on('click', function() {
					if(ufma.hasNoError('#xmxx') && ufma.hasNoError('#jbxx')) {
						page.save(false);

					}
				});
				$('.react-search').on('click', function(e) {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						ufma.showloading('正在加载数据，请耐心等待...');
						var target = e.currentTarget || e.toElement;
						enabled = target.id;
						page.setButtonDisable(enabled);
						page.selectTableUrl = page.baseUrl + "eleProject/select/" + enabled + "?agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode;
						var url = page.selectTableUrl;
						//page.projectTableAll.ajax.url(url).load();
						ufma.get(url, "", page.loadCallback);
						page.cancelCheckAll();
					}
				});
				$('.project-status').on('click', function(e) {

				});
				//下拉折起
				$("#display-basic-more,#display-project-more,#display-attch-more").on("click", function() {
					if($(this).hasClass("glyphicon-menu-down")) {
						$(this).removeClass("glyphicon-menu-down").addClass("glyphicon-menu-up");
					} else {
						$(this).removeClass("glyphicon-menu-up").addClass("glyphicon-menu-down");
					}
				});
				//进度条
				//CWYXM-4770--传参与显示应该是一一对应的--张世洁
				$(".abt").click(function() {
					$(".abt .bt").addClass("abt-btno").removeClass("abt-btr");
					$(".abt p").addClass("abt-pno").removeClass("abt-pr");
					if($(this).find(".bt")[0].id == "one") {
						clevel = "0";
					} else if($(this).find(".bt")[0].id == "two") {
						clevel = "1";
					} else if($(this).find(".bt")[0].id == "three") {
						clevel = "2";
					} else if($(this).find(".bt")[0].id == "four") {
						clevel = "3";
					}
					$(this).find(".bt").addClass("abt-btr").removeClass("abt-btno");
					$(this).find("p").addClass("abt-pr").removeClass("abt-pno");
				});

				//删除选中行
				$("#project-tool-bar").on("click", "#project-delete", function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var table = page.projectTableAll;
						var activeLine = table.rows('.selected');
						var data = activeLine.data();
						if(typeof(data) == "undefined" || data.length == 0 || data == null) {
							ufma.alert('请选择删除的的数据');
							return false;
						}
						var realData = new Array();
						if(typeof(data.length) == "undefined") {
							realData.push(data.chrCode);
						} else {
							for(var i = 0; i < data.length; i++)
								realData.push(data[i].chrCode);
						}
						page.delRow('delete', realData);
					}
				});

				//启用选中行
				$("#project-tool-bar").on("click", "#project-start", function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var table = page.projectTableAll;
						var activeLine = table.rows('.selected');
						var data = activeLine.data();
						if(typeof(data) == "undefined" || data.length == 0 || data == null) {
							ufma.alert('请选择启用行的的数据');
							return false;
						}
						var realData = new Array();
						if(typeof(data.length) == "undefined") {
							realData.push(data.chrCode);
						} else {
							for(var i = 0; i < data.length; i++)
								realData.push(data[i].chrCode);
						}
						page.delRow('active', realData);
					}
				});

				//停用选中行
				$("#project-tool-bar").on("click", "#project-stop", function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						var table = page.projectTableAll;
						var activeLine = table.rows('.selected');
						var data = activeLine.data();
						if(typeof(data) == "undefined" || data.length == 0 || data == null) {
							ufma.alert('请选择停用行的的数据');
							return false;
						}
						var realData = new Array();
						if(typeof(data.length) == "undefined") {
							realData.push(data.chrCode);
						} else {
							for(var i = 0; i < data.length; i++)
								realData.push(data[i].chrCode);
						}
						page.delRow('unactive', realData);
					}
				});
				$('#project-imp').click(function() {
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						//修改单位获取不对问题--bug77937--zsj
						var impAgencyCode = '';
						if($('body').data('code') == 'agy') {
							impAgencyCode = page.agencyCode; //bug79043--zsj
						} else {
							impAgencyCode = '*';
						}
						var url = "/ma/general/excel/impEleDatas?eleCode=PROJECT&rgCode=" + ma.rgCode + "&agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear;
						ufma.open({
							title: '项目导入',
							url: '../../pub/impXLS/impXLS.html',
							width: 800,
							height: 400,
							data: {
								eleName: '项目',
								eleCode: 'PROJECT',
								projectName: 'ma', //这里多加了一个参数，用于区分模板所属模块
								rgCode: pfData.svRgCode,
								agencyCode: impAgencyCode, //$('body').data('code') == 'agy' ? impAgencyCode : '*',
								setYear: pfData.svSetYear,
								url: url
							},
							ondestory: function(rst) {
								page.loadGridData();
								page.initPage();
							}
						});
					}

				});
				//项目名称
				$('#chrName').on('mouseenter paste keyup', function(e) {
					e.stopepropagation;
					$('#chrName').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('chrName', textValue);
				}).on('blur', function() {
					//名称验证
					ma.nameValidator('chrName', '项目');
					if($(this).val() == '') {
						ufma.showInputHelp('chrName', '<span class="error">' + page.getErrMsg(2) + '</span>');
						$('#chrName').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('chrName');
						$('#chrName').closest('.form-group').removeClass('error');
					}
					//71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
					var chrNameValue = $(this).val();
					ufma.post('/pub/util/String2Alpha', {
						"chinese": chrNameValue
					}, function(result) {
						if(result.data.length > 42) {
							var data = result.data.substring(0, 41);
							$('#assCode').val(data);
						} else {
							$('#assCode').val(result.data);
						}
					});
				});

				//上级项目
				$('#field1').on('mouseenter paste keyup', function(e) {
					e.stopepropagation;
					$('#field1').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('field1', textValue);
				}).on('blur', function() {
					if($(this).val() == '') {
						ufma.showInputHelp('field1', '<span class="error">' + page.getErrMsg(1) + '</span>');
						$('#field1').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('field1');
						$('#field1').closest('.form-group').removeClass('error');
					}
				});
				$('.btn-choose').on('click', function(e) {
					e.preventDefault();
					if(page.chooseAcctFlag == true) {
						ufma.showTip('请选择账套', function() {}, 'warning');
						return false;
					} else {
						/*page.getProjectChoose();
						page.openChooseWin();*/
						//由于原始将选用界面问题太多，且维护不便，故统一为公共界面--zsj
						ufma.open({
							url: '../maCommon/comChooseIssue.html',
							title: '选用',
							width: 1000,
							height: 500,
							data: {
								getUrl: '/ma/sys/common/getCanIssueEleTree',
								useUrl: "/ma/sys/common/issue",
								pageName: '项目',
								rgCode: ma.rgCode,
								setYear: ma.setYear,
								agencyCode: page.agencyCode,
								acctCode: page.acctCode,
								eleCode: 'PROJECT',
								bgttypeCode: ""
							},
							ondestory: function(result) {
								if(result.action) {
									page.issueTips(result, true);
								}
							}
						});
					}
				});
				//bugCWYXM-4242--确认选用--zsj
				$('.btn-agyChoose').on('click', function(e) {
					var checkRow = page.getChooseCheckedRows();
					if(checkRow.length > 0) {
						ufma.showloading('数据选用中，请耐心等待...');
						var toAgencyAcctList = [{
							toAgencyCode: page.agencyCode,
							toAcctCode: page.acctCode
						}];
						var argu = {
							chrCodes: checkRow,
							toAgencyAcctList: toAgencyAcctList, //选用的单位
							eleCode: 'PROJECT',
							rgCode: ma.rgCode,
							setYear: ma.setYear,
							agencyCode: page.issueAgecyCode //上级单位代码，是从选用列表的数据中赋值得来的
						};
						var callback = function(result) {
							if(result) {
								ufma.hideloading();
								//ufma.showTip("选用成功", function() {
								page.choosePage.close();
								//}, "success");
								page.issueTips(result, true);
							}
						};
						ufma.post(ma.commonApi.confirmIssue, argu, callback);
					} else {
						ufma.alert("请选择要选用的数据！", "warning");
						return false;
					}
				});
				//选用-end--zsj--CWYXM-4154
				$('.btn-agyClose').on('click', function(e) {
					e.preventDefault();
					page.choosePage.close();
				});

				//预算管理部门
				$('#bgtorgCode').on('mouseenter paste keyup', function(e) {
					e.stopepropagation;
					$('#bgtorgCode').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('bgtorgCode', textValue);

				}).on('blur', function() {
					if($(this).val() == '') {
						ufma.showInputHelp('bgtorgCode', '<span class="error">' + page.getErrMsg(6) + '</span>');
						$('#bgtorgCode').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('field1');
						$('#bgtorgCode').closest('.form-group').removeClass('error');
					}
				});

				//职能管理部门
				$('#orgCode').on('mouseenter paste keyup', function(e) {
					e.stopepropagation;
					$('#orgCode').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('orgCode', textValue);

				}).on('blur', function() {
					if($(this).val() == '') {
						ufma.showInputHelp('orgCode', '<span class="error">' + page.getErrMsg(7) + '</span>');
						$('#orgCode').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('field1');
						$('#orgCode').closest('.form-group').removeClass('error');
					}
				});
				$('#project-down').on('click', function(e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();
					if(gnflData.length == 0) {
						ufma.alert('请选择项目！');
						return false;
					};
					page.modal = ufma.selectBaseTree({
						url: '/ma/sys/common/selectIssueAgencyOrAcctTree?rgCode=' + ma.rgCode + '&setYear=' + ma.setYear + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=PROJECT',
						rootName: '所有单位',
						title: '选择下发单位',
						bSearch: true, //是否有搜索框
						checkAll: true, //是否有全选
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
								action: function(data) {
									if(data.length == 0) {
										ufma.alert('请选择单位！');
										return false;
									}
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
									if(acctAlldata) {
										if(acctAlldata.length > 0) {
											for(var i = 0; i < acctAlldata.length; i++) {
												//if(acctAlldata[i].isAcct == true && acctAlldata[i].agencyCode != '' && acctAlldata[i].isLeaf == '1') {
												//单位账套：校验条件--isAcct = true && isFinal =1;传参：toAgencyCode：传选中的单位，toAcctCode:传选中的账套--zsj
												if(acctAlldata[i].isAcct == true && acctAlldata[i].isFinal == '1') {
													chooseAcct = acctAlldata[i].code;
													chooseAgency = acctAlldata[i].agencyCode;
													isAcctTruedata.push({
														"toAgencyCode": chooseAgency,
														"toAcctCode": chooseAcct
													});
												}
											}
											for(var i = 0; i < acctAlldata.length; i++) {
												//单位：校验条件--isAcct = false && isFinal =1；传参：toAgencyCode：传选中的单位，toAcctCode:"*"--zsj
												if(acctAlldata[i].isAcct == false && acctAlldata[i].isFinal == '1') {
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
									var url = '/ma/sys/common/issue';
									var argu = {
										'chrCodes': gnflData,
										'toAgencyAcctList': dwCode,
										"eleCode": 'PROJECT',
										"agencyCode": page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function(result) {
										ufma.hideloading();
										//经海哥确认将所有信息显示在表格中--zsj
										//ufma.showTip(result.msg, function() {}, result.flag);
										page.modal.close();
										page.cancelCheckAll();
										page.issueTips(result);
									}
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
				});
				////////
				$('#project-table-id').on('click', '.btn-copy', function(e) {
					var data = {
						"agencyCode": $(this).attr('agencycode'),
						"setYear": $(this).attr('setyear'),
						"userId": page.pfData.svUserId, //修改权限  将svUserCode改为 svUserId  20181012
						eleCode: 'PROJECT'
					}
					var acceCode = $(this).attr('acceCode');
					var rgCode = $(this).attr('rgCode');
					var chrCode = $(this).attr('chrCode');
					ufma.open({
						url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
						title: '选择目标项目',
						width: 580,
						height: 545,
						data: {
							'flag': 'PROJECT',
							'modal': 'ma',
							'rootName': '项目',
							'checkbox': false,
							'leafRequire': true,
							'data': data,
						},
						ondestory: function(result) {
							if(result.action) {
								ufma.showloading('数据复制中，请耐心等待...'); //bug79478--zsj--修改复制成功后一直显示遮罩层问题
								var argu = {
									"destProjectChrCodes": [result.data[0].code],
									"sourceProjectChrCodes": [chrCode],
									"rgCode": rgCode,
									"setYear": data.setYear,
									"agencyCode": data.agencyCode
								}
								ufma.post('/ma/sys/eleProject/copyProject', argu, function(rst) {
									ufma.showTip(rst.msg, function() {
										ufma.hideloading(); //bug79478--zsj--修改复制成功后一直显示遮罩层问题
									}, 'success');
									$('.react-search.selected').trigger('click');
								});
							};
						}
					});
				});
				$("#expfunc-choose-content").scroll(function() {
					var heitab = $("#expfunc-choose-content .tab-content").height() + 10
					var scltop = $("#expfunc-choose-content").scrollTop() + $("#expfunc-choose-content").height() - 55
					if(scltop <= heitab) {
						$("#expfunc-choose-tool-bar").css("top", scltop + 'px').css("position", 'absolute')
					} else {
						$("#expfunc-choose-tool-bar").css("top", heitab + 'px').css("position", 'absolute')
					}
				});
				$(document).on('click', '.jump-style', function () {
					var url = $(this).attr('data-href'); 
					var title = $(this).attr('data-title');
					uf.openNewPage(page.isCrossDomain, $(this), 'openMenu', url, false, title);
				});
				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				$("#project-table-id thead ").on("mouseover", function () {
					$("#project-table-id thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "1px solid #D9D9D9")
					})
				}).on("mouseout", function () {
					$("#project-table-id thead").find('tr:eq(0) th').each(function () {
						$(this).css("border-right", "none")
					})
				});
				//当出现固定表头时，悬浮加边框线 guohx 
				$("#outDiv").scroll(function () {
					$("#project-table-idfixed thead").on("mouseover", function () {
						$("#project-table-idfixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "1px solid #D9D9D9")
						})
					}).on("mouseout", function () {
						$("#project-table-idfixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("border-right", "none")
						})
					});
				});

				$('.btnSetAccount').on('click', function (e) {
					e.stopPropagation();
					ufma.open({
						url: 'accountInfo.html',
						title: '选择银行账户',
						width: 1100,
						data: {
							agencyCode : page.agencyCode,
							acctCode:page.acctCode,
							setYear: ma.setYear,
							rgCode: ma.rgCode,
							bankAccCode : $("#bankCode").val(),
							edtTop : $("#ufma_project-edt_top").offset().top
						},
						ondestory: function (data) {
							$("#ufma_project-edt_top").css("top",data.edtTop)
							//窗口关闭时回传的值
							if(!$.isNull(data.selectData)){
								$("#bankCode").val(data.selectData[0].bankAccCode);
							}
						}
					});
				});
			},
			initCtrlLevel: function() {
				if(!$.isNull(ma.ruleData)) {
					page.agencyCtrlLevel = ma.ruleData.agencyCtrllevel;
					if(page.agencyCtrlLevel == "0101") { //无按钮
						//$(".btn-choose,.btn-add").hide();
						$(".btn-add").hide();
						$(".btn-choose").show(); //经赵雪蕊确认能下发得单位级都能选用--zsj--CWYXM-6746
					} else if(page.agencyCtrlLevel == "0102") { //右上角：选用
						$(".btn-choose").show();
						$(".btn-add").hide();
					} else if(page.agencyCtrlLevel == "0201") { //右上角：新增  表格：增加下级
						$(".btn-choose").hide();
						$(".btn-add").show();
					} else if(page.agencyCtrlLevel == "0202") { //表格：增加下级
						$(".btn-choose,.btn-add").hide();
					} else if(page.agencyCtrlLevel == "03") { //右上角：新增
						$(".btn-choose").hide();
						$(".btn-add").show();
					}
				}
			},
			//获取要素的详细信息
			getEleDetail: function() {
				var argu = {
					eleCode: 'PROJECT',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifa('/ma/sys/element/getEleDetail', argu, callbackFun);
				// ufma.showloading("数据加载中，请耐心等候...")
				//	page.initTable();
				function callbackFun(data, ctrlName) {
					ufma.hideloading();
					//本级控制下发按钮显示/隐藏
					page.agencyCtrlLevel = data.agencyCtrllevel;
					var isAcctLevel = data.isAcctLevel;
					if($('body').data("code")) {
						if(isAcctLevel == '1' && page.acctFlag == true) {
							$("#cbAcct").show();
							ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
								"setYear": page.setYear,
								"rgCode": page.rgCode
							}, function(result) {
								ufma.hideloading();
								var acctData = result.data;
								if(acctData.length > 0) {
									page.chooseAcctFlag = false;
								} else {
									page.accsCode = '';
									page.acctCode = '';
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
										page.selectTableUrl = page.baseUrl + "eleProject/select/" + enabled;
										page.loadGridData();
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
										} else if(acctData.length > 0) {
											page.cbAcct.select(1);
										} else {
											page.cbAcct.val('');
											page.chooseAcctFlag = true;
											var result = [];
											page.initTable(result);
										}
									}

								});
							});
						} else {
							$("#cbAcct").hide();
							page.acctCode = '*';
							page.selectTableUrl = page.baseUrl + "eleProject/select/" + enabled;
							page.loadGridData();
						}
					}

					if($('body').data("code") && page.isLeaf != 0) {
						//单位为末级单位时不显示下发按钮
						$(".btn-senddown").hide();
					} else {
						//非末级单位需根据控制规则显示/隐藏按钮
						//guohx 20200217 与雪蕊确认，上下级公用显示下发按钮 不区分选用还是下发
						if(page.agencyCtrlLevel == "03") {
							//上下级无关下发隐藏
							$(".btn-senddown").hide();
						} else {
							//上下级公用,下级细化可增加一级,下级细化不可增加一级下发显示
							$(".btn-senddown").show();
						}
					}
					//请求上级控制信息
					page.parentCtrlBtn(ctrlName);
					isOperate = data.isOperate;
					if (isOperate == "1") {
						$(".btn-delete").addClass("disabled");
						$(".btn-start").addClass("disabled");
						$(".btn-stop").addClass("disabled");
						$(".btn-senddown").addClass("disabled");
						$(".btn-add").addClass("disabled");
					}
				}
			},
			//根据上级信息控制界面新增、选用、增加下级按钮,显示/隐藏
			parentCtrlBtn: function(ctrlName) {
				//请求上级控制信息
				var argu2 = {
					agencyCode: page.agencyCode,
					eleCode: "PROJECT",
					rgCode: ma.rgCode,
					setYear: ma.setYear
				};
				ma.initfifaParent(argu2, function(data2) {
					page.agencyCtrlLevel2 = data2.agencyCtrllevel;
					var ctrlName2;
					if(page.agencyCtrlLevel2 == "0101") {
						//上下级公用下发,新增，选用，增加下级都隐藏（在表格的complete中做了控制）
						$(".btn-add").hide();
						//$(".btn-choose").hide();
						$(".btn-choose").show(); //经赵雪蕊确认能下发得单位级都能选用--zsj--CWYXM-6746
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0102") {
						//上下级公用选用，新增隐藏，选用显示，增加下级隐藏（在表格的complete中做了控制）
						$(".btn-choose").show();
						$(".btn-add").hide();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0201") {
						//下级细化可增加一级，选用不强制，新增显示，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").show();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "0202") {
						//下级细化不可增加一级，新增显示，选用不强制，增加下级显示（在表格的complete中做了控制）
						$(".btn-add").show();
						$(".btn-addlower").hide();
						$(".btn-choose").show();
						ctrlName2 = data2.agencyCtrlName;
					} else if(page.agencyCtrlLevel2 == "03") {
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
			initAgency: function() {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					leafRequire: false,
					onchange: function(data) {
						page.agencyCode = data.code;
						$("#xmlx").attr('data-href','/pf/ma/userData/userDataAgy.html?eleCode=PROTYPE&eleName=项目类别&letter=X&menuid=ebb236b4-7020-4d40-b306-5fd90669ee59&agencyCode='+ page.agencyCode + '&agencyName=' +page.agencyName);
					    $("#ysxm").attr('data-href','/pf/ma/userData/userDataAgy.html?eleCode=DEPPRO&eleName=财政项目&letter=C&menuid=ebb236b4-7020-4d40-b306-5fd90669ee59&agencyCode='+ page.agencyCode + '&agencyName=' +page.agencyName);
						page.initPage();
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
						page.isLeaf = data.isLeaf;
						if(data.isLeaf != 1) {
							$(".ufma-shopping-trolley").show();
							page.acctFlag = false;
							//非末级单位不显示账套选择框和选用科目按钮
							$("#cbAcct").hide();
						} else {
							$(".ufma-shopping-trolley").hide();
							$("#cbAcct").show();
							page.acctFlag = true;
						}
						page.getEleDetail();
						// page.initCtrlLevel();
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
						//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
						if(prevAgencyCode != '') {
							page.cbAgency.val(prevAgencyCode);
						} else {
							if(page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
								page.cbAgency.val(page.agencyCode);
							} else {
								page.cbAgency.val(1);
							}
						}
					}
				});
			},
			init: function() {
				var pfData = ufma.getCommonData();
				page.pfData = pfData;
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.projectBox = $("#project-box-id");
				page.projectTable = $('#project-table-id');
				page.projectThead = $('#project-thead-id');
				page.chooseAcctFlag = false;
				page.initTable();
				
				if($('body').data("code")) {
					ufma.showloading("数据加载中,请耐心等候...");
					page.initAgency();
					page.baseUrl = '/ma/sys/';
					
				} else {
					ufma.showloading("数据加载中,请耐心等候...");
					page.agencyCode = "*";
					page.acctCode = '*'
					page.baseUrl = '/ma/sys/';
					//page.initTable();
					page.getEleDetail();
					page.loadGridData();
					this.initPage();
					$("#xmlx").attr('data-href','/pf/ma/userData/userData.html?eleCode=PROTYPE&eleName=项目类别&letter=X&menuid=804c27d4-ccd6-40cf-958c-0af1f59c604a&roleId=9091&agencyCode=*');
					$("#ysxm").attr('data-href','/pf/ma/userData/userData.html?eleCode=DEPPRO&eleName=财政项目&letter=C&menuid=804c27d4-ccd6-40cf-958c-0af1f59c604a&agencyCode=*');
				}
				setTimeout(function () {
					var centerHeight = $(window).height() - 124 - 30 - 8 - 40;
					$('#outDiv').css("height", centerHeight);
					$('#outDiv').css("width", $(".table-sub").width());
					$('#outDiv').css("overflow", "auto");
					
				}, 500)
				ufma.parse();
				this.onEventListener();
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);

				// ufma.parseScroll();
				window.addEventListener('message', function (e) {
					if (e.data.hasOwnProperty('messageType') && e.data.messageType == 'clientWidth') {
						page.isCrossDomain = true;
					} else {
						page.isCrossDomain = false;
					}
				});
			}
		}
	}();
	//项目状态
	var enabled = "-1";
	page.init();
});