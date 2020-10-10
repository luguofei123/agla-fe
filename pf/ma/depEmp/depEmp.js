$(function() {
	//加个注释
	var enabled = "-1";
	var agencyCode;
	var page = function() {
		var namespace = "depEmp";

		var depDataTableAll;
		var depTable;
		var depThead;
		var departMentTree;
		var departmentCode = "";

		var active = "";
		var unactive = "";
		var codeRule;
		var baseUrl = '';
		var getUrl, treeUrl;
		var aParentCode;
		//bug76381--zsj--若从凭证录入界面跳入此界面则此界面的单位默认为凭证录入界面的单位
		var prevAgencyCode = '';
		var interfaceURL = {
			getPrsOrgEmp: '/ma/sys/eleEmplyee/select'
		};
		var sessionData = JSON.parse(window.sessionStorage.getItem("maobjData"))
		if(sessionData != undefined) {
			prevAgencyCode = sessionData.agencyCode;
			ufma.removeCache("maobjData");
		}
		var acctAlldata;
		return {
			initTwoManager: function() {
				var argu = {
					enabled: enabled,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					departmentCode: []
				};
				ufma.post(page.getUrl, argu, function(result) {
					// page.initDeptManager(result.data);
					page.initDeptSubManager(result.data);
				});
			},
			// 初始化负责人下拉列表
			initDeptManager: function(data) {
				$('#deptManager').ufTreecombox({
					idField: 'chrCode',
					//textField: 'chrName',
					textField: 'codeName', //CWYXM-11230 新增部门，选择负责人、分管负责人时，应显示编码+名称--zsj
					pIdField: 'pCode', //可选
					placeholder: '请选择负责人',
					data: data,
					leafRequire: true,
					readonly: false,
					onChange: function(sender, data) {},
					onComplete: function(sender, data) {}
				});
			},
			// 初始化分管负责人下拉列表
			initDeptSubManager: function(data) {
				$('#deptSubManager').ufTreecombox({
					idField: 'chrCode',
					//textField: 'chrName',
					textField: 'codeName', //CWYXM-11230 新增部门，选择负责人、分管负责人时，应显示编码+名称--zsj
					pIdField: 'pCode', //可选
					placeholder: '请选择分管负责人',
					data: data,
					leafRequire: true,
					readonly: false,
					onChange: function(sender, data) {},
					onComplete: function(sender, data) {}
				})
			},

			//表格文字居左，数字居右
			contAlign: function(dom) {
				dom.each(function() {
					if(/^[0-9]*$/.test($(this).text()) || /^(-?\d+)(\.\d+)?/.test($(this).text())) {
						$(this).css({
							"text-align": "left"
						});
					} else {
						$(this).css({
							"text-align": "left"
						});
					}
				});
			},
			jCodeName: {},
			newTable: function(pageNum, pageLen) {
				page.aParentCode = [];
				var id = "departtable";
				var toolBar = $('#' + id).attr('tool-bar');
				var callback = function(result) {
					page.depDataTableAll = $("#" + id).DataTable({
						"language": {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						"fixedHeader": {
							header: true
						},
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
								title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline "> <input type="checkbox"' +
									'id="checkAll"/> &nbsp;<span></span> </label>',
								data: null,
								defaultContent: "",
								className: "de-check-width"
							},
							{
								title: "人员编码",
								data: "chrCode",
								className: "zs-cont-style isprint"
							},
							{
								title: "人员姓名",
								data: "chrName",
								className: "zs-cont-style isprint"
							},
							{
								title: "状态",
								data: "enabledCn",
								className: "departmentStauts isprint"
							},
							{
								title: "操作",
								data: "chrCode"
							}
						],
						"columnDefs": [{
								"targets": [0],
								"serchable": false,
								"orderable": false,
								"render": function(data, type, rowdata, meta) {
									if(data != null) {
										return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox" name="checkList" data-code="' + rowdata.chrCode + '"/>&nbsp; <span></span> </label>';
									} else {
										return "";
									}
								}
							},
							{
								"targets": [1],
								"serchable": false,
								"orderable": true
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
									return '<a class="common-jump-link" style="display:block;text-indent:' + textIndent + '" href="javascript:;" data-href=\'' + alldata + '\'>' + data + '</a>';
								}
							},
							{
								"targets": [-1],
								"serchable": false,
								"orderable": false,
								"className": "text-center nowrap btnGroup",
								"render": function(data, type, rowdata, meta) {
									var active = rowdata.enabled == 1 ? 'hidden' : '';
									var unactive = rowdata.enabled == 0 ? 'hidden' : '';
									var sameStep = rowdata.userId == '' ? 'show' : 'hidden';
									return '<a class="btn btn-icon-only btn-sm btn-permission person-single-start btn-start" ' + active + ' action="active" chrCode="' + rowdata.chrCode + '" data-toggle="tooltip" title="启用">' +
										'<span class="glyphicon icon-play"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission person-single-stop btn-stop "  ' + unactive + ' action="unactive" chrCode="' + rowdata.chrCode + '" data-toggle="tooltip" title="停用">' +
										'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission person-single-delete btn-delete" action="delete" chrCode="' + rowdata.chrCode + '" data-toggle="tooltip" title="删除">' +
										'<span class="glyphicon icon-trash"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission  btn-sameStep"' + sameStep + ' chrCode="' + rowdata.chrCode + '" data-toggle="tooltip" title="同步">' +
										'<span class="glyphicon glyphicon icon-replace-t"></span></a>';
								}
							}
						],
						"order": [
							[0, null]
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
							//按钮提示
							$("[data-toggle='tooltip']").tooltip();
							page.contAlign($("td.zs-cont-style"));
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
								ufma.expXLSForDatatable($('#' + id), '部门人员');
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
							$('.' + id + '-paginate').appendTo($info);

							if(pageLen != "" && typeof(pageLen) != "undefined") {
								$('#' + id).DataTable().page.len(pageLen).draw(false);
								if(pageNum != "" && typeof(pageNum) != "undefined") {
									$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
								}
							}
							//全选
							$("#checkAll,.datatable-group-checkable").on("click", function() {
								if($(this).prop("checked") === true) {
									$("#checkAll,.datatable-group-checkable").prop("checked", $(this).prop("checked"));
									page.depTable.find("input[name='checkList']").prop("checked", $(this).prop("checked"));
									page.depTable.find("tbody tr").addClass("selected");
								} else {
									$("#checkAll,.datatable-group-checkable").prop("checked", false);
									page.depTable.find("input[name='checkList']").prop("checked", false);
									page.depTable.find("tbody tr").removeClass("selected");
								}
							});

							//日期控件
							/*   $('#datetimepicker,#barthDate-datetimepicker').datetimepicker({
							       format: 'yyyy-mm-dd',
							       autoclose: true,
							       todayBtn: true,
							       startView: 'month',
							       minView: 'year',
							       maxView: 'day',
							       language: 'zh-CN',
							   });*/
							$('.uf-datepicker').ufDatepicker({
								format: 'yyyy-mm-dd',
								//viewMode:'month',
								initialDate: new Date()
							});
							ufma.setBarPos($(window));
							$('#departtable').closest('.dataTables_wrapper').ufScrollBar({
								hScrollbar: true,
								mousewheel: false
							});
							//固定表头
							$("#departtable").fixedTableHead();

						},
						"drawCallback": function(settings) {
							ufma.setBarPos($(window));
							ufma.isShow(page.reslist);
							page.contAlign($("td.zs-cont-style"));
							$("[data-toggle='tooltip']").tooltip();
							$("td.departmentStauts").each(function() {
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
							$('#' + id + ' .person-single-delete').ufTooltip({
								//content: '您确定删除当前人员吗？',
								content: '是否停用关联登录用户？',
								onYes: function() {
									ufma.showloading('数据删除中，请耐心等待...');
									page.sameStepType = true;
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								},
								onNo: function() {
									ufma.showloading('数据删除中，请耐心等待...');
									page.sameStepType = false;
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								}
							});
							$('#' + id + ' .person-single-start').ufTooltip({
								//content: '您确定启用当前人员吗？',
								content: '是否同步修改用户启用状态？',
								onYes: function() {
									ufma.showloading('数据启用中，请耐心等待...');
									page.sameStepType = true;
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								},
								onNo: function() {
									ufma.showloading('数据启用中，请耐心等待...');
									page.sameStepType = false;
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								}
							});
							$('#' + id + ' .person-single-stop').ufTooltip({
								//content: '您确定停用当前人员吗？',
								content: '是否同步修改用户停用状态？',
								onYes: function() {
									ufma.showloading('数据停用中，请耐心等待...');
									page.sameStepType = true;
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								},
								onNo: function() {
									ufma.showloading('数据停用中，请耐心等待...');
									page.sameStepType = false;
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('chrCode')], $(page._self).closest('tr'));
								}
							});
							//行同步需求：bug81532--部门人员增加功能，同步部门人员中的数据到平台的用户管理中--zsj
							$('#' + id + ' .btn-sameStep').ufTooltip({
								content: '您确定同步增加当前人员吗？',
								onYes: function() {
									ufma.showloading('数据同步中,请耐心等待...');
									var argu = {
										"agencyCode": page.agencyCode,
										"rgCode": ma.rgCode,
										"setYear": ma.setYear,
										"acctCode": page.acctCode,
										"chrCode": $(page._self).attr('chrCode')
									}
									ufma.post('/ma/sys/eleEmplyee/addFapUser', argu, function(result) {
										ufma.hideloading();
										ufma.showTip(result.msg, function() {}, result.flag);
										page.newTable();
									});
								},
								onNo: function() {}
							});
						}
					});
					//翻页取消勾选
					$('#' + id).on('page.dt', function() {
						$("#checkAll,.datatable-group-checkable,input[name='checkList']").prop("checked", false);
						$('#' + id).find("tbody tr.selected").removeClass("selected");
					});
				}
				var argu = {
					"enabled": enabled,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode
				};
				if(page.departMentTree != null && page.departMentTree != undefined) {
					var selectNodes = page.departMentTree.getCheckedNodes(true);
					argu.departmentCode = page.orgTreeParamId(selectNodes);
				} else {
					argu.departmentCode = [];
				}
				ufma.post(page.getUrl, argu, callback);
			},
			departmentCodeTree: function() {
				$("#departmentCode").ufTreecombox({
					idField: 'id', //可选
					textField: 'codeName', //可选
					pIdField: 'pId', //可选
					placeholder: '请选择部门',
					data: [],
					onChange: function(sender, treeNode) {},
					onComplete: function(sender) {}
				})
			},

			//初始化页面
			initPage: function() {
				page.departMentTree = page.departmentTree({
					url: page.treeUrl,
					checkbox: true
				}, $('#tree'));

			},

			getErrMsgPerson: function(errcode) {
				var error = {
					0: '人员编码不能为空',
					1: '人员名称不能为空',
					2: '证件号码不能为空',
					3: '部门不能为空',
					4: '部门编码不符合分级规则',
					5: '上级编码不存在',
					6: '请输入正确的联系方式',
					7: '只能输入0-9的数字',
					8: '人员编码不符合编码规则:',
					9: '人员编码已存在'
				}
				return error[errcode];
			},
			initTree: function() {
				page.departMentTree = page.departmentTree({
					url: page.treeUrl,
					checkbox: true,
				}, $('#tree'));

			},
			getAllChildrenNodes: function(treeNode, result) {
				if(treeNode.isParent) {
					var childrenNodes = treeNode.children;
					if(childrenNodes) {
						for(var i = 0; i < childrenNodes.length; i++) {
							result += "," + (childrenNodes[i].id);
							result = page.getAllChildrenNodes(childrenNodes[i], result);
						}
					}
				}
				return result;
			},

			departmentTree: function(setting, $tree) {
				setting.idKey = setting.idKey || 'id';
				setting.pIdKey = setting.pIdKey || 'pId';
				setting.nameKey = setting.nameKey || 'deptShowName';
				setting.rootName = setting.rootName || '';
				setting.async = setting.async || true;

				if(!$tree.hasClass('ufmaTree')) {
					$tree.addClass('ufmaTree');
				}
				if(!$tree.hasClass('ztree')) {
					$tree.addClass('ztree');
				}
				var treeSetting = {
					async: {
						enable: setting.async,
						type: 'get',
						dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
						contentType: 'application/json; charset=utf-8',
						//url: setting.url || null,
						dataFilter: function(treeId, parentNode, responseData) {
							var data = responseData;
							if(responseData.hasOwnProperty('data')) {
								data = responseData.data;
							}
							if(!$.isNull(setting.rootName)) {
								var rootNode = {};
								rootNode[setting.idKey] = "0";
								rootNode[setting.nameKey] = setting.rootName;
								rootNode["open"] = true;
								data.unshift(rootNode);
							}
							if($.isNull(data)) return false;
							for(var i = 0; i < data.length; i++) {
								data[i]["open"] = true;
							}
							return data;
						}
					},
					view: {
						showLine: false,
						showIcon: false,
						fontCss: getFontCss,
						addHoverDom: addHoverDom,
						removeHoverDom: removeHoverDom,
					},
					check: {
						/*chkboxType: {
							"Y": "s",
							"N": "s"
						},*/
						enable: function() {
							if(setting.checkbox) return setting.checkbox;
							else return false;
						}()
					},

					data: {
						simpleData: {
							enable: true,
							idKey: setting.idKey,
							pIdKey: setting.pIdKey,
							rootPId: 0
						},

						key: {
							name: setting.nameKey
						},

						keep: {
							leaf: true
						}
					},
					callback: {
						/*onAsyncError: function(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
							ufma.alert(XMLHttpRequest);
						},*/
						/*onClick: setting.onClick || null,
						onDblClick: setting.onDblClick || null,
						onCheck: setting.onCheck || null,*/
						beforeClick: beforeClick
					}

				};

				function addHoverDom(treeId, treeNode) {
					//bugCWYXM-4244--zsj
					$('#prompt').text('编码规则：' + page.fjfa)
					var sObj = $("#" + treeNode.tId + "_span");
					if(treeNode.editNameFlag || $("#editBtn_" + treeNode.tId).length > 0) return;
					var addStr = "<span class='button department-edit btn-permission' id='editBtn_" + treeNode.tId +
						"' title='编辑部门信息' onfocus='this.blur();'></span>";
					if(page.isEdit == true) {
						addStr = "<span class='button department-edit' id='editBtn_" + treeNode.tId +
							"' title='编辑部门信息' onfocus='this.blur();'></span>";
					}

					sObj.after(addStr);
					var btn = $("#editBtn_" + treeNode.tId);
					if(btn) btn.bind("click", function() {
						var argu = {
							enabled: enabled,
							agencyCode: page.agencyCode,
							acctCode: page.acctCode,
							departmentCode: [treeNode.code]
						};
						ufma.post(page.getUrl, argu, function(result) {
							page.initDeptManager(result.data);
							page.clearError();
							page.depaction = "depEdit";
							page.editor = ufma.showModal('department-edt', 720, 500);
							$('#deprtment-chrCode').val(treeNode.code);
							$('#departmentId').val(treeNode.chrId);
							$('#dpLastVer').val(treeNode.lastVer);
							$('#deptManager').getObj().val('');
							$('#deptSubManager').getObj().val('');
							for(var i = 0; i < result.data.length; i++) {
								if(result.data[i].chrCode == treeNode.deptManager) {
									$('#deptManager').getObj().val(treeNode.deptManager);
								}
							}
							$('#deptSubManager').getObj().val(treeNode.chargeManager);
							$('#deptPhone').val(treeNode.deptPhone);
							$('#deprtment-chrCode').attr('disabled', 'disabled');
							var tempName = treeNode.deptShowName;
							var depName = tempName.split(']')[1].split('[')[0];
							var itemEnabled = tempName.split(']')[1].split('[')[1];
							$("#itemEnabled").find("label").removeClass("active");
							$("#itemEnabled").find("label").find("label").prop("checked", false);
							if(itemEnabled == "停用") {
								$("#itemEnabled").find("label").eq(1).addClass("active");
								$("#itemEnabled").find("label").eq(1).find("input").prop("checked", true);
							} else {
								$("#itemEnabled").find("label").eq(0).addClass("active");
								$("#itemEnabled").find("label").eq(0).find("input").prop("checked", true);
							}
							$('#chrName').val(depName);
							page.departmentData = $('#form-department').serializeObject();
							$("#deprtment-chrCode").trigger("blur")
						});
					});
				};

				function removeHoverDom(treeId, treeNode) {
					$("#editBtn_" + treeNode.tId).unbind().remove();
				};

				function beforeClick(treeId, treeNode) {
					var zTree = $.fn.zTree.getZTreeObj("tree");
					zTree.checkNode(treeNode, !treeNode.checked, null, true);
					page.newTable();
					//return false;
				};

				function focusKey(e) {
					if(key.hasClass("empty")) {
						key.removeClass("empty");
					}
				}

				function blurKey(e) {
					if(key.get(0).value === "") {
						key.addClass("empty");
					}
				}
				var lastValue = "",
					nodeList = [],
					fontCss = {};

				function clickRadio(e) {
					lastValue = "";
					searchNode(e);
				}

				function allNodesArr() {
					var zTree = $.fn.zTree.getZTreeObj("tree");
					var nodes = zTree.getNodes();
					var allNodesArr = [];
					var allNodesStr;
					for(var i = 0; i < nodes.length; i++) {
						var result = "";
						var result = page.getAllChildrenNodes(nodes[i], result);
						var NodesStr = result
						NodesStr = NodesStr.split(",");
						NodesStr.splice(0, 1, nodes[i].id);
						NodesStr = NodesStr.join(",");
						allNodesStr += "," + NodesStr;
					}
					allNodesArr = allNodesStr.split(",");
					allNodesArr.shift();
					return allNodesArr;
				}

				function searchNode(e) {
					if(e.target.value != '') {
						var zTree = $.fn.zTree.getZTreeObj("tree");
						zTree.expandAll(true);
						var value = $.trim(key.get(0).value);
						var keyType = "name";

						if(key.hasClass("empty")) {
							value = "";
						}
						if(lastValue === value) return;
						lastValue = value;
						if(value === "") {
							zTree.expandAll(false);
							return;
						}
						updateNodes(false);

						nodeList = zTree.getNodesByParamFuzzy(keyType, value);

						updateNodes(true);

						var NodesArr = allNodesArr();
						if(nodeList.length > 0) {
							var index = NodesArr.indexOf(nodeList[0].id.toString());
							$(".deparmentTree").scrollTop((20.2 * index));
						}
					} else {
						$('#tree li a').css({
							'color': "#333",
							"font-weight": 'normal'
						})
					}

				}

				function updateNodes(highlight) {
					var zTree = $.fn.zTree.getZTreeObj("tree");
					for(var i = 0, l = nodeList.length; i < l; i++) {
						nodeList[i].highlight = highlight;
						zTree.updateNode(nodeList[i]);
					}
				}

				function getFontCss(treeId, treeNode) {
					return(!!treeNode.highlight) ? {
						color: "#F04134",
						"font-weight": "bold"
					} : {
						color: "#333",
						"font-weight": "normal"
					};
				}

				function filter(node) {
					return !node.isParent && node.isFirstNode;
				}

				var key;
				$(document).ready(function() {
					key = $("#key");
					key.bind("focus", focusKey)
						.bind("blur", blurKey)
						.bind("propertychange", searchNode)
						.bind("input", searchNode);
				});

				var $tree;

				var $tree;
				if(setting.hasOwnProperty('url') && !$.isNull(setting.url)) {
					ufma.ajaxDef(setting.url, 'get', '', function(result) {
						setting.data = result.data || [];
					});
				}
				$tree = $.fn.zTree.init($tree, treeSetting, setting.data || []);

				page.initTwoManager();

				return $tree;
			},

			clearModelData: function() {
				$("#form-person").find("input[name='chrCode']").val("");
				$("#form-person").find("input[name='chrName']").val("");
				$("#form-person").find("input[name='departmentCode']").val("");
				$("#form-person").find("input[name='phoneNo']").val("");
				$("#form-person").find("input[name='cardId']").val("");
				$("#form-person").find("input[name='barthDate']").val("");
				$("#form-person").find("input[name='startWordDate']").val("");
				$("#form-person").find("input[name='chrId']").val("");
				$("#form-person").find("input[name='lastVer']").val("");
				$("#form-person").find("[name='remark']").val("");
				$("#form-person").find("[name='genderCode']").val("");

			},

			setModelData: function(paramter) {
				$("#form-person").find("input[name='chrId']").val(paramter.chrId);
				$("#form-person").find("input[name='chrCode']").val(paramter.chrCode);
				$("#form-person").find("input[name='chrName']").val(paramter.chrName);
				$("#form-person").find("input[name='departmentCode']").val(paramter.departmentCode);
				$("#form-person").find("input[name='phoneNo']").val(paramter.phoneNo);
				$("#form-person").find("input[name='cardId']").val(paramter.cardId);
				$("#form-person").find("input[name='barthDate']").val(paramter.barthDate);
				$("#form-person").find("input[name='startWordDate']").val(paramter.startWordDate);
				$("#form-person").find("[name='remark']").val(paramter.remark);
				$("#nationCode").val(paramter.nationCode);
				$("#genderCode").val(paramter.genderCode);

				$("#cardType").val($.isNull(paramter.cardType) || '01' ? '02' : paramter.cardType);

				$("#form-person").find("input[name='lastVer']").val(paramter.lastVer);
				page.nationCode.setValue(paramter.nationCode);
			},

			cancelCheckAll: function() {
				$("#checkAll,.datatable-group-checkable").prop("checked", false);
				page.depTable.find("input[name='checkList']").prop("checked", false);
				page.depTable.find("tbody tr").removeClass("selected");
			},

			//button控制
			setButtonDisable: function(id) {
				if(enabled == "1") {
					var tag = document.getElementById("personAll-start");
					tag.disabled = true;
					var tag = document.getElementById("personAll-stop");
					tag.disabled = false;
					active = "disabled";
					unactive = "";
				} else if(enabled == "0") {
					var tag = document.getElementById("personAll-start");
					tag.disabled = false;
					var tag = document.getElementById("personAll-stop");
					tag.disabled = true;
					active = "";
					unactive = "disabled";
				} else if(enabled == "-1") {
					var tag = document.getElementById("personAll-start");
					tag.disabled = false;
					var tag = document.getElementById("personAll-stop");
					tag.disabled = false;
					active = "";
					unactive = "";
				}
			},

			//部门保存
			save: function(goon) {
				page.pageNum = $('.departtable-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#departtable_length').find('select').val());
				var url = page.baseUrl + 'department/save';
				var argu = $('#form-department').serializeObject();
				argu.acctCode = page.acctCode;
				var chargeManager = argu.deptSubManager;
				argu.chargeManager = chargeManager;
				delete argu.deptSubManager;
				var callback = function(result) {
					$('#department-save').removeAttr('disabled');
					$('#department-saveadd').removeAttr('disabled');
					$('#form-department')[0].reset();
					page.departmentData = $('#form-department').serializeObject();
					//page.formdata= $('#form-person').serializeObject();
					page.initTree();
					page.newTable(page.pageNum, page.pageLen);
					if(!goon) {
						ufma.showTip(result.msg, function() {}, result.flag);
						page.editor.close();
						page.depaction = ""
					} else {
						$('#deprtment-chrCode').removeAttr('disabled');
						ufma.showTip('保存成功，您可以继续添加部门信息！', function() {}, result.flag);

						ma.fillWithBrother($('#deprtment-chrCode'), {
							"chrCode": argu.chrCode,
							"eleCode": "DEPARTMENT",
							"agencyCode": page.agencyCode,
							"acctCode": page.acctCode
						});
					}
				};
				var obj = {
					"chrCode": argu.chrCode,
					"tableName": "MA_ELE_DEPARTMENT",
					"eleCode": 'DEPARTMENT',
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode
				}
				ma.departNameTip = "";
				ufma.ajaxDef("/ma/sys/common/getParentChrFullname", "post", obj, function(result) {
					ma.departNameTip = result.data;
					if(ma.departNameTip == null || ma.departNameTip == undefined) {
						argu['chrFullname'] = argu.chrName;
					} else {
						argu['chrFullname'] = ma.departNameTip + "/" + argu.chrName;
					}
					argu.agencyCode = page.agencyCode;
					argu.acctCode = page.acctCode;
					argu.setYear = ma.setYear;
					argu.rgCode = ma.rgCode;
					ma.post(url, argu, callback);
				});
			},
			getInterface: function(action) {
				var urls = {
					delete: {
						type: 'delete',
						url: page.baseUrl + 'eleEmplyee/delete'
					},
					active: {
						type: 'put',
						url: page.baseUrl + 'eleEmplyee/able'
					},
					unactive: {
						type: 'put',
						url: page.baseUrl + 'eleEmplyee/able'
					}
				};
				return urls[action];
			},
			operatePerson: function(action, chrCode, $tr, delOne) {
				var options = page.getInterface(action);
				page.pageNum = $('.departtable-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#departtable_length').find('select').val());
				var ableUserValue = '';
				if(page.sameStepType == true) {
					ableUserValue = "1";
				} else if(page.sameStepType == false) {
					ableUserValue = "0";
				}
				var argu = {
					action: action,
					chrCodes: chrCode,
					tableName: 'MA_ELE_EMPLOYEE',
					"rgCode": ma.rgCode,
					"setYear": ma.setYear,
					"agencyCode": page.agencyCode,
					"acctCode": page.acctCode,
					"ableUser": ableUserValue
				};
				var callback = function() {
					if(action == 'delete') {
						ufma.hideloading();
						if($tr) $tr.remove();
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
						ufma.hideloading();
					}
					page.newTable(page.pageNum, page.pageLen);
				}
				if(action == 'delete' && !delOne) {
					ufma.confirm('您确定要删除选中的数据吗？', function(e) {
						if(e) {
							ufma.showloading('数据删除中，请耐心等待...');
							ufma.delete(options.url, argu, callback);
						}
					}, {
						type: 'warning'
					})
				} else {
					if(action == 'active' && !delOne) {
						ufma.confirm('您确定启用选中的数据吗？', function(e) {
							if(e) {
								ufma.showloading('数据启用中，请耐心等待...');
								ufma.put(options.url, argu, callback);
							}
						}, {
							type: 'warning'
						})
					} else if(action == "unactive" && !delOne) {
						ufma.confirm('您确定停用选中的数据吗？', function(e) {
							if(e) {
								ufma.showloading('数据停用中，请耐心等待...');
								ufma.put(options.url, argu, callback);
							}
						}, {
							type: "warning"
						})
					}

				}

			},
			delRowOne: function(action, chrCode, $tr) {
				var options = page.getInterface(action);
				page.pageNum = $('.departtable-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#departtable_length').find('select').val());
				var ableUserValue = '';
				if(page.sameStepType == true) {
					ableUserValue = "1";
				} else if(page.sameStepType == false) {
					ableUserValue = "0";
				}
				var argu = {
					action: action,
					chrCodes: chrCode,
					tableName: 'MA_ELE_EMPLOYEE',
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					ableUser: ableUserValue
				};
				var callback = function(data) {
					if(action == 'delete') {
						ufma.hideloading();
						// if ($tr) $tr.remove();
						//revise
						if($tr) {
							ufma.showTip(data.msg, function() {}, data.flag);
						}
						ufma.setBarPos($(window));
					} else if(action == 'active') {
						ufma.hideloading();
						if(data.flag == 'success') {
							ufma.showTip('启用成功', function() {}, 'success');
						}
					} else if(action == 'unactive') {
						ufma.hideloading();
						if(data.flag == 'success') {
							ufma.showTip('停用成功！', function() {}, 'success');
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
						}
						ufma.setBarPos($(window));
					}
					page.newTable(page.pageNum, page.pageLen);
				}
				if(action == 'delete') {
					ufma.delete(options.url, argu, callback);

				} else {
					ufma.put(options.url, argu, callback);
				}

			},
			//部门删除
			deleteDepartMent: function() {
				var url = "/ma/sys/department/delete";
				// if (page.agencyCode != '*') {
				// 	//					url = '/ma/agy/department/delete/' + page.agencyCode;
				// 	url = '/ma/sys/department/delete/' + page.agencyCode+'?setYear=' + ma.setYear +'&rgCode=' + ma.rgCode;;
				// }
				var type = "POST";
				var checkNodes = page.departMentTree.getCheckedNodes(true);
				var selectNodes = [];
				for(var i = 0; i < checkNodes.length; i++) {
					var node = checkNodes[i];
					if(!node.isParent) {
						selectNodes.push(node.code);
					}
				}

				if(selectNodes.length == 0) {
					ufma.showTip('请选择要删除的部门!', function() {}, 'warning');
					return false;
				}
				var departArray = page.orgTreeParamAll(selectNodes);
				ufma.showloading('数据删除中，请耐心等待...');
				var callback = function(result) {
					ufma.hideloading();
					ufma.showTip(result.msg, function() {}, result.flag);
					page.initTree();
				}
				var argu = {
					chrCodes: selectNodes,
					tableName: "MA_ELE_DEPARTMENT",
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					setYear: ma.setYear,
					rgCode: ma.rgCode
				};
				ufma.post(url, argu, callback);
			},

			//树参数组织
			orgTreeParam: function(selectNodes) {
				var departArray = new Array();
				for(var i = 0; i < selectNodes.length; i++) {
					obj = selectNodes[i].getCheckStatus();
					if(obj.checked == true && obj.half == false) {
						departArray.push(selectNodes[i].code);
					}
				}
				return departArray;
			},
			orgTreeParamId: function(selectNodes) {
				var departArray = new Array();
				for(var i = 0; i < selectNodes.length; i++) {
					departArray.push(selectNodes[i].id);
				}
				return departArray;
			},
			orgTreeParamAll: function(selectNodes) {
				var departArray = new Array();
				var depvo = function(id, name, pid, code) {
					this.id = id;
					this.name = name;
					this.code = code;
					this.pId = pid;
				}
				for(var i = 0; i < selectNodes.length; i++) {
					departArray.push(new depvo(selectNodes[i].id, selectNodes[i].name, selectNodes[i].pId, selectNodes[i].code));
				}
				return departArray;
			},

			//部门启用
			startDepartMent: function() {
				url = page.baseUrl + "department/able";
				type = "POST";
				var selectNodes = page.departMentTree.getCheckedNodes(true);
				if(selectNodes.length == 0) {
					ufma.showTip('请选择启用部门!', function() {}, 'warning');
					return false;
				}
				ufma.showloading('数据启用中，请耐心等待...');
				var departArray = page.orgTreeParam(selectNodes);
				var callback = function(result) {
					ufma.hideloading();
					ufma.showTip(result.msg, function() {}, result.flag);
					page.initTree();
					$("#checkall").prop("checked", false)
				}
				var argu = {
					action: 'active',
					chrCodes: departArray,
					tableName: 'MA_ELE_DEPARTMENT',
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					setYear: ma.setYear,
					rgCode: ma.rgCode
				};

				ufma.put(url, argu, callback);
			},

			//部门停用
			stopDepartMent: function() {
				url = page.baseUrl + "department/able";
				type = "POST";
				var selectNodes = page.departMentTree.getCheckedNodes(true);
				if(selectNodes.length == 0) {
					ufma.showTip('请选择停用部门!', function() {}, 'warning');
					return false;
				};
				ufma.showloading('数据停用中，请耐心等待...');
				var departArray = page.orgTreeParam(selectNodes);
				var callback = function(result) {
					ufma.hideloading();
					ufma.showTip(result.msg, function() {}, result.flag);
					page.initTree();
					$("#checkall").prop("checked", false)
				}
				var argu = {
					action: 'unactive',
					chrCodes: departArray,
					tableName: 'MA_ELE_DEPARTMENT',
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					setYear: ma.setYear,
					rgCode: ma.rgCode
				};
				ufma.put(url, argu, callback);
			},

			//人员新增
			savePerson: function(goon) {
				page.pageNum = $('.departtable-paginate').find('span a.paginate_button.current').text();
				page.pageLen = parseInt($('#departtable_length').find('select').val());
				ufma.showloading('数据保存中，请耐心等待...');
				var url = page.baseUrl + 'eleEmplyee/save';
				var argu = $('#form-person').serializeObject();
				var callback = function(result) {
					$('.person-save').removeAttr('disabled');
					$('.person-saveadd').removeAttr('disabled');
					if(goon) {
						ufma.hideloading();
						ufma.showTip(result.msg, function() {}, result.flag);
						if(result.flag == "success") {
							page.editor.close();
							page.depaction = ""
						}
					} else {
						ufma.hideloading();
						ufma.showTip(result.msg, function() {}, result.flag);
						page.action = 'add'
						page.setFormEnabled()
						$("#departmentCode").getObj().load(page.departMentTree.getNodes());
						$("#departmentCode").getObj().val(page.deparmentId);
					}
					//page.depDataTableAll.ajax.url(page.getUrl).load();
					page.newTable(page.pageNum, page.pageLen);
				}
				argu.agencyCode = page.agencyCode;
				argu.acctCode = page.acctCode;
				argu.setYear = ma.setYear;
				argu.rgCode = ma.rgCode;
				var chrFullname = "";
				if(ma.nameTip != null && ma.nameTip != undefined) {
					chrFullname = ma.nameTip + '/' + argu.chrName;
				} else {
					chrFullname = argu.chrName;
				}
				argu.departmentCode = $("#departmentCode").getObj().getValue();
				argu.chrFullname = chrFullname;
				ma.post(url, argu, callback);
			},

			//人员批量删除
			deleteAllPerson: function() {
				url = page.baseUrl + "eleEmplyee/delete";
				table = page.depDataTableAll;
				var length = table.rows('.selected').data().length; //获取选中行长度
				if(length == 0) {
					ufma.alert("请选择要删除的行");
					return false;
				}
				var selectData = new Array();
				for(var i = 0; i < length; i++) {
					selectData.push(table.rows('.selected').data()[i].chrCode);
				}
				type = "POST";
				ufma.showloading('数据删除中，请耐心等待...');
				var ableUserValue = '';
				if(page.sameStepType == true) {
					ableUserValue = "1";
				} else if(page.sameStepType == false) {
					ableUserValue = "0";
				}
				var argu = {
					chrCodes: selectData,
					tableName: 'MA_ELE_EMPLOYEE',
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear,
					ableUser: ableUserValue
				};
				var callback = function(result) {
					table.rows('.selected').remove().draw();
					page.cancelCheckAll();
					ufma.hideloading();
					ufma.showTip('删除成功!', function() {}, "success");
					ufma.setBarPos($(window));
				}
				ufma.delete(url, argu, callback);
			},

			//人员批量启用
			startPerson: function() {
				url = page.baseUrl + "eleEmplyee/able";
				type = "POST";
				table = page.depDataTableAll;
				var length = table.rows('.selected').data().length; //获取选中行长度
				if(length == 0) {
					ufma.alert('请选择启用行！');
					return false;
				}
				var selectData = new Array();
				for(var i = 0; i < length; i++) {
					selectData.push(table.rows('.selected').data()[i].chrCode);
				}
				ufma.showloading('数据启用中，请耐心等待...');
				var ableUserValue = '';
				if(page.sameStepType == true) {
					ableUserValue = "1";
				} else if(page.sameStepType == false) {
					ableUserValue = "0";
				}
				var argu = {
					action: 'active',
					chrCodes: selectData,
					tableName: 'MA_ELE_EMPLOYEE',
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					ableUser: ableUserValue
				};
				var callback = function(result) {
					if(enabled != "-1") {
						table.rows('.selected').remove().draw();
					} else {
						//page.depDataTableAll.ajax.url(page.getUrl).load();
						page.newTable();
					}
					page.cancelCheckAll();
					ufma.hideloading();
					ufma.showTip('启用成功!', function() {}, 'success');
				}
				ufma.put(url, argu, callback);
			},

			//人员批量停用
			stopPerson: function() {
				url = page.baseUrl + "eleEmplyee/able";
				type = "POST";
				table = page.depDataTableAll;
				var length = table.rows('.selected').data().length; //获取选中行长度
				if(length == 0) {
					ufma.alert('请选择停用行！');
					return false;
				}
				var selectData = new Array();
				for(var i = 0; i < length; i++) {
					selectData.push(table.rows('.selected').data()[i].chrCode);
				}
				ufma.showloading('数据停用中，请耐心等待...');
				var ableUserValue = '';
				if(page.sameStepType == true) {
					ableUserValue = "1";
				} else if(page.sameStepType == false) {
					ableUserValue = "0";
				}
				var argu = {
					action: 'unactive',
					chrCodes: selectData,
					tableName: 'MA_ELE_EMPLOYEE',
					agencyCode: page.agencyCode,
					acctCode: page.acctCode,
					ableUser: ableUserValue
				};
				var callback = function(result) {
					if(enabled != "-1") {
						table.rows('.selected').remove().draw();
					} else {
						// page.depDataTableAll.ajax.url(page.getUrl).load();
						page.newTable();
					}
					page.cancelCheckAll();
					ufma.hideloading();
					ufma.showTip('停用成功!', function() {}, 'success');
				}
				ufma.put(url, argu, callback);
			},
			//获得chrCode
			getCheckedRows: function() {
				var checkedArray = [];
				table = page.depDataTableAll;
				activeLine = table.rows('.selected');
				data = activeLine.data();
				for(var i = 0; i < data.length; i++)
					checkedArray.push(data[i].chrCode);
				return checkedArray;
			},
			//获得ID
			getCheckedRowIds: function() {
				var checkedArray = [];
				table = page.depDataTableAll;
				activeLine = table.rows('.selected');
				data = activeLine.data();
				for(var i = 0; i < data.length; i++)
					checkedArray.push(data[i].chrId);
				return checkedArray;
			},
			showParentHelp: function(parentCodes) {
				var url = '/ma/sys/common/findParentList?' + 'chrCode=' + parentCodes + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=DEPARTMENT';
				var callback = function(result) {
					var htm = '';
					if(result.data.length > 0) {
						page.aParentCode = [];
						page.aParentName = [];
					}
					$.each(result.data, function(index, row) {
						if(index == 0) {
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
						page.jCodeName[row.chrCode] = row.name;
					});
					$('#department-help').html(htm);
				};

				ufma.get(url, '', callback);
			},

			showPersonParentHelp: function(parentCodes) {
				var url = '/ma/sys/common/findParentList?' + 'chrCode=' + parentCodes + '&agencyCode=' + page.agencyCode + '&acctCode=' + page.acctCode + '&eleCode=DEPARTMENT';
				var callback = function(result) {
					var htm = '';
					if(result.data.length > 0) {
						page.aParentCode = [];
						page.aParentName = [];
					}
					$.each(result.data, function(index, row) {
						if(index == 0) {
							htm += ufma.htmFormat('<li style="padding-left:0px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.chrCode,
								'CHR_NAME': row.chrName
							});
						} else {
							htm += ufma.htmFormat('<li style="padding-left:16px;"><%=CHR_CODE%> <%=CHR_NAME%></li>', {
								'CHR_CODE': row.chrCode,
								'CHR_NAME': row.chrName
							});
						}
						page.aParentCode.push(row.chrCode);
						page.jCodeName[row.chrCode] = row.chrName;
					});
					if($('#person-help').length > 0) {
						$('#person-help').html(htm);
					}

				};

				ufma.get(url, '', callback);
			},

			initfifa: function() {
				ufma.get('/ma/sys/element/getEleDetail', {
					eleCode: 'DEPARTMENT',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				}, function(result) {
					var pRule = result.data.codeRule;
					if(pRule != null && pRule != "") {
						page.fjfa = pRule;
					} else {
						page.fjfa = '暂无参考信息'; //bugCWYXM-4244--zsj
					}
					var isAcctLevel = result.data.isAcctLevel;
					if(isAcctLevel == '1' && page.acctFlag == true) {
						$("#cbAcct").show();
						ufma.get('/ma/sys/eleCoacc/getAcctTree/' + page.agencyCode, {
							"setYear": page.setYear,
							"rgCode": page.rgCode
						}, function(result) {
							var acctData = result.data;
							if(acctData.length > 0) {
								page.cbAcct = $("#cbAcct").ufmaTreecombox2({
									data: acctData,
								});
							}
						});
						page.initAcctScc();
					} else {
						$("#cbAcct").hide();
						page.acctCode = '*';
						page.getUrl = "/ma/sys/eleEmplyee/select?agencyCode=*&acctCode=*&setYear=" + ma.setYear;
						page.newTable();
						page.treeUrl = "/ma/sys/department/getDepTree?agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear;
						page.initTree();
					}
				});
				//MA_ELE_EMPLOYEE
				ufma.get('/ma/sys/element/getEleDetail', {
					eleCode: 'EMPLOYEE',
					agencyCode: page.agencyCode,
					rgCode: ma.rgCode,
					setYear: ma.setYear
				}, function(result) {
					var pRule = result.codeRule;
					if(pRule != null && pRule != "") {
						page.personFjfa = pRule;
					}
					$('.table-sub-info').text(result.data.agencyCtrlName);
				});

			},
			openEditWin: function(data) {
				page.editor = ufma.showModal('person-edt', 720, 500);
				//bugCWYXM-4119--公共要素下助记码在新建时会自动带入,且不能删掉--zsj
				setTimeout(function() {
					$('#assCode').val(data.assCode);
				}, 200)
				//page.formdata =data;
				page.formdata = $('#form-person').serializeObject();

			},
			setFormEnabled: function() {
				if(page.action == 'edit') {
					$('#personChrCode').attr('disabled', 'disabled');
				} else if(page.action == 'add') {
					$('#personChrCode').removeAttr('disabled');
					$('#form-person')[0].reset();
				}
			},
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
			getErrMsg: function(errcode) {
				var error = {
					0: '部门编码不能为空',
					1: '上级编码不能为空',
					2: '部门名称不能为空',
					3: '上级编码不存在',
					4: '部门负责人不能空',
					5: '部门编码不能空',
					6: '部门不能为空',
					7: '部门名称不能为空',
					8: '编码已存在',
					9: '编码不符合编码规则:',
					10: '请输入正确的部门联系电话',
					11: '请输入数字或者字母编码'
				}
				return error[errcode];
			},
			clearError: function() {
				var $form = $('form')
				for(var i = 0; i < $form.length; i++) {
					$form[i].reset();
				}
				$('#form-department').find('.form-group').each(function() {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});
				$('#form-person').find('.form-group').each(function() {
					$(this).removeClass('error');
					$(this).find(".input-help-block").remove();
				});
			},
			initNationCode: function() {
				var data = [];

				function buildCombox() {
					page.nationCode = $('#nationCode').ufmaCombox({
						valueField: 'ENU_CODE',
						textField: 'ENU_NAME',
						data: data,
						name: 'nationCode',
						readOnly: true
					});
				};

				var callback = function(result) {
					data = result.data;
					buildCombox();
				};
				var url = '/ma/pub/enumerate/NATION';
				ufma.get(url, "", callback);
			},
			doSearch: function() {
				var key = $('#key').val();
				var nodes = page.departMentTree.getNodesByParamFuzzy("name", key);
				if(!$.isNull(nodes)) {
					page.departMentTree.selectNode(nodes, true, true);
				}
			},
			issueTips: function(data, isCallBack) {
				var title = "";
				if(isCallBack) {
					title = "选用结果";
				} else {
					title = "下发结果";
				}
				data.colName = '部门人员';
				data.pageType = 'EMPLOYEE';
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
			getLeafData: function(data) {
				var title = "";
				if($.isNull(data)) {
					return data;
				}
				var retData = [];
				for(var i = 0; i < data.length; i++) {
					if($.isNull(data[i].children) || data[i].children.length == 0) {
						retData.push(data[i]);
					}
				}
				return retData;
			},
			onEventListener: function() {
				$('.btn-sync-emp').on('click', function(e) {
					ufma.open({
						url: 'syncEmp.html',
						title: '同步人员信息',
						width: 1100,
						height: 650,
						data: {
							agencyCode: page.agencyCode,
							setYear: pfData.svSetYear,
							acctCode: page.acctCode,
							rgCode: pfData.svRgCode
						},
						ondestory: function(data) {
							// console.log(data);
							//刷新页面表格和树
							page.initTree();
							page.newTable(page.pageNum, page.pageLen);
							if(data.action) {
								ufma.showTip("同步成功", function() {}, 'success');
							}
						}
					})
				})
				// $('#key').on('keyup', function(e) {
				//     e.stopPropagation();
				//     if ($('#key').val() == '') return false;
				//     page.doSearch();
				// });
				$('#expfunc-choose-datatable').on('click', 'tbody td', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
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
					$("#checkAll,.datatable-group-checkable").attr('checked', t).prop('checked', t)
				});
				//71560 --【农业部】辅助核算和会计科目目前不能设置“助记码”--当用户输入名称后，助记码应自动填充由名称首字母的大写字母组成的字符串--zsj
				$('#chrName').on('blur', function() {
					$(this).val($(this).val().replaceAll(/\s+/g, '')) //去除名称中的所有空格
					/*var chrNameValue = $(this).val();
					ufma.post('/pub/util/String2Alpha', {
						"chinese": chrNameValue
					}, function(result) {
						$('#assCode').val(result.data);
					});*/
				});
				$("#checkall").on("change", function() {
					var treeObj = $.fn.zTree.getZTreeObj("tree");
					if($(this).prop("checked")) {
						treeObj.checkAllNodes(true);
					} else {
						treeObj.checkAllNodes(false);
					}
					page.newTable();

				});
				//表格内操作
				$("#departtable").on("click", ".btn", function() {
					page.operatePerson($(this).attr("action"), [$(this).attr("chrCode")], $(this).closest('tr'), true);
				});

				$('#departtable').on('click', 'tbody td:not(.btnGroup)', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					if($ele.is('a')) {
						var tabledata = $ele.data('href');
						page.setModelData(tabledata);
						page.action = 'edit';
						page.setFormEnabled();
						page.initField(tabledata);
						//bug77247--修改编辑时部门未带入问题
						$("#departmentCode").getObj().load(page.departMentTree.getNodes());
						$("#departmentCode").getObj().val(tabledata.departmentCode);
						page.openEditWin(tabledata);
						page.deparmentId = tabledata.departmentCode;
						return false;
					}
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.data("code").toString();
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
					$("#checkAll,.datatable-group-checkable").attr('checked', t).prop('checked', t)
				});

				ufma.searchHideShow(page.depTable);
				$('#deprtment-chrCode').on('keydown focus paste keyup change', function(e) {
					e.stopepropagation;
					$('#deprtment-chrCode').closest('.form-group').removeClass('error');
					//$(this).val($(this).val().replace(/[^\d]/g, ''));
					$(this).val($(this).val().replace(/[\W]|_/g, '')); //项目要求允许输入字母和数字--zsj
					var textValue = $(this).val();
					if(!ufma.keyPressInteger(e)) {
						if($(this).val == '') {
							ufma.showInputHelp('deprtment-chrCode', '<span class="error">' + page.getErrMsg(5) + '</span>');
						}
					}
					if(page.fjfa == null || page.fjfa == "" || page.fjfa == undefined) {
						$('#deprtment-chrCode').unbind('blur');
					}
				}).on('blur', function() {
					var textValue = $(this).val();
					if(page.fjfa) {
						var dmJson = ufma.splitDMByFA(page.fjfa, textValue);
						page.isRuled = dmJson.isRuled;
						page.aInputParentCode = dmJson.parentDM.split(',');
					}

					page.aInputParentCode.pop();
					if((page.aInputParentCode.length > 0)) {
						page.aInputParentCode = [page.aInputParentCode.pop()];
					} else {
						page.aInputParentCode = [];
					}
					if(textValue.length > 0) {
						page.showParentHelp(textValue);
					}

					var value = $(this).val();
					var timeId = setTimeout(function() {
						if(value == '') {
							ufma.showInputHelp('deprtment-chrCode', '<span class="error">' + page.getErrMsg(0) + '</span>');
							$('#deprtment-chrCode').closest('.form-group').addClass('error');
						} else if(!ufma.isNumOrChar(value)) {
							ufma.showInputHelp('deprtment-chrCode', '<span class="error">' + page.getErrMsg(11) + '</span>');
							$('#deprtment-chrCode').closest('.form-group').addClass('error');
							$('#deprtment-chrCode').val('');
						} else if($.inArray(value, page.aParentCode) != -1) {
							if(page.depaction != "depEdit") {
								ufma.showInputHelp('deprtment-chrCode', '<span class="error">' + page.getErrMsg(8) + '</span>'); //已存在
								$('#deprtment-chrCode').closest('.form-group').addClass('error');
							}
						} else if(!page.isRuled) {
							ufma.showInputHelp('deprtment-chrCode', '<span class="error">' + page.getErrMsg(9) + '' + page.fjfa + '</span>');
							$('#deprtment-chrCode').closest('.form-group').addClass('error');
						} else if(!ufma.arrayContained(page.aParentCode, page.aInputParentCode)) {
							if(page.depaction != "depEdit") {
								ufma.showInputHelp('deprtment-chrCode', '<span class="error">' + page.getErrMsg(3) + '</span>');
								$('#deprtment-chrCode').closest('.form-group').addClass('error');
							}
						} else {
							ufma.hideInputHelp('deprtment-chrCode');
							$('#deprtment-chrCode').closest('.form-group').removeClass('error');

						}
						clearTimeout(timeId);
					}, 200)

				});
				$('#personChrCode').on('keydown focus paste keyup change', function(e) {
					e.stopepropagation;
					$('#personChrCode').closest('.form-group').removeClass('error');
					$(this).val($(this).val().replace(/[^\w\.\/]/ig, ''));
					var textValue = $(this).val();
					if(!ufma.keyPressInteger(e)) {
						if($(this).val == '') {
							ufma.showInputHelp('deprtment-chrCode', '<span class="error">' + page.getErrMsg(5) + '</span>');
						}
					}
					if(page.personFjfa == null || page.personFjfa == "" || page.personFjfa == undefined) {
						$('#personChrCode').unbind('blur');
					}
					if(page.personFjfa) {
						var dmJson = ufma.splitDMByFA(page.personFjfa, textValue);
						page.isRuled = dmJson.isRuled;
						page.aInputParentCode = dmJson.parentDM.split(',');
					}

					page.aInputParentCode.pop();
					if((page.aInputParentCode.length > 0)) {
						page.aInputParentCode = [page.aInputParentCode.pop()];
					} else {
						page.aInputParentCode = [];
					}
					/*if(textValue.length > 0) {
						page.showPersonParentHelp(textValue);
					}*/
				}).on('blur', function() {
					var value = $(this).val();
					if(value.length > 0) {
						page.showPersonParentHelp(value);
					}
					var timeId = setTimeout(function() {
						if(value == '') {
							ufma.showInputHelp('personChrCode', '<span class="error">' + page.getErrMsgPerson(0) + '</span>');
							$('#personChrCode').closest('.form-group').addClass('error');
						} else if(!ufma.isNumOrChar(value)) {
							ufma.showInputHelp('personChrCode', '<span class="error">' + page.getErrMsg(11) + '</span>');
							$('#personChrCode').closest('.form-group').addClass('error');
							$('#personChrCode').val('');
						} else if($.inArray(value, page.aParentCode) != -1) {
							ufma.showInputHelp('personChrCode', '<span class="error">' + page.getErrMsgPerson(9) + '</span>'); //已存在
							$('#personChrCode').closest('.form-group').addClass('error');
						} else if(!page.isRuled) {
							ufma.showInputHelp('personChrCode', '<span class="error">' + page.getErrMsgPerson(8) + '' + page.personFjfa + '</span>');
							$('#personChrCode').closest('.form-group').addClass('error');
						} else if(!ufma.arrayContained(page.aParentCode, page.aInputParentCode)) {
							ufma.showInputHelp('personChrCode', '<span class="error">' + page.getErrMsgPerson(5) + '</span>');

							$('#personChrCode').closest('.form-group').addClass('error');
						} else {
							ufma.hideInputHelp('personChrCode');
							$('#personChrCode').closest('.form-group').removeClass('error');
							var obj = {
								"chrCode": value,
								"tableName": 'MA_ELE_EMPLOYEE',
								"eleCode": 'EMPLOYEE',
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
					}, 200);

				});
				//联系方式校验
				$('#phoneNo').on('blur', function() {
					if($(this).val() == '') {
						return true;
					}
					if(!ufma.checkTelePhone($(this).val())) {
						ufma.showInputHelp('phoneNo', '<span class="error">' + page.getErrMsgPerson(6) + '</span>');
						$('#phoneNo').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('phoneNo');
						$('#phoneNo').closest('.form-group').removeClass('error');
					}
				});

				$('#deptPhone').on('blur', function() {
					if($(this).val() == '') {
						return true;
					}
					if(!ufma.checkTelePhone($(this).val())) {
						ufma.showInputHelp('deptPhone', '<span class="error">' + page.getErrMsg(10) + '</span>');
						$('#deptPhone').closest('.form-group').addClass('error');
					} else {
						ufma.hideInputHelp('deptPhone');
						$('#deptPhone').closest('.form-group').removeClass('error');
					}
				});
				$('.btn-addperson').on('click', function(e) {
					e.preventDefault();
					page.clearModelData();
					page.clearError();
					var selectNodes = page.departMentTree.getCheckedNodes(true);
					selectNodes = page.getLeafData(selectNodes);
					if(selectNodes.length > 1) {
						ufma.showTip('只能选择一个部门!', function() {}, 'warning');
						return false;
					}
					var data = $('#form-person').serializeObject();
					page.action = 'add';
					page.setFormEnabled();

					$("#departmentCode").getObj().load(page.departMentTree.getNodes());
					page.initNationCode();
					if(selectNodes.length > 0) {
						var timeId = setTimeout(function() {
							clearTimeout(timeId);
							$("#departmentCode").getObj().val(selectNodes[0].id);
						}, 30);

						page.deparmentId = selectNodes[0].id;
					}

					page.openEditWin(data);

				});
				$('#department-saveadd').on('click', function(e) {
					if(ufma.hasNoError('#form-department')) {
						$(this).attr('disabled', 'disabled');
						$('#department-save').attr('disabled', 'disabled');
						page.save(true);
					}
				});
				$('#department-save').on('click', function(e) {
					if(ufma.hasNoError('#form-department')) {
						$(this).attr('disabled', 'disabled');
						$('#department-saveadd').attr('disabled', 'disabled');
						page.save(false);
					}
				});
				$('.btn-close').on('click', function() {
					var tmpFormData = $('#form-person').serializeObject();
					if(!ufma.jsonContained(page.formdata, tmpFormData) && $('.btn-save').prop('display') != 'none') {
						ufma.confirm('您修改了人员信息，关闭前是否保存', function(isOk) {
							if(isOk) {
								if(ufma.hasNoError('#form-person')) {
									page.savePerson(true);
								}
							} else {
								page.editor.close();
								page.depaction = ""
							}
						})
					} else {
						page.editor.close();
						page.depaction = ""
					}
				});
				$('.btn-depar-close').on('click', function() {
					var tmpFormData = $('#form-department').serializeObject();
					if(!ufma.jsonContained(page.departmentData, tmpFormData)) {
						ufma.confirm('您修改了部门信息，关闭前是否保存', function(isOk) {
							if(isOk) {
								if(ufma.hasNoError('#form-deparment')) {
									page.save(false);
								}
							} else {
								page.editor.close();
								page.depaction = ""
							}
						})
					} else {
						page.editor.close();
						page.depaction = ""
					}
				});
				$('.btn-add-department').on('click', function(e) {
					page.initDeptManager(null);
					e.preventDefault();
					page.clearError();
					$('#deprtment-chrCode').removeAttr('disabled');
					$('#departmentId').val('');
					page.editor = ufma.showModal('department-edt', 720, 500);
					page.departmentData = $('#form-department').serializeObject();
					$('#prompt').text('编码规则：' + page.fjfa)
				});

				$('.department-delete').on('click', function(e) {
					ufma.confirm("你确定要删除选中数据吗？", function(action) {
						if(action) {
							page.deleteDepartMent();
						}
					}, {
						type: 'warning'
					});
				});
				$('.department-start').on('click', function(e) {
					page.startDepartMent();
				});
				$('.department-stop').on('click', function(e) {
					page.stopDepartMent();
				});
				$('.department-imp').on('click', function(e) {
					var url = "/ma/general/excel/impEleDatas?eleCode=DEPARTMENT&rgCode=" + ma.rgCode + "&agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear;
					ufma.open({
						title: '部门导入',
						url: '../../pub/impXLS/impXLS.html',
						width: 800,
						height: 400,
						data: {
							eleName: '部门',
							eleCode: 'DEPARTMENT',
							projectName: 'ma', //这里多加了一个参数，用于区分模板所属模块
							rgCode: pfData.svRgCode,
							//agencyCode: $('body').data('code') == 'agy' ? pfData.svAgencyCode : '*',
							agencyCode: $('body').data('code') == 'agy' ? page.agencyCode : '*', //bug79059
							setYear: pfData.svSetYear,
							url: url
						},
						ondestory: function(rst) {
							page.initPage();
						}
					});
				});
				//------------------------------------------
				$('.person-saveadd').on('click', function(e) {
					if(ufma.hasNoError('#form-person')) {
						if($("#cardId").val() == '' || ($("#cardId").val() != '' && $("#cardType").val() != '01')) {
							$(this).attr('disabled', 'disabled');
							$('.person-saveadd').attr('disabled', 'disabled');
							page.savePerson(false);
						} else {
							ufma.showTip("保存失败！请检查输入信息是否正确", function() {}, "error")
						}
					}
				});
				$('.person-save').on('click', function(e) {
					if(ufma.hasNoError('#form-person')) {
						if($("#cardId").val() == '' || ($("#cardId").val() != '' && $("#cardType").val() != '01')) {
							$(this).attr('disabled', 'disabled');
							$('.person-saveadd').attr('disabled', 'disabled');
							page.savePerson(true);
						} else {
							ufma.showTip("保存失败！请检查输入信息是否正确", function() {}, "error")
						}
					}
				});
				$('.personAll-delete').on('click', function(e) {
					ufma.confirm("是否停用关联登录用户？", function(action) {
						if(action) {
							page.sameStepType = true;
							page.deleteAllPerson();
						} else {
							page.sameStepType = false;
							page.deleteAllPerson();
						}
					}, {
						type: 'warning'
					});
				});
				$('.personAll-start').on('click', function(e) {
					ufma.confirm("是否同步修改用户启用状态？", function(action) {
						if(action) {
							page.sameStepType = true;
							page.startPerson();
						} else {
							page.sameStepType = false;
							page.startPerson();
						}
					}, {
						type: 'warning'
					});
				});
				$('.personAll-stop').on('click', function(e) {
					ufma.confirm("是否同步修改用户停用状态？", function(action) {
						if(action) {
							page.sameStepType = true;
							page.stopPerson();
						} else {
							page.sameStepType = false;
							page.stopPerson();
						}
					}, {
						type: 'warning'
					});
				});
				$('.personAll-imp').on('click', function(e) {
					var url = "/ma/general/excel/impEleDatas?eleCode=EMPLOYEE&rgCode=" + ma.rgCode + "&agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear;
					ufma.open({
						title: '部门人员导入',
						url: '../../pub/impXLS/impXLS.html',
						width: 800,
						height: 400,
						data: {
							eleName: '部门人员',
							eleCode: 'EMPLOYEE',
							projectName: 'ma', //这里多加了一个参数，用于区分模板所属模块
							rgCode: pfData.svRgCode,
							//agencyCode: pfData.svAgencyCode,
							agencyCode: page.agencyCode, //bug79059
							setYear: pfData.svSetYear,
							url: url
						},
						ondestory: function(rst) {
							page.initPage();
						}
					});
				});
				$('.person-enabled-search').on('click', function(e) {
					var target = e.currentTarget || e.toElement;
					enabled = target.id;
					page.setButtonDisable(enabled);
					page.newTable();
					//page.depDataTableAll.ajax.url(page.getUrl).load();
				});

				//部门人员名称
				$('#personchrName').on('mouseenter paste keyup', function(e) {
					e.stopepropagation;
					$('#personchrName').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('personchrName', textValue);
				}).on('blur', function() {
					$(this).val($(this).val().replaceAll(/\s+/g, '')) //去除名称中的所有空格
					if($(this).val() == '') {
						ufma.showInputHelp('personchrName', '<span class="error">' + page.getErrMsgPerson(1) + '</span>');
						$('#personchrName').closest('.form-group').addClass('error');
					} else {
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
						ufma.hideInputHelp('field1');
						$('#personchrName').closest('.form-group').removeClass('error');
					}

				});
				//证件号码
				$('#cardId').on('paste keyup', function(e) {
					e.stopepropagation;
					$('#cardId').closest('.form-group').removeClass('error');
					var textValue = $(this).val();
					textValue = "";
					ufma.showInputHelp('cardId', textValue);
					var cardType = $('#cardType').val();
					/*if ($(this).val() == '') {
					    ufma.showInputHelp('cardId', '<span class="error">证件号码不能为空</span>');
					    $('#cardId').closest('.form-group').addClass('error');
					} else */
					if(cardType == null || cardType == undefined || cardType == "01") {
						ufma.showInputHelp('cardId', '<span class="error">请选择证件类型</span>');
						$('#cardId').closest('.form-group').addClass('error');
					} else if(!ufma.checkIdCard($(this).val()) && cardType == "02") {
						ufma.showInputHelp('cardId', '<span class="error">请输入正确的证件号码</span>');
						$('#cardId').closest('.form-group').addClass('error');
					} else {
						$('#cardId').closest('.form-group').removeClass('error');
						ufma.showInputHelp('cardId', "");
					}
				}).on('blur', function() {
					var cardType = $('#cardType').val();
					if($(this).val() == '') {
						$('#cardId').closest('.form-group').removeClass('error');
						ufma.showInputHelp('cardId', "");
						return false;
					}
					/*if ($(this).val() == '') {
					    ufma.showInputHelp('cardId', '<span class="error">证件号码不能为空</span>');
					    $('#cardId').closest('.form-group').addClass('error');
					    return false;
					} else */
					if(cardType == null || cardType == undefined || cardType == "01") {
						ufma.showInputHelp('cardId', '<span class="error">请选择证件类型</span>');
						$('#cardId').closest('.form-group').addClass('error');
						return false;
					} else if(!ufma.checkIdCard($(this).val()) && cardType == "02") {
						ufma.showInputHelp('cardId', '<span class="error">请输入正确的证件号码</span>');
						$('#cardId').closest('.form-group').addClass('error');
						return false;
					} else {
						$('#cardId').closest('.form-group').removeClass('error');
						ufma.showInputHelp('cardId', "");
					}
					if(cardType == "02") {
						var birthday = $('#cardId').val();
						birthday = birthday.substr(6, 4) + '-' + birthday.substr(10, 2) + '-' + birthday.substr(12, 2);
						$('#barthDate').getObj().setValue(birthday);
					}
				});

				//下发
				$('#depEmpBtnDown').on('click', function(e) {
					e.stopPropagation();
					var gnflData = page.getCheckedRows();

					if(gnflData.length == 0) {
						ufma.alert('请选择需要下发的行！');
						return false;
					};
					page.modal = ufma.selectBaseTree({
						url: '/ma/sys/eleAgency/getAgencyTree' + "&ajax=" + 1,
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
								action: function(data) {
									if(data.length == 0) {
										ufma.alert('请选择单位！');
										return false;
									}
									acctAlldata = data;
									/*var dwCode = [];
									for(var i = 0; i < data.length; i++) {
										if(!data[i].isParent) {
											dwCode.push(data[i].id);
										}
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
									var url = '/ma/sys/eleEmplyee/issue';
									var argu = {
										'chrCodes': gnflData,
										'toAgencyCodes': dwCode,
										'tableName': "MA_ELE_EMPLOYEE"
									};
									//bug76584--zsj--经侯总确定加此类进度条
									ufma.showloading('数据下发中，请耐心等待...');
									var callback = function(result) {
										ufma.hideloading();
										//经海哥确认将所有信息显示在表格中--zsj
										//ufma.showTip(result.msg, function() {}, result.flag);
										page.modal.close();
										page.depaction = ""
										page.issueTips(result);
									};
									ufma.post(url, argu, callback);
								}
							},
							'取消': {
								class: 'btn-default',
								action: function() {
									page.modal.close();
									page.depaction = ""
								}
							}
						}
					});
				});
				var heightBox = $('.deparmentTree').height()
				$(window).scroll(function(event) {
					var top = $('.depar-tool').height() + $('.de-box-top').height() - $(this).scrollTop()
					if($(this).scrollTop() > 56) {
						top = $(this).scrollTop() - 56
					} else {
						top = 0
					}
					var boxHerght = heightBox + $(this).scrollTop()
					if($(this).scrollTop() > 56) {
						boxHerght = heightBox + 56
					}
					document.getElementsByClassName('deparmentTree')[0].style.height = boxHerght + 'px';
					$('#scrollBox').css({
						"top": top + 'px'
					})
				});
			},
			//初始化单位
			initAgency: function() {
				page.cbAgency = $("#cbAgency").ufmaTreecombox2({
					url: "/ma/sys/eleAgency/getAgencyTree?rgCode=" + ma.rgCode + '&setYear=' + ma.setYear,
					leafRequire: false,
					onchange: function(data) {
						page.agencyCode = data.code;
						page.agencyName = data.name;
						if(data.isLeaf == '0') {
							//非末级单位不显示账套选择框
							$("#cbAcct").hide();
							page.acctFlag = false;
						} else {
							$("#cbAcct").show();
							page.acctFlag = true;
						}
						//page.getUrl = "/ma/sys/eleEmplyee/select?agencyCode=" + page.agencyCode + "&setYear=" + ma.setYear;
						//page.treeUrl = "/ma/sys/department/getDepTree?agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear + "&rgCode=" + ma.rgCode;
						//page.newTable();
						//page.initTree();
						page.initNationCode();
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
						page.initfifa();
						//缓存单位账套
						var params = {
							selAgecncyCode: page.agencyCode,
							selAgecncyName: page.agencyName,
							//selAcctCode: page.acctCode,
							//selAcctName: page.acctName
						}
						ufma.setSelectedVar(params);
					},
					initComplete: function(sender) {
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
			//初始化账套
			initAcctScc: function() {
				page.cbAcct = $("#cbAcct").ufmaTreecombox2({
					valueField: 'code',
					textField: 'codeName',
					placeholder: '请选择账套',
					icon: 'icon-book',
					onchange: function(data) {
						page.acctCode = data.code;
						page.acctName = data.name;
						page.accsCode = data.accsCode;
						page.accsName = data.accsName;
						$("label.mt-checkbox").find('input[type="checkbox"]').prop("checked", false);
						page.getUrl = "/ma/sys/eleEmplyee/select?agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear;
						page.newTable();
						page.treeUrl = "/ma/sys/department/getDepTree?agencyCode=" + page.agencyCode + "&acctCode=" + page.acctCode + "&setYear=" + ma.setYear;
						page.initTree();
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
				});
			},
			init: function() {
				var pfData = ufma.getCommonData();
				page.reslist = ufma.getPermission();
				var data = page.reslist;
				if(data != null) {
					for(var i = 0; i < data.length; i++) {
						if(data[i].id == 'department-edit') {
							if(data[i].flag == "0") {
								page.isEdit = false;
							} else {
								page.isEdit = true;
							}
						}
					}
				}
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.acctCode = pfData.svAcctCode;
				page.acctName = pfData.svAcctName;
				page.depTable = $('#departtable');
				page.depThead = $('#departthead');
				if($('body').data("code")) {
					page.initAgency();
					page.baseUrl = '/ma/sys/';
				} else {
					page.agencyCode = "*";
					page.baseUrl = '/ma/sys/';
					page.getUrl = "/ma/sys/eleEmplyee/select?agencyCode=*&acctCode=*&setYear=" + ma.setYear;
					page.treeUrl = "/ma/sys/department/getDepTree?agencyCode=*&acctCode=*&setYear=" + ma.setYear + "&rgCode=" + ma.rgCode;
					page.newTable();
					page.initPage();
					page.initNationCode();
					// $("#departmentCode").ufmaTreecombox({
					// 	valueField: 'id',
					// 	textField: 'codeName',
					// 	placeholder: '请选择部门',
					// 	url: page.treeUrl,
					// 	onchange: function (data) {
					// 		page.deparmentId = data.id;
					// 	}
					// });
					//this.onEventListener();
					page.initfifa();
				}
				page.departmentCodeTree();
				ufma.comboxInit('departmentCode');
				// ufma.getEleCtrlLevel("/ma/sys/eleEmplyee/queryCtrlLevel", function(result) {
				// 	$('.table-sub-info').text(result);
				// });
				ufma.parse(page.namespace);
				// page.initPage();
				//				reqFieldList(page.agencyCode, 'EMPLOYEE');
        //reqFieldList(page.agencyCode, 'DEPARTMENT','dfield');
        //CWYXM-20878 --部门人员新增部门没反应--window.onload没有重复加载，导致没有执行onEventListener，所以事件监听无效弹窗不弹出--zsj
        page.onEventListener();
				window.onload = function() {
					//实在找不到原因，ufma-combox-popup默认不显示
					setTimeout(function() {
						$('.ufma-combox-popup').css({
							'display': 'none'
						});
					}, 600);
				}
				ufma.parseScroll();
				$('.deparmentTree').height($(window).height() - 194)
				$('#scrollBox').css({
					'position': 'absolute',
					'top': '0',
					'left': '0'
				})
			}

		}
	}();

	page.init();
});