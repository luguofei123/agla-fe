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
				var apportionType = $('#apportionType').getObj().getValue();
				var fylxCode = $('#fylxCode').getObj().getValue();
				var occurDate = $('#occurDate').getObj().getValue();
				var startDate = $('#startDate').getObj().getValue();
				var endDate = $('#endDate').getObj().getValue();
				var apportionMoney = $('#apportionMoney').val();
				var apportionPeriod = $('#apportionPeriod').val();
				if(!$.isNull(apportionType) && !$.isNull(fylxCode) &&
					!$.isNull(occurDate) && !$.isNull(startDate) &&
					!$.isNull(endDate) && !$.isNull(apportionMoney) && !$.isNull(apportionPeriod)) {
					state = "1";
				} else {
					state = "0";
				}
			},
			bookingSave: function(type) {
				page.isNull();
				var argu = $('#frmBookIn').serializeObject();
				if(!argu.apportionMoney||parseInt(argu.apportionMoney)==0){
					ufma.showTip('摊销金额不能为0', function() {
					}, 'error');
					return ;
				}
				argu.bookGuid = window.ownerData.mainData.bookGuid || '';
				argu.agencyCode = window.ownerData.mainData.agencyCode;
				argu.acctCode = window.ownerData.mainData.acctCode;
				argu.setYear = window.ownerData.mainData.setYear;
				argu.rgCode = window.ownerData.mainData.rgCode;
				$("button").attr("disabled", true);
				if(state == "1") {
					if(window.ownerData.mainData.bookGuid) {
						dm.bookEdit(argu, function(result) {
							ufma.showTip(result.msg, function() {
								_close();
							}, result.flag);
						});
					} else {
						dm.bookIn(argu, function(result) {
							if(type == "1") {
								//保存
								ufma.showTip(result.msg, function() {
									_close();
								}, result.flag);
							} else if(type == "2") {
								//保存并新增
								ufma.showTip(result.msg, function() {
									$('#frmBookIn')[0].reset(); //表单置空
									var timeId = setTimeout(function() {
										$('#fylxCode').getObj().load(page.fylxData);
										$('#fylxCode').getObj().val('1');

										$('#apportionType').getObj().load(page.apportionTypeData);
										$('#apportionType').getObj().val('1');
										clearTimeout(timeId);
									}, 300);

									$('.uf-datepicker').getObj().setValue(new Date());
								}, result.flag);

							}
						});
					}
				} else if(state == "0") {
					ufma.showTip("必填项不能为空", function() {
						return false;
					}, "warning");
				}

				var timeId = setTimeout(function() {
					$("button").attr("disabled", false);
					clearTimeout(timeId)
				}, 5000)
			},
			//初始化日历控件
			initDatePicker: function() {
				var signInDate = new Date(ptData.svTransDate),
					y = signInDate.getFullYear(),
					m = signInDate.getMonth();
				$('.uf-datepicker').ufDatepicker({
					format: 'yyyy-mm-dd',
					//viewMode:'month',
					initialDate: signInDate
				});

			},

			onEventListener: function() {
				$('#btnClose').click(function() {
					_close();
				});
				$('#btnSave').click(function() {
					page.bookingSave("1");
				});
				$('#coaAccSaveAddAll').click(function() {
					page.bookingSave("2");
				});
			},
			//初始化页面
			initPage: function() {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initDatePicker();
				dm.cbbDPEType({}, function(result) {
					$('#apportionType').getObj().load(result.data);
					$('#apportionType').getObj().val('1');
					page.apportionTypeData = result.data;
				});
				dm.cbbFeeType({
					agencyCode: window.ownerData.mainData.agencyCode
					//setYear: window.ownerData.setYear,
					//rgCode: window.ownerData.rgCode
				}, function(result) {
					$('#fylxCode').ufTreecombox({
						idField: "id",
						textField: "codeName",
						pIdField: "pId",
						readonly: false,
						leafRequire: true,
						data: result.data
					});
					page.fylxData = result.data;
					$('#fylxCode').getObj().val('01');
				});

				$('#apportionMoney').amtInput();
				$('#apportionPeriod').intInput();

				if(window.ownerData.mainData.apportionType && window.ownerData.mainData.fylxCode) {
					$('#frmBookIn').setForm(window.ownerData.mainData);
					$("#coaAccSaveAddAll").css("display", "none");
				}
				$('.state-edit')[window.ownerData.mainData.status != '01' ? 'addClass' : 'removeClass']('none');
				//bug79669--zsj--禁用
				if(window.ownerData.mainData.status != '01'){
					$('#frmBookIn').disable();
					$('#fylxCode').getObj().setEnabled(false);
					$('.icon-calendar').hide();
				}else{
					$('#frmBookIn').enable();
					$('#fylxCode').getObj().setEnabled(true);
					$('.icon-calendar').show();
				}
			},

			init: function() {
				//获取session
				ptData = ufma.getCommonData();
				this.initPage();
				this.onEventListener();
				uf.parse();
				ufma.parse();
			}
		}
	}();

	page.init();
});