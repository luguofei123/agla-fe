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
            /*initDatePicker: function () {
                $('#vouDate').ufDatepicker({
                    format: 'yyyy-mm-dd',
                    //viewMode:'month',
                    initialDate: new Date()
                });
                $('#vouDate').css("width", "160px");
            },*/
            //setForm
            setForm: function () {
                $('#frmBookIn').setForm(window.ownerData.billbook);
                $('#frmBookIn').find('input[name="acco"]').val(window.ownerData.billbook.accoName);
                $('#frmBookIn').disable();

                //修改时给$('#frmBookIn2')set值
                // if (window.ownerData.action == "editData") {
                //     $('#frmBookIn2').setForm(window.ownerData.billBookAss);
                // }

                $('#receivableType').val('坏账确认');
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
                    idField: "code",
                    textField: "codeName",
                    pIdField: 'pCode', //可选
                    readonly: false,
                    leafRequire: true,
                    data: window.ownerData.billTypeData
                });
            },
            //请求坏账原因
            getBadReason:function () {
                dm.getBadReason("",function (result) {
                    $('#badReason').ufCombox({
                        idField: "ENU_CODE",
                        textField: "codeName",
                        readonly: false,
                        placeholder:"请选择坏账原因",
                        data:result.data
                    });
                    $('#badReason').getObj().val("001");
                })
            },
            //初始化页面
            initPage: function () {
                //请求往来单位
                page.currentCode();
                //请求票据类型
                page.billType();
                //请求坏账原因
                page.getBadReason();
                $('#restMoney').amtInput();
                $('#stadAmt').amtInput();
                $('#cancelMoney').amtInput();
                $('input[name="badMoney"]').amtInput();
                //set form
                page.setForm();
                $("input").attr("autocomplete","off");
            },
            onEventListener: function () {
                $('#btnClose').click(function () {
                    _close();
                });
                $('#btnSave').click(function () {
                    $('#btnSave').attr("disabled", true);
                    var argu = $('#frmBookIn2').serializeObject();
                    argu.badType = "1";
                    argu.badReason = $('#badReason').getObj().getValue();
                    argu.detailAssGuid = window.ownerData.billbook.detailAssGuid;
                    argu.agencyCode = window.ownerData.billbook.agencyCode;
                    if(argu.badMoney == ""){
                        ufma.showTip("坏账确认金额不能为空", function () {
                        }, 'warning');
                        $('#btnSave').attr("disabled", false);
                        return false;
                    }
                    if(argu.badReason == ""){
                        ufma.showTip("坏账原因不能为空", function () {
                        }, 'warning');
                        $('#btnSave').attr("disabled", false);
                        return false;
                    }
                    dm.doSaveBadAccount(argu, function (result) {

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