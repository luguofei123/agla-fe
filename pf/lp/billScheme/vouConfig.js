$(function () {
    window._close = function (action,resultData) {
        if (window.closeOwner) {
            var data = {
                action: action,
                resultData:resultData
            };
            window.closeOwner(data);
        }
    };
    //获取公式编辑器返回来的值并set到页面相应的位置
    window.setData = function (data) {
        page.setFormulaEditorData(data);
    };
    var onerdata = window.ownerData;
    var datachneng = [];
    var pfData = ufma.getCommonData();
    var isFirstFlag = true;
    //接口URL集合
    var interfaceURL = {
        getShowField: "/lp/scheme/getJointSearchColumn",//单位类型列表
    };
    var page = function () {
        return {
            //初始化联查字段
            initQueryField: function () {
                $("#queryField").ufCombox({
                    idField: "code",
                    textField: "codeName",
                    placeholder: "请选择联查字段",
                    onChange: function (sender, data) {

                    }
                });
            },
            //获取显示字段数据
            getQueryField: function () {
                var argu = {
                    rgCode: pfData.svRgCode,
                    setYear: pfData.svSetYear
                };
                ufma.get(interfaceURL.getShowField, argu, page.getQueryFieldList);
            },
            //请求后渲染显示字段
            getQueryFieldList: function (result) {
                $("#queryField").ufCombox({
                    data: result.data, //json 数据
                    onComplete: function (sender) {

                    }
                });
            },
            //初始化显示字段
            initShowField: function () {
                $("#showField").ufCombox({
                    idField: "code",
                    textField: "codeName",
                    placeholder: "请选择显示字段",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {

                    }
                });
            },
            //获取显示字段数据
            getShowField: function () {
                var argu = {
                    rgCode: pfData.svRgCode,
                    setYear: pfData.svSetYear
                };
                ufma.get(interfaceURL.getShowField, argu, page.getShowFieldList);
            },
            //请求后渲染显示字段
            getShowFieldList: function (result) {
                $("#showField").ufCombox({
                    data: result.data, //json 数据
                    onComplete: function (sender) {

                    }
                });
            },
            //初始化页面
            initPage: function () {
                if (window.ownerData.action == "editBill") {
                    setTimeout(function () {
                        //一定要加延时处理
                        $("#formData").setForm(window.ownerData.vouFonfigEdit);
                    }, 300);
                }

                // 初始化显示字段
                page.initShowField();
                page.getShowField();
                //初始化联查字段
                page.initQueryField();
                page.getQueryField();
            },
            onEventListener: function () {
                $(document).on("click", "#btn-qx", function () {
                    _close();
                });
                $(document).on("click", "#btnsave", function () {
                    var resultData =  $("#formData").serializeObject();
                    _close('save',resultData);
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
    page.init();

});