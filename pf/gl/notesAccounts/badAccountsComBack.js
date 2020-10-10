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
			//初始化日历
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