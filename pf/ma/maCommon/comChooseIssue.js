$(function () {
	var page = function () {
		var ptData = {};
		var oTable;
		var globalData = window.ownerData;
		window._close = function (result, flag) {
			if (window.closeOwner) {
				var data = {
					action: flag,
					data: result
				};
				window.closeOwner(data);
			}
		}
		return {
			initGridDPE: function () {
				var tableId = 'tableChoose';
				var columns = [{
					//checkBox的选框   check-all
					title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
						'class="datatable-group-checkable" name="allCheck" id="checkAllHead" /> &nbsp;<span></span> </label>',
					data: "code", //主键
					className: 'tc nowrap',
					width: 30
				},
				{
					title: globalData.pageName + "编码",
					data: "code"
				},
				{
					title: globalData.pageName + "名称",
					data: "codeName",
					className: "commonShow",
					render: function (data) {
						if (!$.isNull(data)) {
							return '<span title="' + data + '">' + data + '</span>';
						} else {
							return '';
						}

					}
				},
				{
					title: "状态",
					className: "tc",
					data: "enabled"
				}
				];
				if (globalData.eleCode == 'EXPFUNC') {
					//若为支出功能分类界面，可以动态添加此列
					columns.push({
						title: "预算体系",
						data: "bgttypeName",
						className: "commonShow",
						render: function (data) {
							if (!$.isNull(data)) {
								return '<span title="' + data + '">' + data + '</span>';
							} else {
								return '';
							}

						}
					});
				}
				oTable = $("#" + tableId).dataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					//"bFilter": true,
					"autoWidth": false,
					"bDestory": true,
					"processing": true, //显示正在加载中
					"pagingType": "full_numbers", //分页样式
					"lengthChange": true, //是否允许用户自定义显示数量p
					"lengthMenu": [
						[20, 50, 100, 200, -1],
						[20, 50, 100, 200, "全部"]
					],
					//"pageLength": 100, //默认每页显示100条--zsj--吉林公安需求
					"pageLength": ufma.dtPageLength("#" + tableId),
					"serverSide": false,
					"ordering": false,
					columns: columns,
					"columnDefs": [{
						"targets": [0], //第一列
						"serchable": false,
						"orderable": false,
						"className": "nowrap no-print",
						"render": function (data, type, rowdata, meta) {
							return "<label class='mt-checkbox mt-checkbox-single mt-checkbox-outline'> <input type='checkbox' class='check-all' rowIndex='" + meta.row + "' value='" + rowdata.code + "' /> &nbsp;<span></span> </label>";
						}
					},
					{
						"targets": [3],
						"render": function (data, type, rowdata, meta) {
							if (rowdata.enabled == 1) {
								return '<span style="color:#00A854">启用</span>';
							} else {
								return '<span style="color:#F04134">停用</span>';
							}
						}
					}
					],
					data: [],
					"dom": '<"datatable-toolbar">rt<"' + tableId + '-paginate"ilp>',
					initComplete: function (settings, json) {
						$('.datatable-toolbar').appendTo('#dtToolbar');
						var toolBar = $(this).attr('tool-bar')
						var $info = $(toolBar + ' .info');
						if ($info.length == 0) {
							$info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
						}
						$info.html('');
						$('.' + tableId + '-paginate').appendTo($info);
						$('[data-toggle="tooltip"]').tooltip();
						ufma.isShow(page.reslist);
						//固定表头
						$("#tableChoose").fixedTableHead();
					},
					"drawCallback": function (settings) {
						$("#tableChoose input.check-all").prop("checked", false);
						$("#checkAllHead").prop("checked", false);
						ufma.isShow(page.reslist);
						$("#checkAllHead").prop("checked", false);
						$("#checkAllHead").on('change', function () {
							var t = $(this).is(":checked");
							$('#' + tableId).find('.check-all').each(function () {
								t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
								t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
							});
							$("#checkAllHead").prop("checked", t);
						});
						$("#tableChoose").fixedTableHead();
					}
				});
				//oTable = $("#" + tableId).dataTable(opts);
			},
			loadGridDPE: function () {
				var url = globalData.getUrl;
				var argu = {
					rgCode: globalData.rgCode,
					setYear: globalData.setYear,
					agencyCode: globalData.agencyCode,
					acctCode: globalData.acctCode,
					eleCode: globalData.eleCode,
					bgttypeCode: globalData.bgttypeCode
				}
				ufma.get(url, argu, function (result) {
					oTable.fnClearTable();
					if (result.data.length > 0) {
						globalData.issueAgecyCode = result.data[0].agencyCode;
						oTable.fnAddData(result.data, true);
					}
					$('#tableChoose').closest('.dataTables_wrapper').ufScrollBar({
						hScrollbar: true,
						mousewheel: false
					});
					// ufma.setBarPos($(window));
					//选用界面的tool-bar动态定位--zsj
					var toobar = $('#comChoose-tool-bar').position().top; //357px
					if (toobar > 332) {
						$('#comChoose-tool-bar').css({
							'top': "332px",
							"width": "992px",
							"position": "absolute"
						})
					}
				});
			},
			getChooseCheckedRows: function () {
				var checkedArray = [];
				$('#tableChoose .check-all:checked').each(function () {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			onEventListener: function () {
				$(".rpt-table-tab").scroll(function () {
					if (!$.isNull($(this).find("thead").offset())) {
						var headTop = $(this).find("thead").offset().top;
						if ($(".rpt-table-tab").scrollTop() >= headTop) {
							$(".headFixedDiv").removeClass("hidden");
							$(".headFixedDiv").css({
								"top": "48px",
								"left": "15px"
							})
						} else {
							$(".headFixedDiv").addClass("hidden")
						}
					}

				});

				$("body").on("change", 'input.check-all', function (e) {
					e.preventDefault();
					var $ele = $(e.target);
					var $tr = $ele.closest('tr');
					var $input = $ele.closest('tr').find('input[type="checkbox"]');
					var code = $(this).attr('value');
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
					$("#checkAllHead").attr('checked', t).prop('checked', t)
				});
				//全选
				/*$("body").on("click", '#checkAllHead', function() {
					var flag = $(this).prop("checked");
					if(flag == false){
						$('#tableChoose tbody tr').removeClass('selected'); 
					}
					$("#tableChoose").find('input.check-all').prop('checked', flag);
				});*/
				$('#btnClose').click(function () {
					_close();
				});
				ma.searchHideShow('choose-search', '#tableChoose', 'searchHideChooseBtn');
				//选用
				$('.btn-agyChoose').on('click', function (e) {
					var checkRow = page.getChooseCheckedRows();
					if (!$.isNull(checkRow) && checkRow.length == 0) {
						ufma.showTip('请选择' + globalData.pageName, function () {
							return false;
						}, 'warning');
					} else {
						var toAgencyAcctList = [];
						toAgencyAcctList.push({
							toAgencyCode: globalData.agencyCode,
							toAcctCode: globalData.acctCode
						});
						var argu = {
							"chrCodes": checkRow,
							"toAgencyAcctList": toAgencyAcctList,
							"agencyCode": globalData.issueAgecyCode,
							"eleCode": globalData.eleCode,
							"rgCode": globalData.rgCode,
							"setYear": globalData.setYear
						};
						var url = globalData.useUrl;
						ufma.post(url, argu, function (result) {
							_close(result.data, true);
						});
					}

				});
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initGridDPE();
				page.loadGridDPE();
			},

			init: function () {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				ufma.parse();
				//guohx 20200304 注释掉 解决选用界面在火狐浏览器，下面的工具栏会重新定位，因为该方法里面走了ufma.setBarPos() --CWYXM-12206 
				// ufma.parseScroll(); 
			}
		}
	}();

	page.init();

	function stopPropagation(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	}
});