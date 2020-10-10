$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();

    //接口URL集合
    var interfaceURL = {
        findCalcDataBase: "/prs/prscalcdata/findCalcDataBase",//薪资编制基础数据查询
        findCalcDatas: "/prs/prscalcdata/findCalcDatas",//薪资编制数据条件查询
        updateCalcDatas: "/prs/prscalcdata/updateCalcDatas",//审核/退回
        getPrsOrgTreeIsUsed:"/prs/emp/prsOrg/getPrsOrgTreeIsUsed"//部门树
    }
    var pageLength = 25;
    var newCellsData = [];
    var isGet = false;
    //固定列
    var fixcolData = {cols:[
        {code: "empName", name: "姓名"},
        {code: "sex", name: "性别"},
        {code: "orgCodeName", name: "部门"},
        {code: "prtypeCodeName", name: "工资类别"},
        {code: "levelGradeName", name: "级别等级"},
        {code: "dutyGradeName", name: "职务"},
        {code: "payEditStatName", name: "工资状态"},
        {code: "isFugle", name: "是否领导"}
    ]};
    var notatm = ["empName","sex","orgCodeName","prtypeCodeName","levelGradeName","dutyGradeName","isFugle","payEditStatName"];
    var page = function () {
        return {
            //表格列
            combineColumns: function () {
                var columns = {};
                for (var i = 0; i < page.columns.length; i++) {
                    var obj = {
                        title: page.columns[i].name,
                        data: page.columns[i].code,
                        className: "isprint nowrap ellipsis",
                        render: function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return data;
                        }
                    };
                    
                    if(notatm.indexOf(obj.data) <0 ){
                    	obj.render = function (data, type, rowdata, meta) {
                            if (!data || data == 0) {
                                return "";
                            }
                            var dataName = meta.settings.aoColumns[meta.col].data;
                            var color = "";
                            var prsCalcItems = combinePrsCalcItems(rowdata.prsCalcItems);
                            var prsCalcItemsLight = combinePrsCalcItemsLight(rowdata.prsCalcItems);
                            if (prsCalcItems[dataName] == 'Y') {
                            	color = 'colorY';
                            }
                            if (prsCalcItemsLight[dataName] == 'Y') {
                            	color += ' hightLight';
                            }
                            return '<span class="'+color+'">'+$.formatMoney(data,2)+'</span>';
                        }
                        obj.className = "isprint nowrap ellipsis tdNum";
                    }else if (obj.data == "empName") {
                        obj.render = function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            }
                            return '<a href="javascript:;" class="edit-row-data" data-id="' + rowdata.id + '" row-id= "' + meta.row + '" style="color: #108ee9">' + data + '</a>';
                        }
                    } else if (obj.data == "sex") {
                        obj.render = function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            } else if (data == "1") {
                                return "男";
                            } else if (data == "0") {
                                return "女";
                            }else{
                                return "未知"
                            }
                            return data
                        }
                    } else if (obj.data == "isFugle") {
                        obj.render = function (data, type, rowdata, meta) {
                            if (!data) {
                                return "";
                            } else if (data == "Y") {
                                return "是";
                            } else if (data == "N") {
                                return "否";
                            }
                            return data
                        }
                    }
                    columns[page.columns[i].code] = obj;
                }

                var checks = $("#colList input:checked");
                var checksArr = [];
                for (var i = 0; i < checks.length; i++) {
                    var code = $(checks[i]).attr("data-code");
                    checksArr.push(code);
                }
                var newColumns = [
                    {
                        title: '序号',
                        className: "nowrap check-style",
                        width: 30,
                        data: null,
                        "render": function (data, type, rowdata, meta) {
                            return meta.row + 1;
                        }
                    }
                ];
                for (var i = 0; i < checksArr.length; i++) {
                    newColumns.push(columns[checksArr[i]]);
                }
                return newColumns;
            },
            //初始化表格
            initTable2: function (data) {
                var id = "mainTable";
                var toolBar = $('#' + id).attr('tool-bar');
                page.DataTable = $('#' + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data,
                    "paging": false,
                    "searching": false,
                    "columns": page.combineColumns(),
                    "dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
                    "buttons": [{
                        extend: 'print',
                        text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: '.isprint'
                        },
                        customize: function (win) {
                            $(win.document.body).find('h1').css("text-align", "center");
                            $(win.document.body).css("height", "auto");
                        }
                    },
                        {
                            extend: 'excelHtml5',
                            text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                            exportOptions: {
                                columns: '.isprint'
                            },
                            customize: function (xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            }
                        }
                    ],
                    "initComplete": function (settings, json) {
                        //打印&导出按钮
                        $('.datatable-toolbar').appendTo('#dtToolbar');
                        // $('#datatables-print').html('');
                        // $('#datatables-print').append($(".datatable-toolbar"));
                        $(".datatable-toolbar .buttons-print").addClass("btn-print btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "打印"
                        });
                        $(".datatable-toolbar .buttons-excel").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });

                      //部分数据高亮显示
                        var table = $("#mainTable"), columnlen = table.find("th").length,
                        alltr = table.find("tr"),
                        rowlen = alltr.length,markobj = {};
                        for (var k = 0; k < rowlen;k++) {
                            if(alltr.eq(k).find("td span").hasClass('hightLight')){
                                var lis = alltr.eq(k).find(".hightLight");
                                for(var n = 0; n < lis.length;n++){
                                    var ind = lis[n].parentElement.cellIndex;
                                    markobj[ind] = true;
                                }
                                
                            }
                        }
                        for (var i = 0; i < columnlen;i++) {
                            if(markobj[i]){
                                for (var j = 0; j < columnlen;j++) {
                                    alltr.eq(j).find('td').eq(i).addClass('tdlight')
                                }
                            }
                        }
                        
                        //驻底begin
                        var toolBar = $(this).attr('tool-bar');
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        //导出begin
                        $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '工资审核');
                        });
                        //导出end

                        $('#mainTable_wrapper').closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });

                        ufma.setBarPos($(window));
                        //驻底end


                        //checkbox的全选操作
                        $('.datatable-group-checkable').on("change", function () {
                            var isCorrect = $(this).is(':checked');
                            $('#' + id + ' .checkboxes').each(function () {
                                isCorrect ? $(this).prop("checked", !0) : $(this).prop("checked", !1);
                                isCorrect ? $(this).closest("tr").addClass("selected") : $(this).closest("tr").removeClass("selected");
                            });
                            $('.datatable-group-checkable').prop("checked", isCorrect);
                        });
                        $('.datatable-toolbar [data-toggle="tooltip"]').tooltip();
                        // $("#tool-bar").width($(".prs-workspace").width() - 224);

                        // var timeId = setTimeout(function () {
                        //     //左侧树高度
                        //     var h = $(window).height() - 88;
                        //     $(".rpt-acc-box-left").height(h);
                        //     var H = $(".rpt-acc-box-right").height();
                        //     if (H > h) {
                        //         $(".rpt-acc-box-left").height(h + 48);
                        //         if ($("#tool-bar .slider").length > 0) {
                        //             $(".rpt-acc-box-left").height(h + 52);
                        //         }
                        //     }
                        //     $(".rpt-atree-box-body").height($(".rpt-acc-box-left").height() - 12);
                        //     clearTimeout(timeId);
                        // }, 200);
                        ufma.isShow(page.reslist);
                    },
                    "drawCallback": function (settings) {
                        // if (data.length > 0) {
                        //     $("#" + id).fixedColumns({
                        //         rightColumns: 1,//锁定右侧一列
                        //         // leftColumns: 1//锁定左侧一列
                        //     });
                        // }
                        $("#mainTable").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //权限控制
                        ufma.isShow(page.reslist);
                        ufma.setBarPos($(window));
                        $('#mainTable_wrapper').ufScrollBar("update");
                    }
                });
            },
            initTable: function (data) {
                var h = $(".workspace").height();
                var newH = h - 130;
                var id = "mainTable";
                var toolBar = $('#' + id).attr('tool-bar');
                page.DataTable = $('#' + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data,
                    paging: false,
                    searching: false,
                    ordering: false,
                    "columns": page.combineColumns(),
                    "dom": '<"datatable-toolbar"B>rt<"' + id + '-paginate"ilp>',
                    "buttons": [{
                        extend: 'print',
                        text: '<i class="glyphicon icon-print" aria-hidden="true"></i>',
                        exportOptions: {
                            columns: '.isprint'
                        },
                        customize: function (win) {
                            $(win.document.body).find('h1').css("text-align", "center");
                            $(win.document.body).css("height", "auto");
                        }
                    },
                        {
                            extend: 'excelHtml5',
                            text: '<i class="glyphicon icon-upload" aria-hidden="true"></i>',
                            exportOptions: {
                                columns: '.isprint'
                            },
                            customize: function (xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                            }
                        }
                    ],
                    "initComplete": function (settings, json) {
                        // 打印&导出按钮
                        $('.datatable-toolbar').appendTo('#dtToolbar');
                        // $('#datatables-print').html('');
                        // $('#datatables-print').append($(".datatable-toolbar"));
                        $(".datatable-toolbar .buttons-print").addClass("btn-print btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "打印"
                        });
                        $(".datatable-toolbar .buttons-excel").addClass("btn-export btn-permission").attr({
                            "data-toggle": "tooltip",
                            "title": "导出"
                        });

                      //部分数据高亮显示
                        var table = $("#mainTable"), columnlen = table.find("th").length,
                        alltr = table.find("tr"),
                        rowlen = alltr.length,markobj = {};
                        for (var k = 0; k < rowlen;k++) {
                            if(alltr.eq(k).find("td span").hasClass('hightLight')){
                                var lis = alltr.eq(k).find(".hightLight");
                                for(var n = 0; n < lis.length;n++){
                                    var ind = lis[n].parentElement.cellIndex;
                                    markobj[ind] = true;
                                }
                                
                            }
                        }
                        for (var i = 0; i < columnlen;i++) {
                            if(markobj[i]){
                                for (var j = 0; j < columnlen;j++) {
                                    alltr.eq(j).find('td').eq(i).addClass('tdlight')
                                }
                            }
                        }
                        
                        //驻底begin
                        var toolBar = $(this).attr('tool-bar');
                        var $info = $(toolBar + ' .info');
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        //导出begin
                        $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '工资审核');
                        });
                        // 导出end
                        $('#mainTable_wrapper').closest('.dataTables_wrapper').ufScrollBar({
                            hScrollbar: true,
                            mousewheel: false
                        });
                        ufma.setBarPos($(window));
                        //驻底end
                        $('.datatable-toolbar [data-toggle="tooltip"]').tooltip();
                        // $("#tool-bar").width($(".prs-workspace").width() - 224);

                        $("#mainTable").wrapAll("<div style='overflow-x:auto'>");
                        $('.dataTables_scrollBody').scroll(function () {
                            if (page.tableData && page.tableData.length > 0) {
                                if ($(this)[0].scrollHeight - $(this).scrollTop() - 30 < $(this).height()) {
                                    if (!isGet) {
                                        isGet = true;
                                        // var tData = page.tableData.slice(page.page*100-20,page.page*100+100);
                                        var tData = page.tableData.slice(page.page * 100, page.page * 100 + 100);
                                        page.page += 1;
                                        page.curTableData = tData;
                                        if (tData.length > 0) {
                                            // page.DataTable.clear().draw();
                                            page.DataTable.rows.add(tData).draw();
                                            // $(this).scrollTop(0)
                                            // page.initTable(tData);
                                        }
                                    }
                                }
                                // else if($(this).scrollTop() ==0){
                                //     if(!isGet) {
                                //         isGet = true;
                                //         var tData = page.tableData.slice((page.page - 1) * 100 - 20, (page.page - 1) * 100 + 100);
                                //         page.curTableData = tData;
                                //         if (tData.length > 0) {
                                //             page.DataTable.clear().draw();
                                //             page.DataTable.rows.add(tData).draw();
                                //             // $(this).scrollTop(0)
                                //             // page.initTable(tData);
                                //         }
                                //     }
                                // }
                            }
                        })
                        
                        $("#mainTable").fixedTableHead();
                        ufma.isShow(page.reslist);
                    },
                    "drawCallback": function (settings) {
                        isGet = false;
                        // if (data.length > 0) {
                        //
                        // }
                        // page.DataTable.fixedColumns.leftColumns = 5;
                        // if (data.length > 0) {
                        //     $("#" + id).fixedColumns({
                        //         // rightColumns: 1,//锁定右侧一列
                        //         leftColumns: 1//锁定左侧一列
                        //     });
                        // }
                        $("#mainTable").find("td.dataTables_empty").text("").append('<img src="' + bootPath + 'images/noData.png"/><br/><i>目前还没有你要查询的数据</i>');

                        //权限控制
                        ufma.isShow(page.reslist);
                        ufma.setBarPos($(window));
                        $('#mainTable_wrapper').ufScrollBar("update");
                    }
                });
            },
            //销毁表格
            desTroyTable: function () {
                if (page.DataTable != undefined && $('#mainTable').html() !== "") {
                    pageLength = ufma.dtPageLength('#mainTable');
                    $("#mainTable_wrapper").ufScrollBar('destroy');
                    page.DataTable.clear().destroy();
                    $("#mainTable").html("");
                }
            },
            //获取勾选的数据
            getCheckedRows: function () {
                var checkes = $("input.checkboxes:checked");
                return checkes;
            },
            //初始化工资状态
            initPayEditStat: function () {
                $("#payEditStat").ufCombox({
                    idField: "valId",
                    textField: "val",
                    // data: data, //json 数据
                    placeholder: "请选择工资状态",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
            },
            //获取工资状态
            getPayEditStat: function (data) {
                var obj = {valId: "*", val: "全部"};
                data.unshift(obj);
                $("#payEditStat").getObj().load(data);
                if (data.length > 0) {
                    $("#payEditStat").getObj().val(data[0].code);
                }
            },
            //初始职务等级
            initJobRank: function () {
                $("#jobRank").ufCombox({
                    idField: "valId",
                    textField: "val",
                    // data: data, //json 数据
                    placeholder: "请选择职务等级",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
            },
            //获取职务等级
            getJobRank: function (data) {
                $("#jobRank").getObj().load(data);
                if (data.length > 0) {
                    $("#jobRank").getObj().val(data[0].code);
                }

            },
            //工资类别
            getWageItems: function () {
                var data = [
                    {code: "1", name: "在职"},
                    {code: "2", name: "离休"},
                    {code: "3", name: "退休"},
                    {code: "4", name: "外聘"},
                    {code: "5", name: "参公"},
                    {code: "6", name: "外教"},
                    {code: "7", name: "高级专家"}
                ];
                var itemsHTML = "";
                for (var i = 0; i < data.length; i++) {
                    itemsHTML += '<label class="rpt-check mt-checkbox mt-checkbox-outline">' +
                        '<input name="wageItem" data-code="' + data[i].code + '" type="checkbox" checked="checked" autocomplete="off">' + data[i].name + '<span></span>' +
                        '</label>'
                }
                $(".wageItems").append(itemsHTML);

            },
            //初始化部门树
            initDepartment: function () {
                // $("#departmentCode").ufTextboxlist({//初始化
                //     idField: 'id',//可选
                //     textField: 'codeName',//可选
                //     pIdField: 'pId',//可选
                //     async: false,//异步
                //     // data       :result.data,//列表数据
                //     // icon:'icon-book',
                //     onChange: function (sender, treeNode) {
                //     }
                // });
                // page.getDepartment()

            },
            //获取部门数据
            getDepartment: function () {
                ufma.get(interfaceURL.getPrsOrgTreeIsUsed,"",function(result){
                    var data = result.data;
                    var data = result.data;
                    var obj = {
                        id: "0",
                        code: "0",
                        codeName: "全部",
                        pId: null
                    }
                    data.push(obj);
                    $("#departmentCode").ufmaTextboxlist({//初始化
                        valueField: 'id',//可选
                        textField: 'codeName',//可选
                        name: 'departmentCode',
                        data: data,//列表数据
                        leafRequire: true,
                        expand: true
                    });
                    // var treeObj = $.fn.zTree.getZTreeObj("departmentCode_tree");
                    // treeObj.expandAll(true);
                })
            },
            //可选择的表格列
            renderSeletableColumns: function (data) {
                var newData=$.extend(true,{},fixcolData).cols;
                for (var y = 0; y < data.length; y++) {
                    for (var i in data[y]) {
                        var code = prs.strTransform(i);
                        var obj = {code: code, name: data[y][i]};
                        newData.push(obj)
                    }
                }

                page.columns = newData;
                page.renderP(newData);
            },
            renderP: function (datas) {
                $("#colList").html("");
                // var arr = ["empName", "sex", "orgCode", "prtypeCode", "levelGrade", "dutyGrade", "isFugle"];
                var pHtml = "";
                for (var i = 0; i < datas.length; i++) {
                    // if (arr.indexOf(datas[i].code) >= 0) {
                    pHtml += '<p><label class="mt-checkbox mt-checkbox-outline" title="' + datas[i].name + '"><input type="checkbox" checked="checked" data-code="' + datas[i].code + '" data-name="' + datas[i].name + '">' + datas[i].name + '<span></span></label></p>'
                    // } else {
                    //     pHtml += '<p><label class="mt-checkbox mt-checkbox-outline" title="' + datas[i].name + '"><input type="checkbox" data-code="' + datas[i].code + '" data-name="' + datas[i].name + '">' + datas[i].name + '<span></span></label></p>'
                    // }

                }
                $("#colList").append(pHtml);
            },
            //左侧工资类别树
            wageItemsTree: function (data) {
                var labelHtml = '<label class="rpt-check checkAll mt-checkbox mt-checkbox-outline"><input data-code="*" type="checkbox" autocomplete="off">全部<span></span></label>';
                for (var i = 0; i < data.length; i++) {
                    labelHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="prType" data-code="' + data[i].prtypeCode + '" type="checkbox" autocomplete="off">' + data[i].prtypeName + '<span></span></label>'
                }
                $("#prTypes").append(labelHtml);
                $(".prTypes-hide").append(labelHtml);
                $(".prTypes-hide").width($(".prTypes-box").width());
                var w = $(".prTypes-box").width();
                var sumW = 0, labels = $("#prTypes label");
                for(var i=0;i<labels.length;i++){
                    sumW += $(labels[i]).width() + 10
                }
                if (w < sumW){
                    $(".to-bottom").removeClass("hidden");
                }

            },
            //获取基础数据
            findCalcDataBase: function () {
                var argu = {
                    "flag":"CALCSH"
                };
                ufma.showloading("正在加载数据，请耐心等待...");
                ufma.post(interfaceURL.findCalcDataBase,argu,function (result) {
                    ufma.hideloading();
                    var data = result.data;
                    page.renderSeletableColumns(data.moveItem);
                    page.wageItemsTree(data.topMessage.prsTypeCos);
                    //page.getJobRank(data.topMessage.prsDutyGradeDataCos);
                    page.getPayEditStat(data.topMessage.prsVals);
                    // page.getDepartment(data.topMessage.orgTree);
                    page.tableDraw(data.prsCalcDatas);
                    // page.initTable(data.prsCalcDatas);
                })

            },
            //查询到表格数据后重绘表格
            tableDraw:function(data){
                page.desTroyTable();
                page.tableData = data;
                //var tData = data.slice(0, 100);
                var tData = data;
                page.curTableData = tData;
                page.page = 1;
                page.initTable(tData);
            },
            //获取选择的工资类别
            selPrtypeCodes: function () {
                var inputChecks = $("input[name=prType]:checked");
                var prtypeCodes = [];
                for (var i = 0; i < inputChecks.length; i++) {
                    prtypeCodes.push($(inputChecks[i]).attr("data-code"));
                }
                return prtypeCodes;
            },
            //获取所有工资类别
            allPrtypeCodes: function () {
                var inputChecks = $("input[name=prType]");
                var prtypeCodes = [];
                for (var i = 0; i < inputChecks.length; i++) {
                    prtypeCodes.push($(inputChecks[i]).attr("data-code"));
                }
                return prtypeCodes;
            },
            //数据
            getSearchData: function () {
                var argu = {
                    payEditStat: $("#payEditStat").getObj().getValue() == "*"?"":$("#payEditStat").getObj().getValue(),
                    //dutyGrade: $("#jobRank").getObj().getValue(),
                    // orgCodes: $("#departmentCode").getObj().getValue() ? $("#departmentCode").getObj().getValue().split(",") : [],
                    orgCodes: $("#departmentCode").ufmaTextboxlist().getValue() ? $("#departmentCode").ufmaTextboxlist().getValue().split(",") : [],
                    prtypeCodes: page.selPrtypeCodes(),
                    empNames: $("#empName").val(),
                    flag:"CALCSH"
                };
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.findCalcDatas, argu, function (result) {
                    ufma.hideloading();
                    page.renderSeletableColumns(result.data.moveItem);
                    page.tableDraw(result.data.prsCalcDatas)
                })
            },
            combinePrsCalcItems: function (data) {
                var result = {};
                for (var i = 0; i < data.length; i++) {
                    var code = prs.strTransform(data[i].pritemCode);
                    result[code] = data[i].isEditable
                }
                return result;
            },
            //初始化可选列
            initSelColumns: function () {
                page.columns =fixcolData;
                page.renderP(page.columns);
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                $(".prTypes-hide").slideUp();
                page.initSelColumns();
                page.initTable([]);
                // page.getWageItems();
                page.initPayEditStat();
                // page.initDepartment();
                page.getDepartment();
                //page.initJobRank();
                page.findCalcDataBase();
                $(window).resize(function () {
                    $("#tool-bar").find(".slider").width($(".prs-workspace").width() - 252);
                    $("#tool-bar").width($(".prs-workspace").width() - 224);
                });
            },
            onEventListener: function () {
                //状态
                $(".status").on(".btn", function () {
                    $(this).addClass("btn-primary").siblings(".btn").removeClass("btn-primary");
                });
                //查询
                $("#query-sure").on("click", function () {
                    $("#btnQuery").next(".rpt-funnelBoxList").toggleClass("hidden");
                    page.getSearchData();
                })
                // 重置
                $('#query-reset').on('click', function () {
                    $("#departmentCode").ufmaTextboxlist().val('')
                    $("#payEditStat").getObj().clear();
                    $("#empName").val('');
                    //$("#jobRank").getObj().clear()
                })
                //选择显示的列
                $("#colAction").on("click", function () {
                    $(this).next(".rpt-funnelBoxList").toggleClass("hidden");
                });
                $("#addCol").on("click", function () {
                    var checks = $("#colList input");
                    var checksArr = [];
                    $(this).closest(".rpt-funnelBoxList").addClass("hidden");
                    for (var i = 0; i < checks.length; i++) {
                        var column = page.DataTable.column(i+1);
                        if($(checks[i]).prop("checked")){
                            column.visible(true);
                        }else{
                            column.visible(false);
                        }

                        // var code = $(checks[i]).attr("data-code");
                        // checksArr.push(code);
                    }

                    // var tData = page.DataTable.data();
                    // var data = [];
                    // for (var i = 0; i < tData.length; i++) {
                    //     if (i >= 100) {
                    //         break
                    //     } else {
                    //         data.push(tData[i])
                    //     }
                    // }
                    
                    // page.desTroyTable();
                    // page.initTable(data);
                    // page.page = 1;
                    // isGet = false;
                });
                $("#btnQuery").on("click", function () {
                    $(this).next(".rpt-funnelBoxList").toggleClass("hidden");
                });
                //查看明细
                $(document).on("click", "a.edit-row-data", function (e) {
                    stopPropagation(e);

                    var id = $(this).attr("data-id");
                    var rowId = $(this).attr("row-id");
                    var openData = {
                        id: id,
                        rowId: rowId,
                        mainTableData: page.tableData,
                        // combinePrsCalcItems: page.combinePrsCalcItems,
                        action:"view"
                    };
                    ufma.open({
                        url: '../wageBianZhi/wageDetail.html',
                        title: "记录明细",
                        width: 800,
                        //height:500,
                        data: openData,
                        ondestory: function (data) {
                            //窗口关闭时回传的值
                            if (data.action && data.action.action == "save") {
                                ufma.showTip(data.action.msg, "", data.action.flag)
                                page.getSearchData();
                            }
                        }
                    });
                });
                //审核
                $("#btn-audit").on("click",function () {
                    var tableDatas = page.DataTable.data();
                    var prtypeCodes = [];
                    //非审核状态的数据才可以审核
                    for(var i=0;i<tableDatas.length;i++){
                        if (prtypeCodes.indexOf(tableDatas[i].prtypeCode) < 0 && tableDatas[i].payEditStat != "3"){
                            prtypeCodes.push(tableDatas[i].prtypeCode)
                        }
                    }
                    if(prtypeCodes.length == 0){
                        ufma.showTip("无需要审核的数据",function(){},"warning");
                        return false
                    }
                    
                    ufma.confirm('您确定继续吗？', function (action) {
                        if (action) {
                            //点击确定的回调函数
                    
                            var argu = {
                                payEditStat: "3",
                                prtypeCodes: prtypeCodes,
                                flag:"CALCSH"
                            };
                            ufma.post(interfaceURL.updateCalcDatas,argu,function (result) {
                                ufma.showTip(result.msg,function () {

                                },result.flag);
                                page.getSearchData();
                            });
                        }else{
                            //点击取消的回调函数
                        }
                    },{type:'warning'});

                });
                //退回
                $("#btn-wf-untread").on("click",function () {
                    var tableDatas = page.DataTable.data();
                    var prtypeCodes = [];
                    for(var i=0;i<tableDatas.length;i++){
                        if(prtypeCodes.indexOf(tableDatas[i].prtypeCode) < 0){
                            prtypeCodes.push(tableDatas[i].prtypeCode)
                        }
                    }
                    if(prtypeCodes.length == 0){
                        ufma.showTip("无需要退回的数据",function(){},"warning");
                        return false
                    }
                    ufma.confirm('您确定退回吗？', function (action) {
                        if (action) {
                            //点击确定的回调函数
                         
                            var argu = {
                                payEditStat: "1",
                                prtypeCodes: prtypeCodes,
                                flag:"CALCBACK"
                            };
                            ufma.post(interfaceURL.updateCalcDatas,argu,function (result) {
                                ufma.showTip(result.msg,function () {

                                },result.flag);
                                page.getSearchData();
                            });
                        }else{
                            //点击取消的回调函数
                        }
                    },{type:'warning'});

                });
                $("#prTypes").on("change", ".checkAll input", function () {
                    if ($(this).prop("checked")) {
                        $("input[name=prType]").prop("checked", true)
                    } else {
                        $("input[name=prType]").prop("checked", false)
                    }
                    page.getSearchData();
                })
                $("#prTypes").on("change", "input[name=prType]", function () {
                    var checks = $("input[name=prType]:checked");
                    var inputs = $("input[name=prType]");
                    var index = $(this).closest("label").index();
                    if ($(this).prop("checked")) {
                        $("#prTypes label").eq(index).find("input[name=prType]").prop("checked", true);
                    } else {
                        $("#prTypes label").eq(index).find("input[name=prType]").prop("checked", false);
                    }
                    if (checks.length == inputs.length) {
                        $(".checkAll").find("input").prop("checked", true)
                    } else {
                        $(".checkAll").find("input").prop("checked", false)
                    }
                    page.getSearchData();
                })
                // 点击空白处，设置的弹框消失
                /*$(document).bind("click", function (e) {
                    var div2 = $("#prTypes")[0];
                    var div3 = $(".prTypes-hide")[0];
                    var div4 = $(".to-bottom")[0];
                    if (e.target != div2 && !$.contains(div2, e.target) && e.target != div3 && !$.contains(div3, e.target) && e.target != div4 && !$.contains(div4, e.target)) {
                        $(".prTypes-hide").slideUp();
                    }
                });*/
                // $("#prTypes").on("mouseover", function () {
                //     $(".prTypes-hide").slideDown();
                // })
                $(".to-top").on("click",function(){
                    $(".prTypes-hide").slideUp();
                })
                $(".to-bottom").on("click", function () {
                    $(".prTypes-hide").slideDown();
                })
                $('#query-condition').on('click',function(e){
                    e.stopPropagation();
                })
                $('.rpt-colBtn').on('click',function(e){
                    e.stopPropagation();
                })
                //点击其他区域，隐藏弹出层
                $(document).bind("click", function(){
                    $("#queryFunnelBox").addClass('hidden');
                })

            },

            //此方法必须保留
            init: function () {
                ufma.parse();
                page.initPage();
                page.onEventListener();
                ufma.parseScroll();
            }
        }
    }();
/////////////////////
    page.init();

    function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }

    $(window).scroll(function () {
        if ($(this).scrollTop() > 30) {
            $(".rpt-acc-box-left").css("top", "12px");
        } else {
            $(".rpt-acc-box-left").css("top", "64px");
        }
    })
});

function combinePrsCalcItems(data) {
    var result = {};
    for (var i = 0; i < data.length; i++) {
        var code = prs.strTransform(data[i].pritemCode);
        result[code] = data[i].color;
    }
    return result;
}

function combinePrsCalcItemsLight(data) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var code = prs.strTransform(data[i].pritemCode);
        result[code] = data[i].isHighLight;
    }
    return result;
}

