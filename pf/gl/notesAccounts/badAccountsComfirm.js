$(function() {
	//废弃文件--zsj
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
				$('#frmBookIn').find('input[name="acco"]').val(window.ownerData.billbook.accoName);
				$('#frmBookIn').disable();

				//修改时给$('#frmBookIn2')set值
				if(window.ownerData.action == "editData") {
					$('#frmBookIn2').setForm(window.ownerData.billBookAss);
				}

				$('#receivableType').val('坏账确认');
			},
			onEventListener: function() {
				$('#btnClose').click(function() {
					_close();
				});
				$('#btnSave').click(function() {
					var argu = $('#frmBookIn2').serializeObject();
					argu.badType = "2";
					argu.detailAssGuid = window.ownerData.billbook.detailAssGuid;
					$('#btnSave').attr("disabled", true);
					dm.doSaveBadAccount(argu, function(result) {

						if(result.flag == 'success') {
							ufma.showTip(result.msg, function() {
								_close("save");
							}, 'success');
						} else {
							$('#btnSave').attr("disabled", false);
						}

					});
				});
			},
			payerAgency: function() {
				$('#payerAgency').ufTreecombox({
					idField: 'id',
					textField: 'codeName',
					readonly: false,
					data: window.ownerData.payerAgencyData,
					onComplete: function(sender) {}
				});
			},
			//请求票据类型
			billType: function() {

				$('#billType').ufTreecombox({
					idField: "id",
					textField: "codeName",
					readonly: false,
					data: window.ownerData.billTypeData
				});
			},
			//初始化页面
			initPage: function() {
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
				//请求往来单位
				page.payerAgency();
				page.billType();
				$('#billfaceAmount').amtInput();
				$('#billfaceRate').amtInput();
				//set form
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