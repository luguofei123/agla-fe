$(function () {
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {
                action: action
            };
            window.closeOwner(data);
        }
    };
    var page = function () {
        var ptData = {};
        return {
            //初始化日历
            initDatePicker: function () {
                $('#expiryDate').ufDatepicker({
                    format: 'yyyy-mm-dd',
                    //viewMode:'month',
                    initialDate: new Date()
                });
                $('#expiryDate').css("width", "160px");
            },
            //setForm
            setForm: function () {
                $('#frmBookIn').setForm(window.ownerData.billbook);
                $('#frmBookIn').find('input[name="acco"]').val(window.ownerData.billbook.accoName);
                $('#frmBookIn').disable();

                //修改时给$('#frmBookIn2')set值
                if (window.ownerData.action == "editData") {
                    $('#frmBookIn2').setForm(window.ownerData.billBookAss);
                }

                $('#receivableType').val('应付款');
            },
            onEventListener: function () {
                $('#btnClose').click(function () {
                    _close();
                });
                $('#btnSave').click(function () {
                    $('#btnSave').attr("disabled", true);
                    var argu = $('#frmBookIn2').serializeObject();
                    argu.detailAssGuid = window.ownerData.billbook.detailAssGuid;
                    argu.agencyCode = window.ownerData.billbook.agencyCode;
                    if(argu.backMoney == ""){
                        ufma.showTip("收回金额不能为空", function () {
                        }, 'warning');
                        $('#btnSave').attr("disabled", false);
                        return false;
                    }
                    if(argu.backReason == ""){
                        ufma.showTip("收回原因不能为空", function () {
                        }, 'warning');
                        $('#btnSave').attr("disabled", false);
                        return false;
                    }

                    dm.doSaveAccountBack(argu, function (result) {

                        if (result.flag == 'success') {
                            ufma.showTip(result.msg, function () {
                                _close("save");
                            }, 'success');
                        }

                    });
                    var timeId = setTimeout(function () {
                        $('#btnSave').attr("disabled", false);
                        clearTimeout(timeId);
                    },5000);
                });
            },
            currentCode: function () {
                $('#currentCode').ufTreecombox({
                    idField: 'code',
                    textField: 'codeName',
                    pIdField: 'pCode', //可选
                    readonly: false,
                    leafRequire: true,
                    data: window.ownerData.payerAgencyData,
                    onComplete: function (sender) {
                    }
                });
            },
            //请求票据类型
            billType: function () {

                $('#billType').ufTreecombox({
                    idField: 'code',
                    textField: 'codeName',
                    pIdField: 'pCode', //可选
                    readonly: false,
                    leafRequire: true,
                    data: window.ownerData.billTypeData
                });
            },
            //初始化页面
            initPage: function () {
                //请求往来单位
                page.currentCode();
                page.billType();
                $('#restMoney').amtInput();
                $('#stadAmt').amtInput();
                $('#cancelMoney').amtInput();
                $('input[name="backMoney"]').amtInput();
                //set form
                page.setForm();
                $("input").attr("autocomplete","off");
            },

            init: function () {
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