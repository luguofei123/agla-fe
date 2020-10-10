$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    //一些公用常量、变量
    var svData = ufma.getCommonData();

    //接口URL集合
    var interfaceURL = {
        delEmpClass: "/prs/EmpClass/delEmpClass",//删除人员类别
        findCalcDataBase: "/prs/prscalcdata/findCalcDataBase",//薪资编制基础数据查询
        findCalcDatas: "/prs/prscalcdata/findCalcDatas",//薪资编制数据条件查询
        updateCalcDatas: "/prs/prscalcdata/updateCalcDatas",//薪资状态修改(提交)
        calcPrsCalcData: "/prs/prscalcdata/calcPrsCalcData",//计算
        updateCalcDatasItem: "/prs/prscalcdata/updateCalcDatasItem",//保存
        getPrsOrgTreeIsUsed:"/prs/emp/prsOrg/getPrsOrgTreeIsUsed",//部门树
        checkPayEditState:"/prs/prscalcdata/checkPayEditState"//工资编制导入 替换功能，校验数据是否存在非编辑数据
    };
    //外部变量 存储改变单元格数据
    var newCellsData = [];
    //控制滚动分页标记？？？
    // var isGet = false;
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
    //数据属性 用来判断数据是否存在改数组中的属性
    var notatm = ["empName","sex","orgCodeName","prtypeCodeName","levelGradeName","dutyGradeName","isFugle","payEditStatName"];
    var page = function () {
        return {
            /**
             * 将某个单元格或者div变成可以输入金额的输入框
             * @param {Object} doc 点击操作的单元格对象
             * @param {String} id 列Id
             * @param {Function} afterInputFun 自定义回调处理
             * @param {String} defaultVal 当前默认值
             * @param {String} sId 列Id
             * @param {Object} rowData 行数据
             */
            _BgPub_Bind_InputMoney: function (doc, id, afterInputFun, defaultVal, sId, rowData) {
                if ($(doc).find('input#' + id).length > 0) {
                    return false
                }

                $(doc).empty()
                var _defVal = ''
                if (defaultVal != null) {
                    _defVal = defaultVal
                }
                var iwidth =
                    $(doc)
                        .closest('td')
                        .outerWidth() -
                    parseInt(
                        $(doc)
                            .closest('td')
                            .css('padding-left')
                    ) -
                    parseInt(
                        $(doc)
                            .closest('td')
                            .css('padding-right')
                    )
                $(doc).append(
                    '<input type="text" id="' +
                    id +
                    '" style="width:' +
                    iwidth +
                    'px" value="' +
                    _defVal +
                    '" onkeyup="this.value=this.value.replace(/[^0-9.]/g,\'\')" ' +
                    'onafterpaste="this.value=this.value.replace(/[^0-9.]/g,\'\')"/>'
                )
                $(doc).on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        //13等于回车键(Enter)键值,ctrlKey 等于 Ctrl
                        var v = $('#' + id).val()
                        $('#' + id).remove()
                        $(doc).empty()
                        $(doc).append(v)
                        if (afterInputFun != null) {
                            afterInputFun(v, doc, sId, rowData)
                        }
                        e.keyCode = 0
                    }
                })

                return true
            },
            /**
             * 上面方法的第三个参数  函数类型
             * @editor sunch
             * @param {String} value 失去焦点或按回车键确定后input的值
             * @param {Object} doc 点击操作的单元格对象
             * @param {String} sId 列Id
             * @param {Object} rowData 行数据
             */
            tbl_afterInputMoney_cellChange: function (value, doc, sId, rowData) {
                var tbl = $('#mainTable').DataTable()
                var val = value
                if (val == null || val == '') {
                    val = ''
                }
                tbl.cell(doc).data(val)
                page.setChangeCellData(tbl, doc, sId, rowData)
            },
            /**
             * 上面函数内容的抽象
             * @param {Object} tbl 表格的Datatables对象
             * @param {Object} doc 点击操作的单元格对象
             * @param {String} sId 列Id
             * @param {Object} rowData 行数据
             */
            setChangeCellData: function (tbl, doc, sId, rowData) {
                // var rowIndex = tbl.row(doc).index();
                // var columnIndex = tbl.column(doc).index();
                var cell = {};
                cell.prtypeCode = rowData.prtypeCode;
                cell.empUid = rowData.empUid;
                cell[sId] = tbl.cell(doc).data() === '' ? 0 : Number(tbl.cell(doc).data())
                if (page.tableData[sId] !== null && page.tableData[sId] !== undefined) {
                    cell = $.extend({}, page.tableData[i], cell)
                }
                var index = -1;
                //newCellsData 外部变量 存储改变单元格数据
                for (var i = 0; i < newCellsData.length; ++i) {
                    if (newCellsData[i].empUid == cell.empUid) {
                        newCellsData[i][sId] = cell[sId]
                        index = i;
                        break
                    }
                }
                if (index === -1) {
                    newCellsData.push(cell)
                }
            },
            /**
             * 单击单元格可以进入编辑状态
             */
            addListenerToMainTable: function () {
                $('#mainTable')
                    .off('click', 'tbody td')
                    .on('click', 'tbody td', function (e) {
                        var tbl = $('#mainTable').DataTable();
                        var col = tbl.column(this);
                        var sId = col.dataSrc();
                        var row = tbl.row(this);
                        var rowData = row.data();
                        var prsCalcItems = combinePrsCalcItemsEditable(rowData.prsCalcItems);
                        if (typeof sId === 'undefined') {
                            return
                        }
                        // 数据来源是手动录入且工资状态是编辑状态时，此工资项才可编辑
                        if (prsCalcItems[sId] == "Y" && rowData.payEditStat == "1") {
                            var rst = page._BgPub_Bind_InputMoney(
                                this,
                                sId + '_Advmoney-advBgItem',
                                page.tbl_afterInputMoney_cellChange,
                                tbl.cell(this).data(),
                                sId,
                                rowData
                            );
                            $('#' + sId + '_Advmoney-advBgItem').blur(function (e) {
                                var tmpE = jQuery.Event('keyup')
                                tmpE.keyCode = 13
                                $('#' + sId + '_Advmoney-advBgItem').trigger(tmpE)
                            })
                            if (rst) {
                                $('#' + sId + '_Advmoney-advBgItem').focus()
                                $('#' + sId + '_Advmoney-advBgItem').select()
                            }
                        }
                    })
            },
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
                    //notatm 数据属性Array
                    if(notatm.indexOf(obj.data) <0 ){//数组不存在code
                        // obj.render = $.fn.dataTable.render.number(',', '.', 2, '');
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
                                return "未知";
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
                for (var i = 0; i < checks.length; i++) {
                    var code = $(checks[i]).attr("data-code");
                    newColumns.push(columns[code]);
                }
                return newColumns;
            },
            //初始化表格
            initTable: function (data) {
                var h = $(".workspace").height();
                var newH = h - 175;
                var id = "mainTable";
                page.DataTable = $('#' + id).DataTable({
                    "language": {
                        "url": bootPath + "agla-trd/datatables/datatable.default.js"
                    },
                    "data": data,
                    // "scrollX": true,
                    // "scrollY": newH,
                    "paging": false,
                    "searching": false,
                    "ordering": false,
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
                        // console.log('---initComplete---');
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
                        // console.log(toolBar);
                        var $info = $(toolBar + ' .info');
                        // console.log($info);
                        if ($info.length == 0) {
                            $info = $('<div class="info"></div>').appendTo($(toolBar + ' .tool-bar-body'));
                        }
                        $info.html('');
                        $('.' + id + '-paginate').appendTo($info);

                        //导出begin
                        $("#dtToolbar .buttons-excel").off().on('click', function (evt) {
                            evt = evt || window.event;
                            evt.preventDefault();
                            ufma.expXLSForDatatable($('#' + id), '工资编制');
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
                        // $('.dataTables_scrollBody').scroll(function () {
                        //     if (page.tableData && page.tableData.length > 0) {
                        //         if ($(this)[0].scrollHeight - $(this).scrollTop() - 30 < $(this).height()) {
                        //             if (!isGet) {
                        //                 isGet = true;
                        //                 // var tData = page.tableData.slice(page.page*100-20,page.page*100+100);
                        //                 var tData = page.tableData.slice(page.page * 100, page.page * 100 + 100);
                        //                 page.page += 1;
                        //                 page.curTableData = tData;
                        //                 if (tData.length > 0) {
                        //                     // page.DataTable.clear().draw();
                        //                     page.DataTable.rows.add(tData).draw();
                        //                     // $(this).scrollTop(0)
                        //                 }
                        //             }
                        //         }
                                // else if($(this).scrollTop() ==0){
                                //     if(!isGet) {
                                //         isGet = true;
                                //         var tData = page.tableData.slice((page.page - 1) * 100 - 20, (page.page - 1) * 100 + 100);
                                //         page.curTableData = tData;
                                //         if (tData.length > 0) {
                                //             page.DataTable.clear().draw();
                                //             page.DataTable.rows.add(tData).draw();
                                //             // $(this).scrollTop(0)
                                //         }
                                //     }
                                // }
                        //     }
                        // })
                        $("#mainTable").fixedTableHead();
                        ufma.isShow(page.reslist);
                    },
                    "drawCallback": function (settings) {
                        // isGet = false;
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
                // page.getDepartment();

            },
            //获取部门数据
            getDepartment: function () {
                ufma.get(interfaceURL.getPrsOrgTreeIsUsed,"",function(result){
                    var data = result.data;
                    var obj = {
                        id: "0",
                        code: "0",
                        codeName: "全部",
                        pId: null
                    }
                    data.push(obj);
                    page.departmentData = data;
                    console.log(data);
                    $("#departmentCode").ufmaTextboxlist({//初始化
                        valueField: 'id',//可选
                        textField: 'codeName',//可选
                        name: 'departmentCode',
                        data: data,//列表数据
                        leafRequire: true,
                        expand: true
                    });
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
            /**
             * @description 渲染可勾选的多选框
             * @param {*} datas 
             */
            renderP: function (datas) {
                $("#colList").html("");
                var pHtml = "";
                for (var i = 0; i < datas.length; i++) {
                    pHtml += '<p><label class="mt-checkbox mt-checkbox-outline" title="' + datas[i].name + '"><input type="checkbox" checked="checked" data-code="' + datas[i].code + '" data-name="' + datas[i].name + '">' + datas[i].name + '<span></span></label></p>'
                }
                $("#colList").append(pHtml);
            },
            //左侧工资类别树
            wageItemsTree: function (data) {
                var labelHtml = '<label class="rpt-check checkAll mt-checkbox mt-checkbox-outline"><input data-code="*" type="checkbox" autocomplete="off">全部<span></span></label>';
                var curitem,str1,str2,str3;
                for (var i = 0; i < data.length; i++) {
                    curitem = data[i];
                    str1 = curitem.mo?curitem.mo+'月':'';
                    str2 = curitem.payNoMo&&curitem.payNoMo!==1?'-'+curitem.payNoMo:'';
                    str3 = '('+str1+str2+')';
                    labelHtml += '<label class="rpt-check mt-checkbox mt-checkbox-outline"><input name="prType" data-code="' + curitem.prtypeCode + '" type="checkbox" autocomplete="off">' + curitem.prtypeName +str3+ '<span></span></label>'
                }
                $("#prTypes").append(labelHtml);
                $(".prTypes-hide").append(labelHtml);
                $(".prTypes-hide").width($(".prTypes-box").width());
                var w = $(".prTypes-box").width();
                var sumW = 0, labels = $("#prTypes label");
                for (var i = 0; i < labels.length; i++) {
                    sumW += $(labels[i]).width() + 10
                }
                if (w < sumW) {
                    $(".to-bottom").removeClass("hidden");
                }

            },
            //获取基础数据
            findCalcDataBase: function () {
                var argu = {
                    "flag":"CALCBZ"
                };
                ufma.showloading("正在加载数据，请耐心等待...");
                ufma.post(interfaceURL.findCalcDataBase,argu,function (result) {
                    console.log(result);
                    ufma.hideloading();
                    var data = result.data;
                    page.baseData = data;
                    page.prsTypeCosData = data.topMessage.prsTypeCos;//筛选条件
                    page.orgTreeData = data.topMessage.orgTree;//部门？
                    page.renderSeletableColumns(data.moveItem);//渲染表头
                    page.wageItemsTree(data.topMessage.prsTypeCos);//渲染筛选条件
                    //page.getJobRank(data.topMessage.prsDutyGradeDataCos);//查询条件 职位级别
                    page.getPayEditStat(data.topMessage.prsVals);//查询条件 工资状态
                    // page.getDepartment(data.topMessage.orgTree);//查询条件 部门
                    page.tableDraw(data.prsCalcDatas);//渲染表格
                })

            },
            //查询到表格数据后重绘表格
            tableDraw:function(data){
                page.desTroyTable();//销毁
                page.tableData = data;
                // var tData = data;
                // page.curTableData = tData;
                // page.page = 1;//页码
                page.initTable(data);//表格数据更新
            },
            /*
            * 获取选择的工资类别
            * 
            * return Array
            */
            selPrtypeCodes: function () {
                var inputChecks = $("input[name=prType]:checked");
                var prtypeCodes = [];
                for (var i = 0; i < inputChecks.length; i++) {
                    prtypeCodes.push($(inputChecks[i]).attr("data-code"));
                }
                return prtypeCodes;
            },
            selPrtypeCodesName: function () {
                var inputChecks = $("input[name=prType]:checked");
                var names = [];
                for (var i = 0; i < inputChecks.length; i++) {
                	names.push($(inputChecks[i]).closest("label").text());
                }
                return names;
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
                // $(".prTypes-hide").slideUp();
                var argu = {
                    payEditStat: $("#payEditStat").getObj().getValue() == "*"?"":$("#payEditStat").getObj().getValue(),
                    //dutyGrade: $("#jobRank").getObj().getValue(),
                    // orgCodes: $("#departmentCode").getObj().getValue() ? $("#departmentCode").getObj().getValue().split(",") : [],
                    orgCodes: $("#departmentCode").ufmaTextboxlist().getValue() ? $("#departmentCode").ufmaTextboxlist().getValue().split(",") : [],
                    prtypeCodes: page.selPrtypeCodes(),
                    empNames : $("#empName").val(),
                    flag:"CALCBZ"
                };
                ufma.showloading("正在加载数据请耐心等待...");
                ufma.post(interfaceURL.findCalcDatas, argu, function (result) {
                    console.log(result);
                    ufma.hideloading();
                    page.searchDatas = result.data;
                    page.renderSeletableColumns(result.data.moveItem);
                    page.tableDraw(result.data.prsCalcDatas)
                })
            },
            //初始化可选列
            initSelColumns: function () {
                page.columns =fixcolData.cols;
                page.renderP(page.columns);
            },
            openSelEmp:function(){
                $("#openSelEmp").trigger("click");
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                // $(".prTypes-hide").slideUp();
                //初始化可选列
                page.initSelColumns();
                //初始化表格
                page.initTable([]);
                //初始化工资状态
                page.initPayEditStat();
                //获取部门数据
                page.getDepartment();
                //初始职务等级
                //page.initJobRank();
                //获取基础数据
                page.findCalcDataBase();
                // $(window).resize(function () {
                //     $("#tool-bar").find(".slider").width($(".prs-workspace").width() - 252);
                //     $("#tool-bar").width($(".prs-workspace").width() - 224);
                // });
                //表格添加事件监听
                page.addListenerToMainTable()
                //
                if(localStorage.getItem("prsBzTreeData")){
                    localStorage.removeItem("prsBzTreeData");
                }
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
                    $("#departmentCode").ufmaTextboxlist().val('');
                    $("#payEditStat").getObj().clear();
                    $("#empName").val('')
                    //$("#jobRank").getObj().clear()
                })
                //选择显示的列
                $("#colAction").on("click", function () {
                    $(this).next(".rpt-funnelBoxList").toggleClass("hidden");
                });
                $("#addCol").on("click", function () {
                    var checks = $("#colList input");
                    var checksArr = [];
                    for (var i = 0; i < checks.length; i++) {
                        var column = page.DataTable.column(i+1);
                        if($(checks[i]).prop("checked")){
                            column.visible(true, false);
                        }else{
                            column.visible(false, false);
                        }

                        // var code = $(checks[i]).attr("data-code");
                        // checksArr.push(code);
                    }
                    page.DataTable.columns.adjust().draw( false )
                    // var tData = page.DataTable.data();
                    // var data = [];
                    // for (var i = 0; i < tData.length; i++) {
                    //     if (i >= 100) {
                    //         break
                    //     } else {
                    //         data.push(tData[i])
                    //     }
                    // }
                    $(this).closest(".rpt-funnelBoxList").addClass("hidden");
                    // page.desTroyTable();
                    // page.page = 1;
                    // isGet = false;
                });
                $("#btnQuery").on("click", function () {
                    $(this).next(".rpt-funnelBoxList").toggleClass("hidden");
                });
                $('#btn-getdata').on('click',function(){
                    ufma.open({
                        url: '../../dateModal/dateModal.html',
                        title: '请选择数据提取的时间范围',
                        width: 520,
                        height: 350,
                        data: {},
                        ondestory: function(action) {
                            console.log(action);
                            if(!action.action){
                                return ;
                            }
                            var argu = {
                                searchStart: action.action.dateStart,
                                searchEnd: action.action.dateEnd,
                            };
                            var nodes = page.selPrtypeCodes();
                            if(nodes.length == 0){
                                nodes = page.allPrtypeCodes();
                            }
                            var empUid = {};
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i] != "*") {
                                    var empuids = [];
                                    for (var y = 0; y < page.tableData.length; y++) {
                                        if(page.tableData[y].prtypeCode == nodes[i]){
                                            empuids.push(page.tableData[y].empUid)
                                        }

                                    }
                                    if(empuids.length > 0){
                                        empUid[nodes[i]] = empuids.join(",")
                                    }

                                }
                            }
                            argu.empUid = empUid;
                            console.log(empUid);
                            ufma.ajax('/prs/prscalcdata/externalSystemData','post',argu,function(result){
                                console.log(result);
                            })
                        }
                    });
                })
                //计算
                $("#btn-calc").on("click", function () {
                    var argu = {};
                    var nodes = page.selPrtypeCodes();
                    if(nodes.length == 0){
                        nodes = page.allPrtypeCodes();
                    }

                    for (var i = 0; i < nodes.length; i++) {
                        if (nodes[i] != "*") {
                            var empuids = [];
                            for (var y = 0; y < page.tableData.length; y++) {
                                if(page.tableData[y].prtypeCode == nodes[i]){
                                    empuids.push(page.tableData[y].empUid)
                                }

                            }
                            if(empuids.length > 0){
                                argu[nodes[i]] = empuids.join(",")
                            }

                        }
                    }
                    //CWYXM-8726 先保存再计算
                    var saveArgu = {
                        prsCalcDatas: newCellsData
                    };
                    $("button").attr("disabled", true);
                    ufma.showloading("正在加载数据，请耐心等待...");
                    ufma.post(interfaceURL.updateCalcDatasItem, saveArgu, function (result) {
                        newCellsData = [];
                        if(result.flag==='success'){
                            ufma.post(interfaceURL.calcPrsCalcData, argu, function (result) {
                              ufma.hideloading();
                              $("button").attr("disabled", false);
                              ufma.showTip(result.msg, function () {
    
                              }, result.flag);
                              page.getSearchData()
                            });
                        }else{
                            ufma.showTip(result.msg, function () {

                            }, result.flag);
                        }
                    });
                    var timeId = setTimeout(function () {
                        $("button").attr("disabled", false);
                        clearTimeout(timeId)
                    }, "5000")
                });
                //提交
                $("#btn-commit").on("click", function () {
                    //判断是否经过了修改
                    if (newCellsData.length>0) {
                        ufma.showTip("存在未经计算的数据，请重新计算后再提交", function () {
                            return false;
                        }, "warning");
                        return false;
                    }
                    //记得判断左侧勾选的树的状态
                     var nodes = page.tableData;
                     var tip = false;
                     for (var i = 0; i < nodes.length; i++) {
                         if (nodes[i].payEditStat != "1") {
                             tip = true;
                             break;
                         }
                     }
                     if (tip) {
                         ufma.showTip("列表中有处于非编辑状态的数据，无法提交！", function () {
                             return false;
                         }, "warning");
                         return false;
                     }
                     
                     for (var i = 0; i < nodes.length; i++) {
                         if (nodes[i].calcStat != "Y") {
                             tip = true;
                             break;
                         }
                     }
                     if (tip) {
                         ufma.showTip("列表中有未计算的数据，无法提交！", function () {
                             return false;
                         }, "warning");
                         return false;
                     }

                    ufma.confirm('您确定提交吗？', function (action) {
                        if (action) {
                            //点击确定的回调函数
                            var argu = {
                                payEditStat: "2",
                                prtypeCodes: page.selPrtypeCodes(),
                                flag:"CALCBZ"
                            };
                            $("button").attr("disabled", true);
                            ufma.showloading("正在加载数据请耐心等待...");
                            ufma.post(interfaceURL.updateCalcDatas, argu, function (result) {
                                $("button").attr("disabled", false);
                                ufma.hideloading();
                                ufma.showTip(result.msg, function () {
                                }, result.flag)
                                page.getSearchData();
                            });
                            var timeId = setTimeout(function () {
                                clearTimeout(timeId);
                                $("button").attr("disabled", false);
                            }, "5000")
                        } else {
                            //点击取消的回调函数
                        }
                    }, {type: 'warning'});

                });
                //替换
                $("#btn-replace").on("click", function () {
                    var prtypeCodes = page.selPrtypeCodes();
                    if(prtypeCodes.length > 1 || prtypeCodes.length == 0){
                        ufma.showTip("请选择一种工资类别",function(){},"warning");
                        return false
                    }
                    var prtyNames = page.selPrtypeCodesName();
                    var argu = {
                        flag:"CALCBZ",
                        prtypeCodes:prtypeCodes
                    }
                    ufma.post(interfaceURL.checkPayEditState,argu,function(result){
                        toReplace()
                    })
                    function toReplace(){
                        var openData = {
                            prtypeCodes: prtypeCodes,
                            searchDatas:page.searchDatas,
                            baseData:page.baseData,
                            prsTypeCos:page.prsTypeCosData,
                            orgTreeData:page.orgTreeData,
                            openSelEmp:page.openSelEmp,
                            prtyNames : prtyNames
                        };
                        page.replaceHtml = ufma.open({
                            url: 'wageReplace.html',
                            title: "工资数据替换",
                            width: 1090,
                            //height:500,
                            data: openData,
                            ondestory: function (data) {
                                //窗口关闭时回传的值
                                localStorage.removeItem("prsBzTreeData");
                                if (data.action) {
                                    if(data.action.action == "save"){
                                        page.getSearchData();
                                    }
                                    
                                }
                            }
                        });
                    }
                    
                });
                //导入Excel工资数据
                $("#btn-import").on("click", function () {
                    var nodes = page.selPrtypeCodes();
                    if(nodes.length == 0){
                        ufma.showTip("请选择一个工资类别","","warning")
                        return false
                    }
                    if(nodes.length > 1){
                        ufma.showTip("只能对单个工资类别进行操作，请重新选择","","warning")
                        return false
                    }
                    var argu = {
                        flag:"CALCBZ",
                        prtypeCodes:nodes
                    }
                    ufma.post(interfaceURL.checkPayEditState,argu,function(result){
                        toImport()
                    })
                    
                    function toImport(){
                        var openData = {
                            typeCode:$("input[name=prType]:checked").attr("data-code")
                        };
                        ufma.open({
                            url: 'excelImport.html',
                            title: "选择工资数据导入格式",
                            width: 1090,
                            //height:500,
                            data: openData,
                            ondestory: function (data) {
                                //窗口关闭时回传的值
                                if (data) {
                                    page.getSearchData();
                                }
                            }
                        });
                    }
                    
                });
                //修改
                $(document).on("click", "a.edit-row-data", function (e) {
                    stopPropagation(e);

                    var id = $(this).attr("data-id");
                    var rowId = $(this).attr("row-id");
                    var openData = {
                        id: id,
                        rowId: rowId,
                        mainTableData: page.tableData,
                        combinePrsCalcItems: combinePrsCalcItemsEditable
                    };
                    ufma.open({
                        url: 'wageDetail.html',
                        title: "记录明细",
                        width: 800,
                        //height:500,
                        data: openData,
                        ondestory: function (data) {
                            //窗口关闭时回传的值
                            if(data.action && data.action.action == "save"){
                                ufma.showTip(data.action.msg,"",data.action.flag)
                                page.getSearchData();
                            }
                        }
                    });
                });
                //保存
                $("#btn-save").on("click", function () {
                    newCellsData.forEach(item =>{
                        item.calcStat = 'N'
                    })
                    var argu = {
                        prsCalcDatas: newCellsData,

                    };
                    $("button").attr("disabled", true);
                    ufma.showloading("正在加载数据，请耐心等待...");
                    ufma.post(interfaceURL.updateCalcDatasItem, argu, function (result) {
                        newCellsData = [];
                        ufma.hideloading();
                        $("button").attr("disabled", false);
                        ufma.showTip(result.msg, function () {
                        }, result.flag)
                    });
                    var timeId = setTimeout(function () {
                        clearTimeout(timeId);
                        $("button").attr("disabled", false);
                    }, "5000")
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
                    if($(this).prop("checked")){
                        $("#prTypes label").eq(index).find("input[name=prType]").prop("checked",true);
                    }else{
                        $("#prTypes label").eq(index).find("input[name=prType]").prop("checked", false);
                    }
                    if (checks.length == inputs.length) {
                        $(".checkAll").find("input").prop("checked", true)
                    } else {
                        $(".checkAll").find("input").prop("checked", false)
                    }
                    page.getSearchData();
                })
                //打开选择人员弹窗
                $("#openSelEmp").on("click",function(){
                    ufma.open({
                        url: 'selEmp.html',
                        title: "选择人员",
                        width: 1090,
                        //height:500,
                        // data: openData,
                        ondestory: function (data) {
                            //窗口关闭时回传的值
                            if (data.action) {
                                page.replaceHtml.setData(data.action);
                            }
                        }
                    });
    
                });
                // 点击空白处，设置的弹框消失
                $(document).bind("click", function (e) {
                    var div2 = $("#prTypes")[0];
                    var div3 = $(".prTypes-hide")[0];
                    var div4 = $(".to-bottom")[0];
                });
                // $("#prTypes").on("mouseover", function () {
                //     $(".prTypes-hide").slideDown();
                // })
                $(".to-top").on("click", function () {
                    $(".prTypes-hide").slideUp();
                })
                $(".to-bottom").on("click", function () {
                    $(".prTypes-hide").slideDown();
                })
                
                $("input[name='ck']").on("click", function () {
                	if ($(this).val() == '0') {
                		$("#colList").find("input[type='checkbox']").prop("checked",true);
                	} else {
                		$("#colList").find("input[type='checkbox']").prop("checked",false);
                		var checks = $("#colList input");
                		var tbl = $('#mainTable').DataTable();
                        var col = tbl.column(this);
                        var row = tbl.row(0);
                        var rowData = row.data();
                        var prsCalcItems = [];
                        if (!$.isNull(rowData)) {
                        	prsCalcItems = combinePrsCalcItemsEditable(rowData.prsCalcItems);
                        }
                        for (var i = 0; i < checks.length; i++) {
                            var code = $(checks[i]).attr("data-code");
                            if (typeof code === 'undefined') {
                                continue;
                            }
                            // 数据来源是手动录入
                            if (prsCalcItems != [] && prsCalcItems[code] == "Y") {
                            	$(checks[i]).prop("checked",true);
                            }
                            if (notatm.indexOf(code) >= 0) {
                            	$(checks[i]).prop("checked",true);
                            }
                        }
                	}
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
});
/**
 * @description 编辑状态
 * @param {Array} data 
 */
function combinePrsCalcItemsEditable(data) {
    var result = {};
    for (var i = 0; i < data.length; i++) {
        var code = prs.strTransform(data[i].pritemCode);
        result[code] = data[i].isEditable;
    }
    return result;
}
/**
 * @description 颜色
 * @param {Array} data 
 */
function combinePrsCalcItems(data) {
    var result = {};
    for (var i = 0; i < data.length; i++) {
        var code = prs.strTransform(data[i].pritemCode);//字符串下滑线转驼峰
        result[code] = data[i].color;
    }
    return result;
}
/**
 * @description 高亮
 * @param {Array} data 
 */
function combinePrsCalcItemsLight(data) {
    var result = [];
    for (var i = 0; i < data.length; i++) {
        var code = prs.strTransform(data[i].pritemCode);//字符串下滑线转驼峰
        result[code] = data[i].isHighLight;
    }
    return result;
}
