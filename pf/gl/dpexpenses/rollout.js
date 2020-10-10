$(function() {
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
	};
	var page = function() {
		var ptData = {};
		return {
			onEventListener: function() {
				$('#btnClose').click(function() {
					_close();
				});
				$('#btnSave').click(function() {
					//page.isNull();
					var argu = {};
					argu.bookGuid = window.ownerData.mainData.bookGuid;
					//argu.apportionMoney = $('#rolloutMoney').val().replace(/,/g, "");
					argu.outMoney = $('#rolloutMoney').val().replace(/,/g, ""); //bug78329--zsj
					argu.apportionDate = $('#apportionDate').getObj().getValue();
					$('button').attr("disabled", true);
					dm.rollout(argu, function(result) {
						ufma.showTip(result.msg, function() {
							_close();
						}, result.flag);

					});
					var timeId = setTimeout(function() {
						$('button').attr("disabled", false);
						clearTimeout(timeId);
					}, 5000)
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				dm.cbbDPEType({}, function(result) {
					$('#apportionType').getObj().load(result.data);
				});
				dm.cbbFeeType({
					agencyCode: window.ownerData.mainData.agencyCode
					//setYear: window.ownerData.mainData.setYear,
					//rgCode: window.ownerData.mainData.rgCode
				}, function(result) {
					$('#fylxCode').ufTreecombox({
						idField: "id",
						textField: "codeName",
						pIdField: "pId",
						readonly: false,
						leafRequire: true,
						data: result.data
					});
				});

				$('#apportionMoney,#apportionedMoney,#rolloutMoney').amtInput();
				$('#apportionPeriod,#apportionedPeriod').intInput();
				$('#frmBookIn').setForm(window.ownerData.mainData);
				setTimeout(function() {
					$('#frmBookIn').disable();
					$("input[name='remark']").attr("disabled", false);
					$('#rolloutMoney').val(window.ownerData.mainData.apportionMoney - window.ownerData.mainData.apportionedMoney).trigger('blur');
					if(window.ownerData.detailData.apportionedPeriod) {
						$('#apportionDate').getObj().setValue(window.ownerData.detailData.apportionDate);
					}
					//bug79669--zsj--禁用
					if(window.ownerData.mainData.status == '03') {
						$('#frmRollout').disable();
						$("input[name='remark']").attr("disabled", true);
						$('#apportionDate span').addClass('hide');
						$('#apportionDate input').attr('disabled', true);
					} else {
						$('#frmRollout').enable();
						$('#apportionDate input').attr('disabled', false);
						$("input[name='remark']").attr("disabled", false);
						$('#apportionDate span').removeClass('hide');
					}
				}, 300);
				$('.state-edit')[window.ownerData.mainData.status == '03' ? 'addClass' : 'removeClass']('none');
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