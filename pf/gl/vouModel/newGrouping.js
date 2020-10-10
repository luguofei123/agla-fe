$(function () {
	window._close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {},
				id: vouGroundSavedid
			};
			window.closeOwner(data);
		}
	}
	var vouGroundSavedid;
	var page = function () {
		return {
			//保存凭证模板
			save: function () {
				ufma.showloading('正在保存分组，请耐心等待...');
				var argu =
					{
						groupCode: $("#groupCode").val(),
						groupName: $("#groupName").val(),
						pId: window.ownerData.pId,
						accsCode: window.ownerData.accsCode,
						agencyCode: window.ownerData.agencyCode,
						setYear: window.ownerData.setYear,
						acctCode: window.ownerData.acctCode,
						rgCode: window.ownerData.rgCode,
						groupLev: window.ownerData.groupLev + 1,
						groupSeq: 0
					}
				var callback = function (result) {
					if (result.flag == 'success') {
						ufma.showTip('保存成功！', function () {
							ufma.hideloading();
							_close();
						}, 'success');
					}
				};
				ufma.post("/gl/vouTemp/saveTemGroup", argu, callback);
			},
			editGroup: function () {
				var argu =
					{
						groupCode: $("#groupCode").val(),
						groupName: $("#groupName").val(),
						pId: window.ownerData.pId,
						id: window.ownerData.id,
						accsCode: window.ownerData.accsCode,
						agencyCode: window.ownerData.agencyCode,
						setYear: window.ownerData.setYear,
						acctCode: window.ownerData.acctCode,
						rgCode: window.ownerData.rgCode,
						groupLev: window.ownerData.groupLev,
						groupSeq: window.ownerData.selectTreeObj.seq
					}
				var callback = function (result) {
					if (result.flag == 'success') {
						ufma.showTip('保存成功！', function () {
							ufma.hideloading();
							_close();
						}, 'success');
					}
				};
				ufma.post("/gl/vouTemp/updateTemGroup", argu, callback);
			},
			getOneDetail: function () {
				$("#groupCode").val(window.ownerData.groupCode);
				$("#groupName").val(window.ownerData.groupName);
			},
			initPage: function () {
				if (window.ownerData.action == "edit") {
					page.getOneDetail();
					if (window.ownerData.selectTreeObj.agencyCode == "*") {
						$("#btn-save").addClass("hide");
					} else {
						$("#btn-save").removeClass("hide");
					}
				}
			},
			onEventListener: function () {
				$('#btn-save').click(function () {
					$("#btn-save").attr("disabled", true)
					if (window.ownerData.action == "add") {
						page.save();
					} else if (window.ownerData.action == "edit") {
						page.editGroup();
					}
					var timeId = setTimeout(function () {
						$("#btn-save").attr("disabled", false)
						clearTimeout(timeId);
					}, 5000);
				});
				$('#btn-cancle').click(function () {
					_close('ok', "");
				});
			},
			// 此方法必须保留
			init: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.pfData = ufma.getCommonData();
				ufma.parse();
				this.initPage();
				this.onEventListener();
			}
		}
	}();
	page.init();
});
