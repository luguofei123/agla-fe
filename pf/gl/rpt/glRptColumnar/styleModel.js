$(function () {
    window._close = function (data) {
        window.closeOwner(data);
    };

    var flag = 0;
    var page = function () {
        var formGuid;
        return {
            //获取格式内容
            getOneStyle: function () {
                var argu = {
                    "acctCode": window.ownerData.acctCode,
                    "agencyCode": window.ownerData.agencyCode,
                    "setYear": window.ownerData.setYear,
                    "formCode": window.ownerData.formCode,
                    "userId": window.ownerData.userId,
                    "rptType": "GL_RPT_COLUMNAR"
                };
                var url = "/gl/rpt/columnarSet/getFormcontent";
                ufma.ajaxDef(url, "get", argu, function (result) {
                    formGuid = result.data.formGuid;
                    $("#formName").val(result.data.formName);
                    var cont = eval('(' + result.data.formContent + ')');
                    $('#frmBookIn').setForm(cont);
                });
            },
            //获取多栏账展开项
            getItemList: function () {
                var resData = JSON.parse(JSON.stringify(window.ownerData.accItemTypeList)); // 辅助项列表数组
                var accListArr = JSON.parse(JSON.stringify(window.ownerData.accListArr)); // 页面中辅助项已选的数组
                // 辅助项中选择后 格式弹框的展开项不展示
                for (var i = 0; i < resData.length; i++) {
                    for (var j = 0; j < accListArr.length; j++) {
                        if (resData[i].accItemCode === accListArr[j]) {
                            resData.splice(i, 1);
                            i--;
                        }
                    }
                }
                $('#extendItems').ufTreecombox({
                    idField: 'accItemCode',
                    textField: 'accItemName',
                    leafRequire: true,
                    data: resData,
                    onComplete: function (sender) {
                        for (var i = 0; i < resData.length; i++) {
                            if (resData[i].isLeaf == "1") {
                                $('#extendItems').getObj().val(resData[i].code);
                                break;
                            }
                        }
                    },
                    onChange:function(sender,data){
                        //bug81675--多栏账设置格式，切换展开项后，借贷方应清空--zsj
                        if (flag === 0) {
                            flag += 1;
                        } else {
                            $("#frmBookIn").find('input[name="lCrItemCodes"]').val("");
                            $("#frmBookIn").find('input[name="lDrItemCodes"]').val("");
                        }
                    }
                });
            },
            showHideTree: function (dom, code, text) {
                var params = {
                    "acctCode": window.ownerData.acctCode,
                    "agencyCode": window.ownerData.agencyCode,
                    "accsCode": window.ownerData.accsCode,
                    "setYear": window.ownerData.setYear,
                    "userId": window.ownerData.userId
                }
                if (code === 'ACCO') {
                    params.chrCodeLike = window.ownerData.accoCode;
                }
                params.accItemCode = code
                ufma.open({
                    url: bootPath + '/pub/baseTreeSelect/baseTreeSelect.html',
                    title: '选择' + text,
                    width: 580,
                    height: 545,
                    data: {
                        'flag': code,
                        'rootName': text,
                        'leafRequire': false,
                        'data': params,
                        'checkbox': true
                    },
                    ondestory: function (result) {
                        if (result.action) {
                            var input = $(dom).closest(".rpt-p-search-key").find("input[class='form-control']");
                            var valList = [],
                                codeList = [];
                            for (var i = 0; i < result.data.length; i++) {
                                valList.push(result.data[i].codeName);
                                codeList.push(result.data[i].code);
                            }
                            $(input).val(valList.join(','));
                            $(input).attr('code', codeList.join(','));
                            $.data($(input), 'data', result.data);
                        };
                    }
                });
            },
            //初始化页面
            initPage: function () {
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                page.getItemList();
                if (window.ownerData.action == 'edit') {
                    $("#btnAddStyle").removeClass("hide");
                    page.getOneStyle();
                }
            },

            onEventListener: function () {
                //格式弹窗 取消按钮
                $('#btnQuit').on('click', function () {
                    _close();
                })
                //格式弹窗 删除按钮
                $('#btnDelete').on('click', function () {
                    var argu = {
                        "userId": window.ownerData.userId,
                        "setYear": window.ownerData.setYear,
                        "agencyCode": window.ownerData.agencyCode,
                        "rptType": "GL_RPT_COLUMNAR",
                        "formCode": window.ownerData.formCode
                    };
                    var callback = function (result) {
                        ufma.showTip(result.msg, function () {
                            _close(true);
                        }, result.flag);
                    };
                    //系统级没有账套
                    ufma.delete("/gl/rpt/columnarSet/deleteForm", argu, callback);
                })
                //打开展开项弹窗
                $("#DrItems,#CrItems").on("click", '.search-btn', function (e) {
                    e.stopPropagation();
                    var code = $('#extendItems').getObj().getValue();
                    var text = $('#extendItems').getObj().getText();
                    if (!$.isNull(code)) {
                        page.showHideTree(this, code, text);
                    } else {
                        ufma.showTip("请先选择展开项!", function () { }, 'warning');
                    }
                })
                //保存格式
                $('#btnSaveStyle').on('click', function (e) {
                    var argu = {};
                    var formCode = window.ownerData.formCode;
                    if (!$.isNull(formCode)) { // 传这两个字段为编辑 不传为新增
                        argu.formGuid = formGuid;
                        argu.formCode = formCode;
                    }
                    argu.agencyCode = window.ownerData.agencyCode;
                    argu.setYear = window.ownerData.setYear;
                    argu.rgCode = window.ownerData.rgCode;
                    argu.userId = window.ownerData.userId;
                    argu.acctCode = window.ownerData.acctCode;
                    argu.accoCode = window.ownerData.accoCode;
                    argu.formContent = $('#frmBookIn').serializeObject();
                    argu.formContent.lCrItemCodes = argu.formContent.lCrItemCodes;
                    argu.formContent.lDrItemCodes = argu.formContent.lDrItemCodes;
                    argu.formName = $('#frmBookIn').serializeObject().formName;
                    delete argu.formContent.formName;
                    argu.formContent.isShowOtherCol = "N";
                    argu.rptType = "GL_RPT_COLUMNAR";
                    argu.formScope = "N";
                    var callback = function (result) {
                        ufma.showTip(result.msg, function () {
                            if (result.flag == 'success') {
                                _close(true);
                            }
                        }, result.flag);
                    };
                    //系统级没有账套
                    ufma.post("/gl/rpt/columnarSet/saveSet", argu, callback);
                });
                // 另存为新格式
                $('#btnAddStyle').on('click', function (e) {
                    var argu = {};
                    argu.agencyCode = window.ownerData.agencyCode;
                    argu.setYear = window.ownerData.setYear;
                    argu.rgCode = window.ownerData.rgCode;
                    argu.userId = window.ownerData.userId;
                    argu.acctCode = window.ownerData.acctCode;
                    argu.accoCode = window.ownerData.accoCode;
                    argu.formContent = $('#frmBookIn').serializeObject();
                    argu.formContent.lCrItemCodes = argu.formContent.lCrItemCodes;
                    argu.formContent.lDrItemCodes = argu.formContent.lDrItemCodes;
                    argu.formName = $('#frmBookIn').serializeObject().formName;
                    delete argu.formContent.formName;
                    argu.formContent.isShowOtherCol = "N";
                    argu.rptType = "GL_RPT_COLUMNAR";
                    argu.formScope = "N";
                    var callback = function (result) {
                        ufma.showTip(result.msg, function () {
                            if (result.flag == 'success') {
                                _close(true);
                            }
                        }, result.flag);
                    };
                    //系统级没有账套
                    ufma.post("/gl/rpt/columnarSet/saveSet", argu, callback);
                });
            },

            //此方法必须保留
            init: function () {
                ufma.parse();
                this.initPage();
                this.onEventListener();
            }
        }
    }();

    /////////////////////
    page.init();
});