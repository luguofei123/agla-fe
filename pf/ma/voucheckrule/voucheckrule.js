$(function() {
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
	};
	var oTable;
	var page = function() {
		var pfData = {};
		return {
			getInterface: function(action) {
				var url = '';
				switch(action) {
					case 'queryAccs': //科目体系列表
						return  '/ma/sys/common/getEleTree';//'/ma/sys/eleAcc/selectAccs';
						break;
					case 'queryAcco': //会计科目
						return  '/ma/sys/common/getEleTree';//'/ma/sys/coaAcc/getAccoTree';
						break;
					case 'queryRule': //所有规则
						return '/ma/sys/eleVouCheckRule/select';
						break;
					case 'del': //删除规则
						return '/ma/sys/eleVouCheckRule/deleteByIds';
						break;
					case 'active': //启用
						return '/ma/sys/eleVouCheckRule/enableByIds/';
						break;
					case 'unactive': //禁用
						return '/ma/sys/eleVouCheckRule/enableByIds/';
						break;
					case 'save': //保存规则
						return '/ma/sys/eleVouCheckRule/save';
						break;
					case 'edit': //修改规则
						return '/ma/sys/eleVouCheckRule/select';
						break;
					case 'buildMQ': //生成公式
						return '/ma/sys/eleVouCheckRule/importRule';
						break;
					case 'checkMQ': //校验公式
						return '/ma/sys/eleVouCheckRule/checkRule';
						break;
					case 'translate': //翻译
						return '/ma/sys/eleVouCheckRule/translateRule';
						break;
					case 'operator': //枚举
						return '/ma/pub/enumerate/OPERATOR';
						break;
					default:
						break;
				}
				return url;
			},
			//科目体系
			initKMTX: function() {
				var url = page.getInterface('queryAccs');
				var argu={
					"agencyCode": "*",
					"setYear":pfData.svSetYear,
					"rgCode":pfData.svRgCode,
					"eleCode": "ACCS"
				}
				var callback = function(result) {
					data = result.data;
					$('#cbAccs').getObj().load(data);
					$('#cbAccsEdit').getObj().load(data);
					$('#cbAccs').getObj().val('01');
					$('.btn-query').trigger('click');
				};
				ufma.get(url, argu, callback);
			},
			getRuleFunc: function() {
                if (oTable != undefined && $('#ruleData').html() !== "") {
                    $("#ruleData_wrapper").ufScrollBar('destroy');
                    oTable.destroy();
                }
				var argu = {
					accsCode: $('#cbAccs').getObj().getValue(),
					seYear: pfData.svSetYear
				};
				ufma.showloading('正在请求数据，请耐心等待...');
				var callback = function(result) {
					var id = "ruleData";
					var toolBar = $('#' + id).attr('tool-bar');
                    oTable = $('#' + id).DataTable({
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
								title: '<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> <input type="checkbox"' +
									'class="datatable-group-checkable" id="chrId"/>&nbsp;<span></span> </label>',
								data: "chrId"
							},
							{
								title: "序号",
								data: "rowno",
								className: 'tc nowrap',
								width: 30
							},
							{
								title: "公式",
								data: "formula",
								className: "formulaName",
								width: 400
							},
							{
								title: "公式说明",
								data: "formulaDescription",
								width: 400
							},
							{
								title: "公式翻译",
								data: "formulaTranslation",
								width: 400
							},
							{
								title: "状态",
								data: 'enabled',
								width: 60,
								render: function(data, type, rowdata, meta) {
									return data == 1 ? '启用' : '停用';
								}
							},
							{
								title: "创建人",
								data: "createUserName",
								width: 100
							},
							{
								title: "操作",
								data: "opt",
								width: 100
							}
						],
						"columnDefs": [{
								"targets": [0],
								"serchable": false,
								"orderable": false,
								"className": "checktd",
								"render": function(data, type, rowdata, meta) {
									return '<div class="checkdiv"></div>' +
										'<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"> ' +
										'<input type="checkbox" class="checkboxes" value="' + data + '" /> &nbsp;' +
										'<span></span> </label>';
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

									return '<a class="btn btn-icon-only btn-sm btn-permission btn-start" data-toggle="tooltip" ' + active + ' action= "active" rowcode="' + rowdata.chrId + '" title="启用">' +
										'<span class="glyphicon icon-play"></span></a>' +
										'<a class="btn btn-icon-only btn-sm btn-permission btn-stop" data-toggle="tooltip" ' + unactive + ' action= "unactive" rowcode="' + rowdata.chrId + '" title="停用">' +
										'<span class="glyphicon glyphicon icon-ban"></span></a><a class="btn btn-icon-only btn-sm btn-permission btn-delete" data-toggle="tooltip" action= "del" rowcode="' + rowdata.chrId + '" title="删除">' +
										'<span class="glyphicon icon-trash"></span></a>'
								}
							},
							{
								"targets": [2],
								"serchable": false,
								"orderable": false,
								"className": "formulaName",
								"render": function(data, type, rowdata, meta) {
									page.action = 'edit';
									return '<a class="common-jump-link" style="display:block;cursor:pointer;href="javascript:;" data-href=\'' + rowdata.chrId + '\'>' + data + '</a>';
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
							$('.' + id + '-paginate').appendTo($info);
							$(".datatable-group-checkable").prop("checked", false);
							$(".datatable-group-checkable").on('change', function() {
								var t = $(this).is(":checked");
								$('.checkboxes').each(function() {
									t ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
									t ? $(this).closest('tr').addClass('selected') : $(this).closest('tr').removeClass('selected');
								});
								$(".datatable-group-checkable").prop("checked", t);
							});
							//权限控制
							ufma.isShow(reslist);

                            // //表格模拟滚动条
                            // $('#ruleData').closest('.dataTables_wrapper').ufScrollBar({
                            //     hScrollbar: true,
                            //     mousewheel: false
                            // });
							// ufma.setBarPos($(window));
							$("#ruleData").tblcolResizable();
							//固定表头
							$("#ruleData").fixedTableHead($("#outDiv"));
						},
						fnCreatedRow: function(nRow, aData, iDataIndex) {
							$('td:eq(1)', nRow).html(iDataIndex + 1);
						},
						"drawCallback": function(settings) {
                            // $("#" + id).fixedColumns({
                            //     rightColumns: 1,//锁定右侧一列
                            //     // leftColumns: 1//锁定左侧一列
                            // });
							// ufma.parseScroll();
							//权限控制
							ufma.isShow(reslist);
                            // ufma.setBarPos($(window));

							 
							$('#' + id + ' .btn').on('click', function() {
								page._self = $(this);
							});
							$('#' + id + ' .btn-delete').ufTooltip({
								content: '您确定删除当前规则吗？',
								onYes: function() {
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
							$('#' + id + ' .btn-start').ufTooltip({
								content: '您确定启用当前规则吗？',
								onYes: function() {
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
							$('#' + id + ' .btn-stop').ufTooltip({
								content: '您确定停用当前规则吗？',
								onYes: function() {
									page.delRowOne($(page._self).attr('action'), [$(page._self).attr('rowcode')], $(page._self).closest('tr'));
								},
								onNo: function() {}
							})
						}
					});
					//翻页取消勾选
					$('#' + id).on('page.dt', function() {
						$(".datatable-group-checkable,.checkboxes").prop("checked", false);
						$('#' + id).find("tbody tr.selected").removeClass("selected");
					});
					ufma.hideloading();
				};
				ufma.get(this.getInterface('queryRule'), argu, callback);
			},
			//删除、启用、停用、批量操作  增加下级
			delRow: function(action, idArray, $tr) {
				var url = this.getInterface(action);
				var argu = {
					ids: idArray
				};
				var callback = function(result) {
					if(action == 'del') {
						if($tr)
							$tr.remove();
						else {
							page.getRuleFunc();
						}
						if(result.flag == 'success') {
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							page.getRuleFunc();
						} else {
							page.getRuleFunc();
						}
					}
				};
				if(action == 'del') {
					ufma.confirm('您确定要删除选中的规则吗？', function(action) {
						if(action) {
							ufma.delete(url, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'active') {
					ufma.confirm('您确定要启用选中的规则吗？', function(action) {
						if(action) {
							argu.enabled = 1;
							ufma.post(url, argu, callback);
						}
					}, {
						type: 'warning'
					});
				} else if(action == 'unactive') {
					ufma.confirm('您确定要停用选中的规则吗？', function(action) {
						if(action) {
							argu.enabled = 0;
							ufma.post(url, argu, callback);
						}
					}, {
						type: 'warning'
					});
				}
			},
			//单行删除、启用、停用操作
			delRowOne: function(action, idArray, $tr) {
				var url = this.getInterface(action);
				var argu = {
					ids: idArray
				};
				if(action == 'active') {
					argu.enabled = 1;
				} else if(action == 'unactive') {
					argu.enabled = 0;
				}
				var callback = function(result) {
					if(action == 'del') {
						page.getRuleFunc();
						if(result.flag == 'success') {
							ufma.showTip('删除成功！', function() {}, 'success'); //guohx 增加删除成功提示
						}
					} else {
						if($tr) {
							$tr.find('.btn[action="active"]').attr('disabled', action == "active");
							$tr.find('.btn[action="unactive"]').attr('disabled', action == "unactive");
							page.getRuleFunc();
						} else {
							page.getRuleFunc();
						}
					}
				};
				if(action == 'active') {
					argu.enabled = 1;
					ufma.post(this.getInterface('active'), argu, callback);
				} else if(action == 'unactive') {
					argu.enabled = 0;
					ufma.post(this.getInterface('unactive'), argu, callback);
				} else if(action == 'del') {
					ufma.delete(this.getInterface('del'), argu, callback);
				}
			},
			//选择行
			getCheckedRows: function() {
				var checkedArray = [];
				$('#ruleData .checkboxes:checked').each(function() {
					checkedArray.push($(this).val());
				});
				return checkedArray;
			},
			//编辑
			openEdtWin: function(ruleId) {
				//新增
				if($.isNull(ruleId)) {
					$('#chrId').val("");
					$('#cbAccsEdit').getObj().val("001");
					$('#mqScript').val("");
					$('#mqResult').val("");
					$('#mqTrans').val("");
					$("#modalRuleEdit>.u-msg-title>h4").text("凭证校验规则新增")
				} else {
					$("#modalRuleEdit>.u-msg-title>h4").text("凭证校验规则编辑")
					//编辑
					var callback = function(result) {
						if(result.data.length > 0) {
							var obj = result.data[0];
							$('#chrId').val(obj.chrId);
							//获取下拉框数据方法
							$('#cbAccsEdit').getObj().val(obj.accsCode);
							$('#mqScript').val(obj.formulaDescription);
							$('#mqResult').val(obj.formula);
							$('#mqTrans').val(obj.formulaTranslation);
						}
					}
					var url = this.getInterface('edit') + "/" + ruleId;
					ufma.get(url, {}, callback);
				}
				page.editor = ufma.showModal('modalRuleEdit', 1090, 500);
			},
			save: function(goon) {
				if($('#mqScript').val() == ''){
					ufma.alert('请输入公式说明,公式说明不能为空', "warning");
					return false;
				}else if($('#mqResult').val() == '') {
					ufma.alert('请输入公式,公式不能为空', "warning");
					return false;
				}else if($('#mqTrans').val() == ''){
					ufma.alert('请点击翻译按钮，翻译不能为空', "warning");
					return false;
				}
				var argu = page.getMQElement();
				//将获取到的value赋值给对应的值
				argu.chrId = $('#chrId').val();
				argu.accsCode = $('#cbAccsEdit').getObj().getValue();
				argu.formulaDescription = $('#mqScript').val();
				argu.formula = $('#mqResult').val();
				argu.formulaTranslation = $('#mqTrans').val();
				var callback = function(result) {
					if(!goon) {
						ufma.showTip('保存成功！', function() {
							page.editor.close();
						}, 'success');
						$('.btn-query').trigger('click');
						$('#mq').getObj().clear();

					} else {
						ufma.showTip('保存成功,您可以继续添加规则！', function() {}, 'success');
						page.formdata = $('#formRule').serializeObject();
						page.resetForm();
						$('.btn-query').trigger('click');
					}
				}
				var url = this.getInterface('save');
				ufma.post(url, argu, callback);
			},
			getMQElement: function() {
				var data = {
					"chrId": "",
					"enabled": null,
					"accsCode": $('#cbAccsEdit').getObj().getValue(),
					"accsName": $('#cbAccsEdit').getObj().getText(),
					"setYear": pfData.svSetYear,
					"rgCode": pfData.svRgCode,
					"formula": $('#mqResult').val(),
					"formulaDescription": $('#mqScript').val(),
					"formulaTranslation": $('#mqTrans').text(),
					"eleVouCheckRuleDetails": [{
						"chrId": null,
						"checkId": null,
						"accoCode": $('#cbAcco').getObj().getValue(),
						"accoName": $('#cbAcco').getObj().getText(),
						"drCr": $('input[name="dc"]:checked').val(),
						"operatorCode": $('#mq').getObj().getValue(),
						"operatorName": $('#mq').getObj().getText()
					}]
				}
				return data;
			},
			resetForm: function() {
				$('#formRule')[0].reset(); //左侧表单置空
				$('#frmMQInfo')[0].reset(); //右侧表单置空
				$('#cbAcco').getObj().clear();
			},
			onEventListener: function() {
				//列表页面表格行操作绑定
				$('#ruleData').on('click', 'tbody td:not(.btnGroup)', function(e) {
					e.preventDefault();
					var $ele = $(e.target);
					if($ele.is('a')) {
						page.openEdtWin($ele.data('href'));
						return false;
					}
					var $tr = $ele.closest('tr');
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

				$('.btn-query').click(function() {
					page.getRuleFunc();
				});

				$('.btn-add').on('click', function(e) {
					e.preventDefault();
					page.action = 'add';
					page.openEdtWin();
				});
				$('.btn-close').on('click', function() {
					page.resetForm();
					$('.btn-query').trigger('click');
					page.editor.close();
				});
				//保存
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
						page.getRuleFunc(page.agencyCode);
					});
				});
				$('.btn-delete').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择规则！', "warning");
						return false;
					}
					page.delRow('del', checkedRow);
				});
				$('.btn-start').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择规则！', "warning");
						return false;
					}
					page.delRow('active', checkedRow);
				});
				$('.btn-stop').on('click', function(e) {
					e.stopPropagation();
					var checkedRow = page.getCheckedRows();
					if(checkedRow.length == 0) {
						ufma.alert('请选择规则！', "warning");
						return false;
					}
					page.delRow('unactive', checkedRow);
				});
				//翻译
				$('#btnTrans').click(function() {
					var argu = page.getMQElement();
					if(!argu) {
						return false;
					}
					ufma.post(page.getInterface('translate'), argu, function(result) {
						$('#mqTrans').val(result.data);
					});
				});
				//代入
				$('#btnBuildMQ').click(function() {
					var argu = page.getMQElement();
					if(!argu) {
						return false;
					}
					ufma.post(page.getInterface('buildMQ'), argu, function(result) {
						$('#mqResult').val(result.data.formula);
					});
				});
				//验证
				$('#btnCheck').click(function() {
					var argu = page.getMQElement();
					if(!argu) {
						return false;
					}
					ufma.post(page.getInterface('checkMQ'), argu, function(result) {
						ufma.showTip(result.msg, function() {}, 'success'); //guohx 增加删除成功提示
					});
				});
				//guohx 当鼠标悬浮到表头 需要显示表头线 方便拖动
				// $("#ruleData thead ").on("mouseover", function () {
				// 	$("#ruleData thead").find('tr:eq(0) th').each(function () {
				// 		$(this).css("outline", "1px solid #D9D9D9")
				// 	})
				// }).on("mouseout", function () {
				// 	$("#ruleData thead").find('tr:eq(0) th').each(function () {
				// 		$(this).css("outline", "none")
				// 	})
				// });
				//当出现固定表头时，悬浮加边框线 guohx 
				// $("#outDiv").scroll(function () {
				// 	$("#ruleDatafixed thead").on("mouseover", function () {
				// 		$("#ruleDatafixed thead").find('tr:eq(0) th').each(function () {
				// 			$(this).css("outlinet", "1px solid #D9D9D9")
				// 		})
				// 	}).on("mouseout", function () {
				// 		$("#ruleDatafixed thead").find('tr:eq(0) th').each(function () {
				// 			$(this).css("outline", "none")
				// 		})
				// 	});
				// });
			},
			//初始化页面
			initPage: function() {
				//表格初始化
				ufma.comboxInit('expFunc-bgttypeCode');
				$('#cbAccsEdit').ufCombox({
					idField: 'code',
					textField: 'codeName',
					readonly: true,
					data: [],
					name: 'accsCode',
					onChange: function(item) {
						ufma.get(page.getInterface('queryAcco'), {
							agencyCode: '*',
							acctCode: '*',
							acceCode: '',
							setYear: pfData.svSetYear,
							eleCode: "ACCO",
							accsCode: $('#cbAccsEdit').getObj().getValue()
						}, function(result) {
							$('#cbAcco').ufTextboxlist({
								//idField: 'id',
								//textField: 'codeName',
								idField: 'code',
								textField: 'codeName',
								pIdField: 'pId',
								readonly: true,
								data: result.data,
								name: 'accoCode'
							})
						});

					}
				});
				$('#cbAccs').ufCombox({
					idField: 'code',
					textField: 'codeName',
					readonly: true,
					data: [],
					name: 'accsCode',
					onChange: function(item) {
						page.getRuleFunc();
					}
				});
				/*$('#cbAcco').ufTreecombox({
					idField: 'id',
					textField: 'codeName',
					pIdField  :'pId',
					readonly: true,
					data: [],
					name: 'accoCode'
				});*/
				$('#mq').ufCombox({
					idField: 'ENU_CODE',
					textField: 'ENU_NAME',
					readonly: true,
					url: page.getInterface('operator')
				});
				page.initKMTX();
			},
			init: function() {
				//获取session
				pfData = ufma.getCommonData();
				reslist = ufma.getPermission();
				ufma.isShow(reslist);
				this.initPage();
				// 限制高度，避免出现最外层的y轴滚动条
				setTimeout(function () {
					var centerHeight = $(window).height() - 124 - 30 - 8 - 40;
					$('#outDiv').css("height", centerHeight);
					$('#outDiv').css("width", $(".table-sub").width());
					$('#outDiv').css("overflow", "auto");
					
				}, 500)
				this.onEventListener();
				$.fn.dataTable.ext.errMode = 'none';
				ufma.parse(page.namespace);
				uf.parse();
			}
		}
	}();
	page.init();
});