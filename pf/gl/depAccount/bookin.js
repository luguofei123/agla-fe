$(function () {
	window._close = function (state) {
		if (window.closeOwner) {
			var data = {
				action: state,
				result: {}
			};
			window.closeOwner(data);
		}
	};
	var page = function () {
		var ptData = {};
		var agencyCode;
		return {
			//清空弹窗 
			clearAll: function () {
				$('#billNo,#depositMoney,#remark').val(""); //input框的清空
				$('#currentCode,#billtypeCode').getObj().clear(); //下拉框清空
			},
            //初始化日历控件
            initDatePicker: function () {
                var signInDate = new Date(ptData.svTransDate),y = signInDate.getFullYear(), m = signInDate.getMonth();
                $('#occurDate').ufDatepicker({
                    format: 'yyyy-mm-dd',
                    //viewMode:'month',
                    initialDate: signInDate
                });

            },
			onEventListener: function () {
				$('#btnClose').click(function () {
					_close('ok');
				});
				//保存
				$('#btnSave').click(function () {
					if (window.ownerData.action == "add") {   //新增保存
						var argu = $('#frmBookIn').serializeObject();
						argu.agencyCode = window.ownerData.agencyCode;
						argu.acctCode = window.ownerData.acctCode;
						argu.setYear = window.ownerData.setYear;
						argu.rgCode = window.ownerData.rgCode;
					} else {   //编辑保存
						var argu = $('#frmBookIn').serializeObject();
						argu.guid = window.ownerData.detailData.depositGuid;
						argu.money = argu.depositMoney;
						argu.status = window.ownerData.rowData.status;
					}
					if(argu.depositMoney=='' || parseFloat(argu.depositMoney)==0){
						ufma.showTip('预收金额不能为空')
						return false
					}
					if(argu.currentCode==0 ){
						ufma.showTip('往来单位不能为空')
						return false
					}
					if(argu.occurDate==0){
						ufma.showTip('发生日期不能为空')
						return false
					}
					$("button").attr("disabled",true);
					dm.doSave(argu, function (result) {
                        ufma.showTip(result.msg, function () {
                            _close('ok');
                        }, result.flag);

					});
					var timeId = setTimeout(function () {
                        $("button").attr("disabled",false);
                        clearTimeout(timeId)
                    },5000);
				});
				//保存并新增
				$('#btnSaveAdd').click(function () {
					if (window.ownerData.action == "add") {
						var argu = $('#frmBookIn').serializeObject();
						argu.agencyCode = window.ownerData.agencyCode;
						argu.acctCode = window.ownerData.acctCode;
						argu.setYear = window.ownerData.setYear;
						argu.rgCode = window.ownerData.rgCode;
					} else {
						var argu = $('#frmBookIn').serializeObject();
						argu.guid = window.ownerData.detailData.depositGuid;
						argu.money = argu.depositMoney;
						argu.status = window.ownerData.rowData.status;
					}
					if(argu.depositMoney=='' || parseFloat(argu.depositMoney)==0){
						ufma.showTip('预收金额不能为空')
						return false
					}
					if(argu.currentCode==0 ){
						ufma.showTip('往来单位不能为空')
						return false
					}
					if(argu.occurDate==0){
						ufma.showTip('发生日期不能为空')
						return false
					}
					dm.doSave(argu, function (result) {
						if (result.flag == "success") {
							ufma.showTip('保存成功', function () {
								page.clearAll();
								window.parent.isupdate =1
							}, 'success');
						}
					});
				});
			},
			//初始化页面
			initPage: function () {
				page.reslist = ufma.getPermission();
				ufma.isShow(page.reslist);
				page.initDatePicker();
                //票据类型
                var argu = {
                    agencyCode: page.agencyCode,
                    setYear: ptData.svSetYear,
                    rgCode: ptData.svRgCode,
                    eleCode:"BILLTYPE"
                };
				dm.cbbBillType(argu, function (result) {
					$('#billtypeCode').ufTreecombox({
                        idField: 'code',
                        textField: 'codeName',
                        pIdField: 'pCode', //可选
						readonly: false,
                        placeholder: '请选择票据类型',
                        leafRequire: true,
                        data: result.data
                    });
				});
                var argu2 = {
                    agencyCode: page.agencyCode,
                    setYear: ptData.svSetYear,
                    rgCode: ptData.svRgCode,
                    eleCode:"CURRENT"
                };
				dm.cbbCurrent(argu2, function (result) {
					$('#currentCode').ufTreecombox({
                        idField: 'code',
                        textField: 'codeName',
                        pIdField: 'pCode', //可选
						readonly: false,
                        placeholder: '请选择往来单位',
                        leafRequire: true,
                        data: result.data
                    });
				});
				if (!$.isNull(window.ownerData.rowData)) {
					if (window.ownerData.rowData.status != '01') {
						var timeId = setTimeout(function () {
							$('#frmBookIn').disable();
							clearTimeout(timeId);
						}, 500);
						$('#btnSaveAdd').addClass('disabled');
						$('#btnSave').addClass('disabled');
					} else {
						$('#btnSaveAdd').removeClass('disabled');
						$('#btnSave').removeClass('disabled');
					}
				}
				
				$('#depositMoney').amtInput();
				$('#billNo').intInput(); //票据号不可输入汉字,可输入数字,字母
			    $('#frmBookIn').setForm(window.ownerData.rowData);
			},

			init: function () {
				//获取session
				ptData = ufma.getCommonData();
				if (window.ownerData.action == "add") {
					page.agencyCode = window.ownerData.agencyCode;
				} else {
					page.agencyCode = window.ownerData.rowData.agencyCode;
				}


				this.initPage();
				this.onEventListener();
				uf.parse();
			}
		}
	}();

	page.init();
});