$(function() {
	//获取session
	var ptData = ufma.getCommonData();
	var user = "";
	var treeObj;
	var page = function() {
		var agencyCode = '',
			acctCode = '';
		var oTable;
		return {
			//初始化单位
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				dm.doGet("agency", arguAge, function(result) {
					// dm.doGet("agency","",function (result) {
					$('#cbAgency').ufTreecombox({
						// url: dm.getCtrl('agency'),
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						placeholder: '请选择单位',
						icon: 'icon-unit',
						theme: 'label',
						readonly: false,
						leafRequire: true,
						data: result.data,
						onChange: function(sender, treeNode) {
							agencyCode = $('#cbAgency').getObj().getValue();
							page.agencyCode = agencyCode;

							//账套
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear
							}
							var url = dm.getCtrl('acct'); //+ agencyCode;
							var callback = function(result) {
								ufma.hideloading();
								if(result.data.length == 0) {
									ufma.showTip("该单位下没有账套，请重新选择单位！", function() {

									}, "warning");
									return false;
								}
								$("#cbAcct").getObj().load(result.data);
							};
							ufma.get(url, argu, callback);
						},
						onComplete: function(sender) {
							if(ptData.svAgencyCode) {
								$('#cbAgency').getObj().val(ptData.svAgencyCode);
							} else {
								$('#cbAgency').getObj().val('1');
							}
						}
					});
				})

				//page.cbAgency.select(1);
			},
			//初始化账套
			initAcct: function() {
				$("#cbAcct").ufCombox({
					idField: 'code', //多区划
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(data) {
						$('#frmQuery').setForm({});
						page.loadMainTable();
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
			//初始化主表
			initMainTable: function() {
				var columns = [{
					 title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                     '<input type="checkbox" onchange="checkAll(this)" class="datatable-group-checkable"/>&nbsp;' +
                     '<span></span> ' +
                     '</label>',
						data: "descptGuid",
						className: 'tc nowrap no-print',
						width: 30
					},
					{
						title: "摘要",
						data: "descName",
						className: 'nowrap isprint'
					},
					{
						title: "使用次数",
						data: "useCount",
						className: 'nowrap tr isprint',
						width: 160
					},
					{
						title: "操作",
						data: "opt",
						className: 'nowrap tc',
						width: 200,
						render: function(data, type, rowdata, meta) {
							return '<a class="btn btn-icon-only btn-sm btn-permission icon-edit btn-edit" data-toggle="tooltip" action= "edit" title="编辑" desc="'+rowdata.descName+'" data="'+rowdata.descptGuid+'">'+
							'<a class="btn btn-icon-only btn-sm btn-permission icon-trash btn-del" data-toggle="tooltip" action= "del" title="删除" data="'+rowdata.descptGuid+'">';
						}
					}
				];
				var tableId = 'gridNotes';

				oTable = $("#" + tableId).dataTable({
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
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
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
								columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar');
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						ufma.isShow(page.reslist);
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
							ufma.expXLSForDatatable($('#gridNotes'), '常用摘要');
						});
						//导出end
					},
					"drawCallback": function(settings) {
						$('#gridNotes').find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						
						$("#gridNotes .btn-del").on("click",function(){
    						page._self = $(this);
    					});
						
						$(".btn-edit").on("click", function() {
							$('#form').find('.form-group').each(function() {
								$(this).removeClass('error');
								$(this).find(".input-help-block").remove();
							});
							$("#vouDescAddLabel").html("修改常用摘要");
							$("#vouDesc-edt").modal('show');
							$("#form").find("input[name='descptGuid']").val($(this).attr("data"));
							$("#form").find("input[name='descName']").val($(this).attr("desc"));
						});
						
						$('#gridNotes .btn-del').ufTooltip({
    		                content: '您确定删除当前摘要吗？',
    		                onYes: function () {
    		                	var data = $(page._self).attr("data");
    							if ($.isNull(data)) {
    								return;
    							}
    							var arr = [];
    							arr.push(data);
    							var url = "/gl/vouDesc/deleteVouDesc/";
    							ufma.delete(url, arr, function (result) {
    								if(result.flag == 'success'){
    		                            ufma.showTip("删除成功","",'success');
    		                        }
    								page.loadMainTable();
    					        });
    		                },
    		                onNo: function () {
    		                }
    	                });
						
						ufma.isShow(page.reslist);
					},
					"columnDefs": [{ //对列进行特殊操作---》适用于checkBox
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap no-print",
						"render": function(data, type, rowdata, meta) {
							return '<div class="checkdiv">' +
                            '</div><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
                            '<input type="checkbox" class="checkboxes" desc="'+rowdata.descName+'" data="' + data + '" />&nbsp; ' +
                            '<span></span> ' +
                            '</label>';
						}
					}]
				});
			},
			//条件查询
			loadMainTable: function() {
				ufma.showloading('正在加载数据，请耐心等待...');

				var argu = $('#frmQuery').serializeObject();
				var argu1 = {};
				argu = $.extend(argu, argu1, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				});

				var callback = function(result) {
					ufma.hideloading();
					// $("#gridNotes_wrapper").ufScrollBar('destroy');
					oTable.fnClearTable();
					if(result.data && result.data.length > 0) {
						oTable.fnAddData(result.data, true);
					}

					//表格模拟滚动条
					ufma.setBarPos($(window));
				};
				
				//ufma.ajax("/gl/vou/selDesc/" + $('#cbAgency').getObj().getValue() + "/" + $('#cbAcct').getObj().getValue(), "get",'',callback);
				ufma.get("/gl/vouDesc/selectVouDescList", argu, callback);
			},
			clearmodel: function() {
				$("#form").find("input[name='descName']").val("");
				$("#form").find("input[name='descptGuid']").val("");
			},
			onEventListener: function() {
				//点击“查询”事件
				$('#btnQuery').click(function() {
					page.loadMainTable();
				});
				
				//点击仅显示自己编制的凭证，制单人输入用户名称同时不可录入
				$("#vbShowOwn").on("change", function () {
					if ($(this).prop("checked") === true) {
						$("#vbInputor").val(user);
						$("#vbInputor").prop("disabled", true);
					} else {
						$("#vbInputor").val("");
						$("#vbInputor").prop("disabled", false);
					}
				});
				
				$("#vb-delete-more").on("click",function(){
					ufma.confirm("确定删除选中的摘要吗？",function(action){
						if(action){
							var $obj = $("#gridNotes").find("input[type='checkbox']:checked");
							if($obj.length <= 0){
								ufma.showTip("请选择一个摘要，谢谢！");
								return;
							}
							var arr = [];
							$("#gridNotes").find("input[type='checkbox']:checked").each(function(){
								var id = $(this).attr("data");
								if ($.isNull(id)) {
									return true;
								}
								arr.push(id);
							});
							var url = "/gl/vouDesc/deleteVouDesc";
							ufma.delete(url, arr, function (result) {
								if(result.flag == 'success'){
			                        ufma.showTip("删除成功","",'success');
			                    }
								page.loadMainTable();
					        });
						}
					});
				});
				
				$("#btn-add").on("click", function() {
					page.clearmodel();
					$("#vouDescAddLabel").html("新增常用摘要");

					$('#form').find('.form-group').each(function() {
						$(this).removeClass('error');
						$(this).find(".input-help-block").remove();
					});
					$("#vouDesc-edt").modal('show')
				});
				
				$("#btn-close").on("click", function() {
					page.clearmodel();
					$("#vouDesc-edt").modal('hide');
				});
				
				$("#btn-save").on("click", function() {
					var postSet = $("#form").serializeObject();
					//保存前校验
					if(postSet.descName == "") {
						ufma.showInputHelp('descName', '<span class="error"> 摘要不能为空 </span>');
						$('#descName').closest('.form-group').addClass('error');
						return false;
					}
					
					postSet.agencyCode = $('#cbAgency').getObj().getValue();
					postSet.acctCode = $('#cbAcct').getObj().getValue();
					postSet.setYear = ptData.svSetYear;
					postSet.rgCode = ptData.svRgCode;
					var url = '/gl/vouDesc/saveVouDesc';
					var callback = function(result) {
						ufma.showTip(result.msg, '', result.flag);
						page.clearmodel();
						$("#vouDesc-edt").modal('hide');
						page.loadMainTable();
					};
					ufma.post(url, postSet, callback);
				});
			},
			//初始化页面
			initPage: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//初始化账套
				page.initAcct();
				this.initAgencyScc();
				page.initMainTable();
				user = ptData.svUserName;
				$("input").attr("autocomplete", "off");
			},

			init: function() {
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();

	page.init();
});

function checkAll(obj) {
	var isCorrect = $(obj).is(":checked");
    $(".checkboxes").each(function () {
        isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
        isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
    });
    $(".datatable-group-checkable").prop("checked", isCorrect);
}