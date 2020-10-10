$(function() {
	window._close = function(action) {
		if(window.closeOwner) {
			var data = {
				action: action
			};
			window.closeOwner(data);
		}
	};
	console.log(window.ownerData);

	var page = function() {
		var ptData = {};
		return {
			//初始化表格
			initTable: function(data) {
				var columns = [{
						title: "序号",
						data: null,
						width: "40px",
						render: function(data, type, rowdata, meta) {
							return '<div style="text-align: center">' + (meta.row + 1) + '</div>';
						}
					},
					{
						title: "背书人",
						data: "billEndorsor",
						width: "120px",
						render: function(data, type, rowdata, meta) {
							return '<div class="td-content"><input type="text" name="billEndorsor"/></div>'
						}
					},
					{
						title: "被背书人",
						data: "billEndorsee",
						width: "120px",
						render: function(data, type, rowdata, meta) {
							return '<div class="td-content"><input type="text" name="billEndorsee"/></div>'

						}
					},
					{
						title: "背书转让日期",
						data: "endorseDate",
						width: "120px",
						render: function(data, type, rowdata, meta) {
							return '<div name="endorseDate" class="uf-datepicker" style="width: 160px"></div>'
						}
					}
				];
				page.tableObj = $("#showTable").DataTable({
					"language": {
						"url": bootPath + "agla-trd/datatables/datatable.default.js"
					},
					"data": data,
					"bRetrieve": true,
					// "paging": false, // 禁止分页
					// "processing": true, //显示正在加载中
					// "pagingType": "full_numbers", //分页样式
					// "lengthChange": true, //是否允许用户自定义显示数量p
					// "lengthMenu": [
					//     [10, 20, 50, 100, 200, -1],
					//     [10, 20, 50, 100, 200, "全部"]
					// ],
					// "pageLength": 20,
					"serverSide": false,
					"ordering": false,
					"columns": columns,
					"autoWidth": false,
					"dom": 'rt',
					"initComplete": function() {
						$('.uf-datepicker').ufDatepicker({
							format: 'yyyy-mm-dd',
							//viewMode:'month',
							initialDate: new Date()
						});

					},
					"drawCallback": function(settings) {

					}
				});

			},
			//初始化表格
			initDatePicker: function() {
				$('#expiryDate').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: new Date()
				});
				$('#expiryDate').css("width", "160px");
			},
			//setForm
			setForm: function() {
				$('#frmBookIn').setForm(window.ownerData.billbook);
				$('#frmBookIn').disable();
				$('#billType').getObj().setEnabled(false);
				$('#billPerson').getObj().setEnabled(false);
				$('#payerAgency').getObj().setEnabled(false);
				$('#acceptAgency').getObj().setEnabled(false);

				//修改时给$('#frmBookIn2')set值
				if(window.ownerData.action == "editData") {
					$('#frmBookIn2').setForm(window.ownerData.billBookAss);
				}
				$('#receivableType').val('退票');
			},
			onEventListener: function() {
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
				//保存
				$('#btnSave').click(function() {
					var argu = $('#frmBookIn').serializeObject();
					argu.billbookGuid = window.ownerData.billbook.billbookGuid;
					argu.agencyCode = window.ownerData.billbook.agencyCode;
					argu.acctCode = window.ownerData.billbook.acctCode;
					argu.setYear = window.ownerData.billbook.setYear;
					argu.rgCode = window.ownerData.billbook.rgCode;
					argu.billbookType = "1"; //应收是1
					argu.op = 0; //新增传0，修改传1
					argu.receivableType = "06"; //登记是01，背书是02，贴现是03，收款是04，退票是06
					var argu2 = $('#frmBookIn2').serializeObject();
					argu = $.extend(argu, argu2);
					if(window.ownerData.action == "editData") {
						argu.op = 1;
						argu.billbookGuid = window.ownerData.billbook.billbookGuid;
						argu.billBookAss = [];
						argu.billBookAss.push(window.ownerData.billBookAss);
					}
					var businessDate = $('#businessDate').getObj().getValue();
					if($.isNull(businessDate)) {
						ufma.showTip("退票日期不能为空", function() {

						}, "warning");
						return false;
					}
					$('#btnSave').attr("disabled", true);
					dm.doSave(argu, function(result) {

						if(result.flag == 'success') {
							ufma.showTip(result.msg, function() {
								_close("save");
							}, 'success');
						} else {
							$('#btnSave').attr("disabled", false);
						}

					});
				});
				//贴现率blur事件
				$('#discountRate').on("blur", function() {

					var rate = parseFloat($("#discountRate").val());
					var newAmount = window.ownerData.billbook.billfaceAmount * rate;
					$("#discountAmount").val(newAmount);
					$("#discountAmount").trigger("blur");

				})
			},
			//初始化页面
			initPage: function() {
				//权限控制
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				//初始化表格
				var tableDatas = [{
						billEndorsor: "",
						billEndorsee: "",
						endorseDate: ""
					},
					{
						billEndorsor: "",
						billEndorsee: "",
						endorseDate: ""
					},
					{
						billEndorsor: "",
						billEndorsee: "",
						endorseDate: ""
					},
					{
						billEndorsor: "",
						billEndorsee: "",
						endorseDate: ""
					}
				];
				page.initTable(tableDatas);

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
				//只能输入金额 S
				$('#billfaceAmount').amtInput();
				$('#billfaceRate').amtInput();
				$('#payAmount').amtInput();
				//只能输入金额 E
				//set form

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