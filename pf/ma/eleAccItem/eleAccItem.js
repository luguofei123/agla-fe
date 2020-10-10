$(function () {
	var page = function () {
		var baseUrl, accItemTable;
		var agencyCode;
		return {
			get: function (tag) {
				return $('#' + this.namespace + ' ' + tag);
			},
			namespace: "eleAccItem",
			getInterface: function (action) {
				var urls = {
					get: {
						type: "get",
						url: baseUrl + "eleAccItem/select"
					}
				}
				return urls[action];
			},
			getEleAccItem: function (pageNum, pageLen) {
				var argu = "";
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function (result) {
					var id = "eleAccItem-data";
					var toolBar = $('#eleAccItem-data').attr('tool-bar');
					var newData = result.data;
					for (var i = 0; i < newData.length; i++) {
						if (newData[i].eleMentName == "币种") {
							newData.remove(newData[i]);
						}
					}
					page.accItemTable = $('#eleAccItem-data').DataTable({
						language: {
							"url": bootPath + "agla-trd/datatables/datatable.default.js"
						},
						data: newData,
						"bFilter": false, //去掉搜索框
						"bLengthChange": false, //去掉每页显示多少条数据
						"processing": true, //显示正在加载中
						/* "pagingType": "full_numbers", //分页样式
						 "lengthChange": true, //是否允许用户自定义显示数量p
						 "lengthMenu": [
						     [20, 50, 100, 200, -1],
						     [20, 50, 100, 200, "全部"]
						 ],*/
						"bPaginate": false,
						//"pageLength": ufma.dtPageLength('#eleAccItem-data'),
						"bInfo": false, //页脚信息
						"bSort": false, //排序功能
						"bAutoWidth": false, //表格自定义宽度，和swidth一起用
						"bProcessing": true,
						"bDestroy": true,
						/*
												"fixedHeader": {
													header: true //表头固定

												},*/
						"columns": [{
							title: "辅助核算名称",
							data: "accItemName"
						},
						{
							title: "编码规则",
							data: "codeRule",
							width : 200
						},
						{
							title: "控制方式",
							data: "contrlLevelname",
							width : 150
						},
						{
							title: "操作",
							data: "chrId",
							width : 100
						}
						],
						"columnDefs": [{
							"targets": [0],
							"serchable": false,
							"orderable": false,
							"className": "nowrap"
							/*,
															"render": function(data, type, rowdata, meta) {
																return '<span style="color:#1590E9">' + data + '</span>'
															}*/
						},
						{
							"targets": [-1],
							"serchable": false,
							"orderable": false,
							"className": "text-center nowrap btnGroup",
							"render": function (data, type, rowdata, meta) {
								var accitemCode = rowdata.accitemCode;
								return '<a class="btn btn-icon-only btn-sm btn-permission btn-release" data-toggle="tooltip"  action= "unactive" rowid="' + data + '" eleCode="' + rowdata.eleCode + '" accitemCode="' + accitemCode + '" title="停用">' +
									'<span class="glyphicon glyphicon icon-ban"></span></a>';
							}
						}
						],
						//"dom": 'rt',
						"initComplete": function (settings, json) {

							/*                //行操作按钮显示tips
							                $('#' + id + ' .btn[data-toggle="tooltip"]').tooltip();

							                //批量操作与分页的toolbar
							                var $info = $(toolBar + ' .info');
							                if ($info.length == 0) {
							                    $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
							                }
							                $info.html('');
							                $('.' + id + '-paginate').appendTo($info);*/

							//后续页码重绘
							if (pageLen != "" && typeof (pageLen) != "undefined") {
								$('#' + id).DataTable().page.len(pageLen).draw(false);
								if (pageNum != "" && typeof (pageNum) != "undefined") {
									$('#' + id).DataTable().page(parseInt(pageNum) - 1).draw(false);
								}
							}

							/*//底部工具条浮动
							ufma.parseScroll();*/

							$('.exeAccItem-data-too-bar').replaceWith(toolBar);

							$(".datatable-group-checkable").prop("checked", false);
							$(".datatable-group-checkable").on('change', function () {
								var t = $(this).is(":checked");
								$('#eleAccItem-data .checkboxes').each(function () {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-group-checkable").prop("checked", t);
							});
							/*ufma.setBarPos($(window));*/
							// $('#eleAccItem-data').closest('.dataTables_wrapper').ufScrollBar({
							// 	hScrollbar: true,
							// 	mousewheel: false
							// });

							$("#eleAccItem-data").tblcolResizable();
							//固定表头
							$("#eleAccItem-data").fixedTableHead($("#expfunc-main"));
						},
						"drawCallback": function (setting) {
							page.reslist = ufma.getPermission();
							ufma.isShow(page.reslist);
							$('#eleAccItem-data').find("td.dataTables_empty").text("")
								.append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
							$('#eleAccItem-data .btn').on('click', function () {

								page._self = $(this);
							});
							$('#eleAccItem-data .btn').ufTooltip({
								trigger: 'click',
								content: '您确定停用当前辅助核算项吗？',
								size: 'large',
								animation: 'flipIn',
								gravity: 'south',
								confirm: true,
								theme: 'light',
								yes: '确定',
								no: '取消',
								onYes: function () {
									page.itemStop(page._self.attr('action'), page._self.attr('eleCode'), page._self.closest('tr'), page._self);
								},
								onNo: function () {
									console.log('no')
								}

							});

						}
					});
					ufma.hideloading();
				};
				var url = page.baseUrl + "accitem/select/" + page.agencyCode;
				ufma.get(url, { "rgCode": page.rgCode, "setYear": page.setYear }, callback);
			},
			initpage: function () {
				// this.getEleAccItem();

			},
			itemStop: function (action, idArray, $tr, dom) {
				ufma.showloading('数据停用中，请耐心等待...');
				var argu = {
					agencyCode: page.agencyCode,
					eleCode: idArray
				};
				var callback = function (result) {
                   ufma.hideloading();
					if (action = "unactive") {
						if ($tr) {
							$tr.remove();
						} else {
							page.getEleAccItem();
						}
					}
					//page.modal.close();
					if (result.flag == 'success') {
						ufma.showTip('停用成功！', function () { }, 'success'); //guohx 增加删除成功提示
					}
				};
				ufma.ajax(page.baseUrl + "accitem/disEnable", "post", argu, callback);
			},
			initAgency: function () {
				var pfData = ufma.getCommonData();
				page.agencyCode = pfData.svAgencyCode;
				page.agencyName = pfData.svAgencyName;
				page.baseUrl = "/ma/sys/";
				if ($("body").data("code")) {
					page.cbAgency = $('#agencyCode').ufmaTreecombox2({
						leafRequire: false,
						onchange: function (data) {
							page.agencyCode = data.code;
							page.agencyName = data.code;
							page.getEleAccItem();
							//缓存单位账套
							var params = {
								selAgecncyCode: page.agencyCode,
								selAgecncyName: page.agencyName,
							}
							ufma.setSelectedVar(params);
						},
						initComplete: function (sender) {
							if (page.agencyCode != "" && page.agencyName != "" && page.agencyCode != "*" && page.agencyName != "*") {
								page.cbAgency.val(page.agencyCode);
							} else {
								page.cbAgency.val(1);
							}
							// page.agencyCode = page.cbAgency.getValue();
						}
					});
					// page.getEleAccItem();
				} else {
					page.agencyCode = "*";
					page.getEleAccItem();
				}
			},
			onEventListener: function () {
				ma.searchHideShow('index-search', '#eleAccItem-data');

				this.get('.btn-start').on('click', function (e) {
					ufma.open({
						url: 'ItemAdd.html',
						title: '辅助核算项',
						width: 650,
						height: 450,
						data: {
							'agencyCode': page.agencyCode,
							'baseUrl': page.baseUrl,
							'setYear': page.setYear,
							'rgCode': page.rgCode
						},
						ondestory: function (data) {
							if (data.action = "ok") {
								//page.initpage();
								page.getEleAccItem();
							}
						}
					});
				});
				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				$("#eleAccItem-data thead ").on("mouseover", function () {
					$("#eleAccItem-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("outline", "1px solid #D9D9D9")
					})
				}).on("mouseout", function () {
					$("#eleAccItem-data thead").find('tr:eq(0) th').each(function () {
						$(this).css("outline", "none")
					})
				});
				//当出现固定表头时，悬浮加边框线 guohx 
				$("#expfunc-main").scroll(function () {
					$("#eleAccItem-datafixed thead").on("mouseover", function () {
						$("#eleAccItem-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("outline", "1px solid #D9D9D9")
						})
					}).on("mouseout", function () {
						$("#eleAccItem-datafixed thead").find('tr:eq(0) th').each(function () {
							$(this).css("outline", "none")
						})
					});
				});
			},

			init: function () {
				ufma.parse(page.namespace);
				var pfData = ufma.getCommonData();
				page.rgCode = pfData.svRgCode;
				page.setYear = pfData.svSetYear;
				page.initAgency();
				page.initpage();
				// 限制高度，避免出现最外层的y轴滚动条
				setTimeout(function () {
					var centerHeight = $(window).height() - 100;
					$('#expfunc-main').css("height", centerHeight);
					$('#expfunc-main').css("width", $(".table-sub").width());
					$('#expfunc-main').css("overflow", "auto");
					
				}, 500)
				this.onEventListener();

			}
		}
	}();
	page.init();
});