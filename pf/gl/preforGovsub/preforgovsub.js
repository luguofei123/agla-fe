$(function() {
	var page = function() {
		var ptData = {};
		var agencyCode = '';
		var acctCode = '';
		var oTable;
		//应付政府补贴备查簿
		return {
			initAgencyScc: function() {
				ufma.showloading('正在加载数据，请耐心等待...');
				//取单位数据
				var arguAge = {
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				}
				dm.doGet("agency", arguAge, function(result) {
					//dm.doGet("agency","",function (result) {
					$('#cbAgency').ufTreecombox({
						// url: dm.getCtrl('agency'),
						idField: 'id', //可选
						textField: 'codeName', //可选
						pIdField: 'pId', //可选
						placeholder: '请选择单位',
						readonly: false,
						icon: 'icon-unit',
						theme: 'label',
						leafRequire: true,
						data: result.data,
						onChange: function(sender, treeNode) {
							//缓存单位账套
							var params = {
								selAgecncyCode: treeNode.code,
								selAgecncyName: treeNode.name,
							}
							ufma.setSelectedVar(params);
							agencyCode = $('#cbAgency').getObj().getValue();
							var argu = {
								agencyCode: agencyCode,
								setYear: ptData.svSetYear
							}
							var url = dm.getCtrl('acct'); //+ agencyCode;
							callback = function(result) {
								$("#cbAcct").getObj().load(result.data);
							}
							ufma.get(url, argu, callback);
							//补贴种类
							dm.btzl({
								agencyCode: agencyCode
							}, function(result) {
								$('#btzlCode').ufTreecombox({
									idField: "id",
									textField: "codeName",
									readonly: false,
									placeholder: '请选择补贴种类',
									leafRequire: true,
									data: result.data,
									onComplete: function(sender) {
										var timeId = setTimeout(function() {
											$('#btnQuery').trigger('click');
											clearTimeout(timeId);
										}, 300);
									}
								});
								$('#btzlCode').getObj().val('001');
							});
						},
						onComplete: function(sender) {
							if(ptData.svAgencyCode) {
								$('#cbAgency').getObj().val(ptData.svAgencyCode);
							} else {
								$('#cbAgency').getObj().val('1');
							}
							ufma.hideloading();
						}
					});
				})

			},
			//初始化table
			initGrid: function(id, data, colArr) {
				var columns = [{
						//checkBox的选框   check-all
						title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
							'class="datatable-group-checkable" name="allCheck" id="checkAllHead" /> &nbsp;<span></span> </label>',
						data: "subsidyGuid", //主键
						className: 'tc nowrap',
						width: 30
					},
					{
						title: "补贴种类",
						data: "btzlName",
						className: 'nowrap isprint',
						render: function(data, type, rowdata, meta) {
							if(!rowdata.subsidyGuid) return '';
							return data;
						}
					},
					{
						title: "接受者类型",
						data: "subsidyPersonTypeName",
						className: 'nowrap isprint' //不换行
					},
					{
						title: "接受者名称",
						data: "subsidyPersonName",
						className: 'nowrap isprint'
					},
					{
						title: "接受者身份代码",
						data: 'subsidyPersonIdentity',
						className: 'nowrap isprint',
						render: function(data) {
							if(data == '' || data == null) {
								return '';
							} else {
								return '<div style="text-align: right">' + data + '</div>'
							}
						}
					},
					{
						title: "补贴日期",
						data: 'subsidyDate',
						className: 'nowrap isprint',
						width: 80,
						render: function(data) {
							if(data == '' || data == null) {
								return '';
							} else {
								return '<div style="text-align: right">' + data + '</div>'
							}
						}
					},
					{
						title: "补贴金额",
						data: "subsidyMoney",
						className: 'tr nowrap isprint tdNum',
						/*render: function(data) {
							var val = $.formatMoney(data);
							return val == '0.00' ? '' : val;
						}*/
						render: $.fn.dataTable.render.number(',', '.', 2, '')
					},
					{
						title: "操作",
						data: "opt",
						width: 30,
						className: 'nowrap', //data.subsidyGuid
						render: function(rowid, rowdata, data, meta) {
							if(data == '' || data == null) {
								return '';
							} else {
								return '<a class="btn btn-icon-only btn-sm btn-permission icon-edit btn-edit" data-toggle="tooltip" rowindex="' + meta.row + '" title="修改"></a>' +
									'<a class="btn btn-icon-only btn-sm btn-permission btn-delete btn-del icon-trash" data-toggle="tooltip" rowindex="' + meta.row + '" title="删除"></a>';
							}

						}
					}
				];
				var tableId = 'gridGov';
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
					//填充表格数据
					data: [],
					"dom": '<"datatable-toolbar"B>rt<"' + tableId + '-paginate"ilp>',
					buttons: [{
							extend: 'print',
							text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
							exportOptions: {
								columns: [1, 2, 3, 4, 5, 6]
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
								columns: [1, 2, 3, 4, 5, 6]
							},
							customize: function(xlsx) {
								var sheet = xlsx.xl.worksheets['sheet1.xml'];
							}
						}
					],
					initComplete: function(settings, json) {
						$("#dtToolbar .buttons-print").css("border-radius", "4px 0 0 4px").addClass("btn-print btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "打印"
						});
						$("#dtToolbar .buttons-excel").css("border-radius", "0 4px 4px 0").addClass("btn-export btn-permission").attr({
							"data-toggle": "tooltip",
							"title": "导出"
						});
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('[data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						//导出begin
						$("#dtToolbar .buttons-excel").off().on('click', function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							ufma.expXLSForDatatable($('#gridGov'), '应付政府补贴备查簿');
						});
						//导出end
					},
					drawCallback: function(settings) {
						$('#gridGov').find("td.dataTables_empty").text("")
							.append('<img class="no-print" src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
						$(".tableBox").css({
							"overflow-x": "scroll"
						});
						ufma.isShow(page.reslist);
					},
					"columnDefs": [{
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap no-print",
						"render": function(data, type, rowdata, meta) {
							return '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input  name="allCheck"  type="checkbox" class="check-all" value="' + data + '" data-code="' + rowdata.chrCode + '"/> &nbsp;<span></span> </label>';
						}
					}]
				});
			},
			//删除批量操作
			delRow: function(tag, idArray, $tr) {
				var url = dm.getCtrl('deleteAll');
				var argu = {
					ids: idArray
				};
				var callback = function(result) {
					if($tr) {
						$tr.remove();
					} else {
						page.initGrid();
					}
					if(result.flag == 'success') {
						ufma.showTip(result.msg, function() {}, 'success');
						$('#btnQuery').trigger('click');
						$("#btnAll").attr("checked", false);
						$("#checkAllHead").attr("checked", false);
					}
				};
				ufma.confirm('您确定要删除选中的这些数据吗？', function(action) {
					if(action) {
						ufma.delete(url, argu, callback);
					}
				}, {
					type: 'warning'
				});
			},
			getCheckedRows: function() {
				var checkedArray = [];
				$('#gridGov .check-all:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			//获取数据
			loadGrid: function() {
				var argu = $('#frmQuery').serializeObject();
				argu = $.extend(argu, {
					agencyCode: $('#cbAgency').getObj().getValue(),
					acctCode: $('#cbAcct').getObj().getValue(),
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode
				});
				dm.loadGridData(argu, function(result) {
					oTable.fnClearTable();
					if(result.data.length != 0) {
						oTable.fnAddData(result.data, true);
					}
					ufma.setBarPos($(window));
				})
			},
			//监听
			onEventListener: function() {
				//绑定loadGrid
				$('#btnQuery').on('click', function() {
					var minm = $('#minSubsidyMoney').val().replace(/,/g, "");
					var maxm = $('#maxSubsidyMoney').val().replace(/,/g, "");
					//判断起始金额是否大于结束金额
					if(minm !== '' || minm !== null) {
						if(maxm !== '' || maxm !== null) {
							if(minm > maxm) {
								ufma.showTip('起始金额大于结束金额！', function(action) {}, 'warning');
								$('#maxSubsidyMoney').val("");
								$('#minSubsidyMoney').val("");
							}
						}
					}
					if($('#minSubsidyDate').getObj().getValue() > $('#maxSubsidyDate').getObj().getValue()) {
						ufma.showTip('开始日期不能大于结束日期！', function() {}, 'error');
						return false;
					}
					page.loadGrid();
					ufma.setBarPos($(window));
				});

				//登记弹出层相关 -begin
				$('#btnBookin').click(function() {
					ufma.open({
						url: 'pfgsBookin.html',
						title: '应付政府补贴备查登记',
						width: 726,
						height: 428,
						data: {
							agencyCode: $("#cbAgency").getObj().getValue(),
							acctCode: $("#cbAcct").getObj().getValue(),
							setYear: ptData.svSetYear,
							rgCode: ptData.svRgCode,
							dateTime: ptData.svTransDate //bug79086--zsj
						},
						ondestory: function(action) {
							if(action) {
								$('#btnQuery').trigger('click');
							}
						}
					});
				});

				$('.btn-delete').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.showTip('暂无可删除数据！', function() {
							if($('#btnAll').prop('checked')) {
								$('#btnAll').trigger('click');
							}

						}, "warning");
						return false;
					}
					page.delRow('deleteAll', checkedRow);
				});
				$('#gridGov').on('click', 'tbody td:not(.btnGroup)', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr'); //遍历tr
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $input.val();
					if($tr.hasClass("selected")) {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).removeClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", false);
							}
						})
					} else {
						$ele.parents("tbody").find("tr").each(function() {
							var thisCode = $(this).find('input[type="checkbox"]').val();
							if(thisCode.substring(0, code.length) == code) {
								$(this).addClass("selected");
								$(this).find('input[type="checkbox"]').prop("checked", true);
							}
						})
					}
				});
				//登记弹出层相关 -end
				//搜索框
				ufma.searchHideShow($('#gridGov'));
				//编辑弹出层、删除行数据-begin
				$(document).on('click', function(e) {
					var rowIndex = $(e.target).attr('rowindex');
					if(!rowIndex) {
						return null;
					}
					var rowData = {};
					var url = '';
					var title = '';
					if($(e.target).is('.btn-edit')) {
						rowData = oTable.api(false).rows(rowIndex).data()[0];
						var title = '应付政府补贴备查登记';
						url = 'pfgsBookin.html';
						ufma.open({
							url: url,
							title: title,
							width: 726,
							height: 428,
							data: {
								agencyCode: $("#cbAgency").getObj().getValue(),
								acctCode: $("#cbAcct").getObj().getValue(),
								setYear: ptData.svSetYear,
								rgCode: ptData.svRgCode,
								rowData: rowData
							},
							ondestory: function(action) {
								if(action) {
									$('#btnQuery').trigger('click');
								}
							}
						});
					} else if($(e.target).is('.btn-del')) {
						//删除一行数据
						var nTr = $(e.target).closest('tr');
						rowData = oTable.api(false).rows(rowIndex).data()[0];
						var argu = rowData.subsidyGuid;
						ufma.confirm("您确认删除数据库里的这些数据吗？", function(action) {
							if(action) {
								dm.doDel('deleteOne', {
									subsidyGuid: rowData.subsidyGuid
								}, function(result) {
									ufma.showTip(result.msg, function() {}, 'success');
									$('#btnQuery').trigger('click');
								});
							}
						}, {
							type: 'warning'
						});
					}
				});
				//编辑弹出层、删除行数据-end
				//表格相关-begin
				//日历
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(ptData.svTransDate) //bug79086--zsj
				});

				//全选			
				$(".checkAll").on("click", function() {
					var flag = $(this).prop("checked");
					$("#gridGov").find('input.check-all').prop('checked', flag);
					$("#checkAllHead").prop('checked', flag);
				});
				$("#gridGov thead").on("click", 'input.check-all', function() {
					$(".checkAll").trigger('click');
				});
				$("body").on("change", 'input.check-all', function() {
					var flag = $(this).prop("checked");
					var num = 0;
					var arr = document.querySelectorAll('.check-all');
					for(var i = 0; i < arr.length; i++) {
						if(arr[i].checked) {
							num++;
						}
					}
					if(num == arr.length) {
						$(".checkAll").prop('checked', true);
						$("#checkAllHead").prop('checked', true);
					} else {
						$(".checkAll").prop('checked', false);
						$("#checkAllHead").prop('checked', false);
					}
				});
				$("body").on("click", '#checkAllHead', function() {
					var flag = $(this).prop("checked");
					$("#gridGov").find('input.check-all').prop('checked', flag);
					$(".checkAll").prop('checked', flag);
				});
				//表格相关-end
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				$("#cbAcct").ufCombox({ //修改多区划
					/*idField: 'CHR_CODE',
					textField: 'CODE_NAME',*/
					idField: 'code',
					textField: 'codeName',
					readonly: false,
					placeholder: '请选择账套',
					icon: 'icon-book',
					theme: 'label',
					onChange: function(sender, data) {
						//缓存单位账套
						var params = {
							selAgecncyCode: $('#cbAgency').getObj().getValue(),
							selAgecncyName: $('#cbAgency').getObj().getText(),
							selAcctCode: data.code,
							selAcctName: data.name
						}
						ufma.setSelectedVar(params);
					},
					onComplete: function(sender) {
						if(ptData.svAcctCode) { //如果有缓存的账套，就赋值
							$("#cbAcct").getObj().val(ptData.svAcctCode);
						} else {
							$('#cbAcct').getObj().val('1');
						}
						ufma.hideloading();
					}
				});
				this.initAgencyScc();
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					initialDate: new Date(ptData.svTransDate) //bug79086--zsj
				});
				//$('#minSubsidyMoney,#maxSubsidyMoney').amtInput();
				$('#minSubsidyMoney,#maxSubsidyMoney').amtInputNull();
				$('#minSubsidyDate').intInput();
				$('#maxSubsidyDate').intInput();
				page.initGrid();
			},
			init: function() {
				//获取session
				ptData = ufma.getCommonData(); //平台的缓存数据
				this.initPage();
				this.onEventListener();
				ufma.parse();
				ufma.parseScroll();
			}
		}
	}();
	page.init();
});