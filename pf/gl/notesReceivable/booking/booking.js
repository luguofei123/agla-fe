$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};
	var page = function() {
		var ptData = {};
		return {
			//初始化表格
			initTable: function(data) {
				var columns = [{
						title: "序号",
						data: null,
						width: "14px",
						render: function(data, type, rowdata, meta) {
							return '<div style="text-align: center" class="rowno">' + (meta.row + 1) + '</div>';
						}
					},
					{
						title: "背书人",
						data: "billEndorsor",
						width: "120px",
						render: function(data, type, rowdata, meta) {
							var endorGuid = rowdata.endorGuid;
							page.endorguid = endorGuid;
							if(endorGuid == null || endorGuid == undefined) {
								endorGuid = ""
							}
							return '<div class="td-content" endorGuid = "' + endorGuid + '"><input type="text" name="billEndorsor" class="form-control controlReg"  maxlength="100" value="' + data + '"/></div>'
						}
					},
					{
						title: "被背书人",
						data: "billEndorsee",
						width: "120px",
						render: function(data, type, rowdata, meta) {
							return '<div class="td-content"><input type="text" name="billEndorsee" class="form-control controlReg" maxlength="100" value="' + data + '"/></div>'

						}
					},
					{
						title: "背书转让日期",
						data: "endorseDate",
						width: "110px",
						render: function(data, type, rowdata, meta) {
							return '<div name="endorseDate" class="uf-datepicker"></div>'
						}
					},
					{
						title: "操作",
						data: "opt",
						width: "30px",
						className: 'nowrap tc',
						render: function(rowid, rowdata, data, meta) {
							if(data == '' || data == null) {
								return '';
							} else {
								return '<a class="btn btn-icon-only btn-sm btn-delete icon-trash" data-toggle="tooltip" rowindex="' + meta.row + '" rowEndorguid="' + page.endorguid + '" title="删除"></a>';
							}

						}
					}
				];
				page.tableObj = $("#showTable").DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					"bRetrieve": true,
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					"autoWidth": false,
					"dom": 'rt',
					"initComplete": function() {

						if(window.ownerData.action == "editData") {
							$("table .uf-datepicker").each(function(i) {
								$(this).getObj().setValue(window.ownerData.billbook.billEndor[i].endorseDate);
							})
							if(window.ownerData.canEdit == "true") {
								$('#frmBookIn3').disable();
							}

						}

					},
					"drawCallback": function(settings) {
						$('.uf-datepicker').ufDatepicker({
							format: 'yyyy-mm-dd',
							//viewMode:'month',
							initialDate: new Date()
						});
					}
				});

			},
			//初始化日历控件
			initDatePicker: function() {
				var signInDate = new Date(ptData.svTransDate),
					y = signInDate.getFullYear(),
					m = signInDate.getMonth();
				$('#billDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date(y, m, 1)
				});
				$('#expiryDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: signInDate
				});

			},
			//setForm
			setForm: function() {
				if(window.ownerData.action == "editData") {
					$('#frmBookIn').setForm(window.ownerData.billbook);
					// $('#frmBookIn2').setForm(window.ownerData.billBookAss);
					if(window.ownerData.canEdit == "true") {
						$('#frmBookIn').disable();
						// $('#frmBookIn2').disable();
						$("#btnSave").attr("disabled", true);
					} else {
						$('#frmBookIn').enable();
						$("#btnSave").attr("disabled", false);
						$('#billType,#billPerson,#payerAgency,#acceptAgency').getObj().setEnabled(true);
						$('#billDate,#expiryDate').attr('disabled', false);
						$('#billDate span,#expiryDate span').removeClass('hide');
					}
				}
				if(!$.isNull(window.ownerData.billbook.formEnable)) {
					if(window.ownerData.billbook.formEnable) {
						$('#frmBookIn').enable();
						$('#billType,#billPerson,#payerAgency,#acceptAgency').getObj().setEnabled(true);
						$('#billDate,#expiryDate').attr('disabled', false);
						$('#billDate span,#expiryDate span').removeClass('hide');
					} else {
						$('#frmBookIn').disable();
						$('#billType,#billPerson,#payerAgency,#acceptAgency').getObj().setEnabled(false);
						$('#billDate,#expiryDate').attr('disabled', true);
						$('#billDate span,#expiryDate span').addClass('hide');
					}
				}

				if(window.ownerData.billbook.action == 'add') {
					$('#frmBookIn').enable();
					$('#billType,#billPerson,#payerAgency,#acceptAgency').getObj().setEnabled(true);
					$('#billDate,#expiryDate').attr('disabled', false);
					$('#billDate span,#expiryDate span').removeClass('hide');
				}

				$('#receivableType').val('登记');
			},

			onEventListener: function() {
				//CWYXM-8319--经海哥确认背书人、被背书人只可以有汉字英文数字小括号--zsj
				$('#showTable').on('keyup parse', 'tbody td .controlReg', function() {
					$(this).val($(this).val().replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\(\)]/g,''))
				});
				$('input').on('blur', function() {
					if($(this).attr('maxlength')) {
						var testRex = /[^\x00-\xff]/ig;
						var msg = $(this).val();
						var strArr = $(this).val().split('');
						var count = 0;
						var twoCount = 0;
						var allCount = 0;
						var maxlength = parseInt($(this).attr('maxlength'));
						var finalLength = 0;
						var realLeng = parseInt(maxlength / 2);
						for(var i = 0; i < msg.length; i++) {
							if((msg.charCodeAt(i) >= 65 && msg.charCodeAt(i) <= 90) || (msg.charCodeAt(i) >= 97 && msg.charCodeAt(i) <= 122) || (msg.charCodeAt(i) >= 48 && msg.charCodeAt(i) <= 57)) {
								count += 1;
								if(count > maxlength) {
									$(this).val($(this).val().substring(0, maxlength));
								}
							} else {
								twoCount += 1;
								if(twoCount > realLeng) {
									$(this).val($(this).val().substring(0, realLeng));
								}
							}
						}
						allCount = count + parseInt(twoCount * 2);
						if(allCount > maxlength) {
							var oneOver = 0;
							if(count == 0 && twoCount != 0) {
								$(this).val($(this).val().substring(0, realLeng));
							} else if(count != 0 && twoCount == 0) {
								$(this).val($(this).val().substring(0, maxlength));
							} else if(count != 0 && twoCount != 0) {
								if(count % 2 == 0) {
									var twolen = (maxlength - count) / 2;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								} else {
									var twolen = (maxlength - count) / 2 + 1;
									finalLength = count + twolen;
									$(this).val($(this).val().substring(0, finalLength));
								}
							}
						}
					}
				});
				$('#btnClose').click(function() {
					_close();
				});
				//点击子表的删除
				$('#showTable').on('click', 'tbody td .btn-delete', function() {
					var endorGuid = $(this).attr("rowEndorguid");
					var tbIndex = $(this).attr("rowindex");
					$(this).closest('tr').addClass('willDelete');
					var argu = {
						endorGuid: endorGuid
					};
					ufma.confirm('您确定要删除选中的行数据吗？', function(action) {
						if(action) {
							if(!$.isNull(endorGuid)) {
								//点击确定的回调函数
								dm.delBillBookEndor(argu, function() {
									$('#showTable tbody tr').each(function() {
										if($(this).hasClass("willDelete")) {
											$(this).removeClass("willDelete");
											$(this).html('');
											$(this).remove();
										}
									});
									var num = $("#showTable tbody tr").length;     
									for(var i = 0; i < num; i++) {      
										$("#showTable tbody tr td .rowno").eq(i).html(i + 1);
									}
								});
							} else {
								$('#showTable tbody tr').each(function() {
									if($(this).hasClass("willDelete")) {
										$(this).removeClass("willDelete");
										$(this).html('');
										$(this).remove();
									}
								});
								var num = $("#showTable tbody tr td .rowno").length;     
								for(var i = 0; i < num; i++) {      
									$("#showTable tbody tr td .rowno").eq(i).html(i + 1);
								}
							}
						} else {
							//点击取消的回调函数
						}
					}, {
						type: 'warning'
					});

				});
				//CWYXM-8203--应收票据备查薄进行登记时，票据号数输入负数，能保存成功--经赵雪蕊确定合同号允许输入字母 数字--zsj
				$('#billNumber').on('blur', function() {
					$(this).val($(this).val().replace(/[\W]|_/g, ''));
				});
				//CWYXM-8214--应收票据备查薄进行登记时，交易合同号数输入负数，能保存成功--经赵雪蕊确定合同号允许输入字母 数字 下划线--zsj
				$('#dealpactNumber').on('blur', function() {
					$(this).val($(this).val().replace(/[^\w\.\/]/ig, ''));
				});

				//保存
				$('#btnSave').click(function() {
					var argu = $('#frmBookIn').serializeObject();
					argu.agencyCode = window.ownerData.billbook.agencyCode;
					argu.acctCode = window.ownerData.billbook.acctCode;
					argu.setYear = window.ownerData.billbook.setYear;
					argu.rgCode = window.ownerData.billbook.rgCode;
					argu.billStatus = "01";
					argu.billbookType = "1";
					argu.billEndor = [];
					// argu.billRemark = $('#billRemark').val();
					argu.op = 0; //新增传0，修改传1
					if(window.ownerData.action == "editData") {
						argu.op = 1;
						argu.billbookGuid = window.ownerData.billbook.billbookGuid;
						argu.billBookAss = [];
						argu.billBookAss.push(window.ownerData.billBookAss);
					}
					argu.receivableType = "01"; //登记是01
					$("#showTable tbody tr").each(function() {
						if($(this).find("td").eq(1).find("input").val() != "" && $(this).find("td").eq(2).find("input").val() != "") {
							var obj = {};
							obj.billEndorsor = $(this).find("td").eq(1).find("input").val();
							obj.billEndorsee = $(this).find("td").eq(2).find("input").val();
							if(window.ownerData.action == "editData") {
								obj.endorGuid = $(this).find("td").eq(1).find(".td-content").attr("endorGuid");
							}
							obj.endorseDate = $(this).find("td").eq(3).find("input[name='endorseDate']").val();
							argu.billEndor.push(obj);
							argu = $.extend(argu, obj);
						}

					});
					//$('#btnSave').attr("disabled", true);
					if((!$.isNull(argu.billType)) && (!$.isNull(argu.billNumber)) && (!$.isNull(argu.billPerson)) && (!$.isNull(argu.acceptAgency)) && (!$.isNull(argu.billfaceAmount)) && (!$.isNull(argu.dealpactNumber)) && (!$.isNull(argu.dealpactNumber)) && (!$.isNull(argu.billfaceRate))) { // && (!$.isNull(argu.billRemark))
						if(((!$.isNull(argu.billDate)) && (!$.isNull(argu.expiryDate))) && (argu.billDate < argu.expiryDate)) {
							//CWYXM-8204--经赵雪蕊确认金额和利率不能为0或负数--zsj
							if(argu.billfaceRate == 0) {
								ufma.showTip("票面利率不能为0", function() {}, "warning");
								return false;
							} else if(parseFloat(argu.billfaceRate) > 100) { //CWYXM-8295--票面利率输入不 能超过100%--zsj
								ufma.showTip("票面利率不能大于100", function() {}, "warning");
								return false;
							} else if(argu.billfaceAmount == 0) {
								ufma.showTip("票面金额不能为0", function() {}, "warning");
								return false;
							} else {
								ufma.showloading('数据保存中,请耐心等待...');
								dm.doSave(argu, function(result) {
									ufma.hideloading();
									if(result.flag == 'success') {
										ufma.showTip(result.msg, function() {
											_close("save");
										}, 'success');
									}
								});
							}

						} else {
							//$('#btnSave').attr("disabled", false);
							ufma.showTip("出票日期应小于到期日期", function() {}, "warning");
							return false;
						}
					} else {
						//$('#btnSave').attr("disabled", false);
						ufma.showTip("输入必填项", function() {}, "warning");
						return false
					}

				});
				//表格新增行
				$("#addTableRow").on("click", function() {
					page.tableObj.row.add({
						billEndorsor: "",
						billEndorsee: "",
						endorseDate: ""
					}).draw();
					var num = $("#showTable tbody tr td .rowno").length;     
					for(var i = 0; i < num; i++) {      
						$("#showTable tbody tr td .rowno").eq(i).html(i + 1);
					}
				})
			},
			//初始化页面
			initPage: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initDatePicker();
				//初始化表格
				if(window.ownerData.action == "editData") {
					if(!window.ownerData.billbook.billEndor) {
						window.ownerData.billbook.billEndor = [{
							billEndorsor: "",
							billEndorsee: "",
							endorseDate: ""
						}];
					}
					//修改
					page.initTable(window.ownerData.billbook.billEndor);
				} else {
					//新增
					var tableDatas = [{
						billEndorsor: "",
						billEndorsee: "",
						endorseDate: ""
					}];
					page.initTable(tableDatas);
				}

				//票据类型
				var argu = {
					agencyCode: window.ownerData.billbook.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "BILLTYPE"
				};
				dm.acceptAgency(argu, function(result) {
					$('#billType').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择票据类型',
						leafRequire: true,
						data: result.data,
						onComplete: function(sender) {
							page.setForm();
						}
					});
					// $('#billType').getObj().val('001');
				});
				//出票人、付款人、承兑人
				var argu2 = {
					agencyCode: window.ownerData.billbook.agencyCode,
					setYear: ptData.svSetYear,
					rgCode: ptData.svRgCode,
					eleCode: "CURRENT"
				};
				dm.acceptAgency(argu2, function(result) {
					$('#billPerson').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择出票人',
						leafRequire: true,
						data: result.data
					});
					$('#acceptAgency').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择承兑人',
						leafRequire: true,
						data: result.data
					});
					$('#payerAgency').ufTreecombox({
						idField: 'code',
						textField: 'codeName',
						pIdField: 'pCode', //可选
						readonly: false,
						placeholder: '请选择付款人',
						leafRequire: true,
						data: result.data
					});
					// $('#billPerson').getObj().val('001');
				});
				$('#billfaceAmount').amtInput();
				$('#billfaceRate').amtInput();
				//$('#billfaceRate').intInput();
				//setForm
				page.setForm();
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				uf.parse();
			}
		}
	}();

	page.init();
});