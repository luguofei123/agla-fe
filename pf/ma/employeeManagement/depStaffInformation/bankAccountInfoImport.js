/*！！！银行账户信息导入功能 废弃！！！*/
var guid = "";
var tableHeadName = [];
$(function () {

    window._close = function (action) {
        if (window.closeOwner) {
            var data = {
                action: action
            };
            window.closeOwner(data);
        }
    };
    //获取年度，区域并赋值 S
    var svData = ufma.getCommonData();
    var ownerData = window.ownerData;
    $("#setYear").val(svData.svSetYear);
    $("#rgCode").val(svData.svRgCode);
      
    //接口URL集合
    var interfaceURL = {
        downloadModel: '/pub/file/downloadModel',//下载模板
        uploadExcel: "/ma/emp/maEmp/impBankAccountInfoExcel"//导入
    };
    var page = function () {
        return {
            //初始化页面
            initPage: function () {
            },
            //页面元素事件绑定使用jquery 的 on()方法
            onEventListener: function () {
                //取消
                $(document).on("click", "#btn-cancle", function (e) {
                    _close("cancel");
                });
                //关闭
                $(document).on("click", "#btn-close", function (e) {
                    _close("close", {});
                });
                //选择上传文件
                $(".file-upload-box-btn").on("change", ".file-upload-input", function () {
                    var oldFile = $(".file-upload-title span").text();
                    // var filePath = $(this).val();
                    var filePath = this.files[0].name;
                    var $box = $(this).parents(".file-upload-box");
                    if (filePath != "") {
                        $box.find(".file-upload-tip").hide();
                        $box.find(".file-upload-title").show().find("span").text(filePath);
                    } else {
                        if (oldFile != "") {
                            $box.find(".file-upload-tip").hide();
                            $box.find(".file-upload-title").show().find("span").text(oldFile);
                        } else {
                            $box.find(".file-upload-tip").show();
                            $box.find(".file-upload-input").hide().find("span").text(filePath);
                        }
                    }
                });
                //删除文件
                $(".file-upload-title .icon-close").on("click", function () {
                    var $box = $(this).parents(".file-upload-box");
                    $box.find(".file-upload-tip").show();
                    $box.find(".file-upload-title").hide().find("span").text("");
                    $box.find(".file-upload-input").val("");
                });

                //改变文本起始行
                $("#editStartLine").on("change", function () {
                    var num = $(this).val();
                    if (num != "") {
                        page.reqPreText();
                    }
                });
                //下载模板
                $('#btn-download').on("click",function () {
                    window.location.href = interfaceURL.downloadModel + '?fileName=人员账户信息导入模板.xlsx&attachGuid=EMPACCOUNT&projectName=ma';
                })
                //导入
                $("#data-import-btn").on("click",function () {   
                    if (!$("input[id=excelFile]").val()) {
                        ufma.showTip("请选择一个要导入的Excel文件！","","warning");
                        return false
                    }
                    ufma.showloading('正在导入数据，请耐心等待...');
                    $.ajax({
                        url: interfaceURL.uploadExcel,
                        type: 'POST',
                        cache: false,
                        data: new FormData($('#excelFileFrom')[0]),
                        processData: false,
                        contentType: false
                    }).done(function (res) {
                        ufma.hideloading();
                        if (res.flag === "success") {

                            parent.ufma.showTip("导入成功！", function () {
                            }, "success");
                            _close("save");
                        } else {
                            $(".btn-import").attr("disabled",false);
                            ufma.showTip(res.msg, function () {
                            }, "error");
                        }
//
                    }).fail(function (res) {
                        ufma.hideloading();
                        $(".btn-import").attr("disabled",false);
//                        	console.info(res);
                        if (res.status === 500) {
                            ufma.showTip('导入数据失败，请检查导入文件的格式是否符合设置的导入方案!!', function () {
                            }, "error");
                        } else {
                            ufma.showTip(res.msg, function () {
                            }, "error");
                        }
                    });
                })

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
