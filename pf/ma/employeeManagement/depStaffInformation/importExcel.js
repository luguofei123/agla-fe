$(function () {
    window._close = function (action, tableData) {
        if (window.closeOwner) {
            var data = {action: action, tableData: tableData};
            window.closeOwner(data);
        }
    };
    var infor = JSON.parse(window.sessionStorage.getItem("dataSourceModelInfor"));
    var page = function () {
        //银行对账单接口
        var portList = {
            uploadExcel:"/ma/prscalcdata/uploadExcel"//导入

        };

        return {
            //初始化预览表格
            initTable: function (id, data, colArr) {
                // data.splice(0, 3);
                page.tableObj = $("#" + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data,
                    "bRetrieve": true,
                    // "paging": false, // 禁止分页
                    "bLengthChange": true, //去掉每页显示多少条数据
                    "processing": true, //显示正在加载中
                    "pagingType": "full_numbers", //分页样式
                    "lengthChange": true, //是否允许用户自定义显示数量p
                    "lengthMenu": [
                        [20, 50, 100, -1],
                        [20, 50, 100, "All"]
                    ],
                    "pageLength": 20,
                    "bInfo": true, //页脚信息
                    "bSort": false, //排序功能
                    "ordering": false,
                    "columns": colArr,
                    // "scrollY": "360px",
                    // "sScrollX": "100%",
                    // "scrollCollapse": true,
                    "autoWidth": false,
                    // "dom": 'rt',
                    "dom": 'rt<"' + id + '-paginate"ilp>',
                    "initComplete": function () {
                        //驻底begin
                        var toolBar = $(this).attr('tool-bar')
                        var $info = $(toolBar + ' .info');
                        if($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        $('#'+id).closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        // ufma.setBarPos($(window));
                        var conH = $(".container-fluid").height();
                        if(conH > $(".ufma-layout-up").height() - 44){
                            conH = $(".ufma-layout-up").height() -44
                        }
                        $('#'+id).closest('.dataTables_wrapper').css("position","initial");
                        var sw = $('#'+id).closest('.dataTables_wrapper').find(".slider").width();
                        $('#'+id).closest('.dataTables_wrapper').find(".slider").css({top:conH +"px",height:"5px",left:"30px",width:sw +"px"});
                        $('#'+id).closest('.dataTables_wrapper').find(".slider span").css("height","5px");
                        var h = $(".ufma-layout-up").height();
                        $("#tool-bar").css({"top":conH + 5 + "px","position":"absolute"});
                        $(".ufma-tool-bar .tool-bar-body").css("margin-right","0");
                        var wVal = $(".table-part").css("width");
                        $("#tool-bar").css({"width":parseInt(wVal) +16 + "px","margin-left":"15px"});
                        $(".slider").css({"top":(parseFloat($(".slider").css("top")) - 4)+"px","height":"8px"});
                        $(".slider span").css({"height":"8px"});
                        //驻底end
                    },
                    "drawCallback": function (settings) {
                        // var twidth = 15 * colArr.length;
                        // $("#" + id).css("width", twidth + "%");
                        $("#" + id).find("td.dataTables_empty").text("")
                            .append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');
                    }
                });
                // return tableObj;
            },
            //请求扩展字段，重组表格
            extTable: function (id) {
                //获取扩展字段
                var extArgu = {
                    "schemaGuid": page.schemaGuid
                };
                ufma.ajaxDef(portList.getBankExtends, "get", extArgu, function (result) {
                    var data = result.data;
                    var extendsArr = data.extendTableHeadList;
                    var tableData = [];
                    var extColArr = [];
                    for (var i = 0; i < extendsArr.length; i++) {
                        var extColObj = {
                            title: extendsArr[i].showName,
                            data: extendsArr[i].extendField + "Name",
                            className: 'nowrap'
                        }
                        extColArr.push(extColObj);
                    }
                    page.allCol = page.bankColArr.concat(extColArr);
                    page.initTable(id, tableData, page.allCol);
                });
            },

            //打开设置导入方案页面
            openDataSet: function (impType, impScheGuid) {
                var param = {};
                param["impType"] = impType;
                param["impScheGuid"] = impScheGuid;
                if (impType == "2") {
                    param["letterList"] = $("#sheetList").getObj().getItem().colums;//excel列名集合
                } else if (impType == "1") {
                    param["letterList"] = [];//空数组
                }
                param["schemaGuid"] = page.schemaGuid;
                param["agencyCode"] = page.agencyCode;
                param["setYear"] = page.setYear;
                param["rgCode"] = page.rgCode;
                ufma.open({
                    url: "setDataFormat.html",
                    title: "设置导入方案",
                    width: 790,
                    data: param,
                    ondestory: function (data) {
//                        console.log(data);
                        if (data.action == "delete" || data.action == "save") {
                            var impType = $("input[name='impType']:checked").val();
                            if (impType == "1") {//文本
                                page.reqImpScheList();
                                page.reqPreText();
                            } else if (impType == "2") {//excel
                                page.reqImpScheList2();
                                page.reqPreExcel("method");
                            }
                        }
                    }
                });
            },

            //请求导入方案列表
            reqImpScheList: function () {
                var formatArgu = {
                    "impType": "1",
                    "schemaGuid": page.schemaGuid
                };
                ufma.ajaxDef(portList.getBankImpSche, "get", formatArgu, function (result) {
                    var data = result.data;
                    $("#formatList").ufCombox({
                        data: data,
                        onComplete: function (sender) {
                            if (data.length > 0) {
                                sender.getObj().val(data[0].impScheGuid);
                                $("#impScheGuid").val(data[0].impScheGuid);
                                $("#editStartLine,#colIndex").val(data[0].startLine);
                            }
                        }
                    });
                    if (data.length > 0) {
                        $("#form-showTab1 .tab-content").show();
                        $("#form-showTab1 .setTip").hide();
                        page.extTable("showTable1");
                    } else {
                        $("#form-showTab1 .tab-content").hide();
                        $("#form-showTab1 .setTip").show();
                    }
                });
            },
            reqImpScheList2: function () {
                var formatArgu2 = {
                    "impType": "2",
                    "schemaGuid": page.schemaGuid
                };
                ufma.ajaxDef(portList.getBankImpSche, "get", formatArgu2, function (result) {
                    var data = result.data;
                    $("#formatList2").ufCombox({
                        data: data,
                        onComplete: function (sender) {
                            if (data.length > 0) {
                                sender.getObj().val(data[0].impScheGuid);
                                $("#impScheGuid2").val(data[0].impScheGuid);
                                $("#colStart").val(data[0].startLine);
                            }
                        }
                    });
                    if (data.length > 0) {
                        $("#form-showTab2 .tab-content").show();
                        $("#form-showTab2 .setTip").hide();
                        page.extTable("showTable2");
                    } else {
                        $("#form-showTab2 .tab-content").hide();
                        $("#form-showTab2 .setTip").show();
                    }
                });
            },

            //请求预览文本
            reqPreText: function () {
                var file = $("#textFile").val();
                if (file != "") {
                    $.ajax({
                        url: portList.previewTxt + page.urlArgu,
                        type: 'POST',
                        cache: false,
                        data: new FormData($('#textFileFrom')[0]),
                        processData: false,
                        contentType: false
                    }).done(function (res) {
//	                	console.info(res);
                        var flag = $("#form-showTab1 .tab-content").css("display");
                        if (flag != "none") {
                            $("#showTable1").DataTable().clear().destroy();
                            page.initTable("showTable1", res.data, page.allCol);
                        }
                    }).fail(function (res) {
                        //ufma.showTip("导入失败！",function(){},"error");
                    });
                }
            },
            //请求预览excel表格数据
            showExcelData: function () {
                // $("#loadingModal").modal('show');
                ufma.showloading();
                var schemeGuid = $('#source-btn button[class="btn btn-primary"]').attr("scheme-guid");
                var url = portList.showLpBillExcel + schemeGuid;
                $.ajax({
                    url: url,
                    type: 'POST',
                    cache: false,
                    data: new FormData($('#excelFileFrom')[0]),
                    processData: false,
                    contentType: false
                }).done(function (res) {
                    // $("#loadingModal").modal('hide');
                    ufma.hideloading();
                    // $("#showTable2").DataTable().clear().destroy();
                    if (res.flag === "success") {
                        var data = res.data;
                        var tableSource = [];
                        if (data) {
                            tableSource = data.lpBizBillLists;
                        } else {
                            tableSource = [];
                        }
                        page.tableObj.destroy();
                        $('#showTable2').empty();
                        page.initTable("showTable2", tableSource, page.bankColArr);
                    } else {
                        ufma.showTip(res.msg, function () {
                        }, "error");
                    }

                }).fail(function (res) {

                });
            },
            //请求预览excel
            reqPreExcel: function (type) {
                var file = $("#excelFile").val();
                if (file != "") {
                    $.ajax({
                        // url: portList.previewExcel+page.urlArgu,
                        url: portList.getBillFileBaseMsg,
                        type: 'POST',
                        cache: false,
                        data: new FormData($('#excelFileFrom')[0]),
                        processData: false,
                        contentType: false
                    }).done(function (res) {
//	                	console.info(res);
                        var data = res.data;
                        // var flag = $("#form-showTab2 .tab-content").css("display");
                        // if(flag != "none"){
                        // 	$("#showTable2").DataTable().clear().destroy();
                        // 	page.initTable("showTable2",data.glBankStatement,page.allCol);
                        // }
                        if (type == "file" || type == "method") {
                            $("#sheetList").getObj().load(data);
                            $("#sheetList").getObj().setValue(data.sheetCode, data.sheetName);
                            $("#sheetCode").val(data.sheetCode);
                            $("#sheetName").val(data.sheetName);

                            var line1 = data[0];
                            $("#sheetList").getObj().val(line1.sheetCode.toString());
                            $("#start-line").val(line1.minRow);
                            $("#end-line").val(line1.maxRow);
                            $("#excelFileFrom #sheetCode").val(line1.sheetCode);
                            $("#excelFileFrom #sheetName").val(line1.sheetName);
                            $("#excelFileFrom #colStart").val(line1.minRow);
                            $("#excelFileFrom #colEnd").val(line1.maxRow);
                            // var selectObj= $.inArrayJson(baseInfo,"sheetCode",data.sheetCode);
                            // page.reqLineArr(selectObj);
                            //
                            // $("#startList").getObj().val(data.startLine);
                            // $("#endList").getObj().val(data.endLine);
                            //预览excel数据
                            page.showExcelData();
                        }
                        // else if (type == "sheet") {
                        //     var selectObj = $.inArrayJson(baseInfo, "sheetCode", data.sheetCode);
                        //     page.reqLineArr(selectObj);
                        //
                        //     $("#startList").getObj().val(data.startLine);
                        //     $("#endList").getObj().val(data.endLine);
                        // } else if (type == "line") {
                        //
                        // }
                    }).fail(function (res) {

                    });
                }
            },

            //加载数据行的值集
            reqLineArr: function (obj) {
                var lineArr = [];
                for (var i = obj.minRow; i < obj.maxRow; i++) {
                    var lineObj = {id: i, name: i};
                    lineArr.push(lineObj);
                }
                $("#startList").ufCombox({
                    data: lineArr,
                    onComplete: function (sender) {
                        if (lineArr.length > 0) {
                            sender.getObj().val(lineArr[0].id);
                            $("#colStart").val(lineArr[0].id);
                        }
                    }
                });
                $("#endList").ufCombox({
                    data: lineArr,
                    onComplete: function (sender) {
                        if (lineArr.length > 0) {
                            sender.getObj().val(lineArr[lineArr.length - 1].id);
                            $("#colEnd").val(lineArr[lineArr.length - 1].id);
                        }
                    }
                });
            },
            //转驼峰
            toHump: function (str) {
                var arr = str.split("_");
                var resStr = arr[0].toLowerCase();
                for (var i = 1; i < arr.length; i++) {
                    resStr += arr[i].substring(0, 1).toUpperCase() + arr[i].substring(1, arr[i].length).toLowerCase();
                }
                return resStr;
            },
            checkLines: function () {
                var valueStart = $("#start-line").val();
                var valueEnd = $("#end-line").val();
                var reg = /^[1-9]\d*$|^0$/;   // 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
                if (valueStart != "") {
                    if (reg.test(valueStart) != true) {
                        ufma.showTip("开始行请填写数字，且不能是负值", function () {
                        }, "warning");
                        return false;
                    }
                }
                if (valueEnd != "") {
                    if (reg.test(valueEnd) == true) {
                        if (parseInt(valueStart) > parseInt(valueEnd)) {
                            ufma.showTip("开始行必须小于结束行", function () {
                            }, "warning");
                            return false;
                        }
                    } else {
                        ufma.showTip("结束行请填写数字，且不能是负值", function () {
                        }, "warning");
                        return false;
                    }
                }
                return true;
            },
            //请求表头信息
            getTableHeadName: function (schemeGuid) {
                var tabArgu = {
                    schemeGuid: schemeGuid
                };
                ufma.post(portList.getTableHeadName, tabArgu, function (result) {
                    page.reconHead(result.data);
                    page.tableObj.destroy();
                    $('#showTable2').empty();
                    page.initTable('showTable2', [], page.bankColArr);
                    if($(".file-upload-title span").text() !== ""){
                        setTimeout(function () {
                            page.showExcelData();
                        },300)
                    }

                });
            },
            //整理表头信息
            reconHead: function (tableHeadName) {
                page.bankColArr = [];
                for (var i = 0; i < tableHeadName.length; i++) {
                    if(page.hasStr(tableHeadName[i].lpField,"AMT")){
                        var obj = {
                            title: tableHeadName[i].itemName,
                            data: page.toHump(tableHeadName[i].lpField),
                            className: 'nowrap',
                            render:function (data, type, rowdata, meta) {
                                if(!data || data == "0.00" || data == 0){
                                    return "";
                                }
                                return '<div style="text-align: right">'+$.formatMoney(data, 2);+'</div>';
                            }
                        };
                        page.bankColArr.push(obj);
                    }else{
                        var obj = {
                            title: tableHeadName[i].itemName,
                            data: page.toHump(tableHeadName[i].lpField),
                            className: 'nowrap'
                        };
                        page.bankColArr.push(obj);
                    }

                }
            },
            hasStr: function (str, hasStr) {
                if (str != null) {
                    return str.indexOf(hasStr) >= 0;
                } else {
                    return false;
                }
            },

            //此方法必须保留
            init: function () {
                page.urlArgu = "?ajax=1";
                ufma.parse();
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);

                if (page.bank != null) {
                    $("label[for='bank']").text(page.bank);
                    $("input[name='bank']").val(page.bankCode);
                }
                if (page.bankAccount != null) {
                    $("label[for='bankAccount']").text(page.bankAccount);
                    $("input[name='bankAccount']").val(page.bankAccount);
                }
                page.reconHead(tableHeadName);
                // if(page.bankColArr.length == 0){
                //     page.bankColArr = [
                //         {title: "序号", data: "isBalanceAccName"}
                //     ]
                // }
                page.initTable("showTable2", [], page.bankColArr);

                //初始化工作列表
                $("#sheetList").ufCombox({
                    idField: "sheetCode",
                    textField: "sheetName",
                    placeholder: "请选择工作表",
                    onChange: function (sender, data) {
                        $("#sheetCode").val(data.sheetCode);
                        $("#sheetName").val(data.sheetName);
                        // var line1 = data[0];
                        $("#start-line").val(data.minRow);
                        $("#end-line").val(data.maxRow);
                        $("#excelFileFrom #sheetCode").val(data.sheetCode);
                        $("#excelFileFrom #sheetName").val(data.sheetName);
                        $("#excelFileFrom #colStart").val(data.minRow);
                        $("#excelFileFrom #colEnd").val(data.maxRow);
                        page.showExcelData();
                        // page.reqLineArr(data);
                        // page.reqPreExcel("sheet");
                    }
                });
                $(".uf-combox-input").attr("autocomplete", "off");
                //初始化开始数据行
                $("#startList").ufCombox({
                    idField: "id",
                    textField: "name",
                    placeholder: "请选择",
                    onChange: function (sender, data) {
                        $("#colStart").val(data.id);
                        page.reqPreExcel("line");
                    }
                });
                //初始化结束数据行
                $("#endList").ufCombox({
                    idField: "id",
                    textField: "name",
                    placeholder: "请选择",
                    onChange: function (sender, data) {
                        $("#colEnd").val(data.id);
                        page.reqPreExcel("line");
                    }
                });

                //初始化导入方案列表
                $("#formatList").ufCombox({
                    idField: "impScheGuid",
                    textField: "impScheName",
                    placeholder: "请选择数据格式方案",
                    onChange: function (sender, data) {
                        $("#impScheGuid").val(data.impScheGuid);
                        $("#editStartLine,#colIndex").val(data.startLine);
                        page.reqPreText();
                    }
                });
                $("#formatList2").ufCombox({
                    idField: "impScheGuid",
                    textField: "impScheName",
                    placeholder: "请选择数据格式方案",
                    onChange: function (sender, data) {
                        $("#impScheGuid2").val(data.impScheGuid);
                        $("#colStart").val(data.startLine);
                        page.reqPreExcel("method");
                    }
                });

                //请求数据格式方案列表
                // page.reqImpScheList();
                // page.reqImpScheList2();

                page.onEventListener();
                ufma.parseScroll();

            },
            onEventListener: function () {
                //行输入
                $("#start-line").on("change", function () {
                    $("#colStart").val($(this).val());
                    if (page.checkLines()) {//行数校验
                        page.showExcelData();
                    }

                });
                $("#end-line").on("change", function () {
                    $("#colEnd").val($(this).val());
                    if (page.checkLines()) {//行数校验
                        page.showExcelData();
                    }
                });
                //取消导入的模态框
                $('#importExcel .btn-close').on('click', function () {
                    _close("close", {});
                });

                //只能输入数字
                $("#editStartLine").on("keyup", function () {
                    $(this).val($(this).val().replace(/[^\d]/g, ''));
                });

                //切换文本文件、Excel
                $(".radio-title label").each(function (i) {
                    $(this).on("click", function () {
                        $(".uf-dashed-hr").show();
                        $(this).find("input").prop("checked", true);
                        $(this).siblings().find("input").removeAttr("checked");
                        $(".radio-body" + (i + 1)).show().siblings().hide();
                        $(".showBox" + (i + 1)).show().siblings().hide();
                    });
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

                //打开设置导入方案页面
                $(".showSet").on("click", function () {
                    var impType = $("input[name='impType']:checked").val();
                    var impScheGuid = "";
                    if (impType == "1") {//文本
                        impScheGuid = $("#formatList").getObj().getValue();
                    } else if (impType == "2") {//excel
                        var file = $("#excelFile").val();
                        if (file != "") {
                            impScheGuid = $("#formatList2").getObj().getValue();
                        } else {
                            ufma.showTip("请先选择excel文件！", function () {
                            }, "warning");
                            return false;
                        }
                    }
                    page.openDataSet(impType, impScheGuid);
                });

                //选择文本文件
                $("#textFile").on("change", function () {
                    page.reqPreText();
                });

                //选择excel文件
                $("#excelFile").on("change", function () {
                    page.reqPreExcel("file");
                    //初始化银行对账单格式表格
                    // var bankColArr = [
                    //     {title:"序号",data:"isBalanceAccName"},
                    //     {title:"纳税人识别号",data:"statementDate"},
                    //     {title:"纳税人名称",data:"descpt"},
                    //     {title:"社保经办机构",data:"amtDr"},
                    //     {title:"征收项目代码",data:"amtCr"},
                    //     {title:"征收项目",data:"vouNo"},
                    //     {title:"征收金额（元）",data:"setmodeName"},
                    // ];
                    // $("#showTable2").DataTable().clear().destroy();
                    // page.initTable("showTable2",[],bankColArr);
                });

                //改变文本起始行
                $("#editStartLine").on("change", function () {
                    var num = $(this).val();
                    if (num != "") {
                        page.reqPreText();
                    }
                });

                //导入文件
                $(".btn-import").on("click", function () {
                    // var impType = $("input[name='impType']:checked").val();
                    var impType = "2";
                    if (impType == "1") {//文本
                        var textFile = $("#textFile").val();
                        if ($.isNull(textFile)) {
                            ufma.showTip("请选择要导入的文本文件！", function () {
                            }, "warning");
                            return false;
                        }
                        // var formatVal = $("#formatList").getObj().getValue();
                        // if ($.isNull(formatVal)) {
                        //     ufma.showTip("请选择导入方案！", function () {
                        //     }, "warning");
                        //     return false;
                        // }

                        var impScheGuid = $("#formatList").getObj().getValue();
                        $.ajax({
                            url: portList.impTxt + page.urlArgu,
                            type: 'POST',
                            cache: false,
                            data: new FormData($('#textFileFrom')[0]),
                            processData: false,
                            contentType: false
                        }).done(function (res) {
//                        	console.info(res);
                            if (res.flag == "success") {
                                ufma.showTip("导入成功！", function () {
                                    _close("import", res.data);
                                }, "success");
                            } else {
                                ufma.showTip(res.msg, function () {
                                }, "error");
                            }
                        }).fail(function (res) {
//                        	console.info(res);
                            ufma.showTip(res.msg, function () {
                            }, "error");
                        });

                    } else if (impType == "2") {//excel
                        //点击后置为不能点击，传入成功或失败后再置为可点击，以防多次导入
                        $(this).attr("disabled",true);

                        var excelFile = $("#excelFile").val();
                        if ($.isNull(excelFile)) {
                            ufma.showTip("请选择要导入的Excel文件！", function () {
                            }, "warning");
                            return false;
                        }

                        if (page.checkLines()) {//行数校验
                            // var formatVal2 = $("#formatList2").getObj().getValue();
                            // if($.isNull(formatVal2)){
                            // 	ufma.showTip("请选择导入方案！",function(){},"warning");
                            // 	return false;
                            // }

                            // var impScheGuid = $("#formatList2").getObj().getValue();
                            var impScheGuid = $("#sheetList").getObj().getValue();

                            // var tabArgu = {
                            //     file: new FormData($('#excelFileFrom')[0]),
                            //     dataSourceGuid: guid,
                            //     sheetCode: impScheGuid,
                            //     startLine: valueStart,
                            //     endLine: valueEnd
                            //
                            // };
                            // ufma.post(portList.getExcelLtem, tabArgu, function () {
                            //     console.info(res);
                            //     if (res.flag == "success") {
                            //         ufma.showTip("导入成功！", function () {
                            //             _close("import", res.data);
                            //         }, "success");
                            //     } else {
                            //         ufma.showTip("导入失败！", function () {
                            //         }, "error");
                            //     }
                            // });
                            var schemeGuid = $('#source-btn button[class="btn btn-primary"]').attr("scheme-guid");
                            ufma.showloading('正在导入数据，请耐心等待...');
                            $.ajax({
                                url: portList.importBillData + schemeGuid + "/" + infor.item.dataSrcType,
                                type: 'POST',
                                cache: false,
                                data: new FormData($('#excelFileFrom')[0]),
                                processData: false,
                                contentType: false
                            }).done(function (res) {
                                ufma.hideloading();
                                if (res.flag === "success") {

                                    ufma.showTip("导入成功！", function () {
                                        _close("save");
                                    }, "success");
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
                                ufma.showTip(res.msg, function () {
                                }, "error");
                            });
                        }


                    }
                });

                //点击来源子系统切换
                $("#source-btn").on("click", "button", function () {
                    if (!$(this).hasClass("btn-primary")) {
                        $("#lp-btns-list").hide();
                        $(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
                        $(this).siblings("#lp-btns-list").find("button").attr("class", "btn btn-default");
                        var schemeGuid = $(this).attr("scheme-guid");
                        page.getTableHeadName(schemeGuid);
                    }
                });
                //点击来源子系统切换
                $(document).on("click", "#lp-btns-list button", function (e) {
                    e.stopPropagation();
                    $(this).attr("class", "btn btn-primary").siblings("button").attr("class", "btn btn-default");
                    $(this).parent().siblings("button").attr("class", "btn btn-default");
                    $("#lp-btns-list").show();
                    var schemeGuid = $(this).attr("scheme-guid");
                    page.getTableHeadName(schemeGuid);
                });
                //显示隐藏的来源子系统
                $(document).on("click", ".lp-rest-sign", function (e) {
                    e.stopPropagation();
                    $("#lp-btns-list").show();
                });
                //点击空白处，设置的弹框消失
                $(document).bind("click", function (e) {
                    $("#lp-btns-list").hide();
                });

            }
        }
    }();
    page.init();
    $("input").attr("autocomplete", "off");
});