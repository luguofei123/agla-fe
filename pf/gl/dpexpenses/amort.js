$(function() {
	window._close = function() {
		if(window.closeOwner) {
			window.closeOwner();
		}
	};
	var page = function() {
		var ptData = {};
		var state; //判断必填项是否为空
		return {
			//必填项是否为空
			isNull: function() {
				var apportionDate = $('#apportionDate').getObj().getValue(); //摊销日期
				var apportioningPeriod = $('#apportioningPeriod').val(); //摊销期
				var apportioningMoney = $('#apportioningMoney').val(); //摊销金额
				if(!$.isNull(apportionDate) && !$.isNull(apportioningPeriod) && !$.isNull(apportioningMoney)) {
					state = "1";
				} else {
					state = "0";
				}
			},
			onEventListener: function() {
				$('#btnClose').click(function() {
					_close();
				});
				$('#coaAccSaveAddAll').click(function(){
					page.isNull();
					var argu = {};
					argu.detailGuid = window.ownerData.detailData.detailGuid;
					argu.bookGuid = window.ownerData.mainData.bookGuid;
					argu.apportionMoney = $('#apportioningMoney').val().replace(/,/g, "");
					argu.apportionPeriod = $('#apportioningPeriod').val();
					argu.apportionDate = $('#apportionDate').getObj().getValue();
					if(state == "1") {
						if(window.ownerData.detailData.detailGuid) {
							dm.amortEdit(argu, function(result) {
								ufma.showTip(result.msg, function() {
									_close();
								}, result.flag);
							});
						} else {
							dm.amort(argu, function(result) {
								//保存并新增
								ufma.showTip(result.msg, function() {
									_close();
									// $('#frmBookIn')[0].reset(); //表单置空
									// var timeId = setTimeout(function() {
									// 	// 费用类型初始化为'01'
									// 	$('#fylxCode').getObj().load(page.fylxData);
									// 	$('#fylxCode').getObj().val('01');
									// 	// 摊销类型初始化为'1'
									// 	$('#apportionType').getObj().load(page.apportionTypeData);
									// 	$('#apportionType').getObj().val('1');
									// 	clearTimeout(timeId);
									// }, 300);

									// $('.uf-datepicker').getObj().setValue(new Date());
								}, result.flag);
							});
						}
					} else if(state == "0") {
						ufma.showTip("必填项不能为空", function() {
							return false;
						}, "warning");
					}
				})
				$('#btnSave').click(function() {
					page.isNull();
					var argu = {};
					argu.detailGuid = window.ownerData.detailData.detailGuid;
					argu.bookGuid = window.ownerData.mainData.bookGuid;
					argu.apportionMoney = $('#apportioningMoney').val().replace(/,/g, "");
					argu.apportionPeriod = $('#apportioningPeriod').val();
					argu.apportionDate = $('#apportionDate').getObj().getValue();
					if(state == "1") {
						if(window.ownerData.detailData.detailGuid) {
							dm.amortEdit(argu, function(result) {
								_close();
							});
						} else {
							dm.amort(argu, function(result) {
								_close();
							});
						}
					} else if(state == "0") {
						ufma.showTip("必填项不能为空", function() {
							return false;
						}, "warning");
					}
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				dm.cbbDPEType({}, function(result) {
					$('#apportionType').getObj().load(result.data);
					// $('#apportionType').getObj().val('1');
					page.apportionTypeData = result.data;
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
						data: result.data,
						onComplete: function() {}
					});
					page.fylxData = result.data;
					// $('#fylxCode').getObj().val('01');
				});

				$('#apportionMoney,#apportionedMoney,#apportioningMoney').amtInput();
				$('#apportionPeriod,#apportionedPeriod,#apportioningPeriod').intInput();
				$('#frmBookIn').setForm(window.ownerData.mainData);
				setTimeout(function() {
					$('#frmBookIn').disable();
					if(!window.ownerData.detailData.detailGuid) {
						$('#apportioningPeriod').val(window.ownerData.mainData.apportionedPeriod + 1).trigger('blur');
						var money = $.formatMoney(window.ownerData.mainData.apportionMoney / window.ownerData.mainData.apportionPeriod, 2);
						var newMoney = money.replace(/,/g, "");
						$('#apportioningMoney').val(newMoney).trigger('blur');
					} else {
						$('#apportioningPeriod').val(window.ownerData.detailData.apportionPeriod).trigger('blur');
						$('#apportionDate').getObj().setValue(window.ownerData.detailData.apportionDate);
						$('#apportioningMoney').val(window.ownerData.detailData.apportionMoney).trigger('blur');
					}
					//bug79669--zsj--禁用
					if(window.ownerData.mainData.status == '03') {
						$('#frmAmort').disable();
						$('#apportionDate span').addClass('hide');
						$('#apportionDate input').attr('disabled', true);
					} else {
						$('#frmAmort').enable();
						$('#apportionDate input').attr('disabled', false);
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