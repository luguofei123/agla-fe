$(function () {
    //open弹窗的关闭方法
    window._close = function (action) {
        if (window.closeOwner) {
            var data = {action: action};
            window.closeOwner(data);
        }
    };
    var svData = ufma.getCommonData();
    var ownerData = window.ownerData;

    //接口URL集合
    var interfaceURL = {
        save: "/prs/sys/prsExcelStyle/save",//保存
        getPrsItemList: "/prs/prsitem/getPrsItemList",//查询系统工资项目列表
        searchPrsExcelStyleDetail:"/prs/sys/prsExcelStyle/searchPrsExcelStyleDetail",//系统级基础资料工资导入格式明细查询
    };
    if(ownerData.isAgency){
        interfaceURL.save = "/prs/base/prsExcelStyleCo/save";//单位级保存
        interfaceURL.getPrsItemList = "/prs/prsitemco/getPrsItemCoList";//查询单位工资项目列表
        interfaceURL.searchPrsExcelStyleDetail = "/prs/base/prsExcelStyleCo/searchPrsExcelStyleCoDetail";//单位级基础资料工资导入格式明细查询
        interfaceURL.exportBankTemplateFile = "/prs/sys/prsExcelStyle/exportBankTemplateFile";//单位级导出模板
    }
    var pageLength = 25;
    function download(filename, text) {
  	  var element = document.createElement('a');
  	  element.setAttribute('href', filename);
  	  element.setAttribute('download', text);

  	  element.style.display = 'none';
  	  document.body.appendChild(element);

  	  element.click();

  	  document.body.removeChild(element);
  	}
    var page = function () {
        return {
            //表格列
            recombineColumns: function () {
                var columns = [
                    [ // 支持多表头
                        {
                            type: 'indexcolumn',
                            field: 'ordSeq',
                            width: 40,
                            name: '序号',
                            headalign: 'center',
                            align: 'left',
                            render: function (rowid, rowdata, data) {
                                return data;
                            }
                            // onKeyup: function (e) {
                            //
                            // }
                        },
                        // {
                        //     type: 'input',
                        //     field: 'seq',
                        //     width: 40,
                        //     name: '行序号',
                        //     headalign: 'center',
                        //     align: 'left',
                        //     onKeyup: function (e) {
                        //         if (e.data !== "") {
                        //             var newData = e.data.replace(/[^\d+-]/g,'');
                        //             $("#nameTable2inputseqRow").val(newData);
                        //         }

                        //     }
                        // },
                        {
                            type: 'combox',
                            field: 'itemcode',
                            name: '工资项代码',
                            width: 200,
                            headalign: 'center',
                            align: 'left',
                            idField: 'itemcode',
                            textField: 'itemname',
                            pIdField: '',
                            data: page.prsItemList,
                            render: function (rowid, rowdata, data) {
                                if (!data) {
                                    return "";
                                }
                                return rowdata.itemname;
                            },
                            onChange: function (e, data) {
                            },
                            beforeExpand: function (e) { //下拉框初始化
                                // $(e.sender).getObj().load(src.itemTypeData);
                            }
                        },
                        {
                            type: 'input',
                            field: 'columnname',
                            width: 200,
                            name: '列名',
                            headalign: 'center',
                            align: 'left',
							onKeyDown:function(e, event){
								if(event.keyCode == 229 || event.keyCode == 0) {
									event.preventDefault();
									event.preventDefault();
									ufma.showTip('请使用英文输入法')
									e.sender.blur()
									event.returnValue = false;
								}
							},
                            onKeyup: function (e) {
                                if (e.data !== "") {
                                    var newArr = [];
                                    for (var i = 0; i < e.data.length; i++) {
                                        if (!/[A-Z]/.test(e.data[i])) {
                                            if (/[a-z]/.test(e.data[i])) {
                                                newArr.push(e.data[i].toUpperCase());
                                            } else {
                                                newArr.push("");
                                            }
                                        } else {
                                            newArr.push(e.data[i]);
                                        }
                                    }
                                    e.sender.val(newArr.join(''));
                                }

                            }
                        },
                        // {
                        //     type: 'input',
                        //     field: 'columnindex',
                        //     width: 200,
                        //     name: '列序号',
                        //     headalign: 'center',
                        //     align: 'left',
                        //     onKeyup: function (e) {
                        //         if (e.data !== "") {
                        //             var newData = e.data.replace(/[^\d+-]/g,'');
                        //             $("#nameTable2inputseqColumn").val(newData);
                        //         }

                        //     }
                        // },
                        {
                            type: "toolbar",
                            field: 'remark',
                            width: 140,
                            name: '操作',
                            align: 'center',
                            headalign: 'center',
                            // render: function (rowid, rowdata, data) {
                            //     return'<a class="to-del btn btn-icon-only btn-delete" data-toggle="tooltip" action= "" title="删除">' +
                            //         '<span class="glyphicon icon-trash"></span></a>'
                            // }
                            render: function (rowid, rowdata, data) {
								return '<a class="to-del btn btn-icon-only btn-delete" rowid="' + rowid + '" conid="' + rowdata + '"><span class="icon icon-trash"></span></a>';
							}
                        }
                    ]
                ];
                return columns;
            },
            //渲染表格
            showTable:function(tableData){
                page.tableObjData = tableData;
                var id = "nameTable2";
                $('#' + id).ufDatagrid({
                    data: tableData,
                    disabled: false, // 可选择
                    // frozenStartColumn: 1, //冻结开始列,从1开始
                    // frozenEndColumn: 1, //冻结结束列
                    columns: page.recombineColumns(),
                    initComplete: function (options, data) {
                        //去掉谷歌表单自带的下拉提示
                        // $(document).on("focus","input",function () {
                        //     $(this).attr("autocomplete", "off");
                        // });

                    }
                });
            },
            //初始化匹配类型
            initMatchitem: function () {
                var data=[
                    {code:"1",name:"姓名"},
                    {code:"2",name:"人员编号"},
                    {code:"3",name:"身份证号"}
                ];
                $("#matchitem").ufCombox({
                    idField: "code",
                    textField: "name",
                    data: data, //json 数据
                    placeholder: "请选择匹配类型",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
                $("#doublematchitem").ufCombox({
                    idField: "code",
                    textField: "name",
                    data: data, //json 数据
                    placeholder: "请选择二级匹配要素",
                    onChange: function (sender, data) {
                    },
                    onComplete: function (sender) {
                        // $("input").attr("autocomplete", "off");
                    }
                });
            },
            //获取工资项代码数据
            getPrsItemList:function(){
                var argu = {};
                ufma.post(interfaceURL.getPrsItemList,argu,function (result) {
                    page.prsItemList = [];
                    for(var i=0;i<result.data.length;i++){
                        var obj = {itemcode:result.data[i].pritemCode,itemname:result.data[i].pritemName};
                        page.prsItemList.push(obj);
                    }

                    if(ownerData.isAgency){
                        page.getTableDataAgency();
                    }else{
                        page.getTableData();
                    }

                });
            },
            //获取tableDatas
            getTableData:function(){
                if(ownerData.action == "edit"){
                    var argu = {
                        rgCode: svData.svRgCode,
                        setYear:svData.svSetYear,
                        ids:[ownerData.ids]
                    };
                    ufma.showloading("正在加载数据，请耐心等待...");
                    ufma.post(interfaceURL.searchPrsExcelStyleDetail,argu,function (result) {
                        ufma.hideloading();
                        page.showTable(result.data[0].prsExcelStyleColumnList);
                        page.setValue(result.data[0]);
                        page.wagelData = result.data[0]
                    });
                }else{
                    page.showTable([]);
                }
            },
            //获取单位级tableData
            getTableDataAgency:function(){
                if(ownerData.action == "edit"){
                    var argu = {
                        rgCode: svData.svRgCode,
                        setYear:svData.svSetYear,
                        id:ownerData.ids,
                        agencyCode:svData.svAgencyCode
                    };
                    ufma.showloading("正在加载数据，请耐心等待...");
                    ufma.post(interfaceURL.searchPrsExcelStyleDetail,argu,function (result) {
                        ufma.hideloading();
                        page.showTable(result.data.prsExcelStyleColumnCoList);
                        page.setValue(result.data);
                        page.wagelData = result.data
                    });
                }else{
                    page.showTable([]);
                }
            },
            changeMatchItem:function(item){
                if(item == "姓名"){
                    item = "name"
                }else if(item == "人员编号"){
                    item = "employeeCode"
                }else if(item == "身份证号"){
                    item = "card"
                }
                return item;
            },
            //修改set值
            setValue: function (data) {
                // data.matchitem = page.changeMatchItem(data.matchitem);
                // data.doublematchitem = page.changeMatchItem(data.doublematchitem);
                $('#frmQuery').setForm(data);
            },
            initPage: function () {
                //权限控制
                page.reslist = ufma.getPermission();
                ufma.isShow(page.reslist);
                if(!ownerData.isAgency){
                    $("#btn-import").addClass("hidden")
                    $("#btn-export").addClass("hidden")
                }
                //初始化表格
                page.initMatchitem();
                page.getPrsItemList();
            },
            onEventListener: function () {
                //选择SQL语句引用值集界面变化
                $('input[name="sqlValue"]').on("change", function () {
                    if ($(this).prop("checked")) {
                        $("#sqlValueCodes").attr("disabled", false);
                        $(".manual-opt").attr("disabled", true);
                        $(".btn-preview").attr("disabled", false);
                    } else {
                        $("#sqlValueCodes").attr("disabled", true);
                        $(".manual-opt").attr("disabled", false);
                        $(".btn-preview").attr("disabled", true);
                    }
                });
                //关闭
                $("#btn-close").on("click", function () {
                    _close();
                });
                //确定
                $("#btn-sure").on("click", function () {
                    var argu = $('#frmQuery').serializeObject();
                    //校验

                    if (argu.name == "") {
                        ufma.showTip("请填写格式名称", function () {

                        }, "warning");
                        return false
                    }else if (argu.matchitem == "") {
                        ufma.showTip("请填写匹配类型", function () {

                        }, "warning");
                        return false
                    } else if (argu.matchcolumnindex == "") {
                        ufma.showTip("请填写匹配序列号", function () {

                        }, "warning");
                        return false
                    }else if (argu.datarowindex == "") {
                        ufma.showTip("请填写导入开始行", function () {

                        }, "warning");
                        return false
                    }else if (argu.sheetid == "") {
                        ufma.showTip("请填写页签号", function () {

                        }, "warning");
                        return false
                    }
                    argu.matchitem = $("#matchitem").getObj().getValue();
                    var tableDatas  = $("#nameTable2").getObj().getData();
                    var tableList = [];
                    for(var i=0;i<tableDatas.length;i++){
                        var obj = {
                            columnindex: '',
                            columnname: tableDatas[i].columnname,
                            id: "",
                            itemcode: tableDatas[i].itemcode,
                            setYear:svData.svSetYear,
                            rgCode:svData.svRgCode,
                            // seq: tableDatas[i].seq,
                        };
                        if(ownerData.action == "edit"){
                            obj.id = ownerData.ids;
                        }
                        if(ownerData.isAgency){
                            //单位级
                            obj.agencyCode = svData.svAgencyCode
                        }
                        tableList.push(obj);
                    }
                    argu.setYear = svData.svSetYear;
                    argu.rgCode = svData.svRgCode;
                    argu.columntype = "";
                    argu.id = "";
                    if(ownerData.action == "edit"){
                        //修改
                        argu.id = ownerData.ids;
                    }
                    argu.prsExcelStyleColumnList = tableList;
                    if(ownerData.isAgency){
                        //单位级
                        argu.agencyCode = svData.svAgencyCode;
                        argu.prsExcelStyleColumnCoList = tableList;
                        delete argu.prsExcelStyleColumnList;
                    }
                    $("button").attr("disabled",true);
                    ufma.showloading("正在加载数据，请耐心等待...");
                    ufma.post(interfaceURL.save,argu,function (result) {
                        ufma.hideloading("正在加载数据，请耐心等待...");
                        var closeData = {
                            action:"save",
                            msg:result.msg,
                            flag:result.flag
                        }
                        _close(closeData);

                    })
                    var timeId = setTimeout(function () {
                        clearTimeout(timeId);
                        $("button").attr("disabled",false);
                    },"5000")
                });
                // 导入模板
                $("#btn-import").on("click", function () {
                    $("#import-files").click();
                })
                // 当表单文件有变化时执行提交动作
                $('#import-files').on('change', function(){
                    var files = $(this)[0].files;
                    var fileName = files[0].name
                    var ext = fileName.slice(fileName.lastIndexOf(".")+1).toLowerCase();
                    if ("xls" != ext&&"xlsx"!= ext) {
                        alert("只能上传Excel文件");
                        return false;
                    }
                    var formData = new FormData()
                    formData.append("excel_file", files[0]);
                    formData.append("agencyCode", page.wagelData.agencyCode);
                    formData.append("setYear", svData.svSetYear);
                    formData.append("rgCode", svData.svRgCode);
                    ufma.showloading()
                    $.ajax({
                        url: '/prs/base/prsExcelStyleCo/importPrsExcelStyleCoDetail',
                        type: 'POST',
                        data: formData,
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function(res){
                            ufma.hideloading()
                            if(res.flag === 'success'){
                                page.showTable(res.data.resultList);
                                if(!page.wagelData){ page.wagelData = {} }
                                page.wagelData.prsExcelStyleColumnCoList = res.data.resultList
                                if (res.data.errNameMsg) {
                                    ufma.showTip(res.flag.data.errNameMsg, function(){},'error')
                                }
                            }else{
                                ufma.showTip(res.msg, function(){},'error')
                            }
                            var obj = document.getElementById('import-files');
                            obj.value = ''
                        },
                        error: function(error){
                            console.log(error)
                            ufma.hideloading()
                            var obj = document.getElementById('import-files');
                            obj.value = ''
                        }
                    })

                });
                $("#btn-export").on("click", function () {
                    var argu = $('#frmQuery').serializeObject();
                    if (argu.name == "") {
                        ufma.showTip("请填写格式名称", function () {

                        }, "warning");
                        return false
                    }else if (argu.matchitem == "") {
                        ufma.showTip("请填写匹配类型", function () {

                        }, "warning");
                        return false
                    } else if (argu.matchcolumnindex == "") {
                        ufma.showTip("请填写匹配序列号", function () {

                        }, "warning");
                        return false
                    }else if (argu.datarowindex == "") {
                        ufma.showTip("请填写导入开始行", function () {

                        }, "warning");
                        return false
                    }else if (argu.sheetid == "") {
                        ufma.showTip("请填写页签号", function () {

                        }, "warning");
                        return false
                    }
                    argu.matchitem = $("#matchitem").getObj().getValue();
                    var tableDatas  = $("#nameTable2").getObj().getData();
                    var tableList = [];
                    for(var i=0;i<tableDatas.length;i++){
                        var obj = {
                            columnindex: '',
                            columnname: tableDatas[i].columnname,
                            id: "",
                            itemcode: tableDatas[i].itemcode,
                            setYear:svData.svSetYear,
                            rgCode:svData.svRgCode,
                            itemname: tableDatas[i].itemname,
                        };
                        if(ownerData.action == "edit"){
                            obj.id = ownerData.ids;
                        }
                        tableList.push(obj);
                    }
                    argu.setYear = svData.svSetYear;
                    argu.rgCode = svData.svRgCode;
                    argu.columntype = "";
                    argu.id = "";
                    argu.agencyName = svData.svAgencyName;
                    if(ownerData.action == "edit"){
                        //修改
                        argu.id = ownerData.ids;
                    }
                    argu.prsExcelStyleColumnList = tableList;
    				ufma.post(interfaceURL.exportBankTemplateFile, argu, function (result) {
                    	window.location.href = '/pub/file/download?fileName=' + result.data.fileName + '&attachGuid=' + result.data.attachGuid;
    				});
                });
                //增行
                $(document).on("mousedown", ".btn-add-row", function () {
                    var rowdata = {};
                    var obj = $('#nameTable2').getObj();
                    obj.add(rowdata);
                    // ufma.isShow(page.reslist);
                });
                //删行
                $(document).on("mousedown", "a.btn-delete", function () {
                    $(document).trigger("mousedown");
                    var rowid = $(this).parents("tr").attr("id");
                    var rowindex = $(this).parents("tr").index();
                    // tgDetaildatahq.splice(rowindex, 1)
                    var obj = $('#nameTable2').getObj();
                    obj.del(rowid)
                    var data = obj.getData();
                    obj.load(data);
                });
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
